import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
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
import AddressForm from "../AddressForm";
import SideBar from "./SideBar";
import TenantFooter from "./TenantFooter";
import DocumentsUploadPut from "../DocumentsUploadPut";
import Check from "../../icons/Check.svg";
import AddIcon from "../../icons/AddIcon.svg";
import DeleteIcon from "../../icons/DeleteIcon.svg";
import File from "../../icons/File.svg";
import { get, put, post } from "../../utils/api";
import {
  squareForm,
  small,
  underline,
  headings,
  gray,
  subHeading,
  pillButton,
  red,
  hidden,
  bluePillButton,
} from "../../utils/styles";
import {
  MaskCharacter,
  formatPhoneNumber,
  formatSSN,
} from "../../utils/helper";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});
function TenantProfile(props) {
  const classes = useStyles();
  // console.log("in tenant profile");
  const context = useContext(AppContext);
  const { userData, refresh, logout } = context;
  const { user } = userData;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [diff, setDiff] = useState(null);
  const [expandFrequency, setExpandFrequency] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // console.log("user info", user);
  const [editProfile, setEditProfile] = useState(false);
  const [addDoc, setAddDoc] = useState(false);
  const [tenantInfo, setTenantInfo] = useState([]);
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
  const [showSSN, setShowSSN] = useState(true);
  const [dlNumber, setDLNumber] = useState("");
  const defaultState = "--";
  const [selectedState, setSelectedState] = useState(defaultState);
  const [selectedDlState, setSelectedDlState] = useState(defaultState);
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

  const editDocument = (i) => {
    const newFiles = [...files];
    const file = newFiles.splice(i, 1)[0];
    setFiles(newFiles);
    setEditingDoc(file);
    setNewFile({ ...file });
  };

  //popover open and close
  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const fetchProfile = async () => {
    const response = await get(
      `/tenantProfileInfo?tenant_id=${user.tenant_id[0].tenant_id}`
    );
    // console.log(response);

    if (response.msg === "Token has expired") {
      // console.log("here msg");
      refresh();
      return;
    }

    if (user.role.indexOf("TENANT") === -1) {
      // console.log("no tenant profile");
      // props.onConfirm();
    }
    if (response.result.length > 0) {
      // console.log("Profile complete");
      setTenantInfo(response.result);
      setFirstName(response.result[0].tenant_first_name);
      setLastName(response.result[0].tenant_last_name);
      setSsn(response.result[0].tenant_ssn);
      setPhone(response.result[0].tenant_phone_number);
      setEmail(response.result[0].tenant_email);
      setSalary(response.result[0].tenant_current_salary);
      setJobTitle(response.result[0].tenant_current_job_title);
      setCompany(response.result[0].tenant_current_job_company);
      setDLNumber(response.result[0].tenant_drivers_license_number);
      setSelectedDlState(response.result[0].tenant_drivers_license_state);
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
      if (response.result[0].tenant_previous_address !== null) {
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
    } else {
      // console.log("Profile Incomplete");
      setEditProfile(true);
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setPhone(user.phone_number);
      setEmail(user.email);
    }
  };
  useEffect(() => {
    fetchProfile();
    // setEditProfile(true);
  }, [addDoc]);

  const submitInfo = async () => {
    if (tenantInfo.length > 0) {
      // console.log("update profile because tenant prolfile exits");
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
        drivers_license_state: selectedDlState,
        current_address: JSON.stringify(currentAddressState[0]),
        previous_address:
          previousAddressState[0].street == "" ||
          previousAddressState[0].street == "" ||
          previousAddressState[0].city == "" ||
          previousAddressState[0].state == ""
            ? ""
            : JSON.stringify(previousAddressState[0]),
        adult_occupants: JSON.stringify(adults),
        children_occupants: JSON.stringify(children),
        pet_occupants: JSON.stringify(pets),
        references: JSON.stringify(references),
        vehicle_info: JSON.stringify(vehicles),
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
      tenantProfile.tenant_id = user.tenant_id[0].tenant_id;
      await put(`/tenantProfileInfo`, tenantProfile, null, files);

      setEditProfile(false);
      // props.onConfirm();
    } else {
      // console.log("post becuase create new tenant profile");
      currentAddressState[0].state = selectedState;
      if (previousAddressState && previousAddressState.length) {
        previousAddressState[0].state = selectedPrevState;
      }

      const tenantProfile = {
        tenant_first_name: firstName,
        tenant_last_name: lastName,
        tenant_current_salary: salary,
        tenant_phone_number: phone,
        tenant_email: email,
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

      tenantProfile.tenant_id = user.tenant_id[0].tenant_id;
      await post("/tenantProfileInfo", tenantProfile, null, files);

      setEditProfile(false);
      // props.onConfirm();

      // updateAutofillState(tenantProfile);
      // props.onConfirm();
    }
  };
  // console.log(usePreviousAddress, previousAddressState[0]);

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
    return (
      <div className="my-2">
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
                    padding: "1.5rem",
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
                    padding: "1.5rem",
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
              <TableCell>Weight</TableCell>
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
                  {/* <label htmlFor="numPets">Weight</label> */}
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
                    padding: "1.5rem",
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
                    padding: "1.5rem",
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
                    padding: "1.5rem",
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

  // console.log(previousAddressState);
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
                        onChange={(e) =>
                          setPhone(formatPhoneNumber(e.target.value))
                        }
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
                  {/* <Col>
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
                  </Col> */}
                </Row>
                <Row>
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
                  <Col>
                    <Form.Group className="my-2">
                      <Form.Label as="h6" className="mb-0 ms-2">
                        Driver's License State{" "}
                        {selectedDlState === "" ? required : ""}
                      </Form.Label>
                      <Form.Select
                        style={{
                          ...squareForm,
                        }}
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
              <div className="my-2">
                <Row className="mb-2" style={headings}>
                  <div>Personal Details</div>
                </Row>
                <Row className="mx-3">
                  <Table
                    classes={{ root: classes.customTable }}
                    size="small"
                    responsive="md"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell> First Name</TableCell>
                        <TableCell> Last Name</TableCell>
                        <TableCell> Phone Number</TableCell>
                        <TableCell> Email</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          {" "}
                          {firstName && firstName !== "NULL"
                            ? firstName
                            : "No First Name Provided"}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {lastName && lastName !== "NULL"
                            ? lastName
                            : "No Last Name Provided"}
                        </TableCell>
                        <TableCell>
                          {phone && phone !== "NULL"
                            ? phone
                            : "No Phone Number Provided"}
                        </TableCell>
                        <TableCell>
                          {email && email !== "NULL"
                            ? email
                            : "No Email Provided"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Row>
              </div>

              <div className="my-2">
                <Row className="mb-2" style={headings}>
                  <div>Identification Details</div>
                </Row>
                <Row className="mx-3">
                  <Table
                    classes={{ root: classes.customTable }}
                    size="small"
                    responsive="md"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell> SSN</TableCell>
                        <TableCell> Driver's Licence Number</TableCell>
                        <TableCell> Driver's Licence State</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell onClick={() => setShowSSN(!showSSN)}>
                          {" "}
                          {ssn && ssn !== "NULL"
                            ? showSSN
                              ? MaskCharacter(ssn, "*")
                              : ssn
                            : "No SSN Provided"}
                        </TableCell>
                        <TableCell>
                          {dlNumber && dlNumber !== "NULL"
                            ? dlNumber
                            : "No DL Provided"}
                        </TableCell>
                        <TableCell>
                          {selectedDlState && selectedDlState !== "NULL"
                            ? selectedDlState
                            : "No DL state Provided"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Row>
              </div>

              <div className="my-2">
                <Row className="mb-2" style={headings}>
                  <div>Current Job Details</div>
                </Row>
                <Row className="mx-3">
                  <Table
                    classes={{ root: classes.customTable }}
                    size="small"
                    responsive="md"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell> Current Salary</TableCell>
                        <TableCell>Salary Frequency</TableCell>
                        <TableCell> Current Job Title</TableCell>
                        <TableCell> Current Company Name</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          {salary && salary !== "NULL"
                            ? salary
                            : "No Salary Info Provided"}
                        </TableCell>
                        <TableCell>
                          {frequency && frequency !== "NULL"
                            ? frequency
                            : "No Salary Info Provided"}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {jobTitle && jobTitle !== "NULL"
                            ? jobTitle
                            : "No Job Title Provided"}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {company && company !== "NULL"
                            ? company
                            : "No Company Provided"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
                hideRentingCheckbox="false"
                state={currentAddressState}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                diff={diff}
                setDiff={setDiff}
                usePreviousAddress={usePreviousAddress}
                setUsePreviousAddress={setUsePreviousAddress}
                // previousAddressState={previousAddressState}
              />
              {diff > 0 && diff < 24 ? (
                <div>
                  <h5 className="mx-2 my-3">Previous Address</h5>
                  <AddressForm
                    editProfile={editProfile}
                    hideRentingCheckbox="true"
                    errorMessage={errorMessage}
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
                    <Table
                      responsive="md"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Relationship</TableCell>
                          <TableCell>DOB(YYYY-MM-DD)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.values(adults).map((adult) => {
                          return (
                            <TableRow>
                              <TableCell>{adult.name}</TableCell>
                              <TableCell>{adult.relationship}</TableCell>
                              <TableCell>{adult.dob}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
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
                    <Table
                      responsive="md"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Relationship</TableCell>
                          <TableCell>DOB(YYYY-MM-DD)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.values(children).map((child) => {
                          return (
                            <TableRow>
                              <TableCell>{child.name}</TableCell>
                              <TableCell>{child.relationship}</TableCell>
                              <TableCell>{child.dob}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
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
                    <Table
                      responsive="md"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <TableHead>
                        {" "}
                        <TableRow style={subHeading}>
                          <TableCell>Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Breed</TableCell>
                          <TableCell>Weight</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.values(pets).map((pet) => {
                          return (
                            <TableRow>
                              {" "}
                              <TableCell>{pet.name}</TableCell>
                              <TableCell>{pet.type}</TableCell>
                              <TableCell>{pet.breed}</TableCell>
                              <TableCell>{pet.weight}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
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
                    <Table
                      responsive="md"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <TableHead>
                        <TableRow style={subHeading}>
                          <TableCell>Make</TableCell>
                          <TableCell>Model</TableCell>
                          <TableCell>Year</TableCell>
                          <TableCell>State</TableCell>
                          <TableCell>License</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.values(vehicles).map((vehicle) => {
                          return (
                            <TableRow>
                              <TableCell>{vehicle.make}</TableCell>
                              <TableCell>{vehicle.model}</TableCell>
                              <TableCell>{vehicle.year}</TableCell>
                              <TableCell>{vehicle.state}</TableCell>
                              <TableCell>{vehicle.license}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
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
                    <Table
                      responsive="md"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <TableHead>
                        <TableRow style={subHeading}>
                          <TableCell>Name</TableCell>
                          <TableCell>Address</TableCell>
                          <TableCell>Phone Number</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Relationship</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.values(references).map((reference) => {
                          return (
                            <div>
                              <TableRow>
                                <TableCell>{reference.name}</TableCell>
                                <TableCell>{reference.address}</TableCell>
                                <TableCell>{reference.phone}</TableCell>
                                <TableCell>{reference.email}</TableCell>
                                <TableCell>{reference.relationship}</TableCell>
                              </TableRow>
                            </div>
                          );
                        })}
                      </TableBody>
                    </Table>
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

              <DocumentsUploadPut
                files={files}
                setFiles={setFiles}
                addDoc={addDoc}
                setAddDoc={setAddDoc}
                endpoint="/tenantProfileInfo"
                editingDoc={editingDoc}
                setEditingDoc={setEditingDoc}
                id={user.tenant_id[0].tenant_id}
              />
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
              <DocumentsUploadPut
                files={files}
                setFiles={setFiles}
                addDoc={addDoc}
                setAddDoc={setAddDoc}
                endpoint="/tenantProfileInfo"
                editingDoc={editingDoc}
                setEditingDoc={setEditingDoc}
                id={user.tenant_id[0].tenant_id}
              />
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
