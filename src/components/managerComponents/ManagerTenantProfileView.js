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
  function MaskCharacter(str, mask, n = 1) {
    return ("" + str).slice(0, -n).replace(/./g, mask) + ("" + str).slice(-n);
  }
  function ordinal_suffix_of(i) {
    var j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
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
          {application.applicant_info.map((applicant) => (
            <div
              className="my-3 p-2"
              style={{
                boxShadow: " 0px 1px 6px #00000029",
                borderRadius: "5px",
              }}
            >
              <Row className="mx-2">
                <Row className="mx-2">
                  <Col style={subText}>Applicant Name</Col>
                  <Col style={subText}>
                    {applicant.tenant_first_name} {applicant.tenant_last_name}
                  </Col>
                </Row>
                <Row className="mx-2">
                  <Col style={subText}>Phone Number</Col>
                  <Col style={subText}>{applicant.tenant_phone_number}</Col>
                </Row>
                <Row className="mx-2">
                  <Col style={subText}>Email</Col>
                  <Col style={subText}>{applicant.tenant_email}</Col>
                </Row>
              </Row>
              <Row className="mx-2 my-2">
                <Row className="mx-2" style={headings}>
                  <div>Who plans to live in the unit?</div>
                </Row>
                <Row className="mx-2">
                  {applicant.adults &&
                  JSON.parse(applicant.adults).length > 0 ? (
                    <div className="mx-3 ">
                      <Row style={subHeading}>Adults</Row>
                      <Row style={subHeading}>
                        <Col>Name</Col>
                        <Col>Relationship</Col>
                        <Col>DOB(YYYY-MM-DD)</Col>
                      </Row>
                      {JSON.parse(applicant.adults).map((adult) => {
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
                      <Row style={subHeading}>Adults</Row>
                      <Row style={gray}>
                        <Col>None</Col>
                      </Row>
                    </div>
                  )}
                  {applicant.children &&
                  JSON.parse(applicant.children).length > 0 ? (
                    <div className="mx-3 ">
                      <Row style={subHeading}>Children</Row>
                      <Row style={subHeading}>
                        <Col>Name</Col>
                        <Col>Relationship</Col>
                        <Col>DOB(YYYY-MM-DD)</Col>
                      </Row>
                      {JSON.parse(applicant.children).map((child) => {
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
                      <Row style={subHeading}>Children</Row>
                      <Row style={gray}>
                        <Col>None</Col>
                      </Row>
                    </div>
                  )}

                  {applicant.pets && JSON.parse(applicant.pets).length > 0 ? (
                    <div className="mx-3 ">
                      <Row style={subHeading}>Pets</Row>
                      <Row style={subHeading}>
                        <Col>Name</Col>
                        <Col>Type</Col>
                        <Col>Breed</Col>
                        <Col>Weight</Col>
                      </Row>
                      {JSON.parse(applicant.pets).map((pet) => {
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
                      <Row style={subHeading}>Pets</Row>
                      <Row style={gray}>
                        <Col>None</Col>
                      </Row>
                    </div>
                  )}

                  {applicant.vehicles &&
                  JSON.parse(applicant.vehicles).length > 0 ? (
                    <div className="mx-3 ">
                      <Row style={subHeading}>Vehicles</Row>
                      <Row style={subHeading}>
                        <Col>Make</Col>
                        <Col>Model</Col>
                        <Col>Year</Col>
                        <Col>State</Col>
                        <Col>License</Col>
                      </Row>
                      {JSON.parse(applicant.vehicles).map((vehicle) => {
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
                      <Row style={subHeading}>Vehicles</Row>
                      <Row style={gray}>
                        <Col>None</Col>
                      </Row>
                    </div>
                  )}

                  {applicant.referred &&
                  JSON.parse(applicant.referred).length > 0 ? (
                    <div className="mx-3 ">
                      <Row style={subHeading}>referred</Row>
                      <Row style={subHeading}>
                        <Col>Name</Col>
                        <Col>Address</Col>
                        <Col>Phone Number</Col>
                        <Col>Email</Col>
                        <Col>Relationship</Col>
                      </Row>
                      {JSON.parse(applicant.referred).map((reference) => {
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
                      })}
                    </div>
                  ) : (
                    <div className="mx-3 ">
                      <Row style={subHeading}>referred</Row>
                      <Row style={gray}>
                        <Col>None</Col>
                      </Row>
                    </div>
                  )}
                  {applicant["a.documents"] &&
                  applicant["a.documents"].length > 0 ? (
                    <div className="mx-3 ">
                      <Row style={subHeading}>Documents</Row>
                      {JSON.parse(applicant["a.documents"]).map(
                        (document, i) => {
                          return (
                            <Row>
                              <Col>
                                <h6>{document.name}</h6>
                              </Col>
                              <Col>
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
                                    alt="Document"
                                  />
                                </a>
                              </Col>
                            </Row>
                          );
                        }
                      )}{" "}
                    </div>
                  ) : (
                    <div className="mx-3 ">
                      <Row style={subHeading}>Documents</Row>
                      <Row style={gray}>
                        <Col>None</Col>
                      </Row>
                    </div>
                  )}
                </Row>
              </Row>
            </div>
          ))}
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
                        <TableCell>Adults</TableCell>
                        <TableCell>Children</TableCell>
                        <TableCell>Pets</TableCell>
                        <TableCell>Vehicles</TableCell>
                        <TableCell>referred</TableCell>
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
                          <TableCell>
                            {`${fee.available_topay} days before`}
                          </TableCell>
                          <TableCell>
                            {fee.due_by === ""
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
                              <a
                                href={file.link}
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
              No lease created yet
            </div>
          </Container>
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
