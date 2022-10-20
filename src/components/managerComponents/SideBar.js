import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { get } from "../../utils/api";
import AppContext from "../../AppContext";
import "./sidebar.css";

function Sidebar() {
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
            {/* <NavLink
                to="/manager-properties"
                className="sidebarButtons"
                activeClassName="sidebarButtonsActive"
                style={({ isActive }) =>
                  isActive ? sidebarButtonsActive : sidebarButtons
                }
              >
                Properties
              </NavLink> */}
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
              utilities
            </NavLink>
            <NavLink
              to="/manager_original"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Reports
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
              to="/manager-profile"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Profile
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
          </div>
        </nav>
      </Row>
    </div>
  );
}

export default Sidebar;
