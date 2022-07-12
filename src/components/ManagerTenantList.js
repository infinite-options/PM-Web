import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Header from "../components/Header";
import AppContext from "../AppContext";
import { get, put } from "../utils/api";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import {
  mediumBold,
  subHeading,
  redRight,
  subText,
  blueRight,
  blue,
  smallImg,
  hidden,
  gray,
  pillButton,
} from "../utils/styles";

function ManagerTenantList(props) {
  const navigate = useNavigate();

  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [tenants, setTenants] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState([]);
  const [userPayments, setUserPayments] = React.useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const fetchTenants = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length < 1) {
      console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
    } else {
      management_buid = management_businesses[0].business_uid;
    }

    const response = await get(
      `/managerPropertyTenants?manager_id=` + management_buid
    );

    if (response.msg === "Token has expired") {
      refresh();
      return;
    }

    // console.log(response.result);
    setTenants(response.result);
    setSelectedTenant(response.result[0]);

    setUserPayments(response.result[0].user_payments);
    setMaintenanceRequests(response.result[0].user_repairRequests);
    console.log(selectedTenant);
    // await getAlerts(properties_unique)
  };
  console.log(showDetails);
  useEffect(fetchTenants, [access_token]);
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  const paymentsByMonth = {};
  for (const payment of userPayments) {
    const month = moment(payment.payment_date).format("MMMM YYYY");
    if (month in paymentsByMonth) {
      paymentsByMonth[month].total += payment.amount;
      paymentsByMonth[month].payments.push(payment);
    } else {
      paymentsByMonth[month] = {
        total: payment.amount,
        payments: [payment],
      };
    }
  }
  const sortedMonths = Object.keys(paymentsByMonth).sort((a, b) => {
    const aDate = moment(a);
    const bDate = moment(b);
    if (aDate < bDate) return 1;
    else if (aDate > bDate) return -1;
    else return 0;
  });
  for (const month of sortedMonths) {
    paymentsByMonth[month].payments = paymentsByMonth[month].payments.sort(
      (a, b) => {
        const aDate = moment(a.payment_date);
        const bDate = moment(b.payment_date);
        if (aDate < bDate) return 1;
        else if (aDate > bDate) return -1;
        else return 0;
      }
    );
  }
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

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
    <div
      className="pb-5 mb-5 h-100"
      style={{
        background: "#E9E9E9 0% 0% no-repeat padding-box",
        borderRadius: "10px",
        opacity: 1,
      }}
    >
      <Header
        title="Tenant Info"
        leftText="<Back"
        leftFn={() =>
          showDetails ? setShowDetails(false) : navigate("/manager")
        }
      />
      <div
        className="mx-2 my-2 p-3"
        hidden={showDetails}
        style={{
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        {tenants.map((tenant, i) => (
          <Container
            key={i}
            className="my-3 p-2"
            style={{
              boxShadow: " 0px 1px 6px #00000029",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedTenant(tenant);
              setUserPayments(tenant.user_payments);
              setMaintenanceRequests(tenant.user_repairRequests);
              setShowDetails(true);
            }}
          >
            <Row className="p-1">
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0" style={mediumBold}>
                    {tenant.tenant_first_name} {tenant.tenant_last_name}
                  </h5>
                </div>
              </Col>
            </Row>
            <Row className="px-1 mb-1">
              <Col
                style={{
                  color: "#777777",
                  font: "normal normal normal 14px Bahnschrift-Regular",
                }}
              >
                {tenant.address}
                {tenant.unit !== "" ? " " + tenant.unit : ""}, <br />
                {tenant.city}, {tenant.state} {tenant.zip}
              </Col>

              <Col>
                <div className="d-flex  justify-content-end ">
                  <div
                    style={tenant.tenant_id ? {} : hidden}
                    onClick={stopPropagation}
                  >
                    <a href={`tel:${tenant.tenant_phone_number}`}>
                      <img src={Phone} alt="Phone" style={smallImg} />
                    </a>
                    <a href={`mailto:${tenant.tenant_email}`}>
                      <img src={Message} alt="Message" style={smallImg} />
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        ))}
        <hr />
        <div className="text-center">Tenant Applications</div>
      </div>
      {showDetails ? (
        <div
          className="mx-2 my-2 p-3"
          hidden={!showDetails}
          style={{
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            borderRadius: "10px",
            opacity: 1,
          }}
        >
          <Row className="p-1">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0" style={mediumBold}>
                  {selectedTenant.tenant_first_name}{" "}
                  {selectedTenant.tenant_last_name}
                </h5>
              </div>
            </Col>
          </Row>
          <Row className="px-1 mb-1">
            <Col
              style={{
                color: "#777777",
                font: "normal normal normal 14px Bahnschrift-Regular",
              }}
            >
              {selectedTenant.address}
              {selectedTenant.unit !== ""
                ? " " + selectedTenant.unit
                : ""}, <br />
              {selectedTenant.city}, {selectedTenant.state} {selectedTenant.zip}
            </Col>

            <Col>
              <div className="d-flex  justify-content-end ">
                <div
                  style={selectedTenant.tenant_id ? {} : hidden}
                  onClick={stopPropagation}
                >
                  <a href={`tel:${selectedTenant.tenant_phone_number}`}>
                    <img src={Phone} alt="Phone" style={smallImg} />
                  </a>
                  <a href={`mailto:${selectedTenant.tenant_email}`}>
                    <img src={Message} alt="Message" style={smallImg} />
                  </a>
                </div>
              </div>
            </Col>
          </Row>
          <Row
            className="d-flex justify-content-center my-2"
            style={mediumBold}
          >
            Payment History
          </Row>
          {userPayments.length > 0 ? (
            <Container
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                boxShadow: "0px 3px 6px #00000029",
                border: "0.5px solid #707070",
                borderRadius: "5px",
              }}
            >
              {userPayments.map((payment) => (
                <div
                  className="my-3 p-2"
                  style={{
                    boxShadow: " 0px 1px 6px #00000029",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  <Row style={mediumBold} className="mx-2">
                    <Col>
                      {payment.description}{" "}
                      {payment.purchase_notes && `(${payment.purchase_notes})`}
                    </Col>
                  </Row>
                  <Row className="mx-2">
                    <Col style={subText}>
                      {moment(payment.payment_date).format("MMM D, YYYY")}
                    </Col>
                    <Col style={blueRight} className="mt-2">
                      {formatter.format(payment.amount)}
                    </Col>
                  </Row>
                </div>
              ))}
            </Container>
          ) : (
            <Container className="d-flex my-2">No payments made</Container>
          )}

          <Row
            className="px-1 my-3"
            style={{
              font: "normal normal normal 16px Bahnschrift-Regular",
            }}
          >
            <Col>Rent due:</Col>
            <Col>
              <h6 className="d-flex justify-content-end">
                {`${ordinal_suffix_of(selectedTenant.due_by)} of the month`}
              </h6>
            </Col>
          </Row>
          <Row
            className="d-flex justify-content-center my-2"
            style={mediumBold}
          >
            Repair Requests
          </Row>
          {maintenanceRequests.length > 0 ? (
            <Container>
              {maintenanceRequests.map((request) => (
                <div
                  className="my-3 p-2"
                  style={{
                    boxShadow: " 0px 1px 6px #00000029",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  <Row style={mediumBold} className="mx-2">
                    <Col>{request.title}</Col>
                    <Col>{request.business_name}</Col>
                  </Row>
                  <Row className="mx-2">
                    {request.request_status === "COMPLETED" ? (
                      <Col
                        style={{
                          font: "normal normal normal 12px Bahnschrift-Regular",
                          color: "#007AFF",
                        }}
                      >
                        Completed on:{" "}
                        {new Date(request.scheduled_date).toLocaleDateString(
                          "en-us",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </Col>
                    ) : request.request_status === "SCHEDULED" ? (
                      <Col
                        style={{
                          font: "normal normal normal 12px Bahnschrift-Regular",
                          color: "#E3441F",
                        }}
                      >
                        Scheduled for:{" "}
                        {new Date(request.scheduled_date).toLocaleDateString(
                          "en-us",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </Col>
                    ) : (
                      <Col
                        style={{
                          font: "normal normal normal 12px Bahnschrift-Regular",
                          color: "#007AFF",
                        }}
                      >
                        Requested on:{" "}
                        {new Date(
                          request.request_created_date.split(" ")[0]
                        ).toLocaleDateString("en-us", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Col>
                    )}
                  </Row>
                </div>
              ))}
            </Container>
          ) : (
            <Container className="d-flex my-2">No repairs requested</Container>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default ManagerTenantList;
