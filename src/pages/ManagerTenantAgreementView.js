import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../components/Header";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import OpenDoc from "../icons/OpenDoc.svg";
import { put, post, get } from "../utils/api";
import {
  small,
  smallImg,
  red,
  squareForm,
  mediumBold,
  smallPillButton,
  bluePillButton,
  redPillButton,
  pillButton,
  gray,
} from "../utils/styles";

function ManagerTenantAgreementView(props) {
  const {
    back,
    property,
    renewLease,
    selectedAgreement,
    acceptedTenantApplications,
    setAcceptedTenantApplications,
  } = props;

  const [tenantID, setTenantID] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [feeState, setFeeState] = React.useState([]);
  const [contactState, setContactState] = React.useState([]);
  const [files, setFiles] = React.useState([]);

  const [dueDate, setDueDate] = React.useState("1");
  const [lateAfter, setLateAfter] = React.useState("");
  const [lateFee, setLateFee] = React.useState("");
  const [lateFeePer, setLateFeePer] = React.useState("");

  const [available, setAvailable] = React.useState("");
  // const [renewLease, setRenewLease] = React.useState(false)
  const [terminateLease, setTerminateLease] = React.useState(false);
  const [lastDate, setLastDate] = React.useState("");
  const [tenantEndEarly, setTenantEndEarly] = React.useState(false);
  const [agreements, setAgreements] = React.useState([]);
  const [agreement, setAgreement] = React.useState([]);

  const loadAgreement = (agreement) => {
    // console.log(agreement)
    // console.log(contactState)
    // console.log(typeof contactState)
    setTenantID(agreement.tenant_id);
    setStartDate(agreement.lease_start);
    setEndDate(agreement.lease_end);
    setFeeState(JSON.parse(agreement.rent_payments));
    // contactState[1](JSON.parse(agreement.assigned_contacts));
    setContactState(JSON.parse(agreement.assigned_contacts));
    setFiles(JSON.parse(agreement.documents));
    setAvailable(agreement.available_topay);
    setDueDate(agreement.due_by);
    setLateAfter(agreement.late_by);
    setLateFee(agreement.late_fee);
    setLateFeePer(agreement.perDay_late_fee);

    let app = property.applications.filter(
      (a) => a.application_status === "TENANT END EARLY"
    );
    if (app.length > 0) {
      setTenantEndEarly(true);
    }
  };
  React.useEffect(async () => {
    // if (agreement) {
    //   loadAgreement();
    // }
    // const response = await get(
    //   `/rentals?rental_property_id=${property.property_uid}`
    // );
    // setAgreements(response.result);
    // let agreement = response.result[0];
    // console.log(agreement);
    // setAgreement(agreement);
    setAgreement(selectedAgreement);
    loadAgreement(selectedAgreement);
    console.log(selectedAgreement);
  }, []);
  console.log(agreement);

  const [errorMessage, setErrorMessage] = React.useState("");
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
  console.log(agreement, acceptedTenantApplications);
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
    <div className="mb-2 pb-2">
      {agreement ? (
        <Container>
          <Row className="d-flex my-2">
            <Col className="d-flex justify-content-start">
              Tenant: {agreement.tenant_first_name} {agreement.tenant_last_name}
            </Col>
            <Col className="d-flex justify-content-end">
              <a href={`tel:${agreement.tenant_phone_number}`}>
                <img src={Phone} alt="Phone" style={smallImg} />
              </a>
              <a href={`mailto:${agreement.tenant_email}`}>
                <img src={Message} alt="Message" style={smallImg} />
              </a>
            </Col>
          </Row>
          <Row className="my-4">
            <h6 style={mediumBold}>Rent Payments</h6>
            {feeState.map((fee, i) => (
              <Row key={i}>
                <Col className="d-flex justify-content-start">
                  <h6 className="mb-1">{fee.fee_name}</h6>
                </Col>
                <Col className="d-flex justify-content-end">
                  <h6
                    style={{
                      font: "normal normal normal 16px Bahnschrift-Regular",
                    }}
                    className="mb-1"
                  >
                    {fee.fee_type === "%"
                      ? `${fee.charge}% of ${fee.of}`
                      : `$${fee.charge}`}{" "}
                    {fee.frequency}
                  </h6>
                </Col>
              </Row>
            ))}
          </Row>
          <Row className="my-3">
            <h6 style={mediumBold}>Lease Length</h6>
            <Row>
              <Col className="d-flex justify-content-start flex-column">
                <h6>Lease Start Date</h6>
                <h6>Lease End Date</h6>
                <h6>Rent Due</h6>
                <h6>Late After</h6>
                <h6>Late Fee</h6>
                <h6>Per Day Late Fee</h6>
              </Col>
              <Col className="d-flex flex-column ">
                <h6
                  className="d-flex justify-content-end"
                  style={{
                    font: "normal normal normal 16px Bahnschrift-Regular",
                  }}
                >
                  {agreement.lease_start}
                </h6>

                <h6
                  className="d-flex justify-content-end"
                  style={{
                    font: "normal normal normal 16px Bahnschrift-Regular",
                  }}
                >
                  {agreement.lease_end}
                </h6>
                <h6
                  className="d-flex justify-content-end"
                  style={{
                    font: "normal normal normal 16px Bahnschrift-Regular",
                  }}
                >
                  {`${ordinal_suffix_of(dueDate)} of the month`}
                </h6>
                <h6
                  className="d-flex justify-content-end"
                  style={{
                    font: "normal normal normal 16px Bahnschrift-Regular",
                  }}
                >
                  {lateAfter} days
                </h6>
                <h6
                  className="d-flex justify-content-end"
                  style={{
                    font: "normal normal normal 16px Bahnschrift-Regular",
                  }}
                >
                  ${lateFee}.00
                </h6>
                <h6
                  className="d-flex justify-content-end"
                  style={{
                    font: "normal normal normal 16px Bahnschrift-Regular",
                  }}
                >
                  ${lateFeePer}.00
                </h6>
              </Col>
            </Row>
          </Row>

          <Row className="mb-4" hidden={contactState.length === 0}>
            <h5 style={mediumBold}>Contact Details</h5>
            {contactState.map((contact, i) => (
              <Row key={i}>
                <h6 className="d-flex mb-1">
                  {contact.first_name} {contact.last_name} (
                  {contact.company_role})
                </h6>
              </Row>
            ))}
          </Row>
          <Row>
            <h5 style={mediumBold}>Lease Documents</h5>
          </Row>
          <Row
            className="d-flex justify-content-center m-2"
            hidden={files.length === 0}
          >
            {files.map((file, i) => (
              <Row
                key={i}
                className="d-flex align-items-center p-2"
                style={{
                  boxShadow: "0px 1px 6px #00000029",
                  borderRadius: "5px",
                }}
              >
                <Col>
                  <h6
                    className=" d-flex align-items-left"
                    style={{
                      font: "normal normal 600 18px Bahnschrift-Regular",
                      color: "#007AFF",
                      textDecoration: "underline",
                    }}
                  >
                    {file.description}
                  </h6>
                </Col>

                <Col className="d-flex justify-content-end">
                  <a href={file.link} target="_blank">
                    <img src={OpenDoc} />
                  </a>
                </Col>
              </Row>
            ))}
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
        </Container>
      ) : (
        "No Active Lease Agreements"
      )}
    </div>
  );
}

export default ManagerTenantAgreementView;
