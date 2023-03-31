import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import * as ReactBootStrap from "react-bootstrap";
import RepairImages from "../RepairImages";
import HighPriority from "../../icons/highPriority.svg";
import MediumPriority from "../../icons/mediumPriority.svg";
import LowPriority from "../../icons/lowPriority.svg";
import { get, post } from "../../utils/api";
import {
  headings,
  formLabel,
  bluePillButton,
  pillButton,
  red,
  hidden,
  small,
  squareForm,
} from "../../utils/styles";

const useStyles = makeStyles((theme) => ({
  priorityInactive: {
    opacity: "0.5",
  },
  priorityActive: {
    opacity: "1",
  },
}));
function OwnerRepairRequest(props) {
  const classes = useStyles();
  // const properties = location.state.properties;
  const { properties } = props;
  const imageState = useState([]);

  const [issueType, setIssueType] = useState("Plumbing");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const submitForm = async (sp) => {
    if (title === "" || description === "" || priority === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    // console.log(sp);
    // console.log(properties);
    let selectedProperty = sp === undefined ? properties : JSON.parse(sp);
    // console.log(selectedProperty);
    const newRequest = {
      property_uid:
        properties.length > 1
          ? selectedProperty.property_uid
          : properties[0].property_uid,
      title: title,
      request_type: issueType,
      description: description,
      priority: priority,
      request_created_by:
        properties.length > 1
          ? selectedProperty.owner_id
          : properties[0].owner_id,
    };
    const files = imageState[0];
    let i = 0;
    for (const file of imageState[0]) {
      let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
      if (file.file !== null) {
        newRequest[key] = file.file;
      } else {
        newRequest[key] = file.image;
      }
    }

    // console.log(newRequest);

    setShowSpinner(true);
    await post("/maintenanceRequests", newRequest, null, files);

    setShowSpinner(false);
    props.onSubmit();
  };

  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );

  return (
    <div className="d-flex flex-column w-100 p-2 overflow-hidden">
      <Row style={headings} className="m-2">
        <div>New Repair Request</div>
      </Row>
      <Form.Group
        className="p-2"
        style={{
          background: "#F3F3F3 0% 0% no-repeat padding-box",
          borderRadius: "5px",
        }}
      >
        <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
          Property {required}
        </Form.Label>
        {properties.length > 1 ? (
          <Form.Select
            style={squareForm}
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
          >
            <option key="blankChoice" hidden value>
              Search Your Properties
            </option>
            {properties.map((property, i) => (
              <option key={i} value={JSON.stringify(property)}>
                {property.address}
                {property.unit !== "" ? " " + property.unit : ""},&nbsp;
                {property.city},&nbsp;{property.state} {property.zip}
              </option>
            ))}
          </Form.Select>
        ) : (
          <Row style={formLabel} as="h5" className="ms-1 mb-0">
            {properties[0].address} {properties[0].unit}
            ,&nbsp;
            {properties[0].city}
            ,&nbsp;
            {properties[0].state}&nbsp; {properties[0].zip}
          </Row>
        )}
      </Form.Group>
      <Form.Group className="mx-2 my-3">
        <Form.Label as="h6" className="mb-0 ms-2">
          Issue Type
        </Form.Label>
        <Form.Select
          style={squareForm}
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
        >
          <option>Plumbing</option>
          <option>Landscape</option>
          <option>Appliances</option>
          <option>Electrical</option>
          <option>HVAC</option>
          <option>Other</option>
        </Form.Select>
      </Form.Group>
      <Form>
        <Form.Group
          className="mt-3 mb-4 p-2"
          style={{
            background: "#F3F3F3 0% 0% no-repeat padding-box",
            borderRadius: "5px",
          }}
        >
          <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
            Title {required}
          </Form.Label>
          <Form.Control
            style={{ borderRadius: 0 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title"
          />
        </Form.Group>
        <Form.Group
          className="mt-3 mb-4 p-2"
          style={{
            background: "#F3F3F3 0% 0% no-repeat padding-box",
            borderRadius: "5px",
          }}
        >
          <Form.Label style={formLabel} as="h5" className="mt-2 mb-1">
            Tags {required}
          </Form.Label>
          <Row
            className="mt-2 mb-2"
            style={{
              display: "text",
              flexDirection: "row",
              textAlign: "center",
            }}
          >
            <Col xs={4}>
              <img
                src={HighPriority}
                onClick={() => setPriority("High")}
                className={
                  priority === "High"
                    ? `${classes.priorityActive}`
                    : `${classes.priorityInactive}`
                }
                //style={{ opacity: "0.5" }}
              />
            </Col>
            <Col xs={4}>
              <img
                src={MediumPriority}
                onClick={() => setPriority("Medium")}
                className={
                  priority === "Medium"
                    ? `${classes.priorityActive}`
                    : `${classes.priorityInactive}`
                }
                //style={{ opacity: "0.5" }}
              />
            </Col>
            <Col xs={4}>
              <img
                src={LowPriority}
                onClick={() => setPriority("Low")}
                className={
                  priority === "Low"
                    ? `${classes.priorityActive}`
                    : `${classes.priorityInactive}`
                }
                //style={{ opacity: "0.5" }}
              />
            </Col>
          </Row>
        </Form.Group>
        <Form.Group
          className="mt-3 mb-4 p-2"
          style={{
            background: "#F3F3F3 0% 0% no-repeat padding-box",
            borderRadius: "5px",
          }}
        >
          <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
            Description {required}
          </Form.Label>
          <Form.Control
            style={{ borderRadius: 0 }}
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Description"
          />
        </Form.Group>
        <Form.Group
          className="mt-3 mb-4 p-2"
          style={{
            background: "#F3F3F3 0% 0% no-repeat padding-box",
            borderRadius: "5px",
          }}
        >
          <Form.Label style={formLabel} as="h5" className="ms-1 mb-3">
            Add images
          </Form.Label>
          <RepairImages state={imageState} />
        </Form.Group>
      </Form>
      <div className="text-center mt-5">
        <div className="text-center" style={errorMessage === "" ? hidden : {}}>
          <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
        </div>
        {showSpinner ? (
          <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            <ReactBootStrap.Spinner animation="border" role="status" />
          </div>
        ) : (
          ""
        )}
        <Row
          style={{
            display: "text",
            flexDirection: "row",
            textAlign: "center",
            marginBottom: "5rem",
          }}
        >
          <Col>
            <Button
              variant="outline-primary"
              onClick={() => submitForm(selectedProperty)}
              style={bluePillButton}
            >
              Send Repair Request
            </Button>
          </Col>
          <Col xs={4}>
            <Button
              variant="outline-primary"
              onClick={() => props.cancel()}
              style={pillButton}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default OwnerRepairRequest;
