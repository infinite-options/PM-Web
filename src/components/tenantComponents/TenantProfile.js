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
import EditIcon from "../../icons/EditIcon.svg";
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
} from "../../utils/styles";
import DeleteIcon from "../../icons/DeleteIcon.svg";

function TenantProfile(props) {
  console.log("in tenant profile");
  const context = useContext(AppContext);
  const { userData, refresh } = context;
  const { access_token, user } = userData;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandFrequency, setExpandFrequency] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [editProfile, setEditProfile] = useState(false);
  const [phone, setPhone] = useState(user.phone_number);
  const [email, setEmail] = useState(user.email);
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
  const [numAdults, setNumAdults] = useState(0);
  const [numChildren, setNumChildren] = useState(0);
  const [numPets, setNumPets] = useState(0);
  const [numVehicles, setNumVehicles] = useState(0);
  const [numReferences, setNumReferences] = useState(0);
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
      console.log(response);

      if (response.msg === "Token has expired") {
        console.log("here msg");
        refresh();
        return;
      }

      if (user.role.indexOf("TENANT") === -1) {
        console.log("no tenant profile");
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
      setNumAdults(
        JSON.parse(response.result[0].tenant_adult_occupants).length
      );
      setAdults(JSON.parse(response.result[0].tenant_adult_occupants));
      setNumChildren(
        JSON.parse(response.result[0].tenant_children_occupants).length
      );
      setChildren(JSON.parse(response.result[0].tenant_children_occupants));
      setNumPets(JSON.parse(response.result[0].tenant_pet_occupants).length);
      setPets(JSON.parse(response.result[0].tenant_pet_occupants));
      setNumVehicles(JSON.parse(response.result[0].tenant_vehicle_info).length);
      setVehicles(JSON.parse(response.result[0].tenant_vehicle_info));
      setNumReferences(JSON.parse(response.result[0].tenant_references).length);
      setReferences(JSON.parse(response.result[0].tenant_references));
      const currentAddress = JSON.parse(
        response.result[0].tenant_current_address
      );
      const documents = response.result[0].documents
        ? JSON.parse(response.result[0].documents)
        : [];
      setFiles(documents);
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
      salary_freq: frequency,
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
  console.log(usePreviousAddress, previousAddressState[0]);

  const allFrequency = [
    "Weekly",
    "Biweekly",
    "Monthly",
    "Annual",
    "Hourly Rate",
  ];
  const onChangeNumberOfAdults = (e) => {
    const numberOfAdults = e.target.value;
    setNumAdults(numberOfAdults);

    if (numberOfAdults > 0) {
      let generateArrays = [];
      for (let i = 1; i <= Number(e.target.value); i++) {
        let obj = { id: i, name: "", relationship: "", dob: "" };
        generateArrays.push(obj);
      }
      console.log(generateArrays);
      setAdults(generateArrays);
    } else {
      setAdults([]);
    }
  };

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
      </Row>
    ));
  }
  function handleChangeAdults(i, event) {
    const { value, name } = event.target;
    const newState = [...adults];
    newState[i] = {
      ...newState[i],
      [name]: value,
    };
    console.log(newState);
    setAdults(newState);
  }

  const onChangeNumberOfChildren = (e) => {
    const numberOfChildren = e.target.value;

    setNumChildren(numberOfChildren);
    if (numberOfChildren > 0) {
      let generateArrays = [];
      for (let i = 1; i <= Number(e.target.value); i++) {
        let obj = { id: i, name: "", relationship: "", dob: "" };
        generateArrays.push(obj);
      }
      console.log(generateArrays);
      setChildren(generateArrays);
    } else {
      setChildren([]);
    }
  };
  function addChildren() {
    return children.map((child, idx) => (
      <Row>
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
      </Row>
    ));
  }
  function handleChangeChildren(i, event) {
    const { value, name } = event.target;
    const newState = [...children];
    newState[i] = {
      ...newState[i],
      [name]: value,
    };
    console.log(newState);
    setChildren(newState);
  }
  const onChangeNumberOfPets = (e) => {
    const numberOfPets = e.target.value;

    setNumPets(numberOfPets);

    if (numberOfPets > 0) {
      let generateArrays = [];
      for (let i = 1; i <= Number(e.target.value); i++) {
        let obj = { id: i, name: "", type: "", breed: "", weight: "" };
        generateArrays.push(obj);
      }
      console.log(generateArrays);
      setPets(generateArrays);
    } else {
      setPets([]);
    }
  };
  function addPets() {
    return pets.map((pet, idx) => (
      <Row>
        <Col>
          <label htmlFor="numPets"> Pets {pet + 1} Name </label>
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
      </Row>
    ));
  }
  function handleChangePets(i, event) {
    const { value, name } = event.target;
    const newState = [...pets];
    newState[i] = {
      ...newState[i],
      [name]: value,
    };
    console.log(newState);
    setPets(newState);
  }
  const onChangeNumberOfVehicles = (e) => {
    const numberOfVehicles = e.target.value;
    setNumVehicles(numberOfVehicles);
    if (numberOfVehicles > 0) {
      let generateArrays = [];
      for (let i = 1; i <= Number(e.target.value); i++) {
        let obj = {
          id: i,
          make: "",
          model: "",
          year: "",
          state: "",
          license: "",
        };
        generateArrays.push(obj);
      }
      console.log(generateArrays);
      setVehicles(generateArrays);
    } else {
      setVehicles([]);
    }
  };
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
      </Row>
    ));
  }
  function handleChangeVehicles(i, event) {
    const { value, name } = event.target;
    const newState = [...vehicles];
    newState[i] = {
      ...newState[i],
      [name]: value,
    };
    console.log(newState);
    setVehicles(newState);
  }

  const onChangeNumberOfReferences = (e) => {
    const numberOfReferences = e.target.value;
    setNumReferences(numberOfReferences);
    if (numberOfReferences > 0) {
      let generateArrays = [];
      for (let i = 1; i <= Number(e.target.value); i++) {
        let obj = {
          id: i,
          name: "",
          address: "",
          phone: "",
          email: "",
          relationship: "",
        };
        generateArrays.push(obj);
      }
      console.log(generateArrays);
      setReferences(generateArrays);
    } else {
      setReferences([]);
    }
  };
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
            onChange={(e) => handleChangeReferences(idx, e)}
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
      </Row>
    ));
  }
  function handleChangeReferences(i, event) {
    const { value, name } = event.target;
    const newState = [...references];
    newState[i] = {
      ...newState[i],
      [name]: value,
    };
    console.log(newState);
    setReferences(newState);
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
        <div className="w-100 mb-5">
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
                        placeholder="123-45-6789"
                        value={ssn}
                        onChange={(e) => setSsn(e.target.value)}
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
                    {" "}
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
                <Row className="mb-4" style={headings}>
                  <div>Who plans to live in the unit?</div>
                </Row>

                <Row>
                  <Col>
                    {" "}
                    <Form.Group className="mx-2 my-3">
                      <Form.Label as="h6" className="mb-0 ms-2">
                        Adults
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        placeholder="Title"
                        value={numAdults}
                        onChange={onChangeNumberOfAdults}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    {" "}
                    <Form.Group className="mx-2 my-3">
                      <Form.Label as="h6" className="mb-0 ms-2">
                        Children
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        placeholder="Title"
                        value={numChildren}
                        onChange={onChangeNumberOfChildren}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    {" "}
                    <Form.Group className="mx-2 my-3">
                      <Form.Label as="h6" className="mb-0 ms-2">
                        Pets
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        placeholder="Title"
                        value={numPets}
                        onChange={onChangeNumberOfPets}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>{adults.length ? <div>{addAdults()}</div> : null}</Row>
                <Row>{children.length ? <div>{addChildren()}</div> : null}</Row>
                <Row>{pets.length ? <div>{addPets()}</div> : null}</Row>
              </Row>
              <Row className="mx-2 mb-4">
                <h5>Vehicle Information</h5>
                <Row>
                  <Col>
                    {" "}
                    <Form.Group className="mx-2 my-3">
                      <Form.Label as="h6" className="mb-0 ms-2">
                        Vehicles
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        placeholder="No. of Vehicles"
                        value={numVehicles}
                        onChange={onChangeNumberOfVehicles}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>{vehicles.length ? <div>{addVehicles()}</div> : null}</Row>
              </Row>
              <Row className="mx-2 mb-4">
                <h5>References</h5>
                <Row>
                  <Col>
                    {" "}
                    <Form.Group className="mx-2 my-3">
                      <Form.Label as="h6" className="mb-0 ms-2">
                        References
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        placeholder="No. of References"
                        value={numReferences}
                        onChange={onChangeNumberOfReferences}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  {references.length ? <div>{addReferences()}</div> : null}
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
                {Object.values(adults).length > 0 ? (
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
                  ""
                )}
              </div>
              <div>
                {Object.values(children).length > 0 ? (
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
                  ""
                )}
              </div>
              <div>
                {Object.values(pets).length > 0 ? (
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
                  ""
                )}
              </div>
              <div>
                {Object.values(vehicles).length > 0 ? (
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
                  ""
                )}
              </div>
              <div>
                {Object.values(references).length > 0 ? (
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
                  ""
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
        </div>
      </div>

      <div hidden={responsive.showSidebar} className="w-100 mt-3">
        <TenantFooter />
      </div>
    </div>
  );
}

export default TenantProfile;
