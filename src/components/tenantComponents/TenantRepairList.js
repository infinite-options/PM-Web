import React, { useState, useEffect, useContext } from "react";
import { Row, Col } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableSortLabel,
  Box,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import * as ReactBootStrap from "react-bootstrap";
import Header from "../Header";
import SideBar from "./SideBar";
import TenantFooter from "./TenantFooter";
import TenantRepairRequest from "./TenantRepairRequest";
import AppContext from "../../AppContext";
import AddIcon from "../../icons/AddIcon.svg";
import RepairImg from "../../icons/RepairImg.svg";
import { get } from "../../utils/api";
import { sidebarStyle } from "../../utils/styles";
import { Divider } from "@mui/material";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

function TenantRepairList(props) {
  const classes = useStyles();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);

  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [repairIter, setRepairIter] = useState([]);

  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [stage, setStage] = useState("LIST");
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [isLoading, setIsLoading] = useState(true);
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
  const fetchProperties = async () => {
    const responseProperties = await get("/tenantDashboard", access_token);
    const response = await get(
      `/maintenanceRequestsandQuotes?tenant_id=${user.tenant_id[0].tenant_id}`
    );
    const properties = responseProperties.result[0].properties;
    setProperties(properties);
    let repairs = response.result;
    // console.log(repairs);
    setMaintenanceRequests(response.result);
    repairs.forEach((repair, i) => {
      const request_created_date = new Date(
        Date.parse(repair.request_created_date)
      );
      const current_date = new Date();
      repairs[i].days_since = Math.ceil(
        (current_date.getTime() - request_created_date.getTime()) /
          (1000 * 3600 * 24)
      );
      repairs[i].quotes_to_review = repair.quotes.filter(
        (quote) => quote.quote_status === "SENT"
      ).length;

      repair.priority_n = 0;
      if (repair.priority.toLowerCase() === "high") {
        repair.priority_n = 3;
      } else if (repair.priority.toLowerCase() === "medium") {
        repair.priority_n = 2;
      } else if (repair.priority.toLowerCase() === "low") {
        repair.priority_n = 1;
      }
    });

    let repairs_sorted = sort_repairs(repairs);
    // console.log(repairs_sorted);

    const new_repairs = repairs_sorted.filter(
      (item) => item.request_status === "NEW"
    );
    const info_repairs = repairs.filter(
      (item) => item.request_status === "INFO"
    );
    const processing_repairs = repairs_sorted.filter(
      (item) => item.request_status === "PROCESSING"
    );
    const scheduled_repairs = repairs_sorted.filter(
      (item) =>
        item.request_status === "SCHEDULED" ||
        item.request_status === "RESCHEDULE" ||
        item.request_status === "SCHEDULE"
    );
    const completed_repairs = repairs_sorted.filter(
      (item) => item.request_status === "COMPLETE"
    );

    setRepairIter([
      { title: "New", repairs_list: new_repairs },
      { title: "Info Requested", repairs_list: info_repairs },
      { title: "Processing", repairs_list: processing_repairs },
      { title: "Upcoming, Scheduled", repairs_list: scheduled_repairs },
      { title: "Completed", repairs_list: completed_repairs },
    ]);

    setIsLoading(false);
  };
  useEffect(() => {
    if (access_token === null) {
      navigate("/");
    }
    fetchProperties();
  }, [access_token]);

  const sort_repairs = (repairs) => {
    const repairs_with_quotes = repairs.filter(
      (repair) => repair.quotes_to_review > 0
    );
    repairs_with_quotes.sort(
      (a, b) => b.priority_n - a.priority_n || b.days_since - a.days_since
    );
    const repairs_without_quotes = repairs.filter(
      (repair) => repair.quotes_to_review === 0
    );
    repairs_without_quotes.sort(
      (a, b) => b.priority_n - a.priority_n || b.days_since - a.days_since
    );
    return [...repairs_with_quotes, ...repairs_without_quotes];
  };

  const sort_repairs_address = (repairs) => {
    repairs.forEach((repair, i) => {
      // console.log("");
    });
  };

  // console.log(repairIter);
  const days = (date_1, date_2) => {
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
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
  const addRequest = () => {
    fetchProperties();

    setStage("LIST");
  };
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

  const headCells = [
    {
      id: "images",
      numeric: false,
      label: "Repair Images",
    },
    {
      id: "status",
      numeric: false,
      label: "Status",
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
      id: `days_open`,
      numeric: true,
      label: "Days Open",
    },
    {
      id: "quote_status",
      numeric: false,
      label: "Quote Status",
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
    // rowCount: PropTypes.number.isRequired,
  };

  return stage === "LIST" ? (
    <div className="w-100 overflow-hidden">
      <Row className="w-100 mb-5 overflow-hidden">
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5 overflow-scroll">
          <Header title="Repairs" />
          <div>
            <Row className="m-3">
              <Col>
                {" "}
                <h3>Maintenance and Repairs </h3>
              </Col>

              <Col>
                <img
                  src={AddIcon}
                  alt="Add Icon"
                  onClick={() => {
                    setStage("ADDREQUEST");
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
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              {!isLoading ? (
                maintenanceRequests.length > 0 ? (
                  <Row className="m-3" style={{ overflow: "scroll" }}>
                    <Table
                      classes={{ root: classes.customTable }}
                      size="small"
                      responsive="md"
                    >
                      <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        // rowCount="4"
                      />{" "}
                      <TableBody>
                        {repairIter.map((row, index) => {
                          return stableSort(
                            row.repairs_list,
                            getComparator(order, orderBy)
                          ).map((repair, j) => (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={j}
                              onClick={() => {
                                navigate(
                                  `/tenant-repairs/${repair.maintenance_request_uid}`,
                                  {
                                    state: {
                                      repair: repair,
                                      property: repair.address,
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
                                {JSON.parse(repair.images).length > 0 ? (
                                  <img
                                    src={JSON.parse(repair.images)[0]}
                                    // onClick={() => selectRepair(repair)}

                                    alt="repair"
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
                                {row.title}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                style={{
                                  color:
                                    repair.title === "New" ? "green" : "black",
                                }}
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
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {repair.assigned_business !== null &&
                                repair.assigned_business !== "null"
                                  ? repair.assigned_business
                                  : "None"}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {repair.scheduled_date !== null &&
                                repair.scheduled_date !== "null"
                                  ? repair.scheduled_date
                                  : "Not Scheduled"}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {repair.scheduled_time !== null &&
                                repair.scheduled_time !== "null"
                                  ? repair.scheduled_time.split(" ")[0]
                                  : "Not Scheduled"}
                              </TableCell>
                            </TableRow>
                          ));
                        })}
                      </TableBody>
                    </Table>
                  </Row>
                ) : (
                  <Row className="m-3">
                    <div className="m-3">
                      No maintenance and repair requests
                    </div>
                  </Row>
                )
              ) : (
                <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                  <ReactBootStrap.Spinner animation="border" role="status" />
                </div>
              )}
            </div>
          </div>
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <TenantFooter />
          </div>
        </Col>
      </Row>
    </div>
  ) : stage === "ADDREQUEST" ? (
    <div className="tenantRepairRequest">
      <Row className="w-100 mb-5 overflow-hidden">
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5 overflow-scroll">
          <Header title="Add Repair Request" />
          <TenantRepairRequest
            properties={properties}
            cancel={() => setStage("LIST")}
            onSubmit={addRequest}
          />
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <TenantFooter />
          </div>
        </Col>
      </Row>
    </div>
  ) : (
    ""
  );
}

export default TenantRepairList;
