import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Modal, Container, Col, Row } from "react-bootstrap";
import * as ReactBootStrap from "react-bootstrap";
import AppContext from "../AppContext";
import Header from "../components/Header";
import AppleLogin from "../icons/AppleLogin.svg";
import { post } from "../utils/api";
import {
  pillButton,
  boldSmall,
  gray,
  red,
  small,
  hidden,
} from "../utils/styles";
import GoogleSignUp from "../Google/GoogleSignUp";

function SignupEmailForm(props) {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [otherMethod, setOtherMethod] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);

  const [socialSignUpModalShow, setSocialSignUpModalShow] = useState(false);
  const submitForm = async () => {
    if (
      email === "" ||
      confirmEmail === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    if (email !== confirmEmail) {
      setErrorMessage("Emails must match");
      return;
    } else if (email === confirmEmail) {
      setErrorMessage("");
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords must match");
      return;
    } else if (password === confirmPassword) {
      setErrorMessage("");
    }
    setShowSpinner(true);
    const user = {
      first_name: props.firstName,
      last_name: props.lastName,
      phone_number: props.phoneNumber,
      email: email,
      password: password,
      role: props.role,
    };
    const response = await post("/users", user);
    if (response.message == "User already exists") {
      setSocialSignUpModalShow(!socialSignUpModalShow);
      return;
      // add validation
    } else {
      if (response.code !== 200) {
        setErrorMessage(response.message);
        return;
        // add validation
      }
      setErrorMessage("");
      context.updateUserData(response.result);
      // save to app state / context
      setShowSpinner(false);
      props.onConfirm();
    }
  };
  const goToLogin = () => {
    navigate("/login");
  };
  const hideSignUp = () => {
    //setSignUpModalShow(false);
    setSocialSignUpModalShow(false);
    navigate("/");
  };
  const socialSignUpModal = () => {
    const modalStyle = {
      position: "absolute",
      top: "30%",
      left: "2%",
      width: "400px",
    };
    const headerStyle = {
      border: "none",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      fontSize: "20px",
      fontWeight: "bold",
      color: "#2C2C2E",
      textTransform: "uppercase",
      backgroundColor: " #F3F3F8",
    };
    const footerStyle = {
      border: "none",
      backgroundColor: " #F3F3F8",
    };
    const bodyStyle = {
      backgroundColor: " #F3F3F8",
    };

    return (
      <Modal
        show={socialSignUpModalShow}
        onHide={hideSignUp}
        style={modalStyle}
      >
        <Form as={Container}>
          <Modal.Header style={headerStyle} closeButton>
            <Modal.Title>User Already Exists</Modal.Title>
          </Modal.Header>

          <Modal.Body style={bodyStyle}>
            <div>The user {email} already exists! Please Log In!</div>
          </Modal.Body>

          <Modal.Footer style={footerStyle}>
            <Row
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <Col
                xs={6}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="submit"
                  onClick={hideSignUp}
                  style={{
                    marginTop: "1rem",
                    width: "93px",
                    height: "40px",

                    font: "normal normal normal 18px/21px SF Pro Display",
                    letterSpacing: "0px",
                    color: "#F3F3F8",
                    textTransform: "none",
                    background: "#2C2C2E 0% 0% no-repeat padding-box",
                    borderRadius: "3px",
                  }}
                >
                  Cancel
                </Button>
              </Col>
              <Col
                xs={6}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="submit"
                  onClick={() => navigate("/login")}
                  style={{
                    marginTop: "1rem",
                    width: "93px",
                    height: "40px",

                    font: "normal normal normal 18px/21px SF Pro Display",
                    letterSpacing: "0px",
                    color: "#2C2C2E",
                    textTransform: "none",
                    border: " 2px solid #2C2C2E",
                    borderRadius: " 3px",
                  }}
                >
                  Login
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    );
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
    <div className="d-flex flex-column h-100">
      <Header title="Sign Up" leftText="< Back" leftFn={props.back} />
      <div className="px-4">
        <h5>Full Name</h5>
        <p style={gray}>{props.firstName + " " + props.lastName}</p>
        <h5>Phone Number</h5>
        <p style={gray}>{props.phoneNumber}</p>
        {!showEmailForm ? <h5 className="mb-4">Choose login method:</h5> : ""}
        <div className="text-center">
          {/* <img src={AppleLogin} alt="Apple Login" className="m-1" />
          <img src={FacebookLogin} alt="Facebook Login" className="m-1" />
          <img src={GoogleLogin} alt="Google Login" className="m-1" /> */}
          {/* <SocialSignUp
            first_name={props.firstName}
            last_name={props.lastName}
            phone_number={props.phoneNumber}
            role={props.role}
            onConfirm={props.onConfirm}
          /> */}
          <GoogleSignUp
            first_name={props.firstName}
            last_name={props.lastName}
            phone_number={props.phoneNumber}
            role={props.role}
            onConfirm={props.onConfirm}
            socialSignUpModalShow={socialSignUpModalShow}
            setSocialSignUpModalShow={setSocialSignUpModalShow}
          />
        </div>
        <hr className={showEmailForm ? "mt-4 mb-1" : "my-4"} />
        <div className="text-center d-flex justify-content-center">
          {/* <div onClick={() => setShowEmailForm(!showEmailForm)}> */}
          {/* <div> */}
          {/* <p
              style={showEmailForm ? boldSmall : { ...boldSmall, ...underline }}
              className={showEmailForm ? "" : "mb-4"}
            >
              Or continue with email
            </p> */}
          {/* <Button style={pillButton}>Or continue with email</Button> */}
          {/* </div> */}
          <div
            className="text-center mb-4"
            onClick={() => setOtherMethod(true)}
          >
            <p style={boldSmall}>Choose another method</p>
          </div>
        </div>
        {otherMethod ? (
          <div
            hidden={showEmailForm}
            className="text-center d-flex justify-content-center"
          >
            <Col>
              <Button style={pillButton} onClick={() => setShowEmailForm(true)}>
                Continue with email
              </Button>
            </Col>
            <Col>
              <GoogleSignUp
                first_name={props.firstName}
                last_name={props.lastName}
                phone_number={props.phoneNumber}
                role={props.role}
                onConfirm={props.onConfirm}
                socialSignUpModalShow={socialSignUpModalShow}
                setSocialSignUpModalShow={setSocialSignUpModalShow}
              />
              <p style={boldSmall} className="mt-4">
                Choose Google to have access to more features
              </p>
            </Col>
          </div>
        ) : (
          ""
        )}
        {showEmailForm ? (
          <div className="flex-grow-1 d-flex flex-column justify-content-end">
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
                  Confirm Email Address {confirmEmail === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  style={{ borderRadius: 0 }}
                  placeholder="Confirm Email"
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mx-2 my-3">
                <Form.Label as="h5" className="mb-0 ms-1">
                  Enter Password {password === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  style={{ borderRadius: 0 }}
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mx-2 my-3">
                <Form.Label as="h5" className="mb-0 ms-1">
                  Confirm Password {confirmPassword === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  style={{ borderRadius: 0 }}
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
            </Form>
            {showSpinner ? (
              <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                <ReactBootStrap.Spinner animation="border" role="status" />
              </div>
            ) : (
              ""
            )}
            <div
              className="text-center"
              style={errorMessage === "" ? hidden : {}}
            >
              <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
            </div>

            <div className="text-center pt-1 pb-3">
              <Button
                variant="outline-primary"
                style={pillButton}
                onClick={submitForm}
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {!showEmailForm ? (
        <div className="flex-grow-1 d-flex flex-column justify-content-end">
          <div className="text-center">
            <p style={boldSmall} className="mb-1">
              Already have an account?
            </p>
            <Button
              variant="outline-primary"
              onClick={goToLogin}
              style={pillButton}
              className="mb-4"
            >
              Login
            </Button>
          </div>
        </div>
      ) : (
        ""
      )}
      {socialSignUpModal()}
    </div>
  );
}

export default SignupEmailForm;
