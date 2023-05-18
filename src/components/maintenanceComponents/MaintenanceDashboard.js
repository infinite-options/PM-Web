import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import moment from "moment";
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
import AppContext from "../../AppContext";
import Header from "../Header";
import SideBar from "./SideBar";
import MaintenanceFooter from "./MaintenanceFooter";
import RepairImg from "../../icons/RepairImg.svg";
import { get } from "../../utils/api";
import { green, red, blue, xSmall, sidebarStyle } from "../../utils/styles";
import { days } from "../../utils/helper";

import {
  descendingComparator as descendingComparatorMaintenance,
  getComparator as getComparatorMaintenance,
  stableSort as stableSortMaintenance,
} from "../../utils/helper";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

function MaintenanceDashboard(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData, ably } = useContext(AppContext);

  const channel_maintenance = ably.channels.get("maintenance_status");
  const [isLoading, setIsLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [quotesRequested, setQuotesRequested] = useState([]);
  const [quotesSent, setQuotesSent] = useState([]);
  const [quotesAccepted, setQuotesAccepted] = useState([]);
  const [quotesScheduled, setQuotesScheduled] = useState([]);
  const [quotesCompleted, setQuotesCompleted] = useState([]);
  const [quotesPaid, setQuotesPaid] = useState([]);
  const [quotesRejected, setQuotesRejected] = useState([]);
  const [quotesRefused, setQuotesRefused] = useState([]);
  const [orderMaintenance, setOrderMaintenance] = useState("desc");
  const [orderMaintenanceBy, setOrderMaintenanceBy] = useState("days_open");
  const [maintenanceStatus, setMaintenanceStatus] = useState("");
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
  const sort_quotes = (quotes) => {
    quotes.sort(
      (a, b) => b.priority_n - a.priority_n || b.days_since - a.days_since
    );
    return quotes;
  };

  const fetchMaintenanceDashboard = async () => {
    let business_uid = "";
    for (const business of userData.user.businesses) {
      if (business.business_type === "MAINTENANCE") {
        business_uid = business.business_uid;

        break;
      }
    }
    if (business_uid === "") {
    }
    const response = await get(`/businesses?business_uid=${business_uid}`);

    const quotes_response = await get(
      `/maintenanceQuotes?quote_business_uid=${business_uid}`
    );

    const quotes_unsorted = quotes_response.result;
    quotes_unsorted.forEach((quote, i) => {
      const quote_created_date = new Date(Date.parse(quote.quote_created_date));
      const current_date = new Date();
      quotes_unsorted[i].days_since = Math.ceil(
        (current_date.getTime() - quote_created_date.getTime()) /
          (1000 * 3600 * 24)
      );

      quote.priority_n = 0;
      if (quote.priority.toLowerCase() === "high") {
        quote.priority_n = 3;
      } else if (quote.priority.toLowerCase() === "medium") {
        quote.priority_n = 2;
      } else if (quote.priority.toLowerCase() === "low") {
        quote.priority_n = 1;
      }
    });
    let sorted_quotes = sort_quotes(quotes_unsorted);
    setQuotes(sort_quotes(quotes_unsorted));

    let quotes_requested = sorted_quotes.filter(
      (quote) => quote.quote_status === "REQUESTED"
    );
    setQuotesRequested(quotes_requested);
    let quotes_sent = sorted_quotes.filter(
      (quote) => quote.quote_status === "SENT"
    );
    setQuotesSent(quotes_sent);
    let quotes_accepted = sorted_quotes.filter(
      (quote) =>
        (quote.request_status === "SCHEDULE" ||
          quote.request_status === "RESCHEDULE" ||
          quote.request_status === "PROCESSING") &&
        quote.quote_status === "ACCEPTED"
    );
    setQuotesAccepted(quotes_accepted);
    let quotes_scheduled = sorted_quotes.filter(
      (quote) =>
        quote.request_status === "SCHEDULED" && quote.quote_status === "AGREED"
    );
    setQuotesScheduled(quotes_scheduled);
    let quotes_completed = sorted_quotes.filter(
      (quote) =>
        (quote.request_status === "FINISHED" ||
          quote.request_status === "COMPLETED") &&
        quote.quote_status === "AGREED"
    );
    setQuotesCompleted(quotes_completed);
    let quotes_paid = sorted_quotes.filter(
      (quote) =>
        (quote.request_status === "FINISHED" ||
          quote.request_status === "COMPLETED") &&
        quote.quote_status === "PAID"
    );
    setQuotesPaid(quotes_paid);
    let quotes_rejected = sorted_quotes.filter(
      (quote) =>
        quote.quote_status === "REJECTED" || quote.quote_status === "WITHDRAWN"
    );
    setQuotesRejected(quotes_rejected);
    let quotes_refused = sorted_quotes.filter(
      (quote) => quote.quote_status === "REFUSED"
    );
    setQuotesRefused(quotes_refused);

    setIsLoading(false);
  };

  useEffect(() => {
    async function maintenance_message() {
      await channel_maintenance.subscribe((message) => {
        // console.log(message);
        setMaintenanceStatus(message.data.te);
      });
    }
    maintenance_message();
    fetchMaintenanceDashboard();
    return function cleanup() {
      channel_maintenance.unsubscribe();
    };
  }, [maintenanceStatus]);

  // useEffect(fetchMaintenanceDashboard, []);

  const handleRequestSortMaintenance = (event, property) => {
    const isAsc = orderMaintenanceBy === property && orderMaintenance === "asc";
    setOrderMaintenance(isAsc ? "desc" : "asc");
    setOrderMaintenanceBy(property);
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
    ,
    {
      id: "request_status",
      numeric: false,
      label: "Request Status",
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
      id: "quote_status",
      numeric: true,
      label: "Quote Status",
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

  return (
    <div className="w-100 overflow-hidden">
      {!isLoading && quotes.length > 0 ? (
        <Row className="w-100 mb-5 overflow-hidden">
          <Col
            xs={2}
            hidden={!responsiveSidebar.showSidebar}
            style={sidebarStyle}
          >
            <SideBar />
          </Col>
          <Col className="w-100 mb-5 overflow-scroll">
            <Header title="Maintenance Dashboard" />
            {quotesRequested.length > 0 ? (
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
                    <h3>Maintenance Quotes Requested</h3>
                  </Col>
                  <Col></Col>
                </Row>
                <Row className="m-3" style={{ overflow: "scroll" }}>
                  <Table
                    responsive="xl"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
                    <EnhancedTableHeadMaintenance
                      orderMaintenance={orderMaintenance}
                      orderMaintenanceBy={orderMaintenanceBy}
                      onRequestSort={handleRequestSortMaintenance}
                      rowCount={quotesRequested.length}
                    />{" "}
                    <TableBody>
                      {stableSortMaintenance(
                        quotesRequested,
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
                              navigate("../maintenanceRequestView", {
                                state: {
                                  quote_id: request.maintenance_quote_uid,
                                },
                              })
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
                              {request.request_created_date.split(" ")[0]}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {days(
                                new Date(
                                  request.request_created_date.split(" ")[0]
                                ),
                                new Date()
                              )}{" "}
                              days
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
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.quote_status}
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
            )}{" "}
            {quotesSent.length > 0 ? (
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
                    <h3>Maintenance Quotes Sent</h3>
                  </Col>
                  <Col></Col>
                </Row>
                <Row className="m-3" style={{ overflow: "scroll" }}>
                  <Table
                    responsive="xl"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
                    <EnhancedTableHeadMaintenance
                      orderMaintenance={orderMaintenance}
                      orderMaintenanceBy={orderMaintenanceBy}
                      onRequestSort={handleRequestSortMaintenance}
                      rowCount={quotesSent.length}
                    />{" "}
                    <TableBody>
                      {stableSortMaintenance(
                        quotesSent,
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
                              navigate("../maintenanceRequestView", {
                                state: {
                                  quote_id: request.maintenance_quote_uid,
                                },
                              })
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
                              {request.request_created_date.split(" ")[0]}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {days(
                                new Date(
                                  request.request_created_date.split(" ")[0]
                                ),
                                new Date()
                              )}{" "}
                              days
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
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.quote_status}
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
            )}{" "}
            {quotesAccepted.length > 0 ? (
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
                    <h3>Maintenance Quotes Accepted</h3>
                  </Col>
                  <Col></Col>
                </Row>
                <Row className="m-3" style={{ overflow: "scroll" }}>
                  <Table
                    responsive="xl"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
                    <EnhancedTableHeadMaintenance
                      orderMaintenance={orderMaintenance}
                      orderMaintenanceBy={orderMaintenanceBy}
                      onRequestSort={handleRequestSortMaintenance}
                      rowCount={quotesAccepted.length}
                    />{" "}
                    <TableBody>
                      {stableSortMaintenance(
                        quotesAccepted,
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
                              navigate("../maintenanceRequestView", {
                                state: {
                                  quote_id: request.maintenance_quote_uid,
                                },
                              })
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
                              {request.request_created_date.split(" ")[0]}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {days(
                                new Date(
                                  request.request_created_date.split(" ")[0]
                                ),
                                new Date()
                              )}{" "}
                              days
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
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.quote_status}
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
            {quotesRejected.length > 0 ? (
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
                    <h3>Maintenance Quotes Rejected</h3>
                  </Col>
                  <Col></Col>
                </Row>
                <Row className="m-3" style={{ overflow: "scroll" }}>
                  <Table
                    responsive="xl"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
                    <EnhancedTableHeadMaintenance
                      orderMaintenance={orderMaintenance}
                      orderMaintenanceBy={orderMaintenanceBy}
                      onRequestSort={handleRequestSortMaintenance}
                      rowCount={quotesRejected.length}
                    />{" "}
                    <TableBody>
                      {stableSortMaintenance(
                        quotesRejected,
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
                              navigate("../maintenanceRequestView", {
                                state: {
                                  quote_id: request.maintenance_quote_uid,
                                },
                              })
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
                              {request.request_created_date.split(" ")[0]}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {days(
                                new Date(
                                  request.request_created_date.split(" ")[0]
                                ),
                                new Date()
                              )}{" "}
                              days
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
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.quote_status}
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
            {quotesScheduled.length > 0 ? (
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
                    <h3>Maintenance Requests Scheduled</h3>
                  </Col>
                  <Col></Col>
                </Row>
                <Row className="m-3" style={{ overflow: "scroll" }}>
                  <Table
                    responsive="xl"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
                    <EnhancedTableHeadMaintenance
                      orderMaintenance={orderMaintenance}
                      orderMaintenanceBy={orderMaintenanceBy}
                      onRequestSort={handleRequestSortMaintenance}
                      rowCount={quotesScheduled.length}
                    />{" "}
                    <TableBody>
                      {stableSortMaintenance(
                        quotesScheduled,
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
                              navigate("../maintenanceRequestView", {
                                state: {
                                  quote_id: request.maintenance_quote_uid,
                                },
                              })
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
                              {request.request_created_date.split(" ")[0]}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {days(
                                new Date(
                                  request.request_created_date.split(" ")[0]
                                ),
                                new Date()
                              )}{" "}
                              days
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
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.quote_status}
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
            {quotesCompleted.length > 0 ? (
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
                    <h3>Maintenance Requests Completed</h3>
                  </Col>
                  <Col></Col>
                </Row>
                <Row className="m-3" style={{ overflow: "scroll" }}>
                  <Table
                    responsive="xl"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
                    <EnhancedTableHeadMaintenance
                      orderMaintenance={orderMaintenance}
                      orderMaintenanceBy={orderMaintenanceBy}
                      onRequestSort={handleRequestSortMaintenance}
                      rowCount={quotesCompleted.length}
                    />{" "}
                    <TableBody>
                      {stableSortMaintenance(
                        quotesCompleted,
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
                              navigate("../maintenanceRequestView", {
                                state: {
                                  quote_id: request.maintenance_quote_uid,
                                },
                              })
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
                              {request.request_created_date.split(" ")[0]}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {days(
                                new Date(
                                  request.request_created_date.split(" ")[0]
                                ),
                                new Date()
                              )}{" "}
                              days
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
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.quote_status}
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
            {quotesPaid.length > 0 ? (
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
                    <h3>Maintenance Requests Paid</h3>
                  </Col>
                  <Col></Col>
                </Row>
                <Row className="m-3" style={{ overflow: "scroll" }}>
                  <Table
                    responsive="xl"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
                    <EnhancedTableHeadMaintenance
                      orderMaintenance={orderMaintenance}
                      orderMaintenanceBy={orderMaintenanceBy}
                      onRequestSort={handleRequestSortMaintenance}
                      rowCount={quotesPaid.length}
                    />{" "}
                    <TableBody>
                      {stableSortMaintenance(
                        quotesPaid,
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
                              navigate("../maintenanceRequestView", {
                                state: {
                                  quote_id: request.maintenance_quote_uid,
                                },
                              })
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
                              {request.request_created_date.split(" ")[0]}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {days(
                                new Date(
                                  request.request_created_date.split(" ")[0]
                                ),
                                new Date()
                              )}{" "}
                              days
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
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.quote_status}
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
            {quotesRefused.length > 0 ? (
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
                    <h3>Maintenance Quotes Refused</h3>
                  </Col>
                  <Col></Col>
                </Row>
                <Row className="m-3" style={{ overflow: "scroll" }}>
                  <Table
                    responsive="xl"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
                    <EnhancedTableHeadMaintenance
                      orderMaintenance={orderMaintenance}
                      orderMaintenanceBy={orderMaintenanceBy}
                      onRequestSort={handleRequestSortMaintenance}
                      rowCount={quotesRefused.length}
                    />{" "}
                    <TableBody>
                      {stableSortMaintenance(
                        quotesRefused,
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
                              navigate("../maintenanceRequestView", {
                                state: {
                                  quote_id: request.maintenance_quote_uid,
                                },
                              })
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
                              {request.request_created_date.split(" ")[0]}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {days(
                                new Date(
                                  request.request_created_date.split(" ")[0]
                                ),
                                new Date()
                              )}{" "}
                              days
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
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.quote_status}
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
            <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
              <MaintenanceFooter />
            </div>
          </Col>
        </Row>
      ) : !isLoading && quotes.length === 0 ? (
        <Row className="w-100 mb-5 overflow-hidden">
          <Col
            xs={2}
            hidden={!responsiveSidebar.showSidebar}
            style={sidebarStyle}
          >
            <SideBar />
          </Col>
          <Col className="w-100 mb-5 overflow-scroll">
            <Header title="Maintenance Dashboard" />
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

            <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
              <MaintenanceFooter />
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
              <MaintenanceFooter />
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default MaintenanceDashboard;
