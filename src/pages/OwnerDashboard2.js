import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableSortLabel,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import SideBar from "../components/ownerComponents/SideBar";
import Header from "../components/Header";
import AppContext from "../AppContext";
import OwnerPropertyForm from "../components/ownerComponents/OwnerPropertyForm";
import OwnerCreateExpense from "../components/ownerComponents/OwnerCreateExpense";
import OwnerRepairRequest from "../components/ownerComponents/OwnerRepairRequest";
import SortDown from "../icons/Sort-down.svg";
import SortLeft from "../icons/Sort-left.svg";
import AddIcon from "../icons/AddIcon.svg";
import { get } from "../utils/api";
import { green, red } from "../utils/styles";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

export default function OwnerDashboard2() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [ownerData, setOwnerData] = useState([]);
  const [cashflowData, setCashflowData] = useState({});

  const [stage, setStage] = useState("LIST");
  const [isLoading, setIsLoading] = useState(true);

  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");

  const [monthlyCashFlow, setMonthlyCashFlow] = useState(false);
  const [yearlyCashFlow, setYearlyCashFlow] = useState(false);

  const [monthlyRevenue, setMonthlyRevenue] = useState(false);
  const [monthlyRent, setMonthlyRent] = useState(false);
  const [monthlyExtra, setMonthlyExtra] = useState(false);
  const [monthlyUtility, setMonthlyUtility] = useState(false);

  const [monthlyExpense, setMonthlyExpense] = useState(false);
  const [monthlyManagement, setMonthlyManagement] = useState(false);
  const [monthlyMaintenance, setMonthlyMaintenance] = useState(false);
  const [monthlyRepairs, setMonthlyRepairs] = useState(false);
  const [monthlyMortgage, setMonthlyMortgage] = useState(false);
  const [monthlyTaxes, setMonthlyTaxes] = useState(false);
  const [monthlyInsurance, setMonthlyInsurance] = useState(false);
  const [monthlyUtilityExpense, setMonthlyUtilityExpense] = useState(false);

  const [yearlyRevenue, setYearlyRevenue] = useState(false);
  const [yearlyRent, setYearlyRent] = useState(false);
  const [yearlyExtra, setYearlyExtra] = useState(false);
  const [yearlyUtility, setYearlyUtility] = useState(false);

  const [yearlyExpense, setYearlyExpense] = useState(false);
  const [yearlyManagement, setYearlyManagement] = useState(false);
  const [yearlyMaintenance, setYearlyMaintenance] = useState(false);
  const [yearlyRepairs, setYearlyRepairs] = useState(false);
  const [yearlyMortgage, setYearlyMortgage] = useState(false);
  const [yearlyTaxes, setYearlyTaxes] = useState(false);
  const [yearlyInsurance, setYearlyInsurance] = useState(false);
  const [yearlyUtilityExpense, setYearlyUtilityExpense] = useState(false);

  const fetchOwnerDashboard = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }
    const response = await get("/ownerDashboard", access_token);
    const cashflowResponse = await get(
      `/ownerCashflow?owner_id=${user.user_uid}`
    );

    setCashflowData(cashflowResponse.result);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();

      return;
    }
    setIsLoading(false);
    setOwnerData(response.result);
    let requests = [];
    response.result.forEach((res) => {
      if (res.maintenanceRequests.length > 0) {
        res.maintenanceRequests.forEach((mr) => {
          requests.push(mr);
        });
      }
    });
    setMaintenanceRequests(requests);
  };

  useEffect(() => {
    console.log("in use effect");
    fetchOwnerDashboard();
  }, [access_token]);
  const addProperty = () => {
    fetchOwnerDashboard();
    setStage("LIST");
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const propertiesHeadCell = [
    {
      id: "images",
      numeric: false,
      label: "Property Images",
    },
    {
      id: "address",
      numeric: false,
      label: "Street Address",
    },
    {
      id: "city",
      numeric: false,
      label: "City,State",
    },
    {
      id: "zip",
      numeric: true,
      label: "Zip",
    },
    {
      id: "tenant",
      numeric: false,
      label: "Tenant",
    },
    {
      id: "listed_rent",
      numeric: true,
      label: "Rent",
    },
    {
      id: "listed_rent",
      numeric: true,
      label: " $/Sq Ft",
    },
    {
      id: "property_type",
      numeric: false,
      label: "Type",
    },
    {
      id: "num_beds",
      numeric: true,
      label: "Size",
    },

    {
      id: "property_manager",
      numeric: true,
      label: "Property Manager",
    },
    {
      id: "lease_end",
      numeric: true,
      label: "Lease End",
    },
  ];
  function EnhancedTableHeadProperties(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {propertiesHeadCell.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              size="small"
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                align="center"
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHeadProperties.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const maintenancesHeadCell = [
    {
      id: "images",
      numeric: false,
      label: "Property Images",
    },
    {
      id: "address",
      numeric: false,
      label: "Address",
    },
    {
      id: "title",
      numeric: false,
      label: "Issue",
    },
    {
      id: "request_created_date",
      numeric: true,
      label: "Date Reported",
    },
    {
      id: "days_open",
      numeric: false,
      label: "Days Open",
    },
    {
      id: "request_type",
      numeric: true,
      label: "Type",
    },
    {
      id: "priority",
      numeric: false,
      label: "Priority",
    },
    {
      id: "assigned_business",
      numeric: false,
      label: "Assigned",
    },

    {
      id: "scheduled_date",
      numeric: true,
      label: "Closed Date",
    },
    {
      id: "total_estimate",
      numeric: true,
      label: "Cost",
    },
  ];
  function EnhancedTableHeadMaintenance(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {maintenancesHeadCell.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              size="small"
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                align="center"
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHeadMaintenance.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  let revenueTotal = 0;
  revenueTotal = (
    cashflowData.rental_revenue +
    cashflowData.extra_revenue +
    cashflowData.utility_revenue
  ).toFixed(2);

  let expenseTotal = 0;
  expenseTotal = (
    cashflowData.maintenance_expense +
    cashflowData.management_expense +
    cashflowData.repairs_expense +
    cashflowData.utility_expense +
    cashflowData.mortgage_expense +
    cashflowData.taxes_expense +
    cashflowData.insurance_expense
  ).toFixed(2);
  const cashFlow = (revenueTotal - expenseTotal).toFixed(2);

  let revenueTotalAmortized = 0;
  revenueTotalAmortized = (
    cashflowData.amortized_rental_revenue +
    cashflowData.amortized_extra_revenue +
    cashflowData.amortized_utility_revenue
  ).toFixed(2);

  let expenseTotalAmortized = 0;
  expenseTotalAmortized = (
    cashflowData.amortized_maintenance_expense +
    cashflowData.amortized_management_expense +
    cashflowData.amortized_repairs_expense +
    cashflowData.amortized_utility_expense +
    cashflowData.amortized_mortgage_expense +
    cashflowData.amortized_taxes_expense +
    cashflowData.amortized_insurance_expense
  ).toFixed(2);
  const cashFlowAmortized = (
    revenueTotalAmortized - expenseTotalAmortized
  ).toFixed(2);

  let yearExpenseTotal = 0;
  yearExpenseTotal = (
    cashflowData.maintenance_year_expense +
    cashflowData.management_year_expense +
    cashflowData.repairs_year_expense +
    cashflowData.utility_year_expense +
    cashflowData.mortgage_year_expense +
    cashflowData.taxes_year_expense +
    cashflowData.insurance_year_expense
  ).toFixed(2);

  let yearRevenueTotal = 0;
  yearRevenueTotal = (
    cashflowData.rental_year_revenue +
    cashflowData.extra_year_revenue +
    cashflowData.utility_year_revenue
  ).toFixed(2);
  const yearCashFlow = (yearRevenueTotal - yearExpenseTotal).toFixed(2);

  let yearExpenseTotalAmortized = 0;
  yearExpenseTotalAmortized = (
    cashflowData.amortized_maintenance_year_expense +
    cashflowData.amortized_management_year_expense +
    cashflowData.amortized_repairs_year_expense +
    cashflowData.amortized_utility_year_expense +
    cashflowData.amortized_mortgage_year_expense +
    cashflowData.amortized_taxes_year_expense +
    cashflowData.amortized_insurance_year_expense
  ).toFixed(2);

  let yearRevenueTotalAmortized = 0;
  yearRevenueTotalAmortized = (
    cashflowData.amortized_rental_year_revenue +
    cashflowData.amortized_extra_year_revenue +
    cashflowData.amortized_utility_year_revenue
  ).toFixed(2);
  const yearCashFlowAmortized = (
    yearRevenueTotalAmortized - yearExpenseTotalAmortized
  ).toFixed(2);

  let revenueExpectedTotal = 0;
  revenueExpectedTotal = (
    cashflowData.rental_expected_revenue +
    cashflowData.extra_expected_revenue +
    cashflowData.utility_expected_revenue
  ).toFixed(2);

  let expenseExpectedTotal = 0;

  expenseExpectedTotal = (
    cashflowData.maintenance_expected_expense +
    cashflowData.management_expected_expense +
    cashflowData.repairs_expected_expense +
    cashflowData.utility_expected_expense +
    cashflowData.mortgage_expense +
    cashflowData.taxes_expense +
    cashflowData.insurance_expense
  ).toFixed(2);

  const cashFlowExpected = (
    revenueExpectedTotal - expenseExpectedTotal
  ).toFixed(2);

  let revenueExpectedTotalAmortized = 0;
  revenueExpectedTotalAmortized = (
    cashflowData.amortized_rental_expected_revenue +
    cashflowData.amortized_extra_expected_revenue +
    cashflowData.amortized_utility_expected_revenue
  ).toFixed(2);

  let expenseExpectedTotalAmortized = 0;
  expenseExpectedTotalAmortized = (
    cashflowData.amortized_maintenance_expected_expense +
    cashflowData.amortized_management_expected_expense +
    cashflowData.amortized_repairs_expected_expense +
    cashflowData.amortized_utility_expected_expense +
    cashflowData.amortized_mortgage_expense +
    cashflowData.amortized_taxes_expense +
    cashflowData.amortized_insurance_expense
  ).toFixed(2);

  const cashFlowExpectedAmortized = (
    revenueExpectedTotalAmortized - expenseExpectedTotalAmortized
  ).toFixed(2);

  let yearRevenueExpectedTotal = 0;
  yearRevenueExpectedTotal = (
    cashflowData.rental_year_expected_revenue +
    cashflowData.extra_year_expected_revenue +
    cashflowData.utility_year_expected_revenue
  ).toFixed(2);

  let yearExpenseExpectedTotal = 0;
  yearExpenseExpectedTotal = (
    cashflowData.maintenance_year_expected_expense +
    cashflowData.management_year_expected_expense +
    cashflowData.repairs_year_expected_expense +
    cashflowData.utility_year_expected_expense +
    cashflowData.mortgage_year_expense +
    cashflowData.taxes_year_expense +
    cashflowData.insurance_year_expense
  ).toFixed(2);

  const yearCashFlowExpected = (
    yearRevenueExpectedTotal - yearExpenseExpectedTotal
  ).toFixed(2);

  let yearRevenueExpectedTotalAmortized = 0;
  yearRevenueExpectedTotalAmortized = (
    cashflowData.amortized_rental_year_expected_revenue +
    cashflowData.amortized_extra_year_expected_revenue +
    cashflowData.amortized_utility_year_expected_revenue
  ).toFixed(2);

  let yearExpenseExpectedTotalAmortized = 0;
  yearExpenseExpectedTotalAmortized = (
    cashflowData.amortized_maintenance_year_expected_expense +
    cashflowData.amortized_management_year_expected_expense +
    cashflowData.amortized_repairs_year_expected_expense +
    cashflowData.amortized_utility_year_expected_expense +
    cashflowData.amortized_mortgage_year_expense +
    cashflowData.amortized_taxes_year_expense +
    cashflowData.amortized_insurance_year_expense
  ).toFixed(2);

  const yearCashFlowExpectedAmortized = (
    yearRevenueExpectedTotalAmortized - yearExpenseExpectedTotalAmortized
  ).toFixed(2);

  console.log(ownerData);
  console.log(cashflowData);

  return stage === "LIST" ? (
    <div className="OwnerDashboard2">
      <div className="flex-1">
        <div style={{ backgroundColor: "#229ebc", minHeight: "100%" }}>
          <SideBar />
        </div>
        {ownerData.length > 1 ? (
          <div
            className="w-100"
            style={{
              width: "calc(100vw - 13rem)",
              position: "relative",
            }}
          >
            <Header title="Owner Dashboard" />
            <Row>
              <Col>
                <h1>Cash Flow Summary</h1>
              </Col>
              <Col>
                <img
                  src={AddIcon}
                  onClick={() => setStage("ADDEXPENSE")}
                  style={{
                    width: "30px",
                    height: "30px",
                    float: "right",
                    marginRight: "5rem",
                  }}
                />
                {/* <h1 style={{ float: "right", marginRight: "5rem" }}>+</h1> */}
              </Col>
            </Row>
            <Row className="m-3">
              <Table classes={{ root: classes.customTable }} size="small">
                <TableHead>
                  <TableCell></TableCell>
                  <TableCell align="right">To Date</TableCell>
                  <TableCell align="right">Expected</TableCell>
                  <TableCell align="right">Delta</TableCell>
                  <TableCell align="right">To Date Amortized</TableCell>
                  <TableCell align="right">Expected Amortized</TableCell>
                  <TableCell align="right">Delta Amortized</TableCell>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell width="180px">
                      {new Date().toLocaleString("default", { month: "long" })}{" "}
                      &nbsp;
                      <img
                        src={SortDown}
                        hidden={monthlyCashFlow}
                        onClick={() => {
                          setMonthlyCashFlow(!monthlyCashFlow);
                          setMonthlyRevenue(false);
                          setMonthlyExpense(false);
                          setMonthlyRent(false);
                          setMonthlyExtra(false);
                          setMonthlyUtility(false);
                          setMonthlyManagement(false);
                          setMonthlyMaintenance(false);
                          setMonthlyRepairs(false);
                          setMonthlyUtilityExpense(false);
                          setMonthlyMortgage(false);
                          setMonthlyTaxes(false);
                          setMonthlyInsurance(false);
                        }}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyCashFlow}
                        onClick={() => {
                          setMonthlyCashFlow(!monthlyCashFlow);
                          setMonthlyRevenue(false);
                          setMonthlyExpense(false);
                          setMonthlyRent(false);
                          setMonthlyExtra(false);
                          setMonthlyUtility(false);
                          setMonthlyManagement(false);
                          setMonthlyMaintenance(false);
                          setMonthlyRepairs(false);
                          setMonthlyUtilityExpense(false);
                          setMonthlyMortgage(false);
                          setMonthlyTaxes(false);
                          setMonthlyInsurance(false);
                        }}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashFlow}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashFlowExpected}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${(cashFlow - cashFlowExpected).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashFlowAmortized}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashFlowExpectedAmortized}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(cashFlowAmortized - cashFlowExpectedAmortized).toFixed(
                        2
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow hidden={!monthlyCashFlow}>
                    <TableCell width="180px">
                      &nbsp; Revenue{" "}
                      <img
                        src={SortDown}
                        hidden={monthlyRevenue}
                        onClick={() => {
                          setMonthlyRevenue(!monthlyRevenue);
                          setMonthlyRent(false);
                          setMonthlyExtra(false);
                          setMonthlyUtility(false);
                        }}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyRevenue}
                        onClick={() => {
                          setMonthlyRevenue(!monthlyRevenue);
                          setMonthlyRent(false);
                          setMonthlyExtra(false);
                          setMonthlyUtility(false);
                        }}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${revenueTotal}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${revenueExpectedTotal}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${(revenueTotal - revenueExpectedTotal).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${revenueTotalAmortized}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${revenueExpectedTotalAmortized}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        revenueTotalAmortized - revenueExpectedTotalAmortized
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>

                  <TableRow hidden={!monthlyRevenue}>
                    <TableCell width="180px">
                      &nbsp;&nbsp; Rent{" "}
                      <img
                        src={SortDown}
                        hidden={monthlyRent}
                        onClick={() => setMonthlyRent(!monthlyRent)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyRent}
                        onClick={() => setMonthlyRent(!monthlyRent)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.rental_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.rental_expected_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.rental_revenue -
                        cashflowData.rental_expected_revenue
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_rental_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_rental_expected_revenue.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_rental_revenue -
                        cashflowData.amortized_rental_expected_revenue
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_revenue.map((revenue, index) => {
                      return revenue.purchase_type === "RENT" ? (
                        <TableRow hidden={!monthlyRent}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {revenue.address} {revenue.unit}
                            <br />
                            &nbsp;&nbsp;&nbsp; {revenue.description} <br />
                            &nbsp;&nbsp;&nbsp; {revenue.purchase_frequency}
                          </TableCell>
                          {revenue.purchase_status === "PAID" ? (
                            <TableCell
                              width="180px"
                              align="right"
                              style={green}
                            >
                              ${revenue.amount_paid.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${revenue.amount_paid.toFixed(2)}
                            </TableCell>
                          )}

                          {revenue.purchase_status === "UNPAID" ? (
                            <TableCell width="180px" align="right" style={red}>
                              ${revenue.amount_due.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${revenue.amount_due.toFixed(2)}
                            </TableCell>
                          )}
                          <TableCell width="180px" align="right">
                            $
                            {(revenue.amount_paid - revenue.amount_due).toFixed(
                              2
                            )}
                          </TableCell>
                          {revenue.purchase_status === "PAID" &&
                          revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(revenue.amount_paid / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {revenue.purchase_status === "UNPAID" &&
                          revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(revenue.amount_due / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              $
                              {(
                                (revenue.amount_paid - revenue.amount_due) /
                                12
                              ).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!monthlyRevenue}>
                    <TableCell width="180px">
                      &nbsp;&nbsp; Extra Charges
                      <img
                        src={SortDown}
                        hidden={monthlyExtra}
                        onClick={() => setMonthlyExtra(!monthlyExtra)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyExtra}
                        onClick={() => setMonthlyExtra(!monthlyExtra)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.extra_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.extra_expected_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.extra_revenue -
                        cashflowData.extra_expected_revenue
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_extra_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_extra_expected_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_extra_revenue -
                        cashflowData.amortized_extra_expected_revenue
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_revenue.map((revenue, index) => {
                      return revenue.purchase_type === "EXTRA CHARGES" ? (
                        <TableRow hidden={!monthlyExtra}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {revenue.address} {revenue.unit}{" "}
                            <br />
                            &nbsp;&nbsp;&nbsp; {revenue.description} <br />
                            &nbsp;&nbsp;&nbsp; {revenue.purchase_frequency}
                          </TableCell>
                          {revenue.purchase_status === "PAID" ? (
                            <TableCell
                              width="180px"
                              align="right"
                              style={green}
                            >
                              ${revenue.amount_paid.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${revenue.amount_paid.toFixed(2)}
                            </TableCell>
                          )}

                          {revenue.purchase_status === "UNPAID" ? (
                            <TableCell width="180px" align="right" style={red}>
                              ${revenue.amount_due.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${revenue.amount_due.toFixed(2)}
                            </TableCell>
                          )}
                          <TableCell width="180px" align="right">
                            $
                            {(revenue.amount_paid - revenue.amount_due).toFixed(
                              2
                            )}
                          </TableCell>
                          {revenue.purchase_status === "PAID" &&
                          revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(revenue.amount_paid / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {revenue.purchase_status === "UNPAID" &&
                          revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(revenue.amount_due / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              $
                              {(
                                (revenue.amount_paid - revenue.amount_due) /
                                12
                              ).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!monthlyRevenue}>
                    <TableCell width="180px">
                      &nbsp; &nbsp;Utility
                      <img
                        src={SortDown}
                        hidden={monthlyUtility}
                        onClick={() => setMonthlyUtility(!monthlyUtility)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyUtility}
                        onClick={() => setMonthlyUtility(!monthlyUtility)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />{" "}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.utility_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.utility_expected_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.utility_revenue -
                        cashflowData.utility_expected_revenue
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_utility_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_utility_expected_revenue.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_utility_revenue -
                        cashflowData.amortized_utility_expected_revenue
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_revenue.map((revenue, index) => {
                      return revenue.purchase_type === "UTILITY" ? (
                        <TableRow hidden={!monthlyUtility}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {revenue.address} {revenue.unit}
                            <br />
                            &nbsp;&nbsp;&nbsp; {revenue.description} <br />
                            &nbsp;&nbsp;&nbsp; {revenue.purchase_frequency}
                          </TableCell>
                          {revenue.purchase_status === "PAID" ? (
                            <TableCell
                              width="180px"
                              align="right"
                              style={green}
                            >
                              ${revenue.amount_paid.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${revenue.amount_paid.toFixed(2)}
                            </TableCell>
                          )}

                          {revenue.purchase_status === "UNPAID" ? (
                            <TableCell width="180px" align="right" style={red}>
                              ${revenue.amount_due.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${revenue.amount_due.toFixed(2)}
                            </TableCell>
                          )}
                          <TableCell width="180px" align="right">
                            $
                            {(revenue.amount_paid - revenue.amount_due).toFixed(
                              2
                            )}
                          </TableCell>
                          {revenue.purchase_status === "PAID" &&
                          revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(revenue.amount_paid / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {revenue.purchase_status === "UNPAID" &&
                          revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(revenue.amount_due / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              $
                              {(
                                (revenue.amount_paid - revenue.amount_due) /
                                12
                              ).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!monthlyCashFlow}>
                    <TableCell width="180px">
                      &nbsp; Expenses{" "}
                      <img
                        src={SortDown}
                        hidden={monthlyExpense}
                        onClick={() => {
                          setMonthlyExpense(!monthlyExpense);
                          setMonthlyManagement(false);
                          setMonthlyMaintenance(false);
                          setMonthlyRepairs(false);
                          setMonthlyUtilityExpense(false);
                          setMonthlyMortgage(false);
                          setMonthlyTaxes(false);
                          setMonthlyInsurance(false);
                        }}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyExpense}
                        onClick={() => {
                          setMonthlyExpense(!monthlyExpense);
                          setMonthlyManagement(false);
                          setMonthlyMaintenance(false);
                          setMonthlyRepairs(false);
                          setMonthlyUtilityExpense(false);
                          setMonthlyMortgage(false);
                          setMonthlyTaxes(false);
                          setMonthlyInsurance(false);
                        }}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${expenseTotal}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${expenseExpectedTotal}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${(expenseTotal - expenseExpectedTotal).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${expenseTotalAmortized}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${expenseExpectedTotalAmortized}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      {" "}
                      $
                      {(
                        expenseTotalAmortized - expenseExpectedTotalAmortized
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow hidden={!monthlyExpense}>
                    <TableCell width="180px">
                      &nbsp;&nbsp; Management
                      <img
                        src={SortDown}
                        hidden={monthlyManagement}
                        onClick={() => setMonthlyManagement(!monthlyManagement)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyManagement}
                        onClick={() => setMonthlyManagement(!monthlyManagement)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />{" "}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.management_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.management_expected_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.management_expense -
                        cashflowData.management_expected_expense
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_management_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_management_expected_expense.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_management_expense -
                        cashflowData.amortized_management_expected_expense
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense.map((expense, index) => {
                      return expense.purchase_type === "MANAGEMENT" ? (
                        <TableRow hidden={!monthlyManagement}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                            <br />
                            &nbsp;&nbsp;&nbsp; {expense.description} <br />
                            &nbsp;&nbsp;&nbsp; {expense.purchase_frequency}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell
                              width="180px"
                              align="right"
                              style={green}
                            >
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="180px" align="right" style={red}>
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          )}
                          <TableCell width="180px" align="right">
                            $
                            {(expense.amount_paid - expense.amount_due).toFixed(
                              2
                            )}
                          </TableCell>
                          {expense.purchase_status === "PAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_paid / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_status === "UNPAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_due / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              $
                              {(
                                (expense.amount_paid - expense.amount_due) /
                                12
                              ).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!monthlyExpense}>
                    <TableCell width="180px">
                      &nbsp;&nbsp; Maintenance
                      <img
                        src={SortDown}
                        hidden={monthlyMaintenance}
                        onClick={() =>
                          setMonthlyMaintenance(!monthlyMaintenance)
                        }
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyMaintenance}
                        onClick={() =>
                          setMonthlyMaintenance(!monthlyMaintenance)
                        }
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />{" "}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.maintenance_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.maintenance_expected_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.maintenance_expense -
                        cashflowData.maintenance_expected_expense
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_maintenance_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_maintenance_expected_expense.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_maintenance_expense -
                        cashflowData.amortized_maintenance_expected_expense
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense.map((expense, index) => {
                      return expense.purchase_type === "MAINTENANCE" ? (
                        <TableRow hidden={!monthlyMaintenance}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                            <br />
                            &nbsp;&nbsp;&nbsp; {expense.description} <br />
                            &nbsp;&nbsp;&nbsp; {expense.purchase_frequency}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell
                              width="180px"
                              align="right"
                              style={green}
                            >
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="180px" align="right" style={red}>
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          )}
                          <TableCell width="180px" align="right">
                            $
                            {(expense.amount_paid - expense.amount_due).toFixed(
                              2
                            )}
                          </TableCell>
                          {expense.purchase_status === "PAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_paid / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_status === "UNPAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_due / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              $
                              {(
                                (expense.amount_paid - expense.amount_due) /
                                12
                              ).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!monthlyExpense}>
                    <TableCell width="180px">
                      &nbsp; &nbsp;Repairs{" "}
                      <img
                        src={SortDown}
                        hidden={monthlyRepairs}
                        onClick={() => setMonthlyRepairs(!monthlyRepairs)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyRepairs}
                        onClick={() => setMonthlyRepairs(!monthlyRepairs)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />{" "}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.repairs_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.repairs_expected_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.repairs_expense -
                        cashflowData.repairs_expected_expense
                      ).toFixed(2)}
                    </TableCell>

                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_repairs_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_repairs_expected_expense.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_repairs_expense -
                        cashflowData.amortized_repairs_expected_expense
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense.map((expense, index) => {
                      return expense.purchase_type === "REPAIRS" ? (
                        <TableRow hidden={!monthlyRepairs}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                            <br />
                            &nbsp;&nbsp;&nbsp; {expense.description} <br />
                            &nbsp;&nbsp;&nbsp; {expense.purchase_frequency}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell
                              width="180px"
                              align="right"
                              style={green}
                            >
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="180px" align="right" style={red}>
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          )}
                          <TableCell width="180px" align="right">
                            ${expense.amount_paid - expense.amount_due}
                          </TableCell>
                          {expense.purchase_status === "PAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_paid / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_status === "UNPAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_due / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              $
                              {(
                                (expense.amount_paid - expense.amount_due) /
                                12
                              ).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!monthlyExpense}>
                    <TableCell width="180px">
                      &nbsp; &nbsp;Utility{" "}
                      <img
                        src={SortDown}
                        hidden={monthlyUtilityExpense}
                        onClick={() =>
                          setMonthlyUtilityExpense(!monthlyUtilityExpense)
                        }
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyUtilityExpense}
                        onClick={() =>
                          setMonthlyUtilityExpense(!monthlyUtilityExpense)
                        }
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />{" "}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.utility_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.utility_expected_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.utility_expense -
                        cashflowData.utility_expected_expense
                      ).toFixed(2)}
                    </TableCell>

                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_utility_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_utility_expected_expense.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_utility_expense -
                        cashflowData.amortized_utility_expected_expense
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense.map((expense, index) => {
                      return expense.purchase_type === "UTILITY" ? (
                        <TableRow hidden={!monthlyUtilityExpense}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                            <br />
                            &nbsp;&nbsp;&nbsp; {expense.description} <br />
                            &nbsp;&nbsp;&nbsp; {expense.purchase_frequency}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell
                              width="180px"
                              align="right"
                              style={green}
                            >
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="180px" align="right" style={red}>
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          )}
                          <TableCell width="180px" align="right">
                            $
                            {(expense.amount_paid - expense.amount_due).toFixed(
                              2
                            )}
                          </TableCell>
                          {expense.purchase_status === "PAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_paid / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_status === "UNPAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_due / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              $
                              {(
                                (expense.amount_paid - expense.amount_due) /
                                12
                              ).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!monthlyExpense}>
                    <TableCell width="180px">
                      &nbsp;&nbsp; Mortgage{" "}
                      <img
                        src={SortDown}
                        hidden={monthlyMortgage}
                        onClick={() => setMonthlyMortgage(!monthlyMortgage)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyMortgage}
                        onClick={() => setMonthlyMortgage(!monthlyMortgage)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.mortgage_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.mortgage_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.mortgage_expense -
                        cashflowData.mortgage_expense
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_mortgage_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_mortgage_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_mortgage_expense -
                        cashflowData.amortized_mortgage_expense
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_property_expense.map(
                      (expense, index) => {
                        return expense.mortgages !== null ? (
                          <TableRow hidden={!monthlyMortgage}>
                            <TableCell>
                              &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                              {expense.unit}
                              <br />
                              &nbsp;&nbsp;&nbsp;{" "}
                              {JSON.parse(expense.mortgages).frequency} <br />
                              &nbsp;&nbsp;&nbsp;{" "}
                              {
                                JSON.parse(expense.mortgages)
                                  .frequency_of_payment
                              }
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.mortgage_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.mortgage_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {(
                                expense.mortgage_expense -
                                expense.mortgage_expense
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              ${expense.amortized_mortgage_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.amortized_mortgage_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {(
                                expense.amortized_mortgage_expense -
                                expense.amortized_mortgage_expense
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      }
                    )}
                  <TableRow hidden={!monthlyExpense}>
                    <TableCell width="180px">
                      &nbsp;&nbsp; Taxes{" "}
                      <img
                        src={SortDown}
                        hidden={monthlyTaxes}
                        onClick={() => setMonthlyTaxes(!monthlyTaxes)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyTaxes}
                        onClick={() => setMonthlyTaxes(!monthlyTaxes)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.taxes_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.taxes_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.taxes_expense - cashflowData.taxes_expense
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_taxes_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_taxes_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_taxes_expense -
                        cashflowData.amortized_taxes_expense
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_property_expense.map(
                      (expense, index) => {
                        return expense.taxes !== null ? (
                          <TableRow hidden={!monthlyTaxes}>
                            <TableCell>
                              &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                              {expense.unit}
                              <br />
                              &nbsp;&nbsp;&nbsp; {expense.frequency} <br />
                              &nbsp;&nbsp;&nbsp; {expense.frequency_of_payment}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.taxes_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.taxes_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {(
                                expense.taxes_expense - expense.taxes_expense
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              ${expense.amortized_taxes_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.amortized_taxes_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {(
                                expense.amortized_taxes_expense -
                                expense.amortized_taxes_expense
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      }
                    )}
                  <TableRow hidden={!monthlyExpense}>
                    <TableCell width="180px">
                      &nbsp;&nbsp; Insurance{" "}
                      <img
                        src={SortDown}
                        hidden={monthlyInsurance}
                        onClick={() => setMonthlyInsurance(!monthlyInsurance)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyInsurance}
                        onClick={() => setMonthlyInsurance(!monthlyInsurance)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.insurance_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.insurance_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.insurance_expense -
                        cashflowData.insurance_expense
                      ).toFixed(2)}
                    </TableCell>

                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_insurance_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_insurance_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_insurance_expense -
                        cashflowData.amortized_insurance_expense
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_property_expense.map(
                      (expense, index) => {
                        return expense.insurance !== null ? (
                          <TableRow hidden={!monthlyInsurance}>
                            <TableCell>
                              &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                              {expense.unit}
                              <br />
                              &nbsp;&nbsp;&nbsp; {expense.frequency} <br />
                              &nbsp;&nbsp;&nbsp; {expense.frequency_of_payment}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.insurance_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.insurance_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {(
                                expense.insurance_expense -
                                expense.insurance_expense
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              ${expense.amortized_insurance_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.amortized_insurance_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {(
                                expense.amortized_insurance_expense -
                                expense.amortized_insurance_expense
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      }
                    )}

                  <TableRow>
                    <TableCell width="180px">
                      {new Date().getFullYear()} &nbsp;
                      <img
                        src={SortDown}
                        onClick={() => {
                          setYearlyCashFlow(!yearlyCashFlow);
                          setYearlyRevenue(false);
                          setYearlyExpense(false);
                          setYearlyRent(false);
                          setYearlyExtra(false);
                          setYearlyUtility(false);
                          setYearlyManagement(false);
                          setYearlyMaintenance(false);
                          setYearlyRepairs(false);
                          setYearlyUtilityExpense(false);
                          setYearlyMortgage(false);
                          setYearlyTaxes(false);
                          setYearlyInsurance(false);
                        }}
                        hidden={yearlyCashFlow}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        onClick={() => {
                          setYearlyCashFlow(!yearlyCashFlow);
                          setYearlyRevenue(false);
                          setYearlyExpense(false);
                          setYearlyRent(false);
                          setYearlyExtra(false);
                          setYearlyUtility(false);
                          setYearlyManagement(false);
                          setYearlyMaintenance(false);
                          setYearlyRepairs(false);
                          setYearlyUtilityExpense(false);
                          setYearlyMortgage(false);
                          setYearlyTaxes(false);
                          setYearlyInsurance(false);
                        }}
                        hidden={!yearlyCashFlow}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${yearCashFlow}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${yearCashFlowExpected}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${(yearCashFlow - yearCashFlowExpected).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${yearCashFlowAmortized}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${yearCashFlowExpectedAmortized}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        yearCashFlowAmortized - yearCashFlowExpectedAmortized
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow hidden={!yearlyCashFlow}>
                    <TableCell width="180px">
                      &nbsp; Revenue{" "}
                      <img
                        src={SortDown}
                        hidden={yearlyRevenue}
                        onClick={() => {
                          setYearlyRevenue(!yearlyRevenue);
                          setYearlyRent(false);
                          setYearlyExtra(false);
                          setYearlyUtility(false);
                        }}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!yearlyRevenue}
                        onClick={() => {
                          setYearlyRevenue(!yearlyRevenue);
                          setYearlyRent(false);
                          setYearlyExtra(false);
                          setYearlyUtility(false);
                        }}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${yearRevenueTotal}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${yearRevenueExpectedTotal}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(yearRevenueTotal - yearRevenueExpectedTotal).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${yearRevenueTotalAmortized}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${yearRevenueExpectedTotalAmortized}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        yearRevenueTotalAmortized -
                        yearRevenueExpectedTotalAmortized
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow hidden={!yearlyRevenue}>
                    <TableCell width="180px">
                      &nbsp;&nbsp; Rent{" "}
                      <img
                        src={SortDown}
                        hidden={yearlyRent}
                        onClick={() => setYearlyRent(!yearlyRent)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!yearlyRent}
                        onClick={() => setYearlyRent(!yearlyRent)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.rental_year_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.rental_year_expected_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.rental_year_revenue -
                        cashflowData.rental_year_expected_revenue
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_rental_year_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_rental_year_expected_revenue.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_rental_year_revenue -
                        cashflowData.amortized_rental_year_expected_revenue
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_revenue_yearly.map((revenue, index) => {
                      return revenue.purchase_type === "RENT" ? (
                        <TableRow hidden={!yearlyRent}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {revenue.address} {revenue.unit}
                            <br />
                            &nbsp;&nbsp;&nbsp; {revenue.description} <br />
                            &nbsp;&nbsp;&nbsp; {revenue.purchase_frequency}
                          </TableCell>
                          {revenue.purchase_status === "PAID" ? (
                            <TableCell
                              width="180px"
                              align="right"
                              style={green}
                            >
                              ${revenue.amount_paid.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${revenue.amount_paid.toFixed(2)}
                            </TableCell>
                          )}

                          {revenue.purchase_status === "UNPAID" ? (
                            <TableCell width="180px" align="right" style={red}>
                              ${revenue.amount_due.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${revenue.amount_due.toFixed(2)}
                            </TableCell>
                          )}
                          <TableCell width="180px" align="right">
                            $
                            {(revenue.amount_paid - revenue.amount_due).toFixed(
                              2
                            )}
                          </TableCell>
                          {revenue.purchase_status === "PAID" &&
                          revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(revenue.amount_paid / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {revenue.purchase_status === "UNPAID" &&
                          revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(revenue.amount_due / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              $
                              {(
                                (revenue.amount_paid - revenue.amount_due) /
                                12
                              ).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!yearlyRevenue}>
                    <TableCell width="180px">
                      &nbsp;&nbsp; Extra Charges
                      <img
                        src={SortDown}
                        hidden={yearlyExtra}
                        onClick={() => setYearlyExtra(!yearlyExtra)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!yearlyExtra}
                        onClick={() => setYearlyExtra(!yearlyExtra)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.extra_year_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.extra_year_expected_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.extra_year_revenue -
                        cashflowData.extra_year_expected_revenue
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_extra_year_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_extra_year_expected_revenue.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_extra_year_revenue -
                        cashflowData.amortized_extra_year_expected_revenue
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_revenue_yearly.map((revenue, index) => {
                      return revenue.purchase_type === "EXTRA CHARGES" ? (
                        <TableRow hidden={!yearlyExtra}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {revenue.address} {revenue.unit}
                            <br />
                            &nbsp;&nbsp;&nbsp; {revenue.description} <br />
                            &nbsp;&nbsp;&nbsp; {revenue.purchase_frequency}
                          </TableCell>
                          {revenue.purchase_status === "PAID" ? (
                            <TableCell
                              width="180px"
                              align="right"
                              style={green}
                            >
                              ${revenue.amount_paid.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${revenue.amount_paid.toFixed(2)}
                            </TableCell>
                          )}

                          {revenue.purchase_status === "UNPAID" ? (
                            <TableCell width="180px" align="right" style={red}>
                              ${revenue.amount_due.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${revenue.amount_due.toFixed(2)}
                            </TableCell>
                          )}
                          <TableCell width="180px" align="right">
                            $
                            {(revenue.amount_paid - revenue.amount_due).toFixed(
                              2
                            )}
                          </TableCell>
                          {revenue.purchase_status === "PAID" &&
                          revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(revenue.amount_paid / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {revenue.purchase_status === "UNPAID" &&
                          revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(revenue.amount_due / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              $
                              {(
                                (revenue.amount_paid - revenue.amount_due) /
                                12
                              ).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!yearlyRevenue}>
                    <TableCell width="180px">
                      &nbsp; &nbsp;Utility{" "}
                      <img
                        src={SortDown}
                        hidden={yearlyUtility}
                        onClick={() => setYearlyUtility(!yearlyUtility)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!yearlyUtility}
                        onClick={() => setYearlyUtility(!yearlyUtility)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />{" "}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.utility_year_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.utility_year_expected_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.utility_year_revenue -
                        cashflowData.utility_year_expected_revenue
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_utility_year_revenue.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_utility_year_expected_revenue.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_utility_year_revenue -
                        cashflowData.amortized_utility_year_expected_revenue
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_revenue_yearly.map((revenue, index) => {
                      return revenue.purchase_type === "UTILITY" ? (
                        <TableRow hidden={!yearlyUtility}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {revenue.address} {revenue.unit}
                            <br />
                            &nbsp;&nbsp;&nbsp; {revenue.description} <br />
                            &nbsp;&nbsp;&nbsp; {revenue.purchase_frequency}
                          </TableCell>
                          {revenue.purchase_status === "PAID" ? (
                            <TableCell
                              width="180px"
                              align="right"
                              style={green}
                            >
                              ${revenue.amount_paid.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${revenue.amount_paid.toFixed(2)}
                            </TableCell>
                          )}

                          {revenue.purchase_status === "UNPAID" ? (
                            <TableCell width="180px" align="right" style={red}>
                              ${revenue.amount_due.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${revenue.amount_due.toFixed(2)}
                            </TableCell>
                          )}
                          <TableCell width="180px" align="right">
                            $
                            {(revenue.amount_paid - revenue.amount_due).toFixed(
                              2
                            )}
                          </TableCell>
                          {revenue.purchase_status === "PAID" &&
                          revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(revenue.amount_paid / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {revenue.purchase_status === "UNPAID" &&
                          revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(revenue.amount_due / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {revenue.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              $
                              {(
                                (revenue.amount_paid - revenue.amount_due) /
                                12
                              ).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!yearlyCashFlow}>
                    <TableCell width="180px">
                      &nbsp; Expenses{" "}
                      <img
                        src={SortDown}
                        hidden={yearlyExpense}
                        onClick={() => {
                          setYearlyExpense(!yearlyExpense);
                          setYearlyManagement(false);
                          setYearlyMaintenance(false);
                          setYearlyRepairs(false);
                          setYearlyUtilityExpense(false);
                          setYearlyMortgage(false);
                          setYearlyTaxes(false);
                          setYearlyInsurance(false);
                        }}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!yearlyExpense}
                        onClick={() => {
                          setYearlyExpense(!yearlyExpense);
                          setYearlyManagement(false);
                          setYearlyMaintenance(false);
                          setYearlyRepairs(false);
                          setYearlyUtilityExpense(false);
                          setYearlyMortgage(false);
                          setYearlyTaxes(false);
                          setYearlyInsurance(false);
                        }}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${yearExpenseTotal}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${yearExpenseExpectedTotal}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(yearExpenseTotal - yearExpenseExpectedTotal).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${yearExpenseTotalAmortized}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${yearExpenseExpectedTotalAmortized}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        yearExpenseTotalAmortized -
                        yearExpenseExpectedTotalAmortized
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow hidden={!yearlyExpense}>
                    <TableCell width="180px">
                      &nbsp;&nbsp; Management{" "}
                      <img
                        src={SortDown}
                        hidden={yearlyManagement}
                        onClick={() => setYearlyManagement(!yearlyManagement)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!yearlyManagement}
                        onClick={() => setYearlyManagement(!yearlyManagement)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.management_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.management_year_expected_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.management_year_expense -
                        cashflowData.management_year_expected_expense
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_management_year_expense.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_management_year_expected_expense.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_management_year_expense -
                        cashflowData.amortized_management_year_expected_expense
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense_yearly.map((expense, index) => {
                      return expense.purchase_type === "MANAGEMENT" ? (
                        <TableRow hidden={!yearlyManagement}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                            <br />
                            &nbsp;&nbsp;&nbsp; {expense.description} <br />
                            &nbsp;&nbsp;&nbsp; {expense.purchase_frequency}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell
                              width="180px"
                              align="right"
                              style={green}
                            >
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="180px" align="right" style={red}>
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          )}
                          <TableCell width="180px" align="right">
                            $
                            {(expense.amount_paid - expense.amount_due).toFixed(
                              2
                            )}
                          </TableCell>
                          {expense.purchase_status === "PAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_paid / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_status === "UNPAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_due / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              $
                              {(
                                (expense.amount_paid - expense.amount_due) /
                                12
                              ).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!yearlyExpense}>
                    <TableCell width="180px">
                      &nbsp;&nbsp; Maintenance{" "}
                      <img
                        src={SortDown}
                        hidden={yearlyMaintenance}
                        onClick={() => setYearlyMaintenance(!yearlyMaintenance)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!yearlyMaintenance}
                        onClick={() => setYearlyMaintenance(!yearlyMaintenance)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.maintenance_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.maintenance_year_expected_expense.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.maintenance_year_expense -
                        cashflowData.maintenance_year_expected_expense
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_maintenance_year_expense.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_maintenance_year_expected_expense.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_maintenance_year_expense -
                        cashflowData.amortized_maintenance_year_expected_expense
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense_yearly.map((expense, index) => {
                      return expense.purchase_type === "MAINTENANCE" ? (
                        <TableRow hidden={!yearlyMaintenance}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                            <br />
                            &nbsp;&nbsp;&nbsp; {expense.description} <br />
                            &nbsp;&nbsp;&nbsp; {expense.purchase_frequency}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell
                              width="180px"
                              align="right"
                              style={green}
                            >
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="180px" align="right" style={red}>
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          )}
                          <TableCell width="180px" align="right">
                            $
                            {(expense.amount_paid - expense.amount_due).toFixed(
                              2
                            )}
                          </TableCell>
                          {expense.purchase_status === "PAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_paid / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_status === "UNPAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_due / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              $
                              {(
                                (expense.amount_paid - expense.amount_due) /
                                12
                              ).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!yearlyExpense}>
                    <TableCell width="180px">
                      &nbsp; &nbsp;Repairs{" "}
                      <img
                        src={SortDown}
                        hidden={yearlyRepairs}
                        onClick={() => setYearlyRepairs(!yearlyRepairs)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!yearlyRepairs}
                        onClick={() => setYearlyRepairs(!yearlyRepairs)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.repairs_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.repairs_year_expected_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.repairs_year_expense -
                        cashflowData.repairs_year_expected_expense
                      ).toFixed(2)}
                    </TableCell>

                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_repairs_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_repairs_year_expected_expense.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_repairs_year_expense -
                        cashflowData.amortized_repairs_year_expected_expense
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense_yearly.map((expense, index) => {
                      return expense.purchase_type === "REPAIRS" ? (
                        <TableRow hidden={!yearlyRepairs}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                            <br />
                            &nbsp;&nbsp;&nbsp; {expense.description} <br />
                            &nbsp;&nbsp;&nbsp; {expense.purchase_frequency}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell
                              width="180px"
                              align="right"
                              style={green}
                            >
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="180px" align="right" style={red}>
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          )}
                          <TableCell width="180px" align="right">
                            $
                            {(expense.amount_paid - expense.amount_due).toFixed(
                              2
                            )}
                          </TableCell>
                          {expense.purchase_status === "PAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_paid / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_status === "UNPAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_due / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              $
                              {(
                                (expense.amount_paid - expense.amount_due) /
                                12
                              ).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!yearlyExpense}>
                    <TableCell width="180px">
                      &nbsp; &nbsp;Utility{" "}
                      <img
                        src={SortDown}
                        hidden={yearlyUtilityExpense}
                        onClick={() =>
                          setYearlyUtilityExpense(!yearlyUtilityExpense)
                        }
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!yearlyUtilityExpense}
                        onClick={() =>
                          setYearlyUtilityExpense(!yearlyUtilityExpense)
                        }
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.utility_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.utility_year_expected_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.utility_year_expense -
                        cashflowData.utility_year_expected_expense
                      ).toFixed(2)}
                    </TableCell>

                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_utility_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_utility_year_expected_expense.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_utility_year_expense -
                        cashflowData.amortized_utility_year_expected_expense
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense_yearly.map((expense, index) => {
                      return expense.purchase_type === "UTILITY" ? (
                        <TableRow hidden={!yearlyUtilityExpense}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                            <br />
                            &nbsp;&nbsp;&nbsp; {expense.description} <br />
                            &nbsp;&nbsp;&nbsp; {expense.purchase_frequency}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell
                              width="180px"
                              align="right"
                              style={green}
                            >
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_paid.toFixed(2)}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="180px" align="right" style={red}>
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              ${expense.amount_due.toFixed(2)}
                            </TableCell>
                          )}
                          <TableCell width="180px" align="right">
                            $
                            {(expense.amount_paid - expense.amount_due).toFixed(
                              2
                            )}
                          </TableCell>
                          {expense.purchase_status === "PAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_paid / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_status === "UNPAID" &&
                          expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              ${(expense.amount_due / 12).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                          {expense.purchase_frequency == "Annually" ? (
                            <TableCell width="180px" align="right">
                              $
                              {(
                                (expense.amount_paid - expense.amount_due) /
                                12
                              ).toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell width="180px" align="right">
                              $0.00
                            </TableCell>
                          )}
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!yearlyExpense}>
                    <TableCell width="180px">
                      &nbsp;&nbsp; Mortgage{" "}
                      <img
                        src={SortDown}
                        hidden={yearlyMortgage}
                        onClick={() => setYearlyMortgage(!yearlyMortgage)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!yearlyMortgage}
                        onClick={() => setYearlyMortgage(!yearlyMortgage)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.mortgage_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.mortgage_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.mortgage_year_expense -
                        cashflowData.mortgage_year_expense
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_mortgage_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_mortgage_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_mortgage_year_expense -
                        cashflowData.amortized_mortgage_year_expense
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_property_expense.map(
                      (expense, index) => {
                        return expense.mortgages !== null ? (
                          <TableRow hidden={!yearlyMortgage}>
                            <TableCell>
                              &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                              {expense.unit}
                              <br />
                              &nbsp;&nbsp;&nbsp;{" "}
                              {JSON.parse(expense.mortgages).frequency} <br />
                              &nbsp;&nbsp;&nbsp;{" "}
                              {
                                JSON.parse(expense.mortgages)
                                  .frequency_of_payment
                              }
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.mortgage_year_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.mortgage_year_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {(
                                expense.mortgage_year_expense -
                                expense.mortgage_year_expense
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {expense.amortized_mortgage_year_expense.toFixed(
                                2
                              )}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {expense.amortized_mortgage_year_expense.toFixed(
                                2
                              )}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {(
                                expense.amortized_mortgage_year_expense -
                                expense.amortized_mortgage_year_expense
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      }
                    )}
                  <TableRow hidden={!yearlyExpense}>
                    <TableCell width="180px">
                      &nbsp;&nbsp; Taxes{" "}
                      <img
                        src={SortDown}
                        hidden={yearlyTaxes}
                        onClick={() => setYearlyTaxes(!yearlyTaxes)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!yearlyTaxes}
                        onClick={() => setYearlyTaxes(!yearlyTaxes)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.taxes_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.taxes_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.taxes_year_expense -
                        cashflowData.taxes_year_expense
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_taxes_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.amortized_taxes_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_taxes_year_expense -
                        cashflowData.amortized_taxes_year_expense
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_property_expense.map(
                      (expense, index) => {
                        return expense.taxes !== null ? (
                          <TableRow hidden={!yearlyTaxes}>
                            <TableCell>
                              &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                              {expense.unit}
                              <br />
                              &nbsp;&nbsp;&nbsp; {expense.frequency} <br />
                              &nbsp;&nbsp;&nbsp; {expense.frequency_of_payment}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.taxes_year_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.taxes_year_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {(
                                expense.taxes_year_expense -
                                expense.taxes_year_expense
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              ${expense.amortized_taxes_year_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.amortized_taxes_year_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {(
                                expense.amortized_taxes_year_expense -
                                expense.amortized_taxes_year_expense
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      }
                    )}
                  <TableRow hidden={!yearlyExpense}>
                    <TableCell width="180px">
                      &nbsp;&nbsp; Insurance{" "}
                      <img
                        src={SortDown}
                        hidden={yearlyInsurance}
                        onClick={() => setYearlyInsurance(!yearlyInsurance)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!yearlyInsurance}
                        onClick={() => setYearlyInsurance(!yearlyInsurance)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.insurance_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      ${cashflowData.insurance_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.insurance_year_expense -
                        cashflowData.insurance_year_expense
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_insurance_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {cashflowData.amortized_insurance_year_expense.toFixed(2)}
                    </TableCell>
                    <TableCell width="180px" align="right">
                      $
                      {(
                        cashflowData.amortized_insurance_year_expense -
                        cashflowData.amortized_insurance_year_expense
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_property_expense.map(
                      (expense, index) => {
                        return expense.insurance !== null ? (
                          <TableRow hidden={!yearlyInsurance}>
                            <TableCell>
                              &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                              {expense.unit}
                              <br />
                              &nbsp;&nbsp;&nbsp; {expense.frequency} <br />
                              &nbsp;&nbsp;&nbsp; {expense.frequency_of_payment}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.insurance_year_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              ${expense.insurance_year_expense.toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {(
                                expense.insurance_year_expense -
                                expense.insurance_year_expense
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {expense.amortized_insurance_year_expense.toFixed(
                                2
                              )}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {expense.amortized_insurance_year_expense.toFixed(
                                2
                              )}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {(
                                expense.amortized_insurance_year_expense -
                                expense.amortized_insurance_year_expense
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      }
                    )}
                </TableBody>
              </Table>
            </Row>
            <Row>
              <Col>
                <h1>Properties</h1>
              </Col>
              <Col>
                <img
                  src={AddIcon}
                  onClick={() => setStage("NEW")}
                  style={{
                    width: "30px",
                    height: "30px",
                    float: "right",
                    marginRight: "5rem",
                  }}
                />
                {/* <h1 style={{ float: "right", marginRight: "5rem" }}>+</h1> */}
              </Col>
            </Row>

            <Row className="w-100 m-3">
              <Col> Search by</Col>

              <Col>
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                  style={{
                    width: "400px",
                    border: "1px solid black",
                    padding: "5px",
                  }}
                />
              </Col>
            </Row>
            <Row className="m-3">
              <Table classes={{ root: classes.customTable }} size="small">
                <EnhancedTableHeadProperties
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={ownerData.length}
                />{" "}
                <TableBody>
                  {stableSort(ownerData, getComparator(order, orderBy))
                    // for filtering
                    .filter((val) => {
                      const query = search.toLowerCase();

                      return (
                        val.address.toLowerCase().indexOf(query) >= 0 ||
                        val.city.toLowerCase().indexOf(query) >= 0 ||
                        val.zip.toLowerCase().indexOf(query) >= 0 ||
                        String(val.oldestOpenMR).toLowerCase().indexOf(query) >=
                          0 ||
                        String(val.late_date).toLowerCase().indexOf(query) >= 0
                      );
                    })
                    .map((property, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={property.address}
                          onClick={() => {
                            navigate(
                              `/propertyDetails/${property.property_uid}`,
                              {
                                state: {
                                  // property: property,
                                  property_uid: property.property_uid,
                                },
                              }
                            );
                          }}
                        >
                          <TableCell padding="none" size="small" align="center">
                            {JSON.parse(property.images).length > 0 ? (
                              <img
                                src={JSON.parse(property.images)[0]}
                                alt="Property"
                                style={{
                                  borderRadius: "4px",
                                  objectFit: "cover",
                                  width: "100px",
                                  height: "100px",
                                }}
                              />
                            ) : (
                              ""
                            )}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.address}
                            {property.unit !== "" ? " " + property.unit : ""}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.city}, {property.state}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.zip}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.rentalInfo.length !== 0
                              ? property.rentalInfo[0].tenant_first_name
                              : "None"}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {"$" + property.listed_rent}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            $
                            {(
                              parseInt(property.listed_rent) /
                              parseInt(property.area)
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.property_type}
                          </TableCell>

                          <TableCell padding="none" size="small" align="center">
                            {property.num_beds + "/" + property.num_baths}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.property_manager.length !== 0
                              ? property.property_manager[0]
                                  .manager_business_name
                              : "None"}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.rentalInfo.length !== 0
                              ? property.rentalInfo[0].lease_end
                              : "None"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Row>
            <Row>
              <Col>
                <h1>Maintenance and Repairs</h1>
              </Col>
              <Col>
                <img
                  src={AddIcon}
                  onClick={() => setStage("ADDREQUEST")}
                  style={{
                    width: "30px",
                    height: "30px",
                    float: "right",
                    marginRight: "5rem",
                  }}
                />
                {/* <h1 style={{ float: "right", marginRight: "5rem" }}>+</h1> */}
              </Col>
            </Row>

            <Row className="m-3">
              <Table classes={{ root: classes.customTable }} size="small">
                <EnhancedTableHeadMaintenance
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={maintenanceRequests.length}
                />{" "}
                <TableBody>
                  {stableSort(
                    maintenanceRequests,
                    getComparator(order, orderBy)
                  ).map((request, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={request.address}
                        onClick={() =>
                          navigate(
                            `/owner-repairs/${request.maintenance_request_uid}`,
                            {
                              state: {
                                repair: request,
                                property: request.address,
                              },
                            }
                          )
                        }
                      >
                        <TableCell padding="none" size="small" align="center">
                          {JSON.parse(request.images).length > 0 ? (
                            <img
                              src={JSON.parse(request.images)[0]}
                              onClick={() =>
                                navigate(
                                  `/owner-repairs/${request.maintenance_request_uid}`,
                                  {
                                    state: {
                                      repair: request,
                                      property: request.address,
                                    },
                                  }
                                )
                              }
                              alt="Property"
                              style={{
                                borderRadius: "4px",
                                objectFit: "cover",
                                width: "100px",
                                height: "100px",
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {request.address}
                          {request.unit !== "" ? " " + request.unit : ""}
                          {request.city}, {request.state} {request.zip}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {" "}
                          {request.title}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {" "}
                          {request.request_created_date}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {request.days_open} days
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {request.request_type != null
                            ? request.request_type
                            : "None"}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {request.priority}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {request.assigned_business != null
                            ? request.assigned_business
                            : "None"}
                        </TableCell>

                        <TableCell padding="none" size="small" align="center">
                          {request.scheduled_date != null
                            ? request.scheduled_date
                            : "Not Scheduled"}
                        </TableCell>
                        <TableCell>${request.total_estimate}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Row>
          </div>
        ) : (
          <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            <ReactBootStrap.Spinner animation="border" role="status" />
          </div>
        )}
      </div>
    </div>
  ) : stage === "NEW" ? (
    <div className="OwnerDashboard2">
      <div className="flex-1">
        <div style={{ backgroundColor: "#229ebc", minHeight: "100%" }}>
          <SideBar />
        </div>
        <div
          className="w-100"
          style={{
            width: "calc(100vw - 13rem)",
            position: "relative",
          }}
        >
          <Header
            title="Add a new Property"
            leftText="< Back"
            leftFn={() => setStage("LIST")}
          />
          <OwnerPropertyForm
            edit
            cancel={() => setStage("LIST")}
            onSubmit={addProperty}
          />
        </div>
      </div>
    </div>
  ) : stage === "ADDEXPENSE" ? (
    <div className="OwnerDashboard2">
      <div className="flex-1">
        <div style={{ backgroundColor: "#229ebc", minHeight: "100%" }}>
          <SideBar />
        </div>
        <div
          className="w-100"
          style={{
            width: "calc(100vw - 13rem)",
            position: "relative",
          }}
        >
          <Header
            title="Add Expense"
            leftText="< Back"
            leftFn={() => setStage("LIST")}
          />
          <OwnerCreateExpense
            properties={ownerData}
            cancel={() => setStage("LIST")}
            onSubmit={addProperty}
          />
        </div>
      </div>
    </div>
  ) : stage === "ADDREQUEST" ? (
    <div className="OwnerDashboard2">
      <div className="flex-1">
        <div style={{ backgroundColor: "#229ebc", minHeight: "100%" }}>
          <SideBar />
        </div>
        <div
          className="w-100"
          style={{
            width: "calc(100vw - 13rem)",
            position: "relative",
          }}
        >
          <Header
            title="Add Repair Request"
            leftText="< Back"
            leftFn={() => setStage("LIST")}
          />
          <OwnerRepairRequest
            properties={ownerData}
            cancel={() => setStage("LIST")}
            onSubmit={addProperty}
          />
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
