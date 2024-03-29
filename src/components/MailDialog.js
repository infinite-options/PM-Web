import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import * as ReactBootStrap from "react-bootstrap";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { post } from "../utils/api";
import { squareForm } from "../utils/styles";
function MailDialog(props) {
  const {
    title,
    isOpen,
    onCancel,
    receiverEmail,
    senderEmail,
    senderPhone,
    senderName,
    requestCreatedBy,
    userMessaged,
    receiverPhone,
  } = props;
  const [messageSubject, setMessageSubject] = useState("");
  const [messageDetails, setMessageDetails] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const submitMessage = async () => {
    setShowSpinner(true);
    const newMessage = {
      sender_name: senderName,
      sender_email: senderEmail,
      sender_phone: senderPhone,
      message_subject: messageSubject,
      message_details: messageDetails,
      message_created_by: requestCreatedBy,
      user_messaged: userMessaged,
      message_status: "PENDING",
      receiver_email: receiverEmail,
      receiver_phone: receiverPhone,
    };
    // console.log(newMessage);
    const response = await post("/messageEmail", newMessage);
    alert("Email Sent");
    setShowSpinner(false);
    onCancel();
  };
  return (
    <div>
      <Dialog
        open={isOpen}
        // onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <Form.Group className="mx-2 mb-3">
            <Form.Label as="h6">Sender Name</Form.Label>
            <DialogContentText id="alert-dialog-description">
              {senderName}
            </DialogContentText>
            <Form.Label as="h6">Sender Email</Form.Label>
            <DialogContentText id="alert-dialog-description">
              {senderEmail}
            </DialogContentText>
            <Form.Label as="h6">Receiver Email</Form.Label>
            <DialogContentText id="alert-dialog-description">
              {receiverEmail}
            </DialogContentText>
            <Form.Label as="h6">Sender Phone</Form.Label>
            <DialogContentText id="alert-dialog-description">
              {senderPhone}
            </DialogContentText>
            <Form.Label as="h6">Receiver Phone</Form.Label>
            <DialogContentText id="alert-dialog-description">
              {receiverPhone}
            </DialogContentText>
            <Form.Label as="h6">Message Subject</Form.Label>
            <Form.Control
              style={squareForm}
              type="text"
              value={messageSubject}
              onChange={(e) => setMessageSubject(e.target.value)}
            />
            <Form.Label as="h6">Message Details</Form.Label>
            <Form.Control
              style={squareForm}
              as="textarea"
              value={messageDetails}
              onChange={(e) => setMessageDetails(e.target.value)}
            />
          </Form.Group>
        </DialogContent>
        {showSpinner ? (
          <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            <ReactBootStrap.Spinner animation="border" role="status" />
          </div>
        ) : (
          ""
        )}
        <DialogActions>
          <Button onClick={submitMessage} color="primary">
            Yes
          </Button>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MailDialog;
