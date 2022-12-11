import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { get } from "../../utils/api";
import AppContext from "../../AppContext";
import "./sidebar.css";

export default function SideBar(props) {
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
  const navigate = useNavigate();

  return (
    <div style={{ width: "11rem", height: "100%" }}>
      <Row style={{ width: "11rem", height: "100%" }}>
        <nav class="sidebar">
          <div className="sidebarLinks">
            <NavLink
              to="/tenant"
              className="sidebarButtons"
              activeClassName="sidebarButtonsActive"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/tenant-payments"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Payments
            </NavLink>
            <NavLink
              to="/tenant-repairs"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Maintenance
            </NavLink>
            <NavLink
              to="/tenantAvailableProperties"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Search Properties
            </NavLink>
            <NavLink
              to="/tenant-announcements"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Announcements
            </NavLink>
            <NavLink
              to="/tenant-documents"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Documents
            </NavLink>
            <NavLink
              to="/tenantProfile"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Profile
            </NavLink>
          </div>
        </nav>
      </Row>
    </div>
  );
}
