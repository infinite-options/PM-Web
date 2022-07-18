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
import AddressForm from "../components/AddressForm";
import Check from "../icons/Check.svg";
import ArrowUp from "../icons/ArrowUp.svg";
import ArrowDown from "../icons/ArrowDown.svg";
import { get, put, post } from "../utils/api";
import {
  squareForm,
  smallPillButton,
  small,
  underline,
  mediumBold,
} from "../utils/styles";
import EditIcon from "../icons/EditIcon.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";
import Logout from "../components/Logout";

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

  return (
    <div className="mb-5 pb-5">
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
            placeholder="First Name"
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
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mx-2 my-3">
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
        <Form.Group className="mx-2 my-3">
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
        <AddressForm
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
            <AddressForm
              state={previousAddressState}
              selectedState={selectedPrevState}
              setSelectedState={setSelectedPrevState}
            />
          </div>
        ) : (
          ""
        )}

        <div className="mb-4" style={{ margin: "20px" }}>
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
        </div>
      </Container>
      <Logout />
    </div>
  );
}

export default TenantProfile;
