import React from 'react';
import {Container} from 'react-bootstrap';
import Plus from '../icons/Plus.svg';
import Heart from '../icons/Heart.svg';
import HeartOutline from '../icons/HeartOutline.svg';
import {tileImg, xSmall, bold} from '../utils/styles';

function PropertyImages(props) {

  const [imageState, setImageState] = props.state;

  const readImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      file.image = e.target.result;
      const newImageState = [...imageState];
      newImageState.push(file);
      setImageState(newImageState);
    }
    reader.readAsDataURL(file.file);
  }

  const addFile = (e) => {
    const file = {
      index: imageState.length,
      file: e.target.files[0],
      image: null,
      coverPhoto: imageState.length === 0
    }
    readImage(file);
  }

  const favoriteImage = (favoriteFile) => {
    const newImageState = [...imageState];
    for (const file of newImageState) {
      file.coverPhoto = (file.index === favoriteFile.index);
    }
    setImageState(newImageState);
  }

  return (
    <Container>
      <h6>Take Pictures</h6>
      <div className='d-flex overflow-auto mb-3'>
        {imageState.map((file, i) => (
          <div className='mx-2' style={{position: 'relative', minHeight: '100px', minWidth: '100px', height: '100px', width: '100px'}} key={i}
            onClick={() => favoriteImage(file)}>
            <img src={file.image} style={{...tileImg, objectFit: 'cover'}}/>
            <img src={file.coverPhoto ? Heart : HeartOutline}
              style={{position: 'absolute', right: '5px', top: '5px'}}/>
          </div>
        ))}
        <input id='file' type='file' accept='image/*' onChange={addFile} className='d-none'/>
        <div className='mx-2' style={{minHeight: '100px', minWidth: '100px'}}>
          <label htmlFor='file' style={tileImg} className='d-flex justify-content-center align-items-center'>
            <img src={Plus}/>
          </label>
        </div>
      </div>
      <p style={{...xSmall, ...bold}} className='my-1'>
        <img src={Heart} className='me-1'/>
        a picture to make it the cover picture for this property
      </p>
    </Container>
  );

}

export default PropertyImages;
