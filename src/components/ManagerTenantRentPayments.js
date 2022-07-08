import React from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import EditIcon from "../icons/EditIcon.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";
import ArrowDown from "../icons/ArrowDown.svg";
import {
  pillButton,
  smallPillButton,
  squareForm,
  gray,
  red,
  hidden,
  small,
} from "../utils/styles";

function ManagerTenantRentPayments(props) {
  // const [feeState, setFeeState] = props.state;
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
  } = props;
  console.log(props);
  const [newFee, setNewFee] = React.useState(null);
  const [editingFee, setEditingFee] = React.useState(null);
  const emptyFee = {
    fee_name: "",
    fee_type: "%",
    charge: "",
    of: "Gross Rent",
    frequency: "Weekly",
    available_topay: "",
    due_by: "",
    late_by: "",
    late_fee: "",
    perDay_late_fee: "",
  };

  React.useEffect(() => {
    if (feeState.length === 0) {
      const depositFee = {
        fee_name: "Deposit",
        fee_type: "$",
        charge: property.deposit.toString(),
        of: "Gross Rent",
        frequency: "One-time",
        available_topay: available,
        due_by: startDate,
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

      const newFeeState = [...feeState];
      newFeeState.push({ ...depositFee });
      newFeeState.push({ ...rentFee });
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
  const [errorMessage, setErrorMessage] = React.useState("");
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
      {feeState.map((fee, i) => (
        <div key={i}>
          <div className="d-flex">
            <div className="flex-grow-1">
              <h6 className="mb-1">{fee.fee_name}</h6>
            </div>
            <div>
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
            </div>
          </div>
          <p style={gray} className="mb-1">
            {fee.fee_type === "%"
              ? `${fee.charge}% of ${fee.of}`
              : `$${fee.charge}`}{" "}
            {fee.frequency}
          </p>
          <hr className="mt-1" />
        </div>
      ))}
      {newFee !== null ? (
        <Container>
          <Row className="my-3">
            <Col className="ps-0">
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Fee Name {newFee.fee_name === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  placeholder="Service Charge"
                  value={newFee.fee_name}
                  onChange={(e) => changeNewFee(e, "fee_name")}
                />
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
                  style={squareForm}
                  placeholder="10"
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
                  Late fees after(days)
                </Form.Label>
                <Form.Control
                  type="number"
                  style={squareForm}
                  placeholder="10"
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
                  style={squareForm}
                  placeholder="10"
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
                  style={squareForm}
                  placeholder="10"
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
