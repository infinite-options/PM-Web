import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { Row, Col, Button, Container, Image } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableSortLabel,
  Box,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Header from "../Header";
import SideBar from "./SideBar";
import TenantFooter from "./TenantFooter";
import AppContext from "../../AppContext";
import PropertyApplicationView from "./PropertyApplicationView";
import No_Image from "../../icons/No_Image_Available.jpeg";
import { bluePillButton, greenPill, redPillButton } from "../../utils/styles";
import { get, put } from "../../utils/api";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
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
    const fetchRentals = async () => {
      const response = await get(
        `/leaseTenants?linked_tenant_id=${user.user_uid}`
      );
      console.log("rentals", response);

      const filteredRentals = [];
      for (let i = 0; i < response.result.length; i++) {
        if (response.result[i].rental_property_id === property_uid) {
          //Should always be no larger than size of 1
          filteredRentals.push(response.result[i]);
        }
      }
      console.log("required1", filteredRentals);

      if (filteredRentals && filteredRentals.length) {
        const leaseDoc = filteredRentals[0].documents
          ? JSON.parse(filteredRentals[0].documents)
          : [];
        const rentPayments = filteredRentals[0].rent_payments
          ? JSON.parse(filteredRentals[0].rent_payments)
          : [];
        console.log("payment0", rentPayments);

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
    console.log(newEndEarlyDate);
    console.log(currentDate);
    let difference = newEndEarlyDate - currentDate;
    console.log(difference);
    if (difference < 864000000) {
      setDisable(true);
      console.log("disabled");
    } else {
      console.log("enabled");
      setDisable(false);
    }
  }, [endEarlyDate]);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await get(`/propertyInfo?property_uid=${property_uid}`);
      console.log(response);
      const imageParsed = response.result.length
        ? JSON.parse(response.result[0].images)
        : [];
      setImages(imageParsed);
      setProperties(response.result);
    };
    fetchProperties();
  }, [property_uid]);
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
  const approveLease = async () => {
    const updatedApplication = {
      application_uid: application_uid,
      application_status: "RENTED",
      property_uid: property_uid,
    };
    const response2 = await put(
      "/applications",
      updatedApplication,
      access_token
    );

    navigate("/tenant");
  };

  const displayLease = (path) => {
    window.location.href = path;
  };

  const extendLease = async () => {
    console.log("Extending Lease");
    const extendObject = {
      application_uid: application_uid,
      application_status: "LEASE EXTENSION",
      property_uid: rentals[0].rental_property_id,
      message: "requesting EXTENSION",
    };
    const response6 = await put("/extendLease", extendObject, access_token);
    console.log(response6.result);
    navigate("/tenant");
  };
  const endLeaseEarly = async () => {
    console.log("ending lease early");
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
    console.log(updatedRental);
    const response3 = await put("/endEarly", updatedRental, access_token);
    console.log(response3.result);
    navigate("/tenant");
  };
  const approveEndEarly = async () => {
    console.log("Approved end lease early.");
    const updatedApprove = {
      application_uid: application_uid,
      application_status: "TENANT ENDED",
      property_uid: rentals[0].rental_property_id,
    };
    const response4 = await put("/endEarly", updatedApprove, access_token);
    console.log(response4.result);
    navigate("/tenant");
  };
  const denyEndEarly = async () => {
    console.log("Deny end lease early.");
    const updatedApprove = {
      application_status: "REFUSED",
      property_uid: rentals[0].rental_property_id,
    };
    const response5 = await put("/endEarly", updatedApprove, access_token);
    console.log(response5.result);
    navigate("/tenant");
  };
  const rejectLease = async () => {
    // const updatedRental = {
    //   // rental_uid: filteredRentals[0].rental_uid,
    //   rental_uid: rentals[0].rental_uid,
    //   rental_status: "REFUSED",
    // };
    // const response = await put("/rentals", updatedRental, null, []);
    const updatedApplication = {
      application_uid: application_uid,
      application_status: "REFUSED",
      property_uid: property_uid,
    };
    const response2 = await put(
      "/applications",
      updatedApplication,
      access_token
    );
    navigate("/tenant");
  };

  const parseDate = () => {
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    const currentYear = new Date().getFullYear();
    let currentDate = new Date(currentYear, currentMonth, currentDay);
    console.log(rentals);
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
      console.log(true);
    } else {
      // within60 = false;
      setWithin60(false);
      console.log(false);
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
  console.log("reviewPropertyLease", rentals, rentPayments);
  return (
    <div className="w-100 overflow-hidden">
      {/* ==================< Header >=======================================  */}
      {/* <Header title="Property Lease Details" /> */}
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
        <div className="w-100 mb-5">
          <Header
            title="Property Lease Details"
            leftText="< Back"
            leftFn={() => navigate("/tenant")}
          />

          <PropertyApplicationView forPropertyLease="true" />

          {application_status_1 === "FORWARDED" ||
          application_status_1 === "RENTED" ? (
            <div className="m-3">
              <Row className="m-3">
                <Col>
                  <h3>Lease Agreement</h3>
                </Col>
                <Col xs={2}></Col>
              </Row>
              {rentals && rentals.length ? (
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
                        <TableCell>Late Fees After (days)</TableCell>
                        <TableCell>Late Fee (one-time)</TableCell>
                        <TableCell>Late Fee (per day)</TableCell>
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
              ) : (
                ""
              )}
            </div>
          ) : (
            <Row className="m-3 text-align-center">
              <h3>No Lease Information Available at this time</h3>
            </Row>
          )}

          {/* ==================< Lease Documents >=======================================  */}
          {(application_status_1 === "FORWARDED" ||
            application_status_1 === "RENTED") &&
          lease.length ? (
            <div>
              <p
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  fontSize: "18px",
                  marginLeft: "50px",
                  marginTop: "20px",
                }}
              >
                Lease Documents
              </p>

              {/* <div style={{marginTop:"40px",paddingLeft:"20px",fontWeight:"bold"}} > Documents</div> */}

              <Container fluid>
                <div
                  className="mb-4"
                  style={{
                    textAlign: "left",
                    fontSize: "18px",
                    paddingLeft: "50px",
                    marginTop: "20px",
                  }}
                >
                  {lease.map((lease, i) => (
                    <div key={i}>
                      <div className="d-flex justify-content-between align-items-end">
                        <div style={{ display: "flex", width: "85%" }}>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <div
                              style={{ paddingLeft: "20px" }}
                              target="_blank"
                            >
                              {lease.name}
                            </div>
                            <p style={{ paddingLeft: "20px" }} className="m-0">
                              {lease.description}
                            </p>
                          </div>
                          <Button
                            style={{ marginLeft: "auto" }}
                            onClick={() => displayLease(lease.link)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                      <hr style={{ opacity: 1 }} />
                    </div>
                  ))}
                </div>
              </Container>
            </div>
          ) : (application_status_1 === "FORWARDED" ||
              application_status_1 === "RENTED") &&
            !lease.length ? (
            <>
              <p
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  fontSize: "18px",
                  marginLeft: "45px",
                  marginTop: "20px",
                }}
              >
                <u>Lease Documents:</u>
              </p>
              <h6 style={{ paddingLeft: "45px", paddingBottom: "30px" }}>
                {" "}
                Property Manager is yet to upload the lease document. Please
                contact them{" "}
              </h6>
            </>
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
                  console.log(e.target.value);
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

          {rentals.length > 0 &&
          rentals[0].rental_status !== "ACTIVE" &&
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

          {rentals.length > 0 &&
          rentals[0].rental_status === "ACTIVE" &&
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

          {/* ==================< Approval|Disapprove buttons >=======================================  */}
          <Row className="mt-4">
            {application_status_1 === "FORWARDED" ? (
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
            application_status_1 === "NEW" ? (
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
        </div>
      </div>
      <div hidden={responsive.showSidebar} className="w-100 mt-3">
        <TenantFooter />
      </div>
    </div>
  );
}

export default ReviewPropertyLease;