import React, { useState, useContext, useEffect } from "react";

import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableSortLabel,
  Box,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as ReactBootStrap from "react-bootstrap";
import moment from "moment";
import SideBar from "./SideBar";
import Header from "../Header";
import ManagerFooter from "./ManagerFooter";
import MailDialogTenant from "../MailDialog";
import MessageDialogTenant from "../MessageDialog";
import AppContext from "../../AppContext";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import Mail from "../../icons/Mail.svg";
import RepairImg from "../../icons/RepairImg.svg";
import { get, put } from "../../utils/api";
import {
  mediumBold,
  subText,
  smallImg,
  hidden,
  redPill,
  greenPill,
  sidebarStyle,
} from "../../utils/styles";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 16px 6px 16px", // <-- arbitrary value
    },
  },
});

function ManagerTenantList(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [tenants, setTenants] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState([]);
  const [userPayments, setUserPayments] = useState([]);
  const [lateAfter, setLateAfter] = useState("");
  const [lateFee, setLateFee] = useState("");
  const [lateFeePer, setLateFeePer] = useState("");
  const [dueDate, setDueDate] = useState("1");
  const [rentDetails, setRentDetails] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);

  const [managementBusiness, setManagementBusiness] = useState("");
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showMailForm, setShowMailForm] = useState(false);
  const onCancelMail = () => {
    setShowMailForm(false);
  };
  const onCancelMessage = () => {
    setShowMessageForm(false);
  };
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("days_open");

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

  const fetchTenants = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );

    let management_buid = null;
    if (management_businesses.length < 1) {
      // console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      // console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
      setManagementBusiness(management_businesses[0]);
    } else {
      management_buid = management_businesses[0].business_uid;
      setManagementBusiness(management_businesses[0]);
    }

    const response = await get(
      `/managerPropertyTenants?manager_id=` + management_buid
    );

    if (response.msg === "Token has expired") {
      refresh();
      return;
    }

    // console.log(response.result);
    setTenants(response.result);
    if (response.result.length > 0) {
      setSelectedTenant(response.result[0]);
      setDueDate(response.result[0].due_by);
      setDueDate(response.result[0].due_by);
      setLateAfter(response.result[0].late_by);
      setLateFee(response.result[0].late_fee);
      setUserPayments(response.result[0].user_payments);
      setRentDetails(JSON.parse(response.result[0].rent_payments));
      setLateFeePer(response.result[0].perDay_late_fee);
      setMaintenanceRequests(response.result[0].user_repairRequests);
      // console.log(selectedTenant);
    }
    setIsLoading(false);
    // await getAlerts(properties_unique)
  };
  // console.log(showDetails);
  useEffect(fetchTenants, [access_token]);
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const paymentsByMonth = {};
  for (const payment of userPayments) {
    const month = moment(payment.payment_date).format("MMMM YYYY");
    if (month in paymentsByMonth) {
      paymentsByMonth[month].total += payment.amount;
      paymentsByMonth[month].payments.push(payment);
    } else {
      paymentsByMonth[month] = {
        total: payment.amount,
        payments: [payment],
      };
    }
  }
  const sortedMonths = Object.keys(paymentsByMonth).sort((a, b) => {
    const aDate = moment(a);
    const bDate = moment(b);
    if (aDate < bDate) return 1;
    else if (aDate > bDate) return -1;
    else return 0;
  });
  for (const month of sortedMonths) {
    paymentsByMonth[month].payments = paymentsByMonth[month].payments.sort(
      (a, b) => {
        const aDate = moment(a.payment_date);
        const bDate = moment(b.payment_date);
        if (aDate < bDate) return 1;
        else if (aDate > bDate) return -1;
        else return 0;
      }
    );
  }
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

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

  const headCells2 = [
    {
      id: "images",
      numeric: false,
      label: "Repair Images",
    },
    {
      id: "title",
      numeric: false,
      label: "Issue",
    },
    {
      id: "description",
      numeric: false,
      label: "Description",
    },
    {
      id: "address",
      numeric: false,
      label: "Address",
    },
    {
      id: "priority",
      numeric: false,
      label: "Priority",
    },
    {
      id: "request_created_date",
      numeric: false,
      label: "Date Reported",
    },
    {
      id: "days_open",
      numeric: true,
      label: "Days Open",
    },
    {
      id: "quote_status",
      numeric: false,
      label: "Quote Status",
    },
  ];
  function EnhancedTableHead2(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {headCells2.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              size="small"
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
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

  EnhancedTableHead2.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  const headCells = [
    {
      id: "tenant_last_name",
      numeric: false,
      label: "Name",
    },
    {
      id: "unit",
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
      id: "tenant_phone_number",
      numeric: true,
      label: "Phone Number",
    },
    {
      id: "tenant_email",
      numeric: false,
      label: "Email address",
    },
    {
      id: "actions",
      numeric: false,
      label: "Actions",
    },
  ];
  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              size="small"
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
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

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  return (
    <div className="w-100 overflow-hidden">
      <Row className="w-100 mb-5 overflow-hidden">
        <MailDialogTenant
          title={"Email"}
          isOpen={showMailForm}
          senderPhone={managementBusiness.business_phone_number}
          senderEmail={managementBusiness.business_email}
          senderName={managementBusiness.business_name}
          requestCreatedBy={managementBusiness.business_uid}
          userMessaged={selectedTenant.tenant_id}
          receiverEmail={selectedTenant.tenant_email}
          receiverPhone={selectedTenant.tenant_phone_number}
          onCancel={onCancelMail}
        />

        <MessageDialogTenant
          title={"Text Message"}
          isOpen={showMessageForm}
          senderPhone={managementBusiness.business_phone_number}
          senderEmail={managementBusiness.business_email}
          senderName={managementBusiness.business_name}
          requestCreatedBy={managementBusiness.business_uid}
          userMessaged={selectedTenant.tenant_id}
          receiverEmail={selectedTenant.tenant_email}
          receiverPhone={selectedTenant.tenant_phone_number}
          onCancel={onCancelMessage}
        />
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>

        <Col className="w-100 mb-5 overflow-scroll">
          <Header title="Tenants" />
          <Row className="m-3">
            <Col>
              <h3>Tenants</h3>
            </Col>
            <Col>
              {/* <h3 style={{ float: "right", marginRight: "3rem" }}>+</h3> */}
            </Col>
          </Row>
          {isLoading ? (
            <div className="d-flex justify-content-center mb-4 mx-2 mb-2 p-3">
              <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                <ReactBootStrap.Spinner animation="border" role="status" />
              </div>
            </div>
          ) : tenants.length > 0 ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="w-100 m-3">
                <Col> Search by</Col>

                <Col>
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(event) => {
                      setSearch(event.target.value);
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
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={tenants.length}
                  />{" "}
                  <TableBody>
                    {stableSort(tenants, getComparator(order, orderBy))
                      // for filtering
                      .filter((val) => {
                        const query = search.toLowerCase();

                        return (
                          val.address.toLowerCase().indexOf(query) >= 0 ||
                          val.city.toLowerCase().indexOf(query) >= 0 ||
                          val.zip.toLowerCase().indexOf(query) >= 0 ||
                          val.tenant_first_name.toLowerCase().indexOf(query) >=
                            0
                        );
                      })
                      .map((tenant, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                            onClick={() => {
                              setSelectedTenant(tenant);
                              setUserPayments(tenant.user_payments);
                              setMaintenanceRequests(
                                tenant.user_repairRequests
                              );
                              // setShowDetails(!showDetails);
                              navigate(`./${tenant.tenant_id}`, {
                                state: {
                                  // maintenanceRequests: maintenanceRequests,
                                  // userPayments: userPayments,
                                  // rentDetails: rentDetails,
                                  // selectedTenant: selectedTenant,
                                  // dueDate: dueDate,
                                  // lateAfter: lateAfter,
                                  // lateFee: lateFee,
                                  // lateFeePer: lateFeePer,
                                  selectedTenant: tenant,
                                },
                              });
                            }}
                          >
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {tenant.tenant_first_name}{" "}
                              {tenant.tenant_last_name}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {tenant.address}
                              {tenant.unit !== "" ? " " + tenant.unit : ""}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {tenant.city}, {tenant.state}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {tenant.zip}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {tenant.tenant_phone_number}
                            </TableCell>

                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {tenant.tenant_email}
                            </TableCell>

                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              <div className="d-flex  justify-content-end ">
                                <div
                                  style={tenant.tenant_id ? {} : hidden}
                                  onClick={stopPropagation}
                                >
                                  <a href={`tel:${tenant.tenant_phone_number}`}>
                                    <img
                                      src={Phone}
                                      alt="Phone"
                                      style={smallImg}
                                    />
                                  </a>
                                  <a
                                    onClick={() => {
                                      setShowMessageForm(true);
                                      setSelectedTenant(tenant);
                                    }}
                                  >
                                    <img
                                      src={Message}
                                      alt="Message"
                                      style={smallImg}
                                    />
                                  </a>
                                  <a
                                    onClick={() => {
                                      setShowMailForm(true);
                                      setSelectedTenant(tenant);
                                    }}
                                  >
                                    <img
                                      src={Mail}
                                      alt="Mail"
                                      style={smallImg}
                                    />
                                  </a>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </Row>
            </div>
          ) : (
            <Row className="m-3">
              <div className="m-3"> No tenants</div>
            </Row>
          )}
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <ManagerFooter />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ManagerTenantList;
