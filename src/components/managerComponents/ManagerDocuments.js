import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
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
import ManagerFooter from "./ManagerFooter";
import DocumentsUploadPut from "../DocumentsUploadPut";
import File from "../../icons/File.svg";
import { get, put } from "../../utils/api";
import { sidebarStyle } from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});
function ManagerDocuments(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [documents, setDocuments] = useState([]);
  const [managerID, setManagerID] = useState([]);
  const [activeLeaseDocuments, setActiveLeaseDocuments] = useState({});
  const [pastLeaseDocuments, setPastLeaseDocuments] = useState({});
  const [activeManagerDocuments, setActiveManagerDocuments] = useState({});
  const [pastManagerDocuments, setPastManagerDocuments] = useState({});

  const [businessUploadDocuments, setBusinessUploadDocuments] = useState({});
  const [newFile, setNewFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDoc, setEditingDoc] = useState(null);
  const [files, setFiles] = useState([]);
  const [addDoc, setAddDoc] = useState(false);
  const [width, setWindowWidth] = useState(1024);
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

  const fetchProfile = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length < 1) {
      // console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      // console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
    } else {
      management_buid = management_businesses[0].business_uid;
    }
    setManagerID(management_buid);
    const response = await get(
      `/managerDocuments?manager_id=${management_buid}`
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
    var active_manager_docs = Object.keys(documents)
      .filter((key) => key.includes("active_manager_docs"))
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: documents[key] });
      }, {});
    // console.log(active_manager_docs);
    setActiveManagerDocuments(active_manager_docs);
    var past_manager_docs = Object.keys(documents)
      .filter((key) => key.includes("past_manager_docs"))
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: documents[key] });
      }, {});
    // console.log(past_manager_docs);
    setPastManagerDocuments(past_manager_docs);
    var business_uploaded_docs = Object.keys(documents)
      .filter((key) => key.includes("business_uploaded_docs"))
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: documents[key] });
      }, {});
    // console.log(business_uploaded_docs);
    setBusinessUploadDocuments(business_uploaded_docs);
    setFiles(Object.values(business_uploaded_docs)[0]);
    setIsLoading(false);
  };
  useEffect(() => {
    if (access_token === null) {
      navigate("/");
    }
    fetchProfile();
  }, [access_token]);
  const editDocument = (i) => {
    const newFiles = [...files];
    const file = newFiles.splice(i, 1)[0];
    setFiles(newFiles);
    setEditingDoc(file);
    setNewFile({ ...file });
  };
  // console.log(businessUploadDocuments);
  const deleteDocument = async (i) => {
    const newFiles = files.filter((file, index) => index !== i);
    setFiles(newFiles);
    const businessProfile = {};
    for (let i = 0; i < newFiles.length; i++) {
      let key = `doc_${i}`;
      // businessProfile[key] = newFiles[i].file;
      // delete newFiles[i].file;
      if (newFiles[i].file !== undefined) {
        businessProfile[key] = newFiles[i].file;
      } else {
        businessProfile[key] = newFiles[i].link;
      }
    }
    businessProfile.business_documents = JSON.stringify(newFiles);
    businessProfile.business_uid = managerID;
    await put("/businesses", businessProfile, null, files);
    setAddDoc(!addDoc);
  };

  return (
    <div className="w-100 overflow-hidden">
      <Row className="w-100 mb-5 overflow-hidden">
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5">
          <Header title="Documents" />
          <Row>
            {!isLoading ? (
              <div>
                <Row className="m-3">
                  <Col>
                    <h3>Documents</h3>
                  </Col>
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
                            <h5>Active Manager Documents </h5>
                          </TableCell>
                          <TableCell width="180px">Address</TableCell>
                          <TableCell width="180px">Expiry Date</TableCell>
                          <TableCell width="180px">Created Date</TableCell>
                          <TableCell width="180px">Created By</TableCell>
                          <TableCell width="180px">Created For</TableCell>
                          <TableCell width="180px"></TableCell>
                          <TableCell width="180px"></TableCell>
                        </TableRow>
                        {Object.values(activeManagerDocuments)[0].length > 0 ? (
                          Object.values(activeManagerDocuments)[0].map(
                            (amd, i) => {
                              return (
                                <TableRow>
                                  <TableCell width="380px">
                                    {amd.description !== "" ? (
                                      <p className="mx-3">{amd.description}</p>
                                    ) : (
                                      <p className="mx-3">Document {i + 1}</p>
                                    )}
                                  </TableCell>

                                  <TableCell width="180px">
                                    {amd.address}
                                  </TableCell>
                                  <TableCell width="180px">
                                    {amd.expiry_date}
                                  </TableCell>
                                  <TableCell width="180px">
                                    {amd.created_date}
                                  </TableCell>
                                  <TableCell width="180px">
                                    {amd.created_by}
                                  </TableCell>
                                  <TableCell width="180px">
                                    {amd.created_for}
                                  </TableCell>
                                  <TableCell width="180px" xs={1}>
                                    <a
                                      href={amd.link}
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
                            <h5>Past Manager Documents</h5>{" "}
                          </TableCell>
                          <TableCell width="180px">Address</TableCell>
                          <TableCell width="180px">Expiry Date</TableCell>
                          <TableCell width="180px">Created Date</TableCell>
                          <TableCell width="180px">Created By</TableCell>
                          <TableCell width="180px">Created For</TableCell>
                          <TableCell width="180px"></TableCell>
                          <TableCell width="180px"></TableCell>
                        </TableRow>

                        {Object.values(pastManagerDocuments)[0].length > 0 ? (
                          Object.values(pastManagerDocuments)[0].map(
                            (pmd, i) => {
                              return (
                                <TableRow>
                                  <TableCell width="380px">
                                    {pmd.description !== "" ? (
                                      <p className="mx-3">{pmd.description}</p>
                                    ) : (
                                      <p className="mx-3">Document {i + 1}</p>
                                    )}
                                  </TableCell>
                                  <TableCell width="180px">
                                    {pmd.address}
                                  </TableCell>
                                  <TableCell width="180px">
                                    {pmd.expiry_date}
                                  </TableCell>
                                  <TableCell width="180px">
                                    {pmd.created_date}
                                  </TableCell>
                                  <TableCell width="180px">
                                    {pmd.created_by}
                                  </TableCell>
                                  <TableCell width="180px">
                                    {pmd.created_for}
                                  </TableCell>
                                  <TableCell width="180px">
                                    <a
                                      href={pmd.link}
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
                  <Row className="m-3">
                    <h5>Business Documents</h5>{" "}
                    <DocumentsUploadPut
                      files={files}
                      setFiles={setFiles}
                      addDoc={addDoc}
                      setAddDoc={setAddDoc}
                      endpoint="/businesses"
                      editingDoc={editingDoc}
                      setEditingDoc={setEditingDoc}
                      id={managerID}
                    />
                  </Row>
                </div>
              </div>
            ) : (
              <Row></Row>
            )}
          </Row>
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <ManagerFooter />
          </div>
        </Col>{" "}
      </Row>
    </div>
  );
}

export default ManagerDocuments;
