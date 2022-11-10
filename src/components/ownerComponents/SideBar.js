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
    padding: "20px",
    color: "#c93667",
    textDecoration: "none",
    textTransform: "uppercase",
    fontFamily: "Avenir-Light",
    cursor: "pointer",
    fontWeight: "700",
  };
  let sidebarButtons = {
    padding: "20px",
    color: "#000000",
    textDecoration: "none",
    textTransform: "uppercase",
    fontFamily: "Avenir-Light",
    cursor: "pointer",
  };

  return (
    <div style={{ width: "13rem" }}>
      <Row>
        <nav className="sidebar">
          <div className="sidebarLinks">
            <NavLink
              to="/owner"
              className="sidebarButtons"
              activeClassName="sidebarButtonsActive"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/search-pm"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Contacts
            </NavLink>
            <NavLink
              to="/owner-repairs"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Maintenance
            </NavLink>
            <NavLink
              to="/owner-utilities"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Utilities
            </NavLink>

            <NavLink
              to="/owner-documents"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Documents
            </NavLink>
            <NavLink
              to="/owner-profile"
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

export default SideBar;
