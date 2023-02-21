import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import { Switch } from "@material-ui/core";
import AppContext from "../../AppContext";
import AddIcon from "../../icons/AddIcon.svg";
import SortLeft from "../../icons/Sort-left.svg";
import { get } from "../../utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

export default function OwnerCashflow(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const { ownerData, byProperty, propertyView, addExpense, setAddExpense } =
    props;

  const [isLoading, setIsLoading] = useState(true);
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
  const [toggleMonthlyManagementRent, setToggleMonthlyManagementRent] =
    useState(false);
  const [toggleMonthlyManagementExtra, setToggleMonthlyManagementExtra] =
    useState(false);
  const [toggleMonthlyManagementLate, setToggleMonthlyManagementLate] =
    useState(false);
  const [toggleMonthlyMaintenanceRevenue, setToggleMonthlyMaintenanceRevenue] =
    useState(false);
  const [toggleMonthlyRepairsRevenue, setToggleMonthlyRepairsRevenue] =
    useState(false);
  // monthly expense toggle
  const [toggleMonthlyExpense, setToggleMonthlyExpense] = useState(false);
  const [toggleMonthlyManagement, setToggleMonthlyManagement] = useState(false);
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
  console.log(ownerData);
  const fetchCashflow = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }

    const cashflowResponse = await get(
      `/CashflowOwner?owner_id=${user.user_uid}&year=${year}`
    );
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
            rev.property_uid === ownerData[0].property_uid
          ) {
            currentRev.push(rev);
          }
        });
        cashflowResponse.result.revenue_unit.forEach((rev) => {
          if (
            rev.month === month &&
            rev.property_uid === ownerData[0].property_uid
          ) {
            currentRevSummary.push(rev);
          }
        });
        cashflowResponse.result.expense.forEach((rev) => {
          if (
            rev.month === month &&
            rev.property_uid === ownerData[0].property_uid
          ) {
            currentExp.push(rev);
          }
        });
        cashflowResponse.result.expense_unit.forEach((rev) => {
          if (
            rev.month === month &&
            rev.property_uid === ownerData[0].property_uid
          ) {
            currentExpSummary.push(rev);
          }
        });
      }

      const resArr = [];
      currentRev.forEach((item) => {
        currentRev.forEach((x) => {
          if (
            x.property_uid == item.property_uid &&
            x.description == item.description &&
            x.month == item.month &&
            x.year == item.year &&
            x.purchase_date == item.purchase_date &&
            x.purchase_type !== item.purchase_type &&
            item.amount_due > x.amount_due
          ) {
            resArr.push({
              address: item.address,
              amount_due: (item.amount_due - x.amount_due).toFixed(2),
              amount_paid:
                x.purchase_status === "UNPAID"
                  ? 0
                  : (item.amount_paid - x.amount_paid).toFixed(2),
              city: item.city,
              description: item.description,
              linked_bill_id: null,
              month: item.month,
              next_payment: item.next_payment,
              owner_id: item.owner_id,
              payer: "",
              payment_frequency: null,
              property_uid: item.property_uid,
              pur_property_id: item.pur_property_id,
              purchase_date: item.purchase_date,
              purchase_frequency: item.purchase_frequency,
              purchase_notes: item.purchase_notes,
              purchase_status: item.purchase_status,
              purchase_type: "MANAGEMENT " + item.purchase_type,
              purchase_uid: "",
              receiver: "",
              state: item.state,
              unit: item.unit,
              year: item.year,
              zip: item.zip,
            });
            currentExp.push({
              address: item.address,
              amount_due: (item.amount_due - x.amount_due).toFixed(2),
              amount_paid:
                x.purchase_status === "UNPAID"
                  ? 0
                  : (item.amount_paid - x.amount_paid).toFixed(2),
              city: item.city,
              description: item.description,
              linked_bill_id: null,
              month: item.month,
              next_payment: item.next_payment,
              owner_id: item.owner_id,
              payer: "",
              payment_frequency: null,
              property_uid: item.property_uid,
              pur_property_id: item.pur_property_id,
              purchase_date: item.purchase_date,
              purchase_frequency: item.purchase_frequency,
              purchase_notes: item.purchase_notes,
              purchase_status: item.purchase_status,
              purchase_type: "MANAGEMENT " + item.purchase_type,
              purchase_uid: "",
              receiver: "",
              state: item.state,
              unit: item.unit,
              year: item.year,
              zip: item.zip,
            });
          }
        });
      });

      if (resArr.length > 0) {
        for (let r = 0; r < resArr.length; r++) {
          if (
            currentExpSummary.some(
              (ces) => ces.purchase_type === resArr[r].purchase_type
            )
          ) {
            let i = currentExpSummary.findIndex(
              (ces) => ces.purchase_type === resArr[r].purchase_type
            );

            currentExpSummary[i].amount_due =
              parseFloat(currentExpSummary[i].amount_due) +
              parseFloat(resArr[r].amount_due);
            currentExpSummary[i].amount_paid =
              parseFloat(currentExpSummary[i].amount_paid) +
              parseFloat(resArr[r].amount_paid);
          } else {
            currentExpSummary.push({
              owner_id: user.user_uid,
              purchase_type: resArr[r].purchase_type,
              month: month,
              year: year,
              amount_due: parseFloat(resArr[r].amount_due),
              amount_paid: parseFloat(resArr[r].amount_paid),
            });
          }
        }
      }
      // console.log(currentRevSummary);
      const resArrRevSum = [];
      currentRevSummary.forEach((rev, i) => {
        // console.log(rev);
        if (!rev.purchase_type.includes("OWNER PAYMENT")) {
          resArrRevSum.push(rev);
        }
      });
      // console.log(resArrRevSum);
      setRevenue(currentRev);
      setExpense(currentExp);
      setRevenueSummary(resArrRevSum);
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
            rev.property_uid === ownerData[0].property_uid
          ) {
            currentRev.push(rev);
          }
        });
        cashflowResponse.result.revenue_unit.forEach((rev) => {
          if (
            rev.month === month &&
            rev.property_uid === ownerData[0].property_uid
          ) {
            currentRevSummary.push(rev);
          }
        });
        cashflowResponse.result.expense.forEach((rev) => {
          if (
            rev.month === month &&
            rev.property_uid === ownerData[0].property_uid
          ) {
            currentExp.push(rev);
          }
        });
        cashflowResponse.result.expense_unit.forEach((rev) => {
          if (
            rev.month === month &&
            rev.property_uid === ownerData[0].property_uid
          ) {
            currentExpSummary.push(rev);
          }
        });
      }

      const resArr = [];
      currentRev.forEach((item) => {
        currentRev.forEach((x) => {
          if (
            x.property_uid == item.property_uid &&
            x.description == item.description &&
            x.month == item.month &&
            x.year == item.year &&
            x.purchase_date == item.purchase_date &&
            x.purchase_type !== item.purchase_type &&
            item.amount_due > x.amount_due
          ) {
            resArr.push({
              address: item.address,
              amount_due: (item.amount_due - x.amount_due).toFixed(2),
              amount_paid:
                x.purchase_status === "UNPAID"
                  ? 0
                  : (item.amount_paid - x.amount_paid).toFixed(2),
              city: item.city,
              description: item.description,
              linked_bill_id: null,
              month: item.month,
              next_payment: item.next_payment,
              owner_id: item.owner_id,
              payer: "",
              payment_frequency: null,
              property_uid: item.property_uid,
              pur_property_id: item.pur_property_id,
              purchase_date: item.purchase_date,
              purchase_frequency: item.purchase_frequency,
              purchase_notes: item.purchase_notes,
              purchase_status: item.purchase_status,
              purchase_type: "MANAGEMENT " + item.purchase_type,
              purchase_uid: "",
              receiver: "",
              state: item.state,
              unit: item.unit,
              year: item.year,
              zip: item.zip,
            });
            currentExp.push({
              address: item.address,
              amount_due: (item.amount_due - x.amount_due).toFixed(2),
              amount_paid:
                x.purchase_status === "UNPAID"
                  ? 0
                  : (item.amount_paid - x.amount_paid).toFixed(2),
              city: item.city,
              description: item.description,
              linked_bill_id: null,
              month: item.month,
              next_payment: item.next_payment,
              owner_id: item.owner_id,
              payer: "",
              payment_frequency: null,
              property_uid: item.property_uid,
              pur_property_id: item.pur_property_id,
              purchase_date: item.purchase_date,
              purchase_frequency: item.purchase_frequency,
              purchase_notes: item.purchase_notes,
              purchase_status: item.purchase_status,
              purchase_type: "MANAGEMENT " + item.purchase_type,
              purchase_uid: "",
              receiver: "",
              state: item.state,
              unit: item.unit,
              year: item.year,
              zip: item.zip,
            });
          }
        });
      });

      if (resArr.length > 0) {
        for (let r = 0; r < resArr.length; r++) {
          if (
            currentExpSummary.some(
              (ces) => ces.purchase_type === resArr[r].purchase_type
            )
          ) {
            let i = currentExpSummary.findIndex(
              (ces) => ces.purchase_type === resArr[r].purchase_type
            );

            currentExpSummary[i].amount_due =
              parseFloat(currentExpSummary[i].amount_due) +
              parseFloat(resArr[r].amount_due);
            currentExpSummary[i].amount_paid =
              parseFloat(currentExpSummary[i].amount_paid) +
              parseFloat(resArr[r].amount_paid);
          } else {
            currentExpSummary.push({
              owner_id: user.user_uid,
              purchase_type: resArr[r].purchase_type,
              property_uid: resArr[r].property_uid,
              receiver: resArr[r].receiver,
              month: month,
              year: year,
              amount_due: parseFloat(resArr[r].amount_due),
              amount_paid: parseFloat(resArr[r].amount_paid),
            });
          }
        }
      }
      // console.log(currentRevSummary);
      const resArrRevSum = [];
      currentRevSummary.forEach((rev, i) => {
        // console.log(rev);
        if (!rev.purchase_type.includes("OWNER PAYMENT")) {
          resArrRevSum.push(rev);
        }
      });
      // console.log(currentRevSummary);
      setRevenue(currentRev);
      setExpense(currentExp);
      setRevenueSummary(resArrRevSum);
      setExpenseSummary(currentExpSummary);
    }

    setIsLoading(false);
  };

  console.log(revenue);
  console.log(expense);
  console.log(revenueSummary);
  console.log(expenseSummary);
  useEffect(() => {
    fetchCashflow();
  }, [year, month, filter]);

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

  return (
    <div className="w-100 overflow-hidden">
      <div className="flex-1">
        {/* <div
          hidden={!responsive.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </div> */}
        <div className="w-100 mb-5 overflow-scroll">
          {/* <Header title="Owner Cashflow" /> */}
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
              <Col>
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

            <Row className="m-3">
              <Col xs={1} className="d-flex align-items-center">
                Filters
              </Col>
              <Col xs={3} className="d-flex align-items-center">
                Month:&nbsp;&nbsp;&nbsp;&nbsp;
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
              <Col xs={3} className="d-flex align-items-center">
                Year:&nbsp;&nbsp;&nbsp;&nbsp;
                <select
                  className="mt-1"
                  value={year}
                  onChange={(e) => setYear(e.currentTarget.value)}
                >
                  {options}
                </select>
              </Col>
              {byProperty ? (
                <Col>
                  By Category
                  <Switch
                    checked={filter}
                    onChange={() => setFilter(!filter)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  By Property
                </Col>
              ) : (
                <Col>
                  By Property:
                  <Switch
                    checked={filter}
                    onChange={() => setFilter(!filter)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Col>
              )}
            </Row>
            {!isLoading ? (
              filter === false ? (
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
                        <TableCell width="500px">
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
                              setToggleMonthlyManagementRent(false);
                              setToggleMonthlyManagementExtra(false);
                              setToggleMonthlyManagementLate(false);
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
                        <TableCell width="500px">
                          &nbsp;&nbsp;Revenue
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            // hidden={toggleMonthlyRevenue}
                            onClick={() => {
                              setToggleMonthlyRevenue(!toggleMonthlyRevenue);
                              setToggleMonthlyRent(false);
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
                          <TableCell width="500px">
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
                            {revenueSummary
                              .find((revS) => revS.purchase_type === "RENT")
                              .amount_due.toFixed(2) -
                              revenueSummary
                                .find((revS) => revS.purchase_type === "RENT")
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px">
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
                              {rev.amount_due.toFixed(2) -
                                rev.amount_paid.toFixed(2)}
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
                          <TableCell width="500px">
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
                            {revenueSummary
                              .find(
                                (revS) => revS.purchase_type === "EXTRA CHARGES"
                              )
                              .amount_due.toFixed(2) -
                              revenueSummary
                                .find(
                                  (revS) =>
                                    revS.purchase_type === "EXTRA CHARGES"
                                )
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px">
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
                              {rev.amount_due.toFixed(2) -
                                rev.amount_paid.toFixed(2)}
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
                          <TableCell width="500px">
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
                            {revenueSummary
                              .find((revS) => revS.purchase_type === "DEPOSIT")
                              .amount_due.toFixed(2) -
                              revenueSummary
                                .find(
                                  (revS) => revS.purchase_type === "DEPOSIT"
                                )
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px">
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
                              {rev.amount_due.toFixed(2) -
                                rev.amount_paid.toFixed(2)}
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
                          <TableCell width="500px">
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
                            {revenueSummary
                              .find((revS) => revS.purchase_type === "UTILITY")
                              .amount_due.toFixed(2) -
                              revenueSummary
                                .find(
                                  (revS) => revS.purchase_type === "UTILITY"
                                )
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px">
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
                              {rev.amount_due.toFixed(2) -
                                rev.amount_paid.toFixed(2)}
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
                          <TableCell width="500px">
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
                            {revenueSummary
                              .find((revS) => revS.purchase_type === "LATE FEE")
                              .amount_due.toFixed(2) -
                              revenueSummary
                                .find(
                                  (revS) => revS.purchase_type === "LATE FEE"
                                )
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px">
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
                              {rev.amount_due.toFixed(2) -
                                rev.amount_paid.toFixed(2)}
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
                          <TableCell width="500px">
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
                          <TableCell width="500px">
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
                            {revenueSummary
                              .find(
                                (revS) => revS.purchase_type === "MAINTENANCE"
                              )
                              .amount_due.toFixed(2) -
                              revenueSummary
                                .find(
                                  (revS) => revS.purchase_type === "MAINTENANCE"
                                )
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px">
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
                              {rev.amount_due.toFixed(2) -
                                rev.amount_paid.toFixed(2)}
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
                          <TableCell width="500px">
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
                          <TableCell width="500px">
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
                            {revenueSummary
                              .find((revS) => revS.purchase_type === "REPAIRS")
                              .amount_due.toFixed(2) -
                              revenueSummary
                                .find(
                                  (revS) => revS.purchase_type === "REPAIRS"
                                )
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyRevenue}>
                          <TableCell width="500px">
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
                              {rev.amount_due.toFixed(2) -
                                rev.amount_paid.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* monthly cashflow */}
                      <TableRow hidden={!toggleMonthlyCashFlow}>
                        <TableCell width="500px">
                          &nbsp;&nbsp;Expense
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            // hidden={toggleMonthlyExpense}
                            onClick={() => {
                              setToggleMonthlyExpense(!toggleMonthlyExpense);
                              setToggleMonthlyManagement(false);
                              setToggleMonthlyManagementRent(false);
                              setToggleMonthlyManagementExtra(false);
                              setToggleMonthlyManagementLate(false);
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
                      {/* Management */}
                      {expenseSummary.find(
                        (revS) => revS.purchase_type === "MANAGEMENT"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
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
                            {expenseSummary
                              .find(
                                (revS) => revS.purchase_type === "MANAGEMENT"
                              )
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (revS) => revS.purchase_type === "MANAGEMENT"
                              )
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {expenseSummary
                              .find(
                                (revS) => revS.purchase_type === "MANAGEMENT"
                              )
                              .amount_due.toFixed(2) -
                              expenseSummary
                                .find(
                                  (revS) => revS.purchase_type === "MANAGEMENT"
                                )
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
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
                      {expense.map((rev, i) => {
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
                              {rev.amount_due}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due - rev.amount_paid.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* Management Rent*/}
                      {expenseSummary.find(
                        (revS) => revS.purchase_type === "MANAGEMENT RENT"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
                            &nbsp;&nbsp;&nbsp;&nbsp;Management Rent{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyManagementRent}
                              onClick={() => {
                                setToggleMonthlyManagementRent(
                                  !toggleMonthlyManagementRent
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyManagementRent
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
                                  revS.purchase_type === "MANAGEMENT RENT"
                              )
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (revS) =>
                                  revS.purchase_type === "MANAGEMENT RENT"
                              )
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {expenseSummary
                              .find(
                                (revS) =>
                                  revS.purchase_type === "MANAGEMENT RENT"
                              )
                              .amount_due.toFixed(2) -
                              expenseSummary
                                .find(
                                  (revS) =>
                                    revS.purchase_type === "MANAGEMENT RENT"
                                )
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
                            &nbsp;&nbsp;&nbsp;&nbsp;Management Rent{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyManagementRent}
                              onClick={() => {
                                setToggleMonthlyManagementRent(
                                  !toggleMonthlyManagementRent
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyManagementRent
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
                      {expense.map((rev, i) => {
                        return rev.purchase_type === "MANAGEMENT RENT" ? (
                          <TableRow hidden={!toggleMonthlyManagementRent}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due - rev.amount_paid.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* Management extra charges*/}
                      {expenseSummary.find(
                        (revS) =>
                          revS.purchase_type === "MANAGEMENT EXTRA CHARGES"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
                            &nbsp;&nbsp;&nbsp;&nbsp;Management Extra Charges{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // // hidden={toggleMonthlyManagementExtra}
                              onClick={() => {
                                setToggleMonthlyManagementExtra(
                                  !toggleMonthlyManagementExtra
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyManagementExtra
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
                                  revS.purchase_type ===
                                  "MANAGEMENT EXTRA CHARGES"
                              )
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (revS) =>
                                  revS.purchase_type ===
                                  "MANAGEMENT EXTRA CHARGES"
                              )
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {expenseSummary
                              .find(
                                (revS) =>
                                  revS.purchase_type ===
                                  "MANAGEMENT EXTRA CHARGES"
                              )
                              .amount_due.toFixed(2) -
                              expenseSummary
                                .find(
                                  (revS) =>
                                    revS.purchase_type ===
                                    "MANAGEMENT EXTRA CHARGES"
                                )
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
                            &nbsp;&nbsp;&nbsp;&nbsp;Management Extra Charges{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyManagementExtra}
                              onClick={() => {
                                setToggleMonthlyManagementExtra(
                                  !toggleMonthlyManagementExtra
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyManagementExtra
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
                      {/* Management Extra Charges map individual */}
                      {expense.map((rev, i) => {
                        return rev.purchase_type ===
                          "MANAGEMENT EXTRA CHARGES" ? (
                          <TableRow hidden={!toggleMonthlyManagementExtra}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due - rev.amount_paid.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* Management */}
                      {expenseSummary.find(
                        (revS) => revS.purchase_type === "MANAGEMENT LATE FEE"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
                            &nbsp;&nbsp;&nbsp;&nbsp;Management Late Fee{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyManagement}
                              onClick={() => {
                                setToggleMonthlyManagementLate(
                                  !toggleMonthlyManagementLate
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyManagementLate
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
                                  revS.purchase_type === "MANAGEMENT LATE FEE"
                              )
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (revS) =>
                                  revS.purchase_type === "MANAGEMENT LATE FEE"
                              )
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {expenseSummary
                              .find(
                                (revS) =>
                                  revS.purchase_type === "MANAGEMENT LATE FEE"
                              )
                              .amount_due.toFixed(2) -
                              expenseSummary
                                .find(
                                  (revS) =>
                                    revS.purchase_type === "MANAGEMENT LATE FEE"
                                )
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
                            &nbsp;&nbsp;&nbsp;&nbsp;Management Late fee{" "}
                            <img
                              src={SortLeft}
                              alt="Expand closed"
                              // hidden={toggleMonthlyManagementLate}
                              onClick={() => {
                                setToggleMonthlyManagementLate(
                                  !toggleMonthlyManagementLate
                                );
                              }}
                              style={{
                                marginTop: "0.4rem",
                                width: "10px",
                                height: "10px",
                                float: "right",
                                transform: toggleMonthlyManagementLate
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
                      {/* Management late fee map individual */}
                      {expense.map((rev, i) => {
                        return rev.purchase_type === "MANAGEMENT LATE FEE" ? (
                          <TableRow hidden={!toggleMonthlyManagementLate}>
                            <TableCell width="500px">
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                              {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                              {rev.zip}
                            </TableCell>
                            <TableCell align="right">
                              {rev.amount_paid.toFixed(2)}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due}
                            </TableCell>{" "}
                            <TableCell align="right">
                              {rev.amount_due - rev.amount_paid.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* Maintenance */}
                      {expenseSummary.find(
                        (revS) => revS.purchase_type === "MAINTENANCE"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
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
                                (revS) => revS.purchase_type === "MAINTENANCE"
                              )
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (revS) => revS.purchase_type === "MAINTENANCE"
                              )
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {expenseSummary
                              .find(
                                (revS) => revS.purchase_type === "MAINTENANCE"
                              )
                              .amount_due.toFixed(2) -
                              expenseSummary
                                .find(
                                  (revS) => revS.purchase_type === "MAINTENANCE"
                                )
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
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
                              {rev.amount_due.toFixed(2) -
                                rev.amount_paid.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* repairs */}
                      {expenseSummary.find(
                        (revS) => revS.purchase_type === "REPAIRS"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
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
                              .find((revS) => revS.purchase_type === "REPAIRS")
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find((revS) => revS.purchase_type === "REPAIRS")
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {expenseSummary
                              .find((revS) => revS.purchase_type === "REPAIRS")
                              .amount_due.toFixed(2) -
                              expenseSummary
                                .find(
                                  (revS) => revS.purchase_type === "REPAIRS"
                                )
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
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
                              {rev.amount_due.toFixed(2) -
                                rev.amount_paid.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* Mortgage */}
                      {expenseSummary.find(
                        (revS) => revS.purchase_type === "MORTGAGE"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
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
                              .find((revS) => revS.purchase_type === "MORTGAGE")
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find((revS) => revS.purchase_type === "MORTGAGE")
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {expenseSummary
                              .find((revS) => revS.purchase_type === "MORTGAGE")
                              .amount_due.toFixed(2) -
                              expenseSummary
                                .find(
                                  (revS) => revS.purchase_type === "MORTGAGE"
                                )
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
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
                              {rev.amount_due.toFixed(2) -
                                rev.amount_paid.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* Taxes */}
                      {expenseSummary.find(
                        (revS) => revS.purchase_type === "TAXES"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
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
                              .find((revS) => revS.purchase_type === "TAXES")
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find((revS) => revS.purchase_type === "TAXES")
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {expenseSummary
                              .find((revS) => revS.purchase_type === "TAXES")
                              .amount_due.toFixed(2) -
                              expenseSummary
                                .find((revS) => revS.purchase_type === "TAXES")
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
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
                              {rev.amount_due.toFixed(2) -
                                rev.amount_paid.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* Insurance */}
                      {expenseSummary.find(
                        (revS) => revS.purchase_type === "INSURANCE"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
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
                                (revS) => revS.purchase_type === "INSURANCE"
                              )
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find(
                                (revS) => revS.purchase_type === "INSURANCE"
                              )
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {expenseSummary
                              .find(
                                (revS) => revS.purchase_type === "INSURANCE"
                              )
                              .amount_due.toFixed(2) -
                              expenseSummary
                                .find(
                                  (revS) => revS.purchase_type === "INSURANCE"
                                )
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
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
                              {rev.amount_due.toFixed(2) -
                                rev.amount_paid.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                      {/* UtilityExpense */}
                      {expenseSummary.find(
                        (revS) => revS.purchase_type === "UTILITY"
                      ) ? (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
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
                              .find((revS) => revS.purchase_type === "UTILITY")
                              .amount_paid.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {expenseSummary
                              .find((revS) => revS.purchase_type === "UTILITY")
                              .amount_due.toFixed(2)}
                          </TableCell>{" "}
                          <TableCell align="right">
                            {" "}
                            {expenseSummary
                              .find((revS) => revS.purchase_type === "UTILITY")
                              .amount_due.toFixed(2) -
                              expenseSummary
                                .find(
                                  (revS) => revS.purchase_type === "UTILITY"
                                )
                                .amount_paid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hidden={!toggleMonthlyExpense}>
                          <TableCell width="500px">
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
                              {rev.amount_due.toFixed(2) -
                                rev.amount_paid.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      })}
                    </TableBody>
                  </Table>
                </Row>
              ) : (
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
                        <TableCell width="500px">
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
                              setToggleMonthlyManagementRent(false);
                              setToggleMonthlyManagementExtra(false);
                              setToggleMonthlyManagementLate(false);
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
                      {ownerData.map((property, i) => {
                        return (
                          <>
                            {" "}
                            <TableRow hidden={!toggleMonthlyCashFlow}>
                              <TableCell width="500px">
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
                                  <TableCell>
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
                                    (revS) => revS.purchase_type === "RENT"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                        .amount_due.toFixed(2) -
                                        revenueSummary
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
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                      <TableCell width="500px" maxWidth="500px">
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
                                        {rev.amount_due.toFixed(2) -
                                          rev.amount_paid.toFixed(2)}
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
                                    <TableCell width="500px" maxWidth="500px">
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
                                        .amount_due.toFixed(2) -
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
                                          )
                                          .amount_paid.toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                      <TableCell width="500px" maxWidth="500px">
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
                                        {rev.amount_due.toFixed(2) -
                                          rev.amount_paid.toFixed(2)}
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
                                    <TableCell width="500px" maxWidth="500px">
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
                                        .amount_due.toFixed(2) -
                                        revenueSummary
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
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                      <TableCell width="500px" maxWidth="500px">
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
                                        {rev.amount_due.toFixed(2) -
                                          rev.amount_paid.toFixed(2)}
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
                                    <TableCell width="500px" maxWidth="500px">
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
                                        .amount_due.toFixed(2) -
                                        revenueSummary
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
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                      <TableCell width="500px" maxWidth="500px">
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
                                        {rev.amount_due.toFixed(2) -
                                          rev.amount_paid.toFixed(2)}
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
                                    <TableCell width="500px" maxWidth="500px">
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
                                        .amount_due.toFixed(2) -
                                        revenueSummary
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
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                      <TableCell width="500px" maxWidth="500px">
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
                                        {rev.amount_due.toFixed(2) -
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
                                    <TableCell width="500px" maxWidth="500px">
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
                                    <TableCell width="500px" maxWidth="500px">
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
                                        .amount_due.toFixed(2) -
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
                                          )
                                          .amount_paid.toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                      <TableCell width="500px" maxWidth="500px">
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
                                        {rev.amount_due.toFixed(2) -
                                          rev.amount_paid.toFixed(2)}
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
                                    <TableCell width="500px" maxWidth="500px">
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
                                    <TableCell width="500px" maxWidth="500px">
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
                                        .amount_due.toFixed(2) -
                                        revenueSummary
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
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyRevenue}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                      <TableCell width="500px" maxWidth="500px">
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
                                        {rev.amount_due.toFixed(2) -
                                          rev.amount_paid.toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                <TableRow>
                                  <TableCell>
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
                                        setToggleMonthlyManagementRent(false);
                                        setToggleMonthlyManagementExtra(false);
                                        setToggleMonthlyManagementLate(false);
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
                                {expenseSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) =>
                                      revS.purchase_type === "MANAGEMENT"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                      {expenseSummary
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
                                      {expenseSummary
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
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "MANAGEMENT"
                                        )
                                        .amount_due.toFixed(2) -
                                        expenseSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type ===
                                              "MANAGEMENT"
                                          )
                                          .amount_paid.toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                {expense.map((rev, i) => {
                                  return rev.purchase_type === "MANAGEMENT" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow hidden={!toggleMonthlyManagement}>
                                      <TableCell width="500px" maxWidth="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {rev.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {rev.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {rev.amount_due}
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
                                {/* Management Rent*/}
                                {expenseSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) =>
                                      revS.purchase_type === "MANAGEMENT RENT"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Management
                                      Rent{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyManagementRent}
                                        onClick={() => {
                                          setToggleMonthlyManagementRent(
                                            !toggleMonthlyManagementRent
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyManagementRent
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type ===
                                            "MANAGEMENT RENT"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type ===
                                            "MANAGEMENT RENT"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type ===
                                            "MANAGEMENT RENT"
                                        )
                                        .amount_due.toFixed(2) -
                                        expenseSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type ===
                                              "MANAGEMENT RENT"
                                          )
                                          .amount_paid.toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Management
                                      Rent{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyManagementRent}
                                        onClick={() => {
                                          setToggleMonthlyManagementRent(
                                            !toggleMonthlyManagementRent
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyManagementRent
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
                                {expense.map((rev, i) => {
                                  return rev.purchase_type ===
                                    "MANAGEMENT RENT" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow
                                      hidden={!toggleMonthlyManagementRent}
                                    >
                                      <TableCell width="500px" maxWidth="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {rev.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {rev.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {rev.amount_due}
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
                                {/* Management extra charges*/}
                                {expenseSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) =>
                                      revS.purchase_type ===
                                      "MANAGEMENT EXTRA CHARGES"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Management
                                      Extra Charges{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyManagementExtra}
                                        onClick={() => {
                                          setToggleMonthlyManagementExtra(
                                            !toggleMonthlyManagementExtra
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform:
                                            toggleMonthlyManagementExtra
                                              ? "rotate(90deg)"
                                              : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type ===
                                            "MANAGEMENT EXTRA CHARGES"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type ===
                                            "MANAGEMENT EXTRA CHARGES"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type ===
                                            "MANAGEMENT EXTRA CHARGES"
                                        )
                                        .amount_due.toFixed(2) -
                                        expenseSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type ===
                                              "MANAGEMENT EXTRA CHARGES"
                                          )
                                          .amount_paid.toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Management
                                      Extra Charges{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyManagementExtra}
                                        onClick={() => {
                                          setToggleMonthlyManagementExtra(
                                            !toggleMonthlyManagementExtra
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform:
                                            toggleMonthlyManagementExtra
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
                                {/* Management Extra Charges map individual */}
                                {expense.map((rev, i) => {
                                  return rev.purchase_type ===
                                    "MANAGEMENT EXTRA CHARGES" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow
                                      hidden={!toggleMonthlyManagementExtra}
                                    >
                                      <TableCell width="500px" maxWidth="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {rev.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {rev.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {rev.amount_due}
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
                                {/* Management */}
                                {expenseSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) =>
                                      revS.purchase_type ===
                                      "MANAGEMENT LATE FEE"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Management
                                      Late Fee{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyManagement}
                                        onClick={() => {
                                          setToggleMonthlyManagementLate(
                                            !toggleMonthlyManagementLate
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyManagementLate
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                          transition: "transform 0.2s ease-out",
                                        }}
                                      />
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type ===
                                            "MANAGEMENT LATE FEE"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type ===
                                            "MANAGEMENT LATE FEE"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type ===
                                            "MANAGEMENT LATE FEE"
                                        )
                                        .amount_due.toFixed(2) -
                                        expenseSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type ===
                                              "MANAGEMENT LATE FEE"
                                          )
                                          .amount_paid.toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Management
                                      Late fee{" "}
                                      <img
                                        src={SortLeft}
                                        alt="Expand closed"
                                        // hidden={toggleMonthlyManagementLate}
                                        onClick={() => {
                                          setToggleMonthlyManagementLate(
                                            !toggleMonthlyManagementLate
                                          );
                                        }}
                                        style={{
                                          marginTop: "0.4rem",
                                          width: "10px",
                                          height: "10px",
                                          float: "right",
                                          transform: toggleMonthlyManagementLate
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
                                {/* Management late fee map individual */}
                                {expense.map((rev, i) => {
                                  return rev.purchase_type ===
                                    "MANAGEMENT LATE FEE" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow
                                      hidden={!toggleMonthlyManagementLate}
                                    >
                                      <TableCell width="500px" maxWidth="500px">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {rev.description}
                                      </TableCell>
                                      <TableCell align="right">
                                        {rev.amount_paid.toFixed(2)}
                                      </TableCell>{" "}
                                      <TableCell align="right">
                                        {rev.amount_due}
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
                                {/* Maintenance */}
                                {expenseSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) =>
                                      revS.purchase_type === "MAINTENANCE"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                      {expenseSummary
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
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "MAINTENANCE"
                                        )
                                        .amount_due.toFixed(2) -
                                        expenseSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type ===
                                              "MAINTENANCE"
                                          )
                                          .amount_paid.toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                {expense.map((rev, i) => {
                                  return rev.purchase_type === "MAINTENANCE" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow
                                      hidden={!toggleMonthlyMaintenance}
                                    >
                                      <TableCell width="500px" maxWidth="500px">
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
                                        {rev.amount_due.toFixed(2) -
                                          rev.amount_paid.toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* repairs */}
                                {expenseSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) => revS.purchase_type === "REPAIRS"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                      {expenseSummary
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
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "REPAIRS"
                                        )
                                        .amount_due.toFixed(2) -
                                        expenseSummary
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
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                {expense.map((rev, i) => {
                                  return rev.purchase_type === "REPAIRS" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow
                                      hidden={!toggleMonthlyMaintenance}
                                    >
                                      <TableCell width="500px" maxWidth="500px">
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
                                        {rev.amount_due.toFixed(2) -
                                          rev.amount_paid.toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* Mortgage */}
                                {expenseSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) => revS.purchase_type === "MORTGAGE"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "MORTGAGE"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "MORTGAGE"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "MORTGAGE"
                                        )
                                        .amount_due.toFixed(2) -
                                        expenseSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type === "MORTGAGE"
                                          )
                                          .amount_paid.toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                {expense.map((rev, i) => {
                                  return rev.purchase_type === "MORTGAGE" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow hidden={!toggleMonthlyMortgage}>
                                      <TableCell width="500px" maxWidth="500px">
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
                                        {rev.amount_due.toFixed(2) -
                                          rev.amount_paid.toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* Taxes */}
                                {expenseSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) => revS.purchase_type === "TAXES"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "TAXES"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "TAXES"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "TAXES"
                                        )
                                        .amount_due.toFixed(2) -
                                        expenseSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type === "TAXES"
                                          )
                                          .amount_paid.toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                {expense.map((rev, i) => {
                                  return rev.purchase_type === "TAXES" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow hidden={!toggleMonthlyTaxes}>
                                      <TableCell width="500px" maxWidth="500px">
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
                                        {rev.amount_due.toFixed(2) -
                                          rev.amount_paid.toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* Insurance */}
                                {expenseSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) => revS.purchase_type === "INSURANCE"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "INSURANCE"
                                        )
                                        .amount_paid.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "INSURANCE"
                                        )
                                        .amount_due.toFixed(2)}
                                    </TableCell>{" "}
                                    <TableCell align="right">
                                      {" "}
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "INSURANCE"
                                        )
                                        .amount_due.toFixed(2) -
                                        expenseSummary
                                          .filter(
                                            (rev) =>
                                              rev.property_uid ===
                                              property.property_uid
                                          )
                                          .find(
                                            (revS) =>
                                              revS.purchase_type === "INSURANCE"
                                          )
                                          .amount_paid.toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                {expense.map((rev, i) => {
                                  return rev.purchase_type === "INSURANCE" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow hidden={!toggleMonthlyInsurance}>
                                      <TableCell width="500px" maxWidth="500px">
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
                                        {rev.amount_due.toFixed(2) -
                                          rev.amount_paid.toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ""
                                  );
                                })}
                                {/* UtilityExpense */}
                                {expenseSummary
                                  .filter(
                                    (rev) =>
                                      rev.property_uid === property.property_uid
                                  )
                                  .find(
                                    (revS) => revS.purchase_type === "UTILITY"
                                  ) ? (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                      {expenseSummary
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
                                      {expenseSummary
                                        .filter(
                                          (rev) =>
                                            rev.property_uid ===
                                            property.property_uid
                                        )
                                        .find(
                                          (revS) =>
                                            revS.purchase_type === "UTILITY"
                                        )
                                        .amount_due.toFixed(2) -
                                        expenseSummary
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
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <TableRow hidden={!toggleMonthlyExpense}>
                                    <TableCell width="500px" maxWidth="500px">
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
                                {expense.map((rev, i) => {
                                  return rev.purchase_type === "UTILITY" &&
                                    rev.property_uid ===
                                      property.property_uid ? (
                                    <TableRow
                                      hidden={!toggleMonthlyUtilityExpense}
                                    >
                                      <TableCell width="500px" maxWidth="500px">
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
                                        {rev.amount_due.toFixed(2) -
                                          rev.amount_paid.toFixed(2)}
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
