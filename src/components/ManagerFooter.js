import React from "react";
import { Col } from "react-bootstrap";
import { smallBlue, smallGray } from "../utils/styles";
import Dashboard_Blue from "../icons/Dashboard_Blue.svg";
import Dashboard_Gray from "../icons/Dashboard_Gray.svg";
import Roles_Blue from "../icons/Roles_Blue.svg";
import Roles_Gray from "../icons/Roles_Gray.svg";
import Repairs_Blue from "../icons/Repairs_Blue.svg";
import Repairs_Gray from "../icons/Repairs_Gray.svg";
import Profile_Blue from "../icons/Profile_Blue.svg";
import Profile_Gray from "../icons/Profile_Gray.svg";

import Expenses_Blue from "../icons/Expenses_Blue.svg";
import Expenses_Gray from "../icons/Expenses_Gray.svg";
import AppContext from "../AppContext";

function ManagerFooter(props) {
  const { tab, setTab, properties } = props;
  const { logout } = React.useContext(AppContext);
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
      <Col className="text-center" onClick={() => setTab("DASHBOARD")}>
        <img
          src={tab === "DASHBOARD" ? Dashboard_Blue : Dashboard_Gray}
          alt="Dashboard"
        />
        <p style={tab === "DASHBOARD" ? smallBlue : smallGray} className="mb-0">
          Dashboard
        </p>
      </Col>
      <Col className="text-center" onClick={() => setTab("EXPENSES")}>
        <img
          src={tab === "EXPENSES" ? Expenses_Blue : Expenses_Gray}
          alt="EXPENSES"
        />
        <p style={tab === "EXPENSES" ? smallBlue : smallGray} className="mb-0">
          Expenses
        </p>
      </Col>
      <Col
        className="text-center"
        onClick={() => {
          setTab("REPAIRS");
        }}
      >
        <img
          src={tab === "REPAIRS" ? Repairs_Blue : Repairs_Gray}
          alt="Repairs"
        />
        <p style={tab === "REPAIRS" ? smallBlue : smallGray} className="mb-0">
          Repairs
        </p>
      </Col>
      <Col className="text-center" onClick={() => setTab("PROFILE")}>
        <img
          src={tab === "PROFILE" ? Profile_Blue : Profile_Gray}
          alt="Profile"
        />
        <p style={tab === "PROFILE" ? smallBlue : smallGray} className="mb-0">
          Profile
        </p>
      </Col>
    </div>
  );
}

export default ManagerFooter;
