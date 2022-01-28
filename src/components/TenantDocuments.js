import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../components/Header";
import DocumentOpen from "../icons/documentOpen.svg";
import { subHeading, subText } from "../utils/styles";

function TenantDocuments(props) {
  const navigate = useNavigate();
  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Documents"
        leftText="< Back"
        leftFn={() => navigate("/tenant")}
      />
      <Container className="pt-1 mb-4">
        <Row>
          <Col xs={10}>
            <div style={subHeading}>Lease 2021</div>
            <div style={subText}>Lease for Apt 204, signed</div>
          </Col>
          <Col>
            {" "}
            <img src={DocumentOpen} />
          </Col>
          <hr />
        </Row>
        <Row>
          <Col xs={10}>
            <div style={subHeading}>Background Check</div>
            <div style={subText}>Lease for Apt 204, signed</div>
          </Col>
          <Col>
            <img src={DocumentOpen} />
          </Col>
          <hr />
        </Row>
      </Container>
    </div>
  );
}

export default TenantDocuments;
