import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Carousel } from "react-bootstrap";
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
  greenPill,
  address,
  actions,
  mediumBold,
  squareForm,
} from "../utils/styles";
import { color } from "@mui/system";
import No_Image from "../icons/No_Image_Available.jpeg";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";

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
  const [scheduled, setScheduled] = useState(0);
  const [paidFees, setPaid] = useState(0);
  const [due, setDue] = useState(0);
  const [upcomingFees, setUpcoming] = useState(0);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const [propertyIndex, setPropertyIndex] = useState(0);


  let includedUIDs = [];
  var months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  // console.log(context, access_token, user, selectedProperty);

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
  const fetchProfile = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    let response = await get("/tenantProfileInfo", access_token);
    console.log("fetch profile", response);

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

    console.log("tenantProperties payments", response.result.length, payments);

    // const property_uid = response.result.length
    //   ? response.result[0].property_uid
    //   : null;

    response.result.length > 0
      ? response.result.map((property) => {
        property_uid.push(property.property_uid);
      })
      : (property_uid = []);
    console.log(
      "tenantProperties property_uid",
      response.result.length,
      property_uid
    );

    if (property_uid) {
      prof.property_uid = property_uid;
    }
    if (props.profile.length > 0) {
      setProfile(props.profile.length);
    }
    else {
      setProfile(prof);
    }


    let rentTotal = [];
    for (const payment of payments) {
      for (const pay of payment)
        if (pay.frequency === "Monthly" && pay.fee_type === "$") {
          rentTotal.push(parseFloat(pay.charge));
        }
    }

    console.log("rentTotal", rentTotal);
    setRent(rentTotal);
    setProperty(response.result);
    console.log(property);

    response.result.length > 0
      ? response.result.map((property) => {
        purchases.push(property.tenantExpenses);
      })
      : (purchases = []);

    // console.log("tenantProperties purchase", response.result.length, purchases);

    let lastPaidPurchase = [];
    let firstUnpaidPurchase = [];
    let nextUnpaidPurchase = [];
    let lpp = null;
    let fup = null;
    let nup = null;

    for (const purchase of purchases) {
      // console.log("tenantProperties purchase", purchase);
      // console.log(
      //   "tenantProperties purchase",
      //   lastPaidPurchase,
      //   firstUnpaidPurchase,
      //   nextUnpaidPurchase
      // );
      for (const pur of purchase) {
        // console.log("tenantProperties pur", pur);
        // console.log(
        //   "tenantProperties pur",
        //   lastPaidPurchase,
        //   firstUnpaidPurchase,
        //   nextUnpaidPurchase
        // );
        if (pur.purchase_status === "UNPAID" && fup === null) {
          // console.log("in if");
          fup = pur;
          firstUnpaidPurchase.push(fup);
        } else if (pur.purchase_status === "UNPAID" && nup === null) {
          // console.log("in else if");
          nup = pur;
          nextUnpaidPurchase.push(nup);
        } else if (pur.purchase_status === "PAID") {
          // console.log("in else if2");
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
    setProperties(properties);
    setSelectedProperty(properties[propertyIndex]);
  };

  const parseExpenses = (parameter) => {
    {/* ==========Parsing through purchases for upcoming, due and rent paid ==========*/ }
    let tempMonth = 0;
    let tempDate = 0;
    let tempYear = 0;
    let tempUpcoming = 0;
    let tempDue = 0;
    let tempRentPaid = 0;

    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    const currentYear = new Date().getFullYear();

    for (let expense of parameter.property.tenantExpenses) {
      let dueDate;
      let currentDate;
      let date = expense.next_payment;
      if (date !== null) {
        date = date.split(" ")[0].split("-");
        tempMonth = parseInt(date[1]);
        tempDate = parseInt(date[2]);
        tempYear = parseInt(date[0]);
        dueDate = new Date(tempYear, tempMonth - 1, tempDate);
        currentDate = new Date(currentYear, currentMonth, currentDay);
      }
      if (expense.purchase_status === "UNPAID" && dueDate > currentDate && !includedUIDs.includes(expense.purchase_uid)) {
        includedUIDs.push(expense.purchase_uid);
        tempUpcoming += expense.amount_due - expense.amount_paid;
      }
      if ((expense.purchase_status === "PAID" || expense.amount > 0)) {
        includedUIDs.push(expense.purchase_uid);
        tempRentPaid += expense.amount;
      }
      if (expense.purchase_status === "UNPAID" && dueDate <= currentDate) {
        includedUIDs.push(expense.purchase_uid);
        console.log(expense.purchase_uid);
        tempDue += expense.amount_due - expense.amount;
      }
    }
    console.log(includedUIDs);
    console.log(parameter.property.tenantExpenses);
    setPaid(tempRentPaid.toFixed(2));
    setDue(tempDue.toFixed(2));
    setUpcoming(tempUpcoming.toFixed(2));
  }

  useEffect(() => {
    if (Object.keys(selectedProperty).length > 0) {
      console.log("Selected Property: ", selectedProperty);
      for (let index in selectedProperty.property.images) {
        if (selectedProperty.property.images[index].includes("img_cover")) {
          setCoverImageIndex(index);
        }
      }
      parseExpenses(selectedProperty);
    }
  }, [selectedProperty]);

  const fetchRepairs = async () => {
    const response = await get(
      `/maintenanceRequests?property_uid=${profile.property_uid}`
    );

    setRepairs(response.result);
    for (const repair of repairs) {
      if (repair.request_status === "SCHEDULED") {
        setScheduled(scheduled + 1);
      }
    }
  };
  const calculatePropertyIndex = (addSubtract) => {
    let newIndex = propertyIndex;
    newIndex += addSubtract ? 1 : -1;
    if (newIndex === properties.length) {
      newIndex = 0;
    }
    else if (newIndex === -1) {
      newIndex = properties.length - 1;
    }
    console.log(newIndex);
    setPropertyIndex(newIndex);
    console.log(properties);
    console.log("selected property", properties[newIndex]);
    setSelectedProperty(properties[newIndex]);
  }
  const fetchApplications = async () => {
    console.log("profile", profile);
    console.log("user", user);
    // const response = await get(`/applications?tenant_id=${profile.tenant_id}`);
    const response = await get(`/applications?tenant_id=${user.user_uid}`);
    console.log("applications: ", response)
    const appArray = response.result || [];
    appArray.forEach((app) => {
      app.images = app.images ? JSON.parse(app.images) : [];
    });
    setApplications(appArray);
    console.log("applications", appArray);
  };

  const fetchRentals = async () => {
    const response = await get(`/leaseTenants?linked_tenant_id=${user.user_uid}`);
    console.log("rentals", response.result);
  }

  useEffect(() => {
    fetchProfile();
    fetchRepairs();
    fetchRentals();
    fetchApplications();
  }, [access_token]);


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
    console.log(application);
    navigate(`/reviewPropertyLease/${application.property_uid}`, {
      state: {
        application_uid: application.application_uid,
        application_status_1: application.application_status,
        message: application.message,
      },
    });
  };
  const goToPastPaidPayments = () => {
    console.log("Going to past paid payments page.");
    navigate(
      // `/rentPayment/${selectedProperty.nextPurchase.purchase_uid}`
      `/tenantPastPaidPayments`, {
      state: {
        selectedProperty: selectedProperty,

      }
    })
  }
  const goToDuePayments = () => {
    console.log("Going to past payments page");
    navigate(
      // `/rentPayment/${selectedProperty.nextPurchase.purchase_uid}`
      `/tenantDuePayments`, {
      state: {
        selectedProperty: selectedProperty,
      }
    })
  };
  return (
    <div style={{ background: "#E9E9E9 0% 0% no-repeat padding-box" }}>
      <Header title="Home" customClass={"mb-2"} />
      {isLoading === true || (!profile || profile.length) === 0 ? null : (
        <Container
          className="px-3 pb-5 mb-5"
          style={{
            minHeight: "100%",
            width: "98%",
            borderRadius: "10px 10px 0px 0px",
          }}
        >
          <Row style={{ ...headings, marginBottom: "0px" }}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                color: "#007AFF",
                fontSize: "24px",
                padding: "10px",
                borderRadius: "10px 10px 0px 0px",
              }}
            >
              {profile.tenant_first_name}'s Property Dashboard
            </div>
            {property.length > 0 && !isLoading && selectedProperty.length !== 0 && property.length !== 1 ?
              <Carousel
                interval={null}
                prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" style={{ color: 'black', opacity: '1' }} onClick={() => {
                  calculatePropertyIndex(false);
                }} />}
                nextIcon={<span aria-hidden="true" style={{ color: 'black' }} className="carousel-control-next-icon" onClick={() => {
                  calculatePropertyIndex(true);
                }} />}
                style={{ width: "100%", padding: '0px' }}
              >
                {property.map((property, i) => {
                  return <Carousel.Item key={i}>
                    <div
                      style={{
                        display: "flex",
                        backgroundColor: "#F3F3F3",
                        padding: "15px 15px 35px 15px",
                        alignItems: "center",

                      }}
                      onClick={() =>
                        applications.map((application, i) => {
                          if (selectedProperty.property.property_uid === application.property_uid) {
                            goToReviewPropertyLease(application);
                          }
                        })
                      }
                    >
                      <Col>
                        {" "}
                        <img
                          src={
                            selectedProperty && selectedProperty.property.images.length > 0
                              ? JSON.parse(selectedProperty.property.images)[coverImageIndex]
                              : No_Image
                          }
                          style={{
                            width: "113px",
                            height: "113px",
                            borderRadius: "10px",
                          }}
                        ></img>
                      </Col>

                      <Col xs={6}>
                        <div style={{ paddingLeft: "10px", fontSize: "22px" }}>
                          ${selectedProperty.rent} / mo
                        </div>
                        <div
                          style={{
                            paddingLeft: "10px",
                            fontSize: "16px",
                            lineHeight: "20px",
                            color: "#777777",
                            padding: "10px",
                          }}
                        >
                          {selectedProperty.property.address},{" "}
                          {selectedProperty.property.city},{" "}
                          {selectedProperty.property.zip},{" "}
                          {selectedProperty.property.state}
                        </div>
                        <div
                          style={{
                            marginLeft: "10px",
                            fontSize: "12px",
                            color: "#007AFF",
                            lineHeight: '17px'
                          }}
                        >
                          Manager:{" "}
                          {
                            selectedProperty.property.property_manager[0]
                              .manager_business_name
                          }
                        </div>
                        <div
                          style={{
                            marginLeft: "10px",
                          }}
                        >
                          {" "}
                          <a
                            href={`tel:${selectedProperty.property.property_manager[0].manager_phone_number}`}
                          >
                            <img
                              style={{
                                width: "25px",
                                height: "25px",
                                marginLeft: "10px",
                              }}
                              src={Phone}
                            />
                          </a>
                          <a
                            href={`mailto:${selectedProperty.property.property_manager[0].manager_email}`}
                          >
                            <img
                              style={{
                                width: "25px",
                                height: "25px",
                                marginLeft: "10px",
                              }}
                              src={Message}
                            />
                          </a>
                        </div>
                      </Col>
                      {upcomingFees !== 0 || due !== 0 ?
                        <Col
                          style={{
                            backgroundColor: "#FFBCBC",
                            borderRadius: "20px",
                            fontSize: "14px",
                            // width: "73px",
                            // height: "24px",
                            // padding: '5px',
                            textAlign: "center",
                          }}
                        >
                          Unpaid
                        </Col> :
                        <Col
                          style={{
                            backgroundColor: "#3DB727",
                            borderRadius: "20px",
                            fontSize: "13px",
                            // width: "73px",
                            height: "24px",
                            // padding: '5px',
                            textAlign: "center",
                            color: 'white',
                          }}
                        >
                          Fees Paid
                        </Col>
                      }
                    </div>
                  </Carousel.Item>;
                })
                }
              </Carousel>
              : property.length === 1 && selectedProperty.length !== 0 ?
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "#F3F3F3",
                    padding: "15px 15px 35px 15px",
                    alignItems: "center",

                  }}
                  onClick={() =>
                    applications.map((application, i) => {
                      if (selectedProperty.property.property_uid === application.property_uid) {
                        goToReviewPropertyLease(application);
                      }
                    })
                  }
                >
                  <Col>
                    {" "}
                    <img
                      src={
                        selectedProperty && selectedProperty.property.images.length > 0
                          ? JSON.parse(selectedProperty.property.images)[coverImageIndex]
                          : No_Image
                      }
                      style={{
                        width: "113px",
                        height: "113px",
                        borderRadius: "10px",
                      }}
                    ></img>
                  </Col>

                  <Col xs={6}>
                    <div style={{ paddingLeft: "10px", fontSize: "22px" }}>
                      ${selectedProperty.rent} / mo
                    </div>
                    <div
                      style={{
                        paddingLeft: "10px",
                        fontSize: "16px",
                        lineHeight: "20px",
                        color: "#777777",
                        padding: "10px",
                      }}
                    >
                      {selectedProperty.property.address},{" "}
                      {selectedProperty.property.city},{" "}
                      {selectedProperty.property.zip},{" "}
                      {selectedProperty.property.state}
                    </div>
                    <div
                      style={{
                        marginLeft: "10px",
                        fontSize: "12px",
                        color: "#007AFF",
                        lineHeight: '17px'
                      }}
                    >
                      Manager:{" "}
                      {
                        selectedProperty.property.property_manager[0]
                          .manager_business_name
                      }
                    </div>
                    <div
                      style={{
                        marginLeft: "10px",
                      }}
                    >
                      {" "}
                      <a
                        href={`tel:${selectedProperty.property.property_manager[0].manager_phone_number}`}
                      >
                        <img
                          style={{
                            width: "25px",
                            height: "25px",
                            marginLeft: "10px",
                          }}
                          src={Phone}
                        />
                      </a>
                      <a
                        href={`mailto:${selectedProperty.property.property_manager[0].manager_email}`}
                      >
                        <img
                          style={{
                            width: "25px",
                            height: "25px",
                            marginLeft: "10px",
                          }}
                          src={Message}
                        />
                      </a>
                    </div>
                  </Col>
                  {upcomingFees !== 0 || due !== 0 ?
                    <Col
                      style={{
                        backgroundColor: "#FFBCBC",
                        borderRadius: "20px",
                        fontSize: "14px",
                        // width: "73px",
                        // height: "24px",
                        // padding: '5px',
                        textAlign: "center",
                      }}
                    >
                      Unpaid
                    </Col> :
                    <Col
                      style={{
                        backgroundColor: "#3DB727",
                        borderRadius: "20px",
                        fontSize: "13px",
                        // width: "73px",
                        height: "24px",
                        // padding: '5px',
                        textAlign: "center",
                        color: 'white',
                      }}
                    >
                      Fees Paid
                    </Col>
                  }
                </div> : ""}

            {/* {isLoading === true || selectedProperty.length == 0 ? null : (
              <div
                style={{
                  display: "flex",
                  backgroundColor: "#F3F3F3",
                  padding: "15px",
                  alignItems: "center",
                }}
                onClick={()=>
                  applications.map((application, i) => {
                    if (selectedProperty.property.property_uid === application.property_uid) {
                      goToReviewPropertyLease(application);
                    }
                  })
                }
              >
                <Col>
                  {" "}
                  <img
                    src={
                      selectedProperty && selectedProperty.property.images.length > 0
                        ? JSON.parse(selectedProperty.property.images)[coverImageIndex]
                        : No_Image
                    }
                    style={{
                      width: "113px",
                      height: "113px",
                      borderRadius: "10px",
                    }}
                  ></img>
                </Col>

                <Col xs={6}>
                  <div style={{ paddingLeft: "10px", fontSize: "22px" }}>
                    ${selectedProperty.rent} / mo
                  </div>
                  <div
                    style={{
                      paddingLeft: "10px",
                      fontSize: "16px",
                      lineHeight: "20px",
                      color: "#777777",
                      padding: "10px",
                    }}
                  >
                    {selectedProperty.property.address},{" "}
                    {selectedProperty.property.city},{" "}
                    {selectedProperty.property.zip},{" "}
                    {selectedProperty.property.state}
                  </div>
                  <div
                    style={{
                      marginLeft: "10px",
                      fontSize: "12px",
                      color: "#007AFF",
                    }}
                  >
                    Manager:{" "}
                    {
                      selectedProperty.property.property_manager[0]
                        .manager_business_name
                    }
                  </div>
                  <div
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    {" "}
                    <a
                      href={`tel:${selectedProperty.property.property_manager[0].manager_phone_number}`}
                    >
                      <img
                        style={{
                          width: "25px",
                          height: "25px",
                          marginLeft: "10px",
                        }}
                        src={Phone}
                      />
                    </a>
                    <a
                      href={`mailto:${selectedProperty.property.property_manager[0].manager_email}`}
                    >
                      <img
                        style={{
                          width: "25px",
                          height: "25px",
                          marginLeft: "10px",
                        }}
                        src={Message}
                      />
                    </a>
                  </div>
                </Col>
                {selectedProperty.nextPurchase.payment_date === null || selectedProperty.nextPurchase.amount_due > 0 ? 
                <Col
                  style={{
                    backgroundColor: "#FFBCBC",
                    borderRadius: "20px",
                    fontSize: "11px",
                    width: "73px",
                    height: "24px",
                    textAlign: "center",
                  }}
                >
                  Rent unpaid
                </Col> : 
                <Col
                  style={{
                    backgroundColor: "#93EE9C",
                    borderRadius: "20px",
                    fontSize: "13px",
                    // width: "73px",
                    height: "24px",
                    textAlign: "center",
                  }}>
                    Rent paid
                </Col>
                }
              </div>
            )} */}
          </Row>
          {/* <Row style={{ backgroundColor: "#F3F3F3" }}>
            <Form.Group>
              <Form.Select
                style={squareForm}
                value={JSON.stringify(selectedProperty)}
                onChange={(e) =>
                  setSelectedProperty(JSON.parse(e.target.value))
                  // setSelectedProperty(JSON.parse(e.target.value))
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
          </Row> */}

          {scheduled === 0 ? (
            <Row
              style={{
                ...upcoming,
                padding: "10px",
                height: "auto",
                marginTop: "0px",
                marginBottom: "0px",
              }}
            >
              <div style={upcomingHeading} className="mt-1 mb-1">
                Upcoming:
                <br />
                <div style={{ marginTop: "15px" }}>Nothing Scheduled</div>
                <br />
              </div>
            </Row>
          ) : (
            <div>
              {repairs.map((repair) => {
                return repair.status === "PROCESSING" ? (
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

          {selectedProperty && (

              <div
                  style={{
                    margin: "-12px",
                    display: "flex",
                    flexDirection: "row",
                    textAlign: "center",
                    backgroundColor: "#FFFFFF",
                    height: "120px",
                  }}
              >
                {/* ============== Due Button ===================*/}
                <div
                    onClick={
                      goToDuePayments
                    }
                    style={{
                      height: "90px",
                      width: "167px",
                      backgroundColor: "#93EE9C",
                      borderRadius: "10px",
                      margin: "10px",
                    }}
                >
                  <div
                      style={{
                        backgroundColor: "#007AFF",
                        padding: "5px",
                        borderRadius: "10px 10px 0px 0px",
                        fontSize: "21px",
                        color: "#FFFFFF",
                      }}
                  >
                    Due
                  </div>
                  <div style={{ fontSize: "22px", lineHeight: "35px" }}>
                    {/* {selectedProperty.nextPurchase.payment_date ?
                      <div>
                        {months[parseInt(selectedProperty.nextPurchase.payment_date.split(" ")[0].split("-")[1])]}
                        &nbsp;
                        {parseInt(selectedProperty.nextPurchase.payment_date.split(" ")[0].split("-")[0])}
                      </div>
                        : "N/A\n"
                      } */}
                    ${due}
                  </div>
                </div>
                {/* ============== Upcoming Button ===================*/}
                <div
                    onClick={goToDuePayments}
                    style={{
                      height: "90px",
                      width: "167px",
                      backgroundColor: "#93EE9C",
                      borderRadius: "10px",
                      margin: "10px",
                    }}
                >
                  <div
                      style={{
                        backgroundColor: "#007AFF",
                        padding: "5px",
                        borderRadius: "10px 10px 0px 0px",
                        fontSize: "21px",
                        color: "#FFFFFF",
                      }}
                  >
                    Upcoming
                  </div>
                  {nextPurchase === null ? null :
                      <div style={{ fontSize: "22px", lineHeight: "35px" }}>

                        {/* <p style={{ margin: "0px" }}>
                      {selectedProperty.nextPurchase ?
                        <div>
                          {months[parseInt(selectedProperty.nextPurchase.next_payment.split(" ")[0].split("-")[1])]}
                          &nbsp;
                          {parseInt(selectedProperty.nextPurchase.next_payment.split(" ")[0].split("-")[2])}
                        </div>
                      : "No Date"}
                    </p> */}
                        ${upcomingFees}

                      </div>}

                </div>
                {/* ============== Paid Button ===================*/}
                <div
                    onClick={
                      goToPastPaidPayments
                      // navigate(
                      //   `/rentPayment/${selectedProperty.nextPurchase.purchase_uid}`
                      // );
                    }
                    style={{
                      height: "90px",
                      width: "167px",
                      backgroundColor: "#93EE9C",
                      borderRadius: "10px",
                      margin: "10px",
                    }}
                >
                  <div
                      style={{
                        backgroundColor: "#007AFF",
                        padding: "5px",
                        borderRadius: "10px 10px 0px 0px",
                        fontSize: "21px",
                        color: "#FFFFFF",
                      }}
                  >
                    Paid
                  </div>
                  <div style={{ fontSize: "22px", lineHeight: "35px" }}>
                    {/* {selectedProperty.nextPurchase.payment_date ?
                      <div>
                        {months[parseInt(selectedProperty.nextPurchase.payment_date.split(" ")[0].split("-")[1])]}
                        &nbsp;
                        {parseInt(selectedProperty.nextPurchase.payment_date.split(" ")[0].split("-")[0])}
                      </div>
                        : "N/A\n"
                      } */}
                    ${paidFees}
                  </div>
                </div>
              </div>
          )}

          <Row>
            <div
              style={{
                backgroundColor: "#F3F3F3",
                color: "#007AFF",
                font: "Bahnschrift bold",
              }}
            >
              <div style={{ padding: "10px" }} onClick={goToAnnouncements}>
                <div
                  style={{
                    fontSize: "22px",
                    padding: "0px",
                    font: "normal normal bold Bahnschrift",
                    fontWeight: "Bold",
                  }}
                >
                  Resident Announcements
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    font: "normal normal bold Bahnschrift",
                  }}
                >
                  No announcements thus far
                </div>
              </div>
            </div>
          </Row>

          <Row
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
            className="mb-4"
          >
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
          <p> Your rented properties </p>
          <hr style={{ opacity: 1 }} />
          <div className="mb-4" style={{ margin: "10px" }}>
            <Row>
              <Col>
                {applications ? (
                  applications.map((application, i) =>
                    // console.log(application)
                    // application.rental_status === "ACTIVE" ? (
                    application.application_status === "RENTED" ||
                      application.application_status === "PM END EARLY" ||
                      application.application_status === "TENANT END EARLY" ? (
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
                          <div style={{ paddingLeft: "15px" }}>
                            <h5 style={mediumBold}>ADDRESS</h5>
                            <h6>{application.address}</h6>
                            <h6>
                              {application.city},{application.zip}
                            </h6>

                            <h5 style={mediumBold}>APPLICATION STATUS</h5>
                            {application.application_status !== "TENANT ENDED" || application.application_status !== "PM ENDED" ?
                              <h6 style={{ mediumBold, color: "#41fc03" }}>
                                {application.application_status}
                              </h6>
                              :
                              <h6 style={{ mediumBold, color: "#f55742" }}>
                                {application.application_status}
                              </h6>
                            }


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

          {/* ============================ LEASE RECEIVED =========================== */}
          <div style={headings} className="mt-4 mb-1">
            Lease Received
          </div>
          <p> The lease agreement has been created for these properties </p>
          <hr style={{ opacity: 1 }} />

          <div className="mb-4" style={{ margin: "20px" }}>
            <Row>
              <Col>
                {applications ? (
                  applications.map((application, i) =>
                    application.application_status === "FORWARDED" ? (
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
                          <div style={{ paddingLeft: "15px" }}>
                            <h5 style={mediumBold}>ADDRESS</h5>
                            <h6>{application.address}</h6>
                            <h6>
                              {application.city},{application.zip}
                            </h6>

                            <h5 style={mediumBold}>APPLICATION STATUS</h5>
                            {application.application_status === "FORWARDED" ? (
                              <h6 style={{ mediumBold, color: "blue" }}>
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
                  <p>No property with lease ready to be signed can be seen </p>
                )}
              </Col>
            </Row>
          </div>


          {/* ============================ APPLICATION STATUS =========================== */}
          <div style={headings} className="mt-4 mb-1">
            Application Submitted
          </div>
          <p>Your applications and their statuses </p>
          <hr style={{ opacity: 1 }} />
          <div className="mb-4" style={{ margin: "20px" }}>
            <Row>
              <Col>
                {applications ? (
                  applications.map((application, i) =>
                    application.application_status === "NEW" ? (
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
                          <div style={{ paddingLeft: "15px" }}>
                            <h5 style={mediumBold}>ADDRESS</h5>
                            <h6>{application.address}</h6>
                            <h6>
                              {application.city},{application.zip}
                            </h6>

                            <h5 style={mediumBold}>APPLICATION STATUS</h5>
                            {application.application_status === "NEW" ? (
                              <h6 style={{ mediumBold, color: "blue" }}>
                                {application.application_status}
                              </h6>
                            ) : application.application_status ===
                              "REJECTED" ? (
                              <h6 style={{ mediumBold, color: "red" }}>
                                {application.application_status}
                              </h6>
                            ) : application.application_status === "REFUSED" ? (
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

          {/* ============================ ENDED STATUS =========================== */}
          <div style={headings} className="mt-4 mb-1">
            Terminated Leases
          </div>
          <p>Leases that have been terminated. </p>
          <hr style={{ opacity: 1 }} />
          <div className="mb-4" style={{ margin: "20px" }}>
            <Row>
              <Col>
                {applications ? (
                  applications.map((application, i) =>
                    application.application_status === "ENDED" || application.application_status === "REFUSED" ? (
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
                          <div style={{ paddingLeft: "15px" }}>
                            <h5 style={mediumBold}>ADDRESS</h5>
                            <h6>{application.address}</h6>
                            <h6>
                              {application.city},{application.zip}
                            </h6>

                            <h5 style={mediumBold}>APPLICATION STATUS</h5>
                            {application.application_status === "ENDED" ||
                              application.application_status === "REFUSED" ? (
                              <h6 style={{ mediumBold, color: "red" }}>
                                {application.application_status}
                              </h6>
                            ) : null
                            }
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
