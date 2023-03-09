import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ServicesProvidedQuotes from "../ServicesProvidedQuotes";
import ConfirmDialog from "../ConfirmDialog";
import AppContext from "../../AppContext";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import { get, put } from "../../utils/api";
import {
  headings,
  subHeading,
  subText,
  formLabel,
  bluePillButton,
  redPillButton,
  squareForm,
  red,
  hidden,
  small,
  smallImg,
} from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "2px 2px",
      border: "0.5px solid grey ",
      wordBreak: "break-word",
    },
    width: "100%",
    tableLayout: "fixed",
  },
});
function DetailQuoteRequest(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const {
    quote,
    addQuote,
    editQuote,
    setEditQuote,
    setAddQuote,
    setQuoteSent,
    setQuoteRefused,
  } = props;

  const [errorMessage, setErrorMessage] = useState("");
  const [sendManager, setSendManager] = useState(false);
  const [serviceState, setServiceState] = React.useState([]);
  const [totalEstimate, setTotalEstimate] = React.useState(0);
  const [earliestAvailability, setEarliestAvailability] =
    useState("No date selected");
  const [eventType, setEventType] = React.useState("1 Hour Job");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [onConfirm, setOnConfirm] = useState(null);
  const onCancel = () => setShowDialog(false);
  const loadQuote = () => {
    let earliest_availability = new Date(quote.earliest_availability)
      .toISOString()
      .slice(0, 10);
    setEarliestAvailability(earliest_availability);

    setServiceState(JSON.parse(quote.services_expenses));
    setEventType(quote.event_type);
  };
  useEffect(() => {
    if (quote.quote_status !== "REQUESTED") {
      loadQuote();
    }
  }, []);

  const sendQuote = async () => {
    if (serviceState.length === 0) {
      setErrorMessage("Please fill out services");
      return;
    }
    const updatedQuote = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      services_expenses: serviceState,
      total_estimate: totalEstimate,
      earliest_availability: earliestAvailability,
      quote_status: "SENT",
      event_type: eventType,
    };
    const response = await put("/maintenanceQuotes", updatedQuote);
    setAddQuote(false);
    setQuoteSent(true);
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
    setEditQuote(false);
    setShowDialog(false);
  };

  const rejectQuote = async () => {
    const updatedQuote = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      quote_status: "REFUSED",
    };
    const response = await put("/maintenanceQuotes", updatedQuote);
    // navigate("/maintenance");
    setShowDialog(false);
    setQuoteRefused(true);
  };

  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  return (
    <div className="mx-4 h-100 d-flex flex-column">
      <ConfirmDialog
        title={dialogText}
        isOpen={showDialog}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
      {quote.quote_status === "REQUESTED" ||
      quote.quote_status === "SENT" ||
      quote.quote_status === "ACCEPTED" ||
      quote.quote_status === "AGREED" ||
      quote.quote_status === "PAID" ||
      quote.quote_status === "REJECTED" ? (
        <Container className="pt-1 mb-4">
          <div>
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
              editQuote={editQuote}
              addQuote={addQuote}
            />
            {addQuote || editQuote ? (
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
            ) : (
              <div className="mt-2 mx-2 mb-4">
                <Row>
                  <div style={headings}>Earliest Availabilty</div>
                </Row>
                <div>
                  <Form.Group className="mt-2 mb-2">
                    <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                      Date
                    </Form.Label>
                    <div> {earliestAvailability}</div>
                  </Form.Group>
                </div>
              </div>
            )}

            <div
              className="text-center"
              style={errorMessage === "" ? hidden : {}}
            >
              <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
            </div>
            {addQuote ? (
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
                      style={bluePillButton}
                      onClick={sendQuote}
                    >
                      Send Quote
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
            ) : (
              ""
            )}

            {editQuote ? (
              <Row className="mt-5 mx-2 mb-4">
                <Col className="d-flex flex-row justify-content-evenly mb-1">
                  <Button
                    variant="outline-primary"
                    style={bluePillButton}
                    onClick={() => {
                      setOnConfirm(() => updateQuote);
                      setDialogText("Your quote will be updated");
                      setShowDialog(true);
                    }}
                  >
                    Update Quote
                  </Button>
                </Col>

                <Col className="d-flex flex-row justify-content-evenly mb-1">
                  <Button
                    variant="outline-primary"
                    style={redPillButton}
                    onClick={() => {
                      setEditQuote(false);
                    }}
                  >
                    Cancel Edit
                  </Button>
                </Col>
              </Row>
            ) : (
              ""
            )}
          </div>
          <Col className="d-flex flex-row justify-content-evenly mb-1">
            <Button
              hidden={
                addQuote ||
                quote.quote_status === "ACCEPTED" ||
                quote.quote_status === "AGREED" ||
                quote.quote_status === "PAID" ||
                quote.quote_status === "REJECTED" ||
                quote.quote_status === "WITHDRAWN"
              }
              variant="outline-primary"
              style={redPillButton}
              onClick={() => {
                setOnConfirm(() => rejectQuote);
                setDialogText(
                  "Your quote will be withdrawn and the request rejected"
                );
                setShowDialog(true);
              }}
            >
              Withdraw Quote
            </Button>
          </Col>
        </Container>
      ) : (
        ""
      )}
    </div>
  );
}

export default DetailQuoteRequest;
