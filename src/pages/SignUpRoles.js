import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Button, Container } from "react-bootstrap";

import PM_icon from "../icons/PM_icon.svg";

import { bluePillButton } from "../utils/styles";

function SignupRoles() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center h-100">
      <Container fluid className="w-100 text-center py-5">
        <Row className="d-flex justify-content-center py-5">
          <img src={PM_icon} alt="PM" height="150px" />
          <p className="text-primary">Property Management</p>
        </Row>

        <Row className="d-flex justify-content-center py-5">
          <Col>
            <p className="pb-0">
              <b>Don't have an account?</b>
            </p>
            <b />
            <Button style={bluePillButton} onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </Col>
          <Col>
            <p className="pb-0">
              <b>Add additional functionality to an existing account?</b>
            </p>
            <Button
              style={bluePillButton}
              onClick={() => navigate("/signupexisting")}
            >
              Existing Account
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SignupRoles;
