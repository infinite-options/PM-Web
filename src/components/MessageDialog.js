import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { post } from "../utils/api";
import { squareForm } from "../utils/styles";
function ConfirmDialog(props) {
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
  } = props;
  const [messageSubject, setMessageSubject] = useState("");
  const [messageDetails, setMessageDetails] = useState("");

  const submitMessage = async () => {
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
    };
    console.log(newMessage);
    const response = await post("/message", newMessage);
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
              type="text"
              value={messageDetails}
              onChange={(e) => setMessageDetails(e.target.value)}
            />
          </Form.Group>
        </DialogContent>
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

export default ConfirmDialog;
