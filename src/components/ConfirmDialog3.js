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
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import File from "../icons/File.svg";
import {
  small,
  smallPillButton,
  smallImg,
  red,
  squareForm,
  mediumBold,
  bluePillButton,
  redPillButton,
} from "../utils/styles";
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
  const { title, body, isOpen, onConfirm, onCancel, button1, button2 } = props;
  // console.log(body);
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
        {body.length > 0 ? (
          <DialogContent>
            {body[0].lease_start !== undefined ||
            body[0].lease_end !== undefined ||
            body[0].due_by !== undefined ||
            body[0].late_by !== undefined ||
            body[0].late_fee !== undefined ||
            body[0].perDay_late_fee !== undefined ? (
              <Row className="mb-4 m-3" style={{ hidden: "overflow" }}>
                <h5>Lease Details</h5>
                <div>
                  <Table
                    responsive="md"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
                    {/* {console.log(body[0])} */}
                    <TableHead>
                      <TableRow>
                        {body[0].lease_start !== undefined ? (
                          <TableCell>Lease Start</TableCell>
                        ) : (
                          ""
                        )}
                        {body[0].lease_end !== undefined ? (
                          <TableCell>Lease End</TableCell>
                        ) : (
                          ""
                        )}
                        {body[0].due_by !== undefined ? (
                          <TableCell>Rent Due</TableCell>
                        ) : (
                          ""
                        )}
                        {body[0].late_by !== undefined ? (
                          <TableCell>Late Fees After (days)</TableCell>
                        ) : (
                          ""
                        )}
                        {body[0].late_fee !== undefined ? (
                          <TableCell>Late Fee (one-time)</TableCell>
                        ) : (
                          ""
                        )}
                        {body[0].perDay_late_fee !== undefined ? (
                          <TableCell>Late Fee (per day)</TableCell>
                        ) : (
                          ""
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {body[0].lease_start !== undefined ? (
                          <TableCell>{body[0].lease_start}</TableCell>
                        ) : (
                          ""
                        )}
                        {body[0].lease_end !== undefined ? (
                          <TableCell>{body[0].lease_end}</TableCell>
                        ) : (
                          ""
                        )}
                        {body[0].due_by !== undefined ? (
                          <TableCell>
                            {`${ordinal_suffix_of(
                              body[0].due_by
                            )} of the month`}
                          </TableCell>
                        ) : (
                          ""
                        )}
                        {body[0].late_by !== undefined ? (
                          <TableCell>{body[0].late_by} days</TableCell>
                        ) : (
                          ""
                        )}
                        {body[0].late_fee !== undefined ? (
                          <TableCell> ${body[0].late_fee}</TableCell>
                        ) : (
                          ""
                        )}
                        {body[0].perDay_late_fee !== undefined ? (
                          <TableCell> ${body[0].perDay_late_fee}</TableCell>
                        ) : (
                          ""
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </Row>
            ) : (
              ""
            )}

            {body[0].rent_payments !== undefined ? (
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
                      {body[0].rent_payments.map((fee, i) => (
                        <TableRow>
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
                              : `${ordinal_suffix_of(fee.due_by)} of the month`}
                          </TableCell>
                          <TableCell>{fee.late_by} days</TableCell>
                          <TableCell>${fee.late_fee}</TableCell>
                          <TableCell>${fee.perDay_late_fee}/day</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Row>
            ) : (
              ""
            )}

            {body[0].assigned_contacts !== undefined ? (
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

                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {body[0].assigned_contacts.map((contact, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            {contact.first_name} {contact.last_name}
                          </TableCell>
                          <TableCell>{contact.company_role}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.phone_number}</TableCell>
                          <TableCell>
                            <a href={`tel:${contact.phone_number}`}>
                              <img src={Phone} alt="Phone" style={smallImg} />
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
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Row>
            ) : (
              ""
            )}
            {body[0].documents !== undefined ? (
              <Row className="m-3">
                <h5 style={mediumBold}>Lease Documents</h5>
                {body[0].documents.length > 0 ? (
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
                        {body[0].documents.map((file) => {
                          return (
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
