import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import AppContext from "../AppContext";
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
} from "../utils/styles";
import { post, put } from "../utils/api";
import Heart from "../icons/Heart.svg";
import Edit from "../icons/Edit.svg";
import Checkbox from "./Checkbox";
import PropertyAppliances from "./PropertyAppliances";
import PropertyUtilities from "./PropertyUtilities";
import PropertyImages from "./PropertyImages";
import ArrowDown from "../icons/ArrowDown.svg";

function PropertyForm(props) {
  const { userData } = React.useContext(AppContext);
  const { user } = userData;
  const applianceState = React.useState({
    Microwave: {
      available: false,
      name: "",
      purchased: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
    },
    Dishwasher: {
      available: false,
      name: "",
      purchased: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
    },
    Refrigerator: {
      available: false,
      name: "",
      purchased: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
    },
    Washer: {
      available: false,
      name: "",
      purchased: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
    },
    Dryer: {
      available: false,
      name: "",
      purchased: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
    },
    Range: {
      available: false,
      name: "",
      purchased: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
    },
  });
  const utilityState = React.useState({
    Electricity: false,
    Trash: false,
    Water: false,
    Wifi: false,
    Gas: false,
  });
  const imageState = React.useState([]);
  const [address, setAddress] = React.useState("");
  const [unit, setUnit] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [zip, setZip] = React.useState("");
  const [type, setType] = React.useState("Apartment");
  const [numBeds, setNumBeds] = React.useState("");
  const [numBaths, setNumBaths] = React.useState("");
  const [area, setArea] = React.useState("");
  const [rent, setRent] = React.useState("");
  const [activeDate, setActiveDate] = React.useState("");

  const [deposit, setDeposit] = React.useState("");
  const [petsAllowed, setPetsAllowed] = React.useState(false);
  const [depositForRent, setDepositForRent] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const { property, edit, setEdit, hideEdit } = props;
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
    setDeposit(property.deposit);
    setPetsAllowed(property.pets_allowed);
    setDepositForRent(property.deposit_for_rent);
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
  React.useEffect(() => {
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
      deposit === ""
    ) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    const newProperty = {
      owner_id: user.user_uid,
      manager_id: "",
      active_date: activeDate,
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
    }
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
      const response = await post("/properties", newProperty, null, files);
    }
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

  console.log(activeDate);
  return (
    <div
      className="mx-2 p-2"
      style={{
        background: "#E9E9E9 0% 0% no-repeat padding-box",
        borderRadius: "10px",
        opacity: 1,
      }}
    >
      {edit ? (
        <div>
          <Form.Group className="mx-2 my-3">
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
          <div className="d-flex my-3">
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
            <Form.Group className="mx-2">
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
          </div>
          <div className="d-flex my-3">
            <Col>
              <Form.Group className="mx-2">
                <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                  State {state === "" ? required : ""}
                </Form.Label>
                {/* <Form.Select
                style={squareForm}
                onChange={(e) => setState(e.target.value)}
              >
                {stateList.map((list) => {
                  return <option value={list.abbreviation}>{list.name}</option>;
                })}
              </Form.Select> */}
                {/* <Form.Control
                style={squareForm}
                placeholder="CA"
                value={state}
                onChange={(e) => setState(e.target.value)}
              /> */}
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
        <div>
          <div className="d-flex justify-content-between">
            <h6 style={mediumBold}>Property Address</h6>
            {hideEdit ? (
              ""
            ) : (
              <img src={Edit} alt="Edit" onClick={() => setEdit(true)} />
            )}
          </div>
          <p>
            {address}
            {unit === "" ? "," : ` ${unit},`} {city}, {state}, {zip}
          </p>
        </div>
      )}
      {edit ? (
        <Form.Group className="mx-2 my-3">
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
      ) : (
        <div>
          <h6>Type</h6>
          <p>{type}</p>
        </div>
      )}
      {edit ? (
        <div className="d-flex my-3">
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
        </div>
      ) : (
        <Row>
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
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
            Active Date {activeDate === "" ? required : ""}
          </Form.Label>
          <Form.Control
            style={squareForm}
            type="date"
            // placeholder="2000"
            value={activeDate}
            onChange={(e) => setActiveDate(e.target.value)}
          />
        </Form.Group>
      ) : (
        <div>
          <h6>Active Date</h6>
          <p>{activeDate}</p>
        </div>
      )}
      {edit ? (
        <Form.Group className="mx-2 my-3">
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
      ) : (
        <div>
          <h6>Monthly Rent</h6>
          <p>{formatter.format(rent)}</p>
        </div>
      )}
      {edit ? (
        <Form.Group className="mx-2 my-3">
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
      ) : (
        <div>
          <h6>Deposit</h6>
          <p>{formatter.format(deposit)}</p>
        </div>
      )}
      <PropertyAppliances state={applianceState} edit={edit} />
      <PropertyUtilities state={utilityState} edit={edit} />
      <Container style={({ paddingLeft: "0px" }, mediumBold)} className="my-3">
        <h6>Pets Allowed</h6>
        <Row>
          <Col className="d-flex ps-4">
            <Checkbox
              type="CIRCLE"
              checked={petsAllowed}
              onClick={edit ? () => setPetsAllowed(true) : () => {}}
            />
            <p className="ms-1 mb-1">Yes</p>
          </Col>
          <Col className="d-flex ps-4">
            <Checkbox
              type="CIRCLE"
              checked={!petsAllowed}
              onClick={edit ? () => setPetsAllowed(false) : () => {}}
            />
            <p className="ms-1 mb-1">No</p>
          </Col>
        </Row>
      </Container>
      <Container style={({ paddingLeft: "0px" }, mediumBold)} className="my-3">
        <h6>Deposit can be used for last month's rent</h6>
        <Row>
          <Col className="d-flex ps-4">
            <Checkbox
              type="CIRCLE"
              checked={depositForRent}
              onClick={edit ? () => setDepositForRent(true) : () => {}}
            />
            <p className="ms-1 mb-1">Yes</p>
          </Col>
          <Col className="d-flex ps-4">
            <Checkbox
              type="CIRCLE"
              checked={!depositForRent}
              onClick={edit ? () => setDepositForRent(false) : () => {}}
            />
            <p className="ms-1 mb-1">No</p>
          </Col>
        </Row>
      </Container>
      {edit ? (
        <div>
          <PropertyImages state={imageState} />
          <div
            className="text-center"
            style={errorMessage === "" ? hidden : {}}
          >
            <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
          </div>
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

export default PropertyForm;
