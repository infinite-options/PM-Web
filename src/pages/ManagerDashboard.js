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
import SideBar from "../components/managerComponents/SideBar";
import Header from "../components/Header";
import AppContext from "../AppContext";
import ManagerCreateExpense from "../components/managerComponents/ManagerCreateExpense";
import ManagerRepairRequest from "../components/managerComponents/ManagerRepairRequest";
import ManagerFooter from "../components/managerComponents/ManagerFooter";
import AddIcon from "../icons/AddIcon.svg";
import PropertyIcon from "../icons/PropertyIcon.svg";
import RepairImg from "../icons/RepairImg.svg";
import { get } from "../utils/api";
import { green, red, blue, xSmall } from "../utils/styles";
import ManagerCashflow from "../components/managerComponents/ManagerCashflow";
import { configureAbly, useChannel } from "@ably-labs/react-hooks";

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
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [managerData, setManagerData] = useState([]);

  const [processingManagerData, setProcessingManagerData] = useState([]);

  const [stage, setStage] = useState("LIST");
  const [isLoading, setIsLoading] = useState(true);

  const { userData, refresh, ably } = useContext(AppContext);
  const { access_token, user } = userData;
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");

  const [orderMaintenance, setOrderMaintenance] = useState("asc");
  const [orderMaintenanceBy, setOrderMaintenanceBy] = useState("calories");
  const [managementStatus, setManagementStatus] = useState("");

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

  const fetchManagerDashboard = async () => {
    if (access_token === null || user.role.indexOf("MANAGER") === -1) {
      navigate("/");
      return;
    }
    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid;
    }
    const response = await get("/managerDashboard", access_token);

    if (response.msg === "Token has expired") {
      // console.log("here msg");
      refresh();

      return;
    }
    const properties = response.result.filter(
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
        (item) =>
          item.request_status === "SCHEDULED" ||
          item.request_status === "RESCHEDULE" ||
          item.request_status === "SCHEDULE"
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

      property.new_tenant_applications = property.applications.filter(
        (a) => a.application_status === "NEW"
      );
      property.forwarded_applications = property.applications.filter(
        (a) => a.application_status === "FORWARDED"
      );

      property.tenant_end_early_applications = property.applications.filter(
        (a) => a.application_status === "TENANT END EARLY"
      );
      property.pm_end_early_applications = property.applications.filter(
        (a) => a.application_status === "PM END EARLY"
      );
      property.extend_lease_applications = property.applications.filter(
        (a) => a.application_status === "LEASE EXTENSION"
      );
      property.tenant_extend_lease_applications = property.applications.filter(
        (a) => a.application_status === "TENANT LEASE EXTENSION"
      );
      property.tenant_refused_applications = property.applications.filter(
        (a) => a.application_status === "REFUSED"
      );
    });

    // console.log(properties_unique);
    let activeProperties = [];
    properties_unique.forEach((property) => {
      if (
        property.management_status !== "FORWARDED" &&
        property.management_status !== "SENT" &&
        property.management_status !== "TERMINATED" &&
        property.management_status !== "EXPIRED"
      ) {
        activeProperties.push(property);
      }
    });

    // console.log(activeProperties);
    setManagerData(activeProperties);
    let inProcessProperties = [];
    properties_unique.forEach((property) => {
      if (
        property.management_status === "FORWARDED" ||
        property.management_status === "SENT" ||
        property.management_status === "TERMINATED" ||
        property.management_status === "EXPIRED"
      ) {
        inProcessProperties.push(property);
      }
    });
    // console.log(inProcessProperties);
    setProcessingManagerData(inProcessProperties);

    setIsLoading(false);

    let requests = [];
    properties_unique.forEach((res) => {
      if (res.maintenanceRequests.length > 0) {
        res.maintenanceRequests.forEach((mr) => {
          requests.push(mr);
          mr.new_quotes = mr.quotes.filter(
            (a) => a.quote_status === "REQUESTED"
          );
          mr.sent_quotes = mr.quotes.filter((a) => a.quote_status === "SENT");
          mr.accepted_quotes = mr.quotes.filter(
            (a) =>
              a.quote_status === "ACCEPTED" &&
              mr.request_status === "PROCESSING"
          );

          mr.schedule_quotes = mr.quotes.filter(
            (a) =>
              a.quote_status === "ACCEPTED" && mr.request_status === "SCHEDULE"
          );
          mr.reschedule_quotes = mr.quotes.filter(
            (a) =>
              a.quote_status === "ACCEPTED" &&
              mr.request_status === "RESCHEDULE"
          );
          mr.scheduled_quotes = mr.quotes.filter(
            (a) =>
              a.quote_status === "AGREED" && mr.request_status === "SCHEDULED"
          );
          mr.paid_quotes = mr.quotes.filter((a) => a.quote_status === "PAID");
        });
      }
    });
    setMaintenanceRequests(requests);
  };

  const channel = ably.channels.get("management_status");

  useEffect(() => {
    async function subscribe_host() {
      await channel.subscribe((message) => {
        console.log(message);
        setManagementStatus(message.data.te);
      });
    }
    subscribe_host();
    fetchManagerDashboard();
    return function cleanup() {
      channel.unsubscribe();
    };
  }, [access_token, managementStatus]);

  console.log(managerData);
  const fetchTenantDetails = async (tenant_id) => {
    if (access_token === null) {
      navigate("/");
      return;
    }
    // console.log(tenant_id);
    const response = await get("/tenantDetails?tenant_id=" + tenant_id);

    if (response.msg === "Token has expired") {
      // console.log("here msg");
      refresh();

      return;
    }
    // console.log(response.result);
    navigate(`/tenant-list/${tenant_id}`, {
      state: {
        selectedTenant: response.result[0],
      },
    });
  };

  const addProperty = () => {
    fetchManagerDashboard();
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
      id: "owner_first_name",
      numeric: false,
      label: "Owner",
    },

    {
      id: "num_apps",
      numeric: false,
      label: "Apps",
    },

    {
      id: "tenant",
      numeric: false,
      label: "Tenant",
    },
    {
      id: "lease_end",
      numeric: true,
      label: "Lease End",
    },
    {
      id: "rent_status",
      numeric: false,
      label: "Rent Status",
    },
    {
      id: "late_date",
      numeric: true,
      label: "Days Late",
    },
    {
      id: "new_mr",
      numeric: true,
      label: "OP",
    },
    {
      id: "process_mr",
      numeric: true,
      label: "PR",
    },
    {
      id: "quote_received_mr",
      numeric: true,
      label: "QR",
    },
    {
      id: "quotes_accepted_mr",
      numeric: true,
      label: "IP",
    },
    // {
    //   id: "oldestOpenMR",
    //   numeric: true,
    //   label: "Longest duration",
    // },
    {
      id: "listed_rent",
      numeric: true,
      label: "Rent",
    },
    // {
    //   id: "per_sqft",
    //   numeric: true,
    //   label: " $/Sq Ft",
    // },
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

  // console.log(channel);

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
      id: "assigned_business",
      numeric: false,
      label: "Assigned (REC/REQ)",
    },

    {
      id: "tenant_status",
      numeric: false,
      label: "Quote Status",
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
      {!isLoading &&
      (managerData.length > 0 || processingManagerData.length > 0) ? (
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
          <div className="w-100 mb-5 overflow-scroll">
            <Header title="Manager Dashboard" />
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <ManagerCashflow
                managerData={managerData}
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
                  {/* <img
                  src={AddIcon} alt="Add Icon"
                  onClick={() => setStage("NEW")}
                  style={{
                    width: "30px",
                    height: "30px",
                    float: "right",
                    marginRight: "3rem",
                  }}
                /> */}
                </Col>
              </Row>

              {managerData.length > 0 ? (
                <div>
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
                        rowCount={managerData.length}
                      />{" "}
                      <TableBody>
                        {stableSort(managerData, getComparator(order, orderBy))
                          // for filtering
                          .filter((val) => {
                            const query = search.toLowerCase();

                            return (
                              val.address.toLowerCase().indexOf(query) >= 0 ||
                              String(val.unit).toLowerCase().indexOf(query) >=
                                0 ||
                              val.city.toLowerCase().indexOf(query) >= 0 ||
                              val.zip.toLowerCase().indexOf(query) >= 0 ||
                              String(val.oldestOpenMR)
                                .toLowerCase()
                                .indexOf(query) >= 0 ||
                              String(val.late_date)
                                .toLowerCase()
                                .indexOf(query) >= 0
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
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
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
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.address}
                                  {property.unit !== ""
                                    ? " " + property.unit
                                    : ""}{" "}
                                  {property.city}, {property.state}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.zip}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(`/owner-list`);
                                  }}
                                >
                                  {property.owner_id !== ""
                                    ? property.owner_first_name +
                                      " " +
                                      property.owner_last_name
                                    : "No Owner"}

                                  <div className="d-flex align-items-center flex-column">
                                    {property.management_status ===
                                    "FORWARDED" ? (
                                      <div
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        Property Manager Requested
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {property.management_status === "SENT" ? (
                                      <div
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        Contract in Review
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {property.management_status ===
                                    "PM END EARLY" ? (
                                      <div
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        PM requested end early
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    {property.management_status ===
                                    "OWNER END EARLY" ? (
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
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.num_apps}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  style={{
                                    color:
                                      property.available_to_rent === 0 &&
                                      property.rentalInfo === "Not Rented"
                                        ? "red"
                                        : property.rentalInfo === "Not Rented"
                                        ? "green"
                                        : "black",
                                  }}
                                  align="center"
                                >
                                  {property.rentalInfo !== "Not Rented" ? (
                                    property.rentalInfo.map((tf, i) => {
                                      return tf.rental_status === "ACTIVE" ? (
                                        <div
                                          onClick={() => {
                                            fetchTenantDetails(tf.tenant_id);
                                          }}
                                        >
                                          {i + 1} {tf.tenant_first_name}{" "}
                                          {tf.tenant_last_name}
                                        </div>
                                      ) : (
                                        ""
                                      );
                                    })
                                  ) : property.available_to_rent === 0 &&
                                    property.rentalInfo === "Not Rented" ? (
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      Not Listed
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      {property.rentalInfo}
                                    </div>
                                  )}
                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property.new_tenant_applications
                                          .length > 0
                                          ? `${property.new_tenant_applications.length} new tenant application(s) to review`
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property.forwarded_applications
                                          .length > 0
                                          ? `${property.forwarded_applications.length} application(s) in progress`
                                          : ""}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property.tenant_end_early_applications
                                          .length > 0
                                          ? "Tenant(s) requested to end the lease early"
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property.pm_end_early_applications
                                          .length > 0
                                          ? "You requested to end the lease early"
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property
                                          .tenant_extend_lease_applications
                                          .length > 0
                                          ? "Tenant(s) requested to extend the lease"
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property.extend_lease_applications
                                          .length > 0
                                          ? "You requested to extend the lease"
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                  {property.rental_status === "ACTIVE" ||
                                  property.rental_status === "PENDING" ? (
                                    ""
                                  ) : (
                                    <div className="d-flex">
                                      <div className="d-flex align-items-end">
                                        <p
                                          style={{ ...red, ...xSmall }}
                                          className="mb-0"
                                        >
                                          {property.tenant_refused_applications
                                            .length > 0
                                            ? `${property.tenant_refused_applications.length} Tenant(s) refused the lease`
                                            : ""}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </TableCell>
                                {console.log(property)}
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  style={{
                                    color:
                                      0 <
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
                                        : "red",
                                  }}
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.rentalInfo.length !== 0
                                    ? property.rentalInfo[0].lease_end
                                    : "None"}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
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
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      Not Listed
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      {property.rent_status}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.late_date !== "Not Applicable" ? (
                                    <div>{property.late_date} days</div>
                                  ) : (
                                    <div>{property.late_date}</div>
                                  )}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.new_mr}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.process_mr}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.quote_received_mr}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.quote_accepted_mr}
                                </TableCell>
                                {/* <TableCell padding="none" size="small" align="center">
                            {property.oldestOpenMR !=="Not Applicable" ? (
                              <div>{property.oldestOpenMR} days</div>
                            ) : (
                              <div>{property.oldestOpenMR}</div>
                            )}
                          </TableCell> */}
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {"$" + property.listed_rent}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.property_type}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.num_beds + "/" + property.num_baths}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </Row>
                </div>
              ) : (
                <Row className="m-3">No active properties</Row>
              )}
            </div>
            <div>
              {processingManagerData.length > 0 ? (
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
                      <h3>New Properties</h3>
                    </Col>
                    <Col></Col>
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
                        rowCount={processingManagerData.length}
                      />{" "}
                      <TableBody>
                        {stableSort(
                          processingManagerData,
                          getComparator(order, orderBy)
                        )
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
                              String(val.late_date)
                                .toLowerCase()
                                .indexOf(query) >= 0
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
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
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
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.address}
                                  {property.unit !== ""
                                    ? " " + property.unit
                                    : ""}{" "}
                                  {property.city}, {property.state}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.zip}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(`/owner-list`);
                                  }}
                                >
                                  {property.owner_first_name}{" "}
                                  {property.owner_last_name}
                                  <div className="d-flex align-items-center flex-column">
                                    {property.management_status ===
                                    "FORWARDED" ? (
                                      <div
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        Property Manager Requested
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {property.management_status === "SENT" ? (
                                      <div
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        Contract in Review
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {property.management_status ===
                                    "PM END EARLY" ? (
                                      <div
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        PM requested end early
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    {property.management_status ===
                                    "OWNER END EARLY" ? (
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
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.num_apps}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  style={{
                                    color:
                                      property.available_to_rent === 0
                                        ? "Red"
                                        : property.rentalInfo === "Not Rented"
                                        ? "green"
                                        : "black",
                                  }}
                                  align="center"
                                >
                                  {property.rentalInfo !== "Not Rented" ? (
                                    property.rentalInfo.map((tf, i) => {
                                      return (
                                        <div
                                          onClick={() => {
                                            fetchTenantDetails(tf.tenant_id);
                                          }}
                                        >
                                          {i + 1} {tf.tenant_first_name}{" "}
                                          {tf.tenant_last_name}
                                        </div>
                                      );
                                    })
                                  ) : property.available_to_rent === 0 ? (
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      Not Listed
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      {property.rentalInfo}
                                    </div>
                                  )}
                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property.new_tenant_applications
                                          .length > 0
                                          ? `${property.new_tenant_applications.length} new tenant application(s) to review`
                                          : ""}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property.tenant_end_early_applications
                                          .length > 0
                                          ? "Tenant(s) requested to end the lease early"
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property.pm_end_early_applications
                                          .length > 0
                                          ? "You requested to end the lease early"
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property
                                          .tenant_extend_lease_applications
                                          .length > 0
                                          ? "Tenant(s) requested to extend the lease"
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...blue, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property.extend_lease_applications
                                          .length > 0
                                          ? "You requested to extend the lease"
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="d-flex">
                                    <div className="d-flex align-items-end">
                                      <p
                                        style={{ ...red, ...xSmall }}
                                        className="mb-0"
                                      >
                                        {property.tenant_refused_applications
                                          .length > 0
                                          ? `${property.tenant_refused_applications.length} Tenant(s) refused the lease`
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.rentalInfo.length !== 0
                                    ? property.rentalInfo[0].lease_end
                                    : "None"}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                  style={{
                                    color:
                                      property.available_to_rent === 0
                                        ? "red"
                                        : property.rent_status === "PAID"
                                        ? "black"
                                        : property.rent_status === "UNPAID"
                                        ? "red"
                                        : "green",
                                  }}
                                >
                                  {property.available_to_rent === 0 ? (
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      Not Listed
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/managerPropertyDetails/${property.property_uid}`,
                                          {
                                            state: {
                                              property: property,
                                              property_uid:
                                                property.property_uid,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      {property.rent_status}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.late_date !== "Not Applicable" ? (
                                    <div>{property.late_date} days</div>
                                  ) : (
                                    <div>{property.late_date}</div>
                                  )}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.new_mr}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.process_mr}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.quote_received_mr}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {property.quote_accepted_mr}
                                </TableCell>
                                {/* <TableCell padding="none" size="small" align="center">
                            {property.oldestOpenMR !=="Not Applicable" ? (
                              <div>{property.oldestOpenMR} days</div>
                            ) : (
                              <div>{property.oldestOpenMR}</div>
                            )}
                          </TableCell> */}
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {"$" + property.listed_rent}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.property_type}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                  onClick={() => {
                                    navigate(
                                      `/managerPropertyDetails/${property.property_uid}`,
                                      {
                                        state: {
                                          property: property,
                                          property_uid: property.property_uid,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {property.num_beds + "/" + property.num_baths}
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
                <Col>
                  <img
                    src={AddIcon}
                    alt="Add Icon"
                    onClick={() => {
                      window.scrollTo(0, 0);
                      setStage("ADDREQUEST");
                    }}
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
                            {console.log(request)}
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
                              {request.assigned_business !== null &&
                              request.assigned_business !== "null" ? (
                                request.assigned_business_info[0].business_name
                              ) : (
                                <div>
                                  {request.quotes_received}/
                                  {request.total_quotes}
                                </div>
                              )}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {request.new_quotes.length > 0
                                ? `Quotes REQUESTED : ${request.quotes.length}`
                                : ""}
                              <br></br>
                              {request.sent_quotes.length > 0
                                ? `Quotes SENT: ${request.sent_quotes.length} `
                                : request.accepted_quotes.length > 0
                                ? `QUOTE ACCEPTED`
                                : request.schedule_quotes.length > 0
                                ? `QUOTE ACCEPTED`
                                : request.reschedule_quotes.length > 0
                                ? `QUOTE ACCEPTED`
                                : request.scheduled_quotes.length > 0
                                ? `QUOTE AGREED`
                                : request.paid_quotes.length > 0
                                ? `QUOTE PAID`
                                : "NO QUOTES REQUESTED"}
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
                            <TableCell>$ {request.total_estimate}</TableCell>
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
            <div hidden={responsive.showSidebar} className="w-100 mt-3">
              <ManagerFooter />
            </div>
          </div>
        </div>
      ) : !isLoading && processingManagerData.length === 0 ? (
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
          <div className="w-100 mb-5 overflow-scroll">
            <Header title="Manager Dashboard" />
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

            <div hidden={responsive.showSidebar} className="w-100 mt-3">
              <ManagerFooter />
            </div>
          </div>
        </div>
      ) : !isLoading && processingManagerData.length === 0 ? (
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
          <div className="w-100 mb-5 overflow-scroll">
            <Header title="Manager Dashboard" />
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

            <div hidden={responsive.showSidebar} className="w-100 mt-3">
              <ManagerFooter />
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
            <ManagerFooter />
          </div>
        </div>
      )}
    </div>
  ) : stage === "ADDEXPENSE" ? (
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
        <div className="w-100 mb-5 overflow-scroll">
          <Header
            title="Add Expense"
            leftText="< Back"
            leftFn={() => setStage("LIST")}
          />
          <ManagerCreateExpense
            properties={managerData}
            cancel={() => setStage("LIST")}
            onSubmit={addProperty}
          />
        </div>
        <div hidden={responsive.showSidebar}>
          <ManagerFooter />
        </div>
      </div>
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
        <div className="w-100 mb-5 overflow-scroll">
          <Header
            title="Add Repair Request"
            leftText="< Back"
            leftFn={() => setStage("LIST")}
          />
          <ManagerRepairRequest
            properties={managerData}
            cancel={() => setStage("LIST")}
            onSubmit={addProperty}
          />
        </div>
        <div hidden={responsive.showSidebar}>
          <ManagerFooter />
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
