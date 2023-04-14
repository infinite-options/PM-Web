import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Form, Button } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppContext from "../AppContext";
import EditIcon from "../icons/EditIcon.svg";
import File from "../icons/File.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";
import Heart from "../icons/Heart.svg";
import HeartOutline from "../icons/HeartOutline.svg";
import Plus from "../icons/Plus.svg";
import { get, put } from "../utils/api";
import { squareForm, smallPillButton, tileImg } from "../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "2px 2px",
      border: "0.5px solid grey ",
      // wordBreak: "break-word",
    },
    // width: "100%",
    // tableLayout: "fixed",
  },
});
function ApplianceImages(props) {
  const context = useContext(AppContext);
  const classes = useStyles();

  const { userData, refresh } = context;
  const { access_token, user } = userData;
  const navigate = useNavigate();

  const { addDoc, setAddDoc, files, setFiles, endpoint, id } = props;

  const [newFile, setNewFile] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);

  const readImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      file.image = e.target.result;
    };
    reader.readAsDataURL(file.file);
  }; // ============================= <File addition/Updation>============================================================
  const addFile = (e) => {
    const file = e.target.files[0];
    const newFile = {
      index: files.length,
      name: file.name,
      description: "",
      file: file,
      shared: false,
      type: file.type,
      created_date: new Date().toISOString().split("T")[0],
      image: null,
      coverPhoto:
        file.type !== "application/pdf" && files.length === 0 ? true : false,
    };
    setNewFile(newFile);
    if (file.type !== "application/pdf") {
      readImage(newFile);
    }
    // console.log(newFile);
  };
  const updateNewFile = (field, value) => {
    const newFileCopy = { ...newFile };
    newFileCopy[field] = value;
    setNewFile(newFileCopy);
  };
  const cancelEdit = () => {
    setNewFile(null);
    if (editingDoc !== null) {
      const newFiles = [...files];
      newFiles.push(editingDoc);
      setFiles(newFiles);
    }
    setEditingDoc(null);
  };

  //   save document
  const saveNewFile = async (e) => {
    const newFiles = [...files];

    newFiles.push(newFile);
    setFiles(newFiles);
    // console.log(newFiles);
    setAddDoc(!addDoc);
    setNewFile(null);
  };
  const deleteImage = (image) => {
    const newImageState = files.filter((file) => file.index !== image.index);
    if (image.coverPhoto && newImageState.length > 0) {
      newImageState[0].coverPhoto = true;
    }
    setFiles(newImageState);
  };

  const favoriteImage = (favoriteFile) => {
    const newImageState = [...files];
    for (const file of newImageState) {
      file.coverPhoto = file.index === favoriteFile.index;
    }
    setFiles(newImageState);
  };

  // ======================================<Return function>=======================================
  return (
    <Row className="m-3" style={{ overflow: "scroll" }}>
      {files.length > 0 ? (
        <div className="d-flex overflow-auto mb-3">
          {files.map((file, i) => {
            return (
              <div
                className="mx-2"
                style={{
                  position: "relative",
                  minHeight: "100px",
                  minWidth: "100px",
                  height: "100px",
                  width: "100px",
                }}
                key={i}
              >
                {file.file === null ? (
                  <img
                    key={Date.now()}
                    // src={file.image}
                    src={`${file.image}?${Date.now()}`}
                    style={{ ...tileImg, objectFit: "cover" }}
                  />
                ) : (
                  <img
                    key={Date.now()}
                    src={file.image}
                    // src={`${file.image}?${Date.now()}`}
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
                {file.description}
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
      {newFile !== null ? (
        <div>
          <Form.Group>
            <Form.Label as="h6" className="mb-0 ms-2">
              Document Name
            </Form.Label>
            <Form.Control
              style={squareForm}
              value={newFile.name}
              placeholder="Name"
              onChange={(e) => updateNewFile("name", e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label as="h6" className="mb-0 ms-2">
              Description
            </Form.Label>
            <Form.Control
              style={squareForm}
              value={newFile.description}
              placeholder="Description"
              onChange={(e) => updateNewFile("description", e.target.value)}
            />
          </Form.Group>
          <div className="text-center my-3">
            <Button
              variant="outline-primary"
              style={smallPillButton}
              as="p"
              onClick={cancelEdit}
              className="mx-2"
            >
              Cancel
            </Button>
            <Button
              variant="outline-primary"
              style={smallPillButton}
              as="p"
              onClick={saveNewFile}
              className="mx-2"
            >
              Save Document
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <input
            id="file"
            type="file"
            accept="image/*,.pdf"
            onChange={addFile}
            className="d-none"
          />
          <div
            className="mx-2"
            style={{ minHeight: "100px", minWidth: "100px" }}
          >
            <label
              htmlFor="file"
              style={tileImg}
              className="d-flex justify-content-center align-items-center"
            >
              <img src={Plus} alt="add an image" />
            </label>
          </div>
        </div>
      )}
    </Row>
  );
}

export default ApplianceImages;
