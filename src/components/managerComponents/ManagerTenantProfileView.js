import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
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
import OpenDoc from "../../icons/OpenDoc.svg";
import { put } from "../../utils/api";
import {
  mediumBold,
  redPillButton,
  hidden,
  smallImg,
  subText,
  bluePillButton,
} from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
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

  console.log(application);
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  const applicationsResponse = async () => {
    createNewTenantAgreement(application);
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
  function MaskCharacter(str, mask, n = 1) {
    return ("" + str).slice(0, -n).replace(/./g, mask) + ("" + str).slice(-n);
  }
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

        <Container
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
                  {application.tenant_first_name} {application.tenant_last_name}
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
                  {application.tenant_current_job_company}
                </Col>
              </Row>
              <Row className="mx-2">
                <Col style={subText}>Job Title</Col>
                <Col style={subText}>
                  {application.tenant_current_job_title}
                </Col>
              </Row>
              <Row className="mx-2">
                <Col style={subText}>Job Salary</Col>
                <Col style={subText}>
                  {application.tenant_current_salary}/{" "}
                  {application.tenant_salary_frequency}
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
                        application.tenant_drivers_license_number,
                        "*"
                      )}
                    </div>
                  ) : (
                    <div>{application.tenant_drivers_license_number}</div>
                  )}
                </Col>
              </Row>
              <Row className="mx-2">
                <Col style={subText}>SSN</Col>
                <Col style={subText} onClick={() => setShowSSN(!showSSN)}>
                  {showSSN ? (
                    <div>{MaskCharacter(application.tenant_ssn, "*")}</div>
                  ) : (
                    <div>{application.tenant_ssn}</div>
                  )}
                  {}
                </Col>
              </Row>
              <Row className="mx-2">
                <Col style={subText}>Email</Col>
                <Col style={subText}>{application.tenant_email}</Col>
              </Row>
              <Row className="mx-2">
                <Col style={subText}>Phone Number</Col>
                <Col style={subText}>{application.tenant_phone_number}</Col>
              </Row>
            </Row>
          </div>
        </Container>

        {application.applicant_info.length > 0
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
        {application.applicant_info.length > 0
          ? application.applicant_info.map((applicant) =>
              applicant.application_uid !== application.application_uid ? (
                <Container
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
                </Container>
              ) : (
                ""
              )
            )
          : ""}
        <Row className="d-flex justify-content-center my-2" style={mediumBold}>
          Application Details
        </Row>

        <Container
          style={{
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            boxShadow: "0px 3px 6px #00000029",
            border: "0.5px solid #707070",
            borderRadius: "5px",
            maxHeight: "500px",
            overflow: "scroll",
          }}
        >
          <div
            className="my-3 p-2"
            style={{
              boxShadow: " 0px 1px 6px #00000029",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            <Row className="mx-2">
              <Table classes={{ root: classes.customTable }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Phone Number</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Occupants</TableCell>
                    <TableCell align="center">No. of Pets</TableCell>
                    <TableCell align="center"> Type of Pets</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {application.applicant_info.map((applicant) => (
                    <TableRow>
                      <TableCell align="center">
                        {applicant.tenant_first_name}{" "}
                        {applicant.tenant_last_name}
                      </TableCell>
                      <TableCell align="center">
                        {applicant.tenant_phone_number}
                      </TableCell>
                      <TableCell align="center">
                        {applicant.tenant_email}
                      </TableCell>
                      <TableCell align="center">
                        {applicant.adult_occupants} adults <br />
                        {applicant.children_occupants} children
                      </TableCell>
                      <TableCell align="center">{applicant.num_pets}</TableCell>
                      <TableCell align="center">
                        {" "}
                        {applicant.type_pets}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Row>
          </div>
        </Container>
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
          <Container
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 6px #00000029",
              border: "0.5px solid #707070",
              borderRadius: "5px",
              maxHeight: "500px",
              overflow: "scroll",
            }}
          >
            <div
              className="my-3 p-2"
              style={{
                boxShadow: " 0px 1px 6px #00000029",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              <Row className="mx-2">
                <Row className="mb-4 m-3" style={{ hidden: "overflow" }}>
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
                        <TableCell>Occupants</TableCell>
                        <TableCell>No. of Pets</TableCell>
                        <TableCell>Type of Pets</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{application.lease_start}</TableCell>

                        <TableCell>{application.lease_end}</TableCell>

                        <TableCell>
                          {`${ordinal_suffix_of(
                            application.due_by
                          )} of the month`}
                        </TableCell>

                        <TableCell>
                          {application["r.adult_occupants"]} adults <br />
                          {application["r.children_occupants"]} children
                        </TableCell>
                        <TableCell> {application["r.num_pets"]}</TableCell>
                        <TableCell> {application["r.type_pets"]}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Row>
              </Row>
            </div>{" "}
            <div
              className="my-3 p-2"
              style={{
                boxShadow: " 0px 1px 6px #00000029",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              <Row className="mx-2">
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
                          <TableCell>{`${ordinal_suffix_of(
                            fee.available_topay
                          )} of the month`}</TableCell>
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
              hidden={application.rental_uid !== null}
            >
              <Row className="mx-2">
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
                              <img
                                src={Message}
                                alt="Message"
                                style={smallImg}
                              />
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
              hidden={application.rental_uid !== null}
            >
              <Row className="mx-2">
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
              </Row>
            </div>
          </Container>
        ) : (
          <div></div>
        )}
      </div>

      <Row
        className="mt-4 "
        style={
          application.application_status === "FORWARDED" ||
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
      <Row style={application.application_status !== "FORWARDED" ? hidden : {}}>
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
