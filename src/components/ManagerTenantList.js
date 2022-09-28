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
import moment from "moment";
import SideBar from "./managerComponents/SideBar";
import Header from "../components/Header";
import AppContext from "../AppContext";
import { get, put } from "../utils/api";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import {
  mediumBold,
  subText,
  smallImg,
  hidden,
  redPill,
  greenPill,
} from "../utils/styles";

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
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState([]);
  const [userPayments, setUserPayments] = useState([]);
  const [lateAfter, setLateAfter] = useState("");
  const [lateFee, setLateFee] = useState("");
  const [lateFeePer, setLateFeePer] = useState("");
  const [dueDate, setDueDate] = useState("1");
  const [rentDetails, setRentDetails] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);

  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");

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
      console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
    } else {
      management_buid = management_businesses[0].business_uid;
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
    setSelectedTenant(response.result[0]);
    setDueDate(response.result[0].due_by);
    setDueDate(response.result[0].due_by);
    setLateAfter(response.result[0].late_by);
    setLateFee(response.result[0].late_fee);

    setUserPayments(response.result[0].user_payments);
    setRentDetails(JSON.parse(response.result[0].rent_payments));
    setLateFeePer(response.result[0].perDay_late_fee);
    setMaintenanceRequests(response.result[0].user_repairRequests);
    console.log(selectedTenant);
    // await getAlerts(properties_unique)
  };
  console.log(showDetails);
  useEffect(fetchTenants, [access_token]);
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  function ordinal_suffix_of(i) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }
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
    <div>
      <div className="flex-1">
        <div className="sidebar">
          <SideBar />
        </div>
        <div>
          <br />

          {/* <div
            className="mx-2 my-2 p-3"
            hidden={showDetails}
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            {tenants.map((tenant, i) => (
              <div
                key={i}
                className="my-3 p-2"
                style={{
                  boxShadow: " 0px 1px 6px #00000029",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedTenant(tenant);
                  setUserPayments(tenant.user_payments);
                  setMaintenanceRequests(tenant.user_repairRequests);
                  setShowDetails(true);
                }}
              >
                <Row className="p-1">
                  <Col>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0" style={mediumBold}>
                        {tenant.tenant_first_name} {tenant.tenant_last_name}
                      </h5>
                    </div>
                  </Col>
                </Row>
                <Row className="px-1 mb-1">
                  <Col
                    style={{
                      color: "#777777",
                      font: "normal normal normal 14px Bahnschrift-Regular",
                    }}
                  >
                    {tenant.address}
                    {tenant.unit !== "" ? " " + tenant.unit : ""}, <br />
                    {tenant.city}, {tenant.state} {tenant.zip}
                  </Col>

                  <Col>
                    <div className="d-flex  justify-content-end ">
                      <div
                        style={tenant.tenant_id ? {} : hidden}
                        onClick={stopPropagation}
                      >
                        <a href={`tel:${tenant.tenant_phone_number}`}>
                          <img src={Phone} alt="Phone" style={smallImg} />
                        </a>
                        <a href={`mailto:${tenant.tenant_email}`}>
                          <img src={Message} alt="Message" style={smallImg} />
                        </a>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
          </div> */}
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
          <Row className="m-3">
            <Table classes={{ root: classes.customTable }} size="small">
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
                      val.tenant_first_name.toLowerCase().indexOf(query) >= 0
                    );
                  })
                  .map((tenant, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell
                          padding="none"
                          size="small"
                          align="center"
                          onClick={() => {
                            setSelectedTenant(tenant);
                            setUserPayments(tenant.user_payments);
                            setMaintenanceRequests(tenant.user_repairRequests);
                            setShowDetails(!showDetails);
                          }}
                        >
                          {tenant.tenant_first_name} {tenant.tenant_last_name}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {tenant.address}
                          {tenant.unit !== "" ? " " + tenant.unit : ""}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {tenant.city}, {tenant.state}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {tenant.zip}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {tenant.tenant_phone_number}
                        </TableCell>

                        <TableCell padding="none" size="small" align="center">
                          {tenant.tenant_email}
                        </TableCell>

                        <TableCell padding="none" size="small" align="center">
                          <div className="d-flex  justify-content-end ">
                            <div
                              style={tenant.tenant_id ? {} : hidden}
                              onClick={stopPropagation}
                            >
                              <a href={`tel:${tenant.tenant_phone_number}`}>
                                <img src={Phone} alt="Phone" style={smallImg} />
                              </a>
                              <a href={`mailto:${tenant.tenant_email}`}>
                                <img
                                  src={Message}
                                  alt="Message"
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
          {showDetails ? (
            <div
              className="mx-2 my-2 p-3"
              hidden={!showDetails}
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="p-1">
                <Col>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0" style={mediumBold}>
                      {selectedTenant.tenant_first_name}{" "}
                      {selectedTenant.tenant_last_name}
                    </h5>
                  </div>
                </Col>
              </Row>
              <Row className="px-1 mb-1">
                <Col
                  style={{
                    color: "#777777",
                    font: "normal normal normal 14px Bahnschrift-Regular",
                  }}
                >
                  {selectedTenant.address}
                  {selectedTenant.unit !== ""
                    ? " " + selectedTenant.unit
                    : ""}, <br />
                  {selectedTenant.city}, {selectedTenant.state}{" "}
                  {selectedTenant.zip}
                </Col>

                <Col>
                  <div className="d-flex  justify-content-end ">
                    <div
                      style={selectedTenant.tenant_id ? {} : hidden}
                      onClick={stopPropagation}
                    >
                      <a href={`tel:${selectedTenant.tenant_phone_number}`}>
                        <img src={Phone} alt="Phone" style={smallImg} />
                      </a>
                      <a href={`mailto:${selectedTenant.tenant_email}`}>
                        <img src={Message} alt="Message" style={smallImg} />
                      </a>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="my-3">
                <h6 style={mediumBold}>Lease Length</h6>
                <Row>
                  <Col className="d-flex justify-content-start flex-column">
                    <h6>Lease Start Date</h6>
                    <h6>Lease End Date</h6>
                    <h6>Rent Due</h6>
                    <h6>Late After</h6>
                    <h6>Late Fee</h6>
                    <h6>Per Day Late Fee</h6>
                  </Col>
                  <Col className="d-flex flex-column ">
                    <h6
                      className="d-flex justify-content-end"
                      style={{
                        font: "normal normal normal 16px Bahnschrift-Regular",
                      }}
                    >
                      {selectedTenant.lease_start}
                    </h6>

                    <h6
                      className="d-flex justify-content-end"
                      style={{
                        font: "normal normal normal 16px Bahnschrift-Regular",
                      }}
                    >
                      {selectedTenant.lease_end}
                    </h6>
                    <h6
                      className="d-flex justify-content-end"
                      style={{
                        font: "normal normal normal 16px Bahnschrift-Regular",
                      }}
                    >
                      {`${ordinal_suffix_of(dueDate)} of the month`}
                    </h6>
                    <h6
                      className="d-flex justify-content-end"
                      style={{
                        font: "normal normal normal 16px Bahnschrift-Regular",
                      }}
                    >
                      {lateAfter} days
                    </h6>
                    <h6
                      className="d-flex justify-content-end"
                      style={{
                        font: "normal normal normal 16px Bahnschrift-Regular",
                      }}
                    >
                      ${lateFee}
                    </h6>
                    <h6
                      className="d-flex justify-content-end"
                      style={{
                        font: "normal normal normal 16px Bahnschrift-Regular",
                      }}
                    >
                      ${lateFeePer}
                    </h6>
                  </Col>
                </Row>
              </Row>
              <Row className="my-4">
                <h6 style={mediumBold}>Rent Payments</h6>
                {rentDetails.map((fee, i) => (
                  <Row key={i}>
                    <Col className="d-flex justify-content-start">
                      <h6 className="mb-1">{fee.fee_name}</h6>
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <h6
                        style={{
                          font: "normal normal normal 16px Bahnschrift-Regular",
                        }}
                        className="mb-1"
                      >
                        {fee.fee_type === "%"
                          ? `${fee.charge}% of ${fee.of}`
                          : `$${fee.charge}`}{" "}
                        {fee.frequency}
                      </h6>
                    </Col>
                  </Row>
                ))}
              </Row>
              <Row
                className="d-flex justify-content-center my-2"
                style={mediumBold}
              >
                Payment History
              </Row>
              {userPayments.length > 0 ? (
                <Container
                  style={{
                    background: "#FFFFFF 0% 0% no-repeat padding-box",
                    boxShadow: "0px 3px 6px #00000029",
                    border: "0.5px solid #707070",
                    borderRadius: "5px",
                    maxHeight: "500px",
                    overflow: "scroll",
                  }}
                >
                  {userPayments.map((payment) => (
                    <div
                      className="my-3 p-2"
                      style={{
                        boxShadow: " 0px 1px 6px #00000029",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      <Row className="mx-2">
                        <Col style={subText}>
                          {moment(payment.payment_date).format("MMM D, YYYY")}
                        </Col>
                      </Row>
                      <Row style={mediumBold} className="d-flex mx-2">
                        <Col>
                          {payment.description}{" "}
                          {payment.purchase_notes &&
                            `(${payment.purchase_notes})`}
                        </Col>
                        <Col
                          xs={2}
                          style={{
                            fontWeight: "600",
                            font: "normal normal normal 20px/28px Bahnschrift-Regular",
                            color: "#007Aff",
                          }}
                          className="d-flex justify-content-end"
                        >
                          {formatter.format(payment.amount)}
                        </Col>
                        <Col xs={3} className="d-flex justify-content-center">
                          {payment.payment_date > payment.next_payment ? (
                            <div style={redPill}>Late</div>
                          ) : (
                            <div style={greenPill}>On-time</div>
                          )}
                          {console.log(
                            payment.payment_date > payment.next_payment
                          )}
                        </Col>
                      </Row>
                    </div>
                  ))}
                </Container>
              ) : (
                <Container className="d-flex my-2">No payments made</Container>
              )}

              <Row
                className="d-flex justify-content-center my-2"
                style={mediumBold}
              >
                Repair Requests
              </Row>
              {maintenanceRequests.length > 0 ? (
                <Container
                  style={{
                    background: "#FFFFFF 0% 0% no-repeat padding-box",
                    boxShadow: "0px 3px 6px #00000029",
                    border: "0.5px solid #707070",
                    borderRadius: "5px",
                    maxHeight: "500px",
                    overflow: "scroll",
                  }}
                >
                  <Row className="m-3">
                    <Table classes={{ root: classes.customTable }} size="small">
                      <EnhancedTableHead2
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={maintenanceRequests.length}
                      />{" "}
                      <TableBody>
                        {stableSort(
                          maintenanceRequests,
                          getComparator(order, orderBy)
                        ).map((repair, j) => (
                          <TableRow hover role="checkbox" tabIndex={-1} key={j}>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {JSON.parse(repair.images).length > 0 ? (
                                <img
                                  src={JSON.parse(repair.images)[0]}
                                  // onClick={() => selectRepair(repair)}
                                  onClick={() => {
                                    navigate(
                                      `./${repair.maintenance_request_uid}`,
                                      {
                                        state: {
                                          repair: repair,
                                        },
                                      }
                                    );
                                  }}
                                  alt="repair"
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
                              {repair.title}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {repair.description}
                            </TableCell>

                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {repair.address}
                              {repair.unit !== ""
                                ? " " + repair.unit
                                : ""}, {repair.city}, {repair.state} <br />
                              {repair.zip}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {repair.priority}
                            </TableCell>

                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {repair.request_created_date.split(" ")[0]}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {repair.days_open} days
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {repair.quotes_to_review > 0
                                ? `${repair.quotes_to_review} new quote(s) to review`
                                : "No new quotes"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Row>
                  {maintenanceRequests.map((request) => (
                    <div
                      className="my-3 p-2"
                      style={{
                        boxShadow: " 0px 1px 6px #00000029",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      <Row style={mediumBold} className="mx-2">
                        <Col>{request.title}</Col>
                        <Col>{request.business_name}</Col>
                      </Row>
                      <Row className="mx-2">
                        {request.request_status === "COMPLETED" ? (
                          <Col
                            style={{
                              font: "normal normal normal 12px Bahnschrift-Regular",
                              color: "#007AFF",
                            }}
                          >
                            Completed on:{" "}
                            {new Date(
                              request.scheduled_date
                            ).toLocaleDateString("en-us", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </Col>
                        ) : request.request_status === "SCHEDULED" ? (
                          <Col
                            style={{
                              font: "normal normal normal 12px Bahnschrift-Regular",
                              color: "#E3441F",
                            }}
                          >
                            Scheduled for:{" "}
                            {new Date(
                              request.scheduled_date
                            ).toLocaleDateString("en-us", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </Col>
                        ) : (
                          <Col
                            style={{
                              font: "normal normal normal 12px Bahnschrift-Regular",
                              color: "#007AFF",
                            }}
                          >
                            Requested on:{" "}
                            {new Date(
                              request.request_created_date.split(" ")[0]
                            ).toLocaleDateString("en-us", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </Col>
                        )}
                      </Row>
                    </div>
                  ))}
                </Container>
              ) : (
                <Container className="d-flex my-2">
                  No repairs requested
                </Container>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ManagerTenantList;
