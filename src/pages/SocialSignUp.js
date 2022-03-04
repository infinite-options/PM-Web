import React, { useContext, useState, useEffect } from "react";

import makeStyles from "@material-ui/core/styles/makeStyles";
import GoogleLogin from "react-google-login";
import axios from "axios";
import { Grid, Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { Col, Container, Form, Modal, Row } from "react-bootstrap";
import Apple from "../icons/AppleLogin.svg";
import Google from "../icons/GoogleLogin.svg";
import AppContext from "../AppContext";
import { get, post } from "../utils/api";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
const GOOGLE_LOGIN = process.env.REACT_APP_GOOGLE_LOGIN;
const useStyles = makeStyles({
  textFieldBackgorund: {
    backgroundColor: "#F3F3F8",
    border: "2px solid #636366",
    borderRadius: "3px",
  },
});

function SocialSignUp(props) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState("");
  const [newFName, setNewFName] = useState("");
  const [newLName, setNewLName] = useState("");
  const [socialId, setSocialId] = useState("");
  const [refreshToken, setrefreshToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [accessExpiresIn, setaccessExpiresIn] = useState("");

  const responseGoogle = (response) => {
    console.log("response", response);

    let auth_code = response.code;
    let authorization_url = "https://accounts.google.com/o/oauth2/token";

    console.log("auth_code", auth_code);
    var details = {
      code: auth_code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      //redirect_uri: "http://localhost:3000",
      redirectUri: "https://io-propertymanagement.netlify.app/",
      grant_type: "authorization_code",
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
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
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
      .then((data) => {
        console.log(data);
        let at = data["access_token"];
        let rt = data["refresh_token"];
        let ax = data["expires_in"].toString();
        setAccessToken(at);
        setrefreshToken(rt);
        setaccessExpiresIn(ax);
        console.log("res", at, rt);

        axios
          .get(
            "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" +
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
              console.log(user);
              const response = await post("/userSocialSignup", user);
              context.updateUserData(response.result);
              // save to app state / context
              props.onConfirm();
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
  };

  return (
    <Grid
      container
      spacing={3}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <div>
        <Button>
          <GoogleLogin
            clientId={CLIENT_ID}
            accessType="offline"
            prompt="consent"
            responseType="code"
            buttonText="Log In"
            ux_mode="redirect"
            //redirectUri="http://localhost:3000"
            redirectUri="https://io-propertymanagement.netlify.app/"
            scope="https://www.googleapis.com/auth/calendar"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            isSignedIn={false}
            disable={true}
            cookiePolicy={"single_host_origin"}
            render={(renderProps) => (
              <img
                src={Apple}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                alt={""}
                className="m-1"
              ></img>
            )}
          />
        </Button>
      </div>
      <div>
        <Button>
          <GoogleLogin
            clientId={CLIENT_ID}
            accessType="offline"
            prompt="consent"
            responseType="code"
            buttonText="Log In"
            ux_mode="redirect"
            //redirectUri="http://localhost:3000"
            redirectUri="https://io-propertymanagement.netlify.app/"
            scope="https://www.googleapis.com/auth/calendar"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            isSignedIn={false}
            disable={true}
            cookiePolicy={"single_host_origin"}
            render={(renderProps) => (
              <img
                src={Google}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                alt={""}
                className="m-1"
              ></img>
            )}
          />
        </Button>
      </div>
    </Grid>
  );
}

export default SocialSignUp;
