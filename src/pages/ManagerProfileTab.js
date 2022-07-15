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

function ManagerProfileTab(props) {
  const context = useContext(AppContext);
  const { userData, refresh } = context;
  const { access_token, user } = userData;
  const navigate = useNavigate();
  const { stage, setStage, setShowFooter } = props;

  const [profileInfo, setProfileInfo] = useState([]);

  useEffect(() => {
    setShowFooter(stage !== "NEW");
  }, [stage, setShowFooter]);

  const fetchProfileInfo = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }
    const busi_res = await get(`/businesses?business_email=${user.email}`);
    console.log("busi_res", busi_res);
    if (user.role.indexOf("MANAGER") === -1 || busi_res.result.length > 0) {
      console.log("no manager profile");
      // props.onConfirm();
    }

    const employee_response = await get(`/employees?user_uid=${user.user_uid}`);
    if (employee_response.result.length !== 0) {
      const employee = employee_response.result[0];
      const business_response = await get(
        `/businesses?business_uid=${employee.business_uid}`
      );
      const business = business_response.result[0];
      const profile = { ...employee, ...business };
      console.log(profile);
      setProfileInfo(profile);
      //   loadProfile(profile);
    }
  };
  useEffect(() => {
    if (access_token === null) {
      navigate("/");
    }
    fetchProfileInfo();
  }, [access_token]);

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
            {profileInfo.employee_first_name} {profileInfo.employee_last_name}{" "}
            <br />
            {profileInfo.business_name}
          </Col>
        </Row>
        <div style={{ font: "normal normal bold 24px/34px Bahnschrift-Bold" }}>
          Account
        </div>
        <Row className="p-2" onClick={() => setStage("PROFILE")}>
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
              style={{ cursor: "pointer" }}
              alt="Arrow Right"
            />
          </Col>
        </Row>
        <hr />
        <Row className="p-2" onClick={() => setStage("DOCUMENTS")}>
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
        <Row className="p-2" onClick={() => setStage("ROLES")}>
          <Col xs={1}>
            <img src={Contacts_Blue} alt="Change Role" />
          </Col>
          <Col className="mx-2" style={mediumBold}>
            Change Role
          </Col>
          <Col xs={1}>
            <img
              src={GreyArrowRight}
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

export default ManagerProfileTab;
