import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
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
import DocumentsUploadPut from "../DocumentsUploadPut";
import File from "../../icons/File.svg";
import EditIcon from "../../icons/EditIcon.svg";
import DeleteIcon from "../../icons/DeleteIcon.svg";
import { get, put, post } from "../../utils/api";
import { subHeading } from "../../utils/styles";
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
  const editDocument = (i) => {
    const newFiles = [...files];
    const file = newFiles.splice(i, 1)[0];
    setFiles(newFiles);
    setEditingDoc(file);
    setNewFile({ ...file });
  };

  const deleteDocument = async (i) => {
    const newFiles = files.filter((file, index) => index !== i);
    setFiles(newFiles);
    const tenantProfile = {};
    for (let i = 0; i < newFiles.length; i++) {
      let key = `doc_${i}`;
      // tenantProfile[key] = newFiles[i].file;
      // delete newFiles[i].file;
      if (newFiles[i].file !== undefined) {
        tenantProfile[key] = newFiles[i].file;
      } else {
        tenantProfile[key] = newFiles[i].link;
      }
    }
    tenantProfile.documents = JSON.stringify(newFiles);
    tenantProfile.tenant_id = user.tenant_id[0].tenant_id;
    await put("/tenantProfileInfo", tenantProfile, null, files);
    setAddDoc(!addDoc);
  };

  const fetchProfile = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }
    const responseProfile = await get(
      `/tenantProfileInfo?tenant_id=${user.tenant_id[0].tenant_id}`
    );

    if (responseProfile.msg === "Token has expired") {
      refresh();
      return;
    }

    if (user.role.indexOf("TENANT") === -1) {
      // console.log("no tenant profile");
      props.onConfirm();
    }
    const docs = responseProfile.result[0].documents
      ? JSON.parse(responseProfile.result[0].documents)
      : [];
    setFiles(docs);

    const response = await get(
      `/tenantDocuments?tenant_id=${user.tenant_id[0].tenant_id}`
    );
    setDocuments(response.result);
    // console.log(response.result[0]);

    if (response.msg === "Token has expired") {
      // console.log("here msg");
      refresh();
      return;
    }
    let documents = response.result[0];
    var active_lease_docs = Object.keys(documents)
      .filter((key) => key.includes("active_lease_docs"))
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: documents[key] });
      }, {});

    // console.log(active_lease_docs);
    setActiveLeaseDocuments(active_lease_docs);
    var past_lease_docs = Object.keys(documents)
      .filter((key) => key.includes("past_lease_docs"))
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: documents[key] });
      }, {});
    // console.log(past_lease_docs);
    setPastLeaseDocuments(past_lease_docs);
    var tenant_uploaded_docs = Object.keys(documents)
      .filter((key) => key.includes("tenant_uploaded_docs"))
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: documents[key] });
      }, {});
    // console.log(tenant_uploaded_docs);
    setTenantUploadDocuments(tenant_uploaded_docs);
    setIsLoading(false);
  };
  useEffect(() => {
    if (access_token === null) {
      navigate("/");
    }
    fetchProfile();
  }, [access_token, addDoc]);
  // console.log(documents);

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
        <div className="w-100 mb-5 overflow-scroll">
          <Header title="Documents" />

          <Row style={{ overflow: "scroll" }}>
            {!isLoading ? (
              <div>
                <Row className="m-3">
                  <Col>
                    {" "}
                    <h3>Documents </h3>
                  </Col>

                  <Col></Col>
                </Row>
                <div
                  className="mx-3 my-3 p-2"
                  style={{
                    background: "#E9E9E9 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                >
                  <Row className="m-3" style={{ overflow: "scroll" }}>
                    {" "}
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
                          <TableCell width="180px">Address</TableCell>
                          <TableCell width="180px">Expiry Date</TableCell>
                          <TableCell width="180px">Created Date</TableCell>
                          <TableCell width="180px">Created By</TableCell>
                          <TableCell width="180px">Created For</TableCell>
                          <TableCell width="180px"></TableCell>
                          <TableCell width="180px"></TableCell>
                        </TableRow>

                        {Object.values(activeLeaseDocuments)[0].length > 0 ? (
                          Object.values(activeLeaseDocuments)[0].map(
                            (ald, i) => {
                              return (
                                <TableRow>
                                  <TableCell width="380px">
                                    {ald.description !== "" ? (
                                      <p className="mx-3">{ald.description}</p>
                                    ) : (
                                      <p className="mx-3">Document {i + 1}</p>
                                    )}
                                  </TableCell>
                                  <TableCell width="180px">
                                    {ald.address}
                                  </TableCell>
                                  <TableCell width="180px">
                                    {ald.expiry_date}
                                  </TableCell>
                                  <TableCell width="180px">
                                    {ald.created_date}
                                  </TableCell>
                                  <TableCell width="180px">
                                    {ald.created_by}
                                  </TableCell>
                                  <TableCell width="180px">
                                    {Object.values(
                                      ald.created_for.first_name
                                    ).includes(",") &&
                                    Object.values(
                                      ald.created_for.last_name
                                    ).includes(",") ? (
                                      Object.values(
                                        ald.created_for.first_name.split(",")
                                      ).map((name, index) => {
                                        return (
                                          <p>
                                            {
                                              Object.values(
                                                ald.created_for.first_name.split(
                                                  ","
                                                )
                                              )[index]
                                            }{" "}
                                            {
                                              Object.values(
                                                ald.created_for.last_name.split(
                                                  ","
                                                )
                                              )[index]
                                            }
                                          </p>
                                        );
                                      })
                                    ) : (
                                      <p>
                                        {Object.values(
                                          ald.created_for.first_name
                                        )}{" "}
                                        {Object.values(
                                          ald.created_for.last_name
                                        )}
                                      </p>
                                    )}
                                  </TableCell>
                                  <TableCell width="180px">
                                    <a
                                      href={ald.link}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <img
                                        src={File}
                                        alt="open document"
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
                            }
                          )
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
                            <TableCell width="180px"></TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Row>
                </div>
                <div
                  className="mx-3 my-3 p-2"
                  style={{
                    background: "#E9E9E9 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                >
                  <Row className="m-3" style={{ overflow: "scroll" }}>
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
                            <h5>Past Lease Documents</h5>{" "}
                          </TableCell>
                          <TableCell width="180px">Address</TableCell>
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
                                  {pld.description !== "" ? (
                                    <p className="mx-3">{pld.description}</p>
                                  ) : (
                                    <p className="mx-3">Document {i + 1}</p>
                                  )}
                                </TableCell>
                                <TableCell width="180px">
                                  {pld.address}
                                </TableCell>
                                <TableCell width="180px">
                                  {pld.expiry_date}
                                </TableCell>
                                <TableCell width="180px">
                                  {pld.created_date}
                                </TableCell>
                                <TableCell width="180px">
                                  {pld.created_by}
                                </TableCell>
                                <TableCell width="180px">
                                  {Object.values(
                                    pld.created_for.first_name
                                  ).includes(",") &&
                                  Object.values(
                                    pld.created_for.last_name
                                  ).includes(",") ? (
                                    Object.values(
                                      pld.created_for.first_name.split(",")
                                    ).map((name, index) => {
                                      return (
                                        <p>
                                          {
                                            Object.values(
                                              pld.created_for.first_name.split(
                                                ","
                                              )
                                            )[index]
                                          }{" "}
                                          {
                                            Object.values(
                                              pld.created_for.last_name.split(
                                                ","
                                              )
                                            )[index]
                                          }
                                        </p>
                                      );
                                    })
                                  ) : (
                                    <p>
                                      {Object.values(
                                        pld.created_for.first_name
                                      )}{" "}
                                      {Object.values(pld.created_for.last_name)}
                                    </p>
                                  )}
                                </TableCell>
                                <TableCell width="180px">
                                  <a
                                    href={pld.link}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={File}
                                      alt="open document"
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
                            <TableCell width="180px"></TableCell>
                            <TableCell width="180px"></TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Row>
                </div>
                <div
                  className="mx-3 my-3 p-2"
                  style={{
                    background: "#E9E9E9 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                >
                  <Row className="m-3" style={{ overflow: "scroll" }}>
                    <h5>Tenant Documents</h5>{" "}
                    <DocumentsUploadPut
                      files={files}
                      setFiles={setFiles}
                      addDoc={addDoc}
                      setAddDoc={setAddDoc}
                      endpoint="/tenantProfileInfo"
                      editingDoc={editingDoc}
                      setEditingDoc={setEditingDoc}
                      id={user.tenant_id[0].tenant_id}
                    />
                  </Row>
                </div>
              </div>
            ) : (
              <Row></Row>
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
