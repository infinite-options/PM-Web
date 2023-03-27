import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Form, Modal, Row } from "react-bootstrap";
import axios from "axios";
import { Grid, Button } from "@material-ui/core";
import AppContext from "../AppContext";
import { post } from "../utils/api";

let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
let CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
const GOOGLE_LOGIN = process.env.REACT_APP_GOOGLE_LOGIN;
let SCOPES = "https://www.googleapis.com/auth/calendar";

function GoogleSignUp(props) {
  const context = useContext(AppContext);

  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState("");
  const [newFName, setNewFName] = useState("");
  const [newLName, setNewLName] = useState("");
  const [socialId, setSocialId] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [accessExpiresIn, setAccessExpiresIn] = useState("");
  const [socialSignUpModalShow, setSocialSignUpModalShow] = useState(false);

  let codeClient = {};

  //   run onclick for authorization and eventually sign up
  function getAuthorizationCode() {
    // Request authorization code and obtain user consent,  method of the code client to trigger the user flow
    codeClient.requestCode();
  }

  useEffect(() => {
    /* global google */

    if (window.google) {
      console.log("in here signup");
      console.log(CLIENT_ID, SCOPES);
      // initialize a code client for the authorization code flow.
      codeClient = google.accounts.oauth2.initCodeClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          console.log(tokenResponse);
          // gets back authorization code
          if (tokenResponse && tokenResponse.code) {
            let auth_code = tokenResponse.code;
            let authorization_url =
              "https://accounts.google.com/o/oauth2/token";

            console.log("auth_code", auth_code);
            var details = {
              code: auth_code,
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
              redirectUri: "postmessage",
              grant_type: "authorization_code",
            };
            console.log(details);
            var formBody = [];
            for (var property in details) {
              var encodedKey = encodeURIComponent(property);
              var encodedValue = encodeURIComponent(details[property]);
              formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            // use authorization code, send it to google endpoint to get back ACCESS TOKEN n REFRESH TOKEN
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
                console.log(responseData);
                return responseData;
              })
              //   got ACCESS TOKEN n REFRESH TOKEN

              .then((data) => {
                console.log(data);
                let at = data["access_token"];
                let rt = data["refresh_token"];
                let ax = data["expires_in"];
                //  expires every 1 hr
                setAccessToken(at);
                // stays the same and used to refresh ACCESS token
                setRefreshToken(rt);
                setAccessExpiresIn(ax);
                //  use ACCESS token, to get email and other account info
                axios
                  .get(
                    "https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=" +
                      at
                  )
                  .then((response) => {
                    console.log(response.data);

                    let data = response.data;
                    //setUserInfo(data);
                    let e = data["email"];
                    let fn = data["given_name"];
                    let ln = data["family_name"];
                    let si = data["id"];

                    setNewEmail(e);
                    setNewFName(fn);
                    setNewLName(ln);
                    setSocialId(si);
                    const socialGoogle = async () => {
                      const user = {
                        email: e,
                        password: GOOGLE_LOGIN,
                        first_name: props.first_name,
                        last_name: props.last_name,
                        phone_number: props.phone_number,
                        role: props.role,
                        google_auth_token: at,
                        google_refresh_token: rt,
                        social_id: si,
                        access_expires_in: ax,
                      };
                      // console.log(user);
                      const response = await post("/userSocialSignup", user);
                      console.log(response);
                      if (response.message == "User already exists") {
                        setSocialSignUpModalShow(!socialSignUpModalShow);
                        return;
                        // add validation
                      } else {
                        context.updateUserData(response.result);
                        // save to app state / context
                        props.onConfirm();
                      }
                    };
                    socialGoogle();
                  })
                  .catch((error) => {
                    console.log("its in landing page");
                    console.log(error);
                  });

                // setSocialSignUpModalShow(!socialSignUpModalShow);

                return (
                  accessToken,
                  refreshToken,
                  accessExpiresIn,
                  newEmail,
                  newFName,
                  newLName,
                  socialId
                );
              })
              .catch((err) => {
                console.log(err);
              });
          }
        },
      });
    }
  }, [getAuthorizationCode]);
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
            <div>The user {newEmail} already exists! Please Log In!</div>
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
  return (
    <Grid
      container
      spacing={3}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <div></div>
      <div id="signUpDiv">
        <Button
          class="btn btn-outline-dark"
          onClick={() => getAuthorizationCode()}
          role="button"
          style={{ textTransform: "none", borderRadius: "50px" }}
        >
          <img
            width="20px"
            style={{
              marginBottom: "3px",
              marginRight: "5px",
            }}
            alt="Google sign-in"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
          />
          Sign Up with Google
        </Button>
      </div>
      {socialSignUpModal()}
    </Grid>
  );
}

export default GoogleSignUp;
