import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { TextField } from "@mui/material";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import Checkbox from "./Checkbox";
import ApplianceImages from "./ApplianceImages";
import ConfirmDialog from "../components/ConfirmDialog";
import DocumentsUploadPost from "./DocumentsUploadPost";
import ImageModal from "./ImageModal";
import AddIcon from "../icons/AddIcon.svg";
import File from "../icons/File.svg";
import UploadIcon from "../icons/UploadIcon.png";
import UploadDoneIcon from "../icons/UploadDoneIcon.svg";
import ImgIcon from "../icons/ImgIcon.png";
import LinkIcon from "../icons/LinkIcon.svg";
import DocIcon from "../icons/DocIcon.png";
import DeleteIcon from "../icons/DeleteIcon.svg";
import {
  squareForm,
  smallPillButton,
  pillButton,
  mediumBold,
} from "../utils/styles";
import { get, put } from "../utils/api";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "2px 2px",
      border: "0.5px solid grey ",
      // wordBreak: "break-word",
    },
    // width: "100%",
    // tableLayout: "fixed",
  },
});
function PropertyAppliances(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const { state, edit, property } = props;
  const [applianceRem, setApplianceRem] = useState("");
  const [applianceState, setApplianceState] = state;
  const appliances = Object.keys(applianceState);
  const og_appliances = [
    "Dryer",
    "Range",
    "Washer",
    "Microwave",
    "Dishwasher",
    "Refrigerator",
  ];
  const [applianceImgModalShow, setApplianceImgModalShow] = useState(false);
  const [applianceDocModalShow, setApplianceDocModalShow] = useState(false);
  const [applianceUrlModalShow, setApplianceUrlModalShow] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState(
    Object.values(applianceState)[0]
  );
  const [addDetailsModalShow, setAddDetailsModalShow] = useState(false);
  const [addNewModalShow, setAddNewModalShow] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [newAppliance, setNewAppliance] = useState(null);
  const [applianceType, setApplianceType] = useState("Dryer");
  const [applianceManufacturer, setApplianceManufacturer] = useState(null);
  const [applianceModelNum, setApplianceModelNum] = useState(null);
  const [applianceSerialNum, setApplianceSerialNum] = useState(null);
  const [appliancePurchasedOn, setAppliancePurchasedOn] = useState(null);
  const [appliancePurchasedFrom, setAppliancePurchasedFrom] = useState(null);
  const [appliancePurchasesOrderNumber, setAppliancePurchasesOrderNumber] =
    useState(null);
  const [applianceInstalledOn, setApplianceInstalledOn] = useState(null);
  const [applianceWarrantyTill, setApplianceWarrantyTill] = useState(null);
  const [applianceWarrantyInfo, setApplianceWarrantyInfo] = useState(null);
  const [applianceURL, setApplianceURL] = useState([]);
  const imageState = useState([]);
  const [addDoc, setAddDoc] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [docFiles, setDocFiles] = useState([]);
  const [addApplianceInfo, setAddApplianceInfo] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSpinnerParts, setShowSpinnerParts] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [uploadDone, setUploadDone] = useState(false);

  const toggleAppliance = (appliance) => {
    const newApplianceState = { ...applianceState };
    newApplianceState[appliance]["available"] =
      !newApplianceState[appliance]["available"];
    setApplianceType(appliance);
    setApplianceState(newApplianceState);
  };
  const showImage = (src) => {
    setOpenImage(true);
    setImageSrc(src);
  };
  const unShowImage = () => {
    setOpenImage(false);
    setImageSrc(null);
  };
  const hideModal = () => {
    setShowSpinner(false);
    setAddDetailsModalShow(false);
    cancelAppliance(applianceType);
    setApplianceImgModalShow(false);
    setApplianceDocModalShow(false);
    setApplianceUrlModalShow(false);
  };
  const getPartsList = () => {
    axios
      .post(
        "https://wanrucwrdg.execute-api.us-west-2.amazonaws.com/v1/insertparts",
        {
          model: applianceModelNum,
        }
      )
      .then((response) => {
        console.log(response);
        setShowSpinnerParts(false);
        setUploadDone(true);
      });
  };
  const hideNewModal = () => {
    setAddNewModalShow(false);
    cancelAppliance(applianceType);
  };
  function handleAddUrl() {
    const fields = [...applianceURL];
    fields.push([]);
    setApplianceURL(fields);
  }
  const handleChangeUrl = (i, event) => {
    const fields = [...applianceURL];
    fields[i] = event.target.value;
    setApplianceURL(fields);
  };
  function handleRemoveUrl(i) {
    const fields = [...applianceURL];
    fields.splice(i, 1);
    setApplianceURL(fields);
  }

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
          {selectedAppliance["images"] !== undefined &&
          selectedAppliance["images"].length > 0 ? (
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
                        src={`${img}?${Date.now()}`}
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
          {selectedAppliance["documents"] !== undefined &&
          selectedAppliance["documents"].length > 0 ? (
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
          {selectedAppliance["url"] !== undefined &&
          selectedAppliance["url"].length > 0 ? (
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

  const addDetailsModal = () => {
    return (
      <Dialog
        open={addDetailsModalShow}
        onClose={hideModal}
        fullWidth
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle closeButton>{applianceType}</DialogTitle>
        <DialogContent>
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                disabled
                variant="outlined"
                label="Type"
                size="small"
                value={applianceType}
              />
            </Col>
          </Row>
          <Row className="my-2">
            <Col>
              <TextField
                fullWidth
                variant="outlined"
                label="Manufacturer Name"
                size="small"
                value={
                  applianceManufacturer ||
                  applianceState[applianceType]["manufacturer"]
                }
                onChange={(e) => setApplianceManufacturer(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                variant="outlined"
                label="Purchased From"
                size="small"
                value={
                  appliancePurchasedFrom ||
                  applianceState[applianceType]["purchased_from"]
                }
                onChange={(e) => setAppliancePurchasedFrom(e.target.value)}
              />
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                type="date"
                variant="outlined"
                label="Purchased On"
                size="small"
                value={
                  appliancePurchasedOn ||
                  applianceState[applianceType]["purchased"]
                }
                onChange={(e) => setAppliancePurchasedOn(e.target.value)}
              />
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                variant="outlined"
                label="Purchase Order Number"
                size="small"
                value={
                  appliancePurchasesOrderNumber ||
                  applianceState[applianceType]["purchased_order"]
                }
                onChange={(e) =>
                  setAppliancePurchasesOrderNumber(e.target.value)
                }
              />
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                label="Installed On"
                size="small"
                value={
                  applianceInstalledOn ||
                  applianceState[applianceType]["installed"]
                }
                onChange={(e) => setApplianceInstalledOn(e.target.value)}
              />
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                variant="outlined"
                label="Serial Number"
                size="small"
                value={
                  applianceSerialNum ||
                  applianceState[applianceType]["serial_num"]
                }
                onChange={(e) => setApplianceSerialNum(e.target.value)}
              />
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col xs={10}>
              {" "}
              <TextField
                fullWidth
                variant="outlined"
                label="Model Number"
                size="small"
                value={
                  applianceModelNum ||
                  applianceState[applianceType]["model_num"]
                }
                onChange={(e) => setApplianceModelNum(e.target.value)}
              />
            </Col>
            <Col>
              {uploadDone ? (
                <img
                  title="Uploaded"
                  // onClick={() => {
                  //   setShowSpinnerParts(true);
                  //   getPartsList();
                  // }}
                  src={UploadDoneIcon}
                  style={{
                    width: "15px",
                    height: "15px",
                  }}
                />
              ) : (
                <img
                  title="Upload Model Number to get parts list"
                  onClick={() => {
                    setShowSpinnerParts(true);
                    getPartsList();
                  }}
                  src={UploadIcon}
                  style={{
                    width: "15px",
                    height: "15px",
                  }}
                />
              )}
            </Col>
            {console.log(showSpinnerParts)}
            <Col>
              {showSpinnerParts ? (
                <div className="w-100 d-flex flex-column justify-content-center align-items-center h-100">
                  <ReactBootStrap.Spinner animation="border" role="status" />
                </div>
              ) : (
                ""
              )}
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                variant="outlined"
                label="Warranty Info"
                size="small"
                value={
                  applianceWarrantyInfo ||
                  applianceState[applianceType]["warranty_info"]
                }
                onChange={(e) => setApplianceWarrantyInfo(e.target.value)}
              />
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                variant="outlined"
                label="Warranty Till"
                size="small"
                value={
                  applianceWarrantyTill ||
                  applianceState[applianceType]["warranty_till"]
                }
                onChange={(e) => setApplianceWarrantyTill(e.target.value)}
              />
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col>
              {" "}
              URLs:
              <img
                src={AddIcon}
                alt="Add Icon"
                onClick={handleAddUrl}
                style={{
                  width: "20px",
                  height: "20px",
                  marginLeft: "5rem",
                }}
              />
            </Col>

            {applianceURL && Object.values(applianceURL).length > 0 ? (
              <div>
                {applianceURL.map((item, idx) => {
                  return (
                    <Row className="my-2">
                      <Col>
                        {" "}
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="URL"
                          size="small"
                          value={item}
                          name="url"
                          onChange={(e) => handleChangeUrl(idx, e)}
                        />
                      </Col>{" "}
                      <Col>
                        {" "}
                        <img
                          src={DeleteIcon}
                          alt="Delete Icon"
                          onClick={() => handleRemoveUrl(idx)}
                          style={{
                            width: "15px",
                            height: "15px",
                          }}
                        />
                      </Col>
                    </Row>
                  );
                })}
              </div>
            ) : null}
          </Row>
          <Row className="my-2">
            {" "}
            <Col> {property ? <ApplianceImages state={imageState} /> : ""}</Col>
          </Row>
          <Row className="my-2">
            {" "}
            <Col>
              {" "}
              <DocumentsUploadPost
                files={docFiles}
                setFiles={setDocFiles}
                addDoc={addDoc}
                setAddDoc={setAddDoc}
                editingDoc={editingDoc}
                setEditingDoc={setEditingDoc}
              />
            </Col>
          </Row>
        </DialogContent>
        {showSpinner ? (
          <div className="w-100 d-flex flex-column justify-content-center align-items-center h-50">
            <ReactBootStrap.Spinner animation="border" role="status" />
          </div>
        ) : (
          ""
        )}
        <DialogActions>
          <Button
            style={pillButton}
            onClick={edit ? () => updateAppliance(applianceType) : () => {}}
            color="primary"
          >
            Save
          </Button>
          <Button style={pillButton} onClick={hideModal} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const addNewModal = () => {
    return (
      <Dialog
        open={addNewModalShow}
        onClose={hideNewModal}
        fullWidth
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle closeButton>{newAppliance}</DialogTitle>
        <DialogContent>
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                variant="outlined"
                label="Type"
                size="small"
                value={newAppliance}
                onChange={(e) => setNewAppliance(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="my-2">
            <Col>
              <TextField
                fullWidth
                variant="outlined"
                label="Manufacturer Name"
                size="small"
                value={applianceManufacturer}
                onChange={(e) => setApplianceManufacturer(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                variant="outlined"
                label="Purchased From"
                size="small"
                value={appliancePurchasedFrom}
                onChange={(e) => setAppliancePurchasedFrom(e.target.value)}
              />
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                type="date"
                variant="outlined"
                label="Purchased On"
                size="small"
                value={appliancePurchasedOn}
                onChange={(e) => setAppliancePurchasedOn(e.target.value)}
              />
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                variant="outlined"
                label="Purchase Order Number"
                size="small"
                value={appliancePurchasesOrderNumber}
                onChange={(e) =>
                  setAppliancePurchasesOrderNumber(e.target.value)
                }
              />
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                label="Installed On"
                size="small"
                value={applianceInstalledOn}
                onChange={(e) => setApplianceInstalledOn(e.target.value)}
              />
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                variant="outlined"
                label="Serial Number"
                size="small"
                value={applianceSerialNum}
                onChange={(e) => setApplianceSerialNum(e.target.value)}
              />
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                variant="outlined"
                label="Model Number"
                size="small"
                value={applianceModelNum}
                onChange={(e) => setApplianceModelNum(e.target.value)}
              />
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                variant="outlined"
                label="Warranty Info"
                size="small"
                value={applianceWarrantyInfo}
                onChange={(e) => setApplianceWarrantyInfo(e.target.value)}
              />
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col>
              {" "}
              <TextField
                fullWidth
                variant="outlined"
                label="Warranty Till"
                size="small"
                value={applianceWarrantyTill}
                onChange={(e) => setApplianceWarrantyTill(e.target.value)}
              />
            </Col>
          </Row>{" "}
          <Row className="my-2">
            <Col>
              {" "}
              URLs:
              <img
                src={AddIcon}
                alt="Add Icon"
                onClick={handleAddUrl}
                style={{
                  width: "20px",
                  height: "20px",
                  marginLeft: "5rem",
                }}
              />
            </Col>

            {applianceURL && Object.values(applianceURL).length > 0 ? (
              <div>
                {applianceURL.map((item, idx) => {
                  return (
                    <Col className="my-1">
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="URL"
                        size="small"
                        value={item}
                        name="url"
                        onChange={(e) => handleChangeUrl(idx, e)}
                      />
                    </Col>
                  );
                })}
              </div>
            ) : null}
          </Row>
          <Row className="my-2">
            {" "}
            <Col> {property ? <ApplianceImages state={imageState} /> : ""}</Col>
          </Row>
          <Row className="my-2">
            {" "}
            <Col>
              {" "}
              <DocumentsUploadPost
                files={docFiles}
                setFiles={setDocFiles}
                addDoc={addDoc}
                setAddDoc={setAddDoc}
                editingDoc={editingDoc}
                setEditingDoc={setEditingDoc}
              />
            </Col>
          </Row>
        </DialogContent>
        {showSpinner ? (
          <div className="w-100 d-flex flex-column justify-content-center align-items-center h-50">
            <ReactBootStrap.Spinner animation="border" role="status" />
          </div>
        ) : (
          ""
        )}
        <DialogActions>
          <Button
            style={pillButton}
            onClick={edit ? () => addAppliance(applianceType) : () => {}}
            color="primary"
          >
            Save
          </Button>
          <Button style={pillButton} onClick={hideNewModal} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const showApplianceDetail = (appliance) => {
    setUploadDone(false);
    setApplianceType(appliance);
    // setShowDetails(!showDetails);
    setAddDetailsModalShow(!addDetailsModalShow);
    setAddApplianceInfo(!addApplianceInfo);
    setApplianceType(appliance);
    setApplianceState(applianceState);
    setApplianceManufacturer(applianceState[appliance]["manufacturer"]);
    setAppliancePurchasedOn(applianceState[appliance]["purchased"]);
    setAppliancePurchasedFrom(applianceState[appliance]["purchased_from"]);
    setAppliancePurchasesOrderNumber(
      applianceState[appliance]["purchased_order"]
    );
    setApplianceInstalledOn(applianceState[appliance]["installed"]);
    setApplianceSerialNum(applianceState[appliance]["serial_num"]);
    setApplianceModelNum(applianceState[appliance]["model_num"]);
    setApplianceWarrantyTill(applianceState[appliance]["warranty_till"]);
    setApplianceWarrantyInfo(applianceState[appliance]["warranty_info"]);
    if (applianceState[appliance]["url"] !== undefined) {
      setApplianceURL(applianceState[appliance]["url"]);
    }
    if (applianceState[appliance]["images"] !== undefined) {
      const imageFiles = [];

      const images = applianceState[appliance]["images"];
      for (let i = 0; i < images.length; i++) {
        imageFiles.push({
          index: i,
          image: images[i],
          file: null,
          coverPhoto: i === 0,
        });
      }
      imageState[1](imageFiles);
    }
    if (
      applianceState[appliance]["documents"] !== undefined &&
      applianceState[appliance]["documents"].length !== 0
    ) {
      setDocFiles(applianceState[appliance]["documents"]);
    }
  };
  const onCancel = () => {
    setShowDialog(false);
  };
  const removeappliance = async (app) => {
    let rem_app = {
      property_uid: property.property_uid,
      appliance: applianceRem,
    };
    let i = 0;
    let files = imageState[0];
    for (const file of imageState[0]) {
      let key = `img_${app}_${i++}`;
      if (file.file !== null) {
        rem_app[key] = file.file;
      } else {
        rem_app[key] = file.image;
      }
    }
    const response = await put("/RemoveAppliance", rem_app, null, files);
    const getNewApplianceInfo = await get(
      `/appliances?property_uid=${property.property_uid}`
    );
    let newinfo = JSON.parse(getNewApplianceInfo.result[0].appliances);
    setApplianceState(newinfo);
    setShowDialog(false);
  };

  const Capitalize = (str) => {
    return (
      str.toString().charAt(0).toUpperCase() +
      str.toString().slice(1).toLowerCase()
    );
  };

  const updateAppliance = async (appliance) => {
    const newApplianceState = { ...applianceState };

    newApplianceState[appliance]["available"] = Capitalize(
      newApplianceState[appliance]["available"]
    );
    newApplianceState[appliance]["model_num"] = applianceModelNum;
    newApplianceState[appliance]["manufacturer"] = applianceManufacturer;
    newApplianceState[appliance]["purchased"] = appliancePurchasedOn;
    newApplianceState[appliance]["purchased_from"] = appliancePurchasedFrom;
    newApplianceState[appliance]["purchased_order"] =
      appliancePurchasesOrderNumber;
    newApplianceState[appliance]["installed"] = applianceInstalledOn;
    newApplianceState[appliance]["serial_num"] = applianceSerialNum;
    newApplianceState[appliance]["warranty_info"] = applianceWarrantyInfo;
    newApplianceState[appliance]["warranty_till"] = applianceWarrantyTill;
    newApplianceState[appliance]["url"] = applianceURL;

    if (imageState[0].length === 0) {
      newApplianceState[appliance]["images"] = imageState[0];
    }
    if (docFiles.length === 0) {
      newApplianceState[appliance]["documents"] = docFiles[0];
    }

    if (property) {
      let newProperty = {
        property_uid: property.property_uid,
        appliances: JSON.stringify({
          [appliance]: newApplianceState[appliance],
        }),
      };
      let allFiles = [];
      const imageFiles = imageState[0];
      allFiles = imageFiles;
      let i = 0;
      for (const file of imageState[0]) {
        let key = file.coverPhoto
          ? `img_${appliance}_cover`
          : `img_${appliance}_${i++}`;
        if (file.file !== null) {
          newProperty[key] = file.file;
        } else {
          newProperty[key] = file.image;
        }
      }
      const docuFiles = [...docFiles];
      for (let i = 0; i < docuFiles.length; i++) {
        let key = `doc_${appliance}_${i}`;
        if (docuFiles[i].file !== undefined) {
          newProperty[key] = docuFiles[i].file;
        } else {
          newProperty[key] = docuFiles[i].link;
        }

        delete docuFiles[i].file;
      }
      newProperty.documents = JSON.stringify(docuFiles);
      if (docuFiles.length > 0) {
        allFiles.push(docuFiles);
      }
      setShowSpinner(true);

      const response = await put("/appliances", newProperty, null, allFiles);
    }

    setAddApplianceInfo(false);
    setShowDetails(false);
    const getNewApplianceInfo = await get(
      `/appliances?property_uid=${property.property_uid}`
    );
    let newinfo = JSON.parse(getNewApplianceInfo.result[0].appliances);
    setApplianceState(newinfo);
    imageState[0] = [];
    setDocFiles([]);
    setAddDetailsModalShow(!addDetailsModalShow);
    setApplianceManufacturer("");
    setAppliancePurchasedOn("");
    setAppliancePurchasesOrderNumber("");
    setAppliancePurchasedFrom("");
    setApplianceInstalledOn("");
    setApplianceSerialNum("");
    setApplianceModelNum("");
    setApplianceWarrantyTill("");
    setApplianceWarrantyInfo("");
    setApplianceURL("");
    setShowSpinner(false);
  };

  const cancelAppliance = (appliance) => {
    const newApplianceState = { ...applianceState };
    imageState[0] = [];
    setDocFiles([]);
    setAddApplianceInfo(false);
    setShowDetails(false);
    setApplianceState(newApplianceState);
    setApplianceManufacturer("");
    setAppliancePurchasedOn("");
    setAppliancePurchasedFrom("");
    setAppliancePurchasesOrderNumber("");
    setApplianceInstalledOn("");
    setApplianceSerialNum("");
    setApplianceModelNum("");
    setApplianceWarrantyTill("");
    setApplianceWarrantyInfo("");
    setApplianceURL("");
  };

  const addAppliance = async () => {
    const newApplianceState = { ...applianceState };
    newApplianceState[newAppliance] = {};
    newApplianceState[newAppliance]["available"] = "True";
    newApplianceState[newAppliance]["model_num"] =
      applianceModelNum === null ? "" : applianceModelNum;
    newApplianceState[newAppliance]["manufacturer"] =
      applianceManufacturer === null ? "" : applianceManufacturer;
    newApplianceState[newAppliance]["purchased"] =
      appliancePurchasedOn === null ? "" : appliancePurchasedOn;
    newApplianceState[newAppliance]["purchased_from"] =
      appliancePurchasedFrom === null ? "" : appliancePurchasedFrom;
    newApplianceState[newAppliance]["purchased_order"] =
      appliancePurchasesOrderNumber === null
        ? ""
        : appliancePurchasesOrderNumber;
    newApplianceState[newAppliance]["installed"] =
      applianceInstalledOn === null ? "" : applianceInstalledOn;
    newApplianceState[newAppliance]["serial_num"] =
      applianceSerialNum === null ? "" : applianceSerialNum;
    newApplianceState[newAppliance]["warranty_info"] =
      applianceWarrantyInfo === null ? "" : applianceWarrantyInfo;
    newApplianceState[newAppliance]["warranty_till"] =
      applianceWarrantyTill === null ? "" : applianceWarrantyTill;
    newApplianceState[newAppliance]["url"] =
      applianceURL === null ? "" : applianceURL;
    setApplianceState(newApplianceState);
    if (imageState[0].length === 0) {
      newApplianceState[newAppliance]["images"] = imageState[0];
    }
    if (docFiles.length === 0) {
      newApplianceState[newAppliance]["documents"] = docFiles[0];
    }

    if (property) {
      let newProperty = {
        property_uid: property.property_uid,
        appliances: JSON.stringify({
          [newAppliance]: newApplianceState[newAppliance],
        }),
      };
      let allFiles = [];
      const imageFiles = imageState[0];
      allFiles = imageFiles;
      let i = 0;
      for (const file of imageState[0]) {
        let key = file.coverPhoto
          ? `img_${newAppliance}_cover`
          : `img_${newAppliance}_${i++}`;
        if (file.file !== null) {
          newProperty[key] = file.file;
        } else {
          newProperty[key] = file.image;
        }
      }
      const docuFiles = [...docFiles];
      for (let i = 0; i < docuFiles.length; i++) {
        let key = `doc_${newAppliance}_${i}`;
        if (docuFiles[i].file !== undefined) {
          newProperty[key] = docuFiles[i].file;
        } else {
          newProperty[key] = docuFiles[i].link;
        }

        delete docuFiles[i].file;
      }
      newProperty.documents = JSON.stringify(docuFiles);
      if (docuFiles.length > 0) {
        allFiles.push(docuFiles);
      }
      setShowSpinner(true);
      const response = await put("/appliances", newProperty, null, allFiles);
    }

    imageState[0] = [];
    setDocFiles([]);
    const getNewApplianceInfo = await get(
      `/appliances?property_uid=${property.property_uid}`
    );
    let newinfo = JSON.parse(getNewApplianceInfo.result[0].appliances);
    setApplianceState(newinfo);
    setNewAppliance(null);
    setApplianceManufacturer("");
    setAppliancePurchasedOn("");
    setAppliancePurchasedFrom("");
    setAppliancePurchasesOrderNumber("");
    setApplianceSerialNum("");
    setApplianceModelNum("");
    setApplianceWarrantyTill("");
    setApplianceWarrantyInfo("");
    setApplianceURL("");
    setShowSpinner(false);
    setAddNewModalShow(!addNewModalShow);
  };
  return (
    <div style={({ padding: "0px" }, mediumBold)} className="my-4">
      <ConfirmDialog
        title={"Are you sure you want to delete this appliance?"}
        isOpen={showDialog}
        onConfirm={removeappliance}
        onCancel={onCancel}
      />
      <ImageModal src={imageSrc} isOpen={openImage} onCancel={unShowImage} />
      {property !== undefined ? (
        <div>
          <h5 className="mx-3 mt-2">
            {property.address}
            {property.unit !== "" ? ` ${property.unit}, ` : ", "}
            {property.city}, {property.state} {property.zip}
          </h5>
        </div>
      ) : (
        <div>
          <h5 className="mx-3 mt-2">New Property</h5>
        </div>
      )}

      <Row className="d-flex justify-content-center align-items-center">
        <Col className="d-flex">
          <h6 style={mediumBold} className="mx-3 mt-2">
            Appliances
          </h6>
        </Col>

        <Col>
          {newAppliance === null && edit ? (
            <img
              src={AddIcon}
              alt="Add Icon"
              onClick={() => setAddNewModalShow(!addNewModalShow)}
              style={{
                width: "15px",
                height: "15px",
                float: "right",
                marginRight: "5rem",
              }}
            />
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row
        className="d-flex justify-content-center align-items-center m-3"
        style={{ overflow: "scroll" }}
      >
        <Table
          classes={{ root: classes.customTable }}
          responsive="md"
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
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
              <TableCell align="center">URL</TableCell>
              <TableCell align="center">Images</TableCell>
              <TableCell align="center">Documents</TableCell>
              <TableCell></TableCell>
              {addApplianceInfo === true && showDetails === true ? (
                <TableCell></TableCell>
              ) : (
                ""
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {appliances.map((appliance, i) => {
              return (
                <TableRow>
                  <TableCell size="small">
                    {" "}
                    <Checkbox
                      type="BOX"
                      checked={applianceState[appliance]["available"]}
                      onClick={
                        edit ? () => toggleAppliance(appliance) : () => {}
                      }
                    />
                  </TableCell>
                  <TableCell
                    onClick={
                      edit
                        ? () => {
                            showApplianceDetail(appliance);
                          }
                        : () => {}
                    }
                  >
                    {appliance}
                  </TableCell>
                  <TableCell align="center">
                    {applianceState[appliance]["manufacturer"]}
                  </TableCell>
                  <TableCell align="center">
                    {applianceState[appliance]["purchased_from"]}
                  </TableCell>
                  <TableCell align="center">
                    {applianceState[appliance]["purchased"]}
                  </TableCell>
                  <TableCell align="center">
                    {applianceState[appliance]["purchased_order"]}
                  </TableCell>
                  <TableCell align="center">
                    {applianceState[appliance]["installed"]}
                  </TableCell>
                  <TableCell align="center">
                    {applianceState[appliance]["serial_num"]}
                  </TableCell>
                  <TableCell align="center">
                    {applianceState[appliance]["model_num"]}
                  </TableCell>
                  <TableCell align="center">
                    {applianceState[appliance]["warranty_till"]}
                  </TableCell>
                  <TableCell align="center">
                    {applianceState[appliance]["warranty_info"]}
                  </TableCell>
                  <TableCell align="center">
                    {applianceState[appliance]["url"] !== undefined &&
                    applianceState[appliance]["url"].length > 0 ? (
                      <img
                        src={LinkIcon}
                        onClick={() => {
                          setApplianceUrlModalShow(!applianceUrlModalShow);
                          setSelectedAppliance(applianceState[appliance]);
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
                    {applianceState[appliance]["images"] !== undefined &&
                    applianceState[appliance]["images"].length > 0 ? (
                      <img
                        src={ImgIcon}
                        onClick={() => {
                          setApplianceImgModalShow(!applianceImgModalShow);
                          setSelectedAppliance(applianceState[appliance]);
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
                  <TableCell align="center">
                    {applianceState[appliance]["documents"] !== undefined &&
                    applianceState[appliance]["documents"].length > 0 ? (
                      <img
                        src={DocIcon}
                        onClick={() => {
                          setApplianceDocModalShow(!applianceDocModalShow);
                          setSelectedAppliance(applianceState[appliance]);
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
                  {!og_appliances.includes(appliance) ? (
                    <TableCell>
                      <img
                        src={DeleteIcon}
                        onClick={() => {
                          setShowDialog(true);
                          setApplianceRem(appliance);
                        }}
                        style={{
                          width: "15px",
                          height: "15px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                  ) : (
                    <TableCell></TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Row>
      {addDetailsModal()}
      {addNewModal()}
      {ApplianceImgModal()}
      {ApplianceDocModal()}
      {ApplianceUrlModal()}
      <Row className="d-flex flex-column justify-content-left overflow-scroll"></Row>
    </div>
  );
}

export default PropertyAppliances;
