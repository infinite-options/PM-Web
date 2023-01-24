import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "../../icons/EditIcon.svg";
import DeleteIcon from "../../icons/DeleteIcon.svg";
import ArrowDown from "../../icons/ArrowDown.svg";
import {
  pillButton,
  smallPillButton,
  squareForm,
  gray,
  red,
  hidden,
  small,
} from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});

function ManagerTenantRentPayments(props) {
  // const [feeState, setFeeState] = props.state;
  const classes = useStyles();
  const {
    feeState,
    setFeeState,
    property,
    endDate,
    startDate,
    dueDate,
    lateAfter,
    lateFee,
    lateFeePer,
    available,
    agreement,
  } = props;
  // console.log(agreement);
  const [newFee, setNewFee] = useState(null);
  const [defaultFee, setDefaultFee] = useState([null]);
  const [editingFee, setEditingFee] = useState(null);
  const emptyFee = {
    fee_name: "",
    fee_type: "%",
    charge: "",
    of: "Gross Rent",
    frequency: "Weekly",
    available_topay: available,
    due_by: dueDate,
    late_by: lateAfter,
    late_fee: lateFee,
    perDay_late_fee: lateFeePer,
  };
  // console.log(feeState);
  useEffect(() => {
    if (agreement === null) {
      const depositFee = {
        fee_name: "Deposit",
        fee_type: "$",
        charge: property.deposit.toString(),
        of: "Gross Rent",
        frequency: "One-time",
        available_topay: available,
        due_by: startDate.split("-")[2],
        late_by: lateAfter,
        late_fee: lateFee,
        perDay_late_fee: lateFeePer,
      };
      const rentFee = {
        fee_name: "Rent",
        fee_type: "$",
        charge: property.listed_rent.toString(),
        of: "Gross Rent",
        frequency: "Monthly",
        available_topay: available,
        due_by: dueDate,
        late_by: lateAfter,
        late_fee: lateFee,
        perDay_late_fee: lateFeePer,
      };

      const newFeeState = [];
      newFeeState.push({ ...depositFee });
      newFeeState.push({ ...rentFee });
      // console.log(rentFee);
      // console.log(depositFee);
      setFeeState(newFeeState);
    } else {
      const depositFee = {
        fee_name: "Deposit",
        fee_type: "$",
        charge: property.deposit.toString(),
        of: "Gross Rent",
        frequency: "One-time",
        available_topay: available,
        due_by: startDate.split("-")[2],
        late_by: lateAfter,
        late_fee: lateFee,
        perDay_late_fee: lateFeePer,
      };
      const rentFee = {
        fee_name: "Rent",
        fee_type: "$",
        charge: property.listed_rent.toString(),
        of: "Gross Rent",
        frequency: "Monthly",
        available_topay: available,
        due_by: dueDate,
        late_by: lateAfter,
        late_fee: lateFee,
        perDay_late_fee: lateFeePer,
      };

      const newFeeState = [];
      newFeeState.push({ ...depositFee });
      newFeeState.push({ ...rentFee });
      // console.log(rentFee);
      // console.log(depositFee);

      for (let i = 0; i < feeState.length; i++) {
        if (
          feeState[i]["fee_name"] !== "Deposit" &&
          feeState[i]["fee_name"] !== "Rent"
        ) {
          newFeeState.push(feeState[i]);
        }
      }
      setFeeState(newFeeState);
    }
  }, [available, dueDate, lateAfter, lateFee, lateFeePer]);

  const addFee = () => {
    if (newFee.fee_name === "" || newFee.charge === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    const newFeeState = [...feeState];
    newFeeState.push({ ...newFee });
    setFeeState(newFeeState);
    setNewFee(null);
    setEditingFee(null);
    setErrorMessage("");
  };
  const cancelEdit = () => {
    setNewFee(null);
    setErrorMessage("");
    if (editingFee !== null) {
      const newFeeState = [...feeState];
      newFeeState.push(editingFee);
      setFeeState(newFeeState);
    }
    setEditingFee(null);
  };
  const editFee = (i) => {
    const newFeeState = [...feeState];
    const fee = newFeeState.splice(i, 1)[0];
    setFeeState(newFeeState);
    setEditingFee(fee);
    setNewFee({ ...fee });
    // setEditingFee(null);
  };
  const deleteFee = (i) => {
    const newFeeState = [...feeState];
    newFeeState.splice(i, 1);
    setFeeState(newFeeState);
  };
  const changeNewFee = (event, field) => {
    const changedFee = { ...newFee };
    changedFee[field] = event.target.value;
    setNewFee(changedFee);
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
  function ordinal_suffix_of(i) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }
  return (
    <div>
      <Table classes={{ root: classes.customTable }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Fee Name</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Of</TableCell>
            <TableCell>Frequency</TableCell>
            <TableCell>Available to Pay</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Late Fees After (days)</TableCell>
            <TableCell>Late Fee (one-time)</TableCell>
            <TableCell>Late Fee (per day)</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feeState.map((fee, i) => (
            <TableRow
              key={i}
              className="p-1 mb-2"
              style={{
                boxShadow: " 0px 1px 6px #00000029",
                borderRadius: "5px",
              }}
            >
              <TableCell>{fee.fee_name}</TableCell>
              <TableCell>
                {fee.fee_type === "%" ? `${fee.charge}%` : `$${fee.charge}`}
              </TableCell>
              <TableCell>{fee.fee_type === "%" ? `${fee.of}` : ""}</TableCell>
              <TableCell>{fee.frequency}</TableCell>
              <TableCell>{`${fee.available_topay} days before`}</TableCell>
              <TableCell>
                {fee.due_by == ""
                  ? `1st of the month`
                  : `${ordinal_suffix_of(fee.due_by)} of the month`}
              </TableCell>
              <TableCell>{fee.late_by} days</TableCell>
              <TableCell>${fee.late_fee}</TableCell>
              <TableCell>${fee.perDay_late_fee}/day</TableCell>
              <TableCell>
                {" "}
                <img
                  src={EditIcon}
                  alt="Edit"
                  className="px-1 mx-2"
                  onClick={() => editFee(i)}
                />
                <img
                  src={DeleteIcon}
                  alt="Delete"
                  className="px-1 mx-2"
                  onClick={() => deleteFee(i)}
                />
              </TableCell>

              <p style={gray} className="mb-1"></p>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {newFee !== null ? (
        <Container>
          <Row className="my-3">
            <Col className="ps-0">
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Fee Name {newFee.fee_name === "" ? required : ""}
                </Form.Label>
                {agreement !== null && editingFee !== null ? (
                  <Form.Control
                    style={squareForm}
                    placeholder="Service Charge"
                    value={newFee.fee_name}
                    onChange={(e) => changeNewFee(e, "fee_name")}
                    disabled
                  />
                ) : (
                  <Form.Control
                    style={squareForm}
                    placeholder="Service Charge"
                    value={newFee.fee_name}
                    onChange={(e) => changeNewFee(e, "fee_name")}
                  />
                )}
              </Form.Group>
            </Col>
            <Col className="px-0">
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Charge Type
                </Form.Label>
                <Form.Select
                  style={{
                    ...squareForm,
                    backgroundImage: `url(${ArrowDown})`,
                  }}
                  value={newFee.fee_type}
                  onChange={(e) => changeNewFee(e, "fee_type")}
                >
                  <option>%</option>
                  <option>$</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="my-3">
            <Col className="ps-0">
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Charge {newFee.charge === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  placeholder={newFee.fee_type === "%" ? "10" : "100"}
                  value={newFee.charge}
                  onChange={(e) => changeNewFee(e, "charge")}
                />
              </Form.Group>
            </Col>
            {newFee.fee_type === "%" ? (
              <Col className="ps-0">
                <Form.Group>
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Of
                  </Form.Label>
                  <Form.Select
                    style={{
                      ...squareForm,
                      backgroundImage: `url(${ArrowDown})`,
                    }}
                    value={newFee.of}
                    onChange={(e) => changeNewFee(e, "of")}
                  >
                    <option>Gross Rent</option>
                    <option>Net Rent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            ) : (
              ""
            )}
            <Col className="px-0">
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Frequency
                </Form.Label>
                {agreement !== null && editingFee !== null ? (
                  <Form.Select
                    style={{
                      ...squareForm,
                      backgroundImage: `url(${ArrowDown})`,
                    }}
                    value={newFee.frequency}
                    onChange={(e) => changeNewFee(e, "frequency")}
                    disabled
                  >
                    <option>Weekly</option>
                    <option>Biweekly</option>
                    <option>Monthly</option>
                    <option>Annually</option>
                    <option>Move-Out Charge</option>
                    <option>Move-In Charge</option>
                    <option>One-time</option>
                  </Form.Select>
                ) : (
                  <Form.Select
                    style={{
                      ...squareForm,
                      backgroundImage: `url(${ArrowDown})`,
                    }}
                    value={newFee.frequency}
                    onChange={(e) => changeNewFee(e, "frequency")}
                  >
                    <option>Weekly</option>
                    <option>Biweekly</option>
                    <option>Monthly</option>
                    <option>Annually</option>
                    <option>Move-Out Charge</option>
                    <option>Move-In Charge</option>
                    <option>One-time</option>
                  </Form.Select>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="my-3">
            <Col className="ps-0">
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Available to pay(days before due)
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  style={squareForm}
                  placeholder="days"
                  value={newFee.available_topay}
                  onChange={(e) => changeNewFee(e, "available_topay")}
                />
              </Form.Group>
            </Col>
            <Col className="px-0">
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Due Date
                </Form.Label>
                {newFee.frequency === "Weekly" ? (
                  <Form.Select
                    value={newFee.due_by}
                    onChange={(e) => changeNewFee(e, "due_by")}
                    style={{
                      ...squareForm,
                      backgroundImage: `url(${ArrowDown})`,
                    }}
                  >
                    <option value="0">Monday</option>
                    <option value="1">Tuesday</option>
                    <option value="2">Wednesday</option>
                    <option value="3">Thursday</option>
                    <option value="4">Friday</option>
                    <option value="5">Saturday</option>
                    <option value="6">Sunday</option>
                  </Form.Select>
                ) : newFee.frequency === "Biweekly" ? (
                  <Form.Select
                    value={newFee.due_by}
                    onChange={(e) => changeNewFee(e, "due_by")}
                    style={{
                      ...squareForm,
                      backgroundImage: `url(${ArrowDown})`,
                    }}
                  >
                    <option value="0">Monday</option>
                    <option value="1">Tuesday</option>
                    <option value="2">Wednesday</option>
                    <option value="3">Thursday</option>
                    <option value="4">Friday</option>
                    <option value="5">Saturday</option>
                    <option value="6">Sunday</option>
                  </Form.Select>
                ) : newFee.frequency === "Monthly" ? (
                  <Form.Select
                    value={newFee.due_by}
                    onChange={(e) => changeNewFee(e, "due_by")}
                    style={{
                      ...squareForm,
                      backgroundImage: `url(${ArrowDown})`,
                    }}
                  >
                    <option value="1">1st of the month</option>
                    <option value="2">2nd of the month</option>
                    <option value="3">3rd of the month</option>
                    <option value="4">4th of the month</option>
                    <option value="5">5th of the month</option>
                    <option value="10">10th of the month</option>
                    <option value="15">15th of the month</option>
                    <option value="20">20th of the month</option>
                    <option value="25">25th of the month</option>
                  </Form.Select>
                ) : newFee.frequency === "Annually" ? (
                  <Form.Select
                    value={newFee.due_by}
                    onChange={(e) => changeNewFee(e, "due_by")}
                    style={{
                      ...squareForm,
                      backgroundImage: `url(${ArrowDown})`,
                    }}
                  >
                    <option value="1">1st of the month</option>
                    <option value="2">2nd of the month</option>
                    <option value="3">3rd of the month</option>
                    <option value="4">4th of the month</option>
                    <option value="5">5th of the month</option>
                    <option value="10">10th of the month</option>
                    <option value="15">15th of the month</option>
                    <option value="20">20th of the month</option>
                    <option value="25">25th of the month</option>
                  </Form.Select>
                ) : newFee.frequency === "Move-Out Charge" ? (
                  <Form.Select
                    value={newFee.due_by}
                    onChange={(e) => changeNewFee(e, "due_by")}
                    style={{
                      ...squareForm,
                      backgroundImage: `url(${ArrowDown})`,
                    }}
                  >
                    <option>{endDate}</option>
                  </Form.Select>
                ) : newFee.frequency === "Move-In Charge" ? (
                  <Form.Select
                    value={newFee.due_by}
                    onChange={(e) => changeNewFee(e, "due_by")}
                    style={{
                      ...squareForm,
                      backgroundImage: `url(${ArrowDown})`,
                    }}
                  >
                    <option>{startDate}</option>
                  </Form.Select>
                ) : (
                  <Form.Select
                    value={newFee.due_by}
                    onChange={(e) => changeNewFee(e, "due_by")}
                    style={{
                      ...squareForm,
                      backgroundImage: `url(${ArrowDown})`,
                    }}
                  >
                    <option>{startDate}</option>
                  </Form.Select>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="my-3">
            <Col className="ps-0">
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Late fees after (days)
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  style={squareForm}
                  placeholder="days"
                  value={newFee.late_by}
                  onChange={(e) => changeNewFee(e, "late_by")}
                />
              </Form.Group>
            </Col>
            <Col className="ps-0">
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Late Fee (one-time)
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  style={squareForm}
                  placeholder="amount($)"
                  value={newFee.late_fee}
                  onChange={(e) => changeNewFee(e, "late_fee")}
                />
              </Form.Group>
            </Col>
            <Col className="px-0">
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Late Fee (per day)
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  style={squareForm}
                  placeholder="amount($)"
                  value={newFee.perDay_late_fee}
                  onChange={(e) => changeNewFee(e, "perDay_late_fee")}
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

      {newFee === null ? (
        <Button
          variant="outline-primary"
          style={smallPillButton}
          onClick={() => setNewFee({ ...emptyFee })}
        >
          Add Fee
        </Button>
      ) : editingFee !== null ? (
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
            onClick={addFee}
            className="mx-2"
          >
            Update Fee
          </Button>
        </div>
      ) : (
        <div className="d-flex justify-content-center my-4">
          <Button
            variant="outline-primary"
            style={pillButton}
            onClick={() => {
              setNewFee(null);
              setEditingFee(null);
            }}
            className="mx-2"
          >
            Cancel
          </Button>
          <Button
            variant="outline-primary"
            style={pillButton}
            onClick={addFee}
            className="mx-2"
          >
            Add Fee
          </Button>
        </div>
      )}
    </div>
  );
}

export default ManagerTenantRentPayments;
