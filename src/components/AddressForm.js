import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { squareForm, red } from "../utils/styles";
import Checkbox from "../components/Checkbox";
import { small, underline, gray, headings } from "../utils/styles";
import ArrowDown from "../icons/ArrowDown.svg";
import { formatPhoneNumber, formatSSN } from "../utils/helper";
function AddressForm(props) {
  const {
    errorMessage,
    hideRentingCheckbox,
    selectedState,
    setSelectedState,
    editProfile,
    usePreviousAddress,
    setUsePreviousAddress,
    // previousAddressState,
    diff,
    setDiff,
  } = props;
  const [addressState, setAddressState] = props.state;

  // const extraDet = !!(addressState && (addressState.pm_name || addressState.pm_number));
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
  const handlePhoneNumber = (event, field) => {
    const newAddressState = { ...addressState };
    newAddressState[field] = formatPhoneNumber(event.target.value);
    setAddressState(newAddressState);
  };
  // const updateIfRent = () =>{
  //   if(addressState && (addressState.pm_name || addressState.pm_number)) {
  //     setUseDetailsIfRenting(true);
  //   }
  // }
  // updateIfRent();
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  const [type, setType] = React.useState("Apartment");

  const usStates = [
    {
      name: "Alabama",
      abbreviation: "AL",
    },
    {
      name: "Alaska",
      abbreviation: "AK",
    },
    {
      name: "American Samoa",
      abbreviation: "AS",
    },
    {
      name: "Arizona",
      abbreviation: "AZ",
    },
    {
      name: "Arkansas",
      abbreviation: "AR",
    },
    {
      name: "California",
      abbreviation: "CA",
    },
    {
      name: "Colorado",
      abbreviation: "CO",
    },
    {
      name: "Connecticut",
      abbreviation: "CT",
    },
    {
      name: "Delaware",
      abbreviation: "DE",
    },
    {
      name: "District Of Columbia",
      abbreviation: "DC",
    },
    {
      name: "Federated States Of Micronesia",
      abbreviation: "FM",
    },
    {
      name: "Florida",
      abbreviation: "FL",
    },
    {
      name: "Georgia",
      abbreviation: "GA",
    },
    {
      name: "Guam",
      abbreviation: "GU",
    },
    {
      name: "Hawaii",
      abbreviation: "HI",
    },
    {
      name: "Idaho",
      abbreviation: "ID",
    },
    {
      name: "Illinois",
      abbreviation: "IL",
    },
    {
      name: "Indiana",
      abbreviation: "IN",
    },
    {
      name: "Iowa",
      abbreviation: "IA",
    },
    {
      name: "Kansas",
      abbreviation: "KS",
    },
    {
      name: "Kentucky",
      abbreviation: "KY",
    },
    {
      name: "Louisiana",
      abbreviation: "LA",
    },
    {
      name: "Maine",
      abbreviation: "ME",
    },
    {
      name: "Marshall Islands",
      abbreviation: "MH",
    },
    {
      name: "Maryland",
      abbreviation: "MD",
    },
    {
      name: "Massachusetts",
      abbreviation: "MA",
    },
    {
      name: "Michigan",
      abbreviation: "MI",
    },
    {
      name: "Minnesota",
      abbreviation: "MN",
    },
    {
      name: "Mississippi",
      abbreviation: "MS",
    },
    {
      name: "Missouri",
      abbreviation: "MO",
    },
    {
      name: "Montana",
      abbreviation: "MT",
    },
    {
      name: "Nebraska",
      abbreviation: "NE",
    },
    {
      name: "Nevada",
      abbreviation: "NV",
    },
    {
      name: "New Hampshire",
      abbreviation: "NH",
    },
    {
      name: "New Jersey",
      abbreviation: "NJ",
    },
    {
      name: "New Mexico",
      abbreviation: "NM",
    },
    {
      name: "New York",
      abbreviation: "NY",
    },
    {
      name: "North Carolina",
      abbreviation: "NC",
    },
    {
      name: "North Dakota",
      abbreviation: "ND",
    },
    {
      name: "Northern Mariana Islands",
      abbreviation: "MP",
    },
    {
      name: "Ohio",
      abbreviation: "OH",
    },
    {
      name: "Oklahoma",
      abbreviation: "OK",
    },
    {
      name: "Oregon",
      abbreviation: "OR",
    },
    {
      name: "Palau",
      abbreviation: "PW",
    },
    {
      name: "Pennsylvania",
      abbreviation: "PA",
    },
    {
      name: "Puerto Rico",
      abbreviation: "PR",
    },
    {
      name: "Rhode Island",
      abbreviation: "RI",
    },
    {
      name: "South Carolina",
      abbreviation: "SC",
    },
    {
      name: "South Dakota",
      abbreviation: "SD",
    },
    {
      name: "Tennessee",
      abbreviation: "TN",
    },
    {
      name: "Texas",
      abbreviation: "TX",
    },
    {
      name: "Utah",
      abbreviation: "UT",
    },
    {
      name: "Vermont",
      abbreviation: "VT",
    },
    {
      name: "Virgin Islands",
      abbreviation: "VI",
    },
    {
      name: "Virginia",
      abbreviation: "VA",
    },
    {
      name: "Washington",
      abbreviation: "WA",
    },
    {
      name: "West Virginia",
      abbreviation: "WV",
    },
    {
      name: "Wisconsin",
      abbreviation: "WI",
    },
    {
      name: "Wyoming",
      abbreviation: "WY",
    },
  ];
  function calcDifference() {
    let d1 = lease_start;
    let d2 = lease_end;
    // console.log(d1, d2);

    const yeard1 = d1.substr(3, 6);
    const monthd1 = d1.substr(0, 2);

    d1 = new Date(yeard1, monthd1 - 1);
    const yeard2 = d2.substr(3, 6);
    const monthd2 = d2.substr(0, 2);

    d2 = new Date(yeard2, monthd2 - 1);

    // console.log(d1, d2);
    let difference = (d2 - d1) / (1000 * 60 * 60 * 24 * 30);
    // console.log(difference);
    // console.log(diff, setDiff);
    if (diff !== undefined) {
      setDiff(difference);
      setUsePreviousAddress(true);
    }
  }
  useEffect(() => {
    calcDifference();
  }, [lease_end, diff, setDiff]);

  return (
    <div>
      {editProfile ? (
        <div>
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

                <Form.Select
                  style={{
                    ...squareForm,
                    backgroundImage: `url(${ArrowDown})`,
                  }}
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  {usStates.map((state, i) => (
                    <option value={state.abbreviation} key={i}>
                      {state.name}
                    </option>
                  ))}
                </Form.Select>
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
          {!hideRentingCheckbox ? (
            <Row>
              <Col
                style={{ marginLeft: "-8px" }}
                xs={2}
                className="px-0 d-flex justify-content-end align-items-center"
              >
                <div>
                  <Checkbox
                    type="BOX"
                    onClick={() => setUseDetailsIfRenting(!useDetailsIfRenting)}
                  />
                </div>
              </Col>
              <Col>
                <p
                  style={{ ...underline, ...small }}
                  className="text-primary mb-3 me-3"
                >
                  Add additional details (If renting)
                </p>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {useDetailsIfRenting || hideRentingCheckbox ? (
            <div>
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
                      value={pm_number}
                      placeholder="(xxx)xxx-xxxx"
                      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                      // onChange={(e) => updateAddressState(e, "pm_number")}
                      onChange={(e) => handlePhoneNumber(e, "pm_number")}
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
                      placeholder="MM/YYYY"
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
                      placeholder="MM/YYYY"
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
              {/* <Row>
                <Col
                  xs={2}
                  className="px-0 d-flex justify-content-end align-items-center"
                >
                  <div>
                    <Checkbox
                      type="BOX"
                      onClick={() => setUsePreviousAddress(!usePreviousAddress)}
                    />
                  </div>
                </Col>
                <Col>
                  <p
                    style={{ ...underline, ...small }}
                    className="text-primary mb-1 me-3"
                  >
                    Add another property manager reference if your last lease
                    was for less than 2 years.
                  </p>
                </Col>
              </Row> */}
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className="my-2">
          <Row>
            <Col>
              {" "}
              <h6>Street</h6>
              <p style={gray}>
                {street && street !== "NULL"
                  ? street
                  : "No street address Provided"}
              </p>
            </Col>
            <Col>
              <h6>Unit</h6>
              <p style={gray}>{unit && unit !== "NULL" ? unit : ""}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h6>City</h6>
              <p style={gray}>{city && city !== "NULL" ? city : ""}</p>
            </Col>
            <Col>
              <h6>State</h6>
              <p style={gray}>{state && state !== "NULL" ? state : ""}</p>
            </Col>
            <Col>
              <h6>Zip</h6>
              <p style={gray}>{zip && zip !== "NULL" ? zip : ""}</p>
            </Col>
          </Row>

          <div>
            <Row className="mb-4" style={headings}>
              <div>Additional details</div>
            </Row>

            <Row>
              <Col>
                <h6> Name of Property Manager (if renting)</h6>
                <p style={gray}>
                  {pm_name && pm_name !== "NULL"
                    ? pm_name
                    : "No  name Provided"}
                </p>
              </Col>
              <Col>
                {" "}
                <h6>Property Manager's phone number (if renting)</h6>
                <p style={gray}>
                  {pm_number && pm_number !== "NULL"
                    ? pm_number
                    : "No phone number Provided"}
                </p>
              </Col>
            </Row>

            <Row>
              <Col>
                <h6>Lease Start Date</h6>
                <p style={gray}>
                  {lease_start && lease_start !== "NULL" ? lease_start : ""}
                </p>
              </Col>
              <Col>
                <h6>Lease End Date</h6>
                <p style={gray}>
                  {lease_end && lease_end !== "NULL" ? lease_end : ""}
                </p>
              </Col>
              <Col>
                <h6> Monthly Rent</h6>
                <p style={gray}>{rent && rent !== "NULL" ? rent : ""}</p>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressForm;
