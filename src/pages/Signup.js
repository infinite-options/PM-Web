import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupRoleSelection from "./SignupRoleSelection";
import SignupNameForm from "./SignupNameForm";
import SignupEmailForm from "./SignupEmailForm";

function Signup() {
  const navigate = useNavigate();
  const [signupStage, setSignupStage] = useState("ROLES");
  const [userRoles, setUserRoles] = useState([]);
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState();
  const confirmRoles = (roles) => {
    setUserRoles(roles);
    setSignupStage("NAME");
  };
  const confirmName = (firstName, lastName, phoneNumber) => {
    setUserFirstName(firstName);
    setUserLastName(lastName);
    setUserPhoneNumber(phoneNumber);
    setSignupStage("EMAIL");
  };
  const goToLanding = () => {
    navigate("/");
  };
  const goToProfileInfo = () => {
    navigate("/profileInfo", { state: { role: userRoles } });
  };
  return (
    <>
      <div
        style={signupStage !== "ROLES" ? { display: "none" } : {}}
        // className="h-100"
      >
        <SignupRoleSelection onConfirm={confirmRoles} back={goToLanding} />
      </div>
      <div
        style={signupStage !== "NAME" ? { display: "none" } : {}}
        className="h-100"
      >
        <SignupNameForm
          onConfirm={confirmName}
          back={() => setSignupStage("ROLES")}
        />
      </div>
      <div
        style={signupStage !== "EMAIL" ? { display: "none" } : {}}
        className="h-100"
      >
        <SignupEmailForm
          firstName={userFirstName}
          lastName={userLastName}
          phoneNumber={userPhoneNumber}
          role={userRoles.join(",")}
          onConfirm={goToProfileInfo}
          back={() => setSignupStage("NAME")}
        />
      </div>
    </>
  );
}

export default Signup;
