import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "./Header";
import HighPriority from "../icons/highPriority.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import RepairImages from "./RepairImages";
import { get, post } from "../utils/api";
import {
  headings,
  formLabel,
  bluePillButton,
  pillButton,
  red,
  hidden,
  small,
  squareForm,
} from "../utils/styles";

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
  const navigate = useNavigate();
  const { properties, setStage } = props;
  const imageState = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedProperty, setSelectedProperty] = useState(null);

  const submitForm = async (sp) => {
    if (title === "" || description === "" || priority === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    let selectedProperty = JSON.parse(sp);
    console.log(typeof JSON.parse(sp));
    const newRequest = {
      property_uid: selectedProperty.property_uid,
      title: title,
      description: description,
      priority: priority,
      request_created_by: selectedProperty.owner_id,
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
    // for (const file of imageState[0]) {
    //   let key = file.coverPhoto ? `img_${i++}` : `img_${i++}`;
    //   if (file.file !== null) {
    //     newRequest[key] = file.file;
    //   } else {
    //     newRequest[key] = file.image;
    //   }
    // }
    console.log(newRequest);
    await post("/maintenanceRequests", newRequest, null, files);
    // navigate(`/${property_uid}/repairStatus`);
    setStage("DASHBOARD");
    //props.onSubmit();
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
    <div className="h-100 d-flex flex-column">
      <Header title="Repairs" leftText="< Back" />
      <Container className="pt-1 mb-4">
        <Row style={headings}>
          <div>New Repair Request</div>
        </Row>
        <Form.Group>
          <Form.Select
            style={squareForm}
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
          >
            {properties.map((property, i) => (
              <option key={i} value={JSON.stringify(property)}>
                {property.address}
                {property.unit !== "" ? " " + property.unit : ""},&nbsp;
                {property.city},&nbsp;{property.state} {property.zip}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form>
          <Form.Group className="mt-3 mb-4">
            <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
              Title (character limit: 15) {required}
            </Form.Label>
            <Form.Control
              style={{ borderRadius: 0 }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Paint"
            />
          </Form.Group>
          <Form.Group className="mt-3 mb-4">
            <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
              Description {required}
            </Form.Label>
            <Form.Control
              style={{ borderRadius: 0 }}
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Kitchen wall needs repaint. It’s been chipping."
            />
          </Form.Group>
          <Form.Group className="mt-3 mb-4">
            <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
              Take pictures
            </Form.Label>
          </Form.Group>
          <RepairImages state={imageState} />
          <Form.Group className="mt-3 mb-4">
            <Form.Label style={formLabel} as="h5" className="mt-2 mb-1">
              Tag Priority (Select one) {required}
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
        </Form>
        <div className="text-center mt-5">
          <div
            className="text-center"
            style={errorMessage === "" ? hidden : {}}
          >
            <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
          </div>
          <Row
            style={{
              display: "text",
              flexDirection: "row",
              textAlign: "center",
            }}
          >
            <Col>
              <Button
                variant="outline-primary"
                onClick={() => navigate("/tenant")}
                style={pillButton}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                variant="outline-primary"
                onClick={() => submitForm(selectedProperty)}
                style={bluePillButton}
              >
                Add Request
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default OwnerRepairRequest;
