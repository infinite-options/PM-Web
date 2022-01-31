import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HighPriority from "../icons/highPriority.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import { headings, subHeading, subText, pillButton } from "../utils/styles";

function DetailRepairStatus(props) {
  const navigate = useNavigate();
  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Repairs"
        leftText="+ New"
        leftFn={() => navigate("/repairRequest")}
        rightText="Sort by"
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
                height: " 198px",
                background: "#F5F5F5 0% 0% no-repeat padding-box",
                border: "1px solid #C4C4C4",
                borderRadius: "5px",
              }}
            ></div>
          </Col>
        </Row>
        <Row>
          <div style={headings}>Bathroom leaking</div>
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
          <div style={subText}>The toilet plumbing is leaking at the base.</div>
        </Row>
        <Row className="mt-4">
          <div style={headings}>Scheduled for</div>
          <div style={subHeading}>
            Monday, Jan 12, 2022 at 10:30 AM <hr />
          </div>
        </Row>
        <Row>
          <Col>
            <Button variant="outline-primary" style={pillButton}>
              Reschedule
            </Button>
          </Col>
        </Row>
        <div className="mt-4">
          <Row>
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
            <Col>
              <div style={headings}>Joe</div>
              <div style={subText}>Joe's Plumbing</div>
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

export default DetailRepairStatus;
