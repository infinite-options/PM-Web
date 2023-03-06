import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Header from "../Header";
import ArrowUp from "../../icons/ArrowUp.svg";
import ArrowDown from "../../icons/ArrowDown.svg";
import HighPriority from "../../icons/highPriority.svg";
import MediumPriority from "../../icons/mediumPriority.svg";
import LowPriority from "../../icons/lowPriority.svg";

import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import {
  headings,
  subHeading,
  subText,
  pillButton,
  formLabel,
  blueBorderButton,
  bluePillButton,
  blueLarge,
} from "../../utils/styles";

function QuotesAccepted(props) {
  const navigate = useNavigate();
  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Repairs"
        leftText="< Back"
        leftFn={() => navigate("/maintenance")}
      />
      <Container className="pt-1 mb-4">
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
        <Row className="mt-2">
          <div style={blueLarge}>Quote Accepted</div>
        </Row>
        <div>
          <Row className="mt-3">
            <Col style={headings}>Replace Shower</Col>
          </Row>
          <Row>
            <div style={subText}>
              $45.00 one-time hardware charge <hr />
            </div>
          </Row>
        </div>
        <div className="mt-2 mb-4">
          <Row>
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
                  navigate("/maintenanceScheduleRepair");
                }}
              >
                Schedule a visit with tenant
              </Button>
            </Col>
          </Row>
        </div>
        <div className="mt-2 mb-4">
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
        <Row className="mt-3 ">
          <Col>
            <div style={headings}>John Parker</div>
            <div style={subText}>Property Manager</div>
          </Col>
          <Col xs={2} className="mt-1 mb-1">
            <img src={Phone} alt="Phone" />
          </Col>
          <Col xs={2} className="mt-1 mb-1">
            <img src={Message} alt="Message" />
          </Col>
          <hr />
        </Row>
      </Container>
    </div>
  );
}

export default QuotesAccepted;
