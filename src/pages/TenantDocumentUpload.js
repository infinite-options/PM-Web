import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../components/Header";
import DocumentOpen from "../icons/documentOpen.svg";
import { subHeading, subText } from "../utils/styles";
import {tileImg, xSmall, bold} from '../utils/styles';
import Plus from '../icons/Plus.svg';
import File from '../icons/File.svg';




function TenantDocumentUpload(props) {
  const navigate = useNavigate();
  const [fileState, setFileState] = useState([]);

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      file.data = e.target.result;
      const newFileState = [...fileState];
      newFileState.push(file);
      setFileState(newFileState);
    }
    reader.readAsDataURL(file.file);
  }
  const addFile = (e) => {
    const file = {
      index: fileState.length,
      file: e.target.files[0],
      data: ""
    }
    readFile(file);
  }
  return (
    <div className="h-100 d-flex flex-column">
      <Header  title="Documents" leftText="< Back" leftFn={() => navigate("/tenant")} />

      <Container className="pt-1 mb-4">
          <div style={{display:"flex",justifyContent: "space-around"}}>
            <div style={{width:"50px",height:"50px"}}>
                    <input id='file' type='file' accept='*' onChange={addFile} className='d-none'/>
                    <div className='mx-2' style={{minHeight: '100px', minWidth: '100px'}}>
                        <label htmlFor='file' style={tileImg} className='d-flex justify-content-center align-items-center'>
                            <img src={Plus}/>
                        </label>
                        <div style={{textAlign:"center"}}>Click to Upload</div>
                    </div>
            </div>
            {fileState.map((file, i) => (
                <div style={{width:"50px",height:"50px"}}>
                    <img src={File} style={{width:"100%",height:"80%"}}></img>
                    <div>{file.file.name}</div>
                </div>
            ))}
          </div>
      </Container>
    </div>
  );
}

export default TenantDocumentUpload;
