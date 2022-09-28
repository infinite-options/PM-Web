import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Checkbox from "../components/Checkbox";
import HighPriority from "../icons/highPriority.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import AppContext from "../AppContext";
import Header from "../components/Header";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import SideBar from "./ownerComponents/SideBar";
import {
  headings,
  pillButton,
  subHeading,
  subText,
  redPillButton,
  formLabel,
  bluePillButton,
  blue,
  tileImg,
  mediumBold,
  orangePill,
} from "../utils/styles";
import { useParams } from "react-router";
import { get, post, put } from "../utils/api";

function OwmerRepairDetails(props) {
  const { userData, refresh } = React.useContext(AppContext);
  const { access_token } = userData;
  const location = useLocation();
  const navigate = useNavigate();
  const [morePictures, setMorePictures] = useState(false);
  const [morePicturesNotes, setMorePicturesNotes] = useState(
    "Can you please share more pictures regarding the request?"
  );
  const [canReschedule, setCanReschedule] = useState(false);
  const [requestQuote, setRequestQuote] = useState(false);
  const [scheduleMaintenance, setScheduleMaintenance] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [quotes, setQuotes] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const { mp_id, rr_id } = useParams();

  const repair = location.state.repair;
  const property = location.state.property;
  console.log(repair, property);
  // console.log(mp_id, rr_id)

  const fetchBusinesses = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const businesses_request = await get(
      "/businesses?business_type=MAINTENANCE"
    );
    if (businesses_request.msg === "Token has expired") {
      refresh();
      return;
    }

    const businesses = businesses_request.result.map((business) => ({
      ...business,
      quote_requested: false,
    }));
    // console.log(repair)
    // console.log(businesses)
    setBusinesses(businesses);
    setTitle(repair.title);
    setDescription(repair.description);
    setPriority(repair.priority);
    setCanReschedule(repair.can_reschedule === 1);

    // const quotes_request = await get(`/maintenanceQuotes`);
    // if (quotes_request.msg === 'Token has expired') {
    //     refresh();
    //     return;
    // }
    const response = await get(
      `/maintenanceQuotes?linked_request_uid=${repair.maintenance_request_uid}`
    );
    // console.log(response.result)
    setQuotes(response.result);
  };

  React.useEffect(fetchBusinesses, [access_token]);

  const toggleBusiness = (index) => {
    const newBusinesses = [...businesses];
    newBusinesses[index].quote_requested =
      !newBusinesses[index].quote_requested;
    setBusinesses(newBusinesses);
  };

  const sendQuotesRequest = async () => {
    const business_ids = businesses
      .filter((b) => b.quote_requested)
      .map((b) => b.business_uid);
    if (business_ids.length === 0) {
      alert("No businesses Selected");
      return;
    }
    // for (const id of business_ids){
    //     const quote_details = {
    //         maintenance_request_uid: repair.maintenance_request_uid,
    //         business_uid: id
    //     }
    //     // console.log(quote_details)
    //     const response = await post("/maintenanceQuotes", quote_details);
    //     const result = response.result
    //     // console.log(result)
    // }

    console.log("Quotes Requested from", business_ids);
    const quote_details = {
      linked_request_uid: repair.maintenance_request_uid,
      quote_business_uid: business_ids,
    };
    const response = await post("/maintenanceQuotes", quote_details);
    const result = response.result;
    setRequestQuote(false);
  };

  const updateRepair = async () => {
    const newRepair = {
      maintenance_request_uid: repair.maintenance_request_uid,
      title: title,
      description: description,
      priority: priority,
      can_reschedule: canReschedule ? 1 : 0,
      request_status: repair.request_status,
    };

    console.log("Repair Object to be updated", newRepair);
    const response = await post(
      "/maintenanceRequests",
      newRepair,
      access_token
    );
    console.log(response.result);
    fetchBusinesses();
  };

  const acceptQuote = async (quote) => {
    const body = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      quote_status: "ACCEPTED",
    };
    const response = await put("/maintenanceQuotes", body);
    fetchBusinesses();
  };

  const rejectQuote = async (quote) => {
    const body = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      quote_status: "REJECTED",
    };
    const response = await put("/maintenanceQuotes", body);
    fetchBusinesses();
  };

  const requestMorePictures = async (quote) => {
    const newRepair = {
      maintenance_request_uid: repair.maintenance_request_uid,
      request_status: "INFO",
      notes: morePicturesNotes,
    };

    console.log("Repair Object to be updated");
    console.log(newRepair);
    const response = await put(
      "/maintenanceRequests",
      newRepair,
      null,
      newRepair
    );
    setMorePictures(false);
    fetchBusinesses();
  };

  return (
    <div>
      <div className="flex-1">
        <div className="sidebar">
          <SideBar />
        </div>
        <div className="w-100">
          <br />
          <Header
            title="Repairs"
            leftText={"< Back"}
            leftFn={() => navigate("/owner")}
          />

          <div
            className="mx-2 my-2 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
            hidden={scheduleMaintenance || requestQuote}
          >
            <Row style={headings}>
              <Col>{title}</Col>
              <Col xs={4}>
                {priority === "High" ? (
                  <img src={HighPriority} />
                ) : priority === "Medium" ? (
                  <img src={MediumPriority} />
                ) : (
                  <img src={LowPriority} />
                )}
              </Col>
              <Row>
                <p style={subHeading} className="mt-2 mb-0">
                  {property}
                </p>
              </Row>
            </Row>

            <div className="mx-1 pt-2">
              <Row
                style={{
                  background: "#F3F3F3 0% 0% no-repeat padding-box",
                  borderRadius: "10px",
                  opacity: 1,
                }}
                className="my-4 p-2"
              >
                <div style={subHeading}>Description</div>
                <div style={subText}>{repair.description}</div>
              </Row>
              <Row
                className="pt-1 mb-4"
                style={{
                  background: "#F3F3F3 0% 0% no-repeat padding-box",
                  borderRadius: "10px",
                  opacity: 1,
                }}
              >
                <div className="pt-1 mb-2" style={subHeading}>
                  Pictures from tenant
                </div>

                <div className="d-flex overflow-auto mb-3">
                  {JSON.parse(repair.images).map((file, i) => (
                    <div
                      className="mx-2"
                      style={{
                        position: "relative",
                        minHeight: "100px",
                        minWidth: "100px",
                        height: "100px",
                        width: "100px",
                      }}
                      key={i}
                    >
                      <img
                        src={file}
                        style={{ ...tileImg, objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              </Row>

              <Row
                className="pt-1 mb-4"
                style={{
                  background: "#F3F3F3 0% 0% no-repeat padding-box",
                  borderRadius: "10px",
                  opacity: 1,
                }}
              >
                <div style={subHeading} className="pt-1 mb-2">
                  Tenant can reschedule this job as needed
                </div>
                <Col className="pt-1 mx-2">
                  <Row>
                    <Checkbox type="CIRCLE" checked={canReschedule} /> Yes
                  </Row>
                </Col>
                <Col className="pt-1 mx-2">
                  <Row>
                    <Checkbox type="CIRCLE" checked={!canReschedule} /> No
                  </Row>
                </Col>
              </Row>
              <Row hidden={true} className="pt-1">
                <Col className="d-flex flex-row justify-content-evenly">
                  <Button
                    style={bluePillButton}
                    onClick={() => setScheduleMaintenance(true)}
                  >
                    Schedule Maintenance
                  </Button>
                </Col>
              </Row>
            </div>
          </div>

          <div
            className="mx-2 my-2 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
            hidden={!requestQuote}
          >
            <Row style={headings}>
              <Col>{repair.title}</Col>
              <Col xs={4}>
                {repair.priority === "High" ? (
                  <img src={HighPriority} />
                ) : repair.priority === "Medium" ? (
                  <img src={MediumPriority} />
                ) : (
                  <img src={LowPriority} />
                )}
              </Col>
            </Row>
            <Row style={subHeading}>
              <div>Select businesses to request a quote:</div>
            </Row>

            <div>
              {businesses.length > 0 &&
                businesses.map((business, i) => (
                  <Row
                    className="my-3 p-2"
                    key={i}
                    style={{
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                      boxShadow: business.quote_requested
                        ? "0px 3px 6px #00000029"
                        : "none",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <Col xs={2} className="mt-2">
                      <Row>
                        <Checkbox
                          type="BOX"
                          checked={businesses[i].quote_requested}
                          onClick={() => toggleBusiness(i)}
                        />
                      </Row>
                    </Col>
                    <Col>
                      <Row style={subHeading}>{business.business_name}</Row>
                      <Row style={subText}>
                        Services: Toilet repair, Plumbing, Kitchen repair
                      </Row>
                      <Row className="d-flex flex-row align-items-center justify-content-evenly">
                        <Col style={blue}> Manager: Jane Doe</Col>
                        <Col className="d-flex flex-row align-items-center justify-content-end">
                          <a href={`tel:${businesses.business_phone_number}`}>
                            <img
                              src={Phone}
                              className="mx-1"
                              style={{ width: "30px", height: "30px" }}
                            />
                          </a>
                          <a href={`mailto:${businesses.business_email}`}>
                            <img
                              src={Message}
                              style={{ width: "30px", height: "30px" }}
                            />
                          </a>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ))}
            </div>
          </div>

          <div hidden={!scheduleMaintenance}>
            <Row>
              <div style={headings}>Schedule Maintenace</div>
            </Row>
            <Form.Group className="mt-3 mb-2">
              <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                Date
              </Form.Label>
              <Form.Control style={{ borderRadius: 0 }} type="date" />
            </Form.Group>
            <Form.Group className="mt-3 mb-2">
              <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                Time
              </Form.Label>
              <Form.Control style={{ borderRadius: 0 }} type="time" />
            </Form.Group>
            <Row className="mt-4">
              <Col className="d-flex justify-content-evenly">
                <Button style={bluePillButton}>Schedule Maintenance</Button>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col className="d-flex justify-content-evenly">
                <Button
                  style={redPillButton}
                  onClick={() => setScheduleMaintenance(false)}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </div>

          {!scheduleMaintenance &&
            !requestQuote &&
            quotes &&
            quotes.length > 0 && (
              <div className="pb-4">
                <hr
                  style={{
                    border: "1px dashed #000000",
                    borderStyle: "none none dashed",
                    backgroundColor: "white",
                  }}
                />

                {quotes &&
                  quotes.length > 0 &&
                  quotes.map((quote, i) => (
                    <div key={i}>
                      <hr
                        style={{
                          border: "1px dashed #000000",
                          borderStyle: "none none dashed",
                          backgroundColor: "white",
                        }}
                      />
                      <Row className="mx-2 my-2" style={headings}>
                        <div>{quote.business_name}</div>
                      </Row>
                      <div className="mx-2 my-2 p-3">
                        <Row
                          hidden={
                            quote.quote_status !== "SENT" &&
                            quote.quote_status !== "REJECTED"
                          }
                        >
                          <div
                            className="my-2 p-3"
                            style={{
                              background: "#F3F3F3 0% 0% no-repeat padding-box",
                              borderRadius: "10px",
                              opacity: 1,
                            }}
                          >
                            <Row>
                              <div style={mediumBold}>Service Charges</div>
                            </Row>
                            <Row className="mx-2">
                              {quote.services_expenses &&
                                quote.services_expenses.length > 0 &&
                                JSON.parse(quote.services_expenses).map(
                                  (service, j) => (
                                    <div
                                      key={j}
                                      style={{
                                        background:
                                          "#FFFFFF 0% 0% no-repeat padding-box",
                                        boxShadow: "0px 3px 6px #00000029",
                                        borderRadius: "5px",
                                        opacity: 1,
                                      }}
                                    >
                                      <Row className="pt-1 mb-2">
                                        <div style={subHeading}>
                                          {service.service_name}
                                        </div>
                                        <div style={subText}>
                                          ${service.charge}{" "}
                                          {service.per === "Hour"
                                            ? `/${service.per}`
                                            : "One-Time Fee"}
                                        </div>
                                      </Row>
                                    </div>
                                  )
                                )}
                            </Row>
                          </div>
                          <div
                            className="my-2 p-3"
                            style={{
                              background: "#F3F3F3 0% 0% no-repeat padding-box",
                              borderRadius: "10px",
                              opacity: 1,
                            }}
                          >
                            <Row>
                              <div style={mediumBold}>Event Type</div>
                            </Row>
                            <Row className="mx-2">
                              <div
                                style={
                                  (subText,
                                  {
                                    background:
                                      "#FFFFFF 0% 0% no-repeat padding-box",
                                    boxShadow: "0px 3px 6px #00000029",
                                    borderRadius: "5px",
                                    opacity: 1,
                                  })
                                }
                              >
                                {quote.event_type}
                              </div>
                            </Row>
                          </div>
                          <div
                            className="my-2 p-3"
                            style={{
                              background: "#F3F3F3 0% 0% no-repeat padding-box",
                              borderRadius: "10px",
                              opacity: 1,
                            }}
                          >
                            <Row>
                              <div style={mediumBold}>Total Estimate</div>
                            </Row>
                            <Row className="mx-2">
                              {" "}
                              <div
                                style={
                                  (subText,
                                  {
                                    background:
                                      "#FFFFFF 0% 0% no-repeat padding-box",
                                    boxShadow: "0px 3px 6px #00000029",
                                    borderRadius: "5px",
                                    opacity: 1,
                                  })
                                }
                              >
                                $ {quote.total_estimate}
                              </div>
                            </Row>
                          </div>
                          <div
                            className="my-2 p-3"
                            style={{
                              background: "#F3F3F3 0% 0% no-repeat padding-box",
                              borderRadius: "10px",
                              opacity: 1,
                            }}
                          >
                            <Row>
                              <div style={mediumBold}>
                                Earliest Availability
                              </div>
                            </Row>
                            <Row className="mx-2">
                              {" "}
                              <div
                                style={
                                  (subText,
                                  {
                                    background:
                                      "#FFFFFF 0% 0% no-repeat padding-box",
                                    boxShadow: "0px 3px 6px #00000029",
                                    borderRadius: "5px",
                                    opacity: 1,
                                  })
                                }
                              >
                                {new Date(
                                  String(quote.earliest_availability).split(
                                    " "
                                  )[0]
                                ).toLocaleDateString()}
                              </div>
                            </Row>
                          </div>
                        </Row>
                      </div>

                      <Row
                        hidden={quote.quote_status !== "SENT"}
                        className="pt-1 mb-4"
                      >
                        <Col className="d-flex flex-row justify-content-evenly">
                          <Button
                            style={bluePillButton}
                            onClick={() => acceptQuote(quote)}
                          >
                            Accept Quote
                          </Button>
                        </Col>
                        <Col className="d-flex flex-row justify-content-evenly">
                          <Button
                            style={redPillButton}
                            onClick={() => rejectQuote(quote)}
                          >
                            Reject Quote
                          </Button>
                        </Col>
                      </Row>

                      <Row
                        hidden={quote.quote_status === "SENT"}
                        className="pt-1 mb-4"
                      >
                        <Col className="d-flex flex-row justify-content-evenly">
                          <Button style={orangePill}>
                            {quote.quote_status === "REQUESTED"
                              ? "Waiting for quote from business"
                              : quote.quote_status === "REJECTED"
                              ? "You've Rejected the Quote"
                              : quote.quote_status === "ACCEPTED"
                              ? "You've Accepted the Quote"
                              : quote.quote_status === "SENT"
                              ? "Waiting for quote from business"
                              : "Quote Withdrawn by Business"}
                          </Button>
                        </Col>
                      </Row>
                      <hr />
                    </div>
                  ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default OwmerRepairDetails;
