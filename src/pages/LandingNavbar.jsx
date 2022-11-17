import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AppContext from "../AppContext";
import Logout from "../components/Logout";
import Landing_logo from "../icons/Landing_logo.png";
import MenuIcon from "../icons/MenuIcon.svg";
import "./navbar.css";
function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [openRoles, setOpenRoles] = useState(false);
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

  // const navigateToRole_original = (role) => {
  //   // add navigation to correct role pages
  //   console.log("role in navigatetorole", role);
  //   console.log(`load ${role}`);
  //   if (role === "OWNER") {
  //     navigate("/owner_original");
  //   } else if (role === "MANAGER") {
  //     navigate("/manager_original");
  //   } else if (role === "PM_EMPLOYEE") {
  //     navigate("/manager");
  //   } else if (role === "TENANT") {
  //     navigate("/tenant_original");
  //   } else if (role === "MAINTENANCE") {
  //     navigate("/maintenance", { state: { roles: role } });
  //   } else if (role === "MAINT_EMPLOYEE") {
  //     navigate("/maintenance", { state: { roles: role } });
  //   }
  // };

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

  const handleClick = () => {
    console.log("here handleclick");
    setOpen(!open);
  };
  const handleClickRoles = () => {
    console.log("here handleclickroles");
    setOpenRoles(!openRoles);
  };

  const closeMenu = () => {
    setOpenRoles(false);
  };

  const closeMenuProjects = () => {
    setOpen(false);
  };
  const roleSelection = (r) => {
    let role = r;
    setSelectedRole(role);
    setCurrentRole(role);
    navigateToRole(role);
  };
  // const roleSelection_original = (r) => {
  //   let role = r;
  //   setSelectedRole(role);
  //   setCurrentRole(role);
  //   navigateToRole_original(role);
  //   console.log(role);
  // };
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
    navigate("/signupexisting");
  };
  const modifyexisiting = () => {
    navigate("/modifyexisiting", {
      state: {
        user: user,
      },
    });
  };
  return (
    <div className="d-flex flex-column ">
      <div fluid className="w-100">
        <div
          style={{ backgroundColor: "#229ebc", paddingTop: "2rem" }}
          class="baseNav"
        >
          <Col xs={4}></Col>
          <Col className="d-flex justify-content-center align-items-center">
            <img
              src={Landing_logo}
              onClick={() => navigate("/")}
              style={{
                height: "100%",
                maxWidth: "60%",
                objectFit: "contain",
              }}
              alt="Manifest logo"
            />
          </Col>
          {user == null ? (
            <Col className="buttonNav">
              <div
                className="buttonNavButtons"
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
              </div>
              <div
                className="buttonNavButtons"
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
              </div>
              <div
                className="buttonNavButtons"
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
              </div>
            </Col>
          ) : (
            <Col className="buttonNav">
              <div
                className="buttonNavButtons"
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
              </div>

              <div className="buttonNavButtons">
                <Logout />
              </div>
              <div
                className="buttonNavButtons"
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
                  onClick={modifyexisiting}
                >
                  Modify Existing
                </Button>
              </div>
            </Col>
          )}
        </div>
        <Row className="w-100 m-0">
          <nav class="headerNav">
            {" "}
            {user == null ? (
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
                      class="nav-icon"
                      onClick={() => {
                        handleClick();
                      }}
                    />
                  ) : (
                    <img
                      src={MenuIcon}
                      class="nav-icon"
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
                    to="/managerLanding"
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
            ) : (
              ""
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {user != null ? (
                <div>
                  {openRoles ? (
                    <img
                      src={MenuIcon}
                      className="nav-icon"
                      onClick={() => {
                        handleClickRoles();
                      }}
                    />
                  ) : (
                    <img
                      src={MenuIcon}
                      className="nav-icon"
                      onClick={() => {
                        handleClickRoles();
                      }}
                    />
                  )}
                </div>
              ) : (
                ""
              )}

              <div className={openRoles ? "nav-links active" : "nav-links"}>
                {availableRoles != null
                  ? availableRoles.map((role, i) => (
                      <div key={i}>
                        <div
                          onClick={() => {
                            role === selectedRole ||
                            role === currentRole.toUpperCase()
                              ? roleSelection(role)
                              : roleSelection(role);
                            closeMenu();
                          }}
                          class="navButtons"
                        >
                          <p className="d-inline-block text-left">
                            {longNames[role]}
                          </p>
                        </div>
                      </div>
                    ))
                  : ""}
              </div>
            </div>
            {/* <div
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
            </div> */}
          </nav>
        </Row>
      </div>
    </div>
  );
}

export default LandingNavbar;
