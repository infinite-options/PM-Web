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
import Announcements from "../../icons/announcements.svg";
import SearchProperties_Gray from "../../icons/SearchProperties_Gray.svg";

function ManagerFooter(props) {
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
            navigate("/tenant");
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
            navigate("/tenant-payments");
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
            navigate("/tenant-repairs");
          }}
        >
          <img src={Repairs_Gray} alt="Repairs" />
          <p style={smallGray} className="mb-0">
            Maintenance
          </p>
        </Col>
        <Col
          className="text-center"
          onClick={() => {
            navigate("/tenantAvailableProperties");
          }}
        >
          <img
            src={SearchProperties_Gray}
            alt="EXPENSES"
            style={{ width: "30px", height: "30px" }}
          />
          <p style={smallGray} className="mb-0">
            Search
          </p>
        </Col>
        <Col
          className="text-center"
          onClick={() => {
            navigate("/tenant-announcements");
          }}
        >
          <img
            src={Announcements}
            alt="Announcements"
            style={{ width: "30px", height: "30px" }}
          />
          <p style={smallGray} className="mb-0">
            Announcements
          </p>
        </Col>
        <Col
          className="text-center"
          onClick={() => {
            navigate("/tenant-documents");
          }}
        >
          <img
            src={Documents}
            alt="documents"
            style={{ width: "30px", height: "30px" }}
          />
          <p style={smallGray} className="mb-0">
            Documents
          </p>
        </Col>
        <Col
          className="text-center"
          onClick={() => {
            navigate("/tenantProfile");
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

export default ManagerFooter;
