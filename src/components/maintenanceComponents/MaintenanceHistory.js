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
import MaintenanceFooter from "./MaintenanceFooter";
import RepairImg from "../../icons/RepairImg.svg";
import AddIcon from "../../icons/AddIcon.svg";
import { get } from "../../utils/api";
import { days } from "../../utils/helper";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

function MaintenanceHistory(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [stage, setStage] = useState("LIST");
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("request_status");
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
  const sort_quotes = (quotes) => {
    quotes.sort(
      (a, b) => b.priority_n - a.priority_n || b.days_since - a.days_since
    );
    return quotes;
  };

  const fetchMaintenanceDashboard = async () => {
    let business_uid = "";
    for (const business of userData.user.businesses) {
      if (business.business_type === "MAINTENANCE") {
        business_uid = business.business_uid;

        break;
      }
    }
    if (business_uid === "") {
    }
    const response = await get(`/businesses?business_uid=${business_uid}`);

    const quotes_response = await get(
      `/maintenanceQuotes?quote_business_uid=${business_uid}`
    );

    const quotes_unsorted = quotes_response.result;
    quotes_unsorted.forEach((quote, i) => {
      const quote_created_date = new Date(Date.parse(quote.quote_created_date));
      const current_date = new Date();
      quotes_unsorted[i].days_since = Math.ceil(
        (current_date.getTime() - quote_created_date.getTime()) /
          (1000 * 3600 * 24)
      );

      quote.priority_n = 0;
      if (quote.priority.toLowerCase() === "high") {
        quote.priority_n = 3;
      } else if (quote.priority.toLowerCase() === "medium") {
        quote.priority_n = 2;
      } else if (quote.priority.toLowerCase() === "low") {
        quote.priority_n = 1;
      }
    });
    let sorted_quotes = sort_quotes(quotes_unsorted);
    setQuotes(sort_quotes(quotes_unsorted));

    setIsLoading(false);
  };

  useEffect(fetchMaintenanceDashboard, []);

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

  return (
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
        <div className="w-100 mb-5 overflow-scroll">
          <Header title="Maintenance and Repairs" />
          <Row className="m-3">
            <Col>
              <h3>Maintenance and Repairs</h3>
            </Col>
          </Row>

          {isLoading ? (
            <div className="d-flex justify-content-center mb-4 mx-2 mb-2 p-3">
              <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                <ReactBootStrap.Spinner animation="border" role="status" />
              </div>
            </div>
          ) : quotes.length > 0 ? (
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
                    {stableSort(quotes, getComparator(order, orderBy)).map(
                      (repair, j) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={j}
                          onClick={() =>
                            navigate("../maintenanceRequestView", {
                              state: {
                                quote_id: repair.maintenance_quote_uid,
                              },
                            })
                          }
                        >
                          <TableCell padding="none" size="small" align="center">
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
                            padding="none"
                            size="small"
                            align="center"
                            style={{
                              color:
                                repair.request_status === "New"
                                  ? "green"
                                  : "black",
                            }}
                          >
                            {repair.request_status}
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
                            {days(
                              new Date(
                                repair.request_created_date.split(" ")[0]
                              ),
                              new Date()
                            )}{" "}
                            days
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {repair.quote_status}
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
        </div>
      </div>
      <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
        <MaintenanceFooter />
      </div>
    </div>
  );
}

export default MaintenanceHistory;
