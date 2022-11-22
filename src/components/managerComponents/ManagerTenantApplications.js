import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import AppContext from "../../AppContext";
import Checkbox from "../Checkbox";
import BlueArrowUp from "../../icons/BlueArrowUp.svg";
import BlueArrowDown from "../../icons/BlueArrowDown.svg";
import File from "../../icons/File.svg";
import {
  mediumBold,
  headings,
  subText,
  bluePillButton,
  underline,
} from "../../utils/styles";
import { get, put } from "../../utils/api";

function ManagerTenantApplications(props) {
  const { userData, refresh } = React.useContext(AppContext);
  const { access_token } = userData;
  const { property, createNewTenantAgreement, selectTenantApplication } = props;
  const [applications, setApplications] = React.useState([]);
  const [newApplications, setNewApplications] = React.useState([]);
  // const [selectedApplications, setSelectedApplications] = React.useState([])
  const [forwardedApplications, setForwardedApplications] = React.useState([]);
  const [rejectedApplications, setRejectedApplications] = React.useState([]);

  const fetchApplications = async () => {
    if (access_token === null) {
      return;
    }

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
      applications.filter((a) => a.application_status.toUpperCase() === "NEW")
    );
    setForwardedApplications(
      applications.filter(
        (a) => a.application_status.toUpperCase() === "FORWARDED"
      )
    );
    setRejectedApplications(
      applications.filter(
        (a) => a.application_status.toUpperCase() === "REJECTED"
      )
    );
  };

  React.useEffect(fetchApplications, [property]);

  // const toggleApplications = (index) => {
  //     const selected = [...applications];
  //     selected[index].application_selected = !selected[index].application_selected;
  //     setApplications(selected);
  // }

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
                <div className="d-flex w-100 flex-column">
                  {forwardedApplications.length > 0 && (
                    <div className="">
                      <h3 style={{ color: "#3DB727" }}>Forwarded</h3>
                      {forwardedApplications.map((application, i) => (
                        <Row key={i} className="mt-2">
                          <Col xs={2} className="mt-2">
                            <Row></Row>
                          </Col>
                          <Col>
                            <Row
                              style={headings}
                              onClick={() =>
                                selectTenantApplication(application)
                              }
                            >
                              {`${application.tenant_first_name} ${application.tenant_last_name} (${application.tenant_id})`}
                            </Row>
                            <Row style={subText}>
                              Note: {application.message}
                            </Row>
                          </Col>
                        </Row>
                      ))}
                    </div>
                  )}

                  {rejectedApplications.length > 0 && (
                    <div className="mt-4">
                      <h3 style={{ color: "#E3441F" }}>Rejected</h3>
                      {rejectedApplications.map((application, i) => (
                        <Row key={i} className="mt-2">
                          <Col xs={2} className="mt-2">
                            <Row></Row>
                          </Col>
                          <Col>
                            <Row
                              style={headings}
                              onClick={() =>
                                selectTenantApplication(application)
                              }
                            >
                              {`${application.tenant_first_name} ${application.tenant_last_name} (${application.tenant_id})`}
                            </Row>
                            <Row style={subText}>
                              Note: {application.message}
                            </Row>
                          </Col>
                        </Row>
                      ))}
                    </div>
                  )}

                  {newApplications.length > 0 && (
                    <div className="mt-4 ">
                      <h3 style={{ color: "#007AFF" }}>New</h3>
                      {newApplications.map((application, i) => (
                        <Row className="mt-2" key={i}>
                          <Col xs={2} className="mt-2">
                            <Row>
                              <Checkbox
                                type="BOX"
                                checked={application.application_selected}
                                onClick={() => toggleApplications(application)}
                                hidden={forwardedApplications.length > 0}
                              />
                            </Row>
                          </Col>
                          <Col>
                            <Row
                              style={headings}
                              onClick={() =>
                                selectTenantApplication(application)
                              }
                            >
                              {`${application.tenant_first_name} ${application.tenant_last_name} (${application.tenant_id})`}
                            </Row>
                            <Row style={subText}>
                              Note: {application.message}
                            </Row>
                            <Row>
                              {application.documents &&
                                application.documents.length > 0 &&
                                JSON.parse(application.documents).map(
                                  (document, i) => (
                                    <div
                                      className="d-flex justify-content-between align-items-end ps-0"
                                      key={i}
                                    >
                                      <h6 style={mediumBold}>
                                        {document.name}
                                      </h6>
                                      <a href={document.link} target="_blank">
                                        <img src={File} alt="Document" />
                                      </a>
                                    </div>
                                  )
                                )}
                            </Row>
                          </Col>
                        </Row>
                      ))}
                    </div>
                  )}
                </div>
                {console.log(forwardedApplications.length > 0)}
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
