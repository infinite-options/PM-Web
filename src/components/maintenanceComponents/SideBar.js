import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { get } from "../../utils/api";
import AppContext from "../../AppContext";
import "./sidebarMaintenance.css";

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
    <div
      style={{
        width: "11rem",
        height: "100%",
      }}
    >
      <Row
        style={{
          width: "11rem",
          height: "100%",
        }}
      >
        <nav className="sidebar">
          <div className="sidebarLinks">
            <NavLink
              to="/maintenance"
              className="sidebarButtons"
              activeClassName="sidebarButtonsActive"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/maintenance-contacts"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Contacts
            </NavLink>
            <NavLink
              to="/maintenance-history"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Maintenance History
            </NavLink>
            <NavLink
              to="/maintenance-payments"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Payments
            </NavLink>
            <NavLink
              to="/maintenance-documents"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Documents
            </NavLink>
            <NavLink
              to="/maintenance-profile"
              className="sidebarButtons"
              style={({ isActive }) =>
                isActive ? sidebarButtonsActive : sidebarButtons
              }
            >
              Profile
            </NavLink>{" "}
            {/* <NavLink
              to="/owner-cashflow"
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
