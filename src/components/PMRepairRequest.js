import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Checkbox from "./Checkbox";
import HighPriority from "../icons/highPriority.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import Reject from "../icons/Reject.svg";
import AppContext from "../AppContext";
import Header from "../components/Header";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import {
  actions,
  headings,
  pillButton,
  redPill,
  subHeading,
  subText,
  blueBorderButton,
  redPillButton,
  formLabel,
  bluePillButton,
  red,
  small,
  blue,
} from "../utils/styles";
import { textAlign } from "@mui/system";

function PMRepairRequest(props) {
  const navigate = useNavigate();
  const [morePictures, setMorePictures] = useState(false);
  const [canReschedule, setCanReschedule] = useState(false);
  const [cannotReschedule, setCannotReschedule] = useState(false);
  const [requestQuote, setRequestQuote] = useState(false);
  const [scheduleMaintenance, setScheduleMaintenance] = useState(false);
  return (
    <div className="h-100">
      <Header
        title="Repairs"
        leftText={scheduleMaintenance || requestQuote ? null : "< Back"}
        //leftFn={() => navigate("/maintenance")}
        rightText={scheduleMaintenance || requestQuote ? null : "Edit"}
      />

      <Container
        className="pt-1 mb-4"
        hidden={scheduleMaintenance || requestQuote}
      >
        <Row style={headings}>
          <div>New Repair Request</div>
        </Row>
        <Row className="pt-1 mb-4">
          <div style={subHeading}>Title (character limit: 15)</div>
          <div style={subText}>Bathroom leaking</div>
        </Row>
        <Row className="pt-1 mb-4">
          <div style={subHeading}>Description</div>
          <div style={subText}>The toilet plumbing is leaking at the base.</div>
        </Row>
        <Row className="pt-1 mb-4">
          <div className="pt-1 mb-2" style={subHeading}>
            Pictures from tenant
          </div>
          <div
            className="pt-1 mb-2"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Col xs={3} style={actions}></Col>
            <Col xs={3} style={actions}></Col>
            <Col xs={3} style={actions}></Col>
          </div>
          <div className="pt-1 mb-2">
            <Button
              style={pillButton}
              variant="outline-primary"
              onClick={() => setMorePictures(!morePictures)}
            >
              Request more pictures
            </Button>
          </div>
        </Row>
        <Row>
          <Row className="pt-1 mb-4" hidden={!morePictures}>
            <div className="pt-1 mb-2" style={subHeading}>
              Request more pictures
            </div>

            <Form.Group className="mt-3 mb-4">
              <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                Description of what kind of pictures needed
              </Form.Label>
              <Form.Control
                style={{ borderRadius: 0 }}
                //ref={requestTitleRef}
                placeholder="Can you pls share more pictures with the Shower model number?"
                as="textarea"
              />
            </Form.Group>

            <Row className="pt-1 mb-2">
              <Col
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  style={pillButton}
                  variant="outline-primary"
                  onClick={() => setMorePictures(false)}
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
                <Button style={bluePillButton}>Send Request</Button>
              </Col>
            </Row>
          </Row>
        </Row>
        <Row className="pt-1 mb-2">
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
        <Row className="pt-1 mb-2">
          <div style={subHeading} className="pt-1 mb-2">
            Tenant can reschedule this job as needed
          </div>
          <Col className="pt-1 mx-2">
            <Row>
              <Checkbox
                type="CIRCLE"
                onClick={(checked) =>
                  checked ? setCanReschedule(true) : setCannotReschedule(false)
                }
              />
              Yes
            </Row>
          </Col>
          <Col className="pt-1 mx-2">
            <Row>
              <Checkbox
                type="CIRCLE"
                onClick={(checked) =>
                  checked ? setCannotReschedule(true) : setCanReschedule(false)
                }
              />
              No
            </Row>
          </Col>
        </Row>
        <Row className="pt-1 mb-2">
          <Col
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              style={bluePillButton}
              onClick={() => setScheduleMaintenance(true)}
            >
              Schedule Maintenance
            </Button>
          </Col>
        </Row>
        <Row className="pt-1 mb-2">
          <Col
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              style={pillButton}
              variant="outline-primary"
              onClick={() => setRequestQuote(true)}
            >
              Request quote from maintenance
            </Button>
          </Col>
        </Row>
      </Container>
      <Container hidden={!requestQuote}>
        <Row style={headings}>
          <div>Select businesses to request a quote:</div>
        </Row>

        <div>
          <Row className="mt-2">
            <Col xs={2} className="mt-2">
              <Row>
                <Checkbox
                  type="BOX"
                  //onClick={() => setUsePreviousAddress(!usePreviousAddress)}
                />
              </Row>
            </Col>
            <Col>
              <Row style={headings}>Hector’s plumbing</Row>
              <Row style={subText}>
                Services: Toilet repair, Plumbing, Kitchen repair
              </Row>
              <Row
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  //verticalAlign: "middle",
                }}
              >
                <Col style={blue}> Manager: Jane Doe</Col>
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    //verticalAlign: "middle",
                  }}
                >
                  <img src={Phone} style={{ width: "30px", height: "30px" }} />
                  <img
                    src={Message}
                    style={{ width: "30px", height: "30px" }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xs={2} className="mt-2">
              <Row>
                <Checkbox
                  type="BOX"
                  //onClick={() => setUsePreviousAddress(!usePreviousAddress)}
                />
              </Row>
            </Col>
            <Col>
              <Row style={headings}>Joe's plumbing</Row>
              <Row style={subText}>
                Services: Toilet repair, Plumbing, Kitchen repair
              </Row>
              <Row
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  //verticalAlign: "middle",
                }}
              >
                <Col style={blue}> Manager: Jane Doe</Col>
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    //verticalAlign: "middle",
                  }}
                >
                  <img src={Phone} style={{ width: "30px", height: "30px" }} />
                  <img
                    src={Message}
                    style={{ width: "30px", height: "30px" }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xs={2} className="mt-2">
              <Row>
                <Checkbox
                  type="BOX"
                  //onClick={() => setUsePreviousAddress(!usePreviousAddress)}
                />
              </Row>
            </Col>
            <Col>
              <Row style={headings}>Water Doctors</Row>
              <Row style={subText}>
                Services: Toilet repair, Plumbing, Kitchen repair
              </Row>
              <Row
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  //verticalAlign: "middle",
                }}
              >
                <Col style={blue}> Manager: Jane Doe</Col>
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    //verticalAlign: "middle",
                  }}
                >
                  <img src={Phone} style={{ width: "30px", height: "30px" }} />
                  <img
                    src={Message}
                    style={{ width: "30px", height: "30px" }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <Row className="mt-4">
          <Col
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            {" "}
            <Button style={bluePillButton}>Request Quote from Business</Button>
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
          <Col
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            {" "}
            <Button style={bluePillButton}>Schedule Maintenace</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PMRepairRequest;
