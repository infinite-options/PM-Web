import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../components/Header";
import AppContext from "../AppContext";
import DocumentOpen from "../icons/documentOpen.svg";
import { subHeading, subText } from "../utils/styles";
import { get, put, post } from "../utils/api";
import {
  tileImg,
  squareForm,
  smallPillButton,
  small,
  underline,
  mediumBold,
} from "../utils/styles";
import Plus from "../icons/Plus.svg";
import File from "../icons/File.svg";
import EditIcon from "../icons/EditIcon.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";

function TenantDocumentUpload(props) {
  const context = useContext(AppContext);
  const { userData, refresh } = context;
  const { access_token, user } = userData;
  const navigate = useNavigate();
  const [fileState, setFileState] = useState([]);

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      file.data = e.target.result;
      const newFileState = [...fileState];
      newFileState.push(file);
      setFileState(newFileState);
    };
    reader.readAsDataURL(file.file);
  };
  // const addFile = (e) => {
  //   const file = {
  //     index: fileState.length,
  //     file: e.target.files[0],
  //     data: ""
  //   }
  //   readFile(file);
  // }
  const [newFile, setNewFile] = React.useState(null);
  const [editingDoc, setEditingDoc] = React.useState(null);
  const [files, setFiles] = React.useState([]);

  // ============================= <File addition/Updation>============================================================
  const addFile = (e) => {
    const file = e.target.files[0];
    const newFile = {
      name: file.name,
      description: "",
      file: file,
    };
    setNewFile(newFile);
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
  const editDocument = (i) => {
    const newFiles = [...files];
    const file = newFiles.splice(i, 1)[0];
    setFiles(newFiles);
    setEditingDoc(file);
    setNewFile({ ...file });
  };
  const saveNewFile = (e) => {
    // copied from addFile, change e.target.files to state.newFile
    const newFiles = [...files];
    newFiles.push(newFile);
    setFiles(newFiles);
    setNewFile(null);
  };
  const deleteDocument = (i) => {
    const newFiles = [...files];
    newFiles.splice(i, 1);
    setFiles(newFiles);
  };

  // ===========================================<Fetch documents / profile info>=================
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await get("/tenantProfileInfo", access_token);

      if (response.msg === "Token has expired") {
        refresh();
        return;
      }

      if (user.role.indexOf("TENANT") === -1) {
        console.log("no tenant profile");
        props.onConfirm();
      }
      const documents = response.result[0].documents
        ? JSON.parse(response.result[0].documents)
        : [];
      setFiles(documents);
    };
    fetchProfile();
  }, []);

  const submitInfo = async () => {
    const tenantProfile = {};
    for (let i = 0; i < files.length; i++) {
      let key = `doc_${i}`;
      tenantProfile[key] = files[i].file;
      delete files[i].file;
    }
    tenantProfile.documents = JSON.stringify(files);
    await put("/tenantProfileInfo", tenantProfile, access_token, files);
    props.onConfirm();
  };
  // useEffect(() => {
  //   const addDocument = async () => {

  //     for (let i = 0; i < files.length; i++) {
  //       let key = `doc_${i}`;
  //       tenantProfile[key] = files[i].file;
  //       delete files[i].file;
  //     }
  //     await put("/tenantProfileInfo", tenantProfile, access_token, files);

  //   }
  // })
  // ======================================<Return function>=======================================
  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Documents"
        leftText="< Back"
        leftFn={() => navigate("/tenant")}
        rightText="Save"
        rightFn={() => submitInfo()}
      />

      <Container className="pt-1 mb-4">
        {/* <div style={{display:"flex",justifyContent: "space-around"}}>
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
          </div> */}
        <div className="mb-4">
          {/* <h5 style={mediumBold}>Tenant Documents</h5> */}
          {files.map((file, i) => (
            <div key={i}>
              <div className="d-flex justify-content-between align-items-end">
                <div>
                  <h6 style={mediumBold}>{file.name}</h6>
                  <p style={small} className="m-0">
                    {file.description}
                  </p>
                </div>
                <div>
                  <img
                    src={EditIcon}
                    style={{ width: "15px", height: "25px" }}
                    alt="Edit"
                    className="px-1 mx-2"
                    onClick={() => editDocument(i)}
                  />
                  <img
                    src={DeleteIcon}
                    alt="Delete"
                    className="px-1 mx-2"
                    onClick={() => deleteDocument(i)}
                  />
                  <a href={file.link} target="_blank">
                    <img src={File} />
                  </a>
                </div>
              </div>
              <hr style={{ opacity: 1 }} />
            </div>
          ))}
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
            // <div>
            // <div style={{width:"50px",height:"50px"}}>
            //   <input id='file' type='file' accept='image/*,.pdf' onChange={addFile} className='d-none'/>
            //   {/* <label htmlFor='file'>
            //     <Button variant='outline-primary' style={smallPillButton} as='p'>
            //       Add Document
            //     </Button>
            //   </label> */}
            //  <div className='mx-2' style={{minHeight: '100px', minWidth: '100px'}}>
            //     <label htmlFor='file' style={tileImg} className='d-flex justify-content-center align-items-center'>
            //         <img src={Plus}/>
            //     </label>
            //     <div style={{textAlign:"center"}}>Click to Upload</div>
            //   </div>
            // </div>
            // </div>
            <div>
              <input
                id="file"
                type="file"
                accept="image/*,.pdf"
                onChange={addFile}
                className="d-none"
              />
              <label htmlFor="file">
                <Button
                  variant="outline-primary"
                  style={smallPillButton}
                  as="p"
                >
                  Add Document
                </Button>
              </label>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default TenantDocumentUpload;
