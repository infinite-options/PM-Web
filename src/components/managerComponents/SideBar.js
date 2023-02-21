import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { get } from "../../utils/api";
import AppContext from "../../AppContext";
import "./sidebar.css";

function SideBar() {
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);

  let sidebarButtonsActive = {
    paddingRight: "20px",
    maxHeight: "4rem",
    minHeight: "3rem",
    color: "#c93667",
    textDecoration: "none",
    textTransform: "uppercase",
    fontFamily: "Avenir-Light",
    cursor: "pointer",
    fontWeight: "700",
  };
  let sidebarButtons = {
    paddingRight: "20px",
    maxHeight: "4rem",
    minHeight: "3rem",
    color: "#000000",
    textDecoration: "none",
    textTransform: "uppercase",
    fontFamily: "Avenir-Light",
    cursor: "pointer",
  };

  return (
    <div style={{ width: "11rem", height: "100%" }}>
      <Row style={{ width: "11rem", height: "100%" }}>
        <nav class="sidebar">
          <div className="sidebarLinks">
            <NavLink
              to="/manager"
              className="sidebarButtons"
              activeClassName="sidebarButtonsActive"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/tenant-list"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Tenants
            </NavLink>
            <NavLink
              to="/owner-list"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Owners
            </NavLink>
            <NavLink
              to="/manager-repairs"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Maintenance
            </NavLink>
            <NavLink
              to="/manager-utilities"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Utilities
            </NavLink>
            <NavLink
              to="/manager-payments"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Payments
            </NavLink>
            <NavLink
              to="/manager-announcements"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Announcements
            </NavLink>
            <NavLink
              to="/manager-documents"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Documents
            </NavLink>
            <NavLink
              to="/manager-profile"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Profile
            </NavLink>
            {/* <NavLink
              to="/manager-cashflow"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Cashflow
            </NavLink> */}
          </div>
        </nav>
      </Row>
    </div>
  );
}

export default SideBar;
