import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Button, Container, Image } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Header from "../Header";
import SideBar from "./SideBar";
import TenantFooter from "./TenantFooter";
import AppContext from "../../AppContext";
import PropertyApplicationView from "./PropertyApplicationView";
import Delete from "../../icons/Delete.svg";
import File from "../../icons/File.svg";
import EditIconNew from "../../icons/EditIconNew.svg";
import { get, put, post } from "../../utils/api";
import {
  bluePillButton,
  greenPill,
  redPillButton,
  mediumBold,
} from "../../utils/styles";
import { ordinal_suffix_of } from "../../utils/helper";
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
function ReviewPropertyLease(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const context = useContext(AppContext);
  const { userData } = context;
  const { access_token, user } = userData;
  const [rentals, setRentals] = useState([]);
  const [rentPayments, setRentPayments] = useState([]);
  const [lease, setLease] = useState([]);
  const property_uid = location.state.property_uid;
  const application_uid = location.state.application_uid;
  const application_status_1 = location.state.application_status_1;
  const application = location.state.application;
  // console.log(application);
  const [properties, setProperties] = useState([]);
  const [images, setImages] = useState({});
  const [showLease, setShowLease] = useState("True");
  const [endLeaseMessage, setEndLeaseMessage] = useState(
    "No message has been set by Tenant."
  );
  const [endEarlyDate, setEndEarlyDate] = useState("");
  const pmMessage = location.state.message;
  const [disableEndLease, setDisable] = useState(false);
  const [within60, setWithin60] = useState(false);
  const [width, setWindowWidth] = useState(0);
  const [tenantExtendLease, setTenantExtendLease] = useState(false);
  const [leaseExtended, setLeaseExtended] = useState(false);
  const [pmExtendLease, setPmExtendLease] = useState(false);
  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };
  const responsive = {
    showSidebar: width > 1023,
  };
  useEffect(() => {
    if (application_status_1 === "LEASE EXTENSION") {
      setPmExtendLease(true);
    }
    if (application_status_1 === "TENANT LEASE EXTENSION") {
      setTenantExtendLease(true);
    }
    const fetchRentals = async () => {
      const response = await get(
        `/leaseTenants?linked_tenant_id=${user.tenant_id[0].tenant_id}`
      );
      // console.log("rentals", response);

      const filteredRentals = [];
      for (let i = 0; i < response.result.length; i++) {
        if (response.result[i].rental_property_id === property_uid) {
          //Should always be no larger than size of 1
          filteredRentals.push(response.result[i]);
        }
      }
      // console.log("required1", filteredRentals);

      if (filteredRentals && filteredRentals.length) {
        const leaseDoc = filteredRentals[0].documents
          ? JSON.parse(filteredRentals[0].documents)
          : [];
        const rentPayments = filteredRentals[0].rent_payments
          ? JSON.parse(filteredRentals[0].rent_payments)
          : [];
        // console.log("payment0", rentPayments);

        setLease(leaseDoc);
        setRentPayments(rentPayments);
        // setRentPayments2(rentPayments2);
      }
      setRentals(filteredRentals);
    };

    if (!rentals) {
      setShowLease("false");
    }
    fetchRentals();
  }, [user]);
  // console.log(rentals);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    const currentYear = new Date().getFullYear();
    let currentDate = new Date(currentYear, currentMonth, currentDay);
    let tempEndEarlyDate = endEarlyDate.split("-");
    let newEndEarlyDate = new Date(
      parseInt(tempEndEarlyDate[0]),
      parseInt(tempEndEarlyDate[1]) - 1,
      parseInt(tempEndEarlyDate[2])
    );
    // console.log(newEndEarlyDate);
    // console.log(currentDate);
    let difference = newEndEarlyDate - currentDate;
    // console.log(difference);
    if (difference < 864000000) {
      setDisable(true);
      // console.log("disabled");
    } else {
      // console.log("enabled");
      setDisable(false);
    }
  }, [endEarlyDate]);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await get(`/propertyInfo?property_uid=${property_uid}`);
      // console.log(response);
      const imageParsed = response.result.length
        ? JSON.parse(response.result[0].images)
        : [];
      setImages(imageParsed);
      setProperties(response.result[0]);
    };
    fetchProperties();
  }, [property_uid]);
  // console.log(properties);

  const approveLease = async () => {
    // console.log("in approvelease", rentals);

    if (rentals.length > 0) {
      // console.log("in approvelease", rentals);
      if (rentals.some((rental) => rental.rental_status === "PROCESSING")) {
        let i = rentals.findIndex(
          (rental) => rental.rental_status === "PROCESSING"
        );
        const updatedApplication = {
          application_uid: application_uid,
          application_status: "RENTED",
          property_uid: property_uid,
        };
        const response2 = await put("/applications", updatedApplication);
        navigate("/tenant");
      } else if (rentals.some((rental) => rental.rental_status === "PENDING")) {
        let i = rentals.findIndex(
          (rental) => rental.rental_status === "PENDING"
        );
        const updateLease = {
          // linked_application_id: application_uid,
          // rental_status: "ACTIVE",
          rental_uid: rentals[i].rental_uid,
          application_uid: application_uid,
          application_status: "RENTED",
          property_uid: rentals[i].rental_property_id,
          message: "Lease extended",
        };
        // console.log("in extendlease", updateLease);
        const response2 = await put("/extendLease", updateLease);
        navigate("/tenant");
      } else if (rentals.some((rental) => rental.rental_status === "ACTIVE")) {
        let i = rentals.findIndex(
          (rental) => rental.rental_status === "ACTIVE"
        );
        const updateLease = {
          linked_application_id: application_uid,
          rental_status: "ACTIVE",
          rental_uid: rentals[i].rental_uid,
        };
        // console.log("in update activr lease", updateLease);
        const response2 = await put("/UpdateActiveLease", updateLease);
        navigate("/tenant");
      }
    }
  };
  const displayLease = (path) => {
    window.location.href = path;
  };

  const extendLease = async () => {
    // console.log("Extending Lease");
    const extendObject = {
      application_uid: application_uid,
      application_status: "LEASE EXTENSION",
      property_uid: rentals[0].rental_property_id,
      message: "requesting EXTENSION",
    };
    const response6 = await put("/extendLease", extendObject, access_token);
    // console.log(response6.result);
    navigate("/tenant");
  };
  const endLeaseEarly = async () => {
    // console.log("ending lease early");
    const currentMonth = new Date().getMonth() + 1;
    const currentDay = new Date().getDate();
    const currentYear = new Date().getFullYear();
    let endDate = `${currentYear}-${currentMonth}-${currentDay}`;

    const updatedRental = {
      application_uid: application_uid,
      application_status: "TENANT END EARLY",
      property_uid: rentals[0].rental_property_id,
      early_end_date: endEarlyDate,
      message: endLeaseMessage,
    };
    // console.log(updatedRental);
    const response3 = await put("/endEarly", updatedRental, access_token);
    // console.log(response3.result);
    navigate("/tenant");
  };
  const approveEndEarly = async () => {
    // console.log("Approved end lease early.");
    const updatedApprove = {
      application_uid: application_uid,
      application_status: "TENANT ENDED",
      property_uid: rentals[0].rental_property_id,
    };
    const response4 = await put("/endEarly", updatedApprove, access_token);
    // console.log(response4.result);
    navigate("/tenant");
  };
  const denyEndEarly = async () => {
    // console.log("Deny end lease early.");
    const updatedApprove = {
      application_status: "REFUSED",
      property_uid: rentals[0].rental_property_id,
    };
    const response5 = await put("/endEarly", updatedApprove, access_token);
    // console.log(response5.result);
    navigate("/tenant");
  };
  const rejectLease = async () => {
    if (rentals.length > 0) {
      console.log("in approvelease", rentals);
      if (rentals.some((rental) => rental.rental_status === "PROCESSING")) {
        let i = rentals.findIndex(
          (rental) => rental.rental_status === "PROCESSING"
        );
        const updatedApplication = {
          application_uid: application_uid,
          application_status: "REFUSED",
          property_uid: property_uid,
        };
        const response2 = await put("/applications", updatedApplication, null);
        navigate("/tenant");
      } else if (rentals.some((rental) => rental.rental_status === "PENDING")) {
        if (rentals.length > 1) {
          let i = rentals.findIndex(
            (rental) => rental.rental_status === "PENDING"
          );
          let request_body = {
            application_status: "REFUSED",
            property_uid: rentals[i].rental_property_id,
          };

          const response = await put("/extendLease", request_body);
        } else {
          let request_body = {
            application_status: "REFUSED",
            property_uid: rentals[0].rental_property_id,
          };

          const response = await put("/extendLease", request_body);
          const updatedApplication = {
            application_uid: application_uid,
            application_status: "REFUSED",
            property_uid: property_uid,
          };
          const response2 = await put(
            "/applications",
            updatedApplication,
            null
          );
        }

        // const newMessage = {
        //   sender_name: property.managerInfo.manager_business_name,
        //   sender_email: property.managerInfo.manager_email,
        //   sender_phone: property.managerInfo.manager_phone_number,
        //   message_subject: "Extend Lease Request Declined",
        //   message_details: "Tenant has refused to extend the lease",
        //   message_created_by: property.managerInfo.manager_id,
        //   user_messaged: property.rentalInfo[0].tenant_id,
        //   message_status: "PENDING",
        //   receiver_email: property.rentalInfo[0].tenant_email,
        // };
        // // console.log(newMessage);
        // const responseMsg = await post("/message", newMessage);
        navigate("/tenant");
      }
    } else {
      const updatedApplication = {
        application_uid: application_uid,
        application_status: "REFUSED",
        property_uid: property_uid,
      };
      const response2 = await put("/applications", updatedApplication, null);
      navigate("/tenant");
    }
  };

  const parseDate = () => {
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    const currentYear = new Date().getFullYear();
    let currentDate = new Date(currentYear, currentMonth, currentDay);
    // console.log(rentals);
    let tempEndDate = rentals.length > 0 ? rentals[0].lease_end : "";
    tempEndDate = tempEndDate.split("-");
    let endDate = new Date(
      parseInt(tempEndDate[0]),
      parseInt(tempEndDate[1]) - 1,
      parseInt(tempEndDate[2])
    );
    let difference = Math.abs(currentDate - endDate);
    // console.log(difference);
    if (difference <= 5184000000) {
      // within60 = true;
      setWithin60(true);
      // console.log(true);
    } else {
      // within60 = false;
      setWithin60(false);
      // console.log(false);
    }
  };

  useEffect(() => {
    parseDate();
  }, [rentals]);

  const fromPage = "homePage";
  const goToApplyToProperty = () => {
    // navigate(`/propertyApplicationView/${property_uid}`,{ state: {from: "homePage"}})
    navigate(`/propertyApplicationView/${property_uid}`, {
      state: { fromPage: fromPage },
    });
  };
  return (
    <div className="w-100 overflow-hidden">
      <div className="flex-1">
        <div
          hidden={!responsive.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </div>
        <div className="w-100 mb-5 overflow-hidden">
          <Header
            title="Property Lease Details"
            leftText="< Back"
            leftFn={() => navigate("/tenant")}
          />
          <div>
            <PropertyApplicationView forPropertyLease="true" />
          </div>
          {/* {console.log(
            "application.applicant_info",
            application.applicant_info
          )} */}

          {application_status_1 === "FORWARDED" ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              {/* {console.log("here forwarded")} */}
              <Row className="m-3">
                <Col>
                  <h3>Application Details</h3>
                </Col>
                <Col xs={2}> </Col>
              </Row>
              {/* {console.log("application", application.applicant_info)} */}
              <Row className="m-3" style={{ overflow: "scroll" }}>
                <Table
                  classes={{ root: classes.customTable }}
                  size="small"
                  responsive="md"
                >
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
                    <TableRow className="mt-2">
                      <TableCell>{application.application_status}</TableCell>
                      <TableCell>
                        {`${application.tenant_first_name} ${application.tenant_last_name} `}
                      </TableCell>
                      <TableCell>Note: {application.message}</TableCell>
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
                      <TableCell>
                        {application.application_date.split(" ")[0]}
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
                            )
                          )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Row>
              <Row className="m-3">
                {application.applicant_info.length > 0
                  ? application.applicant_info.map((applicant) =>
                      applicant.application_uid !==
                      application.application_uid ? (
                        <div>
                          <Row
                            style={{
                              fontWeight: "bold",
                              textAlign: "left",
                              fontSize: "18px",
                              marginLeft: "50px",
                              marginTop: "20px",
                            }}
                          >
                            Co-applicant Details
                          </Row>
                          <Row className="mx-2">
                            <Table
                              classes={{ root: classes.customTable }}
                              size="small"
                              responsive="md"
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center">Name</TableCell>
                                  <TableCell align="center">
                                    Phone Number
                                  </TableCell>
                                  <TableCell align="center">Email</TableCell>

                                  <TableCell align="center">Adults</TableCell>
                                  <TableCell align="center">Children</TableCell>
                                  <TableCell align="center">Pets</TableCell>
                                  <TableCell align="center">Vehicles</TableCell>
                                  <TableCell align="center">
                                    References
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
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
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Row>
                        </div>
                      ) : (
                        ""
                      )
                    )
                  : ""}
              </Row>

              <Row className="m-3">
                <Col>
                  <h3>Lease Agreement</h3>
                </Col>
                <Col xs={2}></Col>
              </Row>
              {rentals && rentals.length ? (
                <Row className="m-3" style={{ overflow: "scroll" }}>
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
                        <TableCell>
                          Late Fees After <br />
                          (days)
                        </TableCell>
                        <TableCell>
                          Late Fee <br />
                          (one-time)
                        </TableCell>
                        <TableCell>
                          Late Fee <br />
                          (per day)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{rentals[0].lease_start}</TableCell>

                        <TableCell>{rentals[0].lease_end}</TableCell>

                        <TableCell>
                          {`${ordinal_suffix_of(
                            rentals[0].due_by
                          )} of the month`}
                        </TableCell>

                        <TableCell>{rentals[0].late_by} days</TableCell>
                        <TableCell> ${rentals[0].late_fee}</TableCell>
                        <TableCell> ${rentals[0].perDay_late_fee}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Row>
              ) : (
                ""
              )}

              {rentPayments && rentPayments.length ? (
                <Row className="m-3" style={{ overflow: "scroll" }}>
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
                        <TableCell>Late After (days)</TableCell>
                        <TableCell>Late Fee(one-time)</TableCell>
                        <TableCell>Late Fee (per day)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rentPayments.map((fee, i) => (
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
                          <TableCell>{`${fee.available_topay} days before`}</TableCell>
                          <TableCell>
                            {fee.frequency === "Weekly" ||
                            fee.frequency === "Biweekly"
                              ? fee.due_by === ""
                                ? `1st day of the week`
                                : `${ordinal_suffix_of(
                                    fee.due_by
                                  )} day of the week`
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
              ) : (
                ""
              )}
            </div>
          ) : application_status_1 === "FORWARDED" ||
            application_status_1 === "RENTED" ||
            application_status_1 === "LEASE EXTENSION" ||
            application_status_1 === "TENANT LEASE EXTENSION" ||
            application_status_1 === "REFUSED" ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="m-3">
                <Col>
                  <h3>Application Details</h3>
                </Col>
                <Col xs={2}> </Col>
              </Row>
              <Row className="m-3" style={{ overflow: "scroll" }}>
                <Table
                  classes={{ root: classes.customTable }}
                  size="small"
                  responsive="md"
                >
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
                    <TableRow className="mt-2">
                      <TableCell>{application.application_status}</TableCell>
                      <TableCell>
                        {`${application.tenant_first_name} ${application.tenant_last_name} `}
                      </TableCell>
                      <TableCell>Note: {application.message}</TableCell>
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
                      <TableCell>
                        {application.application_date.split(" ")[0]}
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
                            )
                          )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Row>

              {application.applicant_info.length > 0
                ? application.applicant_info.map((applicant) =>
                    applicant.application_uid !==
                    application.application_uid ? (
                      <div>
                        <Row
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            fontSize: "18px",
                            marginLeft: "50px",
                            marginTop: "20px",
                          }}
                        >
                          Co-applicant Details
                        </Row>
                        <Row className="mx-2">
                          <Table
                            classes={{ root: classes.customTable }}
                            size="small"
                            responsive="md"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">
                                  Phone Number
                                </TableCell>
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">Adults</TableCell>
                                <TableCell align="center">Children</TableCell>
                                <TableCell align="center">Pets</TableCell>
                                <TableCell align="center">Vehicles</TableCell>
                                <TableCell align="center">References</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
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
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Row>
                      </div>
                    ) : (
                      ""
                    )
                  )
                : ""}
              <Row className="m-3">
                <Col>
                  <h3>Lease Agreement</h3>
                </Col>
                <Col xs={2}></Col>
              </Row>
              {rentals && rentals.length ? (
                <Row className="m-3" style={{ overflow: "scroll" }}>
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
                        <TableCell>
                          Late Fees After
                          <br /> (days)
                        </TableCell>
                        <TableCell>
                          Late Fee
                          <br /> (one-time)
                        </TableCell>
                        <TableCell>
                          Late Fee
                          <br /> (per day)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rentals.map((rental) => {
                        return rental.rental_status === "PROCESSING" ||
                          rental.rental_status === "ACTIVE" ||
                          rental.rental_status === "REFUSED" ? (
                          <TableRow>
                            <TableCell>{rental.lease_start}</TableCell>

                            <TableCell>{rental.lease_end}</TableCell>

                            <TableCell>
                              {`${ordinal_suffix_of(
                                rental.due_by
                              )} of the month`}
                            </TableCell>

                            <TableCell>{rental.late_by} days</TableCell>
                            <TableCell> ${rental.late_fee}</TableCell>
                            <TableCell> ${rental.perDay_late_fee}</TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                    </TableBody>
                  </Table>
                </Row>
              ) : (
                ""
              )}

              {rentPayments && rentPayments.length ? (
                <Row className="m-3" style={{ overflow: "scroll" }}>
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
                        <TableCell>Late After (days)</TableCell>
                        <TableCell>Late Fee(one-time)</TableCell>
                        <TableCell>Late Fee (per day)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rentPayments.map((fee, i) => (
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
                          <TableCell>{`${fee.available_topay} days before`}</TableCell>
                          <TableCell>
                            {fee.frequency === "Weekly" ||
                            fee.frequency === "Biweekly"
                              ? fee.due_by === ""
                                ? `1st day of the week`
                                : `${ordinal_suffix_of(
                                    fee.due_by
                                  )} day of the week`
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
              ) : (
                ""
              )}
            </div>
          ) : application_status_1 === "REJECTED" ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="m-3">
                <Col>
                  <h3>Application Details</h3>
                </Col>
                <Col xs={2}> </Col>
              </Row>
              <Row className="m-3" style={{ overflow: "scroll" }}>
                <Table
                  classes={{ root: classes.customTable }}
                  size="small"
                  responsive="md"
                >
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
                    <TableRow className="mt-2">
                      <TableCell>{application.application_status}</TableCell>
                      <TableCell>
                        {`${application.tenant_first_name} ${application.tenant_last_name} `}
                      </TableCell>
                      <TableCell>Note: {application.message}</TableCell>
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
                      <TableCell>
                        {application.application_date.split(" ")[0]}
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
                            )
                          )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Row>

              {/* {console.log("application", application.applicant_info)} */}
              {application.applicant_info.length > 0
                ? application.applicant_info.map((applicant) =>
                    applicant.application_uid !==
                    application.application_uid ? (
                      <div>
                        <Row
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            fontSize: "18px",
                            marginLeft: "50px",
                            marginTop: "20px",
                          }}
                        >
                          Co-applicant Details
                        </Row>
                        <Row className="mx-2">
                          <Table
                            classes={{ root: classes.customTable }}
                            size="small"
                            responsive="md"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">
                                  Phone Number
                                </TableCell>
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">Adults</TableCell>
                                <TableCell align="center">Children</TableCell>
                                <TableCell align="center">Pets</TableCell>
                                <TableCell align="center">Vehicles</TableCell>
                                <TableCell align="center">References</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
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
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Row>
                      </div>
                    ) : (
                      ""
                    )
                  )
                : ""}
            </div>
          ) : application_status_1 === "NEW" ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="m-3" style={{ overflow: "scroll" }}>
                <Col>
                  <h3>Application Details</h3>
                </Col>
                {application_status_1 === "NEW" ? (
                  <Col xs={2}>
                    {" "}
                    <img
                      src={EditIconNew}
                      alt="Edit Icon"
                      style={{
                        width: "30px",
                        height: "30px",
                        float: "right",
                        marginRight: "5rem",
                      }}
                      onClick={() =>
                        navigate(
                          `/reviewTenantProfileEdit/${application_uid}`,
                          {
                            state: {
                              property_uid: application.property_uid,
                              application: application,
                              application_uid: application.application_uid,
                              application_status_1:
                                application.application_status,
                              message: application.message,
                            },
                          }
                        )
                      }
                    />
                  </Col>
                ) : (
                  <Col xs={2}></Col>
                )}
              </Row>
              <Row className="m-3" style={{ overflow: "scroll" }}>
                <Table
                  classes={{ root: classes.customTable }}
                  size="small"
                  responsive="md"
                >
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
                    <TableRow className="mt-2">
                      <TableCell>{application.application_status}</TableCell>
                      <TableCell>
                        {`${application.tenant_first_name} ${application.tenant_last_name} `}
                      </TableCell>
                      <TableCell>Note: {application.message}</TableCell>
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
                      <TableCell>
                        {application.application_date.split(" ")[0]}
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
                            )
                          )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Row>
              {/* {console.log("application", application.applicant_info)} */}
              {application.applicant_info.length > 0
                ? application.applicant_info.map((applicant) =>
                    applicant.application_uid !==
                    application.application_uid ? (
                      <div>
                        <Row
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            fontSize: "18px",
                            marginLeft: "50px",
                            marginTop: "20px",
                          }}
                        >
                          Co-applicant Details
                        </Row>
                        <Row className="mx-2">
                          <Table
                            classes={{ root: classes.customTable }}
                            size="small"
                            responsive="md"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">
                                  Phone Number
                                </TableCell>
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">Adults</TableCell>
                                <TableCell align="center">Children</TableCell>
                                <TableCell align="center">Pets</TableCell>
                                <TableCell align="center">Vehicles</TableCell>
                                <TableCell align="center">References</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
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
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Row>
                      </div>
                    ) : (
                      ""
                    )
                  )
                : ""}
            </div>
          ) : (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="m-3 text-align-center">
                <h3>No Lease Information Available at this time</h3>
              </Row>
            </div>
          )}
          {application_status_1 === "LEASE EXTENSION" ||
          application_status_1 === "TENANT LEASE EXTENSION" ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="m-3">
                <Col>
                  <h3>New Lease Agreement</h3>
                </Col>
                <Col xs={2}></Col>
              </Row>
              {rentals && rentals.length > 1 ? (
                <Row className="m-3" style={{ overflow: "scroll" }}>
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
                        <TableCell>
                          Late Fees After <br />
                          (days)
                        </TableCell>
                        <TableCell>
                          Late Fee <br />
                          (one-time)
                        </TableCell>
                        <TableCell>
                          Late Fee <br />
                          (per day)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rentals.map((rental) => {
                        return rental.rental_status === "PENDING" ? (
                          <TableRow>
                            <TableCell>{rental.lease_start}</TableCell>

                            <TableCell>{rental.lease_end}</TableCell>

                            <TableCell>
                              {`${ordinal_suffix_of(
                                rental.due_by
                              )} of the month`}
                            </TableCell>

                            <TableCell>{rental.late_by} days</TableCell>
                            <TableCell> ${rental.late_fee}</TableCell>
                            <TableCell> ${rental.perDay_late_fee}</TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                    </TableBody>
                  </Table>
                </Row>
              ) : (
                ""
              )}

              {rentals && rentals.length > 1 ? (
                <Row className="m-3" style={{ overflow: "scroll" }}>
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
                        <TableCell>Late After (days)</TableCell>
                        <TableCell>Late Fee(one-time)</TableCell>
                        <TableCell>Late Fee (per day)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rentals.map((rental) => {
                        return rental.rental_status === "PENDING"
                          ? JSON.parse(rental.rent_payments).map((fee, i) => {
                              return (
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
                                  <TableCell>{`${fee.available_topay} days before`}</TableCell>
                                  <TableCell>
                                    {fee.frequency === "Weekly" ||
                                    fee.frequency === "Biweekly"
                                      ? fee.due_by === ""
                                        ? `1st day of the week`
                                        : `${ordinal_suffix_of(
                                            fee.due_by
                                          )} day of the week`
                                      : fee.due_by === ""
                                      ? `1st of the month`
                                      : `${ordinal_suffix_of(
                                          fee.due_by
                                        )} of the month`}
                                  </TableCell>
                                  <TableCell>{fee.late_by} days</TableCell>
                                  <TableCell>${fee.late_fee}</TableCell>
                                  <TableCell>
                                    ${fee.perDay_late_fee}/day
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          : "";
                      })}
                    </TableBody>
                  </Table>
                </Row>
              ) : (
                ""
              )}
              {tenantExtendLease ? (
                <div className="my-4">
                  <h5 style={mediumBold}>
                    You requested to extend the lease. Further Information to
                    extend your current lease will require approval from your
                    property manager.
                  </h5>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            <div></div>
          )}

          {/* ==================< Lease Documents >=======================================  */}
          {(application_status_1 === "FORWARDED" ||
            application_status_1 === "RENTED") &&
          lease.length ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="m-3" style={{ overflow: "scroll" }}>
                <Col>
                  <h3> Lease Documents </h3>
                </Col>
                <Col xs={2}> </Col>
              </Row>

              {/* <div style={{marginTop:"40px",paddingLeft:"20px",fontWeight:"bold"}} > Documents</div> */}
              <Row className="m-3" style={{ overflow: "scroll" }}>
                <Table
                  responsive="md"
                  classes={{ root: classes.customTable }}
                  size="small"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>View</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lease.map((lease, i) => (
                      <TableRow>
                        <TableCell>
                          {lease.description == ""
                            ? lease.name
                            : lease.description}
                        </TableCell>
                        <TableCell>
                          <a href={lease.link} target="_blank" rel="noreferrer">
                            <img
                              src={File}
                              alt="open document"
                              style={{
                                width: "20px",
                                height: "20px",
                              }}
                            />
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Row>
            </div>
          ) : (application_status_1 === "FORWARDED" ||
              application_status_1 === "RENTED") &&
            !lease.length ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="m-3" style={{ overflow: "scroll" }}>
                <Col>
                  <h3> Lease Documents </h3>
                </Col>
                <Col xs={2}> </Col>
              </Row>
              <h6 style={{ paddingLeft: "45px", paddingBottom: "30px" }}>
                {" "}
                Property Manager is yet to upload the lease document. Please
                contact them{" "}
              </h6>
            </div>
          ) : application_status_1 === "REFUSED" ||
            application_status_1 === "NEW" ? (
            ""
          ) : (
            ""
          )}

          {/* ========= Extend Lease Stuff ========= */}
          {application_status_1 === "RENTED" && within60 === true ? (
            <Col>
              <p
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  fontSize: "24px",
                  marginLeft: "20px",
                }}
              >
                <u>Extend Lease:</u>
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  fontSize: "14px",
                  marginLeft: "40px",
                  marginRight: "20px",
                }}
              >
                Option to extend your current lease. Will require approval from
                your property manager.
              </p>
              <Col
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  paddingBottom: "15px",
                }}
              >
                <Button
                  style={{
                    backgroundColor: "#3DB727",
                    borderColor: "#3DB727",
                    color: "white",
                    fontSize: "large",
                    borderRadius: "50px",
                    padding: "2px 7px",
                  }}
                  onClick={extendLease}
                >
                  Extend Lease
                </Button>
              </Col>
            </Col>
          ) : application_status_1 === "RENTED" ? (
            <Col>
              <p
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  fontSize: "24px",
                  marginLeft: "20px",
                }}
              >
                <u>Extend Lease:</u>
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  fontSize: "14px",
                  marginLeft: "40px",
                  marginRight: "20px",
                }}
              >
                You may not extend your lease until your lease is within 60 days
                of the end lease.
              </p>
            </Col>
          ) : (
            <Col></Col>
          )}
          {/* ========== End Lease Early Button ========== */}
          {application_status_1 === "RENTED" ? (
            <Col>
              <p
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  fontSize: "24px",
                  marginLeft: "20px",
                }}
              >
                <u>End Lease Early:</u>
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  fontSize: "14px",
                  marginLeft: "40px",
                  marginRight: "20px",
                }}
              >
                Please Select an end early date. (Minimum: 10 days)
              </p>
              <input
                type="date"
                style={{ width: "80%", margin: "2% 10%" }}
                onChange={(e) => {
                  // console.log(e.target.value);
                  setEndEarlyDate(e.target.value);
                }}
              ></input>
              <p
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  fontSize: "14px",
                  marginLeft: "40px",
                  marginRight: "20px",
                }}
              >
                Please leave a short message dicussing why you wish to end the
                lease early.
              </p>
              <input
                type="text"
                style={{ width: "80%", margin: "0% 10% 5% 10%" }}
                onChange={(e) => {
                  setEndLeaseMessage(e.target.value);
                }}
              ></input>
            </Col>
          ) : null}
          {application_status_1 === "RENTED" ? (
            <Col
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                paddingBottom: "15px",
              }}
            >
              {disableEndLease ? (
                <button disabled style={redPillButton} onClick={endLeaseEarly}>
                  End Lease
                </button>
              ) : (
                <button style={greenPill} onClick={endLeaseEarly}>
                  End Lease
                </button>
              )}
            </Col>
          ) : null}

          {/* ========== Property Manager requests lease end early ========== */}
          {application_status_1 === "PM END EARLY" ? (
            <Row>
              <b style={{ padding: "0px 40px 0px 40px", fontSize: "22px" }}>
                <u>Action Needed: Approve/Deny</u>
              </b>
              <Row
                className="my-3 mx-2"
                style={{ padding: "0px 40px 0px 40px", fontSize: "22px" }}
              >
                <p style={{ fontSize: "16px" }}>
                  The Property Manager has requested to terminate this lease
                  early and has left a message:
                </p>
                <p style={{ fontSize: "16px" }}>{pmMessage}</p>
              </Row>
              <Row
                style={{
                  margin: "0px",
                  padding: "0px 0px 25px 0px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  paddingBottom: "20px",
                }}
              >
                <Button
                  style={{
                    ...bluePillButton,
                    width: "90px",
                    textAlign: "center",
                  }}
                  onClick={approveEndEarly}
                >
                  Approve
                </Button>
                <Button
                  style={{
                    ...redPillButton,
                    width: "90px",
                    textAlign: "center",
                  }}
                  onClick={denyEndEarly}
                >
                  Deny
                </Button>
              </Row>
            </Row>
          ) : null}
          {/* ========== Tenant has requested to end the lease early ==========
          {application_status_1 === "TENANT END EARLY" ? 
            <Row>
              <Row
                className="my-3 mx-2"
                style={{padding: '0px 40px 0px 40px', fontSize: '22px'}}
              >
                <b>Action Needed: Approve/Deny</b>
                <p style={{fontSize: '16px'}}>The Property Manager has requested to terminate this lease early</p>
              </Row>
              <Row
                style={{
                  margin: "0px",
                  padding: "0px 0px 25px 0px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  paddingBottom: '20px'
                }}
                >
                <Button 
                  style={{...bluePillButton, width: "90px", textAlign: 'center'}}
                  onClick={approveEndEarly}
                >
                  Approve
                </Button>
                <Button
                  style={{...redPillButton, width: "90px", textAlign: 'center'}}
                  onClick={denyEndEarly}
                >
                  Deny
                </Button>
              </Row>
            </Row>: null
          } */}

          {application_status_1 === "END EARLY" &&
          rentals[0].early_end_date !== null ? (
            <Row>
              <Row
                className="my-3 mx-2"
                style={{ padding: "0px 40px 0px 40px", fontSize: "22px" }}
              >
                <b>Announcement:</b>
                <p style={{ fontSize: "16px" }}>
                  This property is set to have its lease ended on{" "}
                  {rentals[0].early_end_date}
                </p>
              </Row>
            </Row>
          ) : null}

          {application_status_1 === "TENANT END EARLY" &&
          rentals[0].early_end_date !== null ? (
            <Row>
              <Row
                className="my-3 mx-2"
                style={{ padding: "0px 40px 0px 40px", fontSize: "22px" }}
              >
                <b>Announcement:</b>
                <p style={{ fontSize: "16px" }}>
                  The tenant has requested a lease termination effective on{" "}
                  {rentals[0].early_end_date}
                </p>
              </Row>
            </Row>
          ) : null}
          {application_status_1 === "LEASE EXTENSION" ? (
            <Row>
              <Row
                className="my-3 mx-2"
                style={{ padding: "0px 40px 0px 40px", fontSize: "22px" }}
              >
                <b>Announcement:</b>
                <p style={{ fontSize: "16px" }}>
                  The tenant has requested to extend the lease. Waiting for the
                  approval from the Property Manager.
                </p>
              </Row>
            </Row>
          ) : null}

          {/* ==================< Approval|Disapprove buttons >=======================================  */}
          <Row className="mt-4">
            {application_status_1 === "FORWARDED" ||
            application_status_1 === "LEASE EXTENSION" ||
            application_status_1 === "TENANT LEASE EXTENSION" ? (
              <Col
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginBottom: "25px",
                }}
              >
                {" "}
                <Button
                  onClick={approveLease}
                  variant="outline-primary"
                  style={bluePillButton}
                >
                  Approve
                </Button>
              </Col>
            ) : (
              ""
            )}

            {application_status_1 === "FORWARDED" ||
            application_status_1 === "NEW" ||
            application_status_1 === "LEASE EXTENSION" ||
            application_status_1 === "TENANT LEASE EXTENSION" ? (
              <Col
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginBottom: "25px",
                }}
              >
                {" "}
                <Button
                  onClick={rejectLease}
                  variant="outline-primary"
                  style={redPillButton}
                >
                  Reject
                </Button>
              </Col>
            ) : (
              ""
            )}

            {application_status_1 === "REFUSED" ? (
              <Col
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginBottom: "25px",
                }}
              >
                {" "}
                <Button
                  onClick={goToApplyToProperty}
                  variant="outline-primary"
                  style={bluePillButton}
                >
                  Reapply
                </Button>
              </Col>
            ) : (
              ""
            )}
          </Row>
          <div hidden={responsive.showSidebar} className="w-100 mt-3">
            <TenantFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewPropertyLease;
