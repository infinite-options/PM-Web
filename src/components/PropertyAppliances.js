import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import Checkbox from "./Checkbox";
import ApplianceImages from "./ApplianceImages";
import ConfirmDialog from "../components/ConfirmDialog";
import AddIcon from "../icons/AddIcon.svg";
import MinusIcon from "../icons/MinusIcon.svg";
import { squareForm, pillButton, mediumBold } from "../utils/styles";
import { get, put } from "../utils/api";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});
function PropertyAppliances(props) {
  const navigate = useNavigate();
  const classes = useStyles();
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

  const [showDialog, setShowDialog] = useState(false);
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
  const imageState = useState([]);
  const [addApplianceInfo, setAddApplianceInfo] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const toggleAppliance = (appliance) => {
    const newApplianceState = { ...applianceState };
    newApplianceState[appliance]["available"] =
      !newApplianceState[appliance]["available"];
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
      if (file.file !== null) {
        rem_app[key] = file.file;
      } else {
        rem_app[key] = file.image;
      }
    }
    const response = await put("/RemoveAppliance", rem_app, null, files);

    setShowDialog(false);
  };

  const Capitalize = (str) => {
    return (
      str.toString().charAt(0).toUpperCase() +
      str.toString().slice(1).toLowerCase()
    );
  };

  const updateAppliance = async (appliance) => {
    const newApplianceState = { ...applianceState };

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

    if (property) {
      let newProperty = {
        property_uid: property.property_uid,
        appliances: JSON.stringify({
          [appliance]: newApplianceState[appliance],
        }),
      };

      const files = imageState[0];
      let i = 0;
      for (const file of imageState[0]) {
        let key = file.coverPhoto
          ? `img_${appliance}_cover`
          : `img_${appliance}_${i++}`;
        if (file.file !== null) {
          newProperty[key] = file.file;
        } else {
          newProperty[key] = file.image;
        }
      }
      setShowSpinner(true);

      const response = await put("/appliances", newProperty, null, files);
    }

    setAddApplianceInfo(false);
    setShowDetails(false);
    const getNewApplianceInfo = await get(
      `/appliances?property_uid=${property.property_uid}`
    );
    let newinfo = JSON.parse(getNewApplianceInfo.result[0].appliances);
    setApplianceState(newinfo);
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
    setShowSpinner(false);
  };

  const cancelAppliance = (appliance) => {
    const newApplianceState = { ...applianceState };
    imageState[0] = [];
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
  };

  const addAppliance = async () => {
    const newApplianceState = { ...applianceState };
    newApplianceState[newAppliance] = {};
    newApplianceState[newAppliance]["available"] = "True";
    newApplianceState[newAppliance]["model_num"] =
      applianceModelNum === null ? "" : applianceModelNum;
    newApplianceState[newAppliance]["name"] =
      applianceName === null ? "" : applianceName;
    newApplianceState[newAppliance]["purchased"] =
      appliancePurchasedOn === null ? "" : appliancePurchasedOn;
    newApplianceState[newAppliance]["purchased_from"] =
      appliancePurchasedFrom === null ? "" : appliancePurchasedFrom;
    newApplianceState[newAppliance]["purchased_order"] =
      appliancePurchasesOrderNumber === null
        ? ""
        : appliancePurchasesOrderNumber;
    newApplianceState[newAppliance]["installed"] =
      applianceInstalledOn === null ? "" : applianceInstalledOn;
    newApplianceState[newAppliance]["serial_num"] =
      applianceSerialNum === null ? "" : applianceSerialNum;
    newApplianceState[newAppliance]["warranty_info"] =
      applianceWarrantyInfo === null ? "" : applianceWarrantyInfo;
    newApplianceState[newAppliance]["warranty_till"] =
      applianceWarrantyTill === null ? "" : applianceWarrantyTill;
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

        if (file.file !== null) {
          newProperty[key] = file.file;
        } else {
          newProperty[key] = file.image;
        }
      }

      const response = await put("/appliances", newProperty, null, files);
    }
    imageState[0] = [];

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
  console.log(property);

  return (
    <div style={({ padding: "0px" }, mediumBold)} className="my-4">
      <ConfirmDialog
        title={"Are you sure you want to delete this appliance?"}
        isOpen={showDialog}
        onConfirm={removeappliance}
        onCancel={onCancel}
      />
      {property !== undefined ? (
        <div>
          <h5 className="mx-3 mt-2">
            {property.address}
            {property.unit !== "" ? ` ${property.unit}, ` : ", "}
            {property.city}, {property.state} {property.zip}
          </h5>
        </div>
      ) : (
        <div>
          <h5 className="mx-3 mt-2">New Property</h5>
        </div>
      )}

      <Row className="d-flex justify-content-center align-items-center">
        <Col className="d-flex">
          <h6 style={mediumBold} className="mx-3 mt-2">
            Appliances
          </h6>
        </Col>
        {/* <Col>
          {newAppliance === null && edit ? (
            <img
              src={AddIcon} alt="Add Icon"
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
        </Col> */}
      </Row>
      <Row className="d-flex justify-content-center align-items-center overflow-scroll p-3">
        <Table
          classes={{ root: classes.customTable }}
          responsive="md"
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
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
              <TableCell></TableCell>
              {addApplianceInfo === true && showDetails === true ? (
                <TableCell></TableCell>
              ) : (
                ""
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {appliances.map((appliance, i) => {
              return (
                <TableRow>
                  <TableCell size="small">
                    {" "}
                    <Checkbox
                      type="BOX"
                      checked={applianceState[appliance]["available"]}
                      onClick={
                        edit ? () => toggleAppliance(appliance) : () => {}
                      }
                    />
                  </TableCell>
                  <TableCell
                    onClick={
                      edit
                        ? () => {
                            showApplianceDetail(appliance);
                          }
                        : () => {}
                    }
                  >
                    {appliance}
                  </TableCell>
                  <TableCell>
                    {addApplianceInfo === true &&
                    showDetails === true &&
                    (applianceState[appliance]["available"] === true ||
                      applianceState[appliance]["available"] === "True") &&
                    applianceType === appliance ? (
                      <div>
                        {" "}
                        <Form.Control
                          style={squareForm}
                          type="text"
                          value={
                            applianceName || applianceState[appliance]["name"]
                          }
                          placeholder="Appliance Name"
                          onChange={(e) => setApplianceName(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div>{applianceState[appliance]["name"]}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {addApplianceInfo === true &&
                    showDetails === true &&
                    (applianceState[appliance]["available"] === true ||
                      applianceState[appliance]["available"] === "True") &&
                    applianceType === appliance ? (
                      <div>
                        {" "}
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
                      </div>
                    ) : (
                      <div>{applianceState[appliance]["purchased_from"]}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {addApplianceInfo === true &&
                    showDetails === true &&
                    (applianceState[appliance]["available"] === true ||
                      applianceState[appliance]["available"] === "True") &&
                    applianceType === appliance ? (
                      <div>
                        {" "}
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
                      </div>
                    ) : (
                      <div>{applianceState[appliance]["purchased"]}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {addApplianceInfo === true &&
                    showDetails === true &&
                    (applianceState[appliance]["available"] === true ||
                      applianceState[appliance]["available"] === "True") &&
                    applianceType === appliance ? (
                      <div>
                        {" "}
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
                      </div>
                    ) : (
                      <div>{applianceState[appliance]["purchased_order"]}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {addApplianceInfo === true &&
                    showDetails === true &&
                    (applianceState[appliance]["available"] === true ||
                      applianceState[appliance]["available"] === "True") &&
                    applianceType === appliance ? (
                      <div>
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
                      </div>
                    ) : (
                      <div>{applianceState[appliance]["installed"]}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {addApplianceInfo === true &&
                    showDetails === true &&
                    (applianceState[appliance]["available"] === true ||
                      applianceState[appliance]["available"] === "True") &&
                    applianceType === appliance ? (
                      <div>
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
                      </div>
                    ) : (
                      <div>{applianceState[appliance]["serial_num"]}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {addApplianceInfo === true &&
                    showDetails === true &&
                    (applianceState[appliance]["available"] === true ||
                      applianceState[appliance]["available"] === "True") &&
                    applianceType === appliance ? (
                      <div>
                        <Form.Control
                          style={squareForm}
                          value={
                            applianceModelNum ||
                            applianceState[appliance]["model_num"]
                          }
                          placeholder="Model Number"
                          onChange={(e) => setApplianceModelNum(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div>{applianceState[appliance]["model_num"]}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {addApplianceInfo === true &&
                    showDetails === true &&
                    (applianceState[appliance]["available"] === true ||
                      applianceState[appliance]["available"] === "True") &&
                    applianceType === appliance ? (
                      <div>
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
                      </div>
                    ) : (
                      <div>{applianceState[appliance]["warranty_till"]}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {addApplianceInfo === true &&
                    showDetails === true &&
                    (applianceState[appliance]["available"] === true ||
                      applianceState[appliance]["available"] === "True") &&
                    applianceType === appliance ? (
                      <div>
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
                      </div>
                    ) : (
                      <div>{applianceState[appliance]["warranty_info"]}</div>
                    )}
                  </TableCell>
                  {addApplianceInfo === true &&
                  showDetails === true &&
                  (applianceState[appliance]["available"] === true ||
                    applianceState[appliance]["available"] === "True") &&
                  applianceType === appliance ? (
                    <TableCell>
                      {property ? <ApplianceImages state={imageState} /> : ""}
                    </TableCell>
                  ) : (
                    <TableCell>
                      {applianceState[appliance]["images"] !== undefined &&
                      applianceState[appliance]["images"].length > 0 ? (
                        <div>
                          <Row className="d-flex justify-content-center align-items-center ">
                            <Col className="d-flex justify-content-center align-items-center">
                              <img
                                key={Date.now()}
                                src={`${
                                  applianceState[appliance]["images"][0]
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
                        </div>
                      ) : (
                        <div>None</div>
                      )}
                    </TableCell>
                  )}
                  {!og_appliances.includes(appliance) ? (
                    <TableCell>
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
                        }}
                      />
                    </TableCell>
                  ) : (
                    <TableCell></TableCell>
                  )}
                  {addApplianceInfo === true &&
                  showDetails === true &&
                  (applianceState[appliance]["available"] === true ||
                    applianceState[appliance]["available"] === "True") &&
                  applianceType === appliance ? (
                    <TableCell>
                      {showSpinner ? (
                        <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                          <ReactBootStrap.Spinner
                            animation="border"
                            role="status"
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="text-center my-3">
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
                        <Button
                          variant="outline-primary"
                          style={pillButton}
                          className="mx-2"
                          onClick={() => cancelAppliance(appliance)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  ) : addApplianceInfo === true && showDetails === true ? (
                    <TableCell></TableCell>
                  ) : (
                    ""
                  )}
                </TableRow>
              );
            })}
            {!edit ? (
              ""
            ) : newAppliance === null ? (
              ""
            ) : (
              <TableRow>
                <TableCell>
                  <Checkbox type="BOX" checked={true} />
                </TableCell>
                <TableCell>
                  {" "}
                  <Form.Control
                    style={squareForm}
                    value={newAppliance}
                    placeholder="Appliance"
                    onChange={(e) => setNewAppliance(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Form.Control
                    style={squareForm}
                    type="text"
                    value={applianceName}
                    placeholder="Appliance Name"
                    onChange={(e) => setApplianceName(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Form.Control
                    style={squareForm}
                    value={appliancePurchasedFrom}
                    placeholder="Purchased From"
                    onChange={(e) => setAppliancePurchasedFrom(e.target.value)}
                  />
                </TableCell>

                <TableCell>
                  <Form.Control
                    style={squareForm}
                    type="date"
                    value={appliancePurchasedOn}
                    onChange={(e) => setAppliancePurchasedOn(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Form.Control
                    style={squareForm}
                    value={appliancePurchasesOrderNumber}
                    placeholder="Purchase Order Number"
                    onChange={(e) =>
                      setAppliancePurchasesOrderNumber(e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <Form.Control
                    style={squareForm}
                    type="date"
                    value={applianceInstalledOn}
                    onChange={(e) => setApplianceInstalledOn(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Form.Control
                    style={squareForm}
                    value={applianceSerialNum}
                    placeholder="Serial Number"
                    onChange={(e) => setApplianceSerialNum(e.target.value)}
                  />
                </TableCell>

                <TableCell>
                  <Form.Control
                    style={squareForm}
                    value={applianceModelNum}
                    placeholder="Model Number"
                    onChange={(e) => setApplianceModelNum(e.target.value)}
                  />
                </TableCell>

                <TableCell>
                  <Form.Control
                    style={squareForm}
                    type="date"
                    value={applianceWarrantyTill}
                    onChange={(e) => setApplianceWarrantyTill(e.target.value)}
                  />
                </TableCell>

                <TableCell>
                  <Form.Control
                    style={squareForm}
                    value={applianceWarrantyInfo}
                    placeholder="Warranty Info"
                    onChange={(e) => setApplianceWarrantyInfo(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  {property ? <ApplianceImages state={imageState} /> : ""}
                </TableCell>
                <TableCell>
                  {showSpinner ? (
                    <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                      <ReactBootStrap.Spinner
                        animation="border"
                        role="status"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="text-center my-3">
                    <Button
                      variant="outline-primary"
                      style={pillButton}
                      className="mx-2"
                      onClick={addAppliance}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline-primary"
                      style={pillButton}
                      className="mx-2"
                      onClick={() => setNewAppliance(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* {appliances.map((appliance, i) => (
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
                    : () => {}
                }
              >
                <p className="ms-1 mb-1">{appliance}</p>
              </Col>
              <Col xs={1}>
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
              {addApplianceInfo === true &&
              showDetails === true &&
              (applianceState[appliance]["available"] === true ||
                applianceState[appliance]["available"] === "True") &&
              applianceType === appliance ? (
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
                        onChange={(e) => setApplianceSerialNum(e.target.value)}
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
                  {showSpinner ? (
                    <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                      <ReactBootStrap.Spinner
                        animation="border"
                        role="status"
                      />
                    </div>
                  ) : (
                    ""
                  )}
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
          </Row>
        ))} */}
      </Row>
      <Row className="d-flex justify-content-center align-items-center">
        <Col>
          {newAppliance === null && edit ? (
            <img
              src={AddIcon}
              alt="Add Icon"
              onClick={() => setNewAppliance("")}
              style={{
                width: "15px",
                height: "15px",
                float: "left",
                marginRight: "5rem",
              }}
            />
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row className="d-flex flex-column justify-content-left overflow-scroll"></Row>
    </div>
  );
}

export default PropertyAppliances;
