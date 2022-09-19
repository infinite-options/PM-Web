import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div>
      <Row>
        <nav class="sidebar">
          <div>
            <div className="sidebarLinks">
              <Link to="/manager" class="sidebarButtons">
                Dashboard
              </Link>
              <Link to="/manager-properties" class="sidebarButtons">
                Properties
              </Link>
              <Link to="/OwnersTab" class="sidebarButtons">
                Tenants
              </Link>
              <Link to="/manager-repairs" class="sidebarButtons">
                Maintenance
              </Link>
              <Link to="/renterLanding" class="sidebarButtons">
                Accounting
              </Link>
              <Link to="/addparts" class="sidebarButtons">
                Reports
              </Link>
              <Link to="/manager-utilities" class="sidebarButtons">
                Utilities
              </Link>
            </div>
          </div>
        </nav>
      </Row>
    </div>
  );
}

export default Sidebar;
