import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { gray, green, red, mediumBold, small, xSmall } from "../utils/styles";
import ArrowUp from "../icons/ArrowUp.svg";
import ArrowDown from "../icons/ArrowDown.svg";
import Add from "../icons/Add.svg";

function PropertyCashFlow(props) {
  const { property, state } = props;
  const { setShowCreateExpense, setShowCreateTax, setShowCreateMortgage } =
    state;

  const [expandRevenue, setExpandRevenue] = React.useState(false);
  const [expandExpenses, setExpandExpenses] = React.useState(false);
  const [expandTaxes, setExpandTaxes] = React.useState(false);
  const [expandMortgage, setExpandMortgage] = React.useState(false);
  const [revenue, setRevenue] = useState("");
  const [expense, setExpense] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [mortgage, setMortgage] = useState("");
  const [tax, setTax] = useState("");

  console.log(property);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const addExpense = (e) => {
    e.stopPropagation();
    setShowCreateExpense(true);
  };
  const addTax = (e) => {
    e.stopPropagation();
    setShowCreateTax(true);
  };
  const addMortgage = (e) => {
    e.stopPropagation();
    setShowCreateMortgage(true);
  };

  let revenueTotal = 0;
  let expenseTotal = 0;
  let mortgageTotal = 0;
  let taxTotal = 0;
  let maintenanceTotal = 0;
  useEffect(() => {
    console.log("in useeffect");
    if (property.owner_revenue.length == 0) {
    } else if (property.owner_revenue.length == 1) {
      revenueTotal += property.owner_revenue[0].amount_paid;
    } else {
      for (const or of property.owner_revenue) {
        revenueTotal += or.amount_paid;
      }
    }
    setRevenue(revenueTotal);
    console.log("in useeffect", revenueTotal);
    if (property.owner_expense.length == 0) {
    } else if (property.owner_expense.length == 1) {
      expenseTotal += property.owner_expense[0].amount_paid;
      maintenanceTotal += property.owner_expense[0].amount_paid;
    } else {
      for (const or of property.owner_expense) {
        expenseTotal += or.amount_paid;
        maintenanceTotal += or.amount_paid;
      }
    }
    if (property.mortgages !== null) {
      expenseTotal += Number(JSON.parse(property.mortgages).amount);
      mortgageTotal += Number(JSON.parse(property.mortgages).amount);
    }
    if (property.taxes !== null) {
      console.log(
        property.property_uid,
        typeof property.taxes,
        JSON.parse(property.taxes)[0].amount
      );
      expenseTotal += Number(JSON.parse(property.taxes)[0].amount);
      taxTotal += Number(JSON.parse(property.taxes)[0].amount);
    }
    console.log("in useeffect", expenseTotal);
    setExpense(expenseTotal);
    setMaintenance(maintenanceTotal);
    setMortgage(mortgageTotal);
    setTax(taxTotal);
  });

  const cashFlow = revenue - expense;

  return (
    <div>
      <Row
        className="mx-2 my-2 p-3"
        style={{
          background:
            revenue > expense
              ? "#93EE9C 0% 0% no-repeat padding-box"
              : "#FFBCBC 0% 0% no-repeat padding-box",
          boxShadow: "0px 3px 3px #00000029",
          borderRadius: "20px",
        }}
      >
        <Col style={mediumBold}>Cash Flow</Col>
        <Col className="text-center  d-flex flex-row justify-content-between align-items-center">
          <Col style={mediumBold}>${cashFlow}</Col>
          <Col></Col>
        </Col>
      </Row>
      <Row
        onClick={() => setExpandRevenue(!expandRevenue)}
        className="mx-2 my-2 p-3"
        style={{
          background: "#93EE9C 0% 0% no-repeat padding-box",
          boxShadow: "0px 3px 3px #00000029",
          borderRadius: "20px",
        }}
      >
        <Col style={mediumBold}>Revenue</Col>
        <Col className="text-center  d-flex flex-row justify-content-between align-items-center">
          <Col style={mediumBold}>${revenue}</Col>
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
                    MTD
                  </p>
                </Col>
                <Col>
                  <p style={{ ...gray, ...small }} className="text-center m-1">
                    YTD
                  </p>
                </Col>
              </Row>
              {property.owner_revenue.length >= 1 ? (
                <div>
                  {property.owner_revenue.map((owr) => {
                    return owr.purchase_type === "RENT" ? (
                      <Row style={{}}>
                        <Col>
                          <p
                            style={{ ...small, ...mediumBold }}
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
                            {owr.amount_paid}
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
                      <Row style={{}}>
                        <Col>
                          <p
                            style={{ ...small, ...mediumBold }}
                            className=" m-1"
                          >
                            Fees
                          </p>
                        </Col>
                        <Col>
                          <p
                            style={{ ...small, ...green }}
                            className="text-center m-1"
                          >
                            {owr.amount_paid}
                          </p>
                        </Col>
                        <Col>
                          <p
                            style={{ ...small, ...green }}
                            className="text-center m-1"
                          ></p>
                        </Col>
                      </Row>
                    );
                  })}
                </div>
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
                <Col>
                  <p
                    style={{ ...small, ...green }}
                    className="text-center m-1"
                  ></p>
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
          background: "#FFBCBC 0% 0% no-repeat padding-box",
          boxShadow: "0px 3px 3px #00000029",
          borderRadius: "20px",
        }}
      >
        <Col style={mediumBold}>Expenses</Col>
        <Col className="text-center  d-flex flex-row justify-content-between align-items-center">
          <Col style={mediumBold}>${expense}</Col>
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
            {property.owner_expense.length >= 1 ? (
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
                      MTD
                    </p>
                  </Col>
                  <Col>
                    <p
                      style={{ ...gray, ...small }}
                      className="text-center m-1"
                    >
                      YTD
                    </p>
                  </Col>
                </Row>

                <div>
                  {property.owner_expense.length >= 1
                    ? property.owner_expense.map((owe) => {
                        return (
                          <Row>
                            <Col xs={4}>
                              <p
                                style={{
                                  ...small,
                                  ...mediumBold,
                                }}
                                className=" m-1"
                              >
                                {owe.purchase_type}
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{ ...small, ...red }}
                                className="text-center m-1"
                              >
                                {owe.amount_paid}
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{ ...small, ...red }}
                                className="text-center m-1"
                              ></p>
                            </Col>
                          </Row>
                        );
                      })
                    : ""}
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
                    <p style={{ ...small, ...red }} className="text-center m-1">
                      {maintenance}
                    </p>
                  </Col>
                  <Col>
                    <p
                      style={{ ...small, ...red }}
                      className="text-center m-1"
                    ></p>
                  </Col>
                </Row>
              </Container>
            ) : (
              ""
            )}
            <Row
              onClick={() => setExpandMortgage(!expandMortgage)}
              className="mx-2 my-2 p-3"
              style={{
                background: "#FFBCBC 0% 0% no-repeat padding-box",
                boxShadow: "0px 3px 3px #00000029",
                borderRadius: "20px",
              }}
            >
              <Col style={mediumBold}>Mortgage</Col>
              <Col className="text-center  d-flex flex-row justify-content-between align-items-center">
                <Col style={mediumBold}>${mortgage}</Col>
                <Col>
                  <img
                    style={{ width: "20px" }}
                    src={Add}
                    alt="Add Mortgage"
                    onClick={addMortgage}
                  />
                </Col>
              </Col>
            </Row>
            <div>
              {expandMortgage && property.mortgages !== null ? (
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
                          MTD
                        </p>
                      </Col>
                      <Col>
                        <p
                          style={{ ...gray, ...small }}
                          className="text-center m-1"
                        >
                          YTD
                        </p>
                      </Col>
                    </Row>
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
                      <Col xs={4}>
                        <p
                          style={{
                            ...small,
                            ...mediumBold,
                          }}
                          className=" m-1"
                        >
                          Mortgages
                        </p>
                      </Col>
                      <Col>
                        <p
                          style={{ ...small, ...red }}
                          className="text-center m-1"
                        >
                          {JSON.parse(property.mortgages).amount}
                        </p>
                      </Col>
                      <Col>
                        <p
                          style={{ ...small, ...red }}
                          className="text-center m-1"
                        ></p>
                      </Col>
                    </Row>
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
                          className="text-center m-1"
                        >
                          {mortgage}
                        </p>
                      </Col>
                      <Col>
                        <p
                          style={{ ...small, ...red }}
                          className="text-center m-1"
                        ></p>
                      </Col>
                    </Row>
                  </Container>
                </div>
              ) : (
                ""
              )}
            </div>
            <Row
              onClick={() => setExpandTaxes(!expandTaxes)}
              className="mx-2 my-2 p-3"
              style={{
                background: "#FFBCBC 0% 0% no-repeat padding-box",
                boxShadow: "0px 3px 3px #00000029",
                borderRadius: "20px",
              }}
            >
              <Col style={mediumBold}>Taxes</Col>
              <Col className="text-center  d-flex flex-row justify-content-between align-items-center">
                <Col style={mediumBold}>${tax}</Col>
                <Col>
                  <img
                    style={{ width: "20px" }}
                    src={Add}
                    alt="Add Tax"
                    onClick={addTax}
                  />
                </Col>
              </Col>
            </Row>
            <div>
              {expandTaxes && property.taxes !== null ? (
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
                          MTD
                        </p>
                      </Col>
                      <Col>
                        <p
                          style={{ ...gray, ...small }}
                          className="text-center m-1"
                        >
                          YTD
                        </p>
                      </Col>
                    </Row>
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
                      <Col xs={4}>
                        <p
                          style={{
                            ...small,
                            ...mediumBold,
                          }}
                          className=" m-1"
                        >
                          Taxes
                        </p>
                      </Col>
                      <Col>
                        <p
                          style={{ ...small, ...red }}
                          className="text-center m-1"
                        >
                          {JSON.parse(property.taxes)[0].amount}
                        </p>
                      </Col>
                      <Col>
                        <p
                          style={{ ...small, ...red }}
                          className="text-center m-1"
                        ></p>
                      </Col>
                    </Row>
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
                          className="text-center m-1"
                        >
                          {tax}
                        </p>
                      </Col>
                      <Col>
                        <p
                          style={{ ...small, ...red }}
                          className="text-center m-1"
                        ></p>
                      </Col>
                    </Row>
                  </Container>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default PropertyCashFlow;
