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
import Popover from "@material-ui/core/Popover";
import AppContext from "../AppContext";
import Header from "../components/Header";
import Checkbox from "../components/Checkbox";
import AddressForm from "../components/AddressForm";
import { get, post } from "../utils/api";
import ArrowUp from "../icons/ArrowUp.svg";
import ArrowDown from "../icons/ArrowDown.svg";
import EditIcon from "../icons/EditIcon.svg";
import AddIcon from "../icons/AddIcon.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";
import {
  squareForm,
  pillButton,
  small,
  underline,
  red,
  hidden,
  mediumBold,
  smallPillButton,
} from "../utils/styles";

function TenantProfileInfo(props) {
  const { userData } = useContext(AppContext);
  const { access_token, user } = userData;
  // console.log("user", user);
  const navigate = useNavigate();
  const { autofillState, setAutofillState } = props;

  const [adults, setAdults] = useState([]);
  const [children, setChildren] = useState([]);
  const [pets, setPets] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [references, setReferences] = useState([]);

  const updateAutofillState = (profile) => {
    const newAutofillState = { ...autofillState };

    for (const key of Object.keys(newAutofillState)) {
      if (key in profile) {
        newAutofillState[key] = profile[key];
      }
    }
    setAutofillState(newAutofillState);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  // const [expandFrequency, setExpandFrequency] = useState(false);
  const [firstName, setFirstName] = useState(autofillState.first_name);
  const [lastName, setLastName] = useState(autofillState.last_name);
  const [salary, setSalary] = useState("");
  const [phone, setPhone] = useState(autofillState.phone_number);
  const [email, setEmail] = useState(autofillState.email);
  const [frequency, setFrequency] = useState("Annual");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [ssn, setSsn] = useState(autofillState.ssn);
  const [dlNumber, setDLNumber] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [usePreviousAddress, setUsePreviousAddress] = useState(false);
  const defaultState = "--";
  const [selectedState, setSelectedState] = useState(defaultState);
  const [selectedDlState, setSelectedDlState] = useState(defaultState);
  const [selectedPrevState, setSelectedPrevState] = useState(defaultState);

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

  const [newFile, setNewFile] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [files, setFiles] = useState([]);
  const addFile = (e) => {
    const file = e.target.files[0];
    const newFile = {
      name: file.name,
      description: "",
      file: file,
      shared: false,
      created_date: new Date().toISOString().split("T")[0],
    };
    setNewFile(newFile);
  };
  const updateNewFile = (field, value) => {
    const newFileCopy = { ...newFile };
    newFileCopy[field] = value;
    setNewFile(newFileCopy);
  };
  const cancelEdit = () => {
    setNewFile(null);
    if (editingDoc !== null) {
      const newFiles = [...files];
      newFiles.push(editingDoc);
      setFiles(newFiles);
    }
    setEditingDoc(null);
  };
  const editDocument = (i) => {
    const newFiles = [...files];
    const file = newFiles.splice(i, 1)[0];
    setFiles(newFiles);
    setEditingDoc(file);
    setNewFile({ ...file });
  };
  const saveNewFile = (e) => {
    // copied from addFile, change e.target.files to state.newFile
    const newFiles = [...files];
    newFiles.push(newFile);
    setFiles(newFiles);
    setNewFile(null);
  };
  const deleteDocument = (i) => {
    const newFiles = [...files];
    newFiles.splice(i, 1);
    setFiles(newFiles);
  };

  function handleAddAdults() {
    const fields = [...adults];
    fields.push({ name: "", relationship: "self", dob: "" });
    setAdults(fields);
  }
  function handleRemoveAdults(i) {
    const fields = [...adults];
    fields.splice(i, 1);
    setAdults(fields);
  }

  function addAdults() {
    return adults.map((adult, idx) => (
      <Row key={idx}>
        <Col>
          <label htmlFor="numAdults"> Adult {idx + 1} Name </label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={adult.name}
            onChange={(e) => handleChangeAdults(idx, e)}
          />
        </Col>
        <Col>
          <label htmlFor="numAdults">Relationship to Applicant </label>
          <input
            type="text"
            className="form-control"
            name="relationship"
            value={adult.relationship}
            onChange={(e) => handleChangeAdults(idx, e)}
          />
        </Col>
        <Col>
          <label htmlFor="numAdults">Date of Birth (Mon/Date/Year)</label>
          <input
            type="date"
            className="form-control"
            name="dob"
            value={adult.dob}
            onChange={(e) => handleChangeAdults(idx, e)}
          />
        </Col>
        <Col
          xs={2}
          style={{
            paddingTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={DeleteIcon}
            onClick={() => handleRemoveAdults(idx)}
            style={{
              width: "15px",
              height: "15px",
            }}
          />
        </Col>
      </Row>
    ));
  }
  function handleChangeAdults(i, event) {
    const fields = [...adults];
    fields[i][event.target.name] = event.target.value;
    setAdults(fields);
  }

  function handleAddChildren() {
    const fields = [...children];
    fields.push({ name: "", relationship: "", dob: "" });
    setChildren(fields);
  }
  function handleRemoveChildren(i) {
    const fields = [...children];
    fields.splice(i, 1);
    setChildren(fields);
  }
  function addChildren() {
    return children.map((child, idx) => (
      <Row key={idx}>
        <Col>
          <label htmlFor="numChildren"> Children {idx + 1} Name </label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={child.name}
            onChange={(e) => handleChangeChildren(idx, e)}
          />
        </Col>
        <Col>
          <label htmlFor="numChildren">Relationship to Applicant </label>
          <input
            type="text"
            className="form-control"
            name="relationship"
            value={child.relationship}
            onChange={(e) => handleChangeChildren(idx, e)}
          />
        </Col>
        <Col>
          <label htmlFor="numChildren">Date of Birth (Mon/Date/Year)</label>
          <input
            type="date"
            className="form-control"
            name="dob"
            value={child.dob}
            onChange={(e) => handleChangeChildren(idx, e)}
          />
        </Col>
        <Col
          xs={2}
          style={{
            paddingTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={DeleteIcon}
            onClick={() => handleRemoveChildren(idx)}
            style={{
              width: "15px",
              height: "15px",
            }}
          />
        </Col>
      </Row>
    ));
  }
  function handleChangeChildren(i, event) {
    const fields = [...children];
    fields[i][event.target.name] = event.target.value;
    setChildren(fields);
  }

  function handleAddPets() {
    const fields = [...pets];
    fields.push({ name: "", type: "", breed: "", weight: "" });
    setPets(fields);
  }
  function handleRemovePets(i) {
    const fields = [...pets];
    fields.splice(i, 1);
    setPets(fields);
  }
  function addPets() {
    return pets.map((pet, idx) => (
      <Row>
        <Col>
          <label htmlFor="numPets"> Pets {idx + 1} Name </label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={pet.name}
            onChange={(e) => handleChangePets(idx, e)}
          />
        </Col>
        <Col>
          <label htmlFor="numPets">Type </label>
          <input
            type="text"
            className="form-control"
            name="type"
            value={pet.type}
            onChange={(e) => handleChangePets(idx, e)}
          />
        </Col>
        <Col>
          <label htmlFor="numPets">If Dog, What Breed?</label>
          <input
            type="text"
            className="form-control"
            name="breed"
            value={pet.breed}
            onChange={(e) => handleChangePets(idx, e)}
          />
        </Col>
        <Col>
          <label htmlFor="numPets">Weight</label>
          <input
            type="text"
            className="form-control"
            name="weight"
            value={pet.weight}
            onChange={(e) => handleChangePets(idx, e)}
          />
        </Col>
        <Col
          xs={2}
          style={{
            paddingTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={DeleteIcon}
            onClick={() => handleRemovePets(idx)}
            style={{
              width: "15px",
              height: "15px",
            }}
          />
        </Col>
      </Row>
    ));
  }
  function handleChangePets(i, event) {
    const fields = [...pets];
    fields[i][event.target.name] = event.target.value;
    setPets(fields);
  }
  function handleAddVehicles() {
    const fields = [...vehicles];
    fields.push({ make: "", model: "", year: "", state: "", license: "" });
    setVehicles(fields);
  }
  function handleRemoveVehicles(i) {
    const fields = [...vehicles];
    fields.splice(i, 1);
    setVehicles(fields);
  }
  function addVehicles() {
    return vehicles.map((vehicle, idx) => (
      <Row>
        <Col>
          <label htmlFor="numVehicles"> Make </label>
          <input
            type="text"
            className="form-control"
            name="make"
            value={vehicle.make}
            onChange={(e) => handleChangeVehicles(idx, e)}
          />
        </Col>
        <Col>
          <label htmlFor="numVehicles">Model </label>
          <input
            type="text"
            className="form-control"
            name="model"
            value={vehicle.model}
            onChange={(e) => handleChangeVehicles(idx, e)}
          />
        </Col>
        <Col>
          <label htmlFor="numVehicles">Year</label>
          <input
            type="text"
            className="form-control"
            name="year"
            value={vehicle.year}
            onChange={(e) => handleChangeVehicles(idx, e)}
          />
        </Col>
        <Col>
          <label htmlFor="numVehicles">State</label>
          <input
            type="text"
            className="form-control"
            name="state"
            value={vehicle.state}
            onChange={(e) => handleChangeVehicles(idx, e)}
          />
        </Col>
        <Col>
          <label htmlFor="numVehicles">License</label>
          <input
            type="text"
            className="form-control"
            name="license"
            value={vehicle.license}
            onChange={(e) => handleChangeVehicles(idx, e)}
          />
        </Col>
        <Col
          xs={2}
          style={{
            paddingTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={DeleteIcon}
            onClick={() => handleRemoveVehicles(idx)}
            style={{
              width: "15px",
              height: "15px",
            }}
          />
        </Col>
      </Row>
    ));
  }
  function handleChangeVehicles(i, event) {
    const fields = [...vehicles];
    fields[i][event.target.name] = event.target.value;
    setVehicles(fields);
  }

  function handleAddReferences() {
    const fields = [...references];
    fields.push({
      name: "",
      address: "",
      phone: "",
      email: "",
      relationship: "",
    });
    setReferences(fields);
  }
  function handleRemoveReferences(i) {
    const fields = [...references];
    fields.splice(i, 1);
    setReferences(fields);
  }

  function addReferences() {
    return references.map((reference, idx) => (
      <Row>
        <Col>
          <label htmlFor="numReferences"> Name </label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={reference.name}
            onChange={(e) => handleChangeReferences(idx, e)}
          />
        </Col>
        <Col>
          <label htmlFor="numReferences">Address </label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={reference.address}
            onChange={(e) => handleChangeReferences(idx, e)}
          />
        </Col>
        <Col>
          <label htmlFor="numReferences">Phone Number</label>
          <input
            // type="text"
            className="form-control"
            name="phone"
            value={reference.phone}
            type="tel"
            placeholder="(xxx)xxx-xxxx"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            onChange={(e) => handlePhoneNumber(idx, e)}
          />
        </Col>
        <Col>
          <label htmlFor="numReferences">Email</label>
          <input
            type="text"
            className="form-control"
            name="email"
            value={reference.email}
            onChange={(e) => handleChangeReferences(idx, e)}
          />
        </Col>
        <Col>
          <label htmlFor="numReferences">Relationship</label>
          <input
            type="text"
            className="form-control"
            name="relationship"
            value={reference.relationship}
            onChange={(e) => handleChangeReferences(idx, e)}
          />
        </Col>
        <Col
          xs={2}
          style={{
            paddingTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={DeleteIcon}
            onClick={() => handleRemoveReferences(idx)}
            style={{
              width: "15px",
              height: "15px",
            }}
          />
        </Col>
      </Row>
    ));
  }
  const handlePhoneNumber = (i, event) => {
    const fields = [...references];
    fields[i][event.target.name] = formatPhoneNumber(event.target.value);
    setReferences(fields);
  };
  function formatPhoneNumber(value) {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, "");

    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;

    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }

    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  }
  function handleChangeReferences(i, event) {
    const fields = [...references];
    fields[i][event.target.name] = event.target.value;
    setReferences(fields);
  }

  useEffect(() => {
    if (access_token === null) {
      navigate("/");
      return;
    }
    if (user.role.indexOf("TENANT") === -1) {
      // console.log("no tenant profile");
      props.onConfirm();
    }
    const fetchProfileInfo = async () => {
      const response = await get(
        `/tenantProfileInfo?tenant_id=${user.user_uid}`
      );
      if (response.result && response.result.length !== 0) {
        // console.log("tenant profile already set up");
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
      tenant_first_name: firstName,
      tenant_last_name: lastName,
      tenant_email: email,
      tenant_phone_number: phone,
      tenant_current_salary: salary,
      tenant_salary_frequency: frequency,
      tenant_current_job_title: jobTitle,
      tenant_current_job_company: company,
      tenant_ssn: ssn,
      tenant_drivers_license_number: dlNumber,
      tenant_drivers_license_state: selectedDlState,
      tenant_current_address: JSON.stringify(currentAddressState[0]),
      tenant_previous_address: usePreviousAddress
        ? JSON.stringify(previousAddressState[0])
        : null,
      tenant_adult_occupants: JSON.stringify(adults),
      tenant_children_occupants: JSON.stringify(children),
      tenant_pet_occupants: JSON.stringify(pets),
      tenant_references: JSON.stringify(references),
      tenant_vehicle_info: JSON.stringify(vehicles),
    };
    for (let i = 0; i < files.length; i++) {
      let key = `doc_${i}`;
      tenantProfile[key] = files[i].file;
      delete files[i].file;
    }
    // console.log(tenantProfile);
    tenantProfile.documents = JSON.stringify(files);
    tenantProfile.tenant_id = user.user_uid;
    await post("/tenantProfileInfo", tenantProfile, null, files);
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

  const usDlStates = [
    { name: "ALABAMA", abbreviation: "AL" },
    { name: "ALASKA", abbreviation: "AK" },
    { name: "AMERICAN SAMOA", abbreviation: "AS" },
    { name: "ARIZONA", abbreviation: "AZ" },
    { name: "ARKANSAS", abbreviation: "AR" },
    { name: "CALIFORNIA", abbreviation: "CA" },
    { name: "COLORADO", abbreviation: "CO" },
    { name: "CONNECTICUT", abbreviation: "CT" },
    { name: "DELAWARE", abbreviation: "DE" },
    { name: "DISTRICT OF COLUMBIA", abbreviation: "DC" },
    { name: "FEDERATED STATES OF MICRONESIA", abbreviation: "FM" },
    { name: "FLORIDA", abbreviation: "FL" },
    { name: "GEORGIA", abbreviation: "GA" },
    { name: "GUAM", abbreviation: "GU" },
    { name: "HAWAII", abbreviation: "HI" },
    { name: "IDAHO", abbreviation: "ID" },
    { name: "ILLINOIS", abbreviation: "IL" },
    { name: "INDIANA", abbreviation: "IN" },
    { name: "IOWA", abbreviation: "IA" },
    { name: "KANSAS", abbreviation: "KS" },
    { name: "KENTUCKY", abbreviation: "KY" },
    { name: "LOUISIANA", abbreviation: "LA" },
    { name: "MAINE", abbreviation: "ME" },
    { name: "MARSHALL ISLANDS", abbreviation: "MH" },
    { name: "MARYLAND", abbreviation: "MD" },
    { name: "MASSACHUSETTS", abbreviation: "MA" },
    { name: "MICHIGAN", abbreviation: "MI" },
    { name: "MINNESOTA", abbreviation: "MN" },
    { name: "MISSISSIPPI", abbreviation: "MS" },
    { name: "MISSOURI", abbreviation: "MO" },
    { name: "MONTANA", abbreviation: "MT" },
    { name: "NEBRASKA", abbreviation: "NE" },
    { name: "NEVADA", abbreviation: "NV" },
    { name: "NEW HAMPSHIRE", abbreviation: "NH" },
    { name: "NEW JERSEY", abbreviation: "NJ" },
    { name: "NEW MEXICO", abbreviation: "NM" },
    { name: "NEW YORK", abbreviation: "NY" },
    { name: "NORTH CAROLINA", abbreviation: "NC" },
    { name: "NORTH DAKOTA", abbreviation: "ND" },
    { name: "NORTHERN MARIANA ISLANDS", abbreviation: "MP" },
    { name: "OHIO", abbreviation: "OH" },
    { name: "OKLAHOMA", abbreviation: "OK" },
    { name: "OREGON", abbreviation: "OR" },
    { name: "PALAU", abbreviation: "PW" },
    { name: "PENNSYLVANIA", abbreviation: "PA" },
    { name: "PUERTO RICO", abbreviation: "PR" },
    { name: "RHODE ISLAND", abbreviation: "RI" },
    { name: "SOUTH CAROLINA", abbreviation: "SC" },
    { name: "SOUTH DAKOTA", abbreviation: "SD" },
    { name: "TENNESSEE", abbreviation: "TN" },
    { name: "TEXAS", abbreviation: "TX" },
    { name: "UTAH", abbreviation: "UT" },
    { name: "VERMONT", abbreviation: "VT" },
    { name: "VIRGIN ISLANDS", abbreviation: "VI" },
    { name: "VIRGINIA", abbreviation: "VA" },
    { name: "WASHINGTON", abbreviation: "WA" },
    { name: "WEST VIRGINIA", abbreviation: "WV" },
    { name: "WISCONSIN", abbreviation: "WI" },
    { name: "WYOMING", abbreviation: "WY" },
  ];

  function formatSSN(value) {
    if (!value) return value;

    const ssn = value.replace(/[^\d]/g, "");

    const ssnLength = ssn.length;

    if (ssnLength < 4) return ssn;

    if (ssnLength < 6) {
      return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
    }

    return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
  }
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );

  return (
    <div className="pb-4 w-100 overflow-hidden">
      <Header title="Tenant Profile" />
      <div>
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
              <DropdownButton
                variant="light"
                id="dropdown-basic-button"
                title={frequency}
              >
                {allFrequency.map((freq, i) => (
                  <Dropdown.Item
                    onClick={() => setFrequency(freq)}
                    // href="#/action-1"
                  >
                    {" "}
                    {freq}{" "}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Form.Group>
          </Col>
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
            placeholder="xxx-xx-xxxx"
            value={ssn}
            pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"
            onChange={(e) => setSsn(formatSSN(e.target.value))}
          />
        </Form.Group>
        <Row className="my-3">
          <Col>
            <Form.Group className="mx-2">
              <Form.Label as="h6" className="mb-0 ms-2">
                Driver's License Number {dlNumber === "" ? required : ""}
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder="1234567890"
                value={dlNumber}
                onChange={(e) => setDLNumber(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mx-2">
              <Form.Label as="h6" className="mb-0 ms-2">
                Driver's License State {selectedDlState === "" ? required : ""}
              </Form.Label>

              <Form.Select
                style={{ ...squareForm, backgroundImage: `url(${ArrowDown})` }}
                value={selectedDlState}
                onChange={(e) => setSelectedDlState(e.target.value)}
              >
                {usDlStates.map((state, i) => (
                  <option key={i}>{state.abbreviation}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mx-1 my-3">
          {/* ===============================< Current Address form -- > Address form >=================================================== */}
          <h5 className="mx-2 my-3">Current Address</h5>
          <AddressForm
            state={currentAddressState}
            errorMessage={errorMessage}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            editProfile={true}
          />
        </Row>

        {/* ===============================< Previous Address form -- > Address form >=================================================== */}

        <Row>
          <Col
            xs={2}
            className="px-0 d-flex justify-content-end align-items-center"
          >
            <div>
              <Checkbox
                type="BOX"
                onClick={() => setUsePreviousAddress(!usePreviousAddress)}
              />
            </div>
          </Col>
          <Col>
            <p
              style={{ ...underline, ...small }}
              className="text-primary mb-3 me-3"
            >
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
              editProfile={true}
              errorMessage={errorMessage}
              selectedState={selectedPrevState}
              setSelectedState={setSelectedPrevState}
            />
          </div>
        ) : (
          ""
        )}
        <Row className="mx-2 mb-4">
          <h5>Who plans to live in the unit?</h5>

          <Row>
            <Col className="mx-2 my-3" xs={2}>
              {" "}
              Adults
            </Col>
            <Col className="mx-2 my-3">
              <img
                src={AddIcon}
                onClick={handleAddAdults}
                style={{
                  width: "15px",
                  height: "15px",
                  float: "left",
                  marginRight: "5rem",
                }}
              />
            </Col>
          </Row>
          <Row>{adults && adults.length ? <div>{addAdults()}</div> : null}</Row>
          <Row>
            <Col className="mx-2 my-3" xs={2}>
              Children
            </Col>
            <Col className="mx-2 my-3">
              <img
                src={AddIcon}
                onClick={handleAddChildren}
                style={{
                  width: "15px",
                  height: "15px",
                  float: "left",
                  marginRight: "5rem",
                }}
              />
            </Col>
          </Row>
          <Row>
            {children && children.length ? <div>{addChildren()}</div> : null}
          </Row>
          <Row>
            <Col className="mx-2 my-3" xs={2}>
              {" "}
              Pets
            </Col>
            <Col className="mx-2 my-3">
              <img
                src={AddIcon}
                onClick={handleAddPets}
                style={{
                  width: "15px",
                  height: "15px",
                  float: "left",
                  marginRight: "5rem",
                }}
              />
            </Col>
          </Row>

          <Row>{pets && pets.length ? <div>{addPets()}</div> : null}</Row>
        </Row>
        <Row className="mx-2 mb-4">
          <h5>Vehicle Information</h5>
          <Row>
            <Col className="mx-2 my-3" xs={2}>
              {" "}
              Vehicles
            </Col>
            <Col className="mx-2 my-3">
              <img
                src={AddIcon}
                onClick={handleAddVehicles}
                style={{
                  width: "15px",
                  height: "15px",
                  float: "left",
                  marginRight: "5rem",
                }}
              />
            </Col>
          </Row>
          <Row>
            {vehicles && vehicles.length ? <div>{addVehicles()}</div> : null}
          </Row>
        </Row>
        <Row className="mx-2 mb-4">
          <h5>References</h5>
          <Row>
            <Col className="mx-2 my-3" xs={2}>
              {" "}
              References
            </Col>
            <Col className="mx-2 my-3">
              <img
                src={AddIcon}
                onClick={handleAddReferences}
                style={{
                  width: "15px",
                  height: "15px",
                  float: "left",
                  marginRight: "5rem",
                }}
              />
            </Col>
          </Row>
          <Row>
            {references && references.length ? (
              <div>{addReferences()}</div>
            ) : null}
          </Row>
        </Row>
        {/* ===============================< Uploading Tenant Document >=================================================== */}
        <Row className="mx-2 mb-4">
          <h5 style={mediumBold}>Tenant Documents</h5>
          {files.map((file, i) => (
            <div key={i}>
              <div className="d-flex justify-content-between align-items-end">
                <div>
                  <h6 style={mediumBold}>{file.name}</h6>
                  <p style={small} className="m-0">
                    {file.description}
                  </p>
                </div>
                <div>
                  <img
                    src={EditIcon}
                    alt="Edit"
                    className="px-1 mx-2"
                    onClick={() => editDocument(i)}
                  />
                  <img
                    src={DeleteIcon}
                    alt="Delete"
                    className="px-1 mx-2"
                    onClick={() => deleteDocument(i)}
                  />
                  <a href={file.link} target="_blank">
                    <img src={File} />
                  </a>
                </div>
              </div>
              <hr style={{ opacity: 1 }} />
            </div>
          ))}
          {newFile !== null ? (
            <div>
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Document Name
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  value={newFile.name}
                  placeholder="Name"
                  onChange={(e) => updateNewFile("name", e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Description
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  value={newFile.description}
                  placeholder="Description"
                  onChange={(e) => updateNewFile("description", e.target.value)}
                />
              </Form.Group>
              <div className="text-center my-3">
                <Button
                  variant="outline-primary"
                  style={smallPillButton}
                  as="p"
                  onClick={cancelEdit}
                  className="mx-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline-primary"
                  style={smallPillButton}
                  as="p"
                  onClick={saveNewFile}
                  className="mx-2"
                >
                  Save Document
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <input
                id="file"
                type="file"
                accept="image/*,.pdf"
                onChange={addFile}
                className="d-none"
              />
              <label htmlFor="file">
                <Button
                  variant="outline-primary"
                  style={smallPillButton}
                  as="p"
                >
                  Add Document
                </Button>
              </label>
            </div>
          )}
        </Row>

        {/* ===============================< Displaying Error message >=================================================== */}
        <div className="text-center" style={errorMessage === "" ? hidden : {}}>
          <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
        </div>

        {/* ===============================< Save Button >=================================================== */}
        <div className="text-center my-5">
          <Button
            variant="outline-primary"
            style={pillButton}
            onClick={submitInfo}
          >
            Save Tenant Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TenantProfileInfo;
