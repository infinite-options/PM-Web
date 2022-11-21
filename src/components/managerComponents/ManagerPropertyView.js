import React, { useState, useEffect, useContext } from "react";
import { Col, Row } from "react-bootstrap";
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
import ManagerFooter from "./ManagerFooter";
import CreateExpense from "../CreateExpense";
import CreateRevenue from "../CreateRevenue";
import ManagerTenantApplications from "./ManagerTenantApplications";
import ManagerTenantProfileView from "../../pages/ManagerTenantProfileView";
import PropertyManagerDocs from "../PropertyManagerDocs";
import AppContext from "../../AppContext";
import ManagerManagementContract from "../ManagerManagementContract";
import ManagerTenantAgreementView from "./ManagerTenantAgreementView";
import ConfirmDialog from "../ConfirmDialog";
import ManagerRentalHistory from "./ManagerRentalHistory";
import ManagerPropertyForm from "./ManagerPropertyForm";
import ManagerTenantAgreement from "./ManagerTenantAgreement";
import SideBar from "./SideBar";
import File from "../../icons/File.svg";
import OpenDoc from "../../icons/OpenDoc.svg";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import EditIconNew from "../../icons/EditIconNew.svg";
import AddIcon from "../../icons/AddIcon.svg";
import SortDown from "../../icons/Sort-down.svg";
import SortLeft from "../../icons/Sort-left.svg";
import PropertyIcon from "../../icons/PropertyIcon.svg";
import RepairImg from "../../icons/RepairImg.svg";
import {
  tileImg,
  greenPill,
  mediumBold,
  redPill,
  orangePill,
  bluePill,
} from "../../utils/styles";
import { get, put } from "../../utils/api";
import BlueArrowUp from "../../icons/BlueArrowUp.svg";
import BlueArrowDown from "../../icons/BlueArrowDown.svg";
import BlueArrowRight from "../../icons/BlueArrowRight.svg";
import No_Image from "../../icons/No_Image_Available.jpeg";
import "react-multi-carousel/lib/styles.css";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});

