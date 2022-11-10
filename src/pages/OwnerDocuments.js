import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableSortLabel,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import AppContext from "../AppContext";
import Header from "../components/Header";
import SideBar from "../components/ownerComponents/SideBar";
import GreyArrowRight from "../icons/GreyArrowRight.svg";
import SortDown from "../icons/Sort-down.svg";
import SortLeft from "../icons/Sort-left.svg";
import OpenDoc from "../icons/OpenDocBlack.svg";
import { mediumBold } from "../utils/styles";
import { get } from "../utils/api";
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
        <div>
          <SideBar />
        </div>
        <div className="w-100">
          <Header title="Documents" />
          <Row className="m-3">
            {!isLoading ? (
              <Table>
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
                    <TableCell width="180px">
                      {/* <img
                      src={SortDown}
                      hidden={expandActiveLeaseDocuments}
                      onClick={() => {
                        setExpandActiveLeaseDocuments(
                          !expandActiveLeaseDocuments
                        );
                      }}
                      style={{
                        width: "20px",
                        height: "20px",
                        float: "right",
                      }}
                    />
                    <img
                      src={SortLeft}
                      hidden={!expandActiveLeaseDocuments}
                      onClick={() => {
                        setExpandActiveLeaseDocuments(
                          !expandActiveLeaseDocuments
                        );
                      }}
                      style={{
                        width: "20px",
                        height: "20px",
                        float: "right",
                      }}
                    /> */}
                    </TableCell>
                    <TableCell width="180px"></TableCell>
                  </TableRow>

                  {Object.values(activeLeaseDocuments)[0].length > 0 ? (
                    Object.values(activeLeaseDocuments)[0].map((ald, i) => {
                      return (
                        <TableRow>
                          <TableCell width="380px">
                            {ald.description != "" ? (
                              <p>{ald.description}</p>
                            ) : (
                              <p>Document {i + 1}</p>
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
                        <p>No documents</p>
                      </TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell width="380px">
                      <h5>Active Manager Documents </h5>
                    </TableCell>
                    <TableCell width="180px">Expiry Date</TableCell>
                    <TableCell width="180px">Created Date</TableCell>
                    <TableCell width="180px">Created By</TableCell>
                    <TableCell width="180px">Created For</TableCell>
                    <TableCell width="180px">
                      {/* <img
                      src={SortDown}
                      hidden={expandActiveManagerDocuments}
                      onClick={() => {
                        setExpandActiveManagerDocuments(
                          !expandActiveManagerDocuments
                        );
                      }}
                      style={{
                        width: "20px",
                        height: "20px",
                        float: "right",
                      }}
                    />
                    <img
                      src={SortLeft}
                      hidden={!expandActiveManagerDocuments}
                      onClick={() => {
                        setExpandActiveManagerDocuments(
                          !expandActiveManagerDocuments
                        );
                      }}
                      style={{
                        width: "20px",
                        height: "20px",
                        float: "right",
                      }}
                    /> */}
                    </TableCell>
                    <TableCell width="180px"></TableCell>
                  </TableRow>
                  {Object.values(activeManagerDocuments)[0].length > 0 ? (
                    Object.values(activeManagerDocuments)[0].map((amd, i) => {
                      return (
                        <TableRow>
                          <TableCell width="380px">
                            {amd.description != "" ? (
                              <p>{amd.description}</p>
                            ) : (
                              <p>Document {i + 1}</p>
                            )}
                          </TableCell>
                          <TableCell width="180px">{amd.expiry_date}</TableCell>
                          <TableCell width="180px">
                            {amd.created_date}
                          </TableCell>
                          <TableCell width="180px">{amd.created_by}</TableCell>
                          <TableCell width="180px">{amd.created_for}</TableCell>
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
                    })
                  ) : (
                    <TableRow>
                      <TableCell width="180px">
                        <p>No documents</p>
                      </TableCell>
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
                    <TableCell width="180px">
                      {/* <img
                      src={SortDown}
                      hidden={expandPastLeaseDocuments}
                      onClick={() => {
                        setExpandPastLeaseDocuments(!expandPastLeaseDocuments);
                      }}
                      style={{
                        width: "20px",
                        height: "20px",
                        float: "right",
                      }}
                    />
                    <img
                      src={SortLeft}
                      hidden={!expandPastLeaseDocuments}
                      onClick={() => {
                        setExpandPastLeaseDocuments(!expandPastLeaseDocuments);
                      }}
                      style={{
                        width: "20px",
                        height: "20px",
                        float: "right",
                      }}
                    />{" "} */}
                    </TableCell>
                    <TableCell width="180px"></TableCell>
                  </TableRow>
                  {Object.values(pastLeaseDocuments)[0].length > 0 ? (
                    Object.values(pastLeaseDocuments)[0].map((pld, i) => {
                      return (
                        <TableRow>
                          <TableCell width="380px">
                            {pld.description != "" ? (
                              <p>{pld.description}</p>
                            ) : (
                              <p>Document {i + 1}</p>
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
                        <p>No documents</p>
                      </TableCell>
                      <TableCell width="180px"></TableCell>
                      <TableCell width="180px"></TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell width="380px">
                      <h5>Past Manager Documents</h5>{" "}
                    </TableCell>
                    <TableCell width="180px">Expiry Date</TableCell>
                    <TableCell width="180px">Created Date</TableCell>
                    <TableCell width="180px">Created By</TableCell>
                    <TableCell width="180px">Created For</TableCell>
                    <TableCell width="180px">
                      {/* <img
                      src={SortDown}
                      hidden={expandPastManagerDocuments}
                      onClick={() => {
                        setExpandPastManagerDocuments(
                          !expandPastManagerDocuments
                        );
                      }}
                      style={{
                        width: "20px",
                        height: "20px",
                        float: "right",
                      }}
                    />
                    <img
                      src={SortLeft}
                      hidden={!expandPastManagerDocuments}
                      onClick={() => {
                        setExpandPastManagerDocuments(
                          !expandPastManagerDocuments
                        );
                      }}
                      style={{
                        width: "20px",
                        height: "20px",
                        float: "right",
                      }}
                    /> */}
                    </TableCell>
                    <TableCell width="180px"></TableCell>
                  </TableRow>

                  {Object.values(pastManagerDocuments)[0].length > 0 ? (
                    Object.values(pastManagerDocuments)[0].map((pmd, i) => {
                      return (
                        <TableRow>
                          <TableCell width="380px">
                            {pmd.description != "" ? (
                              <p>{pmd.description}</p>
                            ) : (
                              <p>Document {i + 1}</p>
                            )}
                          </TableCell>
                          <TableCell width="180px">{pmd.expiry_date}</TableCell>
                          <TableCell width="180px">
                            {pmd.created_date}
                          </TableCell>
                          <TableCell width="180px">{pmd.created_by}</TableCell>
                          <TableCell width="180px">{pmd.created_for}</TableCell>
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
                        <p>No documents</p>
                      </TableCell>
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
        </div>{" "}
      </div>
    </div>
  );
}

export default OwnerDocuments;
