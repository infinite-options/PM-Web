import React, { useState } from "react";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { smallGray } from "../../utils/styles";
import Dashboard_Blue from "../../icons/Dashboard_Blue.svg";
import Dashboard_Gray from "../../icons/Dashboard_Gray.svg";
import Contacts_Gray from "../../icons/Contacts_Gray.svg";
import Contacts_Blue from "../../icons/Contacts_Blue.svg";
import Repairs_Blue from "../../icons/Repairs_Blue.svg";
import Repairs_Gray from "../../icons/Repairs_Gray.svg";
import Profile_Blue from "../../icons/Profile_Blue.svg";
import Profile_Gray from "../../icons/Profile_Gray.svg";

import Expenses_Blue from "../../icons/Expenses_Blue.svg";
import Expenses_Gray from "../../icons/Expenses_Gray.svg";
import AppContext from "../../AppContext";

function OwnerFooter(props) {
  const navigate = useNavigate();
  const footerContainer = {
    backgroundColor: "#F5F5F5",
    borderTop: "1px solid #EAEAEA",
    padding: "10px 0",
    height: "83px",
  };

  return (
    <div
      style={footerContainer}
      className="d-flex align-items-center fixed-bottom"
    >
      <Col
        className="text-center"
        onClick={() => {
          navigate("/owner");
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
          navigate("/search-pm");
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
          navigate("/owner-repairs");
        }}
      >
        <img src={Repairs_Gray} alt="Repairs" />
        <p style={smallGray} className="mb-0">
          Maintenance
        </p>
      </Col>
      .
      <Col
        className="text-center"
        onClick={() => {
          navigate("/owner-utilities");
        }}
      >
        <img src={Expenses_Gray} alt="EXPENSES" />
        <p style={smallGray} className="mb-0">
          Utilities
        </p>
      </Col>
      <Col
        className="text-center"
        onClick={() => {
          navigate("/owner-documents");
        }}
      >
        <img src={Profile_Gray} alt="Profile" />
        <p style={smallGray} className="mb-0">
          Documents
        </p>
      </Col>
      <Col
        className="text-center"
        onClick={() => {
          navigate("/owner-profile");
        }}
      >
        <img src={Profile_Gray} alt="Profile" />
        <p style={smallGray} className="mb-0">
          Profile
        </p>
      </Col>
    </div>
  );
}

export default OwnerFooter;
