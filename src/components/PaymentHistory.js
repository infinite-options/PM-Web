import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../components/Header";
import DocumentOpen from "../icons/documentOpen.svg";
import {
  subHeading,
  subText,
  headings,
  blueRight,
  redRight,
} from "../utils/styles";

function PaymentHistory(props) {
  const navigate = useNavigate();
  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Payment"
        leftText="< Back"
        leftFn={() => navigate("/tenant")}
      />
      <Container>
        <div>
          <Row className="mt-4 mb-1 mx-2">
            <Col style={subHeading}> December 2021</Col>
            <Col style={redRight}>$2000.00</Col>
          </Row>
          <div
            style={{ border: "1px solid #707070" }}
            className="mt-2 mx-2 p-2"
          >
            <Row style={subHeading} className="mx-2">
              <Col>Rent for Dec</Col>
            </Row>
            <Row className="mx-2">
              <Col style={subText}>Dec 2, 2021</Col>
              <Col style={blueRight} className="mt-2">
                $1500.00
              </Col>
            </Row>
          </div>
          <div
            style={{ border: "1px solid #707070" }}
            className="mt-2 mx-2 p-2"
          >
            <Row style={subHeading} className="mx-2 ">
              <Col>Fee for Dec</Col>
            </Row>
            <Row className="mx-2">
              <Col style={subText}>Dec 10, 2021</Col>
              <Col style={blueRight} className="mt-2">
                $500.00
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <Row className="mt-4 mb-1 mx-2">
            <Col style={subHeading}>November 2021</Col>

            <Col style={redRight}>$1500.00</Col>
          </Row>
          <div
            style={{ border: "1px solid #707070" }}
            className="mt-2 mx-2 p-2"
          >
            <Row style={subHeading} className="mx-2">
              <Col>Rent for Nov</Col>
            </Row>
            <Row className="mx-2">
              <Col style={subText}>Nov 2, 2021</Col>
              <Col style={blueRight} className="mt-2">
                $1500.00
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default PaymentHistory;
