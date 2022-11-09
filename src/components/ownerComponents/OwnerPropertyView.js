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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import Header from "../Header";
import PropertyCashFlow from "../PropertyCashFlow";
import PropertyForm from "../PropertyForm";
import CreateExpense from "../CreateExpense";
import CreateRevenue from "../CreateRevenue";
import CreateTax from "../CreateTax";
import CreateMortgage from "../CreateMortgage";
import ManagerDocs from "../ManagerDocs";
import ManagementContract from "../ManagementContract";
import TenantAgreement from "../TenantAgreement";
import CreateInsurance from "../CreateInsurance";
import ConfirmDialog from "../ConfirmDialog";
import BusinessContact from "../BusinessContact";
import ManagerFees from "../ManagerFees";
import SideBar from "../ownerComponents/SideBar";
import AppContext from "../../AppContext";
import File from "../../icons/File.svg";
import BlueArrowUp from "../../icons/BlueArrowUp.svg";
import BlueArrowDown from "../../icons/BlueArrowDown.svg";
import OpenDoc from "../../icons/OpenDoc.svg";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import EditIconNew from "../../icons/EditIconNew.svg";
import AddIcon from "../../icons/AddIcon.svg";
import SortDown from "../../icons/Sort-down.svg";
import SortLeft from "../../icons/Sort-left.svg";
import { get, put } from "../../utils/api";
import {
  tileImg,
  squareForm,
  redPill,
  orangePill,
  greenPill,
  mediumBold,
  bluePillButton,
  redPillButton,
  smallImg,
  green,
  red,
} from "../../utils/styles";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

