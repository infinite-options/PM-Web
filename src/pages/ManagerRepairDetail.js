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
  squareForm,
  orangePill,
} from "../utils/styles";
import { useParams } from "react-router";
import { get, post, put } from "../utils/api";

function ManagerRepairDetail(props) {
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

  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const { mp_id, rr_id } = useParams();

  // const repair = location.state.repair;
  const { repair, back } = props;

  // console.log(repair)
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
    setEdit(false);
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
    <div className="h-100">
      <Header
        title="Repairs"
        leftText={
          scheduleMaintenance || requestQuote
            ? null
            : edit
            ? "Cancel"
            : "< Back"
        }
        leftFn={() => (edit ? setEdit(false) : back())}
        rightText={
          scheduleMaintenance || requestQuote ? null : edit ? "Save" : "Edit"
        }
        rightFn={() => (edit ? updateRepair() : setEdit(true))}
      />

      <Container
        className="pt-1 mb-4"
        hidden={scheduleMaintenance || requestQuote}
      >
        <Row style={headings}>
          <div>New Repair Request</div>
        </Row>
        {edit ? (
          <div className="mx-1 pt-2">
            <Form.Group className="mx-2 my-3">
              <Form.Label style={subHeading} className="mb-0 ms-2">
                Title (character limit: 15)
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder={title}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mx-2 my-3">
              <Form.Label style={subHeading} className="mb-0 ms-2">
                Description
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder={description}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Row className="my-4 pt-1 mx-1">
              <div style={subHeading} className="pt-1 mb-2">
                Tag Priority
              </div>
              <Col xs={4}>
                <img
                  src={HighPriority}
                  style={{ opacity: priority === "High" ? "1" : 0.5 }}
                  onClick={() => setPriority("High")}
                />
              </Col>
              <Col xs={4}>
                <img
                  src={MediumPriority}
                  style={{ opacity: priority === "Medium" ? "1" : 0.5 }}
                  onClick={() => setPriority("Medium")}
                />
              </Col>
              <Col xs={4}>
                <img
                  src={LowPriority}
                  style={{ opacity: priority === "Low" ? "1" : 0.5 }}
                  onClick={() => setPriority("Low")}
                />
              </Col>
            </Row>

            <Row className="my-4 pt-1 mx-1">
              <div style={subHeading} className="pt-1 mb-2">
                Tenant can reschedule this job as needed
              </div>
              <Col className="pt-1 mx-2">
                <Row>
                  <Checkbox
                    type="CIRCLE"
                    checked={canReschedule}
                    onClick={() => setCanReschedule(true)}
                  />
                  Yes
                </Row>
              </Col>
              <Col className="pt-1 mx-2">
                <Row>
                  <Checkbox
                    type="CIRCLE"
                    checked={!canReschedule}
                    onClick={() => setCanReschedule(false)}
                  />
                  No
                </Row>
              </Col>
            </Row>
          </div>
        ) : (
          ""
        )}

        {!edit ? (
          <Container className="mx-1 pt-2">
            <Row className="pt-1 mb-4">
              <div style={subHeading}>Title (character limit: 15)</div>
              <div style={subText}>{repair.title}</div>
            </Row>
            <Row className="pt-1 mb-4">
              <div style={subHeading}>Description</div>
              <div style={subText}>{repair.description}</div>
            </Row>
            <Row className="pt-1 mb-4">
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

              {repair.request_status === "NEW" ? (
                <div className="pt-1 mb-2">
                  <Button
                    style={pillButton}
                    variant="outline-primary"
                    hidden={morePictures}
                    onClick={() => setMorePictures(!morePictures)}
                  >
                    Request more pictures
                  </Button>
                </div>
              ) : repair.request_status === "INFO" ? (
                <div className="pt-1 mb-2" style={subHeading}>
                  Requested more pictures from tenant
                </div>
              ) : (
                ""
              )}
            </Row>
            <Row>
              <Row className="pt-1 mb-4" hidden={!morePictures}>
                <div className="pt-1 mb-2" style={subHeading}>
                  Request more pictures
                </div>

                <Form.Group className="mt-3 mb-4">
                  <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                    Description of the request
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    value={morePicturesNotes}
                    placeholder="Can you please share more pictures regarding the request?"
                    onChange={(e) => setMorePicturesNotes(e.target.value)}
                    as="textarea"
                  />
                </Form.Group>

                <Row className="pt-1 mb-2">
                  <Col className="d-flex flex-row justify-content-evenly">
                    <Button
                      style={pillButton}
                      variant="outline-primary"
                      onClick={() => setMorePictures(false)}
                    >
                      Cancel
                    </Button>
                  </Col>
                  <Col className="d-flex flex-row justify-content-evenly">
                    <Button
                      style={bluePillButton}
                      onClick={requestMorePictures}
                    >
                      Send Request
                    </Button>
                  </Col>
                </Row>
              </Row>
            </Row>
            <Row className="pt-1 mb-3">
              <div style={subHeading} className="pt-1 mb-2">
                Tag Priority
              </div>
              <Col xs={4}>
                <img src={HighPriority} style={{ opacity: "1" }} />
              </Col>
              <Col xs={4}>
                <img src={MediumPriority} style={{ opacity: "0.5" }} />
              </Col>
              <Col xs={4}>
                <img src={LowPriority} style={{ opacity: "0.5" }} />
              </Col>
            </Row>
            <Row className="pt-1 mb-3">
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
            <Row className="pt-1 mt-3 mb-2">
              <Col className="d-flex flex-row justify-content-evenly">
                <Button
                  style={pillButton}
                  variant="outline-primary"
                  onClick={() => setRequestQuote(true)}
                >
                  Request Quotes from Maintenance
                </Button>
              </Col>
            </Row>
          </Container>
        ) : (
          ""
        )}
      </Container>

      <Container hidden={!requestQuote}>
        <Row style={headings}>
          <div>Select businesses to request a quote:</div>
        </Row>

        <div>
          {businesses.length > 0 &&
            businesses.map((business, i) => (
              <Row className="mt-2" key={i}>
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
                  <Row style={headings}>{business.business_name}</Row>
                  <Row style={subText}>
                    Services: Toilet repair, Plumbing, Kitchen repair
                  </Row>
                  <Row className="d-flex flex-row align-items-center justify-content-evenly">
                    <Col style={blue}> Manager: Jane Doe</Col>
                    <Col className="d-flex flex-row align-items-center justify-content-evenly">
                      <img
                        src={Phone}
                        style={{ width: "30px", height: "30px" }}
                      />
                      <img
                        src={Message}
                        style={{ width: "30px", height: "30px" }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            ))}
        </div>
        <Row className="mt-4">
          <Col className="d-flex justify-content-evenly">
            <Button style={bluePillButton} onClick={sendQuotesRequest}>
              Request Quotes
            </Button>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="d-flex justify-content-evenly">
            <Button
              style={redPillButton}
              onClick={() => setRequestQuote(false)}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Container>

      <Container hidden={!scheduleMaintenance}>
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
      </Container>

      {!edit &&
        !scheduleMaintenance &&
        !requestQuote &&
        quotes &&
        quotes.length > 0 && (
          <Container className="pb-4">
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
                <Container className="my-4 pt-3" key={i}>
                  <Row style={headings}>
                    <div>{quote.business_name}</div>
                  </Row>

                  <Row
                    hidden={
                      quote.quote_status !== "SENT" &&
                      quote.quote_status !== "REJECTED"
                    }
                  >
                    <Row className="mt-4 mb-2">
                      <div style={headings}>Fess Included:</div>
                    </Row>
                    {quote.services_expenses &&
                      quote.services_expenses.length > 0 &&
                      JSON.parse(quote.services_expenses).map((service, j) => (
                        <Container key={j}>
                          <Row className="pt-1 mb-2 mx-3">
                            <div style={subHeading}>{service.service_name}</div>
                            <div style={subText}>
                              ${service.charge}{" "}
                              {service.per === "Hour"
                                ? `per ${service.per}`
                                : "One-Time Fee"}
                            </div>
                          </Row>
                        </Container>
                      ))}

                    <Row className="mt-4 mb-4">
                      <div style={headings}>Event Type</div>
                      <div style={subText}>{quote.event_type}</div>
                    </Row>

                    <Row className="mb-4">
                      <div style={headings}>Total Estimate</div>
                      <div style={subText}>$ {quote.total_estimate}</div>
                    </Row>

                    <Row className="mb-4">
                      <div style={headings}>Earliest Availability</div>
                      <div style={subText}>{quote.earliest_availability}</div>
                    </Row>
                  </Row>

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
                    className="pt-4 mb-4"
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
                </Container>
              ))}
          </Container>
        )}
    </div>
  );
}

export default ManagerRepairDetail;
