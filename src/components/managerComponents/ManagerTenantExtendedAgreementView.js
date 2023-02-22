import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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
import DocumentsUploadPut from "../DocumentsUploadPut";
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
import { ordinal_suffix_of } from "../../utils/helper";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});
function ManagerTenantExtendedAgreementView(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const {
    property,
    renewLease,
    selectedAgreement,
    acceptedTenantApplications,
    selectAgreement,
    closeAgreement,
  } = props;
  // console.log(property);
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
  const [tenantExtendLease, setTenantExtendLease] = useState(false);
  const [pmExtendLease, setPmExtendLease] = useState(false);
  const [pmEndEarly, setPmEndEarly] = useState(false);
  const [agreement, setAgreement] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState("");
  const [selectedContact, setSelectedContact] = useState("");

  const [addDoc, setAddDoc] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [showMailForm, setShowMailForm] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const onCancel = () => {
    setShowMailForm(false);
  };
  const [showMessageFormContact, setShowMessageFormContact] = useState(false);
  const onCancelContact = () => {
    setShowMessageFormContact(false);
  };
  useEffect(() => {
    closeAgreement();
  }, [addDoc]);
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
    let appEL = property.applications.filter(
      (a) => a.application_status === "TENANT LEASE EXTENSION"
    );
    if (appEL.length > 0) {
      setTenantExtendLease(true);
    }
    let appPM = property.applications.filter(
      (a) => a.application_status === "PM END EARLY"
    );
    if (appPM.length > 0) {
      setPmEndEarly(true);
    }
    let appPMEL = property.applications.filter(
      (a) => a.application_status === "LEASE EXTENSION"
    );
    if (appPMEL.length > 0) {
      setPmExtendLease(true);
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

  const terminateLeaseAgreement = async () => {
    if (lastDate === "") {
      setErrorMessage("Please select a last date");
      return;
    }
    setShowSpinner(true);
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

    const responseAnnouncement = await post("/announcement", new_announcement);
    const send_announcement = {
      announcement_msg: new_announcement.announcement_msg,
      announcement_title: new_announcement.announcement_title,
      name: responseAnnouncement["tenant_name"],
      pno: responseAnnouncement["tenant_pno"],
      email: responseAnnouncement["tenant_email"],
    };
    const resSendAnnouncement = await post(
      "/SendAnnouncement",
      send_announcement
    );
    setShowSpinner(false);
    setPmEndEarly(true);
    setTerminateLease(false);
    closeAgreement();
  };

  const endEarlyRequestResponse = async (end_early) => {
    setShowSpinner(true);
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
      setShowSpinner(false);
      navigate("../manager");
    } else {
      request_body.application_status = "REFUSED";
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
      setTenantEndEarly(false);
      setShowSpinner(false);
      closeAgreement();
    }
  };

  const endEarlyWithdraw = async () => {
    setShowSpinner(true);
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
    setShowSpinner(false);
    setTerminateLease(false);
    setPmEndEarly(false);
  };

  const rejectExtension = async () => {
    setShowSpinner(true);
    let request_body = {
      application_status: "REFUSED",
      property_uid: property.property_uid,
    };

    const response = await put("/extendLease", request_body);
    const newMessage = {
      sender_name: property.managerInfo.manager_business_name,
      sender_email: property.managerInfo.manager_email,
      sender_phone: property.managerInfo.manager_phone_number,
      message_subject: "Extend Lease Request Declined",
      message_details: "Property Manager has refused to extend the lease",
      message_created_by: property.managerInfo.manager_id,
      user_messaged: property.rentalInfo[0].tenant_id,
      message_status: "PENDING",
      receiver_email: property.rentalInfo[0].tenant_email,
    };
    // console.log(newMessage);
    const responseMsg = await post("/message", newMessage);
    setTenantExtendLease(false);
    setShowSpinner(false);
    closeAgreement();
  };

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
            {agreement !== null ? (
              <Row className="m-3">
                <Col>
                  <h3>New Lease Agreement</h3>
                </Col>
                {property.management_status === "ACCEPTED" ||
                property.management_status === "OWNER END EARLY" ||
                property.management_status === "PM END EARLY" ? (
                  <Col xs={2}>
                    <img
                      src={EditIconNew}
                      alt="Edit Icon"
                      hidden={
                        selectedAgreement.rental_status === "TENANT APPROVED"
                      }
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
          <Row className="m-3 mb-4" style={{ overflow: "scroll" }}>
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
          <Row className="mb-4 m-3" style={{ overflow: "scroll" }}>
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

          <Row className="mb-4 m-3" style={{ overflow: "scroll" }}>
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
                        {fee.frequency === "Weekly" ||
                        fee.frequency === "Biweekly"
                          ? fee.due_by === ""
                            ? `1st day of the week`
                            : `${ordinal_suffix_of(fee.due_by)} day of the week`
                          : fee.due_by === ""
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
          </Row>
          <div>
            <DocumentsUploadPut
              files={files}
              setFiles={setFiles}
              addDoc={addDoc}
              setAddDoc={setAddDoc}
              endpoint="/rentals"
              editingDoc={editingDoc}
              setEditingDoc={setEditingDoc}
              id={agreement.rental_uid}
            />
          </div>
          {pmExtendLease ? (
            <div className="my-4">
              <h5 style={mediumBold}>You requested to extend the lease</h5>
              {property.management_status === "ACCEPTED" ||
              property.management_status === "OWNER END EARLY" ||
              property.management_status === "PM END EARLY" ? (
                <Row
                  className="pt-4 my-4"
                  hidden={agreement === null || tenantEndEarly || pmEndEarly}
                >
                  <Col className="d-flex flex-row justify-content-evenly">
                    <Button
                      style={redPillButton}
                      variant="outline-primary"
                      onClick={() => {
                        rejectExtension();
                        // setTenantEndEarly(false);
                      }}
                    >
                      Withdraw Request
                    </Button>
                  </Col>
                </Row>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {tenantExtendLease && selectedAgreement === null ? (
            <div className="my-4">
              <h5 style={mediumBold}>Tenant Requests to extend the lease</h5>
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
                  <Col className="d-flex flex-row justify-content-evenly">
                    <Button
                      style={redPillButton}
                      variant="outline-primary"
                      onClick={() => {
                        rejectExtension();
                        // setTenantEndEarly(false);
                      }}
                    >
                      Reject Request
                    </Button>
                  </Col>
                </Row>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {property.management_status === "ACCEPTED" ||
          property.management_status === "OWNER END EARLY" ||
          property.management_status === "PM END EARLY" ? (
            Math.floor(
              (new Date(agreement.lease_end).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            ) < 60 ? (
              <Row
                className="pt-4 my-4"
                hidden={
                  agreement === null ||
                  tenantEndEarly ||
                  pmEndEarly ||
                  tenantExtendLease
                }
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
            )
          ) : (
            ""
          )}

          {/* {terminateLease ? (
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
          )} */}

          {/* {tenantEndEarly ? (
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
                    onClick={() => {
                      endEarlyRequestResponse(false);
                      // setTenantEndEarly(false);
                    }}
                  >
                    Reject request
                  </Button>
                </Col>
              </Row>
            </div>
          ) : (
            ""
          )} */}
          {/* {pmEndEarly ? (
            <div className="my-4 ">
              <h5
                style={mediumBold}
                className="d-flex justify-content-center align-items-center flex-row"
              >
                You requested to end lease early on {agreement.early_end_date}
              </h5>
              <Row className="my-4">
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
          )} */}
          {showSpinner ? (
            <div className="w-100 d-flex flex-column justify-content-center align-items-center h-50">
              <ReactBootStrap.Spinner animation="border" role="status" />
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

export default ManagerTenantExtendedAgreementView;
