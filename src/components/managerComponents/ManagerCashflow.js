import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import { Switch } from "@material-ui/core";
import AppContext from "../../AppContext";
import AddIcon from "../../icons/AddIcon.svg";
import SortLeft from "../../icons/Sort-left.svg";
import GreenUpArrow from "../../icons/GreenUpArrow.png";
import RedDownArrow from "../../icons/RedDownArrow.png";
import { get } from "../../utils/api";
import {
  headings,
  mediumBold,
  semiMediumBold,
  bold,
  smallPillButton,
  bluePillButton,
} from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

export default function ManagerCashflow(props) {
  const navigate = useNavigate();
  const classes = useStyles();

  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const { managerData, byProperty, propertyView, addExpense, setAddExpense } =
    props;

  const [isLoading, setIsLoading] = useState(true);
  const [managerID, setManagerID] = useState("");
  // monthly toggles
  const [toggleMonthlyCashFlow, setToggleMonthlyCashFlow] = useState(false);
  const [toggleMonthlyCashFlowProperty, setToggleMonthlyCashFlowProperty] =
    useState(false);
  // monthly revenue toggle
  const [toggleMonthlyRevenue, setToggleMonthlyRevenue] = useState(false);
  const [toggleMonthlyRent, setToggleMonthlyRent] = useState(false);
  const [toggleMonthlyExtra, setToggleMonthlyExtra] = useState(false);

  const [toggleMonthlyDeposit, setToggleMonthlyDeposit] = useState(false);
  const [toggleMonthlyUtility, setToggleMonthlyUtility] = useState(false);
  const [toggleMonthlyLateFee, setToggleMonthlyLateFee] = useState(false);

  const [toggleMonthlyManagement, setToggleMonthlyManagement] = useState(false);
  const [toggleMonthlyOwnerPaymentRent, setToggleMonthlyOwnerPaymentRent] =
    useState(false);
  const [toggleMonthlyOwnerPaymentExtra, setToggleMonthlyOwnerPaymentExtra] =
    useState(false);
  const [toggleMonthlyOwnerPaymentLate, setToggleMonthlyOwnerPaymentLate] =
    useState(false);
  const [toggleMonthlyMaintenanceRevenue, setToggleMonthlyMaintenanceRevenue] =
    useState(false);
  const [toggleMonthlyRepairsRevenue, setToggleMonthlyRepairsRevenue] =
    useState(false);
  // monthly expense toggle
  const [toggleMonthlyExpense, setToggleMonthlyExpense] = useState(false);
  const [toggleMonthlyMaintenance, setToggleMonthlyMaintenance] =
    useState(false);
  const [toggleMonthlyRepairs, setToggleMonthlyRepairs] = useState(false);
  const [toggleMonthlyMortgage, setToggleMonthlyMortgage] = useState(false);
  const [toggleMonthlyTaxes, setToggleMonthlyTaxes] = useState(false);
  const [toggleMonthlyInsurance, setToggleMonthlyInsurance] = useState(false);
  const [toggleMonthlyUtilityExpense, setToggleMonthlyUtilityExpense] =
    useState(false);
  // yearly toggles
  const [yearlyCashFlow, setYearlyCashFlow] = useState(false);

  const [revenue, setRevenue] = useState(null);
  const [revenueSummary, setRevenueSummary] = useState(null);
  const [expense, setExpense] = useState(null);

  const [expenseSummary, setExpenseSummary] = useState(null);
  const [filter, setFilter] = useState(false);

  const [month, setMonth] = useState(
    new Date().toLocaleString("default", {
      month: "long",
    })
  );
  const [year, setYear] = useState(
    new Date().toLocaleString("default", {
      year: "numeric",
    })
  );
  const [propertyID, setPropertyID] = useState([]);
  const [all, setAll] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("next_payment");
  const fetchCashflow = async () => {
    if (access_token === null || user.role.indexOf("MANAGER") === -1) {
      navigate("/");
      return;
    }
    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid;
    }
    const cashflowResponse = await get(
      `/CashflowManager?manager_id=${management_buid}&year=${year}`
    );
    setManagerID(management_buid);
    let currentRev = [];
    let currentRevSummary = [];
    let currentExp = [];
    let currentExpSummary = [];

    if (filter === false) {
      if (propertyView === false) {
        cashflowResponse.result.revenue.forEach((rev) => {
          if (rev.month === month) {
            currentRev.push(rev);
          }
        });
        cashflowResponse.result.revenue_summary.forEach((rev) => {
          if (rev.month === month) {
            currentRevSummary.push(rev);
          }
        });
        cashflowResponse.result.expense.forEach((rev) => {
          if (rev.month === month) {
            currentExp.push(rev);
          }
        });
        cashflowResponse.result.expense_summary.forEach((rev) => {
          if (rev.month === month) {
            currentExpSummary.push(rev);
          }
        });
      } else {
        cashflowResponse.result.revenue.forEach((rev) => {
          if (
            rev.month === month &&
            rev.property_uid === managerData[0].property_uid
          ) {
            currentRev.push(rev);
          }
        });
        cashflowResponse.result.revenue_unit.forEach((rev) => {
          if (
            rev.month === month &&
            rev.property_uid === managerData[0].property_uid
          ) {
            currentRevSummary.push(rev);
          }
        });
        cashflowResponse.result.expense.forEach((rev) => {
          if (
            rev.month === month &&
            rev.property_uid === managerData[0].property_uid
          ) {
            currentExp.push(rev);
          }
        });
        cashflowResponse.result.expense_unit.forEach((rev) => {
          if (
            rev.month === month &&
            rev.property_uid === managerData[0].property_uid
          ) {
            currentExpSummary.push(rev);
          }
        });
      }

      setRevenue(currentRev);
      setExpense(currentExp);
      setRevenueSummary(currentRevSummary);
      setExpenseSummary(currentExpSummary);
    } else {
      if (propertyView === false) {
        cashflowResponse.result.revenue.forEach((rev) => {
          if (rev.month === month) {
            currentRev.push(rev);
          }
        });
        cashflowResponse.result.revenue_unit.forEach((rev) => {
          if (rev.month === month) {
            currentRevSummary.push(rev);
          }
        });
        cashflowResponse.result.expense.forEach((rev) => {
          if (rev.month === month) {
            currentExp.push(rev);
          }
        });
        cashflowResponse.result.expense_unit.forEach((rev) => {
          if (rev.month === month) {
            currentExpSummary.push(rev);
          }
        });
      } else {
        cashflowResponse.result.revenue.forEach((rev) => {
          if (
            rev.month === month &&
            rev.property_uid === managerData[0].property_uid
          ) {
            currentRev.push(rev);
          }
        });
        cashflowResponse.result.revenue_unit.forEach((rev) => {
          if (
            rev.month === month &&
            rev.property_uid === managerData[0].property_uid
          ) {
            currentRevSummary.push(rev);
          }
        });
        cashflowResponse.result.expense.forEach((rev) => {
          if (
            rev.month === month &&
            rev.property_uid === managerData[0].property_uid
          ) {
            currentExp.push(rev);
          }
        });
        cashflowResponse.result.expense_unit.forEach((rev) => {
          if (
            rev.month === month &&
            rev.property_uid === managerData[0].property_uid
          ) {
            currentExpSummary.push(rev);
          }
        });
      }

      setRevenue(currentRev);
      setExpense(currentExp);
      setRevenueSummary(currentRevSummary);
      setExpenseSummary(currentExpSummary);
    }

    setIsLoading(false);
  };
  const fetchAllCashflow = async () => {
    if (access_token === null || user.role.indexOf("MANAGER") === -1) {
      navigate("/");
      return;
    }
    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid;
    }
    if (propertyView) {
      const cashflowResponseAll = await get(
        `/AllCashflowManager?property_id=${managerData[0].property_uid}`
      );

      setTransactions(cashflowResponseAll.result.slice().reverse());
    }
  };
  const toggleProperty = (property) => {
    const shownState = propertyID.slice();

    setToggleMonthlyCashFlowProperty(!toggleMonthlyCashFlowProperty);
    const index = shownState.indexOf(property);
    // console.log(index);
    if (index >= 0) {
      shownState.splice(index, 1);
      setPropertyID(shownState);
    } else {
      shownState.push(property);
      setPropertyID(shownState);
    }
  };
  const options = [];
  const minOffset = 0;
  const maxOffset = 60;
  for (let i = minOffset; i <= maxOffset; i++) {
    const year =
      new Date().toLocaleString("default", {
        year: "numeric",
      }) - i;
    options.push(<option value={year}>{year}</option>);
  }
  useEffect(() => {
    fetchCashflow();
    fetchAllCashflow();
  }, [year, month, filter]);

  return (
    <div className="w-100 overflow-hidden">
      <div className="flex-1">
        <div className="w-100 mb-5 overflow-scroll">
          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <Row className="m-3">
              <Col>
                <h3>
                  {propertyView ? "Property" : "Portfolio"} Cashflow Summary
                </h3>
              </Col>
              {propertyView ? (
                <Col xs={1}>
                  {" "}
                  {!all ? (
                    <button
                      style={bluePillButton}
                      onClick={() => {
                        setAll(!all);
                      }}
                    >
                      All
                    </button>
                  ) : (
                    <button
                      style={bluePillButton}
                      onClick={() => {
                        setAll(!all);
                      }}
                    >
                      CF
                    </button>
                  )}{" "}
                </Col>
              ) : (
                ""
              )}
              <Col xs={2}>
                <img
                  src={AddIcon}
                  alt="Add Icon"
                  onClick={() =>
                    propertyView
                      ? setAddExpense(true)
                      : setAddExpense("ADDEXPENSE")
                  }
                  style={{
                    width: "30px",
                    height: "30px",
                    float: "right",
                    marginRight: "3rem",
                  }}
                />
              </Col>
            </Row>
            {!all ? (
              <Row className="m-3">
                <Col xs={3} className="d-flex align-items-center">
                  {/* Month:&nbsp;&nbsp;&nbsp;&nbsp; */}
                  <select
                    value={month}
                    className="mt-1"
                    onChange={(e) => setMonth(e.currentTarget.value)}
                  >
                    <option value="">---</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </Col>
                <Col xs={2} className="d-flex align-items-center">
                  {/* Year:&nbsp;&nbsp;&nbsp;&nbsp; */}
                  <select
                    className="mt-1"
                    value={year}
                    onChange={(e) => setYear(e.currentTarget.value)}
                  >
                    {options}
                  </select>
                </Col>
                {byProperty ? (
                  <Col className="d-flex align-items-center">
                    Category
                    <Switch
                      checked={filter}
                      onChange={() => setFilter(!filter)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    Property
                  </Col>
                ) : (
                  <Col className="d-flex align-items-center">
                    Category
                    <Switch
                      checked={filter}
                      onChange={() => setFilter(!filter)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    Property
                  </Col>
                )}
              </Row>
            ) : (
              ""
            )}

            {!isLoading ? (
              filter === false && all === false ? (
                <Row className="m-3">
                  <Table
                    responsive="md"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
                    <TableHead>
                      <TableCell width="500px"></TableCell>
                      <TableCell align="right">To Date</TableCell>
                      <TableCell align="right">Expected</TableCell>
                      <TableCell align="right">Delta</TableCell>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell width="500px" style={headings}>
                          {month} {year}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            // hidden={toggleMonthlyCashFlow}
                            onClick={() => {
                              setToggleMonthlyCashFlow(!toggleMonthlyCashFlow);
                              setToggleMonthlyCashFlowProperty(
                                !toggleMonthlyCashFlowProperty
                              );
                              setToggleMonthlyRevenue(false);
                              setToggleMonthlyRent(false);
                              setToggleMonthlyDeposit(false);
                              setToggleMonthlyExtra(false);
                              setToggleMonthlyUtility(false);
                              setToggleMonthlyLateFee(false);
                              setToggleMonthlyOwnerPaymentRent(false);
                              setToggleMonthlyOwnerPaymentExtra(false);
                              setToggleMonthlyOwnerPaymentLate(false);
                              setToggleMonthlyMaintenanceRevenue(false);
                              setToggleMonthlyRepairsRevenue(false);
                              setToggleMonthlyExpense(false);
                              setToggleMonthlyManagement(false);
                              setToggleMonthlyMaintenance(false);
                              setToggleMonthlyRepairs(false);
                              setToggleMonthlyUtilityExpense(false);
                              setToggleMonthlyMortgage(false);
                              setToggleMonthlyTaxes(false);
                              setToggleMonthlyInsurance(false);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                              transform: toggleMonthlyCashFlow
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.2s ease-out",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {(
                            revenueSummary.reduce(function (prev, current) {
                              return prev + +current.amount_paid;
                            }, 0) -
                            expenseSummary.reduce(function (prev, current) {
                              return prev + +current.amount_paid;
                            }, 0)
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {" "}
                          {(
                            revenueSummary.reduce(function (prev, current) {
                              return prev + +current.amount_due;
                            }, 0) -
                            expenseSummary.reduce(function (prev, current) {
                              return prev + +current.amount_due;
                            }, 0)
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {(
                            revenueSummary.reduce(function (prev, current) {
                              return prev + +current.amount_due;
                            }, 0) -
                            revenueSummary.reduce(function (prev, current) {
                              return prev + +current.amount_paid;
                            }, 0) -
                            (expenseSummary.reduce(function (prev, current) {
                              return prev + +current.amount_due;
                            }, 0) -
                              expenseSummary.reduce(function (prev, current) {
                                return prev + +current.amount_paid;
                              }, 0))
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {/* revenue */}
                      <TableRow hidden={!toggleMonthlyCashFlow}>
                        <TableCell width="500px" style={mediumBold}>
                          &nbsp;&nbsp;Revenue
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            // hidden={toggleMonthlyRevenue}
                            onClick={() => {
                              setToggleMonthlyRevenue(!toggleMonthlyRevenue);
                              setToggleMonthlyRent(false);
                              setToggleMonthlyManagement(false);
                              setToggleMonthlyExtra(false);
                              setToggleMonthlyDeposit(false);
                              setToggleMonthlyUtility(false);
                              setToggleMonthlyLateFee(false);
                              setToggleMonthlyMaintenanceRevenue(false);
                              setToggleMonthlyRepairsRevenue(false);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                              transform: toggleMonthlyRevenue
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.2s ease-out",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {revenueSummary
                            .reduce(function (prev, current) {
                              return prev + +current.amount_paid;
                            }, 0)
                            .toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {" "}
                          {revenueSummary
                            .reduce(function (prev, current) {
                              return prev + +current.amount_due;
                            }, 0)
                            .toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {(
                            revenueSummary.reduce(function (prev, current) {
                              return prev + +current.amount_due;
                            }, 0) -
                            revenueSummary.reduce(function (prev, current) {
                              return prev + +current.amount_paid;
                            }, 0)
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {/* rent */}
                      {revenueSummary.find(
                        (revS) => revS.purchase_type === "RENT"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Rent{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyRent}
                              onClick={() => {
                                setToggleMonthlyRent(!toggleMonthlyRent);
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyRent
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {revenueSummary
                              .find((revS) => revS.purchase_type === "RENT")
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {revenueSummary
                              .find((revS) => revS.purchase_type === "RENT")
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "RENT"
                              ).amount_due -
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "RENT"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Rent{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyRent}
                              onClick={() => {
                                setToggleMonthlyRent(!toggleMonthlyRent);
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyRent
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* rent map individual */}
                      {revenue.map((rev, i) => {
                        return rev.purchase_type === "RENT" ? (
                          <TableRow hidden={!toggleMonthlyRent}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(rev.amount_due - rev.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* extra charges */}
                      {revenueSummary.find(
                        (revS) => revS.purchase_type === "EXTRA CHARGES"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Extra Charges{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyExtra}
                              onClick={() => {
                                setToggleMonthlyExtra(!toggleMonthlyExtra);
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyExtra
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {revenueSummary
                              .find(
                                (revS) => revS.purchase_type === "EXTRA CHARGES"
                              )
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {revenueSummary
                              .find(
                                (revS) => revS.purchase_type === "EXTRA CHARGES"
                              )
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "EXTRA CHARGES"
                              ).amount_due -
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "EXTRA CHARGES"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Extra Charges{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyExtra}
                              onClick={() => {
                                setToggleMonthlyExtra(!toggleMonthlyExtra);
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyExtra
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* extra charges  map indivial */}
                      {revenue.map((rev, i) => {
                        return rev.purchase_type === "EXTRA CHARGES" ? (
                          <TableRow hidden={!toggleMonthlyExtra}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(rev.amount_due - rev.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* Deposit */}
                      {revenueSummary.find(
                        (revS) => revS.purchase_type === "DEPOSIT"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Deposit{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyExtra}
                              onClick={() => {
                                setToggleMonthlyDeposit(!toggleMonthlyDeposit);
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyDeposit
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {revenueSummary
                              .find((revS) => revS.purchase_type === "DEPOSIT")
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {revenueSummary
                              .find((revS) => revS.purchase_type === "DEPOSIT")
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "DEPOSIT"
                              ).amount_due -
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "DEPOSIT"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Deposit{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyDeposit}
                              onClick={() => {
                                setToggleMonthlyDeposit(!toggleMonthlyDeposit);
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyDeposit
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* Deposit charges  map indivial */}
                      {revenue.map((rev, i) => {
                        return rev.purchase_type === "DEPOSIT" ? (
                          <TableRow hidden={!toggleMonthlyDeposit}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(rev.amount_due - rev.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* Management */}
                      {revenueSummary.find(
                        (revS) => revS.purchase_type === "MANAGEMENT"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Management{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyManagement}
                              onClick={() => {
                                setToggleMonthlyManagement(
                                  !toggleMonthlyManagement
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyManagement
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {revenueSummary
                              .find(
                                (revS) => revS.purchase_type === "MANAGEMENT"
                              )
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {revenueSummary
                              .find(
                                (revS) => revS.purchase_type === "MANAGEMENT"
                              )
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "MANAGEMENT"
                              ).amount_due -
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "MANAGEMENT"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Management{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyManagement}
                              onClick={() => {
                                setToggleMonthlyManagement(
                                  !toggleMonthlyManagement
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyManagement
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* Management map individual */}
                      {revenue.map((rev, i) => {
                        return rev.purchase_type === "MANAGEMENT" ? (
                          <TableRow hidden={!toggleMonthlyManagement}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(rev.amount_due - rev.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* utility */}
                      {revenueSummary.find(
                        (revS) => revS.purchase_type === "UTILITY"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Utilities{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyUtility}
                              onClick={() => {
                                setToggleMonthlyUtility(!toggleMonthlyUtility);
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyUtility
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {revenueSummary
                              .find((revS) => revS.purchase_type === "UTILITY")
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {revenueSummary
                              .find((revS) => revS.purchase_type === "UTILITY")
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "UTILITY"
                              ).amount_due -
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "UTILITY"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Utilities{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyUtility}
                              onClick={() => {
                                setToggleMonthlyUtility(!toggleMonthlyUtility);
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyUtility
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* utility map individual */}
                      {revenue.map((rev, i) => {
                        return rev.purchase_type === "UTILITY" ? (
                          <TableRow hidden={!toggleMonthlyUtility}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(rev.amount_due - rev.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* utility */}
                      {revenueSummary.find(
                        (revS) => revS.purchase_type === "LATE FEE"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Late Fee{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyLateFee}
                              onClick={() => {
                                setToggleMonthlyLateFee(!toggleMonthlyLateFee);
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyLateFee
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {revenueSummary
                              .find((revS) => revS.purchase_type === "LATE FEE")
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {revenueSummary
                              .find((revS) => revS.purchase_type === "LATE FEE")
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "LATE FEE"
                              ).amount_due -
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "LATE FEE"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Late Fee{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyLateFee}
                              onClick={() => {
                                setToggleMonthlyLateFee(!toggleMonthlyLateFee);
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyLateFee
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* utility map individual */}
                      {revenue.map((rev, i) => {
                        return rev.purchase_type === "LATE FEE" ? (
                          <TableRow hidden={!toggleMonthlyLateFee}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(rev.amount_due - rev.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* maintenance */}
                      {revenueSummary.find(
                        (revS) => revS.purchase_type === "MAINTENANCE"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Maintenance{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyMaintenanceRevenue}
                              onClick={() => {
                                setToggleMonthlyMaintenanceRevenue(
                                  !toggleMonthlyMaintenanceRevenue
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyMaintenanceRevenue
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {revenueSummary
                              .find(
                                (revS) => revS.purchase_type === "MAINTENANCE"
                              )
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {revenueSummary
                              .find(
                                (revS) => revS.purchase_type === "MAINTENANCE"
                              )
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "MAINTENANCE"
                              ).amount_due -
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "MAINTENANCE"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Maintenance
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyMaintenanceRevenue}
                              onClick={() => {
                                setToggleMonthlyMaintenanceRevenue(
                                  !toggleMonthlyMaintenanceRevenue
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyMaintenanceRevenue
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}{" "}
                      {/* maintenance map individual */}
                      {revenue.map((rev, i) => {
                        return rev.purchase_type === "MAINTENANCE" ? (
                          <TableRow hidden={!toggleMonthlyMaintenanceRevenue}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(rev.amount_due - rev.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* repairs */}
                      {revenueSummary.find(
                        (revS) => revS.purchase_type === "REPAIRS"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Repairs
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyRepairsRevenue}
                              onClick={() => {
                                setToggleMonthlyRepairsRevenue(
                                  !toggleMonthlyRepairsRevenue
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyRepairsRevenue
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell>
                            {revenueSummary
                              .find((revS) => revS.purchase_type === "REPAIRS")
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {revenueSummary
                              .find((revS) => revS.purchase_type === "REPAIRS")
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "REPAIRS"
                              ).amount_due -
                              revenueSummary.find(
                                (revS) => revS.purchase_type === "REPAIRS"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Repairs
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyRepairsRevenue}
                              onClick={() => {
                                setToggleMonthlyRepairsRevenue(
                                  !toggleMonthlyRepairsRevenue
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyRepairsRevenue
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* repairs map individual */}
                      {revenue.map((rev, i) => {
                        return rev.purchase_type === "REPAIRS" ? (
                          <TableRow hidden={!toggleMonthlyRepairsRevenue}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(rev.amount_due - rev.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* monthly cashflow */}
                      <TableRow hidden={!toggleMonthlyCashFlow}>
                        <TableCell width="500px" style={mediumBold}>
                          &nbsp;&nbsp;Expense
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            // hidden={toggleMonthlyExpense}
                            onClick={() => {
                              setToggleMonthlyExpense(!toggleMonthlyExpense);

                              setToggleMonthlyOwnerPaymentRent(false);
                              setToggleMonthlyOwnerPaymentExtra(false);
                              setToggleMonthlyOwnerPaymentLate(false);
                              setToggleMonthlyMaintenance(false);
                              setToggleMonthlyRepairs(false);
                              setToggleMonthlyUtilityExpense(false);
                              setToggleMonthlyMortgage(false);
                              setToggleMonthlyTaxes(false);
                              setToggleMonthlyInsurance(false);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                              transform: toggleMonthlyExpense
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.2s ease-out",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {expenseSummary
                            .reduce(function (prev, current) {
                              return prev + +current.amount_paid;
                            }, 0)
                            .toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {" "}
                          {expenseSummary
                            .reduce(function (prev, current) {
                              return prev + +current.amount_due;
                            }, 0)
                            .toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {(
                            expenseSummary.reduce(function (prev, current) {
                              return prev + +current.amount_due;
                            }, 0) -
                            expenseSummary.reduce(function (prev, current) {
                              return prev + +current.amount_paid;
                            }, 0)
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {/* Management Rent*/}
                      {expenseSummary.find(
                        (revS) => revS.purchase_type === "OWNER PAYMENT RENT"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Owner Payment Rent{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyOwnerPaymentRent}
                              onClick={() => {
                                setToggleMonthlyOwnerPaymentRent(
                                  !toggleMonthlyOwnerPaymentRent
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyOwnerPaymentRent
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (revS) =>
                                  revS.purchase_type === "OWNER PAYMENT RENT"
                              )
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (revS) =>
                                  revS.purchase_type === "OWNER PAYMENT RENT"
                              )
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              expenseSummary.find(
                                (revS) =>
                                  revS.purchase_type === "OWNER PAYMENT RENT"
                              ).amount_due -
                              expenseSummary.find(
                                (revS) =>
                                  revS.purchase_type === "OWNER PAYMENT RENT"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Owner Payment Rent{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyOwnerPaymentRent}
                              onClick={() => {
                                setToggleMonthlyOwnerPaymentRent(
                                  !toggleMonthlyOwnerPaymentRent
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyOwnerPaymentRent
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* Management RENT map individual */}
                      {expense.map((exp, i) => {
                        return exp.purchase_type === "OWNER PAYMENT RENT" ? (
                          <TableRow hidden={!toggleMonthlyOwnerPaymentRent}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {exp.address} {exp.unit}, {exp.city}, {exp.state}{" "}
                              {exp.zip}
                            </TableCell>
                            <TableCell align="right">
                              {exp.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {exp.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(exp.amount_due - exp.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* Management extra charges*/}
                      {expenseSummary.find(
                        (expS) =>
                          expS.purchase_type === "OWNER PAYMENT EXTRA CHARGES"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Owner Payment Extra Charges{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // // hidden={toggleMonthlyOwnerPaymentExtra}
                              onClick={() => {
                                setToggleMonthlyOwnerPaymentExtra(
                                  !toggleMonthlyOwnerPaymentExtra
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyOwnerPaymentExtra
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (expS) =>
                                  expS.purchase_type ===
                                  "OWNER PAYMENT EXTRA CHARGES"
                              )
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (expS) =>
                                  expS.purchase_type ===
                                  "OWNER PAYMENT EXTRA CHARGES"
                              )
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              expenseSummary.find(
                                (expS) =>
                                  expS.purchase_type ===
                                  "OWNER PAYMENT EXTRA CHARGES"
                              ).amount_due -
                              expenseSummary.find(
                                (expS) =>
                                  expS.purchase_type ===
                                  "OWNER PAYMENT EXTRA CHARGES"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Owner Payment Extra Charges{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyOwnerPaymentExtra}
                              onClick={() => {
                                setToggleMonthlyOwnerPaymentExtra(
                                  !toggleMonthlyOwnerPaymentExtra
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyOwnerPaymentExtra
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* Owner Payment Extra Charges map individual */}
                      {expense.map((exp, i) => {
                        return exp.purchase_type ===
                          "OWNER PAYMENT EXTRA CHARGES" ? (
                          <TableRow hidden={!toggleMonthlyOwnerPaymentExtra}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {exp.address} {exp.unit}, {exp.city}, {exp.state}{" "}
                              {exp.zip}
                            </TableCell>
                            <TableCell align="right">
                              {exp.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {exp.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(exp.amount_due - exp.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* Owner Payment */}
                      {expenseSummary.find(
                        (expS) =>
                          expS.purchase_type === "OWNER PAYMENT LATE FEE"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Owner Payment Late Fee{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyManagement}
                              onClick={() => {
                                setToggleMonthlyOwnerPaymentLate(
                                  !toggleMonthlyOwnerPaymentLate
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyOwnerPaymentLate
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (expS) =>
                                  expS.purchase_type ===
                                  "OWNER PAYMENT LATE FEE"
                              )
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (expS) =>
                                  expS.purchase_type ===
                                  "OWNER PAYMENT LATE FEE"
                              )
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              expenseSummary.find(
                                (expS) =>
                                  expS.purchase_type ===
                                  "OWNER PAYMENT LATE FEE"
                              ).amount_due -
                              expenseSummary.find(
                                (expS) =>
                                  expS.purchase_type ===
                                  "OWNER PAYMENT LATE FEE"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Owner Payment Late fee{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyOwnerPaymentLate}
                              onClick={() => {
                                setToggleMonthlyOwnerPaymentLate(
                                  !toggleMonthlyOwnerPaymentLate
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyOwnerPaymentLate
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* Owner Payment late fee map individual */}
                      {expense.map((exp, i) => {
                        return exp.purchase_type ===
                          "OWNER PAYMENT LATE FEE" ? (
                          <TableRow hidden={!toggleMonthlyOwnerPaymentLate}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {exp.address} {exp.unit}, {exp.city}, {exp.state}{" "}
                              {exp.zip}
                            </TableCell>
                            <TableCell align="right">
                              {exp.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {exp.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(exp.amount_due - exp.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* Maintenance */}
                      {expenseSummary.find(
                        (expS) => expS.purchase_type === "MAINTENANCE"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Maintenance{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyMaintenance}
                              onClick={() => {
                                setToggleMonthlyMaintenance(
                                  !toggleMonthlyMaintenance
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyMaintenance
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (expS) => expS.purchase_type === "MAINTENANCE"
                              )
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (expS) => expS.purchase_type === "MAINTENANCE"
                              )
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              expenseSummary.find(
                                (expS) => expS.purchase_type === "MAINTENANCE"
                              ).amount_due -
                              expenseSummary.find(
                                (expS) => expS.purchase_type === "MAINTENANCE"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Maintenance{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyMaintenance}
                              onClick={() => {
                                setToggleMonthlyMaintenance(
                                  !toggleMonthlyMaintenance
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyMaintenance
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* Maintenance map individual */}
                      {expense.map((rev, i) => {
                        return rev.purchase_type === "MAINTENANCE" ? (
                          <TableRow hidden={!toggleMonthlyMaintenance}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(rev.amount_due - rev.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* repairs */}
                      {expenseSummary.find(
                        (expS) => expS.purchase_type === "REPAIRS"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Repairs{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyRepairs}
                              onClick={() => {
                                setToggleMonthlyRepairs(!toggleMonthlyRepairs);
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyRepairs
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find((expS) => expS.purchase_type === "REPAIRS")
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find((expS) => expS.purchase_type === "REPAIRS")
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              expenseSummary.find(
                                (expS) => expS.purchase_type === "REPAIRS"
                              ).amount_due -
                              expenseSummary.find(
                                (expS) => expS.purchase_type === "REPAIRS"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Repairs{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyRepairs}
                              onClick={() => {
                                setToggleMonthlyRepairs(!toggleMonthlyRepairs);
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyRepairs
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* repairs map individual */}
                      {expense.map((rev, i) => {
                        return rev.purchase_type === "REPAIRS" ? (
                          <TableRow hidden={!toggleMonthlyMaintenance}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(rev.amount_due - rev.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* Mortgage */}
                      {expenseSummary.find(
                        (expS) => expS.purchase_type === "MORTGAGE"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Mortgage{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyMortgage}
                              onClick={() => {
                                setToggleMonthlyMortgage(
                                  !toggleMonthlyMortgage
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyMortgage
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find((expS) => expS.purchase_type === "MORTGAGE")
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find((expS) => expS.purchase_type === "MORTGAGE")
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              expenseSummary.find(
                                (expS) => expS.purchase_type === "MORTGAGE"
                              ).amount_due -
                              expenseSummary.find(
                                (expS) => expS.purchase_type === "MORTGAGE"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Mortgage{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyMortgage}
                              onClick={() => {
                                setToggleMonthlyMortgage(
                                  !toggleMonthlyMortgage
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyMortgage
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* Mortgage map individual */}
                      {expense.map((rev, i) => {
                        return rev.purchase_type === "MORTGAGE" ? (
                          <TableRow hidden={!toggleMonthlyMortgage}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(rev.amount_due - rev.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* Taxes */}
                      {expenseSummary.find(
                        (expS) => expS.purchase_type === "TAXES"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Taxes{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyTaxes}
                              onClick={() => {
                                setToggleMonthlyTaxes(!toggleMonthlyTaxes);
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyTaxes
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find((expS) => expS.purchase_type === "TAXES")
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find((expS) => expS.purchase_type === "TAXES")
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              expenseSummary.find(
                                (expS) => expS.purchase_type === "TAXES"
                              ).amount_due -
                              expenseSummary.find(
                                (expS) => expS.purchase_type === "TAXES"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Taxes{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyTaxes}
                              onClick={() => {
                                setToggleMonthlyTaxes(!toggleMonthlyTaxes);
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyTaxes
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* Taxes map individual */}
                      {expense.map((rev, i) => {
                        return rev.purchase_type === "TAXES" ? (
                          <TableRow hidden={!toggleMonthlyTaxes}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(rev.amount_due - rev.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* Insurance */}
                      {expenseSummary.find(
                        (expS) => expS.purchase_type === "INSURANCE"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Insurance{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyInsurance}
                              onClick={() => {
                                setToggleMonthlyInsurance(
                                  !toggleMonthlyInsurance
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyInsurance
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (expS) => expS.purchase_type === "INSURANCE"
                              )
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (expS) => expS.purchase_type === "INSURANCE"
                              )
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              expenseSummary.find(
                                (expS) => expS.purchase_type === "INSURANCE"
                              ).amount_due -
                              expenseSummary.find(
                                (expS) => expS.purchase_type === "INSURANCE"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Insurance{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyInsurance}
                              onClick={() => {
                                setToggleMonthlyInsurance(
                                  !toggleMonthlyInsurance
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyInsurance
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* Insurance map individual */}
                      {expense.map((rev, i) => {
                        return rev.purchase_type === "INSURANCE" ? (
                          <TableRow hidden={!toggleMonthlyInsurance}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(rev.amount_due - rev.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* UtilityExpense */}
                      {expenseSummary.find(
                        (expS) => expS.purchase_type === "UTILITY"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Utility
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyUtilityExpense}
                              onClick={() => {
                                setToggleMonthlyUtilityExpense(
                                  !toggleMonthlyUtilityExpense
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyUtilityExpense
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find((expS) => expS.purchase_type === "UTILITY")
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find((expS) => expS.purchase_type === "UTILITY")
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {(
                              expenseSummary.find(
                                (expS) => expS.purchase_type === "UTILITY"
                              ).amount_due -
                              expenseSummary.find(
                                (expS) => expS.purchase_type === "UTILITY"
                              ).amount_paid
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px" style={semiMediumBold}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Utility
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyUtilityExpense}
                              onClick={() => {
                                setToggleMonthlyUtilityExpense(
                                  !toggleMonthlyUtilityExpense
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyUtilityExpense
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-out",
                              }}
                            />
                          </TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>{" "}
                          <TableCell align="right">0.00</TableCell>
                        </TableRow>
                      )}
                      {/* UtilityExpense map individual */}
                      {expense.map((rev, i) => {
                        return rev.purchase_type === "UTILITY" ? (
                          <TableRow hidden={!toggleMonthlyUtilityExpense}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {(rev.amount_due - rev.amount_paid).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                    </TableBody>
                  </Table>
                </Row>
              ) : all === false ? (
                <Row className="m-3">
                  <Table
                    responsive="md"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
                    <TableHead>
                      <TableCell width="500px"></TableCell>
                      <TableCell align="right">To Date</TableCell>
                      <TableCell align="right">Expected</TableCell>
                      <TableCell align="right">Delta</TableCell>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell width="500px" style={headings}>
                          {month} {year}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            // hidden={toggleMonthlyCashFlow}
                            onClick={() => {
                              setToggleMonthlyCashFlow(!toggleMonthlyCashFlow);
                              setToggleMonthlyCashFlowProperty(
                                !toggleMonthlyCashFlowProperty
                              );
                              setToggleMonthlyRevenue(false);
                              setToggleMonthlyDeposit(false);
                              setToggleMonthlyRent(false);
                              setToggleMonthlyExtra(false);
                              setToggleMonthlyUtility(false);
                              setToggleMonthlyLateFee(false);
                              setToggleMonthlyOwnerPaymentRent(false);
                              setToggleMonthlyOwnerPaymentExtra(false);
                              setToggleMonthlyOwnerPaymentLate(false);
                              setToggleMonthlyMaintenanceRevenue(false);
                              setToggleMonthlyRepairsRevenue(false);
                              setToggleMonthlyExpense(false);
                              setToggleMonthlyManagement(false);
                              setToggleMonthlyMaintenance(false);
                              setToggleMonthlyRepairs(false);
                              setToggleMonthlyUtilityExpense(false);
                              setToggleMonthlyMortgage(false);
                              setToggleMonthlyTaxes(false);
                              setToggleMonthlyInsurance(false);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                              transform: toggleMonthlyCashFlow
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.2s ease-out",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {(
                            revenueSummary.reduce(function (prev, current) {
                              return prev + +current.amount_paid;
                            }, 0) -
                            expenseSummary.reduce(function (prev, current) {
                              return prev + +current.amount_paid;
                            }, 0)
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {" "}
                          {(
                            revenueSummary.reduce(function (prev, current) {
                              return prev + +current.amount_due;
                            }, 0) -
                            expenseSummary.reduce(function (prev, current) {
                              return prev + +current.amount_due;
                            }, 0)
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {(
                            revenueSummary.reduce(function (prev, current) {
                              return prev + +current.amount_due;
                            }, 0) -
                            revenueSummary.reduce(function (prev, current) {
                              return prev + +current.amount_paid;
                            }, 0) -
                            (expenseSummary.reduce(function (prev, current) {
                              return prev + +current.amount_due;
                            }, 0) -
                              expenseSummary.reduce(function (prev, current) {
                                return prev + +current.amount_paid;
                              }, 0))
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {managerData.map((property, i) => {
                        return (
                          <>
                            {" "}
                            <TableRow hidden={!toggleMonthlyCashFlow}>
                              <TableCell width="500px" style={mediumBold}>
                                &nbsp;&nbsp;{property.address} {property.unit},{" "}
                                {property.city}, {property.state} {property.zip}
                                <img
                                  src={SortLeft}
                                  alt="Expand closed"
                                  // hidden={
                                  //   toggleMonthlyCashFlowProperty &&
                                  //   !propertyID.includes(property.property_uid)
                                  // }
                                  onClick={() => {
                                    toggleProperty(property.property_uid);
                                  }}
                                  style={{
                                    marginTop: "0.4rem",
                                    width: "10px",
                                    height: "10px",
                                    float: "right",
                                    transform: propertyID.includes(
                                      property.property_uid
                                    )
                                      ? "rotate(90deg)"
                                      : "rotate(0deg)",
                                    transition: "transform 0.2s ease-out",
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                {" "}
                                {(
                                  revenueSummary
                                    .filter(
                                      (rev) =>
                                        rev.property_uid ===
                                        property.property_uid
                                    )
                                    .reduce(function (prev, current) {
                                      return prev + +current.amount_paid;
                                    }, 0) -
                                  expenseSummary
                                    .filter(
                                      (exp) =>
                                        exp.property_uid ===
                                        property.property_uid
                                    )
                                    .reduce(function (prev, current) {
                                      return prev + +current.amount_paid;
                                    }, 0)
                                ).toFixed(2)}
                              </TableCell>
                              <TableCell align="right">
                                {(
                                  revenueSummary
                                    .filter(
                                      (rev) =>
                                        rev.property_uid ===
                                        property.property_uid
                                    )
                                    .reduce(function (prev, current) {
                                      return prev + +current.amount_due;
                                    }, 0) -
                                  expenseSummary
                                    .filter(
                                      (exp) =>
                                        exp.property_uid ===
                                        property.property_uid
                                    )
                                    .reduce(function (prev, current) {
                                      return prev + +current.amount_due;
                                    }, 0)
                                ).toFixed(2)}
                              </TableCell>
                              <TableCell align="right">
                                {" "}
                                {(
                                  revenueSummary
                                    .filter(
                                      (rev) =>
                                        rev.property_uid ===
                                        property.property_uid
                                    )
                                    .reduce(function (prev, current) {
                                      return prev + +current.amount_due;
                                    }, 0) -
                                  revenueSummary
                                    .filter(
                                      (rev) =>
                                        rev.property_uid ===
                                        property.property_uid
                                    )
                                    .reduce(function (prev, current) {
                                      return prev + +current.amount_paid;
                                    }, 0) -
                                  (expenseSummary
                                    .filter(
                                      (exp) =>
                                        exp.property_uid ===
                                        property.property_uid
                                    )
                                    .reduce(function (prev, current) {
                                      return prev + +current.amount_due;
                                    }, 0) -
                                    expenseSummary
                                      .filter(
                                        (exp) =>
                                          exp.property_uid ===
                                          property.property_uid
                                      )
                                      .reduce(function (prev, current) {
                                        return prev + +current.amount_paid;
                                      }, 0))
                                ).toFixed(2)}
                              </TableCell>
                            </TableRow>
                            {propertyID.includes(property.property_uid) ? (
                              <>
                                {" "}
                                <TableRow>
                                  <TableCell
                                    width="500px"
                                    style={semiMediumBold}
                                  >
                                    &nbsp;&nbsp;&nbsp;&nbsp;Revenue
                                    <img
                                      src={SortLeft}
                                      alt="Expand closed"
                                      // hidden={toggleMonthlyRevenue}
                                      onClick={() => {
                                        setToggleMonthlyRevenue(
                                          !toggleMonthlyRevenue
                                        );
                                        setToggleMonthlyDeposit(false);
                                        setToggleMonthlyRent(false);
                                        setToggleMonthlyExtra(false);
                                        setToggleMonthlyUtility(false);
                                        setToggleMonthlyLateFee(false);

                                        setToggleMonthlyMaintenanceRevenue(
                                          false
                                        );
                                        setToggleMonthlyRepairsRevenue(false);
                                      }}
                                      style={{
                                        marginTop: "0.4rem",
                                        width: "10px",
                                        height: "10px",
                                        float: "right",
                                        transform:
                                          toggleMonthlyRevenue &&
                                          propertyID.includes(
                                            property.property_uid
                                          )
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                        transition: "transform 0.2s ease-out",
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="right">
                                    {revenueSummary
                                      .filter(
                                        (rev) =>
                                          rev.property_uid ===
                                          property.property_uid
                                      )
                                      .reduce(function (prev, current) {
                                        return prev + +current.amount_paid;
                                      }, 0)
                                      .toFixed(2)}
                                  </TableCell>
                                  <TableCell align="right">
                                    {" "}
                                    {revenueSummary
                                      .filter(
                                        (rev) =>
                                          rev.property_uid ===
                                          property.property_uid
                                      )
                                      .reduce(function (prev, current) {
                                        return prev + +current.amount_due;
                                      }, 0)
                                      .toFixed(2)}
                                  </TableCell>
                                  <TableCell align="right">
                                    {" "}
                                    {(
                                      revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .reduce(function (prev, current) {
                                          return prev + +current.amount_due;
                                        }, 0) -
                                      revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .reduce(function (prev, current) {
                                          return prev + +current.amount_paid;
                                        }, 0)
                                    ).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                                {/* rent */}{" "}
                                {revenueSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (expS) => expS.purchase_type === "RENT"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rent{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyRent}
                                        onClick={() => {
                                          setToggleMonthlyRent(
                                            !toggleMonthlyRent
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyRent
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "RENT"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "RENT"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type === "RENT"
                                          ).amount_due -
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type === "RENT"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rent{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyRent}
                                        onClick={() => {
                                          setToggleMonthlyRent(
                                            !toggleMonthlyRent
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyRent
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* rent map individual */}
                                {revenue.map((rev, i) => {
                                  return rev.purchase_type === "RENT" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow hidden={!toggleMonthlyRent}>
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {rev.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {rev.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {rev.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          rev.amount_due - rev.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* extra charges */}
                                {revenueSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) =>
                                      revS.purchase_type === "EXTRA CHARGES"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Extra
                                      Charges{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyExtra}
                                        onClick={() => {
                                          setToggleMonthlyExtra(
                                            !toggleMonthlyExtra
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyExtra
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type ===
                                            "EXTRA CHARGES"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type ===
                                            "EXTRA CHARGES"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type ===
                                              "EXTRA CHARGES"
                                          ).amount_due -
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type ===
                                              "EXTRA CHARGES"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Extra
                                      Charges{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyExtra}
                                        onClick={() => {
                                          setToggleMonthlyExtra(
                                            !toggleMonthlyExtra
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyExtra
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* extra charges  map indivial */}
                                {revenue.map((rev, i) => {
                                  return rev.purchase_type ===
                                    "EXTRA CHARGES" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow hidden={!toggleMonthlyExtra}>
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                                        {rev.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {rev.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {rev.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          rev.amount_due - rev.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* extra charges */}
                                {revenueSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) => revS.purchase_type === "DEPOSIT"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Deposit
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyExtra}
                                        onClick={() => {
                                          setToggleMonthlyDeposit(
                                            !toggleMonthlyDeposit
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyDeposit
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "DEPOSIT"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "DEPOSIT"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type === "DEPOSIT"
                                          ).amount_due -
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type === "DEPOSIT"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Deposit
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyDeposit}
                                        onClick={() => {
                                          setToggleMonthlyDeposit(
                                            !toggleMonthlyDeposit
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyDeposit
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* Deposit charges  map indivial */}
                                {revenue.map((rev, i) => {
                                  return rev.purchase_type === "DEPOSIT" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow hidden={!toggleMonthlyDeposit}>
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                                        {rev.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {rev.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {rev.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          rev.amount_due - rev.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* utility */}
                                {revenueSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) => revS.purchase_type === "UTILITY"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Utilities{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyUtility}
                                        onClick={() => {
                                          setToggleMonthlyUtility(
                                            !toggleMonthlyUtility
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyUtility
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "UTILITY"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "UTILITY"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type === "UTILITY"
                                          ).amount_due -
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type === "UTILITY"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Utilities{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyUtility}
                                        onClick={() => {
                                          setToggleMonthlyUtility(
                                            !toggleMonthlyUtility
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyUtility
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* utility map individual */}
                                {revenue.map((rev, i) => {
                                  return rev.purchase_type === "UTILITY" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow hidden={!toggleMonthlyUtility}>
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                                        {rev.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {rev.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {rev.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          rev.amount_due - rev.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* utility */}
                                {revenueSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) => revS.purchase_type === "LATE FEE"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Late
                                      Fee{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyLateFee}
                                        onClick={() => {
                                          setToggleMonthlyLateFee(
                                            !toggleMonthlyLateFee
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyLateFee
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "LATE FEE"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "LATE FEE"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type === "LATE FEE"
                                          ).amount_due -
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type === "LATE FEE"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Late
                                      Fee{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyLateFee}
                                        onClick={() => {
                                          setToggleMonthlyLateFee(
                                            !toggleMonthlyLateFee
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyLateFee
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* utility map individual */}
                                {revenue.map((rev, i) => {
                                  return rev.purchase_type === "LATE FEE" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow hidden={!toggleMonthlyLateFee}>
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {rev.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {rev.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {rev.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          rev.amount_due - rev.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {revenueSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) =>
                                      revS.purchase_type === "MANAGEMENT"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Management{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyManagement}
                                        onClick={() => {
                                          setToggleMonthlyManagement(
                                            !toggleMonthlyManagement
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyManagement
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "MANAGEMENT"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "MANAGEMENT"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type ===
                                              "MANAGEMENT"
                                          ).amount_due -
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type ===
                                              "MANAGEMENT"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Management{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyManagement}
                                        onClick={() => {
                                          setToggleMonthlyManagement(
                                            !toggleMonthlyManagement
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyManagement
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* Management map individual */}
                                {revenue.map((rev, i) => {
                                  return rev.purchase_type === "MANAGEMENT" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow hidden={!toggleMonthlyManagement}>
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {rev.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {rev.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {rev.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {rev.amount_due -
                                          rev.amount_paid.toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* maintenance */}
                                {revenueSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) =>
                                      revS.purchase_type === "MAINTENANCE"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maintenance{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyMaintenanceRevenue}
                                        onClick={() => {
                                          setToggleMonthlyMaintenanceRevenue(
                                            !toggleMonthlyMaintenanceRevenue
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform:
                                            toggleMonthlyMaintenanceRevenue
                                              ? "rotate(90deg)"
                                              : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell>
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "MAINTENANCE"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "MAINTENANCE"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type ===
                                              "MAINTENANCE"
                                          ).amount_due -
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type ===
                                              "MAINTENANCE"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maintenance
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyMaintenanceRevenue}
                                        onClick={() => {
                                          setToggleMonthlyMaintenanceRevenue(
                                            !toggleMonthlyMaintenanceRevenue
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform:
                                            toggleMonthlyMaintenanceRevenue
                                              ? "rotate(90deg)"
                                              : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}{" "}
                                {/* maintenance map individual */}
                                {revenue.map((rev, i) => {
                                  return rev.purchase_type === "MAINTENANCE" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow
                                      hidden={!toggleMonthlyMaintenanceRevenue}
                                    >
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {rev.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {rev.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {rev.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          rev.amount_due - rev.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* repairs */}
                                {revenueSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) => revS.purchase_type === "REPAIRS"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Repairs
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyRepairsRevenue}
                                        onClick={() => {
                                          setToggleMonthlyRepairsRevenue(
                                            !toggleMonthlyRepairsRevenue
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyRepairsRevenue
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell>
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "REPAIRS"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {revenueSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "REPAIRS"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type === "REPAIRS"
                                          ).amount_due -
                                        revenueSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type === "REPAIRS"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Repairs
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyRepairsRevenue}
                                        onClick={() => {
                                          setToggleMonthlyRepairsRevenue(
                                            !toggleMonthlyRepairsRevenue
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyRepairsRevenue
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* repairs map individual */}
                                {revenue.map((rev, i) => {
                                  return rev.purchase_type === "REPAIRS" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow
                                      hidden={!toggleMonthlyRepairsRevenue}
                                    >
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {rev.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {rev.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {rev.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          rev.amount_due - rev.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                <TableRow>
                                  <TableCell
                                    width="500px"
                                    style={semiMediumBold}
                                  >
                                    &nbsp;&nbsp;&nbsp;&nbsp;Expense
                                    <img
                                      src={SortLeft}
                                      alt="Expand closed"
                                      // hidden={toggleMonthlyExpense}
                                      onClick={() => {
                                        setToggleMonthlyExpense(
                                          !toggleMonthlyExpense
                                        );
                                        setToggleMonthlyManagement(false);
                                        setToggleMonthlyOwnerPaymentRent(false);
                                        setToggleMonthlyOwnerPaymentExtra(
                                          false
                                        );
                                        setToggleMonthlyOwnerPaymentLate(false);
                                        setToggleMonthlyMaintenance(false);
                                        setToggleMonthlyRepairs(false);
                                        setToggleMonthlyUtilityExpense(false);
                                        setToggleMonthlyMortgage(false);
                                        setToggleMonthlyTaxes(false);
                                        setToggleMonthlyInsurance(false);
                                      }}
                                      style={{
                                        marginTop: "0.4rem",
                                        width: "10px",
                                        height: "10px",
                                        float: "right",
                                        transform: toggleMonthlyExpense
                                          ? "rotate(90deg)"
                                          : "rotate(0deg)",
                                        transition: "transform 0.2s ease-out",
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="right">
                                    {expenseSummary
                                      .filter(
                                        (exp) =>
                                          exp.property_uid ===
                                          property.property_uid
                                      )
                                      .reduce(function (prev, current) {
                                        return prev + +current.amount_paid;
                                      }, 0)
                                      .toFixed(2)}
                                  </TableCell>
                                  <TableCell align="right">
                                    {expenseSummary
                                      .filter(
                                        (exp) =>
                                          exp.property_uid ===
                                          property.property_uid
                                      )
                                      .reduce(function (prev, current) {
                                        return prev + +current.amount_due;
                                      }, 0)
                                      .toFixed(2)}
                                  </TableCell>
                                  <TableCell align="right">
                                    {(
                                      expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .reduce(function (prev, current) {
                                          return prev + +current.amount_due;
                                        }, 0) -
                                      expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .reduce(function (prev, current) {
                                          return prev + +current.amount_paid;
                                        }, 0)
                                    ).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                                {/* Management */}
                                {/* Owner Payment Rent*/}
                                {expenseSummary
                                  .filter(
                                    (exp) =>
                                      exp.property_uid === property.property_uid
                                  )
                                  .find(
                                    (expS) =>
                                      expS.purchase_type ===
                                      "OWNER PAYMENT RENT"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Owner
                                      Payment Rent{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyOwnerPaymentRent}
                                        onClick={() => {
                                          setToggleMonthlyOwnerPaymentRent(
                                            !toggleMonthlyOwnerPaymentRent
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform:
                                            toggleMonthlyOwnerPaymentRent
                                              ? "rotate(90deg)"
                                              : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type ===
                                            "OWNER PAYMENT RENT"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type ===
                                            "OWNER PAYMENT RENT"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type ===
                                              "OWNER PAYMENT RENT"
                                          ).amount_due -
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type ===
                                              "OWNER PAYMENT RENT"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Owner
                                      Payment Rent{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyOwnerPaymentRent}
                                        onClick={() => {
                                          setToggleMonthlyOwnerPaymentRent(
                                            !toggleMonthlyOwnerPaymentRent
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform:
                                            toggleMonthlyOwnerPaymentRent
                                              ? "rotate(90deg)"
                                              : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* Owner Payment RENT map individual */}
                                {expense.map((exp, i) => {
                                  return exp.purchase_type ===
                                    "OWNER PAYMENT RENT" &&
                                    exp.property_uid ===
                                      property.property_uid ? (
                                    <TableRow
                                      hidden={!toggleMonthlyOwnerPaymentRent}
                                    >
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {exp.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {exp.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {exp.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          exp.amount_due - exp.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* Owner Payment extra charges*/}
                                {expenseSummary
                                  .filter(
                                    (exp) =>
                                      exp.property_uid === property.property_uid
                                  )
                                  .find(
                                    (expS) =>
                                      expS.purchase_type ===
                                      "OWNER PAYMENT EXTRA CHARGES"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Owner
                                      Payment Extra Charges{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyOwnerPaymentExtra}
                                        onClick={() => {
                                          setToggleMonthlyOwnerPaymentExtra(
                                            !toggleMonthlyOwnerPaymentExtra
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform:
                                            toggleMonthlyOwnerPaymentExtra
                                              ? "rotate(90deg)"
                                              : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type ===
                                            "OWNER PAYMENT EXTRA CHARGES"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type ===
                                            "OWNER PAYMENT EXTRA CHARGES"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type ===
                                              "OWNER PAYMENT EXTRA CHARGES"
                                          ).amount_due -
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type ===
                                              "OWNER PAYMENT EXTRA CHARGES"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Owner
                                      Payment Extra Charges{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyOwnerPaymentExtra}
                                        onClick={() => {
                                          setToggleMonthlyOwnerPaymentExtra(
                                            !toggleMonthlyOwnerPaymentExtra
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform:
                                            toggleMonthlyOwnerPaymentExtra
                                              ? "rotate(90deg)"
                                              : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* Owner Payment Extra Charges map individual */}
                                {expense.map((exp, i) => {
                                  return exp.purchase_type ===
                                    "OWNER PAYMENT EXTRA CHARGES" &&
                                    exp.property_uid ===
                                      property.property_uid ? (
                                    <TableRow
                                      hidden={!toggleMonthlyOwnerPaymentExtra}
                                    >
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {exp.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {exp.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {exp.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          exp.amount_due - exp.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* Owner Payment */}
                                {expenseSummary
                                  .filter(
                                    (exp) =>
                                      exp.property_uid === property.property_uid
                                  )
                                  .find(
                                    (expS) =>
                                      expS.purchase_type ===
                                      "OWNER PAYMENT LATE FEE"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Owner
                                      Payment Late Fee{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyManagement}
                                        onClick={() => {
                                          setToggleMonthlyOwnerPaymentLate(
                                            !toggleMonthlyOwnerPaymentLate
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform:
                                            toggleMonthlyOwnerPaymentLate
                                              ? "rotate(90deg)"
                                              : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type ===
                                            "OWNER PAYMENT LATE FEE"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type ===
                                            "OWNER PAYMENT LATE FEE"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type ===
                                              "OWNER PAYMENT LATE FEE"
                                          ).amount_due -
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type ===
                                              "OWNER PAYMENT LATE FEE"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Owner
                                      Payment Late fee{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyOwnerPaymentLate}
                                        onClick={() => {
                                          setToggleMonthlyOwnerPaymentLate(
                                            !toggleMonthlyOwnerPaymentLate
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform:
                                            toggleMonthlyOwnerPaymentLate
                                              ? "rotate(90deg)"
                                              : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* Owner Payment late fee map individual */}
                                {expense.map((exp, i) => {
                                  return exp.purchase_type ===
                                    "OWNER PAYMENT LATE FEE" &&
                                    exp.property_uid ===
                                      property.property_uid ? (
                                    <TableRow
                                      hidden={!toggleMonthlyOwnerPaymentLate}
                                    >
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {exp.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {exp.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {exp.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          exp.amount_due - exp.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* Maintenance */}
                                {expenseSummary
                                  .filter(
                                    (exp) =>
                                      exp.property_uid === property.property_uid
                                  )
                                  .find(
                                    (expS) =>
                                      expS.purchase_type === "MAINTENANCE"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maintenance{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyMaintenance}
                                        onClick={() => {
                                          setToggleMonthlyMaintenance(
                                            !toggleMonthlyMaintenance
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyMaintenance
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type === "MAINTENANCE"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type === "MAINTENANCE"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type ===
                                              "MAINTENANCE"
                                          ).amount_due -
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type ===
                                              "MAINTENANCE"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maintenance{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyMaintenance}
                                        onClick={() => {
                                          setToggleMonthlyMaintenance(
                                            !toggleMonthlyMaintenance
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyMaintenance
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* Maintenance map individual */}
                                {expense.map((exp, i) => {
                                  return exp.purchase_type === "MAINTENANCE" &&
                                    exp.property_uid ===
                                      property.property_uid ? (
                                    <TableRow
                                      hidden={!toggleMonthlyMaintenance}
                                    >
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {exp.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {exp.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {exp.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          exp.amount_due - exp.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* repairs */}
                                {expenseSummary
                                  .filter(
                                    (exp) =>
                                      exp.property_uid === property.property_uid
                                  )
                                  .find(
                                    (expS) => expS.purchase_type === "REPAIRS"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Repairs{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyRepairs}
                                        onClick={() => {
                                          setToggleMonthlyRepairs(
                                            !toggleMonthlyRepairs
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyRepairs
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type === "REPAIRS"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type === "REPAIRS"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type === "REPAIRS"
                                          ).amount_due -
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type === "REPAIRS"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Repairs{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyRepairs}
                                        onClick={() => {
                                          setToggleMonthlyRepairs(
                                            !toggleMonthlyRepairs
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyRepairs
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* repairs map individual */}
                                {expense.map((exp, i) => {
                                  return exp.purchase_type === "REPAIRS" &&
                                    exp.property_uid ===
                                      property.property_uid ? (
                                    <TableRow
                                      hidden={!toggleMonthlyMaintenance}
                                    >
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {exp.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {exp.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {exp.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          exp.amount_due - exp.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* Mortgage */}
                                {expenseSummary
                                  .filter(
                                    (exp) =>
                                      exp.property_uid === property.property_uid
                                  )
                                  .find(
                                    (expS) => expS.purchase_type === "MORTGAGE"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mortgage{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyMortgage}
                                        onClick={() => {
                                          setToggleMonthlyMortgage(
                                            !toggleMonthlyMortgage
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyMortgage
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type === "MORTGAGE"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type === "MORTGAGE"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type === "MORTGAGE"
                                          ).amount_due -
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type === "MORTGAGE"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mortgage{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyMortgage}
                                        onClick={() => {
                                          setToggleMonthlyMortgage(
                                            !toggleMonthlyMortgage
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyMortgage
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* Mortgage map individual */}
                                {expense.map((exp, i) => {
                                  return exp.purchase_type === "MORTGAGE" &&
                                    exp.property_uid ===
                                      property.property_uid ? (
                                    <TableRow hidden={!toggleMonthlyMortgage}>
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {exp.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {exp.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {exp.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          exp.amount_due - exp.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* Taxes */}
                                {expenseSummary
                                  .filter(
                                    (exp) =>
                                      exp.property_uid === property.property_uid
                                  )
                                  .find(
                                    (expS) => expS.purchase_type === "TAXES"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Taxes{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyTaxes}
                                        onClick={() => {
                                          setToggleMonthlyTaxes(
                                            !toggleMonthlyTaxes
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyTaxes
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type === "TAXES"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type === "TAXES"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type === "TAXES"
                                          ).amount_due -
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type === "TAXES"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Taxes{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyTaxes}
                                        onClick={() => {
                                          setToggleMonthlyTaxes(
                                            !toggleMonthlyTaxes
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyTaxes
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* Taxes map individual */}
                                {expense.map((exp, i) => {
                                  return exp.purchase_type === "TAXES" &&
                                    exp.property_uid ===
                                      property.property_uid ? (
                                    <TableRow hidden={!toggleMonthlyTaxes}>
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {exp.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {exp.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {exp.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          exp.amount_due - exp.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* Insurance */}
                                {expenseSummary
                                  .filter(
                                    (exp) =>
                                      exp.property_uid === property.property_uid
                                  )
                                  .find(
                                    (expS) => expS.purchase_type === "INSURANCE"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Insurance{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyInsurance}
                                        onClick={() => {
                                          setToggleMonthlyInsurance(
                                            !toggleMonthlyInsurance
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyInsurance
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type === "INSURANCE"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type === "INSURANCE"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type === "INSURANCE"
                                          ).amount_due -
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type === "INSURANCE"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Insurance{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyInsurance}
                                        onClick={() => {
                                          setToggleMonthlyInsurance(
                                            !toggleMonthlyInsurance
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyInsurance
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* Insurance map individual */}
                                {expense.map((exp, i) => {
                                  return exp.purchase_type === "INSURANCE" &&
                                    exp.property_uid ===
                                      property.property_uid ? (
                                    <TableRow hidden={!toggleMonthlyInsurance}>
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {exp.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {exp.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {exp.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          exp.amount_due - exp.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* UtilityExpense */}
                                {expenseSummary
                                  .filter(
                                    (exp) =>
                                      exp.property_uid === property.property_uid
                                  )
                                  .find(
                                    (expS) => expS.purchase_type === "UTILITY"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Utility
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyUtilityExpense}
                                        onClick={() => {
                                          setToggleMonthlyUtilityExpense(
                                            !toggleMonthlyUtilityExpense
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyUtilityExpense
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type === "UTILITY"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (exp) =>
                                            exp.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (expS) =>
                                            expS.purchase_type === "UTILITY"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {(
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type === "UTILITY"
                                          ).amount_due -
                                        expenseSummary
                                          .filter(
                                            (exp) =>
                                              exp.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (expS) =>
                                              expS.purchase_type === "UTILITY"
                                          ).amount_paid
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" style={bold}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Utility
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyUtilityExpense}
                                        onClick={() => {
                                          setToggleMonthlyUtilityExpense(
                                            !toggleMonthlyUtilityExpense
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyUtilityExpense
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>{" "}
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                )}
                                {/* UtilityExpense map individual */}
                                {expense.map((exp, i) => {
                                  return exp.purchase_type === "UTILITY" &&
                                    exp.property_uid ===
                                      property.property_uid ? (
                                    <TableRow
                                      hidden={!toggleMonthlyUtilityExpense}
                                    >
                                      <TableCell width="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {exp.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {exp.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {exp.amount_due.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {(
                                          exp.amount_due - exp.amount_paid
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                              </>
                            ) : (
                              ""
                            )}
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Row>
              ) : (
                <Row
                  className="m-3 overflow-scroll"
                  style={{ height: "20rem" }}
                >
                  <Table
                    classes={{ root: classes.customTable }}
                    size="small"
                    responsive="md"
                  >
                    <TableHead>
                      <TableCell>ID</TableCell>
                      <TableCell>Transaction Type</TableCell>
                      <TableCell>
                        Transaction <br />
                        Description
                      </TableCell>
                      <TableCell>Amount Due</TableCell>
                      <TableCell>Amount Paid</TableCell>
                      <TableCell>Date Due</TableCell>
                      <TableCell>
                        Cumulative <br />
                        Amount Due
                      </TableCell>{" "}
                      <TableCell>
                        Cumulative <br />
                        Amount Paid
                      </TableCell>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction, index) => {
                        return (
                          <TableRow>
                            <TableCell
                              style={{
                                color:
                                  transaction.receiver === managerID
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {transaction.purchase_uid}
                            </TableCell>
                            <TableCell
                              style={{
                                color:
                                  transaction.receiver === managerID
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {transaction.purchase_type}
                            </TableCell>
                            <TableCell
                              style={{
                                color:
                                  transaction.receiver === managerID
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {transaction.description}
                            </TableCell>
                            <TableCell
                              style={{
                                color:
                                  transaction.receiver === managerID
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {transaction.amount_due}
                            </TableCell>

                            <TableCell
                              style={{
                                color:
                                  transaction.receiver === managerID
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {transaction.amount_paid}
                            </TableCell>
                            <TableCell
                              style={{
                                color:
                                  transaction.receiver === managerID
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {transaction.next_payment.split(" ")[0]}
                            </TableCell>
                            <TableCell>
                              {transaction.sum_due}
                              {transactions[index] !== undefined &&
                              transactions[index + 1] !== undefined ? (
                                transactions[index].sum_due >
                                transactions[index + 1].sum_due ? (
                                  <img
                                    src={GreenUpArrow}
                                    style={{ width: "15px" }}
                                  />
                                ) : (
                                  <img
                                    src={RedDownArrow}
                                    style={{ width: "15px" }}
                                  />
                                )
                              ) : (
                                ""
                              )}
                            </TableCell>
                            <TableCell>
                              {transaction.sum_paid}
                              {transactions[index] !== undefined &&
                              transactions[index + 1] !== undefined ? (
                                transactions[index].sum_paid >
                                transactions[index + 1].sum_paid ? (
                                  <img
                                    src={GreenUpArrow}
                                    style={{ width: "15px" }}
                                  />
                                ) : (
                                  <img
                                    src={RedDownArrow}
                                    style={{ width: "15px" }}
                                  />
                                )
                              ) : (
                                ""
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Row>
              )
            ) : (
              <div className="flex-1">
                <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                  <ReactBootStrap.Spinner animation="border" role="status" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
