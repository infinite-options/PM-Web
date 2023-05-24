import React from "react";
import { Row, Col } from "react-bootstrap";
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
import OwnerCashflow from "./OwnerCashflow";
import AppContext from "../../AppContext";
import OwnerPropertyForm from "./OwnerPropertyForm";
import OwnerCreateExpense from "./OwnerCreateExpense";
import OwnerRepairRequest from "./OwnerRepairRequest";
import OwnerFooter from "./OwnerFooter";
import AddIcon from "../../icons/AddIcon.svg";
import PropertyIcon from "../../icons/PropertyIcon.svg";
import RepairImg from "../../icons/RepairImg.svg";
import CopyIcon from "../../icons/CopyIcon.png";
import { get, post } from "../../utils/api";
import { blue, sidebarStyle, xSmall } from "../../utils/styles";
import CopyDialog from "../CopyDialog";
import {
  days,
  descendingComparator as descendingComparator,
  getComparator as getComparator,
  stableSort as stableSort,
} from "../../utils/helper";
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

export default function OwnerDashboard2() {
  const navigate = useNavigate();
  const classes = useStyles();

  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [ownerData, setOwnerData] = useState([]);
  const [editAppliances, setEditAppliances] = useState(false);
  const [stage, setStage] = useState("LIST");
  const [isLoading, setIsLoading] = useState(true);

  const [copied, setCopied] = useState(false);
  const { userData, refresh, ably } = useContext(AppContext);
  const { access_token, user } = userData;
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");

  const [orderMaintenance, setOrderMaintenance] = useState("desc");
  const [orderMaintenanceBy, setOrderMaintenanceBy] = useState("days_open");
  const [managementStatus, setManagementStatus] = useState("");
  const [maintenanceStatus, setMaintenanceStatus] = useState("");
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

  const headerBack = () => {
    if (editAppliances && stage === "NEW") {
      setEditAppliances(false);
    } else if (stage === "NEW") {
      setEditAppliances(false);
      setStage("LIST");
    } else {
      setStage("LIST");
    }
    // navigate("../owner");
  };

  const fetchOwnerDashboard = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }
    const response = await get("/ownerDashboard", access_token);

    if (response.msg === "Token has expired") {
      // console.log("here msg");
      refresh();

      return;
    }

    let pu = response.result;
    pu.forEach((property) => {
      const forwarded = property.property_manager.filter(
        (item) => item.management_status === "FORWARDED"
      );
      const sent = property.property_manager.filter(
        (item) => item.management_status === "SENT"
      );
      const refused = property.property_manager.filter(
        (item) => item.management_status === "REFUSED"
      );

      const pmendearly = property.property_manager.filter(
        (item) => item.management_status === "PM END EARLY"
      );
      const ownerendearly = property.property_manager.filter(
        (item) => item.management_status === "OWNER END EARLY"
      );
      property.management = {
        forwarded: forwarded.length,
        sent: sent.length,
        refused: refused.length,
        pmendearly: pmendearly.length,
        ownerendearly: ownerendearly.length,
      };
    });
    // console.log(pu);
    setOwnerData(pu);

    let requests = [];
    if (parseInt(daysCompleted) >= 0) {
      response.result.forEach((res) => {
        if (res.maintenanceRequests.length > 0) {
          res.maintenanceRequests.forEach((mr) => {
            if (
              days(new Date(mr.request_closed_date), new Date()) >=
                parseInt(daysCompleted) &&
              mr.request_status === "COMPLETED"
            ) {
            } else {
              requests.push(mr);
            }
          });
        }
      });
    } else {
      response.result.forEach((res) => {
        if (res.maintenanceRequests.length > 0) {
          res.maintenanceRequests.forEach((mr) => {
            requests.push(mr);
          });
        }
      });
    }

    setMaintenanceRequests(requests);
    setIsLoading(false);
  };
  const channel = ably.channels.get("management_status");
  const channel_maintenance = ably.channels.get("maintenance_status");

  useEffect(() => {
    async function management_message() {
      await channel.subscribe((message) => {
        // console.log(message);
        setManagementStatus(message.data.te);
      });
    }
    async function maintenance_message() {
      await channel_maintenance.subscribe((message) => {
        // console.log(message);
        setMaintenanceStatus(message.data.te);
      });
    }
    management_message();
    maintenance_message();
    fetchOwnerDashboard();
    return function cleanup() {
      channel.unsubscribe();
      channel_maintenance.unsubscribe();
    };
  }, [access_token, managementStatus, maintenanceStatus]);
  useEffect(() => {
    filterRequests();
  }, [daysCompleted]);
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
    fetchOwnerDashboard();
  };
  const filterRequests = () => {
    let requests = [];
    if (parseInt(daysCompleted) >= 0) {
      ownerData.forEach((res) => {
        if (res.maintenanceRequests.length > 0) {
          res.maintenanceRequests.forEach((mr) => {
            if (
              days(new Date(mr.request_closed_date), new Date()) >=
                parseInt(daysCompleted) &&
              mr.request_status === "COMPLETED"
            ) {
            } else {
              requests.push(mr);
            }
          });
        }
      });
    } else {
      ownerData.forEach((res) => {
        if (res.maintenanceRequests.length > 0) {
          res.maintenanceRequests.forEach((mr) => {
            requests.push(mr);
          });
        }
      });
    }

    setMaintenanceRequests(requests);
  };

  const addProperty = () => {
    fetchOwnerDashboard();
    setStage("LIST");
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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
      id: "tenant",
      numeric: false,
      label: "Tenant",
    },

    {
      id: "rent_paid",
      numeric: true,
      label: "Rent Status",
    },
    {
      id: "listed_rent",
      numeric: true,
      label: "Rent",
    },
    {
      id: "per_sqft",
      numeric: true,
      label: " $/Sq Ft",
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
      id: "property_manager",
      numeric: true,
      label: "Property Manager",
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
    {
      id: "total_estimate",
      numeric: true,
      label: "Cost",
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

  return stage === "LIST" ? (
    <div className="w-100 overflow-hidden">
      <CopyDialog copied={copied} />
      {!isLoading && ownerData.length > 0 ? (
        <Row className="w-100 mb-5 overflow-hidden">
          <Col
            xs={2}
            hidden={!responsiveSidebar.showSidebar}
            style={sidebarStyle}
          >
            <SideBar />
          </Col>
          <Col className="w-100 mb-5 overflow-scroll">
            <Header title="Owner Dashboard" />
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <OwnerCashflow
                ownerData={ownerData}
                byProperty={true}
                propertyView={false}
                addExpense={stage}
                setAddExpense={setStage}
              />
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
                <Col>
                  <img
                    src={AddIcon}
                    alt="Add Icon"
                    onClick={() => setStage("NEW")}
                    style={{
                      width: "30px",
                      height: "30px",
                      float: "right",
                      marginRight: "3rem",
                    }}
                  />
                </Col>
              </Row>

              <Row className="w-100 m-3">
                <Col xs={2}> Search by</Col>

                <Col>
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(event) => {
                      setSearch(event.target.value);
                    }}
                    style={{
                      width: "400px",
                      border: "1px solid black",
                      padding: "5px",
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
                  <EnhancedTableHeadProperties
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={ownerData.length}
                  />{" "}
                  <TableBody>
                    {stableSort(ownerData, getComparator(order, orderBy))
                      // for filtering
                      .filter((val) => {
                        const query = search.toLowerCase();

                        return (
                          val.address.toLowerCase().indexOf(query) >= 0 ||
                          val.city.toLowerCase().indexOf(query) >= 0 ||
                          val.zip.toLowerCase().indexOf(query) >= 0 ||
                          String(val.oldestOpenMR)
                            .toLowerCase()
                            .indexOf(query) >= 0 ||
                          String(val.late_date).toLowerCase().indexOf(query) >=
                            0
                        );
                      })
                      .map((property, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={property.property_uid}
                            onClick={() => {
                              navigate(
                                `/propertyDetails/${property.property_uid}`,
                                {
                                  state: {
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
                              {property.unit !== "" ? " " + property.unit : ""}
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
                              {property.rentalInfo.length !== 0
                                ? property.rentalInfo[0].tenant_first_name
                                : "Not Rented"}
                            </TableCell>

                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              style={{
                                color:
                                  property.available_to_rent === 0 &&
                                  property.rent_status === "No Rent Info"
                                    ? "red"
                                    : property.rent_status === "PAID"
                                    ? "black"
                                    : property.rent_status === "UNPAID"
                                    ? "red"
                                    : "green",
                              }}
                            >
                              {property.available_to_rent === 0 &&
                              property.rent_status === "No Rent Info" ? (
                                <div>Not Listed</div>
                              ) : (
                                <div>{property.rent_status}</div>
                              )}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {"$" + property.listed_rent}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              ${property.per_sqft}
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
                              style={{
                                color:
                                  property.property_manager.length > 0
                                    ? "black"
                                    : "red",
                              }}
                            >
                              {property.property_manager.length > 1 ? (
                                Object.values(property.property_manager).map(
                                  (pm) =>
                                    pm.management_status === "ACCEPTED" ||
                                    pm.management_status === "PM END EARLY" ||
                                    pm.management_status === "OWNER END EARLY"
                                      ? pm.manager_business_name
                                      : ""
                                )
                              ) : property.property_manager.length === 1 &&
                                (property.property_manager[0]
                                  .management_status === "ACCEPTED" ||
                                  property.property_manager[0]
                                    .management_status === "PM END EARLY" ||
                                  property.property_manager[0]
                                    .management_status ===
                                    "OWNER END EARLY") ? (
                                <div>
                                  {
                                    property.property_manager[0]
                                      .manager_business_name
                                  }
                                </div>
                              ) : (
                                "None"
                              )}
                              <div className="d-flex align-items-center flex-column">
                                {property.management.forwarded > 0 ? (
                                  <div
                                    style={{ ...blue, ...xSmall }}
                                    className="mb-0"
                                  >
                                    {property.management.forwarded} Property
                                    Manager Selected
                                  </div>
                                ) : (
                                  ""
                                )}

                                {property.management.sent > 0 ? (
                                  <div
                                    style={{ ...blue, ...xSmall }}
                                    className="mb-0"
                                  >
                                    {property.management.sent} Contract in
                                    Review
                                  </div>
                                ) : (
                                  ""
                                )}

                                {property.management.refused > 0 ? (
                                  <div
                                    style={{ ...blue, ...xSmall }}
                                    className="mb-0"
                                  >
                                    {property.management.refused} PM declined
                                  </div>
                                ) : (
                                  ""
                                )}
                                {property.management.pmendearly > 0 ? (
                                  <div
                                    style={{ ...blue, ...xSmall }}
                                    className="mb-0"
                                  >
                                    PM requested end early
                                  </div>
                                ) : (
                                  ""
                                )}
                                {property.management.ownerendearly > 0 ? (
                                  <div
                                    style={{ ...blue, ...xSmall }}
                                    className="mb-0"
                                  >
                                    Owner requested end early
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              style={{
                                color:
                                  property.rentalInfo.length !== 0
                                    ? 0 <
                                        (new Date(
                                          property.rentalInfo[0].lease_end
                                        ).getTime() -
                                          new Date().getTime()) /
                                          (1000 * 60 * 60 * 24) &&
                                      Math.floor(
                                        (new Date(
                                          property.rentalInfo[0].lease_end
                                        ).getTime() -
                                          new Date().getTime()) /
                                          (1000 * 60 * 60 * 24)
                                      ) < 60
                                      ? "#e6cc00"
                                      : Math.floor(
                                          (new Date(
                                            property.rentalInfo[0].lease_end
                                          ).getTime() -
                                            new Date().getTime()) /
                                            (1000 * 60 * 60 * 24)
                                        ) > 60
                                      ? "black"
                                      : "red"
                                    : "black",
                              }}
                            >
                              {property.rentalInfo.length !== 0
                                ? property.rentalInfo[0].lease_end
                                : "None"}
                            </TableCell>
                          </TableRow>
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
                    onClick={() => setStage("ADDREQUEST")}
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
                          >
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              onClick={() =>
                                navigate(
                                  `/owner-repairs/${request.maintenance_request_uid}`,
                                  {
                                    state: {
                                      repair: request,
                                      property: request.address,
                                    },
                                  }
                                )
                              }
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
                              onClick={() =>
                                navigate(
                                  `/owner-repairs/${request.maintenance_request_uid}`,
                                  {
                                    state: {
                                      repair: request,
                                      property: request.address,
                                    },
                                  }
                                )
                              }
                            >
                              {request.address}{" "}
                              {request.unit !== "" ? " " + request.unit : ""}{" "}
                              {request.city}, {request.state} {request.zip}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              onClick={() =>
                                navigate(
                                  `/owner-repairs/${request.maintenance_request_uid}`,
                                  {
                                    state: {
                                      repair: request,
                                      property: request.address,
                                    },
                                  }
                                )
                              }
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
                              {request.request_status === "COMPLETED" ? (
                                <div className="d-flex">
                                  <div className="d-flex justify-content-right">
                                    <p
                                      style={{ ...blue, ...xSmall }}
                                      className="mb-0"
                                    >
                                      {days(
                                        new Date(request.request_closed_date),
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
                              padding="none"
                              size="small"
                              align="center"
                              onClick={() =>
                                navigate(
                                  `/owner-repairs/${request.maintenance_request_uid}`,
                                  {
                                    state: {
                                      repair: request,
                                      property: request.address,
                                    },
                                  }
                                )
                              }
                            >
                              {" "}
                              {request.title}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              onClick={() =>
                                navigate(
                                  `/owner-repairs/${request.maintenance_request_uid}`,
                                  {
                                    state: {
                                      repair: request,
                                      property: request.address,
                                    },
                                  }
                                )
                              }
                            >
                              {" "}
                              {request.request_created_date}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              onClick={() =>
                                navigate(
                                  `/owner-repairs/${request.maintenance_request_uid}`,
                                  {
                                    state: {
                                      repair: request,
                                      property: request.address,
                                    },
                                  }
                                )
                              }
                            >
                              {request.days_open} days
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              onClick={() =>
                                navigate(
                                  `/owner-repairs/${request.maintenance_request_uid}`,
                                  {
                                    state: {
                                      repair: request,
                                      property: request.address,
                                    },
                                  }
                                )
                              }
                            >
                              {request.request_type !== null
                                ? request.request_type
                                : "None"}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              onClick={() =>
                                navigate(
                                  `/owner-repairs/${request.maintenance_request_uid}`,
                                  {
                                    state: {
                                      repair: request,
                                      property: request.address,
                                    },
                                  }
                                )
                              }
                            >
                              {request.priority}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              onClick={() =>
                                navigate(
                                  `/owner-repairs/${request.maintenance_request_uid}`,
                                  {
                                    state: {
                                      repair: request,
                                      property: request.address,
                                    },
                                  }
                                )
                              }
                            >
                              {request.assigned_business !== null &&
                              request.assigned_business !== "null"
                                ? request.assigned_business_info[0]
                                    .business_name
                                : "None"}
                            </TableCell>

                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              onClick={() =>
                                navigate(
                                  `/owner-repairs/${request.maintenance_request_uid}`,
                                  {
                                    state: {
                                      repair: request,
                                      property: request.address,
                                    },
                                  }
                                )
                              }
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
                              onClick={() =>
                                navigate(
                                  `/owner-repairs/${request.maintenance_request_uid}`,
                                  {
                                    state: {
                                      repair: request,
                                      property: request.address,
                                    },
                                  }
                                )
                              }
                            >
                              {request.scheduled_time !== null &&
                              request.scheduled_time !== "null"
                                ? request.scheduled_time.split(" ")[0]
                                : "Not Scheduled"}
                            </TableCell>
                            <TableCell>${request.total_estimate}</TableCell>
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
                                  duplicate_request(request);
                                }}
                              />
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
            <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
              <OwnerFooter />
            </div>
          </Col>
        </Row>
      ) : !isLoading && ownerData.length === 0 ? (
        <Row className="w-100 mb-5 overflow-hidden">
          <Col
            xs={2}
            hidden={!responsiveSidebar.showSidebar}
            style={sidebarStyle}
          >
            <SideBar />
          </Col>
          <Col className="w-100 mb-5 overflow-scroll">
            <Header title="Owner Dashboard" />
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h3>Welcome to Manifest My Space</h3>
              </div>
              <Row className="m-3">
                <Col>
                  <h3>Add a new Property</h3>
                </Col>
                <Col xs={2}>
                  <img
                    src={AddIcon}
                    alt="Add Icon"
                    onClick={() => setStage("NEW")}
                    style={{
                      width: "30px",
                      height: "30px",
                      float: "right",
                      marginRight: "3rem",
                    }}
                  />
                </Col>
              </Row>
            </div>
            <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
              <OwnerFooter />
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
              <OwnerFooter />
            </div>
          </Col>
        </Row>
      )}
    </div>
  ) : stage === "NEW" ? (
    <div className="OwnerDashboard2">
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
            title={
              stage === "NEW" && editAppliances
                ? "Add appliances"
                : "Add a new Property"
            }
            leftText="< Back"
            leftFn={() => headerBack()}
          />
          <OwnerPropertyForm
            edit
            cancel={() => setStage("LIST")}
            editAppliances={editAppliances}
            setEditAppliances={setEditAppliances}
            onSubmit={addProperty}
          />
          <div hidden={responsiveSidebar.showSidebar}>
            <OwnerFooter />
          </div>
        </Col>
      </Row>
    </div>
  ) : stage === "ADDEXPENSE" ? (
    <div className="OwnerDashboard2">
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
            title="Add Expense"
            leftText="< Back"
            leftFn={() => setStage("LIST")}
          />
          <OwnerCreateExpense
            properties={ownerData}
            cancel={() => setStage("LIST")}
            onSubmit={addProperty}
          />
          <div hidden={responsiveSidebar.showSidebar}>
            <OwnerFooter />
          </div>{" "}
        </Col>
      </Row>
    </div>
  ) : stage === "ADDREQUEST" ? (
    <div className="OwnerDashboard2">
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
          <OwnerRepairRequest
            properties={ownerData}
            cancel={() => setStage("LIST")}
            onSubmit={addProperty}
          />{" "}
          <div hidden={responsiveSidebar.showSidebar}>
            <OwnerFooter />
          </div>
        </Col>
      </Row>
    </div>
  ) : (
    ""
  );
}
