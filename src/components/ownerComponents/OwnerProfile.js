import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppContext from "../../AppContext";
import Header from "../Header";
import OwnerPaymentSelection from "../ownerComponents/OwnerPaymentSelection";
import SideBar from "./SideBar";
import OwnerFooter from "./OwnerFooter";
import { get, put, post } from "../../utils/api";
import {
  squareForm,
  gray,
  headings,
  pillButton,
  red,
  hidden,
  small,
  bluePillButton,
  sidebarStyle,
} from "../../utils/styles";
import {
  formatPhoneNumber,
  formatSSN,
  MaskCharacter,
} from "../../utils/helper";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "2px 2px",
      border: "0.5px solid grey ",
      wordBreak: "break-word",
    },
    width: "100%",
    tableLayout: "fixed",
  },
});
function OwnerProfile(props) {
  var CryptoJS = require("crypto-js");
  const classes = useStyles();
  const context = useContext(AppContext);
  const { userData, refresh, logout } = context;
  const { access_token, user } = userData;
  const navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [einNumber, setEinNumber] = useState("");
  const [ssn, setSsn] = useState("");
  const [showSSN, setShowSSN] = useState(true);
  const [paymentState, setPaymentState] = useState({
    paypal: "",
    applePay: "",
    zelle: "",
    venmo: "",
    accountNumber: "",
    routingNumber: "",
  });
  const [width, setWindowWidth] = useState(1024);
  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };
  const responsiveSidebar = {
    showSidebar: width > 1023,
  };
  const loadProfile = (profile) => {
    // console.log(profile.owner_ssn);
    setProfileInfo(profile);
    setFirstName(profile.owner_first_name);
    setLastName(profile.owner_last_name);
    setEmail(profile.owner_email);
    setPhoneNumber(profile.owner_phone_number);
    setEinNumber(profile.owner_ein_number);
    setSsn(
      CryptoJS.AES.decrypt(
        profile.owner_ssn,
        process.env.REACT_APP_ENKEY
      ).toString(CryptoJS.enc.Utf8)
    );
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
    // console.log(response);

    if (response.msg === "Token has expired") {
      // console.log("here msg");
      refresh();
      return;
    }

    if (user.role.indexOf("OWNER") === -1) {
      // console.log("no owner profile");
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
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
      ssn: CryptoJS.AES.encrypt(ssn, process.env.REACT_APP_ENKEY).toString(),
      ein_number: einNumber,
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

  const updatePassword = async (u) => {
    if (password === "" || confirmPassword === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords must match");
      return;
    }

    // console.log(u);
    const user = {
      email: email,
      password: password,
      user_uid: u.user_uid,
    };
    // console.log(user);
    const response = await post("/update_email_password", user);
    if (response.code !== 200) {
      setErrorMessage(response.message);
      return;
      // add validation
    }
    logout();
    navigate("/");
    window.scrollTo(0, 0);
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
    <div>
      <Row className="w-100 mb-5 overflow-hidden">
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5 overflow-scroll">
          <Header
            title="Profile"
            leftText={editProfile ? "Cancel" : ""}
            leftFn={() => (editProfile ? setEditProfile(false) : "")}
            rightText={editProfile ? "Save" : "Edit"}
            rightFn={() => (editProfile ? submitInfo() : setEditProfile(true))}
          />
          {editProfile ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
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
                        placeholder="(xxx)xxx-xxxx"
                        value={phoneNumber}
                        onChange={(e) =>
                          setPhoneNumber(formatPhoneNumber(e.target.value))
                        }
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
                        placeholder="xxx-xx-xxxx"
                        value={ssn}
                        pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"
                        onChange={(e) => setSsn(formatSSN(e.target.value))}
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
                        placeholder="xx-xxxxxxx"
                        value={einNumber}
                        pattern="[0-9]{2}-[0-9]{7}"
                        onChange={(e) => setEinNumber(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>
          ) : (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="mb-4" style={headings}>
                <div>Personal Details</div>
              </Row>

              <Row className="mx-3">
                <Table
                  classes={{ root: classes.customTable }}
                  size="small"
                  responsive="md"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell> First Name</TableCell>
                      <TableCell> Last Name</TableCell>
                      <TableCell> Phone Number</TableCell>
                      <TableCell> Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {" "}
                        {firstName && firstName !== "NULL"
                          ? firstName
                          : "No First Name Provided"}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {lastName && lastName !== "NULL"
                          ? lastName
                          : "No Last Name Provided"}
                      </TableCell>
                      <TableCell>
                        {phoneNumber && phoneNumber !== "NULL"
                          ? phoneNumber
                          : "No Phone Number Provided"}
                      </TableCell>
                      <TableCell>
                        {email && email !== "NULL"
                          ? email
                          : "No Email Provided"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Row>

              <div className="my-2">
                <Row className="mb-4" style={headings}>
                  <div>Identification Details</div>
                </Row>

                <Row className="mx-3">
                  <Table
                    classes={{ root: classes.customTable }}
                    size="small"
                    responsive="md"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell> SSN</TableCell>
                        <TableCell> EIN</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell onClick={() => setShowSSN(!showSSN)}>
                          {" "}
                          {ssn && ssn !== "NULL"
                            ? showSSN
                              ? MaskCharacter(ssn, "*")
                              : ssn
                            : "No SSN Provided"}
                        </TableCell>
                        <TableCell>
                          {einNumber && einNumber !== "NULL"
                            ? einNumber
                            : "No EIN Provided"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
            <div className="mt-2 mx-2">
              <Row>
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Button
                    style={pillButton}
                    onClick={() => setEditProfile(false)}
                    variant="outline-primary"
                  >
                    Cancel
                  </Button>
                </Col>
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  {" "}
                  <Button style={bluePillButton} onClick={() => submitInfo()}>
                    Save
                  </Button>
                </Col>
              </Row>
            </div>
          ) : (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Row>
                <Col></Col>
                <Col xs={4} className="d-flex justify-content-center">
                  {" "}
                  <Button
                    style={resetPassword === true ? hidden : pillButton}
                    onClick={() => setResetPassword(true)}
                  >
                    Reset Password
                  </Button>
                </Col>
                <Col></Col>
              </Row>

              {resetPassword ? (
                <div>
                  <Row className="m-3">
                    <Col className="mx-2 my-3">
                      <h6>Email</h6>
                      <p style={gray}>
                        {email && email !== "NULL"
                          ? email
                          : "No Email Provided"}
                      </p>
                    </Col>
                    <Col>
                      <Form.Group className="mx-2 my-3">
                        <h6>
                          Enter Password {password === "" ? required : ""}
                        </h6>
                        <Form.Control
                          style={{ borderRadius: 0 }}
                          placeholder="Password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mx-2 my-3">
                        <h6>
                          Confirm Password{" "}
                          {confirmPassword === "" ? required : ""}
                        </h6>
                        <Form.Control
                          style={{ borderRadius: 0 }}
                          placeholder="Confirm Password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div
                    className="text-center"
                    style={errorMessage === "" ? hidden : {}}
                  >
                    <p style={{ ...red, ...small }}>
                      {errorMessage || "error"}
                    </p>
                  </div>

                  <Row>
                    <Col className="d-flex justify-content-center">
                      <Button
                        style={pillButton}
                        onClick={() => updatePassword(user)}
                      >
                        Update Password
                      </Button>
                    </Col>{" "}
                    <Col className="d-flex justify-content-center">
                      <Button
                        style={pillButton}
                        onClick={() => setResetPassword(false)}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-5">
            <OwnerFooter />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default OwnerProfile;
