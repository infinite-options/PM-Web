import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";

import AppContext from "../AppContext";
import Header from "../components/Header";
import SelectRole from "../components/SelectRole";
import AppleLogin from "../icons/AppleLogin.svg";
import FacebookLogin from "../icons/FacebookLogin.svg";
import GoogleLogin from "../icons/GoogleLogin.svg";
import { post } from "../utils/api";
import { pillButton, boldSmall, red, small, hidden } from "../utils/styles";
import SocialLogin from "./SocialLogin";

function Login(props) {
  const { userData, updateUserData } = React.useContext(AppContext);
  const navigate = useNavigate();
  const [loginStage, setLoginStage] = React.useState("LOGIN");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  React.useEffect(() => {
    if (userData.access_token !== null) {
      setLoginStage("ROLE");
    }
  }, []);
  const submitForm = async () => {
    if (email === "" || password === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    const user = {
      email: email,
      password: password,
    };
    const response = await post("/login", user);
    if (response.code !== 200) {
      setErrorMessage(response.message);
      return;
      // add validation
    }
    console.log("login", response.result);
    updateUserData(response.result);
    // save to app state / context
    setLoginStage("ROLE");
  };

  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  return (
    <div className="h-100 pb-5">
      {loginStage === "LOGIN" ? (
        <div className="d-flex flex-column h-100">
          <Header
            title="Login"
            leftText="< Back"
            leftFn={() => navigate("/")}
          />
          <Container className="px-4">
            <div className="text-center">
              {/* <img src={AppleLogin} alt="Apple Login" className="m-1" />
              <img src={FacebookLogin} alt="Facebook Login" className="m-1" />
              <img src={GoogleLogin} alt="Google Login" className="m-1" /> */}
              <SocialLogin />
            </div>
            <hr className="mt-4 mb-1" />
            <div className="text-center mb-4">
              <p style={boldSmall}>Or continue with email</p>
            </div>
            <Form>
              <Form.Group className="mx-2 my-3">
                <Form.Label as="h5" className="mb-0 ms-1">
                  Email Address {email === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  style={{ borderRadius: 0 }}
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mx-2 my-3">
                <Form.Label as="h5" className="mb-0 ms-1">
                  Password {password === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  style={{ borderRadius: 0 }}
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </Form>
            <div className="text-center pt-1 pb-3">
              <Button
                variant="outline-primary"
                style={pillButton}
                onClick={submitForm}
              >
                Login
              </Button>
            </div>
            <div
              className="text-center"
              style={errorMessage === "" ? hidden : {}}
            >
              <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
            </div>
          </Container>
          <div className="flex-grow-1 d-flex flex-column justify-content-end">
            <div className="text-center">
              <p style={boldSmall} className="mb-1">
                Don't have an account?
              </p>
              <Button
                variant="outline-primary"
                onClick={() => navigate("/signup")}
                style={pillButton}
                className="mb-4"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      ) : loginStage === "ROLE" ? (
        <div className="d-flex flex-column h-100 pb-5">
          <Header title="Login" />
          <SelectRole />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Login;
