import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useParams } from "react-router";
import Header from "../components/Header";
import ArrowUp from "../icons/ArrowUp.svg";
import ArrowDown from "../icons/ArrowDown.svg";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import HighPriority from "../icons/highPriority.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import EditIcon from "../icons/EditIcon.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";
import { get, put } from "../utils/api";
import {
  headings,
  subHeading,
  subText,
  pillButton,
  formLabel,
  blueBorderButton,
  bluePillButton,
  redPillButton,
  tileImg,
  squareForm,
} from "../utils/styles";
import ServicesProvided from "../components/ServicesProvided";
import ServicesProvidedQuotes from "./ServicesProvidedQuotes";

function DetailQuote(props) {
  const navigate = useNavigate();
  const { quote_id } = useParams();
  const [expandPaymentTerm, setExpandPaymentTerm] = useState(false);
  const [expandEventType, setExpandEventType] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [addService, setAddService] = useState(false);
  const [addDate, setAddDate] = useState(false);
  const [addEventType, setAddEventType] = useState(false);
  const [sendManager, setSendManager] = useState(false);
  const [quoteAccepted, setQuoteAccepted] = useState(false);
  const [quoteRejected, setQuoteRejected] = useState(false);
  const [quote, setQuote] = React.useState({});
  const [property, setProperty] = React.useState({});
  const [currentImg, setCurrentImg] = React.useState(0);
  const [serviceState, setServiceState] = React.useState([]);
  const [totalEstimate, setTotalEstimate] = React.useState(0);
  const [earliestAvailability, setEarliestAvailability] = React.useState("");
  const [eventType, setEventType] = React.useState("1 Hour Job");

  const nextImg = () => {
    if (currentImg === JSON.parse(property.images).length - 1) {
      setCurrentImg(0);
    } else {
      setCurrentImg(currentImg + 1);
    }
  };
  const previousImg = () => {
    if (currentImg === 0) {
      setCurrentImg(JSON.parse(property.images).length - 1);
    } else {
      setCurrentImg(currentImg - 1);
    }
  };

  const loadQuote = async () => {
    const response = await get(
      `/maintenanceQuotes?maintenance_quote_uid=${quote_id}`
    );
    if (response.result.length === 0) {
      console.log("quote not found");
      navigate("/ScheduledJobs");
      return;
    }
    setQuote(response.result[0]);
    const property_uid = response.result[0].property_uid;
    const propertyResponse = await get(
      `/properties?property_uid=${property_uid}`
    );
    // if (!quote.event_type) {
    //   setEventType(quote.event_type)
    // }
    setProperty(propertyResponse.result[0]);
  };
  React.useEffect(loadQuote, []);

  const sendQuote = async () => {
    const updatedQuote = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      services_expenses: serviceState,
      total_estimate: totalEstimate,
      earliest_availability: earliestAvailability,
      quote_status: "SENT",
      event_type: eventType,
    };
    const response = await put("/maintenanceQuotes", updatedQuote);
    navigate("/ScheduledJobs");
  };

  const rejectQuote = async () => {
    const updatedQuote = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      quote_status: "REFUSED",
    };
    const response = await put("/maintenanceQuotes", updatedQuote);
    navigate("/ScheduledJobs");
  };

  // console.log(addService, showAddService);
  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Repairs"
        leftText="< Back"
        leftFn={() => navigate("/ScheduledJobs")}
      />
      <Container className="pt-1 mb-4" hidden={quoteAccepted || quoteRejected}>
        <Row>
          <Col
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ ...tileImg, height: "200px", position: "relative" }}>
              {quote.images && JSON.parse(quote.images).length > 0 ? (
                <img
                  src={JSON.parse(quote.images)[currentImg]}
                  className="w-100 h-100"
                  style={{ borderRadius: "4px", objectFit: "contain" }}
                  alt="Quote"
                />
              ) : (
                ""
              )}
              <div
                style={{ position: "absolute", left: "5px", top: "90px" }}
                onClick={previousImg}
              >
                {"<"}
              </div>
              <div
                style={{ position: "absolute", right: "5px", top: "90px" }}
                onClick={nextImg}
              >
                {">"}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <div style={headings}>{quote.title}</div>
        </Row>
        <Row>
          <div style={subText}>
            {property.address}, {property.city}, {property.state} {property.zip}
          </div>
        </Row>
        <Row className="mt-2">
          <Col>
            {quote.priority === "Low" ? (
              <img src={LowPriority} />
            ) : quote.priority === "Medium" ? (
              <img src={MediumPriority} />
            ) : quote.priority === "High" ? (
              <img src={HighPriority} />
            ) : (
              ""
            )}
          </Col>
        </Row>
        <Row className="mt-2">
          <div style={subText}>{quote.description}</div>
        </Row>

        <div className="mt-5">
          <Row>
            <div style={headings}>Services</div>
          </Row>
          <ServicesProvidedQuotes
            serviceState={serviceState}
            setServiceState={setServiceState}
            eventType={eventType}
            setEventType={setEventType}
            totalEstimate={totalEstimate}
            setTotalEstimate={setTotalEstimate}
          />
        </div>

        <div className="mt-2 mx-2 mb-4">
          <Row>
            <div style={headings}>Earliest Availabilty</div>
          </Row>
          <div>
            <Form.Group className="mt-2 mb-2">
              <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                Date
              </Form.Label>
              <Form.Control
                type="date"
                style={squareForm}
                value={earliestAvailability}
                onChange={(e) => setEarliestAvailability(e.target.value)}
              />
            </Form.Group>
          </div>
        </div>

        {/*<div className="mt-2 mx-2 mb-4">*/}
        {/*  <Row>*/}
        {/*    <div style={headings}>Event Type</div>*/}
        {/*  </Row>*/}
        {/*  <div>*/}
        {/*    <Form.Group className="mt-2 mb-2">*/}
        {/*      <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">*/}
        {/*        Type*/}
        {/*      </Form.Label>*/}
        {/*      <Form.Select style={squareForm} value={eventType}*/}
        {/*        onChange={(e) => setEventType(e.target.value)}>*/}
        {/*        <option>1 Hour Job</option>*/}
        {/*        <option>2 Hour Job</option>*/}
        {/*        <option>3 Hour Job</option>*/}
        {/*        <option>4 Hour Job</option>*/}
        {/*        <option>6 Hour Job</option>*/}
        {/*        <option>8 Hour Job</option>*/}
        {/*        <option>1 Day Job</option>*/}
        {/*      </Form.Select>*/}
        {/*    </Form.Group>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className="mt-2 mx-2 mb-4" hidden={sendManager}>
          <Row>
            <Col
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Button
                variant="outline-primary"
                style={pillButton}
                onClick={sendQuote}
              >
                Save
              </Button>
            </Col>
            <Col
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              {" "}
              <Button
                variant="outline-primary"
                style={redPillButton}
                onClick={rejectQuote}
              >
                Reject Request
              </Button>
            </Col>
          </Row>
        </div>
        <div className="mt-2 mx-2 mb-4" hidden={!sendManager}>
          <Row className="mt-1 mx-2">
            <Col>
              <div style={headings}>John Parker</div>
              <div style={subText}>Property Manager</div>
            </Col>
            <Col xs={2} className="mt-1 mb-1">
              <img src={Phone} />
            </Col>
            <Col xs={2} className="mt-1 mb-1">
              <img src={Message} />
            </Col>
            <hr />
          </Row>
          <Row>
            <Col
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Button
                variant="outline-primary"
                style={bluePillButton}
                onClick={() => {
                  setQuoteAccepted(true);
                }}
              >
                Send quote to Manager
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
      <Container hidden={!quoteAccepted}>
        <Row
          style={{
            textAlign: "center",
          }}
        >
          <Col style={headings}>Quote Sent!</Col>
        </Row>
        <Row
          style={{
            textAlign: "center",
          }}
          className="mt-3"
        >
          <Col style={subHeading}>
            Your quote was sent to John Parker for review. We will let you know
            once they respond.
          </Col>
        </Row>
        <Row className="mt-3 mx-2">
          <Col>
            <div style={headings}>John Parker</div>
            <div style={subText}>Property Manager</div>
          </Col>
          <Col xs={2} className="mt-1 mb-1">
            <img src={Phone} />
          </Col>
          <Col xs={2} className="mt-1 mb-1">
            <img src={Message} />
          </Col>
          <hr />
        </Row>
        <Row className="mt-3 mx-2">
          <Col
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              variant="outline-primary"
              style={bluePillButton}
              onClick={() => navigate("/maintenance")}
            >
              Back to Home
            </Button>
          </Col>
        </Row>
      </Container>
      <Container hidden={!quoteRejected}>
        <Row
          style={{
            textAlign: "center",
          }}
        >
          <Col style={headings}>Request rejected!</Col>
        </Row>
        <Row
          style={{
            textAlign: "center",
          }}
          className="mt-3"
        >
          <Col style={subHeading}>
            You rejected the request for a quote. We will let John know that you
            do not wish to do the job.
          </Col>
        </Row>
        <Row className="mt-3 mx-2">
          <Col>
            <div style={headings}>John Parker</div>
            <div style={subText}>Property Manager</div>
          </Col>
          <Col xs={2} className="mt-1 mb-1">
            <img src={Phone} />
          </Col>
          <Col xs={2} className="mt-1 mb-1">
            <img src={Message} />
          </Col>
          <hr />
        </Row>
        <Row className="mt-3 mx-2">
          <Col
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              variant="outline-primary"
              style={bluePillButton}
              onClick={() => navigate("/maintenance")}
            >
              Back to Home
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DetailQuote;
