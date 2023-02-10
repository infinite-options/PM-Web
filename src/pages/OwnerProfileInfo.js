import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import AppContext from "../AppContext";
import Header from "../components/Header";
import Checkbox from "../components/Checkbox";
import PaymentSelection from "../components/PaymentSelection";
import { get, post } from "../utils/api";
import { squareForm, pillButton, hidden, red, small } from "../utils/styles";
import { formatPhoneNumber, formatSSN } from "../utils/helper";
function OwnerProfileInfo(props) {
  const context = React.useContext(AppContext);
  const { access_token, user } = context.userData;
  const navigate = useNavigate();
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
  const [firstName, setFirstName] = React.useState(autofillState.first_name);
  const [lastName, setLastName] = React.useState(autofillState.last_name);
  const [phoneNumber, setPhoneNumber] = React.useState(
    autofillState.phone_number
  );
  const [email, setEmail] = React.useState(autofillState.email);
  const [einNumber, setEinNumber] = React.useState(autofillState.ein_number);
  const [ssn, setSsn] = React.useState(autofillState.ssn);
  const paymentState = React.useState({
    paypal: autofillState.paypal,
    applePay: autofillState.apple_pay,
    zelle: autofillState.zelle,
    venmo: autofillState.venmo,
    accountNumber: autofillState.account_number,
    routingNumber: autofillState.routing_number,
  });
  const [errorMessage, setErrorMessage] = React.useState("");
  React.useEffect(() => {
    if (context.userData.access_token === null) {
      navigate("/");
      return;
    }
    const userRole = context.userData.user.role;
    if (userRole.indexOf("OWNER") === -1) {
      // console.log("no owner profile");
      props.onConfirm();
    }
    const fetchProfileInfo = async () => {
      const response = await get("/ownerProfileInfo", access_token);
      if (response.result.length !== 0) {
        // console.log("owner profile already set up");
        // eventually update page with current info, allow user to update and save new info
        props.onConfirm();
        return;
      }
    };
    fetchProfileInfo();
  }, []);
  const submitInfo = async () => {
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
    const ownerProfile = {
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
    };
    await post("/ownerProfileInfo", ownerProfile, access_token);
    updateAutofillState(ownerProfile);
    props.onConfirm();
  };
  const [showSsn, setShowSsn] = React.useState(false);
  const [showEin, setShowEin] = React.useState(false);

  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  return (
    <div
      className="pb-5 mb-5"
      style={{
        background: "#E9E9E9 0% 0% no-repeat padding-box",
        borderRadius: "10px",
        opacity: 1,
      }}
    >
      <Header title="Owner Profile" />
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
            placeholder="(xxx)xxx-xxxx"
            value={phoneNumber}
            type="tel"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
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
                placeholder="xxx-xx-xxxx"
                value={ssn}
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"
                onChange={(e) => setSsn(formatSSN(e.target.value))}
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
                placeholder="xx-xxxxxxx"
                value={einNumber}
                pattern="[0-9]{2}-[0-9]{7}"
                onChange={(e) => setEinNumber(e.target.value)}
              />
            </Col>
          </Row>
        </Container>
        <PaymentSelection state={paymentState} />
        <div className="text-center" style={errorMessage === "" ? hidden : {}}>
          <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
        </div>
        <div className="text-center mb-3">
          <Button
            variant="outline-primary"
            style={pillButton}
            onClick={submitInfo}
          >
            Save Owner Profile
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default OwnerProfileInfo;
