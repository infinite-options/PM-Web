import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../components/Header";
import File from "../icons/File.svg";
import BusinessContact from "../components/BusinessContact";
import { put, post } from "../utils/api";
import {
  small,
  hidden,
  red,
  squareForm,
  mediumBold,
  smallPillButton,
  bluePillButton,
  redPillButton,
  pillButton,
} from "../utils/styles";
import EditIcon from "../icons/EditIcon.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";
import ManagerTenantRentPayments from "../components/ManagerTenantRentPayments";
import ArrowDown from "../icons/ArrowDown.svg";
import tenantAgreement from "../components/TenantAgreement";

function ManagerTenantAgreement(props) {
  const {
    back,
    property,
    agreement,
    acceptedTenantApplications,
    setAcceptedTenantApplications,
  } = props;
  console.log("here1", acceptedTenantApplications);
  const [tenantID, setTenantID] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [feeState, setFeeState] = React.useState([]);
  const contactState = React.useState([]);
  const [files, setFiles] = React.useState([]);

  const [newFile, setNewFile] = React.useState(null);
  const [editingDoc, setEditingDoc] = React.useState(null);

  const [dueDate, setDueDate] = React.useState("1");
  const [lateAfter, setLateAfter] = React.useState("");
  const [lateFee, setLateFee] = React.useState("");
  const [lateFeePer, setLateFeePer] = React.useState("");

  // const addFile = (e) => {
  //     const newFiles = [...files];
  //     newFiles.push(e.target.files[0]);
  //     setFiles(newFiles);
  // }

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

    setDueDate(agreement.due_by);
    setLateAfter(agreement.late_by);
    setLateFee(agreement.late_fee);
    setLateFeePer(agreement.perDay_late_fee);
  };
  React.useEffect(() => {
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
      // for(let i = 0; i < acceptedTenants.length; i++){
      //     newAgreement.tenant_id = acceptedTenantApplications[i].tenant_id
      //     console.log(newAgreement);
      //     const response = await post('/rentals', newAgreement, null, files);
      // }

      newAgreement.tenant_id = acceptedTenantApplications;
      console.log(newAgreement);
      //   const response = await post("/rentals", newAgreement, null, files);
    }
    back();
  };
  const [errorMessage, setErrorMessage] = React.useState("");
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );

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

    const newAgreement = {
      rental_property_id: property.property_uid,
      tenant_id: null,
      lease_start: startDate,
      lease_end: endDate,
      rent_payments: JSON.stringify(feeState),
      assigned_contacts: JSON.stringify(contactState[0]),
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
    newAgreement.linked_application_id = JSON.stringify(
      acceptedTenantApplications.map(
        (application) => application.application_uid
      )
    );
    console.log(newAgreement);
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
    console.log(newAgreement);
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

  return (
    <div className="mb-5 pb-5">
      <Header
        title="Tenant Agreement"
        leftText="< Back"
        leftFn={back}
        rightText=""
      />
      <Container>
        <div className="mb-4">
          <h5 style={mediumBold}>Tenant(s)</h5>
          {/*<Form.Group className='mx-2 my-3'>*/}
          {/*  <Form.Label as='h6' className='mb-0 ms-2'>*/}
          {/*    Tenant ID {tenantID === '' ? required : ''}*/}
          {/*  </Form.Label>*/}
          {/*  <Form.Control style={squareForm} value={tenantID} placeholder='100-000001'*/}
          {/*    onChange={(e) => setTenantID(e.target.value)}/>*/}
          {/*</Form.Group>*/}
          {acceptedTenantApplications &&
            acceptedTenantApplications.length > 0 &&
            acceptedTenantApplications.map((application, i) => (
              <Form.Group className="mx-2 my-3" key={i}>
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
        <div className="mb-4">
          <h5 style={mediumBold}>Lease Dates</h5>
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Start Date {startDate === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              End Date {endDate === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </div>
        <div className="mb-4">
          <h5 style={mediumBold}>Rent Payments</h5>
          <div className="mx-2">
            <ManagerTenantRentPayments
              feeState={feeState}
              setFeeState={setFeeState}
              property={property}
            />
          </div>
        </div>

        <div className="mb-4">
          <h5 style={mediumBold}>Due date and late fees</h5>
          <div className="mx-2">
            <Row>
              <Col>
                <Form.Group className="mx-2 my-2">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Rent due {dueDate === "" ? required : ""}
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
              <Col>
                <Form.Group className="mx-2 my-2">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Late fees after (days) {lateAfter === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    value={lateAfter}
                    style={squareForm}
                    placeholder="5"
                    type="number"
                    onChange={(e) => setLateAfter(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mx-2 my-2">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Late Fee (one-time) {lateFee === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    value={lateFee}
                    type="number"
                    style={squareForm}
                    placeholder="50"
                    onChange={(e) => setLateFee(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mx-2 my-2">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Late Fee (per day) {lateFeePer === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    value={lateFeePer}
                    type="number"
                    style={squareForm}
                    placeholder="10"
                    onChange={(e) => setLateFeePer(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>

        <div className="mb-4">
          <h5 style={mediumBold}>Contact Details</h5>
          <BusinessContact state={contactState} />
        </div>

        {/*<div className='mb-4'>*/}
        {/*    <h5 style={mediumBold}>Lease Documents</h5>*/}
        {/*    {files.map((file, i) => (*/}
        {/*        <div key={i}>*/}
        {/*            <div className='d-flex justify-content-between align-items-end'>*/}
        {/*                <div>*/}
        {/*                    <h6 style={mediumBold}>*/}
        {/*                        {file.name}*/}
        {/*                    </h6>*/}
        {/*                    <p style={small} className='m-0'>*/}
        {/*                        {file.description}*/}
        {/*                    </p>*/}
        {/*                </div>*/}
        {/*                <div>*/}
        {/*                    <img src={EditIcon} alt='Edit' className='px-1 mx-2'*/}
        {/*                         onClick={() => editDocument(i)}/>*/}
        {/*                    <img src={DeleteIcon} alt='Delete' className='px-1 mx-2'*/}
        {/*                         onClick={() => deleteDocument(i)}/>*/}
        {/*                    <a href={file.link} target='_blank'>*/}
        {/*                        <img src={File}/>*/}
        {/*                    </a>*/}
        {/*                </div>*/}
        {/*            </div>*/}
        {/*            <hr style={{opacity: 1}}/>*/}
        {/*        </div>*/}
        {/*    ))}*/}
        {/*    {newFile !== null ? (*/}
        {/*        <div>*/}
        {/*            <Form.Group>*/}
        {/*                <Form.Label as='h6' className='mb-0 ms-2'>*/}
        {/*                    Document Name*/}
        {/*                </Form.Label>*/}
        {/*                <Form.Control style={squareForm} value={newFile.name} placeholder='Name'*/}
        {/*                              onChange={(e) => updateNewFile('name', e.target.value)}/>*/}
        {/*            </Form.Group>*/}
        {/*            <Form.Group>*/}
        {/*                <Form.Label as='h6' className='mb-0 ms-2'>*/}
        {/*                    Description*/}
        {/*                </Form.Label>*/}
        {/*                <Form.Control style={squareForm} value={newFile.description} placeholder='Description'*/}
        {/*                              onChange={(e) => updateNewFile('description', e.target.value)}/>*/}
        {/*            </Form.Group>*/}
        {/*            <div className='text-center my-3'>*/}
        {/*                <Button variant='outline-primary' style={smallPillButton} as='p'*/}
        {/*                        onClick={cancelEdit} className='mx-2'>*/}
        {/*                    Cancel*/}
        {/*                </Button>*/}
        {/*                <Button variant='outline-primary' style={smallPillButton} as='p'*/}
        {/*                        onClick={saveNewFile} className='mx-2'>*/}
        {/*                    Save Document*/}
        {/*                </Button>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*    ) : (*/}
        {/*        <div>*/}
        {/*            <input id='file' type='file' accept='image/*,.pdf' onChange={addFile} className='d-none'/>*/}
        {/*            <label htmlFor='file'>*/}
        {/*                <Button variant='outline-primary' style={smallPillButton} as='p'>*/}
        {/*                    Add Document*/}
        {/*                </Button>*/}
        {/*            </label>*/}
        {/*        </div>*/}
        {/*    )}*/}
        {/*</div>*/}

        {/*<div className='mb-4'>*/}
        {/*    <h5 style={mediumBold}>Lease Documents</h5>*/}
        {/*    {files.map((file, i) => (*/}
        {/*        <div key={i}>*/}
        {/*            <div className='d-flex justify-content-between align-items-end'>*/}
        {/*                <h6 style={mediumBold}>{file.name}</h6>*/}
        {/*                <img src={File}/>*/}
        {/*            </div>*/}
        {/*            <hr style={{opacity: 1}}/>*/}
        {/*        </div>*/}
        {/*    ))}*/}
        {/*    <input id='file' type='file' accept='image/*,.pdf' onChange={addFile} className='d-none'/>*/}
        {/*    <label htmlFor='file'>*/}
        {/*        <Button variant='outline-primary' style={smallPillButton} as='p'>*/}
        {/*            Add Document*/}
        {/*        </Button>*/}
        {/*    </label>*/}
        {/*</div>*/}

        <div className="mb-4">
          <h5 style={mediumBold}>Lease Documents</h5>
          {files.map((file, i) => (
            <div key={i}>
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
              <hr style={{ opacity: 1 }} />
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
                  onChange={(e) => updateNewFile("description", e.target.value)}
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

        {/*<Row className="pt-1 mt-3 mb-2" hidden={agreement === null}>*/}
        {/*    <Col className='d-flex flex-row justify-content-evenly'>*/}
        {/*        <Button style={redPillButton} variant="outline-primary"*/}
        {/*                onClick={() => terminateLeaseAgreement()}>*/}
        {/*            Terminate Lease*/}
        {/*        </Button>*/}
        {/*    </Col>*/}
        {/*</Row>*/}

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
      </Container>
    </div>
  );
}

export default ManagerTenantAgreement;
