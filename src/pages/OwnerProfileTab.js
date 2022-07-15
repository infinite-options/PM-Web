import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import AppContext from "../AppContext";
import Header from "../components/Header";
import { squareForm, red, gray, headings, mediumBold } from "../utils/styles";
import { get, put } from "../utils/api";
import LeaseIcon from "../icons/LeaseIcon.svg";
import Personal from "../icons/Personal.svg";
import Contacts_Blue from "../icons/Contacts_Blue.svg";
import GreyArrowRight from "../icons/GreyArrowRight.svg";

import Logout from "../components/Logout";

function OwnerProfileTab(props) {
  const context = useContext(AppContext);
  const { userData, refresh } = context;
  const { access_token, user } = userData;
  const navigate = useNavigate();
  const { errorMessage, setShowFooter, setFooterTab, profileInfo, setStage } =
    props;

  return (
    <div
      className="pb-5 mb-5 h-100"
      style={{
        background: "#E9E9E9 0% 0% no-repeat padding-box",
        borderRadius: "10px",
        opacity: 1,
      }}
    >
      <Header title="Profile" />
      <div
        className="mx-2 my-2 p-3"
        style={{
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        <Row style={{ font: "normal normal bold 24px/34px Bahnschrift-Bold" }}>
          <Col xs={4}>
            <span
              style={{
                width: "107px",
                height: "107px",
                borderRadius: "100%",
                borderStyle: "solid",
                borderWidth: "2px",
                borderColor: "#E9E9E9",
                backgroundColor: "#E9E9E9",
                display: "inline-block",
              }}
            ></span>
          </Col>
          <Col>
            {profileInfo.owner_first_name} {profileInfo.owner_last_name}
          </Col>
        </Row>
        <div style={{ font: "normal normal bold 24px/34px Bahnschrift-Bold" }}>
          Account
        </div>
        <Row className="p-2">
          <Col xs={1}>
            <img src={Personal} alt="Personal" />
          </Col>
          <Col className="mx-2" style={mediumBold}>
            {" "}
            Personal
          </Col>
          <Col xs={1}>
            <img
              src={GreyArrowRight}
              onClick={() => setStage("PROFILE")}
              // onClick={() => alert("profile button clicked")}
              style={{ cursor: "pointer" }}
              alt="Arrow Right"
            />
          </Col>
        </Row>
        <hr />
        <Row className="p-2">
          <Col xs={1}>
            <img src={Personal} alt="Personal" />
          </Col>
          <Col className="mx-2" style={mediumBold}>
            {" "}
            Payment Methods
          </Col>
          <Col xs={1}>
            <img
                src={GreyArrowRight}
                onClick={() => setStage("PAYMENTS")}
                // onClick={() => alert("profile button clicked")}
                style={{ cursor: "pointer" }}
                alt="Arrow Right"
            />
          </Col>
        </Row>
        <hr />
        <Row className="p-2">
          <Col xs={1}>
            <img src={LeaseIcon} alt="Lease Icon" />
          </Col>
          <Col className="mx-2" style={mediumBold}>
            Documents
          </Col>
          <Col xs={1}>
            <img src={GreyArrowRight} alt="Arrow Right" />
          </Col>
        </Row>
        <hr />
        <Row className="p-2">
          <Col xs={1}>
            <img src={Contacts_Blue} alt="Change Role" />
          </Col>
          <Col className="mx-2" style={mediumBold}>
            Change Role
          </Col>
          <Col xs={1}>
            <img
              src={GreyArrowRight}
              onClick={() => setStage("ROLES")}
              // onClick={() => alert("roles button clicked")}
              style={{ cursor: "pointer" }}
              alt="Arrow Right"
            />
          </Col>
        </Row>
        <hr />
        <Row className="my-4">
          <Logout />
        </Row>
      </div>
    </div>
  );
}

export default OwnerProfileTab;
