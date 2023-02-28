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
import * as ReactBootStrap from "react-bootstrap";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import File from "../../icons/File.svg";
import { smallPillButton, smallImg, mediumBold } from "../../utils/styles";
import { ordinal_suffix_of } from "../../utils/helper";
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
function UpdateConfirmDialog(props) {
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
    showSpinner,
  } = props;
  // console.log(props);

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
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <h5>{title}</h5>
          </DialogContentText>
        </DialogContent>
        {updatedAgreement !== undefined ? (
          <DialogContent>
            <Row className="mb-4 m-3" style={{ overflow: "scroll" }}>
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
                            updatedAgreement.late_by == oldAgreement.late_by
                              ? "black"
                              : "red",
                        }}
                      >
                        {updatedAgreement.late_by} days
                      </TableCell>
                      <TableCell
                        style={{
                          color:
                            updatedAgreement.late_fee == oldAgreement.late_fee
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
                            updatedAgreement.perDay_late_fee ==
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

            {oldAgreement.length !== 0 && updatedAgreement.length !== 0 ? (
              <Row className="mb-4 m-3" style={{ overflow: "scroll" }}>
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
                      {updatedAgreement.rent_payments.map((fee) => {
                        return oldAgreement.rent_payments.includesObj(fee) ? (
                          <TableRow>
                            <TableCell
                              style={{
                                color: oldAgreement.rent_payments.includesObj(
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
                                color: oldAgreement.rent_payments.includesObj(
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
                                color: oldAgreement.rent_payments.includesObj(
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
                                color: oldAgreement.rent_payments.includesObj(
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
                                color: oldAgreement.rent_payments.includesObj(
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
                                color: oldAgreement.rent_payments.includesObj(
                                  fee
                                )
                                  ? "black"
                                  : "red",
                              }}
                            >
                              {fee.frequency === "Weekly" ||
                              fee.frequency === "Biweekly"
                                ? fee.due_by === ""
                                  ? `1st day of the week`
                                  : `${ordinal_suffix_of(
                                      fee.due_by
                                    )} day of the week`
                                : fee.due_by === ""
                                ? `1st of the month`
                                : `${ordinal_suffix_of(
                                    fee.due_by
                                  )} of the month`}
                            </TableCell>
                            <TableCell
                              style={{
                                color: oldAgreement.rent_payments.includesObj(
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
                                color: oldAgreement.rent_payments.includesObj(
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
                                color: oldAgreement.rent_payments.includesObj(
                                  fee
                                )
                                  ? "black"
                                  : "red",
                              }}
                            >
                              ${fee.perDay_late_fee}/day
                            </TableCell>
                          </TableRow>
                        ) : !oldAgreement.rent_payments.includesObj(fee) &&
                          oldAgreement.rent_payments.some(
                            (e) => fee.fee_name === e.fee_name
                          ) ? (
                          <TableRow>
                            <TableCell>
                              {oldAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).fee_name !== fee.fee_name ? (
                                <div style={{ color: "red" }}>
                                  {fee.fee_name}
                                </div>
                              ) : (
                                <div style={{ color: "black" }}>
                                  {
                                    oldAgreement.rent_payments.find(
                                      (temp) => fee.fee_name === temp.fee_name
                                    ).fee_name
                                  }
                                </div>
                              )}
                            </TableCell>

                            <TableCell>
                              {oldAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).charge !== fee.charge ? (
                                <div style={{ color: "red" }}>
                                  {fee.fee_type === "%"
                                    ? `${fee.charge}%`
                                    : `$${fee.charge}`}
                                </div>
                              ) : (
                                <div style={{ color: "black" }}>
                                  {oldAgreement.rent_payments.find(
                                    (temp) => fee.fee_name === temp.fee_name
                                  ).fee_type === "%"
                                    ? `${
                                        oldAgreement.rent_payments.find(
                                          (temp) =>
                                            fee.fee_name === temp.fee_name
                                        ).charge
                                      }%`
                                    : `$${
                                        oldAgreement.rent_payments.find(
                                          (temp) =>
                                            fee.fee_name === temp.fee_name
                                        ).charge
                                      }`}
                                </div>
                              )}
                            </TableCell>

                            <TableCell>
                              {oldAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).of === fee.of ? (
                                <div style={{ color: "red" }}>
                                  {fee.fee_type === "%" ? `${fee.of}` : ""}
                                </div>
                              ) : (
                                <div style={{ color: "black" }}>
                                  {oldAgreement.rent_payments.find(
                                    (temp) => fee.fee_name === temp.fee_name
                                  ).fee_type === "%"
                                    ? `${
                                        oldAgreement.rent_payments.find(
                                          (temp) =>
                                            fee.fee_name === temp.fee_name
                                        ).of
                                      }`
                                    : ""}
                                </div>
                              )}
                            </TableCell>

                            <TableCell>
                              {oldAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).frequency !== fee.frequency ? (
                                <div style={{ color: "red" }}>
                                  {fee.frequency}
                                </div>
                              ) : (
                                <div style={{ color: "black" }}>
                                  {
                                    oldAgreement.rent_payments.find(
                                      (temp) => fee.fee_name === temp.fee_name
                                    ).frequency
                                  }
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {oldAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).available_topay !== fee.available_topay ? (
                                <div style={{ color: "red" }}>
                                  {`${fee.available_topay} days before`}
                                </div>
                              ) : (
                                <div style={{ color: "black" }}>
                                  {`${
                                    oldAgreement.rent_payments.find(
                                      (temp) => fee.fee_name === temp.fee_name
                                    ).available_topay
                                  } days before`}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {oldAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).due_by !== fee.due_by ? (
                                <div style={{ color: "red" }}>
                                  {fee.frequency === "Weekly" ||
                                  fee.frequency === "Biweekly"
                                    ? fee.due_by === ""
                                      ? `1st day of the week`
                                      : `${ordinal_suffix_of(
                                          fee.due_by
                                        )} day of the week`
                                    : fee.due_by === ""
                                    ? `1st of the month`
                                    : `${ordinal_suffix_of(
                                        fee.due_by
                                      )} of the month`}
                                </div>
                              ) : (
                                <div style={{ color: "black" }}>
                                  {oldAgreement.rent_payments.find(
                                    (temp) => fee.fee_name === temp.fee_name
                                  ).frequency === "Weekly" ||
                                  oldAgreement.rent_payments.find(
                                    (temp) => fee.fee_name === temp.fee_name
                                  ).frequency === "Biweekly"
                                    ? fee.due_by === ""
                                      ? `1st day of the week`
                                      : `${ordinal_suffix_of(
                                          fee.due_by
                                        )} day of the week`
                                    : fee.due_by === ""
                                    ? `1st of the month`
                                    : `${ordinal_suffix_of(
                                        fee.due_by
                                      )} of the month`}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {oldAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).late_by != fee.late_by ? (
                                <div style={{ color: "red" }}>
                                  {fee.late_by} days
                                </div>
                              ) : (
                                <div style={{ color: "black" }}>
                                  {
                                    oldAgreement.rent_payments.find(
                                      (temp) => fee.fee_name === temp.fee_name
                                    ).late_by
                                  }{" "}
                                  days
                                </div>
                              )}
                            </TableCell>

                            <TableCell>
                              {oldAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).late_fee != fee.late_fee ? (
                                <div style={{ color: "red" }}>
                                  ${fee.late_fee}
                                </div>
                              ) : (
                                <div style={{ color: "black" }}>
                                  $
                                  {
                                    oldAgreement.rent_payments.find(
                                      (temp) => fee.fee_name === temp.fee_name
                                    ).late_fee
                                  }
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {oldAgreement.rent_payments.find(
                                (temp) => fee.fee_name === temp.fee_name
                              ).perDay_late_fee != fee.perDay_late_fee ? (
                                <div style={{ color: "red" }}>
                                  ${fee.perDay_late_fee} /day
                                </div>
                              ) : (
                                <div style={{ color: "black" }}>
                                  $
                                  {
                                    oldAgreement.rent_payments.find(
                                      (temp) => fee.fee_name === temp.fee_name
                                    ).perDay_late_fee
                                  }{" "}
                                  /day
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ) : !oldAgreement.rent_payments.includesObj(fee) ? (
                          <TableRow>
                            <TableCell style={{ color: "red" }}>
                              {fee.fee_name}
                            </TableCell>

                            <TableCell style={{ color: "red" }}>
                              {fee.fee_type === "%"
                                ? `${fee.charge}%`
                                : `$${fee.charge}`}
                            </TableCell>

                            <TableCell style={{ color: "red" }}>
                              {fee.fee_type === "%" ? `${fee.of}` : ""}
                            </TableCell>

                            <TableCell style={{ color: "red" }}>
                              {fee.frequency}
                            </TableCell>
                            <TableCell style={{ color: "red" }}>
                              {`${fee.available_topay} days before`}
                            </TableCell>
                            <TableCell style={{ color: "red" }}>
                              {/* {fee.due_by === ""
                                ? `1st of the month`
                                : fee.frequency === "One-time"
                                ? `${fee.due_by}`
                                : `${ordinal_suffix_of(
                                    fee.due_by
                                  )} of the month`} */}
                              {fee.frequency === "Weekly" ||
                              fee.frequency === "Biweekly"
                                ? fee.due_by === ""
                                  ? `1st day of the week`
                                  : `${ordinal_suffix_of(
                                      fee.due_by
                                    )} day of the week`
                                : fee.due_by === ""
                                ? `1st of the month`
                                : `${ordinal_suffix_of(
                                    fee.due_by
                                  )} of the month`}
                            </TableCell>
                            <TableCell style={{ color: "red" }}>
                              {fee.late_by} days
                            </TableCell>
                            <TableCell style={{ color: "red" }}>
                              ${fee.late_fee}
                            </TableCell>
                            <TableCell style={{ color: "red" }}>
                              ${fee.perDay_late_fee}
                              /day
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {oldAgreement.rent_payments.map((fee) => {
                        return !updatedAgreement.rent_payments.includesObj(
                          fee
                        ) &&
                          updatedAgreement.rent_payments.some(
                            (e) => fee.fee_name != e.fee_name
                          ) ? (
                          <TableRow>
                            <TableCell
                              style={{ textDecoration: "line-through" }}
                            >
                              {fee.fee_name}
                            </TableCell>

                            <TableCell
                              style={{ textDecoration: "line-through" }}
                            >
                              {fee.fee_type === "%"
                                ? `${fee.charge}%`
                                : `$${fee.charge}`}
                            </TableCell>

                            <TableCell
                              style={{ textDecoration: "line-through" }}
                            >
                              {fee.fee_type === "%" ? `${fee.of}` : ""}
                            </TableCell>

                            <TableCell
                              style={{ textDecoration: "line-through" }}
                            >
                              {fee.frequency}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration: "line-through" }}
                            >
                              {`${fee.available_topay} days before`}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration: "line-through" }}
                            >
                              {/* {fee.due_by === ""
                                ? `1st of the month`
                                : fee.frequency === "One-time"
                                ? `${fee.due_by}`
                                : `${ordinal_suffix_of(
                                    fee.due_by
                                  )} of the month`} */}
                              {fee.frequency === "Weekly" ||
                              fee.frequency === "Biweekly"
                                ? fee.due_by === ""
                                  ? `1st day of the week`
                                  : `${ordinal_suffix_of(
                                      fee.due_by
                                    )} day of the week`
                                : fee.due_by === ""
                                ? `1st of the month`
                                : `${ordinal_suffix_of(
                                    fee.due_by
                                  )} of the month`}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration: "line-through" }}
                            >
                              {fee.late_by} days
                            </TableCell>
                            <TableCell
                              style={{ textDecoration: "line-through" }}
                            >
                              ${fee.late_fee}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration: "line-through" }}
                            >
                              ${fee.perDay_late_fee}
                              /day
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </Row>
            ) : (
              ""
            )}

            {oldAgreement.length !== 0 && updatedAgreement.length !== 0 ? (
              <Row className="m-3">
                <h5 style={mediumBold}>Payments Summary</h5>
                {updatedAgreement.rent_payments.length > 0 ? (
                  <div>
                    <Table
                      responsive="md"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Payment Type</TableCell>
                          <TableCell>Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {updatedAgreement.rent_payments.map((fee) => {
                          return (
                            <TableRow>
                              <TableCell>
                                {oldAgreement.rent_payments.find(
                                  (temp) => fee.fee_name === temp.fee_name
                                ).fee_name !== fee.fee_name ? (
                                  <div style={{ color: "red" }}>
                                    {fee.fee_name}
                                  </div>
                                ) : (
                                  <div style={{ color: "black" }}>
                                    {
                                      oldAgreement.rent_payments.find(
                                        (temp) => fee.fee_name === temp.fee_name
                                      ).fee_name
                                    }
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                {oldAgreement.rent_payments.find(
                                  (temp) => fee.fee_name === temp.fee_name
                                ).charge !== fee.charge ? (
                                  <div style={{ color: "red" }}>
                                    {fee.fee_type === "%"
                                      ? `${fee.charge}%`
                                      : `$${fee.charge}`}
                                  </div>
                                ) : (
                                  <div style={{ color: "black" }}>
                                    {oldAgreement.rent_payments.find(
                                      (temp) => fee.fee_name === temp.fee_name
                                    ).fee_type === "%"
                                      ? `${
                                          oldAgreement.rent_payments.find(
                                            (temp) =>
                                              fee.fee_name === temp.fee_name
                                          ).charge
                                        }%`
                                      : `$${
                                          oldAgreement.rent_payments.find(
                                            (temp) =>
                                              fee.fee_name === temp.fee_name
                                          ).charge
                                        }`}
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {oldAgreement.rent_payments.map((fee) => {
                          return !updatedAgreement.rent_payments.includesObj(
                            fee
                          ) &&
                            updatedAgreement.rent_payments.some(
                              (e) => fee.fee_charge !== e.fee_charge
                            ) ? (
                            <TableRow>
                              <TableCell
                                style={{ textDecoration: "line-through" }}
                              >
                                {fee.fee_name}
                              </TableCell>
                              <TableCell
                                style={{ textDecoration: "line-through" }}
                              >
                                {fee.charge}
                              </TableCell>
                            </TableRow>
                          ) : (
                            ""
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
                          return oldAgreement.documents.includesObj(file) ? (
                            <TableRow>
                              <TableCell>
                                {file.description == ""
                                  ? file.name
                                  : file.description}
                              </TableCell>
                              <TableCell>
                                <a
                                  href={file.link}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src={File}
                                    alt="open document"
                                    style={{
                                      width: "15px",
                                      height: "15px",
                                    }}
                                  />
                                </a>
                              </TableCell>
                            </TableRow>
                          ) : !oldAgreement.documents.includesObj(file) ? (
                            <TableRow>
                              <TableCell style={{ color: "red" }}>
                                {file.description == ""
                                  ? file.name
                                  : file.description}
                              </TableCell>
                              <TableCell style={{ color: "red" }}>
                                <a
                                  href={file.link}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src={File}
                                    alt="open document"
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
                              <TableCell>
                                {file.description == ""
                                  ? file.name
                                  : file.description}
                              </TableCell>
                              <TableCell>
                                <a
                                  href={file.link}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src={File}
                                    alt="open document"
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
        {showSpinner ? (
          <div className="w-100 d-flex flex-column justify-content-center align-items-center h-50">
            <ReactBootStrap.Spinner animation="border" role="status" />
          </div>
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

export default UpdateConfirmDialog;
