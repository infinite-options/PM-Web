import React, { useState, useEffect, useContext } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import {
  TableBody,
  TableHead,
  TableRow,
  Table,
  TableCell,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppContext from "../../AppContext";
import Checkbox from "../Checkbox";
import File from "../../icons/File.svg";
import Delete from "../../icons/Delete.svg";
import {
  mediumBold,
  headings,
  subText,
  bluePillButton,
} from "../../utils/styles";
import { get, put } from "../../utils/api";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});
function ManagerTenantApplications(props) {
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token } = userData;
  const {
    property,
    createNewTenantAgreement,
    selectTenantApplication,
    reload,
  } = props;
  const [applications, setApplications] = useState([]);
  const [newApplications, setNewApplications] = useState([]);
  // const [selectedApplications, setSelectedApplications] = useState([])
  const [forwardedApplications, setForwardedApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [showSSN, setShowSSN] = useState(true);
  function MaskCharacter(str, mask, n = 1) {
    return ("" + str).slice(0, -n).replace(/./g, mask) + ("" + str).slice(-n);
  }
  const fetchApplications = async () => {
    if (access_token === null) {
      return;
    }
    console.log("in fetch applicaions");
    const response = await get(
      `/applications?property_uid=${property.property_uid}`
    );
    if (response.msg === "Token has expired") {
      refresh();
      return;
    }
    console.log(response.result);
    const applications = response.result.map((application) => ({
      ...application,
      application_selected: false,
    }));
    console.log(applications);
    setApplications(applications);
    setNewApplications(
      applications.filter((a) => a.application_status === "NEW")
    );
    setForwardedApplications(
      applications.filter((a) => a.application_status === "FORWARDED")
    );
    setRejectedApplications(
      applications.filter((a) => a.application_status === "REJECTED")
    );
  };

  useEffect(fetchApplications, [property]);

  const rejectApplication = async (application) => {
    const request_body = {
      application_uid: application.application_uid,
      message: "Application has been rejected by the Property Manager",
      application_status: "REJECTED",
    };
    // console.log(request_body)
    const response = await put("/applications", request_body);
    reload();
  };

  const toggleApplications = (application) => {
    const selected = [...newApplications];
    const index = selected.findIndex(
      (a) => a.application_uid === application.application_uid
    );
    selected[index].application_selected =
      !selected[index].application_selected;
    setNewApplications(selected);
  };

  const applicationsResponse = async () => {
    const selected_applications = newApplications.filter(
      (a) => a.application_selected
    );
    if (selected_applications.length === 0) {
      alert("Please select at least one application");
      return;
    }

    createNewTenantAgreement(selected_applications);
  };

  return (
    <div>
      <div
        className="mx-2 my-2 py-3"
        style={{
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        <div
          style={mediumBold}
          className=" d-flex flex-column justify-content-center align-items-center"
        >
          <div className="d-flex w-100">
            {applications.length > 0 ? (
              <div className="d-flex w-100 flex-column justify-content-center align-items-center mx-3">
                <Table classes={{ root: classes.customTable }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Application Status</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Occupants</TableCell>
                      <TableCell>Application Date</TableCell>
                      <TableCell>Phone </TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Current Job Title</TableCell>
                      <TableCell>Salary</TableCell>
                      <TableCell>SSN</TableCell>
                      <TableCell>Reject</TableCell>
                      <TableCell>Documents</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.map((application, i) => (
                      <TableRow className="mt-2" key={i}>
                        <TableCell>
                          <div
                            hidden={
                              application.application_status === "REJECTED" ||
                              application.application_status === "FORWARDED"
                            }
                          >
                            {" "}
                            <Checkbox
                              type="BOX"
                              checked={application.application_selected}
                              onClick={() => toggleApplications(application)}
                            />
                          </div>
                        </TableCell>
                        <TableCell>{application.application_status}</TableCell>
                        <TableCell>
                          {`${application.tenant_first_name} ${application.tenant_last_name} `}
                        </TableCell>
                        <TableCell>Note: {application.message}</TableCell>
                        <TableCell>
                          {application.adult_occupants} adults <br />
                          {application.children_occupants} children
                        </TableCell>
                        <TableCell>
                          {application.application_date.split(" ")[0]}
                        </TableCell>
                        <TableCell>{application.tenant_phone_number}</TableCell>
                        <TableCell>{application.tenant_email}</TableCell>
                        <TableCell>
                          {application.tenant_current_job_title !== null &&
                          application.tenant_current_job_title !== "null"
                            ? application.tenant_current_job_title
                            : "No Job Details Provided"}
                        </TableCell>

                        <TableCell>
                          {application.tenant_current_salary !== null &&
                          application.tenant_current_salary !== "null"
                            ? application.tenant_current_salary
                            : "No Salary Provided"}
                        </TableCell>
                        <TableCell onClick={() => setShowSSN(!showSSN)}>
                          {application.tenant_ssn !== null &&
                          application.tenant_ssn !== "null" ? (
                            <div>
                              {showSSN ? (
                                <div>
                                  {MaskCharacter(application.tenant_ssn, "*")}
                                </div>
                              ) : (
                                <div>{application.tenant_ssn}</div>
                              )}
                            </div>
                          ) : (
                            "No SSN Provided"
                          )}
                        </TableCell>

                        <TableCell
                          onClick={() => rejectApplication(application)}
                        >
                          <img src={Delete} />
                        </TableCell>
                        <TableCell>
                          {application.documents &&
                            application.documents.length > 0 &&
                            JSON.parse(application.documents).map(
                              (document, i) => (
                                <div
                                  className="d-flex justify-content-between align-items-end ps-0"
                                  key={i}
                                >
                                  <h6>{document.name}</h6>
                                  <a href={document.link} target="_blank">
                                    <img
                                      src={File}
                                      style={{
                                        width: "15px",
                                        height: "15px",
                                      }}
                                      alt="Document"
                                    />
                                  </a>
                                </div>
                              )
                            )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Row className="mt-4 d-flex w-100">
                  <Col className="d-flex justify-content-evenly">
                    <Button
                      hidden={forwardedApplications.length > 0}
                      style={bluePillButton}
                      onClick={applicationsResponse}
                    >
                      Accept Selected Applicants
                    </Button>
                  </Col>
                </Row>
              </div>
            ) : (
              <Row className="mx-5">No New Applications</Row>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerTenantApplications;
