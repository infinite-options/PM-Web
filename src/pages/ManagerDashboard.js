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
import SideBar from "../components/managerComponents/SideBar";
import Header from "../components/Header";
import AppContext from "../AppContext";
import ManagerPropertyView from "../components/managerComponents/ManagerPropertyView";
import ManagerCreateExpense from "../components/managerComponents/ManagerCreateExpense";
import ManagerRepairRequest from "../components/managerComponents/ManagerRepairRequest";
import ManagerFooter from "../components/managerComponents/ManagerFooter";
import SortDown from "../icons/Sort-down.svg";
import SortLeft from "../icons/Sort-left.svg";
import AddIcon from "../icons/AddIcon.svg";
import PropertyIcon from "../icons/PropertyIcon.svg";
import RepairImg from "../icons/RepairImg.svg";
import { get, put } from "../utils/api";
import { green, red, blue, xSmall } from "../utils/styles";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [managerData, setManagerData] = useState([]);

  const [processingManagerData, setProcessingManagerData] = useState([]);
  const [cashflowData, setCashflowData] = useState({});
  const [selectedTenant, setSelectedTenant] = useState([]);

  const [stage, setStage] = useState("LIST");
  const [isLoading, setIsLoading] = useState(true);

  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");

  const [orderMaintenance, setOrderMaintenance] = useState("asc");
  const [orderMaintenanceBy, setOrderMaintenanceBy] = useState("calories");
  const [monthlyCashFlow, setMonthlyCashFlow] = useState(false);
  const [yearlyCashFlow, setYearlyCashFlow] = useState(false);

  const [monthlyRevenue, setMonthlyRevenue] = useState(false);
  const [monthlyRent, setMonthlyRent] = useState(false);
  const [monthlyExtra, setMonthlyExtra] = useState(false);
  const [monthlyUtility, setMonthlyUtility] = useState(false);
  const [monthlyManagement, setMonthlyManagement] = useState(false);
  const [monthlyMaintenanceRevenue, setMonthlyMaintenanceRevenue] =
    useState(false);
  const [monthlyRepairsRevenue, setMonthlyRepairsRevenue] = useState(false);

  const [monthlyExpense, setMonthlyExpense] = useState(false);
  const [monthlyMaintenance, setMonthlyMaintenance] = useState(false);
  const [monthlyRepairs, setMonthlyRepairs] = useState(false);
  const [monthlyUtilityExpense, setMonthlyUtilityExpense] = useState(false);
  const [monthlyOwnerPayment, setMonthlyOwnerPayment] = useState(false);

  const [yearlyRevenue, setYearlyRevenue] = useState(false);
  const [yearlyRent, setYearlyRent] = useState(false);
  const [yearlyExtra, setYearlyExtra] = useState(false);
  const [yearlyUtility, setYearlyUtility] = useState(false);
  const [yearlyManagement, setYearlyManagement] = useState(false);
  const [yearlyMaintenanceRevenue, setYearlyMaintenanceRevenue] =
    useState(false);
  const [yearlyRepairsRevenue, setYearlyRepairsRevenue] = useState(false);

  const [yearlyExpense, setYearlyExpense] = useState(false);
  const [yearlyOwnerPayment, setYearlyOwnerPayment] = useState(false);
  const [yearlyMaintenance, setYearlyMaintenance] = useState(false);
  const [yearlyRepairs, setYearlyRepairs] = useState(false);
  const [yearlyUtilityExpense, setYearlyUtilityExpense] = useState(false);

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
  const fetchManagerDashboard = async () => {
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
    const response = await get("/managerDashboard", access_token);
    const cashflowResponse = await get(
      `/managerCashflow?manager_id=${management_buid}`
    );

    setCashflowData(cashflowResponse.result);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();

      return;
    }
    const properties = response.result.filter(
      (property) => property.management_status !== "REJECTED"
    );

    let properties_unique = [];
    const pids = new Set();
    properties.forEach((property) => {
      if (pids.has(property.property_uid)) {
        const index = properties_unique.findIndex(
          (item) => item.property_uid === property.property_uid
        );
        properties_unique[index].tenants.push(property);
      } else {
        pids.add(property.property_uid);
        properties_unique.push(property);
        properties_unique[properties_unique.length - 1].tenants = [property];
      }
    });
    properties_unique.forEach((property) => {
      const new_repairs = property.maintenanceRequests.filter(
        (item) => item.request_status === "NEW"
      );
      const processing_repairs = property.maintenanceRequests.filter(
        (item) => item.request_status === "PROCESSING"
      );
      const scheduled_repairs = property.maintenanceRequests.filter(
        (item) => item.request_status === "SCHEDULED"
      );
      const completed_repairs = property.maintenanceRequests.filter(
        (item) => item.request_status === "COMPLETE"
      );
      property.repairs = {
        new: new_repairs.length,
        processing: processing_repairs.length,
        scheduled: scheduled_repairs.length,
        complete: completed_repairs.length,
      };

      property.new_tenant_applications = property.applications.filter(
        (a) => a.application_status === "NEW"
      );
      property.forwarded_applications = property.applications.filter(
        (a) => a.application_status === "FORWARDED"
      );

      property.end_early_applications = property.applications.filter(
        (a) => a.application_status === "TENANT END EARLY"
      );
    });

    console.log(properties_unique);
    let activeProperties = [];
    properties_unique.forEach((property) => {
      if (
        property.management_status !== "FORWARDED" &&
        property.management_status !== "SENT" &&
        property.management_status !== "TERMINATED" &&
        property.management_status !== "EXPIRED"
      ) {
        activeProperties.push(property);
      }
    });
    // activeProperties.forEach((property) => {
    //   const forwarded = property.management_status.filter(
    //     (item) => item.management_status === "FORWARDED"
    //   );
    //   const sent = property.management_status.filter(
    //     (item) => item.management_status === "SENT"
    //   );
    //   const refused = property.management_status.filter(
    //     (item) => item.management_status === "REFUSED"
    //   );

    //   const pmendearly = property.management_status.filter(
    //     (item) => item.management_status === "PM END EARLY"
    //   );
    //   const ownerendearly = property.management_status.filter(
    //     (item) => item.management_status === "OWNER END EARLY"
    //   );
    //   property.management = {
    //     forwarded: forwarded.length,
    //     sent: sent.length,
    //     refused: refused.length,
    //     pmendearly: pmendearly.length,
    //     ownerendearly: ownerendearly.length,
    //   };
    // });

    console.log(activeProperties);
    setManagerData(activeProperties);
    let inProcessProperties = [];
    properties_unique.forEach((property) => {
      if (
        property.management_status === "FORWARDED" ||
        property.management_status === "SENT" ||
        property.management_status === "TERMINATED" ||
        property.management_status === "EXPIRED"
      ) {
        inProcessProperties.push(property);
      }
    });
    console.log(inProcessProperties);
    setProcessingManagerData(inProcessProperties);

    setIsLoading(false);

    let requests = [];
    properties_unique.forEach((res) => {
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
    fetchManagerDashboard();
  }, [access_token]);

  const fetchTenantDetails = async (tenant_id) => {
    if (access_token === null) {
      navigate("/");
      return;
    }
    console.log(tenant_id);
    const response = await get("/tenantDetails?tenant_id=" + tenant_id);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();

      return;
    }
    setSelectedTenant(response.result);
    console.log(response.result);
    navigate(`/tenant-list/${tenant_id}`, {
      state: {
        selectedTenant: response.result[0],
      },
    });
  };

  const addProperty = () => {
    fetchManagerDashboard();
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
    // {
    //   id: "city",
    //   numeric: false,
    //   label: "City,State",
    // },
    {
      id: "zip",
      numeric: true,
      label: "Zip",
    },

    {
      id: "owner_first_name",
      numeric: false,
      label: "Owner",
    },

    {
      id: "num_apps",
      numeric: false,
      label: "Apps",
    },

    {
      id: "tenant",
      numeric: false,
      label: "Tenant",
    },
    {
      id: "lease_end",
      numeric: true,
      label: "Lease End",
    },
    {
      id: "rent_status",
      numeric: false,
      label: "Rent Status",
    },
    {
      id: "late_date",
      numeric: true,
      label: "Days Late",
    },
    {
      id: "new_mr",
      numeric: true,
      label: "OP",
    },
    {
      id: "process_mr",
      numeric: true,
      label: "PR",
    },
    {
      id: "quote_received_mr",
      numeric: true,
      label: "QR",
    },
    {
      id: "quotes_accepted_mr",
      numeric: true,
      label: "IP",
    },
    // {
    //   id: "oldestOpenMR",
    //   numeric: true,
    //   label: "Longest duration",
    // },
    {
      id: "listed_rent",
      numeric: true,
      label: "Rent",
    },
    // {
    //   id: "per_sqft",
    //   numeric: true,
    //   label: " $/Sq Ft",
    // },
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

  const handleRequestSortMaintenance = (event, property) => {
    const isAsc = orderMaintenanceBy === property && orderMaintenance === "asc";
    setOrderMaintenance(isAsc ? "desc" : "asc");
    setOrderMaintenanceBy(property);
  };

  function descendingComparatorMaintenance(a, b, orderMaintenanceBy) {
    if (b[orderMaintenanceBy] < a[orderMaintenanceBy]) {
      return -1;
    }
    if (b[orderMaintenanceBy] > a[orderMaintenanceBy]) {
      return 1;
    }
    return 0;
  }

  function getComparatorMaintenance(orderMaintenance, orderMaintenanceBy) {
    return orderMaintenance === "desc"
      ? (a, b) => descendingComparatorMaintenance(a, b, orderMaintenanceBy)
      : (a, b) => -descendingComparatorMaintenance(a, b, orderMaintenanceBy);
  }

  function stableSortMaintenance(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const orderMaintenance = comparator(a[0], b[0]);
      if (orderMaintenance !== 0) {
        return orderMaintenance;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

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
    ,
    {
      id: "request_status",
      numeric: false,
      label: "Status",
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
      id: "tenant_status",
      numeric: false,
      label: "Quote Status",
    },

    {
      id: "scheduled_date",
      numeric: true,
      label: "Scheduled Date",
    },

    {
      id: "scheduled_time",
      numeric: true,
      label: "Scheduled Time",
    },
    {
      id: "total_estimate",
      numeric: true,
      label: "Cost",
    },
  ];
  function EnhancedTableHeadMaintenance(props) {
    const { orderMaintenance, orderMaintenanceBy, onRequestSort } = props;
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
              sortDirection={
                orderMaintenanceBy === headCell.id ? orderMaintenance : false
              }
            >
              <TableSortLabel
                align="center"
                active={orderMaintenanceBy === headCell.id}
                direction={
                  orderMaintenanceBy === headCell.id ? orderMaintenance : "asc"
                }
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderMaintenanceBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {orderMaintenance === "desc"
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
    orderMaintenance: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderMaintenanceBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  let revenueTotal = 0;
  revenueTotal = (
    cashflowData.rental_revenue +
    cashflowData.extra_revenue +
    cashflowData.utility_revenue +
    cashflowData.management_revenue +
    cashflowData.maintenance_revenue +
    cashflowData.repairs_revenue
  ).toFixed(2);

  let expenseTotal = 0;
  expenseTotal = (
    cashflowData.maintenance_expense +
    cashflowData.management_expense +
    cashflowData.repairs_expense +
    cashflowData.utility_expense
  ).toFixed(2);
  const cashFlow = (revenueTotal - expenseTotal).toFixed(2);

  let revenueTotalAmortized = 0;
  revenueTotalAmortized = (
    cashflowData.amortized_rental_revenue +
    cashflowData.amortized_extra_revenue +
    cashflowData.amortized_utility_revenue +
    cashflowData.amortized_management_revenue +
    cashflowData.amortized_maintenance_revenue +
    cashflowData.amortized_repairs_revenue
  ).toFixed(2);

  let expenseTotalAmortized = 0;
  expenseTotalAmortized = (
    cashflowData.amortized_maintenance_expense +
    cashflowData.amortized_management_expense +
    cashflowData.amortized_repairs_expense +
    cashflowData.amortized_utility_expense
  ).toFixed(2);
  const cashFlowAmortized = (
    revenueTotalAmortized - expenseTotalAmortized
  ).toFixed(2);

  let yearExpenseTotal = 0;
  yearExpenseTotal = (
    cashflowData.maintenance_year_expense +
    cashflowData.management_year_expense +
    cashflowData.repairs_year_expense +
    cashflowData.utility_year_expense
  ).toFixed(2);

  let yearRevenueTotal = 0;
  yearRevenueTotal = (
    cashflowData.rental_year_revenue +
    cashflowData.extra_year_revenue +
    cashflowData.utility_year_revenue +
    cashflowData.management_year_revenue +
    cashflowData.maintenance_year_revenue +
    cashflowData.repairs_year_revenue
  ).toFixed(2);
  const yearCashFlow = (yearRevenueTotal - yearExpenseTotal).toFixed(2);

  let yearExpenseTotalAmortized = 0;
  yearExpenseTotalAmortized = (
    cashflowData.amortized_maintenance_year_expense +
    cashflowData.amortized_management_year_expense +
    cashflowData.amortized_repairs_year_expense +
    cashflowData.amortized_utility_year_expense
  ).toFixed(2);

  let yearRevenueTotalAmortized = 0;
  yearRevenueTotalAmortized = (
    cashflowData.amortized_rental_year_revenue +
    cashflowData.amortized_extra_year_revenue +
    cashflowData.amortized_utility_year_revenue +
    cashflowData.amortized_management_year_revenue +
    cashflowData.amortized_maintenance_year_revenue +
    cashflowData.amortized_repairs_year_revenue
  ).toFixed(2);
  const yearCashFlowAmortized = (
    yearRevenueTotalAmortized - yearExpenseTotalAmortized
  ).toFixed(2);

  let revenueExpectedTotal = 0;
  revenueExpectedTotal = (
    cashflowData.rental_expected_revenue +
    cashflowData.extra_expected_revenue +
    cashflowData.utility_expected_revenue +
    cashflowData.management_expected_revenue +
    cashflowData.maintenance_expected_revenue +
    cashflowData.repairs_expected_revenue
  ).toFixed(2);

  let expenseExpectedTotal = 0;

  expenseExpectedTotal = (
    cashflowData.maintenance_expected_expense +
    cashflowData.management_expected_expense +
    cashflowData.repairs_expected_expense +
    cashflowData.utility_expected_expense
  ).toFixed(2);

  const cashFlowExpected = (
    revenueExpectedTotal - expenseExpectedTotal
  ).toFixed(2);

  let revenueExpectedTotalAmortized = 0;
  revenueExpectedTotalAmortized = (
    cashflowData.amortized_rental_expected_revenue +
    cashflowData.amortized_extra_expected_revenue +
    cashflowData.amortized_utility_expected_revenue +
    cashflowData.amortized_management_expected_revenue +
    cashflowData.amortized_maintenance_expected_revenue +
    cashflowData.amortized_repairs_expected_revenue
  ).toFixed(2);

  let expenseExpectedTotalAmortized = 0;
  expenseExpectedTotalAmortized = (
    cashflowData.amortized_maintenance_expected_expense +
    cashflowData.amortized_management_expected_expense +
    cashflowData.amortized_repairs_expected_expense +
    cashflowData.amortized_utility_expected_expense
  ).toFixed(2);

  const cashFlowExpectedAmortized = (
    revenueExpectedTotalAmortized - expenseExpectedTotalAmortized
  ).toFixed(2);

  let yearRevenueExpectedTotal = 0;
  yearRevenueExpectedTotal = (
    cashflowData.rental_year_expected_revenue +
    cashflowData.extra_year_expected_revenue +
    cashflowData.utility_year_expected_revenue +
    cashflowData.management_year_expected_revenue +
    cashflowData.maintenance_year_expected_revenue +
    cashflowData.repairs_year_expected_revenue
  ).toFixed(2);

  let yearExpenseExpectedTotal = 0;
  yearExpenseExpectedTotal = (
    cashflowData.maintenance_year_expected_expense +
    cashflowData.management_year_expected_expense +
    cashflowData.repairs_year_expected_expense +
    cashflowData.utility_year_expected_expense
  ).toFixed(2);

  const yearCashFlowExpected = (
    yearRevenueExpectedTotal - yearExpenseExpectedTotal
  ).toFixed(2);

  let yearRevenueExpectedTotalAmortized = 0;
  yearRevenueExpectedTotalAmortized = (
    cashflowData.amortized_rental_year_expected_revenue +
    cashflowData.amortized_extra_year_expected_revenue +
    cashflowData.amortized_utility_year_expected_revenue +
    cashflowData.amortized_management_year_expected_revenue +
    cashflowData.amortized_maintenance_year_expected_revenue +
    cashflowData.amortized_repairs_year_expected_revenue
  ).toFixed(2);

  let yearExpenseExpectedTotalAmortized = 0;
  yearExpenseExpectedTotalAmortized = (
    cashflowData.amortized_maintenance_year_expected_expense +
    cashflowData.amortized_management_year_expected_expense +
    cashflowData.amortized_repairs_year_expected_expense +
    cashflowData.amortized_utility_year_expected_expense
  ).toFixed(2);

  const yearCashFlowExpectedAmortized = (
    yearRevenueExpectedTotalAmortized - yearExpenseExpectedTotalAmortized
  ).toFixed(2);

  console.log(managerData);
  console.log(cashflowData);

  return stage === "LIST" ? (
    <div className="w-100 overflow-hidden">
      {!isLoading &&
      (managerData.length > 0 || processingManagerData.length > 0) ? (
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
          <div className="mb-5 overflow-scroll">
            <Header title="Manager Dashboard" />
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
                <Col>
                  <img
                    src={AddIcon}
                    onClick={() => setStage("ADDEXPENSE")}
                    style={{
                      width: "30px",
                      height: "30px",
                      float: "right",
                      marginRight: "3rem",
                    }}
                  />
                  {/* <h3 style={{ float: "right", marginRight: "3rem" }}>+</h3> */}
                </Col>
              </Row>
              <Row className="m-3" style={{ overflow: "scroll" }}>
                <div>
                  <Table
                    responsive="md"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
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
                          {new Date().toLocaleString("default", {
                            month: "long",
                          })}{" "}
                          &nbsp;
                          <img
                            src={SortLeft}
                            hidden={monthlyCashFlow}
                            onClick={() => {
                              setMonthlyCashFlow(!monthlyCashFlow);
                              setMonthlyRevenue(false);
                              setMonthlyExpense(false);
                              setMonthlyRent(false);
                              setMonthlyExtra(false);
                              setMonthlyUtility(false);
                              setMonthlyManagement(false);
                              setMonthlyOwnerPayment(false);
                              setMonthlyMaintenance(false);
                              setMonthlyRepairs(false);
                              setMonthlyUtilityExpense(false);
                              setMonthlyMaintenanceRevenue(false);
                              setMonthlyRepairsRevenue(false);
                            }}
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            hidden={!monthlyCashFlow}
                            onClick={() => {
                              setMonthlyCashFlow(!monthlyCashFlow);
                              setMonthlyRevenue(false);
                              setMonthlyExpense(false);
                              setMonthlyRent(false);
                              setMonthlyExtra(false);
                              setMonthlyUtility(false);
                              setMonthlyManagement(false);
                              setMonthlyOwnerPayment(false);
                              setMonthlyMaintenance(false);
                              setMonthlyRepairs(false);
                              setMonthlyUtilityExpense(false);
                              setMonthlyMaintenanceRevenue(false);
                              setMonthlyRepairsRevenue(false);
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
                          {(
                            cashFlowAmortized - cashFlowExpectedAmortized
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow hidden={!monthlyCashFlow}>
                        <TableCell width="180px">
                          &nbsp; Revenue{" "}
                          <img
                            src={SortLeft}
                            hidden={monthlyRevenue}
                            onClick={() => {
                              setMonthlyRevenue(!monthlyRevenue);
                              setMonthlyRent(false);
                              setMonthlyExtra(false);
                              setMonthlyUtility(false);
                              setMonthlyManagement(false);
                              setMonthlyMaintenanceRevenue(false);
                              setMonthlyRepairsRevenue(false);
                            }}
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            hidden={!monthlyRevenue}
                            onClick={() => {
                              setMonthlyRevenue(!monthlyRevenue);
                              setMonthlyRent(false);
                              setMonthlyExtra(false);
                              setMonthlyUtility(false);
                              setMonthlyManagement(false);
                              setMonthlyMaintenanceRevenue(false);
                              setMonthlyRepairsRevenue(false);
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
                            revenueTotalAmortized -
                            revenueExpectedTotalAmortized
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow hidden={!monthlyRevenue}>
                        <TableCell width="180px">
                          &nbsp;&nbsp; Rent{" "}
                          <img
                            src={SortLeft}
                            hidden={monthlyRent}
                            onClick={() => setMonthlyRent(!monthlyRent)}
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
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
                        cashflowData.manager_revenue.map((revenue, index) => {
                          console.log("revenue", revenue);

                          return revenue.purchase_type === "RENT" ? (
                            <TableRow hidden={!monthlyRent}>
                              {console.log("in rent", revenue)}
                              <TableCell>
                                &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                {revenue.unit}
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
                                <TableCell
                                  width="180px"
                                  align="right"
                                  style={red}
                                >
                                  ${revenue.amount_due.toFixed(2)}
                                </TableCell>
                              ) : (
                                <TableCell width="180px" align="right">
                                  ${revenue.amount_due.toFixed(2)}
                                </TableCell>
                              )}
                              <TableCell width="180px" align="right">
                                $
                                {(
                                  revenue.amount_paid - revenue.amount_due
                                ).toFixed(2)}
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
                            src={SortLeft}
                            hidden={monthlyExtra}
                            onClick={() => setMonthlyExtra(!monthlyExtra)}
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
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
                          {cashflowData.amortized_extra_expected_revenue.toFixed(
                            2
                          )}
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
                        cashflowData.manager_revenue.map((revenue, index) => {
                          return revenue.purchase_type === "EXTRA CHARGES" ? (
                            <TableRow hidden={!monthlyExtra}>
                              <TableCell>
                                &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                {revenue.unit} <br />
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
                                <TableCell
                                  width="180px"
                                  align="right"
                                  style={red}
                                >
                                  ${revenue.amount_due.toFixed(2)}
                                </TableCell>
                              ) : (
                                <TableCell width="180px" align="right">
                                  ${revenue.amount_due.toFixed(2)}
                                </TableCell>
                              )}
                              <TableCell width="180px" align="right">
                                $
                                {(
                                  revenue.amount_paid - revenue.amount_due
                                ).toFixed(2)}
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
                            src={SortLeft}
                            hidden={monthlyUtility}
                            onClick={() => setMonthlyUtility(!monthlyUtility)}
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
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
                        cashflowData.manager_revenue.map((revenue, index) => {
                          return revenue.purchase_type === "UTILITY" ? (
                            <TableRow hidden={!monthlyUtility}>
                              <TableCell>
                                &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                {revenue.unit}
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
                                <TableCell
                                  width="180px"
                                  align="right"
                                  style={red}
                                >
                                  ${revenue.amount_due.toFixed(2)}
                                </TableCell>
                              ) : (
                                <TableCell width="180px" align="right">
                                  ${revenue.amount_due.toFixed(2)}
                                </TableCell>
                              )}
                              <TableCell width="180px" align="right">
                                $
                                {(
                                  revenue.amount_paid - revenue.amount_due
                                ).toFixed(2)}
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
                          &nbsp; &nbsp;Management
                          <img
                            src={SortLeft}
                            hidden={monthlyManagement}
                            onClick={() =>
                              setMonthlyManagement(!monthlyManagement)
                            }
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            hidden={!monthlyManagement}
                            onClick={() =>
                              setMonthlyManagement(!monthlyManagement)
                            }
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />{" "}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          ${cashflowData.management_revenue.toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          ${cashflowData.management_expected_revenue.toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.management_revenue -
                            cashflowData.management_expected_revenue
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_management_revenue.toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_management_expected_revenue.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.amortized_management_revenue -
                            cashflowData.amortized_management_expected_revenue
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {isLoading === false &&
                        cashflowData.manager_revenue.map((revenue, index) => {
                          return revenue.purchase_type === "MANAGEMENT" ? (
                            <TableRow hidden={!monthlyManagement}>
                              <TableCell>
                                &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                {revenue.unit}
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
                                <TableCell
                                  width="180px"
                                  align="right"
                                  style={red}
                                >
                                  ${revenue.amount_due.toFixed(2)}
                                </TableCell>
                              ) : (
                                <TableCell width="180px" align="right">
                                  ${revenue.amount_due.toFixed(2)}
                                </TableCell>
                              )}
                              <TableCell width="180px" align="right">
                                $
                                {(
                                  revenue.amount_paid - revenue.amount_due
                                ).toFixed(2)}
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
                          &nbsp; &nbsp;Maintenance
                          <img
                            src={SortLeft}
                            hidden={monthlyMaintenanceRevenue}
                            onClick={() =>
                              setMonthlyMaintenanceRevenue(
                                !monthlyMaintenanceRevenue
                              )
                            }
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            hidden={!monthlyMaintenanceRevenue}
                            onClick={() =>
                              setMonthlyMaintenanceRevenue(
                                !monthlyMaintenanceRevenue
                              )
                            }
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />{" "}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          ${cashflowData.maintenance_revenue.toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.maintenance_expected_revenue.toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.maintenance_revenue -
                            cashflowData.maintenance_expected_revenue
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_maintenance_revenue.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_maintenance_expected_revenue.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.amortized_maintenance_revenue -
                            cashflowData.amortized_maintenance_expected_revenue
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {isLoading === false &&
                        cashflowData.manager_revenue.map((revenue, index) => {
                          return revenue.purchase_type === "MAINTENANCE" ? (
                            <TableRow hidden={!monthlyMaintenanceRevenue}>
                              <TableCell>
                                &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                {revenue.unit}
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
                                <TableCell
                                  width="180px"
                                  align="right"
                                  style={red}
                                >
                                  ${revenue.amount_due.toFixed(2)}
                                </TableCell>
                              ) : (
                                <TableCell width="180px" align="right">
                                  ${revenue.amount_due.toFixed(2)}
                                </TableCell>
                              )}
                              <TableCell width="180px" align="right">
                                $
                                {(
                                  revenue.amount_paid - revenue.amount_due
                                ).toFixed(2)}
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
                          &nbsp; &nbsp;Repairs
                          <img
                            src={SortLeft}
                            hidden={monthlyRepairsRevenue}
                            onClick={() =>
                              setMonthlyRepairsRevenue(!monthlyRepairsRevenue)
                            }
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            hidden={!monthlyRepairsRevenue}
                            onClick={() =>
                              setMonthlyRepairsRevenue(!monthlyRepairsRevenue)
                            }
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />{" "}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          ${cashflowData.repairs_revenue.toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          ${cashflowData.repairs_expected_revenue.toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.repairs_revenue -
                            cashflowData.repairs_expected_revenue
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          ${cashflowData.amortized_repairs_revenue.toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_repairs_expected_revenue.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.amortized_repairs_revenue -
                            cashflowData.amortized_repairs_expected_revenue
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {isLoading === false &&
                        cashflowData.manager_revenue.map((revenue, index) => {
                          return revenue.purchase_type === "REPAIRS" ? (
                            <TableRow hidden={!monthlyRepairsRevenue}>
                              <TableCell>
                                &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                {revenue.unit}
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
                                <TableCell
                                  width="180px"
                                  align="right"
                                  style={red}
                                >
                                  ${revenue.amount_due.toFixed(2)}
                                </TableCell>
                              ) : (
                                <TableCell width="180px" align="right">
                                  ${revenue.amount_due.toFixed(2)}
                                </TableCell>
                              )}
                              <TableCell width="180px" align="right">
                                $
                                {(
                                  revenue.amount_paid - revenue.amount_due
                                ).toFixed(2)}
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
                            src={SortLeft}
                            hidden={monthlyExpense}
                            onClick={() => {
                              setMonthlyExpense(!monthlyExpense);
                              setMonthlyOwnerPayment(false);
                              setMonthlyMaintenance(false);
                              setMonthlyRepairs(false);
                              setMonthlyUtilityExpense(false);
                            }}
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            hidden={!monthlyExpense}
                            onClick={() => {
                              setMonthlyExpense(!monthlyExpense);
                              setMonthlyOwnerPayment(false);
                              setMonthlyMaintenance(false);
                              setMonthlyRepairs(false);
                              setMonthlyUtilityExpense(false);
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
                            expenseTotalAmortized -
                            expenseExpectedTotalAmortized
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow hidden={!monthlyExpense}>
                        <TableCell width="180px">
                          &nbsp;&nbsp; Owner Payment
                          <img
                            src={SortLeft}
                            hidden={monthlyOwnerPayment}
                            onClick={() =>
                              setMonthlyOwnerPayment(!monthlyOwnerPayment)
                            }
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            hidden={!monthlyOwnerPayment}
                            onClick={() =>
                              setMonthlyOwnerPayment(!monthlyOwnerPayment)
                            }
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
                          $
                          {cashflowData.amortized_management_expense.toFixed(2)}
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
                        cashflowData.manager_expense.map((expense, index) => {
                          return expense.purchase_type === "OWNER PAYMENT" ? (
                            <TableRow hidden={!monthlyOwnerPayment}>
                              <TableCell>
                                &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                {expense.unit}
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
                                <TableCell
                                  width="180px"
                                  align="right"
                                  style={red}
                                >
                                  ${expense.amount_due.toFixed(2)}
                                </TableCell>
                              ) : (
                                <TableCell width="180px" align="right">
                                  ${expense.amount_due.toFixed(2)}
                                </TableCell>
                              )}
                              <TableCell width="180px" align="right">
                                $
                                {(
                                  expense.amount_paid - expense.amount_due
                                ).toFixed(2)}
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
                            src={SortLeft}
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
                            src={SortDown}
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
                          $
                          {cashflowData.maintenance_expected_expense.toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.maintenance_expense -
                            cashflowData.maintenance_expected_expense
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_maintenance_expense.toFixed(
                            2
                          )}
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
                        cashflowData.manager_expense.map((expense, index) => {
                          return expense.purchase_type === "MAINTENANCE" ? (
                            <TableRow hidden={!monthlyMaintenance}>
                              <TableCell>
                                &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                {expense.unit}
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
                                <TableCell
                                  width="180px"
                                  align="right"
                                  style={red}
                                >
                                  ${expense.amount_due.toFixed(2)}
                                </TableCell>
                              ) : (
                                <TableCell width="180px" align="right">
                                  ${expense.amount_due.toFixed(2)}
                                </TableCell>
                              )}
                              <TableCell width="180px" align="right">
                                $
                                {(
                                  expense.amount_paid - expense.amount_due
                                ).toFixed(2)}
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
                            src={SortLeft}
                            hidden={monthlyRepairs}
                            onClick={() => setMonthlyRepairs(!monthlyRepairs)}
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
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
                        cashflowData.manager_expense.map((expense, index) => {
                          return expense.purchase_type === "REPAIRS" ? (
                            <TableRow hidden={!monthlyRepairs}>
                              <TableCell>
                                &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                {expense.unit}
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
                                <TableCell
                                  width="180px"
                                  align="right"
                                  style={red}
                                >
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
                            src={SortLeft}
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
                            src={SortDown}
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
                        cashflowData.manager_expense.map((expense, index) => {
                          return expense.purchase_type === "UTILITY" ? (
                            <TableRow hidden={!monthlyUtilityExpense}>
                              <TableCell>
                                &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                {expense.unit}
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
                                <TableCell
                                  width="180px"
                                  align="right"
                                  style={red}
                                >
                                  ${expense.amount_due.toFixed(2)}
                                </TableCell>
                              ) : (
                                <TableCell width="180px" align="right">
                                  ${expense.amount_due.toFixed(2)}
                                </TableCell>
                              )}
                              <TableCell width="180px" align="right">
                                $
                                {(
                                  expense.amount_paid - expense.amount_due
                                ).toFixed(2)}
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

                      <TableRow>
                        <TableCell width="180px">
                          {new Date().getFullYear()} &nbsp;
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
                              setYearlyMaintenanceRevenue(false);
                              setYearlyRepairsRevenue(false);
                              setYearlyMaintenance(false);
                              setYearlyRepairs(false);
                              setYearlyUtilityExpense(false);
                            }}
                            hidden={yearlyCashFlow}
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
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
                              setYearlyMaintenanceRevenue(false);
                              setYearlyRepairsRevenue(false);
                              setYearlyMaintenance(false);
                              setYearlyRepairs(false);
                              setYearlyUtilityExpense(false);
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
                            yearCashFlowAmortized -
                            yearCashFlowExpectedAmortized
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow hidden={!yearlyCashFlow}>
                        <TableCell width="180px">
                          &nbsp; Revenue{" "}
                          <img
                            src={SortLeft}
                            hidden={yearlyRevenue}
                            onClick={() => {
                              setYearlyRevenue(!yearlyRevenue);
                              setYearlyRent(false);
                              setYearlyExtra(false);
                              setYearlyUtility(false);
                              setYearlyManagement(false);
                              setYearlyMaintenanceRevenue(false);
                              setYearlyRepairsRevenue(false);
                            }}
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            hidden={!yearlyRevenue}
                            onClick={() => {
                              setYearlyRevenue(!yearlyRevenue);
                              setYearlyRent(false);
                              setYearlyExtra(false);
                              setYearlyUtility(false);
                              setYearlyManagement(false);
                              setYearlyMaintenanceRevenue(false);
                              setYearlyRepairsRevenue(false);
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
                          {(
                            yearRevenueTotal - yearRevenueExpectedTotal
                          ).toFixed(2)}
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
                            src={SortLeft}
                            hidden={yearlyRent}
                            onClick={() => setYearlyRent(!yearlyRent)}
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
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
                          $
                          {cashflowData.rental_year_expected_revenue.toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.rental_year_revenue -
                            cashflowData.rental_year_expected_revenue
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_rental_year_revenue.toFixed(
                            2
                          )}
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
                        cashflowData.manager_revenue_yearly.map(
                          (revenue, index) => {
                            return revenue.purchase_type === "RENT" ? (
                              <TableRow hidden={!yearlyRent}>
                                <TableCell>
                                  &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                  {revenue.unit}
                                  <br />
                                  &nbsp;&nbsp;&nbsp; {revenue.description}{" "}
                                  <br />
                                  &nbsp;&nbsp;&nbsp;{" "}
                                  {revenue.purchase_frequency}
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
                                  <TableCell
                                    width="180px"
                                    align="right"
                                    style={red}
                                  >
                                    ${revenue.amount_due.toFixed(2)}
                                  </TableCell>
                                ) : (
                                  <TableCell width="180px" align="right">
                                    ${revenue.amount_due.toFixed(2)}
                                  </TableCell>
                                )}
                                <TableCell width="180px" align="right">
                                  $
                                  {(
                                    revenue.amount_paid - revenue.amount_due
                                  ).toFixed(2)}
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
                                      (revenue.amount_paid -
                                        revenue.amount_due) /
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
                          }
                        )}
                      <TableRow hidden={!yearlyRevenue}>
                        <TableCell width="180px">
                          &nbsp;&nbsp; Extra Charges
                          <img
                            src={SortLeft}
                            hidden={yearlyExtra}
                            onClick={() => setYearlyExtra(!yearlyExtra)}
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
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
                          $
                          {cashflowData.amortized_extra_year_revenue.toFixed(2)}
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
                        cashflowData.manager_revenue_yearly.map(
                          (revenue, index) => {
                            return revenue.purchase_type === "EXTRA CHARGES" ? (
                              <TableRow hidden={!yearlyExtra}>
                                <TableCell>
                                  &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                  {revenue.unit}
                                  <br />
                                  &nbsp;&nbsp;&nbsp; {revenue.description}{" "}
                                  <br />
                                  &nbsp;&nbsp;&nbsp;{" "}
                                  {revenue.purchase_frequency}
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
                                  <TableCell
                                    width="180px"
                                    align="right"
                                    style={red}
                                  >
                                    ${revenue.amount_due.toFixed(2)}
                                  </TableCell>
                                ) : (
                                  <TableCell width="180px" align="right">
                                    ${revenue.amount_due.toFixed(2)}
                                  </TableCell>
                                )}
                                <TableCell width="180px" align="right">
                                  $
                                  {(
                                    revenue.amount_paid - revenue.amount_due
                                  ).toFixed(2)}
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
                                      (revenue.amount_paid -
                                        revenue.amount_due) /
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
                          }
                        )}

                      <TableRow hidden={!yearlyRevenue}>
                        <TableCell width="180px">
                          &nbsp; &nbsp;Management{" "}
                          <img
                            src={SortLeft}
                            hidden={yearlyManagement}
                            onClick={() =>
                              setYearlyManagement(!yearlyManagement)
                            }
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            hidden={!yearlyManagement}
                            onClick={() =>
                              setYearlyManagement(!yearlyManagement)
                            }
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />{" "}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          ${cashflowData.management_year_revenue.toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.management_year_expected_revenue.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.management_year_revenue -
                            cashflowData.management_year_expected_revenue
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_management_year_revenue.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_management_year_expected_revenue.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.amortized_management_year_revenue -
                            cashflowData.amortized_management_year_expected_revenue
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {isLoading === false &&
                        cashflowData.manager_revenue_yearly.map(
                          (revenue, index) => {
                            return revenue.purchase_type === "MANAGEMENT" ? (
                              <TableRow hidden={!yearlyManagement}>
                                <TableCell>
                                  &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                  {revenue.unit}
                                  <br />
                                  &nbsp;&nbsp;&nbsp; {revenue.description}{" "}
                                  <br />
                                  &nbsp;&nbsp;&nbsp;{" "}
                                  {revenue.purchase_frequency}
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
                                  <TableCell
                                    width="180px"
                                    align="right"
                                    style={red}
                                  >
                                    ${revenue.amount_due.toFixed(2)}
                                  </TableCell>
                                ) : (
                                  <TableCell width="180px" align="right">
                                    ${revenue.amount_due.toFixed(2)}
                                  </TableCell>
                                )}
                                <TableCell width="180px" align="right">
                                  $
                                  {(
                                    revenue.amount_paid - revenue.amount_due
                                  ).toFixed(2)}
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
                                      (revenue.amount_paid -
                                        revenue.amount_due) /
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
                          }
                        )}
                      <TableRow hidden={!yearlyRevenue}>
                        <TableCell width="180px">
                          &nbsp; &nbsp;Utility{" "}
                          <img
                            src={SortLeft}
                            hidden={yearlyUtility}
                            onClick={() => setYearlyUtility(!yearlyUtility)}
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
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
                          $
                          {cashflowData.utility_year_expected_revenue.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.utility_year_revenue -
                            cashflowData.utility_year_expected_revenue
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_utility_year_revenue.toFixed(
                            2
                          )}
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
                        cashflowData.manager_revenue_yearly.map(
                          (revenue, index) => {
                            return revenue.purchase_type === "UTILITY" ? (
                              <TableRow hidden={!yearlyUtility}>
                                <TableCell>
                                  &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                  {revenue.unit}
                                  <br />
                                  &nbsp;&nbsp;&nbsp; {revenue.description}{" "}
                                  <br />
                                  &nbsp;&nbsp;&nbsp;{" "}
                                  {revenue.purchase_frequency}
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
                                  <TableCell
                                    width="180px"
                                    align="right"
                                    style={red}
                                  >
                                    ${revenue.amount_due.toFixed(2)}
                                  </TableCell>
                                ) : (
                                  <TableCell width="180px" align="right">
                                    ${revenue.amount_due.toFixed(2)}
                                  </TableCell>
                                )}
                                <TableCell width="180px" align="right">
                                  $
                                  {(
                                    revenue.amount_paid - revenue.amount_due
                                  ).toFixed(2)}
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
                                      (revenue.amount_paid -
                                        revenue.amount_due) /
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
                          }
                        )}
                      <TableRow hidden={!yearlyRevenue}>
                        <TableCell width="180px">
                          &nbsp; &nbsp;Maintenance{" "}
                          <img
                            src={SortLeft}
                            hidden={yearlyMaintenanceRevenue}
                            onClick={() =>
                              setYearlyMaintenanceRevenue(
                                !yearlyMaintenanceRevenue
                              )
                            }
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            hidden={!yearlyMaintenanceRevenue}
                            onClick={() =>
                              setYearlyMaintenanceRevenue(
                                !yearlyMaintenanceRevenue
                              )
                            }
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />{" "}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          ${cashflowData.management_year_revenue.toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.management_year_expected_revenue.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.management_year_revenue -
                            cashflowData.management_year_expected_revenue
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_management_year_revenue.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_management_year_expected_revenue.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.amortized_management_year_revenue -
                            cashflowData.amortized_management_year_expected_revenue
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {isLoading === false &&
                        cashflowData.manager_revenue_yearly.map(
                          (revenue, index) => {
                            return revenue.purchase_type === "MAINTENANCE" ? (
                              <TableRow hidden={!yearlyMaintenanceRevenue}>
                                <TableCell>
                                  &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                  {revenue.unit}
                                  <br />
                                  &nbsp;&nbsp;&nbsp; {revenue.description}{" "}
                                  <br />
                                  &nbsp;&nbsp;&nbsp;{" "}
                                  {revenue.purchase_frequency}
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
                                  <TableCell
                                    width="180px"
                                    align="right"
                                    style={red}
                                  >
                                    ${revenue.amount_due.toFixed(2)}
                                  </TableCell>
                                ) : (
                                  <TableCell width="180px" align="right">
                                    ${revenue.amount_due.toFixed(2)}
                                  </TableCell>
                                )}
                                <TableCell width="180px" align="right">
                                  $
                                  {(
                                    revenue.amount_paid - revenue.amount_due
                                  ).toFixed(2)}
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
                                      (revenue.amount_paid -
                                        revenue.amount_due) /
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
                          }
                        )}
                      <TableRow hidden={!yearlyRevenue}>
                        <TableCell width="180px">
                          &nbsp; &nbsp;Repairs{" "}
                          <img
                            src={SortLeft}
                            hidden={yearlyRepairsRevenue}
                            onClick={() =>
                              setYearlyRepairsRevenue(!yearlyRepairsRevenue)
                            }
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            hidden={!yearlyRepairsRevenue}
                            onClick={() =>
                              setYearlyRepairsRevenue(!yearlyRepairsRevenue)
                            }
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />{" "}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          ${cashflowData.repairs_year_revenue.toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.repairs_year_expected_revenue.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.repairs_year_revenue -
                            cashflowData.repairs_year_expected_revenue
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_repairs_year_revenue.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_repairs_year_expected_revenue.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.amortized_repairs_year_revenue -
                            cashflowData.amortized_repairs_year_expected_revenue
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {isLoading === false &&
                        cashflowData.manager_revenue_yearly.map(
                          (revenue, index) => {
                            return revenue.purchase_type === "REPAIRS" ? (
                              <TableRow hidden={!yearlyRepairsRevenue}>
                                <TableCell>
                                  &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                  {revenue.unit}
                                  <br />
                                  &nbsp;&nbsp;&nbsp; {revenue.description}{" "}
                                  <br />
                                  &nbsp;&nbsp;&nbsp;{" "}
                                  {revenue.purchase_frequency}
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
                                  <TableCell
                                    width="180px"
                                    align="right"
                                    style={red}
                                  >
                                    ${revenue.amount_due.toFixed(2)}
                                  </TableCell>
                                ) : (
                                  <TableCell width="180px" align="right">
                                    ${revenue.amount_due.toFixed(2)}
                                  </TableCell>
                                )}
                                <TableCell width="180px" align="right">
                                  $
                                  {(
                                    revenue.amount_paid - revenue.amount_due
                                  ).toFixed(2)}
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
                                      (revenue.amount_paid -
                                        revenue.amount_due) /
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
                          }
                        )}
                      <TableRow hidden={!yearlyCashFlow}>
                        <TableCell width="180px">
                          &nbsp; Expenses{" "}
                          <img
                            src={SortLeft}
                            hidden={yearlyExpense}
                            onClick={() => {
                              setYearlyExpense(!yearlyExpense);
                              setYearlyOwnerPayment(false);
                              setYearlyMaintenance(false);
                              setYearlyRepairs(false);
                              setYearlyUtilityExpense(false);
                            }}
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            hidden={!yearlyExpense}
                            onClick={() => {
                              setYearlyExpense(!yearlyExpense);
                              setYearlyOwnerPayment(false);
                              setYearlyMaintenance(false);
                              setYearlyRepairs(false);
                              setYearlyUtilityExpense(false);
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
                          {(
                            yearExpenseTotal - yearExpenseExpectedTotal
                          ).toFixed(2)}
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
                            src={SortLeft}
                            hidden={yearlyOwnerPayment}
                            onClick={() =>
                              setYearlyOwnerPayment(!yearlyOwnerPayment)
                            }
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            hidden={!yearlyOwnerPayment}
                            onClick={() =>
                              setYearlyOwnerPayment(!yearlyOwnerPayment)
                            }
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
                          {cashflowData.management_year_expected_expense.toFixed(
                            2
                          )}
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
                        cashflowData.manager_expense_yearly.map(
                          (expense, index) => {
                            return expense.purchase_type === "OWNER PAYMENT" ? (
                              <TableRow hidden={!yearlyOwnerPayment}>
                                <TableCell>
                                  &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                  {expense.unit}
                                  <br />
                                  &nbsp;&nbsp;&nbsp; {expense.description}{" "}
                                  <br />
                                  &nbsp;&nbsp;&nbsp;{" "}
                                  {expense.purchase_frequency}
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
                                  <TableCell
                                    width="180px"
                                    align="right"
                                    style={red}
                                  >
                                    ${expense.amount_due.toFixed(2)}
                                  </TableCell>
                                ) : (
                                  <TableCell width="180px" align="right">
                                    ${expense.amount_due.toFixed(2)}
                                  </TableCell>
                                )}
                                <TableCell width="180px" align="right">
                                  $
                                  {(
                                    expense.amount_paid - expense.amount_due
                                  ).toFixed(2)}
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
                                      (expense.amount_paid -
                                        expense.amount_due) /
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
                          }
                        )}
                      <TableRow hidden={!yearlyExpense}>
                        <TableCell width="180px">
                          &nbsp;&nbsp; Maintenance{" "}
                          <img
                            src={SortLeft}
                            hidden={yearlyMaintenance}
                            onClick={() =>
                              setYearlyMaintenance(!yearlyMaintenance)
                            }
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
                            hidden={!yearlyMaintenance}
                            onClick={() =>
                              setYearlyMaintenance(!yearlyMaintenance)
                            }
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
                        cashflowData.manager_expense_yearly.map(
                          (expense, index) => {
                            return expense.purchase_type === "MAINTENANCE" ? (
                              <TableRow hidden={!yearlyMaintenance}>
                                <TableCell>
                                  &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                  {expense.unit}
                                  <br />
                                  &nbsp;&nbsp;&nbsp; {expense.description}{" "}
                                  <br />
                                  &nbsp;&nbsp;&nbsp;{" "}
                                  {expense.purchase_frequency}
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
                                  <TableCell
                                    width="180px"
                                    align="right"
                                    style={red}
                                  >
                                    ${expense.amount_due.toFixed(2)}
                                  </TableCell>
                                ) : (
                                  <TableCell width="180px" align="right">
                                    ${expense.amount_due.toFixed(2)}
                                  </TableCell>
                                )}
                                <TableCell width="180px" align="right">
                                  $
                                  {(
                                    expense.amount_paid - expense.amount_due
                                  ).toFixed(2)}
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
                                      (expense.amount_paid -
                                        expense.amount_due) /
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
                          }
                        )}
                      <TableRow hidden={!yearlyExpense}>
                        <TableCell width="180px">
                          &nbsp; &nbsp;Repairs{" "}
                          <img
                            src={SortLeft}
                            hidden={yearlyRepairs}
                            onClick={() => setYearlyRepairs(!yearlyRepairs)}
                            style={{
                              width: "10px",
                              height: "10px",
                              float: "right",
                            }}
                          />
                          <img
                            src={SortDown}
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
                          $
                          {cashflowData.repairs_year_expected_expense.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.repairs_year_expense -
                            cashflowData.repairs_year_expected_expense
                          ).toFixed(2)}
                        </TableCell>

                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_repairs_year_expense.toFixed(
                            2
                          )}
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
                        cashflowData.manager_expense_yearly.map(
                          (expense, index) => {
                            return expense.purchase_type === "REPAIRS" ? (
                              <TableRow hidden={!yearlyRepairs}>
                                <TableCell>
                                  &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                  {expense.unit}
                                  <br />
                                  &nbsp;&nbsp;&nbsp; {expense.description}{" "}
                                  <br />
                                  &nbsp;&nbsp;&nbsp;{" "}
                                  {expense.purchase_frequency}
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
                                  <TableCell
                                    width="180px"
                                    align="right"
                                    style={red}
                                  >
                                    ${expense.amount_due.toFixed(2)}
                                  </TableCell>
                                ) : (
                                  <TableCell width="180px" align="right">
                                    ${expense.amount_due.toFixed(2)}
                                  </TableCell>
                                )}
                                <TableCell width="180px" align="right">
                                  $
                                  {(
                                    expense.amount_paid - expense.amount_due
                                  ).toFixed(2)}
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
                                      (expense.amount_paid -
                                        expense.amount_due) /
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
                          }
                        )}
                      <TableRow hidden={!yearlyExpense}>
                        <TableCell width="180px">
                          &nbsp; &nbsp;Utility{" "}
                          <img
                            src={SortLeft}
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
                            src={SortDown}
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
                          $
                          {cashflowData.utility_year_expected_expense.toFixed(
                            2
                          )}
                        </TableCell>
                        <TableCell width="180px" align="right">
                          $
                          {(
                            cashflowData.utility_year_expense -
                            cashflowData.utility_year_expected_expense
                          ).toFixed(2)}
                        </TableCell>

                        <TableCell width="180px" align="right">
                          $
                          {cashflowData.amortized_utility_year_expense.toFixed(
                            2
                          )}
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
                        cashflowData.manager_expense_yearly.map(
                          (expense, index) => {
                            return expense.purchase_type === "UTILITY" ? (
                              <TableRow hidden={!yearlyUtilityExpense}>
                                <TableCell>
                                  &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                  {expense.unit}
                                  <br />
                                  &nbsp;&nbsp;&nbsp; {expense.description}{" "}
                                  <br />
                                  &nbsp;&nbsp;&nbsp;{" "}
                                  {expense.purchase_frequency}
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
                                  <TableCell
                                    width="180px"
                                    align="right"
                                    style={red}
                                  >
                                    ${expense.amount_due.toFixed(2)}
                                  </TableCell>
                                ) : (
                                  <TableCell width="180px" align="right">
                                    ${expense.amount_due.toFixed(2)}
                                  </TableCell>
                                )}
                                <TableCell width="180px" align="right">
                                  $
                                  {(
                                    expense.amount_paid - expense.amount_due
                                  ).toFixed(2)}
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
                                      (expense.amount_paid -
                                        expense.amount_due) /
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
                          }
                        )}
                    </TableBody>
                  </Table>
                </div>
              </Row>{" "}
            </div>
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
                  <h3>Properties</h3>
                </Col>
                <Col>
                  {/* <img
                  src={AddIcon}
                  onClick={() => setStage("NEW")}
                  style={{
                    width: "30px",
                    height: "30px",
                    float: "right",
                    marginRight: "3rem",
                  }}
                /> */}
                </Col>
              </Row>

              {managerData.length > 0 ? (
                <div>
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
                  <Row className="m-3" style={{ overflow: "scroll" }}>
                    <Table
                      responsive="xl"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <EnhancedTableHeadProperties
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={managerData.length}
                      />{" "}
                      <TableBody>
                        {stableSort(managerData, getComparator(order, orderBy))
                          // for filtering
                          .filter((val) => {
                            const query = search.toLowerCase();

                            return (
                              val.address.toLowerCase().indexOf(query) >= 0 ||
                              String(val.unit).toLowerCase().indexOf(query) >=
                                0 ||
                              val.city.toLowerCase().indexOf(query) >= 0 ||
                              val.zip.toLowerCase().indexOf(query) >= 0 ||
                              String(val.oldestOpenMR)
                                .toLowerCase()
                                .indexOf(query) >= 0 ||
                              String(val.late_date)
                                .toLowerCase()
                                .indexOf(query) >= 0
                            );
                          })
                          .map((property, index) => {
                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={property.property_uid}
                              >
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {JSON.parse(property.images).length > 0 ? (
                                    <img
                                      src={`${
                                        JSON.parse(property.images)[0]
                                      }?${Date.now()}`}
                                      alt="Property"
                                      style={{
                                        borderRadius: "4px",
                                        objectFit: "cover",
                                        width: "100px",
                                        height: "100px",
                                      }}
                                    />
                                  ) : (
                                    <img
                                      src={PropertyIcon}
                                      alt="Property"
                                      style={{
                                        borderRadius: "4px",
                                        objectFit: "cover",
                                        width: "100px",
                                        height: "100px",
                                      }}
                                    />
                                  )}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.address}
                                  {property.unit !== ""
                                    ? " " + property.unit
                                    : ""}{" "}
                                  {property.city}, {property.state}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.zip}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(`/owner-list`);
                                  }}
                                >
                                  {property.owner_first_name}{" "}
                                  {property.owner_last_name}
                                  <div className="d-flex align-items-center flex-column">
                                    {property.management_status ===
                                    "FORWARDED" ? (
                                      <div
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        Property Manager Requested
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {property.management_status === "SENT" ? (
                                      <div
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        Contract in Review
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {property.management_status ===
                                    "PM END EARLY" ? (
                                      <div
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        PM requested end early
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    {property.management_status ===
                                    "OWNER END EARLY" ? (
                                      <div
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        Owner requested end early
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.num_apps}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  style={{
                                    color:
                                      property.available_to_rent == 0 &&
                                      property.rentalInfo == "Not Rented"
                                        ? "red"
                                        : property.rentalInfo == "Not Rented"
                                        ? "green"
                                        : "black",
                                  }}
                                  align="center"
                                >
                                  {property.rentalInfo !== "Not Rented" ? (
                                    property.rentalInfo.map((tf, i) => {
                                      return (
                                        <div
                                          onClick={() => {
                                            fetchTenantDetails(tf.tenant_id);
                                          }}
                                        >
                                          {i + 1} {tf.tenant_first_name}{" "}
                                          {tf.tenant_last_name}
                                        </div>
                                      );
                                    })
                                  ) : property.available_to_rent == 0 &&
                                    property.rentalInfo === "Not Rented" ? (
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      Not Listed
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      {property.rentalInfo}
                                    </div>
                                  )}
                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property.new_tenant_applications
                                          .length > 0
                                          ? `${property.new_tenant_applications.length} new tenant application(s) to review`
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property.forwarded_applications
                                          .length > 0
                                          ? `${property.forwarded_applications.length} application(s) in progress`
                                          : ""}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property.end_early_applications
                                          .length > 0
                                          ? "Tenant(s) requested to end the lease early"
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.rentalInfo.length !== 0
                                    ? property.rentalInfo[0].lease_end
                                    : "None"}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                  style={{
                                    color:
                                      property.available_to_rent == 0 &&
                                      property.rent_status == "No Rent Info"
                                        ? "red"
                                        : property.rent_status == "PAID"
                                        ? "black"
                                        : property.rent_status == "UNPAID"
                                        ? "red"
                                        : "green",
                                  }}
                                >
                                  {property.available_to_rent == 0 &&
                                  property.rent_status === "No Rent Info" ? (
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      Not Listed
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      {property.rent_status}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.late_date != "Not Applicable" ? (
                                    <div>{property.late_date} days</div>
                                  ) : (
                                    <div>{property.late_date}</div>
                                  )}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.new_mr}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.process_mr}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.quote_received_mr}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.quote_accepted_mr}
                                </TableCell>
                                {/* <TableCell padding="none" size="small" align="center">
                            {property.oldestOpenMR != "Not Applicable" ? (
                              <div>{property.oldestOpenMR} days</div>
                            ) : (
                              <div>{property.oldestOpenMR}</div>
                            )}
                          </TableCell> */}
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {"$" + property.listed_rent}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.property_type}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.num_beds + "/" + property.num_baths}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </Row>
                </div>
              ) : (
                <Row className="m-3">No active properties</Row>
              )}
            </div>
            <div>
              {processingManagerData.length > 0 ? (
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
                      <h3>New Properties</h3>
                    </Col>
                    <Col></Col>
                  </Row>
                  <Row className="m-3" style={{ overflow: "scroll" }}>
                    <Table
                      responsive="xl"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <EnhancedTableHeadProperties
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={processingManagerData.length}
                      />{" "}
                      <TableBody>
                        {stableSort(
                          processingManagerData,
                          getComparator(order, orderBy)
                        )
                          // for filtering
                          .filter((val) => {
                            const query = search.toLowerCase();

                            return (
                              val.address.toLowerCase().indexOf(query) >= 0 ||
                              val.city.toLowerCase().indexOf(query) >= 0 ||
                              val.zip.toLowerCase().indexOf(query) >= 0 ||
                              String(val.oldestOpenMR)
                                .toLowerCase()
                                .indexOf(query) >= 0 ||
                              String(val.late_date)
                                .toLowerCase()
                                .indexOf(query) >= 0
                            );
                          })
                          .map((property, index) => {
                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={property.property_uid}
                              >
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {JSON.parse(property.images).length > 0 ? (
                                    <img
                                      src={`${
                                        JSON.parse(property.images)[0]
                                      }?${Date.now()}`}
                                      alt="Property"
                                      style={{
                                        borderRadius: "4px",
                                        objectFit: "cover",
                                        width: "100px",
                                        height: "100px",
                                      }}
                                    />
                                  ) : (
                                    <img
                                      src={PropertyIcon}
                                      alt="Property"
                                      style={{
                                        borderRadius: "4px",
                                        objectFit: "cover",
                                        width: "100px",
                                        height: "100px",
                                      }}
                                    />
                                  )}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.address}
                                  {property.unit !== ""
                                    ? " " + property.unit
                                    : ""}{" "}
                                  {property.city}, {property.state}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.zip}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(`/owner-list`);
                                  }}
                                >
                                  {property.owner_first_name}{" "}
                                  {property.owner_last_name}
                                  <div className="d-flex align-items-center flex-column">
                                    {property.management_status ===
                                    "FORWARDED" ? (
                                      <div
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        Property Manager Requested
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {property.management_status === "SENT" ? (
                                      <div
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        Contract in Review
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {property.management_status ===
                                    "PM END EARLY" ? (
                                      <div
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        PM requested end early
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    {property.management_status ===
                                    "OWNER END EARLY" ? (
                                      <div
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        Owner requested end early
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.num_apps}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  style={{
                                    color:
                                      property.available_to_rent == 0
                                        ? "Red"
                                        : property.rentalInfo == "Not Rented"
                                        ? "green"
                                        : "black",
                                  }}
                                  align="center"
                                >
                                  {property.rentalInfo !== "Not Rented" ? (
                                    property.rentalInfo.map((tf, i) => {
                                      return (
                                        <div
                                          onClick={() => {
                                            fetchTenantDetails(tf.tenant_id);
                                          }}
                                        >
                                          {i + 1} {tf.tenant_first_name}{" "}
                                          {tf.tenant_last_name}
                                        </div>
                                      );
                                    })
                                  ) : property.available_to_rent == 0 ? (
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      Not Listed
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      {property.rentalInfo}
                                    </div>
                                  )}
                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property.new_tenant_applications
                                          .length > 0
                                          ? `${property.new_tenant_applications.length} new tenant application(s) to review`
                                          : ""}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property.end_early_applications
                                          .length > 0
                                          ? "Tenant(s) requested to end the lease early"
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.rentalInfo.length !== 0
                                    ? property.rentalInfo[0].lease_end
                                    : "None"}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                  style={{
                                    color:
                                      property.available_to_rent == 0
                                        ? "red"
                                        : property.rent_status == "PAID"
                                        ? "black"
                                        : property.rent_status == "UNPAID"
                                        ? "red"
                                        : "green",
                                  }}
                                >
                                  {property.available_to_rent == 0 ? (
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      Not Listed
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      {property.rent_status}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.late_date != "Not Applicable" ? (
                                    <div>{property.late_date} days</div>
                                  ) : (
                                    <div>{property.late_date}</div>
                                  )}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.new_mr}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.process_mr}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.quote_received_mr}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.quote_accepted_mr}
                                </TableCell>
                                {/* <TableCell padding="none" size="small" align="center">
                            {property.oldestOpenMR != "Not Applicable" ? (
                              <div>{property.oldestOpenMR} days</div>
                            ) : (
                              <div>{property.oldestOpenMR}</div>
                            )}
                          </TableCell> */}
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {"$" + property.listed_rent}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.property_type}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.num_beds + "/" + property.num_baths}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </Row>
                </div>
              ) : (
                ""
              )}
            </div>
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
                  <h3>Maintenance and Repairs</h3>
                </Col>
                <Col>
                  <img
                    src={AddIcon}
                    onClick={() => {
                      window.scrollTo(0, 0);
                      setStage("ADDREQUEST");
                    }}
                    style={{
                      width: "30px",
                      height: "30px",
                      float: "right",
                      marginRight: "3rem",
                    }}
                  />
                  {/* <h3 style={{ float: "right", marginRight: "3rem" }}>+</h3> */}
                </Col>
              </Row>
              {maintenanceRequests.length > 0 ? (
                <Row className="m-3" style={{ overflow: "scroll" }}>
                  <Table
                    responsive="md"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
                    <EnhancedTableHeadMaintenance
                      orderMaintenance={orderMaintenance}
                      orderMaintenanceBy={orderMaintenanceBy}
                      onRequestSort={handleRequestSortMaintenance}
                      rowCount={maintenanceRequests.length}
                    />{" "}
                    <TableBody>
                      {stableSortMaintenance(
                        maintenanceRequests,
                        getComparatorMaintenance(
                          orderMaintenance,
                          orderMaintenanceBy
                        )
                      ).map((request, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={request.maintenance_request_uid}
                            onClick={() =>
                              navigate(
                                `/manager-repairs/${request.maintenance_request_uid}`,
                                {
                                  state: {
                                    repair: request,
                                    property: request.address,
                                  },
                                }
                              )
                            }
                          >
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {JSON.parse(request.images).length > 0 ? (
                                <img
                                  src={`${
                                    JSON.parse(request.images)[0]
                                  }?${Date.now()}`}
                                  alt="RepairImg"
                                  style={{
                                    borderRadius: "4px",
                                    objectFit: "cover",
                                    width: "100px",
                                    height: "100px",
                                  }}
                                />
                              ) : (
                                <img
                                  src={RepairImg}
                                  alt="Repair"
                                  style={{
                                    borderRadius: "4px",
                                    objectFit: "cover",
                                    width: "100px",
                                    height: "100px",
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.address}{" "}
                              {request.unit !== "" ? " " + request.unit : ""}{" "}
                              {request.city}, {request.state} {request.zip}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              style={{
                                color:
                                  request.request_status === "NEW"
                                    ? "green"
                                    : "black",
                              }}
                            >
                              {request.request_status}
                              <div className="d-flex">
                                <div className="d-flex align-items-end">
                                  <p
                                    style={{ ...blue, ...xSmall }}
                                    className="mb-0"
                                  >
                                    {request.request_status === "INFO"
                                      ? request.notes
                                      : ""}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {" "}
                              {request.title}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {" "}
                              {request.request_created_date.split(" ")[0]}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.days_open} days
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.request_type != null
                                ? request.request_type
                                : "None"}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.priority}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.assigned_business !== null &&
                              request.assigned_business !== "null" ? (
                                request.assigned_business
                              ) : (
                                <div>
                                  {console.log(
                                    "quotes_received",
                                    request.quotes_received,
                                    request.total_quotes
                                  )}
                                  {request.quotes_received}/
                                  {request.total_quotes}
                                </div>
                              )}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.quotes.length > 0
                                ? request.quotes.map((quote) =>
                                    quote.quote_status === "ACCEPTED"
                                      ? quote.quote_status
                                      : quote.quote_status === "SENT"
                                      ? "QUOTE RECIEVED"
                                      : quote.quote_status === "WITHDRAWN" ||
                                        quote.quote_status === "REJECTED" ||
                                        quote.quote_status === "REFUSED"
                                      ? ""
                                      : request.total_quotes === 1 &&
                                        quote.quote_status === "REQUESTED"
                                      ? "QUOTE REQUESTED"
                                      : ""
                                  )
                                : "NO QUOTES REQUESTED"}
                            </TableCell>

                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.scheduled_date !== null &&
                              request.scheduled_date !== "null"
                                ? request.scheduled_date.split(" ")[0]
                                : "Not Scheduled"}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.scheduled_time !== null &&
                              request.scheduled_time !== "null"
                                ? request.scheduled_time.split(" ")[0]
                                : "Not Scheduled"}
                            </TableCell>
                            <TableCell>${request.total_estimate}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Row>
              ) : (
                <Row className="m-3">No maintenance requests and repairs</Row>
              )}
            </div>
          </div>
          <div hidden={responsive.showSidebar} className="w-100 mt-3">
            <ManagerFooter />
          </div>
        </div>
      ) : !isLoading && processingManagerData.length == 0 ? (
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
            <Header title="Manager Dashboard" />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h3>Welcome to Manifest My Space</h3>
              <br />
            </div>

            <div hidden={responsive.showSidebar} className="w-100 mt-3">
              <ManagerFooter />
            </div>
          </div>
        </div>
      ) : !isLoading && processingManagerData.length == 0 ? (
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
            <Header title="Manager Dashboard" />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h3>Welcome to Manifest My Space</h3>
              <br />
            </div>

            <div hidden={responsive.showSidebar} className="w-100 mt-3">
              <ManagerFooter />
            </div>
          </div>
        </div>
      ) : (
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
          <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            <ReactBootStrap.Spinner animation="border" role="status" />
          </div>
          <div hidden={responsive.showSidebar} className="w-100 mt-3">
            <ManagerFooter />
          </div>
        </div>
      )}
    </div>
  ) : stage === "ADDEXPENSE" ? (
    <div className="ManagerDashboard">
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
            title="Add Expense"
            leftText="< Back"
            leftFn={() => setStage("LIST")}
          />
          <ManagerCreateExpense
            properties={managerData}
            cancel={() => setStage("LIST")}
            onSubmit={addProperty}
          />
        </div>
        <div hidden={responsive.showSidebar}>
          <ManagerFooter />
        </div>
      </div>
    </div>
  ) : stage === "ADDREQUEST" ? (
    <div className="ManagerDashboard">
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
            title="Add Repair Request"
            leftText="< Back"
            leftFn={() => setStage("LIST")}
          />
          <ManagerRepairRequest
            properties={managerData}
            cancel={() => setStage("LIST")}
            onSubmit={addProperty}
          />
        </div>
        <div hidden={responsive.showSidebar}>
          <ManagerFooter />
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
