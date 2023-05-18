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
import OwnerFooter from "./OwnerFooter";
import OwnerRepairRequest from "./OwnerRepairRequest";
import AppContext from "../../AppContext";
import AddIcon from "../../icons/AddIcon.svg";
import RepairImg from "../../icons/RepairImg.svg";
import CopyIcon from "../../icons/CopyIcon.png";
import { get, post } from "../../utils/api";
import { sidebarStyle } from "../../utils/styles";
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

function OwnerRepairList(props) {
  const classes = useStyles();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);

  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [repairIter, setRepairIter] = useState([]);
  const [stage, setStage] = useState("LIST");
  const [copied, setCopied] = useState(false);
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("days_open");
  const [isLoading, setIsLoading] = useState(true);
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
    setCopied(true);
    await post("/maintenanceRequests", newRequest, null, files);
    setCopied(false);
    fetchProperties();
  };

  const fetchProperties = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }
    const response = await get("/ownerDashboard", access_token);
    const maint_response = await get(
      `/maintenanceRequestsandQuotes?owner_id=${user.user_uid}`
    );
    const properties = response.result;
    const pids = new Set();
    const properties_unique = [];
    properties.forEach((property) => {
      if (pids.has(property.property_uid)) {
        // console.log("here in if");
        // properties_unique[properties_unique.length-1].tenants.push(property)
        const index = properties_unique.findIndex(
          (item) => item.property_uid === property.property_uid
        );
        if (
          property.rental_status === "ACTIVE" ||
          property.rental_status === "PROCESSING"
        ) {
          // console.log("here", property);
          properties_unique[index].tenants.push(property.rentalInfo);
        }
      } else {
        // console.log("here in else");
        pids.add(property.property_uid);
        properties_unique.push(property);
        if (
          property.rental_status === "ACTIVE" ||
          property.rental_status === "PROCESSING"
        ) {
          // console.log("here", property);
          properties_unique[properties_unique.length - 1].tenants = [
            property.rentalInfo,
          ];
        }
      }
    });

    let repairI = [];
    let repairIT = [];
    let new_repairs = [];
    let info_repairs = [];
    let processing_repairs = [];
    let scheduled_repairs = [];
    let completed_repairs = [];
    let newrepairs = "";
    let inforepairs = "";
    let processingrepairs = "";
    let scheduledrepairs = "";
    let completedrepairs = "";
    for (let r = 0; r < maint_response.result.length; r++) {
      // console.log(maint_response.result[r]);

      let repairs = maint_response.result[r].maintenanceRequests;
      repairs.forEach((repair, i) => {
        // console.log(repair);
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
      // console.log("repairs unsorted", repairs);
      let repairs_sorted = sort_repairs(repairs);
      sort_repairs_address(repairs);
      // console.log("repairs sorted", repairs_sorted);

      repairs_sorted.forEach((repair_sorted, i) => {
        // console.log("repairs sorted in for each ", i, repair_sorted);

        if (repair_sorted.request_status === "NEW") {
          newrepairs = repair_sorted;
          new_repairs.push(newrepairs);
        } else if (repair_sorted.request_status === "INFO") {
          inforepairs = repair_sorted;
          info_repairs.push(inforepairs);
        } else if (repair_sorted.request_status === "PROCESSING") {
          processingrepairs = repair_sorted;
          processing_repairs.push(processingrepairs);
        } else if (
          repair_sorted.request_status === "SCHEDULED" ||
          repair_sorted.request_status === "RESCHEDULE" ||
          repair_sorted.request_status === "SCHEDULE"
        ) {
          scheduledrepairs = repair_sorted;
          scheduled_repairs.push(scheduledrepairs);
        } else {
          completedrepairs = repair_sorted;
          completed_repairs.push(completedrepairs);
        }
      });

      repairI = [
        { title: "New", repairs_list: new_repairs },
        { title: "Info Requested", repairs_list: info_repairs },
        { title: "Processing", repairs_list: processing_repairs },
        { title: "Upcoming, Scheduled", repairs_list: scheduled_repairs },
        { title: "Completed", repairs_list: completed_repairs },
      ];
      // console.log(repairI);
      repairIT.push(repairI);
      // setRepairIter(repairI.push(repairI));
    }
    // console.log("repairs_sorted", repairI, repairIT);
    setRepairIter(repairI);

    setIsLoading(false);

    setProperties(properties_unique);
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const addRequest = () => {
    fetchProperties();

    setStage("LIST");
  };

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
      id: "total_estimate",
      numeric: true,
      label: "Cost",
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
  // console.log(repairIter);
  return stage === "LIST" ? (
    <div className="w-100 overflow-hidden">
      <CopyDialog copied={copied} />
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
            title="Repairs"
            // rightText="+ New"
            // rightFn={() => setStage("ADDREQUEST")}
          />
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
            {!isLoading ? (
              repairIter.length > 1 ? (
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
                            >
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  navigate(
                                    `/owner-repairs/${repair.maintenance_request_uid}`,
                                    {
                                      state: {
                                        repair: repair,
                                        property: repair.address,
                                        propert_manager:
                                          repair.property_manager,
                                      },
                                    }
                                  );
                                }}
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
                                onClick={() => {
                                  navigate(
                                    `/owner-repairs/${repair.maintenance_request_uid}`,
                                    {
                                      state: {
                                        repair: repair,
                                        property: repair.address,
                                        propert_manager:
                                          repair.property_manager,
                                      },
                                    }
                                  );
                                }}
                                style={{
                                  color:
                                    row.title === "New" ? "green" : "black",
                                }}
                              >
                                {row.title}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  navigate(
                                    `/owner-repairs/${repair.maintenance_request_uid}`,
                                    {
                                      state: {
                                        repair: repair,
                                        property: repair.address,
                                        propert_manager:
                                          repair.property_manager,
                                      },
                                    }
                                  );
                                }}
                              >
                                {repair.title}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  navigate(
                                    `/owner-repairs/${repair.maintenance_request_uid}`,
                                    {
                                      state: {
                                        repair: repair,
                                        property: repair.address,
                                        propert_manager:
                                          repair.property_manager,
                                      },
                                    }
                                  );
                                }}
                              >
                                {repair.description}
                              </TableCell>

                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  navigate(
                                    `/owner-repairs/${repair.maintenance_request_uid}`,
                                    {
                                      state: {
                                        repair: repair,
                                        property: repair.address,
                                        propert_manager:
                                          repair.property_manager,
                                      },
                                    }
                                  );
                                }}
                              >
                                {repair.address}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  navigate(
                                    `/owner-repairs/${repair.maintenance_request_uid}`,
                                    {
                                      state: {
                                        repair: repair,
                                        property: repair.address,
                                        propert_manager:
                                          repair.property_manager,
                                      },
                                    }
                                  );
                                }}
                              >
                                {repair.priority}
                              </TableCell>

                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  navigate(
                                    `/owner-repairs/${repair.maintenance_request_uid}`,
                                    {
                                      state: {
                                        repair: repair,
                                        property: repair.address,
                                        propert_manager:
                                          repair.property_manager,
                                      },
                                    }
                                  );
                                }}
                              >
                                {repair.request_created_date.split(" ")[0]}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  navigate(
                                    `/owner-repairs/${repair.maintenance_request_uid}`,
                                    {
                                      state: {
                                        repair: repair,
                                        property: repair.address,
                                        propert_manager:
                                          repair.property_manager,
                                      },
                                    }
                                  );
                                }}
                              >
                                {repair.days_open} days
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  navigate(
                                    `/owner-repairs/${repair.maintenance_request_uid}`,
                                    {
                                      state: {
                                        repair: repair,
                                        property: repair.address,
                                        propert_manager:
                                          repair.property_manager,
                                      },
                                    }
                                  );
                                }}
                              >
                                {repair.quotes_to_review > 0
                                  ? `${repair.quotes_to_review} new quote(s) to review`
                                  : "No new quotes"}
                              </TableCell>
                              {/* <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  navigate(
                                    `/owner-repairs/${repair.maintenance_request_uid}`,
                                    {
                                      state: {
                                        repair: repair,
                                        property: repair.address,
                                        propert_manager:
                                          repair.property_manager,
                                      },
                                    }
                                  );
                                }}
                              >
                                {repair.assigned_business !== null
                                  ? repair.assigned_business
                                  : "None"}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  navigate(
                                    `/owner-repairs/${repair.maintenance_request_uid}`,
                                    {
                                      state: {
                                        repair: repair,
                                        property: repair.address,
                                        propert_manager:
                                          repair.property_manager,
                                      },
                                    }
                                  );
                                }}
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
                                onClick={() => {
                                  navigate(
                                    `/owner-repairs/${repair.maintenance_request_uid}`,
                                    {
                                      state: {
                                        repair: repair,
                                        property: repair.address,
                                        propert_manager:
                                          repair.property_manager,
                                      },
                                    }
                                  );
                                }}
                              >
                                {repair.scheduled_time !== null &&
                                repair.scheduled_time !== "null"
                                  ? repair.scheduled_time.split(" ")[0]
                                  : "Not Scheduled"}
                              </TableCell> */}

                              <TableCell>${repair.total_estimate}</TableCell>
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
                          ));
                        })}
                      </TableBody>
                    </Table>
                  </Row>
                </div>
              ) : (
                <Row className="m-3">
                  <div className="m-3">No maintenance and repair requests</div>
                </Row>
              )
            ) : (
              <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                <ReactBootStrap.Spinner animation="border" role="status" />
              </div>
            )}
          </div>
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <OwnerFooter />
          </div>
        </Col>
      </Row>
    </div>
  ) : stage === "ADDREQUEST" ? (
    <div className="OwnerRepairRequest">
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
          <OwnerRepairRequest
            properties={properties}
            cancel={() => setStage("LIST")}
            onSubmit={addRequest}
          />
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <OwnerFooter />
          </div>
        </Col>
      </Row>
    </div>
  ) : (
    ""
  );
}

export default OwnerRepairList;
