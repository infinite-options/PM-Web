import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Header from "../components/Header";
import ArrowUp from "../icons/ArrowUp.svg";
import ArrowDown from "../icons/ArrowDown.svg";
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
} from "../utils/styles";

function DetailQuote(props) {
  const navigate = useNavigate();
  const [expandPaymentTerm, setExpandPaymentTerm] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [addDate, setAddDate] = useState(false);
  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Repairs"
        leftText="< Back"
        leftFn={() => navigate("/maintenance")}
      />
      <Container className="pt-1 mb-4" style={{ minHeight: "100%" }}>
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
            <img src={HighPriority} alt="high priority" />
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
                alt="Delete Icon"
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
                onClick={() => setShowAddService(!showAddService)}
              >
                Add Another Service / Expense
              </Button>
            </Col>
          </Row>
          <div hidden={!showAddService}>
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
                  <Button variant="outline-primary" style={bluePillButton}>
                    Add Quote
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div className="mt-2 mx-2">
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
                  <Button style={bluePillButton}>Save</Button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div className="mt-2 mx-2">
          <Row>
            <div style={headings}>Before Pictures</div>
          </Row>
          <Row>
            <div style={subText}>
              Take some pictures before starting the job. <hr />
            </div>
          </Row>
          <Row>
            <Col>
              <Button variant="outline-primary" style={blueBorderButton}>
                Upload Photos
              </Button>
            </Col>
          </Row>
        </div>
        <div className="mt-2 mx-2">
          <Row>
            <div style={headings}>After Pictures</div>
          </Row>
          <Row>
            <div style={subText}>
              Take some pictures after you’re done <hr />
            </div>
          </Row>
          <Row>
            <Col>
              <Button variant="outline-primary" style={blueBorderButton}>
                Upload Photos
              </Button>
            </Col>
          </Row>
        </div>
        <div className="mt-2 mx-2">
          <Row>
            <div style={headings}>Supplies Required</div>
          </Row>
          <Row>
            <div style={subText}>
              Door Knob
              <br /> Hammer
              <br /> Screwdriver <br /> Extra Screws <hr />
            </div>
          </Row>
        </div>
        <div className="mt-2 mx-2">
          <Row>
            <div style={headings}>Recorded Job Time</div>
          </Row>
          <Row>
            <div style={subText}>
              Start time: <br /> End Time: <hr />
            </div>
          </Row>
        </div>
        <div className="mt-2 mx-2">
          <Form.Group className="mt-3 mb-2">
            <Form.Label style={headings} as="h5" className="ms-1 mb-0">
              Service notes
            </Form.Label>
            <Form.Control
              style={{ borderRadius: 0 }}
              //ref={requestTitleRef}
              //placeholder="Shower labor cost"
              as="textarea"
            />
          </Form.Group>
        </div>
        <div className="mt-2 mx-2 mb-4">
          <Row>
            <Col>
              <Button variant="outline-primary" style={pillButton}>
                Save
              </Button>
            </Col>
            <Col>
              {" "}
              <Button
                variant="outline-primary"
                style={bluePillButton}
                onClick={() => {
                  navigate("/jobsCompleted");
                }}
              >
                Job Completed
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default DetailQuote;
