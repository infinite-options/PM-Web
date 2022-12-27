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
import { mediumBold, redPillButton, bluePillButton } from "../../utils/styles";
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
    <div className="mb-2 pb-2">
      {applications.length > 0 ? (
        <div>
          <Row className="m-3 mb-4" style={{ hidden: "overflow" }}>
            <Table
              responsive="md"
              classes={{ root: classes.customTable }}
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    hidden={forwardedApplications.length > 0}
                  ></TableCell>
                  <TableCell align="center">Application Status</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Message</TableCell>
                  <TableCell align="center">Occupants</TableCell>
                  <TableCell align="center">No.of Pets</TableCell>
                  <TableCell align="center">Type of Pets</TableCell>
                  <TableCell align="center">Application Date</TableCell>
                  <TableCell align="center">Documents</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((application, i) => (
                  <TableRow className="mt-2" key={i}>
                    <TableCell
                      align="center"
                      hidden={forwardedApplications.length > 0}
                    >
                      <div>
                        <Checkbox
                          type="BOX"
                          checked={application.application_selected}
                          onClick={() => toggleApplications(application)}
                        />
                      </div>
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => selectTenantApplication(application)}
                    >
                      {application.application_status}
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => selectTenantApplication(application)}
                    >
                      {`${application.tenant_first_name} ${application.tenant_last_name} `}
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => selectTenantApplication(application)}
                    >
                      Note: {application.message}
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => selectTenantApplication(application)}
                    >
                      {application.adult_occupants} adults <br />
                      {application.children_occupants} children
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => selectTenantApplication(application)}
                    >
                      {application.num_pets}
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => selectTenantApplication(application)}
                    >
                      {application.type_pets}
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => selectTenantApplication(application)}
                    >
                      {application.application_date.split(" ")[0]}
                    </TableCell>

                    <TableCell align="center">
                      {application.documents &&
                        application.documents.length > 0 &&
                        JSON.parse(application.documents).map((document, i) => (
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
                        ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Row>

          <Row className="mt-4 d-flex w-100">
            <Col className="d-flex justify-content-evenly">
              <Button
                style={bluePillButton}
                onClick={applicationsResponse}
                hidden={forwardedApplications.length > 0}
              >
                Accept Selected Applicants
              </Button>
            </Col>
            <Col className="d-flex justify-content-evenly">
              <Button
                style={redPillButton}
                onClick={rejectApplication}
                hidden={forwardedApplications.length > 0}
              >
                Reject Application
              </Button>
            </Col>
          </Row>
        </div>
      ) : (
        <Row className="mx-5">No New Applications</Row>
      )}
    </div>
  );
}

export default ManagerTenantApplications;
