import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import MenuIcon from "../icons/MenuIcon.svg";
import "./navbar.css";

export default function HomepageNavbar() {
  const [open, setOpen] = useState(false);

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
          <Link to="/renterLanding" class="navButtons" onClick={closeMenuProjects}>
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
    </nav>
  );
}
