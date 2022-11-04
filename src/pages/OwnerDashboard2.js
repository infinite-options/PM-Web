import React from "react";
import { Container, Row, Col } from "react-bootstrap";
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
import SideBar from "../components/ownerComponents/SideBar";
import Header from "../components/Header";
import AppContext from "../AppContext";
import OwnerPropertyForm from "../components/ownerComponents/OwnerPropertyForm";
import OwnerCreateExpense from "../components/ownerComponents/OwnerCreateExpense";
import SortDown from "../icons/Sort-down.svg";
import SortLeft from "../icons/Sort-left.svg";
import { get } from "../utils/api";
import OwnerRepairRequest from "../components/ownerComponents/OwnerRepairRequest";

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

  const [stage, setStage] = useState("LIST");
  const [isLoading, setIsLoading] = useState(true);

  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");

  const [monthlyCashFlow, setMonthlyCashFlow] = useState(false);
  const [yearlyCashFlow, setYearlyCashFlow] = useState(false);
  const [monthlyRevenue, setMonthlyRevenue] = useState(false);
  const [monthlyExpense, setMonthlyExpense] = useState(false);
  const [yearlyRevenue, setYearlyRevenue] = useState(false);
  const [yearlyExpense, setYearlyExpense] = useState(false);

  const fetchOwnerDashboard = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }
    const response = await get("/ownerDashboard", access_token);
    console.log("second");
    console.log(response);
    // setIsLoading(false);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();

      return;
    }
    setIsLoading(false);
    setOwnerData(response.result);
    let requests = [];
    response.result.forEach((res) => {
      console.log(res);
      if (res.maintenanceRequests.length > 0) {
        res.maintenanceRequests.forEach((mr) => {
          requests.push(mr);
        });
      }
    });
    console.log(requests);
    setMaintenanceRequests(requests);
  };

  useEffect(() => {
    console.log("in use effect");
    fetchOwnerDashboard();
  }, [access_token]);
  const addProperty = () => {
    fetchOwnerDashboard();
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
      id: "listed_rent",
      numeric: true,
      label: "Rent",
    },
    {
      id: "listed_rent",
      numeric: true,
      label: " $/Sq Ft",
    },
    {
      id: "num_apps",
      numeric: false,
      label: "Paid",
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
  ];
  function EnhancedTableHeadMaintenance(props) {
    const { order, orderBy, onRequestSort } = props;
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

  EnhancedTableHeadMaintenance.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  console.log(ownerData);
  let revenueTotal = 0;

  for (const item of ownerData) {
    if (
      (item.rental_revenue !== undefined && item.rental_revenue !== 0) ||
      (item.extraCharges_revenue !== undefined &&
        item.extraCharges_revenue !== 0) ||
      (item.utiltiy_revenue !== undefined && item.utiltiy_revenue !== 0)
    ) {
      revenueTotal =
        revenueTotal +
        item.rental_revenue +
        item.extraCharges_revenue +
        item.utility_revenue;
    }
  }
  console.log(revenueTotal);
  let expenseTotal = 0;
  for (const item of ownerData) {
    if (
      (item.maintenance_expenses !== undefined && item.maintenance_expenses) ||
      (item.management_expenses !== undefined &&
        item.management_expenses !== 0) ||
      (item.insurance_expenses !== undefined &&
        item.insurance_expenses !== 0) ||
      (item.repairs_expenses !== undefined && item.repairs_expenses !== 0) ||
      (item.mortgage_expenses !== undefined && item.mortgage_expenses !== 0) ||
      (item.taxes_expenses !== undefined && item.taxes_expenses !== 0) ||
      (item.utility_expenses !== 0 && item.utility_expenses !== undefined)
    ) {
      expenseTotal =
        expenseTotal +
        item.maintenance_expenses +
        item.management_expenses +
        item.repairs_expenses +
        item.utility_expenses;
    }
  }

  console.log(expenseTotal, revenueTotal);
  // let yearExpenseTotal = 0;
  // for (const item of ownerData) {
  //   console.log(item);
  //   if (item.year_expense !== 0) {
  //     console.log(item.year_expense);
  //     yearExpenseTotal += item.year_expense;
  //   }
  // }

  // let yearRevenueTotal = 0;
  // for (const item of ownerData) {
  //   if (item.year_revenue !== 0) {
  //     console.log(item.year_revenue);
  //     yearRevenueTotal += item.year_revenue;
  //   }
  // }

  let revenueExpectedTotal = 0;

  for (const item of ownerData) {
    if (
      (item.rental_expected_revenue !== undefined &&
        item.rental_expected_revenue !== 0) ||
      (item.extraCharges_expected_revenue !== undefined &&
        item.extraCharges_expected_revenue !== 0) ||
      (item.utility_expected_revenue !== undefined &&
        item.utility_expected_revenue !== 0)
    ) {
      revenueExpectedTotal =
        revenueExpectedTotal +
        item.rental_expected_revenue +
        item.extraCharges_expected_revenue +
        item.utility_expected_revenue;
    }
  }
  console.log(revenueExpectedTotal);
  let expenseExpectedTotal = 0;
  for (const item of ownerData) {
    if (
      (item.maintenance_expected_expenses !== undefined &&
        item.maintenance_expected_expenses) ||
      (item.management_expected_expenses !== undefined &&
        item.management_expected_expenses !== 0) ||
      (item.repairs_expected_expenses !== undefined &&
        item.repairs_expected_expenses !== 0) ||
      (item.utility_expected_expenses !== 0 &&
        item.utility_expected_expenses !== undefined)
    ) {
      expenseExpectedTotal =
        expenseExpectedTotal +
        item.maintenance_expected_expenses +
        item.management_expected_expenses +
        item.repairs_expected_expenses +
        item.utility_expected_expenses;
    }
  }
  console.log(revenueExpectedTotal, expenseExpectedTotal);

  const cashFlow = (revenueTotal - expenseTotal).toFixed(2);
  const cashFlowExpected = (
    revenueExpectedTotal - expenseExpectedTotal
  ).toFixed(2);
  return stage === "LIST" ? (
    <div className="OwnerDashboard2">
      <Header title="Owner Dashboard" />
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        {ownerData.length > 1 ? (
          <div className="w-100">
            <Row>
              <Col>
                <h1>Cash Flow Summary</h1>
              </Col>
              <Col onClick={() => setStage("ADDEXPENSE")}>
                <h1 style={{ float: "right", marginRight: "5rem" }}>+</h1>
              </Col>
            </Row>
            <Row className="m-3">
              <Table classes={{ root: classes.customTable }} size="small">
                <TableHead>
                  <TableCell></TableCell>
                  <TableCell>To Date</TableCell>
                  <TableCell>Expected</TableCell>
                  <TableCell>Delta</TableCell>
                  <TableCell>To Date Amortized</TableCell>
                  <TableCell>Expected Amortized</TableCell>
                  <TableCell>Delta Amortized</TableCell>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell size="large">
                      {new Date().toLocaleString("default", { month: "long" })}{" "}
                      &nbsp;
                      <img
                        src={SortDown}
                        hidden={monthlyCashFlow}
                        onClick={() => setMonthlyCashFlow(!monthlyCashFlow)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyCashFlow}
                        onClick={() => setMonthlyCashFlow(!monthlyCashFlow)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell>${cashFlow}</TableCell>
                    <TableCell>${cashFlowExpected}</TableCell>
                    <TableCell>${cashFlow - cashFlowExpected}</TableCell>
                    <TableCell>To Date Amortized</TableCell>
                    <TableCell>Expected Amortized</TableCell>
                    <TableCell>Delta Amortized</TableCell>
                  </TableRow>
                  <TableRow hidden={!monthlyCashFlow}>
                    <TableCell size="medium">
                      &nbsp; Revenue{" "}
                      <img
                        src={SortDown}
                        hidden={monthlyRevenue}
                        onClick={() => setMonthlyRevenue(!monthlyRevenue)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyRevenue}
                        onClick={() => setMonthlyRevenue(!monthlyRevenue)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell>${revenueTotal}</TableCell>
                    <TableCell>${revenueExpectedTotal}</TableCell>
                    <TableCell>
                      ${revenueTotal - revenueExpectedTotal}
                    </TableCell>
                    <TableCell>To Date Amortized</TableCell>
                    <TableCell>Expected Amortized</TableCell>
                    <TableCell>Delta Amortized</TableCell>
                  </TableRow>
                  <TableRow hidden={!monthlyCashFlow}>
                    <TableCell size="medium">
                      &nbsp; Expenses{" "}
                      <img
                        src={SortDown}
                        hidden={monthlyExpense}
                        onClick={() => setMonthlyExpense(!monthlyExpense)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        hidden={!monthlyExpense}
                        onClick={() => setMonthlyExpense(!monthlyExpense)}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell>${expenseTotal}</TableCell>
                    <TableCell>${expenseExpectedTotal}</TableCell>
                    <TableCell>
                      ${expenseTotal - expenseExpectedTotal}
                    </TableCell>
                    <TableCell>To Date Amortized</TableCell>
                    <TableCell>Expected Amortized</TableCell>
                    <TableCell>Delta Amortized</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell size="medium">
                      {new Date().getFullYear()} &nbsp;
                      <img
                        src={SortDown}
                        onClick={() => setYearlyCashFlow(!yearlyCashFlow)}
                        hidden={yearlyCashFlow}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                      <img
                        src={SortLeft}
                        onClick={() => setYearlyCashFlow(!yearlyCashFlow)}
                        hidden={!yearlyCashFlow}
                        style={{
                          width: "10px",
                          height: "10px",
                          float: "right",
                        }}
                      />
                    </TableCell>
                    <TableCell>To Date</TableCell>
                    <TableCell>Expected</TableCell>
                    <TableCell>Delta</TableCell>
                    <TableCell>To Date Amortized</TableCell>
                    <TableCell>Expected Amortized</TableCell>
                    <TableCell>Delta Amortized</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Row>
            <Row>
              <Col>
                <h1>Properties</h1>
              </Col>
              <Col onClick={() => setStage("NEW")}>
                <h1 style={{ float: "right", marginRight: "5rem" }}>+</h1>
              </Col>
            </Row>

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
                        val.rent_status.toLowerCase().indexOf(query) >= 0 ||
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
                          key={property.address}
                        >
                          <TableCell padding="none" size="small" align="center">
                            {JSON.parse(property.images).length > 0 ? (
                              <img
                                src={JSON.parse(property.images)[0]}
                                onClick={() => {
                                  navigate(
                                    `/propertyDetails/${property.property_uid}`,
                                    {
                                      state: {
                                        // property: property,
                                        property_uid: property.property_uid,
                                      },
                                    }
                                  );
                                }}
                                alt="Property"
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
                          <TableCell padding="none" size="small" align="center">
                            {property.address}
                            {property.unit !== "" ? " " + property.unit : ""}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.city}, {property.state}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.zip}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.rentalInfo.length !== 0
                              ? property.rentalInfo[0].tenant_first_name
                              : "None"}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {"$" + property.listed_rent}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            $
                            {(
                              parseInt(property.listed_rent) /
                              parseInt(property.area)
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.owner_expected_revenue.length !== 0
                              ? property.owner_expected_revenue[0]
                                  .purchase_status
                              : "None"}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.property_type}
                          </TableCell>

                          <TableCell padding="none" size="small" align="center">
                            {property.num_beds + "/" + property.num_baths}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.property_manager.length !== 0
                              ? property.property_manager[0]
                                  .manager_business_name
                              : "None"}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {property.owner_expected_revenue.length !== 0
                              ? property.owner_expected_revenue[0].lease_end
                              : "None"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Row>
            <Row>
              <Col>
                <h1>Maintenance and Repairs</h1>
              </Col>
              <Col onClick={() => setStage("ADDREQUEST")}>
                <h1 style={{ float: "right", marginRight: "5rem" }}>+</h1>
              </Col>
            </Row>

            <Row className="m-3">
              <Table classes={{ root: classes.customTable }} size="small">
                <EnhancedTableHeadMaintenance
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={maintenanceRequests.length}
                />{" "}
                <TableBody>
                  {stableSort(
                    maintenanceRequests,
                    getComparator(order, orderBy)
                  )
                    // for filtering
                    .filter((val) => {
                      const query = search.toLowerCase();

                      return (
                        val.address.toLowerCase().indexOf(query) >= 0 ||
                        val.city.toLowerCase().indexOf(query) >= 0 ||
                        val.zip.toLowerCase().indexOf(query) >= 0 ||
                        val.priority.toLowerCase().indexOf(query) >= 0
                      );
                    })
                    .map((request, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={request.address}
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
                          <TableCell padding="none" size="small" align="center">
                            {JSON.parse(request.images).length > 0 ? (
                              <img
                                src={JSON.parse(request.images)[0]}
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
                                alt="Property"
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
                          <TableCell padding="none" size="small" align="center">
                            {request.address}
                            {request.unit !== "" ? " " + request.unit : ""}
                            {request.city}, {request.state} {request.zip}
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
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Row>
          </div>
        ) : (
          <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            <ReactBootStrap.Spinner animation="border" role="status" />
          </div>
        )}
      </div>
    </div>
  ) : stage === "NEW" ? (
    <div className="OwnerDashboard2">
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div className="w-100">
          <Header
            title="Add a new Property"
            leftText="< Back"
            leftFn={() => setStage("LIST")}
          />
          <OwnerPropertyForm
            edit
            cancel={() => setStage("LIST")}
            onSubmit={addProperty}
          />
        </div>
      </div>
    </div>
  ) : stage === "ADDEXPENSE" ? (
    <div className="OwnerDashboard2">
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div className="w-100">
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
        </div>
      </div>
    </div>
  ) : stage === "ADDREQUEST" ? (
    <div className="OwnerDashboard2">
      <Header
        title="Add Repair Request"
        // leftText="< Back"
        // leftFn={() => setStage("LIST")}
      />
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div className="w-100">
          <OwnerRepairRequest
            properties={ownerData}
            cancel={() => setStage("LIST")}
            onSubmit={addProperty}
          />
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
