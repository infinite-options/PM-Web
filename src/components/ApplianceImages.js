import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Plus from "../icons/Plus.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";
import Heart from "../icons/Heart.svg";
import HeartOutline from "../icons/HeartOutline.svg";
import {
  tileImg,
  xSmall,
  bold,
  mediumBold,
  red,
  small,
  hidden,
  semiMediumBold,
} from "../utils/styles";

function ApplianceImages(props) {
  const [imageState, setImageState] = props.state;
  const [errorMessage, setErrorMessage] = useState("");
  const readImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      file.image = e.target.result;
      const newImageState = [...imageState];
      newImageState.push(file);
      setImageState(newImageState);
    };
    reader.readAsDataURL(file.file);
  };

  const addFile = (e) => {
    const file = {
      index: imageState.length,
      file: e.target.files[0],
      image: null,
      coverPhoto: imageState.length === 0,
    };
    let isLarge = file.file.size > 5000000;
    let file_size = (file.file.size / 1000000).toFixed(1);
    if (isLarge) {
      // console.log("set error message");
      setErrorMessage(`Your file size is too large (${file_size} MB)`);
      return;
    } else {
      setErrorMessage("");
    }
    readImage(file);
  };

  const deleteImage = (image) => {
    const newImageState = imageState.filter(
      (file) => file.index !== image.index
    );
    if (image.coverPhoto && newImageState.length > 0) {
      newImageState[0].coverPhoto = true;
    }
    setImageState(newImageState);
  };

  const favoriteImage = (favoriteFile) => {
    const newImageState = [...imageState];
    for (const file of newImageState) {
      file.coverPhoto = file.index === favoriteFile.index;
    }
    setImageState(newImageState);
  };

  return (
    <Container>
      <p style={semiMediumBold}>Upload Photos</p>
      <p style={{ ...xSmall, ...bold }} className="my-1">
        File size under 5MB
      </p>
      <div className="d-flex overflow-auto mb-3">
        {imageState.map((file, i) => (
          <div
            className="mx-2"
            style={{
              position: "relative",
              minHeight: "50px",
              minWidth: "50px",
              height: "50px",
              width: "50px",
            }}
            key={i}
          >
            {file.file === null ? (
              <img
                alt="default"
                key={Date.now()}
                src={`${file.image}?${Date.now()}`}
                style={{ ...tileImg, objectFit: "cover" }}
              />
            ) : (
              <img
                alt="appliance"
                key={Date.now()}
                src={file.image}
                style={{ ...tileImg, objectFit: "cover" }}
              />
            )}
            <img
              src={DeleteIcon}
              alt="Delete Icon"
              onClick={() => deleteImage(file)}
              style={{ position: "absolute", left: "5px", top: "5px" }}
            />
            <img
              src={file.coverPhoto ? Heart : HeartOutline}
              alt="Favorite"
              style={{ position: "absolute", right: "5px", top: "5px" }}
              onClick={() => favoriteImage(file)}
            />
          </div>
        ))}
        <input
          id="file"
          type="file"
          accept="image/*"
          onChange={addFile}
          className="d-none"
        />
        <div className="mx-2" style={{ minHeight: "50px", minWidth: "50px" }}>
          <label
            htmlFor="file"
            style={tileImg}
            className="d-flex justify-content-center align-items-center"
          >
            <img alt="add" src={Plus} />
          </label>
        </div>
      </div>
      <p style={{ ...xSmall, ...bold }} className="my-1">
        <img alt="heart to make favorite" src={Heart} className="me-1" />a
        picture to make it the cover picture for this property
      </p>
      <div className="text-center" style={errorMessage === "" ? hidden : {}}>
        <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
      </div>
    </Container>
  );
}

export default ApplianceImages;
