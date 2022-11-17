import React, { useState } from "react";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { smallBlue, smallGray } from "../../utils/styles";
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
  const [isActive, setIsActive] = useState("Dashboard");
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
          setIsActive("Dashboard");
          navigate("/owner");
        }}
      >
        <img
          src={isActive === "Dashboard" ? Dashboard_Blue : Dashboard_Gray}
          alt="Dashboard"
        />
        <p
          style={isActive === "Dashboard" ? smallBlue : smallGray}
          className="mb-0"
        >
          Dashboard
        </p>
      </Col>
      <Col
        className="text-center"
        onClick={() => {
          setIsActive("Utilities");
          navigate("/owner-utilities");
        }}
      >
        <img
          src={isActive === "Utilities" ? Expenses_Blue : Expenses_Gray}
          alt="EXPENSES"
        />
        <p
          style={isActive === "Utilities" ? smallBlue : smallGray}
          className="mb-0"
        >
          Utilities
        </p>
      </Col>
      <Col
        className="text-center"
        onClick={() => {
          setIsActive("Contacts");
          navigate("/search-pm");
        }}
      >
        <img
          src={isActive === "Contacts" ? Contacts_Blue : Contacts_Gray}
          alt="Contacts"
        />
        <p
          style={isActive === "Contacts" ? smallBlue : smallGray}
          className="mb-0"
        >
          Contacts
        </p>
      </Col>
      <Col
        className="text-center"
        onClick={() => {
          setIsActive("Maintenance");
          navigate("/owner-repairs");
        }}
      >
        <img
          src={isActive === "Maintenance" ? Repairs_Blue : Repairs_Gray}
          alt="Repairs"
        />
        <p
          style={isActive === "Maintenance" ? smallBlue : smallGray}
          className="mb-0"
        >
          Maintenance
        </p>
      </Col>
      <Col
        className="text-center"
        onClick={() => {
          setIsActive("Documents");
          navigate("/owner-documents");
        }}
      >
        <img
          src={isActive === "Documents" ? Profile_Blue : Profile_Gray}
          alt="Profile"
        />
        <p
          style={isActive === "Documents" ? smallBlue : smallGray}
          className="mb-0"
        >
          Documents
        </p>
      </Col>
      <Col
        className="text-center"
        onClick={() => {
          setIsActive("Profile");
          navigate("/owner-profile");
        }}
      >
        <img
          src={isActive === "Profile" ? Profile_Blue : Profile_Gray}
          alt="Profile"
        />
        <p
          style={isActive === "Profile" ? smallBlue : smallGray}
          className="mb-0"
        >
          Profile
        </p>
      </Col>
    </div>
  );
}

export default OwnerFooter;
