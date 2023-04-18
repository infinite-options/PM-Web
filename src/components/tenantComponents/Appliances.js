import React, { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import ImageModal from "../ImageModal";
import File from "../../icons/File.svg";
import ImgIcon from "../../icons/ImgIcon.png";
import LinkIcon from "../../icons/LinkIcon.svg";
import DocIcon from "../../icons/DocIcon.png";
import { pillButton } from "../../utils/styles";
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
export default function Appliances(props) {
  const classes = useStyles();
  const { appliances, applianceState } = props;
  const [applianceImgModalShow, setApplianceImgModalShow] = useState(false);
  const [applianceDocModalShow, setApplianceDocModalShow] = useState(false);
  const [applianceUrlModalShow, setApplianceUrlModalShow] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState(
    Object.values(applianceState[0])[0]
  );
  const [openImage, setOpenImage] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const showImage = (src) => {
    setOpenImage(true);
    setImageSrc(src);
  };
  const unShowImage = () => {
    setOpenImage(false);
    setImageSrc(null);
  };
  const hideModal = () => {
    setApplianceImgModalShow(false);
    setApplianceDocModalShow(false);
    setApplianceUrlModalShow(false);
  };
  const ApplianceImgModal = () => {
    return (
      <Dialog
        open={applianceImgModalShow}
        onClose={hideModal}
        fullWidth
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle closeButton>Images</DialogTitle>
        <DialogContent>
          {selectedAppliance["images"].length > 0 ? (
            <div
              className="row row-cols-3 flex-column"
              style={{ height: "26rem" }}
            >
              {selectedAppliance["images"].map((img, i) => (
                <div className="col d-flex justify-content-center py-2" key={i}>
                  <div
                    className="card"
                    style={{ width: "14rem", height: "14rem" }}
                  >
                    <div className="card-body">
                      <img
                        src={img}
                        style={{
                          width: "12rem",
                          height: "12rem",
                          objectFit: "contain",
                        }}
                        onClick={() => showImage(img)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button style={pillButton} onClick={hideModal} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const ApplianceDocModal = () => {
    return (
      <Dialog
        open={applianceDocModalShow}
        onClose={hideModal}
        fullWidth
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle closeButton>Documents</DialogTitle>
        <DialogContent>
          {" "}
          {selectedAppliance["documents"].length > 0 ? (
            <Table
              responsive="md"
              classes={{ root: classes.customTable }}
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedAppliance["documents"].map((file, i) => {
                  return (
                    <TableRow>
                      <TableCell>{file.name}</TableCell>
                      <TableCell>{file.description}</TableCell>
                      <TableCell>
                        <a href={file.link} target="_blank" rel="noreferrer">
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
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button style={pillButton} onClick={hideModal} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const ApplianceUrlModal = () => {
    return (
      <Dialog
        open={applianceUrlModalShow}
        onClose={hideModal}
        fullWidth
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle closeButton></DialogTitle>
        <DialogContent>
          {selectedAppliance["url"].length > 0 ? (
            <div>
              {selectedAppliance["url"].map((url, i) => (
                <li key={i}>
                  <a href={url} target="_blank" rel="noreferrer">
                    {" "}
                    {url}
                  </a>
                </li>
              ))}
            </div>
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button style={pillButton} onClick={hideModal} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  return (
    <Row className="m-3" style={{ overflow: "scroll" }}>
      {ApplianceImgModal()}
      {ApplianceDocModal()}
      {ApplianceUrlModal()}
      <ImageModal src={imageSrc} isOpen={openImage} onCancel={unShowImage} />
      <Table
        responsive="md"
        classes={{ root: classes.customTable }}
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell>Appliance</TableCell>
            <TableCell align="center">Manufacturer</TableCell>
            <TableCell align="center">Purchased From</TableCell>
            <TableCell align="center">Purchased On</TableCell>
            <TableCell align="center">Purchase Order Number</TableCell>
            <TableCell align="center">Installed On</TableCell>
            <TableCell align="center">Serial Number</TableCell>
            <TableCell align="center">Model Number</TableCell>
            <TableCell align="center">Warranty Till</TableCell>
            <TableCell align="center">Warranty Info</TableCell>
            <TableCell align="center">URLs</TableCell>
            <TableCell align="center">Images</TableCell>
            <TableCell align="center">Documents</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appliances.map((appliance, i) => {
            return applianceState[0][appliance]["available"] == true ||
              applianceState[0][appliance]["available"] == "True" ? (
              <TableRow>
                <TableCell>{appliance}</TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["manufacturer"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["purchased_from"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["purchased"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["purchased_order"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["installed"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["serial_num"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["model_num"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["warranty_till"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["warranty_info"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["url"] !== undefined &&
                  applianceState[0][appliance]["url"].length > 0 ? (
                    <img
                      src={LinkIcon}
                      onClick={() => {
                        setApplianceUrlModalShow(!applianceUrlModalShow);
                        setSelectedAppliance(applianceState[0][appliance]);
                      }}
                      style={{
                        width: "15px",
                        height: "15px",
                      }}
                    />
                  ) : (
                    "None"
                  )}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["images"] !== undefined &&
                  applianceState[0][appliance]["images"].length > 0 ? (
                    <img
                      src={ImgIcon}
                      onClick={() => {
                        setApplianceImgModalShow(!applianceImgModalShow);
                        setSelectedAppliance(applianceState[0][appliance]);
                      }}
                      style={{
                        width: "25px",
                        height: "25px",
                      }}
                    />
                  ) : (
                    "None"
                  )}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["documents"] !== undefined &&
                  applianceState[0][appliance]["documents"].length > 0 ? (
                    <img
                      src={DocIcon}
                      onClick={() => {
                        setApplianceDocModalShow(!applianceDocModalShow);
                        setSelectedAppliance(applianceState[0][appliance]);
                      }}
                      style={{
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  ) : (
                    "None"
                  )}
                </TableCell>
                {/* <TableCell>{applianceState[0][appliance]["url"]}</TableCell>

                {applianceState[0][appliance]["images"] !== undefined &&
                applianceState[0][appliance]["images"].length > 0 ? (
                  <TableCell>
                    <Row className="d-flex justify-content-center align-items-center p-1">
                      <Col className="d-flex justify-content-center align-items-center p-0 m-0">
                        <img
                          src={`${
                            applianceState[0][appliance]["images"][0]
                          }?${Date.now()}`}
                          style={{
                            borderRadius: "4px",
                            objectFit: "contain",
                            width: "50px",
                            height: "50px",
                          }}
                          onClick={() =>
                            showImage(
                              `${
                                applianceState[0][appliance]["images"][0]
                              }?${Date.now()}`
                            )
                          }
                          alt="Property"
                        />
                      </Col>
                    </Row>
                  </TableCell>
                ) : (
                  <TableCell>None</TableCell>
                )}
                {applianceState[0][appliance]["documents"] !== undefined &&
                applianceState[0][appliance]["documents"].length > 0 ? (
                  <TableCell>
                    <Table
                      responsive="md"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Description</TableCell>

                          <TableCell>View</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {applianceState[0][appliance]["documents"].map(
                          (file, i) => {
                            return (
                              <TableRow>
                                <TableCell>{file.description}</TableCell>

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
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableCell>
                ) : (
                  <TableCell>None</TableCell>
                )} */}
              </TableRow>
            ) : (
              ""
            );
          })}
        </TableBody>
      </Table>
    </Row>
  );
}
