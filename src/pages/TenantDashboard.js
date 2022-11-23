import React from "react";
import { Container, Row, Col, Carousel, CarouselItem } from "react-bootstrap";
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
import SideBar from "../components/tenantComponents/SideBar";
import Header from "../components/Header";
import AppContext from "../AppContext";
import TenantFooter from "../components/tenantComponents/TenantFooter";
import UpcomingPayments from "../components/tenantComponents/UpcomingPayments";
import PaymentHistory from "../components/tenantComponents/PaymentHistory";
import TenantRepairRequest from "../components/tenantComponents/TenantRepairRequest";
import SortDown from "../icons/Sort-down.svg";
import SortLeft from "../icons/Sort-left.svg";
import SearchProperties_Black from "../icons/SearchProperties_Black.svg";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import AddIcon from "../icons/AddIcon.svg";
import PropertyIcon from "../icons/PropertyIcon.svg";
import RepairImg from "../icons/RepairImg.svg";
import { get, put } from "../utils/api";
import {
  green,
  red,
  blue,
  xSmall,
  subHeading,
  smallImg,
} from "../utils/styles";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [stage, setStage] = useState("LIST");
  const [isLoading, setIsLoading] = useState(true);
  const [tenantData, setTenantData] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [upcomingPaymentsData, setUpcomingPaymentsData] = useState([]);
  const [paymentHistoryData, setPaymentHistoryData] = useState([]);

  const [managerInfo, setManagerInfo] = useState([]);

  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");

  const [orderMaintenance, setOrderMaintenance] = useState("asc");
  const [orderMaintenanceBy, setOrderMaintenanceBy] = useState("calories");

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
  const responsive = {
    showSidebar: width > 1023,
  };
  const fetchTenantDashboard = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }
    const response = await get("/tenantDashboard", access_token);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();

      return;
    }
    console.log(response.result);
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
        (item) => item.request_status === "SCHEDULED"
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
    });

    console.log(properties_unique);

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
    console.log("in use effect");
    fetchTenantDashboard();
  }, [access_token]);

  const addProperty = () => {
    fetchTenantDashboard();
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
    // {
    //   id: "city",
    //   numeric: false,
    //   label: "City,State",
    // },
    {
      id: "zip",
      numeric: true,
      label: "Zip",
    },

    {
      id: "owner",
      numeric: false,
      label: "Owner",
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
      label: "Closed Date",
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
      {!isLoading && tenantData.length > 1 ? (
        <div className="flex-1">
          <div
            hidden={!responsive.showSidebar}
            style={{
              backgroundColor: "#229ebc",
              width: "11rem",
              minHeight: "100%",
            }}
          >
            <SideBar />
          </div>
          <div className="w-100 mb-5">
            <Header title="Tenant Dashboard" />
            {announcements.length > 0 ? (
              <Row>
                <h1>Announcements</h1>
                <Carousel slide={false}>
                  {announcements.map((announce) => {
                    return (
                      <CarouselItem>
                        <div className="align-items-center w-50">
                          <p style={subHeading}>
                            {announce.announcement_title}
                          </p>
                          <p>{announce.announcement_msg}</p>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </Carousel>
              </Row>
            ) : (
              ""
            )}
            <Row className="m-3">
              <Col>
                <h1>Properties</h1>
              </Col>
              <Col>
                <img
                  src={SearchProperties_Black}
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
                  {stableSort(tenantData, getComparator(order, orderBy))
                    // for filtering
                    .filter((val) => {
                      const query = search.toLowerCase();

                      return (
                        val.address.toLowerCase().indexOf(query) >= 0 ||
                        val.city.toLowerCase().indexOf(query) >= 0 ||
                        val.zip.toLowerCase().indexOf(query) >= 0 ||
                        String(val.oldestOpenMR).toLowerCase().indexOf(query) >=
                          0 ||
                        String(val.late_date).toLowerCase().indexOf(query) >= 0
                      );
                    })
                    .map((property, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={property.property_uid}
                        >
                          <TableCell padding="none" size="small" align="center">
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
                          <TableCell padding="none" size="small" align="center">
                            {property.address}
                            {property.unit !== ""
                              ? " " + property.unit
                              : ""}{" "}
                            {property.city}, {property.state}
                          </TableCell>
                          {/* <TableCell
                            padding="none"
                            size="small"
                            align="center"
                           
                          >
                            {property.city}, {property.state}
                          </TableCell> */}
                          <TableCell padding="none" size="small" align="center">
                            {property.zip}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.owner[0].owner_first_name}{" "}
                            {property.owner[0].owner_last_name}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.property_manager[0].manager_business_name}
                          </TableCell>

                          <TableCell padding="none" size="small" align="center">
                            {property.property_type}
                          </TableCell>

                          <TableCell padding="none" size="small" align="center">
                            {property.num_beds + "/" + property.num_baths}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Row>
            <Row className="m-3">
              <Col>
                <h1>Payment Summary</h1>
              </Col>
            </Row>
            <Row className="m-3">
              {tenantData.length !== 0 && (
                <UpcomingPayments data={upcomingPaymentsData} type={true} />
              )}
              {tenantData.length !== 0 && (
                <PaymentHistory data={paymentHistoryData} />
              )}
            </Row>
            <Row className="m-3">
              <Col>
                <h1>Maintenance and Repairs</h1>
              </Col>
              <Col>
                <img
                  src={AddIcon}
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
                {/* <h1 style={{ float: "right", marginRight: "3rem" }}>+</h1> */}
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
                              `/manager-repairs/${request.maintenance_request_uid}`,
                              {
                                state: {
                                  repair: request,
                                  property: request.address,
                                },
                              }
                            )
                          }
                        >
                          <TableCell padding="none" size="small" align="center">
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
                          <TableCell padding="none" size="small" align="center">
                            {request.address}{" "}
                            {request.unit !== "" ? " " + request.unit : ""}{" "}
                            {request.city}, {request.state} {request.zip}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {request.request_status}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {" "}
                            {request.title}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {" "}
                            {request.request_created_date}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {request.days_open} days
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {request.request_type != null
                              ? request.request_type
                              : "None"}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {request.priority}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {request.assigned_business != null
                              ? request.assigned_business
                              : "None"}
                          </TableCell>

                          <TableCell padding="none" size="small" align="center">
                            {request.scheduled_date != null
                              ? request.scheduled_date
                              : "Not Scheduled"}
                          </TableCell>
                          <TableCell>${request.total_estimate}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Row>
            ) : (
              <Row className="m-3">No maintenance requests and repairs</Row>
            )}
            <Row className="m-3">
              <Col>
                <h1>Property Manager Info</h1>
              </Col>
            </Row>
            <Row className="m-3">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Manager Business</TableCell>
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
                        <TableCell>{manager.manager_email}</TableCell>
                        <TableCell>{manager.manager_phone_number}</TableCell>
                        <TableCell>
                          {" "}
                          <a href={`tel:${manager.manager_phone_number}`}>
                            <img src={Phone} alt="Phone" style={smallImg} />
                          </a>
                          <a href={`mailto:${manager.manager_email}`}>
                            <img src={Message} alt="Message" style={smallImg} />
                          </a>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Row>
          </div>
          <div hidden={responsive.showSidebar} className="w-100 mt-3">
            <TenantFooter />
          </div>
        </div>
      ) : !isLoading && tenantData.length == 0 ? (
        <div className="flex-1">
          <div
            hidden={!responsive.showSidebar}
            style={{
              backgroundColor: "#229ebc",
              width: "11rem",
              minHeight: "100%",
            }}
          >
            <SideBar />
          </div>
          <div className="w-100 mb-5">
            <Header title="Owner Dashboard" />
            <Row className="m-3">
              <h1>Welcome to Manifest My Space</h1>
            </Row>

            <div hidden={responsive.showSidebar} className="w-100 mt-3">
              <TenantFooter />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <div
            hidden={!responsive.showSidebar}
            style={{
              backgroundColor: "#229ebc",
              width: "11rem",
              minHeight: "100%",
            }}
          >
            <SideBar />
          </div>
          <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            <ReactBootStrap.Spinner animation="border" role="status" />
          </div>
          <div hidden={responsive.showSidebar} className="w-100 mt-3">
            <TenantFooter />
          </div>
        </div>
      )}
    </div>
  ) : stage === "ADDREQUEST" ? (
    <div className="ManagerDashboard">
      <div className="flex-1">
        <div
          hidden={!responsive.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </div>
        <div className="w-100 mb-5">
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
        </div>
        <div hidden={responsive.showSidebar}>
          <TenantFooter />
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