function OwnerPropertyView(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const property_uid = location.state.property_uid;
  const [isLoading, setIsLoading] = useState(true);
  // const { property_uid, back, reload, setStage } = props;
  const [property, setProperty] = useState({
    images: "[]",
  });

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
    // const response = await get(`/propertyInfo?property_uid=${property_uid}`);
    const response = await get(
      `/propertiesOwnerDetail?property_uid=${property_uid}`
    );
    console.log("property  in databse", response.result[0]);
    const cashflowResponse = await get(
      `/ownerCashflowProperty?property_id=${property_uid}`
    );

    setCashflowData(cashflowResponse.result);
    setIsLoading(false);
    setProperty(response.result[0]);
    applianceState[1](JSON.parse(response.result[0].appliances));
    console.log(applianceState);
    console.log(Object.keys(applianceState[0]));
    // setAppliances(Object.keys(applianceState[0]));
    const res = await get(
      `/contracts?property_uid=${response.result[0].property_uid}`
    );

    setContracts(res.result);
    setRentalInfo(response.result[0].rentalInfo);
    contactState[1](JSON.parse(res.result[0].assigned_contacts));
    let tenant = [];
    let ti = {};
    response.result[0].rentalInfo.map((rentalInfo) => {
      if (rentalInfo.tenant_first_name.includes(",")) {
        let tenant_fns = rentalInfo.tenant_first_name.split(",");
        let tenant_lns = rentalInfo.tenant_last_name.split(",");
        let tenant_emails = rentalInfo.tenant_email.split(",");
        let tenant_phones = rentalInfo.tenant_phone_number.split(",");
        console.log("tennat", tenant_fns);
        for (let i = 0; i < tenant_fns.length; i++) {
          ti["tenantFirstName"] = tenant_fns[i];
          ti["tenantLastName"] = tenant_lns[i];
          ti["tenantEmail"] = tenant_emails[i];
          ti["tenantPhoneNumber"] = tenant_phones[i];
          console.log("tennat", ti);
          tenant.push(ti);
          ti = {};
        }
        console.log("tennat", tenant);
      } else {
        ti = {
          tenantFirstName: rentalInfo.tenant_first_name,
          tenantLastName: rentalInfo.tenant_last_name,
          tenantEmail: rentalInfo.tenant_email,
          tenantPhoneNumber: rentalInfo.tenant_phone_number,
        };
        console.log("tennat", ti);
        tenant.push(ti);
      }
    });
    console.log("tennat", tenant);
    setTenantInfo(tenant);
  };
  useState(() => {
    fetchProperty();
  });

  const [pmID, setPmID] = useState("");
  const [currentImg, setCurrentImg] = useState(0);
  const [expandDetails, setExpandDetails] = useState(false);

  const [expandMaintenanceR, setExpandMaintenanceR] = useState(false);
  const [editProperty, setEditProperty] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [showCreateRevenue, setShowCreateRevenue] = useState(false);
  const [showCreateTax, setShowCreateTax] = useState(false);
  const [showCreateMortgage, setShowCreateMortgage] = useState(false);
  const [showCreateInsurance, setShowCreateInsurance] = useState(false);
  const [expandManagerDocs, setExpandManagerDocs] = useState(false);
  const [expandAddManagerDocs, setExpandAddManagerDocs] = useState(false);

  const [expandTenantInfo, setExpandTenantInfo] = useState(false);
  const [expandLeaseDocs, setExpandLeaseDocs] = useState(false);
  const [showManagementContract, setShowManagementContract] = useState(false);
  const [showTenantAgreement, setShowTenantAgreement] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialog2, setShowDialog2] = useState(false);

  const [cashflowData, setCashflowData] = useState([]);
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
  console.log("contract", contracts);
  const headerBack = () => {
    editProperty
      ? setEditProperty(false)
      : showCreateExpense
      ? setShowCreateExpense(false)
      : showCreateRevenue
      ? setShowCreateRevenue(false)
      : showCreateTax
      ? setShowCreateTax(false)
      : showCreateMortgage
      ? setShowCreateMortgage(false)
      : showCreateInsurance
      ? setShowCreateInsurance(false)
      : navigate("../owner");
    navigate("../owner");
  };

  const nextImg = () => {
    if (currentImg === JSON.parse(property.images).length - 1) {
      setCurrentImg(0);
    } else {
      setCurrentImg(currentImg + 1);
    }
  };
  const previousImg = () => {
    if (currentImg === 0) {
      setCurrentImg(JSON.parse(property.images).length - 1);
    } else {
      setCurrentImg(currentImg - 1);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [
    editProperty,
    showCreateExpense,
    showCreateRevenue,
    showCreateTax,
    showCreateMortgage,
    showCreateInsurance,
    showManagementContract,
    showTenantAgreement,
  ]);

  const reloadProperty = () => {
    setEditProperty(false);
    fetchProperty();
  };

  const cashFlowState = {
    setShowCreateExpense,
    setShowCreateRevenue,
    setShowCreateTax,
    setShowCreateMortgage,
    setShowCreateInsurance,
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

  const addAgreement = () => {
    setSelectedAgreement(null);
    setShowTenantAgreement(true);
  };
  const selectAgreement = (agreement) => {
    setSelectedAgreement(agreement);
    setShowTenantAgreement(true);
  };
  const closeAgreement = () => {
    fetchProperty();
    setShowTenantAgreement(false);
  };
  const approvePropertyManager = async (pID) => {
    const files = JSON.parse(property.images);
    let pid = pID;
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "ACCEPTED",
      manager_id: pid,
    };
    console.log(files);
    const response2 = await put(
      "/properties",
      updatedManagementContract,
      null,
      files
    );
    setExpandAddManagerDocs(!expandAddManagerDocs);
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
    // }
    const response2 = await put(
      "/properties",
      updatedManagementContract,
      null,
      files
    );
    setShowDialog(false);
    setExpandAddManagerDocs(!expandAddManagerDocs);
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

    const response2 = await put(
      "/cancelAgreement",
      updatedManagementContract,
      null,
      files
    );
    setShowDialog2(false);
    setExpandAddManagerDocs(!expandAddManagerDocs);
    reloadProperty();
  };
  const acceptCancelAgreement = async () => {
    const files = JSON.parse(property.images);
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "OWNER ACCEPTED",
      manager_id: property.managerInfo.manager_id,
    };

    await put("/cancelAgreement", updatedManagementContract, null, files);
    setExpandAddManagerDocs(!expandAddManagerDocs);
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
    setExpandAddManagerDocs(!expandAddManagerDocs);
    reloadProperty();
  };

  const onCancel = () => {
    setShowDialog(false);
  };
  const onCancel2 = () => {
    setShowDialog2(false);
  };
  console.log(pmID);

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

  return Object.keys(property).length > 1 ? (
    showManagementContract ? (
      <ManagementContract
        back={closeContract}
        property={property}
        contract={selectedContract}
        reload={reloadProperty}
      />
    ) : showTenantAgreement ? (
      <TenantAgreement
        back={closeAgreement}
        property={property}
        agreement={selectedAgreement}
      />
    ) : (
      <div className="w-100">
        <Header
          title="Property Details"
          // leftText="< Back"
          // leftFn={headerBack}
        />
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
        <div className="flex-1">
          <div>
            <SideBar />
          </div>
          <div className="w-100">
            <Container>
              {editProperty ? (
                <PropertyForm
                  property={property}
                  edit={editProperty}
                  setEdit={setEditProperty}
                  onSubmit={reloadProperty}
                />
              ) : showCreateExpense ? (
                <CreateExpense
                  property={property}
                  reload={reloadProperty}
                  back={() => setShowCreateExpense(false)}
                />
              ) : showCreateRevenue ? (
                <CreateRevenue
                  property={property}
                  reload={reloadProperty}
                  back={() => setShowCreateRevenue(false)}
                />
              ) : showCreateTax ? (
                <CreateTax
                  property={property}
                  reload={reloadProperty}
                  back={() => setShowCreateTax(false)}
                />
              ) : showCreateMortgage ? (
                <CreateMortgage
                  property={property}
                  reload={reloadProperty}
                  back={() => setShowCreateMortgage(false)}
                />
              ) : showCreateInsurance ? (
                <CreateInsurance
                  property={property}
                  reload={reloadProperty}
                  back={() => setShowCreateInsurance(false)}
                />
              ) : (
                <div>
                  <Row>
                    <Col>
                      <h1>Cashflow Summary</h1>
                    </Col>
                    <Col>
                      <img
                        src={EditIconNew}
                        onClick={() => setEditProperty(true)}
                        style={{
                          width: "30px",
                          height: "30px",
                          float: "right",
                          marginRight: "5rem",
                        }}
                      />
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
                            {new Date().toLocaleString("default", {
                              month: "long",
                            })}{" "}
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
                            {(
                              cashFlowAmortized - cashFlowExpectedAmortized
                            ).toFixed(2)}
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
                              revenueTotalAmortized -
                              revenueExpectedTotalAmortized
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
                            return revenue.purchase_type === "EXTRA CHARGES" ? (
                              <TableRow hidden={!monthlyExtra}>
                                <TableCell>
                                  &nbsp;&nbsp;&nbsp; {revenue.address}{" "}
                                  {revenue.unit} <br />
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
                              expenseTotalAmortized -
                              expenseExpectedTotalAmortized
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow hidden={!monthlyExpense}>
                          <TableCell width="180px">
                            &nbsp;&nbsp; Management
                            <img
                              src={SortDown}
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
                              src={SortLeft}
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
                          })}
                        <TableRow hidden={!monthlyExpense}>
                          <TableCell width="180px">
                            &nbsp;&nbsp; Mortgage{" "}
                            <img
                              src={SortDown}
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
                              src={SortLeft}
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
                            {cashflowData.amortized_mortgage_expense.toFixed(2)}
                          </TableCell>
                          <TableCell width="180px" align="right">
                            $
                            {cashflowData.amortized_mortgage_expense.toFixed(2)}
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
                                    &nbsp;&nbsp;&nbsp; {expense.frequency}{" "}
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
                                    {expense.amortized_taxes_expense.toFixed(2)}
                                  </TableCell>

                                  <TableCell width="180px" align="right">
                                    $
                                    {expense.amortized_taxes_expense.toFixed(2)}
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
                              src={SortLeft}
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
                                    &nbsp;&nbsp;&nbsp; {expense.frequency}{" "}
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
                              yearCashFlowAmortized -
                              yearCashFlowExpectedAmortized
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
                              src={SortDown}
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
                              src={SortLeft}
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
                              return expense.purchase_type === "MANAGEMENT" ? (
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
                              src={SortDown}
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
                              src={SortLeft}
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
                          cashflowData.owner_expense_yearly.map(
                            (expense, index) => {
                              return expense.purchase_type === "MAINTENANCE" ? (
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
                          cashflowData.owner_expense_yearly.map(
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
                                    &nbsp;&nbsp;&nbsp; {expense.frequency}{" "}
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
                              src={SortDown}
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
                              src={SortLeft}
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
                                    &nbsp;&nbsp;&nbsp; {expense.frequency}{" "}
                                    <br />
                                    &nbsp;&nbsp;&nbsp;{" "}
                                    {expense.frequency_of_payment}
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
                      <h1>Property Summary</h1>
                    </Col>
                    <Col>
                      <img
                        src={EditIconNew}
                        onClick={() => setEditProperty(true)}
                        style={{
                          width: "30px",
                          height: "30px",
                          float: "right",
                          marginRight: "5rem",
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
                      />{" "}
                      <TableBody>
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
                      </TableBody>
                    </Table>
                  </Row>
                  <Row>
                    <Col>
                      <h1>Maintenance and Repairs</h1>
                    </Col>
                    <Col>
                      {" "}
                      <img
                        src={AddIcon}
                        onClick={() =>
                          navigate(`/${property_uid}/repairRequest`, {
                            state: {
                              property: property,
                            },
                          })
                        }
                        style={{
                          width: "30px",
                          height: "30px",
                          float: "right",
                          marginRight: "5rem",
                        }}
                      />
                    </Col>
                  </Row>
                  {property.maintenanceRequests.length > 0 ? (
                    <Row className="m-3">
                      <Table
                        classes={{ root: classes.customTable }}
                        size="small"
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
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
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
                                  {request.assigned_business != null
                                    ? request.assigned_business
                                    : "None"}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
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
                  ) : (
                    <Row>No maintenance or repair requests</Row>
                  )}

                  <Row>
                    <Col>
                      <h1>Appliances</h1>
                    </Col>
                  </Row>
                  <Row className="m-3">
                    <Table classes={{ root: classes.customTable }} size="small">
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

                      <TableBody>
                        {appliances.map((appliance, i) => (
                          <TableRow>
                            <TableCell>{appliance}</TableCell>
                            <TableCell>
                              {applianceState[0][appliance]["name"]}
                            </TableCell>
                            <TableCell>
                              {applianceState[0][appliance]["purchased_from"]}
                            </TableCell>
                            <TableCell>
                              {applianceState[0][appliance]["purchased"]}
                            </TableCell>
                            <TableCell>
                              {applianceState[0][appliance]["purchased_order"]}
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
                              {applianceState[0][appliance]["warranty_till"]}
                            </TableCell>
                            <TableCell>
                              {applianceState[0][appliance]["warranty_info"]}
                            </TableCell>
                            <TableCell>
                              <div
                                style={{
                                  height: "50px",
                                  position: "relative",
                                }}
                              >
                                {applianceState[0][appliance]["images"] !==
                                  undefined &&
                                applianceState[0][appliance]["images"].length >
                                  0 ? (
                                  <div>
                                    <img
                                      src={
                                        applianceState[0][appliance]["images"][
                                          currentImg
                                        ]
                                      }
                                      // className="w-50 h-50"
                                      style={{
                                        borderRadius: "4px",
                                        objectFit: "contain",
                                        width: "50px",
                                        height: "50px",
                                      }}
                                      alt="Property"
                                    />
                                    <div
                                      style={{
                                        position: "absolute",
                                        left: "-7px",
                                        top: "10px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        previousImg(
                                          applianceState[0][appliance]["images"]
                                        )
                                      }
                                    >
                                      {"<"}
                                    </div>
                                    <div
                                      style={{
                                        position: "absolute",
                                        right: "-2px",
                                        top: "10px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        nextImg(
                                          applianceState[0][appliance]["images"]
                                        )
                                      }
                                    >
                                      {">"}
                                    </div>
                                  </div>
                                ) : (
                                  "None"
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Row>
                  <div
                    style={{
                      ...tileImg,
                      height: "200px",
                      position: "relative",
                    }}
                  >
                    {JSON.parse(property.images).length > 0 ? (
                      <img
                        src={JSON.parse(property.images)[currentImg]}
                        className="w-100 h-100"
                        style={{ borderRadius: "4px", objectFit: "contain" }}
                        alt="Property"
                      />
                    ) : (
                      ""
                    )}
                    <div
                      style={{ position: "absolute", left: "5px", top: "90px" }}
                      onClick={previousImg}
                    >
                      {"<"}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        right: "5px",
                        top: "90px",
                      }}
                      onClick={nextImg}
                    >
                      {">"}
                    </div>
                  </div>
                  <div
                    className="mx-2 my-2 p-3"
                    style={{
                      background: "#FFFFFF 0% 0% no-repeat padding-box",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <Row>
                      <Col>
                        <h5
                          className="mt-2 mb-0"
                          style={{
                            font: "normal normal normal 20px Bahnschrift-Regular",
                            letterSpacing: "0px",
                            color: "#000000",
                          }}
                        >
                          ${property.listed_rent}/mo
                        </h5>
                      </Col>
                      <Col>
                        <div className="d-flex mt-2 mb-0 justify-content-end">
                          {property.management_status !== "ACCEPTED" ? (
                            <p style={redPill} className="mb-0">
                              New
                            </p>
                          ) : property.rental_status === "ACTIVE" ? (
                            <p style={greenPill} className="mb-0">
                              Rented
                            </p>
                          ) : property.rental_status === "PROCESSING" ? (
                            <p style={greenPill} className="mb-0">
                              Processing
                            </p>
                          ) : (
                            <p style={orangePill} className="mb-0">
                              Not Rented
                            </p>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <p
                      style={{
                        font: "normal normal normal 20px Bahnschrift-Regular",
                        letterSpacing: "0px",
                        color: "#000000",
                      }}
                      className="mt-1 mb-2"
                    >
                      {property.address}
                      {property.unit !== "" ? ` ${property.unit}, ` : ", "}
                      {property.city}, {property.state} {property.zip}
                    </p>
                  </div>
                  <div
                    className="mx-2 my-2 p-3"
                    style={{
                      background: "#FFFFFF 0% 0% no-repeat padding-box",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <div
                      style={mediumBold}
                      // className=" d-flex flex-column justify-content-center align-items-center"
                      onClick={() => setExpandTenantInfo(!expandTenantInfo)}
                    >
                      <div className="d-flex mt-1 flex-column justify-content-center align-items-center">
                        <h6 style={mediumBold} className="mb-1">
                          Tenant Info
                        </h6>
                      </div>
                      {expandTenantInfo ? (
                        <div>
                          <div>
                            {tenantInfo.map((tf) => {
                              return (
                                <Row>
                                  <Col
                                    className=" d-flex align-items-left"
                                    style={{
                                      font: "normal normal 600 18px Bahnschrift-Regular",
                                    }}
                                  >
                                    Tenant: {tf.tenantFirstName}{" "}
                                    {tf.tenantLastName}
                                  </Col>
                                  <Col className="d-flex justify-content-end">
                                    <a href={`tel:${tf.tenantPhoneNumber}`}>
                                      <img
                                        src={Phone}
                                        alt="Phone"
                                        style={smallImg}
                                      />
                                    </a>
                                    <a href={`mailto:${tf.tenantEmail}`}>
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
                          </div>
                          <div>
                            {rentalInfo.map((rf) => {
                              return (
                                <Row>
                                  {JSON.parse(rf.rent_payments).map((rp) => {
                                    return (
                                      <Row className="mt-1">
                                        <Col
                                          className=" d-flex align-items-left"
                                          style={{
                                            font: "normal normal 600 18px Bahnschrift-Regular",
                                          }}
                                        >
                                          {rp.fee_name}:
                                        </Col>
                                        <Col className=" d-flex justify-content-end">
                                          ${rp.charge}
                                        </Col>
                                      </Row>
                                    );
                                  })}

                                  <Row className="mt-1">
                                    <Col
                                      style={{
                                        font: "normal normal 600 18px Bahnschrift-Regular",
                                      }}
                                    >
                                      Lease Length
                                    </Col>
                                  </Row>
                                  <Row className="mt-1">
                                    <Col
                                      className=" d-flex align-items-left"
                                      style={{
                                        font: "normal normal 600 18px Bahnschrift-Regular",
                                      }}
                                    >
                                      Start Date:
                                    </Col>
                                    <Col className=" d-flex justify-content-end">
                                      {rf.lease_start}
                                    </Col>
                                  </Row>
                                  <Row className="mt-1">
                                    <Col
                                      className=" d-flex align-items-left"
                                      style={{
                                        font: "normal normal 600 18px Bahnschrift-Regular",
                                      }}
                                    >
                                      End Date:
                                    </Col>
                                    <Col className=" d-flex justify-content-end">
                                      {rf.lease_end}
                                    </Col>
                                  </Row>
                                </Row>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="d-flex mt-1 flex-column justify-content-center align-items-center">
                        <img
                          src={expandTenantInfo ? BlueArrowUp : BlueArrowDown}
                          alt="Expand"
                        />
                      </div>
                    </div>
                  </div>
                  {rentalInfo.map((rf) => {
                    return (
                      JSON.parse(rf.documents).length > 0 && (
                        <div
                          className="mx-2 my-2 p-3"
                          style={{
                            background: "#FFFFFF 0% 0% no-repeat padding-box",
                            borderRadius: "10px",
                            opacity: 1,
                          }}
                        >
                          {console.log(
                            "rf.documents.length",
                            rf.documents.length,
                            rf.documents
                          )}
                          <div
                            style={mediumBold}
                            // className=" d-flex flex-column justify-content-center align-items-center"
                            onClick={() => setExpandLeaseDocs(!expandLeaseDocs)}
                          >
                            <div className="d-flex mt-1 flex-column justify-content-center align-items-center">
                              <h6 style={mediumBold} className="mb-1">
                                Lease Documents
                              </h6>
                            </div>
                            {expandLeaseDocs ? (
                              <div>
                                <div>
                                  {rentalInfo.map((rf) => {
                                    return (
                                      rf.documents.length > 0 && (
                                        <Row className="d-flex justify-content-center m-2">
                                          {JSON.parse(rf.documents).map(
                                            (rp) => {
                                              return (
                                                <Row
                                                  className="d-flex align-items-center p-2"
                                                  style={{
                                                    boxShadow:
                                                      "0px 1px 6px #00000029",
                                                    borderRadius: "5px",
                                                  }}
                                                >
                                                  <Col
                                                    className=" d-flex align-items-left"
                                                    style={{
                                                      font: "normal normal 600 18px Bahnschrift-Regular",
                                                      color: "#007AFF",
                                                      textDecoration:
                                                        "underline",
                                                    }}
                                                  >
                                                    {rp.description}
                                                  </Col>
                                                  <Col className=" d-flex justify-content-end">
                                                    <a
                                                      href={rp.link}
                                                      target="_blank"
                                                    >
                                                      <img src={OpenDoc} />
                                                    </a>
                                                  </Col>
                                                </Row>
                                              );
                                            }
                                          )}
                                        </Row>
                                      )
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            <div className="d-flex mt-1 flex-column justify-content-center align-items-center">
                              <img
                                src={
                                  expandLeaseDocs ? BlueArrowUp : BlueArrowDown
                                }
                                alt="Expand"
                              />
                            </div>
                          </div>
                        </div>
                      )
                    );
                  })}
                  {Object.keys(property.managerInfo).length !== 0 ? (
                    <div
                      className="mx-2 my-2 p-3"
                      style={{
                        background: "#FFFFFF 0% 0% no-repeat padding-box",
                        borderRadius: "10px",
                        opacity: 1,
                      }}
                    >
                      <div
                        style={mediumBold}
                        className=" d-flex flex-column justify-content-center align-items-center"
                      >
                        <div className="d-flex mt-1">
                          <h6 style={mediumBold} className="mb-1">
                            Property Management Agreement
                          </h6>
                        </div>

                        {expandManagerDocs &&
                        (property.management_status === "ACCEPTED" ||
                          property.management_status === "OWNER END EARLY" ||
                          property.management_status === "PM END EARLY") ? (
                          <Row className="d-flex justify-content-center">
                            <Row className="d-flex justify-content-center mt-3 p-0">
                              <Col>
                                <h6 style={mediumBold} className="mb-1">
                                  {property.managerInfo.manager_business_name}
                                </h6>
                                {/* <p
                                  style={{ ...gray, ...mediumBold }}
                                  className="mb-1"
                                >
                                  Property Manager
                                </p> */}
                              </Col>
                              <Col xs={3}>
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
                              </Col>
                            </Row>
                            <div>
                              {contracts.map((contract, i) =>
                                contract.business_uid ===
                                property.managerInfo.manager_id ? (
                                  <Row key={i}>
                                    <Row className="mt-1 align-items-center">
                                      <Col className="d-flex  align-items-left">
                                        {contract.contract_name != null ? (
                                          <p
                                            style={{
                                              font: "normal normal 600 18px Bahnschrift-Regular",
                                            }}
                                          >
                                            {contract.contract_name}{" "}
                                          </p>
                                        ) : (
                                          <p
                                            style={{
                                              font: "normal normal 600 18px Bahnschrift-Regular",
                                            }}
                                          >
                                            Contract {i + 1}{" "}
                                          </p>
                                        )}
                                      </Col>

                                      <Col
                                        xs={2}
                                        className="d-flex justify-content-end"
                                      >
                                        {JSON.parse(contract.documents)
                                          .length === 0
                                          ? ""
                                          : JSON.parse(contract.documents).map(
                                              (file) => {
                                                return (
                                                  <a
                                                    href={file.link}
                                                    target="_blank"
                                                  >
                                                    <img src={File} />
                                                  </a>
                                                );
                                              }
                                            )}
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col
                                        className="d-flex align-items-left"
                                        style={{
                                          font: "normal normal 600 18px Bahnschrift-Regular",
                                        }}
                                      >
                                        Contract Length
                                      </Col>
                                      <Col xs={2}></Col>
                                    </Row>
                                    <Row>
                                      <Col style={mediumBold}>
                                        <Form.Group className="mx-2 my-3">
                                          <Form.Label className="mb-0 ms-2">
                                            Start Date
                                          </Form.Label>
                                          <Row
                                            className="mb-0 ms-2 p-1"
                                            style={{
                                              background:
                                                "#F8F8F8 0% 0% no-repeat padding-box",
                                              border: "1px solid #EBEBEB",
                                              borderRadius: " 5px",
                                            }}
                                          >
                                            {contract.start_date}
                                          </Row>
                                        </Form.Group>
                                      </Col>
                                      <Col style={mediumBold}>
                                        <Form.Group className="mx-2 my-3">
                                          <Form.Label className="mb-0 ms-2">
                                            End Date
                                          </Form.Label>
                                          <Row
                                            className="mb-0 ms-2 p-1"
                                            style={{
                                              background:
                                                "#F8F8F8 0% 0% no-repeat padding-box",
                                              border: "1px solid #EBEBEB",
                                              borderRadius: " 5px",
                                            }}
                                          >
                                            {contract.end_date}
                                          </Row>
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                    <Row
                                      style={{
                                        font: "normal normal 600 18px Bahnschrift-Regular",
                                      }}
                                    >
                                      <Form.Group>
                                        <Form.Label>PM Fees</Form.Label>
                                        <Row className="mb-2 ms-2">
                                          <ManagerFees
                                            feeState={JSON.parse(
                                              contract.contract_fees
                                            )}
                                            setFeeState={setFeeState}
                                          />
                                        </Row>
                                      </Form.Group>
                                    </Row>
                                    {JSON.parse(contract.assigned_contacts)
                                      .length === 0 ? (
                                      ""
                                    ) : (
                                      <Row
                                        style={{
                                          font: "normal normal 600 18px Bahnschrift-Regular",
                                        }}
                                      >
                                        <Form.Group>
                                          <Form.Label>
                                            Contact Details
                                          </Form.Label>
                                          <Row className="mb-2 ms-2">
                                            <BusinessContact
                                              state={contactState}
                                            />
                                          </Row>
                                        </Form.Group>
                                      </Row>
                                    )}
                                  </Row>
                                ) : (
                                  ""
                                )
                              )}
                            </div>
                            {/* <Row className="mt-4">
                          <Col
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-evenly",
                              marginBottom: "25px",
                            }}
                          >
                            <Button
                              // onClick={cancelAgreement}
                              onClick={() => {
                                setShowDialog2(true);
                                setPmID(property.manager_id);
                              }}
                              variant="outline-primary"
                              style={redPillButton}
                            >
                              Cancel Agreement
                            </Button>
                          </Col>
                        </Row> */}
                          </Row>
                        ) : (
                          ""
                        )}
                        {expandManagerDocs &&
                        property.management_status === "ACCEPTED" &&
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
                        {expandManagerDocs &&
                        property.management_status === "ACCEPTED" &&
                        cancel ? (
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
                        {expandManagerDocs &&
                        property.management_status === "OWNER END EARLY" ? (
                          <Row className="mt-4">
                            <h6
                              className="d-flex justify-content-center"
                              style={mediumBold}
                            >
                              You have requested to end the agreement early on{" "}
                              {contracts[0].early_end_date}
                            </h6>
                          </Row>
                        ) : (
                          ""
                        )}

                        {expandManagerDocs &&
                        property.management_status === "PM END EARLY" ? (
                          <Row className="d-flex flex-grow-1 w-100 justify-content-center mt-3 mb-4">
                            <h6
                              className="d-flex justify-content-center"
                              style={mediumBold}
                            >
                              Property Manager requested to end the agreement
                              early on {contracts[0].early_end_date}
                            </h6>
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

                        <Row className="d-flex mt-1">
                          <img
                            onClick={() =>
                              setExpandManagerDocs(!expandManagerDocs)
                            }
                            src={
                              expandManagerDocs ? BlueArrowUp : BlueArrowDown
                            }
                            alt="Expand"
                          />
                        </Row>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div
                    className="mx-2 my-2 p-3"
                    style={{
                      background: "#FFFFFF 0% 0% no-repeat padding-box",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <div
                      style={mediumBold}
                      className=" d-flex flex-column justify-content-center align-items-center "
                      onClick={() =>
                        setExpandAddManagerDocs(!expandAddManagerDocs)
                      }
                    >
                      <div className="d-flex mt-1">
                        <h6 style={mediumBold} className="mb-1">
                          {Object.keys(property.managerInfo).length == 0
                            ? "Select a Property Manager"
                            : "Change Property Manager"}
                        </h6>
                      </div>
                      {property.property_manager.length == 0 ? (
                        ""
                      ) : property.property_manager.length > 1 ? (
                        property.property_manager.map((p, i) =>
                          p.management_status === "REJECTED" ? (
                            ""
                          ) : expandAddManagerDocs &&
                            p.management_status === "FORWARDED" ? (
                            <Row className="p-0 m-0">
                              <Row className="d-flex justify-content-between mt-3">
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
                      ) : expandAddManagerDocs &&
                        property.property_manager[0].management_status ===
                          "FORWARDED" ? (
                        <Row className="p-0 m-0">
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
                          ) : expandAddManagerDocs &&
                            p.management_status === "SENT" ? (
                            <Row className="p-0 m-0">
                              <Row className="d-flex justify-content-between mt-3">
                                <Row>
                                  <h6 style={mediumBold} className="mb-1">
                                    {p.manager_business_name}
                                  </h6>
                                  <p
                                    style={{ mediumBold, color: "#41fc03" }}
                                    className="mb-1"
                                  >
                                    Contract in Review
                                  </p>
                                </Row>
                              </Row>

                              <div>
                                {contracts.map((contract, i) =>
                                  contract.business_uid === p.manager_id ? (
                                    <Row key={i}>
                                      <Row className="mt-1 align-items-center">
                                        <Col className="d-flex  align-items-left">
                                          {contract.contract_name != null ? (
                                            <p
                                              style={{
                                                font: "normal normal 600 18px Bahnschrift-Regular",
                                              }}
                                            >
                                              {contract.contract_name}{" "}
                                            </p>
                                          ) : (
                                            <p
                                              style={{
                                                font: "normal normal 600 18px Bahnschrift-Regular",
                                              }}
                                            >
                                              Contract {i + 1}{" "}
                                            </p>
                                          )}
                                        </Col>
                                        <Col
                                          xs={2}
                                          className="d-flex justify-content-end"
                                        >
                                          {JSON.parse(contract.documents)
                                            .length === 0
                                            ? ""
                                            : JSON.parse(
                                                contract.documents
                                              ).map((file) => {
                                                return (
                                                  <a
                                                    href={file.link}
                                                    target="_blank"
                                                  >
                                                    <img src={File} />
                                                  </a>
                                                );
                                              })}
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col
                                          className="d-flex align-items-left"
                                          style={{
                                            font: "normal normal 600 18px Bahnschrift-Regular",
                                          }}
                                        >
                                          Contract Length
                                        </Col>
                                        <Col xs={2}></Col>
                                      </Row>
                                      <Row>
                                        <Col style={mediumBold}>
                                          <Form.Group className="mx-2 my-3">
                                            <Form.Label className="mb-0 ms-2">
                                              Start Date
                                            </Form.Label>
                                            <Row
                                              className="mb-0 ms-2 p-1"
                                              style={{
                                                background:
                                                  "#F8F8F8 0% 0% no-repeat padding-box",
                                                border: "1px solid #EBEBEB",
                                                borderRadius: " 5px",
                                              }}
                                            >
                                              {contract.start_date}
                                            </Row>
                                          </Form.Group>
                                        </Col>
                                        <Col style={mediumBold}>
                                          <Form.Group className="mx-2 my-3">
                                            <Form.Label className="mb-0 ms-2">
                                              End Date
                                            </Form.Label>
                                            <Row
                                              className="mb-0 ms-2 p-1"
                                              style={{
                                                background:
                                                  "#F8F8F8 0% 0% no-repeat padding-box",
                                                border: "1px solid #EBEBEB",
                                                borderRadius: " 5px",
                                              }}
                                            >
                                              {contract.end_date}
                                            </Row>
                                          </Form.Group>
                                        </Col>
                                      </Row>
                                      <Row
                                        style={{
                                          font: "normal normal 600 18px Bahnschrift-Regular",
                                        }}
                                      >
                                        <Form.Group>
                                          <Form.Label>PM Fees</Form.Label>
                                          <Row className="mb-2 ms-2">
                                            <ManagerFees
                                              feeState={JSON.parse(
                                                contract.contract_fees
                                              )}
                                              setFeeState={setFeeState}
                                            />
                                          </Row>
                                        </Form.Group>
                                      </Row>
                                      {JSON.parse(contract.assigned_contacts)
                                        .length === 0 ? (
                                        ""
                                      ) : (
                                        <Row
                                          style={{
                                            font: "normal normal 600 18px Bahnschrift-Regular",
                                          }}
                                        >
                                          <Form.Group>
                                            <Form.Label>
                                              Contact Details
                                            </Form.Label>
                                            <Row className="mb-2 ms-2">
                                              <BusinessContact
                                                state={contactState}
                                              />
                                            </Row>
                                          </Form.Group>
                                        </Row>
                                      )}
                                    </Row>
                                  ) : (
                                    ""
                                  )
                                )}
                              </div>

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
                            </Row>
                          ) : (
                            ""
                          )
                        )
                      ) : expandAddManagerDocs &&
                        property.property_manager[0].management_status ===
                          "SENT" ? (
                        <Row>
                          <Row className="d-flex justify-content-between mt-3">
                            <Row>
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
                            </Row>
                          </Row>
                          <div>
                            {contracts.map((contract, i) =>
                              contract.business_uid ===
                              property.property_manager[0].manager_id ? (
                                <Row key={i}>
                                  <Row className="mt-1 align-items-center">
                                    <Col className=" d-flex align-items-left">
                                      {contract.contract_name != null ? (
                                        <p
                                          style={{
                                            font: "normal normal 600 18px Bahnschrift-Regular",
                                          }}
                                        >
                                          {contract.contract_name}
                                        </p>
                                      ) : (
                                        <p
                                          style={{
                                            font: "normal normal 600 18px Bahnschrift-Regular",
                                          }}
                                        >
                                          Contract {i + 1}
                                        </p>
                                      )}
                                    </Col>
                                    <Col
                                      xs={2}
                                      className="d-flex justify-content-end"
                                    >
                                      {JSON.parse(contract.documents).length ===
                                      0
                                        ? ""
                                        : JSON.parse(contract.documents).map(
                                            (file) => {
                                              return (
                                                <a
                                                  href={file.link}
                                                  target="_blank"
                                                >
                                                  <img src={File} />
                                                </a>
                                              );
                                            }
                                          )}
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col
                                      className="d-flex align-items-left"
                                      style={{
                                        font: "normal normal 600 18px Bahnschrift-Regular",
                                      }}
                                    >
                                      Contract Length
                                    </Col>
                                    <Col xs={2}></Col>
                                  </Row>
                                  <Row>
                                    <Col style={mediumBold}>
                                      <Form.Group className="mx-2 my-3">
                                        <Form.Label className="mb-0 ms-2">
                                          Start Date
                                        </Form.Label>
                                        <Row
                                          className="mb-0 ms-2 p-1"
                                          style={{
                                            background:
                                              "#F8F8F8 0% 0% no-repeat padding-box",
                                            border: "1px solid #EBEBEB",
                                            borderRadius: " 5px",
                                          }}
                                        >
                                          {contract.start_date}
                                        </Row>
                                      </Form.Group>
                                    </Col>
                                    <Col style={mediumBold}>
                                      <Form.Group className="mx-2 my-3">
                                        <Form.Label className="mb-0 ms-2">
                                          End Date
                                        </Form.Label>
                                        <Row
                                          className="mb-0 ms-2 p-1"
                                          style={{
                                            background:
                                              "#F8F8F8 0% 0% no-repeat padding-box",
                                            border: "1px solid #EBEBEB",
                                            borderRadius: " 5px",
                                          }}
                                        >
                                          {contract.end_date}
                                        </Row>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                  <Row
                                    style={{
                                      font: "normal normal 600 18px Bahnschrift-Regular",
                                    }}
                                  >
                                    <Form.Group>
                                      <Form.Label>PM Fees</Form.Label>
                                      <Row className="mb-2 ms-2">
                                        <ManagerFees
                                          feeState={JSON.parse(
                                            contract.contract_fees
                                          )}
                                          setFeeState={setFeeState}
                                        />
                                      </Row>
                                    </Form.Group>
                                  </Row>
                                  {JSON.parse(contract.assigned_contacts)
                                    .length === 0 ? (
                                    ""
                                  ) : (
                                    <Row
                                      style={{
                                        font: "normal normal 600 18px Bahnschrift-Regular",
                                      }}
                                    >
                                      <Form.Group>
                                        <Form.Label>Contact Details</Form.Label>
                                        <Row className="mb-2 ms-2">
                                          <BusinessContact
                                            state={contactState}
                                          />
                                        </Row>
                                      </Form.Group>
                                    </Row>
                                  )}
                                </Row>
                              ) : (
                                ""
                              )
                            )}
                          </div>

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

                      {expandAddManagerDocs ? (
                        <ManagerDocs
                          property={property}
                          addDocument={addContract}
                          selectContract={selectContract}
                          // reload={reloadProperty}
                          // setStage={setStage}
                        />
                      ) : (
                        ""
                      )}
                      <div className="d-flex mt-1">
                        <img
                          src={
                            expandAddManagerDocs ? BlueArrowUp : BlueArrowDown
                          }
                          alt="Expand"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Container>
          </div>
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
