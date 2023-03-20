import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import moment from "moment";
import ConfirmDialog from "../ConfirmDialog";
import {
  headings,
  subHeading,
  bluePillButton,
  formLabel,
  redPillButton,
  hidden,
  small,
  pillButton,
  red,
} from "../../utils/styles";
import { put } from "../../utils/api";
import RepairImages from "../RepairImages";
import AppContext from "../../AppContext";

function MaintenanceQuoteScheduledDetail(props) {
  const { ably } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { quote } = props;
  const channel_maintenance = ably.channels.get("maintenance_status");

  const [reDate, setReDate] = useState("");
  const [reTime, setReTime] = useState("");
  const [scheduleMaintenance, setScheduleMaintenance] = useState(false);
  const [finishMaintenance, setFinishMaintenance] = useState(false);
  const imageState = useState([]);
  const [message, setMessage] = useState("");
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
  useEffect(() => {
    setReDate(quote.scheduled_date);
    setReTime(quote.scheduled_time);
  }, []);

  const finishMain = async () => {
    if (message === "") {
      setErrorMessage("Please fill out the notes");
      return;
    }
    if (imageState[0].length === 0) {
      setErrorMessage("Please upload images");
      return;
    }
    const updateRequest = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      request_status: "FINISHED",
      notes: message,
    };

    const files = imageState[0];
    let i = 0;
    for (const file of imageState[0]) {
      let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
      if (file.file !== null) {
        updateRequest[key] = file.file;
      } else {
        updateRequest[key] = file.image;
      }
    }
    const res = await put("/FinishMaintenance", updateRequest, null, files);
    channel_maintenance.publish({ data: { te: updateRequest } });
    setFinishMaintenance(false);
    navigate("../maintenance");
  };
  const withdrawQuote = async () => {
    const updatedQuote = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      quote_status: "REJECTED",
      quote_adjustment_date: new Date(),
    };
    const response = await put("/maintenanceQuotes", updatedQuote);
    channel_maintenance.publish({ data: { te: updatedQuote } });
    navigate("/maintenance");
  };

  const rejectReschedule = async () => {
    const body = {
      maintenance_request_uid: quote.maintenance_request_uid,
      request_status: "RESCHEDULE",
      scheduled_date: reDate,
      scheduled_time: reTime,
      request_adjustment_date: new Date(),
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
    channel_maintenance.publish({ data: { te: body } });
  };

  const acceptReschedule = async (quote) => {
    const body = {
      maintenance_request_uid: quote.maintenance_request_uid,
      request_status: "SCHEDULED",
      notes: "Maintenance Scheduled",
      scheduled_date: quote.scheduled_date,
      scheduled_time: quote.scheduled_time,
      request_adjustment_date: new Date(),
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
      quote_adjustment_date: new Date(),
    };
    const responseMQ = await put("/maintenanceQuotes", updatedQuote);
    channel_maintenance.publish({ data: { te: updatedQuote } });
  };

  const rescheduleRepair = async () => {
    const body = {
      maintenance_request_uid: quote.maintenance_request_uid,
      request_status: "SCHEDULE",
      notes: "Schedule",
      scheduled_date: reDate,
      scheduled_time: reTime,
      request_adjustment_date: new Date(),
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
    channel_maintenance.publish({ data: { te: body } });
    navigate("../maintenance");
  };
  console.log(quote.request_status);

  return (
    <div className="h-100 d-flex flex-column">
      <ConfirmDialog
        title={dialogText}
        isOpen={showDialog}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

      <Container className="pb-5">
        {!scheduleMaintenance && !finishMaintenance ? (
          quote.request_status === "NEW" ? (
            <Row></Row>
          ) : quote.request_status === "SCHEDULE" ? (
            <Row className="mt-4">
              <div style={headings}>Scheduled for</div>
              <div style={subHeading}>
                {moment(quote.scheduled_date).format("ddd, MMM DD, YYYY ")} at{" "}
                {quote.scheduled_time}
              </div>
              <Row className="m-3">
                <Col>
                  <Button
                    variant="outline-primary"
                    style={pillButton}
                    // onClick={() => {
                    //   setScheduleMaintenance(true);
                    // }}
                    onClick={() =>
                      navigate(
                        `/maintenanceScheduleRepair/${quote.maintenance_quote_uid}`,
                        {
                          state: { quote: quote },
                        }
                      )
                    }
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
              <Row>
                <Col>
                  {" "}
                  <Button
                    style={bluePillButton}
                    onClick={() => setFinishMaintenance(true)}
                  >
                    Finished
                  </Button>
                </Col>
              </Row>
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
        {!scheduleMaintenance && finishMaintenance ? (
          <Row className="m-3">
            <RepairImages state={imageState} />
            <Form.Group
              className="mt-3 mb-4 p-2"
              style={{
                background: "#F3F3F3 0% 0% no-repeat padding-box",
                borderRadius: "5px",
              }}
            >
              <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                Notes {required}
              </Form.Label>
              <Form.Control
                style={{ borderRadius: 0 }}
                as="textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter Notes"
              />
            </Form.Group>
            <div
              className="text-center"
              style={errorMessage === "" ? hidden : {}}
            >
              <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
            </div>
            <Row>
              <Col>
                {" "}
                <Button style={bluePillButton} onClick={() => finishMain()}>
                  Finished Maintenance
                </Button>
              </Col>
            </Row>
          </Row>
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
      </Container>
    </div>
  );
}

export default MaintenanceQuoteScheduledDetail;
