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
  const [phone, setPhone] = React.useState(user.phone_number);
  const [email, setEmail] = React.useState(user.email);
  const [salary, setSalary] = useState("");
  const [frequency, setFrequency] = useState("Annual");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [ssn, setSsn] = useState("");
  const [dlNumber, setDLNumber] = useState("");
  const defaultState = "--";
  const [selectedState, setSelectedState] = React.useState(defaultState);
  const [selectedPrevState, setSelectedPrevState] =
    React.useState(defaultState);
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
  const [newFile, setNewFile] = React.useState(null);
  const [editingDoc, setEditingDoc] = React.useState(null);
  const [files, setFiles] = React.useState([]);

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
    };

    for (let i = 0; i < files.length; i++) {
      let key = `doc_${i}`;
      tenantProfile[key] = files[i].file;
      delete files[i].file;
    }
    tenantProfile.documents = JSON.stringify(files);
    await put(`/tenantProfileInfo`, tenantProfile, access_token, files);
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
              {files.map((file, i) => (
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
              ))}
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
