import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Switch } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import PropertyAppliances from "../PropertyAppliances";
import PropertyUtilities from "../PropertyUtilities";
import PropertyImages from "../PropertyImages";
import ConfirmDialog2 from "../ConfirmDialog2";
import ConfirmDialog from "../ConfirmDialog";
import AppContext from "../../AppContext";
import Edit from "../../icons/Edit.svg";
import ArrowDown from "../../icons/ArrowDown.svg";
import DeleteIcon from "../../icons/DeleteIcon.svg";
import EditIconNew from "../../icons/EditIconNew.svg";
import {
  pillButton,
  squareForm,
  tileImg,
  xSmall,
  bold,
  hidden,
  red,
  small,
  mediumBold,
} from "../../utils/styles";
import { post, put } from "../../utils/api";
import Appliances from "../tenantComponents/Appliances";

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
function OwnerPropertyForm(props) {
  const classes = useStyles();
  const { userData } = useContext(AppContext);
  const { user } = userData;
  const navigate = useNavigate();
  const applianceState = useState({
    Microwave: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      documents: [],
      url: "",
    },
    Dishwasher: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      documents: [],
      url: "",
    },
    Refrigerator: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      documents: [],
      url: "",
    },
    Washer: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      documents: [],
      url: "",
    },
    Dryer: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      documents: [],
      url: "",
    },
    Range: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      documents: [],
      url: "",
    },
  });
  const utilityState = useState({
    Electricity: false,
    Trash: false,
    Water: false,
    Wifi: false,
    Gas: false,
  });
  const imageState = useState([]);
  const [address, setAddress] = useState("");
  const [unit, setUnit] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [type, setType] = useState("Apartment");
  const [numBeds, setNumBeds] = useState("");
  const [numBaths, setNumBaths] = useState("");
  const [area, setArea] = useState("");
  const [rent, setRent] = useState("");
  const [activeDate, setActiveDate] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [deposit, setDeposit] = useState("");
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [depositForRent, setDepositForRent] = useState(false);
  const [availableToRent, setAvailableToRent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const [showDialogDelete, setShowDialogDelete] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const {
    property,
    edit,
    setEdit,
    hideEdit,
    editAppliances,
    setEditAppliances,
  } = props;
  const appliances = Object.keys(applianceState[0]);
  const onConfirm = () => {
    setShowDialog(false);
  };

  const onCancelDelete = () => {
    setShowDialogDelete(false);
  };

  const loadProperty = () => {
    setAddress(property.address);
    setUnit(property.unit);
    setCity(property.city);
    setState(property.state);
    setZip(property.zip);
    setType(property.property_type);
    setNumBeds(property.num_beds);
    setNumBaths(property.num_baths);
    setArea(property.area);
    setRent(property.listed_rent);
    setActiveDate(property.active_date);
    setDescription(property.description);
    setNotes(property.notes);
    setDeposit(property.deposit);
    setPetsAllowed(property.pets_allowed);
    setDepositForRent(property.deposit_for_rent);
    setAvailableToRent(property.available_to_rent);
    applianceState[1](JSON.parse(property.appliances));
    utilityState[1](JSON.parse(property.utilities));
    loadImages();
  };
  const stateList = [
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
  useEffect(() => {
    if (property) {
      loadProperty();
    }
    if (edit) {
      window.scrollTo(0, 0);
    }
  }, [edit, property]);

  const submitForm = async () => {
    if (
      address === "" ||
      city === "" ||
      state === "" ||
      zip === "" ||
      type === "" ||
      numBeds === "" ||
      numBaths === "" ||
      area === "" ||
      rent === "" ||
      activeDate === "" ||
      description === "" ||
      deposit === ""
    ) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    const newProperty = {
      owner_id: user.user_uid,
      manager_id: "",
      active_date: activeDate,
      description: description,
      notes: notes,
      address: address,
      unit: unit,
      city: city,
      state: state,
      zip: zip,
      property_type: type,
      num_beds: numBeds,
      num_baths: numBaths,
      area: area,
      listed_rent: rent,
      deposit: deposit,
      appliances: JSON.stringify(applianceState[0]),
      utilities: JSON.stringify(utilityState[0]),
      pets_allowed:
        petsAllowed === true || petsAllowed === 1 ? "true" : "false",
      deposit_for_rent:
        depositForRent === true || depositForRent === 1 ? "true" : "false",
      available_to_rent:
        availableToRent === true || availableToRent === 1 ? "true" : "false",
    };
    const files = imageState[0];
    let i = 0;
    for (const file of imageState[0]) {
      let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
      if (file.file !== null) {
        newProperty[key] = file.file;
      } else {
        newProperty[key] = file.image;
      }
      // console.log(newProperty[key]);
    }
    // console.log(files);
    setShowSpinner(true);
    if (property) {
      newProperty.owner_id = property.owner_id;
      newProperty.manager_id = property.manager_id;
      const response = await put(
        `/properties/${property.property_uid}`,
        newProperty,
        null,
        files
      );
    } else {
      const newProperty = {
        owner_id: user.user_uid,
        manager_id: "",
        active_date: activeDate,
        description: description,
        notes: notes,
        address: address,
        unit: unit,
        city: city,
        state: state,
        zip: zip,
        property_type: type,
        num_beds: numBeds,
        num_baths: numBaths,
        area: area,
        listed_rent: rent,
        deposit: deposit,
        appliances: JSON.stringify(applianceState[0]),
        utilities: JSON.stringify(utilityState[0]),

        pets_allowed:
          petsAllowed === true || petsAllowed === 1 ? "true" : "false",
        deposit_for_rent:
          depositForRent === true || depositForRent === 1 ? "true" : "false",
        available_to_rent:
          availableToRent === true || availableToRent === 1 ? "true" : "false",
      };
      const files = imageState[0];
      // console.log(files, imageState);
      let i = 0;
      for (const file of imageState[0]) {
        let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
        if (file.file !== null) {
          newProperty[key] = file.file;
        } else {
          newProperty[key] = file.image;
        }
        // console.log(newProperty[key]);
      }
      const response = await post("/properties", newProperty, null, files);
    }
    setShowSpinner(false);
    props.onSubmit();
  };

  const loadImages = async () => {
    const files = [];
    const images = JSON.parse(property.images);
    for (let i = 0; i < images.length; i++) {
      files.push({
        index: i,
        image: images[i],
        file: null,
        coverPhoto: i === 0,
      });
    }
    imageState[1](files);
  };

  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const deleteProperty = async () => {
    setShowSpinner(true);
    const response = await put(
      `/RemovePropertyOwner?property_uid=${property.property_uid}`
    );

    setShowSpinner(false);
    navigate("/owner");
  };
  // console.log(activeDate);
  return editAppliances ? (
    <div className="d-flex flex-column w-100 overflow-hidden p-2">
      <div
        className="mx-3 my-3 p-2"
        style={{
          background: "#E9E9E9 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        <PropertyAppliances
          state={applianceState}
          property={property}
          editAppliances={editAppliances}
          setEditAppliances={setEditAppliances}
          edit={edit}
        />
      </div>
    </div>
  ) : (
    <div
      className="d-flex flex-column w-100 overflow-hidden p-2"
      style={{
        background: "#ffffff 0% 0% no-repeat padding-box",
        borderRadius: "10px",
        opacity: 1,
      }}
    >
      <ConfirmDialog2
        title={"Can't edit here. Click on the edit icon to make any changes"}
        isOpen={showDialog}
        onConfirm={onConfirm}
      />
      <ConfirmDialog
        title={"Are you sure you want to remove this property?"}
        isOpen={showDialogDelete}
        onConfirm={deleteProperty}
        onCancel={onCancelDelete}
      />
      <div
        className="mx-3 my-3 p-2"
        style={{
          background: "#E9E9E9 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        {edit ? (
          <div className="d-flex flex-column w-100">
            <Form.Group className="mx-2 my-3 ps-4">
              <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                Address {address === "" ? required : ""}
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex my-3 ps-4">
              <Col>
                <Form.Group className="mx-2">
                  <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                    Unit
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="Unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mx-2 ">
                  <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                    City {city === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </div>
            <div className="d-flex my-3 ps-4">
              <Col>
                <Form.Group className="mx-2">
                  <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                    State {state === "" ? required : ""}
                  </Form.Label>

                  <Form.Select
                    style={{
                      ...squareForm,
                      backgroundImage: `url(${ArrowDown})`,
                    }}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    {stateList.map((state, i) => (
                      <option value={state.abbreviation} key={i}>
                        {state.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mx-2">
                  <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                    Zip Code {zip === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="Zipcode"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </div>
          </div>
        ) : (
          <Row className="mx-2 ps-4">
            <Row className="d-flex justify-content-between">
              <Col>
                <h6 style={mediumBold}>Property Address</h6>
              </Col>
              <Col className="d-flex justify-content-end">
                {hideEdit ? (
                  ""
                ) : (
                  <img
                    src={Edit}
                    style={{ width: "15px", height: "25px" }}
                    alt="Edit"
                    onClick={() => setEdit(true)}
                  />
                )}
              </Col>
            </Row>
            <p style={mediumBold}>
              {address}
              {unit === "" ? "," : ` ${unit},`} {city}, {state}, {zip}
            </p>
          </Row>
        )}
        {edit ? (
          <Form.Group className="mx-2 my-3 ps-4">
            <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
              Description {description === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="Describe the property"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        ) : (
          <Row className="mx-2">
            <h6>Description</h6>
            <p>{description}</p>
          </Row>
        )}
        {edit ? (
          <Form.Group className="mx-2 my-3 ps-4">
            <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
              Notes
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="Notes for the property"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Form.Group>
        ) : (
          <Row className="mx-2">
            <h6>notes</h6>
            <p>{notes}</p>
          </Row>
        )}
        {edit ? (
          <div className="d-flex my-3 ps-4">
            <Col>
              <Form.Group className="mx-2">
                <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                  Type
                </Form.Label>
                <Form.Select
                  style={{
                    ...squareForm,
                    backgroundImage: `url(${ArrowDown})`,
                  }}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option>Apartment</option>
                  <option>Condo</option>
                  <option>House</option>
                  <option>Townhome</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mx-2">
                <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                  Bedroom {numBeds === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  placeholder="# of beds"
                  value={numBeds}
                  onChange={(e) => setNumBeds(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mx-2">
                <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                  Bath {numBaths === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  placeholder="# of baths"
                  value={numBaths}
                  onChange={(e) => setNumBaths(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mx-2">
                <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                  Sq. Ft. {area === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  placeholder="Sqft"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </Form.Group>
            </Col>
          </div>
        ) : (
          <Row className="mx-2">
            <Col>
              <h6>Type</h6>
              <p>{type}</p>
            </Col>
            <Col>
              <h6>Bedroom</h6>
              <p>{numBeds}</p>
            </Col>
            <Col>
              <h6>Bath</h6>
              <p>{numBaths}</p>
            </Col>
            <Col>
              <h6>Sq. Ft.</h6>
              <p>{area}</p>
            </Col>
          </Row>
        )}
      </div>
      <div
        className="mx-3 my-3 p-2"
        style={{
          background: "#E9E9E9 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        {edit ? (
          <div className="d-flex my-3 ps-4">
            <Col>
              <Form.Group className="mx-2">
                <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                  Active Date {activeDate === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #707070",
                    height: "2.4rem",
                  }}
                  type="date"
                  value={activeDate}
                  onChange={(e) => setActiveDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mx-2">
                <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                  Monthly Rent {rent === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  placeholder="Rent ($)"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mx-2">
                <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                  Deposit {deposit === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  placeholder="Deposit ($)"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                />
              </Form.Group>
            </Col>
          </div>
        ) : (
          <Row className="mx-2">
            <Col>
              <h6>Active Date</h6>
              <p>{activeDate}</p>
            </Col>

            <Col>
              <h6>Monthly Rent</h6>
              <p>{formatter.format(rent)}</p>
            </Col>
            <Col>
              <h6>Deposit</h6>
              <p>{formatter.format(deposit)}</p>
            </Col>
          </Row>
        )}
      </div>
      {property ? (
        <div
          className="mx-3 my-3 p-2"
          style={{
            background: "#E9E9E9 0% 0% no-repeat padding-box",
            borderRadius: "10px",
            opacity: 1,
          }}
        >
          <Row className="mx-2">
            <Col>
              <h6 style={mediumBold}>Appliances</h6>
            </Col>
            <Col>
              <img
                src={EditIconNew}
                alt="Edit Icon"
                onClick={() => {
                  window.scrollTo(0, 0);
                  setEditAppliances(true);
                }}
                style={{
                  width: "30px",
                  height: "30px",
                  float: "right",
                  marginRight: "5rem",
                }}
              />
            </Col>
          </Row>
          <Row className="m-2" style={{ overflow: "scroll" }}>
            <div>
              {/* <Table
                responsive="md"
                classes={{ root: classes.customTable }}
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Appliance</TableCell>
                    <TableCell>Manufacturer</TableCell>
                    <TableCell>Purchased From</TableCell>
                    <TableCell>Purchased On</TableCell>
                    <TableCell>Purchase Order Number</TableCell>
                    <TableCell>Installed On</TableCell>
                    <TableCell>Serial Number</TableCell>
                    <TableCell>Model Number</TableCell>
                    <TableCell>Warranty Till</TableCell>
                    <TableCell>Warranty Info</TableCell>
                    <TableCell>Images</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appliances.map((appliance, i) => {
                    return applianceState[0][appliance]["available"] === true ||
                      applianceState[0][appliance]["available"] === "True" ? (
                      <TableRow>
                        <TableCell>{appliance}</TableCell>
                        <TableCell>
                          {applianceState[0][appliance]["manufacturer"]}
                        </TableCell>
                        <TableCell>
                          {applianceState[0][appliance]["purchased_from"]}
                        </TableCell>
                        <TableCell>
                          {applianceState[0][appliance]["purchased"]}
                        </TableCell>
                        <TableCell>
                          {applianceState[0][appliance]["purchased_order"]}
                        </TableCell>
                        <TableCell>
                          {applianceState[0][appliance]["installed"]}
                        </TableCell>
                        <TableCell>
                          {applianceState[0][appliance]["serial_num"]}
                        </TableCell>
                        <TableCell>
                          {applianceState[0][appliance]["model_num"]}
                        </TableCell>
                        <TableCell>
                          {applianceState[0][appliance]["warranty_till"]}
                        </TableCell>
                        <TableCell>
                          {applianceState[0][appliance]["warranty_info"]}
                        </TableCell>

                        {applianceState[0][appliance]["images"] !== undefined &&
                        applianceState[0][appliance]["images"].length > 0 ? (
                          <TableCell>
                            <Row className="d-flex justify-content-center align-items-center p-1">
                              <Col className="d-flex justify-content-center align-items-center p-0 m-0">
                                <img
                                  key={Date.now()}
                                  src={`${
                                    applianceState[0][appliance]["images"][0]
                                  }?${Date.now()}`}
                                  style={{
                                    borderRadius: "4px",
                                    objectFit: "contain",
                                    width: "50px",
                                    height: "50px",
                                  }}
                                  alt="Property"
                                />
                              </Col>
                            </Row>
                          </TableCell>
                        ) : (
                          <TableCell>None</TableCell>
                        )}
                      </TableRow>
                    ) : (
                      ""
                    );
                  })}
                </TableBody>
              </Table> */}
              <Appliances
                applianceState={applianceState}
                appliances={appliances}
              />
            </div>
          </Row>
        </div>
      ) : (
        <div></div>
      )}

      <div
        className="mx-3 my-3 p-2"
        style={{
          background: "#E9E9E9 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        <PropertyUtilities state={utilityState} edit={edit} />
      </div>
      <div
        className="mx-3 my-3 p-2"
        style={{
          background: "#E9E9E9 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        <Container className="d-flex my-3 ps-4">
          <Col className="p-2">
            <h6>Pets Allowed</h6>
          </Col>
          <Col className="d-flex">
            <p className="p-2">No</p>
            <Switch
              checked={petsAllowed}
              onChange={
                edit
                  ? (e) => {
                      petsAllowed === 1
                        ? setPetsAllowed(false)
                        : setPetsAllowed(true);
                    }
                  : () => {
                      setShowDialog(true);
                    }
              }
              inputProps={{ "aria-label": "controlled" }}
            />
            <p className="p-2">Yes</p>
          </Col>
        </Container>
        <Container className="d-flex my-3 ps-4">
          <Col className="p-2">
            <h6>Deposit can be used for last month's rent</h6>
          </Col>
          <Col className="d-flex">
            <p className="p-2">No</p>
            <Switch
              checked={depositForRent}
              onChange={
                edit
                  ? (e) => {
                      depositForRent === 1
                        ? setDepositForRent(false)
                        : setDepositForRent(true);
                    }
                  : () => {
                      setShowDialog(true);
                    }
              }
              inputProps={{ "aria-label": "controlled" }}
            />{" "}
            <p className="p-2">Yes</p>
          </Col>
        </Container>

        {edit ? (
          <Container className="d-flex my-3 ps-4"></Container>
        ) : (
          <Container className="d-flex my-3 ps-4">
            <h6>Available to Rent</h6>
            <p> {property.available_to_rent === 1 ? "True" : "False"}</p>
          </Container>
        )}
        {edit ? (
          <Container className="d-flex my-3 ps-4"></Container>
        ) : (
          <Container className="d-flex my-3 ps-4">
            <h6> Featured</h6>
            <p> {property.featured}</p>
          </Container>
        )}
        {edit && property ? (
          <Container className="d-flex my-3 ps-4">
            <Col className="p-2">
              <h6> Delete Property</h6>
            </Col>

            <Col className="p-2">
              <img
                src={DeleteIcon}
                alt="Delete Icon"
                onClick={() => setShowDialogDelete(true)}
              />
            </Col>
          </Container>
        ) : (
          <Container className="d-flex my-3 ps-4"></Container>
        )}
      </div>
      {edit ? (
        <div>
          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <PropertyImages state={imageState} />
          </div>
          <div
            className="text-center"
            style={errorMessage === "" ? hidden : {}}
          >
            <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
          </div>
          {showSpinner ? (
            <div className="w-100 d-flex flex-column justify-content-center align-items-center">
              <ReactBootStrap.Spinner animation="border" role="status" />
            </div>
          ) : (
            ""
          )}
          <div className="text-center my-5">
            <Button
              variant="outline-primary"
              style={pillButton}
              className="mx-2"
              onClick={property ? () => setEdit(false) : props.cancel}
            >
              Cancel
            </Button>
            <Button
              variant="outline-primary"
              style={pillButton}
              onClick={submitForm}
              className="mx-2"
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default OwnerPropertyForm;
