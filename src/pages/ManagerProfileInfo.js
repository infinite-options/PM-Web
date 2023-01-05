import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import AppContext from "../AppContext";
import Header from "../components/Header";
import Checkbox from "../components/Checkbox";
import PaymentSelection from "../components/PaymentSelection";
import ManagerFees from "../components/ManagerFees";
import ManagerLocations from "../components/ManagerLocations";
import { get, post } from "../utils/api";
import { squareForm, pillButton, hidden, red, small } from "../utils/styles";

function ManagerProfileInfo(props) {
  const context = useContext(AppContext);
  const { access_token, user } = context.userData;
  const { autofillState, setAutofillState } = props;
  const updateAutofillState = (profile) => {
    const newAutofillState = { ...autofillState };
    for (const key of Object.keys(newAutofillState)) {
      if (key in profile) {
        newAutofillState[key] = profile[key];
      }
    }
    setAutofillState(newAutofillState);
  };
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(autofillState.first_name);
  const [lastName, setLastName] = useState(autofillState.last_name);
  const [phoneNumber, setPhoneNumber] = useState(autofillState.phone_number);
  const [email, setEmail] = useState(autofillState.email);
  const [einNumber, setEinNumber] = useState(autofillState.ein_number);
  const [ssn, setSsn] = useState(autofillState.ssn);
  const [showSsn, setShowSsn] = useState(false);
  const [showEin, setShowEin] = useState(false);
  const paymentState = useState({
    paypal: autofillState.paypal,
    applePay: autofillState.apple_pay,
    zelle: autofillState.zelle,
    venmo: autofillState.venmo,
    accountNumber: autofillState.account_number,
    routingNumber: autofillState.routing_number,
  });
  const [feeState, setFeeState] = useState([]);
  const [locationState, setLocationState] = useState([]);
  useEffect(() => {
    if (access_token === null) {
      navigate("/");
      return;
    }
    if (user.role.indexOf("MANAGER") === -1) {
      console.log("no manager profile");
      props.onConfirm();
    }
    const fetchProfileInfo = async () => {
      const response = await get("/managerProfileInfo", access_token);
      if (response.result.length !== 0) {
        console.log("manager profile already set up");
        // eventually update page with current info, allow user to update and save new info
        props.onConfirm();
        return;
      }
    };
    fetchProfileInfo();
  }, []);
  const [errorMessage, setErrorMessage] = useState("");
  const submitInfo = async () => {
    console.log(paymentState[0]);
    const { paypal, applePay, zelle, venmo, accountNumber, routingNumber } =
      paymentState[0];
    if (
      firstName === "" ||
      lastName === "" ||
      phoneNumber === "" ||
      email === ""
    ) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    if (ssn === "" && einNumber === "") {
      setErrorMessage("Please add at least one identification number");
      return;
    }
    if (
      paypal === "" &&
      applePay === "" &&
      zelle === "" &&
      venmo === "" &&
      (accountNumber === "" || routingNumber === "")
    ) {
      setErrorMessage("Please add at least one payment method");
      return;
    }
    if (feeState.length === 0) {
      setErrorMessage("Please add at least one fee");
      return;
    }
    if (locationState.length === 0) {
      setErrorMessage("Please add at least one location");
      return;
    }
    const managerProfile = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email: email,
      ein_number: showEin ? einNumber : "",
      ssn: showSsn ? ssn : "",
      paypal: paypal,
      apple_pay: applePay,
      zelle: zelle,
      venmo: venmo,
      account_number: accountNumber,
      routing_number: routingNumber,
      fees: JSON.stringify(feeState),
      locations: JSON.stringify(locationState),
    };
    await post("/managerProfileInfo", managerProfile, access_token);
    updateAutofillState(managerProfile);
    props.onConfirm();
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
    <div className="pb-5">
      <Header title="PM Profile" />
      <Container>
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            First Name {firstName === "" ? required : ""}
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="First"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Last Name {lastName === "" ? required : ""}
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="Last"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Phone Number {phoneNumber === "" ? required : ""}
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="xxx-xxx-xxxx"
            value={phoneNumber}
            type="tel"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Email Address {email === "" ? required : ""}
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Container>
          <h6>Please add at least one:</h6>
          <Row className="mb-1">
            <Col className="d-flex align-items-center">
              <Checkbox type="BOX" onClick={(checked) => setShowSsn(checked)} />
              <p className="d-inline-block mb-0">SSN</p>
            </Col>
            <Col>
              <Form.Control
                style={showSsn ? squareForm : hidden}
                placeholder="123-45-6789"
                value={ssn}
                onChange={(e) => setSsn(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="mb-1">
            <Col className="d-flex align-items-center">
              <Checkbox type="BOX" onClick={(checked) => setShowEin(checked)} />
              <p className="d-inline-block mb-0">EIN Number</p>
            </Col>
            <Col>
              <Form.Control
                style={showEin ? squareForm : hidden}
                placeholder="12-1234567"
                value={einNumber}
                onChange={(e) => setEinNumber(e.target.value)}
              />
            </Col>
          </Row>
        </Container>
        <PaymentSelection state={paymentState} />
        <Container className="px-2">
          <h6 className="mb-3">Fees you charge:</h6>
          <ManagerFees
            feeState={feeState}
            setFeeState={setFeeState}
            editProfile={true}
          />
        </Container>
        <ManagerLocations
          locationState={locationState}
          setLocationState={setLocationState}
          editProfile={true}
        />
        <div className="text-center" style={errorMessage === "" ? hidden : {}}>
          <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
        </div>
        <div className="text-center my-3">
          <Button
            variant="outline-primary"
            style={pillButton}
            onClick={submitInfo}
          >
            Save Manager Profile
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default ManagerProfileInfo;
