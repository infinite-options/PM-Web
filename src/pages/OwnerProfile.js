import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import AppContext from "../AppContext";
import Header from "../components/Header";
import Check from "../icons/Check.svg";
import { squareForm, red } from "../utils/styles";
import { get, put } from "../utils/api";

import EditIcon from "../icons/EditIcon.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";
import Logout from "../components/Logout";

function OwnerProfile(props) {
  const context = useContext(AppContext);
  const { userData, refresh } = context;
  const { access_token, user } = userData;
  const navigate = useNavigate();
  const { errorMessage, setShowFooter, setTab } = props;
  const [footerTab, setFooterTab] = useState("PROFILE");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [einNumber, setEinNumber] = useState("");
  const [ssn, setSsn] = useState("");
  const [paypal, setPaypal] = useState("");
  const [applePay, setApplePay] = useState("");
  const [zelle, setZelle] = useState("");
  const [venmo, setVenmo] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
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

      setFirstName(response.result[0].owner_first_name);
      setLastName(response.result[0].owner_last_name);
      setEmail(response.result[0].owner_email);
      setSsn(response.result[0].owner_ssn);
      setPhoneNumber(response.result[0].owner_phone_number);
      setEinNumber(response.result[0].owner_ein_number);
      setPaypal(response.result[0].owner_paypal);
      setApplePay(response.result[0].owner_apple_pay);
      setZelle(response.result[0].owner_zelle);
      setVenmo(response.result[0].owner_venmo);
      setAccountNumber(response.result[0].owner_account_number);
      setRoutingNumber(response.result[0].owner_routing_number);
    };

    fetchProfile();
  }, []);

  const submitInfo = async () => {
    const ownerProfile = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
      ein_number: einNumber,
      paypal: paypal,
      apple_pay: applePay,
      ssn: ssn,
      zelle: zelle,
      venmo: venmo,
      account_number: accountNumber,
      routing_number: routingNumber,
    };

    await put(`/ownerProfileInfo`, ownerProfile, access_token);
    props.onConfirm();
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
    <div className="h-100 d-flex flex-column">
      <Header
        title="Profile"
        leftText="Cancel"
        leftFn={() => setTab("DASHBOARD")}
        rightText="Save"
        rightFn={() => {
          submitInfo();
          setTab("DASHBOARD");
        }}
      />
      <Container style={{ minHeight: "100%" }}>
        <Form.Group className="mx-2 my-3">
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
        <Form.Group className="mx-2 my-3">
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
        <Form.Group className="mx-2 my-3">
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
        <Form.Group className="mx-2 my-3">
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
        <h5 className="mx-2 my-3">Identification Numbers</h5>
        <Row>
          <Col className="px-0">
            <Form.Group className="mx-2 mb-3">
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
          <Col className="px-0">
            <Form.Group className="mx-2 mb-3">
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

        <h5 className="mx-2 my-3">Payment Options</h5>
        <Row>
          <Col className="px-0">
            <Form.Group className="mx-2 mb-3">
              <Form.Label as="h6" className="mb-0 ms-2">
                PayPal
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder="albert_einstein@gmail.com"
                value={paypal}
                onChange={(e) => setPaypal(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col className="px-0">
            <Form.Group className="mx-2 mb-3">
              <Form.Label as="h6" className="mb-0 ms-2">
                Apple Pay
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder="(081)230-1901"
                value={applePay}
                onChange={(e) => setApplePay(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col className="px-0">
            <Form.Group className="mx-2 mb-3">
              <Form.Label as="h6" className="mb-0 ms-2">
                Zelle
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder="albert_einstein@gmail.com"
                value={zelle}
                onChange={(e) => setZelle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col className="px-0">
            <Form.Group className="mx-2 mb-3">
              <Form.Label as="h6" className="mb-0 ms-2">
                Venmo
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder="1231"
                value={venmo}
                onChange={(e) => setVenmo(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col className="px-0">
            <Form.Group className="mx-2 mb-3">
              <Form.Label as="h6" className="mb-0 ms-2">
                Checking Account Number
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col className="px-0">
            <Form.Group className="mx-2 mb-3">
              <Form.Label as="h6" className="mb-0 ms-2">
                Routing Number
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder="Routing Number"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Logout />
      </Container>
    </div>
  );
}

export default OwnerProfile;
