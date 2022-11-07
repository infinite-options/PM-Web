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
  const [activeLeaseDocuments, setActiveLeaseDocuments] = useState([]);
  const [pastLeaseDocuments, setPastLeaseDocuments] = useState([]);
  const [activeManagerDocuments, setActiveManagerDocuments] = useState([]);
  const [pastManagerDocuments, setPastManagerDocuments] = useState([]);

  const [expandActiveLeaseDocuments, setExpandActiveLeaseDocuments] =
    useState(false);
  const [expandPastLeaseDocuments, setExpandPastLeaseDocuments] =
    useState(false);
  const [expandActiveManagerDocuments, setExpandActiveManagerDocuments] =
    useState(false);
  const [expandPastManagerDocuments, setExpandPastManagerDocuments] =
    useState(false);

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
  };
  useEffect(() => {
    if (access_token === null) {
      navigate("/");
    }
    fetchProfile();
  }, [access_token]);

  return (
    <div>
      <Header title="Documents" />
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div className="w-100">
          <Row className="m-3">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {" "}
                    <h3>Lease Documents</h3>{" "}
                  </TableCell>
                  <TableCell>
                    <img
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
                    />
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                {expandActiveLeaseDocuments ? (
                  Object.values(activeLeaseDocuments)[0].length > 0 ? (
                    Object.values(activeLeaseDocuments)[0].map((ald, i) => {
                      return (
                        <TableRow>
                          <TableCell>
                            {ald[0].description != "" ? (
                              <p>{ald[0].description}</p>
                            ) : (
                              <p>Document {i + 1}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <a href={ald[0].link} target="_blank">
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
                          <TableCell></TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell>
                        <p>No documents</p>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )
                ) : null}
                <TableRow>
                  <TableCell>
                    <h3>Manager Documents </h3>
                  </TableCell>
                  <TableCell>
                    <img
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
                    />
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                {expandActiveManagerDocuments ? (
                  Object.values(activeManagerDocuments)[0].length > 0 ? (
                    Object.values(activeManagerDocuments)[0].map((amd, i) => {
                      return (
                        <TableRow>
                          <TableCell>
                            {amd[0].description != "" ? (
                              <p>{amd[0].description}</p>
                            ) : (
                              <p>Document {i + 1}</p>
                            )}
                          </TableCell>
                          <TableCell xs={1}>
                            <a href={amd[0].link} target="_blank">
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
                          <TableCell></TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell>
                        <p>No documents</p>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )
                ) : null}
                <TableRow>
                  <TableCell>
                    {" "}
                    <h3>Past Lease Documents</h3>{" "}
                  </TableCell>
                  <TableCell>
                    <img
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
                    />{" "}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                {expandPastLeaseDocuments ? (
                  Object.values(pastLeaseDocuments)[0].length > 0 ? (
                    Object.values(pastLeaseDocuments)[0].map((pld, i) => {
                      return (
                        <TableRow>
                          <TableCell>
                            {pld[0].description != "" ? (
                              <p>{pld[0].description}</p>
                            ) : (
                              <p>Document {i + 1}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <a href={pld[0].link} target="_blank">
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
                          <TableCell></TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      {" "}
                      <TableCell>
                        <p>No documents</p>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )
                ) : null}
                <TableRow>
                  <TableCell>
                    <h3>Past Manager Documents</h3>{" "}
                  </TableCell>
                  <TableCell>
                    <img
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
                    />
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                {expandPastManagerDocuments ? (
                  Object.values(pastManagerDocuments)[0].length > 0 ? (
                    Object.values(pastManagerDocuments)[0].map((pmd, i) => {
                      return (
                        <TableRow>
                          <TableCell>
                            {pmd[0].description != "" ? (
                              <p>{pmd[0].description}</p>
                            ) : (
                              <p>Document {i + 1}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <a href={pmd[0].link} target="_blank">
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
                          <TableCell></TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell>
                        <p>No documents</p>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )
                ) : null}
              </TableBody>
            </Table>
          </Row>
        </div>{" "}
      </div>
    </div>
  );
}

export default OwnerDocuments;
