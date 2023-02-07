import React, { useState, useEffect, useContext } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { Col, Row, Container, Form, Modal } from "react-bootstrap";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Grid, Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import * as ReactBootStrap from "react-bootstrap";
import AppContext from "../AppContext";
import Header from "../components/Header";
import SelectRole from "../components/SelectRole";
import { post } from "../utils/api";

const useStyles = makeStyles({
  textFieldBackgorund: {
    backgroundColor: "#F3F3F8",
    border: "2px solid #636366",
    borderRadius: "3px",
  },
});

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
const GOOGLE_LOGIN = process.env.REACT_APP_GOOGLE_LOGIN;
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

function GoogleSignIn(props) {
  // const history = useHistory();
  const navigate = useNavigate();
  const [loginStage, setLoginStage] = useState("LOGIN");
  const [socialSignUpModalShow, setSocialSignUpModalShow] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const { userData, updateUserData } = useContext(AppContext);
  let signupStage = props.signupStage;
  // gets back ID token, decoded to get email and other account info, used to sign in
  function handleCallBackResponse(response) {
    console.log("Encoded JWT ID token:" + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log("User object", userObject);
    if (userObject) {
      let email = userObject.email;
      let user_id = "";
      axios.get(BASE_URL + `/UserToken/${email}`).then((response) => {
        // console.log("in events", response);
        setAccessToken(response["data"]["result"][0]["google_auth_token"]);
        let url =
          "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=";

        user_id = response["data"]["result"][0]["user_uid"];
        var old_at = response["data"]["result"][0]["google_auth_token"];
        // console.log("in events", old_at);
        var refreshToken =
          response["data"]["result"][0]["google_refresh_token"];

        let checkExp_url = url + old_at;
        // console.log("in events", checkExp_url);
        fetch(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${old_at}`,
          {
            method: "GET",
          }
        )
          .then((response) => {
            // console.log("in events", response);
            if (response["status"] === 400) {
              // console.log("in events if");
              let authorization_url =
                "https://accounts.google.com/o/oauth2/token";

              var details = {
                refresh_token: refreshToken,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "refresh_token",
              };

              var formBody = [];
              for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
              }
              formBody = formBody.join("&");

              fetch(authorization_url, {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
                },
                body: formBody,
              })
                .then((response) => {
                  return response.json();
                })
                .then((responseData) => {
                  // console.log(responseData);
                  return responseData;
                })
                .then((data) => {
                  // console.log(data);
                  let at = data["access_token"];
                  var id_token = data["id_token"];
                  setAccessToken(at);
                  // console.log("in events", at);
                  let url = BASE_URL + `/UpdateAccessToken/${user_id}`;
                  axios
                    .post(url, {
                      google_auth_token: at,
                    })
                    .then((response) => {})
                    .catch((err) => {
                      console.log(err);
                    });
                  return accessToken;
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              setAccessToken(old_at);
              // console.log(old_at);
            }
          })
          .catch((err) => {
            console.log(err);
          });
        // console.log("in events", refreshToken, accessToken);
      });

      //  _socialLoginAttempt(email, accessToken, socialId, "GOOGLE");

      socialGoogle(email);
    }
  }
  const socialGoogle = async (e) => {
    setShowSpinner(true);
    if (signupStage === "NAME") {
      const user = {
        email: e,
        password: GOOGLE_LOGIN,
      };
      const response = await post("/login", user);
      // console.log(response);
      if (response.code !== 200) {
        setSocialSignUpModalShow(!socialSignUpModalShow);
        return;
        // add validation
      } else {
        // console.log(response);
        props.onConfirm(response.result.user.role, e);
      }
    } else {
      const user = {
        email: e,
        password: GOOGLE_LOGIN,
      };
      const response = await post("/login", user);
      if (response.code !== 200) {
        setSocialSignUpModalShow(!socialSignUpModalShow);
        return;
        // add validation
      }
      // console.log("login", response.result);
      updateUserData(response.result);
      // save to app state / context
      setShowSpinner(false);
      setLoginStage("ROLE");
      props.setLoginStage("ROLE");
    }
  };

  useEffect(() => {
    if (userData.access_token !== null) {
      setLoginStage("ROLE");
    }
  }, []);
  useEffect(() => {
    /* global google */

    if (window.google) {
      console.log("in here singnin");
      //  initializes the Sign In With Google client based on the configuration object
      google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCallBackResponse,
      });
      //    method renders a Sign In With Google button in your web pages.
      google.accounts.id.renderButton(document.getElementById("signInDiv"), {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "pill",
      });
      // access tokens
    }
  }, [handleCallBackResponse]);
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
    const colHeader = {
      margin: "5px",
    };
    return (
      <Modal
        show={socialSignUpModalShow}
        onHide={hideSignUp}
        style={modalStyle}
      >
        <Form as={Container}>
          <Modal.Header style={headerStyle} closeButton>
            <Modal.Title>User Does Not Exist</Modal.Title>
          </Modal.Header>

          <Modal.Body style={bodyStyle}>
            <div>The user {newEmail} does not exist! Please Sign Up!</div>
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
                  onClick={() => navigate("/signup")}
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
                  Sign Up
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };
  return (
    <Grid
      container
      spacing={3}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      {loginStage === "LOGIN" ? (
        <div>
          <div></div>
          <div id="signInDiv"></div>
          {showSpinner ? (
            <div className="w-100 d-flex flex-column justify-content-center align-items-center">
              <ReactBootStrap.Spinner animation="border" role="status" />
            </div>
          ) : (
            ""
          )}
        </div>
      ) : loginStage === "ROLE" ? (
        <div className="d-flex flex-column h-100 pb-5">
          <Header title="Login" />
          <SelectRole />
        </div>
      ) : (
        ""
      )}

      {socialSignUpModal()}
    </Grid>
  );
}

export default GoogleSignIn;
