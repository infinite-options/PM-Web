import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import Header from "../Header";
import BusinessContact from "../BusinessContact";
import ManagerTenantRentPayments from "./ManagerTenantRentPayments";
import ManagerFooter from "./ManagerFooter";
import SideBar from "./SideBar";
import ArrowDown from "../../icons/ArrowDown.svg";
import File from "../../icons/File.svg";
import { put, post } from "../../utils/api";
import {
  small,
  hidden,
  red,
  squareForm,
  mediumBold,
  smallPillButton,
  bluePillButton,
  smallImg,
} from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});

function ManagerTenantAgreementEdit(props) {
  const classes = useStyles();
  const { back, property, agreement } = props;
  console.log("here", agreement);

  console.log("here", props);
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  const [tenantID, setTenantID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [feeState, setFeeState] = useState([]);
  const contactState = useState([]);
  const [files, setFiles] = useState([]);

  const [newFile, setNewFile] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);

  const [dueDate, setDueDate] = useState("1");
  const [lateAfter, setLateAfter] = useState("");
  const [lateFee, setLateFee] = useState("");
  const [lateFeePer, setLateFeePer] = useState("");
  const [available, setAvailable] = useState("");

  const [adultOccupants, setAdultOccupants] = useState("");
  const [childrenOccupants, setChildrenOccupants] = useState("");
  const [numPets, setNumPets] = useState("");
  const [typePets, setTypePets] = useState("");

  const [showSpinner, setShowSpinner] = useState(false);
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
  const responsiveSidebar = {
    showSidebar: width > 1023,
  };
  const addFile = (e) => {
    const file = e.target.files[0];
    const newFile = {
      name: file.name,
      description: "",
      file: file,
    };
    setNewFile(newFile);
  };

  const updateNewFile = (field, value) => {
    const newFileCopy = { ...newFile };
    newFileCopy[field] = value;
    setNewFile(newFileCopy);
  };
  const cancelEdit = () => {
    setNewFile(null);
    if (editingDoc !== null) {
      const newFiles = [...files];
      newFiles.push(editingDoc);
      setFiles(newFiles);
    }
    setEditingDoc(null);
  };
  const editDocument = (i) => {
    const newFiles = [...files];
    const file = newFiles.splice(i, 1)[0];
    setFiles(newFiles);
    setEditingDoc(file);
    setNewFile({ ...file });
  };
  const saveNewFile = (e) => {
    // copied from addFile, change e.target.files to state.newFile
    const newFiles = [...files];
    newFiles.push(newFile);
    setFiles(newFiles);
    setNewFile(null);
  };
  const deleteDocument = (i) => {
    const newFiles = [...files];
    newFiles.splice(i, 1);
    setFiles(newFiles);
  };

  const loadAgreement = () => {
    setTenantID(agreement.tenant_id);
    setStartDate(agreement.lease_start);
    setEndDate(agreement.lease_end);
    setFeeState(JSON.parse(agreement.rent_payments));
    contactState[1](JSON.parse(agreement.assigned_contacts));
    setFiles(JSON.parse(agreement.documents));
    setAvailable(agreement.available_topay);
    setDueDate(agreement.due_by);
    setLateAfter(agreement.late_by);
    setLateFee(agreement.late_fee);
    setLateFeePer(agreement.perDay_late_fee);
    setAdultOccupants(agreement.adult_occupants);
    setChildrenOccupants(agreement.children_occupants);
    setNumPets(agreement.num_pets);
    setTypePets(agreement.type_pets);
  };
  useEffect(() => {
    console.log("in useeffect");
    setAdultOccupants(agreement.adult_occupants);
    setChildrenOccupants(agreement.children_occupants);
    setNumPets(agreement.num_pets);
    setTypePets(agreement.type_pets);
    if (agreement) {
      loadAgreement();
    }
  }, [agreement]);
  console.log(feeState);
  const save = async () => {
    setShowSpinner(true);

    console.log(lateFee);
    const newAgreement = {
      rental_property_id: property.property_uid,
      lease_start: startDate,
      lease_end: endDate,
      rent_payments: JSON.stringify(feeState),
      available_topay: available,
      due_by: dueDate,
      late_by: lateAfter,
      late_fee: lateFee,
      perDay_late_fee: lateFeePer,
      assigned_contacts: JSON.stringify(contactState[0]),
      adult_occupants: adultOccupants,
      children_occupants: childrenOccupants,
      num_pets: numPets,
      type_pets: typePets,
    };
    console.log(newAgreement);
    for (let i = 0; i < files.length; i++) {
      let key = `img_${i}`;
      newAgreement[key] = files[i];
    }
    if (agreement !== null) {
      console.log("in if");
      newAgreement.rental_uid = agreement.rental_uid;
      console.log(newAgreement);
      const response = await put(`/rentals`, newAgreement, null, files);
    }

    setShowSpinner(false);

    back();
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
  console.log("feeState in tenantagreemnt", feeState);

  return (
    <div className="flex-1">
      <div
        hidden={!responsiveSidebar.showSidebar}
        style={{
          backgroundColor: "#229ebc",
          width: "11rem",
          minHeight: "100%",
        }}
      >
        <SideBar />
      </div>
      <div className="w-100 mb-5 overflow-hidden">
        <Header
          title="Tenant Agreement"
          leftText="< Back"
          leftFn={back}
          rightText=""
        />
        <div className=" w-100 mx-2 my-2 p-3">
          <Row className="mb-4">
            <Col>
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Lease Start Date {startDate === "" ? required : ""}
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
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Lease End Date {endDate === "" ? required : ""}
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

          <Row className="mb-4">
            <Col>
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  No. of Adult Occupants
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  placeholder="No. of Adult Occupants"
                  value={adultOccupants}
                  onChange={(e) => setAdultOccupants(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  No. of Children Occupants
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  placeholder="No. of Children Occupants"
                  defaultValue={childrenOccupants}
                  onChange={(e) => setChildrenOccupants(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  No. of Pets
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  placeholder="No. of Pets"
                  value={numPets}
                  onChange={(e) => setNumPets(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Type of Pets
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  placeholder="Type of Pets"
                  value={typePets}
                  onChange={(e) => setTypePets(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="my-3">
            <h5 style={mediumBold}>Default Payment Parameters</h5>
            <Col>
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Rent Available to pay(days before due)
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  style={squareForm}
                  placeholder="days"
                  value={available}
                  onChange={(e) => setAvailable(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Rent Payment Due Date {dueDate === "" ? required : ""}
                </Form.Label>
                {/*<Form.Control style={squareForm} placeholder='5 Days' />*/}
                <Form.Select
                  style={{
                    ...squareForm,
                    backgroundImage: `url(${ArrowDown})`,
                  }}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                >
                  <option value="1">1st of the month</option>
                  <option value="2">2nd of the month</option>
                  <option value="3">3rd of the month</option>
                  <option value="4">4th of the month</option>
                  <option value="5">5th of the month</option>
                  <option value="10">10th of the month</option>
                  <option value="15">15th of the month</option>
                  <option value="20">20th of the month</option>
                  <option value="25">25th of the month</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <h5 style={mediumBold}>Late Payment Details</h5>
            <Col>
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Late Fee (one-time) {lateFee === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  value={lateFee}
                  type="number"
                  min="0"
                  style={squareForm}
                  placeholder="amount($)"
                  onChange={(e) => setLateFee(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Late fees after (days)
                  {lateAfter === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  value={lateAfter}
                  style={squareForm}
                  placeholder="days"
                  type="number"
                  min="0"
                  onChange={(e) => setLateAfter(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Late Fee (per day) {lateFeePer === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  value={lateFeePer}
                  type="number"
                  min="0"
                  style={squareForm}
                  placeholder="amount($)"
                  onChange={(e) => setLateFeePer(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mb-4">
            <h5 style={mediumBold}>Rent Payments</h5>
            <div className="mx-2">
              <ManagerTenantRentPayments
                feeState={feeState}
                setFeeState={setFeeState}
                property={property}
                startDate={startDate}
                endDate={endDate}
                dueDate={dueDate}
                lateAfter={lateAfter}
                lateFee={lateFee}
                lateFeePer={lateFeePer}
                available={available}
              />
            </div>
          </div>

          <div className="mb-4">
            <h5 style={mediumBold}>Contact Details</h5>
            <BusinessContact state={contactState} />
          </div>

          <div className="mb-4">
            <h5 style={mediumBold}>Lease Documents</h5>
            {files.length > 0 ? (
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
                  {files.map((file) => {
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
            ) : (
              ""
            )}

            {newFile !== null ? (
              <div>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label as="h6" className="mb-0 ms-2">
                        Document Name
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        value={newFile.name}
                        placeholder="Name"
                        onChange={(e) => updateNewFile("name", e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    {" "}
                    <Form.Group>
                      <Form.Label as="h6" className="mb-0 ms-2">
                        Description
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        value={newFile.description}
                        placeholder="Description"
                        onChange={(e) =>
                          updateNewFile("description", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="text-center my-3">
                  <Button
                    variant="outline-primary"
                    style={smallPillButton}
                    as="p"
                    onClick={cancelEdit}
                    className="mx-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline-primary"
                    style={smallPillButton}
                    as="p"
                    onClick={saveNewFile}
                    className="mx-2"
                  >
                    Save Document
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <input
                  id="file"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={addFile}
                  className="d-none"
                />
                <label htmlFor="file">
                  <Button
                    variant="outline-primary"
                    style={smallPillButton}
                    as="p"
                  >
                    Add Document
                  </Button>
                </label>
              </div>
            )}
          </div>
          {showSpinner ? (
            <div className="w-100 d-flex flex-column justify-content-center align-items-center">
              <ReactBootStrap.Spinner animation="border" role="status" />
            </div>
          ) : (
            ""
          )}
          <Row
            className="mt-4"
            hidden={agreement.rental_status !== "PROCESSING"}
          >
            <div
              className="text-center"
              style={errorMessage === "" ? hidden : {}}
            >
              <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
            </div>
            <Col className="d-flex justify-content-evenly">
              <Button style={bluePillButton} onClick={save}>
                Send Lease Details to Tenant(s)
              </Button>
            </Col>
          </Row>
        </div>

        <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-5">
          <ManagerFooter />
        </div>
      </div>
    </div>
  );
}

export default ManagerTenantAgreementEdit;
