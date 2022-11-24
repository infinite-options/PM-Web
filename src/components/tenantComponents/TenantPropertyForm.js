import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Switch } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import * as ReactBootStrap from "react-bootstrap";
import ConfirmDialog2 from "../ConfirmDialog2";
import PropertyAppliances from "../PropertyAppliances";
import PropertyUtilities from "../PropertyUtilities";
import PropertyImages from "../PropertyImages";
import Edit from "../../icons/Edit.svg";
import ArrowDown from "../../icons/ArrowDown.svg";
import AppContext from "../../AppContext";
import {
  pillButton,
  squareForm,
  hidden,
  red,
  small,
  mediumBold,
} from "../../utils/styles";
import { post, put } from "../../utils/api";

function TenantPropertyForm(props) {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const { user } = userData;
  const applianceState = useState({
    Microwave: {
      available: false,
      name: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
    },
    Dishwasher: {
      available: false,
      name: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
    },
    Refrigerator: {
      available: false,
      name: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
    },
    Washer: {
      available: false,
      name: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
    },
    Dryer: {
      available: false,
      name: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
    },
    Range: {
      available: false,
      name: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
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
  const [deposit, setDeposit] = useState("");
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [depositForRent, setDepositForRent] = useState(false);
  const [availableToRent, setAvailableToRent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showDialog2, setShowDialog2] = useState(false);
  const { property, edit, setEdit, hideEdit } = props;
  const [showSpinner, setShowSpinner] = useState(false);

  const onConfirm = () => {
    setShowDialog(false);
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
      pets_allowed: petsAllowed,
      deposit_for_rent: depositForRent,
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
      console.log(newProperty[key]);
    }
    console.log(files);
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
        pets_allowed: petsAllowed,
        deposit_for_rent: depositForRent,
      };
      const files = imageState[0];
      console.log(files, imageState);
      let i = 0;
      for (const file of imageState[0]) {
        let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
        if (file.file !== null) {
          newProperty[key] = file.file;
        } else {
          newProperty[key] = file.image;
        }
        console.log(newProperty[key]);
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

  return (
    <div className="d-flex flex-column w-100 overflow-hidden p-2">
      <ConfirmDialog2
        title={"Can't edit here. Click on the edit icon to make any changes"}
        isOpen={showDialog}
        onConfirm={onConfirm}
      />
      {edit ? (
        <div className="d-flex flex-column w-100">
          <Form.Group className="mx-2 my-3 ps-4">
            <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
              Address {address === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="283 Barley St"
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
                  placeholder="#122"
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
                  placeholder="San Jose"
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
                  placeholder="90808"
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
        <div className="d-flex my-3 ps-4">
          <Col>
            <Form.Group className="mx-2">
              <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                Type
              </Form.Label>
              <Form.Select
                style={{ ...squareForm, backgroundImage: `url(${ArrowDown})` }}
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
                placeholder="2"
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
                placeholder="1.5"
                value={numBaths}
                onChange={(e) => setNumBaths(e.target.value)}
              />
            </Form.Group>
          </Col>{" "}
          <Col>
            <Form.Group className="mx-2">
              <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                Sq. Ft. {area === "" ? required : ""}
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder="1100"
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
                placeholder="2000"
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
                placeholder="2000"
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
      <div className="d-flex my-3 ps-4">
        <PropertyAppliances
          state={applianceState}
          property={property}
          edit={edit}
        />
      </div>

      <div className="d-flex my-3 ps-4">
        {" "}
        <PropertyUtilities state={utilityState} edit={edit} />
      </div>

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
                    petsAllowed == 1
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
                    depositForRent == 1
                      ? setDepositForRent(false)
                      : setDepositForRent(true);
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

      {edit ? (
        <div className="my-3 ps-4">
          <PropertyImages state={imageState} />
          {console.log("imageState", imageState)}
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
              onClick={
                property
                  ? () => {
                      props.onSubmit();
                    }
                  : props.cancel
              }
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

export default TenantPropertyForm;
