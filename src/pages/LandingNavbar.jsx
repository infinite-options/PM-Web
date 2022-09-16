import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Landing_logo from "../icons/Landing_logo.png";
import { Link } from "react-router-dom";
import "./navbar.css";
import MenuIcon from "../icons/MenuIcon.svg";
import AppContext from "../AppContext";
import Logout from "../components/Logout";

import "./navbar.css";
function Landing() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { userData } = React.useContext(AppContext);
  const { user } = userData;
  console.log(user);
  const availableRoles = user != null ? user.role.split(",") : [];
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [currentRole, setCurrentRole] = React.useState(
    window.location.href.split("/")[3]
  );
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

  const navigateToRole_original = (role) => {
    // add navigation to correct role pages
    console.log("role in navigatetorole", role);
    console.log(`load ${role}`);
    if (role === "OWNER") {
      navigate("/owner_original");
    } else if (role === "MANAGER") {
      navigate("/manager");
    } else if (role === "PM_EMPLOYEE") {
      navigate("/manager");
    } else if (role === "TENANT") {
      navigate("/tenant_original");
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
    setSelectedRole(role);
    setCurrentRole(role);
    navigateToRole(role);
    // console.log(role);
    // if (role === selectRole) {
    //   console.log("in if");
    //   setSelectedRole(role);
    //   navigateToRole(role);
    // }
  };
  const roleSelection_original = (r) => {
    let role = r;
    setSelectedRole(role);
    setCurrentRole(role);
    navigateToRole_original(role);
    console.log(role);
    // if (role === selectRole) {
    //   console.log("in if");
    //   setSelectedRole(role);
    //   navigateToRole(role);
    // }
  };
  React.useEffect(() => {
    if (userData.access_token !== null) {
      login();
    }
  }, []);
  const login = () => {
    navigate("/login");
  };
  const signup = () => {
    navigate("/signup");
  };
  const signupexisting = () => {
    // navigate('/signup');
    navigate("/signupexisting");
  };
  return (
    <div className="d-flex flex-column ">
      <Container fluid className="w-100">
        <Row style={{ backgroundColor: "#229ebc", paddingTop: "2rem" }}>
          <Col xs={4}></Col>
          <Col className="d-flex justify-content-center align-items-center">
            <img
              src={Landing_logo}
              style={{ height: "100%", width: "70%", objectFit: "contain" }}
              alt="Manifest logo"
            />
          </Col>
          {user == null ? (
            <Col xs={4}>
              <Row
                className="d-flex justify-content-center align-items-center"
                style={{
                  padding: "5px",
                }}
              >
                <Button
                  style={{
                    backgroundColor: "white",
                    borderColor: "white",
                    borderRadius: "10px",
                    color: "black",
                    width: "10rem",
                    font: "normal normal normal 18px Avenir-Light",
                  }}
                  onClick={login}
                >
                  Login
                </Button>
              </Row>
              <Row
                className="d-flex justify-content-center align-items-center"
                style={{
                  padding: "5px",
                }}
              >
                <Button
                  style={{
                    backgroundColor: "#fb8500",
                    borderColor: "#fb8500",
                    borderRadius: "10px",
                    color: "white",
                    width: "10rem",
                    font: "normal normal normal 18px Avenir-Light",
                  }}
                  onClick={signup}
                >
                  Signup
                </Button>
              </Row>
              <Row
                className="d-flex justify-content-center align-items-center"
                style={{
                  padding: "5px",
                }}
              >
                <Button
                  style={{
                    backgroundColor: "white",
                    borderColor: "white",
                    borderRadius: "10px",
                    color: "black",
                    width: "10rem",
                    font: "normal normal normal 18px Avenir-Light",
                  }}
                  onClick={signupexisting}
                >
                  Modify Existing
                </Button>
              </Row>
            </Col>
          ) : (
            <Col xs={4}>
              <Row
                className="d-flex justify-content-center align-items-center"
                style={{
                  padding: "5px",
                }}
              >
                <Button
                  style={{
                    backgroundColor: "white",
                    borderColor: "white",
                    borderRadius: "10px",
                    color: "black",
                    width: "10rem",
                    font: "normal normal normal 18px Avenir-Light",
                  }}
                  onClick={() => navigate("/")}
                >
                  {user.first_name} {user.last_name}
                </Button>
              </Row>

              <Row
                className="d-flex justify-content-center align-items-center"
                style={{
                  padding: "5px",
                }}
              >
                <Logout />
              </Row>
              <Row
                className="d-flex justify-content-center align-items-center"
                style={{
                  padding: "5px",
                }}
              >
                <Button
                  style={{
                    backgroundColor: "white",
                    borderColor: "white",
                    borderRadius: "10px",
                    color: "black",
                    width: "10rem",
                    font: "normal normal normal 18px Avenir-Light",
                  }}
                  onClick={signupexisting}
                >
                  Modify Existing
                </Button>
              </Row>
            </Col>
          )}

        </Row>
        <Row>
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
                <Link
                  to="/buyparts"
                  class="navButtons"
                  onClick={closeMenuProjects}
                >
                  Contact
                </Link>
                <Link
                  to="/OwnersTab"
                  class="navButtons"
                  onClick={closeMenuProjects}
                >
                  Owners
                </Link>
                <Link
                  to="/inventory"
                  class="navButtons"
                  onClick={closeMenuProjects}
                >
                  Property Managers
                </Link>
                <Link
                  to="/renterLanding"
                  class="navButtons"
                  onClick={closeMenuProjects}
                >
                  Renters
                </Link>
                <Link
                  to="/addparts"
                  class="navButtons"
                  onClick={closeMenuProjects}
                >
                  Maintenace
                </Link>
                <Link
                  to="/inventory"
                  class="navButtons"
                  onClick={closeMenuProjects}
                >
                  Investors
                </Link>
                <Link
                  to="/editpart"
                  class="navButtons"
                  onClick={closeMenuProjects}
                >
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
                    <div
                      key={i}
                      className={open ? "nav-links active" : "nav-links"}
                    >
                      <div
                        onClick={() => {
                          role === selectedRole ||
                          role === currentRole.toUpperCase()
                            ? roleSelection(role)
                            : roleSelection(role);
                        }}
                        class="navButtons"
                      >
                        <p className="d-inline-block text-left">
                          {longNames[role]}
                        </p>
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                // marginTop: "-2rem",
              }}
            >
              {availableRoles != null
                ? availableRoles.map((role, i) => (
                    <div
                      key={i}
                      className={open ? "nav-links active" : "nav-links"}
                    >
                      <div
                        onClick={() => {
                          role === selectedRole ||
                          role === currentRole.toUpperCase()
                            ? roleSelection_original(role)
                            : roleSelection_original(role);
                        }}
                        class="navButtons"
                      >
                        <p className="d-inline-block text-left">
                          {longNames[role]} Original
                        </p>
                      </div>
                    </div>
                  ))
                : ""}
            </div>
          </nav>
        </Row>
      </Container>
    </div>
  );
}

export default Landing;
