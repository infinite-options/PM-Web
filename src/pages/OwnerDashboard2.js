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
  revenueTotal =
    cashflowData.rental_revenue +
    cashflowData.extra_revenue +
    cashflowData.utility_revenue;

  let expenseTotal = 0;
  expenseTotal =
    cashflowData.maintenance_expense +
    cashflowData.management_expense +
    cashflowData.repairs_expense +
    cashflowData.utility_expense +
    cashflowData.mortgage_expense +
    cashflowData.taxes_expense +
    cashflowData.insurance_expense;
  const cashFlow = (revenueTotal - expenseTotal).toFixed(2);

  let yearExpenseTotal = 0;
  yearExpenseTotal =
    cashflowData.maintenance_year_expense +
    cashflowData.management_year_expense +
    cashflowData.repairs_year_expense +
    cashflowData.utility_year_expense +
    cashflowData.mortgage_year_expense +
    cashflowData.taxes_year_expense +
    cashflowData.insurance_year_expense;

  let yearRevenueTotal = 0;
  yearRevenueTotal =
    cashflowData.rental_year_revenue +
    cashflowData.extra_year_revenue +
    cashflowData.utility_year_revenue;
  const yearCashFlow = (yearRevenueTotal - yearExpenseTotal).toFixed(2);

  let revenueExpectedTotal = 0;
  revenueExpectedTotal =
    cashflowData.rental_expected_revenue +
    cashflowData.extra_expected_revenue +
    cashflowData.utility_expected_revenue;

  let expenseExpectedTotal = 0;

  expenseExpectedTotal =
    cashflowData.maintenance_expected_expense +
    cashflowData.management_expected_expense +
    cashflowData.repairs_expected_expense +
    cashflowData.utility_expected_expense +
    cashflowData.mortgage_expense +
    cashflowData.taxes_expense +
    cashflowData.insurance_expense;

  const cashFlowExpected = (
    revenueExpectedTotal - expenseExpectedTotal
  ).toFixed(2);

  let yearRevenueExpectedTotal = 0;
  yearRevenueExpectedTotal =
    cashflowData.rental_year_expected_revenue +
    cashflowData.extra_year_expected_revenue +
    cashflowData.utility_year_expected_revenue;

  let yearExpenseExpectedTotal = 0;

  yearExpenseExpectedTotal =
    cashflowData.maintenance_year_expected_expense +
    cashflowData.management_year_expected_expense +
    cashflowData.repairs_year_expected_expense +
    cashflowData.utility_year_expected_expense +
    cashflowData.mortgage_year_expense +
    cashflowData.taxes_year_expense +
    cashflowData.insurance_year_expense;

  const yearCashFlowExpected = (
    yearRevenueExpectedTotal - yearExpenseExpectedTotal
  ).toFixed(2);

  console.log(ownerData);
  console.log(cashflowData);

  return stage === "LIST" ? (
    <div className="OwnerDashboard2">
      <Header title="Owner Dashboard" />
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        {ownerData.length > 1 ? (
          <div className="w-100">
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
                  <TableCell>To Date</TableCell>
                  <TableCell>Expected</TableCell>
                  <TableCell>Delta</TableCell>
                  <TableCell>To Date Amortized</TableCell>
                  <TableCell>Expected Amortized</TableCell>
                  <TableCell>Delta Amortized</TableCell>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell width="160px">
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
                    <TableCell width="160px">${cashFlow}</TableCell>
                    <TableCell width="160px">${cashFlowExpected}</TableCell>
                    <TableCell width="160px">
                      ${cashFlow - cashFlowExpected}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  <TableRow hidden={!monthlyCashFlow}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">${revenueTotal}</TableCell>
                    <TableCell width="160px">${revenueExpectedTotal}</TableCell>
                    <TableCell width="160px">
                      ${revenueTotal - revenueExpectedTotal}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>

                  <TableRow hidden={!monthlyRevenue}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.rental_revenue}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.rental_expected_revenue}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.rental_revenue -
                        cashflowData.rental_expected_revenue}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_revenue.map((revenue, index) => {
                      return revenue.purchase_type === "RENT" ? (
                        <TableRow hidden={!monthlyRent}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {revenue.address} {revenue.unit}
                          </TableCell>
                          {revenue.purchase_status === "PAID" ? (
                            <TableCell width="160px" style={green}>
                              ${revenue.amount_paid}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${revenue.amount_paid}
                            </TableCell>
                          )}

                          {revenue.purchase_status === "UNPAID" ? (
                            <TableCell width="160px" style={red}>
                              ${revenue.amount_due}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${revenue.amount_due}
                            </TableCell>
                          )}
                          <TableCell width="160px">
                            ${revenue.amount_paid - revenue.amount_due}
                          </TableCell>
                          <TableCell width="160px">To Date Amortized</TableCell>
                          <TableCell width="160px">
                            Expected Amortized
                          </TableCell>
                          <TableCell width="160px">Delta Amortized</TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!monthlyRevenue}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.extra_revenue}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.extra_expected_revenue}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.extra_revenue -
                        cashflowData.extra_expected_revenue}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_revenue.map((revenue, index) => {
                      return revenue.purchase_type === "EXTRA CHARGES" ? (
                        <TableRow hidden={!monthlyExtra}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {revenue.address} {revenue.unit}
                          </TableCell>
                          {revenue.purchase_status === "PAID" ? (
                            <TableCell width="160px" style={green}>
                              ${revenue.amount_paid}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${revenue.amount_paid}
                            </TableCell>
                          )}

                          {revenue.purchase_status === "UNPAID" ? (
                            <TableCell width="160px" style={red}>
                              ${revenue.amount_due}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${revenue.amount_due}
                            </TableCell>
                          )}
                          <TableCell width="160px">
                            ${revenue.amount_paid - revenue.amount_due}
                          </TableCell>
                          <TableCell width="160px">To Date Amortized</TableCell>
                          <TableCell width="160px">
                            Expected Amortized
                          </TableCell>
                          <TableCell width="160px">Delta Amortized</TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!monthlyRevenue}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.utility_revenue}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.utility_expected_revenue}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.utility_revenue -
                        cashflowData.utility_expected_revenue}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_revenue.map((revenue, index) => {
                      return revenue.purchase_type === "UTILITY" ? (
                        <TableRow hidden={!monthlyUtility}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {revenue.address} {revenue.unit}
                          </TableCell>
                          {revenue.purchase_status === "PAID" ? (
                            <TableCell width="160px" style={green}>
                              ${revenue.amount_paid}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${revenue.amount_paid}
                            </TableCell>
                          )}

                          {revenue.purchase_status === "UNPAID" ? (
                            <TableCell width="160px" style={red}>
                              ${revenue.amount_due}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${revenue.amount_due}
                            </TableCell>
                          )}
                          <TableCell width="160px">
                            ${revenue.amount_paid - revenue.amount_due}
                          </TableCell>
                          <TableCell width="160px">To Date Amortized</TableCell>
                          <TableCell width="160px">
                            Expected Amortized
                          </TableCell>
                          <TableCell width="160px">Delta Amortized</TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!monthlyCashFlow}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">${expenseTotal}</TableCell>
                    <TableCell width="160px">${expenseExpectedTotal}</TableCell>
                    <TableCell width="160px">
                      ${expenseTotal - expenseExpectedTotal}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  <TableRow hidden={!monthlyExpense}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.management_expense}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.management_expected_expense}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.management_expense -
                        cashflowData.management_expected_expense}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense.map((expense, index) => {
                      return expense.purchase_type === "MANAGEMENT" ? (
                        <TableRow hidden={!monthlyManagement}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell width="160px" style={green}>
                              ${expense.amount_paid}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_paid}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="160px" style={red}>
                              ${expense.amount_due}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_due}
                            </TableCell>
                          )}
                          <TableCell width="160px">
                            ${expense.amount_paid - expense.amount_due}
                          </TableCell>
                          <TableCell width="160px">To Date Amortized</TableCell>
                          <TableCell width="160px">
                            Expected Amortized
                          </TableCell>
                          <TableCell width="160px">Delta Amortized</TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!monthlyExpense}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.maintenance_expense}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.maintenance_expected_expense}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.maintenance_expense -
                        cashflowData.maintenance_expected_expense}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense.map((expense, index) => {
                      return expense.purchase_type === "MAINTENANCE" ? (
                        <TableRow hidden={!monthlyMaintenance}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell width="160px" style={green}>
                              ${expense.amount_paid}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_paid}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="160px" style={red}>
                              ${expense.amount_due}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_due}
                            </TableCell>
                          )}
                          <TableCell width="160px">
                            ${expense.amount_paid - expense.amount_due}
                          </TableCell>
                          <TableCell width="160px">To Date Amortized</TableCell>
                          <TableCell width="160px">
                            Expected Amortized
                          </TableCell>
                          <TableCell width="160px">Delta Amortized</TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!monthlyExpense}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.repairs_expense}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.repairs_expected_expense}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.repairs_expense -
                        cashflowData.repairs_expected_expense}
                    </TableCell>

                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense.map((expense, index) => {
                      return expense.purchase_type === "REPAIRS" ? (
                        <TableRow hidden={!monthlyRepairs}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell width="160px" style={green}>
                              ${expense.amount_paid}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_paid}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="160px" style={red}>
                              ${expense.amount_due}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_due}
                            </TableCell>
                          )}
                          <TableCell width="160px">
                            ${expense.amount_paid - expense.amount_due}
                          </TableCell>
                          <TableCell width="160px">To Date Amortized</TableCell>
                          <TableCell width="160px">
                            Expected Amortized
                          </TableCell>
                          <TableCell width="160px">Delta Amortized</TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!monthlyExpense}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.utility_expense}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.utility_expected_expense}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.utility_expense -
                        cashflowData.utility_expected_expense}
                    </TableCell>

                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense.map((expense, index) => {
                      return expense.purchase_type === "UTILITY" ? (
                        <TableRow hidden={!monthlyUtilityExpense}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell width="160px" style={green}>
                              ${expense.amount_paid}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_paid}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="160px" style={red}>
                              ${expense.amount_due}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_due}
                            </TableCell>
                          )}
                          <TableCell width="160px">
                            ${expense.amount_paid - expense.amount_due}
                          </TableCell>
                          <TableCell width="160px">To Date Amortized</TableCell>
                          <TableCell width="160px">
                            Expected Amortized
                          </TableCell>
                          <TableCell width="160px">Delta Amortized</TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!monthlyExpense}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.mortgage_expense}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.mortgage_expense}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.mortgage_expense -
                        cashflowData.mortgage_expense}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_property_expense.map(
                      (expense, index) => {
                        return expense.mortgages !== null ? (
                          <TableRow hidden={!monthlyMortgage}>
                            <TableCell>
                              &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                              {expense.unit}
                            </TableCell>

                            <TableCell width="160px">
                              ${expense.mortgage_expense}
                            </TableCell>

                            <TableCell width="160px">
                              ${expense.mortgage_expense}
                            </TableCell>

                            <TableCell width="160px">
                              $
                              {expense.mortgage_expense -
                                expense.mortgage_expense}
                            </TableCell>
                            <TableCell width="160px">
                              To Date Amortized
                            </TableCell>
                            <TableCell width="160px">
                              Expected Amortized
                            </TableCell>
                            <TableCell width="160px">Delta Amortized</TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      }
                    )}
                  <TableRow hidden={!monthlyExpense}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.taxes_expense}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.taxes_expense}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.taxes_expense - cashflowData.taxes_expense}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_property_expense.map(
                      (expense, index) => {
                        return expense.taxes !== null ? (
                          <TableRow hidden={!monthlyTaxes}>
                            <TableCell>
                              &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                              {expense.unit}
                            </TableCell>

                            <TableCell width="160px">
                              ${expense.taxes_expense}
                            </TableCell>

                            <TableCell width="160px">
                              ${expense.taxes_expense}
                            </TableCell>

                            <TableCell width="160px">
                              ${expense.taxes_expense - expense.taxes_expense}
                            </TableCell>
                            <TableCell width="160px">
                              To Date Amortized
                            </TableCell>
                            <TableCell width="160px">
                              Expected Amortized
                            </TableCell>
                            <TableCell width="160px">Delta Amortized</TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      }
                    )}
                  <TableRow hidden={!monthlyExpense}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.insurance_expense}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.insurance_expense}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.insurance_expense -
                        cashflowData.insurance_expense}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_property_expense.map(
                      (expense, index) => {
                        return expense.insurance !== null ? (
                          <TableRow hidden={!monthlyInsurance}>
                            <TableCell>
                              &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                              {expense.unit}
                            </TableCell>

                            <TableCell width="160px">
                              ${expense.insurance_expense}
                            </TableCell>

                            <TableCell width="160px">
                              ${expense.insurance_expense}
                            </TableCell>

                            <TableCell width="160px">
                              $
                              {expense.insurance_expense -
                                expense.insurance_expense}
                            </TableCell>
                            <TableCell width="160px">
                              To Date Amortized
                            </TableCell>
                            <TableCell width="160px">
                              Expected Amortized
                            </TableCell>
                            <TableCell width="160px">Delta Amortized</TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      }
                    )}

                  <TableRow>
                    <TableCell width="160px">
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
                    <TableCell width="160px">${yearCashFlow}</TableCell>
                    <TableCell width="160px">${yearCashFlowExpected}</TableCell>
                    <TableCell width="160px">
                      ${yearCashFlow - yearCashFlowExpected}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  <TableRow hidden={!yearlyCashFlow}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">${yearRevenueTotal}</TableCell>
                    <TableCell width="160px">
                      ${yearRevenueExpectedTotal}
                    </TableCell>
                    <TableCell width="160px">
                      ${yearRevenueTotal - yearRevenueExpectedTotal}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  <TableRow hidden={!yearlyRevenue}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.rental_year_revenue}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.rental_year_expected_revenue}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.rental_year_revenue -
                        cashflowData.rental_year_expected_revenue}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_revenue_yearly.map((revenue, index) => {
                      return revenue.purchase_type === "RENT" ? (
                        <TableRow hidden={!yearlyRent}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {revenue.address} {revenue.unit}
                          </TableCell>
                          {revenue.purchase_status === "PAID" ? (
                            <TableCell width="160px" style={green}>
                              ${revenue.amount_paid}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${revenue.amount_paid}
                            </TableCell>
                          )}

                          {revenue.purchase_status === "UNPAID" ? (
                            <TableCell width="160px" style={red}>
                              ${revenue.amount_due}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${revenue.amount_due}
                            </TableCell>
                          )}
                          <TableCell width="160px">
                            ${revenue.amount_paid - revenue.amount_due}
                          </TableCell>
                          <TableCell width="160px">To Date Amortized</TableCell>
                          <TableCell width="160px">
                            Expected Amortized
                          </TableCell>
                          <TableCell width="160px">Delta Amortized</TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!yearlyRevenue}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.extra_year_revenue}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.extra_year_expected_revenue}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.extra_year_revenue -
                        cashflowData.extra_year_expected_revenue}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_revenue_yearly.map((revenue, index) => {
                      return revenue.purchase_type === "EXTRA CHARGES" ? (
                        <TableRow hidden={!yearlyExtra}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {revenue.address} {revenue.unit}
                          </TableCell>
                          {revenue.purchase_status === "PAID" ? (
                            <TableCell width="160px" style={green}>
                              ${revenue.amount_paid}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${revenue.amount_paid}
                            </TableCell>
                          )}

                          {revenue.purchase_status === "UNPAID" ? (
                            <TableCell width="160px" style={red}>
                              ${revenue.amount_due}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${revenue.amount_due}
                            </TableCell>
                          )}
                          <TableCell width="160px">
                            ${revenue.amount_paid - revenue.amount_due}
                          </TableCell>
                          <TableCell width="160px">To Date Amortized</TableCell>
                          <TableCell width="160px">
                            Expected Amortized
                          </TableCell>
                          <TableCell width="160px">Delta Amortized</TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!yearlyRevenue}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.utility_year_revenue}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.utility_year_expected_revenue}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.utility_year_revenue -
                        cashflowData.utility_year_expected_revenue}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_revenue_yearly.map((revenue, index) => {
                      return revenue.purchase_type === "UTILITY" ? (
                        <TableRow hidden={!yearlyUtility}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {revenue.address} {revenue.unit}
                          </TableCell>
                          {revenue.purchase_status === "PAID" ? (
                            <TableCell width="160px" style={green}>
                              ${revenue.amount_paid}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${revenue.amount_paid}
                            </TableCell>
                          )}

                          {revenue.purchase_status === "UNPAID" ? (
                            <TableCell width="160px" style={red}>
                              ${revenue.amount_due}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${revenue.amount_due}
                            </TableCell>
                          )}
                          <TableCell width="160px">
                            ${revenue.amount_paid - revenue.amount_due}
                          </TableCell>
                          <TableCell width="160px">To Date Amortized</TableCell>
                          <TableCell width="160px">
                            Expected Amortized
                          </TableCell>
                          <TableCell width="160px">Delta Amortized</TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!yearlyCashFlow}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">${yearExpenseTotal}</TableCell>
                    <TableCell width="160px">
                      ${yearExpenseExpectedTotal}
                    </TableCell>
                    <TableCell width="160px">
                      ${yearExpenseTotal - yearExpenseExpectedTotal}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  <TableRow hidden={!yearlyExpense}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.management_year_expense}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.management_year_expected_expense}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.management_year_expense -
                        cashflowData.management_year_expected_expense}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense_yearly.map((expense, index) => {
                      return expense.purchase_type === "MANAGEMENT" ? (
                        <TableRow hidden={!yearlyManagement}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell width="160px" style={green}>
                              ${expense.amount_paid}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_paid}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="160px" style={red}>
                              ${expense.amount_due}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_due}
                            </TableCell>
                          )}
                          <TableCell width="160px">
                            ${expense.amount_paid - expense.amount_due}
                          </TableCell>
                          <TableCell width="160px">To Date Amortized</TableCell>
                          <TableCell width="160px">
                            Expected Amortized
                          </TableCell>
                          <TableCell width="160px">Delta Amortized</TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!yearlyExpense}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.maintenance_year_expense}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.maintenance_year_expected_expense}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.maintenance_year_expense -
                        cashflowData.maintenance_year_expected_expense}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense_yearly.map((expense, index) => {
                      return expense.purchase_type === "MAINTENANCE" ? (
                        <TableRow hidden={!yearlyMaintenance}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell width="160px" style={green}>
                              ${expense.amount_paid}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_paid}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="160px" style={red}>
                              ${expense.amount_due}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_due}
                            </TableCell>
                          )}
                          <TableCell width="160px">
                            ${expense.amount_paid - expense.amount_due}
                          </TableCell>
                          <TableCell width="160px">To Date Amortized</TableCell>
                          <TableCell width="160px">
                            Expected Amortized
                          </TableCell>
                          <TableCell width="160px">Delta Amortized</TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!yearlyExpense}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.repairs_year_expense}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.repairs_year_expected_expense}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.repairs_year_expense -
                        cashflowData.repairs_year_expected_expense}
                    </TableCell>

                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense_yearly.map((expense, index) => {
                      return expense.purchase_type === "REPAIRS" ? (
                        <TableRow hidden={!yearlyRepairs}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell width="160px" style={green}>
                              ${expense.amount_paid}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_paid}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="160px" style={red}>
                              ${expense.amount_due}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_due}
                            </TableCell>
                          )}
                          <TableCell width="160px">
                            ${expense.amount_paid - expense.amount_due}
                          </TableCell>
                          <TableCell width="160px">To Date Amortized</TableCell>
                          <TableCell width="160px">
                            Expected Amortized
                          </TableCell>
                          <TableCell width="160px">Delta Amortized</TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!yearlyExpense}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.utility_year_expense}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.utility_year_expected_expense}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.utility_year_expense -
                        cashflowData.utility_year_expected_expense}
                    </TableCell>

                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_expense_yearly.map((expense, index) => {
                      return expense.purchase_type === "UTILITY" ? (
                        <TableRow hidden={!yearlyUtilityExpense}>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp; {expense.address} {expense.unit}
                          </TableCell>
                          {expense.purchase_status === "PAID" ? (
                            <TableCell width="160px" style={green}>
                              ${expense.amount_paid}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_paid}
                            </TableCell>
                          )}

                          {expense.purchase_status === "UNPAID" ? (
                            <TableCell width="160px" style={red}>
                              ${expense.amount_due}
                            </TableCell>
                          ) : (
                            <TableCell width="160px">
                              ${expense.amount_due}
                            </TableCell>
                          )}
                          <TableCell width="160px">
                            ${expense.amount_paid - expense.amount_due}
                          </TableCell>
                          <TableCell width="160px">To Date Amortized</TableCell>
                          <TableCell width="160px">
                            Expected Amortized
                          </TableCell>
                          <TableCell width="160px">Delta Amortized</TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  <TableRow hidden={!yearlyExpense}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.mortgage_year_expense}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.mortgage_year_expense}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.mortgage_year_expense -
                        cashflowData.mortgage_year_expense}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_property_expense.map(
                      (expense, index) => {
                        return expense.mortgages !== null ? (
                          <TableRow hidden={!yearlyMortgage}>
                            <TableCell>
                              &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                              {expense.unit}
                            </TableCell>

                            <TableCell width="160px">
                              ${expense.mortgage_year_expense}
                            </TableCell>

                            <TableCell width="160px">
                              ${expense.mortgage_year_expense}
                            </TableCell>

                            <TableCell width="160px">
                              $
                              {expense.mortgage_year_expense -
                                expense.mortgage_year_expense}
                            </TableCell>
                            <TableCell width="160px">
                              To Date Amortized
                            </TableCell>
                            <TableCell width="160px">
                              Expected Amortized
                            </TableCell>
                            <TableCell width="160px">Delta Amortized</TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      }
                    )}
                  <TableRow hidden={!yearlyExpense}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.taxes_year_expense}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.taxes_year_expense}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.taxes_year_expense -
                        cashflowData.taxes_year_expense}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_property_expense.map(
                      (expense, index) => {
                        return expense.taxes !== null ? (
                          <TableRow hidden={!yearlyTaxes}>
                            <TableCell>
                              &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                              {expense.unit}
                            </TableCell>

                            <TableCell width="160px">
                              ${expense.taxes_year_expense}
                            </TableCell>

                            <TableCell width="160px">
                              ${expense.taxes_year_expense}
                            </TableCell>

                            <TableCell width="160px">
                              $
                              {expense.taxes_year_expense -
                                expense.taxes_year_expense}
                            </TableCell>
                            <TableCell width="160px">
                              To Date Amortized
                            </TableCell>
                            <TableCell width="160px">
                              Expected Amortized
                            </TableCell>
                            <TableCell width="160px">Delta Amortized</TableCell>
                          </TableRow>
                        ) : (
                          ""
                        );
                      }
                    )}
                  <TableRow hidden={!yearlyExpense}>
                    <TableCell width="160px">
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
                    <TableCell width="160px">
                      ${cashflowData.insurance_year_expense}
                    </TableCell>
                    <TableCell width="160px">
                      ${cashflowData.insurance_year_expense}
                    </TableCell>
                    <TableCell width="160px">
                      $
                      {cashflowData.insurance_year_expense -
                        cashflowData.insurance_year_expense}
                    </TableCell>
                    <TableCell width="160px">To Date Amortized</TableCell>
                    <TableCell width="160px">Expected Amortized</TableCell>
                    <TableCell width="160px">Delta Amortized</TableCell>
                  </TableRow>
                  {isLoading === false &&
                    cashflowData.owner_property_expense.map(
                      (expense, index) => {
                        return expense.insurance !== null ? (
                          <TableRow hidden={!yearlyInsurance}>
                            <TableCell>
                              &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                              {expense.unit}
                            </TableCell>

                            <TableCell width="160px">
                              ${expense.insurance_year_expense}
                            </TableCell>

                            <TableCell width="160px">
                              ${expense.insurance_year_expense}
                            </TableCell>

                            <TableCell width="160px">
                              $
                              {expense.insurance_year_expense -
                                expense.insurance_year_expense}
                            </TableCell>
                            <TableCell width="160px">
                              To Date Amortized
                            </TableCell>
                            <TableCell width="160px">
                              Expected Amortized
                            </TableCell>
                            <TableCell width="160px">Delta Amortized</TableCell>
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
              <Col xs={2}> Search by</Col>

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
                        val.rent_status.toLowerCase().indexOf(query) >= 0 ||
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
                        >
                          <TableCell padding="none" size="small" align="center">
                            {JSON.parse(property.images).length > 0 ? (
                              <img
                                src={JSON.parse(property.images)[0]}
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
                  )
                    // for filtering
                    .filter((val) => {
                      const query = search.toLowerCase();

                      return (
                        val.address.toLowerCase().indexOf(query) >= 0 ||
                        val.city.toLowerCase().indexOf(query) >= 0 ||
                        val.zip.toLowerCase().indexOf(query) >= 0 ||
                        val.priority.toLowerCase().indexOf(query) >= 0
                      );
                    })
                    .map((request, index) => {
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
      <Header
        title="Add a new Property"
        leftText="< Back"
        leftFn={() => setStage("LIST")}
      />
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div className="w-100">
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
      <Header
        title="Add Expense"
        leftText="< Back"
        leftFn={() => setStage("LIST")}
      />
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div className="w-100">
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
      <Header
        title="Add Repair Request"
        leftText="< Back"
        leftFn={() => setStage("LIST")}
      />
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div className="w-100">
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
