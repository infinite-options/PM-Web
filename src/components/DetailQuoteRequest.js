import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
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
import {
  headings,
  subHeading,
  subText,
  pillButton,
  formLabel,
  blueBorderButton,
  bluePillButton,
  redPillButton,
} from "../utils/styles";

function DetailQuote(props) {
  const navigate = useNavigate();
  const [expandPaymentTerm, setExpandPaymentTerm] = useState(false);
  const [expandEventType, setExpandEventType] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [addService, setAddService] = useState(false);
  const [addDate, setAddDate] = useState(false);
  const [addEventType, setAddEventType] = useState(false);
  const [sendManager, setSendManager] = useState(false);
  const [quoteAccepted, setQuoteAccepted] = useState(false);
  const [quoteRejected, setQuoteRejected] = useState(false);
  console.log(addService, showAddService);
  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Repairs"
        leftText="< Back"
        leftFn={() => navigate("/maintenance")}
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
            <div
              style={{
                width: "350px",
                height: "198px",
                background: "#F5F5F5 0% 0% no-repeat padding-box",
                border: "1px solid #C4C4C4",
                borderRadius: "5px",
              }}
            ></div>
          </Col>
        </Row>
        <Row>
          <div style={headings}>Broken Shower</div>
        </Row>
        <Row>
          <div style={subText}>213 Parkland Ave, San Jose, CA 90820</div>
        </Row>
        <Row className="mt-2">
          <Col>
            <img src={HighPriority} />
          </Col>
        </Row>
        <Row className="mt-2">
          <div style={subText}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam
          </div>
        </Row>

        <div>
          <div hidden={!addService}>
            <Row className="mt-3">
              <Col style={headings}>Replace Shower</Col>
              <Col xs={3}>
                <img
                  src={EditIcon}
                  alt="Edit"
                  className="px-1 mx-2"
                  //onClick={() => editContact(i)}
                />
                <img
                  src={DeleteIcon}
                  alt="Delete"
                  className="px-1 mx-2"
                  //onClick={() => deleteContact(i)}
                />
              </Col>
            </Row>
            <Row>
              <div style={subText}>
                $45.00 one-time hardware charge <hr />
              </div>
            </Row>
            <Row className="mb-3">
              <Col>
                <Button
                  variant="outline-primary"
                  style={blueBorderButton}
                  onClick={() => setShowAddService(false)}
                >
                  Add Another Service / Expense
                </Button>
              </Col>
            </Row>
          </div>

          <div hidden={showAddService}>
            <div className="mt-2 mx-2">
              <Form.Group className="mt-3 mb-2">
                <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                  Service notes
                </Form.Label>
                <Form.Control
                  style={{ borderRadius: 0 }}
                  //ref={requestTitleRef}
                  placeholder="Shower labor cost"
                />
              </Form.Group>

              <Row>
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Form.Group className="mt-3 mb-4">
                    <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                      Fees
                    </Form.Label>
                    <Form.Control
                      style={{ borderRadius: 0 }}
                      //ref={requestTitleRef}
                      placeholder="$20.00"
                    />
                  </Form.Group>
                </Col>
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                  onClick={() => setExpandPaymentTerm(!expandPaymentTerm)}
                >
                  <Form.Group className="mt-3 mb-4">
                    <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                      Payment Term
                    </Form.Label>

                    <div
                      className="d-flex justify-content-between"
                      style={{ border: "1px solid #777777", padding: "6px" }}
                    >
                      One-time
                      <img
                        src={expandPaymentTerm ? ArrowUp : ArrowDown}
                        alt="Expand"
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </div>
            <div className="mt-2 mx-2">
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
                    onClick={() => setShowAddService(false)}
                  >
                    Cancel
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
                    style={bluePillButton}
                    onClick={() => {
                      setAddService(true);
                      setShowAddService(true);
                    }}
                  >
                    Add Quote
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div className="mt-2 mx-2 mb-4" hidden={!addDate}>
          <Row>
            <div style={headings}>Earliest Availabilty</div>
          </Row>
          <div>
            <Form.Group className="mt-2 mb-2">
              <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                Date
              </Form.Label>
              <div>Monday, Jan 3, 2022</div>
            </Form.Group>
          </div>
        </div>

        <div className="mt-2 mx-2 mb-4" hidden={addDate}>
          <Row>
            <div style={headings}>Earliest Availabilty</div>
          </Row>
          <div className="mt-2 mx-2">
            <Form.Group className="mt-3 mb-2">
              <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                Date
              </Form.Label>
              <Form.Control style={{ borderRadius: 0 }} type="date" />
            </Form.Group>
            <div className="mt-2 mx-2">
              <Row>
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Button style={pillButton} variant="outline-primary">
                    Cancel
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
                    style={bluePillButton}
                    onClick={() => setAddDate(!addDate)}
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div className="mt-2 mx-2 mb-4" hidden={!addEventType}>
          <Row className="mt-3">
            <Col style={headings}>Event Calendar Shared</Col>
            <Col xs={1}>
              <img
                src={EditIcon}
                alt="Edit"
                className="mx-2 px-1"
                style={{ float: "right" }}

                //onClick={() => editContact(i)}
              />
            </Col>
            <Col xs={1}>
              <img
                src={DeleteIcon}
                alt="Delete"
                className="mx-2 px-1"
                style={{ float: "right" }}
                //onClick={() => deleteContact(i)}
              />
            </Col>
          </Row>
          <Row>
            <div style={subText}>
              2 hour job <hr />
            </div>
          </Row>
          <Row className="mb-3">
            <Col>
              <Button variant="outline-primary" style={blueBorderButton}>
                View Calendar
              </Button>
            </Col>
          </Row>
        </div>
        <div className="mt-2 mx-2 mb-4" hidden={addEventType}>
          <Row>
            <div style={headings}>Pick Event Type to share calendar</div>
          </Row>
          <div className="mt-2 mx-2">
            <Form.Group className="mt-3 mb-2">
              <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                Event Type
              </Form.Label>
              <div
                className="d-flex justify-content-between"
                style={{ border: "1px solid #777777", padding: "6px" }}
                onClick={() => setExpandEventType(!expandEventType)}
              >
                2 hour job
                <img src={expandEventType ? ArrowUp : ArrowDown} alt="Expand" />
              </div>
            </Form.Group>
            <div className="mt-2 mx-2 mb-4">
              <Row>
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Button style={pillButton} variant="outline-primary">
                    Cancel
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
                    style={bluePillButton}
                    onClick={() => setAddEventType(!addEventType)}
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </div>

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
                onClick={() => setSendManager(true)}
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
                onClick={() => {
                  setQuoteRejected(true);
                }}
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
