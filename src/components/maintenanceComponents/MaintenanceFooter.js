import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { smallGray } from "../../utils/styles";
import Dashboard_Gray from "../../icons/Dashboard_Gray.svg";
import Contacts_Gray from "../../icons/Contacts_Gray.svg";
import Repairs_Gray from "../../icons/Repairs_Gray.svg";
import Profile_Gray from "../../icons/Profile_Gray.svg";
import Expenses_Gray from "../../icons/Expenses_Gray.svg";

import Documents from "../../icons/Tenants.svg";
function MaintenanceFooter(props) {
  const navigate = useNavigate();
  const footerContainer = {
    backgroundColor: "#F5F5F5",
    // borderTop: "1px solid #EAEAEA",
    padding: "10px 10px",
    height: "73px",
  };

  return (
    <div
      style={footerContainer}
      className="w-100 align-items-center fixed-bottom "
    >
      <Row>
        <Col
          className="text-center"
          onClick={() => {
            navigate("/maintenance");
          }}
        >
          <img src={Dashboard_Gray} alt="Dashboard" />
          <p style={smallGray} className="mb-0">
            Dashboard
          </p>
        </Col>
        <Col
          className="text-center"
          onClick={() => {
            navigate("/maintenance-contacts");
          }}
        >
          <img src={Contacts_Gray} alt="Contacts" />
          <p style={smallGray} className="mb-0">
            Contacts
          </p>
        </Col>
        <Col
          className="text-center"
          onClick={() => {
            navigate("/maintenance-history");
          }}
        >
          <img src={Repairs_Gray} alt="Repairs" />
          <p style={smallGray} className="mb-0">
            Maintenance
          </p>
        </Col>

        <Col
          className="text-center p-0"
          onClick={() => {
            navigate("/maintenance-payments");
          }}
        >
          <img src={Expenses_Gray} alt="EXPENSES" />
          <p style={smallGray} className="mb-0">
            Payments
          </p>
        </Col>
        <Col
          className="text-center"
          onClick={() => {
            navigate("/maintenance-documents");
          }}
        >
          <img
            src={Documents}
            alt="Documents"
            style={{ width: "30px", height: "30px" }}
          />
          <p style={smallGray} className="mb-0">
            Documents
          </p>
        </Col>
        <Col
          className="text-center"
          onClick={() => {
            navigate("/maintenance-profile");
          }}
        >
          <img src={Profile_Gray} alt="Profile" />
          <p style={smallGray} className="mb-0">
            Profile
          </p>
        </Col>
      </Row>
    </div>
  );
}

export default MaintenanceFooter;
