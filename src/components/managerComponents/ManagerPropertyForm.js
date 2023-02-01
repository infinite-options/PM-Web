import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Switch } from "@material-ui/core";
import * as ReactBootStrap from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropertyAppliances from "../PropertyAppliances";
import PropertyUtilities from "../PropertyUtilities";
import PropertyImages from "../PropertyImages";
import ConfirmDialog2 from "../ConfirmDialog2";
import AppContext from "../../AppContext";
import Edit from "../../icons/Edit.svg";
import EditIconNew from "../../icons/EditIconNew.svg";
import {
  pillButton,
  squareForm,
  hidden,
  red,
  mediumBold,
  small,
} from "../../utils/styles";
import { post, put } from "../../utils/api";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});
function ManagerPropertyForm(props) {
  const { userData } = useContext(AppContext);
  const { user } = userData;
  const classes = useStyles();
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
  const [notes, setNotes] = useState("");
  const [deposit, setDeposit] = useState("");
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [depositForRent, setDepositForRent] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [availableToRent, setAvailableToRent] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const {
    property,
    edit,
    setEdit,
    hideEdit,
    editAppliances,
    setEditAppliances,
  } = props;
  const appliances = Object.keys(applianceState[0]);
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

    setFeatured(property.featured);
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
      pets_allowed: petsAllowed == true || petsAllowed == 1 ? "true" : "false",
      deposit_for_rent:
        depositForRent == true || depositForRent == 1 ? "true" : "false",
      available_to_rent:
        availableToRent == true || availableToRent == 1 ? "true" : "false",
      featured: featured,
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
    // console.log(newProperty);
    setShowSpinner(true);
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
          petsAllowed == true || petsAllowed == 1 ? "true" : "false",
        deposit_for_rent:
          depositForRent == true || depositForRent == 1 ? "true" : "false",
        available_to_rent:
          availableToRent == true || availableToRent == 1 ? "true" : "false",
        featured: featured,
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
      const response = await post("/properties", newProperty, null, files);
    }

    setShowSpinner(false);
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
  return editAppliances ? (
    <div className="d-flex flex-column w-100 overflow-hidden p-2">
      <div
        className="mx-3 my-3 p-0"
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
    <div className="d-flex flex-column w-100 overflow-hidden p-2">
      <ConfirmDialog2
        title={"Can't edit here. Click on the edit icon to make any changes"}
        isOpen={showDialog}
        onConfirm={onConfirm}
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
            <Form.Group className="mx-2 my-3">
              <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                Address {required}
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex my-3">
              <Col>
                <Form.Group className="mx-2">
                  <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                    Unit
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mx-2">
                  <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                    City {required}
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </div>
            <div className="d-flex my-3">
              <Col>
                <Form.Group className="mx-2">
                  <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                    State {required}
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mx-2">
                  <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                    Zip Code {required}
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="zipcode"
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
            <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
              Notes
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="Describe the property"
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
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
              Type {required}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="Property Type"
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
              <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                Bedroom {required}
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder="# of beds"
                value={numBeds}
                onChange={(e) => setNumBeds(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mx-2">
              <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                Bath {required}
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder="# of baths"
                value={numBaths}
                onChange={(e) => setNumBaths(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mx-2">
              <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
                Sq. Ft. {required}
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder="sqft"
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
            <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
              Monthly Rent {required}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="rent($)"
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
            <Form.Label as="h6" className="mb-0 ms-2" style={mediumBold}>
              Deposit {required}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="deposit($)"
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
      </div>
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
            <Table
              responsive="md"
              classes={{ root: classes.customTable }}
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Appliance</TableCell>
                  <TableCell>Name</TableCell>
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
                  return applianceState[0][appliance]["available"] == true ||
                    applianceState[0][appliance]["available"] == "True" ? (
                    <TableRow>
                      <TableCell>{appliance}</TableCell>
                      <TableCell>
                        {applianceState[0][appliance]["name"]}
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
                            <Col className="d-flex justify-content-center align-items-center">
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
            </Table>
          </div>
        </Row>
      </div>
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
        <Container className="d-flex my-3 ">
          <Col>
            <h6>Pets Allowed</h6>
          </Col>
          <Col className="d-flex">
            <p>No</p>
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
            <p>Yes</p>
          </Col>
        </Container>
        <Container className="d-flex my-3 ">
          <Col>
            <h6>Deposit can be used for last month's rent</h6>
          </Col>
          <Col className="d-flex">
            <p>No</p>
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
            />{" "}
            <p>Yes</p>
          </Col>
        </Container>

        <Container className="d-flex my-3 ">
          <Col>
            <h6>Available to Rent</h6>
          </Col>

          <Col className="d-flex">
            <p>No</p>
            <Switch
              checked={availableToRent}
              onChange={
                edit
                  ? (e) => {
                      availableToRent == 1
                        ? setAvailableToRent(false)
                        : setAvailableToRent(true);
                    }
                  : () => {
                      setShowDialog(true);
                    }
              }
              inputProps={{ "aria-label": "controlled" }}
            />{" "}
            <p>Yes</p>
          </Col>
        </Container>

        <Container className="d-flex my-3 ">
          <Col>
            <h6>Featured</h6>
          </Col>

          <Col className="d-flex">
            <p>No</p>
            <Switch
              checked={featured == true || featured == "True"}
              onChange={(event) => setFeatured(event.target.checked)}
              inputProps={{ "aria-label": "controlled" }}
            />{" "}
            <p>Yes</p>
          </Col>
        </Container>
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
