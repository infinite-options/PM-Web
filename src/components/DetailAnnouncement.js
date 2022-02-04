import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "./Header";

import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import { headings, subHeading, subText, pillButton } from "../utils/styles";

function DetailAnnouncements(props) {
  const navigate = useNavigate();

  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Announcements"
        // leftText="< Back"
        // leftFn={() => navigate("/tenant")}
        rightText="Done"
        rightFn={() => navigate("/tenant")}
      />
      <Container className="pt-1 mb-4">
        <div>
          <Row style={subHeading} className="mt-1 mx-2">
            Lease Renewal
          </Row>
          <Row style={subText} className="mx-2">
            Click below to renew your lease in time. Your current lease ends on
            January 31, 2021.
          </Row>
          <Row className="mt-3">
            <Col
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button variant="outline-primary" style={pillButton}>
                Click to view new lease
              </Button>
            </Col>
          </Row>
          <Row className="mt-1 mx-2" style={subText}>
            For any questions, contact:
          </Row>
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
        </div>
      </Container>
    </div>
  );
}

export default DetailAnnouncements;
