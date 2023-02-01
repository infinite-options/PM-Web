import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import * as ReactBootStrap from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Header from "../Header";
import File from "../../icons/File.svg";
import ManagerFees from "../ManagerFees";
import BusinessContact from "../BusinessContact";
import AppContext from "../../AppContext";
import ManagerFooter from "./ManagerFooter";
import SideBar from "./SideBar";
import EditIcon from "../../icons/EditIcon.svg";
import DeleteIcon from "../../icons/DeleteIcon.svg";
import { put, post } from "../../utils/api";
import {
  small,
  hidden,
  red,
  squareForm,
  mediumBold,
  headings,
  pillButton,
} from "../../utils/styles";
import DocumentsUploadPost from "../DocumentsUploadPost";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});

function ManagerManagementContract(props) {
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const { back, property, contract, selectedBusiness, reload } = props;

  const [showSpinner, setShowSpinner] = useState(false);
  const [contractName, setContractName] = useState("");

  const [addDoc, setAddDoc] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [feeState, setFeeState] = useState([]);
  const contactState = useState([]);
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [width, setWindowWidth] = useState(0);

  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };
  const responsive = {
    showSidebar: width > 1023,
  };

  const editDocument = (i) => {
    const newFiles = [...files];
    const file = newFiles.splice(i, 1)[0];
    setFiles(newFiles);
    setEditingDoc(file);
    setNewFile({ ...file });
  };
  // const saveNewFile = (e) => {
  //   // copied from addFile, change e.target.files to state.newFile
  //   const newFiles = [...files];
  //   newFiles.push(newFile);
  //   setFiles(newFiles);
  //   setNewFile(null);
  // };
  const deleteDocument = (i) => {
    const newFiles = [...files];
    newFiles.splice(i, 1);
    setFiles(newFiles);
  };
  const loadContract = () => {
    if (contract.contract_name) {
      setContractName(contract.contract_name);
    }
    setStartDate(contract.start_date);
    setEndDate(contract.end_date);
    setFeeState(JSON.parse(contract.contract_fees));
    contactState[1](JSON.parse(contract.assigned_contacts));
    setFiles(JSON.parse(contract.documents));
  };
  useEffect(() => {
    if (contract) {
      loadContract();
    } else {
      setFeeState(JSON.parse(selectedBusiness.business_services_fees));
    }
  }, [contract]);

  const save = async () => {
    if (contractName === "" || startDate === "" || endDate === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }

    let start_date = new Date(startDate);
    let end_date = new Date(endDate);
    if (start_date >= end_date) {
      setErrorMessage("Select an End Date later than Start Date");
      return;
    }
    setErrorMessage("");
    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid;
    }
    const newContract = {
      property_uid: property.property_uid,
      business_uid: management_buid,
      contract_name: contractName,
      start_date: startDate,
      end_date: endDate,
      contract_fees: JSON.stringify(feeState),
      assigned_contacts: JSON.stringify(contactState[0]),
      contract_status: "ACTIVE",
    };
    const newFiles = [...files];

    for (let i = 0; i < newFiles.length; i++) {
      let key = `doc_${i}`;
      if (newFiles[i].file !== undefined) {
        newContract[key] = newFiles[i].file;
      } else {
        newContract[key] = newFiles[i].link;
      }

      delete newFiles[i].file;
    }
    newContract.documents = JSON.stringify(newFiles);
    // newContract.documents = JSON.stringify(files);
    // console.log(newContract);
    if (contract) {
      newContract.contract_uid = contract.contract_uid;

      const response = await put(`/contracts`, newContract, null, newFiles);
    } else {
      // console.log(newContract);
      const response = await post("/contracts", newContract, null, newFiles);
    }

    const newProperty = {
      property_uid: property.property_uid,
      manager_id: management_buid,
      management_status: "SENT",
    };
    const images = JSON.parse(property.images);
    for (let i = -1; i < images.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      newProperty[key] = images[i + 1];
    }
    setShowSpinner(true);
    await put("/properties", newProperty, null, images);
    back();
    reload();
  };
  const [errorMessage, setErrorMessage] = useState("");
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  // console.log(property);
  return (
    <div className="flex-1">
      <div
        hidden={!responsive.showSidebar}
        style={{
          backgroundColor: "#229ebc",
          width: "11rem",
          minHeight: "100%",
        }}
      >
        <SideBar />
      </div>
      <div className="w-100 mb-5 overflow-scroll">
        <Header
          title="Management Contract"
          leftText="< Back"
          leftFn={back}
          // rightText="Save"
          // rightFn={save}
        />
        <div
          className="mx-2 my-2 p-3"
          style={{
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            borderRadius: "10px",
            opacity: 1,
          }}
        >
          <div
            className="text-center"
            style={errorMessage === "" ? hidden : {}}
          >
            <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
          </div>
          <div
            className="mx-3 my-3 p-2 row"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <div className="col">
              <h5 style={headings}>
                {property.address}
                {property.unit !== "" ? ` ${property.unit}, ` : ", "}
                {property.city}, {property.state} {property.zip}
              </h5>
            </div>
            <div className="col">
              <h5 style={headings}>
                Owner: {property.owner[0].owner_first_name}{" "}
                {property.owner[0].owner_last_name}
              </h5>
              <h5 style={headings}>
                Rental Status:{" "}
                {property.rental_status == ""
                  ? "Not Rented"
                  : property.rental_status}
              </h5>
            </div>
          </div>
          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <h5 style={headings}>Contract Details</h5>
            <Form.Group className="mx-2 my-3">
              <Form.Label style={mediumBold} className="mb-0 ms-2">
                Contract Name {contractName === "" ? required : ""}
              </Form.Label>
              <Form.Control
                style={squareForm}
                value={contractName}
                placeholder="Contract Name"
                onChange={(e) => setContractName(e.target.value)}
              />
            </Form.Group>
          </div>
          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            {" "}
            <Row>
              <h5 style={mediumBold}>PM Agreement Dates</h5>
              <Col>
                <Form.Group className="mx-2 my-3">
                  <Form.Label style={mediumBold} className="mb-0 ms-2">
                    Start Date {startDate === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mx-2 my-3">
                  <Form.Label style={mediumBold} className="mb-0 ms-2">
                    End Date {endDate === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <h5 style={mediumBold}>PM Fees</h5>
            <div className="mx-2">
              <ManagerFees
                feeState={feeState}
                setFeeState={setFeeState}
                selectedBusiness={selectedBusiness}
                editProfile={true}
              />
            </div>
          </div>
          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <h5 style={mediumBold}>Contact Details</h5>
            <BusinessContact state={contactState} />
          </div>
          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <h5 style={mediumBold}>Property Manager Documents</h5>
            {files.length > 0 ? (
              <Table
                responsive="md"
                classes={{ root: classes.customTable }}
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Document Name</TableCell>
                    <TableCell>Actions</TableCell>
                    <TableCell>View Document</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {files.map((file, i) => {
                    return (
                      <TableRow>
                        <TableCell>{file.description}</TableCell>
                        <TableCell>
                          {" "}
                          <img
                            src={EditIcon}
                            alt="Edit"
                            className="px-1 mx-2"
                            onClick={() => editDocument(i)}
                          />
                          <img
                            src={DeleteIcon}
                            alt="Delete"
                            className="px-1 mx-2"
                            onClick={() => deleteDocument(i)}
                          />
                        </TableCell>
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
            ) : (
              ""
            )}

            <DocumentsUploadPost
              files={files}
              setFiles={setFiles}
              addDoc={addDoc}
              setAddDoc={setAddDoc}
            />
          </div>
          {showSpinner ? (
            <div className="w-100 d-flex flex-column justify-content-center align-items-center">
              <ReactBootStrap.Spinner animation="border" role="status" />
            </div>
          ) : (
            ""
          )}
          <div
            className="d-flex justify-content-center mb-4 mx-2 mb-2 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",

              opacity: 1,
            }}
          >
            <Button
              variant="outline-primary"
              style={pillButton}
              className="mx-2"
              onClick={save}
            >
              Save
            </Button>
          </div>
        </div>{" "}
        <div hidden={responsive.showSidebar} className="w-100 mt-3">
          <ManagerFooter />
        </div>
      </div>
    </div>
  );
}

export default ManagerManagementContract;
