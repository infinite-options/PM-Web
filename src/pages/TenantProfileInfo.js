import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, DropdownButton, Dropdown } from "react-bootstrap";
import Popover from "@material-ui/core/Popover";
import AppContext from "../AppContext";
import Header from "../components/Header";
import Checkbox from "../components/Checkbox";
import AddressForm from "../components/AddressForm";
import { get, post } from "../utils/api";
import ArrowUp from "../icons/ArrowUp.svg";
import ArrowDown from "../icons/ArrowDown.svg";
import {
  squareForm,
  pillButton,
  small,
  underline,
  red,
  hidden,
} from "../utils/styles";

function TenantProfileInfo(props) {
  const { userData } = React.useContext(AppContext);
  const { access_token, user } = userData;
  const navigate = useNavigate();
  const {autofillState, setAutofillState} = props;
  const [type, setType] = React.useState("Apartment");

  const updateAutofillState = (profile) => {
  const newAutofillState = {...autofillState};

    for (const key of Object.keys(newAutofillState)) {
      if (key in profile) {
        newAutofillState[key] = profile[key];
      }
    }
    setAutofillState(newAutofillState);
  }
  const [anchorEl, setAnchorEl] = useState(null);
  // const [expandFrequency, setExpandFrequency] = useState(false);
  const [firstName, setFirstName] = React.useState(autofillState.first_name);
  const [lastName, setLastName] = React.useState(autofillState.last_name);
  const [salary, setSalary] = React.useState("");
  const [frequency, setFrequency] = useState("Annual");
  const [jobTitle, setJobTitle] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [ssn, setSsn] = React.useState(autofillState.ssn);
  const [dlNumber, setDLNumber] = React.useState("");
  const [dlState, setDLState] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [usePreviousAddress, setUsePreviousAddress] = React.useState(false);
  const [useDetailsIfRenting, setUseDetailsIfRenting] = React.useState(false);
  const defaultState = "--";
  const [selectedState, setSelectedState] = React.useState(defaultState);
  const [selectedDlState, setSelectedDlState] = React.useState(defaultState);
  const [selectedPrevState, setSelectedPrevState] = React.useState(defaultState);
  const currentAddressState = React.useState({
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

 
  const previousAddressState = React.useState({
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
 
  React.useEffect(() => {
      if (access_token === null) {
        navigate("/");
        return;
      }
      if (user.role.indexOf("TENANT") === -1) {
        console.log("no tenant profile");
        props.onConfirm();
      }
      const fetchProfileInfo = async () => {
        const response = await get("/tenantProfileInfo", access_token);
        if (response.result && response.result.length !== 0) {
          console.log("tenant profile already set up");
          // eventually update page with current info, allow user to update and save new info
          props.onConfirm();
          return;
        }
      };
      fetchProfileInfo();
  }, []);

  const submitInfo = async () => {
    currentAddressState[0].state = selectedState;
    const currentAddressInvalid =
      currentAddressState[0].street === "" ||
      currentAddressState[0].city === "" ||
      currentAddressState[0].state === defaultState ||
      currentAddressState[0].zip === "";
      // currentAddressState[0].lease_start === "" ||
      // currentAddressState[0].lease_end === "" ||
      // currentAddressState[0].rent === "";
    
    previousAddressState[0].state = selectedPrevState;

    const previousAddressInvalid =
      previousAddressState[0].street === "" ||
      previousAddressState[0].city === "" ||
      previousAddressState[0].state === defaultState ||
      previousAddressState[0].zip === "" ||
      previousAddressState[0].lease_start === "" ||
      previousAddressState[0].lease_end === "" ||
      previousAddressState[0].rent === "";
    if (
      firstName === "" ||
      lastName === "" ||
      salary === "" ||
      frequency === "" ||
      jobTitle === "" ||
      ssn === "" ||
      dlNumber === "" ||
      currentAddressInvalid ||
      (usePreviousAddress && previousAddressInvalid)
    ) {
      setErrorMessage("Please fill out all fields");
      return;
    }

    const tenantProfile = {
      first_name: firstName,
      last_name: lastName,
      current_salary: salary,
      salary_frequency: frequency,
      current_job_title: jobTitle,
      current_job_company: company,
      ssn: ssn,
      drivers_license_number: dlNumber,
      drivers_license_state: selectedDlState,
      current_address: currentAddressState[0],
      previous_address: usePreviousAddress ? previousAddressState[0] : null
    }
    await post('/tenantProfileInfo', tenantProfile, access_token);
    updateAutofillState(tenantProfile);
    props.onConfirm();
  };

  //popover open and close
  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const allFrequency = [
    "Weekly",
    "Biweekly",
    "Monthly",
    "Annual",
    "Hourly Rate",
  ];
  // const frequencylist = () => {
  //   return (
  //     <div>
  //       {allFrequency.map((freq,i) => {
  //         return (
  //           <div
  //             key={i}
  //             style={{
  //               cursor: "pointer",
  //               //backgroundColor: `${view.color}`,
  //               color: "#2C2C2E",
  //               fontSize: "16px",
  //               padding: "5px",
  //               font: "normal normal  20px/24px SF Pro Display",
  //             }}
  //             onClick={(e) => {
  //               setFrequency(freq);
  //               setExpandFrequency(!false);
  //               handleClose(e);
  //             }}
  //           >
  //             {freq}
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // };
  const usDlStates = [
    { name: 'ALABAMA', abbreviation: 'AL'},
    { name: 'ALASKA', abbreviation: 'AK'},
    { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
    { name: 'ARIZONA', abbreviation: 'AZ'},
    { name: 'ARKANSAS', abbreviation: 'AR'},
    { name: 'CALIFORNIA', abbreviation: 'CA'},
    { name: 'COLORADO', abbreviation: 'CO'},
    { name: 'CONNECTICUT', abbreviation: 'CT'},
    { name: 'DELAWARE', abbreviation: 'DE'},
    { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
    { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
    { name: 'FLORIDA', abbreviation: 'FL'},
    { name: 'GEORGIA', abbreviation: 'GA'},
    { name: 'GUAM', abbreviation: 'GU'},
    { name: 'HAWAII', abbreviation: 'HI'},
    { name: 'IDAHO', abbreviation: 'ID'},
    { name: 'ILLINOIS', abbreviation: 'IL'},
    { name: 'INDIANA', abbreviation: 'IN'},
    { name: 'IOWA', abbreviation: 'IA'},
    { name: 'KANSAS', abbreviation: 'KS'},
    { name: 'KENTUCKY', abbreviation: 'KY'},
    { name: 'LOUISIANA', abbreviation: 'LA'},
    { name: 'MAINE', abbreviation: 'ME'},
    { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
    { name: 'MARYLAND', abbreviation: 'MD'},
    { name: 'MASSACHUSETTS', abbreviation: 'MA'},
    { name: 'MICHIGAN', abbreviation: 'MI'},
    { name: 'MINNESOTA', abbreviation: 'MN'},
    { name: 'MISSISSIPPI', abbreviation: 'MS'},
    { name: 'MISSOURI', abbreviation: 'MO'},
    { name: 'MONTANA', abbreviation: 'MT'},
    { name: 'NEBRASKA', abbreviation: 'NE'},
    { name: 'NEVADA', abbreviation: 'NV'},
    { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
    { name: 'NEW JERSEY', abbreviation: 'NJ'},
    { name: 'NEW MEXICO', abbreviation: 'NM'},
    { name: 'NEW YORK', abbreviation: 'NY'},
    { name: 'NORTH CAROLINA', abbreviation: 'NC'},
    { name: 'NORTH DAKOTA', abbreviation: 'ND'},
    { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
    { name: 'OHIO', abbreviation: 'OH'},
    { name: 'OKLAHOMA', abbreviation: 'OK'},
    { name: 'OREGON', abbreviation: 'OR'},
    { name: 'PALAU', abbreviation: 'PW'},
    { name: 'PENNSYLVANIA', abbreviation: 'PA'},
    { name: 'PUERTO RICO', abbreviation: 'PR'},
    { name: 'RHODE ISLAND', abbreviation: 'RI'},
    { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
    { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
    { name: 'TENNESSEE', abbreviation: 'TN'},
    { name: 'TEXAS', abbreviation: 'TX'},
    { name: 'UTAH', abbreviation: 'UT'},
    { name: 'VERMONT', abbreviation: 'VT'},
    { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
    { name: 'VIRGINIA', abbreviation: 'VA'},
    { name: 'WASHINGTON', abbreviation: 'WA'},
    { name: 'WEST VIRGINIA', abbreviation: 'WV'},
    { name: 'WISCONSIN', abbreviation: 'WI'},
    { name: 'WYOMING', abbreviation: 'WY' }
  ];
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  return (
    <div className="pb-4">
      <Header title="Tenant Profile" />
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
        <Row className="mx-0 my-0">
            <Col className="px-0">
                <Form.Group className="mx-2 my-3">
                    <Form.Label as="h6" className="mb-0 ms-2">
                      Annual Salary {salary === "" ? required : ""}
                    </Form.Label>
                    <Form.Control
                      style={squareForm}
                      placeholder="75000"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                    />
                </Form.Group>
            </Col>
            
            <Col
                className="px-0"
                onClick={(e) => {
                  
                  handleClick(e);
                }}
              >
                <Form.Group className="mx-2 my-3">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Frequency
                  </Form.Label>
                  {/* <div  className="d-flex justify-content-between" style={{ border: "1px solid #777777", padding: "6px"}}>
                    {frequency}
                    <img src={expandFrequency ? ArrowUp : ArrowDown} alt="Expand" />
                  </div> */}
                  <DropdownButton variant="light" id="dropdown-basic-button" title={frequency} >
                     {allFrequency.map((freq, i) => (
                     <Dropdown.Item onClick={() => setFrequency(freq)} href="#/action-1" > {freq} </Dropdown.Item>
                     ))}  
                 </DropdownButton>
                </Form.Group>
            </Col>
            {/* <Popover
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
            </Popover> */}
        </Row>

        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Current Job Title {jobTitle === "" ? required : ""}
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
            Company Name {company === "" ? required : ""}
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
            Social Security Number {ssn === "" ? required : ""}
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="123-45-6789"
            value={ssn}
            onChange={(e) => setSsn(e.target.value)}
          />
        </Form.Group>
        <Row className='my-3'>
          <Col>
            <Form.Group className='mx-2'>
              <Form.Label as='h6' className='mb-0 ms-2'>
                Driver's License Number {dlNumber === '' ? required : ''}
              </Form.Label>
              <Form.Control style={squareForm} placeholder='1234567890' value={dlNumber}
                onChange={(e) => setDLNumber(e.target.value)}/>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className='mx-2'>
              <Form.Label as='h6' className='mb-0 ms-2'>
                Driver's License State {dlState === '' ? required : ''}
              </Form.Label>
              {/* <DropdownButton variant="light" id="dropdown-basic-button" title={selectedDlState} style={{maxHeight:"90%",overflowY:"auto"}}>
                {usDlStates.map((state, i) => (
                  <Dropdown.Item onClick={() => setSelectedDlState(state.abbreviation)} href="#/action-1" > {state.abbreviation} </Dropdown.Item>
                  ))}  
              </DropdownButton> */}
              {/* <Form.Control style={squareForm} placeholder='CA' value={dlState}
                onChange={(e) => setDLState(e.target.value)}/> */}
                <Form.Select style={{...squareForm, backgroundImage: `url(${ArrowDown})`}}
                  value={selectedDlState} onChange={(e) => setSelectedDlState(e.target.value)}>
                    {usDlStates.map((state, i)=> (
                   <option key={i}>{state.abbreviation}</option>
                  ))}
                </Form.Select>
            </Form.Group>
          </Col>
        </Row>
{/* ===============================Current Address form -- > Address form=================================================== */}
        <h5 className="mx-2 my-3">Current Address</h5>
        <AddressForm state={currentAddressState} errorMessage={errorMessage} selectedState={selectedState} setSelectedState={setSelectedState}/>


{/* ===============================Previous Address form -- > Address form=================================================== */}

        <Row>
          <Col  xs={2}  className="px-0 d-flex justify-content-end align-items-center"  >
              <div>
                <Checkbox  type="BOX"  onClick={() => setUsePreviousAddress(!usePreviousAddress)} />
              </div>
          </Col>
          <Col>
              <p  style={{ ...underline, ...small }}   className="text-primary mb-3 me-3" >
                Add another property manager reference if your last lease was for
                less than 2 years.
              </p>
          </Col>
        </Row>
          {usePreviousAddress ? (
            <div className="mb-3">
              <h5 className="mx-2 my-3">Previous Address</h5>
              <AddressForm
                state={previousAddressState}
                hideRentingCheckbox="true"
                errorMessage={errorMessage}
                selectedState={selectedPrevState} setSelectedState={setSelectedPrevState}
              />
            </div>
          ) : (
            ""
          )}

        <div className="text-center" style={errorMessage === "" ? hidden : {}}>
          <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
        </div>

        <div className="text-center my-5">
            <Button  variant="outline-primary" style={pillButton} onClick={submitInfo}>
              Save Tenant Profile
            </Button>
        </div>
      </Container>
    </div>
  );
}

export default TenantProfileInfo;
