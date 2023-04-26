import React, { useContext, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "../components/Header";
import Checkbox from "../components/Checkbox";
import { pillButton, red, small, hidden } from "../utils/styles";
import AppContext from "../AppContext";
import { post, put } from "../utils/api";

function SignupRoleSelection(props) {
  const context = useContext(AppContext);
  const { userData, updateUserData } = useContext(AppContext);
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
  // console.log(availableRoles, roleCodes);
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
  const confirmRoles = () => {
    if (userRoles.length === 0) {
      setErrorMessage("Please select a role to proceed");
      return;
    }
    setErrorMessage("");
    props.onConfirm(userRoles);
  };
  const confirmAddRoles = () => {
    if (userRoles.length === 0) {
      setErrorMessage("Please select a role to proceed");
      return;
    }
    // console.log(userRoles, userRoles.join(","));
    const submitSignUpForm = async () => {
      const userSignUp = {
        email: props.email,
        role: userRoles.join(","),
      };
      // console.log(userSignUp);
      const res = await put("/users", userSignUp);
      // console.log(res);
      // console.log("login", res.result);
      context.updateUserData(res.result);
      // props.onConfirm();
      setErrorMessage("");
      props.onConfirm(userRoles);
    };
    submitSignUpForm();
  };

  const [errorMessage, setErrorMessage] = useState("");
  let signupStage = props.signupStage;
  let signupRoles = props.signupRoles;
  // console.log(signupStage, signupRoles);

  return (
    <div>
      {signupStage !== "ADDROLES" ? (
        <div className="m-3">
          {/* <Header title="Sign Up" leftText="< Back" leftFn={props.back} /> */}
          <div>
            <h5 className="mb-5">How do you plan to use this app?</h5>
            {availableRoles.map((role, i) => (
              <div key={i} className="d-flex">
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
            ))}
            <div
              // className="text-center"
              style={errorMessage === "" ? hidden : {}}
            >
              <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
            </div>
            <div className="text-center mt-5">
              <Button
                variant="outline-primary"
                style={pillButton}
                onClick={confirmRoles}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Header title="Sign Up" leftText="< Back" leftFn={props.back} />
          <Container>
            <h5 className="mt-3 mb-2">You're currently signed up as</h5>
            {availableRoles.map((role, i) => {
              return props.signupRoles.includes(roleCodes[role]) ? (
                <div key={i} className="d-flex">
                  <Checkbox
                    type="CIRCLE"
                    checked={userRoles.indexOf(roleCodes[role]) === -1}
                    // onClick={(checked) =>
                    //   checked ? addRole(role) : removeRole(role)
                    // }
                  />

                  <div className="flex-grow-1">
                    <p className="d-inline-block text-left">{role}</p>
                  </div>
                </div>
              ) : null;
            })}
            <h5 className="mt-3">what role do you want to add?</h5>
            {availableRoles.map((role, i) => {
              return signupRoles.includes(roleCodes[role]) ? null : (
                <div key={i} className="d-flex">
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

            <div
              className="text-center"
              style={errorMessage === "" ? hidden : {}}
            >
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
      )}
    </div>
  );
}

export default SignupRoleSelection;
