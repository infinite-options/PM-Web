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
import {
  squareForm,
  smallPillButton,
  mediumBold,
  small,
} from "../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});
function DocumentsUploadPost(props) {
  const classes = useStyles();
  const context = useContext(AppContext);

  const { userData, refresh } = context;
  const { access_token, user } = userData;
  const navigate = useNavigate();

  const { addDoc, setAddDoc, files, setFiles, editingDoc, setEditingDoc } =
    props;

  const [newFile, setNewFile] = useState(null);
  //   const [editingDoc, setEditingDoc] = useState(null);

  // ============================= <File addition/Updation>============================================================
  const addFile = (e) => {
    const file = e.target.files[0];
    const newFile = {
      name: file.name,
      description: "",
      file: file,
      shared: false,
      created_date: new Date().toISOString().split("T")[0],
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
  // console.log(files);
  const deleteDocument = (i) => {
    const newFiles = [...files];
    newFiles.splice(i, 1);
    setFiles(newFiles);
  };
  //   save document
  const saveNewFile = async (e) => {
    const newFiles = [...files];
    newFiles.push(newFile);
    setFiles(newFiles);
    setAddDoc(!addDoc);
    setNewFile(null);
  };
  //  delete document

  // ======================================<Return function>=======================================
  return (
    <div>
      {files.length > 0 ? (
        <Table
          responsive="md"
          classes={{ root: classes.customTable }}
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell>Document Name</TableCell>
              <TableCell>Document Description</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>View Document</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file, i) => {
              return (
                <TableRow>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{file.description}</TableCell>

                  <TableCell>
                    {" "}
                    <img
                      src={EditIcon}
                      alt="Edit"
                      className="px-1 mx-2"
                      onClick={() => editDocument(i)}
                    />
                    <img
                      src={DeleteIcon}
                      alt="Delete Icon"
                      className="px-1 mx-2"
                      onClick={() => deleteDocument(i)}
                    />
                  </TableCell>
                  <TableCell>
                    <a href={file.link} target="_blank" rel="noreferrer">
                      <img
                        src={File}
                        alt="open document"
                        style={{
                          width: "15px",
                          height: "15px",
                        }}
                      />
                    </a>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
              Continue
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
          <label htmlFor="file">
            <Button
              variant="outline-primary"
              style={{ ...smallPillButton, marginTop: "1rem" }}
              as="p"
            >
              Add Document
            </Button>
          </label>
        </div>
      )}
    </div>
  );
}

export default DocumentsUploadPost;
