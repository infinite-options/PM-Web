import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import EditIcon from "../icons/EditIcon.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";
import {
  pillButton,
  smallPillButton,
  squareForm,
  gray,
  red,
  hidden,
  small,
  headings,
} from "../utils/styles";

function ManagerLocations(props) {
  // const [locationState, setLocationState] = props.state;
  const { locationState, setLocationState, editProfile } = props;
  const [newLocation, setNewLocation] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const emptyLocation = {
    location: "",
    distance: "",
  };
  const addLocation = () => {
    if (newLocation.location === "" || newLocation.distance === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    const newLocationState = [...locationState];
    newLocationState.push({ ...newLocation });
    setLocationState(newLocationState);
    setNewLocation(null);
    setErrorMessage("");
  };
  const cancelEdit = () => {
    setNewLocation(null);
    setErrorMessage("");
    if (editingLocation !== null) {
      const newLocationState = [...locationState];
      newLocationState.push(editingLocation);
      setLocationState(newLocationState);
    }
    setEditingLocation(null);
  };
  const editLocation = (i) => {
    const newLocationState = [...locationState];
    const location = newLocationState.splice(i, 1)[0];
    setLocationState(newLocationState);
    setEditingLocation(location);
    setNewLocation({ ...location });
  };
  const deleteLocation = (i) => {
    const newLocationState = [...locationState];
    newLocationState.splice(i, 1);
    setLocationState(newLocationState);
  };
  const changeNewLocation = (event, field) => {
    const changedLocation = { ...newLocation };
    changedLocation[field] = event.target.value;
    setNewLocation(changedLocation);
  };
  const [errorMessage, setErrorMessage] = useState("");
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  return (
    <Container className="py-4">
      {editProfile ? (
        <div>
          <Row className="mb-4" style={headings}>
            <div>Locations of Service:</div>
          </Row>
          {locationState.map((location, i) => (
            <div key={i}>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <h6 className="mb-1">{`${location.location}`}</h6>
                </div>
                <div>
                  <img
                    src={EditIcon}
                    alt="Edit"
                    className="px-1 mx-2"
                    onClick={() => editLocation(i)}
                  />
                  <img
                    src={DeleteIcon}
                    alt="Delete Icon"
                    className="px-1 mx-2"
                    onClick={() => deleteLocation(i)}
                  />
                </div>
              </div>
              <p style={gray} className="mb-1">
                (+)(-) {location.distance} miles
              </p>
              <hr className="mt-1" />
            </div>
          ))}
          {newLocation !== null ? (
            <Container>
              <Row className="my-3">
                <Col xs={8} className="ps-0">
                  <Form.Group>
                    <Form.Label as="h6" className="mb-0 ms-2">
                      Location {newLocation.location === "" ? required : ""}
                    </Form.Label>
                    <Form.Control
                      style={squareForm}
                      placeholder="City, State"
                      value={newLocation.location}
                      onChange={(e) => changeNewLocation(e, "location")}
                    />
                  </Form.Group>
                </Col>
                <Col className="px-0">
                  <Form.Group>
                    <Form.Label as="h6" className="mb-0 ms-2">
                      (+)(-) miles {newLocation.distance === "" ? required : ""}
                    </Form.Label>
                    <Form.Control
                      style={squareForm}
                      placeholder="miles"
                      value={newLocation.distance}
                      onChange={(e) => changeNewLocation(e, "distance")}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div
                className="text-center"
                style={errorMessage === "" ? hidden : {}}
              >
                <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
              </div>
            </Container>
          ) : (
            ""
          )}
          {newLocation === null ? (
            <Button
              variant="outline-primary"
              style={smallPillButton}
              onClick={() => setNewLocation({ ...emptyLocation })}
            >
              Add Location
            </Button>
          ) : (
            <div className="d-flex justify-content-center my-4">
              <Button
                variant="outline-primary"
                style={pillButton}
                onClick={cancelEdit}
                className="mx-2"
              >
                Cancel
              </Button>
              <Button
                variant="outline-primary"
                style={pillButton}
                onClick={addLocation}
                className="mx-2"
              >
                Add Location
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Row className="mb-4" style={headings}>
            <div>Locations of Service:</div>
          </Row>
          {locationState.map((location, i) => (
            <div key={i}>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <h6 className="mb-1">{`${location.location}`}</h6>
                </div>
                <div>
                  <img
                    src={EditIcon}
                    alt="Edit"
                    className="px-1 mx-2"
                    onClick={() => editLocation(i)}
                  />
                  <img
                    src={DeleteIcon}
                    alt="Delete Icon"
                    className="px-1 mx-2"
                    onClick={() => deleteLocation(i)}
                  />
                </div>
              </div>
              <p style={gray} className="mb-1">
                (+)(-) {location.distance} miles
              </p>
              <hr className="mt-1" />
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

export default ManagerLocations;
