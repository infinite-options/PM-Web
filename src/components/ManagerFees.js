import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "../icons/EditIcon.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";
import ArrowDown from "../icons/ArrowDown.svg";
import {
  pillButton,
  smallPillButton,
  squareForm,
  red,
  hidden,
  small,
} from "../utils/styles";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "2px 2px",
      border: "0.5px solid grey ",
      wordBreak: "break-word",
    },
    width: "100%",
    tableLayout: "fixed",
  },
});

function ManagerFees(props) {
  const classes = useStyles();
  const { feeState, setFeeState, editProfile } = props;
  const [newFee, setNewFee] = React.useState(null);
  const [editingFee, setEditingFee] = React.useState(null);
  let pageURL = window.location.href.split("/");
  const emptyFee = {
    fee_name: "",
    fee_type: "%",
    charge: "",
    of: "Gross Rent",
    frequency: "Weekly",
  };
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
      {console.log(feeState)}
      {editProfile ? (
        <div>
          <Table classes={{ root: classes.customTable }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fee Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Of</TableCell>
                <TableCell>Frequency</TableCell>
                {pageURL[3] !== "propertyDetails" ? (
                  <TableCell>Actions</TableCell>
                ) : (
                  ""
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {feeState.map((fee, i) => (
                <TableRow key={i}>
                  <TableCell>{fee.fee_name}</TableCell>
                  <TableCell>
                    {fee.fee_type === "%" ? `${fee.charge}%` : `$${fee.charge}`}
                  </TableCell>
                  <TableCell>
                    {fee.fee_type === "%" ? `${fee.of}` : ""}
                  </TableCell>
                  <TableCell>{fee.frequency}</TableCell>

                  {pageURL[3] !== "propertyDetails" ? (
                    <TableCell>
                      <img
                        src={EditIcon}
                        alt="Edit"
                        className="px-1 mx-2"
                        onClick={() => editFee(i)}
                      />
                      <img
                        src={DeleteIcon}
                        alt="Delete Icon"
                        className="px-1 mx-2"
                        onClick={() => deleteFee(i)}
                      />
                    </TableCell>
                  ) : (
                    ""
                  )}
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
                      placeholder={
                        newFee.fee_type === "%" ? "amount(%)" : "amount($)"
                      }
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

          {(newFee === null) & (pageURL[3] !== "propertyDetails") ? (
            <Button
              variant="outline-primary"
              style={{ ...smallPillButton, marginTop: "1rem" }}
              onClick={() => setNewFee({ ...emptyFee })}
            >
              Add Fee
            </Button>
          ) : (newFee === null) & (pageURL[3] === "propertyDetails") ? (
            ""
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
                style={{ ...pillButton }}
                onClick={addFee}
                className="mx-2"
              >
                Add Fee
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Table classes={{ root: classes.customTable }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fee Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Of</TableCell>
                <TableCell>Frequency</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feeState.map((fee, i) => (
                <TableRow key={i}>
                  <TableCell>{fee.fee_name}</TableCell>
                  <TableCell>
                    {fee.fee_type === "%" ? `${fee.charge}%` : `$${fee.charge}`}
                  </TableCell>
                  <TableCell>
                    {fee.fee_type === "%" ? `${fee.of}` : ""}
                  </TableCell>
                  <TableCell>{fee.frequency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default ManagerFees;
