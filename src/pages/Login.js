import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import * as ReactBootStrap from "react-bootstrap";
import AppContext from "../AppContext";
import Header from "../components/Header";
import SocialLogin from "./SocialLogin";
import GoogleSignIn from "../Google/GoogleSignIn";
import Homepage from "./Homepage";
import PasswordModal from "./PasswordModal";
import { post, put } from "../utils/api";
import { pillButton, boldSmall, red, small, hidden } from "../utils/styles";

function Login(props) {
  const context = useContext(AppContext);
  const { userData, updateUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const [passModal, setpassModal] = useState(false);
  const [loginStage, setLoginStage] = useState("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  // console.log("stage", loginStage, props.signupStage);
  useEffect(() => {
    if (userData.access_token !== null) {
      setLoginStage("ROLE");
    }
  }, []);
  const submitForm = async () => {
    if (email === "" || password === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }

    setShowSpinner(true);
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
    // console.log("login", response.result);
    updateUserData(response.result);
    setShowSpinner(false);
    // save to app state / context
    setLoginStage("ROLE");
  };

  const submitSignUpForm = async () => {
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
    } else {
      // console.log(response);
      // const userSignUp = {
      //   first_name: response.result.user.first_name,
      //   last_name: response.result.user.last_name,
      //   phone_number: response.result.user.phone_number,
      //   email: email,
      //   password: password,
      //   role: props.role,
      // };
      // console.log(userSignUp);
      // const res = await put("/users", userSignUp);
      // console.log(res);
      // console.log("login", res.result);
      // context.updateUserData(res.result);
      // props.onConfirm();
      props.onConfirm(response.result.user.role, email);
    }

    // save to app state / context
    // setLoginStage("ROLE");
  };
  const onReset = async () => {
    const response = await post("/set_temp_password", { email: email });

    if (response.message === "A temporary password has been sent") {
      // console.log(response);
      setpassModal(true);
    } else if (response.code === 280) {
      // console.log(response);
      alert("No account found with that email.");
    }
  };
  const onCancel = () => {
    setpassModal(false);
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
      {<PasswordModal isOpen={passModal} onCancel={onCancel} />}
      {loginStage === "LOGIN" && props.signupStage !== "NAME" ? (
        <div className="d-flex flex-column h-100">
          {/* <Header
            title="Login"
            leftText="< Back"
            leftFn={() => navigate("/")}
          /> */}
          <Container className="d-flex flex-column mt-3">
            <div className="text-center">
              {/* <img src={AppleLogin} alt="Apple Login" className="m-1" />
              <img src={FacebookLogin} alt="Facebook Login" className="m-1" />
              <img src={GoogleLogin} alt="Google Login" className="m-1" /> */}
              {/* <SocialLogin
                signupStage={props.signupStage}
                loginStage={loginStage}
                setLoginStage={setLoginStage}
              /> */}
              <GoogleSignIn
                signupStage={props.signupStage}
                loginStage={loginStage}
                setLoginStage={setLoginStage}
              />
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

            <div className="text-center pt-1 pb-2">
              <div className="text-center mb-4">
                <p style={boldSmall} onClick={onReset}>
                  Forgot Password?
                </p>
              </div>
              {showSpinner ? (
                <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                  <ReactBootStrap.Spinner animation="border" role="status" />
                </div>
              ) : (
                ""
              )}
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
                // onClick={() => navigate("/signuproles")}
                onClick={() => navigate("/signup")}
                style={pillButton}
                className="mb-4"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      ) : loginStage === "ROLE" && props.signupStage !== "NAME" ? (
        <div className="d-flex flex-column h-100 pb-5">
          {/* <Header title="Login" /> */}
          {/* <SelectRole /> */}
          <Homepage />
        </div>
      ) : loginStage === "LOGIN" && props.signupStage === "NAME" ? (
        <div className="d-flex flex-column h-100">
          <Header
            title="Login"
            leftText="< Back"
            leftFn={() => navigate("/")}
          />
          <Container className="px-4">
            <div className="text-center">
              <SocialLogin
                signupStage={props.signupStage}
                role={props.role}
                onConfirm={props.onConfirm}
              />
              <GoogleSignIn
                signupStage={props.signupStage}
                role={props.role}
                onConfirm={props.onConfirm}
              />
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
              <div className="text-center mb-4">
                <p style={boldSmall}>Forgot Password?</p>
              </div>
              <Button
                variant="outline-primary"
                style={pillButton}
                onClick={submitSignUpForm}
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
        </div>
      ) : (
        " "
      )}
    </div>
  );
}

export default Login;
