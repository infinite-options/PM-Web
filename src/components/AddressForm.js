import React from "react";
import { Container, Row, Col, Form, DropdownButton, Dropdown } from "react-bootstrap";
import { squareForm, red } from "../utils/styles";
import Checkbox from "../components/Checkbox";
import {
  small,
  underline,
} from "../utils/styles";
function AddressForm(props) {
  const { errorMessage, hideRentingCheckbox, selectedState, setSelectedState} = props;
  const [addressState, setAddressState] = props.state;
  const [useDetailsIfRenting, setUseDetailsIfRenting] = React.useState(false);
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

  const usStates = [
      { name: 'ALABAMA', abbreviation: 'AL'},
      { name: 'ALASKA', abbreviation: 'AK'},
      { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
      { name: 'ARIZONA', abbreviation: 'AZ'},
      { name: 'ARKANSAS', abbreviation: 'AR'},
      { name: 'CALIFORNIA', abbreviation: 'CA'},
      { name: 'COLORADO', abbreviation: 'CO'},
      { name: 'CONNECTICUT', abbreviation: 'CT'},
      { name: 'DELAWARE', abbreviation: 'DE'},
      { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
      { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
      { name: 'FLORIDA', abbreviation: 'FL'},
      { name: 'GEORGIA', abbreviation: 'GA'},
      { name: 'GUAM', abbreviation: 'GU'},
      { name: 'HAWAII', abbreviation: 'HI'},
      { name: 'IDAHO', abbreviation: 'ID'},
      { name: 'ILLINOIS', abbreviation: 'IL'},
      { name: 'INDIANA', abbreviation: 'IN'},
      { name: 'IOWA', abbreviation: 'IA'},
      { name: 'KANSAS', abbreviation: 'KS'},
      { name: 'KENTUCKY', abbreviation: 'KY'},
      { name: 'LOUISIANA', abbreviation: 'LA'},
      { name: 'MAINE', abbreviation: 'ME'},
      { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
      { name: 'MARYLAND', abbreviation: 'MD'},
      { name: 'MASSACHUSETTS', abbreviation: 'MA'},
      { name: 'MICHIGAN', abbreviation: 'MI'},
      { name: 'MINNESOTA', abbreviation: 'MN'},
      { name: 'MISSISSIPPI', abbreviation: 'MS'},
      { name: 'MISSOURI', abbreviation: 'MO'},
      { name: 'MONTANA', abbreviation: 'MT'},
      { name: 'NEBRASKA', abbreviation: 'NE'},
      { name: 'NEVADA', abbreviation: 'NV'},
      { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
      { name: 'NEW JERSEY', abbreviation: 'NJ'},
      { name: 'NEW MEXICO', abbreviation: 'NM'},
      { name: 'NEW YORK', abbreviation: 'NY'},
      { name: 'NORTH CAROLINA', abbreviation: 'NC'},
      { name: 'NORTH DAKOTA', abbreviation: 'ND'},
      { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
      { name: 'OHIO', abbreviation: 'OH'},
      { name: 'OKLAHOMA', abbreviation: 'OK'},
      { name: 'OREGON', abbreviation: 'OR'},
      { name: 'PALAU', abbreviation: 'PW'},
      { name: 'PENNSYLVANIA', abbreviation: 'PA'},
      { name: 'PUERTO RICO', abbreviation: 'PR'},
      { name: 'RHODE ISLAND', abbreviation: 'RI'},
      { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
      { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
      { name: 'TENNESSEE', abbreviation: 'TN'},
      { name: 'TEXAS', abbreviation: 'TX'},
      { name: 'UTAH', abbreviation: 'UT'},
      { name: 'VERMONT', abbreviation: 'VT'},
      { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
      { name: 'VIRGINIA', abbreviation: 'VA'},
      { name: 'WASHINGTON', abbreviation: 'WA'},
      { name: 'WEST VIRGINIA', abbreviation: 'WV'},
      { name: 'WISCONSIN', abbreviation: 'WI'},
      { name: 'WYOMING', abbreviation: 'WY' }
  ];
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
      </Row>
      <Row>
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
      </Row>
      <Row>
       
        <Col className="px-0">
          <Form.Group className="mx-2 mb-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              State {state === "" ? required : ""}
            </Form.Label>
            <DropdownButton variant="light" id="dropdown-basic-button" title={selectedState} >
                {usStates.map((state, i) => (
                  <Dropdown.Item  onClick={() => setSelectedState(state.abbreviation)} href="#/action-1" > {state.abbreviation} </Dropdown.Item>
                  ))}  
            </DropdownButton>
          
          </Form.Group>
        </Col>
        
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
      </Row>
      <Row>
       
        <Col className="px-0" />
      </Row>
      {!hideRentingCheckbox ? 
      (<Row>
             <Col style={{marginLeft:"-8px"}} xs={2}  className="px-0 d-flex justify-content-end align-items-center"  >
                <div>
                  <Checkbox  type="BOX"  onClick={() => setUseDetailsIfRenting(!useDetailsIfRenting)}
                  />
                </div>
            </Col>
            <Col>
              <p  style={{ ...underline, ...small }}   className="text-primary mb-3 me-3" >
                Add additional details (If renting)
              </p>
          </Col>
      </Row>)
      :
      ("")}
      
    { (useDetailsIfRenting || hideRentingCheckbox) ?
     ( <div>
          <h5 className="mx-2 my-3">Additional details</h5>
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
                  Property Manager's phone number (if renting)
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
      </div>
      ) : (
        ""
        )}
    </Container>
  );
}

export default AddressForm;
