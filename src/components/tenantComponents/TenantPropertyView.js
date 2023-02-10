import React, { useState, useEffect, useContext } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
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
import TenantFooter from "./TenantFooter";
import TenantRepairRequest from "./TenantRepairRequest";
import AppContext from "../../AppContext";
import ConfirmDialog from "../ConfirmDialog";
import SideBar from "./SideBar";
import File from "../../icons/File.svg";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import AddIcon from "../../icons/AddIcon.svg";
import PropertyIcon from "../../icons/PropertyIcon.svg";
import RepairImg from "../../icons/RepairImg.svg";
import {
  smallImg,
  red,
  squareForm,
  mediumBold,
  bluePillButton,
  redPillButton,
} from "../../utils/styles";
import { get, put, post } from "../../utils/api";
import "react-multi-carousel/lib/styles.css";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});

function TenantPropertyView(props) {
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
  const [showAddRequest, setShowAddRequest] = useState(false);

  const [showSpinner, setShowSpinner] = useState(false);
  const [endEarlyDate, setEndEarlyDate] = useState("");

  const [imagesProperty, setImagesProperty] = useState([]);
  const [showTenantAgreement, setShowTenantAgreement] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [feeState, setFeeState] = useState([]);
  const [contactState, setContactState] = useState([]);
  const [files, setFiles] = useState([]);
  const [terminateLease, setTerminateLease] = useState(false);
  const [lastDate, setLastDate] = useState("");
  const [message, setMessage] = useState("");
  const [tenantEndEarly, setTenantEndEarly] = useState(false);
  const [tenantExtendLease, setTenantExtendLease] = useState(false);
  const [pmEndEarly, setPmEndEarly] = useState(false);
  const [showTenantProfile, setShowTenantProfile] = useState(false);
  const [disableEndLease, setDisable] = useState(false);
  // sorting variables
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
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
  const [errorMessage, setErrorMessage] = useState("");
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
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
  function ordinal_suffix_of(i) {
    var j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  }
  const days = (date_1, date_2) => {
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  };
  const extendLease = async () => {
    // console.log("Extending Lease");
    setShowSpinner(true);
    const extendObject = {
      application_status: "TENANT LEASE EXTENSION",
      property_uid: property.property_uid,
      message: "Requesting to Extend Lease",
    };
    let apps = property.applications.filter(
      (a) => a.application_status === "RENTED"
    );
    extendObject.application_uid =
      apps.length > 0 ? apps[0].application_uid : null;
    const response6 = await put("/extendLease", extendObject, access_token);
    const newMessage = {
      sender_name:
        property.rentalInfo[0].tenant_first_name +
        " " +
        property.rentalInfo[0].tenant_last_name,
      sender_email: property.rentalInfo[0].tenant_email,
      sender_phone: property.rentalInfo[0].tenant_phone_number,
      message_subject: "Extend Lease",
      message_details: "Tenant has requested to extend the lease",
      message_created_by: property.rentalInfo[0].tenant_id,
      user_messaged: property.property_manager[0].manager_id,
      message_status: "PENDING",
      receiver_email: property.property_manager[0].manager_email,
    };
    // console.log(newMessage);
    const responseMsg = await post("/message", newMessage);
    // console.log(response6.result);
    setShowSpinner(false);
    navigate("/tenant");
  };
  const rejectExtension = async () => {
    setShowSpinner(true);
    let request_body = {
      application_status: "REFUSED",
      property_uid: property.property_uid,
    };

    const response = await put("/extendLease", request_body);
    const newMessage = {
      sender_name: property.managerInfo.manager_business_name,
      sender_email: property.managerInfo.manager_email,
      sender_phone: property.managerInfo.manager_phone_number,
      message_subject: "Extend Lease Request Withdraw",
      message_details: "Tenant has withdrawn the request to extend the lease",
      message_created_by: property.managerInfo.manager_id,
      user_messaged: property.rentalInfo[0].tenant_id,
      message_status: "PENDING",
      receiver_email: property.rentalInfo[0].tenant_email,
    };
    // console.log(newMessage);
    const responseMsg = await post("/message", newMessage);
    setTenantExtendLease(false);
    setShowSpinner(false);
  };
  const renewLeaseAgreement = async () => {
    reloadProperty();
  };

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    const currentYear = new Date().getFullYear();
    let currentDate = new Date(currentYear, currentMonth, currentDay);
    let tempEndEarlyDate = lastDate.split("-");
    let newEndEarlyDate = new Date(
      parseInt(tempEndEarlyDate[0]),
      parseInt(tempEndEarlyDate[1]) - 1,
      parseInt(tempEndEarlyDate[2])
    );
    // console.log(newEndEarlyDate);
    // console.log(currentDate);
    let difference = newEndEarlyDate - currentDate;
    // console.log(difference);
    if (difference < 864000000) {
      setDisable(true);
      // console.log("disabled");
    } else {
      // console.log("enabled");
      setDisable(false);
    }
  }, [lastDate]);
  const terminateLeaseAgreement = async () => {
    if (lastDate === "") {
      setErrorMessage("Please select a last date");
      return;
    }
    setShowSpinner(true);

    const request_body = {
      application_status: "TENANT END EARLY",
      property_uid: property.property_uid,
      early_end_date: lastDate,
      message: message,
    };
    const response = await put("/endEarly", request_body);
    const newMessage = {
      sender_name:
        property.rentalInfo[0].tenant_first_name +
        " " +
        property.rentalInfo[0].tenant_last_name,
      sender_email: property.rentalInfo[0].tenant_email,
      sender_phone: property.rentalInfo[0].tenant_phone_number,
      message_subject: "End Lease Early",
      message_details:
        "Tenant has requested to end the lease early on " + lastDate,
      message_created_by: property.rentalInfo[0].tenant_id,
      user_messaged: property.property_manager[0].manager_id,
      message_status: "PENDING",
      receiver_email: property.property_manager[0].manager_email,
    };
    // console.log(newMessage);
    const responseMsg = await post("/message", newMessage);
    setTenantEndEarly(true);
    setShowSpinner(false);
    reloadProperty();
  };

  const endEarlyRequestResponse = async (end_early) => {
    setShowSpinner(true);
    let request_body = {
      application_status: "",
      property_uid: property.property_uid,
    };

    if (end_early) {
      request_body.application_status = "TENANT ENDED";

      let apps = property.applications.filter(
        (a) => a.application_status === "PM END EARLY"
      );
      request_body.application_uid =
        apps.length > 0 ? apps[0].application_uid : null;
    } else {
      request_body.application_status = "REFUSED";
    }
    const response = await put("/endEarly", request_body);
    if (request_body.application_status === "TENANT ENDED") {
      const newMessage = {
        sender_name:
          property.rentalInfo[0].tenant_first_name +
          " " +
          property.rentalInfo[0].tenant_last_name,
        sender_email: property.rentalInfo[0].tenant_email,
        sender_phone: property.rentalInfo[0].tenant_phone_number,
        message_subject: "End Lease Early Request Accepted",
        message_details:
          "Tenant has accepted your request  to end the lease early on " +
          lastDate,
        message_created_by: property.rentalInfo[0].tenant_id,
        user_messaged: property.property_manager[0].manager_id,
        message_status: "PENDING",
        receiver_email: property.property_manager[0].manager_email,
      };
      // console.log(newMessage);
      const responseMsg = await post("/message", newMessage);
      navigate("../tenant");
    } else {
      const newMessage = {
        sender_name:
          property.rentalInfo[0].tenant_first_name +
          " " +
          property.rentalInfo[0].tenant_last_name,
        sender_email: property.rentalInfo[0].tenant_email,
        sender_phone: property.rentalInfo[0].tenant_phone_number,
        message_subject: "End Lease Early Request Declined",
        message_details:
          "Tenant has refused to end the lease early on " + lastDate,
        message_created_by: property.rentalInfo[0].tenant_id,
        user_messaged: property.property_manager[0].manager_id,
        message_status: "PENDING",
        receiver_email: property.property_manager[0].manager_email,
      };
      // console.log(newMessage);
      const responseMsg = await post("/message", newMessage);
      setShowSpinner(false);
      setPmEndEarly(false);
      reloadProperty();
    }
  };
  const endEarlyWithdraw = async () => {
    setShowSpinner(true);
    let request_body = {
      application_status: "RENTED",
      property_uid: property.property_uid,
      early_end_date: "",
      message: "Lease details forwarded for review",
    };

    const response = await put("/endEarly", request_body);
    const newMessage = {
      sender_name:
        property.rentalInfo[0].tenant_first_name +
        " " +
        property.rentalInfo[0].tenant_last_name,
      sender_email: property.rentalInfo[0].tenant_email,
      sender_phone: property.rentalInfo[0].tenant_phone_number,
      message_subject: "End Lease Early Request Withdraw",
      message_details:
        "Tenant has withdrawn the request to end the lease early on " +
        lastDate,
      message_created_by: property.rentalInfo[0].tenant_id,
      user_messaged: property.property_manager[0].manager_id,
      message_status: "PENDING",
      receiver_email: property.property_manager[0].manager_email,
    };
    // console.log(newMessage);
    const responseMsg = await post("/message", newMessage);
    setTerminateLease(false);
    setTenantEndEarly(false);
    setShowSpinner(false);
    setLastDate("");
    setMessage("");
  };
  const fetchProperty = async () => {
    const response = await get(
      `/propertiesTenantDetail?property_uid=${property_uid}&tenant_id=${user.user_uid}`
    );
    // console.log(response.result[0]);
    setImagesProperty(JSON.parse(response.result[0].images));

    applianceState[1](JSON.parse(response.result[0].appliances));
    const property_details = response.result[0];

    property_details.tenants = property_details.rentalInfo.filter(
      (r) => r.rental_status === "ACTIVE"
    );

    setProperty(property_details);
    property_details.rentalInfo.forEach((rental) => {
      if (rental.rental_status === "ACTIVE") {
        setSelectedAgreement(rental);

        setFeeState(JSON.parse(rental.rent_payments));

        setContactState(JSON.parse(rental.assigned_contacts));
        // console.log(rental["r.documents"]);
        setFiles(JSON.parse(rental["r.documents"]));
        let app = rental.application_status === "TENANT END EARLY";

        // console.log(app);
        if (app) {
          setTenantEndEarly(true);
        }
        let appEL = rental.application_status === "LEASE EXTENSION";

        // console.log(app);
        if (appEL) {
          setTenantExtendLease(true);
        }
        let appPM = rental.application_status === "PM END EARLY";

        if (appPM) {
          setPmEndEarly(true);
        }
      }
    });
  };
  // console.log(property);
  useState(() => {
    fetchProperty();
  });

  const headerBack = () => {
    showTenantProfile
      ? setShowTenantProfile(false)
      : showAddRequest
      ? setShowAddRequest(false)
      : navigate("../tenant");
  };

  const reloadProperty = () => {
    setShowAddRequest(false);
    window.scrollTo(0, 0);
    fetchProperty();
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

  return Object.keys(property).length > 1 ? (
    <div>
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
        <div className="w-100 mb-5 overflow-scroll overflow-hidden">
          <Header
            title="Property Details"
            leftText={location.state === null ? "" : "< Back"}
            leftFn={headerBack}
          />
          {showAddRequest ? (
            <TenantRepairRequest
              properties={property}
              cancel={() => setShowAddRequest(false)}
              onSubmit={reloadProperty}
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
                  <Col></Col>
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
                        <TableCell>Manager</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Rent</TableCell>
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
                        <TableCell padding="none" size="small" align="center">
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
                          {property.property_manager.length !== 0
                            ? property.property_manager[0].manager_business_name
                            : "None"}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {property.property_type}
                        </TableCell>

                        <TableCell padding="none" size="small" align="center">
                          {property.num_beds + "/" + property.num_baths}
                        </TableCell>

                        <TableCell padding="none" size="small" align="center">
                          {"$" + property.listed_rent}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
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
                    <TableRow>
                      <TableCell padding="none" size="small" align="center">
                        Description
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {" "}
                        {property.description === "null" ||
                        property.description === "" ||
                        property.description === null
                          ? "Not Available"
                          : property.description}
                      </TableCell>
                    </TableRow>
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
                    <h3>Maintenance and Repair Requests</h3>
                  </Col>
                  <Col xs={2}>
                    {" "}
                    <img
                      src={AddIcon}
                      alt="Add Icon"
                      onClick={() => setShowAddRequest(true)}
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
                                {request.assigned_business !== null ||
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
                  ) : (
                    <Row className="m-3">
                      <div className="m-3">
                        No maintenance or repair requests
                      </div>
                    </Row>
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
                  <Col></Col>
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
                    {/* {console.log("appliances", appliances, applianceState)} */}
                    <TableBody>
                      {appliances.map((appliance, i) => {
                        return applianceState[0][appliance]["available"] ==
                          true ||
                          applianceState[0][appliance]["available"] ==
                            "True" ? (
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

                            {applianceState[0][appliance]["images"] !==
                              undefined &&
                            applianceState[0][appliance]["images"].length >
                              0 ? (
                              <TableCell>
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
                </Row>
                <Row className="m-3">
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          {property.pets_allowed === 0 ? "No" : "Yes"}
                        </TableCell>
                        <TableCell>
                          {property.deposit_for_rent === 0 ? "No" : "Yes"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Row>
              </div>
              {selectedAgreement ? (
                <div
                  className="mx-3 p-2"
                  style={{
                    background: "#E9E9E9 0% 0% no-repeat padding-box",
                    borderRadius: "10px 10px 0px 0px",
                    opacity: 1,
                  }}
                >
                  <Row className="m-3">
                    <Col>
                      <h3>Application Details</h3>
                    </Col>
                    <Col xs={2}> </Col>
                  </Row>
                </div>
              ) : (
                ""
              )}
              {selectedAgreement ? (
                <div
                  className="mx-3 mb-3 p-2"
                  style={{
                    background: "#E9E9E9 0% 0% no-repeat padding-box",
                    borderRadius: "0px 0px 10px 10px",
                    opacity: 1,
                  }}
                >
                  <Row className="m-3" style={{ overflow: "scroll" }}>
                    <Table classes={{ root: classes.customTable }} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Application Status</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Message</TableCell>
                          <TableCell>Adults</TableCell>
                          <TableCell>Children</TableCell>
                          <TableCell>Pets</TableCell>
                          <TableCell>Vehicles</TableCell>
                          <TableCell>Referred</TableCell>
                          <TableCell>Application Date</TableCell>
                          <TableCell>Documents</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow className="mt-2">
                          <TableCell>
                            {selectedAgreement.application_status}
                          </TableCell>
                          <TableCell>
                            {`${selectedAgreement.tenant_first_name} ${selectedAgreement.tenant_last_name} `}
                          </TableCell>
                          <TableCell>
                            Note: {selectedAgreement.message}
                          </TableCell>
                          {selectedAgreement.adults ? (
                            <TableCell align="center">
                              {JSON.parse(selectedAgreement.adults).length}
                            </TableCell>
                          ) : (
                            <TableCell align="center">0</TableCell>
                          )}
                          {selectedAgreement.children ? (
                            <TableCell align="center">
                              {JSON.parse(selectedAgreement.children).length}
                            </TableCell>
                          ) : (
                            <TableCell align="center">0</TableCell>
                          )}

                          {selectedAgreement.pets ? (
                            <TableCell align="center">
                              {JSON.parse(selectedAgreement.pets).length}
                            </TableCell>
                          ) : (
                            <TableCell align="center">0</TableCell>
                          )}
                          {selectedAgreement.vehicles ? (
                            <TableCell align="center">
                              {JSON.parse(selectedAgreement.vehicles).length}
                            </TableCell>
                          ) : (
                            <TableCell align="center">0</TableCell>
                          )}
                          {selectedAgreement.referred ? (
                            <TableCell align="center">
                              {JSON.parse(selectedAgreement.referred).length}
                            </TableCell>
                          ) : (
                            <TableCell align="center">0</TableCell>
                          )}
                          <TableCell>
                            {selectedAgreement.application_date.split(" ")[0]}
                          </TableCell>

                          <TableCell>
                            {selectedAgreement.documents &&
                              selectedAgreement.documents.length > 0 &&
                              JSON.parse(selectedAgreement.documents).map(
                                (document, i) => (
                                  <div
                                    className="d-flex justify-content-between align-items-end ps-0"
                                    key={i}
                                  >
                                    <h6>{document.name}</h6>
                                    <a
                                      href={document.link}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <img
                                        src={File}
                                        alt="open document"
                                        style={{
                                          width: "15px",
                                          height: "15px",
                                        }}
                                      />
                                    </a>
                                  </div>
                                )
                              )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Row>
                </div>
              ) : (
                " "
              )}

              {selectedAgreement ? (
                <div
                  className="mx-3 p-2"
                  style={{
                    background: "#E9E9E9 0% 0% no-repeat padding-box",
                    borderRadius: "10px 10px 0px 0px",
                    opacity: 1,
                  }}
                >
                  <Row className="m-3">
                    <Col>
                      <h3>Lease Agreement</h3>
                    </Col>
                    <Col xs={2}></Col>
                  </Row>
                </div>
              ) : (
                <div
                  className="mx-3 p-2"
                  style={{
                    background: "#E9E9E9 0% 0% no-repeat padding-box",
                    borderRadius: "10px 10px 0px 0px",
                    opacity: 1,
                  }}
                >
                  <Row className="m-3">
                    <h4
                      style={{
                        color: "red",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      Property Manager Rejected Application
                    </h4>
                  </Row>
                </div>
              )}
              <div
                className="mx-3 p-2"
                style={{
                  background: "#E9E9E9 0% 0% no-repeat padding-box",
                  borderRadius: "0px 0px 10px 10px",
                  opacity: 1,
                }}
              >
                <Row>
                  {selectedAgreement ? (
                    <div>
                      <Row className="mb-4 m-3" style={{ hidden: "overflow" }}>
                        <h5>Lease Details</h5>
                        <Table
                          responsive="md"
                          classes={{ root: classes.customTable }}
                          size="small"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Lease Start</TableCell>
                              <TableCell>Lease End</TableCell>
                              <TableCell>Rent Due</TableCell>
                              <TableCell>Later fees after(days)</TableCell>
                              <TableCell>Late Fee (one-time)</TableCell>
                              <TableCell>Late Fee (per day)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                {selectedAgreement.lease_start}
                              </TableCell>

                              <TableCell>
                                {selectedAgreement.lease_end}
                              </TableCell>

                              <TableCell>
                                {`${ordinal_suffix_of(
                                  selectedAgreement.due_by
                                )} of the month`}
                              </TableCell>

                              <TableCell>
                                {selectedAgreement.late_by} days
                              </TableCell>
                              <TableCell>
                                {" "}
                                ${selectedAgreement.late_fee}
                              </TableCell>
                              <TableCell>
                                {" "}
                                ${selectedAgreement.perDay_late_fee}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Row>

                      <Row className="mb-4 m-3" style={{ overflow: "scroll" }}>
                        <h5>Lease Payments</h5>
                        <Table
                          responsive="md"
                          classes={{ root: classes.customTable }}
                          size="small"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Fee Name</TableCell>
                              <TableCell>Amount</TableCell>
                              <TableCell>Of</TableCell>
                              <TableCell>Frequency</TableCell>
                              <TableCell>Available to Pay</TableCell>
                              <TableCell>Due Date</TableCell>
                              <TableCell>Late Fees After (days)</TableCell>
                              <TableCell>Late Fee (one-time)</TableCell>
                              <TableCell>Late Fee (per day)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {feeState.map((fee, i) => (
                              <TableRow>
                                <TableCell>{fee.fee_name}</TableCell>

                                <TableCell>
                                  {fee.fee_type === "%"
                                    ? `${fee.charge}%`
                                    : `$${fee.charge}`}
                                </TableCell>

                                <TableCell>
                                  {fee.fee_type === "%" ? `${fee.of}` : ""}
                                </TableCell>

                                <TableCell>{fee.frequency}</TableCell>
                                <TableCell>{`${fee.available_topay} days before`}</TableCell>
                                <TableCell>
                                  {fee.due_by === ""
                                    ? `1st of the month`
                                    : `${ordinal_suffix_of(
                                        fee.due_by
                                      )} of the month`}
                                </TableCell>
                                <TableCell>{fee.late_by} days</TableCell>
                                <TableCell>${fee.late_fee}</TableCell>
                                <TableCell>
                                  ${fee.perDay_late_fee}/day
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Row>

                      <Row
                        className="mb-4 m-3"
                        hidden={contactState.length === 0}
                      >
                        <h5 style={mediumBold}>Contact Details</h5>
                        <Table
                          classes={{ root: classes.customTable }}
                          size="small"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Contact Name</TableCell>
                              <TableCell>Role</TableCell>
                              <TableCell>Email</TableCell>
                              <TableCell>Phone Number</TableCell>

                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {contactState.map((contact, i) => (
                              <TableRow key={i}>
                                <TableCell>
                                  {contact.first_name} {contact.last_name}
                                </TableCell>
                                <TableCell>{contact.company_role}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.phone_number}</TableCell>
                                <TableCell>
                                  <a href={`tel:${contact.phone_number}`}>
                                    <img
                                      src={Phone}
                                      alt="Phone"
                                      style={smallImg}
                                    />
                                  </a>
                                  <a href={`mailto:${contact.email}`}>
                                    <img
                                      src={Message}
                                      alt="Message"
                                      style={smallImg}
                                    />
                                  </a>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Row>
                      <Row className="m-3" hidden={files.length === 0}>
                        <h5 style={mediumBold}>Lease Documents</h5>
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
                            {files.map((file) => {
                              return (
                                <TableRow>
                                  <TableCell>{file.description}</TableCell>
                                  <TableCell>
                                    <a
                                      href={file.link}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <img
                                        src={File}
                                        alt="open document"
                                        style={{
                                          width: "15px",
                                          height: "15px",
                                        }}
                                      />
                                    </a>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </Row>
                      {selectedAgreement.application_status === "REFUSED" ||
                      selectedAgreement.application_status === "REJECTED" ||
                      selectedAgreement.application_status === "ENDED" ? (
                        <Row>
                          {selectedAgreement.application_status === "NEW" ? (
                            <h4 style={{ mediumBold, color: "blue" }}>
                              {selectedAgreement.application_status}
                            </h4>
                          ) : selectedAgreement.application_status ===
                            "REJECTED" ? (
                            <h4 style={{ mediumBold, color: "red" }}>
                              {selectedAgreement.application_status}
                            </h4>
                          ) : selectedAgreement.application_status ===
                            "REFUSED" ? (
                            <h4
                              style={{
                                color: "red",
                                textAlign: "center",
                              }}
                            >
                              You {selectedAgreement.application_status} the
                              lease agreement
                            </h4>
                          ) : selectedAgreement.application_status ===
                            "ENDED" ? (
                            <h4 style={{ mediumBold, color: "red" }}>
                              {selectedAgreement.application_status}
                            </h4>
                          ) : (
                            ""
                          )}
                        </Row>
                      ) : (
                        <Row className="m-3">
                          {Math.floor(
                            (new Date(selectedAgreement.lease_end).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) < 60 ? (
                            <Row
                              className="pt-4 my-4"
                              hidden={
                                selectedAgreement === null ||
                                tenantExtendLease ||
                                tenantEndEarly ||
                                pmEndEarly
                              }
                            >
                              <Col className="d-flex flex-row justify-content-evenly">
                                <Button
                                  style={bluePillButton}
                                  variant="outline-primary"
                                  onClick={() => extendLease()}
                                >
                                  Extend Lease
                                </Button>
                              </Col>
                            </Row>
                          ) : (
                            ""
                          )}
                          {tenantExtendLease ? (
                            <div className="my-4">
                              <h5 style={mediumBold}>
                                You requested to extend the lease. Further
                                Information to extend your current lease will
                                require approval from your property manager.
                              </h5>

                              <Row
                                className="pt-4 my-4"
                                hidden={tenantEndEarly || pmEndEarly}
                              >
                                <Col className="d-flex flex-row justify-content-evenly">
                                  <Button
                                    style={redPillButton}
                                    variant="outline-primary"
                                    onClick={() => {
                                      rejectExtension();
                                    }}
                                  >
                                    Withdraw request
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          ) : (
                            ""
                          )}

                          {terminateLease ? (
                            <div
                              hidden={
                                selectedAgreement === null ||
                                tenantExtendLease ||
                                tenantEndEarly ||
                                pmEndEarly
                              }
                            >
                              <Row>
                                <Col className="d-flex flex-row justify-content-evenly">
                                  <Form.Group className="mx-2 my-3">
                                    <Form.Label as="h6" className="mb-0 ms-2">
                                      Please Select an end early date. (Minimum:
                                      10 days)
                                      {lastDate === "" ? required : ""}
                                    </Form.Label>
                                    <Form.Control
                                      style={squareForm}
                                      type="date"
                                      value={lastDate}
                                      onChange={(e) =>
                                        setLastDate(e.target.value)
                                      }
                                    />
                                  </Form.Group>
                                </Col>
                                <Col className="d-flex flex-row justify-content-evenly">
                                  <Form.Group className="mx-2 my-3">
                                    <Form.Label as="h6" className="mb-0 ms-2">
                                      Why do you wish to end the lease early.{" "}
                                      {message === "" ? required : ""}
                                    </Form.Label>
                                    <Form.Control
                                      style={squareForm}
                                      value={message}
                                      onChange={(e) =>
                                        setMessage(e.target.value)
                                      }
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row>
                                {disableEndLease ? (
                                  <Col className="d-flex flex-row justify-content-evenly">
                                    <Button
                                      disabled
                                      style={redPillButton}
                                      variant="outline-primary"
                                      onClick={() => terminateLeaseAgreement()}
                                    >
                                      Notify intent to terminate
                                    </Button>
                                  </Col>
                                ) : (
                                  <Col className="d-flex flex-row justify-content-evenly">
                                    <Button
                                      style={redPillButton}
                                      variant="outline-primary"
                                      onClick={() => terminateLeaseAgreement()}
                                    >
                                      Notify intent to terminate
                                    </Button>
                                  </Col>
                                )}
                                <Col className="d-flex flex-row justify-content-evenly">
                                  <Button
                                    style={bluePillButton}
                                    variant="outline-primary"
                                    onClick={() => setTerminateLease(false)}
                                  >
                                    Cancel
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          ) : (
                            <Row>
                              <Col className="d-flex flex-row justify-content-evenly">
                                <Button
                                  style={redPillButton}
                                  variant="outline-primary"
                                  hidden={
                                    selectedAgreement === null ||
                                    tenantExtendLease ||
                                    tenantEndEarly ||
                                    pmEndEarly
                                  }
                                  onClick={() => setTerminateLease(true)}
                                >
                                  Terminate Lease
                                </Button>
                              </Col>
                            </Row>
                          )}

                          {pmEndEarly ? (
                            <div className="my-4">
                              <h5 style={mediumBold}>
                                PM Requests to end lease early on{" "}
                                {selectedAgreement.early_end_date}
                              </h5>
                              <Row className="my-4">
                                <Col className="d-flex flex-row justify-content-evenly">
                                  <Button
                                    style={bluePillButton}
                                    variant="outline-primary"
                                    onClick={() =>
                                      endEarlyRequestResponse(true)
                                    }
                                  >
                                    Terminate Lease
                                  </Button>
                                </Col>
                                <Col className="d-flex flex-row justify-content-evenly">
                                  <Button
                                    style={redPillButton}
                                    variant="outline-primary"
                                    onClick={() =>
                                      endEarlyRequestResponse(false)
                                    }
                                  >
                                    Reject request
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          ) : (
                            ""
                          )}
                          {tenantEndEarly ? (
                            <div className="my-4 ">
                              <h5
                                style={mediumBold}
                                className="d-flex justify-content-center align-items-center flex-row"
                              >
                                You requested to end lease early on{" "}
                                {selectedAgreement.early_end_date}
                              </h5>
                              <Row className="my-4">
                                <Col className="d-flex flex-row justify-content-evenly">
                                  <Button
                                    style={redPillButton}
                                    variant="outline-primary"
                                    onClick={() => endEarlyWithdraw()}
                                  >
                                    Withdraw request
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          ) : (
                            ""
                          )}
                        </Row>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  {showSpinner ? (
                    <div className="w-100 d-flex flex-column justify-content-center align-items-center h-50">
                      <ReactBootStrap.Spinner
                        animation="border"
                        role="status"
                      />
                    </div>
                  ) : (
                    ""
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
                    <h3>Property Manager Info</h3>
                  </Col>
                </Row>
                <Row className="m-3">
                  <Table
                    classes={{ root: classes.customTable }}
                    size="small"
                    responsive="md"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Manager Business</TableCell>
                        <TableCell>Manager Email</TableCell>
                        <TableCell>Manager Phone</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {" "}
                        <TableCell>
                          {property.property_manager[0].manager_business_name}
                        </TableCell>
                        <TableCell>
                          {property.property_manager[0].manager_email}
                        </TableCell>
                        <TableCell>
                          {property.property_manager[0].manager_phone_number}
                        </TableCell>
                        <TableCell>
                          {" "}
                          <a
                            href={`tel:${property.property_manager[0].manager_phone_number}`}
                          >
                            <img src={Phone} alt="Phone" style={smallImg} />
                          </a>
                          <a
                            href={`mailto:${property.property_manager[0].manager_email}`}
                          >
                            <img src={Message} alt="Message" style={smallImg} />
                          </a>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Row>
              </div>
            </div>
          )}
        </div>
      </div>
      <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-5">
        <TenantFooter />
      </div>
    </div>
  ) : (
    <div className="w-100 d-flex flex-column justify-content-center align-items-center h-50">
      <ReactBootStrap.Spinner animation="border" role="status" />
    </div>
  );
}

export default TenantPropertyView;
