import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HighPriority from "../icons/highPriority.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";

import RepairImg from "../icons/RepairImg.svg";
import { get } from "../utils/api";
import { headings, subHeading, subText, blue } from "../utils/styles";

function RepairStatus(props) {
  const navigate = useNavigate();
  const { property_uid } = useParams();
  const [repairs, setRepairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  var sortedRepairs = [];


  useEffect(() => {
    if (repairs.length !== 0) {
      setIsLoading(false);
    }
  }, [repairs]);
  function sortDateTime() {

  }
  function sortRepairs(repairs1) {
    let highCount = 0;
    let medCount = 0;
    let lowCount = 0;
    for (const repair of repairs1) {
      if(repair.priority == "High")
      {
        sortedRepairs.push(repair);
        highCount++;
      }
    }
    for (const repair of repairs1) {
      if(repair.priority == "Medium")
      {
        sortedRepairs.push(repair);
        medCount++;
      }
    }
    for (const repair of repairs1) {
      if(repair.priority == "Low")
      {
        sortedRepairs.push(repair);
        lowCount++;
      }
    }
  }
  useEffect(() => {
    const fetchRepairs = async () => {
      const response = await get(
        `/maintenanceRequests?property_uid=${property_uid}`
      );
      console.log(response.result); 
      if(response.result.length !== 0)
      {
        sortRepairs(response.result);
        setRepairs(sortedRepairs);
      }
    };
    fetchRepairs();
  }, []);

  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Repairs"
        leftText="< Back"
        leftFn={() => navigate("/tenant")}
        rightText="Sort by"
      />
      <Container className="pt-1 mb-4" style={{ minHeight: "100%" }}>
        <Container>
          <Row style={headings}>
            <div>Scheduled Repairs</div>
          </Row>
          {repairs.length === 0 || isLoading === true ? (
            <Row className="mt-2 mb-2">
              <div style={blue}>No Scheduled Repairs</div>
            </Row>
          ) : (
              
            repairs.map((repair, i) => {
              return (
                <div>
                  {repair.request_status === "SCHEDULED" ? (
                    <Row key={i}>
                      <Col style={{ padding: "5px" }}>
                        {JSON.parse(repair.images).length > 0 ? (
                          <img
                            src={JSON.parse(repair.images)}
                            //className="w-100 h-100"
                            style={{
                              objectFit: "cover",
                              width: "110px",
                              height: "100%",
                              border: "1px solid #C4C4C4",
                              borderRadius: "5px",
                            }}
                            alt="repair"
                          />
                        ) : (
                          <img
                            src={RepairImg}
                            //className="w-100 h-100"
                            style={{
                              objectFit: "cover",
                              width: "110px",
                              //height: "100%",
                              border: "1px solid #C4C4C4",
                              borderRadius: "5px",
                            }}
                            alt="repair"
                          />
                        )}
                      </Col>
                      <Col
                        xs={8}
                        style={{ paddingLeft: "15px", cursor: "pointer" }}
                      >
                        <div
                          onClick={() =>
                            navigate(
                              `/${property_uid}/${repair.maintenance_request_uid}/detailRepairStatus`
                            )
                          }
                        >
                          <Row style={subHeading}>
                            <Col className="px-0">{repair.title}</Col>
                            <Col
                              xs={5}
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "right",
                                justifyContent: "right",
                              }}
                            >
                              {repair.priority === "High" ? (
                                <img style={{width: '100px', height: '25px'}} src={HighPriority} />
                              ) : repair.priority === "Medium" ? (
                                <img style={{width: '100px', height: '25px'}} src={MediumPriority}/>
                              ) : (
                                <img style={{width: '100px', height: '25px'}} src={LowPriority} />
                              )}
                            </Col>
                          </Row>
                          <Row style={subText}>
                            {repair.description}
                            <hr />
                          </Row>
                          <Row style={blue} className="mt=0 pt=0">
                            Request Sent to <br /> property manager
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  ) : null}
                </div>
              );
            })
          )}
        </Container>
        <Container className="pt-1 mb-4">
          <Row style={headings}>
            <div>Active Requests</div>
          </Row>
          {repairs.length === 0 || isLoading === true ? (
            <Row className="mt-2 mb-2">
              <div style={blue}>No Active Request</div>
            </Row>
          ) : (
            repairs.map((repair, i) => {
              return (
                <div>
                  {repair.request_status === "NEW" || "PROCESSING" ? (
                    <Row className="mt-2 mb-2">
                      <Col style={{ padding: "5px" }}>
                        {JSON.parse(repair.images).length > 0 ? (
                          <img
                            src={JSON.parse(repair.images)}
                            //className="w-100 h-100"
                            style={{
                              objectFit: "cover",
                              width: "110px",
                              height: "100%",
                              border: "1px solid #C4C4C4",
                              borderRadius: "5px",
                            }}
                            alt="repair"
                          />
                        ) : (
                          <img
                            src={RepairImg}
                            //className="w-100 h-100"
                            style={{
                              objectFit: "cover",
                              width: "110px",
                              // height: "100%",
                              border: "1px solid #C4C4C4",
                              borderRadius: "5px",
                            }}
                            alt="repair"
                          />
                        )}
                      </Col>
                      <Col
                        xs={8}
                        style={{ paddingLeft: "15px", cursor: "pointer" }}
                      >
                        <div
                          onClick={() =>
                            navigate(
                              `/${property_uid}/${repair.maintenance_request_uid}/detailRepairStatus`
                            )
                          }
                        >
                          <Row style={subHeading}>
                            <Col className="px-0">{repair.title}</Col>
                            <Col
                              xs={5}
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "right",
                                justifyContent: "right",
                              }}
                            >
                              {repair.priority === "High" ? (
                                <img style={{width: '100px', height: '25px'}} src={HighPriority} />
                              ) : repair.priority === "Medium" ? (
                                <img style={{width: '100px', height: '25px'}} src={MediumPriority} />
                              ) : (
                                <img style={{width: '100px', height: '25px'}} src={LowPriority} />
                              )}
                            </Col>
                          </Row>
                          <Row style={subText}>
                            {repair.description}
                            <hr />
                          </Row>
                          <Row style={blue} className="mt=0 pt=0">
                            Request Sent to <br /> property manager
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  ) : null}
                </div>
              );
            })
          )}
        </Container>
        <Container className="pt-1 mb-4">
          <Row style={headings}>
            <div>Past Requests</div>
          </Row>
          {repairs.length === 0 || isLoading === true ? (
            <Row className="mt-2 mb-2">
              <div style={blue}>No Past Requests</div>
            </Row>
          ) : (
            repairs.map((repair, i) => {
              return (
                <div>
                  {repair.request_status === "COMPLETE" ? (
                    <Row className="mt-2 mb-2">
                      <Col style={{ padding: "5px" }}>
                        {JSON.parse(repair.images).length > 0 ? (
                          <img
                            src={JSON.parse(repair.images)}
                            //className="w-100 h-100"
                            style={{
                              objectFit: "cover",
                              width: "110px",
                              height: "100%",
                              border: "1px solid #C4C4C4",
                              borderRadius: "5px",
                            }}
                            alt="repair"
                          />
                        ) : (
                          <img
                            src={RepairImg}
                            //className="w-100 h-100"
                            style={{
                              objectFit: "cover",
                              width: "110px",
                              //height: "100%",
                              border: "1px solid #C4C4C4",
                              borderRadius: "5px",
                            }}
                            alt="repair"
                          />
                        )}
                      </Col>
                      <Col
                        xs={8}
                        style={{ paddingLeft: "15px", cursor: "pointer" }}
                      >
                        <div
                          onClick={() =>
                            navigate(
                              `/${property_uid}/${repair.maintenance_request_uid}/detailRepairStatus`
                            )
                          }
                        >
                          <Row style={subHeading}>
                            <Col className="px-0">{repair.title}</Col>
                            <Col
                              xs={5}
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "right",
                                justifyContent: "right",
                              }}
                            >
                              {repair.priority === "High" ? (
                                <img style={{width: '100px', height: '25px'}} src={HighPriority} />
                              ) : repair.priority === "Medium" ? (
                                <img style={{width: '100px', height: '25px'}} src={MediumPriority} />
                              ) : (
                                <img style={{width: '100px', height: '25px'}} src={LowPriority} />
                              )}
                            </Col>
                          </Row>
                          <Row style={subText}>
                            {repair.description}
                            <hr />
                          </Row>
                          <Row style={blue} className="mt=0 pt=0">
                            Request Sent to <br /> property manager
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  ) : null}
                </div>
              );
            })
          )}
        </Container>
      </Container>
    </div>
  );
}

export default RepairStatus;
