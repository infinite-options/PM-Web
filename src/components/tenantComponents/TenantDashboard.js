import React from "react";
import { Row, Col, Carousel, CarouselItem } from "react-bootstrap";
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
import SideBar from "./SideBar";
import Header from "../Header";
import AppContext from "../../AppContext";
import TenantFooter from "./TenantFooter";
import MailDialogManager from "../MailDialog";
import MessageDialogManager from "../MessageDialog";
import TenantUpcomingPayments from "./TenantUpcomingPayments";
import TenantPaymentHistory from "./TenantPaymentHistory";
import TenantRepairRequest from "./TenantRepairRequest";
import ConfirmDialog2 from "../ConfirmDialog2";
import SearchProperties_Black from "../../icons/SearchProperties_Black.svg";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import Mail from "../../icons/Mail.svg";
import AddIcon from "../../icons/AddIcon.svg";
import PropertyIcon from "../../icons/PropertyIcon.svg";
import RepairImg from "../../icons/RepairImg.svg";
import { get } from "../../utils/api";
import {
  xSmall,
  blue,
  mediumBold,
  subHeading,
  smallImg,
  red,
  sidebarStyle,
} from "../../utils/styles";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

export default function TenantDashboard() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData, refresh, ably } = useContext(AppContext);
  const { access_token, user } = userData;
  const [stage, setStage] = useState("LIST");
  const [isLoading, setIsLoading] = useState(true);
  const [tenantData, setTenantData] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [upcomingPaymentsData, setUpcomingPaymentsData] = useState([]);
  const [paymentHistoryData, setPaymentHistoryData] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tenantProfile, setTenantProfile] = useState([]);
  const [managerInfo, setManagerInfo] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState("");
  const [maintenanceStatus, setMaintenanceStatus] = useState("");
  const [announcementsArrival, setAnnouncementsArrival] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [showMessageFormManager, setShowMessageFormManager] = useState(false);
  const [showMailFormManager, setShowMailFormManager] = useState(false);
  const onCancelManagerMail = () => {
    setShowMailFormManager(false);
  };
  const onCancelManagerMessage = () => {
    setShowMessageFormManager(false);
  };
  // // search variables
  // const [search, setSearch] = useState("");
  // // sorting variables

  const channel_application = ably.channels.get("application_status");
  const channel_maintenance = ably.channels.get("maintenance_status");
  const channel_announcements = ably.channels.get("announcements");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");

  const [orderMaintenance, setOrderMaintenance] = useState("desc");
  const [orderMaintenanceBy, setOrderMaintenanceBy] = useState("days_open");

  const [orderApplications, setOrderApplications] = useState("asc");
  const [orderApplicationsBy, setOrderApplicationsBy] = useState("calories");

  const [showDialog, setShowDialog] = useState(false);
  const [width, setWindowWidth] = useState(1024);
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

  const days = (date_1, date_2) => {
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  };
  const ProfileNotComplete = async (app) => {
    setShowDialog(false);
    navigate("../tenantProfile");
  };

  const fetchTenantDashboard = async () => {
    if (access_token === null || user.role.indexOf("TENANT") === -1) {
      navigate("/");
      return;
    }
    const check = await get("/CheckTenantProfileComplete", access_token);
    // console.log("check", check);
    if (check["message"] === "Incomplete Profile") {
      setShowDialog(true);
    }

    const response = await get("/tenantDashboard", access_token);
    // console.log("response", response);
    if (
      response.msg === "Token has expired" ||
      check.message === "Token has expired"
    ) {
      // console.log("here msg");
      refresh();

      return;
    }
    const appRes = await get(
      `/applications?tenant_id=${user.tenant_id[0].tenant_id}`
    );

    setTenantProfile(response.result[0]);
    let apps = [];
    for (let i = 0; i < appRes.result.length; i++) {
      if (
        appRes.result[i].application_status === "REJECTED" &&
        days(new Date(appRes.result[i].application_date), new Date()) > 30
      ) {
        // console.log("skip ");
      } else if (
        appRes.result[i].application_status !== "RENTED" &&
        appRes.result[i].application_status !== "PM END EARLY" &&
        appRes.result[i].application_status !== "TENANT END EARLY"
      ) {
        apps.push(appRes.result[i]);
      }
    }
    // console.log(apps);
    var resArr = [];
    apps.forEach(function (item) {
      var i = resArr.findIndex(
        (x) => x.application_uid == item.application_uid
      );
      if (i <= -1) {
        resArr.push(item);
      }
    });
    // console.log(resArr);
    setApplications(resArr);

    // setApplications(apps);

    const properties = response.result[0].properties.filter(
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
        (item) =>
          item.request_status === "SCHEDULED" ||
          item.request_status === "RESCHEDULE" ||
          item.request_status === "SCHEDULE"
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

      property.tenant_end_early_applications =
        property.application_status === "TENANT END EARLY";

      property.pm_end_early_applications =
        property.application_status === "PM END EARLY";

      property.extend_lease_applications =
        property.application_status === "LEASE EXTENSION";

      property.tenant_extend_lease_applications =
        property.application_status === "TENANT LEASE EXTENSION";

      property.tenant_refused_applications =
        property.application_status === "REJECTED";
    });

    setTenantData(properties_unique);
    setIsLoading(false);
    let requests = [];
    response.result[0].properties.forEach((res) => {
      if (res.maintenanceRequests.length > 0) {
        res.maintenanceRequests.forEach((mr) => {
          requests.push(mr);
        });
      }
    });
    setMaintenanceRequests(requests);

    let announcements = [];
    response.result[0].properties.forEach((res) => {
      if (res.announcements.length > 0) {
        res.announcements.forEach((mr) => {
          announcements.push(mr);
        });
      }
    });
    setAnnouncements(announcements);
    let upcoming = [];
    response.result[0].properties.forEach((res) => {
      if (res.tenantExpenses.length > 0) {
        res.tenantExpenses.forEach((mr) => {
          upcoming.push(mr);
        });
      }
    });
    setUpcomingPaymentsData(upcoming);

    let history = [];
    response.result[0].properties.forEach((res) => {
      if (res.tenantExpenses.length > 0) {
        res.tenantExpenses.forEach((mr) => {
          history.push(mr);
        });
      }
    });
    setPaymentHistoryData(history);
    let manager = [];
    response.result[0].properties.forEach((res) => {
      if (res.property_manager.length > 0) {
        res.property_manager.forEach((mr) => {
          manager.push(mr);
        });
      }
    });
    setManagerInfo(manager);
  };

  useEffect(() => {
    async function application_message() {
      await channel_application.subscribe((message) => {
        // console.log(message);
        setApplicationStatus(message.data.te);
      });
    }
    async function maintenance_message() {
      await channel_maintenance.subscribe((message) => {
        // console.log(message);
        setMaintenanceStatus(message.data.te);
      });
    }
    async function announcements_message() {
      await channel_announcements.subscribe((message) => {
        // console.log(message);
        setAnnouncementsArrival(message.data.te);
      });
    }
    application_message();
    maintenance_message();
    fetchTenantDashboard();
    announcements_message();
    return function cleanup() {
      channel_application.unsubscribe();
      channel_maintenance.unsubscribe();
      channel_announcements.unsubscribe();
    };
  }, [
    access_token,
    applicationStatus,
    maintenanceStatus,
    announcementsArrival,
  ]);

  const addProperty = () => {
    fetchTenantDashboard();
    setStage("LIST");
  };

  const goToReviewPropertyLease = (application) => {
    navigate(`/reviewPropertyLease/${application.property_uid}`, {
      state: {
        property_uid: application.property_uid,
        application: application,
        application_uid: application.application_uid,
        application_status_1: application.application_status,
        message: application.message,
      },
    });
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
  // console.log(tenantData);

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
      id: "property_manager",
      numeric: false,
      label: "Property Manager",
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

  const handleRequestSortApplications = (event, property) => {
    const isAsc =
      orderApplicationsBy === property && orderApplications === "asc";
    setOrderApplications(isAsc ? "desc" : "asc");
    setOrderApplicationsBy(property);
  };

  function descendingComparatorApplications(a, b, orderApplicationsBy) {
    if (b[orderApplicationsBy] < a[orderApplicationsBy]) {
      return -1;
    }
    if (b[orderApplicationsBy] > a[orderApplicationsBy]) {
      return 1;
    }
    return 0;
  }

  function getComparatorApplications(orderApplications, orderApplicationsBy) {
    return orderApplications === "desc"
      ? (a, b) => descendingComparatorApplications(a, b, orderApplicationsBy)
      : (a, b) => -descendingComparatorApplications(a, b, orderApplicationsBy);
  }

  function stableSortApplications(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const orderApplications = comparator(a[0], b[0]);
      if (orderApplications !== 0) {
        return orderApplications;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const applicationsHeadCell = [
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
      id: "property_manager",
      numeric: false,
      label: "Property Manager",
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
      id: "application_status",
      numeric: true,
      label: "Application Status",
    },
  ];
  function EnhancedTableHeadApplications(props) {
    const { orderApplications, orderApplicationsBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {applicationsHeadCell.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              size="small"
              sortDirection={
                orderApplicationsBy === headCell.id ? orderApplications : false
              }
            >
              <TableSortLabel
                align="center"
                active={orderApplicationsBy === headCell.id}
                direction={
                  orderApplicationsBy === headCell.id
                    ? orderApplications
                    : "asc"
                }
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderApplicationsBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {orderApplications === "desc"
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

  EnhancedTableHeadApplications.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    orderApplications: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderApplicationsBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  return stage === "LIST" ? (
    <div className="w-100 overflow-hidden">
      <MailDialogManager
        title={"Email"}
        isOpen={showMailFormManager}
        senderPhone={user.phone_number}
        senderEmail={user.email}
        senderName={user.first_name + " " + user.last_name}
        requestCreatedBy={user.user_uid}
        userMessaged={selectedManager.manager_id}
        receiverEmail={selectedManager.manager_email}
        receiverPhone={selectedManager.manager_phone_number}
        onCancel={onCancelManagerMail}
      />
      <MessageDialogManager
        title={"Text Message"}
        isOpen={showMessageFormManager}
        senderPhone={user.phone_number}
        senderEmail={user.email}
        senderName={user.first_name + " " + user.last_name}
        requestCreatedBy={user.user_uid}
        userMessaged={selectedManager.manager_id}
        receiverEmail={selectedManager.manager_email}
        receiverPhone={selectedManager.manager_phone_number}
        onCancel={onCancelManagerMessage}
      />
      <ConfirmDialog2
        title={"Please Complete your Profile"}
        isOpen={showDialog}
        onConfirm={ProfileNotComplete}
      />
      {!isLoading && tenantData.length > 0 ? (
        <Row className="w-100 mb-5 overflow-hidden">
          <Col
            xs={2}
            hidden={!responsiveSidebar.showSidebar}
            style={sidebarStyle}
          >
            <SideBar />
          </Col>
          <Col className="w-100 mb-5 overflow-scroll">
            <Header title="Tenant Dashboard" />
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              {announcements.length > 0 ? (
                <Row className="m-3">
                  <h3>Announcements</h3>
                  <Carousel slide={false}>
                    {announcements.map((announce) => {
                      return (
                        <CarouselItem>
                          <div className="align-items-center w-100 p-4">
                            <p style={(subHeading, { textAlign: "center" })}>
                              {announce.announcement_title}
                            </p>
                            <p style={{ textAlign: "center" }}>
                              {" "}
                              {announce.announcement_msg}
                            </p>
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </Carousel>
                </Row>
              ) : (
                <Row className="m-3">
                  <h3>Announcements</h3>
                  <Carousel slide={false}>
                    <CarouselItem>
                      <div className="align-items-center w-100 p-4">
                        <p style={(subHeading, { textAlign: "center" })}>
                          No current announcements
                        </p>
                      </div>
                    </CarouselItem>
                  </Carousel>
                </Row>
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
                  <h3>Properties</h3>
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
                    rowCount={tenantData.length}
                  />{" "}
                  <TableBody>
                    {stableSort(tenantData, getComparator(order, orderBy)).map(
                      (property, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={property.property_uid}
                            onClick={() => {
                              navigate(
                                `/tenantPropertyDetails/${property.property_uid}`,
                                {
                                  state: {
                                    property: property,
                                    property_uid: property.property_uid,
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
                            >
                              {property.address}
                              {property.unit !== ""
                                ? " " + property.unit
                                : ""}{" "}
                              {property.city}, {property.state}
                              <div className="d-flex">
                                <div className="d-flex align-items-end">
                                  <p
                                    style={{ ...blue, ...xSmall }}
                                    className="mb-0"
                                  >
                                    {property.tenant_end_early_applications
                                      ? "You requested to end the lease early"
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
                                    {property.pm_end_early_applications
                                      ? "PM requested to end the lease early"
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
                                    {property.tenant_extend_lease_applications
                                      ? "You requested to extend the lease"
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
                                    {property.extend_lease_applications
                                      ? "PM requested to extend the lease"
                                      : ""}
                                  </p>
                                </div>
                              </div>
                              {property.rental_status === "ACTIVE" ||
                              property.rental_status === "PENDING" ? (
                                ""
                              ) : (
                                <div className="d-flex">
                                  <div className="d-flex align-items-end">
                                    <p
                                      style={{ ...red, ...xSmall }}
                                      className="mb-0"
                                    >
                                      {property.pm_refused_applications
                                        ? `${property.pm_refused_applications.length} PM refused the lease`
                                        : ""}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {property.city}, {property.state}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {property.zip}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {
                                property.property_manager[0]
                                  .manager_business_name
                              }
                            </TableCell>

                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {property.property_type}
                            </TableCell>

                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {property.num_beds + "/" + property.num_baths}
                            </TableCell>

                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {property.lease_end}
                            </TableCell>
                          </TableRow>
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
                  <h3>Manifest Your Next Place</h3>
                </Col>
                <Col>
                  <img
                    src={SearchProperties_Black}
                    alt="Search Icon"
                    onClick={() => {
                      navigate("/tenantAvailableProperties");
                      window.scrollTo(0, 0);
                    }}
                    style={{
                      width: "30px",
                      height: "30px",
                      float: "right",
                      marginRight: "3rem",
                    }}
                  />
                </Col>
              </Row>
              {applications.length > 0 ? (
                <Row className="m-3">
                  <Row style={{ overflow: "scroll" }}>
                    <Table
                      responsive="xl"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <EnhancedTableHeadApplications
                        orderApplications={orderApplications}
                        orderApplicationsBy={orderApplicationsBy}
                        onRequestSort={handleRequestSortApplications}
                        rowCount={applications.length}
                      />{" "}
                      <TableBody>
                        {stableSortApplications(
                          applications,
                          getComparatorApplications(
                            orderApplications,
                            orderApplicationsBy
                          )
                        ).map((application, index) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={application.application_uid}
                              onClick={() =>
                                goToReviewPropertyLease(application)
                              }
                            >
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {JSON.parse(application.images).length > 0 ? (
                                  <img
                                    src={`${
                                      JSON.parse(application.images)[0]
                                    }?${Date.now()}`}
                                    alt="application"
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
                                    alt="application"
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
                                {application.address}
                                {application.unit !== ""
                                  ? " " + application.unit
                                  : ""}{" "}
                                {application.city}, {application.state}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {application.city}, {application.state}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {application.zip}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {application.business_name}
                              </TableCell>

                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {application.property_type}
                              </TableCell>

                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {application.num_beds +
                                  "/" +
                                  application.num_baths}
                              </TableCell>

                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {application.application_status === "NEW" ? (
                                  <h6 style={{ mediumBold, color: "blue" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "REJECTED" ? (
                                  <h6 style={{ mediumBold, color: "red" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "REFUSED" ? (
                                  <h6 style={{ mediumBold, color: "red" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "PM END EARLY" ? (
                                  <h6 style={{ mediumBold, color: "#E4CD05" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "TENANT END EARLY" ? (
                                  <h6 style={{ mediumBold, color: "#E4CD05" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "RENTED" ? (
                                  <h6 style={{ mediumBold, color: "green" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "FORWARDED" ? (
                                  <h6 style={{ mediumBold, color: "green" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "ACCEPTED" ? (
                                  <h6 style={{ mediumBold, color: "green" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "LEASE EXTENSION" ? (
                                  <h6 style={{ mediumBold, color: "blue" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "TENANT LEASE EXTENSION" ? (
                                  <h6 style={{ mediumBold, color: "blue" }}>
                                    {application.application_status}
                                  </h6>
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
                </Row>
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
                  <h3>Payment Summary</h3>
                </Col>
              </Row>
              <Row className="my-1">
                {tenantData.length !== 0 && (
                  <TenantUpcomingPayments
                    data={upcomingPaymentsData}
                    type={true}
                  />
                )}
              </Row>
              <Row className="my-1">
                {tenantData.length !== 0 && (
                  <TenantPaymentHistory data={paymentHistoryData} />
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
                  <h3>Maintenance and Repairs</h3>
                </Col>
                <Col>
                  <img
                    src={AddIcon}
                    alt="Add Icon"
                    onClick={() => {
                      setStage("ADDREQUEST");
                      window.scrollTo(0, 0);
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
                                `/tenant-repairs/${request.maintenance_request_uid}`,
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
                                    ? "red"
                                    : request.request_status === "PROCESSING"
                                    ? "orange"
                                    : request.request_status === "SCHEDULE"
                                    ? "blue"
                                    : request.request_status === "RESCHEDULE"
                                    ? "yellow"
                                    : request.request_status === "SCHEDULED"
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
                              {request.request_type !== null
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
                </Row>
              ) : (
                <Row className="m-3">
                  <div className="m-3">
                    No maintenance requests and repairs{" "}
                  </div>
                </Row>
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
                  <h3>Property Manager Info</h3>
                </Col>
              </Row>
              <Row className="m-3" style={{ overflow: "scroll" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Manager Business</TableCell>
                      <TableCell>Address Managed</TableCell>
                      <TableCell>Manager Email</TableCell>
                      <TableCell>Manager Phone</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {managerInfo.map((manager) => {
                      return (
                        <TableRow>
                          {" "}
                          <TableCell>{manager.manager_business_name}</TableCell>
                          <TableCell>
                            {manager.address} {manager.unit}, {manager.city},
                            {manager.state} {manager.zip}
                          </TableCell>
                          <TableCell>{manager.manager_email}</TableCell>
                          <TableCell>{manager.manager_phone_number}</TableCell>
                          <TableCell>
                            {" "}
                            <a href={`tel:${manager.manager_phone_number}`}>
                              <img src={Phone} alt="Phone" style={smallImg} />
                            </a>
                            <a
                              onClick={() => {
                                setShowMessageFormManager(true);
                                setSelectedManager(manager);
                              }}
                            >
                              <img
                                src={Message}
                                alt="Message"
                                style={smallImg}
                              />
                            </a>
                            <a
                              // href={`mailto:${tf.tenantEmail}`}
                              onClick={() => {
                                setShowMailFormManager(true);
                                setSelectedManager(manager);
                              }}
                            >
                              <img src={Mail} alt="Mail" style={smallImg} />
                            </a>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Row>
            </div>
            <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
              <TenantFooter />
            </div>
          </Col>
        </Row>
      ) : !isLoading && tenantData.length === 0 ? (
        <Row className="w-100 mb-5 overflow-hidden">
          <Col
            xs={2}
            hidden={!responsiveSidebar.showSidebar}
            style={sidebarStyle}
          >
            <SideBar />
          </Col>
          <Col className="w-100 mb-5 overflow-scroll">
            <Header title="Tenant Dashboard" />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h3>Welcome to Manifest My Space</h3>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <br />
              <h3>
                {tenantProfile.tenant_first_name}{" "}
                {tenantProfile.tenant_last_name}
              </h3>
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
                <Col></Col>
              </Row>
              <Row className="m-3">
                <Col>
                  <h6>No rented properties</h6>
                </Col>
                <Col></Col>
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
                  <h3>Manifest Your Next Place</h3>
                </Col>
                <Col>
                  <img
                    src={SearchProperties_Black}
                    alt="Search Icon"
                    onClick={() => {
                      navigate("/tenantAvailableProperties");
                      window.scrollTo(0, 0);
                    }}
                    style={{
                      width: "30px",
                      height: "30px",
                      float: "right",
                      marginRight: "3rem",
                    }}
                  />
                </Col>
              </Row>
              {applications.length > 0 ? (
                <Row className="m-3">
                  <Row style={{ overflow: "scroll" }}>
                    <Table
                      responsive="xl"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <EnhancedTableHeadApplications
                        orderApplications={orderApplications}
                        orderApplicationsBy={orderApplicationsBy}
                        onRequestSort={handleRequestSortApplications}
                        rowCount={applications.length}
                      />{" "}
                      <TableBody>
                        {stableSortApplications(
                          applications,
                          getComparatorApplications(
                            orderApplications,
                            orderApplicationsBy
                          )
                        ).map((application, index) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={application.application_uid}
                              // onClick={() => {
                              //   navigate(
                              //     `/tenantPropertyDetails/${application.property_uid}`,
                              //     {
                              //       state: {
                              //         property: application,
                              //         property_uid: application.property_uid,
                              //       },
                              //     }
                              //   );
                              // }}
                              onClick={() =>
                                goToReviewPropertyLease(application)
                              }
                            >
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {JSON.parse(application.images).length > 0 ? (
                                  <img
                                    src={`${
                                      JSON.parse(application.images)[0]
                                    }?${Date.now()}`}
                                    alt="application"
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
                                    alt="application"
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
                                {application.address}
                                {application.unit !== ""
                                  ? " " + application.unit
                                  : ""}{" "}
                                {application.city}, {application.state}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {application.city}, {application.state}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {application.zip}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {application.business_name}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {application.property_type}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {application.num_beds +
                                  "/" +
                                  application.num_baths}
                              </TableCell>

                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {application.application_status === "NEW" ? (
                                  <h6 style={{ mediumBold, color: "blue" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "REJECTED" ? (
                                  <h6 style={{ mediumBold, color: "red" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "REFUSED" ? (
                                  <h6 style={{ mediumBold, color: "red" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "PM END EARLY" ? (
                                  <h6 style={{ mediumBold, color: "#E4CD05" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "TENANT END EARLY" ? (
                                  <h6 style={{ mediumBold, color: "#E4CD05" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "RENTED" ? (
                                  <h6 style={{ mediumBold, color: "green" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "FORWARDED" ? (
                                  <h6 style={{ mediumBold, color: "green" }}>
                                    {application.application_status}
                                  </h6>
                                ) : application.application_status ===
                                  "ACCEPTED" ? (
                                  <h6 style={{ mediumBold, color: "yellow" }}>
                                    {application.application_status}
                                  </h6>
                                ) : (
                                  <h6>{application.application_status}</h6>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Row>
                </Row>
              ) : (
                <Row className="m-3">
                  <Col>
                    <h6>No applications</h6>
                  </Col>
                  <Col></Col>
                </Row>
              )}
            </div>
            <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
              <TenantFooter />
            </div>
          </Col>
        </Row>
      ) : (
        <Row className="w-100 mb-5 overflow-hidden">
          <Col
            xs={2}
            hidden={!responsiveSidebar.showSidebar}
            style={sidebarStyle}
          >
            <SideBar />
          </Col>
          <Col className="w-100 d-flex flex-column justify-content-center align-items-center">
            <ReactBootStrap.Spinner animation="border" role="status" />
            <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
              <TenantFooter />
            </div>
          </Col>
        </Row>
      )}
    </div>
  ) : stage === "ADDREQUEST" ? (
    <div className="TenantDashboard">
      <Row className="w-100 mb-5 overflow-hidden">
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5 overflow-scroll">
          <Header
            title="Add Repair Request"
            leftText="< Back"
            leftFn={() => setStage("LIST")}
          />
          <TenantRepairRequest
            properties={tenantData}
            cancel={() => setStage("LIST")}
            onSubmit={addProperty}
          />
          <div hidden={responsiveSidebar.showSidebar}>
            <TenantFooter />
          </div>
        </Col>
      </Row>
    </div>
  ) : (
    ""
  );
}
