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
import * as ReactBootStrap from "react-bootstrap";
import AppContext from "../../AppContext";
import Checkbox from "../Checkbox";
import ConfirmDialog from "../ConfirmDialog";
import File from "../../icons/File.svg";
import { mediumBold, redPillButton, bluePillButton } from "../../utils/styles";
import { get, put } from "../../utils/api";
import { days } from "../../utils/helper";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "2px 2px",
      border: "0.5px solid grey ",
      wordBreak: "break-word",
    },
    width: "100%",
    tableLayout: "fixed",
  },
});
function ManagerTenantApplications(props) {
  const classes = useStyles();
  const { userData, refresh, ably } = useContext(AppContext);
  const { access_token } = userData;
  const {
    property,
    createNewTenantAgreement,
    selectTenantApplication,
    selectedTenantApplication,
    agreement,
    reload,
  } = props;

  // console.log(selectedTenantApplication);
  const [applications, setApplications] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  const channel_application = ably.channels.get("application_status");
  const [isLoading, setIsLoading] = useState(true);
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

    setApplications(resArr);

    setIsLoading(false);
  };

  useEffect(fetchApplications, [property]);

  const rejectApplication = async (application) => {
    // const selected_applications = newApplications.filter(
    //   (a) => a.application_selected
    // );
    const selected_applications = applications.filter(
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
    channel_application.publish({ data: { te: request_body } });
    reload();
    setShowDialog(false);
  };
  const onCancel = () => {
    setShowDialog(false);
  };
  const rejectdialog = (application) => {
    // const selected_applications = newApplications.filter(
    //   (a) => a.application_selected
    // );
    const selected_applications = applications.filter(
      (a) => a.application_selected
    );
    if (selected_applications.length === 0) {
      alert("Please select at least one application");
      return;
    }
    setShowDialog(true);
  };
  const toggleApplications = (application) => {
    const selected = [...applications];
    const index = selected.findIndex(
      (a) => a.application_uid === application.application_uid
    );
    selected[index].application_selected =
      !selected[index].application_selected;
    // setNewApplications(selected);
    setApplications(selected);
  };

  const applicationsResponse = async () => {
    // const selected_applications = newApplications.filter(
    //   (a) => a.application_selected
    // );
    const selected_applications = applications.filter(
      (a) => a.application_selected
    );
    if (selected_applications.length === 0) {
      alert("Please select at least one application");
      return;
    }

    createNewTenantAgreement(selected_applications);
  };
  window.addEventListener("load", function () {
    // does the actual opening
    function openWindow(event) {
      event = event || window.event;

      // find the url and title to set
      var href = this.getAttribute("href");
      var newTitle = this.getAttribute("data-title");
      // or if you work the title out some other way...
      // var newTitle = "Some constant string";

      // open the window
      var newWin = window.open(href, "_blank");

      // add a load listener to the window so that the title gets changed on page load
      newWin.addEventListener("load", function () {
        newWin.document.title = newTitle;
      });

      // stop the default `a` link or you will get 2 new windows!
      event.returnValue = false;
    }

    // find all a tags opening in a new window
    var links = document.querySelectorAll("a[target=_blank][data-title]");
    // or this if you don't want to store custom titles with each link
    //var links = document.querySelectorAll("a[target=_blank]");

    // add a click event for each so we can do our own thing
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", openWindow.bind(links[i]));
    }
  });
  return (
    <div className="mb-2 pb-2">
      <ConfirmDialog
        title={"Are you sure you want to reject this application?"}
        isOpen={showDialog}
        onConfirm={rejectApplication}
        onCancel={onCancel}
      />

      {applications.length > 0 ? (
        <div>
          <Row className="mx-3 mb-4" style={{ overflow: "scroll" }}>
            <Table
              responsive="md"
              classes={{ root: classes.customTable }}
              size="small"
            >
              <TableHead>
                <TableRow>
                  {applications.some(
                    (app) =>
                      (app.application_status === "RENTED" ||
                        app.application_status === "FORWARDED" ||
                        app.application_status === "LEASE EXTENSION" ||
                        app.application_status === "TENANT LEASE EXTENSION") &&
                      agreement !== null &&
                      days(new Date(agreement.lease_end), new Date()) > 60
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
                  <TableCell align="center">References</TableCell>
                  <TableCell align="center">Application Date</TableCell>
                  <TableCell align="center">Documents</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {applications.map((application, i) => (
                  <TableRow className="mt-2" key={i}>
                    {applications.some(
                      (app) =>
                        (app.application_status === "RENTED" ||
                          app.application_status === "FORWARDED" ||
                          app.application_status === "LEASE EXTENSION" ||
                          app.application_status ===
                            "TENANT LEASE EXTENSION") &&
                        agreement !== null &&
                        days(new Date(agreement.lease_end), new Date()) > 60
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
                            <h6>
                              {document.description == ""
                                ? document.name
                                : document.description}
                              <a
                                href={document.link}
                                target="_blank"
                                rel="noreferrer"
                                data-title={document.description}
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
                            </h6>
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
              (app.application_status === "RENTED" ||
                app.application_status === "FORWARDED" ||
                app.application_status === "LEASE EXTENSION" ||
                app.application_status === "TENANT LEASE EXTENSION") &&
              agreement !== null &&
              days(new Date(agreement.lease_end), new Date()) > 60
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
                  onClick={rejectdialog}
                  // hidden={forwardedApplications.length > 0}
                >
                  Reject Application
                </Button>
              </Col>
            </Row>
          )}
        </div>
      ) : !isLoading ? (
        <Row className="mx-5">No New Applications</Row>
      ) : (
        <ReactBootStrap.Spinner animation="border" role="status" />
      )}
    </div>
  );
}

export default ManagerTenantApplications;
