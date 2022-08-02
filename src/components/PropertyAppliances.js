import React, { useState } from "react";
import Checkbox from "./Checkbox";
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
  const [appliancePurchasedFrom, setAppliancePurchasedFrom] = useState(null);
  const [appliancePurchasesOrderNumber, setAppliancePurchasesOrderNumber] =
    useState(null);
  const [applianceInstalledOn, setApplianceInstalledOn] = useState(null);
  const [applianceWarrantyTill, setApplianceWarrantyTill] = useState(null);
  const [applianceWarrantyInfo, setApplianceWarrantyInfo] = useState(null);
  const [addApplianceInfo, setAddApplianceInfo] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDetailsNoEdit, setShowDetailsNoEdit] = useState(false);

  const [tableView, setTableView] = useState(false);
  const toggleAppliance = (appliance) => {
    const newApplianceState = { ...applianceState };
    // console.log(newApplianceState);
    newApplianceState[appliance]["available"] =
      !newApplianceState[appliance]["available"];
    // console.log(newApplianceState);
    setAddApplianceInfo(true);
    setShowDetails(true);
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
  };

  const showApplianceDetailNoEdit = (appliance) => {
    setApplianceType(appliance);
    setShowDetailsNoEdit(!showDetailsNoEdit);
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
  };

  const updateAppliance = (appliance) => {
    const newApplianceState = { ...applianceState };
    console.log(newApplianceState);
    newApplianceState[appliance]["available"] =
      newApplianceState[appliance]["available"];
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
    console.log(newApplianceState);
    setAddApplianceInfo(false);
    setApplianceState(newApplianceState);
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
    newApplianceState[appliance]["available"] = false;
    console.log(newApplianceState);
    setAddApplianceInfo(false);
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

  const addAppliance = () => {
    const newApplianceState = { ...applianceState };
    console.log(newApplianceState[newAppliance]);
    newApplianceState[newAppliance] = {};
    newApplianceState[newAppliance]["available"] = true;
    newApplianceState[newAppliance]["model_num"] = applianceModelNum;
    newApplianceState[newAppliance]["name"] = applianceName;
    newApplianceState[newAppliance]["purchased"] = appliancePurchasedOn;
    newApplianceState[newAppliance]["purchased_from"] = appliancePurchasedFrom;
    newApplianceState[newAppliance]["purchased_order"] =
      appliancePurchasesOrderNumber;
    newApplianceState[newAppliance]["installed"] = applianceInstalledOn;
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
      <Row className="d-flex">
        <Col className="d-flex">
          <h6 style={mediumBold} className="mt-2">
            Appliances
          </h6>
        </Col>
        {!edit ? (
          <Col className="d-flex justify-content-end mb-1">
            <Button
              style={bluePillButton}
              onClick={() => setTableView(!tableView)}
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
            <Row key={i} className="d-flex flex-column ps-2 align-items-center">
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
                          console.log("here");
                        }
                      : () => {
                          showApplianceDetailNoEdit(appliance);
                        }
                  }
                >
                  <p className="ms-1 mb-1">{appliance}</p>
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
                          placeholder="Purchased On"
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
                          placeholder="Installed On"
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
                          placeholder="Warranty Till"
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
                showDetailsNoEdit &&
                applianceState[appliance]["available"] == true &&
                applianceType == appliance ? (
                  <Row>
                    <Row className="mx-2 p-0">
                      <Col>Name</Col>
                      <Col className="d-flex justify-content-end">
                        <p>
                          {applianceName || applianceState[appliance]["name"]}
                        </p>
                      </Col>
                    </Row>
                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Purchased From</Col>
                      <Col className="d-flex justify-content-end">
                        <p>
                          {appliancePurchasedFrom ||
                            applianceState[appliance]["purchased_from"]}
                        </p>
                      </Col>
                    </Row>
                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Purchased On</Col>
                      <Col className="d-flex justify-content-end">
                        <p>
                          {appliancePurchasedOn ||
                            applianceState[appliance]["purchased"]}
                        </p>
                      </Col>
                    </Row>
                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Purchase Order Number</Col>
                      <Col className="d-flex justify-content-end">
                        <p>
                          {appliancePurchasesOrderNumber ||
                            applianceState[appliance]["purchased_order"]}
                        </p>
                      </Col>
                    </Row>

                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Installed On</Col>
                      <Col className="d-flex justify-content-end">
                        <p>
                          {applianceInstalledOn ||
                            applianceState[appliance]["installed"]}
                        </p>
                      </Col>
                    </Row>

                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Serial Number</Col>
                      <Col className="d-flex justify-content-end">
                        <p>
                          {applianceSerialNum ||
                            applianceState[appliance]["serial_num"]}
                        </p>
                      </Col>
                    </Row>

                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Model Number</Col>
                      <Col className="d-flex justify-content-end">
                        <p>
                          {applianceModelNum ||
                            applianceState[appliance]["model_num"]}
                        </p>
                      </Col>
                    </Row>

                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Warranty Till</Col>
                      <Col className="d-flex justify-content-end">
                        <p>
                          {applianceWarrantyTill ||
                            applianceState[appliance]["warranty_till"]}
                        </p>
                      </Col>
                    </Row>

                    <Row className="mx-2 mt-1 p-0">
                      <Col xs={7}>Warranty Info</Col>
                      <Col className="d-flex justify-content-end">
                        <p>
                          {applianceWarrantyInfo ||
                            applianceState[appliance]["warranty_info"]}
                        </p>
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
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
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
                  placeholder="Purchased On"
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
                  placeholder="Installed On"
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
