import React from "react";
import { Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./sideBar.css";

function SideBar() {
  let sidebarButtonsActive = {
    paddingRight: "20px",
    color: "#c93667",
    textDecoration: "none",
    textTransform: "uppercase",
    fontFamily: "Avenir-Light",
    cursor: "pointer",
    fontWeight: "700",
  };
  let sidebarButtons = {
    paddingRight: "20px",
    color: "#000000",
    textDecoration: "none",
    textTransform: "uppercase",
    fontFamily: "Avenir-Light",
    cursor: "pointer",
  };

  return (
    <div style={{ width: "10rem", backgroundColor: "#229ebc", height: "100%" }}>
      <Row
        style={{ width: "10rem", backgroundColor: "#229ebc", height: "100%" }}
      >
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
