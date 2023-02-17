import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import Header from "../Header";
import SideBar from "./SideBar";
import AppContext from "../../AppContext";
import SortDown from "../../icons/Sort-down.svg";
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

export default function OwnerCashflow() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [isLoading, setIsLoading] = useState(true);
  // monthly toggles
  const [toggleMonthlyCashFlow, setToggleMonthlyCashFlow] = useState(false);
  // monthly revenue toggle
  const [toggleMonthlyRevenue, setToggleMonthlyRevenue] = useState(false);
  const [toggleMonthlyRent, setToggleMonthlyRent] = useState(false);
  const [toggleMonthlyExtra, setToggleMonthlyExtra] = useState(false);
  const [toggleMonthlyUtility, setToggleMonthlyUtility] = useState(false);
  const [toggleMonthlyOwnerPayment, setToggleMonthlyOwnerPayment] =
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
  const fetchCashflow = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }

    const cashflowResponse = await get(
      `/CashflowOwner?owner_id=${user.user_uid}`
    );

    setRevenue(cashflowResponse.result.revenue);
    setExpense(cashflowResponse.result.expense);
    setRevenueSummary(cashflowResponse.result.revenue_summary);
    setExpenseSummary(cashflowResponse.result.expense_summary);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchCashflow();
  }, []);

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
          <Header title="Owner Cashflow" />
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
                <h3>Portfolio Cashflow Summary</h3>
              </Col>
              <Col></Col>
            </Row>
            {!isLoading ? (
              <Row className="m-3">
                <Table
                  responsive="md"
                  classes={{ root: classes.customTable }}
                  size="small"
                >
                  <TableHead>
                    <TableCell width="300px"></TableCell>
                    <TableCell align="right">To Date</TableCell>
                    <TableCell align="right">Expected</TableCell>
                    <TableCell align="right">Delta</TableCell>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell width="300px">
                        {new Date().toLocaleString("default", {
                          month: "long",
                        })}{" "}
                        <img
                          src={SortLeft}
                          alt="Expand closed"
                          hidden={toggleMonthlyCashFlow}
                          onClick={() => {
                            setToggleMonthlyCashFlow(!toggleMonthlyCashFlow);
                            setToggleMonthlyRevenue(false);
                            setToggleMonthlyRent(false);
                            setToggleMonthlyExtra(false);
                            setToggleMonthlyUtility(false);
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
                          }}
                        />
                        <img
                          src={SortDown}
                          alt="Expand open"
                          hidden={!toggleMonthlyCashFlow}
                          onClick={() => {
                            setToggleMonthlyCashFlow(!toggleMonthlyCashFlow);
                            setToggleMonthlyRevenue(false);
                            setToggleMonthlyRent(false);
                            setToggleMonthlyExtra(false);
                            setToggleMonthlyUtility(false);
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
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {revenueSummary.reduce(function (prev, current) {
                          return prev + +current.amount_paid;
                        }, 0) -
                          expenseSummary.reduce(function (prev, current) {
                            return prev + +current.amount_paid;
                          }, 0)}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        {revenueSummary.reduce(function (prev, current) {
                          return prev + +current.amount_due;
                        }, 0) -
                          expenseSummary.reduce(function (prev, current) {
                            return prev + +current.amount_due;
                          }, 0)}
                      </TableCell>
                      <TableCell align="right">
                        {revenueSummary.reduce(function (prev, current) {
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
                            }, 0))}
                      </TableCell>
                    </TableRow>
                    {/* revenue */}
                    <TableRow hidden={!toggleMonthlyCashFlow}>
                      <TableCell width="300px">
                        &nbsp;&nbsp;Revenue
                        <img
                          src={SortLeft}
                          alt="Expand closed"
                          hidden={toggleMonthlyRevenue}
                          onClick={() => {
                            setToggleMonthlyRevenue(!toggleMonthlyRevenue);
                            setToggleMonthlyRent(false);
                            setToggleMonthlyExtra(false);
                            setToggleMonthlyUtility(false);
                            setToggleMonthlyMaintenanceRevenue(false);
                            setToggleMonthlyRepairsRevenue(false);
                          }}
                          style={{
                            marginTop: "0.4rem",
                            width: "10px",
                            height: "10px",
                            float: "right",
                          }}
                        />
                        <img
                          src={SortDown}
                          alt="Expand open"
                          hidden={!toggleMonthlyRevenue}
                          onClick={() => {
                            setToggleMonthlyRevenue(!toggleMonthlyRevenue);
                            setToggleMonthlyRent(false);
                            setToggleMonthlyExtra(false);
                            setToggleMonthlyUtility(false);
                            setToggleMonthlyMaintenanceRevenue(false);
                            setToggleMonthlyRepairsRevenue(false);
                          }}
                          style={{
                            marginTop: "0.4rem",
                            width: "10px",
                            height: "10px",
                            float: "right",
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {revenueSummary.reduce(function (prev, current) {
                          return prev + +current.amount_paid;
                        }, 0)}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        {revenueSummary.reduce(function (prev, current) {
                          return prev + +current.amount_due;
                        }, 0)}
                      </TableCell>
                      <TableCell align="right">
                        {revenueSummary.reduce(function (prev, current) {
                          return prev + +current.amount_due;
                        }, 0) -
                          revenueSummary.reduce(function (prev, current) {
                            return prev + +current.amount_paid;
                          }, 0)}
                      </TableCell>
                    </TableRow>
                    {/* rent */}
                    {revenueSummary.find(
                      (revS) => revS.purchase_type === "RENT"
                    ) ? (
                      <TableRow hidden={!toggleMonthlyRevenue}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Rent{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyRent}
                            onClick={() => {
                              setToggleMonthlyRent(!toggleMonthlyRent);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyRent}
                            onClick={() => {
                              setToggleMonthlyRent(!toggleMonthlyRent);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "RENT"
                            ).amount_paid
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "RENT"
                            ).amount_due
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {" "}
                          {revenueSummary.find(
                            (revS) => revS.purchase_type === "RENT"
                          ).amount_due -
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "RENT"
                            ).amount_paid}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow hidden={!toggleMonthlyRevenue}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Rent{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyRent}
                            onClick={() => {
                              setToggleMonthlyRent(!toggleMonthlyRent);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyRent}
                            onClick={() => {
                              setToggleMonthlyRent(!toggleMonthlyRent);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>
                      </TableRow>
                    )}
                    {/* rent map individual */}
                    {revenue.map((rev, i) => {
                      return rev.purchase_type === "RENT" ? (
                        <TableRow hidden={!toggleMonthlyRent}>
                          <TableCell width="300px">
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                            {rev.zip}
                          </TableCell>
                          <TableCell align="right">{rev.amount_paid}</TableCell>{" "}
                          <TableCell align="right">{rev.amount_due}</TableCell>{" "}
                          <TableCell align="right">
                            {rev.amount_due - rev.amount_paid}
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
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Extra Charges{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyExtra}
                            onClick={() => {
                              setToggleMonthlyExtra(!toggleMonthlyExtra);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyExtra}
                            onClick={() => {
                              setToggleMonthlyExtra(!toggleMonthlyExtra);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell width="300px">
                          {
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "EXTRA CHARGES"
                            ).amount_paid
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "EXTRA CHARGES"
                            ).amount_due
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {" "}
                          {revenueSummary.find(
                            (revS) => revS.purchase_type === "EXTRA CHARGES"
                          ).amount_due -
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "EXTRA CHARGES"
                            ).amount_paid}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow hidden={!toggleMonthlyRevenue}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Extra Charges{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyExtra}
                            onClick={() => {
                              setToggleMonthlyExtra(!toggleMonthlyExtra);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyExtra}
                            onClick={() => {
                              setToggleMonthlyExtra(!toggleMonthlyExtra);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>
                      </TableRow>
                    )}
                    {/* extra charges  map indivial */}
                    {revenue.map((rev, i) => {
                      return rev.purchase_type === "EXTRA CHARGES" ? (
                        <TableRow hidden={!toggleMonthlyExtra}>
                          <TableCell width="300px">
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                            {rev.zip}
                          </TableCell>
                          <TableCell align="right">{rev.amount_paid}</TableCell>{" "}
                          <TableCell align="right">{rev.amount_due}</TableCell>{" "}
                          <TableCell align="right">
                            {rev.amount_due - rev.amount_paid}
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
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Utilities{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyUtility}
                            onClick={() => {
                              setToggleMonthlyUtility(!toggleMonthlyUtility);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyUtility}
                            onClick={() => {
                              setToggleMonthlyUtility(!toggleMonthlyUtility);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "UTILITY"
                            ).amount_paid
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "UTILITY"
                            ).amount_due
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {" "}
                          {revenueSummary.find(
                            (revS) => revS.purchase_type === "UTILITY"
                          ).amount_due -
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "UTILITY"
                            ).amount_paid}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow hidden={!toggleMonthlyRevenue}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Utilities{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyUtility}
                            onClick={() => {
                              setToggleMonthlyUtility(!toggleMonthlyUtility);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyUtility}
                            onClick={() => {
                              setToggleMonthlyUtility(!toggleMonthlyUtility);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>
                      </TableRow>
                    )}
                    {/* utility map individual */}
                    {revenue.map((rev, i) => {
                      return rev.purchase_type === "UTILITY" ? (
                        <TableRow hidden={!toggleMonthlyUtility}>
                          <TableCell width="300px">
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                            {rev.zip}
                          </TableCell>
                          <TableCell align="right">{rev.amount_paid}</TableCell>{" "}
                          <TableCell align="right">{rev.amount_due}</TableCell>{" "}
                          <TableCell align="right">
                            {rev.amount_due - rev.amount_paid}
                          </TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                    {/* owner payment */}
                    {revenueSummary.find(
                      (revS) => revS.purchase_type === "OWNER PAYMENT"
                    ) ? (
                      <TableRow hidden={!toggleMonthlyRevenue}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Owner Payment{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyOwnerPayment}
                            onClick={() => {
                              setToggleMonthlyOwnerPayment(
                                !toggleMonthlyOwnerPayment
                              );
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyOwnerPayment}
                            onClick={() => {
                              setToggleMonthlyOwnerPayment(
                                !toggleMonthlyOwnerPayment
                              );
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "OWNER PAYMENT"
                            ).amount_paid
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "OWNER PAYMENT"
                            ).amount_due
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {" "}
                          {revenueSummary.find(
                            (revS) => revS.purchase_type === "OWNER PAYMENT"
                          ).amount_due -
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "OWNER PAYMENT"
                            ).amount_paid}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow hidden={!toggleMonthlyRevenue}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Owner Payment{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyOwnerPayment}
                            onClick={() => {
                              setToggleMonthlyOwnerPayment(
                                !toggleMonthlyOwnerPayment
                              );
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyOwnerPayment}
                            onClick={() => {
                              setToggleMonthlyOwnerPayment(
                                !toggleMonthlyOwnerPayment
                              );
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>
                      </TableRow>
                    )}
                    {/* owner payment map individual */}
                    {revenue.map((rev, i) => {
                      return rev.purchase_type === "OWNER PAYMENT" ? (
                        <TableRow hidden={!toggleMonthlyOwnerPayment}>
                          <TableCell width="300px">
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                            {rev.zip}
                          </TableCell>
                          <TableCell align="right">{rev.amount_paid}</TableCell>{" "}
                          <TableCell align="right">{rev.amount_due}</TableCell>{" "}
                          <TableCell align="right">
                            {rev.amount_due - rev.amount_paid}
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
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Maintenance{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyMaintenanceRevenue}
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
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyMaintenanceRevenue}
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
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell width="300px">
                          {
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "MAINTENANCE"
                            ).amount_paid
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "MAINTENANCE"
                            ).amount_due
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {" "}
                          {revenueSummary.find(
                            (revS) => revS.purchase_type === "MAINTENANCE"
                          ).amount_due -
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "MAINTENANCE"
                            ).amount_paid}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow hidden={!toggleMonthlyRevenue}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Maintenance
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyMaintenanceRevenue}
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
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyMaintenanceRevenue}
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
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>
                      </TableRow>
                    )}{" "}
                    {/* maintenance map individual */}
                    {revenue.map((rev, i) => {
                      return rev.purchase_type === "MAINTENANCE" ? (
                        <TableRow hidden={!toggleMonthlyMaintenanceRevenue}>
                          <TableCell width="300px">
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                            {rev.zip}
                          </TableCell>
                          <TableCell align="right">{rev.amount_paid}</TableCell>{" "}
                          <TableCell align="right">{rev.amount_due}</TableCell>{" "}
                          <TableCell align="right">
                            {rev.amount_due - rev.amount_paid}
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
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Repairs
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyRepairsRevenue}
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
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyRepairsRevenue}
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
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell width="300px">
                          {
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "REPAIRS"
                            ).amount_paid
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "REPAIRS"
                            ).amount_due
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {" "}
                          {revenueSummary.find(
                            (revS) => revS.purchase_type === "REPAIRS"
                          ).amount_due -
                            revenueSummary.find(
                              (revS) => revS.purchase_type === "REPAIRS"
                            ).amount_paid}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow hidden={!toggleMonthlyRevenue}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Repairs
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyRepairsRevenue}
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
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyRepairsRevenue}
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
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>
                      </TableRow>
                    )}
                    {/* repairs map individual */}
                    {revenue.map((rev, i) => {
                      return rev.purchase_type === "REPAIRS" ? (
                        <TableRow hidden={!toggleMonthlyRepairsRevenue}>
                          <TableCell width="300px">
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                            {rev.zip}
                          </TableCell>
                          <TableCell align="right">{rev.amount_paid}</TableCell>{" "}
                          <TableCell align="right">{rev.amount_due}</TableCell>{" "}
                          <TableCell align="right">
                            {rev.amount_due - rev.amount_paid}
                          </TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                    {/* monthly cashflow */}
                    <TableRow hidden={!toggleMonthlyCashFlow}>
                      <TableCell width="300px">
                        &nbsp;&nbsp;Expense
                        <img
                          src={SortLeft}
                          alt="Expand closed"
                          hidden={toggleMonthlyExpense}
                          onClick={() => {
                            setToggleMonthlyExpense(!toggleMonthlyExpense);
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
                          }}
                        />
                        <img
                          src={SortDown}
                          alt="Expand open"
                          hidden={!toggleMonthlyExpense}
                          onClick={() => {
                            setToggleMonthlyExpense(!toggleMonthlyExpense);
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
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {expenseSummary.reduce(function (prev, current) {
                          return prev + +current.amount_paid;
                        }, 0)}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        {expenseSummary.reduce(function (prev, current) {
                          return prev + +current.amount_due;
                        }, 0)}
                      </TableCell>
                      <TableCell align="right">
                        {expenseSummary.reduce(function (prev, current) {
                          return prev + +current.amount_due;
                        }, 0) -
                          expenseSummary.reduce(function (prev, current) {
                            return prev + +current.amount_paid;
                          }, 0)}
                      </TableCell>
                    </TableRow>
                    {/* Management */}
                    {expenseSummary.find(
                      (revS) => revS.purchase_type === "MANAGEMENT"
                    ) ? (
                      <TableRow hidden={!toggleMonthlyExpense}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Management{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyManagement}
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
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyManagement}
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
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "MANAGEMENT"
                            ).amount_paid
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "MANAGEMENT"
                            ).amount_due
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {" "}
                          {expenseSummary.find(
                            (revS) => revS.purchase_type === "MANAGEMENT"
                          ).amount_due -
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "MANAGEMENT"
                            ).amount_paid}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow hidden={!toggleMonthlyExpense}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Management{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyManagement}
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
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyManagement}
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
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>
                      </TableRow>
                    )}
                    {/* Management map individual */}
                    {expense.map((rev, i) => {
                      return rev.purchase_type === "MANAGEMENT" ? (
                        <TableRow hidden={!toggleMonthlyManagement}>
                          <TableCell width="300px">
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                            {rev.zip}
                          </TableCell>
                          <TableCell align="right">{rev.amount_paid}</TableCell>{" "}
                          <TableCell align="right">{rev.amount_due}</TableCell>{" "}
                          <TableCell align="right">
                            {rev.amount_due - rev.amount_paid}
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
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Maintenance{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyMaintenance}
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
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyMaintenance}
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
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "MAINTENANCE"
                            ).amount_paid
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "MAINTENANCE"
                            ).amount_due
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {" "}
                          {expenseSummary.find(
                            (revS) => revS.purchase_type === "MAINTENANCE"
                          ).amount_due -
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "MAINTENANCE"
                            ).amount_paid}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow hidden={!toggleMonthlyExpense}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Maintenance{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyMaintenance}
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
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyMaintenance}
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
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>
                      </TableRow>
                    )}
                    {/* Maintenance map individual */}
                    {expense.map((rev, i) => {
                      return rev.purchase_type === "MAINTENANCE" ? (
                        <TableRow hidden={!toggleMonthlyMaintenance}>
                          <TableCell width="300px">
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                            {rev.zip}
                          </TableCell>
                          <TableCell align="right">{rev.amount_paid}</TableCell>{" "}
                          <TableCell align="right">{rev.amount_due}</TableCell>{" "}
                          <TableCell align="right">
                            {rev.amount_due - rev.amount_paid}
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
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Repairs{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyRepairs}
                            onClick={() => {
                              setToggleMonthlyRepairs(!toggleMonthlyRepairs);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyRepairs}
                            onClick={() => {
                              setToggleMonthlyRepairs(!toggleMonthlyRepairs);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "REPAIRS"
                            ).amount_paid
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "REPAIRS"
                            ).amount_due
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {" "}
                          {expenseSummary.find(
                            (revS) => revS.purchase_type === "REPAIRS"
                          ).amount_due -
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "REPAIRS"
                            ).amount_paid}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow hidden={!toggleMonthlyExpense}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Repairs{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyRepairs}
                            onClick={() => {
                              setToggleMonthlyRepairs(!toggleMonthlyRepairs);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyRepairs}
                            onClick={() => {
                              setToggleMonthlyRepairs(!toggleMonthlyRepairs);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>
                      </TableRow>
                    )}
                    {/* repairs map individual */}
                    {expense.map((rev, i) => {
                      return rev.purchase_type === "REPAIRS" ? (
                        <TableRow hidden={!toggleMonthlyMaintenance}>
                          <TableCell width="300px">
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                            {rev.zip}
                          </TableCell>
                          <TableCell align="right">{rev.amount_paid}</TableCell>{" "}
                          <TableCell align="right">{rev.amount_due}</TableCell>{" "}
                          <TableCell align="right">
                            {rev.amount_due - rev.amount_paid}
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
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Mortgage{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyMortgage}
                            onClick={() => {
                              setToggleMonthlyMortgage(!toggleMonthlyMortgage);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyMortgage}
                            onClick={() => {
                              setToggleMonthlyMortgage(!toggleMonthlyMortgage);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "MORTGAGE"
                            ).amount_paid
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "MORTGAGE"
                            ).amount_due
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {" "}
                          {expenseSummary.find(
                            (revS) => revS.purchase_type === "MORTGAGE"
                          ).amount_due -
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "MORTGAGE"
                            ).amount_paid}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow hidden={!toggleMonthlyExpense}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Mortgage{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyMortgage}
                            onClick={() => {
                              setToggleMonthlyMortgage(!toggleMonthlyMortgage);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyMortgage}
                            onClick={() => {
                              setToggleMonthlyMortgage(!toggleMonthlyMortgage);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>
                      </TableRow>
                    )}
                    {/* Mortgage map individual */}
                    {expense.map((rev, i) => {
                      return rev.purchase_type === "MORTGAGE" ? (
                        <TableRow hidden={!toggleMonthlyMortgage}>
                          <TableCell width="300px">
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                            {rev.zip}
                          </TableCell>
                          <TableCell align="right">{rev.amount_paid}</TableCell>{" "}
                          <TableCell align="right">{rev.amount_due}</TableCell>{" "}
                          <TableCell align="right">
                            {rev.amount_due - rev.amount_paid}
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
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Taxes{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyTaxes}
                            onClick={() => {
                              setToggleMonthlyTaxes(!toggleMonthlyTaxes);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyTaxes}
                            onClick={() => {
                              setToggleMonthlyTaxes(!toggleMonthlyTaxes);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "TAXES"
                            ).amount_paid
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "TAXES"
                            ).amount_due
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {" "}
                          {expenseSummary.find(
                            (revS) => revS.purchase_type === "TAXES"
                          ).amount_due -
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "TAXES"
                            ).amount_paid}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow hidden={!toggleMonthlyExpense}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Taxes{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyTaxes}
                            onClick={() => {
                              setToggleMonthlyTaxes(!toggleMonthlyTaxes);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyTaxes}
                            onClick={() => {
                              setToggleMonthlyTaxes(!toggleMonthlyTaxes);
                            }}
                            style={{
                              marginTop: "0.4rem",
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>
                      </TableRow>
                    )}
                    {/* Taxes map individual */}
                    {expense.map((rev, i) => {
                      return rev.purchase_type === "TAXES" ? (
                        <TableRow hidden={!toggleMonthlyTaxes}>
                          <TableCell width="300px">
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                            {rev.zip}
                          </TableCell>
                          <TableCell align="right">{rev.amount_paid}</TableCell>{" "}
                          <TableCell align="right">{rev.amount_due}</TableCell>{" "}
                          <TableCell align="right">
                            {rev.amount_due - rev.amount_paid}
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
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Insurance{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyInsurance}
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
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyInsurance}
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
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "INSURANCE"
                            ).amount_paid
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "INSURANCE"
                            ).amount_due
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {" "}
                          {expenseSummary.find(
                            (revS) => revS.purchase_type === "INSURANCE"
                          ).amount_due -
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "INSURANCE"
                            ).amount_paid}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow hidden={!toggleMonthlyExpense}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Insurance{" "}
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyInsurance}
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
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyInsurance}
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
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>
                      </TableRow>
                    )}
                    {/* Insurance map individual */}
                    {expense.map((rev, i) => {
                      return rev.purchase_type === "INSURANCE" ? (
                        <TableRow hidden={!toggleMonthlyInsurance}>
                          <TableCell width="300px">
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                            {rev.zip}
                          </TableCell>
                          <TableCell align="right">{rev.amount_paid}</TableCell>{" "}
                          <TableCell align="right">{rev.amount_due}</TableCell>{" "}
                          <TableCell align="right">
                            {rev.amount_due - rev.amount_paid}
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
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Utility
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyUtilityExpense}
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
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyUtilityExpense}
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
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "UTILITY"
                            ).amount_paid
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "UTILITY"
                            ).amount_due
                          }
                        </TableCell>{" "}
                        <TableCell align="right">
                          {" "}
                          {expenseSummary.find(
                            (revS) => revS.purchase_type === "UTILITY"
                          ).amount_due -
                            expenseSummary.find(
                              (revS) => revS.purchase_type === "UTILITY"
                            ).amount_paid}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow hidden={!toggleMonthlyExpense}>
                        <TableCell width="300px">
                          &nbsp;&nbsp;&nbsp;&nbsp;Utility
                          <img
                            src={SortLeft}
                            alt="Expand closed"
                            hidden={toggleMonthlyUtilityExpense}
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
                            }}
                          />
                          <img
                            src={SortDown}
                            alt="Expand open"
                            hidden={!toggleMonthlyUtilityExpense}
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
                            }}
                          />
                        </TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>{" "}
                        <TableCell align="right">0</TableCell>
                      </TableRow>
                    )}
                    {/* UtilityExpense map individual */}
                    {expense.map((rev, i) => {
                      return rev.purchase_type === "UTILITY" ? (
                        <TableRow hidden={!toggleMonthlyUtilityExpense}>
                          <TableCell width="300px">
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                            {rev.zip}
                          </TableCell>
                          <TableCell align="right">{rev.amount_paid}</TableCell>{" "}
                          <TableCell align="right">{rev.amount_due}</TableCell>{" "}
                          <TableCell align="right">
                            {rev.amount_due - rev.amount_paid}
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
