import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import AppContext from "../AppContext";
import Header from "../components/Header";
import { get } from "../utils/api";
import GreyArrowRight from "../icons/GreyArrowRight.svg";
import OpenDoc from "../icons/OpenDoc.svg";
import { mediumBold } from "../utils/styles";
import SideBar from "./managerComponents/SideBar";

function ManagerDocuments(props) {
  const navigate = useNavigate();
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
    if (access_token === null) {
      navigate("/");
      return;
    }

    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length < 1) {
      console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
    } else {
      management_buid = management_businesses[0].business_uid;
    }
    const response = await get(
      `/managerDocuments?manager_id=${management_buid}`
    );
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

  const { setStage } = props;
  useState(() => {}, []);
  return (
    <div>
      <div className="flex-1">
        <div className="sidebar">
          <SideBar />
        </div>
        <div className="w-100">
          <Header title="Documents" />
          <div
            className="mx-2 my-2 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <Row className="p-2" onClick={() => setStage("DOCUMENTS")}>
              <Col
                className="mx-2"
                style={mediumBold}
                onClick={() =>
                  setExpandActiveLeaseDocuments(!expandActiveLeaseDocuments)
                }
              >
                Lease Documents
              </Col>
              <Col xs={1}>
                <img src={GreyArrowRight} alt="Arrow Right" />
              </Col>
              {expandActiveLeaseDocuments ? (
                Object.values(activeLeaseDocuments)[0].length > 0 ? (
                  Object.values(activeLeaseDocuments)[0].map((ald, i) => {
                    return (
                      <Row
                        className="d-flex align-items-center p-2"
                        style={{
                          boxShadow: "0px 1px 6px #00000029",
                          borderRadius: "5px",
                        }}
                      >
                        <Col
                          className="d-flex mx-4"
                          style={{
                            font: "normal normal 600 18px Bahnschrift-Regular",
                            color: "#007AFF",
                          }}
                        >
                          {ald[0].description != "" ? (
                            <p>{ald[0].description}</p>
                          ) : (
                            <p>Document {i + 1}</p>
                          )}
                        </Col>
                        <Col xs={1} className=" d-flex justify-content-end">
                          <a href={ald[0].link} target="_blank">
                            <img src={OpenDoc} />
                          </a>
                        </Col>
                      </Row>
                    );
                  })
                ) : (
                  <Row>
                    {" "}
                    <Col
                      className=" d-flex align-items-left mx-4"
                      style={{
                        font: "normal normal 600 18px Bahnschrift-Regular",
                        color: "#007AFF",
                      }}
                    >
                      <p>No documents</p>
                    </Col>
                  </Row>
                )
              ) : null}
            </Row>
            <hr />
            <Row className="p-2" onClick={() => setStage("DOCUMENTS")}>
              <Col
                className="mx-2"
                style={mediumBold}
                onClick={() =>
                  setExpandActiveManagerDocuments(!expandActiveManagerDocuments)
                }
              >
                Manager Documents
              </Col>
              <Col xs={1}>
                <img src={GreyArrowRight} alt="Arrow Right" />
              </Col>
              {expandActiveManagerDocuments ? (
                Object.values(activeManagerDocuments)[0].length > 0 ? (
                  Object.values(activeManagerDocuments)[0].map((amd, i) => {
                    return (
                      <Row
                        className="d-flex align-items-center p-2"
                        style={{
                          boxShadow: "0px 1px 6px #00000029",
                          borderRadius: "5px",
                        }}
                      >
                        <Col
                          className=" d-flex align-items-left mx-4"
                          style={{
                            font: "normal normal 600 18px Bahnschrift-Regular",
                            color: "#007AFF",
                          }}
                        >
                          {amd[0].description != "" ? (
                            <p>{amd[0].description}</p>
                          ) : (
                            <p>Document {i + 1}</p>
                          )}
                        </Col>
                        <Col xs={1} className=" d-flex justify-content-end">
                          <a href={amd[0].link} target="_blank">
                            <img src={OpenDoc} />
                          </a>
                        </Col>
                      </Row>
                    );
                  })
                ) : (
                  <Row>
                    {" "}
                    <Col
                      className=" d-flex align-items-left mx-4"
                      style={{
                        font: "normal normal 600 18px Bahnschrift-Regular",
                        color: "#007AFF",
                      }}
                    >
                      <p>No documents</p>
                    </Col>
                  </Row>
                )
              ) : null}
            </Row>
            <hr />
            <Row className="p-2" onClick={() => setStage("DOCUMENTS")}>
              <Col
                className="mx-2"
                style={mediumBold}
                onClick={() =>
                  setExpandPastLeaseDocuments(!expandPastLeaseDocuments)
                }
              >
                Past Lease Documents
              </Col>
              <Col xs={1}>
                <img src={GreyArrowRight} alt="Arrow Right" />
              </Col>
              {expandPastLeaseDocuments ? (
                Object.values(pastLeaseDocuments)[0].length > 0 ? (
                  Object.values(pastLeaseDocuments)[0].map((pld, i) => {
                    return (
                      <Row
                        className="d-flex align-items-center p-2"
                        style={{
                          boxShadow: "0px 1px 6px #00000029",
                          borderRadius: "5px",
                        }}
                      >
                        <Col
                          className=" d-flex align-items-left mx-4"
                          style={{
                            font: "normal normal 600 18px Bahnschrift-Regular",
                            color: "#007AFF",
                          }}
                        >
                          {pld[0].description != "" ? (
                            <p>{pld[0].description}</p>
                          ) : (
                            <p>Document {i + 1}</p>
                          )}
                        </Col>
                        <Col xs={1} className=" d-flex justify-content-end">
                          <a href={pld[0].link} target="_blank">
                            <img src={OpenDoc} />
                          </a>
                        </Col>
                      </Row>
                    );
                  })
                ) : (
                  <Row>
                    {" "}
                    <Col
                      className=" d-flex align-items-left mx-4"
                      style={{
                        font: "normal normal 600 18px Bahnschrift-Regular",
                        color: "#007AFF",
                      }}
                    >
                      <p>No documents</p>
                    </Col>
                  </Row>
                )
              ) : null}
            </Row>
            <hr />
            <Row className="p-2" onClick={() => setStage("DOCUMENTS")}>
              <Col
                className="mx-2"
                style={mediumBold}
                onClick={() =>
                  setExpandPastManagerDocuments(!expandPastManagerDocuments)
                }
              >
                Past Manager Documents
              </Col>
              <Col xs={1}>
                <img src={GreyArrowRight} alt="Arrow Right" />
              </Col>
              {expandPastManagerDocuments ? (
                Object.values(pastManagerDocuments)[0].length > 0 ? (
                  Object.values(pastManagerDocuments)[0].map((pmd, i) => {
                    return (
                      <Row
                        className="d-flex align-items-center p-2"
                        style={{
                          boxShadow: "0px 1px 6px #00000029",
                          borderRadius: "5px",
                        }}
                      >
                        <Col
                          className=" d-flex align-items-left mx-4"
                          style={{
                            font: "normal normal 600 18px Bahnschrift-Regular",
                            color: "#007AFF",
                          }}
                        >
                          {pmd[0].description != "" ? (
                            <p>{pmd[0].description}</p>
                          ) : (
                            <p>Document {i + 1}</p>
                          )}
                        </Col>
                        <Col xs={1} className=" d-flex justify-content-end">
                          <a href={pmd[0].link} target="_blank">
                            <img src={OpenDoc} />
                          </a>
                        </Col>
                      </Row>
                    );
                  })
                ) : (
                  <Row>
                    {" "}
                    <Col
                      className=" d-flex align-items-left mx-4"
                      style={{
                        font: "normal normal 600 18px Bahnschrift-Regular",
                        color: "#007AFF",
                      }}
                    >
                      <p>No documents</p>
                    </Col>
                  </Row>
                )
              ) : null}
            </Row>
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDocuments;
