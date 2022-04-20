import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import moment from "moment";
import AppContext from "../AppContext";
import Header from "../components/Header";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import RepairRequest from "../icons/repair_request.svg";
import RepairStatus from "../icons/repair_status.svg";
import Documents from "../icons/documents.svg";
import Announcements from "../icons/announcements.svg";
import Emergency from "../icons/Emergency.svg";
import SearchPM from "../icons/searchPM.svg";
import { get } from "../utils/api";
import {
  headings,
  upcoming,
  upcomingHeading,
  upcomingText,
  blue,
  bluePill,
  greenBorderPill,
  address,
  actions,
  mediumBold,
  squareForm,
} from "../utils/styles";
import { color } from "@mui/system";
import No_Image from "../icons/No_Image_Available.jpeg";

function TenantDashboard(props) {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const { refresh, userData } = context;
  const { access_token, user } = userData;
  const { setShowFooter, profile, setProfile } = props;
  const [repairs, setRepairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rent, setRent] = useState(0);
  const [lastPurchase, setLastPurchase] = useState([]);
  const [currentPurchase, setCurrentPurchase] = useState([]);
  const [nextPurchase, setNextPurchase] = useState([]);
  const [property, setProperty] = useState({});
  const [applications, setApplications] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState([]);

  console.log(context, access_token, user);

  useEffect(() => {
    if (
      profile != undefined &&
      repairs.length === 0 &&
      selectedProperty.length === 0
    ) {
      setIsLoading(false);
    }
  }, [profile, repairs, selectedProperty]);

  useEffect(() => {
    setShowFooter(true);
  });

  useEffect(() => {
    const fetchProfile = async () => {
      let response = await get("/tenantProfileInfo", access_token);
      if (response.msg === "Token has expired") {
        console.log("here msg");
        refresh();
        return;
      }
      const prof = response.result[0];

      response = await get("/tenantProperties", access_token);
      console.log("tenantProperties", response.result);

      let payments = [];
      let property_uid = [];
      let purchases = [];

      // const payments =
      //   response.result.length > 0
      //     ? JSON.parse(response.result[0].rent_payments)
      //     : [];

      response.result.length > 0
        ? response.result.map((payment) => {
            payments.push(JSON.parse(payment.rent_payments));
          })
        : (payments = []);

      console.log("tenantProperties", response.result.length, payments);

      // const property_uid = response.result.length
      //   ? response.result[0].property_uid
      //   : null;

      response.result.length > 0
        ? response.result.map((property) => {
            property_uid.push(property.property_uid);
          })
        : (property_uid = []);
      console.log("tenantProperties", response.result.length, property_uid);

      if (property_uid) {
        prof.property_uid = property_uid;
      }
      setProfile(prof);

      let rentTotal = [];
      for (const payment of payments) {
        console.log("tenantProperties payment", payment);
        for (const pay of payment)
          if (pay.frequency === "Monthly" && pay.fee_type === "$") {
            console.log(" tenantProperties payment here");
            rentTotal.push(parseFloat(pay.charge));
            // rentTotal += parseFloat(payment[0].charge);
          }
      }
      console.log(rentTotal);
      setRent(rentTotal);
      setProperty(response.result);

      // response.result.length > 0
      //   ? rentTotal.map((rent) => {
      //       properties.push({ rent: rent, properties: {} });
      //     })
      //   : (properties = {});

      // setSelectedProperty(properties[0]);
      // const purchases = response.result.length
      //   ? JSON.parse(response.result[0].purchases)
      //   : [];

      response.result.length > 0
        ? response.result.map((purchase) => {
            purchases.push(JSON.parse(purchase.purchases));
          })
        : (purchases = []);
      console.log(
        "tenantProperties purchase",
        response.result.length,
        purchases
      );

      let lastPaidPurchase = [];
      let firstUnpaidPurchase = [];
      let nextUnpaidPurchase = [];
      let lpp = null;
      let fup = null;
      let nup = null;

      for (const purchase of purchases) {
        console.log("tenantProperties purchase", purchase);
        console.log(
          "tenantProperties purchase",
          lastPaidPurchase,
          firstUnpaidPurchase,
          nextUnpaidPurchase
        );
        for (const pur of purchase) {
          console.log("tenantProperties pur", pur);
          console.log(
            "tenantProperties pur",
            lastPaidPurchase,
            firstUnpaidPurchase,
            nextUnpaidPurchase
          );
          if (pur.purchase_status === "UNPAID" && fup === null) {
            console.log("in if");
            fup = pur;
            firstUnpaidPurchase.push(fup);
          } else if (pur.purchase_status === "UNPAID" && nup === null) {
            console.log("in else if");
            nup = pur;
            nextUnpaidPurchase.push(nup);
          } else if (pur.purchase_status === "PAID") {
            console.log("in else if2");
            lpp = pur;
            lastPaidPurchase.push(lpp);
          }
        }
        nup = null;
        fup = null;
        lpp = null;
      }

      setLastPurchase(lastPaidPurchase);
      setCurrentPurchase(firstUnpaidPurchase);
      setNextPurchase(nextUnpaidPurchase);
      console.log(
        "tenantProperties purchase 179",
        lastPaidPurchase,
        firstUnpaidPurchase,
        nextUnpaidPurchase
      );

      let properties = [];
      properties = response.result.map((id, index) => {
        return {
          rent: rentTotal[index],
          property: response.result[index],
          purchases: purchases[index],
          lastPurchase: lastPaidPurchase[index],
          currentPurchase: firstUnpaidPurchase[index],
          nextPurchase: nextUnpaidPurchase[index],
        };
      });

      console.log(
        "tenantProperties properties",
        response.result.length,
        properties
      );

      let selectedProperty = properties[0];
      console.log(selectedProperty);
      setSelectedProperty(selectedProperty);
      setProperties(properties);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchRepairs = async () => {
      const response = await get(
        `/maintenanceRequests?property_uid=${profile.property_uid}`
      );
      console.log(response.result[0].length);

      setRepairs(response.result[0]);
    };
    fetchRepairs();
  }, [profile]);

  useEffect(() => {
    const fetchApplications = async () => {
      const response = await get(
        `/applications?tenant_id=${profile.tenant_id}`
      );

      const appArray = response.result || [];
      appArray.forEach((app) => {
        app.images = app.images ? JSON.parse(app.images) : [];
      });

      // const appArray = response.result || [];
      // if(response.result && response.result.length ){
      //   appArray.forEach(async(app, i)=>{
      //       const property = await get(
      //         `/propertyInfo?property_uid=${app.property_uid}`
      //       );
      //       if(property && property.result.length){
      //         app.images = JSON.parse(property.result[0].images) || [];
      //         app.address = property.result[0].address || "";
      //         app.city = property.result[0].city || "";
      //         app.area = property.result[0].area || "";
      //       }
      //         setApplications(appArray);

      //   })
      // }
      setApplications(appArray);
      console.table(appArray);
    };
    fetchApplications();
  }, [profile]);

  const goToRequest = () => {
    navigate(`/${selectedProperty.property.property_uid}/repairRequest`, {
      state: {
        property: selectedProperty.property,
      },
    });
  };
  const goToAnnouncements = () => {
    navigate("/residentAnnouncements");
  };
  const goToEmergency = () => {
    navigate("/emergency");
  };
  const goToStatus = () => {
    navigate(`/${profile.property_uid}/repairStatus`);
  };
  const goToDocuments = () => {
    navigate("/uploadTenantDocuments");
  };
  const goToSearchPM = () => {
    navigate("/tenantAvailableProperties");
  };
  const goToReviewPropertyLease = (application) => {
    navigate(`/reviewPropertyLease/${application.property_uid}`, {
      state: {
        application_uid: application.application_uid,
        application_status_1: application.application_status,
      },
    });
  };
  return (
    <div className="h-100">
      <Header title="Home" />
      {isLoading === true || (!profile || profile.length) === 0 ? null : (
        <Container className="pt-1 mb-4" style={{ minHeight: "100%" }}>
          <Row style={headings}>
            <div>Hello {profile.tenant_first_name},</div>
          </Row>
          {repairs.length === 0 ? (
            <Row style={upcoming} className="mt-2 mb-2">
              <div style={upcomingHeading} className="mt-1 mb-1">
                Upcoming:
                <br />
                <br />
                Nothing Scheduled
              </div>
            </Row>
          ) : (
            <div>
              {repairs.map((repair) => {
                return repair.status === "SCHEDULED" ? (
                  <Row style={upcoming} className="mt-2 mb-2">
                    <div style={upcomingHeading} className="mt-1 mb-1">
                      Upcoming:
                      <br />
                      Toilet Maintenance is scheduled for
                      <br />{" "}
                      {moment(repair.scheduled_date).format(
                        "MMM DD, YYYY "
                      )} at {moment(repair.scheduled_date).format("hh:mm a")}
                      <br />
                    </div>

                    <Col className="mt-1 mb-1">
                      <div style={upcomingText}>
                        For questions / concerns, feel free to contact the
                        property manager
                      </div>
                    </Col>
                    <Col xs={2} style={upcomingText} className="mt-1 mb-1">
                      <img src={Phone} />
                    </Col>
                    <Col xs={2} style={upcomingText} className="mt-1 mb-1">
                      <img src={Message} />
                    </Col>
                  </Row>
                ) : null;
              })}
            </div>
          )}

          <Row>
            {/* <div style={headings} className="mt-4 mb-1">
              ${rent}/mo
            </div> */}
            <Form.Group>
              <Form.Select
                style={squareForm}
                value={JSON.stringify(selectedProperty)}
                onChange={(e) =>
                  setSelectedProperty(JSON.parse(e.target.value))
                }
              >
                {properties.map((property, i) => (
                  <option key={i} value={JSON.stringify(property)}>
                    {property.property.address} {property.property.unit}
                    ,&nbsp;
                    {property.property.city}
                    ,&nbsp;
                    {property.property.state}&nbsp; {property.property.zip}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {console.log("selectedProperty", selectedProperty)}
            {/* {isLoading === true ? null : (
              <div>
                {properties.map((property) => (
                  <div>
                    <div style={headings} className="mt-4 mb-1">
                      ${property.rent} / mo
                    </div>

                    <div style={address} className="mt-1 mb-1">
                      {property.property.address} {property.property.unit}
                      ,&nbsp;
                      {property.property.city}
                      ,&nbsp;
                      {property.property.state}&nbsp; {property.property.zip}
                    </div>
                  </div>
                ))}

              
              </div>
            )} */}
            {isLoading === true || selectedProperty.length == 0 ? null : (
              <div>
                <div style={headings} className="mt-4 mb-1">
                  ${selectedProperty.rent} / mo
                </div>

                <div style={address} className="mt-1 mb-1">
                  {selectedProperty.property.address}{" "}
                  {selectedProperty.property.unit}
                  ,&nbsp;
                  {selectedProperty.property.city}
                  ,&nbsp;
                  {selectedProperty.property.state}&nbsp;{" "}
                  {selectedProperty.property.zip}
                </div>
                {selectedProperty.lastPurchase && (
                  <div
                    style={blue}
                    className="mt-1 mb-1"
                    onClick={() => navigate("/paymentHistory")}
                  >
                    Rent paid for {selectedProperty.lastPurchase.purchase_notes}
                    : ${selectedProperty.lastPurchase.amount_paid}
                  </div>
                )}
                {selectedProperty.currentPurchase && (
                  <div>
                    <Col xs={7} className="mt-1 mb-1">
                      <div
                        style={bluePill}
                        onClick={() =>
                          navigate(
                            `/rentPayment/${selectedProperty.currentPurchase.purchase_uid}`
                          )
                        }
                      >
                        Rent due for{" "}
                        {selectedProperty.currentPurchase.purchase_notes}: $
                        {selectedProperty.currentPurchase.amount_due -
                          selectedProperty.currentPurchase.amount_paid}
                      </div>
                    </Col>
                  </div>
                )}
                {selectedProperty.nextPurchase && (
                  <div>
                    <Col xs={8} className="mt-1 mb-1">
                      <div
                        style={greenBorderPill}
                        onClick={() =>
                          navigate(
                            `/rentPayment/${selectedProperty.nextPurchase.purchase_uid}`
                          )
                        }
                      >
                        Upcoming rent for{" "}
                        {selectedProperty.nextPurchase.purchase_notes}: $
                        {selectedProperty.nextPurchase.amount_due -
                          selectedProperty.nextPurchase.amount_paid}
                      </div>
                    </Col>
                  </div>
                )}
              </div>
            )}
          </Row>

          <Row
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
            className="mb-4"
          >
            <div style={headings} className="mt-4 mb-1">
              Actions
            </div>
            <Col xs={3} style={actions}>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={RepairRequest}
                onClick={goToRequest}
              />
              <div>Request Repair</div>
            </Col>
            <Col xs={3} style={actions}>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={RepairStatus}
                onClick={goToStatus}
              />
              <div>Repair Status</div>
            </Col>
            <Col xs={3} style={actions}>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={Documents}
                onClick={goToDocuments}
              />
              <div>
                Your <br /> Documents
              </div>
            </Col>
          </Row>
          <Row
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
            className="mt-1 mb-1"
          >
            <Col xs={3} style={actions}>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={Announcements}
                onClick={goToAnnouncements}
              />
              <div>
                Resident <br />
                Announcements
              </div>
            </Col>
            <Col xs={3} style={actions}>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={Emergency}
                onClick={goToEmergency}
              />
              <div>Emergency</div>
            </Col>
            <Col xs={3} style={actions}>
              <div>
                <img
                  style={{ width: "50px", height: "50px", cursor: "pointer" }}
                  src={SearchPM}
                  onClick={goToSearchPM}
                />
                <div>Search Properties </div>
              </div>
            </Col>
          </Row>
          {/* ============================RENTED Properties =========================== */}
          <div style={headings} className="mt-4 mb-1">
            Properties Rented
          </div>
          <div className="mb-4" style={{ margin: "20px" }}>
            <Row>
              <Col>
                {applications ? (
                  applications.map((application, i) =>
                    application.application_status === "RENTED" ? (
                      <div
                        key={i}
                        onClick={() => goToReviewPropertyLease(application)}
                      >
                        <div className="d-flex justify-content-between align-items-end">
                          <div
                            className="img"
                            style={{
                              flex: "0 0 35%",
                              background: "lightgrey",
                              height: "150px",
                              width: "100px",
                            }}
                          >
                            {/* {application.images && application.images.length ? (<img style={{width:"100%", height:"100%"}} src={application.images[0]}/>) : "" } */}
                            {application.images && application.images.length ? (
                              <img
                                style={{ width: "100%", height: "100%" }}
                                src={application.images[0]}
                              />
                            ) : (
                              <img
                                style={{ width: "100%", height: "100%" }}
                                src={No_Image}
                              />
                            )}
                          </div>
                          <div>
                            <h5 style={mediumBold}>ADDRESS</h5>
                            <h6>{application.address}</h6>
                            <h6>
                              {application.city},{application.zip}
                            </h6>

                            <h5 style={mediumBold}>APPLICATION STATUS</h5>
                            <h6 style={{ mediumBold, color: "#41fc03" }}>
                              {application.application_status}
                            </h6>
                          </div>
                        </div>
                        <hr style={{ opacity: 1 }} />
                      </div>
                    ) : (
                      ""
                    )
                  )
                ) : (
                  <p>You have not rented any property yet. </p>
                )}
              </Col>
            </Row>
          </div>
          {/* ============================APPLICATION STATUS=========================== */}
          <div style={headings} className="mt-4 mb-1">
            Application Status
          </div>
          <p>Your lease applications and their statuses </p>

          <div className="mb-4" style={{ margin: "20px" }}>
            <Row>
              <Col>
                {applications ? (
                  applications.map((application, i) =>
                    application.application_status !== "RENTED" ? (
                      <div
                        key={i}
                        onClick={() => goToReviewPropertyLease(application)}
                      >
                        <div className="d-flex justify-content-between align-items-end">
                          <div
                            className="img"
                            style={{
                              flex: "0 0 35%",
                              background: "lightgrey",
                              height: "150px",
                              width: "100px",
                            }}
                          >
                            {/* {application.images && application.images.length ? (<img style={{width:"100%", height:"100%"}} src={application.images[0]}/>) : "" } */}
                            {application.images && application.images.length ? (
                              <img
                                style={{ width: "100%", height: "100%" }}
                                src={application.images[0]}
                              />
                            ) : (
                              <img
                                style={{ width: "100%", height: "100%" }}
                                src={No_Image}
                              />
                            )}
                          </div>
                          <div>
                            <h5 style={mediumBold}>ADDRESS</h5>
                            <h6>{application.address}</h6>
                            <h6>
                              {application.city},{application.zip}
                            </h6>

                            <h5 style={mediumBold}>APPLICATION STATUS</h5>
                            {application.application_status === "NEW" ||
                            application.application_status === "FORWARDED" ? (
                              <h6 style={{ mediumBold, color: "blue" }}>
                                {application.application_status}
                              </h6>
                            ) : application.application_status ===
                              "REJECTED" ? (
                              <h6 style={{ mediumBold, color: "red" }}>
                                {application.application_status}
                              </h6>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <hr style={{ opacity: 1 }} />
                      </div>
                    ) : (
                      ""
                    )
                  )
                ) : (
                  <p>You have not applied for any property yet. </p>
                )}
              </Col>
            </Row>
          </div>
        </Container>
      )}
    </div>
  );
}

export default TenantDashboard;
