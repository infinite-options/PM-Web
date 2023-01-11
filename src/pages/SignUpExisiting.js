import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupRoleSelection from "./SignupRoleSelection";
import SignupNameForm from "./SignupNameForm";
import SignupEmailForm from "./SignupEmailForm";
import Login from "./Login";

function SignupExisting() {
  const navigate = useNavigate();
  const [signupStage, setSignupStage] = useState("NAME");
  const [userRoles, setUserRoles] = useState([]);
  const [signupRoles, setSignupRoles] = useState([]);
  const [email, setEmail] = useState("");
  // const [userFirstName, setUserFirstName] = useState("");
  // const [userLastName, setUserLastName] = useState("");
  // const [userPhoneNumber, setUserPhoneNumber] = useState();
  const confirmRoles = (roles) => {
    setUserRoles(roles);
    navigate("/profileInfo", {
      state: { role: roles },
    });
    // setSignupStage("NAME");
  };
  // const confirmName = (firstName, lastName, phoneNumber) => {
  //   setUserFirstName(firstName);
  //   setUserLastName(lastName);
  //   setUserPhoneNumber(phoneNumber);
  //   setSignupStage("EMAIL");
  // };
  const goToLanding = () => {
    navigate("/");
  };
  // const goToProfileInfo = () => {
  //   navigate("/profileInfo");
  // };

  const goToRoles = (signupRoles, email) => {
    // navigate("/profileInfo");
    setSignupRoles(signupRoles);
    setEmail(email);
    setSignupStage("ADDROLES");
  };
  return (
    <>
      <div
        style={signupStage !== "NAME" ? { display: "none" } : {}}
        className="h-100"
      >
        <Login
          // onConfirm={goToProfileInfo}
          onConfirm={goToRoles}
          signupStage={signupStage}
          // role={userRoles.join(",")}
          back={goToLanding}
          // back={() => setSignupStage("ROLES")}
        />
      </div>
      <div
        style={signupStage !== "ADDROLES" ? { display: "none" } : {}}
        className="h-100"
      >
        <SignupRoleSelection
          onConfirm={confirmRoles}
          signupStage={signupStage}
          signupRoles={signupRoles}
          email={email}
          // back={goToLanding}
          back={() => setSignupStage("NAME")}
        />
      </div>

      {/* <div
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
      </div> */}
    </>
  );
}

export default SignupExisting;
