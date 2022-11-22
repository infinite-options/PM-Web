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
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import OpenDoc from "../../icons/OpenDoc.svg";
import { put, post, get } from "../../utils/api";
import {
  small,
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
    back,
    property,
    renewLease,
    selectedAgreement,
    acceptedTenantApplications,
  } = props;
  console.log(selectedAgreement);

  console.log(selectedAgreement == null);
  const [tenantInfo, setTenantInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [feeState, setFeeState] = useState([]);
  const [contactState, setContactState] = useState([]);
  const [files, setFiles] = useState([]);

  // const [renewLease, setRenewLease] = useState(false)
  const [terminateLease, setTerminateLease] = useState(false);
  const [lastDate, setLastDate] = useState("");
  const [tenantEndEarly, setTenantEndEarly] = useState(false);
  const [agreement, setAgreement] = useState([]);

  const loadAgreement = async (agg) => {
    console.log("load agreement");

    console.log("in useeffect");
    setAgreement(agg);
    setIsLoading(false);
    // loadAgreement(agg);
    let tenant = [];
    let ti = {};
    console.log("selectedagg", agg);

    if (agg.tenant_first_name.includes(",")) {
      let tenant_fns = agg.tenant_first_name.split(",");
      let tenant_lns = agg.tenant_last_name.split(",");
      let tenant_emails = agg.tenant_email.split(",");
      let tenant_phones = agg.tenant_phone_number.split(",");
      for (let i = 0; i < tenant_fns.length; i++) {
        ti["tenantFirstName"] = tenant_fns[i];
        ti["tenantLastName"] = tenant_lns[i];
        ti["tenantEmail"] = tenant_emails[i];
        ti["tenantPhoneNumber"] = tenant_phones[i];
        tenant.push(ti);
        ti = {};
      }
    } else {
      ti = {
        tenantFirstName: agg.tenant_first_name,
        tenantLastName: agg.tenant_last_name,
        tenantEmail: agg.tenant_email,
        tenantPhoneNumber: agg.tenant_phone_number,
      };
      tenant.push(ti);
    }

    setTenantInfo(tenant);
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

  const renewLeaseAgreement = async () => {
    back();
  };

  const terminateLeaseAgreement = async () => {
    if (lastDate === "") {
      setErrorMessage("Please select a last date");
      return;
    }

    const request_body = {
      application_status: "PM END EARLY",
      property_uid: property.property_uid,
      early_end_date: lastDate,
    };
    const response = await put("/endEarly", request_body);
    back();
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
    back();
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
          <Row className="m-3 mb-4" style={{ hidden: "overflow" }}>
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
                            <a href={`mailto:${tf.tenantEmail}`}>
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
          </Row>
          <Row className="mb-4 m-3" style={{ hidden: "overflow" }}>
            <h5>Lease Details</h5>
            <Table
              responsive="md"
              classes={{ root: classes.customTable }}
              size="small"
            >
              {console.log(agreement)}
              <TableHead>
                <TableRow>
                  <TableCell>Lease Start</TableCell>
                  <TableCell>Lease End</TableCell>
                  <TableCell>Rent Due</TableCell>
                  <TableCell>Later after</TableCell>
                  <TableCell>Late Fee</TableCell>
                  <TableCell>Per Day Late Fee</TableCell>
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
          </Row>

          <Row className="mb-4 m-3" style={{ hidden: "overflow" }}>
            <h5>Lease Payments</h5>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Row>

          <Row className="mb-4 m-3" hidden={contactState.length === 0}>
            <h5 style={mediumBold}>Contact Details</h5>
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
                      <a href={`mailto:${contact.email}`}>
                        <img src={Message} alt="Message" style={smallImg} />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Row>
          <Row className="m-3" hidden={files.length === 0}>
            <h5 style={mediumBold}>Lease Documents</h5>
            <Table
              responsive="md"
              classes={{ root: classes.customTable }}
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Document Name</TableCell>
                  <TableCell></TableCell>
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
                            src={OpenDoc}
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
          </Row>

          <Row
            className="pt-4 my-4"
            hidden={agreement === null || tenantEndEarly}
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

          {terminateLease ? (
            <div hidden={agreement === null || tenantEndEarly}>
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
            <Row hidden={agreement === null || tenantEndEarly}>
              <Col className="d-flex flex-row justify-content-evenly">
                <Button
                  style={redPillButton}
                  variant="outline-primary"
                  onClick={() => setTerminateLease(true)}
                >
                  Terminate Lease
                </Button>
              </Col>
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
        </div>
      ) : (
        <Row className="m-3">No Active Lease Agreements</Row>
      )}
    </div>
  );
}

export default ManagerTenantAgreementView;
