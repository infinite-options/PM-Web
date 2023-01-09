import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableSortLabel,
  Box,
  Grid,
} from "@material-ui/core";
import Carousel from "react-multi-carousel";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import Header from "../Header";
import OwnerFooter from "./OwnerFooter";
import OwnerPropertyForm from "./OwnerPropertyForm";
import OwnerCreateExpense from "./OwnerCreateExpense";
import CreateRevenue from "../CreateRevenue";
import ManagerDocs from "./ManagerDocs";
import ManagementContract from "./ManagementContract";
import OwnerRepairRequest from "./OwnerRepairRequest";
import ConfirmDialog from "../ConfirmDialog";
import BusinessContact from "../BusinessContact";
import ManagerFees from "../ManagerFees";
import SideBar from "./SideBar";
import AppContext from "../../AppContext";
import File from "../../icons/File.svg";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import EditIconNew from "../../icons/EditIconNew.svg";
import AddIcon from "../../icons/AddIcon.svg";
import SortDown from "../../icons/Sort-down.svg";
import SortLeft from "../../icons/Sort-left.svg";
import PropertyIcon from "../../icons/PropertyIcon.svg";
import RepairImg from "../../icons/RepairImg.svg";
import { get, put } from "../../utils/api";
import {
  squareForm,
  mediumBold,
  bluePillButton,
  redPillButton,
  smallImg,
  green,
  red,
  gray,
} from "../../utils/styles";
import "react-multi-carousel/lib/styles.css";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});

