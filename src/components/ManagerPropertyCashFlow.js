import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { gray, green, red, mediumBold, small, xSmall } from "../utils/styles";
import ArrowUp from "../icons/ArrowUp.svg";
import ArrowDown from "../icons/ArrowDown.svg";
import Add from "../icons/Add.svg";

function ManagerPropertyCashFlow(props) {
  const { property, state } = props;
  const { setShowCreateExpense } = state;

  const [expandRevenue, setExpandRevenue] = useState(false);
  const [expandExpenses, setExpandExpenses] = useState(false);

  const [revenue, setRevenue] = useState("");
  const [expense, setExpense] = useState("");
  const [maintenance, setMaintenance] = useState("");

  console.log(property);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const addExpense = (e) => {
    e.stopPropagation();
    setShowCreateExpense(true);
  };

  let revenueTotal = 0;
  let expenseTotal = 0;

  let maintenanceTotal = 0;

  useEffect(() => {
    console.log("in useeffect");
    if (property.manager_revenue !== undefined) {
      if (property.manager_revenue.length == 0) {
      } else if (property.manager_revenue.length == 1) {
        revenueTotal += property.manager_revenue[0].amount_due;
      } else {
        for (const or of property.manager_revenue) {
          revenueTotal += or.amount_due;
        }
      }
    }

    console.log("in useeffect", revenueTotal);
    if (property.manager_expense !== undefined) {
      if (property.manager_expense.length == 0) {
      } else if (property.manager_expense.length == 1) {
        if (property.manager_expense[0].purchase_type == "RENT") {
          expenseTotal += property.management_expenses;
        } else {
          expenseTotal += property.manager_expense[0].amount_due;
        }
      } else {
        for (const or of property.manager_expense) {
          if (or.purchase_type == "RENT") {
            expenseTotal += property.management_expenses;
          } else {
            expenseTotal += or.amount_due;
          }
        }
      }
    }

    console.log("in useeffect", expenseTotal);
    setRevenue(revenueTotal);
    setExpense(expenseTotal);
    setMaintenance(maintenanceTotal);
  });

  const cashFlow = (revenue - expense).toFixed(2);

  return (
    <div>
      <Row
        className="mx-2 my-2 p-3"
        style={{
          background:
            revenue > expense
              ? "#3DB727 0% 0% no-repeat padding-box"
              : "#E3441F 0% 0% no-repeat padding-box",
          boxShadow: "0px 3px 3px #00000029",
          borderRadius: "20px",
        }}
      >
        <Col
          style={{
            font: "normal normal normal 20px Bahnschrift-Regular",
            color: "#ffffff",
          }}
        >
          Cash Flow
        </Col>
        <Col className="text-center  d-flex flex-row justify-content-between align-items-center">
          <Col
            style={{
              font: "normal normal normal 20px Bahnschrift-Regular",
              color: "#ffffff",
            }}
          >
            ${cashFlow}
          </Col>
          <Col></Col>
        </Col>
      </Row>
      <Row
        onClick={() => setExpandRevenue(!expandRevenue)}
        className="mx-2 my-2 p-3"
        style={{
          background: "#3DB727 0% 0% no-repeat padding-box",
          boxShadow: "0px 3px 3px #00000029",
          borderRadius: "20px",
        }}
      >
        <Col
          style={{
            font: "normal normal normal 20px Bahnschrift-Regular",
            color: "#ffffff",
          }}
        >
          Revenue
        </Col>
        <Col className="text-center  d-flex flex-row justify-content-between align-items-center">
          <Col
            style={{
              font: "normal normal normal 20px Bahnschrift-Regular",
              color: "#ffffff",
            }}
          >
            ${revenue.toFixed(2)}
          </Col>
          <Col></Col>
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
              {property.rental_revenue !== 0 ? (
                <Row>
                  <Col>
                    <p style={{ ...small, ...mediumBold }} className=" m-1">
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
                </Row>
              ) : (
                ""
              )}
              {property.extraCharges_revenue !== 0 ? (
                <Row
                // style={{
                //   background:
                //     i % 2 === 0
                //       ? "#FFFFFF 0% 0% no-repeat padding-box"
                //       : "#F3F3F3 0% 0% no-repeat padding-box",
                // }}
                >
                  <Col>
                    <p style={{ ...small, ...mediumBold }} className=" m-1">
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
                </Row>
              ) : (
                ""
              )}

              <Row
                style={{
                  background: "#F3F3F3 0% 0% no-repeat padding-box",
                }}
              >
                <Col>
                  <p style={{ ...small, ...mediumBold }} className=" m-1">
                    Total
                  </p>
                </Col>
                <Col>
                  <p style={{ ...small, ...green }} className="text-center m-1">
                    {revenue}
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
        onClick={() => setExpandExpenses(!expandExpenses)}
        className="mx-2 my-2 p-3"
        style={{
          background: "#E3441F 0% 0% no-repeat padding-box",
          boxShadow: "0px 3px 3px #00000029",
          borderRadius: "20px",
        }}
      >
        <Col
          style={{
            font: "normal normal normal 20px Bahnschrift-Regular",
            color: "#ffffff",
          }}
        >
          Expenses
        </Col>
        <Col className="text-center  d-flex flex-row justify-content-between align-items-center">
          <Col
            style={{
              font: "normal normal normal 20px Bahnschrift-Regular",
              color: "#ffffff",
            }}
          >
            ${expense.toFixed(2)}
          </Col>
          <Col>
            <img
              style={{ width: "20px" }}
              src={Add}
              alt="Add Expense"
              onClick={addExpense}
            />
          </Col>
        </Col>
      </Row>

      <div>
        {expandExpenses ? (
          <div>
            {property.manager_expense.length >= 1 ? (
              <Container
                style={{ border: "1px solid #707070", borderRadius: "5px" }}
              >
                <Row>
                  <Col>
                    <p
                      style={{
                        ...gray,
                        ...small,
                      }}
                      className="m-1"
                    >
                      Expenses
                    </p>
                  </Col>
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

                <div>
                  {property.maintenance_expenses !== 0 ? (
                    <Row
                      style={
                        {
                          // background:
                          //   i % 2 === 0
                          //     ? "#FFFFFF 0% 0% no-repeat padding-box"
                          //     : "#F3F3F3 0% 0% no-repeat padding-box",
                        }
                      }
                    >
                      <Col>
                        <p
                          style={{
                            ...small,
                            ...mediumBold,
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
                    </Row>
                  ) : (
                    ""
                  )}
                  {property.management_expenses !== 0 ? (
                    <Row
                      style={
                        {
                          // background:
                          //   i % 2 === 0
                          //     ? "#FFFFFF 0% 0% no-repeat padding-box"
                          //     : "#F3F3F3 0% 0% no-repeat padding-box",
                        }
                      }
                    >
                      <Col>
                        <p
                          style={{
                            ...small,
                            ...mediumBold,
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
                      {console.log(property.management_expenses)}
                    </Row>
                  ) : (
                    ""
                  )}

                  {property.repairs_expenses !== 0 ? (
                    <Row
                      style={
                        {
                          // background:
                          //   i % 2 === 0
                          //     ? "#FFFFFF 0% 0% no-repeat padding-box"
                          //     : "#F3F3F3 0% 0% no-repeat padding-box",
                        }
                      }
                    >
                      <Col>
                        <p
                          style={{
                            ...small,
                            ...mediumBold,
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
                    </Row>
                  ) : (
                    ""
                  )}
                </div>

                <Row
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                  }}
                >
                  <Col>
                    <p style={{ ...small, ...mediumBold }} className=" m-1">
                      Total
                    </p>
                  </Col>
                  <Col>
                    <p
                      style={{ ...small, ...red }}
                      className="text-center m-1 pt-1"
                    >
                      {expense}
                    </p>
                  </Col>
                </Row>
              </Container>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default ManagerPropertyCashFlow;
