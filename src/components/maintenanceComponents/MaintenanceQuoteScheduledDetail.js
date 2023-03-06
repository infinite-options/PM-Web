import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import moment from "moment";
import Header from "../Header";
import Footer from "../Footer";
import ConfirmDialog from "../ConfirmDialog";
import ServicesProvidedQuotes from "../ServicesProvidedQuotes";
import No_Image from "../../icons/No_Image_Available.jpeg";
import HighPriority from "../../icons/highPriority.svg";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import {
  headings,
  subText,
  tileImg,
  greenPill,
  orangePill,
  redPill,
  subHeading,
  bluePillButton,
  formLabel,
  mediumBold,
  gray,
  mediumImg,
  redPillButton,
  squareForm,
  pillButton,
  red,
} from "../../utils/styles";
import { put } from "../../utils/api";

function MaintenanceQuoteScheduledDetail(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const quote = location.state.quote;

  const [reDate, setReDate] = useState("");
  const [reTime, setReTime] = useState("");
  const [currentImg, setCurrentImg] = useState(0);
  const [serviceState, setServiceState] = useState([]);
  const [totalEstimate, setTotalEstimate] = useState(0);
  const [tenants, setTenants] = useState([]);
  const [propertyManager, setPropertyManager] = useState([]);
  const [earliestAvailability, setEarliestAvailability] = useState("");
  const [eventType, setEventType] = useState("1 Hour Job");
  const [scheduleMaintenance, setScheduleMaintenance] = useState(false);
  const [edit, setEdit] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [onConfirm, setOnConfirm] = useState(null);
  const onCancel = () => setShowDialog(false);
  // const onConfirm = () => setShowDialog(false);
  const [errorMessage, setErrorMessage] = useState("");
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );

  const nextImg = () => {
    if (currentImg === JSON.parse(quote.images).length - 1) {
      setCurrentImg(0);
    } else {
      setCurrentImg(currentImg + 1);
    }
  };
  const previousImg = () => {
    if (currentImg === 0) {
      setCurrentImg(JSON.parse(quote.images).length - 1);
    } else {
      setCurrentImg(currentImg - 1);
    }
  };

  const loadQuote = () => {
    // console.log('loaded quote details', quote)
    let earliest_availability = new Date(quote.earliest_availability)
      .toISOString()
      .slice(0, 10);
    setEarliestAvailability(earliest_availability);
    // setEventType(quote.event_type)
    setPropertyManager(
      quote.property_manager.filter(
        (manager) => manager.management_status === "ACCEPTED"
      )
    );
    setTenants(quote.rentalInfo.filter((r) => r.rental_status === "ACTIVE"));
    setServiceState(JSON.parse(quote.services_expenses));
    setEventType(quote.event_type);
  };

  const updateQuote = async () => {
    if (earliestAvailability === "" || eventType === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    setErrorMessage("");

    const updatedQuote = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      services_expenses: serviceState,
      total_estimate: totalEstimate,
      earliest_availability: earliestAvailability,
      event_type: eventType,
      quote_status: "SENT",
    };
    const response = await put("/maintenanceQuotes", updatedQuote);
    navigate(-2);
  };

  const withdrawQuote = async () => {
    const updatedQuote = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      quote_status: "REJECTED",
    };
    const response = await put("/maintenanceQuotes", updatedQuote);
    navigate("/maintenance");
  };

  useEffect(() => {
    if (quote) {
      loadQuote();
    }
  }, [quote]);
  const rejectReschedule = async () => {
    const body = {
      maintenance_request_uid: quote.maintenance_request_uid,
      request_status: "RESCHEDULE",
      scheduled_date: reDate,
      scheduled_time: reTime,
    };

    const images = JSON.parse(quote.images);
    for (let i = -1; i < images.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      body[key] = images[i + 1];
    }

    const response = await put("/maintenanceRequests", body, null, images);
  };

  const acceptReschedule = async (quote) => {
    const body = {
      maintenance_request_uid: quote.maintenance_request_uid,
      request_status: "SCHEDULED",
      notes: "Maintenance Scheduled",
      scheduled_date: quote.scheduled_date,
      scheduled_time: quote.scheduled_time,
    };
    const images = JSON.parse(quote.images);
    for (let i = -1; i < images.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      body[key] = images[i + 1];
    }

    const response = await put("/maintenanceRequests", body, null, images);

    const updatedQuote = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      quote_status: "AGREED",
    };
    const responseMQ = await put("/maintenanceQuotes", updatedQuote);
  };

  const rescheduleRepair = async () => {
    const body = {
      maintenance_request_uid: quote.maintenance_request_uid,
      request_status: "RESCHEDULE",
      notes: "Request to reschedule",
      scheduled_date: reDate,
      scheduled_time: reTime,
    };
    const images = JSON.parse(quote.images);
    for (let i = -1; i < images.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      body[key] = images[i + 1];
    }

    const response = await put("/maintenanceRequests", body, null, images);

    navigate("../maintenance");
  };

  return (
    <div className="h-100 d-flex flex-column">
      <ConfirmDialog
        title={dialogText}
        isOpen={showDialog}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

      <Header
        title="Quote Sent (Detail)"
        leftText="< Back"
        leftFn={() => navigate(-1)}
        rightText=""
      />

      <Container className="pb-5 mb-5">
        <div style={{ ...tileImg, height: "200px", position: "relative" }}>
          {JSON.parse(quote.images).length > 0 ? (
            <img
              src={JSON.parse(quote.images)[currentImg]}
              className="w-100 h-100"
              style={{ borderRadius: "4px", objectFit: "contain" }}
              alt="Property"
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

        <div className="d-flex justify-content-between">
          <div className="pt-1">
            <h5 className="mt-2 mb-0" style={mediumBold}>
              {quote.title}
            </h5>
            <p style={gray} className="mt-1 mb-2">
              {quote.address}
              {quote.unit !== "" ? ` ${quote.unit}, ` : ", "}
              {quote.city}, {quote.state} {quote.zip}
            </p>
          </div>
          <div className="pt-3">
            {quote.priority === "Low" ? (
              <p style={greenPill} className="mb-0">
                Low Priority
              </p>
            ) : quote.priority === "Medium" ? (
              <p style={orangePill} className="mb-0">
                Medium Priority
              </p>
            ) : quote.priority === "High" ? (
              <p style={redPill} className="mb-0">
                High Priority
              </p>
            ) : (
              <p style={greenPill} className="mb-0">
                No Priority
              </p>
            )}
          </div>
        </div>

        <Row className="mt-2">
          <div style={subText}>{quote.description}</div>
        </Row>

        <div className="mt-4 mb-4">
          <Row>
            <div style={headings}>Service Charge(s)</div>
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

        {!scheduleMaintenance ? (
          quote.request_status === "NEW" ? (
            <Row></Row>
          ) : quote.request_status === "SCHEDULE" ? (
            <Row className="mt-4">
              <div style={headings}>Scheduled for</div>
              <div style={subHeading}>
                {moment(quote.scheduled_date).format("ddd, MMM DD, YYYY ")} at{" "}
                {quote.scheduled_time} <hr />
              </div>
              <Row>
                <Col>
                  <Button
                    variant="outline-primary"
                    style={pillButton}
                    onClick={() => {
                      setScheduleMaintenance(true);
                    }}
                  >
                    Reschedule
                  </Button>
                </Col>
              </Row>
            </Row>
          ) : quote.request_status === "SCHEDULED" ? (
            <Row className="mt-4">
              <div style={headings}>Scheduled for</div>
              <div style={subHeading}>
                {moment(quote.scheduled_date).format("ddd, MMM DD, YYYY ")} at{" "}
                {quote.scheduled_time} <hr />
              </div>
            </Row>
          ) : quote.request_status === "RESCHEDULE" ? (
            <Row className="mt-4">
              <div style={headings}>Reschedule request for</div>
              <div style={subHeading}>
                {moment(quote.scheduled_date).format("ddd, MMM DD, YYYY ")} at{" "}
                {quote.scheduled_time} <hr />
              </div>
              <Row>
                <Col>
                  <Button
                    variant="outline-primary"
                    style={pillButton}
                    onClick={() => acceptReschedule(quote)}
                  >
                    Accept
                  </Button>
                </Col>

                <Col>
                  <Button
                    variant="outline-primary"
                    style={pillButton}
                    onClick={() => {
                      setScheduleMaintenance(true);
                    }}
                  >
                    Reject
                  </Button>
                </Col>
              </Row>
            </Row>
          ) : (
            <Row className="mt-4">
              <div style={headings}>Completed on</div>
              <div style={subHeading}>
                {moment(quote.scheduled_date).format("ddd, MMM DD, YYYY ")} at{" "}
                {moment(quote.scheduled_date).format("hh:mm a")} <hr />
              </div>
            </Row>
          )
        ) : (
          ""
        )}
        {scheduleMaintenance &&
        (quote.request_status === "SCHEDULE" ||
          quote.request_status === "RESCHEDULE") &&
        quote.quote_status === "ACCEPTED" ? (
          <Row className="mx-2 my-2 p-3">
            <Row>
              <div style={headings}>Reschedule Maintenace</div>
            </Row>
            <Form.Group className="mt-3 mb-2">
              <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                Date
              </Form.Label>
              <Form.Control
                style={{ borderRadius: 0 }}
                type="date"
                value={reDate}
                onChange={(e) => setReDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-3 mb-2">
              <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                Time
              </Form.Label>
              <Form.Control
                style={{ borderRadius: 0 }}
                type="time"
                value={reTime}
                onChange={(e) => setReTime(e.target.value)}
              />
            </Form.Group>
            <Row className="mt-4">
              <Col className="d-flex justify-content-evenly">
                <Button style={bluePillButton} onClick={rescheduleRepair}>
                  Reschedule Maintenance
                </Button>
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
          </Row>
        ) : (
          <Row></Row>
        )}

        {propertyManager && propertyManager.length > 0 ? (
          <div className="mt-5">
            <div className="d-flex justify-content-between">
              <div>
                <h6 style={headings} className="mb-1">
                  {propertyManager[0].manager_business_name}
                </h6>
                <p style={subText} className="mb-1">
                  Property Management
                </p>
              </div>
              <div>
                <a href={`tel:${propertyManager[0].manager_phone_number}`}>
                  <img src={Phone} alt="Phone" style={mediumImg} />
                </a>
                <a href={`mailto:${propertyManager[0].manager_email}`}>
                  <img src={Message} alt="Message" style={mediumImg} />
                </a>
              </div>
            </div>
            <hr style={{ opacity: 1 }} className="mt-1" />
          </div>
        ) : (
          ""
        )}

        {tenants &&
          tenants.length > 0 &&
          tenants.map((tenant, i) => (
            <div key={i}>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 style={headings} className="mb-1">
                    {tenant.tenant_first_name} {tenant.tenant_last_name}
                  </h6>
                  <p style={subText} className="mb-1">
                    Tenant
                  </p>
                </div>
                <div>
                  <a href={`tel:${tenant.tenant_email}`}>
                    <img src={Phone} alt="Phone" style={mediumImg} />
                  </a>
                  <a href={`mailto:${tenant.tenant_phone_number}`}>
                    <img src={Message} alt="Message" style={mediumImg} />
                  </a>
                </div>
              </div>
              <hr style={{ opacity: 1 }} className="mt-1" />
            </div>
          ))}
      </Container>
    </div>
  );
}

export default MaintenanceQuoteScheduledDetail;
