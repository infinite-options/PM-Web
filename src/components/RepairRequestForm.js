import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import Header from "../components/Header";
import SideBar from "../components/ownerComponents/SideBar";
import OwnerFooter from "../components/ownerComponents/OwnerFooter";
import RepairImages from "./RepairImages";
import HighPriority from "../icons/highPriority.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import { get, post } from "../utils/api";
import {
  headings,
  formLabel,
  bluePillButton,
  pillButton,
  red,
  hidden,
  small,
  payNowButton,
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
function RepairRequest(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { property_uid } = useParams();
  const property = location.state.property;
  const imageState = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [issueType, setIssueType] = useState("Plumbing");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);

  const [width, setWindowWidth] = useState(0);
  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };
  const responsiveSidebar = {
    showSidebar: width > 1023,
  };

  const submitForm = async () => {
    if (title === "" || description === "" || priority === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    const newRequest = {
      property_uid: property_uid,
      title: title,
      description: description,
      priority: priority,
      request_type: issueType,
      priority: priority,
      request_created_by: property.owner_id,
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
    console.log(files);
    setShowSpinner(true);
    await post("/maintenanceRequests", newRequest, null, files);
    // navigate(`/${property_uid}/repairStatus`);
    setShowSpinner(false);
    navigate(`/propertyDetails/${property_uid}`, {
      state: {
        property_uid: property_uid,
      },
    });

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
    <div>
      <div className="flex-1">
        <div
          hidden={!responsiveSidebar.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </div>
        <div className="w-100 mb-5">
          <Header
            title="Repair Request Form"
            leftText={"< Back"}
            leftFn={() => {
              navigate(`/propertyDetails/${property_uid}`, {
                state: {
                  property_uid: property_uid,
                },
              });
            }}
          />
          <Container className="pt-1 mb-4">
            <Row style={headings}>
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
              <Row style={formLabel} as="h5" className="ms-1 mb-0">
                {property.address} {property.unit}
                ,&nbsp;
                {property.city}
                ,&nbsp;
                {property.state}&nbsp; {property.zip}
              </Row>
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
              <Row
                style={{
                  display: "text",
                  flexDirection: "row",
                  textAlign: "center",
                  marginBottom: "3rem",
                }}
              >
                <Col>
                  <Button
                    variant="outline-primary"
                    onClick={() => submitForm()}
                    style={bluePillButton}
                  >
                    Send Repair Request
                  </Button>
                </Col>
                <Col xs={4}>
                  <Button
                    variant="outline-primary"
                    onClick={() =>
                      navigate(`/propertyDetails/${property_uid}`, {
                        state: {
                          property_uid: property_uid,
                        },
                      })
                    }
                    style={pillButton}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </div>
      <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-5">
        <OwnerFooter />
      </div>
    </div>
  );
}

export default RepairRequest;
