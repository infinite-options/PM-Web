import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import MenuIcon from "../icons/MenuIcon.svg";

import Checkbox from "../components/Checkbox";
import AppContext from "../AppContext";
import "./navbar.css";
import SignupRoleSelection from "./SignupRoleSelection";

export default function HomepageNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { userData } = React.useContext(AppContext);
  const { user } = userData;
  console.log(user);
  const availableRoles = user != null ? user.role.split(",") : [];
  const [selectedRole, setSelectedRole] = React.useState(null);
  const navigateToRole = (role) => {
    // add navigation to correct role pages
    console.log("role in navigatetorole", role);
    console.log(`load ${role}`);
    if (role === "OWNER") {
      navigate("/owner");
    } else if (role === "MANAGER") {
      navigate("/manager");
    } else if (role === "PM_EMPLOYEE") {
      navigate("/manager");
    } else if (role === "TENANT") {
      navigate("/tenant");
    } else if (role === "MAINTENANCE") {
      navigate("/maintenance", { state: { roles: role } });
    } else if (role === "MAINT_EMPLOYEE") {
      navigate("/maintenance", { state: { roles: role } });
    }
  };
  console.log("in landing navbar", availableRoles);
  const selectRole = () => {
    navigateToRole(selectedRole);
  };
  React.useEffect(() => {
    if (availableRoles.length === 1) {
      navigateToRole(availableRoles[0]);
    }
  }, []);
  const longNames = {
    MANAGER: "Property Manager (Owner)",
    PM_EMPLOYEE: "Property Manager (Employee)",
    OWNER: "Property Owner",
    TENANT: "Tenant",
    MAINTENANCE: "Property Maintenance (Owner)",
    MAINT_EMPLOYEE: "Property Maintenance (Employee)",
  };
  React.useState(() => {}, []);
  const handleClick = () => {
    console.log("here handleclick");
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const closeMenuProjects = () => {
    setOpen(false);
  };
  const roleSelection = (r) => {
    let role = r;
    navigateToRole(role);
    // console.log(role);
    // if (role === selectRole) {
    //   console.log("in if");
    //   setSelectedRole(role);
    //   navigateToRole(role);
    // }
  };

  return (
    <nav class="headerNav">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <div>
          {open ? (
            <img
              src={MenuIcon}
              className="nav-icon"
              onClick={() => {
                handleClick();
              }}
            />
          ) : (
            <img
              src={MenuIcon}
              className="nav-icon"
              onClick={() => {
                handleClick();
              }}
            />
          )}
        </div>
        <div className={open ? "nav-links active" : "nav-links"}>
          <Link to="/" class="navButtons" onClick={closeMenuProjects}>
            Home
          </Link>
          <Link to="/buyparts" class="navButtons" onClick={closeMenuProjects}>
            Contact
          </Link>
          <Link to="/addparts" class="navButtons" onClick={closeMenuProjects}>
            Owners
          </Link>
          <Link to="/inventory" class="navButtons" onClick={closeMenuProjects}>
            Property Managers
          </Link>
          <Link to="/editpart" class="navButtons" onClick={closeMenuProjects}>
            Renters
          </Link>
          <Link to="/addparts" class="navButtons" onClick={closeMenuProjects}>
            Maintenace
          </Link>
          <Link to="/inventory" class="navButtons" onClick={closeMenuProjects}>
            Investors
          </Link>
          <Link to="/editpart" class="navButtons" onClick={closeMenuProjects}>
            Blog
          </Link>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        {availableRoles != null
          ? availableRoles.map((role, i) => (
              <div key={i} className={open ? "nav-links active" : "nav-links"}>
                <div
                  onClick={() => {
                    roleSelection(role);
                  }}
                  class="navButtons"
                >
                  <p className="d-inline-block text-left">{longNames[role]}</p>
                </div>
                {/* <Checkbox
                type="CIRCLE"
                checked={role === selectedRole}
                onClick={() => setSelectedRole(role)}
              /> */}
              </div>
            ))
          : ""}
      </div>
    </nav>
  );
}
