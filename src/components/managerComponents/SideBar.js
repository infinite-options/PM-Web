import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
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
    <div>
      <Row>
        <nav class="sidebar">
          <div>
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
                to="/manager-properties"
                className="sidebarButtons"
                activeClassName="sidebarButtonsActive"
                style={({ isActive }) =>
                  isActive ? sidebarButtonsActive : sidebarButtons
                }
              >
                Properties
              </NavLink>
              <NavLink
                to="/OwnersTab"
                className="sidebarButtons"
                style={({ isActive }) =>
                  isActive ? sidebarButtonsActive : sidebarButtons
                }
              >
                Tenants
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
                to="/renterLanding"
                className="sidebarButtons"
                style={({ isActive }) =>
                  isActive ? sidebarButtonsActive : sidebarButtons
                }
              >
                Accounting
              </NavLink>
              <NavLink
                to="/addparts"
                className="sidebarButtons"
                style={({ isActive }) =>
                  isActive ? sidebarButtonsActive : sidebarButtons
                }
              >
                Reports
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
            </div>
          </div>
        </nav>
      </Row>
    </div>
  );
}

export default Sidebar;
