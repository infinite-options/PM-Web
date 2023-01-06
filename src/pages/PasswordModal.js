import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
const PasswordModal = (props) => {
  const { isOpen, onCancel } = props;
  return (
    <div>
      <Dialog
        open={isOpen}
        // onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Temporary password sent
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            We have sent you an email with a<br /> temporary password. Please
            <br /> follow the instructions in the email
            <br /> to create a new password.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PasswordModal;
