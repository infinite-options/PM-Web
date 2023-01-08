import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Footer from "./Footer";
import DueExpenseItem from "./DueExpenseItem";
import { Navigate } from "react-router-dom";
import {
  greenPill,
  redPill,
  bluePill,
  bluePillButton,
  payNowButton,
} from "../utils/styles";
import { isCompositeComponent } from "react-dom/test-utils";

function TenantDuePayments(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedProperty = location.state.selectedProperty;
  const [tenantExpenses, setTenantExpenses] = useState([]);
  const [duePayments, setDuePayments] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [purchaseUIDs, setPurchaseUIDs] = useState([]);
  let tempDuePayments = [];
  let tempUpcomingPayments = [];
  const [totalSum, setTotalSum] = useState(0);
  let includedUIDs = [];
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
  const parseExpenses = () => {
    let tempMonth = 0;
    let tempDate = 0;
    let tempYear = 0;
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    const currentYear = new Date().getFullYear();
    for (let expense of tenantExpenses) {
      console.log(expense);
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
      if (expense.purchase_status === "UNPAID" && dueDate > currentDate) {
        tempUpcomingPayments.push(expense);
      }
      if (expense.purchase_status === "UNPAID" && dueDate <= currentDate) {
        tempDuePayments.push(expense);
      }
    }
  };

  const addPayment = (purchaseUID, checked) => {
    let tempPurchaseUID = purchaseUIDs;
    if (checked) {
      tempPurchaseUID.push(purchaseUID);
    } else {
      for (let uid in purchaseUIDs) {
        if (purchaseUIDs[uid] === purchaseUID) {
          purchaseUIDs.splice(uid, 1);
        }
      }
    }
    console.log(tempPurchaseUID);
    setPurchaseUIDs(tempPurchaseUID);
  };

  const calculateTotal = (input, checked) => {
    let total = totalSum;

    if (checked) {
      total += input;
    } else {
      total -= input;
    }
    setTotalSum(total);
  };

  useEffect(() => {
    console.log("This is the selected property", selectedProperty);
    setTenantExpenses(selectedProperty.property.tenantExpenses);
    parseExpenses();
    setDuePayments(tempDuePayments);
    setUpcomingPayments(tempUpcomingPayments);
    console.log("Upcoming payments", upcomingPayments);
  }, [tenantExpenses]);

  useEffect(() => {
    console.log("Due payments", duePayments);
    console.log("Upcoming payments", upcomingPayments);
  }, [duePayments, upcomingPayments]);

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
        <div className="w-100 mb-5 overflow-scroll">
          <Header
            customClass={"mb-2"}
            title="Due Payments"
            leftText={`< Back`}
            leftFn={() => navigate("/tenant")}
          />
          <Container
            style={{
              borderRadius: "10px",
              margin: "2%",
              backgroundColor: "white",
              width: "96%",
              minHeight: "90%",
            }}
          >
            {/* ========= Property Name ========== */}
            <Row
              style={{
                height: "40px",
                fontSize: "24px",
                fontFamily: "bahnschrift",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  fontSize: "24px",
                  padding: "10px",
                  borderRadius: "10px 10px 0px 0px",
                }}
              >
                {selectedProperty.property.address}
              </div>
            </Row>

            <Row>
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "20px",
                  fontSize: "20px",
                }}
              >
                Due Payments
              </div>
            </Row>

            {/* ========= List of due expenses ========== */}
            {duePayments.length > 0 ? (
              <Row>
                <div style={{ marginTop: "28px", height: "auto" }}>
                  <div
                    style={{
                      border: "solid",
                      borderBottom: "none",
                      display: "flex",
                      flexDirection: "row",
                      width: "98%",
                      margin: "0% 1% 0% 1%",
                      height: "40px",
                      borderRadius: "10px 10px 0 0",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "0px",
                        width: "50px",
                        textAlign: "center",
                        fontSize: "20px",
                      }}
                    >
                      Pay?
                    </div>
                    <div
                      style={{
                        marginRight: "0px",
                        width: "90px",
                        textAlign: "center",
                        fontSize: "20px",
                      }}
                    >
                      Amount
                    </div>
                    <div
                      style={{
                        marginRight: "0px",
                        width: "90px",
                        textAlign: "center",
                        fontSize: "20px",
                      }}
                    >
                      Due
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "20px",
                        width: "130px",
                      }}
                    >
                      Reason
                    </div>
                  </div>
                  <div
                    style={{
                      border: "solid",
                      borderTop: "none",
                      width: "98%",
                      margin: "0% 1% 0% 1%",
                      borderRadius: "0px 0px 10px 10px",
                    }}
                  >
                    {duePayments.length > 8 ? (
                      <ul
                        style={{
                          overflowY: "visible",
                          listStyle: "none",
                          overflow: "scroll",
                          overflowX: "hidden",
                          padding: "0px",
                        }}
                      >
                        {duePayments.map((expense, i) => {
                          if (!includedUIDs.includes(expense.purchase_uid)) {
                            includedUIDs.push(expense.purchase_uid);
                            return (
                              <DueExpenseItem
                                expense={expense}
                                calculate={calculateTotal}
                                add={addPayment}
                              />
                            );
                          }
                        })}
                      </ul>
                    ) : (
                      <ul
                        style={{
                          overflowY: "hidden",
                          listStyle: "none",
                          overflow: "scroll",
                          overflowX: "hidden",
                          padding: "0px",
                        }}
                      >
                        {duePayments.map((expense, i) => {
                          if (!includedUIDs.includes(expense.purchase_uid)) {
                            includedUIDs.push(expense.purchase_uid);
                            return (
                              <DueExpenseItem
                                expense={expense}
                                calculate={calculateTotal}
                                add={addPayment}
                              />
                            );
                          }
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </Row>
            ) : null}
            <Row>
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "20px",
                  fontSize: "20px",
                }}
              >
                Upcoming Payments
              </div>
            </Row>
            {upcomingPayments.length > 0 ? (
              <Row>
                <div style={{ marginTop: "28px", height: "auto" }}>
                  <div
                    style={{
                      border: "solid",
                      borderBottom: "none",
                      display: "flex",
                      flexDirection: "row",
                      width: "98%",
                      margin: "0% 1% 0% 1%",
                      height: "40px",
                      borderRadius: "10px 10px 0 0",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "0px",
                        width: "50px",
                        textAlign: "center",
                        fontSize: "20px",
                      }}
                    >
                      Pay?
                    </div>
                    <div
                      style={{
                        marginRight: "0px",
                        width: "90px",
                        textAlign: "center",
                        fontSize: "20px",
                      }}
                    >
                      Amount
                    </div>
                    <div
                      style={{
                        marginRight: "0px",
                        width: "90px",
                        textAlign: "center",
                        fontSize: "20px",
                      }}
                    >
                      Due
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "20px",
                        width: "130px",
                      }}
                    >
                      Reason
                    </div>
                  </div>
                  <div
                    style={{
                      border: "solid",
                      borderTop: "none",
                      width: "98%",
                      margin: "0% 1% 0% 1%",
                      borderRadius: "0px 0px 10px 10px",
                    }}
                  >
                    {upcomingPayments.length > 8 ? (
                      <ul
                        style={{
                          overflowY: "visible",
                          listStyle: "none",
                          overflow: "scroll",
                          overflowX: "hidden",
                          padding: "0px",
                        }}
                      >
                        {upcomingPayments.map((expense, i) => {
                          if (!includedUIDs.includes(expense.purchase_uid)) {
                            includedUIDs.push(expense.purchase_uid);
                            return (
                              <DueExpenseItem
                                expense={expense}
                                calculate={calculateTotal}
                                add={addPayment}
                              />
                            );
                          }
                        })}
                      </ul>
                    ) : (
                      <ul
                        style={{
                          overflowY: "hidden",
                          listStyle: "none",
                          overflow: "scroll",
                          overflowX: "hidden",
                          padding: "0px",
                        }}
                      >
                        {upcomingPayments.map((expense, i) => {
                          if (!includedUIDs.includes(expense.purchase_uid)) {
                            includedUIDs.push(expense.purchase_uid);
                            return (
                              <DueExpenseItem
                                expense={expense}
                                calculate={calculateTotal}
                                add={addPayment}
                              />
                            );
                          }
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </Row>
            ) : null}

            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <hr style={{ width: "100%" }}></hr>

            <Row>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "76%",
                  marginBottom: "10px",
                }}
              >
                <div style={{ alignSelf: "right" }}>Total: </div>
                <div style={{ alignItem: "right" }}>${totalSum}</div>
              </div>
            </Row>
            <Row>
              {totalSum > 0 ? (
                <button
                  style={{ ...payNowButton }}
                  onClick={() => {
                    navigate(`/paymentPage/${purchaseUIDs[0]}`, {
                      state: {
                        amount: totalSum,
                        selectedProperty: selectedProperty,
                        purchaseUIDs: purchaseUIDs,
                      },
                    });
                  }}
                >
                  Pay Now
                </button>
              ) : (
                <Row>
                  <div
                    style={{
                      width: "80%",
                      margin: "5% 13.2%",
                      fontSize: "20px",
                      color: "red",
                      textAlign: "center",
                    }}
                  >
                    Total must be greater than $0
                  </div>
                  <button style={payNowButton} disabled>
                    Pay Now
                  </button>
                </Row>
              )}
            </Row>
          </Container>
        </div>
      </div>
      <div hidden={responsive.showSidebar} className="w-100 mt-3">
        <TenantFooter />
      </div>
    </div>
  );
}

export default TenantDuePayments;
