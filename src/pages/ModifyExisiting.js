import React, { useContext, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Checkbox from "../components/Checkbox";
import { pillButton, red, small, hidden } from "../utils/styles";
import AppContext from "../AppContext";
import { post, put } from "../utils/api";

function ModifyExisiting(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state.user;
  const context = useContext(AppContext);
  const [userRoles, setUserRoles] = useState([]);
  const roleCodes = {
    "Property Manager (Business Owner)": "MANAGER",
    "Property Manager (Employee)": "PM_EMPLOYEE",
    "Property Owner": "OWNER",
    Tenant: "TENANT",
    "Property Maintenance (Business Owner)": "MAINTENANCE",
    "Property Maintenance (Employee)": "MAINT_EMPLOYEE",
  };
  const availableRoles = Object.keys(roleCodes);
  console.log(availableRoles, roleCodes);
  const addRole = (role) => {
    const roleCode = roleCodes[role];
    const index = userRoles.indexOf(roleCode);
    if (index !== -1) {
      return;
    }
    const rolesCopy = [...userRoles];
    if (roleCode === "MANAGER") {
      const employeeIndex = userRoles.indexOf("PM_EMPLOYEE");
      if (employeeIndex !== -1) rolesCopy.splice(employeeIndex, 1);
    } else if (roleCode === "PM_EMPLOYEE") {
      const ownerIndex = userRoles.indexOf("MANAGER");
      if (ownerIndex !== -1) rolesCopy.splice(ownerIndex, 1);
    } else if (roleCode === "MAINTENANCE") {
      const employeeIndex = userRoles.indexOf("MAINT_EMPLOYEE");
      if (employeeIndex !== -1) rolesCopy.splice(employeeIndex, 1);
    } else if (roleCode === "MAINT_EMPLOYEE") {
      const ownerIndex = userRoles.indexOf("MAINTENANCE");
      if (ownerIndex !== -1) rolesCopy.splice(ownerIndex, 1);
    }
    rolesCopy.push(roleCode);
    setUserRoles(rolesCopy);
  };
  const removeRole = (role) => {
    const index = userRoles.indexOf(roleCodes[role]);
    if (index === -1) {
      return;
    }
    const rolesCopy = [...userRoles];
    rolesCopy.splice(index, 1);
    setUserRoles(rolesCopy);
  };

  const confirmAddRoles = () => {
    if (userRoles.length === 0) {
      setErrorMessage("Please select a role to proceed");
      return;
    }
    console.log(userRoles, userRoles.join(","));
    const submitSignUpForm = async () => {
      const userSignUp = {
        email: user.email,
        role: userRoles.join(","),
      };
      console.log(userSignUp);
      const res = await put("/users", userSignUp);
      console.log(res);
      console.log("login", res.result);
      context.updateUserData(res.result);

      setErrorMessage("");
      navigate("/profileInfo", {
        state: { role: userRoles },
      });
    };
    submitSignUpForm();
  };

  const [errorMessage, setErrorMessage] = React.useState("");

  return (
    <div>
      <Container>
        <h5 className="mb-5">
          You're currently signed up as {user.role}, what role do you want to
          add?
        </h5>
        {availableRoles.map((role, i) => {
          return user.role.includes(roleCodes[role]) ? null : (
            <div key={i} className="d-flex">
              {console.log(
                role,
                user.role,
                roleCodes[role],
                user.role.includes(roleCodes[role])
              )}
              <Checkbox
                type="CIRCLE"
                checked={userRoles.indexOf(roleCodes[role]) !== -1}
                onClick={(checked) =>
                  checked ? addRole(role) : removeRole(role)
                }
              />

              <div className="flex-grow-1">
                <p className="d-inline-block text-left">{role}</p>
              </div>
            </div>
          );
        })}

        <div className="text-center" style={errorMessage === "" ? hidden : {}}>
          <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
        </div>
        <div className="text-center mt-5">
          <Button
            variant="outline-primary"
            style={pillButton}
            onClick={confirmAddRoles}
          >
            Next
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default ModifyExisiting;
