import React, { useState, useContext, useEffect } from "react";
import { Col, Row, Button } from "react-bootstrap";
import ManagerLanding from "../icons/ManagerLanding.png";

export default function renderLanding() {
  return (
    <div>
      <Row>
        <Col></Col>
        <Col xs={8}>
          <div
            style={{
              textAlign: "center",
              font: "normal normal normal 56px Quicksand-Regular",
              padding: "2rem",
            }}
          >
            "Results oriented, full-service property management"{" "}
          </div>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col></Col>
        <Col xs={8}>
          <div
            style={{ textAlign: "center", fontSize: "20px", padding: "2rem" }}
          >
            {" "}
            We think like investors because we are investors. We created
            Manifest to give owners and property managers the tools they need to
            track everything about their properties. From appliance installation
            to warranty tracking, from tenant applications to tenant move-in,
            from rent payments to utility billing, Manifest gives you the
            visibility and tracking you need to manage your business.
          </div>
        </Col>
        <Col></Col>
      </Row>

      <Row style={{ backgroundColor: "#c8c8c8" }}>
        <Col></Col>
        <Col xs={8}>
          <div
            style={{
              textAlign: "center",
              font: "normal normal normal 56px Quicksand-Regular",
              color: "#ffffff",
              padding: "2rem",
            }}
          >
            The Manifest Software Solution
          </div>
          <img src={ManagerLanding} style={{ padding: "2rem" }} />
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col></Col>
        <Col
          xs={8}
          className="d-flex flex-column justify-content-center align-items-center p-2"
        >
          <div
            style={{
              textAlign: "center",
              font: "normal normal normal 40px Quicksand-Regular",
            }}
          >
            Get a free quote
          </div>
          <div
            style={{
              textAlign: "center",
              font: "normal normal normal 20px Quicksand-Regular",
            }}
          >
            Like what you see? Get in touch to learn more.
          </div>
          <Row style={{ padding: "2rem" }}>
            <Col className="d-flex flex-column">
              <label>First Name:</label>
              <input type="text" style={{ border: "1px solid black" }} />
              <label>Last Name:</label>
              <input type="text" style={{ border: "1px solid black" }} />
              <label>Email:</label>
              <input type="email" style={{ border: "1px solid black" }} />
            </Col>{" "}
            <Col className="d-flex flex-column">
              <label>Message:</label>
              <textarea rows="5" style={{ border: "1px solid black" }} />
            </Col>
          </Row>
          <Button
            style={{
              backgroundColor: "#628191",
              borderColor: "#628191",
              // borderRadius: "10px",
              color: "white",
              width: "10rem",
              font: "normal normal normal 18px Avenir-Light",
            }}
          >
            Send
          </Button>
        </Col>
        <Col></Col>
      </Row>
    </div>
  );
}
