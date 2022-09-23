import React, { useState, useContext, useEffect } from "react";
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
import { Row, Col } from "react-bootstrap";
import AppContext from "../AppContext";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import SideBar from "../components/managerComponents/SideBar";
import { get } from "../utils/api";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;

  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");

  const fetchTenantDashboard = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }
    const response = await get("/managerDashboard", access_token);
    console.log("second");
    console.log(response);
    setIsLoading(false);

    if (response.msg === "Token has expired") {
      console.log("here msg");
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

      property.new_tenant_applications = property.applications.filter(
        (a) => a.application_status === "NEW"
      );

      property.end_early_applications = property.applications.filter(
        (a) => a.application_status === "TENANT END EARLY"
      );
    });

    console.log(properties_unique);
    setProperties(properties_unique);
  };
  useEffect(() => {
    console.log("in use effect");
    fetchTenantDashboard();
  }, []);

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
      id: "listed_rent",
      numeric: true,
      label: "Rent",
    },
    {
      id: "tenant",
      numeric: false,
      label: "Tenant",
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
      id: "num_maintenanceRequests",
      numeric: true,
      label: "Maintenance Requests Open",
    },
    {
      id: "oldestOpenMR",
      numeric: true,
      label: "Longest duration",
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
              align={headCell.numeric ? "right" : "left"}
              padding={"normal"}
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
            <Table>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={properties.length}
              />{" "}
              <TableBody>
                {stableSort(properties, getComparator(order, orderBy))
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
                        <TableCell>
                          {JSON.parse(property.images).length > 0 ? (
                            <img
                              src={JSON.parse(property.images)[0]}
                              onClick={() => {
                                navigate(
                                  `/manager-properties/${property.property_uid}`,
                                  {
                                    state: {
                                      property: property,
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
                        <TableCell>
                          {property.address}
                          {property.unit !== "" ? " " + property.unit : ""}
                        </TableCell>
                        <TableCell>
                          {property.city}, {property.state}
                        </TableCell>
                        <TableCell>{property.zip}</TableCell>
                        <TableCell>{property.listed_rent}</TableCell>
                        <TableCell>
                          {property.rentalInfo !== "NOT RENTED" ? (
                            property.rentalInfo.map((tf, i) => {
                              return (
                                <div>
                                  {i + 1} {tf.tenant_first_name}{" "}
                                  {tf.tenant_last_name}
                                </div>
                              );
                            })
                          ) : (
                            <div>{property.rentalInfo}</div>
                          )}
                        </TableCell>
                        <TableCell>{property.rent_status}</TableCell>

                        <TableCell>
                          {property.late_date != "Not Applicable" ? (
                            <div>{property.late_date} days</div>
                          ) : (
                            <div>{property.late_date}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {property.num_maintenanceRequests}
                        </TableCell>
                        <TableCell>
                          {property.oldestOpenMR != "Not Applicable" ? (
                            <div>{property.oldestOpenMR} days</div>
                          ) : (
                            <div>{property.oldestOpenMR}</div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Row>
        </div>
      </div>
    </div>
  );
}
