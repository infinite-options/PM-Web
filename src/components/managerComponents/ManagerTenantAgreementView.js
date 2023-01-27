import React, { useState, useEffect, useContext } from "react";
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
import MailDialogTenant from "../MailDialog";
import MailDialogContact from "../MailDialog";
import AppContext from "../../AppContext";
import EditIconNew from "../../icons/EditIconNew.svg";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import File from "../../icons/File.svg";
import { put, post, get } from "../../utils/api";
import {
  small,
  smallPillButton,
  smallImg,
  red,
  squareForm,
  mediumBold,
  bluePillButton,
  redPillButton,
} from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});
function ManagerTenantAgreementView(props) {
  const classes = useStyles();
  const {
    property,
    renewLease,
    selectedAgreement,
    acceptedTenantApplications,
    selectAgreement,
    closeAgreement,
  } = props;
  console.log(property);
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  // console.log(user);
  const [tenantInfo, setTenantInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [feeState, setFeeState] = useState([]);
  const [contactState, setContactState] = useState([]);
  const [files, setFiles] = useState([]);

  // const [renewLease, setRenewLease] = useState(false)
  const [terminateLease, setTerminateLease] = useState(false);
  const [lastDate, setLastDate] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [message, setMessage] = useState("");
  const [tenantEndEarly, setTenantEndEarly] = useState(false);

  const [pmEndEarly, setPmEndEarly] = useState(false);
  const [agreement, setAgreement] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState("");
  const [selectedContact, setSelectedContact] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);

  const [newDocAdded, setNewDocAdded] = useState(false);
  const [showMailForm, setShowMailForm] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const onCancel = () => {
    setShowMailForm(false);
  };
  const [showMessageFormContact, setShowMessageFormContact] = useState(false);
  const onCancelContact = () => {
    setShowMessageFormContact(false);
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
  const saveNewFile = async (e) => {
    // copied from addFile, change e.target.files to state.newFile
    const newFiles = [...files];
    newFiles.push(newFile);
    setFiles(newFiles);
    setNewFile(null);
    setNewDocAdded(true);
  };

  const save = async () => {
    setShowSpinner(true);

    const newAgreement = {
      rental_property_id: property.property_uid,
      lease_start: agreement.lease_start,
      lease_end: agreement.lease_end,
      rental_status: agreement.rental_status,
      rent_payments: agreement.rent_payments,
      available_topay: agreement.available_topay,
      due_by: agreement.due_by,
      late_by: agreement.late_by,
      late_fee: agreement.late_fee,
      perDay_late_fee: agreement.perDay_late_fee,
      assigned_contacts: agreement.assigned_contacts,
      adults: agreement.adults,
      children: agreement.children,
      pets: agreement.pets,
      vehicles: agreement.vehicles,
      referred: agreement.referred,
      effective_date: agreement.effective_date,
    };

    for (let i = 0; i < files.length; i++) {
      let key = `doc_${i}`;
      newAgreement[key] = files[i].file;
      delete files[i].file;
    }
    newAgreement.documents = JSON.stringify(files);
    if (agreement !== null) {
      // console.log("in if");
      newAgreement.rental_uid = agreement.rental_uid;
      // console.log(newAgreement);
      const response = await put(`/rentals`, newAgreement, null, files);
    }

    setNewDocAdded(false);
    setShowSpinner(false);
    closeAgreement();
  };
  const loadAgreement = async (agg) => {
    // console.log("load agreement");

    // console.log("in useeffect");
    setAgreement(agg);
    setIsLoading(false);
    // loadAgreement(agg);
    let tenant = [];
    let ti = {};
    // console.log("selectedagg", agg);

    if (agg.tenant_first_name.includes(",")) {
      let tenant_ids = agg.tenant_id.split(",");
      let tenant_fns = agg.tenant_first_name.split(",");
      let tenant_lns = agg.tenant_last_name.split(",");
      let tenant_emails = agg.tenant_email.split(",");
      let tenant_phones = agg.tenant_phone_number.split(",");
      for (let i = 0; i < tenant_fns.length; i++) {
        ti["tenantID"] = tenant_ids[i];
        ti["tenantFirstName"] = tenant_fns[i];
        ti["tenantLastName"] = tenant_lns[i];
        ti["tenantEmail"] = tenant_emails[i];
        ti["tenantPhoneNumber"] = tenant_phones[i];
        tenant.push(ti);
        ti = {};
      }
    } else {
      ti = {
        tenantID: agg.tenant_id,
        tenantFirstName: agg.tenant_first_name,
        tenantLastName: agg.tenant_last_name,
        tenantEmail: agg.tenant_email,
        tenantPhoneNumber: agg.tenant_phone_number,
      };
      tenant.push(ti);
    }

    setTenantInfo(tenant);
    setSelectedTenant(tenantInfo);
    setFeeState(JSON.parse(agg.rent_payments));
    // contactState[1](JSON.parse(agg.assigned_contacts));
    setContactState(JSON.parse(agg.assigned_contacts));
    setFiles(JSON.parse(agg.documents));

    let app = property.applications.filter(
      (a) => a.application_status === "TENANT END EARLY"
    );
    if (app.length > 0) {
      setTenantEndEarly(true);
    }
    let appPM = property.applications.filter(
      (a) => a.application_status === "PM END EARLY"
    );
    if (appPM.length > 0) {
      setPmEndEarly(true);
    }
  };
  useEffect(() => {
    loadAgreement(selectedAgreement);
  }, [selectedAgreement]);

  const [errorMessage, setErrorMessage] = useState("");
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );

  const renewLeaseAgreement = async () => {};

  const terminateLeaseAgreement = async () => {
    if (lastDate === "") {
      setErrorMessage("Please select a last date");
      return;
    }

    const request_body = {
      application_status: "PM END EARLY",
      property_uid: property.property_uid,
      early_end_date: lastDate,
      message: message,
    };
    const response = await put("/endEarly", request_body);
    const new_announcement = {
      pm_id: property.managerInfo.linked_business_id,
      announcement_title: "Requested Lease End",
      announcement_msg:
        "Property Manager has requested to end the lease early on " + lastDate,
      announcement_mode: "Properties",
      receiver: [agreement.tenant_id],
      receiver_properties: [property.property_uid],
    };
    // setShowSpinner(true);
    const responseAnnouncement = await post("/announcement", new_announcement);
    const send_announcement = {
      announcement_msg: new_announcement.announcement_msg,
      announcement_title: new_announcement.announcement_title,
      tenant_name: responseAnnouncement["tenant_name"],
      tenant_pno: responseAnnouncement["tenant_pno"],
      tenant_email: responseAnnouncement["tenant_email"],
    };
    const resSendAnnouncement = await post(
      "/SendAnnouncement",
      send_announcement
    );
    setPmEndEarly(true);
    setTerminateLease(false);
    closeAgreement();
  };

  const endEarlyRequestResponse = async (end_early) => {
    let request_body = {
      application_status: "",
      property_uid: property.property_uid,
    };

    if (end_early) {
      request_body.application_status = "PM ENDED";

      let apps = property.applications.filter(
        (a) => a.application_status === "TENANT END EARLY"
      );
      request_body.application_uid =
        apps.length > 0 ? apps[0].application_uid : null;
    } else {
      request_body.application_status = "REFUSED";
    }
    const response = await put("/endEarly", request_body);
    if (request_body.application_status == "PM ENDED") {
      const newMessage = {
        sender_name: property.managerInfo.manager_business_name,
        sender_email: property.managerInfo.manager_email,
        sender_phone: property.managerInfo.manager_phone_number,
        message_subject: "End Lease Early Request Accepted",
        message_details:
          "Property Manager has accepted your request to end the lease early on " +
          lastDate,
        message_created_by: property.managerInfo.manager_id,
        user_messaged: property.rentalInfo[0].tenant_id,
        message_status: "PENDING",
        receiver_email: property.rentalInfo[0].tenant_email,
      };
      // console.log(newMessage);
      const responseMsg = await post("/message", newMessage);
    } else {
      const newMessage = {
        sender_name: property.managerInfo.manager_business_name,
        sender_email: property.managerInfo.manager_email,
        sender_phone: property.managerInfo.manager_phone_number,
        message_subject: "End Lease Early Request Declined",
        message_details:
          "Property Manager has refused to end the lease early on " + lastDate,
        message_created_by: property.managerInfo.manager_id,
        user_messaged: property.rentalInfo[0].tenant_id,
        message_status: "PENDING",
        receiver_email: property.rentalInfo[0].tenant_email,
      };
      // console.log(newMessage);
      const responseMsg = await post("/message", newMessage);
    }

    closeAgreement();
  };

  const endEarlyWithdraw = async () => {
    let request_body = {
      application_status: "RENTED",
      property_uid: property.property_uid,
      early_end_date: "",
      message: "Lease details forwarded for review",
    };

    const response = await put("/endEarly", request_body);
    const newMessage = {
      sender_name: property.managerInfo.manager_business_name,
      sender_email: property.managerInfo.manager_email,
      sender_phone: property.managerInfo.manager_phone_number,
      message_subject: "End Lease Early Request Withdraw",
      message_details:
        "Property Manager has withdrawn the request to end the lease early on " +
        lastDate,
      message_created_by: property.managerInfo.manager_id,
      user_messaged: property.rentalInfo[0].tenant_id,
      message_status: "PENDING",
      receiver_email: property.rentalInfo[0].tenant_email,
    };
    // console.log(newMessage);
    const responseMsg = await post("/message", newMessage);
    setTerminateLease(false);
    setPmEndEarly(false);
  };

  function ordinal_suffix_of(i) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }
  return isLoading ? (
    <div>
      <div className="w-100 d-flex flex-column justify-content-center align-items-center h-50">
        <ReactBootStrap.Spinner animation="border" role="status" />
      </div>
    </div>
  ) : (
    <div className="mb-2 pb-2">
      {agreement ? (
        <div>
          <MailDialogTenant
            title={"Message"}
            isOpen={showMailForm}
            senderPhone={user.phone_number}
            senderEmail={user.email}
            senderName={user.first_name + " " + user.last_name}
            requestCreatedBy={user.user_uid}
            userMessaged={selectedTenant.tenantID}
            receiverEmail={selectedTenant.tenantEmail}
            onCancel={onCancel}
          />
          <MailDialogContact
            title={"Message"}
            isOpen={showMessageFormContact}
            senderPhone={user.phone_number}
            senderEmail={user.email}
            senderName={user.first_name + " " + user.last_name}
            requestCreatedBy={user.user_uid}
            userMessaged={selectedContact.first_name}
            receiverEmail={selectedContact.email}
            onCancel={onCancelContact}
          />
          {/* {console.log(agreement)} */}
          <Row>
            {agreement != null ? (
              <Row className="m-3">
                <Col>
                  <h3>Tenant Info</h3>
                </Col>
                {property.management_status === "ACCEPTED" ||
                property.management_status === "OWNER END EARLY" ||
                property.management_status === "PM END EARLY" ? (
                  <Col xs={2}>
                    <img
                      src={EditIconNew}
                      alt="Edit"
                      style={{
                        width: "30px",
                        height: "30px",
                        float: "right",
                        marginRight: "5rem",
                      }}
                      onClick={() => selectAgreement(selectedAgreement)}
                    />
                  </Col>
                ) : (
                  ""
                )}
              </Row>
            ) : (
              <Col xs={2}></Col>
            )}
          </Row>
          <Row className="m-3 mb-4" style={{ hidden: "overflow" }}>
            <div>
              <Table
                responsive="md"
                classes={{ root: classes.customTable }}
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Tenant Name</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Phone Number</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {tenantInfo.map((tf) => {
                        return (
                          <p>
                            {" "}
                            {/* {console.log("tf", tf)} */}
                            {tf.tenantFirstName} {tf.tenantLastName}
                          </p>
                        );
                      })}
                    </TableCell>

                    <TableCell>
                      {" "}
                      {tenantInfo.map((tf) => {
                        return <p> {tf.tenantEmail}</p>;
                      })}
                    </TableCell>

                    <TableCell>
                      {" "}
                      {tenantInfo.map((tf) => {
                        return <p> {tf.tenantPhoneNumber}</p>;
                      })}
                    </TableCell>

                    <TableCell>
                      {tenantInfo.map((tf) => {
                        return (
                          <Row className="mb-2">
                            <Col className="d-flex justify-content-center">
                              {" "}
                              <a href={`tel:${tf.tenantPhoneNumber}`}>
                                <img src={Phone} alt="Phone" style={smallImg} />
                              </a>
                            </Col>
                            <Col className="d-flex justify-content-center">
                              <a
                                // href={`mailto:${tf.tenantEmail}`}
                                onClick={() => {
                                  setShowMailForm(true);
                                  setSelectedTenant(tf);
                                }}
                              >
                                <img
                                  src={Message}
                                  alt="Message"
                                  style={smallImg}
                                />
                              </a>
                            </Col>
                          </Row>
                        );
                      })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Row>
          <Row className="mb-4 m-3" style={{ hidden: "overflow" }}>
            <h5>Lease Details</h5>
            <div>
              <Table
                responsive="md"
                classes={{ root: classes.customTable }}
                size="small"
              >
                {/* {console.log(agreement)} */}
                <TableHead>
                  <TableRow>
                    <TableCell>Lease Start</TableCell>
                    <TableCell>Lease End</TableCell>
                    <TableCell>Rent Due</TableCell>
                    <TableCell>Late Fees After (days)</TableCell>
                    <TableCell>Late Fee (one-time)</TableCell>
                    <TableCell>Late Fee (per day)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{agreement.lease_start}</TableCell>

                    <TableCell>{agreement.lease_end}</TableCell>

                    <TableCell>
                      {`${ordinal_suffix_of(agreement.due_by)} of the month`}
                    </TableCell>

                    <TableCell>{agreement.late_by} days</TableCell>
                    <TableCell> ${agreement.late_fee}</TableCell>
                    <TableCell> ${agreement.perDay_late_fee}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Row>

          <Row className="mb-4 m-3" style={{ hidden: "overflow" }}>
            <h5>Lease Payments</h5>
            <div>
              <Table
                responsive="md"
                classes={{ root: classes.customTable }}
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Fee Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Of</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Available to Pay</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Late Fees After (days)</TableCell>
                    <TableCell>Late Fee (one-time)</TableCell>
                    <TableCell>Late Fee (per day)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feeState.map((fee, i) => (
                    <TableRow>
                      <TableCell>{fee.fee_name}</TableCell>

                      <TableCell>
                        {fee.fee_type === "%"
                          ? `${fee.charge}%`
                          : `$${fee.charge}`}
                      </TableCell>

                      <TableCell>
                        {fee.fee_type === "%" ? `${fee.of}` : ""}
                      </TableCell>

                      <TableCell>{fee.frequency}</TableCell>
                      <TableCell>
                        {`${fee.available_topay} days before`}
                      </TableCell>
                      <TableCell>
                        {fee.due_by == ""
                          ? `1st of the month`
                          : `${ordinal_suffix_of(fee.due_by)} of the month`}
                      </TableCell>
                      <TableCell>{fee.late_by} days</TableCell>
                      <TableCell>${fee.late_fee}</TableCell>
                      <TableCell>${fee.perDay_late_fee}/day</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Row>

          <Row className="mb-4 m-3" hidden={contactState.length === 0}>
            <h5 style={mediumBold}>Contact Details</h5>
            <div>
              <Table classes={{ root: classes.customTable }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Contact Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone Number</TableCell>

                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contactState.map((contact, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {contact.first_name} {contact.last_name}
                      </TableCell>
                      <TableCell>{contact.company_role}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone_number}</TableCell>
                      <TableCell>
                        <a href={`tel:${contact.phone_number}`}>
                          <img src={Phone} alt="Phone" style={smallImg} />
                        </a>
                        <a
                          onClick={() => {
                            setShowMessageFormContact(true);
                            setSelectedContact(contact);
                          }}
                        >
                          <img src={Message} alt="Message" style={smallImg} />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Row>
          <Row className="m-3">
            <h5 style={mediumBold}>Lease Documents</h5>
            {files.length > 0 ? (
              <div>
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
              </div>
            ) : (
              <div>No documents uploaded</div>
            )}
          </Row>
          <Row className="m-3">
            {" "}
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
                {showSpinner ? (
                  <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                    <ReactBootStrap.Spinner animation="border" role="status" />
                  </div>
                ) : (
                  ""
                )}
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
          </Row>
          {newDocAdded !== false ? (
            <Row className="pt-2 my-2">
              <Col className="d-flex flex-row justify-content-evenly">
                <Button
                  style={bluePillButton}
                  variant="outline-primary"
                  onClick={save}
                >
                  Add document without updating lease
                </Button>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {property.management_status === "ACCEPTED" ||
          property.management_status === "OWNER END EARLY" ||
          property.management_status === "PM END EARLY" ? (
            <Row
              className="pt-4 my-4"
              hidden={agreement === null || tenantEndEarly || pmEndEarly}
            >
              <Col className="d-flex flex-row justify-content-evenly">
                <Button
                  style={bluePillButton}
                  variant="outline-primary"
                  onClick={() => renewLease(agreement)}
                >
                  Renew Lease
                </Button>
              </Col>
            </Row>
          ) : (
            ""
          )}

          {terminateLease ? (
            <div hidden={agreement === null || tenantEndEarly || pmEndEarly}>
              <Row>
                <Col className="d-flex flex-row justify-content-evenly">
                  <Form.Group className="mx-2 my-3">
                    <Form.Label as="h6" className="mb-0 ms-2">
                      Select the Last Date {lastDate === "" ? required : ""}
                    </Form.Label>
                    <Form.Control
                      style={squareForm}
                      type="date"
                      value={lastDate}
                      onChange={(e) => setLastDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>{" "}
                <Col className="d-flex flex-row justify-content-evenly">
                  <Form.Group className="mx-2 my-3">
                    <Form.Label as="h6" className="mb-0 ms-2">
                      Message {message === "" ? required : ""}
                    </Form.Label>
                    <Form.Control
                      style={squareForm}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="d-flex flex-row justify-content-evenly">
                  <Button
                    style={redPillButton}
                    variant="outline-primary"
                    onClick={() => terminateLeaseAgreement()}
                  >
                    Notify intent to terminate
                  </Button>
                </Col>
                <Col className="d-flex flex-row justify-content-evenly">
                  <Button
                    style={bluePillButton}
                    variant="outline-primary"
                    onClick={() => setTerminateLease(false)}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </div>
          ) : (
            <Row hidden={agreement === null || tenantEndEarly || pmEndEarly}>
              {property.management_status === "ACCEPTED" ||
              property.management_status === "OWNER END EARLY" ||
              property.management_status === "PM END EARLY" ? (
                <Col className="d-flex flex-row justify-content-evenly">
                  <Button
                    style={redPillButton}
                    variant="outline-primary"
                    onClick={() => setTerminateLease(true)}
                  >
                    Terminate Lease
                  </Button>
                </Col>
              ) : (
                ""
              )}
            </Row>
          )}

          {tenantEndEarly ? (
            <div className="my-4">
              <h5 style={mediumBold}>
                Tenant Requests to end lease early on {agreement.early_end_date}
              </h5>
              <Row className="my-4">
                <Col className="d-flex flex-row justify-content-evenly">
                  <Button
                    style={bluePillButton}
                    variant="outline-primary"
                    onClick={() => endEarlyRequestResponse(true)}
                  >
                    Terminate Lease
                  </Button>
                </Col>
                <Col className="d-flex flex-row justify-content-evenly">
                  <Button
                    style={redPillButton}
                    variant="outline-primary"
                    onClick={() => endEarlyRequestResponse(false)}
                  >
                    Reject request
                  </Button>
                </Col>
              </Row>
            </div>
          ) : (
            ""
          )}
          {pmEndEarly ? (
            <div className="my-4 ">
              <h5
                style={mediumBold}
                className="d-flex justify-content-center align-items-center flex-row"
              >
                You requested to end lease early on {agreement.early_end_date}
              </h5>
              <Row className="my-4">
                {/* <Col className="d-flex flex-row justify-content-evenly">
                  <Button
                    style={bluePillButton}
                    variant="outline-primary"
                    onClick={() => endEarlyRequestResponse(true)}
                  >
                    Terminate Lease
                  </Button>
                </Col> */}
                <Col className="d-flex flex-row justify-content-evenly">
                  <Button
                    style={redPillButton}
                    variant="outline-primary"
                    onClick={() => endEarlyWithdraw()}
                  >
                    Withdraw request
                  </Button>
                </Col>
              </Row>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        <Row className="mx-5">No Active Lease Agreements</Row>
      )}
    </div>
  );
}

export default ManagerTenantAgreementView;