function OwnerPropertyView(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  console.log(location.state);
  const property_uid =
    location.state === null ? props.property_uid : location.state.property_uid;
  const [isLoading, setIsLoading] = useState(true);
  // const { property_uid, back, reload, setStage } = props;
  const [property, setProperty] = useState({
    images: "[]",
  });
  const [imagesProperty, setImagesProperty] = useState([]);
  const [showAddRequest, setShowAddRequest] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

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
  const responsiveSidebar = {
    showSidebar: width > 1023,
  };

  const contactState = useState([]);
  const applianceState = useState({
    Microwave: {
      available: false,
      name: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
    },
    Dishwasher: {
      available: false,
      name: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
    },
    Refrigerator: {
      available: false,
      name: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
    },
    Washer: {
      available: false,
      name: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
    },
    Dryer: {
      available: false,
      name: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
    },
    Range: {
      available: false,
      name: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
    },
  });
  const [feeState, setFeeState] = useState([]);
  const appliances = Object.keys(applianceState[0]);
  const [tenantInfo, setTenantInfo] = useState([]);
  const [rentalInfo, setRentalInfo] = useState([]);
  const [cancel, setCancel] = useState(false);
  const [endEarlyDate, setEndEarlyDate] = useState("");
  // sorting variables
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const fetchProperty = async () => {
    const response = await get(
      `/propertiesOwnerDetail?property_uid=${property_uid}`
    );
    const cashflowResponse = await get(
      `/ownerCashflowProperty?property_id=${property_uid}&owner_id=${user.user_uid}`
    );

    setCashflowData(cashflowResponse.result);
    setProperty(response.result[0]);
    setImagesProperty(JSON.parse(response.result[0].images));
    let show = JSON.parse(response.result[0].images).length < 5 ? false : true;
    setShowControls(show);
    console.log(response.result[0]);
    applianceState[1](JSON.parse(response.result[0].appliances));
    const res = await get(
      `/contracts?property_uid=${response.result[0].property_uid}`
    );

    setContracts(res.result);
    setRentalInfo(response.result[0].rentalInfo);
    setIsLoading(false);
    console.log(res.result[0]);
    if (res.result[0] !== undefined) {
      contactState[1](JSON.parse(res.result[0].assigned_contacts));
    }

    let tenant = [];
    let ti = {};
    response.result[0].rentalInfo.map((rentalInfo) => {
      if (rentalInfo.tenant_first_name.includes(",")) {
        let tenant_fns = rentalInfo.tenant_first_name.split(",");
        let tenant_lns = rentalInfo.tenant_last_name.split(",");
        let tenant_emails = rentalInfo.tenant_email.split(",");
        let tenant_phones = rentalInfo.tenant_phone_number.split(",");
        for (let i = 0; i < tenant_fns.length; i++) {
          ti["tenantFirstName"] = tenant_fns[i];
          ti["tenantLastName"] = tenant_lns[i];
          ti["tenantEmail"] = tenant_emails[i];
          ti["tenantPhoneNumber"] = tenant_phones[i];
          tenant.push(ti);
          ti = {};
        }
      } else {
        ti = {
          tenantFirstName: rentalInfo.tenant_first_name,
          tenantLastName: rentalInfo.tenant_last_name,
          tenantEmail: rentalInfo.tenant_email,
          tenantPhoneNumber: rentalInfo.tenant_phone_number,
        };
        tenant.push(ti);
      }
    });
    setTenantInfo(tenant);
  };
  useEffect(() => {
    fetchProperty();
  }, []);

  const [pmID, setPmID] = useState("");
  const [currentImg, setCurrentImg] = useState(0);
  const [editProperty, setEditProperty] = useState(false);

  const [contracts, setContracts] = useState([]);
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [showCreateRevenue, setShowCreateRevenue] = useState(false);

  const [showManagementContract, setShowManagementContract] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialog2, setShowDialog2] = useState(false);

  const [cashflowData, setCashflowData] = useState([]);
  const [monthlyCashFlow, setMonthlyCashFlow] = useState(false);
  const [yearlyCashFlow, setYearlyCashFlow] = useState(false);

  const [monthlyRevenue, setMonthlyRevenue] = useState(false);
  const [monthlyRent, setMonthlyRent] = useState(false);
  const [monthlyExtra, setMonthlyExtra] = useState(false);
  const [monthlyUtility, setMonthlyUtility] = useState(false);
  const [monthlyOwnerPayment, setMonthlyOwnerPayment] = useState(false);
  const [monthlyMaintenanceRevenue, setMonthlyMaintenanceRevenue] =
    useState(false);
  const [monthlyRepairsRevenue, setMonthlyRepairsRevenue] = useState(false);

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
  const [yearlyOwnerPayment, setYearlyOwnerPayment] = useState(false);
  const [yearlyMaintenanceRevenue, setYearlyMaintenanceRevenue] =
    useState(false);
  const [yearlyRepairsRevenue, setYearlyRepairsRevenue] = useState(false);

  const [yearlyExpense, setYearlyExpense] = useState(false);
  const [yearlyManagement, setYearlyManagement] = useState(false);
  const [yearlyMaintenance, setYearlyMaintenance] = useState(false);
  const [yearlyRepairs, setYearlyRepairs] = useState(false);
  const [yearlyMortgage, setYearlyMortgage] = useState(false);
  const [yearlyTaxes, setYearlyTaxes] = useState(false);
  const [yearlyInsurance, setYearlyInsurance] = useState(false);
  const [yearlyUtilityExpense, setYearlyUtilityExpense] = useState(false);
  console.log("contract", contracts);

  const headerBack = () => {
    editProperty
      ? reloadProperty()
      : showAddRequest
      ? setShowAddRequest(false)
      : showCreateExpense
      ? setShowCreateExpense(false)
      : showCreateRevenue
      ? setShowCreateRevenue(false)
      : navigate("../owner");
    // navigate("../owner");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showCreateExpense, showCreateRevenue, showManagementContract]);

  const reloadProperty = () => {
    setEditProperty(false);
    setShowAddRequest(false);
    window.scrollTo(0, 0);
    fetchProperty();
  };

  const addContract = () => {
    setSelectedContract(null);
    setShowManagementContract(true);
  };
  const selectContract = (contract) => {
    setSelectedContract(contract);
    setShowManagementContract(true);
  };
  const closeContract = () => {
    fetchProperty();
    setShowManagementContract(false);
  };

  const approvePropertyManager = async (pID) => {
    const files = JSON.parse(property.images);
    let pid = pID;
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "ACCEPTED",
      manager_id: pid,
    };
    for (let i = -1; i < files.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      updatedManagementContract[key] = files[i + 1];
    }

    const response2 = await put(
      "/properties",
      updatedManagementContract,
      null,
      files
    );
    reloadProperty();
  };

  const rejectPropertyManager = async () => {
    let pid = pmID;

    const files = JSON.parse(property.images);
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "REJECTED",
      manager_id: pid,
    };
    for (let i = -1; i < files.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      updatedManagementContract[key] = files[i + 1];
    }
    const response2 = await put(
      "/properties",
      updatedManagementContract,
      null,
      files
    );
    setShowDialog(false);
    reloadProperty();
  };

  const cancelAgreement = async () => {
    let pid = pmID;
    const files = JSON.parse(property.images);
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "OWNER END EARLY",
      manager_id: pid,
      early_end_date: endEarlyDate,
    };
    for (let i = -1; i < files.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      updatedManagementContract[key] = files[i + 1];
    }
    const response2 = await put(
      "/cancelAgreement",
      updatedManagementContract,
      null,
      files
    );
    setShowDialog2(false);
    reloadProperty();
  };
  const acceptCancelAgreement = async () => {
    const files = JSON.parse(property.images);
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "OWNER ACCEPTED",
      manager_id: property.managerInfo.manager_id,
    };
    for (let i = -1; i < files.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      updatedManagementContract[key] = files[i + 1];
    }
    await put("/cancelAgreement", updatedManagementContract, null, files);
    reloadProperty();
  };

  const rejectCancelAgreement = async () => {
    const files = JSON.parse(property.images);
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "OWNER REJECTED",
      manager_id: property.managerInfo.manager_id,
    };

    await put("/cancelAgreement", updatedManagementContract, null, files);
    reloadProperty();
  };

  const onCancel = () => {
    setShowDialog(false);
  };
  const onCancel2 = () => {
    setShowDialog2(false);
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
      id: "rent_paid",
      numeric: true,
      label: "Rent Status",
    },
    {
      id: "listed_rent",
      numeric: true,
      label: "Rent",
    },
    {
      id: "per_sqft",
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
      label: "Request Images",
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
      label: "Scheduled Date",
    },
    {
      id: "scheduled_time",
      numeric: true,
      label: "Scheduled Time",
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
    cashflowData.utility_revenue +
    cashflowData.management_revenue +
    cashflowData.maintenance_revenue +
    cashflowData.repairs_revenue
  ).toFixed(2);

  let expenseTotal = 0;
  expenseTotal = (
    cashflowData.maintenance_expense +
    Math.abs(cashflowData.management_expense) +
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
    cashflowData.amortized_utility_revenue +
    cashflowData.amortized_management_revenue +
    cashflowData.amortized_maintenance_revenue +
    cashflowData.amortized_repairs_revenue
  ).toFixed(2);

  let expenseTotalAmortized = 0;
  expenseTotalAmortized = (
    cashflowData.amortized_maintenance_expense +
    Math.abs(cashflowData.amortized_management_expense) +
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
    Math.abs(cashflowData.management_year_expense) +
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
    cashflowData.utility_year_revenue +
    cashflowData.management_year_revenue +
    cashflowData.maintenance_year_revenue +
    cashflowData.repairs_year_revenue
  ).toFixed(2);
  const yearCashFlow = (yearRevenueTotal - yearExpenseTotal).toFixed(2);

  let yearExpenseTotalAmortized = 0;
  yearExpenseTotalAmortized = (
    cashflowData.amortized_maintenance_year_expense +
    Math.abs(cashflowData.amortized_management_year_expense) +
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
    Math.abs(cashflowData.management_expected_expense) +
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
    cashflowData.amortized_utility_expected_revenue +
    cashflowData.amortized_management_expected_revenue +
    cashflowData.amortized_maintenance_expected_revenue +
    cashflowData.amortized_repairs_expected_revenue
  ).toFixed(2);

  let expenseExpectedTotalAmortized = 0;
  expenseExpectedTotalAmortized = (
    cashflowData.amortized_maintenance_expected_expense +
    Math.abs(cashflowData.amortized_management_expected_expense) +
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
    cashflowData.utility_year_expected_revenue +
    cashflowData.management_year_expected_revenue +
    cashflowData.maintenance_year_expected_revenue +
    cashflowData.repairs_year_expected_revenue
  ).toFixed(2);

  let yearExpenseExpectedTotal = 0;
  yearExpenseExpectedTotal = (
    cashflowData.maintenance_year_expected_expense +
    Math.abs(cashflowData.management_year_expected_expense) +
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
    cashflowData.amortized_utility_year_expected_revenue +
    cashflowData.amortized_management_year_expected_revenue +
    cashflowData.amortized_maintenance_year_expected_revenue +
    cashflowData.amortized_repairs_year_expected_revenue
  ).toFixed(2);

  let yearExpenseExpectedTotalAmortized = 0;
  yearExpenseExpectedTotalAmortized = (
    cashflowData.amortized_maintenance_year_expected_expense +
    Math.abs(cashflowData.amortized_management_year_expected_expense) +
    cashflowData.amortized_repairs_year_expected_expense +
    cashflowData.amortized_utility_year_expected_expense +
    cashflowData.amortized_mortgage_year_expense +
    cashflowData.amortized_taxes_year_expense +
    cashflowData.amortized_insurance_year_expense
  ).toFixed(2);

  const yearCashFlowExpectedAmortized = (
    yearRevenueExpectedTotalAmortized - yearExpenseExpectedTotalAmortized
  ).toFixed(2);

  console.log(cashflowData);

  return Object.keys(property).length > 1 ? (
    showManagementContract ? (
      <ManagementContract
        back={closeContract}
        property={property}
        contract={selectedContract}
        reload={reloadProperty}
      />
    ) : (
      <div className="w-100">
        <ConfirmDialog
          title={"Are you sure you want to reject this Property Manager?"}
          isOpen={showDialog}
          onConfirm={rejectPropertyManager}
          onCancel={onCancel}
        />
        <ConfirmDialog
          title={
            "Are you sure you want to cancel the Agreement with this Property Management?"
          }
          isOpen={showDialog2}
          onConfirm={cancelAgreement}
          onCancel={onCancel2}
        />
        <div className="flex-1 mb-5">
          {location.state == null ? (
            ""
          ) : (
            <div
              hidden={!responsiveSidebar.showSidebar}
              style={{
                backgroundColor: "#229ebc",
                width: "11rem",
                minHeight: "100%",
              }}
            >
              <SideBar />
            </div>
          )}

          <div className="w-100 mb-5 overflow-scroll overflow-hidden">
            <Header
              title="Property Details"
              leftText={location.state == null ? "" : "< Back"}
              leftFn={headerBack}
            />
            <div className="w-100 mb-5 overflow-scroll">
              {editProperty ? (
                <OwnerPropertyForm
                  property={property}
                  edit={editProperty}
                  setEdit={setEditProperty}
                  onSubmit={reloadProperty}
                />
              ) : showAddRequest ? (
                <OwnerRepairRequest
                  properties={property}
                  cancel={() => setShowAddRequest(false)}
                  onSubmit={reloadProperty}
                />
              ) : showCreateExpense ? (
                <OwnerCreateExpense
                  properties={property}
                  cancel={() => setShowCreateExpense(false)}
                  onSubmit={reloadProperty}
                />
              ) : showCreateRevenue ? (
                <CreateRevenue
                  property={property}
                  reload={reloadProperty}
                  back={() => setShowCreateRevenue(false)}
                />
              ) : (
                <div className="w-100 my-5 overflow-hidden">
                  <Row className=" d-flex align-items-center justify-content-center m-3">
                    {imagesProperty.length > 0 ? (
                      <Carousel
                        responsive={responsive}
                        infinite={true}
                        arrows={true}
                        className=" d-flex align-items-center justify-content-center"
                      >
                        {imagesProperty.map((imagesGroup) => {
                          return (
                            <div className="d-flex align-items-center justify-content-center">
                              <img
                                key={Date.now()}
                                src={`${imagesGroup}?${Date.now()}`}
                                style={{
                                  width: "200px",
                                  height: "200px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          );
                        })}
                      </Carousel>
                    ) : (
                      ""
                    )}
                  </Row>
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
                        <h3>Property Cashflow Summary</h3>
                      </Col>
                      <Col>
                        <img
                          src={AddIcon}
                          onClick={() => setShowCreateExpense(true)}
                          style={{
                            width: "30px",
                            height: "30px",
                            float: "right",
                            marginRight: "5rem",
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="m-3" style={{ overflow: "scroll" }}>
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
                          <TableCell align="right">
                            Expected Amortized
                          </TableCell>
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
                                  setMonthlyOwnerPayment(false);
                                  setMonthlyMaintenanceRevenue(false);
                                  setMonthlyRepairsRevenue(false);
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
                                src={SortDown}
                                hidden={!monthlyCashFlow}
                                onClick={() => {
                                  setMonthlyCashFlow(!monthlyCashFlow);
                                  setMonthlyRevenue(false);
                                  setMonthlyExpense(false);
                                  setMonthlyRent(false);
                                  setMonthlyExtra(false);
                                  setMonthlyUtility(false);
                                  setMonthlyOwnerPayment(false);
                                  setMonthlyMaintenanceRevenue(false);
                                  setMonthlyRepairsRevenue(false);
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
                              $
                              {(revenueTotal - revenueExpectedTotal).toFixed(2)}
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
                              $
                              {cashflowData.amortized_rental_revenue.toFixed(2)}
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
                                    &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                    {revenue.unit}
                                    <br />
                                    &nbsp;&nbsp;&nbsp; {
                                      revenue.description
                                    }{" "}
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
                            cashflowData.owner_revenue.map((revenue, index) => {
                              return revenue.purchase_type ===
                                "EXTRA CHARGES" ? (
                                <TableRow hidden={!monthlyExtra}>
                                  <TableCell>
                                    &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                    {revenue.unit} <br />
                                    &nbsp;&nbsp;&nbsp; {
                                      revenue.description
                                    }{" "}
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
                            })}
                          <TableRow hidden={!monthlyRevenue}>
                            <TableCell width="180px">
                              &nbsp; &nbsp;Utility
                              <img
                                src={SortLeft}
                                hidden={monthlyUtility}
                                onClick={() =>
                                  setMonthlyUtility(!monthlyUtility)
                                }
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  float: "right",
                                }}
                              />
                              <img
                                src={SortDown}
                                hidden={!monthlyUtility}
                                onClick={() =>
                                  setMonthlyUtility(!monthlyUtility)
                                }
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
                              $
                              {cashflowData.utility_expected_revenue.toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {(
                                cashflowData.utility_revenue -
                                cashflowData.utility_expected_revenue
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {cashflowData.amortized_utility_revenue.toFixed(
                                2
                              )}
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
                                    &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                    {revenue.unit}
                                    <br />
                                    &nbsp;&nbsp;&nbsp; {
                                      revenue.description
                                    }{" "}
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
                            })}
                          <TableRow hidden={!monthlyRevenue}>
                            <TableCell width="180px">
                              &nbsp;&nbsp; Owner Payment{" "}
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
                              />
                            </TableCell>
                            <TableCell width="180px" align="right">
                              ${cashflowData.management_revenue.toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {cashflowData.management_expected_revenue.toFixed(
                                2
                              )}
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
                              {cashflowData.amortized_management_revenue.toFixed(
                                2
                              )}
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
                            cashflowData.owner_revenue.map((revenue, index) => {
                              return revenue.purchase_type ===
                                "OWNER PAYMENT" ? (
                                <TableRow hidden={!monthlyOwnerPayment}>
                                  <TableCell>
                                    &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                    {revenue.unit}
                                    <br />
                                    &nbsp;&nbsp;&nbsp; {
                                      revenue.description
                                    }{" "}
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
                              {cashflowData.maintenance_expected_revenue.toFixed(
                                2
                              )}
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
                            cashflowData.owner_revenue.map((revenue, index) => {
                              return revenue.purchase_type === "MAINTENANCE" ? (
                                <TableRow hidden={!monthlyMaintenanceRevenue}>
                                  <TableCell>
                                    &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                    {revenue.unit}
                                    <br />
                                    &nbsp;&nbsp;&nbsp; {
                                      revenue.description
                                    }{" "}
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
                            })}
                          <TableRow hidden={!monthlyRevenue}>
                            <TableCell width="180px">
                              &nbsp; &nbsp;Repairs
                              <img
                                src={SortLeft}
                                hidden={monthlyRepairsRevenue}
                                onClick={() =>
                                  setMonthlyRepairsRevenue(
                                    !monthlyRepairsRevenue
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
                                hidden={!monthlyRepairsRevenue}
                                onClick={() =>
                                  setMonthlyRepairsRevenue(
                                    !monthlyRepairsRevenue
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
                              ${cashflowData.repairs_revenue.toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {cashflowData.repairs_expected_revenue.toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {(
                                cashflowData.repairs_revenue -
                                cashflowData.repairs_expected_revenue
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {cashflowData.amortized_repairs_revenue.toFixed(
                                2
                              )}
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
                            cashflowData.owner_revenue.map((revenue, index) => {
                              return revenue.purchase_type === "REPAIRS" ? (
                                <TableRow hidden={!monthlyRepairsRevenue}>
                                  <TableCell>
                                    &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                    {revenue.unit}
                                    <br />
                                    &nbsp;&nbsp;&nbsp; {
                                      revenue.description
                                    }{" "}
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
                            })}
                          <TableRow hidden={!monthlyCashFlow}>
                            <TableCell width="180px">
                              &nbsp; Expenses{" "}
                              <img
                                src={SortLeft}
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
                                src={SortDown}
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
                              $
                              {(expenseTotal - expenseExpectedTotal).toFixed(2)}
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
                              &nbsp;&nbsp; Management
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
                              ${cashflowData.management_expense.toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {cashflowData.management_expected_expense.toFixed(
                                2
                              )}
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
                              {cashflowData.amortized_management_expense.toFixed(
                                2
                              )}
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
                                    &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                    {expense.unit}
                                    <br />
                                    &nbsp;&nbsp;&nbsp; {
                                      expense.description
                                    }{" "}
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
                                      $
                                      {Math.abs(expense.amount_paid).toFixed(2)}
                                    </TableCell>
                                  ) : (
                                    <TableCell width="180px" align="right">
                                      $
                                      {Math.abs(expense.amount_paid).toFixed(2)}
                                    </TableCell>
                                  )}

                                  {expense.purchase_status === "UNPAID" ? (
                                    <TableCell
                                      width="180px"
                                      align="right"
                                      style={red}
                                    >
                                      ${Math.abs(expense.amount_due).toFixed(2)}
                                    </TableCell>
                                  ) : (
                                    <TableCell width="180px" align="right">
                                      ${Math.abs(expense.amount_due).toFixed(2)}
                                    </TableCell>
                                  )}
                                  <TableCell width="180px" align="right">
                                    $
                                    {(
                                      Math.abs(expense.amount_paid) -
                                      Math.abs(expense.amount_due)
                                    ).toFixed(2)}
                                  </TableCell>
                                  {expense.purchase_status === "PAID" &&
                                  expense.purchase_frequency == "Annually" ? (
                                    <TableCell width="180px" align="right">
                                      $
                                      {(
                                        Math.abs(expense.amount_paid) / 12
                                      ).toFixed(2)}
                                    </TableCell>
                                  ) : (
                                    <TableCell width="180px" align="right">
                                      $0.00
                                    </TableCell>
                                  )}
                                  {expense.purchase_status === "UNPAID" &&
                                  expense.purchase_frequency == "Annually" ? (
                                    <TableCell width="180px" align="right">
                                      $
                                      {(
                                        Math.abs(expense.amount_due) / 12
                                      ).toFixed(2)}
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
                                        (Math.abs(expense.amount_paid) -
                                          Math.abs(expense.amount_due)) /
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
                          {isLoading === false &&
                            cashflowData.owner_expense.map((expense, index) => {
                              return expense.purchase_type ===
                                "OWNER PAYMENT" &&
                                expense.contract_fees != undefined ? (
                                <TableRow hidden={!monthlyManagement}>
                                  {console.log(
                                    "here in owner payment monthly",
                                    expense,
                                    expense.contract_fees === undefined
                                      ? ""
                                      : JSON.parse(expense.contract_fees)
                                  )}
                                  <TableCell>
                                    &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                    {expense.unit}
                                    <br />
                                    &nbsp;&nbsp;&nbsp;{" "}
                                    {expense.contract_fees != undefined ? (
                                      <div>
                                        {JSON.parse(expense.contract_fees).map(
                                          (fee, i) => {
                                            return (
                                              <div style={gray}>
                                                {fee.fee_type == "%"
                                                  ? fee.charge +
                                                    fee.fee_type +
                                                    " Management fee"
                                                  : ""}
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    <br />
                                    &nbsp;&nbsp;&nbsp;{" "}
                                    <div style={gray}>
                                      {expense.purchase_frequency}
                                    </div>
                                  </TableCell>
                                  {expense.purchase_status === "PAID" &&
                                  expense.contract_fees != undefined ? (
                                    <TableCell
                                      width="180px"
                                      align="right"
                                      style={red}
                                    >
                                      {JSON.parse(expense.contract_fees).map(
                                        (fee, i) => {
                                          return (
                                            <div style={red}>
                                              {fee.fee_type == "%"
                                                ? "$" +
                                                  (
                                                    expense.amount_paid /
                                                      (1 -
                                                        parseInt(fee.charge) /
                                                          100) -
                                                    expense.amount_paid
                                                  ).toFixed(2)
                                                : ""}
                                            </div>
                                          );
                                        }
                                      )}
                                    </TableCell>
                                  ) : (
                                    <TableCell width="180px" align="right">
                                      {JSON.parse(expense.contract_fees).map(
                                        (fee, i) => {
                                          return (
                                            <div style={red}>
                                              {fee.fee_type == "%"
                                                ? "$" +
                                                  (
                                                    expense.amount_paid /
                                                      (1 -
                                                        parseInt(fee.charge) /
                                                          100) -
                                                    expense.amount_paid
                                                  ).toFixed(2)
                                                : ""}
                                            </div>
                                          );
                                        }
                                      )}
                                    </TableCell>
                                  )}

                                  {expense.purchase_status === "UNPAID" &&
                                  expense.contract_fees != undefined ? (
                                    <TableCell
                                      width="180px"
                                      align="right"
                                      style={red}
                                    >
                                      {JSON.parse(expense.contract_fees).map(
                                        (fee, i) => {
                                          return (
                                            <div style={red}>
                                              {fee.fee_type == "%"
                                                ? "$" +
                                                  (
                                                    expense.amount_due /
                                                      (1 -
                                                        parseInt(fee.charge) /
                                                          100) -
                                                    expense.amount_due
                                                  ).toFixed(2)
                                                : ""}
                                            </div>
                                          );
                                        }
                                      )}
                                    </TableCell>
                                  ) : (
                                    <TableCell width="180px" align="right">
                                      {JSON.parse(expense.contract_fees).map(
                                        (fee, i) => {
                                          return (
                                            <div style={red}>
                                              {fee.fee_type == "%"
                                                ? "$" +
                                                  (
                                                    expense.amount_due /
                                                      (1 -
                                                        parseInt(fee.charge) /
                                                          100) -
                                                    expense.amount_due
                                                  ).toFixed(2)
                                                : ""}
                                            </div>
                                          );
                                        }
                                      )}
                                    </TableCell>
                                  )}
                                  {expense.contract_fees != undefined ? (
                                    <TableCell
                                      width="180px"
                                      align="right"
                                      style={red}
                                    >
                                      {JSON.parse(expense.contract_fees).map(
                                        (fee, i) => {
                                          return (
                                            <div style={red}>
                                              {fee.fee_type == "%"
                                                ? "$" +
                                                  (
                                                    expense.amount_paid /
                                                      (1 -
                                                        parseInt(fee.charge) /
                                                          100) -
                                                    expense.amount_paid -
                                                    (expense.amount_due /
                                                      (1 -
                                                        parseInt(fee.charge) /
                                                          100) -
                                                      expense.amount_due)
                                                  ).toFixed(2)
                                                : ""}
                                            </div>
                                          );
                                        }
                                      )}
                                    </TableCell>
                                  ) : (
                                    <TableCell width="180px" align="right">
                                      $
                                      {(
                                        expense.amount_paid - expense.amount_due
                                      ).toFixed(2)}
                                    </TableCell>
                                  )}

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
                              {cashflowData.maintenance_expected_expense.toFixed(
                                2
                              )}
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
                            cashflowData.owner_expense.map((expense, index) => {
                              return expense.purchase_type === "MAINTENANCE" ? (
                                <TableRow hidden={!monthlyMaintenance}>
                                  <TableCell>
                                    &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                    {expense.unit}
                                    <br />
                                    &nbsp;&nbsp;&nbsp; {
                                      expense.description
                                    }{" "}
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
                            })}
                          <TableRow hidden={!monthlyExpense}>
                            <TableCell width="180px">
                              &nbsp; &nbsp;Repairs{" "}
                              <img
                                src={SortLeft}
                                hidden={monthlyRepairs}
                                onClick={() =>
                                  setMonthlyRepairs(!monthlyRepairs)
                                }
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  float: "right",
                                }}
                              />
                              <img
                                src={SortDown}
                                hidden={!monthlyRepairs}
                                onClick={() =>
                                  setMonthlyRepairs(!monthlyRepairs)
                                }
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
                              $
                              {cashflowData.repairs_expected_expense.toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {(
                                cashflowData.repairs_expense -
                                cashflowData.repairs_expected_expense
                              ).toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {cashflowData.amortized_repairs_expense.toFixed(
                                2
                              )}
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
                                    &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                    {expense.unit}
                                    <br />
                                    &nbsp;&nbsp;&nbsp; {
                                      expense.description
                                    }{" "}
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
                            })}
                          <TableRow hidden={!monthlyExpense}>
                            <TableCell width="180px">
                              &nbsp; &nbsp;Utility{" "}
                              <img
                                src={SortLeft}
                                hidden={monthlyUtilityExpense}
                                onClick={() =>
                                  setMonthlyUtilityExpense(
                                    !monthlyUtilityExpense
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
                                hidden={!monthlyUtilityExpense}
                                onClick={() =>
                                  setMonthlyUtilityExpense(
                                    !monthlyUtilityExpense
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
                              ${cashflowData.utility_expense.toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {cashflowData.utility_expected_expense.toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {(
                                cashflowData.utility_expense -
                                cashflowData.utility_expected_expense
                              ).toFixed(2)}
                            </TableCell>

                            <TableCell width="180px" align="right">
                              $
                              {cashflowData.amortized_utility_expense.toFixed(
                                2
                              )}
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
                            cashflowData.owner_utility_expense_individual.map(
                              (expense, index) => {
                                return expense.purchase_type === "UTILITY" ? (
                                  <TableRow hidden={!monthlyUtilityExpense}>
                                    <TableCell>
                                      &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                      {expense.unit}
                                      <br />
                                      &nbsp;&nbsp;&nbsp; {
                                        expense.description
                                      }{" "}
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
                                    {expense.purchase_frequency ==
                                    "Annually" ? (
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
                          <TableRow hidden={!monthlyExpense}>
                            <TableCell width="180px">
                              &nbsp;&nbsp; Mortgage{" "}
                              <img
                                src={SortLeft}
                                hidden={monthlyMortgage}
                                onClick={() =>
                                  setMonthlyMortgage(!monthlyMortgage)
                                }
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  float: "right",
                                }}
                              />
                              <img
                                src={SortDown}
                                hidden={!monthlyMortgage}
                                onClick={() =>
                                  setMonthlyMortgage(!monthlyMortgage)
                                }
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
                              $
                              {cashflowData.amortized_mortgage_expense.toFixed(
                                2
                              )}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {cashflowData.amortized_mortgage_expense.toFixed(
                                2
                              )}
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
                                      {
                                        JSON.parse(expense.mortgages).frequency
                                      }{" "}
                                      <br />
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
                                      $
                                      {expense.amortized_mortgage_expense.toFixed(
                                        2
                                      )}
                                    </TableCell>

                                    <TableCell width="180px" align="right">
                                      $
                                      {expense.amortized_mortgage_expense.toFixed(
                                        2
                                      )}
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
                                src={SortLeft}
                                hidden={monthlyTaxes}
                                onClick={() => setMonthlyTaxes(!monthlyTaxes)}
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  float: "right",
                                }}
                              />
                              <img
                                src={SortDown}
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
                                cashflowData.taxes_expense -
                                cashflowData.taxes_expense
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
                                      &nbsp;&nbsp;&nbsp; {
                                        expense.frequency
                                      }{" "}
                                      <br />
                                      &nbsp;&nbsp;&nbsp;{" "}
                                      {expense.frequency_of_payment}
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
                                        expense.taxes_expense -
                                        expense.taxes_expense
                                      ).toFixed(2)}
                                    </TableCell>
                                    <TableCell width="180px" align="right">
                                      $
                                      {expense.amortized_taxes_expense.toFixed(
                                        2
                                      )}
                                    </TableCell>

                                    <TableCell width="180px" align="right">
                                      $
                                      {expense.amortized_taxes_expense.toFixed(
                                        2
                                      )}
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
                                src={SortLeft}
                                hidden={monthlyInsurance}
                                onClick={() =>
                                  setMonthlyInsurance(!monthlyInsurance)
                                }
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  float: "right",
                                }}
                              />
                              <img
                                src={SortDown}
                                hidden={!monthlyInsurance}
                                onClick={() =>
                                  setMonthlyInsurance(!monthlyInsurance)
                                }
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
                              $
                              {cashflowData.amortized_insurance_expense.toFixed(
                                2
                              )}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {cashflowData.amortized_insurance_expense.toFixed(
                                2
                              )}
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
                                      &nbsp;&nbsp;&nbsp; {
                                        expense.frequency
                                      }{" "}
                                      <br />
                                      &nbsp;&nbsp;&nbsp;{" "}
                                      {expense.frequency_of_payment}
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
                                      $
                                      {expense.amortized_insurance_expense.toFixed(
                                        2
                                      )}
                                    </TableCell>

                                    <TableCell width="180px" align="right">
                                      $
                                      {expense.amortized_insurance_expense.toFixed(
                                        2
                                      )}
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
                              $
                              {(yearCashFlow - yearCashFlowExpected).toFixed(2)}
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
                                  setYearlyOwnerPayment(false);
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
                                  setYearlyOwnerPayment(false);
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
                              {cashflowData.rental_year_expected_revenue.toFixed(
                                2
                              )}
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
                            cashflowData.owner_revenue_yearly.map(
                              (revenue, index) => {
                                return revenue.purchase_type === "RENT" ? (
                                  <TableRow hidden={!yearlyRent}>
                                    <TableCell>
                                      &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                      {revenue.unit}
                                      <br />
                                      &nbsp;&nbsp;&nbsp; {
                                        revenue.description
                                      }{" "}
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
                                    {revenue.purchase_frequency ==
                                    "Annually" ? (
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
                              $
                              {cashflowData.extra_year_expected_revenue.toFixed(
                                2
                              )}
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
                              {cashflowData.amortized_extra_year_revenue.toFixed(
                                2
                              )}
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
                            cashflowData.owner_revenue_yearly.map(
                              (revenue, index) => {
                                return revenue.purchase_type ===
                                  "EXTRA CHARGES" ? (
                                  <TableRow hidden={!yearlyExtra}>
                                    <TableCell>
                                      &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                      {revenue.unit}
                                      <br />
                                      &nbsp;&nbsp;&nbsp; {
                                        revenue.description
                                      }{" "}
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
                                    {revenue.purchase_frequency ==
                                    "Annually" ? (
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
                            cashflowData.owner_revenue_yearly.map(
                              (revenue, index) => {
                                return revenue.purchase_type === "UTILITY" ? (
                                  <TableRow hidden={!yearlyUtility}>
                                    <TableCell>
                                      &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                      {revenue.unit}
                                      <br />
                                      &nbsp;&nbsp;&nbsp; {
                                        revenue.description
                                      }{" "}
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
                                    {revenue.purchase_frequency ==
                                    "Annually" ? (
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
                              &nbsp;&nbsp; Owner Payment{" "}
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
                              ${cashflowData.management_revenue.toFixed(2)}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {cashflowData.management_expected_revenue.toFixed(
                                2
                              )}
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
                              {cashflowData.amortized_management_revenue.toFixed(
                                2
                              )}
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
                            cashflowData.owner_revenue.map((revenue, index) => {
                              return revenue.purchase_type ===
                                "OWNER PAYMENT" ? (
                                <TableRow hidden={!yearlyOwnerPayment}>
                                  <TableCell>
                                    &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                    {revenue.unit}
                                    <br />
                                    &nbsp;&nbsp;&nbsp; {
                                      revenue.description
                                    }{" "}
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
                            })}
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
                            cashflowData.owner_revenue_yearly.map(
                              (revenue, index) => {
                                return revenue.purchase_type ===
                                  "MAINTENANCE" ? (
                                  <TableRow hidden={!yearlyMaintenanceRevenue}>
                                    <TableCell>
                                      &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                      {revenue.unit}
                                      <br />
                                      &nbsp;&nbsp;&nbsp; {
                                        revenue.description
                                      }{" "}
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
                                    {revenue.purchase_frequency ==
                                    "Annually" ? (
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
                            cashflowData.owner_revenue_yearly.map(
                              (revenue, index) => {
                                return revenue.purchase_type === "REPAIRS" ? (
                                  <TableRow hidden={!yearlyRepairsRevenue}>
                                    <TableCell>
                                      &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                      {revenue.unit}
                                      <br />
                                      &nbsp;&nbsp;&nbsp; {
                                        revenue.description
                                      }{" "}
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
                                    {revenue.purchase_frequency ==
                                    "Annually" ? (
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
                                src={SortDown}
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
                            cashflowData.owner_expense_yearly.map(
                              (expense, index) => {
                                return expense.purchase_type ===
                                  "MANAGEMENT" ? (
                                  <TableRow hidden={!yearlyManagement}>
                                    <TableCell>
                                      &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                      {expense.unit}
                                      <br />
                                      &nbsp;&nbsp;&nbsp; {
                                        expense.description
                                      }{" "}
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
                                        $
                                        {Math.abs(expense.amount_paid).toFixed(
                                          2
                                        )}
                                      </TableCell>
                                    ) : (
                                      <TableCell width="180px" align="right">
                                        $
                                        {Math.abs(expense.amount_paid).toFixed(
                                          2
                                        )}
                                      </TableCell>
                                    )}

                                    {expense.purchase_status === "UNPAID" ? (
                                      <TableCell
                                        width="180px"
                                        align="right"
                                        style={red}
                                      >
                                        $
                                        {Math.abs(expense.amount_due).toFixed(
                                          2
                                        )}
                                      </TableCell>
                                    ) : (
                                      <TableCell width="180px" align="right">
                                        $
                                        {Math.abs(expense.amount_due).toFixed(
                                          2
                                        )}
                                      </TableCell>
                                    )}
                                    <TableCell width="180px" align="right">
                                      $
                                      {(
                                        Math.abs(expense.amount_paid) -
                                        Math.abs(expense.amount_due)
                                      ).toFixed(2)}
                                    </TableCell>
                                    {expense.purchase_status === "PAID" &&
                                    expense.purchase_frequency == "Annually" ? (
                                      <TableCell width="180px" align="right">
                                        $
                                        {(
                                          Math.abs(expense.amount_paid) / 12
                                        ).toFixed(2)}
                                      </TableCell>
                                    ) : (
                                      <TableCell width="180px" align="right">
                                        $0.00
                                      </TableCell>
                                    )}
                                    {expense.purchase_status === "UNPAID" &&
                                    expense.purchase_frequency == "Annually" ? (
                                      <TableCell width="180px" align="right">
                                        $
                                        {(
                                          Math.abs(expense.amount_due) / 12
                                        ).toFixed(2)}
                                      </TableCell>
                                    ) : (
                                      <TableCell width="180px" align="right">
                                        $0.00
                                      </TableCell>
                                    )}
                                    {expense.purchase_frequency ==
                                    "Annually" ? (
                                      <TableCell width="180px" align="right">
                                        $
                                        {(
                                          (Math.abs(expense.amount_paid) -
                                            Math.abs(expense.amount_due)) /
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
                          {isLoading === false &&
                            cashflowData.owner_expense_yearly.map(
                              (expense, index) => {
                                return expense.purchase_type ===
                                  "OWNER PAYMENT" &&
                                  expense.contract_fees != undefined ? (
                                  <TableRow hidden={!yearlyManagement}>
                                    <TableCell>
                                      &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                      {expense.unit}
                                      <br />
                                      &nbsp;&nbsp;&nbsp; {
                                        expense.description
                                      }{" "}
                                      <br />
                                      &nbsp;&nbsp;&nbsp;{" "}
                                      {expense.purchase_frequency}
                                    </TableCell>
                                    {expense.purchase_status === "PAID" ? (
                                      <TableCell
                                        width="180px"
                                        align="right"
                                        style={red}
                                      >
                                        {JSON.parse(expense.contract_fees).map(
                                          (fee, i) => {
                                            return (
                                              <div style={red}>
                                                {fee.fee_type == "%"
                                                  ? "$" +
                                                    (
                                                      expense.amount_paid /
                                                        (1 -
                                                          parseInt(fee.charge) /
                                                            100) -
                                                      expense.amount_paid
                                                    ).toFixed(2)
                                                  : ""}
                                              </div>
                                            );
                                          }
                                        )}
                                      </TableCell>
                                    ) : (
                                      <TableCell width="180px" align="right">
                                        ${expense.amount_paid.toFixed(2)}
                                      </TableCell>
                                    )}

                                    {expense.purchase_status === "UNPAID" &&
                                    expense.contract_fees != undefined ? (
                                      <TableCell
                                        width="180px"
                                        align="right"
                                        style={red}
                                      >
                                        {JSON.parse(expense.contract_fees).map(
                                          (fee, i) => {
                                            return (
                                              <div style={red}>
                                                {fee.fee_type == "%"
                                                  ? "$" +
                                                    (
                                                      expense.amount_due /
                                                        (1 -
                                                          parseInt(fee.charge) /
                                                            100) -
                                                      expense.amount_due
                                                    ).toFixed(2)
                                                  : ""}
                                              </div>
                                            );
                                          }
                                        )}
                                      </TableCell>
                                    ) : (
                                      <TableCell width="180px" align="right">
                                        ${expense.amount_due.toFixed(2)}
                                      </TableCell>
                                    )}
                                    {expense.contract_fees != undefined ? (
                                      <TableCell
                                        width="180px"
                                        align="right"
                                        style={red}
                                      >
                                        {JSON.parse(expense.contract_fees).map(
                                          (fee, i) => {
                                            return (
                                              <div style={red}>
                                                {fee.fee_type == "%"
                                                  ? "$" +
                                                    (
                                                      expense.amount_paid /
                                                        (1 -
                                                          parseInt(fee.charge) /
                                                            100) -
                                                      expense.amount_paid -
                                                      (expense.amount_due /
                                                        (1 -
                                                          parseInt(fee.charge) /
                                                            100) -
                                                        expense.amount_due)
                                                    ).toFixed(2)
                                                  : ""}
                                              </div>
                                            );
                                          }
                                        )}
                                      </TableCell>
                                    ) : (
                                      <TableCell width="180px" align="right">
                                        $
                                        {(
                                          expense.amount_paid -
                                          expense.amount_due
                                        ).toFixed(2)}
                                      </TableCell>
                                    )}

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
                                    {expense.purchase_frequency ==
                                    "Annually" ? (
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
                              $
                              {cashflowData.maintenance_year_expense.toFixed(2)}
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
                            cashflowData.owner_expense_yearly.map(
                              (expense, index) => {
                                return expense.purchase_type ===
                                  "MAINTENANCE" ? (
                                  <TableRow hidden={!yearlyMaintenance}>
                                    <TableCell>
                                      &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                      {expense.unit}
                                      <br />
                                      &nbsp;&nbsp;&nbsp; {
                                        expense.description
                                      }{" "}
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
                                    {expense.purchase_frequency ==
                                    "Annually" ? (
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
                            cashflowData.owner_expense_yearly.map(
                              (expense, index) => {
                                return expense.purchase_type === "REPAIRS" ? (
                                  <TableRow hidden={!yearlyRepairs}>
                                    <TableCell>
                                      &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                      {expense.unit}
                                      <br />
                                      &nbsp;&nbsp;&nbsp; {
                                        expense.description
                                      }{" "}
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
                                    {expense.purchase_frequency ==
                                    "Annually" ? (
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
                            cashflowData.owner_utility_year_expense_individual.map(
                              (expense, index) => {
                                return expense.purchase_type === "UTILITY" ? (
                                  <TableRow hidden={!yearlyUtilityExpense}>
                                    <TableCell>
                                      &nbsp;&nbsp;&nbsp; {expense.address}{" "}
                                      {expense.unit}
                                      <br />
                                      &nbsp;&nbsp;&nbsp; {
                                        expense.description
                                      }{" "}
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
                                    {expense.purchase_frequency ==
                                    "Annually" ? (
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
                              &nbsp;&nbsp; Mortgage{" "}
                              <img
                                src={SortLeft}
                                hidden={yearlyMortgage}
                                onClick={() =>
                                  setYearlyMortgage(!yearlyMortgage)
                                }
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  float: "right",
                                }}
                              />
                              <img
                                src={SortDown}
                                hidden={!yearlyMortgage}
                                onClick={() =>
                                  setYearlyMortgage(!yearlyMortgage)
                                }
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
                              $
                              {cashflowData.amortized_mortgage_year_expense.toFixed(
                                2
                              )}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {cashflowData.amortized_mortgage_year_expense.toFixed(
                                2
                              )}
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
                                      {
                                        JSON.parse(expense.mortgages).frequency
                                      }{" "}
                                      <br />
                                      &nbsp;&nbsp;&nbsp;{" "}
                                      {
                                        JSON.parse(expense.mortgages)
                                          .frequency_of_payment
                                      }
                                    </TableCell>

                                    <TableCell width="180px" align="right">
                                      $
                                      {expense.mortgage_year_expense.toFixed(2)}
                                    </TableCell>

                                    <TableCell width="180px" align="right">
                                      $
                                      {expense.mortgage_year_expense.toFixed(2)}
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
                                src={SortLeft}
                                hidden={yearlyTaxes}
                                onClick={() => setYearlyTaxes(!yearlyTaxes)}
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  float: "right",
                                }}
                              />
                              <img
                                src={SortDown}
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
                              $
                              {cashflowData.amortized_taxes_year_expense.toFixed(
                                2
                              )}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {cashflowData.amortized_taxes_year_expense.toFixed(
                                2
                              )}
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
                                      &nbsp;&nbsp;&nbsp; {
                                        expense.frequency
                                      }{" "}
                                      <br />
                                      &nbsp;&nbsp;&nbsp;{" "}
                                      {expense.frequency_of_payment}
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
                                      $
                                      {expense.amortized_taxes_year_expense.toFixed(
                                        2
                                      )}
                                    </TableCell>

                                    <TableCell width="180px" align="right">
                                      $
                                      {expense.amortized_taxes_year_expense.toFixed(
                                        2
                                      )}
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
                                src={SortLeft}
                                hidden={yearlyInsurance}
                                onClick={() =>
                                  setYearlyInsurance(!yearlyInsurance)
                                }
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  float: "right",
                                }}
                              />
                              <img
                                src={SortDown}
                                hidden={!yearlyInsurance}
                                onClick={() =>
                                  setYearlyInsurance(!yearlyInsurance)
                                }
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
                              {cashflowData.amortized_insurance_year_expense.toFixed(
                                2
                              )}
                            </TableCell>
                            <TableCell width="180px" align="right">
                              $
                              {cashflowData.amortized_insurance_year_expense.toFixed(
                                2
                              )}
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
                                      &nbsp;&nbsp;&nbsp; {
                                        expense.frequency
                                      }{" "}
                                      <br />
                                      &nbsp;&nbsp;&nbsp;{" "}
                                      {expense.frequency_of_payment}
                                    </TableCell>

                                    <TableCell width="180px" align="right">
                                      $
                                      {expense.insurance_year_expense.toFixed(
                                        2
                                      )}
                                    </TableCell>

                                    <TableCell width="180px" align="right">
                                      $
                                      {expense.insurance_year_expense.toFixed(
                                        2
                                      )}
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
                        <h3>Property Summary</h3>
                      </Col>
                      <Col>
                        <img
                          src={EditIconNew}
                          onClick={() => {
                            window.scrollTo(0, 0);
                            setEditProperty(true);
                          }}
                          style={{
                            width: "30px",
                            height: "30px",
                            float: "right",
                            marginRight: "5rem",
                          }}
                        />
                      </Col>
                    </Row>

                    <Row className="m-3" style={{ overflow: "scroll" }}>
                      <div>
                        <Table
                          classes={{ root: classes.customTable }}
                          size="small"
                          responsive="md"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Property Images</TableCell>
                              <TableCell>Street Address</TableCell>
                              <TableCell>City,State</TableCell>
                              <TableCell>Zip</TableCell>
                              <TableCell>Tenant</TableCell>
                              <TableCell>Rent Status</TableCell>
                              <TableCell>Rent</TableCell>{" "}
                              <TableCell>$/SqFt</TableCell>{" "}
                              <TableCell>Type</TableCell>{" "}
                              <TableCell>Size</TableCell>
                              <TableCell>Property Manager</TableCell>
                              <TableCell>Lease End</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
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
                                  window.scrollTo(0, 1500);
                                  setEditProperty(true);
                                }}
                              >
                                {JSON.parse(property.images).length > 0 ? (
                                  <img
                                    key={Date.now()}
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
                                  window.scrollTo(0, 0);
                                  setEditProperty(true);
                                }}
                              >
                                {property.address}
                                {property.unit !== ""
                                  ? " " + property.unit
                                  : ""}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  window.scrollTo(0, 0);
                                  setEditProperty(true);
                                }}
                              >
                                {property.city}, {property.state}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  window.scrollTo(0, 0);
                                  setEditProperty(true);
                                }}
                              >
                                {property.zip}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {property.rentalInfo.length !== 0
                                  ? property.rentalInfo[0].tenant_first_name +
                                    " " +
                                    property.rentalInfo[0].tenant_last_name
                                  : "None"}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {property.rent_paid !== ""
                                  ? property.rent_paid
                                  : "None"}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  window.scrollTo(0, 800);
                                  setEditProperty(true);
                                }}
                              >
                                {"$" + property.listed_rent}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  window.scrollTo(0, 800);
                                  setEditProperty(true);
                                }}
                              >
                                ${property.per_sqft}
                              </TableCell>

                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  window.scrollTo(0, 800);
                                  setEditProperty(true);
                                }}
                              >
                                {property.property_type}
                              </TableCell>

                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  window.scrollTo(0, 800);
                                  setEditProperty(true);
                                }}
                              >
                                {property.num_beds + "/" + property.num_baths}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {property.property_manager.length !== 0
                                  ? property.property_manager[0]
                                      .manager_business_name
                                  : "None"}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {property.rentalInfo.length !== 0
                                  ? property.rentalInfo[0].lease_end
                                  : "None"}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Table
                          classes={{ root: classes.customTable }}
                          size="small"
                          responsive="md"
                        >
                          {" "}
                          <TableRow>
                            <TableCell style={{ width: "136px" }}>
                              Description
                            </TableCell>
                            <TableCell>
                              {property.description == "null" ||
                              property.description == "" ||
                              property.description == null
                                ? "Not Available"
                                : property.description}
                            </TableCell>
                          </TableRow>
                        </Table>
                      </div>
                    </Row>
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
                        {" "}
                        <img
                          src={AddIcon}
                          onClick={() => {
                            window.scrollTo(0, 0);
                            setShowAddRequest(true);
                          }}
                          style={{
                            width: "30px",
                            height: "30px",
                            float: "right",
                            marginRight: "5rem",
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="m-3" style={{ overflow: "scroll" }}>
                      {property.maintenanceRequests.length > 0 ? (
                        <div>
                          <Table
                            classes={{ root: classes.customTable }}
                            size="small"
                            responsive="md"
                          >
                            <EnhancedTableHeadMaintenance
                              order={order}
                              orderBy={orderBy}
                              onRequestSort={handleRequestSort}
                              rowCount={property.maintenanceRequests.length}
                            />{" "}
                            <TableBody>
                              {stableSort(
                                property.maintenanceRequests,
                                getComparator(order, orderBy)
                              ).map((request, index) => {
                                return (
                                  <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={request.maintenance_request_uid}
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
                                    <TableCell
                                      padding="none"
                                      size="small"
                                      align="center"
                                    >
                                      {JSON.parse(request.images).length > 0 ? (
                                        <img
                                          src={JSON.parse(request.images)[0]}
                                          alt="Repair"
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
                                      style={{
                                        color:
                                          request.title === "New"
                                            ? "green"
                                            : "black",
                                      }}
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
                                      {request.request_created_date}
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
                                      request.assigned_business !== "null"
                                        ? request.assigned_business
                                        : "None"}
                                    </TableCell>

                                    <TableCell
                                      padding="none"
                                      size="small"
                                      align="center"
                                    >
                                      {request.scheduled_date !== null &&
                                      request.scheduled_date !== "null"
                                        ? request.scheduled_date
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
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div>No maintenance or repair requests</div>
                      )}
                    </Row>
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
                        <h3>Appliances</h3>
                      </Col>
                      <Col>
                        <img
                          src={EditIconNew}
                          onClick={() => {
                            window.scrollTo(0, 1000);
                            setEditProperty(true);
                          }}
                          style={{
                            width: "30px",
                            height: "30px",
                            float: "right",
                            marginRight: "5rem",
                          }}
                        />
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
                            <TableRow>
                              <TableCell>Appliance</TableCell>
                              <TableCell>Name</TableCell>
                              <TableCell>Purchased From</TableCell>
                              <TableCell>Purchased On</TableCell>
                              <TableCell>Purchase Order Number</TableCell>
                              <TableCell>Installed On</TableCell>
                              <TableCell>Serial Number</TableCell>
                              <TableCell>Model Number</TableCell>
                              <TableCell>Warranty Till</TableCell>
                              <TableCell>Warranty Info</TableCell>
                              <TableCell>Images</TableCell>
                            </TableRow>
                          </TableHead>
                          {console.log(
                            "appliances",
                            appliances,
                            applianceState
                          )}
                          <TableBody>
                            {appliances.map((appliance, i) => {
                              return applianceState[0][appliance][
                                "available"
                              ] == true ||
                                applianceState[0][appliance]["available"] ==
                                  "True" ? (
                                <TableRow
                                  onClick={() => {
                                    window.scrollTo(0, 1000);
                                    setEditProperty(true);
                                  }}
                                >
                                  <TableCell>{appliance}</TableCell>
                                  <TableCell>
                                    {applianceState[0][appliance]["name"]}
                                  </TableCell>
                                  <TableCell>
                                    {
                                      applianceState[0][appliance][
                                        "purchased_from"
                                      ]
                                    }
                                  </TableCell>
                                  <TableCell>
                                    {applianceState[0][appliance]["purchased"]}
                                  </TableCell>
                                  <TableCell>
                                    {
                                      applianceState[0][appliance][
                                        "purchased_order"
                                      ]
                                    }
                                  </TableCell>
                                  <TableCell>
                                    {applianceState[0][appliance]["installed"]}
                                  </TableCell>
                                  <TableCell>
                                    {applianceState[0][appliance]["serial_num"]}
                                  </TableCell>
                                  <TableCell>
                                    {applianceState[0][appliance]["model_num"]}
                                  </TableCell>
                                  <TableCell>
                                    {
                                      applianceState[0][appliance][
                                        "warranty_till"
                                      ]
                                    }
                                  </TableCell>
                                  <TableCell>
                                    {
                                      applianceState[0][appliance][
                                        "warranty_info"
                                      ]
                                    }
                                  </TableCell>

                                  {applianceState[0][appliance]["images"] !==
                                    undefined &&
                                  applianceState[0][appliance]["images"]
                                    .length > 0 ? (
                                    <TableCell>
                                      {console.log(
                                        applianceState[0][appliance][
                                          "images"
                                        ][0]
                                      )}
                                      <Row className="d-flex justify-content-center align-items-center p-1">
                                        <Col className="d-flex justify-content-center align-items-center p-0 m-0">
                                          <img
                                            key={Date.now()}
                                            src={`${
                                              applianceState[0][appliance][
                                                "images"
                                              ][0]
                                            }?${Date.now()}`}
                                            style={{
                                              borderRadius: "4px",
                                              objectFit: "contain",
                                              width: "50px",
                                              height: "50px",
                                            }}
                                            alt="Property"
                                          />
                                        </Col>
                                      </Row>
                                    </TableCell>
                                  ) : (
                                    <TableCell>None</TableCell>
                                  )}
                                </TableRow>
                              ) : (
                                ""
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </Row>
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
                        <h3>Other Info</h3>
                      </Col>
                      <Col xs={2}></Col>
                    </Row>
                    <Row className="m-3">
                      <div>
                        <Table
                          classes={{ root: classes.customTable }}
                          size="small"
                          responsive="md"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Utilities</TableCell>
                              <TableCell>Electricity</TableCell>
                              <TableCell>Trash</TableCell>
                              <TableCell>Water</TableCell>
                              <TableCell>Wifi </TableCell>
                              <TableCell>Gas</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Paid by</TableCell>
                              <TableCell>
                                {JSON.parse(property.utilities)["Electricity"]
                                  ? "Owner"
                                  : "Tenant"}
                              </TableCell>
                              <TableCell>
                                {JSON.parse(property.utilities)["Trash"]
                                  ? "Owner"
                                  : "Tenant"}
                              </TableCell>
                              <TableCell>
                                {JSON.parse(property.utilities)["Water"]
                                  ? "Owner"
                                  : "Tenant"}
                              </TableCell>
                              <TableCell>
                                {JSON.parse(property.utilities)["Wifi"]
                                  ? "Owner"
                                  : "Tenant"}
                              </TableCell>
                              <TableCell>
                                {JSON.parse(property.utilities)["Gas"]
                                  ? "Owner"
                                  : "Tenant"}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </Row>
                    <Row className="m-3">
                      <div>
                        <Table
                          classes={{ root: classes.customTable }}
                          size="small"
                          responsive="md"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Pets Allowed</TableCell>
                              <TableCell>
                                Deposit can be used for last month's rent
                              </TableCell>
                              <TableCell>Available to Rent</TableCell>
                              <TableCell>Featured</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                {property.pets_allowed == 0 ? "No" : "Yes"}
                              </TableCell>
                              <TableCell>
                                {property.deposit_for_rent == 0 ? "No" : "Yes"}
                              </TableCell>
                              <TableCell>
                                {property.available_to_rent == 0 ? "No" : "Yes"}
                              </TableCell>
                              <TableCell>
                                {property.featured ? "No" : "Yes"}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </Row>
                  </div>

                  {Object.keys(property.managerInfo).length !== 0 ? (
                    <div
                      className="mx-3 my-3 p-2"
                      style={{
                        background: "#E9E9E9 0% 0% no-repeat padding-box",
                        borderRadius: "10px",
                        opacity: 1,
                      }}
                    >
                      <Row className="m-3" style={{ overflow: "scroll" }}>
                        {property.management_status === "ACCEPTED" ||
                        property.management_status === "OWNER END EARLY" ||
                        property.management_status === "PM END EARLY" ? (
                          <div>
                            <Row>
                              <Col>
                                <h3>Property Management Agreement</h3>
                              </Col>
                              <Col xs={2}></Col>
                            </Row>
                            <Table
                              responsive="md"
                              classes={{ root: classes.customTable }}
                              size="small"
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center">
                                    Business Name
                                  </TableCell>
                                  <TableCell>Contract Name</TableCell>
                                  <TableCell>Start Date</TableCell>
                                  <TableCell>End Date</TableCell>
                                  <TableCell align="center">Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    {property.managerInfo.manager_business_name}
                                  </TableCell>

                                  {contracts.map((contract, i) =>
                                    contract.business_uid ===
                                    property.managerInfo.manager_id ? (
                                      contract.contract_name != null ? (
                                        <TableCell>
                                          {contract.contract_name}{" "}
                                        </TableCell>
                                      ) : (
                                        <TableCell>Contract {i + 1} </TableCell>
                                      )
                                    ) : (
                                      ""
                                    )
                                  )}

                                  {contracts.map((contract, i) =>
                                    contract.business_uid ===
                                    property.managerInfo.manager_id ? (
                                      <TableCell>
                                        {contract.start_date}
                                      </TableCell>
                                    ) : (
                                      ""
                                    )
                                  )}
                                  {contracts.map((contract, i) =>
                                    contract.business_uid ===
                                    property.managerInfo.manager_id ? (
                                      <TableCell>{contract.end_date}</TableCell>
                                    ) : (
                                      ""
                                    )
                                  )}

                                  <TableCell>
                                    <a
                                      href={`tel:${property.managerInfo.manager_phone_number}`}
                                    >
                                      <img
                                        src={Phone}
                                        alt="Phone"
                                        style={smallImg}
                                      />
                                    </a>
                                    <a
                                      href={`mailto:${property.managerInfo.manager_email}`}
                                    >
                                      <img
                                        src={Message}
                                        alt="Message"
                                        style={smallImg}
                                      />
                                    </a>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          ""
                        )}
                        {property.management_status === "ACCEPTED" ||
                        property.management_status === "OWNER END EARLY" ||
                        property.management_status === "PM END EARLY" ? (
                          <div>
                            <Row className="mt-1">
                              <h5>Property Manager Documents</h5>
                            </Row>
                            <div>
                              <Table
                                responsive="md"
                                classes={{ root: classes.customTable }}
                                size="small"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Document Name</TableCell>
                                    <TableCell>View Document</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {contracts.map((contract, i) =>
                                    contract.business_uid ===
                                    property.managerInfo.manager_id ? (
                                      JSON.parse(contract.documents).length ===
                                      0 ? (
                                        <TableRow>
                                          <TableCell> No documents </TableCell>
                                          <TableCell></TableCell>
                                        </TableRow>
                                      ) : (
                                        JSON.parse(contract.documents).map(
                                          (file) => {
                                            return (
                                              <TableRow>
                                                {file.description !== "" ? (
                                                  <TableCell>
                                                    {file.description}
                                                  </TableCell>
                                                ) : (
                                                  <TableCell>
                                                    Document {i + 1}{" "}
                                                  </TableCell>
                                                )}
                                                <TableCell>
                                                  <a
                                                    href={file.link}
                                                    target="_blank"
                                                  >
                                                    <img
                                                      src={File}
                                                      style={{
                                                        width: "15px",
                                                        height: "15px",
                                                      }}
                                                    />
                                                  </a>
                                                </TableCell>
                                              </TableRow>
                                            );
                                          }
                                        )
                                      )
                                    ) : (
                                      ""
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </div>

                            <Row className="mt-1">
                              <h5>Property Manager Fee Details</h5>
                            </Row>
                            {contracts.map((contract, i) =>
                              contract.business_uid ===
                              property.managerInfo.manager_id ? (
                                <ManagerFees
                                  feeState={JSON.parse(contract.contract_fees)}
                                  setFeeState={setFeeState}
                                />
                              ) : (
                                ""
                              )
                            )}
                          </div>
                        ) : (
                          ""
                        )}

                        {contracts.map((contract, i) =>
                          contract.business_uid ===
                          property.managerInfo.manager_id ? (
                            JSON.parse(contract.assigned_contacts).length ===
                            0 ? (
                              ""
                            ) : (
                              <Row className="mt-1">
                                <h5>Property Manager Contact Details</h5>
                              </Row>
                            )
                          ) : (
                            ""
                          )
                        )}
                        {contracts.map((contract, i) =>
                          contract.business_uid ===
                          property.managerInfo.manager_id ? (
                            JSON.parse(contract.assigned_contacts).length ===
                            0 ? (
                              ""
                            ) : (
                              <BusinessContact state={contactState} />
                            )
                          ) : (
                            ""
                          )
                        )}

                        {property.management_status === "ACCEPTED" &&
                        !cancel ? (
                          <Row className="mt-4">
                            <Col className="d-flex justify-content-center mb-1">
                              <Button
                                variant="outline-primary"
                                style={redPillButton}
                                // onClick={() => {
                                //   setShowDialog2(true);
                                //   setPmID(property.managerInfo.manager_id);
                                // }}
                                onClick={() => setCancel(true)}
                              >
                                Cancel Agreement
                              </Button>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.management_status === "ACCEPTED" && cancel ? (
                          <Row className="mt-4">
                            <Col className="d-flex flex-column justify-content-center mb-1">
                              <Form.Group className="mx-2 mb-3">
                                <Form.Label as="h6">Early End Date</Form.Label>
                                <Form.Control
                                  style={squareForm}
                                  type="date"
                                  value={endEarlyDate}
                                  onChange={(e) =>
                                    setEndEarlyDate(e.target.value)
                                  }
                                />
                              </Form.Group>
                              <Button
                                variant="outline-primary"
                                style={redPillButton}
                                onClick={() => {
                                  setShowDialog2(true);
                                  setPmID(property.managerInfo.manager_id);
                                }}
                              >
                                Cancel Agreement
                              </Button>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.management_status === "OWNER END EARLY" ? (
                          <Row className="mt-4">
                            {contracts.map((contract, i) =>
                              contract.business_uid ===
                              property.managerInfo.manager_id ? (
                                contract.contract_name != null ? (
                                  <h6
                                    className="d-flex justify-content-center"
                                    style={mediumBold}
                                  >
                                    You have requested to end the agreement
                                    early on {contract.early_end_date}
                                  </h6>
                                ) : (
                                  ""
                                )
                              ) : (
                                ""
                              )
                            )}
                          </Row>
                        ) : (
                          ""
                        )}

                        {property.management_status === "PM END EARLY" ? (
                          <Row className="d-flex flex-grow-1 w-100 justify-content-center mt-3 mb-4">
                            {contracts.map((contract, i) =>
                              contract.business_uid ===
                              property.managerInfo.manager_id ? (
                                contract.contract_name != null ? (
                                  <h6
                                    className="d-flex justify-content-center"
                                    style={mediumBold}
                                  >
                                    Property Manager requested to end the
                                    agreement early on{" "}
                                    {contracts[0].early_end_date}
                                  </h6>
                                ) : (
                                  ""
                                )
                              ) : (
                                ""
                              )
                            )}

                            <Col className="d-flex justify-content-center">
                              <Button
                                variant="outline-primary"
                                style={bluePillButton}
                                onClick={acceptCancelAgreement}
                              >
                                Accept
                              </Button>
                            </Col>
                            <Col className="d-flex justify-content-center">
                              <Button
                                variant="outline-primary"
                                style={redPillButton}
                                onClick={rejectCancelAgreement}
                              >
                                Reject
                              </Button>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </Row>
                    </div>
                  ) : (
                    ""
                  )}

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
                          {Object.keys(property.managerInfo).length == 0 ||
                          property.management_status === "END EARLY"
                            ? "Select a Property Manager"
                            : "Change Property Manager"}
                        </h3>
                      </Col>
                      <Col>
                        {/* <img
                        src={AddIcon}
                        onClick={() => setShowCreateExpense(true)}
                        style={{
                          width: "30px",
                          height: "30px",
                          float: "right",
                          marginRight: "5rem",
                        }}
                      /> */}
                      </Col>
                    </Row>

                    {property.property_manager.length == 0 ? (
                      ""
                    ) : property.property_manager.length > 1 ? (
                      property.property_manager.map((p, i) =>
                        p.management_status === "REJECTED" ? (
                          ""
                        ) : p.management_status === "FORWARDED" ? (
                          <Row className="p-0 m-3">
                            <Row className="d-flex justify-content-between mt-3 mx-2">
                              <Col
                                xs={8}
                                className="d-flex justify-content-start flex-column"
                              >
                                <h6 style={mediumBold} className="mb-1">
                                  {p.manager_business_name}
                                </h6>
                                <p
                                  style={{ mediumBold, color: "blue" }}
                                  className="mb-1"
                                >
                                  Property Manager Selected
                                </p>
                              </Col>
                              <Col className="d-flex justify-content-end">
                                <a href={`tel:${p.manager_phone_number}`}>
                                  <img
                                    src={Phone}
                                    alt="Phone"
                                    style={smallImg}
                                  />
                                </a>
                                <a href={`mailto:${p.manager_email}`}>
                                  <img
                                    src={Message}
                                    alt="Message"
                                    style={smallImg}
                                  />
                                </a>
                              </Col>
                            </Row>
                            <Row className="mt-4">
                              <Col
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-evenly",
                                  marginBottom: "25px",
                                }}
                              >
                                <Button
                                  // onClick={rejectPropertyManager}
                                  onClick={() => {
                                    setShowDialog(true);
                                    setPmID(p.manager_id);
                                  }}
                                  variant="outline-primary"
                                  style={redPillButton}
                                >
                                  Reject
                                </Button>
                              </Col>
                            </Row>
                          </Row>
                        ) : (
                          ""
                        )
                      )
                    ) : property.property_manager[0].management_status ===
                      "FORWARDED" ? (
                      <Row className="p-0 m-3">
                        <Row className="d-flex justify-content-between mt-3">
                          <Col
                            xs={8}
                            className="d-flex flex-column justify-content-start p-0"
                          >
                            <Row>
                              <h6 style={mediumBold} className="mb-1">
                                {
                                  property.property_manager[0]
                                    .manager_business_name
                                }
                              </h6>
                            </Row>
                          </Col>
                          <Col className="d-flex justify-content-end">
                            <a
                              href={`tel:${property.property_manager[0].manager_phone_number}`}
                            >
                              <img src={Phone} alt="Phone" style={smallImg} />
                            </a>
                            <a
                              href={`mailto:${property.property_manager[0].manager_email}`}
                            >
                              <img
                                src={Message}
                                alt="Message"
                                style={smallImg}
                              />
                            </a>
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-evenly",
                              marginBottom: "25px",
                            }}
                          >
                            <Button
                              // onClick={rejectPropertyManager}
                              onClick={() => {
                                setShowDialog(true);
                                setPmID(
                                  property.property_manager[0].manager_id
                                );
                              }}
                              variant="outline-primary"
                              style={redPillButton}
                            >
                              Reject
                            </Button>
                          </Col>
                        </Row>
                      </Row>
                    ) : (
                      ""
                    )}
                    {property.property_manager.length == 0 ? (
                      ""
                    ) : property.property_manager.length > 1 ? (
                      property.property_manager.map((p, i) =>
                        p.management_status === "REJECTED" ? (
                          ""
                        ) : p.management_status === "SENT" ? (
                          <div>
                            <Row className="m-3" style={{ overflow: "scroll" }}>
                              <div>
                                <Table
                                  responsive="md"
                                  classes={{ root: classes.customTable }}
                                  size="small"
                                >
                                  <TableHead>
                                    <TableRow>
                                      <TableCell align="center">
                                        Business Name
                                      </TableCell>
                                      <TableCell>Contract Name</TableCell>
                                      <TableCell>Start Date</TableCell>
                                      <TableCell>End Date</TableCell>
                                      <TableCell align="center">
                                        Actions
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell>
                                        <h6 style={mediumBold} className="mb-1">
                                          {p.manager_business_name}
                                        </h6>
                                        <p
                                          style={{
                                            mediumBold,
                                            color: "#41fc03",
                                          }}
                                          className="mb-1"
                                        >
                                          Contract in Review
                                        </p>
                                      </TableCell>
                                      {contracts.map((contract, i) =>
                                        contract.business_uid ===
                                        p.manager_id ? (
                                          contract.contract_name != null ? (
                                            <TableCell>
                                              {contract.contract_name}{" "}
                                            </TableCell>
                                          ) : (
                                            <TableCell>
                                              Contract {i + 1}{" "}
                                            </TableCell>
                                          )
                                        ) : (
                                          ""
                                        )
                                      )}

                                      {contracts.map((contract, i) =>
                                        contract.business_uid ===
                                        p.manager_id ? (
                                          <TableCell>
                                            {contract.start_date}
                                          </TableCell>
                                        ) : (
                                          ""
                                        )
                                      )}
                                      {contracts.map((contract, i) =>
                                        contract.business_uid ===
                                        p.manager_id ? (
                                          <TableCell>
                                            {contract.end_date}
                                          </TableCell>
                                        ) : (
                                          ""
                                        )
                                      )}

                                      <TableCell>
                                        <a
                                          href={`tel:${property.managerInfo.manager_phone_number}`}
                                        >
                                          <img
                                            src={Phone}
                                            alt="Phone"
                                            style={smallImg}
                                          />
                                        </a>
                                        <a
                                          href={`mailto:${property.managerInfo.manager_email}`}
                                        >
                                          <img
                                            src={Message}
                                            alt="Message"
                                            style={smallImg}
                                          />
                                        </a>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </Row>
                            <Row className="mt-1">
                              <h5>Property Manager Documents</h5>
                            </Row>
                            <div>
                              <Table
                                responsive="md"
                                classes={{ root: classes.customTable }}
                                size="small"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Document Name</TableCell>
                                    <TableCell>View Document</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {contracts.map((contract, i) =>
                                    contract.business_uid === p.manager_id ? (
                                      JSON.parse(contract.documents).length ===
                                      0 ? (
                                        <TableRow>
                                          <TableCell> No documents </TableCell>
                                          <TableCell></TableCell>
                                        </TableRow>
                                      ) : (
                                        JSON.parse(contract.documents).map(
                                          (file) => {
                                            return (
                                              <TableRow>
                                                {file.description !== "" ? (
                                                  <TableCell>
                                                    {file.description}
                                                  </TableCell>
                                                ) : (
                                                  <TableCell>
                                                    Document {i + 1}{" "}
                                                  </TableCell>
                                                )}
                                                <TableCell>
                                                  <a
                                                    href={file.link}
                                                    target="_blank"
                                                  >
                                                    <img
                                                      src={File}
                                                      style={{
                                                        width: "15px",
                                                        height: "15px",
                                                      }}
                                                    />
                                                  </a>
                                                </TableCell>
                                              </TableRow>
                                            );
                                          }
                                        )
                                      )
                                    ) : (
                                      ""
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </div>

                            <Row className="mt-1">
                              <h5>Property Manager Fee Details</h5>
                            </Row>
                            {contracts.map((contract, i) =>
                              contract.business_uid === p.manager_id ? (
                                <ManagerFees
                                  feeState={JSON.parse(contract.contract_fees)}
                                  setFeeState={setFeeState}
                                />
                              ) : (
                                ""
                              )
                            )}
                            <Row className="mt-1">
                              <h5>Property Manager Contact Details</h5>
                            </Row>
                            {contracts.map((contract, i) =>
                              contract.business_uid === p.manager_id ? (
                                JSON.parse(contract.assigned_contacts)
                                  .length === 0 ? (
                                  ""
                                ) : (
                                  <BusinessContact state={contactState} />
                                )
                              ) : (
                                ""
                              )
                            )}

                            <Row className="mt-4">
                              <Col
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-evenly",
                                  marginBottom: "25px",
                                }}
                              >
                                <Button
                                  onClick={() => {
                                    setPmID(p.manager_id);
                                    approvePropertyManager(p.manager_id);
                                  }}
                                  variant="outline-primary"
                                  style={bluePillButton}
                                >
                                  Approve
                                </Button>
                              </Col>
                              <Col
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-evenly",
                                  marginBottom: "25px",
                                }}
                              >
                                <Button
                                  // onClick={rejectPropertyManager}
                                  onClick={() => {
                                    setShowDialog(true);
                                    setPmID(p.manager_id);
                                  }}
                                  variant="outline-primary"
                                  style={redPillButton}
                                >
                                  Reject
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        ) : (
                          ""
                        )
                      )
                    ) : property.property_manager[0].management_status ===
                      "SENT" ? (
                      <Row className="p-0 m-3">
                        <div>
                          <Table
                            responsive="md"
                            classes={{ root: classes.customTable }}
                            size="small"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">
                                  Business Name
                                </TableCell>
                                <TableCell>Contract Name</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell align="center">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <h6 style={mediumBold} className="mb-1">
                                    {
                                      property.property_manager[0]
                                        .manager_business_name
                                    }
                                  </h6>
                                  <p
                                    style={{ mediumBold, color: "#41fc03" }}
                                    className="mb-1"
                                  >
                                    Contract in Review
                                  </p>
                                </TableCell>
                                {contracts.map((contract, i) =>
                                  contract.business_uid ===
                                  property.property_manager[0].manager_id ? (
                                    contract.contract_name != null ? (
                                      <TableCell>
                                        {contract.contract_name}{" "}
                                      </TableCell>
                                    ) : (
                                      <TableCell>Contract {i + 1} </TableCell>
                                    )
                                  ) : (
                                    ""
                                  )
                                )}

                                {contracts.map((contract, i) =>
                                  contract.business_uid ===
                                  property.property_manager[0].manager_id ? (
                                    <TableCell>{contract.start_date}</TableCell>
                                  ) : (
                                    ""
                                  )
                                )}
                                {contracts.map((contract, i) =>
                                  contract.business_uid ===
                                  property.property_manager[0].manager_id ? (
                                    <TableCell>{contract.end_date}</TableCell>
                                  ) : (
                                    ""
                                  )
                                )}

                                <TableCell>
                                  <a
                                    href={`tel:${property.managerInfo.manager_phone_number}`}
                                  >
                                    <img
                                      src={Phone}
                                      alt="Phone"
                                      style={smallImg}
                                    />
                                  </a>
                                  <a
                                    href={`mailto:${property.managerInfo.manager_email}`}
                                  >
                                    <img
                                      src={Message}
                                      alt="Message"
                                      style={smallImg}
                                    />
                                  </a>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <Row className="mt-1">
                          <h5>Property Manager Documents</h5>
                        </Row>
                        <div>
                          <Table
                            responsive="md"
                            classes={{ root: classes.customTable }}
                            size="small"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Document Name</TableCell>
                                <TableCell>View Document</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {contracts.map((contract, i) =>
                                contract.business_uid ===
                                property.property_manager[0].manager_id ? (
                                  JSON.parse(contract.documents).length ===
                                  0 ? (
                                    <TableRow>
                                      <TableCell> No documents </TableCell>
                                      <TableCell></TableCell>
                                    </TableRow>
                                  ) : (
                                    JSON.parse(contract.documents).map(
                                      (file) => {
                                        return (
                                          <TableRow>
                                            {file.description !== "" ? (
                                              <TableCell>
                                                {file.description}
                                              </TableCell>
                                            ) : (
                                              <TableCell>
                                                Document {i + 1}{" "}
                                              </TableCell>
                                            )}
                                            <TableCell>
                                              <a
                                                href={file.link}
                                                target="_blank"
                                              >
                                                <img
                                                  src={File}
                                                  style={{
                                                    width: "15px",
                                                    height: "15px",
                                                  }}
                                                />
                                              </a>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      }
                                    )
                                  )
                                ) : (
                                  ""
                                )
                              )}
                            </TableBody>
                          </Table>
                        </div>

                        <Row className="mt-1">
                          <h5>Property Manager Fee Details</h5>
                        </Row>
                        {contracts.map((contract, i) =>
                          contract.business_uid ===
                          property.property_manager[0].manager_id ? (
                            <ManagerFees
                              feeState={JSON.parse(contract.contract_fees)}
                              setFeeState={setFeeState}
                            />
                          ) : (
                            ""
                          )
                        )}
                        <Row className="mt-1">
                          <h5>Property Manager Contact Details</h5>
                        </Row>
                        {contracts.map((contract, i) =>
                          contract.business_uid ===
                          property.property_manager[0].manager_id ? (
                            JSON.parse(contract.assigned_contacts).length ===
                            0 ? (
                              ""
                            ) : (
                              <BusinessContact state={contactState} />
                            )
                          ) : (
                            ""
                          )
                        )}

                        <Row className="mt-4">
                          <Col
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-evenly",
                              marginBottom: "25px",
                            }}
                          >
                            <Button
                              onClick={() => {
                                setPmID(
                                  property.property_manager[0].manager_id
                                );
                                approvePropertyManager(
                                  property.property_manager[0].manager_id
                                );
                              }}
                              style={bluePillButton}
                            >
                              Approve
                            </Button>
                          </Col>
                          <Col
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-evenly",
                              marginBottom: "25px",
                            }}
                          >
                            <Button
                              // onClick={rejectPropertyManager}
                              onClick={() => {
                                setShowDialog(true);
                                setPmID(
                                  property.property_manager[0].manager_id
                                );
                              }}
                              variant="outline-primary"
                              style={redPillButton}
                            >
                              Reject
                            </Button>
                          </Col>
                        </Row>
                      </Row>
                    ) : (
                      ""
                    )}
                    <ManagerDocs
                      property={property}
                      addDocument={addContract}
                      selectContract={selectContract}
                      // reload={reloadProperty}
                      // setStage={setStage}
                    />
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
                        <h3>Tenant Info</h3>
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row className="m-3" style={{ overflow: "scroll" }}>
                      {rentalInfo.length > 0 ? (
                        <div>
                          <Table
                            responsive="md"
                            classes={{ root: classes.customTable }}
                            size="small"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Lease Start Date</TableCell>
                                <TableCell>Lease End Date</TableCell>
                                <TableCell>Tenant Payments</TableCell>
                                <TableCell>Lease Docs</TableCell>
                                <TableCell>Tenant Name</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rentalInfo.map((rf) => {
                                return (
                                  <TableRow>
                                    <TableCell>{rf.lease_start}</TableCell>
                                    <TableCell>{rf.lease_end}</TableCell>
                                    <TableCell>
                                      {JSON.parse(rf.rent_payments).map(
                                        (rp) => {
                                          return (
                                            <Row className="d-flex align-items-center p-2">
                                              {rp.fee_name}: ${rp.charge}
                                            </Row>
                                          );
                                        }
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {JSON.parse(rf.documents).map((rp) => {
                                        return (
                                          <Row className="d-flex align-items-center p-2">
                                            <Col
                                              className=" d-flex align-items-left"
                                              style={{
                                                font: "normal normal 600 18px Bahnschrift-Regular",
                                                color: "#007AFF",
                                                textDecoration: "underline",
                                              }}
                                            >
                                              {rp.description}
                                            </Col>
                                            <Col className=" d-flex justify-content-end">
                                              <a href={rp.link} target="_blank">
                                                <img src={File} />
                                              </a>
                                            </Col>
                                          </Row>
                                        );
                                      })}
                                    </TableCell>
                                    <TableCell>
                                      {tenantInfo.map((tf) => {
                                        return (
                                          <p>
                                            {" "}
                                            {tf.tenantFirstName}{" "}
                                            {tf.tenantLastName}
                                          </p>
                                        );
                                      })}
                                    </TableCell>
                                    <TableCell>
                                      {tenantInfo.map((tf) => {
                                        return (
                                          <Row>
                                            <Col className="d-flex justify-content-end">
                                              <a
                                                href={`tel:${tf.tenantPhoneNumber}`}
                                              >
                                                <img
                                                  src={Phone}
                                                  alt="Phone"
                                                  style={smallImg}
                                                />
                                              </a>
                                              <a
                                                href={`mailto:${tf.tenantEmail}`}
                                              >
                                                <img
                                                  src={Message}
                                                  alt="Message"
                                                  style={smallImg}
                                                />
                                              </a>
                                            </Col>
                                          </Row>
                                        );
                                      })}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div>Not rented</div>
                      )}
                    </Row>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-5">
          <OwnerFooter />
        </div>
      </div>
    )
  ) : (
    <div className="w-100 d-flex flex-column justify-content-center align-items-center h-50">
      <ReactBootStrap.Spinner animation="border" role="status" />
    </div>
  );
}

export default OwnerPropertyView;
