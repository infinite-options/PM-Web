import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../Header";
import BusinessContact from "../BusinessContact";
import ManagerTenantRentPayments from "./ManagerTenantRentPayments";
import ManagerFooter from "./ManagerFooter";
import SideBar from "./SideBar";
import EditIcon from "../../icons/EditIcon.svg";
import DeleteIcon from "../../icons/DeleteIcon.svg";
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
} from "../../utils/styles";

function ManagerTenantAgreement(props) {
  const {
    back,
    property,
    agreement,
    acceptedTenantApplications,
    setAcceptedTenantApplications,
  } = props;
  console.log("here", acceptedTenantApplications);
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
    setAdultOccupants(acceptedTenantApplications[0].adult_occupants);
    setChildrenOccupants(acceptedTenantApplications[0].children_occupants);
    setNumPets(acceptedTenantApplications[0].num_pets);
    setTypePets(acceptedTenantApplications[0].type_pets);
    if (agreement) {
      loadAgreement();
    }
  }, [agreement]);

  const save = async () => {
    const newAgreement = {
      rental_property_id: property.property_uid,
      tenant_id: acceptedTenantApplications[0].tenant_id,
      lease_start: startDate,
      lease_end: endDate,
      rent_payments: JSON.stringify(feeState),
      assigned_contacts: JSON.stringify(contactState[0]),
      adult_occupants: adultOccupants,
      children_occupants: childrenOccupants,
      num_pets: numPets,
      type_pets: typePets,
    };
    newAgreement.linked_application_id = JSON.stringify(
      acceptedTenantApplications.map(
        (application) => application.application_uid
      )
    );
    for (let i = 0; i < files.length; i++) {
      let key = `img_${i}`;
      newAgreement[key] = files[i];
    }
    if (agreement) {
      newAgreement.rental_uid = agreement.rental_uid;
      console.log(newAgreement);
      const response = await put(`/rentals`, newAgreement, null, files);
    } else {
      newAgreement.tenant_id = acceptedTenantApplications;
      const response = await post("/rentals", newAgreement, null, files);
    }
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
  const forwardLeaseAgreement = async () => {
    if (startDate === "" || endDate === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }

    let start_date = new Date(startDate);
    let end_date = new Date(endDate);
    if (start_date >= end_date) {
      setErrorMessage("Select an End Date later than Start Date");
      return;
    }

    if (
      dueDate === "" ||
      lateAfter === "" ||
      lateFee === "" ||
      lateFeePer === ""
    ) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    setErrorMessage("");
    for (let i = 0; i < feeState.length; i++) {
      if (feeState[i]["fee_name"] === "Deposit") {
        feeState[i]["available_topay"] = available;
        feeState[i]["due_by"] = "";
        feeState[i]["late_by"] = lateAfter;
        feeState[i]["late_fee"] = lateFee;
        feeState[i]["perDay_late_fee"] = lateFeePer;
      } else if (feeState[i]["fee_name"] === "Rent") {
        feeState[i]["available_topay"] = available;
        feeState[i]["due_by"] = dueDate;
        feeState[i]["late_by"] = lateAfter;
        feeState[i]["late_fee"] = lateFee;
        feeState[i]["perDay_late_fee"] = lateFeePer;
      } else {
      }
    }
    const newAgreement = {
      rental_property_id: property.property_uid,
      tenant_id: null,
      lease_start: startDate,
      lease_end: endDate,
      rent_payments: JSON.stringify(feeState),
      assigned_contacts: JSON.stringify(contactState[0]),
      available_topay: available,
      due_by: dueDate,
      late_by: lateAfter,
      late_fee: lateFee,
      perDay_late_fee: lateFeePer,
      adult_occupants: adultOccupants,
      children_occupants: childrenOccupants,
      num_pets: numPets,
      type_pets: typePets,
    };
    for (let i = 0; i < files.length; i++) {
      let key = `doc_${i}`;
      newAgreement[key] = files[i].file;
      delete files[i].file;
    }
    newAgreement.linked_application_id = JSON.stringify(
      acceptedTenantApplications.map(
        (application) => application.application_uid
      )
    );
    // alert('ok')
    // return
    newAgreement.documents = JSON.stringify(files);

    for (const application of acceptedTenantApplications) {
      newAgreement.tenant_id = application.tenant_id;
      console.log(newAgreement);

      const request_body = {
        application_uid: application.application_uid,
        message: "Lease details forwarded for review",
        application_status: "FORWARDED",
      };
      // console.log(request_body)
      const update_application = await put("/applications", request_body);
      // console.log(response)
    }

    // const tenant_ids = acceptedTenantApplications.map(application => application.tenant_id)
    newAgreement.tenant_id = JSON.stringify(
      acceptedTenantApplications.map((application) => application.tenant_id)
    );
    newAgreement.rental_status = "PROCESSING";
    // console.log(newAgreement);
    const create_rental = await post("/rentals", newAgreement, null, files);

    back();
  };

  const renewLease = async () => {
    if (startDate === "" || endDate === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }

    let start_date = new Date(startDate);
    let end_date = new Date(endDate);
    if (start_date >= end_date) {
      setErrorMessage("Select an End Date later than Start Date");
      return;
    }

    if (
      dueDate === "" ||
      lateAfter === "" ||
      lateFee === "" ||
      lateFeePer === ""
    ) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    setErrorMessage("");

    const newAgreement = {
      rental_property_id: property.property_uid,
      tenant_id: null,
      lease_start: startDate,
      lease_end: endDate,
      rent_payments: JSON.stringify(feeState),
      assigned_contacts: JSON.stringify(contactState[0]),
      rental_status: "PENDING",
      available_topay: available,
      due_by: dueDate,
      late_by: lateAfter,
      late_fee: lateFee,
      perDay_late_fee: lateFeePer,
    };
    for (let i = 0; i < files.length; i++) {
      let key = `doc_${i}`;
      newAgreement[key] = files[i].file;
      delete files[i].file;
    }

    newAgreement.documents = JSON.stringify(files);
    newAgreement.tenant_id = JSON.stringify(
      acceptedTenantApplications.map((application) => application.tenant_id)
    );
    console.log(newAgreement);
    const create_rental = await post("/extendLease", newAgreement, null, files);
    back();
  };
  // console.log(acceptedTenantApplications.children_occupants);
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
          <div className="mb-4">
            <h5 style={mediumBold}>Tenant(s)</h5>

            {/* <Form.Group>
              <Form.Label as="h6" className="mb-0 ms-2">
                Tenant ID{" "}
                {acceptedTenantApplications.tenant_id === "" ? required : ""}
              </Form.Label>
              <Form.Control
                style={squareForm}
                value={acceptedTenantApplications.tenant_id}
                readOnly={true}
              />
            </Form.Group> */}

            {acceptedTenantApplications &&
              acceptedTenantApplications.length > 0 &&
              acceptedTenantApplications.map((application, i) => (
                <Form.Group key={i}>
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Tenant ID {application.tenant_id === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    value={application.tenant_id}
                    readOnly={true}
                  />
                </Form.Group>
              ))}
          </div>
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
          {acceptedTenantApplications &&
            acceptedTenantApplications.length > 0 &&
            acceptedTenantApplications.map((application, i) => (
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label as="h6" className="mb-0 ms-2">
                      No. of Adult Occupants
                    </Form.Label>
                    <Form.Control
                      style={squareForm}
                      placeholder="No. of Adult Occupants"
                      value={application.adult_occupants}
                      readOnly={true}
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
                      value={application.children_occupants}
                      readOnly={true}
                    />
                  </Form.Group>
                </Col>
              </Row>
            ))}
          {acceptedTenantApplications &&
            acceptedTenantApplications.length > 0 &&
            acceptedTenantApplications.map((application, i) => (
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label as="h6" className="mb-0 ms-2">
                      No. of Pets
                    </Form.Label>
                    <Form.Control
                      style={squareForm}
                      placeholder="No. of Pets"
                      value={application.num_pets}
                      readOnly={true}
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
                      value={application.type_pets}
                      readOnly={true}
                    />
                  </Form.Group>
                </Col>
              </Row>
            ))}
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
            {files.map((file, i) => (
              <div
                className="p-1 mb-2"
                style={{
                  boxShadow: " 0px 1px 6px #00000029",
                  borderRadius: "5px",
                }}
                key={i}
              >
                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <h6 style={mediumBold}>{file.name}</h6>
                    <p style={small} className="m-0">
                      {file.description}
                    </p>
                  </div>
                  <div>
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
                    <a href={file.link} target="_blank">
                      <img src={File} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {newFile !== null ? (
              <div>
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

          <Row className="mt-4" hidden={agreement !== null}>
            <div
              className="text-center"
              style={errorMessage === "" ? hidden : {}}
            >
              <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
            </div>
            <Col className="d-flex justify-content-evenly">
              <Button style={bluePillButton} onClick={forwardLeaseAgreement}>
                Send Lease Details to Tenant(s)
              </Button>
            </Col>
          </Row>

          <Row className="pt-1 mt-3 mb-2" hidden={agreement === null}>
            <Col className="d-flex flex-row justify-content-evenly">
              <Button
                style={bluePillButton}
                variant="outline-primary"
                onClick={() => renewLease()}
              >
                Forward New Lease Agreement
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

export default ManagerTenantAgreement;
