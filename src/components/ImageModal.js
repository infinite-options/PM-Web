import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "../icons/CloseIcon.png";
function ImageModal(props) {
  const { isOpen, src, onCancel } = props;

  return (
    <div>
      <Dialog open={isOpen} onClose={onCancel} maxWidth="md">
        <DialogTitle
          disableTypography
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div onClick={onCancel}>
            <img
              src={CloseIcon}
              style={{
                cursor: "pointer",
                float: "right",
                marginTop: "5px",
                width: "20px",
              }}
            />
          </div>
        </DialogTitle>
        <DialogContent>
          <img
            src={`${src}?${Date.now()}`}
            style={{ objectFit: "cover", width: "500px", height: "500px" }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ImageModal;
