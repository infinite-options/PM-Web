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
import SideBar from "../components/managerComponents/SideBar";
import { get } from "../utils/api";
import "./tenantDash.css";
import { Row, Col } from "react-bootstrap";
import { subHeading } from "../utils/styles";
import AppContext from "../AppContext";
import PropTypes from "prop-types";

import { visuallyHidden } from "@mui/utils";
import { SortableHeader } from "./SortableHeader";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;

  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [sorting, setSorting] = useState({ field: "name", ascending: false });

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
        // properties_unique[properties_unique.length-1].tenants.push(property)
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

  const days = (date_1, date_2) => {
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  };
  function applySorting(key, ascending) {
    setSorting({ key: key, ascending: ascending });
  }
  useEffect(() => {
    const propertiesCopy = [...properties];

    const sortedproperties = propertiesCopy.sort((a, b) => {
      return a[sorting.key].localeCompare(b[sorting.key]);
    });

    setProperties(
      sorting.ascending ? sortedproperties : sortedproperties.reverse()
    );
  }, [sorting]);

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

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
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
      disablePadding: true,
      label: "Property Images",
    },
    {
      id: "address",
      numeric: false,
      disablePadding: false,
      label: "Street Address",
    },
    {
      id: "city",
      numeric: false,
      disablePadding: false,
      label: "City,State",
    },
    {
      id: "zip",
      numeric: true,
      disablePadding: false,
      label: "Zip",
    },
    {
      id: "rent_status",
      numeric: false,
      disablePadding: false,
      label: "Rent Status",
    },
    {
      id: "late_date",
      numeric: true,
      disablePadding: false,
      label: "Days Late",
    },
    {
      id: "num_maintenanceRequests",
      numeric: true,
      disablePadding: false,
      label: "Maintenance Requests Open",
    },
    {
      id: "oldestOpenMR",
      numeric: true,
      disablePadding: false,
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
      {/* {propertyData.length !== 0 && (
        <div>
          <h3 style={{ paddingLeft: "7rem", paddingTop: "2rem" }}>
            {propertyData.result[0].tenant_first_name}
          </h3>
          <h8 style={{ paddingLeft: "7rem", paddingTop: "2rem" }}>Manager</h8>
        </div>
      )} */}

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
          {/* <Row className="w-100 m-3">
            <table style={subHeading} class="table-hover">
              <thead>
                <tr>
                  <th>Property Images</th>
                  <th
                    onClick={() => applySorting("address", !sorting.ascending)}
                  >
                    Street Address
                  </th>
                  <th onClick={() => applySorting("city", !sorting.ascending)}>
                    City,State
                  </th>
                  <th onClick={() => applySorting("zip", !sorting.ascending)}>
                    Zip
                  </th>
                  <th
                    onClick={() =>
                      applySorting("rent_status", !sorting.ascending)
                    }
                  >
                    Rent Status
                  </th>
                  <th
                    onClick={() =>
                      applySorting("late_date", !sorting.ascending)
                    }
                  >
                    Days Late
                  </th>
                  <th
                    onClick={() =>
                      applySorting(
                        "num_maintenanceRequests",
                        !sorting.ascending
                      )
                    }
                  >
                    Maintenance Requests Open
                  </th>
                  <th
                    onClick={() =>
                      applySorting("oldestOpenMR", !sorting.ascending)
                    }
                  >
                    Longest duration
                  </th>
                </tr>
              </thead>

              <tbody>
                {properties

                  .filter((val) => {
                    const query = search.toLowerCase();

                    return (
                      val.address.toLowerCase().indexOf(query) >= 0 ||
                      val.city.toLowerCase().indexOf(query) >= 0 ||
                      val.zip.toLowerCase().indexOf(query) >= 0 ||
                      val.rent_status.toLowerCase().indexOf(query) >= 0 ||
                      val.oldestOpenMR.toLowerCase().indexOf(query) >= 0 ||
                      val.late_date.toLowerCase().indexOf(query) >= 0
                    );
                  })
                  .map((property, i) => (
                    <tr>
                      <td>
                        {JSON.parse(property.images).length > 0 ? (
                          <img
                            src={JSON.parse(property.images)[0]}
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
                      </td>
                      <td>
                        {property.address}
                        {property.unit !== "" ? " " + property.unit : ""}
                        <br />
                      </td>
                      <td>
                        {property.city}, {property.state}
                      </td>
                      <td> {property.zip}</td>
                      <td>{property.rent_status}</td>
                      <td>{property.late_date}</td>
                      <td>{property.num_maintenanceRequests}</td>
                      <td>{property.oldestOpenMR}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Row> */}
          <Row className="m-3">
            <Table>
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={properties.length}
              />{" "}
              <TableBody>
                {stableSort(properties, getComparator(order, orderBy))
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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
