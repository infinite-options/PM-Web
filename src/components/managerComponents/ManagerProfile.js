import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";
import AppContext from "../../AppContext";
import Header from "../Header";
import ManagerPaymentSelection from "./ManagerPaymentSelection";
import ManagerFooter from "./ManagerFooter";
import SideBar from "./SideBar";
import { get, put } from "../../utils/api";
import { squareForm, gray, headings } from "../../utils/styles";
function ManagerProfile(props) {
  const context = useContext(AppContext);
  const { userData, refresh } = context;
  const { access_token, user } = userData;
  const navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
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
  // const feeState = useState([]);
  // const locationState = useState([]);
  const [feeState, setFeeState] = useState([]);
  const [locationState, setLocationState] = useState([]);
  const [width, setWindowWidth] = useState(0);
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
    setProfileInfo(profile);
    setCompanyName(profile.business_name);
    setFirstName(profile.employee_first_name);
    setLastName(profile.employee_last_name);
    setEmail(profile.employee_email);
    setPhoneNumber(profile.employee_phone_number);
    setEinNumber(profile.employee_ein_number);
    setSsn(profile.employee_ssn);
    setPaymentState({
      paypal: profile.business_paypal ? profile.business_paypal : "",
      applePay: profile.business_apple_pay ? profile.business_apple_pay : "",
      zelle: profile.business_zelle ? profile.business_zelle : "",
      venmo: profile.business_venmo ? profile.business_venmo : "",
      accountNumber: profile.business_account_number
        ? profile.business_account_number
        : "",
      routingNumber: profile.business_routing_number
        ? profile.business_routing_number
        : "",
    });
    setFeeState(JSON.parse(profile.business_services_fees));

    const location = JSON.parse(profile.business_locations);
    setLocationState(location);
  };

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
      // console.log(profile)
      loadProfile(profile);
    }
  };

  useEffect(fetchProfileInfo, [access_token]);

  const saveProfile = async () => {
    const { paypal, applePay, zelle, venmo, accountNumber, routingNumber } =
      paymentState;
    const employee_info = {
      employee_uid: profileInfo.employee_uid,
      user_uid: profileInfo.user_uid,
      business_uid: profileInfo.business_uid,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email: email,
      ein_number: einNumber,
      ssn: ssn,
    };
    const business_info = {
      business_uid: profileInfo.business_uid,
      type: profileInfo.business_type,
      name: profileInfo.business_name,
      phone_number: profileInfo.business_phone_number,
      email: profileInfo.business_email,
      ein_number: profileInfo.business_ein_number,
      services_fees: feeState[0],
      locations: locationState[0],
      paypal: paypal || null,
      apple_pay: applePay || null,
      zelle: zelle || null,
      venmo: venmo || null,
      account_number: accountNumber || null,
      routing_number: routingNumber || null,
    };

    const employee_response = await put("/employees", employee_info);
    const business_response = await put("/businesses", business_info);
    setEditProfile(false);
    fetchProfileInfo();
  };

  return (
    <div className="w-100 overflow-hidden">
      <div className="flex-1">
        <div
          hidden={!responsiveSidebar.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </div>
        <div className="w-100 mb-5">
          <Header
            title="Profile"
            leftText={editProfile ? "Cancel" : ""}
            leftFn={() => (editProfile ? setEditProfile(false) : "")}
            rightText={editProfile ? "Save" : "Edit"}
            rightFn={() => (editProfile ? saveProfile() : setEditProfile(true))}
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

                <Form.Group className="my-2">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Company Name
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="my-2">
                      <Form.Label as="h6" className="mb-0 ms-2">
                        First Name
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        placeholder="First Name"
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
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="my-2">
                      <Form.Label as="h6" className="mb-0 ms-2">
                        Email Address
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        placeholder="Email"
                        value={email}
                        type="email"
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
                        EIN Number
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        placeholder="12-1234567"
                        value={einNumber}
                        onChange={(e) => setEinNumber(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="my-0">
                      <Form.Label as="h6" className="mb-0 ms-2">
                        Social Security Number
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        placeholder="123-45-6789"
                        value={ssn}
                        onChange={(e) => setSsn(e.target.value)}
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
              <h6>Company Name</h6>
              <p style={gray}>
                {companyName && companyName !== "NULL"
                  ? companyName
                  : "No Company Details Provided"}
              </p>

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
                      {einNumber && einNumber !== "NULL"
                        ? ssn
                        : "No EIN Provided"}
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          )}

          <ManagerPaymentSelection
            paymentState={paymentState}
            setPaymentState={setPaymentState}
            editProfile={editProfile}
          />

          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-5">
            <ManagerFooter />
          </div>
        </div>{" "}
      </div>{" "}
    </div>
  );
}

export default ManagerProfile;
