import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
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
import Checkbox from "../Checkbox";
import DocumentsUploadPost from "../DocumentsUploadPost";
import AddressForm from "../AddressForm";
import { get, post } from "../../utils/api";
import ArrowDown from "../../icons/ArrowDown.svg";
import AddIcon from "../../icons/AddIcon.svg";
import DeleteIcon from "../../icons/DeleteIcon.svg";
import {
  squareForm,
  pillButton,
  small,
  underline,
  red,
  hidden,
  mediumBold,
} from "../../utils/styles";
import { formatPhoneNumber, formatSSN } from "../../utils/helper";

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

function TenantProfileInfo(props) {
  const classes = useStyles();
  var CryptoJS = require("crypto-js");
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
  const handleChangeFrequency = (event) => {
    setFrequency(event.target.value);
  };
  const handleChangeDLState = (event) => {
    setSelectedDlState(event.target.value);
  };
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
  const [addDoc, setAddDoc] = useState(false);

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
    return (
      <div>
        <Table
          responsive="md"
          classes={{ root: classes.customTable }}
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell>Adult Name</TableCell>
              <TableCell>Relationship to Applicant</TableCell>
              <TableCell>Date of Birth (MM/DD/YYYY)</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adults.map((adult, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  {/* <label htmlFor="numAdults"> Adult {idx + 1} Name </label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={adult.name}
                    onChange={(e) => handleChangeAdults(idx, e)}
                  />
                </TableCell>
                <TableCell>
                  {/* <label htmlFor="numAdults">Relationship to Applicant </label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="relationship"
                    value={adult.relationship}
                    onChange={(e) => handleChangeAdults(idx, e)}
                  />
                </TableCell>
                <TableCell>
                  {/* <label htmlFor="numAdults">Date of Birth (MM/DD/YYYY)</label> */}
                  <input
                    type="date"
                    className="form-control"
                    name="dob"
                    value={adult.dob}
                    onChange={(e) => handleChangeAdults(idx, e)}
                  />
                </TableCell>
                <TableCell
                  xs={2}
                  style={{
                    padding: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={DeleteIcon}
                    alt="Delete Icon"
                    onClick={() => handleRemoveAdults(idx)}
                    style={{
                      width: "15px",
                      height: "15px",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
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
      <div>
        <Table
          responsive="md"
          classes={{ root: classes.customTable }}
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell>Child Name</TableCell>
              <TableCell>Relationship to Applicant</TableCell>
              <TableCell>Date of Birth (MM/DD/YYYY)</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {children.map((child, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  {/* <label htmlFor="numChildren"> Children {idx + 1} Name </label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={child.name}
                    onChange={(e) => handleChangeChildren(idx, e)}
                  />
                </TableCell>
                <TableCell>
                  {/* <label htmlFor="numChildren">Relationship to Applicant </label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="relationship"
                    value={child.relationship}
                    onChange={(e) => handleChangeChildren(idx, e)}
                  />
                </TableCell>
                <TableCell>
                  {/* <label htmlFor="numChildren">Date of Birth (MM/DD/YYYY)</label> */}
                  <input
                    type="date"
                    className="form-control"
                    name="dob"
                    value={child.dob}
                    onChange={(e) => handleChangeChildren(idx, e)}
                  />
                </TableCell>
                <TableCell
                  xs={2}
                  style={{
                    padding: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={DeleteIcon}
                    alt="Delete Icon"
                    onClick={() => handleRemoveChildren(idx)}
                    style={{
                      width: "15px",
                      height: "15px",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
    return (
      <div>
        <Table
          responsive="md"
          classes={{ root: classes.customTable }}
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>If Dog, What Breed?</TableCell>
              <TableCell>Weight (lbs)</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pets.map((pet, idx) => (
              <TableRow>
                <TableCell>
                  {/* <label htmlFor="numPets"> Pets {idx + 1} Name </label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={pet.name}
                    onChange={(e) => handleChangePets(idx, e)}
                  />
                </TableCell>
                <TableCell>
                  {/* <label htmlFor="numPets">Type </label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="type"
                    value={pet.type}
                    onChange={(e) => handleChangePets(idx, e)}
                  />
                </TableCell>
                <TableCell>
                  {/* <label htmlFor="numPets">If Dog, What Breed?</label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="breed"
                    value={pet.breed}
                    onChange={(e) => handleChangePets(idx, e)}
                  />
                </TableCell>
                <TableCell>
                  {/* <label htmlFor="numPets">Weight (lbs)</label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="weight"
                    value={pet.weight}
                    onChange={(e) => handleChangePets(idx, e)}
                  />
                </TableCell>
                <TableCell
                  xs={2}
                  style={{
                    padding: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={DeleteIcon}
                    alt="Delete Icon"
                    onClick={() => handleRemovePets(idx)}
                    style={{
                      width: "15px",
                      height: "15px",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
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
    return (
      <div>
        <Table
          responsive="md"
          classes={{ root: classes.customTable }}
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell>Make</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>State</TableCell>
              <TableCell>License</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle, idx) => (
              <TableRow>
                <TableCell>
                  {/* <label htmlFor="numVehicles"> Make </label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="make"
                    value={vehicle.make}
                    onChange={(e) => handleChangeVehicles(idx, e)}
                  />
                </TableCell>
                <TableCell>
                  {/* <label htmlFor="numVehicles">Model </label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="model"
                    value={vehicle.model}
                    onChange={(e) => handleChangeVehicles(idx, e)}
                  />
                </TableCell>
                <TableCell>
                  {/* <label htmlFor="numVehicles">Year</label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="year"
                    value={vehicle.year}
                    onChange={(e) => handleChangeVehicles(idx, e)}
                  />
                </TableCell>
                <TableCell>
                  {/* <label htmlFor="numVehicles">State</label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={vehicle.state}
                    onChange={(e) => handleChangeVehicles(idx, e)}
                  />
                </TableCell>
                <TableCell>
                  {/* <label htmlFor="numVehicles">License</label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="license"
                    value={vehicle.license}
                    onChange={(e) => handleChangeVehicles(idx, e)}
                  />
                </TableCell>
                <TableCell
                  xs={2}
                  style={{
                    padding: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={DeleteIcon}
                    alt="Delete Icon"
                    onClick={() => handleRemoveVehicles(idx)}
                    style={{
                      width: "15px",
                      height: "15px",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
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
    return (
      <div>
        <Table
          responsive="md"
          classes={{ root: classes.customTable }}
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Relationship to Applicant</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {references.map((reference, idx) => (
              <TableRow>
                <TableCell>
                  {/* <label htmlFor="numReferences"> Name </label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={reference.name}
                    onChange={(e) => handleChangeReferences(idx, e)}
                  />
                </TableCell>
                <TableCell>
                  {/* <label htmlFor="numReferences">Address </label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={reference.address}
                    onChange={(e) => handleChangeReferences(idx, e)}
                  />
                </TableCell>
                <TableCell>
                  {/* <label htmlFor="numReferences">Phone Number</label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={reference.phone}
                    onChange={(e) => handlePhoneNumber(idx, e)}
                  />
                </TableCell>
                <TableCell>
                  {/* <label htmlFor="numReferences">Email</label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    value={reference.email}
                    onChange={(e) => handleChangeReferences(idx, e)}
                  />
                </TableCell>
                <TableCell>
                  {/* <label htmlFor="numReferences">Relationship</label> */}
                  <input
                    type="text"
                    className="form-control"
                    name="relationship"
                    value={reference.relationship}
                    onChange={(e) => handleChangeReferences(idx, e)}
                  />
                </TableCell>
                <TableCell
                  xs={2}
                  style={{
                    padding: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={DeleteIcon}
                    alt="Delete Icon"
                    onClick={() => handleRemoveReferences(idx)}
                    style={{
                      width: "15px",
                      height: "15px",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  const handlePhoneNumber = (i, event) => {
    const fields = [...references];
    fields[i][event.target.name] = formatPhoneNumber(event.target.value);
    setReferences(fields);
  };

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
        `/tenantProfileInfo?tenant_id=${user.tenant_id[0].tenant_id}`
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
      tenant_ssn: CryptoJS.AES.encrypt(
        ssn,
        process.env.REACT_APP_ENKEY
      ).toString(),
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
    const newFiles = [...files];

    for (let i = 0; i < newFiles.length; i++) {
      let key = `doc_${i}`;
      if (newFiles[i].file !== undefined) {
        tenantProfile[key] = newFiles[i].file;
      } else {
        tenantProfile[key] = newFiles[i].link;
      }

      delete newFiles[i].file;
    }
    tenantProfile.documents = JSON.stringify(newFiles);
    tenantProfile.tenant_user_id = user.user_uid;
    // console.log(tenantProfile);
    await post("/tenantProfileInfo", tenantProfile, null, newFiles);
    updateAutofillState(tenantProfile);
    props.onConfirm();
  };

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

  const usStates = [
    {
      name: "Alabama",
      abbreviation: "AL",
    },
    {
      name: "Alaska",
      abbreviation: "AK",
    },
    {
      name: "American Samoa",
      abbreviation: "AS",
    },
    {
      name: "Arizona",
      abbreviation: "AZ",
    },
    {
      name: "Arkansas",
      abbreviation: "AR",
    },
    {
      name: "California",
      abbreviation: "CA",
    },
    {
      name: "Colorado",
      abbreviation: "CO",
    },
    {
      name: "Connecticut",
      abbreviation: "CT",
    },
    {
      name: "Delaware",
      abbreviation: "DE",
    },
    {
      name: "District Of Columbia",
      abbreviation: "DC",
    },
    {
      name: "Federated States Of Micronesia",
      abbreviation: "FM",
    },
    {
      name: "Florida",
      abbreviation: "FL",
    },
    {
      name: "Georgia",
      abbreviation: "GA",
    },
    {
      name: "Guam",
      abbreviation: "GU",
    },
    {
      name: "Hawaii",
      abbreviation: "HI",
    },
    {
      name: "Idaho",
      abbreviation: "ID",
    },
    {
      name: "Illinois",
      abbreviation: "IL",
    },
    {
      name: "Indiana",
      abbreviation: "IN",
    },
    {
      name: "Iowa",
      abbreviation: "IA",
    },
    {
      name: "Kansas",
      abbreviation: "KS",
    },
    {
      name: "Kentucky",
      abbreviation: "KY",
    },
    {
      name: "Louisiana",
      abbreviation: "LA",
    },
    {
      name: "Maine",
      abbreviation: "ME",
    },
    {
      name: "Marshall Islands",
      abbreviation: "MH",
    },
    {
      name: "Maryland",
      abbreviation: "MD",
    },
    {
      name: "Massachusetts",
      abbreviation: "MA",
    },
    {
      name: "Michigan",
      abbreviation: "MI",
    },
    {
      name: "Minnesota",
      abbreviation: "MN",
    },
    {
      name: "Mississippi",
      abbreviation: "MS",
    },
    {
      name: "Missouri",
      abbreviation: "MO",
    },
    {
      name: "Montana",
      abbreviation: "MT",
    },
    {
      name: "Nebraska",
      abbreviation: "NE",
    },
    {
      name: "Nevada",
      abbreviation: "NV",
    },
    {
      name: "New Hampshire",
      abbreviation: "NH",
    },
    {
      name: "New Jersey",
      abbreviation: "NJ",
    },
    {
      name: "New Mexico",
      abbreviation: "NM",
    },
    {
      name: "New York",
      abbreviation: "NY",
    },
    {
      name: "North Carolina",
      abbreviation: "NC",
    },
    {
      name: "North Dakota",
      abbreviation: "ND",
    },
    {
      name: "Northern Mariana Islands",
      abbreviation: "MP",
    },
    {
      name: "Ohio",
      abbreviation: "OH",
    },
    {
      name: "Oklahoma",
      abbreviation: "OK",
    },
    {
      name: "Oregon",
      abbreviation: "OR",
    },
    {
      name: "Palau",
      abbreviation: "PW",
    },
    {
      name: "Pennsylvania",
      abbreviation: "PA",
    },
    {
      name: "Puerto Rico",
      abbreviation: "PR",
    },
    {
      name: "Rhode Island",
      abbreviation: "RI",
    },
    {
      name: "South Carolina",
      abbreviation: "SC",
    },
    {
      name: "South Dakota",
      abbreviation: "SD",
    },
    {
      name: "Tennessee",
      abbreviation: "TN",
    },
    {
      name: "Texas",
      abbreviation: "TX",
    },
    {
      name: "Utah",
      abbreviation: "UT",
    },
    {
      name: "Vermont",
      abbreviation: "VT",
    },
    {
      name: "Virgin Islands",
      abbreviation: "VI",
    },
    {
      name: "Virginia",
      abbreviation: "VA",
    },
    {
      name: "Washington",
      abbreviation: "WA",
    },
    {
      name: "West Virginia",
      abbreviation: "WV",
    },
    {
      name: "Wisconsin",
      abbreviation: "WI",
    },
    {
      name: "Wyoming",
      abbreviation: "WY",
    },
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
    <div className="pb-4 w-100 overflow-hidden">
      <Header title="Tenant Profile" />
      <div>
        <Row className="mx-5 my-3">
          <Col className="my-2">
            <TextField
              fullWidth
              variant="outlined"
              label="First Name"
              size="small"
              error={Boolean(errorMessage)}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Col>
          <Col className="my-2">
            <TextField
              fullWidth
              variant="outlined"
              label="Last Name"
              size="small"
              error={Boolean(errorMessage)}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="mx-5 my-3">
          <Col className="my-2">
            <TextField
              fullWidth
              variant="outlined"
              label="Salary"
              size="small"
              error={Boolean(errorMessage)}
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </Col>

          <Col className="my-2">
            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={frequency}
                label="Frequency"
                size="small"
                error={Boolean(errorMessage)}
                onChange={handleChangeFrequency}
              >
                {allFrequency.map((freq, i) => (
                  <MenuItem value={freq}> {freq} </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Col>
        </Row>
        <Row className="mx-5 my-3">
          <Col className="my-2">
            <TextField
              fullWidth
              variant="outlined"
              label="Current Job Title"
              size="small"
              error={Boolean(errorMessage)}
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </Col>
          <Col className="my-2">
            {" "}
            <TextField
              fullWidth
              variant="outlined"
              label="Company Name"
              size="small"
              error={Boolean(errorMessage)}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="mx-5 my-3">
          <Col className="my-2">
            <TextField
              fullWidth
              variant="outlined"
              label="Social Security Number"
              size="small"
              error={Boolean(errorMessage)}
              value={ssn}
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"
              onChange={(e) => setSsn(formatSSN(e.target.value))}
            />
          </Col>
          <Col className="my-2"> </Col>
        </Row>
        <Row className="mx-5 my-3">
          <Col className="my-2">
            <TextField
              fullWidth
              variant="outlined"
              label=" Driver's License Number"
              size="small"
              error={Boolean(errorMessage)}
              value={dlNumber}
              onChange={(e) => setDLNumber(e.target.value)}
            />
          </Col>

          <Col className="my-2">
            <FormControl fullWidth>
              <InputLabel> Driver's License State</InputLabel>
              <Select
                value={selectedDlState}
                label=" Driver's License State"
                size="small"
                error={Boolean(errorMessage)}
                onChange={handleChangeDLState}
              >
                {usStates.map((state, i) => (
                  <MenuItem value={state.abbreviation} key={i}>
                    {" "}
                    {state.name}{" "}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Col>
        </Row>

        <Row className="mx-1 my-3">
          {/* ===============================< Current Address form -- > Address form >=================================================== */}
          <h5 className="mx-2 my-3">Current Address (Required)</h5>
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
                alt="Add Icon"
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
                alt="Add Icon"
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
                alt="Add Icon"
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
                alt="Add Icon"
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
                alt="Add Icon"
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

          <DocumentsUploadPost
            files={files}
            setFiles={setFiles}
            addDoc={addDoc}
            setAddDoc={setAddDoc}
            editingDoc={editingDoc}
            setEditingDoc={setEditingDoc}
          />
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
