import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import File from "../../icons/File.svg";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import { put } from "../../utils/api";
import {
  mediumBold,
  redPillButton,
  hidden,
  smallImg,
  subText,
  bluePillButton,
  subHeading,
  gray,
  headings,
} from "../../utils/styles";
import { MaskCharacter, ordinal_suffix_of } from "../../utils/helper";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
  customTableDetail: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});
function ManagerTenantProfileView(props) {
  const classes = useStyles();
  const [contactState, setContactState] = useState([]);
  const [feeState, setFeeState] = useState([]);
  const [files, setFiles] = useState([]);
  const [showDL, setShowDL] = useState(true);
  const [showSSN, setShowSSN] = useState(true);
  const { back, application, createNewTenantAgreement } = props;
  useEffect(() => {
    if (application.rental_uid !== null) {
      setFeeState(JSON.parse(application.rent_payments));
      setFiles(JSON.parse(application["r.documents"]));
      setContactState(JSON.parse(application.assigned_contacts));
    }
  }, []);

  // console.log(application);
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  const applicationsResponse = () => {
    // console.log("applicationsResponse", application);
    createNewTenantAgreement([application]);
  };
  const rejectApplication = async () => {
    const request_body = {
      application_uid: application.application_uid,
      message: "Application has been rejected by the Property Manager",
      application_status: "REJECTED",
    };
    // console.log(request_body)
    const response = await put("/applications", request_body);
    back();
  };

  return (
    <div className="mb-5 pb-5">
      <div
        className="mx-2 my-2 p-3"
        style={{
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        <Row className="d-flex justify-content-center my-2" style={mediumBold}>
          Personal Info
        </Row>
        <div
          className="mx-3 my-3 p-2"
          style={{
            background: "#E9E9E9 0% 0% no-repeat padding-box",
            borderRadius: "10px",
            opacity: 1,
          }}
        >
          <Row className="mb-4 m-3">
            <h5 style={mediumBold}>Personal Details</h5>

            <Table
              classes={{ root: classes.customTableDetail }}
              size="small"
              responsive="md"
            >
              <TableHead>
                <TableRow>
                  <TableCell> First Name</TableCell>
                  <TableCell> Last Name</TableCell>
                  <TableCell> Address</TableCell>
                  <TableCell> Phone Number</TableCell>
                  <TableCell> Email</TableCell>
                  <TableCell> Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {" "}
                    {application.tenant_first_name &&
                    application.tenant_first_name !== "NULL"
                      ? application.tenant_first_name
                      : "No First Name Provided"}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {application.tenant_last_name &&
                    application.tenant_last_name !== "NULL"
                      ? application.tenant_last_name
                      : "No Last Name Provided"}
                  </TableCell>
                  <TableCell>
                    {application.address}
                    {application.unit !== "" ? " " + application.unit : ""}
                    , <br />
                    {application.city}, {application.state} {application.zip}
                  </TableCell>
                  <TableCell>
                    {application.tenant_phone_number &&
                    application.tenant_phone_number !== "NULL"
                      ? application.tenant_phone_number
                      : "No Phone Number Provided"}
                  </TableCell>
                  <TableCell>
                    {application.tenant_email &&
                    application.tenant_email !== "NULL"
                      ? application.tenant_email
                      : "No Email Provided"}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Row>

          <Row className="mb-4 m-3">
            <h5 style={mediumBold}>Current Job Details</h5>

            <Table
              classes={{ root: classes.customTableDetail }}
              size="small"
              responsive="md"
            >
              <TableHead>
                <TableRow>
                  <TableCell> Current Salary</TableCell>
                  <TableCell>Salary Frequency</TableCell>
                  <TableCell> Current Job Title</TableCell>
                  <TableCell> Current Company Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {application.tenant_current_salary &&
                    application.tenant_current_salary !== "NULL"
                      ? application.tenant_current_salary
                      : "No Salary Info Provided"}
                  </TableCell>
                  <TableCell>
                    {application.tenant_salary_frequency &&
                    application.tenant_salary_frequency !== "NULL"
                      ? application.tenant_salary_frequency
                      : "No Salary Info Provided"}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {application.tenant_current_job_title &&
                    application.tenant_current_job_title !== "NULL"
                      ? application.tenant_current_job_title
                      : "No Job Title Provided"}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {application.tenant_current_job_company &&
                    application.tenant_current_job_company !== "NULL"
                      ? application.tenant_current_job_company
                      : "No Company Provided"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Row>
          <Row className="mb-4 m-3">
            <h5 style={mediumBold}>Identification Details</h5>

            <Table
              classes={{ root: classes.customTableDetail }}
              size="small"
              responsive="md"
            >
              <TableHead>
                <TableRow>
                  <TableCell> SSN</TableCell>
                  <TableCell> Driver's Licence Number</TableCell>
                  <TableCell> Driver's Licence State</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell onClick={() => setShowSSN(!showSSN)}>
                    {" "}
                    {showSSN ? (
                      <div>{MaskCharacter(application.tenant_ssn, "*")}</div>
                    ) : (
                      <div>{application.tenant_ssn}</div>
                    )}
                  </TableCell>
                  <TableCell onClick={() => setShowDL(!showDL)}>
                    {showDL ? (
                      <div>
                        {MaskCharacter(
                          application.tenant_drivers_license_number,
                          "*"
                        )}
                      </div>
                    ) : (
                      <div>{application.tenant_drivers_license_number}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {application.tenant_drivers_license_state &&
                    application.tenant_drivers_license_state !== "NULL"
                      ? application.tenant_drivers_license_state
                      : "No DL state Provided"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Row>
        </div>
        {application.applicant_info.length > 1
          ? application.applicant_info.map((applicant) =>
              applicant.application_uid !== application.application_uid ? (
                <Row
                  className="d-flex justify-content-center my-2"
                  style={mediumBold}
                >
                  Co-applicant Personal Info
                </Row>
              ) : (
                ""
              )
            )
          : ""}

        {application.applicant_info.length > 1 ? (
          <Row className="m-3">
            <Row className="mb-4">
              <h5 style={mediumBold}>Personal Details</h5>

              <Table
                classes={{ root: classes.customTableDetail }}
                size="small"
                responsive="md"
              >
                <TableHead>
                  <TableRow>
                    <TableCell> First Name</TableCell>
                    <TableCell> Last Name</TableCell>
                    <TableCell> Address</TableCell>
                    <TableCell> Phone Number</TableCell>
                    <TableCell> Email</TableCell>
                    <TableCell> Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {application.applicant_info.map((applicant) =>
                    applicant.application_uid !==
                    application.application_uid ? (
                      <TableRow>
                        <TableCell>
                          {" "}
                          {applicant.tenant_first_name &&
                          applicant.tenant_first_name !== "NULL"
                            ? applicant.tenant_first_name
                            : "No First Name Provided"}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {applicant.tenant_last_name &&
                          applicant.tenant_last_name !== "NULL"
                            ? applicant.tenant_last_name
                            : "No Last Name Provided"}
                        </TableCell>
                        <TableCell>
                          {applicant.address}
                          {applicant.unit !== "" ? " " + applicant.unit : ""}
                          , <br />
                          {applicant.city}, {applicant.state} {applicant.zip}
                        </TableCell>
                        <TableCell>
                          {applicant.tenant_phone_number &&
                          applicant.tenant_phone_number !== "NULL"
                            ? applicant.tenant_phone_number
                            : "No Phone Number Provided"}
                        </TableCell>
                        <TableCell>
                          {applicant.tenant_email &&
                          applicant.tenant_email !== "NULL"
                            ? applicant.tenant_email
                            : "No Email Provided"}
                        </TableCell>
                        <TableCell>
                          <div className="d-flex  justify-content-end ">
                            <div
                              style={applicant.tenant_id ? {} : hidden}
                              onClick={stopPropagation}
                            >
                              <a href={`tel:${applicant.tenant_phone_number}`}>
                                <img src={Phone} alt="Phone" style={smallImg} />
                              </a>
                              <a href={`mailto:${applicant.tenant_email}`}>
                                <img
                                  src={Message}
                                  alt="Message"
                                  style={smallImg}
                                />
                              </a>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      ""
                    )
                  )}
                </TableBody>
              </Table>
            </Row>

            <Row className="mb-4">
              <h5 style={mediumBold}>Current Job Details</h5>

              <Table
                classes={{ root: classes.customTableDetail }}
                size="small"
                responsive="md"
              >
                <TableHead>
                  <TableRow>
                    <TableCell> Current Salary</TableCell>
                    <TableCell>Salary Frequency</TableCell>
                    <TableCell> Current Job Title</TableCell>
                    <TableCell> Current Company Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {application.applicant_info.map((applicant) =>
                    applicant.application_uid !==
                    application.application_uid ? (
                      <TableRow>
                        <TableCell>
                          {applicant.tenant_current_salary &&
                          applicant.tenant_current_salary !== "NULL"
                            ? applicant.tenant_current_salary
                            : "No Salary Info Provided"}
                        </TableCell>
                        <TableCell>
                          {applicant.tenant_salary_frequency &&
                          applicant.tenant_salary_frequency !== "NULL"
                            ? applicant.tenant_salary_frequency
                            : "No Salary Info Provided"}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {applicant.tenant_current_job_title &&
                          applicant.tenant_current_job_title !== "NULL"
                            ? applicant.tenant_current_job_title
                            : "No Job Title Provided"}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {applicant.tenant_current_job_company &&
                          applicant.tenant_current_job_company !== "NULL"
                            ? applicant.tenant_current_job_company
                            : "No Company Provided"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      ""
                    )
                  )}
                </TableBody>
              </Table>
            </Row>
            <Row className="mb-4">
              <h5 style={mediumBold}>Identification Details</h5>

              <Table
                classes={{ root: classes.customTableDetail }}
                size="small"
                responsive="md"
              >
                <TableHead>
                  <TableRow>
                    <TableCell> SSN</TableCell>
                    <TableCell> Driver's Licence Number</TableCell>
                    <TableCell> Driver's Licence State</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {application.applicant_info.map((applicant) =>
                    applicant.application_uid !==
                    application.application_uid ? (
                      <TableRow>
                        <TableCell onClick={() => setShowSSN(!showSSN)}>
                          {" "}
                          {showSSN ? (
                            <div>
                              {MaskCharacter(applicant.tenant_ssn, "*")}
                            </div>
                          ) : (
                            <div>{applicant.tenant_ssn}</div>
                          )}
                        </TableCell>
                        <TableCell onClick={() => setShowDL(!showDL)}>
                          {showDL ? (
                            <div>
                              {MaskCharacter(
                                applicant.tenant_drivers_license_number,
                                "*"
                              )}
                            </div>
                          ) : (
                            <div>{applicant.tenant_drivers_license_number}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {applicant.tenant_drivers_license_state &&
                          applicant.tenant_drivers_license_state !== "NULL"
                            ? applicant.tenant_drivers_license_state
                            : "No DL state Provided"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      ""
                    )
                  )}
                </TableBody>
              </Table>
            </Row>
          </Row>
        ) : (
          ""
        )}
        {application.applicant_info.length > 0
          ? application.applicant_info.map((applicant) =>
              applicant.application_uid !== application.application_uid ? (
                <div
                  style={{
                    background: "#FFFFFF 0% 0% no-repeat padding-box",
                    boxShadow: "0px 3px 6px #00000029",
                    border: "0.5px solid #707070",
                    borderRadius: "5px",
                    maxHeight: "500px",
                    overflow: "scroll",
                  }}
                >
                  <Row className="p-1">
                    <Col>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0" style={mediumBold}>
                          {applicant.tenant_first_name}{" "}
                          {applicant.tenant_last_name}
                        </h5>
                      </div>
                    </Col>

                    <Col>
                      <div className="d-flex  justify-content-end ">
                        <div
                          style={applicant.tenant_id ? {} : hidden}
                          onClick={stopPropagation}
                        >
                          <a href={`tel:${applicant.tenant_phone_number}`}>
                            <img src={Phone} alt="Phone" style={smallImg} />
                          </a>
                          <a href={`mailto:${applicant.tenant_email}`}>
                            <img src={Message} alt="Message" style={smallImg} />
                          </a>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div
                    className="my-3 p-2"
                    style={{
                      boxShadow: " 0px 1px 6px #00000029",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <Row className="mx-2">
                      Current Job Details
                      <Row className="mx-2">
                        <Col style={subText}>Job Company</Col>
                        <Col style={subText}>
                          {applicant.tenant_current_job_company}
                        </Col>
                      </Row>
                      <Row className="mx-2">
                        <Col style={subText}>Job Title</Col>
                        <Col style={subText}>
                          {applicant.tenant_current_job_title}
                        </Col>
                      </Row>
                      <Row className="mx-2">
                        <Col style={subText}>Job Salary</Col>
                        <Col style={subText}>
                          {applicant.tenant_current_salary}/{" "}
                          {applicant.tenant_salary_frequency}
                        </Col>
                      </Row>
                    </Row>
                  </div>
                  <div
                    className="my-3 p-2"
                    style={{
                      boxShadow: " 0px 1px 6px #00000029",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <Row className="mx-2">
                      Personal Details
                      <Row className="mx-2">
                        <Col style={subText}>DL Number</Col>
                        <Col style={subText} onClick={() => setShowDL(!showDL)}>
                          {showDL ? (
                            <div>
                              {MaskCharacter(
                                applicant.tenant_drivers_license_number,
                                "*"
                              )}
                            </div>
                          ) : (
                            <div>{applicant.tenant_drivers_license_number}</div>
                          )}
                        </Col>
                      </Row>
                      <Row className="mx-2">
                        <Col style={subText}>SSN</Col>
                        <Col
                          style={subText}
                          onClick={() => setShowSSN(!showSSN)}
                        >
                          {showSSN ? (
                            <div>
                              {MaskCharacter(applicant.tenant_ssn, "*")}
                            </div>
                          ) : (
                            <div>{applicant.tenant_ssn}</div>
                          )}
                          {}
                        </Col>
                      </Row>
                      <Row className="mx-2">
                        <Col style={subText}>Email</Col>
                        <Col style={subText}>{applicant.tenant_email}</Col>
                      </Row>
                      <Row className="mx-2">
                        <Col style={subText}>Phone Number</Col>
                        <Col style={subText}>
                          {applicant.tenant_phone_number}
                        </Col>
                      </Row>
                    </Row>
                  </div>
                </div>
              ) : (
                ""
              )
            )
          : ""}
        <Row className="d-flex justify-content-center my-2" style={mediumBold}>
          Application Details
        </Row>
        <div
          className="mx-3 p-2"
          style={{
            background: "#E9E9E9 0% 0% no-repeat padding-box",
            borderRadius: "10px 10px 0px 0px",
            opacity: 1,
          }}
        >
          <Row className="m-3">
            <Col>
              <h3>Application Details</h3>
            </Col>
            <Col xs={2}> </Col>
          </Row>
        </div>

        <div
          className="mx-3 mb-3 p-2"
          style={{
            background: "#E9E9E9 0% 0% no-repeat padding-box",
            borderRadius: "0px 0px 10px 10px",
            opacity: 1,
          }}
        >
          <Row className="m-3" style={{ overflow: "scroll" }}>
            <Table classes={{ root: classes.customTable }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Application Status</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Adults</TableCell>
                  <TableCell>Children</TableCell>
                  <TableCell>Pets</TableCell>
                  <TableCell>Vehicles</TableCell>
                  <TableCell>References</TableCell>
                  <TableCell>Application Date</TableCell>
                  <TableCell>Documents</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {application.applicant_info.map((applicant) => {
                  return (
                    <TableRow className="mt-2">
                      <TableCell>{applicant.application_status}</TableCell>
                      <TableCell>
                        {`${applicant.tenant_first_name} ${applicant.tenant_last_name} `}
                      </TableCell>
                      <TableCell>Note: {applicant.message}</TableCell>
                      {applicant.adults ? (
                        <TableCell align="center">
                          {JSON.parse(applicant.adults).length}
                        </TableCell>
                      ) : (
                        <TableCell align="center">0</TableCell>
                      )}
                      {applicant.children ? (
                        <TableCell align="center">
                          {JSON.parse(applicant.children).length}
                        </TableCell>
                      ) : (
                        <TableCell align="center">0</TableCell>
                      )}

                      {applicant.pets ? (
                        <TableCell align="center">
                          {JSON.parse(applicant.pets).length}
                        </TableCell>
                      ) : (
                        <TableCell align="center">0</TableCell>
                      )}
                      {applicant.vehicles ? (
                        <TableCell align="center">
                          {JSON.parse(applicant.vehicles).length}
                        </TableCell>
                      ) : (
                        <TableCell align="center">0</TableCell>
                      )}
                      {applicant.referred ? (
                        <TableCell align="center">
                          {JSON.parse(applicant.referred).length}
                        </TableCell>
                      ) : (
                        <TableCell align="center">0</TableCell>
                      )}
                      <TableCell>
                        {applicant.application_date.split(" ")[0]}
                      </TableCell>

                      <TableCell>
                        {applicant.documents &&
                          applicant.documents.length > 0 &&
                          JSON.parse(applicant.documents).map((document, i) => (
                            <div
                              className="d-flex justify-content-between align-items-end ps-0"
                              key={i}
                            >
                              <h6>
                                {document.description == ""
                                  ? document.name
                                  : document.description}
                              </h6>
                              <a
                                href={document.link}
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
                            </div>
                          ))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Row>
        </div>

        <Row className="d-flex justify-content-center my-2">
          <p
            className="d-flex justify-content-center my-2"
            hidden={application.rental_uid === null}
            style={mediumBold}
          >
            Lease Agreement Details
          </p>
        </Row>
        {application.rental_uid !== null ? (
          <div
            className="mx-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px 10px 0px 0px",
              opacity: 1,
            }}
          >
            <Row className="m-3" style={{ hidden: "overflow" }}>
              <h5>Lease Details</h5>
              <Table
                responsive="md"
                classes={{ root: classes.customTable }}
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Lease Start</TableCell>
                    <TableCell>Lease End</TableCell>
                    <TableCell>Rent Due</TableCell>
                    <TableCell>Adults</TableCell>
                    <TableCell>Children</TableCell>
                    <TableCell>Pets</TableCell>
                    <TableCell>Vehicles</TableCell>
                    <TableCell>References</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{application.lease_start}</TableCell>

                    <TableCell>{application.lease_end}</TableCell>

                    <TableCell>
                      {`${ordinal_suffix_of(application.due_by)} of the month`}
                    </TableCell>

                    {application.adults ? (
                      <TableCell>
                        {JSON.parse(application.adults).length}
                      </TableCell>
                    ) : (
                      <TableCell>0</TableCell>
                    )}
                    {application.children ? (
                      <TableCell>
                        {JSON.parse(application.children).length}
                      </TableCell>
                    ) : (
                      <TableCell>0</TableCell>
                    )}

                    {application.pets ? (
                      <TableCell>
                        {JSON.parse(application.pets).length}
                      </TableCell>
                    ) : (
                      <TableCell>0</TableCell>
                    )}
                    {application.vehicles ? (
                      <TableCell>
                        {JSON.parse(application.vehicles).length}
                      </TableCell>
                    ) : (
                      <TableCell>0</TableCell>
                    )}
                    {application.referred ? (
                      <TableCell>
                        {JSON.parse(application.referred).length}
                      </TableCell>
                    ) : (
                      <TableCell>0</TableCell>
                    )}
                  </TableRow>
                </TableBody>
              </Table>
            </Row>

            <Row className="m-3" style={{ hidden: "overflow" }}>
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
            </Row>

            <Row className="m-3" hidden={contactState.length === 0}>
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

            <Row className="m-3">
              <h5 style={mediumBold}>Lease Documents</h5>
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
                        <TableCell>
                          {file.description == ""
                            ? file.name
                            : file.description}
                        </TableCell>
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
            </Row>
          </div>
        ) : (
          <div
            className="mx-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px 10px 0px 0px",
              opacity: 1,
            }}
          >
            <div>No lease created yet</div>
          </div>
        )}
      </div>

      <Row
        className="mt-4 "
        style={
          application.application_status === "FORWARDED" ||
          application.application_status === "RENTED" ||
          application.application_status === "LEASE EXTENSION" ||
          application.application_status === "TENANT LEASE EXTENSION" ||
          application.application_status === "REJECTED" ||
          application.application_status === "REFUSED"
            ? hidden
            : {}
        }
      >
        <Col className="d-flex  justify-content-evenly">
          <Button style={bluePillButton} onClick={applicationsResponse}>
            Accept Application
          </Button>
        </Col>

        <Col className="d-flex justify-content-evenly">
          <Button style={redPillButton} onClick={rejectApplication}>
            Reject Application
          </Button>
        </Col>
      </Row>
      <Row
        style={
          application.application_status === "FORWARDED" ||
          application.application_status === "RENTED" ||
          application.application_status === "LEASE EXTENSION" ||
          application.application_status === "TENANT LEASE EXTENSION" ||
          application.application_status === "REJECTED" ||
          application.application_status === "REFUSED"
            ? hidden
            : {}
        }
      >
        <Col className="d-flex justify-content-evenly">
          <Button style={redPillButton} onClick={rejectApplication}>
            Reject Application
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default ManagerTenantProfileView;
