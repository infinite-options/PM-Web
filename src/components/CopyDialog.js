import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Fade } from "@mui/material";

export default function CopyDialog(props) {
  const { copied } = props;

  return (
    <Dialog
      open={copied}
      transition={Fade}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title"></DialogTitle>
      <DialogContent>
        <div className="d-flex justify-content-center align-items-center m-5">
          <h5>Copied!</h5>
        </div>
      </DialogContent>
    </Dialog>
  );
}
