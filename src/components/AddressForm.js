import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { squareForm, red } from "../utils/styles";
import Checkbox from "../components/Checkbox";
import { small, underline, gray, headings } from "../utils/styles";
import ArrowDown from "../icons/ArrowDown.svg";
import { formatPhoneNumber, formatSSN } from "../utils/helper";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});
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
  const classes = useStyles();

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
          <Row className="mx-3">
            <Table
              classes={{ root: classes.customTable }}
              size="small"
              responsive="md"
            >
              <TableHead>
                <TableRow>
                  <TableCell> Street</TableCell>
                  <TableCell> Unit</TableCell>
                  <TableCell> City</TableCell>
                  <TableCell> State</TableCell>
                  <TableCell> Zip</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {" "}
                    {street == "" ? "No Info Provided" : street}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {unit == "" ? "No Info Provided" : unit}
                  </TableCell>
                  <TableCell>
                    {city == "" ? "No Info Provided" : city}
                  </TableCell>
                  <TableCell>
                    {state == "" ? "No Info Provided" : state}
                  </TableCell>
                  <TableCell>{zip == "" ? "No Info Provided" : zip}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Row>

          <div>
            <Row className="my-2" style={headings}>
              <div>Additional details</div>
            </Row>
            <Row className="mx-3">
              {" "}
              <Table
                classes={{ root: classes.customTable }}
                size="small"
                responsive="md"
              >
                <TableHead>
                  <TableRow>
                    <TableCell> Name of the Property Manager</TableCell>
                    <TableCell> Property Manager's Phone Number</TableCell>
                    <TableCell> Lease Start Dates</TableCell>
                    <TableCell> Lease End Dates</TableCell>
                    <TableCell> Monthly Rent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {" "}
                      {pm_name == "" ? "No Info Provided" : pm_name}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {pm_number == "" ? "No Info Provided" : pm_number}
                    </TableCell>
                    <TableCell>
                      {lease_start == "" ? "No Info Provided" : lease_start}
                    </TableCell>
                    <TableCell>
                      {lease_end == "" ? "No Info Provided" : lease_end}
                    </TableCell>
                    <TableCell>
                      {rent == "" ? "No Info Provided" : rent}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Row>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressForm;
