import React, { useState, useEffect, useContext } from "react";
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
import AppContext from "../../AppContext";
import Header from "../Header";
import SideBar from "./SideBar";
import TenantFooter from "./TenantFooter";
import TenantDocumentUpload from "./TenantDocumentUpload";
import OpenDoc from "../../icons/OpenDocBlack.svg";
import File from "../../icons/File.svg";
import EditIcon from "../../icons/EditIcon.svg";
import DeleteIcon from "../../icons/DeleteIcon.svg";
import { get, put, post } from "../../utils/api";
import {
  squareForm,
  smallPillButton,
  small,
  mediumBold,
} from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});
function TenantDocuments(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [documents, setDocuments] = useState([]);
  const [activeLeaseDocuments, setActiveLeaseDocuments] = useState({});
  const [pastLeaseDocuments, setPastLeaseDocuments] = useState({});
  const [tenantUploadDocuments, setTenantUploadDocuments] = useState({});

  const [newFile, setNewFile] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [files, setFiles] = useState([]);
  const [addDoc, setAddDoc] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [width, setWindowWidth] = useState(0);
  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };
  const responsiveSidebar = {
    showSidebar: width > 1023,
  };
  // ============================= <File addition/Updation>============================================================
  const addFile = (e) => {
    const file = e.target.files[0];
    const newFile = {
      name: file.name,
      description: "",
      file: file,
      shared: false,
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
  const saveNewFile = async (e) => {
    // copied from addFile, change e.target.files to state.newFile
    const newFiles = [...files];
    newFiles.push(newFile);
    setFiles(newFiles);
    const tenantProfile = {};
    for (let i = 0; i < newFiles.length; i++) {
      let key = `doc_${i}`;
      tenantProfile[key] = newFiles[i].file;
      delete newFiles[i].file;
    }
    tenantProfile.documents = JSON.stringify(newFiles);
    await put("/tenantProfileInfo", tenantProfile, access_token, files);
    setAddDoc(!addDoc);
    setNewFile(null);
  };
  const deleteDocument = async (i) => {
    console.log("in delete doc", i);
    const newFiles = [...files];
    console.log("in delete doc", newFiles);
    newFiles.splice(i, 1);
    console.log("in delete doc", newFiles);
    setFiles(newFiles);
    const tenantProfile = {};
    for (let i = 0; i < newFiles.length; i++) {
      let key = `doc_${i}`;
      tenantProfile[key] = newFiles[i].file;
      delete newFiles[i].file;
    }
    tenantProfile.documents = JSON.stringify(newFiles);
    await put("/tenantProfileInfo", tenantProfile, access_token, files);
    setAddDoc(!addDoc);
  };

  const fetchProfile = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }
    const responseProfile = await get("/tenantProfileInfo", access_token);

    if (responseProfile.msg === "Token has expired") {
      refresh();
      return;
    }

    if (user.role.indexOf("TENANT") === -1) {
      console.log("no tenant profile");
      props.onConfirm();
    }
    const docs = responseProfile.result[0].documents
      ? JSON.parse(responseProfile.result[0].documents)
      : [];
    setFiles(docs);

    const response = await get(`/tenantDocuments?tenant_id=${user.user_uid}`);
    setDocuments(response.result);
    console.log(response.result[0]);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();
      return;
    }
    let documents = response.result[0];
    var active_lease_docs = Object.keys(documents)
      .filter((key) => key.includes("active_lease_docs"))
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: documents[key] });
      }, {});

    console.log(active_lease_docs);
    setActiveLeaseDocuments(active_lease_docs);
    var past_lease_docs = Object.keys(documents)
      .filter((key) => key.includes("past_lease_docs"))
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: documents[key] });
      }, {});
    console.log(past_lease_docs);
    setPastLeaseDocuments(past_lease_docs);
    var tenant_uploaded_docs = Object.keys(documents)
      .filter((key) => key.includes("tenant_uploaded_docs"))
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: documents[key] });
      }, {});
    console.log(tenant_uploaded_docs);
    setTenantUploadDocuments(tenant_uploaded_docs);
    setIsLoading(false);
  };
  useEffect(() => {
    if (access_token === null) {
      navigate("/");
    }
    fetchProfile();
  }, [access_token, addDoc]);
  console.log(documents);

  return (
    <div className="w-1oo overflow-hidden">
      <div className="flex-1">
        <div
          hidden={!responsiveSidebar.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </div>
        <div className="w-100 mb-5">
          <Header title="Documents" />

          <Row className="m-3" style={{ overflow: "scroll" }}>
            {!isLoading ? (
              <Table
                responsive="md"
                classes={{ root: classes.customTable }}
                size="small"
              >
                <TableHead></TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell width="380px">
                      {" "}
                      <h5>Active Lease Documents</h5>{" "}
                    </TableCell>
                    <TableCell width="180px">Expiry Date</TableCell>
                    <TableCell width="180px">Created Date</TableCell>
                    <TableCell width="180px">Created By</TableCell>
                    <TableCell width="180px">Created For</TableCell>
                    <TableCell width="180px"></TableCell>
                    <TableCell width="180px"></TableCell>
                  </TableRow>
                  {Object.values(activeLeaseDocuments)[0].length > 0 ? (
                    Object.values(activeLeaseDocuments)[0].map((ald, i) => {
                      return (
                        <TableRow>
                          <TableCell width="380px">
                            {ald.description != "" ? (
                              <p className="mx-3">{ald.description}</p>
                            ) : (
                              <p className="mx-3">Document {i + 1}</p>
                            )}
                          </TableCell>
                          <TableCell width="180px">{ald.expiry_date}</TableCell>
                          <TableCell width="180px">
                            {ald.created_date}
                          </TableCell>
                          <TableCell width="180px">{ald.created_by}</TableCell>
                          <TableCell width="180px">
                            {Object.values(ald.created_for.first_name).includes(
                              ","
                            ) &&
                            Object.values(ald.created_for.last_name).includes(
                              ","
                            ) ? (
                              Object.values(
                                ald.created_for.first_name.split(",")
                              ).map((name, index) => {
                                return (
                                  <p>
                                    {
                                      Object.values(
                                        ald.created_for.first_name.split(",")
                                      )[index]
                                    }{" "}
                                    {
                                      Object.values(
                                        ald.created_for.last_name.split(",")
                                      )[index]
                                    }
                                  </p>
                                );
                              })
                            ) : (
                              <p>
                                {Object.values(ald.created_for.first_name)}{" "}
                                {Object.values(ald.created_for.last_name)}
                              </p>
                            )}
                          </TableCell>
                          <TableCell width="180px">
                            <a href={ald.link} target="_blank">
                              <img
                                src={OpenDoc}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  float: "right",
                                }}
                              />
                            </a>
                          </TableCell>
                          <TableCell width="180px"></TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell width="180px">
                        <p className="mx-3">No documents</p>
                      </TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell width="380px">
                      {" "}
                      <h5>Past Lease Documents</h5>{" "}
                    </TableCell>
                    <TableCell width="180px">Expiry Date</TableCell>
                    <TableCell width="180px">Created Date</TableCell>
                    <TableCell width="180px">Created By</TableCell>
                    <TableCell width="180px">Created For</TableCell>
                    <TableCell width="180px"></TableCell>
                    <TableCell width="180px"></TableCell>
                  </TableRow>
                  {Object.values(pastLeaseDocuments)[0].length > 0 ? (
                    Object.values(pastLeaseDocuments)[0].map((pld, i) => {
                      return (
                        <TableRow>
                          <TableCell width="380px">
                            {pld.description != "" ? (
                              <p className="mx-3">{pld.description}</p>
                            ) : (
                              <p className="mx-3">Document {i + 1}</p>
                            )}
                          </TableCell>
                          <TableCell width="180px">{pld.expiry_date}</TableCell>
                          <TableCell width="180px">
                            {pld.created_date}
                          </TableCell>
                          <TableCell width="180px">{pld.created_by}</TableCell>
                          <TableCell width="180px">
                            {Object.values(pld.created_for.first_name).includes(
                              ","
                            ) &&
                            Object.values(pld.created_for.last_name).includes(
                              ","
                            ) ? (
                              Object.values(
                                pld.created_for.first_name.split(",")
                              ).map((name, index) => {
                                return (
                                  <p>
                                    {
                                      Object.values(
                                        pld.created_for.first_name.split(",")
                                      )[index]
                                    }{" "}
                                    {
                                      Object.values(
                                        pld.created_for.last_name.split(",")
                                      )[index]
                                    }
                                  </p>
                                );
                              })
                            ) : (
                              <p>
                                {Object.values(pld.created_for.first_name)}{" "}
                                {Object.values(pld.created_for.last_name)}
                              </p>
                            )}
                          </TableCell>
                          <TableCell width="180px">
                            <a href={pld.link} target="_blank">
                              <img
                                src={OpenDoc}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  float: "right",
                                }}
                              />
                            </a>
                          </TableCell>
                          <TableCell width="180px"></TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      {" "}
                      <TableCell width="180px">
                        <p className="mx-3">No documents</p>
                      </TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell width="380px">
                      {" "}
                      <h5>Tenant Documents</h5>{" "}
                    </TableCell>
                    <TableCell width="180px">Expiry Date</TableCell>
                    <TableCell width="180px">Created Date</TableCell>
                    <TableCell width="180px">Created By</TableCell>
                    <TableCell width="180px">Created For</TableCell>
                    <TableCell width="180px"></TableCell>
                    <TableCell width="180px"></TableCell>
                  </TableRow>
                  {console.log(tenantUploadDocuments)}
                  {Object.values(tenantUploadDocuments)[0].length > 0 ? (
                    Object.values(tenantUploadDocuments)[0].map((tud, i) => {
                      return (
                        <TableRow>
                          <TableCell width="380px">
                            {tud.description != "" ? (
                              <p className="mx-3">{tud.description}</p>
                            ) : (
                              <p className="mx-3">Document {i + 1}</p>
                            )}
                          </TableCell>
                          <TableCell width="180px">{tud.expiry_date}</TableCell>
                          <TableCell width="180px">
                            {tud.created_date}
                          </TableCell>
                          <TableCell width="180px">
                            {Object.values(tud.created_by.first_name).includes(
                              ","
                            ) &&
                            Object.values(tud.created_by.last_name).includes(
                              ","
                            ) ? (
                              Object.values(
                                tud.created_by.first_name.split(",")
                              ).map((name, index) => {
                                return (
                                  <p>
                                    {
                                      Object.values(
                                        tud.created_by.first_name.split(",")
                                      )[index]
                                    }{" "}
                                    {
                                      Object.values(
                                        tud.created_by.last_name.split(",")
                                      )[index]
                                    }
                                  </p>
                                );
                              })
                            ) : (
                              <p>
                                {Object.values(tud.created_by.first_name)}{" "}
                                {Object.values(tud.created_by.last_name)}
                              </p>
                            )}
                          </TableCell>
                          <TableCell width="180px">
                            {Object.values(tud.created_for.first_name).includes(
                              ","
                            ) &&
                            Object.values(tud.created_for.last_name).includes(
                              ","
                            ) ? (
                              Object.values(
                                tud.created_for.first_name.split(",")
                              ).map((name, index) => {
                                return (
                                  <p>
                                    {
                                      Object.values(
                                        tud.created_for.first_name.split(",")
                                      )[index]
                                    }{" "}
                                    {
                                      Object.values(
                                        tud.created_for.last_name.split(",")
                                      )[index]
                                    }
                                  </p>
                                );
                              })
                            ) : (
                              <p>
                                {Object.values(tud.created_for.first_name)}{" "}
                                {Object.values(tud.created_for.last_name)}
                              </p>
                            )}
                          </TableCell>
                          <TableCell width="180px">
                            <a href={tud.link} target="_blank">
                              <img
                                src={OpenDoc}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  float: "right",
                                }}
                              />
                            </a>
                            <img
                              src={EditIcon}
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
                          </TableCell>
                          <TableCell width="180px"></TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      {" "}
                      <TableCell width="180px">
                        <p className="mx-3">No documents</p>
                      </TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
              <Row></Row>
            )}
          </Row>
          <Row className="m-3">
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
                    onChange={(e) =>
                      updateNewFile("description", e.target.value)
                    }
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
          </Row>
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <TenantFooter />
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

export default TenantDocuments;
