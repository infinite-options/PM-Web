import React from "react";
import { Col } from "react-bootstrap";
import { smallBlue, smallGray } from "../utils/styles";
import Dashboard_Blue from "../icons/Dashboard_Blue.svg";
import Dashboard_Gray from "../icons/Dashboard_Gray.svg";
import Roles_Blue from "../icons/Roles_Blue.svg";
import Roles_Gray from "../icons/Roles_Gray.svg";
import Profile_Blue from "../icons/Profile_Blue.svg";
import Profile_Gray from "../icons/Profile_Gray.svg";
import RepairRequest from "../icons/repair_request.svg";
import SearchPM from "../icons/searchPM.svg";
import AppContext from "../AppContext";
import { useNavigate } from "react-router-dom";

function Footer(props) {
  const { tab, setTab, profile } = props;
  const { logout } = React.useContext(AppContext);
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
        <Col className="text-center" onClick={() => setTab("DASHBOARD")}>
          <img
              src={tab === "DASHBOARD" ? Dashboard_Blue : Dashboard_Gray}
              alt="Dashboard"
          />
          <p style={tab === "DASHBOARD" ? smallBlue : smallGray} className="mb-0">
            Dashboard
          </p>
        </Col>
        <Col className="text-center" onClick={() => navigate("/tenantAvailableProperties")}>
          <img
              //TODO: Need a grey version for this image
              src={tab === "SEARCH" ? SearchPM : SearchPM}
              alt="Profile"
              height = "33px"
          />
          <p style={tab === "SEARCH" ? smallBlue : smallGray} className="mb-0">

            Search
          </p>
        </Col>
        <Col className="text-center" onClick={() => navigate(`/${profile.property_uid}/repairStatus`)}>
          <img
              // TODO: Need a grey version for this image
              src={tab === "REPAIRS" ? RepairRequest : RepairRequest}
              alt="Profile"
              height = "33px"
          />
          <p style={tab === "REPAIRS" ? smallBlue : smallGray} className="mb-0">

            Repairs
          </p>
        </Col>
        <Col className="text-center" onClick={() => setTab("ROLES")}>
          <img src={tab === "ROLES" ? Roles_Blue : Roles_Gray} alt="Roles" />
          <p style={tab === "ROLES" ? smallBlue : smallGray} className="mb-0">
            Roles
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

export default Footer;
