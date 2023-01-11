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
import AppContext from "../../AppContext";
import Header from "../Header";
import AddressForm from "../AddressForm";
import SideBar from "./SideBar";
import TenantFooter from "./TenantFooter";
import Check from "../../icons/Check.svg";
import AddIcon from "../../icons/AddIcon.svg";
import EditIcon from "../../icons/EditIcon.svg";
import DeleteIcon from "../../icons/DeleteIcon.svg";
import { get, put, post } from "../../utils/api";
import {
  squareForm,
  smallPillButton,
  small,
  underline,
  mediumBold,
  headings,
  gray,
  subHeading,
  pillButton,
  red,
  hidden,
  bluePillButton,
} from "../../utils/styles";

function TenantProfile(props) {
  // console.log("in tenant profile");
  const context = useContext(AppContext);
  const { userData, refresh, logout } = context;
  const { access_token, user } = userData;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandFrequency, setExpandFrequency] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [editProfile, setEditProfile] = useState(false);

  const [resetPassword, setResetPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [salary, setSalary] = useState("");
  const [frequency, setFrequency] = useState("Annual");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [ssn, setSsn] = useState("");
  const [dlNumber, setDLNumber] = useState("");
  const defaultState = "--";
  const [selectedState, setSelectedState] = useState(defaultState);
  const [selectedPrevState, setSelectedPrevState] = useState(defaultState);
  const { autofillState, setAutofillState } = props;
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
  const responsive = {
    showSidebar: width > 1023,
  };
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
  const [newFile, setNewFile] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [files, setFiles] = useState([]);
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
      // console.log(response);

      if (response.msg === "Token has expired") {
        // console.log("here msg");
        refresh();
        return;
      }

      if (user.role.indexOf("TENANT") === -1) {
        // console.log("no tenant profile");
        props.onConfirm();
      }
      setFirstName(response.result[0].tenant_first_name);
      setLastName(response.result[0].tenant_last_name);
      setSsn(response.result[0].tenant_ssn);
      setPhone(response.result[0].tenant_phone_number);
      setEmail(response.result[0].tenant_email);
      setSalary(response.result[0].tenant_current_salary);
      setJobTitle(response.result[0].tenant_current_job_title);
      setCompany(response.result[0].tenant_current_job_company);
      setDLNumber(response.result[0].tenant_drivers_license_number);
      setCompany(response.result[0].tenant_current_job_company);

      setAdults(JSON.parse(response.result[0].tenant_adult_occupants));

      setChildren(JSON.parse(response.result[0].tenant_children_occupants));

      setPets(JSON.parse(response.result[0].tenant_pet_occupants));
      setVehicles(JSON.parse(response.result[0].tenant_vehicle_info));
      setReferences(JSON.parse(response.result[0].tenant_references));
      const currentAddress = JSON.parse(
        response.result[0].tenant_current_address
      );
      const documents = response.result[0].documents
        ? JSON.parse(response.result[0].documents)
        : [];
      setFiles(JSON.parse(response.result[0].documents));
      currentAddressState[1](currentAddress);
      setSelectedState(currentAddress.state);
      if (response.result[0].tenant_previous_address != null) {
        const prevAddress = JSON.parse(
          response.result[0].tenant_previous_address
        );
        if (prevAddress) {
          previousAddressState[1](prevAddress);
          setSelectedPrevState(prevAddress.state);
          if (prevAddress.street) {
            setUsePreviousAddress(true);
          }
        }
      }
    };
    fetchProfile();
  }, []);

  const submitInfo = async () => {
    currentAddressState[0].state = selectedState;
    if (previousAddressState && previousAddressState.length) {
      previousAddressState[0].state = selectedPrevState;
    }

    const tenantProfile = {
      first_name: firstName,
      last_name: lastName,
      current_salary: salary,
      phone_number: phone,
      email: email,
      salary_frequency: frequency,
      current_job_title: jobTitle,
      current_job_company: company,
      ssn: ssn,
      drivers_license_number: dlNumber,
      drivers_license_state: "CA",
      current_address: JSON.stringify(currentAddressState[0]),
      previous_address: usePreviousAddress
        ? JSON.stringify(previousAddressState[0])
        : null,
      adult_occupants: JSON.stringify(adults),
      children_occupants: JSON.stringify(children),
      pet_occupants: JSON.stringify(pets),
      references: JSON.stringify(references),
      vehicle_info: JSON.stringify(vehicles),
    };

    for (let i = 0; i < files.length; i++) {
      let key = `doc_${i}`;
      tenantProfile[key] = files[i].file;
      delete files[i].file;
    }
    tenantProfile.documents = JSON.stringify(files);

    await put(`/tenantProfileInfo`, tenantProfile, access_token, files);

    setEditProfile(false);
    props.onConfirm();
    // await post('/tenantProfileInfo', tenantProfile, access_token, files);
    // updateAutofillState(tenantProfile);
    // props.onConfirm();
  };
  // console.log(usePreviousAddress, previousAddressState[0]);

  const allFrequency = [
    "Weekly",
    "Biweekly",
    "Monthly",
    "Annual",
    "Hourly Rate",
  ];
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
  function handleAddAdults() {
    const fields = [...adults];
    fields.push({ name: "", relationship: "", dob: "" });
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
            type="text"
            className="form-control"
            name="phone"
            value={reference.phone}
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
  function handleChangeReferences(i, event) {
    const fields = [...references];
    fields[i][event.target.name] = event.target.value;
    setReferences(fields);
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
  return (
    <div className="w-100 overflow-hidden">
      <div className="flex-1">
        <div
          hidden={!responsive.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </div>
        <div className="w-100 mb-5 overflow-scroll">
          <Header
            title="Profile"
            leftText={editProfile ? "Cancel" : ""}
            leftFn={() => (editProfile ? setEditProfile(false) : "")}
            rightText={editProfile ? "Save" : "Edit"}
            rightFn={() => (editProfile ? submitInfo() : setEditProfile(true))}
          />
          {editProfile ? (
            <Row
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <div className="my-2">
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
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {" "}
                    <Form.Group className="my-2">
                      <Form.Label as="h6" className="mb-0 ms-2">
                        Phone Number
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        placeholder="Phone Number"
                        value={phone}
                        type="tel"
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        // disabled="disabled"
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="my-2">
                      <Form.Label as="h6" className="mb-0 ms-2">
                        Email ID
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        placeholder="Email ID"
                        value={email}
                        disabled="disabled"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="my-2">
                <Row className="mb-4" style={headings}>
                  <div>Identification Details</div>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="my-2">
                      <Form.Label as="h6" className="mb-0 ms-2">
                        Social Security Number
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
                    {" "}
                    <Form.Group className="my-2">
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
                  </Col>
                </Row>
              </div>
              <div className="my-2">
                <Row className="mb-4" style={headings}>
                  <div>Current Job Details</div>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="my-2">
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
                  </Col>
                  <Col>
                    <Form.Group className="my-2">
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
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="my-2">
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
                    onClick={(e) => {
                      setExpandFrequency(!expandFrequency);
                      handleClick(e);
                    }}
                  >
                    <Form.Group className="my-2">
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
              </div>
            </Row>
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
                    {phone && phone !== "NULL"
                      ? phone
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
                    <h6>DL</h6>
                    <p style={gray}>
                      {dlNumber && dlNumber !== "NULL"
                        ? dlNumber
                        : "No DL Provided"}
                    </p>
                  </Col>
                </Row>
              </div>
              <div className="my-2">
                <Row className="mb-4" style={headings}>
                  <div>Current Job Details</div>
                </Row>

                <Row>
                  <Col>
                    <h6>Job Title</h6>
                    <p style={gray}>
                      {jobTitle && jobTitle !== "NULL"
                        ? jobTitle
                        : "No SSN Provided"}
                    </p>
                  </Col>
                  <Col>
                    <h6>Company</h6>
                    <p style={gray}>
                      {company && company !== "NULL"
                        ? company
                        : "No DL Provided"}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h6>Salary</h6>
                    <p style={gray}>
                      {salary && salary !== "NULL" ? salary : "No SSN Provided"}
                    </p>
                  </Col>
                  <Col>
                    <h6>Frequency</h6>
                    <p style={gray}>
                      {frequency && frequency !== "NULL"
                        ? frequency
                        : "No DL Provided"}
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          )}
          {editProfile ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="mb-4" style={headings}>
                <div>Current Address</div>
              </Row>
              <AddressForm
                editProfile={editProfile}
                state={currentAddressState}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
              />
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
                    {usePreviousAddress &&
                    previousAddressState &&
                    previousAddressState.state ? (
                      <img
                        src={Check}
                        style={{ width: "13px", height: "9px" }}
                      />
                    ) : null}
                  </div>
                </Col>
                <Col>
                  <p
                    style={{ ...underline, ...small }}
                    className="text-primary mb-1 me-3"
                  >
                    Add another property manager reference if your last lease
                    was for less than 2 years.
                  </p>
                </Col>
              </Row>
              {usePreviousAddress ? (
                <div>
                  <h5 className="mx-2 my-3">Previous Address</h5>
                  <AddressForm
                    editProfile={editProfile}
                    state={previousAddressState}
                    selectedState={selectedPrevState}
                    setSelectedState={setSelectedPrevState}
                  />
                </div>
              ) : (
                ""
              )}
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
                <div>Current Address</div>
              </Row>
              <AddressForm
                editProfile={editProfile}
                state={currentAddressState}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
              />

              {usePreviousAddress ? (
                <div>
                  <Row className="mb-4" style={headings}>
                    <div>Current Address</div>
                  </Row>
                  <AddressForm
                    editProfile={editProfile}
                    state={previousAddressState}
                    selectedState={selectedPrevState}
                    setSelectedState={setSelectedPrevState}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          )}
          {editProfile ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
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
                <Row>
                  {adults && Object.values(adults).length > 0 ? (
                    <div>{addAdults()}</div>
                  ) : null}
                </Row>
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
                  {children && Object.values(children).length > 0 ? (
                    <div>{addChildren()}</div>
                  ) : null}
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

                <Row>
                  {pets && Object.values(pets).length > 0 ? (
                    <div>{addPets()}</div>
                  ) : null}
                </Row>
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
                  {vehicles && Object.values(vehicles).length > 0 ? (
                    <div>{addVehicles()}</div>
                  ) : null}
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
                  {references && Object.values(references).length > 0 ? (
                    <div>{addReferences()}</div>
                  ) : null}
                </Row>
              </Row>
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
              {" "}
              <Row className="mb-4" style={headings}>
                <div>Who plans to live in the unit?</div>
              </Row>
              <div>
                {adults && Object.values(adults).length > 0 ? (
                  <div className="mx-3 ">
                    <Row style={subHeading}>Adults</Row>
                    <Row style={subHeading}>
                      <Col>Name</Col>
                      <Col>Relationship</Col>
                      <Col>DOB</Col>
                    </Row>
                    {Object.values(adults).map((adult) => {
                      return (
                        <div>
                          <Row style={gray}>
                            <Col>{adult.name}</Col>
                            <Col>{adult.relationship}</Col>
                            <Col>{adult.dob}</Col>
                          </Row>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mx-3 ">
                    <Row style={subHeading}>Adults</Row>
                    <Row style={gray}>None</Row>
                  </div>
                )}
              </div>
              <div>
                {children && Object.values(children).length > 0 ? (
                  <div className="mx-3 ">
                    <Row style={subHeading}>Children</Row>
                    <Row style={subHeading}>
                      <Col>Name</Col>
                      <Col>Relationship</Col>
                      <Col>DOB</Col>
                    </Row>
                    {Object.values(children).map((child) => {
                      return (
                        <div>
                          <Row style={gray}>
                            <Col>{child.name}</Col>
                            <Col>{child.relationship}</Col>
                            <Col>{child.dob}</Col>
                          </Row>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mx-3 ">
                    <Row style={subHeading}>Children</Row>
                    <Row style={gray}>None</Row>
                  </div>
                )}
              </div>
              <div>
                {pets && Object.values(pets).length > 0 ? (
                  <div className="mx-3 ">
                    <Row style={subHeading}>Pets</Row>
                    <Row style={subHeading}>
                      <Col>Name</Col>
                      <Col>Type</Col>
                      <Col>Breed</Col>
                      <Col>Weight</Col>
                    </Row>
                    {Object.values(pets).map((pet) => {
                      return (
                        <div>
                          <Row style={gray}>
                            <Col>{pet.name}</Col>
                            <Col>{pet.type}</Col>
                            <Col>{pet.breed}</Col>
                            <Col>{pet.weight}</Col>
                          </Row>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mx-3 ">
                    <Row style={subHeading}>Pets</Row>
                    <Row style={gray}>None</Row>
                  </div>
                )}
              </div>
              <div>
                {vehicles && Object.values(vehicles).length > 0 ? (
                  <div className="mx-3 ">
                    <Row style={subHeading}>Vehicles</Row>
                    <Row style={subHeading}>
                      <Col>Make</Col>
                      <Col>Model</Col>
                      <Col>Year</Col>
                      <Col>State</Col>
                      <Col>License</Col>
                    </Row>
                    {Object.values(vehicles).map((vehicle) => {
                      return (
                        <div>
                          <Row style={gray}>
                            <Col>{vehicle.make}</Col>
                            <Col>{vehicle.model}</Col>
                            <Col>{vehicle.year}</Col>
                            <Col>{vehicle.state}</Col>
                            <Col>{vehicle.license}</Col>
                          </Row>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mx-3 ">
                    <Row style={subHeading}>Vehicles</Row>
                    <Row style={gray}>None</Row>
                  </div>
                )}
              </div>
              <div>
                {references && Object.values(references).length > 0 ? (
                  <div className="mx-3 ">
                    <Row style={subHeading}>References</Row>
                    <Row style={subHeading}>
                      <Col>Name</Col>
                      <Col>Address</Col>
                      <Col>Phone Number</Col>
                      <Col>Email</Col>
                      <Col>Relationship</Col>
                    </Row>
                    {Object.values(references).map((reference) => {
                      return (
                        <div>
                          <Row style={gray}>
                            <Col>{reference.name}</Col>
                            <Col>{reference.address}</Col>
                            <Col>{reference.phone}</Col>
                            <Col>{reference.email}</Col>
                            <Col>{reference.relationship}</Col>
                          </Row>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mx-3 ">
                    <Row style={subHeading}>References</Row>
                    <Row style={gray}>None</Row>
                  </div>
                )}
              </div>
            </div>
          )}
          {editProfile ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="mb-4" style={headings}>
                <div>Tenant Documents</div>
              </Row>

              {files.map((file, i) => (
                <div key={i}>
                  <div className="d-flex justify-content-between align-items-end">
                    <div>
                      <h6 style={subHeading}>{file.name}</h6>
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
                      onChange={(e) =>
                        updateNewFile("description", e.target.value)
                      }
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
                <div>Tenant Documents</div>
              </Row>
              {files.length > 0 ? (
                files.map((file, i) => (
                  <div key={i}>
                    <div className="d-flex justify-content-between align-items-end">
                      <div>
                        <h6 style={subHeading}>{file.name}</h6>
                        <p style={gray} className="m-0">
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
                ))
              ) : (
                <div className="mx-2" style={gray}>
                  No documents uploaded
                </div>
              )}
            </div>
          )}
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
        </div>
      </div>

      <div hidden={responsive.showSidebar} className="w-100 mt-3">
        <TenantFooter />
      </div>
    </div>
  );
}

export default TenantProfile;
