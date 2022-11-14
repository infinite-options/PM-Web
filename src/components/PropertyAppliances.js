import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Checkbox from "./Checkbox";
import ApplianceImages from "./ApplianceImages";
import ConfirmDialog from "../components/ConfirmDialog";
import AddIcon from "../icons/AddIcon.svg";
import MinusIcon from "../icons/MinusIcon.svg";
import { Container, Form, Button, Row, Col, Table } from "react-bootstrap";
import {
  squareForm,
  pillButton,
  blue,
  hidden,
  mediumBold,
  bluePillButton,
  subHeading,
} from "../utils/styles";
import { put } from "../utils/api";

function PropertyAppliances(props) {
  const navigate = useNavigate();
  const { state, edit, property } = props;
  const [applianceRem, setApplianceRem] = useState("");
  const [applianceState, setApplianceState] = state;
  const appliances = Object.keys(applianceState);
  const og_appliances = [
    "Dryer",
    "Range",
    "Washer",
    "Microwave",
    "Dishwasher",
    "Refrigerator",
  ];
  console.log(props);
  console.log(appliances);
  const [showDialog, setShowDialog] = useState(false);
  const [hide, setHide] = useState(false);
  const [removedApps, setRemovedApps] = useState([]);
  const [newAppliance, setNewAppliance] = useState(null);
  const [applianceType, setApplianceType] = useState(null);
  const [applianceName, setApplianceName] = useState(null);
  const [applianceModelNum, setApplianceModelNum] = useState(null);
  const [applianceSerialNum, setApplianceSerialNum] = useState(null);
  const [appliancePurchasedOn, setAppliancePurchasedOn] = useState(null);
  const [appliancePurchasedFrom, setAppliancePurchasedFrom] = useState(null);
  const [appliancePurchasesOrderNumber, setAppliancePurchasesOrderNumber] =
    useState(null);
  const [applianceInstalledOn, setApplianceInstalledOn] = useState(null);
  const [applianceWarrantyTill, setApplianceWarrantyTill] = useState(null);
  const [applianceWarrantyInfo, setApplianceWarrantyInfo] = useState(null);
  const [applianceImages, setApplianceImages] = useState(null);

  const [currentImg, setCurrentImg] = useState(0);
  const imageState = useState([]);
  const [addApplianceInfo, setAddApplianceInfo] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDetailsNoEdit, setShowDetailsNoEdit] = useState(false);
  const [tableView, setTableView] = useState(false);
  const [currentAppliance, setCurrentAppliance] = useState([]);
  const toggleAppliance = (appliance) => {
    const newApplianceState = { ...applianceState };
    // console.log(newApplianceState);
    newApplianceState[appliance]["available"] =
      !newApplianceState[appliance]["available"];
    // console.log(newApplianceState);
    // setAddApplianceInfo(true);
    // setShowDetails(true);
    setApplianceType(appliance);
    setApplianceState(newApplianceState);
  };

  const showApplianceDetail = (appliance) => {
    setApplianceType(appliance);
    setShowDetails(!showDetails);
    setAddApplianceInfo(!addApplianceInfo);
    setApplianceType(appliance);
    setApplianceState(applianceState);
    setApplianceName(applianceState[appliance]["name"]);
    setAppliancePurchasedOn(applianceState[appliance]["purchased"]);
    setAppliancePurchasedFrom(applianceState[appliance]["purchased_from"]);
    setAppliancePurchasesOrderNumber(
      applianceState[appliance]["purchased_order"]
    );
    setApplianceInstalledOn(applianceState[appliance]["installed"]);
    setApplianceSerialNum(applianceState[appliance]["serial_num"]);
    setApplianceModelNum(applianceState[appliance]["model_num"]);
    setApplianceWarrantyTill(applianceState[appliance]["warranty_till"]);
    setApplianceWarrantyInfo(applianceState[appliance]["warranty_info"]);
    if (applianceState[appliance]["images"] !== undefined) {
      const files = [];
      setApplianceImages(applianceState[appliance]["images"]);
      const images = applianceState[appliance]["images"];
      for (let i = 0; i < images.length; i++) {
        files.push({
          index: i,
          image: images[i],
          file: null,
          coverPhoto: i === 0,
        });
      }
      imageState[1](files);
    }

    // setApplianceImages(applianceState[appliance]["images"]);
  };

  const onCancel = () => {
    setShowDialog(false);
  };
  const removeappliance = async (app) => {
    let rem_app = {
      property_uid: property.property_uid,
      appliance: applianceRem,
    };
    let i = 0;
    let files = imageState[0];
    for (const file of imageState[0]) {
      let key = `img_${app}_${i++}`;
      console.log(key);
      if (file.file !== null) {
        rem_app[key] = file.file;
      } else {
        rem_app[key] = file.image;
      }
    }
    const response = await put("/RemoveAppliance", rem_app, null, files);

    setShowDialog(false);
  };
  const showApplianceDetailNoEdit = (appliance, x) => {
    console.log(x);
    console.log(currentAppliance);
    if (currentAppliance.includes(x)) {
      console.log("in if");
      if (currentAppliance.length === 1) {
        let ap = [];
        console.log(ap);
        setCurrentAppliance(ap);
      } else {
        let ap = currentAppliance.filter((item) => item !== x);
        console.log(ap);
        setCurrentAppliance(ap);
      }
    } else {
      console.log("in else");
      let ap = currentAppliance.filter((item, i) => item !== x);
      console.log(ap);
      ap.push(x);
      console.log(ap);
      setCurrentAppliance(ap);
    }
    setApplianceType(appliance);
    setShowDetailsNoEdit(true);
    setAddApplianceInfo(true);
    setApplianceType(appliance);
    setApplianceState(applianceState);
    setApplianceName(applianceState[appliance]["name"]);
    setAppliancePurchasedOn(applianceState[appliance]["purchased"]);
    setAppliancePurchasedFrom(applianceState[appliance]["purchased_from"]);
    setAppliancePurchasesOrderNumber(
      applianceState[appliance]["purchased_order"]
    );
    setApplianceInstalledOn(applianceState[appliance]["installed"]);
    setApplianceSerialNum(applianceState[appliance]["serial_num"]);
    setApplianceModelNum(applianceState[appliance]["model_num"]);
    setApplianceWarrantyTill(applianceState[appliance]["warranty_till"]);
    setApplianceWarrantyInfo(applianceState[appliance]["warranty_info"]);

    if (applianceState[appliance]["images"] !== undefined) {
      const files = [];
      setApplianceImages(applianceState[appliance]["images"]);
      const images = applianceState[appliance]["images"];
      for (let i = 0; i < images.length; i++) {
        files.push({
          index: i,
          image: images[i],
          file: null,
          coverPhoto: i === 0,
        });
      }
      imageState[1](files);
    }
  };
  const nextImg = (api) => {
    console.log(api);
    if (currentImg === api.length - 1) {
      setCurrentImg(0);
    } else {
      setCurrentImg(currentImg + 1);
    }
    console.log(currentImg);
  };
  const previousImg = (api) => {
    console.log(api);
    if (currentImg === 0) {
      setCurrentImg(api.length - 1);
    } else {
      setCurrentImg(currentImg - 1);
    }
    console.log(currentImg);
  };
  const Capitalize = (str) => {
    console.log(typeof str);
    return (
      str.toString().charAt(0).toUpperCase() +
      str.toString().slice(1).toLowerCase()
    );
  };

  const toggleList = (x) => {
    console.log(x);
    console.log(currentAppliance);
    if (currentAppliance.includes(x)) {
      console.log("in if");
      if (currentAppliance.length === 1) {
        let ap = [];
        console.log(ap);
        setCurrentAppliance(ap);
      } else {
        let ap = currentAppliance.filter((item) => item !== x);
        console.log(ap);
        setCurrentAppliance(ap);
      }
    } else {
      console.log("in else");
      let ap = currentAppliance.filter((item, i) => item !== x);
      console.log(ap);
      ap.push(x);
      console.log(ap);
      setCurrentAppliance(ap);
    }
  };

  const updateAppliance = async (appliance) => {
    const newApplianceState = { ...applianceState };
    console.log(newApplianceState);
    newApplianceState[appliance]["available"] = Capitalize(
      newApplianceState[appliance]["available"]
    );
    newApplianceState[appliance]["model_num"] = applianceModelNum;
    newApplianceState[appliance]["name"] = applianceName;
    newApplianceState[appliance]["purchased"] = appliancePurchasedOn;
    newApplianceState[appliance]["purchased_from"] = appliancePurchasedFrom;
    newApplianceState[appliance]["purchased_order"] =
      appliancePurchasesOrderNumber;
    newApplianceState[appliance]["installed"] = applianceInstalledOn;
    newApplianceState[appliance]["serial_num"] = applianceSerialNum;
    newApplianceState[appliance]["warranty_info"] = applianceWarrantyInfo;
    newApplianceState[appliance]["warranty_till"] = applianceWarrantyTill;
    if (imageState[0].length === 0) {
      newApplianceState[appliance]["images"] = imageState[0];
    }

    console.log(newApplianceState[appliance]);
    if (property) {
      let newProperty = {
        property_uid: property.property_uid,
        appliances: JSON.stringify({
          [appliance]: newApplianceState[appliance],
        }),
      };
      let i = 0;
      let files = imageState[0];
      for (const file of imageState[0]) {
        let key = `img_${appliance}_${i++}`;
        console.log(key);
        if (file.file !== null) {
          newProperty[key] = file.file;
        } else {
          newProperty[key] = file.image;
        }
      }

      console.log(newProperty);
      const response = await put("/appliances", newProperty, null, files);
    }

    setAddApplianceInfo(false);
    setShowDetails(false);
    setApplianceState(newApplianceState);
    imageState[0] = [];
    setApplianceName("");
    setAppliancePurchasedOn("");
    setAppliancePurchasesOrderNumber("");
    setAppliancePurchasedFrom("");
    setApplianceInstalledOn("");
    setApplianceSerialNum("");
    setApplianceModelNum("");
    setApplianceWarrantyTill("");
    setApplianceWarrantyInfo("");
    setApplianceType("");
  };

  const cancelAppliance = (appliance) => {
    const newApplianceState = { ...applianceState };
    console.log(newApplianceState);
    // newApplianceState[appliance]["available"] = false;
    console.log(newApplianceState);
    console.log(imageState);
    imageState[0] = [];
    console.log(imageState);
    setAddApplianceInfo(false);
    setShowDetails(false);
    setApplianceState(newApplianceState);
    setApplianceName("");
    setAppliancePurchasedOn("");
    setAppliancePurchasedFrom("");
    setAppliancePurchasesOrderNumber("");
    setApplianceInstalledOn("");
    setApplianceSerialNum("");
    setApplianceModelNum("");
    setApplianceWarrantyTill("");
    setApplianceWarrantyInfo("");
    setApplianceType("");
    setApplianceImages("");
  };

  const addAppliance = async () => {
    const newApplianceState = { ...applianceState };
    console.log(newApplianceState[newAppliance]);
    newApplianceState[newAppliance] = {};
    newApplianceState[newAppliance]["available"] = "True";
    newApplianceState[newAppliance]["model_num"] =
      applianceModelNum == null ? "" : applianceModelNum;
    newApplianceState[newAppliance]["name"] =
      applianceName == null ? "" : applianceName;
    newApplianceState[newAppliance]["purchased"] =
      appliancePurchasedOn == null ? "" : appliancePurchasedOn;
    newApplianceState[newAppliance]["purchased_from"] =
      appliancePurchasedFrom == null ? "" : appliancePurchasedFrom;
    newApplianceState[newAppliance]["purchased_order"] =
      appliancePurchasesOrderNumber == null
        ? ""
        : appliancePurchasesOrderNumber;
    newApplianceState[newAppliance]["installed"] =
      applianceInstalledOn == null ? "" : applianceInstalledOn;
    newApplianceState[newAppliance]["serial_num"] =
      applianceSerialNum == null ? "" : applianceSerialNum;
    newApplianceState[newAppliance]["warranty_info"] =
      applianceWarrantyInfo == null ? "" : applianceWarrantyInfo;
    newApplianceState[newAppliance]["warranty_till"] =
      applianceWarrantyTill == null ? "" : applianceWarrantyTill;
    setApplianceState(newApplianceState);
    if (property) {
      let newProperty = {
        property_uid: property.property_uid,
        appliances: JSON.stringify({
          [newAppliance]: newApplianceState[newAppliance],
        }),
      };
      let i = 0;
      let files = imageState[0];
      for (const file of imageState[0]) {
        let key = file.coverPhoto
          ? `img_${newAppliance}_${i++}`
          : `img_${newAppliance}_${i++}`;
        console.log(key);
        if (file.file !== null) {
          newProperty[key] = file.file;
        } else {
          newProperty[key] = file.image;
        }
      }
      console.log(newApplianceState);

      console.log(newProperty);
      const response = await put("/appliances", newProperty, null, files);
    }
    imageState[0] = [];
    console.log(newApplianceState);
    setNewAppliance(null);
    setApplianceName("");
    setAppliancePurchasedOn("");
    setAppliancePurchasedFrom("");
    setAppliancePurchasesOrderNumber("");
    setApplianceSerialNum("");
    setApplianceModelNum("");
    setApplianceWarrantyTill("");
    setApplianceWarrantyInfo("");
    setApplianceType("");
  };

  return (
    <Container style={({ padding: "0px" }, mediumBold)} className="my-4">
      <ConfirmDialog
        title={"Are you sure you want to delete this appliance?"}
        isOpen={showDialog}
        onConfirm={removeappliance}
        onCancel={onCancel}
      />
      <Row className="d-flex">
        <Col className="d-flex">
          <h6 style={mediumBold} className="mt-2">
            Appliances
          </h6>
        </Col>
        <Col>
          {newAppliance === null ? (
            <img
              src={AddIcon}
              onClick={() => setNewAppliance("")}
              style={{
                width: "15px",
                height: "15px",
                float: "right",
                marginRight: "5rem",
              }}
            />
          ) : (
            ""
          )}
        </Col>
        {!edit ? (
          <Col className="d-flex justify-content-end mb-1">
            <Button
              style={bluePillButton}
              onClick={() => {
                setTableView(!tableView);
                setApplianceType("");
                setApplianceName("");
                setAppliancePurchasedFrom("");
                setAppliancePurchasesOrderNumber("");
                setAppliancePurchasedOn("");
                setApplianceSerialNum("");
                setApplianceModelNum("");
                setApplianceWarrantyTill("");
                setApplianceWarrantyInfo("");
                setApplianceType("");
              }}
            >
              {!tableView ? "Table View" : "List View"}
            </Button>
          </Col>
        ) : (
          ""
        )}
      </Row>
      <Row className="d-flex flex-column justify-content-left">
        {!tableView &&
          appliances.map((appliance, i) => (
            <Row className="d-flex flex-column ps-2 align-items-center" key={i}>
              <Row>
                <Col xs={1}>
                  <Checkbox
                    type="BOX"
                    checked={applianceState[appliance]["available"]}
                    onClick={edit ? () => toggleAppliance(appliance) : () => {}}
                  />
                </Col>
                <Col
                  style={{ cursor: "pointer" }}
                  onClick={
                    edit
                      ? () => {
                          showApplianceDetail(appliance);
                        }
                      : () => {
                          showApplianceDetailNoEdit(appliance, i);
                          // toggleList(i);
                        }
                  }
                >
                  <p className="ms-1 mb-1">{appliance}</p>
                </Col>
                <Col>
                  {!og_appliances.includes(appliance) ? (
                    <img
                      src={MinusIcon}
                      onClick={() => {
                        setShowDialog(true);
                        setApplianceRem(appliance);
                      }}
                      style={{
                        width: "15px",
                        height: "15px",
                        float: "right",
                        marginRight: "5rem",
                      }}
                    />
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
              <Row>
                {addApplianceInfo &&
                showDetails &&
                applianceState[appliance]["available"] == true &&
                applianceType == appliance ? (
                  <Row>
                    <Row className="mx-4 p-0">
                      <Col>Name</Col>
                      <Col>
                        <Form.Control
                          style={squareForm}
                          type="text"
                          value={
                            applianceName || applianceState[appliance]["name"]
                          }
                          placeholder="Appliance Name"
                          onChange={(e) => setApplianceName(e.target.value)}
                        />
                      </Col>
                    </Row>
                    <Row className="mx-4 mt-1 p-0">
                      <Col>Purchased From</Col>
                      <Col>
                        <Form.Control
                          style={squareForm}
                          value={
                            appliancePurchasedFrom ||
                            applianceState[appliance]["purchased_from"]
                          }
                          placeholder="Purchased From"
                          onChange={(e) =>
                            setAppliancePurchasedFrom(e.target.value)
                          }
                        />
                      </Col>
                    </Row>
                    <Row className="mx-4 mt-1 p-0">
                      <Col>Purchased On</Col>
                      <Col>
                        <Form.Control
                          style={squareForm}
                          type="date"
                          value={
                            appliancePurchasedOn ||
                            applianceState[appliance]["purchased"]
                          }
                          onChange={(e) =>
                            setAppliancePurchasedOn(e.target.value)
                          }
                        />
                      </Col>
                    </Row>
                    <Row className="mx-4 mt-1 p-0">
                      <Col>Purchase Order Number</Col>
                      <Col>
                        <Form.Control
                          style={squareForm}
                          value={
                            appliancePurchasesOrderNumber ||
                            applianceState[appliance]["purchased_order"]
                          }
                          placeholder="Purchase Order Number"
                          onChange={(e) =>
                            setAppliancePurchasesOrderNumber(e.target.value)
                          }
                        />
                      </Col>
                    </Row>
                    <Row className="mx-4 mt-1 p-0">
                      <Col>Installed On</Col>
                      <Col>
                        <Form.Control
                          style={squareForm}
                          type="date"
                          value={
                            applianceInstalledOn ||
                            applianceState[appliance]["installed"]
                          }
                          onChange={(e) =>
                            setApplianceInstalledOn(e.target.value)
                          }
                        />
                      </Col>
                    </Row>
                    <Row className="mx-4 mt-1 p-0">
                      <Col>Serial Number</Col>
                      <Col>
                        <Form.Control
                          style={squareForm}
                          value={
                            applianceSerialNum ||
                            applianceState[appliance]["serial_num"]
                          }
                          placeholder="Serial Number"
                          onChange={(e) =>
                            setApplianceSerialNum(e.target.value)
                          }
                        />
                      </Col>
                    </Row>
                    <Row className="mx-4 mt-1 p-0">
                      <Col>Model Number</Col>
                      <Col>
                        <Form.Control
                          style={squareForm}
                          value={
                            applianceModelNum ||
                            applianceState[appliance]["model_num"]
                          }
                          placeholder="Model Number"
                          onChange={(e) => setApplianceModelNum(e.target.value)}
                        />
                      </Col>
                    </Row>
                    <Row className="mx-4 mt-1 p-0">
                      <Col>Warranty Till</Col>
                      <Col>
                        <Form.Control
                          style={squareForm}
                          type="date"
                          value={
                            applianceWarrantyTill ||
                            applianceState[appliance]["warranty_till"]
                          }
                          onChange={(e) =>
                            setApplianceWarrantyTill(e.target.value)
                          }
                        />
                      </Col>
                    </Row>
                    <Row className="mx-4 mt-1 p-0">
                      <Col>Warranty Info</Col>
                      <Col>
                        <Form.Control
                          style={squareForm}
                          value={
                            applianceWarrantyInfo ||
                            applianceState[appliance]["warranty_info"]
                          }
                          placeholder="Warranty Info"
                          onChange={(e) =>
                            setApplianceWarrantyInfo(e.target.value)
                          }
                        />
                      </Col>
                    </Row>
                    {property ? <ApplianceImages state={imageState} /> : ""}

                    <div className="text-center my-3">
                      <Button
                        variant="outline-primary"
                        style={pillButton}
                        className="mx-2"
                        onClick={() => cancelAppliance(appliance)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outline-primary"
                        style={pillButton}
                        className="mx-2"
                        onClick={
                          edit ? () => updateAppliance(appliance) : () => {}
                        }
                      >
                        Save
                      </Button>
                    </div>
                  </Row>
                ) : null}
              </Row>
              <Row>
                {addApplianceInfo &&
                !tableView &&
                currentAppliance.includes(i) &&
                showDetailsNoEdit &&
                applianceState[appliance]["available"] == true ? (
                  <Row>
                    <Row className="mx-2 p-0">
                      <Col>Name</Col>
                      <Col className="d-flex justify-content-end">
                        <p>{applianceState[appliance]["name"]}</p>
                      </Col>
                    </Row>
                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Purchased From</Col>
                      <Col className="d-flex justify-content-end">
                        <p>{applianceState[appliance]["purchased_from"]}</p>
                      </Col>
                    </Row>
                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Purchased On</Col>
                      <Col className="d-flex justify-content-end">
                        <p>{applianceState[appliance]["purchased"]}</p>
                      </Col>
                    </Row>
                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Purchase Order Number</Col>
                      <Col className="d-flex justify-content-end">
                        <p>{applianceState[appliance]["purchased_order"]}</p>
                      </Col>
                    </Row>

                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Installed On</Col>
                      <Col className="d-flex justify-content-end">
                        <p>{applianceState[appliance]["installed"]}</p>
                      </Col>
                    </Row>

                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Serial Number</Col>
                      <Col className="d-flex justify-content-end">
                        <p>{applianceState[appliance]["serial_num"]}</p>
                      </Col>
                    </Row>

                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Model Number</Col>
                      <Col className="d-flex justify-content-end">
                        <p>{applianceState[appliance]["model_num"]}</p>
                      </Col>
                    </Row>

                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Warranty Till</Col>
                      <Col className="d-flex justify-content-end">
                        <p>{applianceState[appliance]["warranty_till"]}</p>
                      </Col>
                    </Row>

                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Warranty Info</Col>
                      <Col className="d-flex justify-content-end">
                        <p>{applianceState[appliance]["warranty_info"]}</p>
                      </Col>
                    </Row>
                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Images</Col>
                      <Col className="d-flex justify-content-end">
                        <div
                          style={{
                            height: "50px",
                            position: "relative",
                          }}
                        >
                          {applianceState[appliance]["images"] !== undefined &&
                          applianceState[appliance]["images"].length > 0 ? (
                            <div>
                              {console.log(
                                applianceState[appliance]["images"][currentImg]
                              )}
                              <img
                                src={
                                  applianceState[appliance]["images"][
                                    currentImg
                                  ]
                                }
                                // className="w-50 h-50"
                                style={{
                                  borderRadius: "4px",
                                  objectFit: "contain",
                                  width: "50px",
                                  height: "50px",
                                }}
                                alt="Property"
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  left: "-15px",
                                  top: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  previousImg(
                                    applianceState[appliance]["images"]
                                  )
                                }
                              >
                                {"<"}
                              </div>
                              <div
                                style={{
                                  position: "absolute",
                                  right: "-15px",
                                  top: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  nextImg(applianceState[appliance]["images"])
                                }
                              >
                                {">"}
                              </div>
                            </div>
                          ) : (
                            "None"
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Row>
                ) : null}
              </Row>
            </Row>
          ))}
      </Row>
      <Row className="mt-2">
        {tableView ? (
          <Table striped bordered responsive size="sm" style={subHeading}>
            <thead>
              <tr>
                <th>Appliance</th>
                <th>Name</th>
                <th>Purchased From</th>
                <th>Purchased On</th>
                <th>Purchase Order Number</th>
                <th>Installed On</th>
                <th>Serial Number</th>
                <th>Model Number</th>
                <th>Warranty Till</th>
                <th>Warranty Info</th>
                <th>Images</th>
              </tr>
            </thead>

            <tbody>
              {appliances.map((appliance, i) => (
                <tr>
                  <td>{appliance}</td>
                  <td>{applianceName || applianceState[appliance]["name"]}</td>
                  <td>
                    {appliancePurchasedFrom ||
                      applianceState[appliance]["purchased_from"]}
                  </td>
                  <td>
                    {appliancePurchasedOn ||
                      applianceState[appliance]["purchased"]}
                  </td>
                  <td>
                    {appliancePurchasesOrderNumber ||
                      applianceState[appliance]["purchased_order"]}
                  </td>
                  <td>
                    {applianceInstalledOn ||
                      applianceState[appliance]["installed"]}
                  </td>
                  <td>
                    {applianceSerialNum ||
                      applianceState[appliance]["serial_num"]}
                  </td>
                  <td>
                    {applianceModelNum ||
                      applianceState[appliance]["model_num"]}
                  </td>
                  <td>
                    {applianceWarrantyTill ||
                      applianceState[appliance]["warranty_till"]}
                  </td>
                  <td>
                    {applianceWarrantyInfo ||
                      applianceState[appliance]["warranty_info"]}
                  </td>
                  <td>
                    <div
                      style={{
                        height: "50px",
                        position: "relative",
                      }}
                    >
                      {applianceState[appliance]["images"] !== undefined &&
                      applianceState[appliance]["images"].length > 0 ? (
                        <div>
                          <img
                            src={
                              applianceState[appliance]["images"][currentImg]
                            }
                            // className="w-50 h-50"
                            style={{
                              borderRadius: "4px",
                              objectFit: "contain",
                              width: "50px",
                              height: "50px",
                            }}
                            alt="Property"
                          />
                          <div
                            style={{
                              position: "absolute",
                              left: "-7px",
                              top: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              previousImg(applianceState[appliance]["images"])
                            }
                          >
                            {"<"}
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              right: "-2px",
                              top: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              nextImg(applianceState[appliance]["images"])
                            }
                          >
                            {">"}
                          </div>
                        </div>
                      ) : (
                        "None"
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
      </Row>
      {!edit ? (
        ""
      ) : newAppliance === null ? (
        ""
      ) : (
        <div>
          {console.log("here  enter new appliance")}
          <div className="d-flex ps-2 align-items-center">
            <Checkbox type="BOX" checked={true} />
            <Form.Control
              style={squareForm}
              value={newAppliance}
              placeholder="Appliance"
              onChange={(e) => setNewAppliance(e.target.value)}
            />
          </div>
          <Row>
            <Row className="mx-1 mt-1 p-0">
              <Col>Name</Col>
              <Col>
                <Form.Control
                  style={squareForm}
                  type="text"
                  value={applianceName}
                  placeholder="Appliance Name"
                  onChange={(e) => setApplianceName(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mx-1 mt-1 p-0">
              <Col>Purchased From</Col>
              <Col>
                <Form.Control
                  style={squareForm}
                  value={appliancePurchasedFrom}
                  placeholder="Purchased From"
                  onChange={(e) => setAppliancePurchasedFrom(e.target.value)}
                />
              </Col>
            </Row>

            <Row className="mx-1 mt-1 p-0">
              <Col>Purchased On</Col>
              <Col>
                <Form.Control
                  style={squareForm}
                  type="date"
                  value={appliancePurchasedOn}
                  onChange={(e) => setAppliancePurchasedOn(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mx-1 mt-1 p-0">
              <Col>Purchase Order Number</Col>
              <Col>
                <Form.Control
                  style={squareForm}
                  value={appliancePurchasesOrderNumber}
                  placeholder="Purchase Order Number"
                  onChange={(e) =>
                    setAppliancePurchasesOrderNumber(e.target.value)
                  }
                />
              </Col>
            </Row>

            <Row className="mx-1 mt-1 p-0">
              <Col>Installed On</Col>
              <Col>
                <Form.Control
                  style={squareForm}
                  type="date"
                  value={applianceInstalledOn}
                  onChange={(e) => setApplianceInstalledOn(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mx-1 mt-1 p-0">
              <Col>Serial Number</Col>
              <Col>
                <Form.Control
                  style={squareForm}
                  value={applianceSerialNum}
                  placeholder="Serial Number"
                  onChange={(e) => setApplianceSerialNum(e.target.value)}
                />
              </Col>
            </Row>

            <Row className="mx-1 mt-1 p-0">
              <Col>Model Number</Col>
              <Col>
                <Form.Control
                  style={squareForm}
                  value={applianceModelNum}
                  placeholder="Model Number"
                  onChange={(e) => setApplianceModelNum(e.target.value)}
                />
              </Col>
            </Row>

            <Row className="mx-1 mt-1 p-0">
              <Col>Warranty Till</Col>
              <Col>
                <Form.Control
                  style={squareForm}
                  type="date"
                  value={applianceWarrantyTill}
                  onChange={(e) => setApplianceWarrantyTill(e.target.value)}
                />
              </Col>
            </Row>

            <Row className="mx-1 mt-1 p-0">
              <Col>Warranty Info</Col>
              <Col>
                <Form.Control
                  style={squareForm}
                  value={applianceWarrantyInfo}
                  placeholder="Warranty Info"
                  onChange={(e) => setApplianceWarrantyInfo(e.target.value)}
                />
              </Col>
            </Row>
          </Row>
          {property ? <ApplianceImages state={imageState} /> : ""}
          <div className="text-center my-3">
            <Button
              variant="outline-primary"
              style={pillButton}
              className="mx-2"
              onClick={() => setNewAppliance(null)}
            >
              Cancel
            </Button>
            <Button
              variant="outline-primary"
              style={pillButton}
              className="mx-2"
              onClick={addAppliance}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}

export default PropertyAppliances;
