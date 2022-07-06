import React, { useState } from "react";
import Checkbox from "./Checkbox";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import {
  squareForm,
  pillButton,
  blue,
  hidden,
  mediumBold,
} from "../utils/styles";

function PropertyAppliances(props) {
  const { state, edit } = props;
  const [applianceState, setApplianceState] = state;
  const appliances = Object.keys(applianceState);

  const [newAppliance, setNewAppliance] = useState(null);
  const [applianceType, setApplianceType] = useState(null);
  const [applianceName, setApplianceName] = useState(null);
  const [applianceModelNum, setApplianceModelNum] = useState(null);
  const [applianceSerialNum, setApplianceSerialNum] = useState(null);
  const [appliancePurchasedOn, setAppliancePurchasedOn] = useState(null);
  const [applianceWarrantyTill, setApplianceWarrantyTill] = useState(null);
  const [applianceWarrantyInfo, setApplianceWarrantyInfo] = useState(null);
  const [addApplianceInfo, setAddApplianceInfo] = useState(false);

  const toggleAppliance = (appliance) => {
    const newApplianceState = { ...applianceState };
    // console.log(newApplianceState);
    newApplianceState[appliance]["available"] =
      !newApplianceState[appliance]["available"];
    // console.log(newApplianceState);
    setAddApplianceInfo(true);
    setApplianceType(appliance);
    setApplianceState(newApplianceState);
  };

  const updateAppliance = (appliance) => {
    const newApplianceState = { ...applianceState };
    console.log(newApplianceState);
    newApplianceState[appliance]["available"] =
      newApplianceState[appliance]["available"];
    newApplianceState[appliance]["model_num"] = applianceModelNum;
    newApplianceState[appliance]["name"] = applianceName;
    newApplianceState[appliance]["purchased"] = appliancePurchasedOn;
    newApplianceState[appliance]["serial_num"] = applianceSerialNum;
    newApplianceState[appliance]["warranty_info"] = applianceWarrantyInfo;
    newApplianceState[appliance]["warranty_till"] = applianceWarrantyTill;
    console.log(newApplianceState);
    setAddApplianceInfo(false);
    setApplianceState(newApplianceState);
    setApplianceName("");
    setAppliancePurchasedOn("");
    setApplianceSerialNum("");
    setApplianceModelNum("");
    setApplianceWarrantyTill("");
    setApplianceWarrantyInfo("");
    setApplianceType("");
  };

  const cancelAppliance = (appliance) => {
    const newApplianceState = { ...applianceState };
    console.log(newApplianceState);
    newApplianceState[appliance]["available"] = false;
    console.log(newApplianceState);
    setAddApplianceInfo(false);
    setApplianceState(newApplianceState);
    setApplianceName("");
    setAppliancePurchasedOn("");
    setApplianceSerialNum("");
    setApplianceModelNum("");
    setApplianceWarrantyTill("");
    setApplianceWarrantyInfo("");
    setApplianceType("");
  };

  const addAppliance = () => {
    const newApplianceState = { ...applianceState };
    console.log(newApplianceState[newAppliance]);
    newApplianceState[newAppliance] = {};
    newApplianceState[newAppliance]["available"] = true;
    newApplianceState[newAppliance]["model_num"] = applianceModelNum;
    newApplianceState[newAppliance]["name"] = applianceName;
    newApplianceState[newAppliance]["purchased"] = appliancePurchasedOn;
    newApplianceState[newAppliance]["serial_num"] = applianceSerialNum;
    newApplianceState[newAppliance]["warranty_info"] = applianceWarrantyInfo;
    newApplianceState[newAppliance]["warranty_till"] = applianceWarrantyTill;
    setApplianceState(newApplianceState);
    console.log(newApplianceState);
    setNewAppliance(null);
    setApplianceName("");
    setAppliancePurchasedOn("");
    setApplianceSerialNum("");
    setApplianceModelNum("");
    setApplianceWarrantyTill("");
    setApplianceWarrantyInfo("");
    setApplianceType("");
  };

  return (
    <Container style={({ padding: "0px" }, mediumBold)} className="my-4">
      <h6 style={mediumBold}>Appliances</h6>
      <Row className="d-flex flex-column justify-content-left">
        {appliances.map((appliance, i) => (
          <Row key={i} className="d-flex flex-column ps-2 align-items-center">
            <Row>
              <Col xs={1}>
                <Checkbox
                  type="BOX"
                  checked={applianceState[appliance]["available"]}
                  onClick={edit ? () => toggleAppliance(appliance) : () => {}}
                />
              </Col>
              <Col>
                <p className="ms-1 mb-1">{appliance}</p>
              </Col>
            </Row>

            {addApplianceInfo &&
            applianceState[appliance]["available"] == true &&
            applianceType == appliance ? (
              <Row>
                <Row className="mx-4 p-0">
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

                <Row className="mx-4 mt-1 p-0">
                  <Col>Purchased On</Col>
                  <Col>
                    <Form.Control
                      style={squareForm}
                      type="date"
                      value={appliancePurchasedOn}
                      placeholder="Purchased On"
                      onChange={(e) => setAppliancePurchasedOn(e.target.value)}
                    />
                  </Col>
                </Row>

                <Row className="mx-4 mt-1 p-0">
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

                <Row className="mx-4 mt-1 p-0">
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

                <Row className="mx-4 mt-1 p-0">
                  <Col>Warranty Till</Col>
                  <Col>
                    <Form.Control
                      style={squareForm}
                      type="date"
                      value={applianceWarrantyTill}
                      placeholder="Warranty Till"
                      onChange={(e) => setApplianceWarrantyTill(e.target.value)}
                    />
                  </Col>
                </Row>

                <Row className="mx-4 mt-1 p-0">
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
                    onClick={edit ? () => updateAppliance(appliance) : () => {}}
                  >
                    Save
                  </Button>
                </div>
              </Row>
            ) : null}
          </Row>
        ))}
      </Row>

      {!edit ? (
        ""
      ) : newAppliance === null ? (
        <div
          className="d-flex ps-2 align-items-center"
          onClick={() => setNewAppliance("")}
        >
          <div style={hidden}>
            <Checkbox type="BOX" />
          </div>
          <p className="ms-1 mb-1" style={blue}>
            Add Other +
          </p>
        </div>
      ) : (
        <div>
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
              <Col>Purchased On</Col>
              <Col>
                <Form.Control
                  style={squareForm}
                  type="date"
                  value={appliancePurchasedOn}
                  placeholder="Purchased On"
                  onChange={(e) => setAppliancePurchasedOn(e.target.value)}
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
                  placeholder="Warranty Till"
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
