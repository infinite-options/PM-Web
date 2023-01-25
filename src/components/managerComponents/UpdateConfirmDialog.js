import React, { useState } from "react";

import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import File from "../../icons/File.svg";
import { smallPillButton, smallImg, mediumBold } from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});
function ConfirmDialog3(props) {
  const classes = useStyles();
  const {
    title,
    updatedAgreement,
    oldAgreement,
    isOpen,
    onConfirm,
    onCancel,
    button1,
    button2,
  } = props;
  console.log("updatedAgreement", updatedAgreement);
  console.log("oldAgreement", oldAgreement);
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
  Array.prototype.includesObj = function (obj) {
    for (let i = 0; i < this.length; i++) {
      if (
        JSON.stringify(this[i], Object.keys(this[i]).sort()) ===
        JSON.stringify(obj, Object.keys(obj).sort())
      )
        return true;
    }
    return false;
  };
  return (
    <div>
      <Dialog
        open={isOpen}
        // onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {title}
          </DialogContentText>
        </DialogContent>
        {updatedAgreement !== undefined ? (
          <DialogContent>
            <Row className="mb-4 m-3" style={{ hidden: "overflow" }}>
              <h5>Lease Details</h5>
              <div>
                <Table
                  responsive="md"
                  classes={{ root: classes.customTable }}
                  size="small"
                >
                  {/* {console.log(updatedAgreement)} */}
                  <TableHead>
                    <TableRow>
                      <TableCell>Lease Start</TableCell>

                      <TableCell>Lease End</TableCell>

                      <TableCell>Effective Date</TableCell>

                      <TableCell>Rent Due</TableCell>

                      <TableCell>Late Fees After (days)</TableCell>

                      <TableCell>Late Fee (one-time)</TableCell>

                      <TableCell>Late Fee (per day)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        style={{
                          color:
                            updatedAgreement.lease_start ===
                            oldAgreement.lease_start
                              ? "black"
                              : "red",
                        }}
                      >
                        {updatedAgreement.lease_start}
                      </TableCell>

                      <TableCell
                        style={{
                          color:
                            updatedAgreement.lease_end ===
                            oldAgreement.lease_end
                              ? "black"
                              : "red",
                        }}
                      >
                        {updatedAgreement.lease_end}
                      </TableCell>

                      <TableCell
                        style={{
                          color:
                            updatedAgreement.effective_date ===
                            oldAgreement.effective_date
                              ? "black"
                              : "red",
                        }}
                      >
                        {updatedAgreement.effective_date}
                      </TableCell>

                      <TableCell
                        style={{
                          color:
                            updatedAgreement.due_by === oldAgreement.due_by
                              ? "black"
                              : "red",
                        }}
                      >
                        {`${ordinal_suffix_of(
                          updatedAgreement.due_by
                        )} of the month`}
                      </TableCell>

                      <TableCell
                        style={{
                          color:
                            updatedAgreement.late_by === oldAgreement.late_by
                              ? "black"
                              : "red",
                        }}
                      >
                        {updatedAgreement.late_by} days
                      </TableCell>
                      <TableCell
                        style={{
                          color:
                            updatedAgreement.late_fee === oldAgreement.late_fee
                              ? "black"
                              : "red",
                        }}
                      >
                        {" "}
                        ${updatedAgreement.late_fee}
                      </TableCell>

                      <TableCell
                        style={{
                          color:
                            updatedAgreement.perDay_late_fee ===
                            oldAgreement.perDay_late_fee
                              ? "black"
                              : "red",
                        }}
                      >
                        {" "}
                        ${updatedAgreement.perDay_late_fee}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Row>
            {console.log(oldAgreement.length !== 0)}
            {/* {oldAgreement.length !== 0 && updatedAgreement.length !== 0 ? (
              <Row className="mb-4 m-3" style={{ hidden: "overflow" }}>
                <h5>Lease Payments</h5>
                <div>
                  <Table
                    responsive="md"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
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
                      </TableRow>
                    </TableHead>
                    {console.log(JSON.parse(oldAgreement.rent_payments))}
                    {console.log(updatedAgreement.rent_payments)}
                    <TableBody>
                      {updatedAgreement.rent_payments.map((fee, i) => {
                        return JSON.parse(
                          oldAgreement.rent_payments
                        ).includesObj(fee) ? (
                          <TableRow>
                            {console.log(
                              JSON.parse(
                                oldAgreement.rent_payments
                              ).includesObj(fee)
                            )}
                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              {fee.fee_name}
                            </TableCell>

                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              {fee.fee_type === "%"
                                ? `${fee.charge}%`
                                : `$${fee.charge}`}
                            </TableCell>

                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              {fee.fee_type === "%" ? `${fee.of}` : ""}
                            </TableCell>

                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              {fee.frequency}
                            </TableCell>
                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              {`${fee.available_topay} days before`}
                            </TableCell>
                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              {fee.due_by == ""
                                ? `1st of the month`
                                : `${ordinal_suffix_of(
                                    fee.due_by
                                  )} of the month`}
                            </TableCell>
                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              {fee.late_by} days
                            </TableCell>
                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              ${fee.late_fee}
                            </TableCell>
                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              ${fee.perDay_late_fee}/day
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow>
                            {console.log(
                              "here false",
                              JSON.parse(
                                oldAgreement.rent_payments
                              ).includesObj(fee),
                              updatedAgreement.rent_payments[i]
                            )}
                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              {updatedAgreement.rent_payments[i].fee_name}
                            </TableCell>

                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              {updatedAgreement.rent_payments[i].fee_type ===
                              "%"
                                ? `${updatedAgreement.rent_payments[i].charge}%`
                                : `$${updatedAgreement.rent_payments[i].charge}`}
                            </TableCell>

                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              {updatedAgreement.rent_payments[i].fee_type ===
                              "%"
                                ? `${updatedAgreement.rent_payments[i].of}`
                                : ""}
                            </TableCell>

                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              {updatedAgreement.rent_payments[i].frequency}
                            </TableCell>
                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              {`${updatedAgreement.rent_payments[i].available_topay} days before`}
                            </TableCell>
                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              {updatedAgreement.rent_payments[i].due_by == ""
                                ? `1st of the month`
                                : `${ordinal_suffix_of(
                                    updatedAgreement.rent_payments[i].due_by
                                  )} of the month`}
                            </TableCell>
                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              {updatedAgreement.rent_payments[i].late_by} days
                            </TableCell>
                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              ${updatedAgreement.rent_payments[i].late_fee}
                            </TableCell>
                            <TableCell
                              style={{
                                color: JSON.parse(
                                  oldAgreement.rent_payments
                                ).includesObj(fee)
                                  ? "black"
                                  : "red",
                              }}
                            >
                              $
                              {
                                updatedAgreement.rent_payments[i]
                                  .perDay_late_fee
                              }
                              /day
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </Row>
            ) : (
              ""
            )} */}

            {oldAgreement.length !== 0 && updatedAgreement.length !== 0 ? (
              <Row className="mb-4 m-3" style={{ hidden: "overflow" }}>
                <h5>Lease Payments</h5>
                <div>
                  <Table
                    responsive="md"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {JSON.parse(oldAgreement.rent_payments).map((fee, i) => {
                        return updatedAgreement.rent_payments.includesObj(
                          fee
                        ) ? (
                          <TableRow>
                            <TableCell
                              style={{
                                color:
                                  updatedAgreement.rent_payments.includesObj(
                                    fee
                                  )
                                    ? "black"
                                    : "red",
                              }}
                            >
                              {fee.fee_name}
                            </TableCell>

                            <TableCell
                              style={{
                                color:
                                  updatedAgreement.rent_payments.includesObj(
                                    fee
                                  )
                                    ? "black"
                                    : "red",
                              }}
                            >
                              {fee.fee_type === "%"
                                ? `${fee.charge}%`
                                : `$${fee.charge}`}
                            </TableCell>

                            <TableCell
                              style={{
                                color:
                                  updatedAgreement.rent_payments.includesObj(
                                    fee
                                  )
                                    ? "black"
                                    : "red",
                              }}
                            >
                              {fee.fee_type === "%" ? `${fee.of}` : ""}
                            </TableCell>

                            <TableCell
                              style={{
                                color:
                                  updatedAgreement.rent_payments.includesObj(
                                    fee
                                  )
                                    ? "black"
                                    : "red",
                              }}
                            >
                              {fee.frequency}
                            </TableCell>
                            <TableCell
                              style={{
                                color:
                                  updatedAgreement.rent_payments.includesObj(
                                    fee
                                  )
                                    ? "black"
                                    : "red",
                              }}
                            >
                              {`${fee.available_topay} days before`}
                            </TableCell>
                            <TableCell
                              style={{
                                color:
                                  updatedAgreement.rent_payments.includesObj(
                                    fee
                                  )
                                    ? "black"
                                    : "red",
                              }}
                            >
                              {fee.due_by == ""
                                ? `1st of the month`
                                : `${ordinal_suffix_of(
                                    fee.due_by
                                  )} of the month`}
                            </TableCell>
                            <TableCell
                              style={{
                                color:
                                  updatedAgreement.rent_payments.includesObj(
                                    fee
                                  )
                                    ? "black"
                                    : "red",
                              }}
                            >
                              {fee.late_by} days
                            </TableCell>
                            <TableCell
                              style={{
                                color:
                                  updatedAgreement.rent_payments.includesObj(
                                    fee
                                  )
                                    ? "black"
                                    : "red",
                              }}
                            >
                              ${fee.late_fee}
                            </TableCell>
                            <TableCell
                              style={{
                                color:
                                  updatedAgreement.rent_payments.includesObj(
                                    fee
                                  )
                                    ? "black"
                                    : "red",
                              }}
                            >
                              ${fee.perDay_late_fee}/day
                            </TableCell>
                          </TableRow>
                        ) : !updatedAgreement.rent_payments.includesObj(fee) &&
                          updatedAgreement.rent_payments.some(
                            (e) => fee.fee_name === e.fee_name
                          ) ? (
                          <TableRow>
                            <TableCell
                              style={{
                                color:
                                  updatedAgreement.rent_payments.includesObj(
                                    fee
                                  )
                                    ? "black"
                                    : "red",
                              }}
                            >
                              {fee.fee_name}
                            </TableCell>

                            <TableCell>
                              {/* {fee.fee_type === "%"
                                ? `${fee.charge}%`
                                : `$${fee.charge}`} */}
                              {updatedAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).charge == fee.charge ? (
                                <div style={{ color: "black" }}>
                                  {fee.fee_type === "%"
                                    ? `${fee.charge}%`
                                    : `$${fee.charge}`}
                                </div>
                              ) : (
                                <div style={{ color: "red" }}>
                                  {updatedAgreement.rent_payments.find(
                                    (temp) => fee.fee_name === temp.fee_name
                                  ).fee_type === "%"
                                    ? `${
                                        updatedAgreement.rent_payments.find(
                                          (temp) =>
                                            fee.fee_name === temp.fee_name
                                        ).charge
                                      }%`
                                    : `$${
                                        updatedAgreement.rent_payments.find(
                                          (temp) =>
                                            fee.fee_name === temp.fee_name
                                        ).charge
                                      }`}
                                </div>
                              )}
                            </TableCell>

                            <TableCell>
                              {updatedAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).of == fee.of ? (
                                <div style={{ color: "black" }}>
                                  {fee.fee_type === "%" ? `${fee.of}` : ""}
                                </div>
                              ) : (
                                <div style={{ color: "red" }}>
                                  {updatedAgreement.rent_payments.find(
                                    (temp) => fee.fee_name === temp.fee_name
                                  ).fee_type === "%"
                                    ? `${
                                        updatedAgreement.rent_payments.find(
                                          (temp) =>
                                            fee.fee_name === temp.fee_name
                                        ).of
                                      }`
                                    : ""}
                                </div>
                              )}
                            </TableCell>

                            <TableCell>
                              {updatedAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).frequency == fee.frequency ? (
                                <div style={{ color: "black" }}>
                                  {fee.frequency}
                                </div>
                              ) : (
                                <div style={{ color: "red" }}>
                                  {
                                    updatedAgreement.rent_payments.find(
                                      (temp) => fee.fee_name === temp.fee_name
                                    ).frequency
                                  }
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {updatedAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).available_topay == fee.available_topay ? (
                                <div style={{ color: "black" }}>
                                  {`${fee.available_topay} days before`}
                                </div>
                              ) : (
                                <div style={{ color: "red" }}>
                                  {
                                    updatedAgreement.rent_payments.find(
                                      (temp) => fee.fee_name === temp.fee_name
                                    ).available_topay
                                  }
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {updatedAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).due_by == fee.due_by ? (
                                <div style={{ color: "black" }}>
                                  {fee.due_by == ""
                                    ? `1st of the month`
                                    : `${ordinal_suffix_of(
                                        fee.due_by
                                      )} of the month`}
                                </div>
                              ) : (
                                <div style={{ color: "red" }}>
                                  {updatedAgreement.rent_payments.find(
                                    (temp) => fee.fee_name === temp.fee_name
                                  ).due_by == ""
                                    ? `1st of the month`
                                    : `${ordinal_suffix_of(
                                        fee.due_by
                                      )} of the month`}
                                </div>
                              )}
                              {fee.due_by == ""
                                ? `1st of the month`
                                : `${ordinal_suffix_of(
                                    fee.due_by
                                  )} of the month`}
                            </TableCell>
                            <TableCell>
                              {updatedAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).late_by == fee.late_by ? (
                                <div style={{ color: "black" }}>
                                  {fee.late_by} days
                                </div>
                              ) : (
                                <div style={{ color: "red" }}>
                                  {
                                    updatedAgreement.rent_payments.find(
                                      (temp) => fee.fee_name === temp.fee_name
                                    ).late_by
                                  }{" "}
                                  days
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {updatedAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).late_fee == fee.late_fee ? (
                                <div style={{ color: "black" }}>
                                  ${fee.late_fee}
                                </div>
                              ) : (
                                <div style={{ color: "red" }}>
                                  $
                                  {
                                    updatedAgreement.rent_payments.find(
                                      (temp) => fee.fee_name === temp.fee_name
                                    ).late_fee
                                  }
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {updatedAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).perDay_late_fee == fee.perDay_late_fee ? (
                                <div style={{ color: "black" }}>
                                  ${fee.perDay_late_fee}
                                </div>
                              ) : (
                                <div style={{ color: "red" }}>
                                  $
                                  {
                                    updatedAgreement.rent_payments.find(
                                      (temp) => fee.fee_name === temp.fee_name
                                    ).perDay_late_fee
                                  }
                                </div>
                              )}
                              /day
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow style={{ textDecoration: "line-through" }}>
                            <TableCell>{fee.fee_name}</TableCell>

                            <TableCell>
                              {fee.fee_type === "%"
                                ? `${fee.charge}%`
                                : `$${fee.charge}`}
                            </TableCell>

                            <TableCell>
                              {fee.fee_type === "%" ? `${fee.of}` : ""}
                            </TableCell>

                            <TableCell>{fee.frequency}</TableCell>
                            <TableCell>
                              {`${fee.available_topay} days before`}
                            </TableCell>
                            <TableCell>
                              {fee.due_by == ""
                                ? `1st of the month`
                                : `${ordinal_suffix_of(
                                    fee.due_by
                                  )} of the month`}
                            </TableCell>
                            <TableCell>{fee.late_by} days</TableCell>
                            <TableCell>${fee.late_fee}</TableCell>
                            <TableCell>
                              ${fee.perDay_late_fee}
                              /day
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </Row>
            ) : (
              ""
            )}
            {/* {oldAgreement.length !== 0 && updatedAgreement.length !== 0 ? (
              <Row className="mb-4 m-3">
                <h5 style={mediumBold}>Contact Details</h5>

                <div>
                  <Table classes={{ root: classes.customTable }} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Contact Name</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone Number</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {JSON.parse(oldAgreement.assigned_contacts).map(
                        (contact, i) => {
                          return updatedAgreement.assigned_contacts.includesObj(
                            contact
                          ) ? (
                            <TableRow key={i}>
                              <TableCell>
                                {contact.first_name} {contact.last_name}
                              </TableCell>
                              <TableCell>{contact.company_role}</TableCell>
                              <TableCell>{contact.email}</TableCell>
                              <TableCell>{contact.phone_number}</TableCell>
                            </TableRow>
                          ) : !updatedAgreement.assigned_contacts.includesObj(
                              contact
                            ) &&
                            updatedAgreement.assigned_contacts.some(
                              (e) => contact.first_name === e.first_name
                            ) ? (
                            <TableRow key={i}>
                              <TableCell
                                style={{
                                  color:
                                    updatedAgreement.assigned_contacts.includesObj(
                                      contact
                                    )
                                      ? "black"
                                      : "red",
                                }}
                              >
                                {updatedAgreement.assigned_contacts.find(
                                  (temp) =>
                                    contact.first_name === temp.first_name
                                ).first_name == contact.first_name &&
                                updatedAgreement.assigned_contacts.find(
                                  (temp) =>
                                    contact.first_name === temp.first_name
                                ).last_name == contact.last_name ? (
                                  <div style={{ color: "black" }}>
                                    {contact.first_name} {contact.last_name}
                                  </div>
                                ) : (
                                  <div style={{ color: "red" }}>
                                    {
                                      updatedAgreement.assigned_contacts.find(
                                        (temp) =>
                                          contact.first_name === temp.first_name
                                      ).first_name
                                    }{" "}
                                    {
                                      updatedAgreement.assigned_contacts.find(
                                        (temp) =>
                                          contact.first_name === temp.first_name
                                      ).last_name
                                    }
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                {" "}
                                {updatedAgreement.assigned_contacts.find(
                                  (temp) =>
                                    contact.first_name === temp.first_name
                                ).company_role == contact.company_role ? (
                                  <div style={{ color: "black" }}>
                                    {contact.company_role}
                                  </div>
                                ) : (
                                  <div style={{ color: "red" }}>
                                    {
                                      updatedAgreement.assigned_contacts.find(
                                        (temp) =>
                                          contact.first_name === temp.first_name
                                      ).company_role
                                    }
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                {" "}
                                {updatedAgreement.assigned_contacts.find(
                                  (temp) =>
                                    contact.first_name === temp.first_name
                                ).email == contact.email ? (
                                  <div style={{ color: "black" }}>
                                    {contact.email}
                                  </div>
                                ) : (
                                  <div style={{ color: "red" }}>
                                    {
                                      updatedAgreement.assigned_contacts.find(
                                        (temp) =>
                                          contact.first_name === temp.first_name
                                      ).email
                                    }
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                {" "}
                                {updatedAgreement.assigned_contacts.find(
                                  (temp) =>
                                    contact.first_name === temp.first_name
                                ).phone_number == contact.phone_number ? (
                                  <div style={{ color: "black" }}>
                                    {contact.phone_number}
                                  </div>
                                ) : (
                                  <div style={{ color: "red" }}>
                                    {
                                      updatedAgreement.assigned_contacts.find(
                                        (temp) =>
                                          contact.first_name === temp.first_name
                                      ).phone_number
                                    }
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ) : (
                            <TableRow
                              key={i}
                              style={{ textDecoration: "line-through" }}
                            >
                              <TableCell>
                                {contact.first_name} {contact.last_name}
                              </TableCell>
                              <TableCell>{contact.company_role}</TableCell>
                              <TableCell>{contact.email}</TableCell>
                              <TableCell>{contact.phone_number}</TableCell>
                              <TableCell>
                                <a href={`tel:${contact.phone_number}`}>
                                  <img
                                    src={Phone}
                                    alt="Phone"
                                    style={smallImg}
                                  />
                                </a>
                                <a>
                                  <img
                                    src={Message}
                                    alt="Message"
                                    style={smallImg}
                                  />
                                </a>
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Row>
            ) : (
              ""
            )} */}
            {oldAgreement.length !== 0 && updatedAgreement.length !== 0 ? (
              <Row className="m-3">
                <h5 style={mediumBold}>Lease Documents</h5>
                {updatedAgreement.documents.length > 0 ? (
                  <div>
                    <Table
                      responsive="md"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Document Name</TableCell>
                          <TableCell>View Document</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {updatedAgreement.documents.map((file) => {
                          return JSON.parse(oldAgreement.documents).includesObj(
                            file
                          ) ? (
                            <TableRow>
                              <TableCell>{file.description}</TableCell>
                              <TableCell>
                                <a href={file.link} target="_blank">
                                  <img
                                    src={File}
                                    style={{
                                      width: "15px",
                                      height: "15px",
                                    }}
                                  />
                                </a>
                              </TableCell>
                            </TableRow>
                          ) : !JSON.parse(oldAgreement.documents).includesObj(
                              file
                            ) ? (
                            <TableRow>
                              <TableCell style={{ color: "red" }}>
                                {file.description}
                              </TableCell>
                              <TableCell style={{ color: "red" }}>
                                <a href={file.link} target="_blank">
                                  <img
                                    src={File}
                                    style={{
                                      width: "15px",
                                      height: "15px",
                                    }}
                                  />
                                </a>
                              </TableCell>
                            </TableRow>
                          ) : (
                            <TableRow>
                              <TableCell>{file.description}</TableCell>
                              <TableCell>
                                <a href={file.link} target="_blank">
                                  <img
                                    src={File}
                                    style={{
                                      width: "15px",
                                      height: "15px",
                                    }}
                                  />
                                </a>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div>No documents uploaded</div>
                )}
              </Row>
            ) : (
              ""
            )}
          </DialogContent>
        ) : (
          ""
        )}

        <DialogActions className="d-flex flex-row justify-content-evenly">
          <Button
            variant="outline-primary"
            style={smallPillButton}
            as="p"
            className="mx-2"
            onClick={onCancel}
          >
            {button1}
          </Button>
          <Button
            variant="outline-primary"
            style={smallPillButton}
            as="p"
            className="mx-2"
            onClick={onConfirm}
          >
            {button2}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmDialog3;
