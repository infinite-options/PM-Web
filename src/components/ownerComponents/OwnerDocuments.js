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
import OwnerFooter from "./OwnerFooter";
import OpenDoc from "../../icons/OpenDocBlack.svg";
import { get } from "../../utils/api";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});
function OwnerDocuments(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [documents, setDocuments] = useState([]);
  const [activeLeaseDocuments, setActiveLeaseDocuments] = useState({});
  const [pastLeaseDocuments, setPastLeaseDocuments] = useState({});
  const [activeManagerDocuments, setActiveManagerDocuments] = useState({});
  const [pastManagerDocuments, setPastManagerDocuments] = useState({});

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

  const fetchProfile = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }
    const response = await get(`/ownerDocuments?owner_id=${user.user_uid}`);
    console.log(response.result[0]);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();
      return;
    }

    setDocuments(response.result);
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
    var active_manager_docs = Object.keys(documents)
      .filter((key) => key.includes("active_manager_docs"))
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: documents[key] });
      }, {});
    console.log(active_manager_docs);
    setActiveManagerDocuments(active_manager_docs);
    var past_manager_docs = Object.keys(documents)
      .filter((key) => key.includes("past_manager_docs"))
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: documents[key] });
      }, {});
    console.log(past_manager_docs);
    setPastManagerDocuments(past_manager_docs);
    setIsLoading(false);
  };
  useEffect(() => {
    if (access_token === null) {
      navigate("/");
    }
    fetchProfile();
  }, [access_token]);
  console.log(documents);
  console.log(activeLeaseDocuments.length);

  return (
    <div>
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

          {!isLoading ? (
            <div>
              {" "}
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
                              <TableCell width="180px">{ald.address}</TableCell>
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
                                  {amd.description != "" ? (
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
                                  <a href={amd.link} target="_blank">
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
                {" "}
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
                                {pld.description != "" ? (
                                  <p className="mx-3">{pld.description}</p>
                                ) : (
                                  <p className="mx-3">Document {i + 1}</p>
                                )}
                              </TableCell>
                              <TableCell width="180px">{pld.address}</TableCell>
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
                        Object.values(pastManagerDocuments)[0].map((pmd, i) => {
                          return (
                            <TableRow>
                              <TableCell width="380px">
                                {pmd.description != "" ? (
                                  <p className="mx-3">{pmd.description}</p>
                                ) : (
                                  <p className="mx-3">Document {i + 1}</p>
                                )}
                              </TableCell>
                              <TableCell width="180px">{pmd.address}</TableCell>
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
                                <a href={pmd.link} target="_blank">
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
                          <TableCell width="180px"></TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Row>
              </div>
            </div>
          ) : (
            <Row></Row>
          )}

          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <OwnerFooter />
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

export default OwnerDocuments;
