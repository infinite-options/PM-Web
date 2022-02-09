import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { squareForm, red } from "../utils/styles";

function AddressForm(props) {
  const { errorMessage } = props;
  const [addressState, setAddressState] = props.state;
  const {
    street,
    unit,
    city,
    state,
    zip,
    pm_name,
    pm_number,
    lease_start,
    lease_end,
    rent,
  } = addressState;
  const updateAddressState = (event, field) => {
    const newAddressState = { ...addressState };
    newAddressState[field] = event.target.value;
    setAddressState(newAddressState);
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
    <Container>
      <Row>
        <Col className="px-0">
          <Form.Group className="mx-2 mb-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Street {street === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="Street"
              value={street}
              onChange={(e) => updateAddressState(e, "street")}
            />
          </Form.Group>
        </Col>
        <Col className="px-0">
          <Form.Group className="mx-2 mb-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Unit
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="Unit"
              value={unit}
              onChange={(e) => updateAddressState(e, "unit")}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="px-0">
          <Form.Group className="mx-2 mb-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              City {city === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="City"
              value={city}
              onChange={(e) => updateAddressState(e, "city")}
            />
          </Form.Group>
        </Col>
        <Col className="px-0">
          <Form.Group className="mx-2 mb-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              State {state === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="State"
              value={state}
              onChange={(e) => updateAddressState(e, "state")}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="px-0">
          <Form.Group className="mx-2 mb-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Zip Code {zip === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="Zip"
              value={zip}
              onChange={(e) => updateAddressState(e, "zip")}
            />
          </Form.Group>
        </Col>
        <Col className="px-0" />
      </Row>
      <Row>
        <Col className="px-0">
          <Form.Group className="mx-2 mb-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Name of Property Manager (if renting)
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="Name"
              value={pm_name}
              onChange={(e) => updateAddressState(e, "pm_name")}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="px-0">
          <Form.Group className="mx-2 mb-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Number of Property Manager (if renting)
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="Number"
              value={pm_number}
              onChange={(e) => updateAddressState(e, "pm_number")}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="px-0">
          <Form.Group className="mx-2 mb-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Lease Start Date {lease_start === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="MM/YY"
              value={lease_start}
              onChange={(e) => updateAddressState(e, "lease_start")}
            />
          </Form.Group>
        </Col>
        <Col className="px-0">
          <Form.Group className="mx-2 mb-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Lease End Date
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="MM/YY"
              value={lease_end}
              onChange={(e) => updateAddressState(e, "lease_end")}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="px-0">
          <Form.Group className="mx-2 mb-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Monthly Rent {rent === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="800"
              value={rent}
              onChange={(e) => updateAddressState(e, "rent")}
            />
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
}

export default AddressForm;
