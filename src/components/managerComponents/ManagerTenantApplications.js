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
import ConfirmDialog from "../ConfirmDialog";
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
    selectedTenantApplication,
    reload,
  } = props;

  const [applications, setApplications] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newApplications, setNewApplications] = useState([]);
  // const [selectedApplications, setSelectedApplications] = useState([])
  const [forwardedApplications, setForwardedApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);

  const fetchApplications = async () => {
    if (access_token === null) {
      return;
    }
    // console.log("in fetch applicaions");
    const response = await get(
      `/applications?property_uid=${property.property_uid}`
    );
    if (response.msg === "Token has expired") {
      refresh();
      return;
    }
    // console.log(response.result);
    const applications = response.result.map((application) => ({
      ...application,
      application_selected: false,
    }));
    // console.log(applications);
    var resArr = [];
    applications.forEach(function (item) {
      var i = resArr.findIndex(
        (x) => x.application_uid == item.application_uid
      );
      if (i <= -1) {
        resArr.push(item);
      }
    });
    // console.log(resArr);
    setApplications(resArr);
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
    const selected_applications = newApplications.filter(
      (a) => a.application_selected
    );
    if (selected_applications.length === 0) {
      alert("Please select at least one application");
      return;
    }
    const request_body = {
      application_uid: selected_applications[0].application_uid,
      message: "Application has been rejected by the Property Manager",
      application_status: "REJECTED",
    };
    // console.log(request_body)
    const response = await put("/applications", request_body);
    reload();
    setShowDialog(false);
  };
  const onCancel = () => {
    setShowDialog(false);
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
      <ConfirmDialog
        title={"Are you sure you want to reject this application?"}
        isOpen={showDialog}
        onConfirm={rejectApplication}
        onCancel={onCancel}
      />
      {console.log(
        applications.some(
          (app) =>
            app.application_status === "RENTED" ||
            app.application_status === "FORWARDED" ||
            app.application_status === "LEASE EXTENSION" ||
            app.application_status === "TENANT LEASE EXTENSION"
        )
      )}
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
                  {applications.some(
                    (app) =>
                      app.application_status === "RENTED" ||
                      app.application_status === "FORWARDED" ||
                      app.application_status === "LEASE EXTENSION" ||
                      app.application_status === "TENANT LEASE EXTENSION"
                  ) ? (
                    ""
                  ) : (
                    <TableCell align="center"></TableCell>
                  )}

                  <TableCell align="center">Application Status</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Message</TableCell>
                  <TableCell align="center">Adults</TableCell>
                  <TableCell align="center">Children</TableCell>
                  <TableCell align="center">Pets</TableCell>
                  <TableCell align="center">Vehicles</TableCell>
                  <TableCell align="center">referred</TableCell>
                  <TableCell align="center">Application Date</TableCell>
                  <TableCell align="center">Documents</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {applications.map((application, i) => (
                  <TableRow className="mt-2" key={i}>
                    {applications.some(
                      (app) =>
                        app.application_status === "RENTED" ||
                        app.application_status === "FORWARDED" ||
                        app.application_status === "LEASE EXTENSION" ||
                        app.application_status === "TENANT LEASE EXTENSION"
                    ) ? (
                      ""
                    ) : (
                      <TableCell align="center">
                        <div>
                          <Checkbox
                            type="BOX"
                            checked={application.application_selected}
                            onClick={() => toggleApplications(application)}
                          />
                        </div>
                      </TableCell>
                    )}

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
                    {application.adults ? (
                      <TableCell
                        align="center"
                        onClick={() => selectTenantApplication(application)}
                      >
                        {JSON.parse(application.adults).length}
                      </TableCell>
                    ) : (
                      <TableCell
                        align="center"
                        onClick={() => selectTenantApplication(application)}
                      >
                        0
                      </TableCell>
                    )}
                    {application.children ? (
                      <TableCell
                        align="center"
                        onClick={() => selectTenantApplication(application)}
                      >
                        {JSON.parse(application.children).length}
                      </TableCell>
                    ) : (
                      <TableCell
                        align="center"
                        onClick={() => selectTenantApplication(application)}
                      >
                        0
                      </TableCell>
                    )}

                    {application.pets ? (
                      <TableCell
                        align="center"
                        onClick={() => selectTenantApplication(application)}
                      >
                        {JSON.parse(application.pets).length}
                      </TableCell>
                    ) : (
                      <TableCell
                        align="center"
                        onClick={() => selectTenantApplication(application)}
                      >
                        0
                      </TableCell>
                    )}
                    {application.vehicles ? (
                      <TableCell
                        align="center"
                        onClick={() => selectTenantApplication(application)}
                      >
                        {JSON.parse(application.vehicles).length}
                      </TableCell>
                    ) : (
                      <TableCell
                        align="center"
                        onClick={() => selectTenantApplication(application)}
                      >
                        0
                      </TableCell>
                    )}
                    {application.referred ? (
                      <TableCell
                        align="center"
                        onClick={() => selectTenantApplication(application)}
                      >
                        {JSON.parse(application.referred).length}
                      </TableCell>
                    ) : (
                      <TableCell
                        align="center"
                        onClick={() => selectTenantApplication(application)}
                      >
                        0
                      </TableCell>
                    )}
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
                            <h6>{document.description}</h6>
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
                ))}
              </TableBody>
            </Table>
          </Row>

          {applications.some(
            (app) =>
              app.application_status === "RENTED" ||
              app.application_status === "FORWARDED" ||
              app.application_status === "LEASE EXTENSION" ||
              app.application_status === "TENANT LEASE EXTENSION"
          ) ? (
            <Row></Row>
          ) : (
            <Row className="mt-4 d-flex w-100">
              <Col className="d-flex justify-content-evenly">
                <Button
                  style={bluePillButton}
                  onClick={applicationsResponse}
                  // hidden={forwardedApplications.length > 0}
                >
                  Accept Selected Applicants
                </Button>
              </Col>
              <Col className="d-flex justify-content-evenly">
                <Button
                  style={redPillButton}
                  onClick={() => setShowDialog(true)}
                  // hidden={forwardedApplications.length > 0}
                >
                  Reject Application
                </Button>
              </Col>
            </Row>
          )}
        </div>
      ) : (
        <Row className="mx-5">No New Applications</Row>
      )}
    </div>
  );
}

export default ManagerTenantApplications;
