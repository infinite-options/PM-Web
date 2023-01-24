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
import ConfirmDialog from "../ConfirmDialog3";
import ArrowDown from "../../icons/ArrowDown.svg";
import File from "../../icons/File.svg";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
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
  subHeading,
  gray,
} from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});

function ManagerTenantAgreement(props) {
  const classes = useStyles();
  const {
    back,
    property,
    agreement,
    acceptedTenantApplications,
    setAcceptedTenantApplications,
  } = props;
  // console.log("here", acceptedTenantApplications[0]);
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  const [tenantID, setTenantID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [feeState, setFeeState] = useState([]);
  const [oldAgreement, setOldAgreement] = useState([]);
  const [updatedAgreement, setUpdatedAgreement] = useState([]);
  const contactState = useState([]);
  const [files, setFiles] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [rentalStatus, setRentalStatus] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);

  const [dueDate, setDueDate] = useState("1");
  const [lateAfter, setLateAfter] = useState("");
  const [lateFee, setLateFee] = useState("");
  const [lateFeePer, setLateFeePer] = useState("");
  const [available, setAvailable] = useState("");

  const [adults, setAdults] = useState([]);
  const [children, setChildren] = useState([]);
  const [pets, setPets] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [referred, setReferences] = useState([]);

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
  const onCancel = () => {
    setShowDialog(false);
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

  const loadAgreement = () => {
    // console.log(agreement);
    setOldAgreement(agreement);
    setTenantID(agreement.tenant_id);
    setStartDate(agreement.lease_start);
    setEndDate(agreement.lease_end);
    setEffectiveDate(agreement.effective_date);
    setFeeState(JSON.parse(agreement.rent_payments));
    contactState[1](JSON.parse(agreement.assigned_contacts));
    setFiles(JSON.parse(agreement.documents));
    setAvailable(agreement.available_topay);
    setRentalStatus(agreement.rental_status);
    setDueDate(agreement.due_by);
    setLateAfter(agreement.late_by);
    setLateFee(agreement.late_fee);
    setLateFeePer(agreement.perDay_late_fee);
    setAdults(JSON.parse(agreement.adults));
    setChildren(JSON.parse(agreement.children));
    setPets(JSON.parse(agreement.pets));
    setVehicles(JSON.parse(agreement.vehicles));
    setReferences(JSON.parse(agreement.referred));
  };
  useEffect(() => {
    // console.log("in useeffect", acceptedTenantApplications);
    if (agreement) {
      loadAgreement();
    }
    if (acceptedTenantApplications[0].adults) {
      setAdults(JSON.parse(acceptedTenantApplications[0].adults));
    }
    if (acceptedTenantApplications[0].children) {
      setChildren(JSON.parse(acceptedTenantApplications[0].children));
    }
    if (acceptedTenantApplications[0].pets) {
      setPets(JSON.parse(acceptedTenantApplications[0].pets));
    }

    if (acceptedTenantApplications[0].vehicles) {
      setVehicles(JSON.parse(acceptedTenantApplications[0].vehicles));
    }
    if (acceptedTenantApplications[0].referred) {
      setReferences(JSON.parse(acceptedTenantApplications[0].referred));
    }
  }, [agreement]);

  const save = async () => {
    setShowSpinner(true);
    for (let i = 0; i < feeState.length; i++) {
      if (feeState[i]["fee_name"] === "Rent") {
        if (feeState[i]["charge"] != property.listed_rent) {
          const updateRent = {
            property_uid: property.property_uid,
            listed_rent: feeState[i]["charge"],
          };

          const images = JSON.parse(property.images);
          for (let i = -1; i < images.length - 1; i++) {
            let key = `img_${i}`;
            if (i === -1) {
              key = "img_cover";
            }
            updateRent[key] = images[i + 1];
          }

          const response = await put("/properties", updateRent, null, images);
        }
      } else if (feeState[i]["fee_name"] === "Deposit") {
        if (feeState[i]["charge"] != property.deposit) {
          const updateDeposit = {
            property_uid: property.property_uid,
            deposit: feeState[i]["charge"],
          };

          const images = JSON.parse(property.images);
          for (let i = -1; i < images.length - 1; i++) {
            let key = `img_${i}`;
            if (i === -1) {
              key = "img_cover";
            }
            updateDeposit[key] = images[i + 1];
          }

          const response = await put(
            "/properties",
            updateDeposit,
            null,
            images
          );
        }
      }
    }
    if (agreement.rental_status === "PROCESSING") {
      // console.log(lateFee);
      const newAgreement = {
        rental_property_id: property.property_uid,
        lease_start: startDate,
        lease_end: endDate,
        rental_status: rentalStatus,
        rent_payments: JSON.stringify(feeState),
        available_topay: available,
        due_by: dueDate,
        late_by: lateAfter,
        late_fee: lateFee,
        perDay_late_fee: lateFeePer,
        assigned_contacts: JSON.stringify(contactState[0]),
        adults: JSON.stringify(adults),
        children: JSON.stringify(children),
        pets: JSON.stringify(pets),
        vehicles: JSON.stringify(vehicles),
        referred: JSON.stringify(referred),
        effective_date: effectiveDate,
      };

      // console.log(newAgreement);

      for (let i = 0; i < files.length; i++) {
        let key = `doc_${i}`;
        newAgreement[key] = files[i].file;
        delete files[i].file;
      }
      newAgreement.documents = JSON.stringify(files);

      // console.log("in if");
      newAgreement.rental_uid = agreement.rental_uid;
      // console.log(newAgreement);
      const response = await put(`/rentals`, newAgreement, null, files);

      setShowSpinner(false);
      back();
    } else {
      console.log(agreement.linked_application_id);
      for (const application of JSON.parse(agreement.linked_application_id)) {
        console.log(application);

        const request_body = {
          application_uid: application,
          message: "Lease details forwarded for review",
          application_status: "FORWARDED",
        };
        // console.log(request_body)
        const update_application = await put("/applications", request_body);
        console.log(update_application);
      }

      const newAgreement = {
        rental_property_id: property.property_uid,
        lease_start: startDate,
        lease_end: endDate,
        rental_status: "PROCESSING",
        rent_payments: feeState,
        available_topay: available,
        due_by: dueDate,
        late_by: lateAfter,
        late_fee: lateFee,
        perDay_late_fee: lateFeePer,
        assigned_contacts: contactState[0],
        adults: adults,
        children: children,
        pets: pets,
        vehicles: vehicles,
        referred: referred,
        effective_date: effectiveDate,
      };

      // console.log(newAgreement);
      // for (let i = 0; i < files.length; i++) {
      //   let key = `img_${i}`;
      //   newAgreement[key] = files[i];
      // }
      for (let i = 0; i < files.length; i++) {
        let key = `doc_${i}`;
        newAgreement[key] = files[i].file;
        delete files[i].file;
      }
      newAgreement.documents = files;
      if (agreement !== null) {
        // console.log("in if");
        newAgreement.rental_uid = agreement.rental_uid;
        // console.log(newAgreement);
        const response = await put(`/UpdateActiveLease`, newAgreement);
      }
      setShowSpinner(false);
      back();
    }
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
  // console.log("feeState in tenantagreemnt", feeState);
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

    setShowSpinner(true);
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
    for (let i = 0; i < feeState.length; i++) {
      if (feeState[i]["fee_name"] === "Rent") {
        if (feeState[i]["charge"] !== property.listed_rent) {
          const updateRent = {
            property_uid: property.property_uid,
            listed_rent: feeState[i]["charge"],
          };

          const images = JSON.parse(property.images);
          for (let i = -1; i < images.length - 1; i++) {
            let key = `img_${i}`;
            if (i === -1) {
              key = "img_cover";
            }
            updateRent[key] = images[i + 1];
          }

          const response = await put("/properties", updateRent, null, images);
        }
      } else if (feeState[i]["fee_name"] === "Deposit") {
        if (feeState[i]["charge"] !== property.deposit) {
          const updateDeposit = {
            property_uid: property.property_uid,
            deposit: feeState[i]["charge"],
          };

          const images = JSON.parse(property.images);
          for (let i = -1; i < images.length - 1; i++) {
            let key = `img_${i}`;
            if (i === -1) {
              key = "img_cover";
            }
            updateDeposit[key] = images[i + 1];
          }

          const response = await put(
            "/properties",
            updateDeposit,
            null,
            images
          );
        }
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
      adults: JSON.stringify(adults),
      children: JSON.stringify(children),
      pets: JSON.stringify(pets),
      vehicles: JSON.stringify(vehicles),
      referred: JSON.stringify(referred),
      effective_date: startDate,
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
      // console.log(newAgreement);

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

    setShowSpinner(false);
    back();
  };
  const days = (date_1, date_2) => {
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  };

  const filterAgreement = () => {
    let og = oldAgreement;
    const newAgreement = {
      rental_property_id: property.property_uid,
      lease_start: startDate,
      lease_end: endDate,
      rental_status: rentalStatus,
      rent_payments: feeState,
      available_topay: available,
      due_by: dueDate,
      late_by: lateAfter,
      late_fee: lateFee,
      perDay_late_fee: lateFeePer,
      assigned_contacts: contactState[0],
      adults: adults,
      children: children,
      pets: pets,
      vehicles: vehicles,
      referred: referred,
      effective_date: effectiveDate,
      documents: files,
    };
    let up = newAgreement;
    let fg = {};
    // console.log(og);

    // console.log(up);
    Object.keys(og).forEach((key) => {
      if (up.hasOwnProperty(key)) {
        if (key == "assigned_contacts") {
          // console.log(key);
          JSON.parse(og[key]).forEach((o) => {
            // console.log(o);
          });
        } else if (key == "documents") {
          // console.log(key);
          JSON.parse(og[key]).forEach((o) => {
            // console.log(o);
          });
        } else if (og[key] !== up[key]) {
          // console.log(key);
          // console.log(typeof og[key]);
          fg[key] = up[key];
          // console.log(fg[key]);
        }
      }
    });
    // console.log(fg);
    setUpdatedAgreement([fg]);
    setShowDialog(true);
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
    // console.log(newAgreement);
    const create_rental = await post("/extendLease", newAgreement, null, files);
    back();
  };
  // console.log(acceptedTenantApplications.children);
  return (
    <div className="flex-1">
      <ConfirmDialog
        title={"Review the lease"}
        body={updatedAgreement}
        button1={"Go back to Edit"}
        button2={"Send Updated Lease Details to Tenant(s)"}
        isOpen={showDialog}
        onConfirm={save}
        onCancel={onCancel}
      />
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
      <div className="w-100 mb-5 overflow-scroll overflow-hidden">
        <Header
          title="Tenant Agreement"
          leftText="< Back"
          leftFn={back}
          rightText=""
        />
        <div className=" w-100 ">
          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <h5 style={mediumBold}>Tenant(s)</h5>

            {acceptedTenantApplications &&
              acceptedTenantApplications.length > 0 &&
              acceptedTenantApplications.map((application, i) => (
                <div>
                  <Row className="p-1">
                    <Col>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0" style={mediumBold}>
                          {application.tenant_first_name}{" "}
                          {application.tenant_last_name}
                        </h5>
                      </div>
                    </Col>

                    <Col>
                      <div className="d-flex  justify-content-end ">
                        <div
                          style={application.tenant_id ? {} : hidden}
                          onClick={stopPropagation}
                        >
                          <a href={`tel:${application.tenant_phone_number}`}>
                            <img src={Phone} alt="Phone" style={smallImg} />
                          </a>
                          <a href={`mailto:${application.tenant_email}`}>
                            <img src={Message} alt="Message" style={smallImg} />
                          </a>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label as="h6" className="my-2">
                          Adult Occupants
                        </Form.Label>
                        {application.adults &&
                        JSON.parse(application.adults).length > 0 ? (
                          <div className="mx-3 ">
                            <Row style={subHeading}>
                              <Col>Name</Col>
                              <Col>Relationship</Col>
                              <Col>DOB</Col>
                            </Row>
                            {JSON.parse(application.adults).map((adult) => {
                              return (
                                <div>
                                  <Row style={gray}>
                                    <Col>{adult.name}</Col>
                                    <Col>{adult.relationship}</Col>
                                    <Col>{adult.dob}</Col>
                                  </Row>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="mx-3 ">
                            <Row style={subHeading}>None</Row>
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Label as="h6" className="my-2">
                        Children Occupants
                      </Form.Label>
                      <Form.Group>
                        {application.children &&
                        JSON.parse(application.children).length > 0 ? (
                          <div className="mx-3 ">
                            <Row style={subHeading}>
                              <Col>Name</Col>
                              <Col>Relationship</Col>
                              <Col>DOB</Col>
                            </Row>
                            {JSON.parse(application.children).map((child) => {
                              return (
                                <div>
                                  <Row style={gray}>
                                    <Col>{child.name}</Col>
                                    <Col>{child.relationship}</Col>
                                    <Col>{child.dob}</Col>
                                  </Row>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="mx-3 ">
                            <Row style={subHeading}>None</Row>
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label as="h6" className="my-2">
                          Pets
                        </Form.Label>
                        {application.pets &&
                        JSON.parse(application.pets).length > 0 ? (
                          <div className="mx-3 ">
                            <Row style={subHeading}>
                              <Col>Name</Col>
                              <Col>Type</Col>
                              <Col>Breed</Col>
                              <Col>Weight</Col>
                            </Row>
                            {JSON.parse(application.pets).map((pet) => {
                              return (
                                <div>
                                  <Row style={gray}>
                                    <Col>{pet.name}</Col>
                                    <Col>{pet.type}</Col>
                                    <Col>{pet.breed}</Col>
                                    <Col>{pet.weight}</Col>
                                  </Row>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="mx-3 ">
                            <Row style={subHeading}>None</Row>
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label as="h6" className="my-2">
                          Vehicles
                        </Form.Label>
                        {application.vehicles &&
                        JSON.parse(application.vehicles).length > 0 ? (
                          <div className="mx-3 ">
                            <Row style={subHeading}>
                              <Col>Make</Col>
                              <Col>Model</Col>
                              <Col>Year</Col>
                              <Col>State</Col>
                              <Col>License</Col>
                            </Row>
                            {JSON.parse(application.vehicles).map((vehicle) => {
                              return (
                                <div>
                                  <Row style={gray}>
                                    <Col>{vehicle.make}</Col>
                                    <Col>{vehicle.model}</Col>
                                    <Col>{vehicle.year}</Col>
                                    <Col>{vehicle.state}</Col>
                                    <Col>{vehicle.license}</Col>
                                  </Row>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="mx-3 ">
                            <Row style={subHeading}>None</Row>
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label as="h6" className="my-2">
                          referred
                        </Form.Label>
                        {application.referred &&
                        JSON.parse(application.referred).length > 0 ? (
                          <div className="mx-3 ">
                            <Row style={subHeading}>
                              <Col>Name</Col>
                              <Col>Address</Col>
                              <Col>Phone Number</Col>
                              <Col>Email</Col>
                              <Col>Relationship</Col>
                            </Row>
                            {JSON.parse(application.referred).map(
                              (reference) => {
                                return (
                                  <div>
                                    <Row style={gray}>
                                      <Col>{reference.name}</Col>
                                      <Col>{reference.address}</Col>
                                      <Col>{reference.phone}</Col>
                                      <Col>{reference.email}</Col>
                                      <Col>{reference.relationship}</Col>
                                    </Row>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        ) : (
                          <div className="mx-3 ">
                            <Row style={subHeading}>None</Row>
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              ))}
          </div>
          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
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
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setEffectiveDate(e.target.value);
                    }}
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
                <Form.Group>
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Effective Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    style={{
                      ...squareForm,
                      padding: "3px",
                    }}
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-2">
              <h5 style={mediumBold}>Late Payment Details</h5>
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
          </div>

          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <h5 style={mediumBold}>Rent Payments</h5>
            <div className="mx-2">
              <ManagerTenantRentPayments
                agreement={agreement}
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
          {acceptedTenantApplications !== [] &&
          acceptedTenantApplications[0] !== undefined &&
          agreement !== null ? (
            <Row className="pt-1 mt-3 mb-2">
              <div
                className="text-center"
                style={errorMessage === "" ? hidden : {}}
              >
                <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
              </div>
              <Col className="d-flex justify-content-evenly">
                <Button
                  style={bluePillButton}
                  // onClick={save}
                  onClick={filterAgreement}
                  on
                  hidden={
                    acceptedTenantApplications[0].application_status !==
                      "RENTED" &&
                    acceptedTenantApplications[0].application_status !==
                      "FORWARDED"
                  }
                >
                  Review Changes to the Lease
                </Button>
              </Col>
            </Row>
          ) : (
            ""
          )}

          {agreement !== null ? (
            <Row
              className="pt-1 mt-3 mb-2"
              hidden={
                (acceptedTenantApplications[0].application_status !==
                  "RENTED" &&
                  days(new Date(agreement.lease_end), new Date()) < -30) ||
                (acceptedTenantApplications[0].application_status !==
                  "FORWARDED" &&
                  days(new Date(agreement.lease_end), new Date()) < -30)
              }
            >
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
          ) : (
            ""
          )}
        </div>

        <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-5">
          <ManagerFooter />
        </div>
      </div>
    </div>
  );
}

export default ManagerTenantAgreement;
