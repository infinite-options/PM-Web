import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Popover from "@material-ui/core/Popover";
import AppContext from "../AppContext";
import Header from "../components/Header";
import AddressForm from "../components/AddressForm";
import Check from "../icons/Check.svg";
import ArrowUp from "../icons/ArrowUp.svg";
import ArrowDown from "../icons/ArrowDown.svg";
import { get, put, post } from "../utils/api";
import { squareForm, pillButton, small, underline } from "../utils/styles";

function TenantProfile(props) {
  const context = useContext(AppContext);
  const { userData, refresh } = context;
  const { access_token, user } = userData;
  const navigate = useNavigate();
  const { setShowFooter, setTab } = props;
  const [footerTab, setFooterTab] = useState("PROFILE");
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandFrequency, setExpandFrequency] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [salary, setSalary] = useState("");
  const [frequency, setFrequency] = useState("Annual");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [ssn, setSsn] = useState("");
  const [dlNumber, setDLNumber] = useState("");
  const currentAddressState = useState({
    street: "",
    unit: "",
    city: "",
    state: "",
    zip: "",
    pm_name: "",
    pm_number: "",
    lease_start: "",
    lease_end: "",
    rent: "",
  });
  const [usePreviousAddress, setUsePreviousAddress] = useState(false);
  const previousAddressState = useState({
    street: "",
    unit: "",
    city: "",
    state: "",
    zip: "",
    pm_name: "",
    pm_number: "",
    lease_start: "",
    lease_end: "",
    rent: "",
  });
  //popover open and close
  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await get("/tenantProfileInfo", access_token);
      console.log(response);

      if (response.msg === "Token has expired") {
        console.log("here msg");
        refresh();

        return;
      }
      setFirstName(response.result[0].tenant_first_name);
      setLastName(response.result[0].tenant_last_name);
      setSsn(response.result[0].tenant_ssn);
      setSalary(response.result[0].tenant_current_salary);
      setJobTitle(response.result[0].tenant_current_job_title);
      setCompany(response.result[0].tenant_current_job_company);
      setDLNumber(response.result[0].tenant_drivers_license_number);
      setCompany(response.result[0].tenant_current_job_company);
      currentAddressState[1](
        JSON.parse(response.result[0].tenant_current_address)
      );
      if (response.result[0].tenant_previous_address != null) {
        previousAddressState[1](
          JSON.parse(response.result[0].tenant_previous_address)
        );
      }
      if (response.result[0].tenant_previous_address != null) {
        setUsePreviousAddress(true);
      }
    };
    fetchProfile();
  }, []);

  const submitInfo = async () => {
    const tenantProfile = {
      first_name: firstName,
      last_name: lastName,
      ssn: ssn,
      current_salary: salary,
      //salary_freq: frequency,
      current_job_title: jobTitle,
      current_job_company: company,
      drivers_license_number: dlNumber,
      current_address: currentAddressState[0],
      previous_addresses: usePreviousAddress ? previousAddressState[0] : null,
    };
    await put("/tenantProfileInfo", tenantProfile, access_token);
    props.onConfirm();
  };
  console.log(usePreviousAddress, previousAddressState[0]);
  useEffect(() => {
    setShowFooter(true);
  });
  const allFrequency = [
    "Weekly",
    "Biweekly",
    "Monthly",
    "Annual",
    "Hourly Rate",
  ];
  const frequencylist = () => {
    return (
      <div>
        {allFrequency.map((freq) => {
          return (
            <div
              style={{
                cursor: "pointer",
                //backgroundColor: `${view.color}`,
                color: "#2C2C2E",
                fontSize: "16px",
                padding: "5px",
                font: "normal normal bold 20px/24px SF Pro Display",
              }}
              onClick={(e) => {
                setFrequency(freq);
                setExpandFrequency(!false);
                handleClose(e);
              }}
            >
              {freq}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Profile"
        leftText="Cancel"
        leftFn={() => setTab("DASHBOARD")}
        rightText="Save"
        rightFn={() => {
          submitInfo();
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
        <Row className="mx-0 my-0">
          <Col className="px-0">
            <Form.Group className="mx-2 mb-3">
              <Form.Label as="h6" className="mb-0 ms-2">
                Salary
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder="$"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col
            className="px-0"
            onClick={(e) => {
              setExpandFrequency(!expandFrequency);
              handleClick(e);
            }}
          >
            <Form.Group className="mx-2 mb-3">
              <Form.Label as="h6" className="mb-0 ms-2">
                Frequency
              </Form.Label>
              <div
                className="d-flex justify-content-between"
                style={{ border: "1px solid #777777", padding: "6px" }}
              >
                {frequency}
                <img src={expandFrequency ? ArrowUp : ArrowDown} alt="Expand" />
              </div>
            </Form.Group>
          </Col>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={{ top: 500, left: 300 }}
            anchorOrigin={{
              vertical: "center",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            style={{
              backgroundClip: "context-box",
              borderRadius: "20px",
            }}
          >
            {frequencylist()}
          </Popover>
        </Row>

        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Current Job Title
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Company Name
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mx-2 my-3">
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
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Driver's License Number
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="1234567890"
            value={dlNumber}
            onChange={(e) => setDLNumber(e.target.value)}
          />
        </Form.Group>
        <h5 className="mx-2 my-3">Current Address</h5>
        <AddressForm state={currentAddressState} />
        <Row>
          <Col
            xs={2}
            className="px-0 d-flex justify-content-end align-items-center"
          >
            <div
              onClick={() => setUsePreviousAddress(!usePreviousAddress)}
              style={{
                border: "1px solid #000000",
                width: "24px",
                height: "24px",
                textAlign: "center",
              }}
            >
              {usePreviousAddress ? (
                <img src={Check} style={{ width: "13px", height: "9px" }} />
              ) : null}
            </div>
          </Col>
          <Col>
            <p
              style={{ ...underline, ...small }}
              className="text-primary mb-1 me-3"
            >
              Add another property manager reference if your last lease was for
              less than 2 years.
            </p>
          </Col>
        </Row>
        {usePreviousAddress ? (
          <div>
            <h5 className="mx-2 my-3">Previous Address</h5>
            <AddressForm state={previousAddressState} />
          </div>
        ) : (
          ""
        )}
      </Container>
    </div>
  );
}

export default TenantProfile;
