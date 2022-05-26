import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import AppContext from "../AppContext";
import Header from "../components/Header";
import { squareForm, red, gray, headings } from "../utils/styles";
import { get, put } from "../utils/api";
import OwnerPaymentSelection from "../components/OwnerPaymentSelection";
import Logout from "../components/Logout";

function OwnerProfile(props) {
  const context = useContext(AppContext);
  const { userData, refresh } = context;
  const { access_token, user } = userData;
  const navigate = useNavigate();
  const { errorMessage, setShowFooter, setFooterTab } = props;
  const [profileInfo, setProfileInfo] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [einNumber, setEinNumber] = useState("");
  const [ssn, setSsn] = useState("");
  const [paymentState, setPaymentState] = useState({
    paypal: "",
    applePay: "",
    zelle: "",
    venmo: "",
    accountNumber: "",
    routingNumber: "",
  });

  const loadProfile = (profile) => {
    setProfileInfo(profile);
    setFirstName(profile.owner_first_name);
    setLastName(profile.owner_last_name);
    setEmail(profile.owner_email);
    setPhoneNumber(profile.owner_phone_number);
    setEinNumber(profile.owner_ein_number);
    setSsn(profile.owner_ssn);
    setPaymentState({
      paypal: profile.owner_paypal ? profile.owner_paypal : "",
      applePay: profile.owner_apple_pay ? profile.owner_apple_pay : "",
      zelle: profile.owner_zelle ? profile.owner_zelle : "",
      venmo: profile.owner_venmo ? profile.owner_venmo : "",
      accountNumber: profile.owner_account_number
        ? profile.owner_account_number
        : "",
      routingNumber: profile.owner_routing_number
        ? profile.owner_routing_number
        : "",
    });
  };
  const fetchProfile = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }
    const response = await get("/ownerProfileInfo", access_token);
    console.log(response);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();
      return;
    }

    if (user.role.indexOf("OWNER") === -1) {
      console.log("no owner profile");
      props.onConfirm();
    }

    const owner = response.result[0];
    const profile = { ...owner };
    loadProfile(profile);
  };
  useEffect(() => {
    fetchProfile();
  }, [access_token]);

  const submitInfo = async () => {
    const { paypal, applePay, zelle, venmo, accountNumber, routingNumber } =
      paymentState;

    const ownerProfile = {
      first_name: profileInfo.firstName,
      last_name: profileInfo.lastName,
      email: profileInfo.email,
      phone_number: profileInfo.phoneNumber,
      ssn: profileInfo.ssn,
      ein_number: profileInfo.einNumber,
      paypal: paypal || null,
      apple_pay: applePay || null,
      zelle: zelle || null,
      venmo: venmo || null,
      account_number: accountNumber || null,
      routing_number: routingNumber || null,
    };

    await put(`/ownerProfileInfo`, ownerProfile, access_token);
    setEditProfile(false);
    fetchProfile();
    // props.onConfirm();
  };

  useEffect(() => {
    setShowFooter(true);
  });
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );

  return (
    <div className="pb-5 mb-5">
      <Header
        title="Profile"
        leftText={editProfile ? "Cancel" : "< Back"}
        leftFn={() =>
          editProfile ? setEditProfile(false) : setFooterTab("DASHBOARD")
        }
        rightText={editProfile ? "Save" : "Edit"}
        rightFn={() => (editProfile ? submitInfo() : setEditProfile(true))}
      />
      {editProfile ? (
        <div className="mx-3 my-3">
          <div className="my-3">
            <Row className="mb-4" style={headings}>
              <div>Personal Details</div>
            </Row>
            <Row>
              <Col>
                <Form.Group className="my-2">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    First Name
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="First"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="my-2">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Last Name
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="Last"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="my-2">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Phone Number
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="(789)909-9099"
                    value={lastName}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="my-2">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Email Id
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="nikTesla@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
          <div className="my-4">
            <Row className="mb-4" style={headings}>
              <div>Identification Details</div>
            </Row>
            <Row>
              <Col>
                <Form.Group className="my-0">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    SSN {ssn === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="131-89-1829"
                    value={ssn}
                    onChange={(e) => setSsn(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="my-0">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    EIN Number
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="1231"
                    value={einNumber}
                    onChange={(e) => setEinNumber(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        <div className="mx-3 my-3">
          <Row className="mb-4" style={headings}>
            <div>Personal Details</div>
          </Row>

          <Row>
            <Col>
              <h6>First Name</h6>
              <p style={gray}>
                {firstName && firstName !== "NULL"
                  ? firstName
                  : "No First Name Provided"}
              </p>
            </Col>
            <Col>
              <h6>Last Name</h6>
              <p style={gray}>
                {lastName && lastName !== "NULL"
                  ? lastName
                  : "No Last Name Provided"}
              </p>
            </Col>
          </Row>

          <Row>
            <Col>
              <h6>Phone Number</h6>
              <p style={gray}>
                {phoneNumber && phoneNumber !== "NULL"
                  ? phoneNumber
                  : "No Phone Number Provided"}
              </p>
            </Col>
            <Col>
              <h6>Email</h6>
              <p style={gray}>
                {email && email !== "NULL" ? email : "No Email Provided"}
              </p>
            </Col>
          </Row>

          <div className="my-2">
            <Row className="mb-4" style={headings}>
              <div>Identification Details</div>
            </Row>

            <Row>
              <Col>
                <h6>SSN</h6>
                <p style={gray}>
                  {ssn && ssn !== "NULL" ? ssn : "No SSN Provided"}
                </p>
              </Col>
              <Col>
                <h6>EIN</h6>
                <p style={gray}>
                  {einNumber && einNumber !== "NULL" ? ssn : "No EIN Provided"}
                </p>
              </Col>
            </Row>
          </div>
        </div>
      )}
      <OwnerPaymentSelection
        paymentState={paymentState}
        setPaymentState={setPaymentState}
        editProfile={editProfile}
      />
      {editProfile ? (
        ""
      ) : (
        <Row className="my-4">
          <Logout />
        </Row>
      )}
    </div>
  );
}

export default OwnerProfile;
