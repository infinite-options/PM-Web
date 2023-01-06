import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { squareForm, hidden, red, small, pillButton } from "../utils/styles";
import { get, post } from "../utils/api";
import AppContext from "../AppContext";
import Checkbox from "../components/Checkbox";
import Header from "../components/Header";
import ArrowDown from "../icons/ArrowDown.svg";

function EmployeeProfile(props) {
  const { businessType, onConfirm, autofillState, setAutofillState } = props;
  const updateAutofillState = (profile) => {
    const newAutofillState = { ...autofillState };
    for (const key of Object.keys(newAutofillState)) {
      if (key in profile) {
        newAutofillState[key] = profile[key];
      }
    }
    setAutofillState(newAutofillState);
  };
  const { userData } = useContext(AppContext);
  const { user, access_token } = userData;
  const [firstName, setFirstName] = useState(autofillState.first_name);
  const [lastName, setLastName] = useState(autofillState.last_name);
  const [phoneNumber, setPhoneNumber] = useState(autofillState.phone_number);
  const [email, setEmail] = useState(autofillState.email);
  const [ssn, setSsn] = useState(autofillState.ssn);
  const [einNumber, setEinNumber] = useState(autofillState.ein_number);
  const [companyRole, setCompanyRole] = useState("");
  const [company, setCompany] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [showSsn, setShowSsn] = useState(false);
  const [showEin, setShowEin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );

  useEffect(async () => {
    console.log(props);
    const fetchEmployee = async () => {
      const emp_res = await get(`/employees?employee_email=${user.email}`);
      console.log("emp_res manangement", emp_res.result, businessType);
      let emp_res_type = [];

      if (emp_res.result.length > 0) {
        emp_res.result.map((emp) => {
          if (emp.employee_role != "Owner") {
            emp_res_type.push(emp);
            let buid = emp.business_uid;
            const fetchBusinesses = async () => {
              const busi_res = await get(`/businesses?business_uid=${buid}`);
              console.log(
                "busi_res maintenance",
                busi_res.result[0].business_type,
                businessType
              );
              let busi_res_type = [];
              busi_res.result.length > 1
                ? busi_res.result.map((busi) => {
                    busi_res_type.push(busi.business_type);
                  })
                : busi_res_type.push(busi_res.result[0].business_type);
              console.log("maintenance", busi_res_type);
              if (
                busi_res.result.length !== 0 &&
                busi_res_type.includes(businessType)
              ) {
                console.log("business profile already set up");
                // eventually update page with current info, allow user to update and save new info
                props.onConfirm();
                return;
              }
            };
            fetchBusinesses();
          }
        });
      } else {
        if (emp_res.result[0].employee_role != "Owner") {
          emp_res_type.push(emp_res.result[0].employee_role);
        }
      }
      console.log("manangement", emp_res_type);
      if (emp_res.result.length !== 0 && emp_res_type.includes(businessType)) {
        console.log("employee profile already set up");
        // eventually update page with current info, allow user to update and save new info
        props.onConfirm();
        return;
      }
    };
    fetchEmployee();

    if (
      user.role.indexOf(
        `${businessType === "MANAGEMENT" ? "PM" : "MAINT"}_EMPLOYEE`
      ) === -1
    ) {
      console.log("no employee profile");
      props.onConfirm();
    }
    const response = await get(`/businesses?business_type=${businessType}`);
    console.log("response", response.result);
    setBusinesses(response.result);
    setCompany(JSON.stringify(response.result[0]));
  }, []);

  const submitForm = async () => {
    if (
      firstName === "" ||
      lastName === "" ||
      phoneNumber === "" ||
      email === "" ||
      companyRole === ""
    ) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    if (ssn === "" && einNumber === "") {
      setErrorMessage("Please include at least one identification number");
      return;
    }
    console.log(company);
    const employeeInfo = {
      user_uid: user.user_uid,
      business_uid: JSON.parse(company).business_uid,
      role: companyRole,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email: email,
      ssn: ssn,
      ein_number: einNumber,
    };
    console.log(employeeInfo);
    const response = await post("/employees", employeeInfo, access_token);
    updateAutofillState(employeeInfo);
    onConfirm();
  };
  function formatPhoneNumber(value) {
    // if input value is falsy eg if the user deletes the input, then just return
    if (!value) return value;

    // clean the input for any non-digit values.
    const phoneNumber = value.replace(/[^\d]/g, "");

    // phoneNumberLength is used to know when to apply our formatting for the phone number
    const phoneNumberLength = phoneNumber.length;

    // we need to return the value with no formatting if its less then four digits
    // this is to avoid weird behavior that occurs if you  format the area code to early
    if (phoneNumberLength < 4) return phoneNumber;

    // if phoneNumberLength is greater than 4 and less the 7 we start to return
    // the formatted number
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }

    // finally, if the phoneNumberLength is greater then seven, we add the last
    // bit of formatting and return it.
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  }

  return (
    <div className="pb-5">
      <Header
        title={`${
          businessType === "MANAGEMENT" ? "PM" : "Mainenance"
        } Employee Profile`}
      />
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
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Company of Employment
          </Form.Label>
          <Form.Select
            style={{ ...squareForm, backgroundImage: `url(${ArrowDown})` }}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          >
            {console.log("businesses", businesses)}
            {businesses.map((business, i) => (
              <option key={i} value={JSON.stringify(business)}>
                {business.business_name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Your Role at the Company {companyRole === "" ? required : ""}
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="Role"
            value={companyRole}
            onChange={(e) => setCompanyRole(e.target.value)}
          />
        </Form.Group>
        <Container className="my-5">
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
          <div
            className="text-center"
            style={errorMessage === "" ? hidden : {}}
          >
            <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
          </div>
        </Container>
        <div className="my-3 text-center">
          <Button
            variant="outline-primary"
            style={pillButton}
            onClick={submitForm}
          >
            Save Profile
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default EmployeeProfile;
