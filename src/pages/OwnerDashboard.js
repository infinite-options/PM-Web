import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Header from "../components/Header";
import Emergency from "../icons/Emergency.svg";
import Document from "../icons/Document.svg";
import Property from "../icons/Property.svg";
import Repair from "../icons/Repair.svg";
import UserSearch from "../icons/UserSearch.svg";
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

function OwnerDashboard(props) {
  const { setStage, properties } = props;
  const [expandRevenue, setExpandRevenue] = React.useState(false);
  const [expandExpenses, setExpandExpenses] = React.useState(false);
  const [expandProperties, setExpandProperties] = React.useState(false);

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
      console.log(
        item.property_uid,
        typeof item.taxes,
        JSON.parse(item.taxes)[0].amount
      );
      expenseTotal += Number(JSON.parse(item.taxes)[0].amount);
    }
  }
  console.log(expenseTotal);

  const cashFlow = revenueTotal - expenseTotal;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div style={{ background: "#E9E9E9 0% 0% no-repeat padding-box" }}>
      <Header title="Dashboard" />
      <Container className="px-3 pb-5 mb-5">
        <div
          className="px-2 p-2"
          style={{
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            borderRadius: "10px",
            opacity: 1,
          }}
        >
          <h5 style={mediumBold}>Overview</h5>
          <Row
            className="mx-2 my-2 p-3"
            style={{
              background: "#93EE9C 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
            onClick={() => setExpandProperties(!expandProperties)}
          >
            <Col style={mediumBold}>Properties</Col>
            <Col style={mediumBold}>{properties.length}</Col>
          </Row>
          {expandProperties ? (
            <div>
              <Container
                style={{ border: "1px solid #707070", borderRadius: "5px" }}
              >
                <Row>
                  <Col>
                    <p style={{ ...small }} className=" m-1">
                      Properties
                    </p>
                  </Col>
                </Row>

                {properties.map((property, i) => {
                  return (
                    <Row
                      style={{
                        background:
                          i % 2 === 0
                            ? "#FFFFFF 0% 0% no-repeat padding-box"
                            : "#F3F3F3 0% 0% no-repeat padding-box",
                      }}
                    >
                      <Col>
                        <p style={{ ...small, ...mediumBold }} className=" m-1">
                          {property.address} {property.unit}, {property.city},{" "}
                          {property.state} {property.zip}
                        </p>
                      </Col>
                    </Row>
                  );
                })}
              </Container>
            </div>
          ) : (
            ""
          )}
          <Row
            className="mx-2 my-2 p-3"
            style={{
              background:
                revenueTotal > expenseTotal
                  ? "#93EE9C 0% 0% no-repeat padding-box"
                  : "#FFBCBC 0% 0% no-repeat padding-box",
              // background: "#93EE9C 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col style={mediumBold}>Cash Flow</Col>
            <Col style={mediumBold}>${cashFlow}</Col>
          </Row>
          <Row
            className="mx-2 my-2 p-3"
            style={{
              background: "#93EE9C 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
            onClick={() => setExpandRevenue(!expandRevenue)}
          >
            <Col style={mediumBold}>Revenue</Col>
            <Col style={mediumBold}>${revenueTotal}</Col>
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
                      <p
                        style={{ ...gray, ...small }}
                        className="text-center m-1"
                      >
                        YTD
                      </p>
                    </Col>
                  </Row>
                  {properties.map((property, i) => {
                    return property.owner_revenue.length >= 1 ? (
                      <div>
                        {console.log(i)}
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
                              style={{ ...small, ...mediumBold }}
                              className=" m-1"
                            >
                              {property.address}
                            </p>
                          </Col>
                          {/* <Col>
                            <p
                              style={{ ...small, ...red }}
                              className="text-center m-1"
                            ></p>
                          </Col> */}
                          <Col>
                            <p
                              style={{ ...small, ...red }}
                              className="text-center m-1"
                            ></p>
                          </Col>
                        </Row>
                        {property.owner_revenue.map((owr) => {
                          return owr.purchase_type === "RENT" ? (
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
                    );
                  })}

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
                        style={{ ...small, ...green }}
                        className="text-center m-1"
                      >
                        {revenueTotal}
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
            className="mx-2 my-2 p-3"
            style={{
              background: "#FFBCBC 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
            onClick={() => setExpandExpenses(!expandExpenses)}
          >
            <Col style={mediumBold}>Expenses</Col>
            <Col style={mediumBold}>${expenseTotal}</Col>
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
                  {properties.map((property, i) => {
                    return property.owner_expense.length >= 1 ||
                      property.mortgages !== null ||
                      property.taxes !== null ? (
                      <div>
                        {console.log(i)}
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
                              style={{ ...small, ...mediumBold }}
                              className=" m-1"
                            >
                              {property.address}
                            </p>
                          </Col>
                          {/* <Col>
                            <p
                              style={{ ...small, ...red }}
                              className="text-center m-1"
                            ></p>
                          </Col> */}
                          <Col>
                            <p
                              style={{ ...small, ...red }}
                              className="text-center m-1"
                            ></p>
                          </Col>
                        </Row>
                        {property.owner_expense.length >= 1
                          ? property.owner_expense.map((owe) => {
                              return (
                                <Row
                                  style={{
                                    background:
                                      i % 2 === 0
                                        ? "#FFFFFF 0% 0% no-repeat padding-box"
                                        : "#F3F3F3 0% 0% no-repeat padding-box",
                                  }}
                                >
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
                                      style={{
                                        ...small,
                                        ...red,
                                        ...mediumBold,
                                      }}
                                      className="text-center m-1 pt-1"
                                    >
                                      {owe.amount_paid}
                                    </p>
                                  </Col>
                                  <Col>
                                    <p
                                      style={{
                                        ...small,
                                        ...red,
                                        ...mediumBold,
                                      }}
                                      className="text-center m-1 pt-1"
                                    ></p>
                                  </Col>
                                </Row>
                              );
                            })
                          : ""}
                        {property.mortgages !== null ? (
                          <Row
                            style={{
                              background:
                                i % 2 === 0
                                  ? "#FFFFFF 0% 0% no-repeat padding-box"
                                  : "#F3F3F3 0% 0% no-repeat padding-box",
                            }}
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
                            <Col xs={4}>
                              <p
                                style={{ ...small, ...red, ...mediumBold }}
                                className="text-center m-1 pt-1"
                              >
                                {JSON.parse(property.mortgages).amount}
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{ ...small, ...red, ...mediumBold }}
                                className="text-center m-1 pt-1"
                              ></p>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.taxes !== null ? (
                          <Row
                            style={{
                              background:
                                i % 2 === 0
                                  ? "#FFFFFF 0% 0% no-repeat padding-box"
                                  : "#F3F3F3 0% 0% no-repeat padding-box",
                            }}
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
                                style={{ ...small, ...red, ...mediumBold }}
                                className="text-center m-1 pt-1"
                              >
                                {JSON.parse(property.taxes)[0].amount}
                              </p>
                            </Col>
                            <Col>
                              <p
                                style={{ ...small, ...red, ...mediumBold }}
                                className="text-center m-1 pt-1"
                              ></p>
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
                      <p style={{ ...small, ...mediumBold }} className=" m-1">
                        Total
                      </p>
                    </Col>
                    <Col>
                      <p
                        style={{ ...small, ...red }}
                        className="text-center m-1"
                      >
                        {expenseTotal}
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

        <Row className="px-2">
          <Col
            onClick={() => setStage("PROPERTIES")}
            className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
            style={{
              height: "87px",
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col>
              <img src={Property} alt="Property" style={{ width: "50px" }} />
            </Col>
            <Col>
              <p
                style={{ ...xSmall, ...smallLine, ...mediumBold }}
                className="mb-0"
              >
                {"    "}
                Properties
              </p>
            </Col>
          </Col>
          <Col
            className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
            style={{
              height: "87px",
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col>
              <img src={Document} alt="Document" style={{ width: "50px" }} />
            </Col>
            <Col>
              <p
                style={{ ...xSmall, ...smallLine, ...mediumBold }}
                className="mb-0"
              >
                Lease <br /> Documents
              </p>
            </Col>
          </Col>
        </Row>
        <Row className="px-2">
          <Col
            className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
            style={{
              height: "87px",
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col>
              <img src={Document} alt="Document" style={{ width: "50px" }} />
            </Col>
            <Col>
              {" "}
              <p
                style={{ ...xSmall, ...smallLine, ...mediumBold }}
                className="mb-0"
              >
                Manager <br /> Documents
              </p>
            </Col>
          </Col>
          <Col
            className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
            style={{
              height: "87px",
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col>
              <img src={Repair} alt="Repair" style={{ width: "50px" }} />
            </Col>
            <Col>
              <p
                style={{ ...xSmall, ...smallLine, ...mediumBold }}
                className="mb-0"
              >
                Request a <br /> Repair
              </p>
            </Col>
          </Col>
        </Row>
        <Row className="px-2">
          <Col
            className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
            style={{
              height: "87px",
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col>
              <img src={Emergency} alt="Emergency" style={{ width: "50px" }} />
            </Col>
            <Col>
              <p
                style={{ ...xSmall, ...smallLine, ...mediumBold }}
                className="mb-0"
              >
                Emergency
              </p>
            </Col>
          </Col>
          <Col
            className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
            style={{
              height: "87px",
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col>
              <img src={UserSearch} alt="Search" style={{ width: "50px" }} />
            </Col>
            <Col>
              <p
                style={{ ...xSmall, ...smallLine, ...mediumBold }}
                className="mb-0"
              >
                Search <br /> Property <br /> Managers
              </p>
            </Col>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OwnerDashboard;
