import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Checkbox from "../Checkbox";
import PropertyAppliances from "../PropertyAppliances";
import PropertyUtilities from "../PropertyUtilities";
import PropertyImages from "../PropertyImages";
import ConfirmDialog2 from "../ConfirmDialog2";
import AppContext from "../../AppContext";
import Heart from "../../icons/Heart.svg";
import Edit from "../../icons/Edit.svg";
import {
  pillButton,
  squareForm,
  tileImg,
  xSmall,
  bold,
  hidden,
  red,
  mediumBold,
  smallImg,
  small,
} from "../../utils/styles";
import { post, put } from "../../utils/api";

function ManagerPropertyForm(props) {
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
  const [type, setType] = useState("");
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

  const { property, edit, setEdit, hideEdit } = props;
  console.log(hideEdit);
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

  const onConfirm = () => {
    setShowDialog(false);
  };

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
      // appliances: JSON.stringify(applianceState[0]),
      utilities: JSON.stringify(utilityState[0]),
      // pets_allowed: petsAllowed,
      // deposit_for_rent: depositForRent
      pets_allowed: petsAllowed ? 1 : 0,
      deposit_for_rent: depositForRent ? 1 : 0,
      available_to_rent: availableToRent ? 1 : 0,
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
      // console.log(newProperty)
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
        available_to_rent: availableToRent,
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
      const response = await post("/properties", newProperty, null, files);
    }
    setEdit(false);
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
    <div className="d-flex flex-column w-100 mx-2 p-2 m-0">
      <ConfirmDialog2
        title={"Can't edit here. Click on the edit icon to make any changes"}
        isOpen={showDialog}
        onConfirm={onConfirm}
      />
      {edit ? (
        <div className="d-flex flex-column w-100">
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Address {required}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="283 Barley St"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex my-3">
            <Col>
              <Form.Group className="mx-2">
                <Form.Label as="h6" className="mb-0 ms-2">
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
              <Form.Group className="mx-2">
                <Form.Label as="h6" className="mb-0 ms-2">
                  City {required}
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
          <div className="d-flex my-3">
            <Col>
              <Form.Group className="mx-2">
                <Form.Label as="h6" className="mb-0 ms-2">
                  State {required}
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  placeholder="CA"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mx-2">
                <Form.Label as="h6" className="mb-0 ms-2">
                  Zip Code {required}
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
        <Row className="mx-2">
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
        <Form.Group className="mx-2 my-3">
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
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Type {required}
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="Apartment"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </Form.Group>
      ) : (
        <Row className="mx-2">
          <h6>Type</h6>
          <p>{type}</p>
        </Row>
      )}
      {edit ? (
        <div className="d-flex my-3">
          <Form.Group className="mx-2">
            <Form.Label as="h6" className="mb-0 ms-2">
              Bedroom {required}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="2"
              value={numBeds}
              onChange={(e) => setNumBeds(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mx-2">
            <Form.Label as="h6" className="mb-0 ms-2">
              Bath {required}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="1.5"
              value={numBaths}
              onChange={(e) => setNumBaths(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mx-2">
            <Form.Label as="h6" className="mb-0 ms-2">
              Sq. Ft. {required}
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
        <Row className="mx-2">
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
        <Row className="mx-2">
          <h6>Active Date</h6>
          <p>{activeDate}</p>
        </Row>
      )}
      {edit ? (
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Monthly Rent {required}
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="2000"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
          />
        </Form.Group>
      ) : (
        <Row className="mx-2">
          <h6>Monthly Rent</h6>
          <p>{formatter.format(rent)}</p>
        </Row>
      )}
      {edit ? (
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Deposit {required}
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="2000"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
          />
        </Form.Group>
      ) : (
        <Row className="mx-2">
          <h6>Deposit</h6>
          <p>{formatter.format(deposit)}</p>
        </Row>
      )}
      <PropertyAppliances
        state={applianceState}
        property={property}
        edit={edit}
      />
      <PropertyUtilities state={utilityState} edit={edit} />
      <Container className="my-3">
        <h6>Pets Allowed</h6>
        <Row>
          <Col className="d-flex ps-4">
            <Checkbox
              type="CIRCLE"
              checked={petsAllowed}
              onClick={
                edit
                  ? () => setPetsAllowed(true)
                  : () => {
                      setShowDialog(true);
                    }
              }
            />
            <p className="ms-1 mb-1">Yes</p>
          </Col>
          <Col className="d-flex ps-4">
            <Checkbox
              type="CIRCLE"
              checked={!petsAllowed}
              onClick={
                edit
                  ? () => setPetsAllowed(false)
                  : () => {
                      setShowDialog(true);
                    }
              }
            />
            <p className="ms-1 mb-1">No</p>
          </Col>
        </Row>
      </Container>
      <Container className="my-3">
        <h6>Deposit can be used for last month's rent</h6>
        <Row>
          <Col className="d-flex ps-4">
            <Checkbox
              type="CIRCLE"
              checked={depositForRent}
              onClick={
                edit
                  ? () => setDepositForRent(true)
                  : () => {
                      setShowDialog(true);
                    }
              }
            />
            <p className="ms-1 mb-1">Yes</p>
          </Col>
          <Col className="d-flex ps-4">
            <Checkbox
              type="CIRCLE"
              checked={!depositForRent}
              onClick={
                edit
                  ? () => setDepositForRent(false)
                  : () => {
                      setShowDialog(true);
                    }
              }
            />
            <p className="ms-1 mb-1">No</p>
          </Col>
        </Row>
      </Container>

      {edit ? (
        <Container
          style={({ paddingLeft: "0px" }, mediumBold)}
          className="my-3"
        >
          <h6>Available to Rent</h6>
          <Row>
            <Col className="d-flex ps-4">
              <Checkbox
                type="CIRCLE"
                checked={availableToRent}
                onClick={
                  edit
                    ? () => setAvailableToRent(true)
                    : () => {
                        setShowDialog(true);
                      }
                }
              />
              <p className="ms-1 mb-1">Yes</p>
            </Col>
            <Col className="d-flex ps-4">
              <Checkbox
                type="CIRCLE"
                checked={!availableToRent}
                onClick={
                  edit
                    ? () => setAvailableToRent(false)
                    : () => {
                        setShowDialog(true);
                      }
                }
              />
              <p className="ms-1 mb-1">No</p>
            </Col>
          </Row>
        </Container>
      ) : (
        <Container className="my-3">
          <h6>Available to Rent</h6>
          <Row>
            <Col className="d-flex ps-4">
              <Checkbox
                type="CIRCLE"
                checked={availableToRent}
                onClick={
                  edit
                    ? () => setAvailableToRent(true)
                    : () => {
                        setShowDialog(true);
                      }
                }
              />
              <p className="ms-1 mb-1">Yes</p>
            </Col>
            <Col className="d-flex ps-4">
              <Checkbox
                type="CIRCLE"
                checked={!availableToRent}
                onClick={
                  edit
                    ? () => setAvailableToRent(false)
                    : () => {
                        setShowDialog(true);
                      }
                }
              />
              <p className="ms-1 mb-1">No</p>
            </Col>
          </Row>
        </Container>
      )}
      {edit ? (
        <Container
          style={({ paddingLeft: "0px" }, mediumBold)}
          className="my-3"
        >
          <h6> Featured</h6>
          <p> {property.featured}</p>
        </Container>
      ) : (
        <Container
          style={({ paddingLeft: "0px" }, mediumBold)}
          className="my-3"
        >
          <h6> Featured</h6>
          <p> {property.featured}</p>
        </Container>
      )}
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

export default ManagerPropertyForm;
