import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../components/Header";
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
    small, payNowButton,
} from "../utils/styles";
import Calendar from "react-calendar";

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
  const { state } = useLocation();
  const { property_uid } = useParams();
  const imageState = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    console.log(files);
    await post("/maintenanceRequests", newRequest, null, files);
    // navigate(`/${property_uid}/repairStatus`);
    navigate("/tenant");
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
      <Header
        title="New Repair"
        leftText="< Back"
        leftFn={() => navigate("/tenant")}
      />
      <Container className="pt-1 mb-4">
        {/*<Row style={headings}>*/}
        {/*  <div>New Repair Request</div>*/}
        {/*</Row>*/}
        <Row style={formLabel} as="h5" className="ms-1 mb-0">
          {state.property.address} {state.property.unit}
          ,&nbsp;
          {state.property.city}
          ,&nbsp;
          {state.property.state}&nbsp; {state.property.zip}
        </Row>

        <Form>
          <div
              style={{
                position: "relative",
                backgroundColor: "#F3F3F3",
                height: "80px",
                borderRadius: "5px",
              }}
          >
          <Form.Group className="mt-3 mb-4">
            <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
              {/*Title (character limit: 15) {required}*/}
              Title
            </Form.Label>
            <Form.Control
              style={{
                position: "relative",
                borderRadius: 0,
                left: "35px",
                width:"300px",
              }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Paint"
            />
          </Form.Group>
          </div>
          <div
              style={{
                position: "relative",
                backgroundColor: "#F3F3F3",
                height: "70px",
                  borderRadius: "5px",
              }}
          >
            <Form.Group className="mt-3 mb-4">
              <Form.Label style={formLabel} as="h5" className="mt-2 mb-1">
                {/*Tag Priority (Select one) {required}*/}
                Tags
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
          </div>
          <div
              style={{
                position: "relative",
                backgroundColor: "#F3F3F3",
                height: "100px",
                  borderRadius: "5px",
              }}
          >
          <Form.Group className="mt-3 mb-4">
            <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
              Description {required}
            </Form.Label>
            <Form.Control
              style={{
                borderRadius: 0 ,
                position: "relative",
                left: "35px",
                width:"300px",
              }}
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Kitchen wall needs repaint. It’s been chipping."
            />
          </Form.Group>
          </div>
          <div
              style={{
                position: "relative",
                backgroundColor: "#F3F3F3",
                height: "150px",
                  borderRadius: "5px",
              }}
          >
          <Form.Group className="mt-3 mb-4">
            <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
              Add Images
            </Form.Label>
            {/* <Form.Control
              type="file"
              onChange={(e) => console.log(e.target.files)}
            /> */}
          </Form.Group>
          <RepairImages state={imageState} />
          </div>
            <div
                style={{
                    position: "relative",
                    backgroundColor: "#F3F3F3",
                    height: "500px",
                    borderRadius: "5px",
                }}
            >

                {/*<Calendar*/}
                {/*    calendarType="US"*/}
                {/*    // onClickDay={(e) => {*/}
                {/*    //     setTimeAASlots([]);*/}
                {/*    //     dateChange(e);*/}
                {/*    // }}*/}
                {/*    // value={date}*/}
                {/*    // minDate={minDate}*/}
                {/*    // next2Label={null}*/}
                {/*    // prev2Label={null}*/}
                {/*/>*/}
            </div>
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
            <Col
            style={{
                position: "relative",
                left: "25px"}}>
              <Button
                variant="outline-primary"
                onClick={submitForm}
                style={bluePillButton}
              >
                Send Repair Request
              </Button>
            </Col>
            <Col>
              <Button
                  variant="outline-primary"
                  onClick={() => navigate("/tenant")}
                  style={pillButton}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default RepairRequest;
