import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
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
import * as ReactBootStrap from "react-bootstrap";
import { visuallyHidden } from "@mui/utils";
import { useLocation, useNavigate } from "react-router-dom";
import AppContext from "../../AppContext";
import SideBar from "./SideBar";
import Header from "../Header";
import ManagerFooter from "./ManagerFooter";
import ManagerRepairRequest from "./ManagerRepairRequest";
import RepairImg from "../../icons/RepairImg.svg";
import AddIcon from "../../icons/AddIcon.svg";
import CopyIcon from "../../icons/CopyIcon.png";
import { get, post } from "../../utils/api";
import { sidebarStyle, blue, xSmall } from "../../utils/styles";
import { days } from "../../utils/helper";
import CopyDialog from "../CopyDialog";
import {
  descendingComparator as descendingComparator,
  getComparator as getComparator,
  stableSort as stableSort,
} from "../../utils/helper";
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
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [properties, setProperties] = useState([]);
  const [stage, setStage] = useState("LIST");
  const [managerID, setManagerID] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("days_open");
  const [daysCompleted, setDaysCompleted] = useState("10");
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
  const duplicate_request = async (request) => {
    let selectedRequest = request;
    // console.log(selectedRequest);
    const newRequest = {
      property_uid: selectedRequest.property_uid,
      title: "Copy " + selectedRequest.title,
      request_type: selectedRequest.request_type,
      description: selectedRequest.description,
      priority: selectedRequest.priority,
      request_created_by: selectedRequest.request_created_by,
    };

    const files = JSON.parse(selectedRequest.images);
    let i = 0;
    for (const file of files) {
      let key = "";
      // console.log(file, file.file, file.image);
      if (file.file !== null && file.file !== undefined) {
        key = file.coverPhoto ? "img_cover" : `img_${i++}`;
        // console.log("in if", file.file);
        newRequest[key] = file.file;
      } else if (file.image !== null && file.image !== undefined) {
        key = file.coverPhoto ? "img_cover" : `img_${i++}`;
        // console.log("in if else", file.image);
        newRequest[key] = file.image;
      } else {
        // console.log("in else");
        key = file.includes("img_cover") ? "img_cover" : `img_${i++}`;
        newRequest[key] = file;
      }
    }
    // console.log(newRequest);
    setCopied(true);
    await post("/maintenanceRequests", newRequest, null, files);
    setCopied(false);
    fetchRepairs();
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
      // console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      // console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
    } else {
      management_buid = management_businesses[0].business_uid;
    }
    setManagerID(management_buid);
    const responseProperties = await get("/managerDashboard", access_token);

    if (responseProperties.msg === "Token has expired") {
      refresh();
      return;
    }
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
    setProperties(properties);
    const response = await get(
      `/maintenanceRequestsandQuotes?manager_id=${management_buid}`
    );

    let repairs = response.result;
    let repairs_sorted = [];
    // console.log(repairs);
    if (parseInt(daysCompleted) >= 0) {
      repairs.forEach((repair, i) => {
        if (
          days(new Date(repair.request_closed_date), new Date()) >=
            parseInt(daysCompleted) &&
          repair.request_status === "COMPLETED"
        ) {
        } else {
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
          repairs_sorted = sort_repairs(repairs);
          // console.log(repairs_sorted);
        }
      });
    } else {
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

      repairs_sorted = sort_repairs(repairs);
      // console.log(repairs_sorted);
    }

    setRepairIter(repairs_sorted);
    setIsLoading(false);
  };

  const filterRequests = () => {
    let repairs = repairIter;
    let repairs_sorted = [];
    if (parseInt(daysCompleted) >= 0) {
      repairs.forEach((repair, i) => {
        if (
          days(new Date(repair.request_closed_date), new Date()) >=
            parseInt(daysCompleted) &&
          repair.request_status === "COMPLETED"
        ) {
        } else {
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
          repairs_sorted = sort_repairs(repairs);
          // console.log(repairs_sorted);
        }
      });
    } else {
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

      repairs_sorted = sort_repairs(repairs);
      // console.log(repairs_sorted);
    }

    setRepairIter(repairs_sorted);
  };
  useEffect(fetchRepairs, [access_token]);
  // console.log(repairIter);

  useEffect(() => {
    filterRequests();
  }, [daysCompleted]);

  const addRequest = () => {
    fetchRepairs();

    setStage("LIST");
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const headCells = [
    {
      id: "images",
      numeric: false,
      label: "Repair Images",
    },
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
      <CopyDialog copied={copied} />
      <Row className="w-100 mb-5 overflow-hidden">
        {" "}
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5 overflow-scroll">
          <Header title="Maintenance and Repairs" />
          <Row className="m-3">
            <Col>
              <h3>Maintenance and Repairs</h3>
            </Col>
            <Col xs={4}>
              Hide requests completed <span>&#62;</span>{" "}
              <input
                style={{
                  borderRadius: "5px",
                  border: "1px solid #707070",
                  width: "2rem",
                }}
                value={daysCompleted}
                onChange={(e) => {
                  setDaysCompleted(e.target.value);
                }}
              />{" "}
              days
            </Col>
            <Col xs={2}>
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

          {isLoading ? (
            <div className="d-flex justify-content-center mb-4 mx-2 mb-2 p-3">
              <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                <ReactBootStrap.Spinner animation="border" role="status" />
              </div>
            </div>
          ) : repairIter.length > 0 ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
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
                    {stableSort(repairIter, getComparator(order, orderBy)).map(
                      (repair, j) => (
                        <TableRow hover role="checkbox" tabIndex={-1} key={j}>
                          <TableCell
                            onClick={() => {
                              navigate(`./${repair.maintenance_request_uid}`, {
                                state: {
                                  repair: repair,
                                },
                              });
                            }}
                            padding="none"
                            size="small"
                            align="center"
                          >
                            {JSON.parse(repair.images).length > 0 ? (
                              <img
                                src={JSON.parse(repair.images)[0]}
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
                            onClick={() => {
                              navigate(`./${repair.maintenance_request_uid}`, {
                                state: {
                                  repair: repair,
                                },
                              });
                            }}
                            padding="none"
                            size="small"
                            align="center"
                            style={{
                              color:
                                repair.request_status === "NEW"
                                  ? "red"
                                  : repair.request_status === "PROCESSING"
                                  ? "orange"
                                  : repair.request_status === "SCHEDULE"
                                  ? "blue"
                                  : repair.request_status === "RESCHEDULE"
                                  ? "yellow"
                                  : repair.request_status === "SCHEDULED"
                                  ? "green"
                                  : "black",
                            }}
                          >
                            {repair.request_status}{" "}
                            {repair.request_status === "COMPLETED" ? (
                              <div className="d-flex">
                                <div className="d-flex justify-content-right">
                                  <p
                                    style={{ ...blue, ...xSmall }}
                                    className="mb-0"
                                  >
                                    {days(
                                      new Date(repair.request_closed_date),
                                      new Date()
                                    )}{" "}
                                    days
                                  </p>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              navigate(`./${repair.maintenance_request_uid}`, {
                                state: {
                                  repair: repair,
                                },
                              });
                            }}
                            padding="none"
                            size="small"
                            align="center"
                          >
                            {repair.title}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              navigate(`./${repair.maintenance_request_uid}`, {
                                state: {
                                  repair: repair,
                                },
                              });
                            }}
                            padding="none"
                            size="small"
                            align="center"
                          >
                            {repair.description}
                          </TableCell>

                          <TableCell
                            onClick={() => {
                              navigate(`./${repair.maintenance_request_uid}`, {
                                state: {
                                  repair: repair,
                                },
                              });
                            }}
                            padding="none"
                            size="small"
                            align="center"
                          >
                            {repair.address}
                            {repair.unit !== "" ? " " + repair.unit : ""},{" "}
                            <br />
                            {repair.city}, {repair.state} {repair.zip}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              navigate(`./${repair.maintenance_request_uid}`, {
                                state: {
                                  repair: repair,
                                },
                              });
                            }}
                            padding="none"
                            size="small"
                            align="center"
                          >
                            {repair.priority}
                          </TableCell>

                          <TableCell
                            onClick={() => {
                              navigate(`./${repair.maintenance_request_uid}`, {
                                state: {
                                  repair: repair,
                                },
                              });
                            }}
                            padding="none"
                            size="small"
                            align="center"
                          >
                            {repair.request_created_date.split(" ")[0]}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              navigate(`./${repair.maintenance_request_uid}`, {
                                state: {
                                  repair: repair,
                                },
                              });
                            }}
                            padding="none"
                            size="small"
                            align="center"
                          >
                            {repair.days_open} days
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {(repair.request_status === "FINISHED" ||
                              repair.request_status === "COMPLETED") &&
                            repair.quotes.some(
                              (quote) => quote.quote_status === "AGREED"
                            ) ? (
                              <Button
                                onClick={() =>
                                  navigate(
                                    `/managerPaymentPage/${repair.purchase[0].purchase_uid}`,
                                    {
                                      state: {
                                        amount: repair.purchase[0].amount_due,
                                        selectedProperty:
                                          repair.selectedProperty,
                                        purchaseUIDs: [
                                          repair.purchase[0].purchase_uid,
                                        ],
                                        purchases: repair.purchase,
                                      },
                                    }
                                  )
                                }
                              >
                                Pay
                              </Button>
                            ) : repair.quotes_to_review > 0 ? (
                              `${repair.quotes_to_review} new quote(s) to review`
                            ) : (
                              "No new quotes"
                            )}
                          </TableCell>
                          <TableCell>
                            <img
                              src={CopyIcon}
                              title="Duplicate"
                              style={{
                                width: "15px",
                                height: "15px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                duplicate_request(repair);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </Row>
            </div>
          ) : (
            <Row className="m-3">
              <div className="m-3">No maintenance and repairs</div>
            </Row>
          )}
        </Col>
        <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
          <ManagerFooter />
        </div>
      </Row>
    </div>
  ) : stage === "ADDREQUEST" ? (
    <div className="OwnerRepairRequest">
      <Row className="w-100 mb-5 overflow-hidden">
        {" "}
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5 overflow-scroll">
          <Header title="Add Repair Request" />
          <ManagerRepairRequest
            properties={properties}
            cancel={() => setStage("LIST")}
            onSubmit={addRequest}
          />
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <ManagerFooter />
          </div>
        </Col>
      </Row>
    </div>
  ) : (
    ""
  );
}

export default ManagerRepairsOverview;
