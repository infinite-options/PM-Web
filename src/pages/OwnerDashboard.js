import React, { useState } from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  tileImg,
  xSmall,
  smallLine,
  mediumBold,
  green,
  red,
  gray,
  small,
} from "../utils/styles";
import "./owner.css";
import OwnerPaymentPage from "../components/OwnerPaymentPage";
import OwnerProperties from "./OwnerProperties";
function OwnerDashboard(props) {
  const { properties, bills, setShowFooter, fetchProperties } = props;
  const navigate = useNavigate();

  const [stage, setStage] = React.useState("DASHBOARD");
  const [expandRevenue, setExpandRevenue] = useState(false);
  const [expandExpenses, setExpandExpenses] = useState(false);
  const [expandProperties, setExpandProperties] = useState(false);

  const [totalSum, setTotalSum] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [purchaseUID, setPurchaseUID] = useState("");

  let revenueTotal = 0;
  for (const item of properties) {
    if (item.owner_revenue.length == 0) {
    } else if (item.owner_revenue.length == 1) {
      revenueTotal += item.owner_revenue[0].amount_paid;
    } else {
      for (const or of item.owner_revenue) {
        revenueTotal += or.amount_paid;
      }
    }
  }

  let expenseTotal = 0;
  for (const item of properties) {
    if (item.owner_expense.length == 0) {
    } else if (item.owner_expense.length == 1) {
      expenseTotal += item.owner_expense[0].amount_paid;
    } else {
      for (const or of item.owner_expense) {
        expenseTotal += or.amount_paid;
      }
    }
    if (item.mortgages !== null) {
      expenseTotal += Number(JSON.parse(item.mortgages).amount);
    }
    if (item.taxes !== null) {
      for (const or of JSON.parse(item.taxes)) {
        expenseTotal += Number(or.amount);
      }
      // expenseTotal += Number(JSON.parse(item.taxes)[0].amount);
    }
  }

  let yearExpenseTotal = 0;
  for (const item of properties) {
    console.log(item);
    if (item.year_expense !== 0) {
      console.log(item.year_expense);
      yearExpenseTotal += item.year_expense;
    }
  }

  let yearRevenueTotal = 0;
  for (const item of properties) {
    if (item.year_revenue !== 0) {
      console.log(item.year_revenue);
      yearRevenueTotal += item.year_revenue;
    }
  }

  const cashFlow = revenueTotal - expenseTotal;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return stage === "DASHBOARD" ? (
    <div
      className="h-100"
      style={{ background: "#E9E9E9 0% 0% no-repeat padding-box" }}
    >
      <Header title="Owner Dashboard" />
      <Container className="px-3 pb-5 mb-5 ">
        <div
          className="px-2 p-2"
          style={{
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            borderRadius: "10px",
            opacity: 1,
          }}
        >
          <h5
            style={
              (mediumBold, { font: "normal normal bold 20px Helvetica-Bold" })
            }
          >
            Overview
          </h5>
          <Row
            className="mx-2 mt-4 p-3"
            style={{
              background: "#007AFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => setStage("PROPERTIES")}
            // onClick={() => setExpandProperties(!expandProperties)}
          >
            <Col
              style={
                (mediumBold,
                { font: "normal normal normal 20px Bahnschrift-Regular" })
              }
            >
              Properties
            </Col>
            <Col
              style={
                (mediumBold,
                { font: "normal normal normal 20px Bahnschrift-Regular" })
              }
            >
              {properties.length}
            </Col>
          </Row>

          <Row
            className="mx-2 mt-4 p-3"
            style={{
              background:
                revenueTotal > expenseTotal
                  ? "#3DB727 0% 0% no-repeat padding-box"
                  : "#E3441F 0% 0% no-repeat padding-box",
              // background: "#93EE9C 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
              color: "white",
            }}
          >
            <Col
              style={
                (mediumBold,
                { font: "normal normal normal 20px Bahnschrift-Regular" })
              }
            >
              Cash Flow
            </Col>
            <Col
              style={
                (mediumBold,
                { font: "normal normal normal 20px Bahnschrift-Regular" })
              }
            >
              ${cashFlow}
            </Col>
          </Row>
          <Row
            className="mx-2  mt-4 p-3"
            style={{
              background: "#3DB727 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => setExpandRevenue(!expandRevenue)}
          >
            <Col
              style={
                (mediumBold,
                { font: "normal normal normal 20px Bahnschrift-Regular" })
              }
            >
              Revenue
            </Col>
            <Col
              style={
                (mediumBold,
                { font: "normal normal normal 20px Bahnschrift-Regular" })
              }
            >
              ${revenueTotal}
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
                    <Col>
                      <p
                        style={{ ...gray, ...small }}
                        className="text-center m-1"
                      >
                        YTD($)
                      </p>
                    </Col>
                  </Row>
                  {properties.map((property, i) => {
                    return (
                      <div>
                        {property.extraCharges_revenue !== 0 ||
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
                                className=" m-1"
                              >
                                {property.address}
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{ ...small, ...green }}
                                className="text-center m-1"
                              ></p>
                            </Col>
                            <Col>
                              <p
                                style={{ ...small, ...green }}
                                className="text-center m-1 pt-1"
                              ></p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}

                        {property.rental_revenue !== 0 ? (
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
                                Rent
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{ ...small, ...green }}
                                className="text-center m-1"
                              >
                                {property.rental_revenue}
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{ ...small, ...green }}
                                className="text-center m-1"
                              >
                                {property.rental_year_revenue}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.extraCharges_revenue !== 0 ? (
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
                                Extra Charges
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{ ...small, ...green }}
                                className="text-center m-1"
                              >
                                {property.extraCharges_revenue}
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{ ...small, ...green }}
                                className="text-center m-1"
                              >
                                {property.extraCharges_year_revenue}
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
                        {revenueTotal}
                      </p>
                    </Col>
                    <Col>
                      <p
                        style={{ ...small, ...green }}
                        className="text-center m-1 "
                      >
                        {yearRevenueTotal}
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
            className="mx-2  mt-4 p-3"
            style={{
              background: "#E3441F 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => setExpandExpenses(!expandExpenses)}
          >
            <Col
              style={
                (mediumBold,
                { font: "normal normal normal 20px Bahnschrift-Regular" })
              }
            >
              Expenses
            </Col>
            <Col
              style={
                (mediumBold,
                { font: "normal normal normal 20px Bahnschrift-Regular" })
              }
            >
              ${expenseTotal}
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
                    <Col>
                      <p
                        style={{ ...gray, ...small }}
                        className="text-center m-1"
                      >
                        YTD($)
                      </p>
                    </Col>
                  </Row>
                  {properties.map((property, i) => {
                    return property.maintenance_expenses !== 0 ||
                      property.management_expenses !== 0 ||
                      property.insurance_expenses !== 0 ||
                      property.repairs_expenses !== 0 ||
                      property.mortgage_expenses !== 0 ||
                      property.taxes_expenses !== 0 ? (
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
                              {property.address}
                            </p>
                          </Col>
                          <Col>
                            <p
                              style={{ ...small, ...red }}
                              className="text-center m-1 pt-1"
                            ></p>
                          </Col>
                          <Col>
                            <p
                              style={{
                                ...small,
                                ...red,
                              }}
                              className="text-center m-1 pt-1"
                            ></p>
                          </Col>
                        </Row>
                        {property.maintenance_expenses !== 0 ? (
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
                                {property.maintenance_expenses}
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
                                {property.maintenance_year_expense}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.management_expenses !== 0 ? (
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
                                Management
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
                                {property.management_expenses}
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
                                {" "}
                                {property.management_year_expense}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.insurance_expenses !== 0 ? (
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
                                Insurance
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
                                {property.insurance_expenses}
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
                                {property.insurance_year_expense}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.repairs_expenses !== 0 ? (
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
                                {property.repairs_expenses}
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
                                {property.repairs_year_expense}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.mortgage_expenses !== 0 ? (
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
                                Mortgage
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
                                {property.mortgage_expenses}
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
                                {property.mortgage_year_expense}
                              </p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.taxes_expenses !== 0 ? (
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
                                Taxes
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
                                {property.tax_expenses}
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
                                {property.tax_year_expense}
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
                        {expenseTotal}
                      </p>
                    </Col>
                    <Col>
                      <p
                        style={{ ...small, ...red }}
                        className="text-center m-1 pt-1"
                      >
                        {yearExpenseTotal}
                      </p>
                    </Col>
                  </Row>
                </Container>
              </div>
            ) : (
              ""
            )}
          </div>
          <Carousel
            interval={null}
            className="mx-2 mt-4 p-3 "
            style={{
              background: "#F3F3F3 0% 0% no-repeat padding-box",
            }}
          >
            <Carousel.Item>
              <div
                style={{
                  textAlign: "center",
                  font: "normal normal bold 22px Bahnschrift-Bold",
                  color: "#007AFF",
                }}
              >
                Resident Announcements
              </div>
              <div className="mx-2 mt-4 mb-4 p-3 ">No Announcements</div>
            </Carousel.Item>
            <Carousel.Item>
              <div
                style={{
                  textAlign: "center",
                  font: "normal normal bold 22px Bahnschrift-Bold",
                  color: "#007AFF",
                }}
              >
                Resident Announcements
              </div>
              <div className="mx-2 mt-4 mb-4 p-3 ">No Announcements</div>
            </Carousel.Item>
          </Carousel>
          <Carousel
            interval={null}
            controls={false}
            id="owner-bills"
            className="mx-2 px-1 py-3 justify-content-center"
            style={{
              background: "#007AFF 0% 0% no-repeat padding-box",
              borderRadius: "0px 0px 10px 10px",
            }}
          >
            {bills.map((bill) => {
              return (
                <Carousel.Item>
                  <div
                    className="text-center mb-1 mx-2"
                    style={{
                      font: "normal normal bold 22px Bahnschrift-Bold",
                      color: "#ffffff",
                      textAlign: "left",
                    }}
                  >
                    Owner Bills
                  </div>

                  <Row className="text-center mb-1 mx-2">
                    <Col
                      xs={7}
                      style={{
                        font: "normal normal 16px Bahnschrift-Regular",
                        color: "#ffffff",
                        textAlign: "left",
                      }}
                    >
                      <div>
                        $ {bill.amount_due} - {bill.description}
                      </div>

                      <div className="mb-3">
                        {bill.address}
                        {bill.unit !== "" ? " " + bill.unit : ""}, <br />
                        {bill.city}, {bill.state} {bill.zip}
                      </div>
                    </Col>
                    <Col className="text-center">
                      <div
                        className="mb-3"
                        onClick={() => {
                          setStage("PAYBILL");
                          setTotalSum(bill.amount_due);
                          setSelectedProperty(bill);
                          setPurchaseUID(bill.purchase_uid);
                        }}
                        style={{
                          backgroundColor: "white",
                          color: "#007AFF",
                          border: "1px solid #007AFF",
                          borderRadius: "50px",
                          width: "92px",
                          cursor: "pointer",
                        }}
                      >
                        Pay Bill
                      </div>
                    </Col>
                  </Row>
                </Carousel.Item>
              );
            })}
          </Carousel>
        </div>
      </Container>
      {console.log("stage", stage)}
    </div>
  ) : stage === "PAYBILL" ? (
    <OwnerPaymentPage
      setStage={setStage}
      totalSum={totalSum}
      selectedProperty={selectedProperty}
      purchaseUID={purchaseUID}
    />
  ) : stage === "PROPERTIES" ? (
    <OwnerProperties
      setShowFooter={setShowFooter}
      properties={properties}
      fetchProperties={fetchProperties}
      selectedProperty={selectedProperty}
      setSelectedProperty={setSelectedProperty}
    />
  ) : (
    ""
  );
}

export default OwnerDashboard;