function ManagerPropertyView(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  // const property = location.state.property
  // const { mp_id } = useParams();
  const property_uid = location.state.property_uid;
  const [isLoading, setIsLoading] = useState(true);
  const [property, setProperty] = useState({ images: "[]" });
  const [hideEdit, setHideEdit] = useState(true);
  const [recentMaintenanceRequests, setRecentMaintenanceRequests] = useState(
    []
  );
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
  const [pastMaintenanceRequests, setPastMaintenanceRequests] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [endEarlyDate, setEndEarlyDate] = useState("");

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
  const appliances = Object.keys(applianceState[0]);

  const [imagesProperty, setImagesProperty] = useState([]);

  const [showControls, setShowControls] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [expandDetails, setExpandDetails] = useState(false);
  const [editProperty, setEditProperty] = useState(false);
  const [expandMaintenanceR, setExpandMaintenanceR] = useState(false);
  const [expandManagerDocs, setExpandManagerDocs] = useState(false);
  const [expandLeaseDocs, setExpandLeaseDocs] = useState(false);
  const [showManagementContract, setShowManagementContract] = useState(false);
  const [showTenantAgreement, setShowTenantAgreement] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [acceptedTenantApplications, setAcceptedTenantApplications] = useState(
    []
  );
  const [showTenantProfile, setShowTenantProfile] = useState(false);
  const [selectedTenantApplication, setSelectedTenantApplication] =
    useState(null);
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [showCreateRevenue, setShowCreateRevenue] = useState(false);
  const [showCreateTax, setShowCreateTax] = useState(false);
  const [showCreateMortgage, setShowCreateMortgage] = useState(false);
  const [showCreateInsurance, setShowCreateInsurance] = useState(false);
  // sorting variables
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
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

  const days = (date_1, date_2) => {
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  };
  const cancelAgreement = async () => {
    const files = JSON.parse(property.images);
    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid;
    }
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "PM END EARLY",
      manager_id: management_buid,
      early_end_date: endEarlyDate,
    };
    for (let i = -1; i < files.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      updatedManagementContract[key] = files[i + 1];
    }
    await put("/cancelAgreement", updatedManagementContract, null, files);
    setExpandManagerDocs(false);
    setShowDialog(false);
    fetchProperty();
  };
  const onCancel = () => {
    setShowDialog(false);
  };
  const fetchProperty = async () => {
    const response = await get(
      `/propertiesManagerDetail?property_uid=${property_uid}`
    );
    const cashflowResponse = await get(
      `/ownerCashflowProperty?property_id=${property_uid}&owner_id=${user.user_uid}`
    );

    setCashflowData(cashflowResponse.result);
    setImagesProperty(JSON.parse(response.result[0].images));
    let show = JSON.parse(response.result[0].images).length < 5 ? false : true;
    setShowControls(show);
    console.log(response.result[0]);
    applianceState[1](JSON.parse(response.result[0].appliances));
    const property_details = response.result[0];

    property_details.tenants = property_details.rentalInfo.filter(
      (r) => r.rental_status === "ACTIVE"
    );

    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid;
    }
    let owner_negotiations = property_details.property_manager.filter(
      (pm) => pm.linked_business_id === management_buid
    );
    if (owner_negotiations.length === 0) {
      property_details.management_status = null;
    } else if (owner_negotiations.length === 1) {
      property_details.management_status =
        owner_negotiations[0].management_status;
    } else {
      // placeholder, scenario needs to be tested and updated
      property_details.management_status =
        owner_negotiations[0].management_status;
    }
    console.log(property_details);
    setProperty(property_details);
    if (
      property_details.management_status === "ACCEPTED" ||
      property_details.management_status === "END EARLY" ||
      property_details.management_status === "PM END EARLY" ||
      property_details.management_status === "OWNER END EARLY"
    ) {
      setHideEdit(false);
    }
    // setSelectedAgreement(property_details.rentalInfo);
    property_details.rentalInfo.forEach((rental) => {
      if (rental.rental_status === "ACTIVE") {
        setSelectedAgreement(rental);
      }
    });
    let recent_mr = [];
    let past_mr = [];
    console.log(property_details.maintenanceRequests);
    property_details.maintenanceRequests.forEach((request) => {
      if (
        days(new Date(request.request_created_date.split(" ")[0]), new Date()) >
        30
      ) {
        past_mr.push(request);
      } else recent_mr.push(request);
    });
    console.log(recent_mr, past_mr);
    setRecentMaintenanceRequests(recent_mr);
    setPastMaintenanceRequests(past_mr);
  };

  useState(() => {
    fetchProperty();
  });

  const headerBack = () => {
    editProperty
      ? reloadProperty()
      : showCreateExpense
      ? setShowCreateExpense(false)
      : showCreateRevenue
      ? setShowCreateRevenue(false)
      : navigate("../manager");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [
    editProperty,
    showCreateExpense,
    showCreateRevenue,
    showManagementContract,
    showTenantAgreement,
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [editProperty, showManagementContract, showTenantAgreement]);

  const addContract = () => {
    setSelectedContract(null);
    setShowManagementContract(true);
  };
  const selectContract = (contract) => {
    setSelectedContract(contract);
    setShowManagementContract(true);
  };
  const closeContract = () => {
    // reload();
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
    // reload();
    setAcceptedTenantApplications([]);
    setShowTenantAgreement(false);
  };

  const reloadProperty = () => {
    setEditProperty(false);
    window.scrollTo(0, 0);
    fetchProperty();
  };

  const createNewTenantAgreement = (selected_applications) => {
    setAcceptedTenantApplications(selected_applications);
    setShowTenantAgreement(true);
  };

  const selectTenantApplication = (application) => {
    setSelectedTenantApplication(application);
    setShowTenantProfile(true);
  };

  const closeTenantApplication = () => {
    setShowTenantProfile(false);
  };

  const renewLease = (agreement) => {
    setShowTenantAgreement(true);
    setSelectedAgreement(agreement);
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
      <ManagerManagementContract
        back={closeContract}
        property={property}
        contract={selectedContract}
        reload={reloadProperty}
      />
    ) : showTenantAgreement ? (
      <ManagerTenantAgreement
        back={closeAgreement}
        property={property}
        agreement={selectedAgreement}
        acceptedTenantApplications={acceptedTenantApplications}
        setAcceptedTenantApplications={setAcceptedTenantApplications}
      />
    ) : (
      <div>
        <ConfirmDialog
          title={"Are you sure you want to cancel the agreement?"}
          isOpen={showDialog}
          onConfirm={cancelAgreement}
          onCancel={onCancel}
        />
        <div className="flex-1">
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
          <div className="w-100 mb-5 overflow-hidden">
            <Header
              title="Property Details"
              leftText={location.state == null ? "" : "< Back"}
              leftFn={headerBack}
            />

            {editProperty ? (
              <ManagerPropertyForm
                property={property}
                edit={editProperty}
                setEdit={setEditProperty}
                hideEdit={hideEdit}
                onSubmit={reloadProperty}
              />
            ) : showTenantProfile ? (
              <ManagerTenantProfileView
                back={closeTenantApplication}
                application={selectedTenantApplication}
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
            ) : (
              <div className="w-100 my-5">
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
                  <Table
                    classes={{ root: classes.customTable }}
                    size="small"
                    responsive="md"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell> Property Images</TableCell>
                        <TableCell>Street Address</TableCell>
                        <TableCell>City,State</TableCell>
                        <TableCell>Zip</TableCell>
                        <TableCell>Owner</TableCell>
                        <TableCell>Tenant</TableCell>{" "}
                        <TableCell>Rent Status</TableCell>
                        <TableCell>Lease End</TableCell>
                        <TableCell>Rent</TableCell> <TableCell>Type</TableCell>{" "}
                        <TableCell>Size</TableCell>
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
                          {property.unit !== "" ? " " + property.unit : ""}
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

                        <TableCell padding="none" size="small" align="center">
                          {property.property_manager.length !== 0
                            ? property.property_manager[0].manager_business_name
                            : "None"}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {property.rentalInfo.length !== 0
                            ? property.rentalInfo[0].tenant_first_name
                            : "None"}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {property.rent_paid !== ""
                            ? property.rent_paid
                            : "None"}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {property.rentalInfo.length !== 0
                            ? property.rentalInfo[0].lease_end
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
                      </TableRow>
                    </TableBody>
                  </Table>
                </Row>

                <Row className="m-3">
                  <Col>
                    <h3>Property Owner Agreement</h3>
                  </Col>
                  <Col xs={2}></Col>
                </Row>
                <Row style={{ overflow: "scroll" }}>
                  {" "}
                  <PropertyManagerDocs
                    property={property}
                    fetchProperty={fetchProperty}
                    addDocument={addContract}
                    selectContract={selectContract}
                    setExpandManagerDocs={setExpandManagerDocs}
                    setShowDialog={setShowDialog}
                    endEarlyDate={endEarlyDate}
                    setEndEarlyDate={setEndEarlyDate}
                    cancel={cancel}
                    setCancel={setCancel}
                    reload={""}
                  />
                </Row>

                <Row className="m-3">
                  <Col>
                    <h3>Tenant Info</h3>
                  </Col>
                  <Col xs={2}></Col>
                </Row>
                <Row style={{ overflow: "scroll" }}>
                  <ManagerTenantAgreementView
                    back={closeAgreement}
                    property={property}
                    selectedAgreement={selectedAgreement}
                    renewLease={renewLease}
                    acceptedTenantApplications={acceptedTenantApplications}
                    setAcceptedTenantApplications={
                      setAcceptedTenantApplications
                    }
                  />
                </Row>

                {property.rental_status === "ACTIVE" ? (
                  <ManagerRentalHistory property={property} />
                ) : (
                  <ManagerTenantApplications
                    property={property}
                    createNewTenantAgreement={createNewTenantAgreement}
                    selectTenantApplication={selectTenantApplication}
                  />
                )}
                <Row className="m-3">
                  <Col>
                    <h3>Maintenance and Repair Requests</h3>
                  </Col>
                  <Col xs={2}>
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
                <Row className="m-3" style={{ overflow: "scroll" }}>
                  {property.maintenanceRequests.length > 0 ? (
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
                              onClick={() => {
                                navigate(
                                  `../manager-repairs/${request.maintenance_request_uid}`,
                                  {
                                    state: {
                                      repair: request,
                                    },
                                  }
                                );
                              }}
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
                  ) : (
                    <div>No maintenance or repair requests</div>
                  )}
                </Row>
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
                    {console.log("appliances", appliances, applianceState)}
                    <TableBody>
                      {appliances.map((appliance, i) => {
                        return applianceState[0][appliance]["available"] ==
                          true ||
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

                            {applianceState[0][appliance]["images"] !==
                              undefined &&
                            applianceState[0][appliance]["images"].length >
                              0 ? (
                              <TableCell>
                                {console.log(
                                  applianceState[0][appliance]["images"][0]
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
                </Row>
              </div>
            )}
          </div>
        </div>
        <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-5">
          <ManagerFooter />
        </div>
      </div>
    )
  ) : (
    <div className="w-100 d-flex flex-column justify-content-center align-items-center h-50">
      <ReactBootStrap.Spinner animation="border" role="status" />
    </div>
  );
}

export default ManagerPropertyView;
