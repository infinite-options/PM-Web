import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
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
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import { useLocation, useNavigate } from "react-router-dom";
import AppContext from "../../AppContext";
import SideBar from "./SideBar";
import Header from "../Header";
import ManagerFooter from "./ManagerFooter";
import ManagerRepairRequest from "./ManagerRepairRequest";
import RepairImg from "../../icons/RepairImg.svg";
import AddIcon from "../../icons/AddIcon.svg";
import { get } from "../../utils/api";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

function ManagerRepairsOverview(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [repairIter, setRepairIter] = useState([]);
  const [properties, setProperties] = useState([]);
  const [stage, setStage] = useState("LIST");
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
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

  const fetchRepairs = async () => {
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
    const responseProperties = await get("/managerDashboard", access_token);
    const properties = responseProperties.result.filter(
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
    if (responseProperties.msg === "Token has expired") {
      refresh();
      return;
    }
    setProperties(properties);
    const response = await get(
      `/maintenanceRequestsandQuotes?manager_id=${management_buid}`
    );

    let repairs = response.result;
    console.log(repairs);
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
    console.log(repairs_sorted);

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
      (item) => item.request_status === "SCHEDULED"
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
  };

  useEffect(fetchRepairs, [access_token]);
  console.log(repairIter);
  const days = (date_1, date_2) => {
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  };
  const addRequest = () => {
    fetchRepairs();

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
        <div className="w-100 mb-5">
          {/* <div
            className="mx-2 my-2 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            {repairIter.map(
              (row, i) =>
                row.repairs_list.length > 0 && (
                  <div className="pt-1 mb-4" key={i}>
                    <h4 className="mt-2 mb-3" style={{ fontWeight: "600" }}>
                      {row.title}
                    </h4>

                    {row.repairs_list.map((repair, j) => (
                      <Row
                        className="mb-4"
                        key={j}
                        // onClick={() =>
                        //   navigate(
                        //     `/manager-repairs/${repair.maintenance_request_uid}`,
                        //     {
                        //       state: {
                        //         repair: repair,
                        //       },
                        //     }
                        //   )
                        // }

                        onClick={() => selectRepair(repair)}
                      >
                        <Col xs={2}>
                          <div>
                            {JSON.parse(repair.images).length > 0 ? (
                              <img
                                src={JSON.parse(repair.images)[0]}
                                alt="Repair Image"
                                className="h-100 w-100"
                                style={{
                                  borderRadius: "4px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <img
                                src={No_Image}
                                alt="No Repair Image"
                                className="h-100 w-100"
                                style={{
                                  borderRadius: "4px",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </div>
                        </Col>
                        <Col className="ps-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0" style={{ fontWeight: "600" }}>
                              {repair.title}
                            </h5>
                            {repair.priority === "Low" ? (
                              <p style={greenPill} className="mb-0">
                                Low Priority
                              </p>
                            ) : repair.priority === "Medium" ? (
                              <p style={orangePill} className="mb-0">
                                Medium Priority
                              </p>
                            ) : repair.priority === "High" ? (
                              <p style={redPill} className="mb-0">
                                High Priority
                              </p>
                            ) : (
                              <p style={greenPill} className="mb-0">
                                No Priority
                              </p>
                            )}
                          </div>
                          <p style={gray} className="mt-2 mb-0">

                            {repair.address}
                            {repair.unit !== "" ? " " + repair.unit : ""},{" "}
                            {repair.city}, {repair.state} <br />
                            {repair.zip}
                          </p>
                          <div className="d-flex">
                            <div className="flex-grow-1 d-flex flex-column justify-content-center">
                              <p
                                style={{ ...blue, ...xSmall }}
                                className="mb-0"
                              >
                                Requested{" "}
                                {days(
                                  new Date(repair.request_created_date),
                                  new Date()
                                )}{" "}
                                days ago
                              </p>
                            </div>
                          </div>
                          <div className="d-flex">
                            <div className="flex-grow-1 d-flex flex-column justify-content-center">
                              <p
                                style={{ ...blue, ...xSmall }}
                                className="mb-0"
                              >
                                Request Created on{" "}
                                {repair.request_created_date.split(" ")[0]}
                              </p>
                            </div>
                          </div>
                          <div className="d-flex">
                            <div className="flex-grow-1 d-flex flex-column justify-content-center">
                              <p
                                style={{ ...blue, ...xSmall }}
                                className="mb-0"
                              >
                                {repair.quotes_to_review > 0
                                  ? `${repair.quotes_to_review} new quote(s) to review`
                                  : "No new quotes"}
                              </p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    ))}
                  </div>
                )
            )}
          </div> */}
          <Header title="Maintenance and Repairs" />
          <Row className="m-3">
            <Col>
              <h3>Maintenance and Repairs</h3>
            </Col>
            <Col>
              <img
                src={AddIcon}
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
            {" "}
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
                          navigate(`./${repair.maintenance_request_uid}`, {
                            state: {
                              repair: repair,
                            },
                          });
                        }}
                      >
                        <TableCell padding="none" size="small" align="center">
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
                          style={{
                            color: row.title === "New" ? "green" : "black",
                          }}
                        >
                          {row.title}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {repair.title}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {repair.description}
                        </TableCell>

                        <TableCell padding="none" size="small" align="center">
                          {repair.address}
                          {repair.unit !== "" ? " " + repair.unit : ""},{" "}
                          {repair.city}, {repair.state} <br />
                          {repair.zip}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {repair.priority}
                        </TableCell>

                        <TableCell padding="none" size="small" align="center">
                          {repair.request_created_date.split(" ")[0]}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {repair.days_open} days
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {repair.quotes_to_review > 0
                            ? `${repair.quotes_to_review} new quote(s) to review`
                            : "No new quotes"}
                        </TableCell>
                      </TableRow>
                    ));
                  })}
                </TableBody>
              </Table>
            </Row>
          </div>
        </div>
      </div>
      <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
        <ManagerFooter />
      </div>
    </div>
  ) : stage === "ADDREQUEST" ? (
    <div className="OwnerRepairRequest">
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
        <div className="w-100 mb-5">
          <Header title="Add Repair Request" />
          <ManagerRepairRequest
            properties={properties}
            cancel={() => setStage("LIST")}
            onSubmit={addRequest}
          />
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <ManagerFooter />
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default ManagerRepairsOverview;
