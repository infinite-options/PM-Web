import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Carousel, Row } from "react-bootstrap";
import Header from "../components/Header";
import {
  green,
  bolder,
  red,
  xSmall,
  smallLine,
  mediumBold,
  redPillButton,
  small,
  gray,
} from "../utils/styles";
import SearchProperties from "../icons/SearchProperties.svg";
import Tenants from "../icons/Tenants.svg";
import AppContext from "../AppContext";
import { get } from "../utils/api";

function ManagerOverview(props) {
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;

  const { properties, maintenanceRequests } = props;
  const [alerts, setAlerts] = useState({
    repairs: [],
    applications: [],
    count: 0,
  });

  const [expandRevenue, setExpandRevenue] = useState(false);
  const [expandExpenses, setExpandExpenses] = useState(false);

  const [expandAccountPayable, setExpandAccountPayable] = useState(false);

  let revenueTotal = 0;
  console.log(properties);
  for (const item of properties) {
    console.log(item.property_uid);
    if (item.manager_revenue !== undefined) {
      if (item.manager_revenue.length == 0) {
      } else if (item.manager_revenue.length == 1) {
        revenueTotal += item.manager_revenue[0].amount_paid;
      } else {
        for (const or of item.manager_revenue) {
          revenueTotal += or.amount_paid;
        }
      }
    }
  }

  let expenseTotal = 0;
  let rentTotal = 0;
  for (const item of properties) {
    if (item.manager_expense !== undefined) {
      if (item.manager_expense.length == 0) {
      } else if (item.manager_expense.length == 1) {
        if (item.manager_expense[0].purchase_type == "RENT") {
          expenseTotal += item.management_expenses;
        } else {
          expenseTotal += item.manager_expense[0].amount_paid;
        }
      } else {
        for (const or of item.manager_expense) {
          if (or.purchase_type == "RENT") {
            rentTotal = item.management_expenses;
          } else {
            expenseTotal += or.amount_paid;
          }
        }
        expenseTotal = expenseTotal + rentTotal;
      }
    }
  }

  let revenueExpectedTotal = 0;

  for (const item of properties) {
    console.log(item.property_uid);
    if (item.manager_expected_revenue !== undefined) {
      if (item.manager_expected_revenue.length == 0) {
      } else if (item.manager_expected_revenue.length == 1) {
        revenueExpectedTotal += item.manager_expected_revenue[0].amount_due;
      } else {
        for (const or of item.manager_expected_revenue) {
          revenueExpectedTotal += or.amount_due;
        }
      }
    }
  }

  let expenseExpectedTotal = 0;
  let rentExpectedTotal = 0;
  for (const item of properties) {
    if (item.manager_expected_expense !== undefined) {
      if (item.manager_expected_expense.length == 0) {
      } else if (item.manager_expected_expense.length == 1) {
        if (item.manager_expected_expense[0].purchase_type == "RENT") {
          expenseExpectedTotal += item.management_expected_expenses;
        } else {
          expenseExpectedTotal += item.manager_expected_expense[0].amount_due;
        }
      } else {
        for (const or of item.manager_expected_expense) {
          if (or.purchase_type == "RENT") {
            rentExpectedTotal = item.management_expected_expenses;
          } else {
            expenseExpectedTotal += or.amount_due;
          }
        }
        expenseExpectedTotal = expenseExpectedTotal + rentExpectedTotal;
      }
    }
  }
  console.log(revenueExpectedTotal, expenseExpectedTotal);

  useEffect(() => {
    if (userData.access_token === null) {
      navigate("/");
    }
  }, []);
  const cashFlow = (revenueTotal - expenseTotal).toFixed(2);
  const cashFlowExpected = (
    revenueExpectedTotal - expenseExpectedTotal
  ).toFixed(2);
  const unique_clients = [...new Set(properties.map((item) => item.owner_id))]
    .length;
  const property_count = properties.length;

  return (
    <div style={{ background: "#E9E9E9 0% 0% no-repeat padding-box" }}>
      <Header title="PM Dashboard" />
      <Container className="px-3 pb-5 mb-5">
        <div
          className="p-2 my-3"
          style={{
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            borderRadius: "10px",
            opacity: 1,
          }}
        >
          <Row
            className="mx-2 mt-4 p-3"
            style={{
              background: "#007AFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
            onClick={() => navigate("/owner-list")}
          >
            <Col xs={8} style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              Owners
            </Col>
            <Col style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              {unique_clients}
            </Col>
          </Row>

          <Row
            className="mx-2 mt-4 p-3"
            style={{
              background: "#007AFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
            onClick={() => navigate("/manager-properties")}
          >
            <Col xs={8} style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              Properties
            </Col>
            <Col style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              {property_count}
            </Col>
          </Row>

          <Row
            className="mx-2 mt-4 p-3"
            style={{
              background:
                revenueTotal > expenseTotal
                  ? "#3DB727 0% 0% no-repeat padding-box"
                  : "#E3441F 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col xs={8} style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              MTD Cash Flow
            </Col>
            <Col style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              ${cashFlow}
            </Col>
          </Row>

          <Row
            className="mx-2 mt-4 p-3"
            style={{
              background: "#3DB727 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
            onClick={() => setExpandRevenue(!expandRevenue)}
          >
            <Col xs={8} style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              MTD Revenue
            </Col>
            <Col style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              ${revenueTotal.toFixed(2)}
            </Col>
          </Row>
          <div>
            {expandRevenue ? (
              <div>
                <Container
                  style={{ border: "1px solid #707070", borderRadius: "5px" }}
                >
                  <Row>
                    <Col />
                    <Col>
                      <p
                        style={{
                          ...gray,
                          ...small,
                        }}
                        className="text-center m-1"
                      >
                        MTD($)
                      </p>
                    </Col>
                  </Row>
                  {properties.map((property, i) => {
                    return (
                      <div>
                        {(property.rental_revenue !== undefined &&
                          property.rental_revenue !== 0) ||
                        (property.extraCharges_revenue !== undefined &&
                          property.extraCharges_revenue !== 0) ? (
                          <Row
                            style={{
                              background:
                                i % 2 === 0
                                  ? "#FFFFFF 0% 0% no-repeat padding-box"
                                  : "#F3F3F3 0% 0% no-repeat padding-box",
                            }}
                          >
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...mediumBold,
                                  font: "normal normal bold 12px Helvetica-Bold",
                                }}
                                className=" m-1"
                              >
                                {property.address}, {property.unit}
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{ ...small, ...green }}
                                className="text-center m-1"
                              ></p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}

                        {property.rental_revenue !== undefined &&
                        property.rental_revenue !== 0 ? (
                          <Row
                            style={{
                              background:
                                i % 2 === 0
                                  ? "#FFFFFF 0% 0% no-repeat padding-box"
                                  : "#F3F3F3 0% 0% no-repeat padding-box",
                            }}
                          >
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...mediumBold,
                                  font: "normal normal bold 12px Helvetica-Bold",
                                }}
                                className=" mx-3 my-1"
                              >
                                Rent
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{ ...small, ...green }}
                                className="text-center m-1"
                              >
                                {property.rental_revenue.toFixed(2)}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.extraCharges_revenue !== undefined &&
                        property.extraCharges_revenue !== 0 ? (
                          <Row
                            style={{
                              background:
                                i % 2 === 0
                                  ? "#FFFFFF 0% 0% no-repeat padding-box"
                                  : "#F3F3F3 0% 0% no-repeat padding-box",
                            }}
                          >
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...mediumBold,
                                  font: "normal normal bold 12px Helvetica-Bold",
                                }}
                                className=" mx-3 my-1"
                              >
                                Extra Charges
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{ ...small, ...green }}
                                className="text-center m-1"
                              >
                                {property.extraCharges_revenue.toFixed(2)}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })}

                  <Row
                    style={{
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                    }}
                  >
                    <Col>
                      <p
                        style={{
                          ...small,
                          ...mediumBold,
                          font: "normal normal bold 12x Helvetica-Bold",
                        }}
                        className=" m-1"
                      >
                        Total
                      </p>
                    </Col>
                    <Col>
                      <p
                        style={{ ...small, ...green }}
                        className="text-center m-1"
                      >
                        {revenueTotal.toFixed(2)}
                      </p>
                    </Col>
                  </Row>
                </Container>
              </div>
            ) : (
              ""
            )}
          </div>
          <Row
            className="mx-2 mt-4 p-3"
            style={{
              background: "#E3441F 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
            onClick={() => setExpandExpenses(!expandExpenses)}
          >
            <Col xs={8} style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              MTD Expenses
            </Col>
            <Col style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              {" "}
              ${expenseTotal.toFixed(2)}
            </Col>
          </Row>
          <div>
            {expandExpenses ? (
              <div>
                <Container
                  style={{ border: "1px solid #707070", borderRadius: "5px" }}
                >
                  <Row>
                    <Col />
                    <Col>
                      <p
                        style={{
                          ...gray,
                          ...small,
                        }}
                        className="text-center m-1"
                      >
                        MTD($)
                      </p>
                    </Col>
                  </Row>
                  {properties.map((property, i) => {
                    return (property.maintenance_expenses !== undefined &&
                      property.maintenance_expenses) ||
                      (property.management_expenses !== undefined &&
                        property.management_expenses !== 0) ||
                      (property.repairs_expenses !== undefined &&
                        property.repairs_expenses !== 0) ? (
                      <div>
                        {console.log(
                          property.maintenance_expenses,
                          property.management_expenses,
                          property.repairs_expenses
                        )}
                        <Row
                          style={{
                            background:
                              i % 2 === 0
                                ? "#FFFFFF 0% 0% no-repeat padding-box"
                                : "#F3F3F3 0% 0% no-repeat padding-box",
                          }}
                        >
                          <Col xs={6}>
                            <p
                              style={{
                                ...small,
                                ...mediumBold,
                                font: "normal normal bold 12px Helvetica-Bold",
                              }}
                              className="m-1"
                            >
                              {property.address}, {property.unit}
                            </p>
                          </Col>
                          <Col>
                            <p
                              style={{ ...small, ...red }}
                              className="text-center m-1 pt-1"
                            ></p>
                          </Col>
                        </Row>
                        {property.maintenance_expenses !== 0 &&
                        property.maintenance_expenses !== undefined ? (
                          <Row
                            style={{
                              background:
                                i % 2 === 0
                                  ? "#FFFFFF 0% 0% no-repeat padding-box"
                                  : "#F3F3F3 0% 0% no-repeat padding-box",
                            }}
                          >
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...mediumBold,
                                  font: "normal normal bold 12px Helvetica-Bold",
                                }}
                                className=" mx-3 my-1"
                              >
                                Maintenance
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...red,
                                }}
                                className="text-center m-1 pt-1"
                              >
                                {property.maintenance_expenses.toFixed(2)}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.management_expenses !== 0 &&
                        property.management_expenses !== undefined ? (
                          <Row
                            style={{
                              background:
                                i % 2 === 0
                                  ? "#FFFFFF 0% 0% no-repeat padding-box"
                                  : "#F3F3F3 0% 0% no-repeat padding-box",
                            }}
                          >
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...mediumBold,
                                  font: "normal normal bold 12px Helvetica-Bold",
                                }}
                                className=" mx-3 my-1"
                              >
                                Owner Return
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...red,
                                }}
                                className="text-center m-1 pt-1"
                              >
                                {property.management_expenses.toFixed(2)}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}

                        {property.repairs_expenses !== 0 &&
                        property.repairs_expenses !== undefined ? (
                          <Row
                            style={{
                              background:
                                i % 2 === 0
                                  ? "#FFFFFF 0% 0% no-repeat padding-box"
                                  : "#F3F3F3 0% 0% no-repeat padding-box",
                            }}
                          >
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...mediumBold,
                                  font: "normal normal bold 12px Helvetica-Bold",
                                }}
                                className="mx-3 my-1"
                              >
                                Repairs
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...red,
                                }}
                                className="text-center m-1 pt-1"
                              >
                                {property.repairs_expenses.toFixed(2)}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    );
                  })}

                  <Row
                    style={{
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                    }}
                  >
                    <Col>
                      <p
                        style={{
                          ...small,
                          ...mediumBold,
                          font: "normal normal bold 12px Helvetica-Bold",
                        }}
                        className=" m-1"
                      >
                        Total
                      </p>
                    </Col>
                    <Col>
                      <p
                        style={{ ...small, ...red }}
                        className="text-center m-1 pt-1"
                      >
                        {expenseTotal.toFixed(2)}
                      </p>
                    </Col>
                  </Row>
                </Container>
              </div>
            ) : (
              ""
            )}
          </div>
          <Row
            className="mx-2 mt-4 p-3"
            style={{
              background:
                revenueExpectedTotal > expenseExpectedTotal
                  ? "#3DB727 0% 0% no-repeat padding-box"
                  : "#E3441F 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
            onClick={() => setExpandAccountPayable(!expandAccountPayable)}
          >
            <Col xs={8} style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              Expected Cash Flow
            </Col>
            <Col style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              {" "}
              ${cashFlowExpected}
            </Col>
          </Row>
          <div>
            {expandAccountPayable ? (
              <div>
                <Container
                  style={{ border: "1px solid #707070", borderRadius: "5px" }}
                >
                  <Row>
                    <Col />
                    <Col>
                      <p
                        style={{
                          ...gray,
                          ...small,
                        }}
                        className="text-center m-1"
                      >
                        MTD($)
                      </p>
                    </Col>
                  </Row>
                  {properties.map((property, i) => {
                    return (property.maintenance_expected_expenses !==
                      undefined &&
                      property.maintenance_expected_expenses) ||
                      (property.management_expected_expenses !== undefined &&
                        property.management_expected_expenses !== 0) ||
                      (property.repairs_expected_expenses !== undefined &&
                        property.repairs_expected_expenses !== 0) ||
                      (property.rental_expected_revenue !== undefined &&
                        property.rental_expected_revenue !== 0) ||
                      (property.extraCharges_expected_revenue !== undefined &&
                        property.extraCharges_expected_revenue !== 0) ? (
                      <div>
                        <Row
                          style={{
                            background:
                              i % 2 === 0
                                ? "#FFFFFF 0% 0% no-repeat padding-box"
                                : "#F3F3F3 0% 0% no-repeat padding-box",
                          }}
                        >
                          <Col xs={6}>
                            <p
                              style={{
                                ...small,
                                ...mediumBold,
                                font: "normal normal bold 12px Helvetica-Bold",
                              }}
                              className="m-1"
                            >
                              {property.address}, {property.unit}
                            </p>
                          </Col>
                          <Col>
                            <p
                              style={{ ...small, ...red }}
                              className="text-center m-1 pt-1"
                            ></p>
                          </Col>
                        </Row>
                        {property.rental_expected_revenue !== undefined &&
                        property.rental_expected_revenue !== 0 ? (
                          <Row
                            style={{
                              background:
                                i % 2 === 0
                                  ? "#FFFFFF 0% 0% no-repeat padding-box"
                                  : "#F3F3F3 0% 0% no-repeat padding-box",
                            }}
                          >
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...mediumBold,
                                  font: "normal normal bold 12px Helvetica-Bold",
                                }}
                                className="mx-3 my-1"
                              >
                                Rent
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...green,
                                }}
                                className="text-center m-1 pt-1"
                              >
                                {property.rental_expected_revenue.toFixed(2)}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.extraCharges_expected_revenue !== undefined &&
                        property.extraCharges_expected_revenue !== 0 ? (
                          <Row
                            style={{
                              background:
                                i % 2 === 0
                                  ? "#FFFFFF 0% 0% no-repeat padding-box"
                                  : "#F3F3F3 0% 0% no-repeat padding-box",
                            }}
                          >
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...mediumBold,
                                  font: "normal normal bold 12px Helvetica-Bold",
                                }}
                                className="mx-3 my-1"
                              >
                                Extra Charges
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{ ...small, ...green }}
                                className="text-center m-1"
                              >
                                {property.extraCharges_expected_revenue.toFixed(
                                  2
                                )}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.maintenance_expected_expenses !== 0 &&
                        property.maintenance_expected_expenses !== undefined ? (
                          <Row
                            style={{
                              background:
                                i % 2 === 0
                                  ? "#FFFFFF 0% 0% no-repeat padding-box"
                                  : "#F3F3F3 0% 0% no-repeat padding-box",
                            }}
                          >
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...mediumBold,
                                  font: "normal normal bold 12px Helvetica-Bold",
                                }}
                                className=" mx-3 my-1"
                              >
                                Maintenance
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...red,
                                }}
                                className="text-center m-1 pt-1"
                              >
                                {property.maintenance_expected_expenses.toFixed(
                                  2
                                )}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.management_expected_expenses !== 0 &&
                        property.management_expected_expenses !== undefined ? (
                          <Row
                            style={{
                              background:
                                i % 2 === 0
                                  ? "#FFFFFF 0% 0% no-repeat padding-box"
                                  : "#F3F3F3 0% 0% no-repeat padding-box",
                            }}
                          >
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...mediumBold,
                                  font: "normal normal bold 12px Helvetica-Bold",
                                }}
                                className=" mx-3 my-1"
                              >
                                Owner Return
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...red,
                                }}
                                className="text-center m-1 pt-1"
                              >
                                {property.management_expected_expenses.toFixed(
                                  2
                                )}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}

                        {property.repairs_expected_expenses !== 0 &&
                        property.repairs_expected_expenses !== undefined ? (
                          <Row
                            style={{
                              background:
                                i % 2 === 0
                                  ? "#FFFFFF 0% 0% no-repeat padding-box"
                                  : "#F3F3F3 0% 0% no-repeat padding-box",
                            }}
                          >
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...mediumBold,
                                  font: "normal normal bold 12px Helvetica-Bold",
                                }}
                                className="mx-3 my-1"
                              >
                                Repairs
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{
                                  ...small,
                                  ...red,
                                }}
                                className="text-center m-1 pt-1"
                              >
                                {property.repairs_expected_expenses.toFixed(2)}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    );
                  })}
                </Container>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        {maintenanceRequests.length > 0 ? (
          <Carousel
            id="owner-bills"
            interval={null}
            controls={false}
            className="mx-2 p-3 "
            style={{
              background: "#007AFF 0% 0% no-repeat padding-box",
            }}
          >
            {maintenanceRequests.map((request) => {
              return request.request_status === "SCHEDULED" ? (
                <Carousel.Item className="px-2 pb-3 ">
                  <div
                    style={{
                      textAlign: "left",
                      font: "normal normal bold 22px Bahnschrift-Bold",
                      color: "#ffffff",
                    }}
                  >
                    Upcoming Repairs:
                  </div>
                  <div
                    style={{
                      textAlign: "left",
                      font: "normal normal normal 16px Bahnschrift-Regular",
                      color: "#ffffff",
                      textTransform: "capitalize",
                    }}
                  >
                    {request.title} is scheduled for{" "}
                    {new Date(request.scheduled_date).toLocaleDateString(
                      "en-us",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </div>

                  {properties.map((property) => {
                    return property.property_uid === request.property_uid ? (
                      <div
                        style={{
                          textAlign: "left",
                          font: "normal normal normal 16px Bahnschrift-Regular",
                          color: "#ffffff",
                          textTransform: "capitalize",
                        }}
                      >
                        {" "}
                        {property.address}
                        {property.unit !== "" ? ` ${property.unit}, ` : ", "}
                        {property.city}, {property.state} {property.zip}{" "}
                      </div>
                    ) : null;
                  })}
                </Carousel.Item>
              ) : null;
            })}
          </Carousel>
        ) : (
          ""
        )}

        <div
          className="mx-2 p-3 "
          style={{
            background: "#F3F3F3 0% 0% no-repeat padding-box",
          }}
        >
          <div
            style={{
              textAlign: "left",
              font: "normal normal bold 22px Bahnschrift-Bold",
              color: "#007AFF",
            }}
          >
            Resident Announcements {">"}
          </div>
        </div>
        <div>
          <Row className="mx-1 mt-2 px-2">
            <Col
              onClick={() => navigate("/properties")}
              className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
              style={{
                height: "87px",
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                boxShadow: "0px 3px 3px #00000029",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              <Col>
                <img
                  src={SearchProperties}
                  alt="Property"
                  style={{ width: "50px" }}
                />
              </Col>
              <Col>
                <p
                  style={{ ...xSmall, ...smallLine, ...mediumBold }}
                  className="mb-0"
                >
                  Search for Properties
                </p>
              </Col>
            </Col>

            <Col
              onClick={() => {
                navigate("/tenant-list");
              }}
              className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
              style={{
                height: "87px",
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                boxShadow: "0px 3px 3px #00000029",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              <Col>
                <img src={Tenants} alt="Document" style={{ width: "50px" }} />
              </Col>
              <Col>
                <p
                  style={{ ...xSmall, ...smallLine, ...mediumBold }}
                  className="mb-0"
                >
                  Tenants
                </p>
              </Col>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default ManagerOverview;
