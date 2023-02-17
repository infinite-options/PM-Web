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
  const [toggleRevenue, setToggleRevenue] = useState(false);
  const [toggleExpense, setToggleExpense] = useState(false);
  const [revenue, setRevenue] = useState(null);
  const [revenueSummary, setRevenueSummary] = useState(null);
  const [toggleDetails, setToggleDetails] = useState(false);
  const [expense, setExpense] = useState(null);
  const [expenseSummary, setExpenseSummary] = useState(null);
  const [selectedPurchaseType, setSelectedPurchaseType] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
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
  const showDetails = (r) => {
    setSelectedMonth(r.month);
    setSelectedPurchaseType(r.purchase_type);
    setToggleDetails(!toggleDetails);
  };
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
                <Row>
                  <Col xs={3}>
                    Revenue
                    <img
                      src={SortLeft}
                      alt="Expand closed"
                      hidden={toggleRevenue}
                      onClick={() => {
                        setToggleRevenue(!toggleRevenue);
                      }}
                      style={{
                        width: "10px",
                        height: "10px",
                        float: "right",
                      }}
                    />
                    <img
                      src={SortDown}
                      alt="Expand open"
                      hidden={!toggleRevenue}
                      onClick={() => {
                        setToggleRevenue(!toggleRevenue);
                      }}
                      style={{
                        width: "10px",
                        height: "10px",
                        float: "right",
                      }}
                    />
                  </Col>
                  <Col></Col>
                  <Col></Col>
                  <Col></Col>
                </Row>
                {revenueSummary.map((revS, i) => {
                  return (
                    <div hidden={!toggleRevenue} key={i}>
                      <Row key={i} onClick={() => showDetails(revS)}>
                        <Col>{revS.purchase_type}</Col>
                        <Col>{revS.month}</Col>
                        <Col>{revS.amount_due}</Col>
                        <Col>{revS.amount_paid}</Col>
                      </Row>
                      {revenue.map((rev) => {
                        return rev.purchase_type == revS.purchase_type &&
                          rev.purchase_type == selectedPurchaseType &&
                          rev.month === selectedMonth &&
                          rev.month === revS.month ? (
                          <Row hidden={!toggleDetails}>
                            {" "}
                            <Col>{rev.purchase_type}</Col>
                            <Col>{rev.month}</Col>
                            <Col>{rev.amount_due}</Col>
                            <Col>{rev.amount_paid}</Col>
                          </Row>
                        ) : (
                          ""
                        );
                      })}
                    </div>
                  );
                })}
                <Row>
                  <Col xs={3}>
                    Expense{" "}
                    <img
                      src={SortLeft}
                      alt="Expand closed"
                      hidden={toggleExpense}
                      onClick={() => {
                        setToggleExpense(!toggleExpense);
                      }}
                      style={{
                        width: "10px",
                        height: "10px",
                        float: "right",
                      }}
                    />
                    <img
                      src={SortDown}
                      alt="Expand open"
                      hidden={!toggleExpense}
                      onClick={() => {
                        setToggleExpense(!toggleExpense);
                      }}
                      style={{
                        width: "10px",
                        height: "10px",
                        float: "right",
                      }}
                    />
                  </Col>
                  <Col></Col>
                </Row>
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
