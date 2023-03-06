import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import * as ReactBootStrap from "react-bootstrap";
import { visuallyHidden } from "@mui/utils";
import Header from "../Header";
import Footer from "../Footer";
import RepairImg from "../../icons/RepairImg.svg";
import HighPriority from "../../icons/highPriority.svg";
import MediumPriority from "../../icons/mediumPriority.svg";
import LowPriority from "../../icons/lowPriority.svg";
import No_Image from "../../icons/No_Image_Available.jpeg";
import {
  headings,
  subText,
  tileImg,
  greenPill,
  orangePill,
  redPill,
  blue,
  xSmall,
} from "../../utils/styles";
import { days } from "../../utils/helper";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});
function MaintenanceQuotesScheduled(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true); // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("request_status");

  const quotes = location.state.quotes;

  const quotes_accepted = quotes.filter(
    (quote) =>
      quote.quote_status === "ACCEPTED" && quote.request_status === "PROCESSING"
  );
  const quotes_scheduled = quotes.filter(
    (quote) => quote.request_status === "SCHEDULED"
  );

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
    <div className="h-100 d-flex flex-column">
      <Header
        title="Quotes Accepted"
        leftText="< Back"
        leftFn={() => navigate("/maintenance")}
        rightText="Sort by"
      />

      <Container className="pt-1 mb-5">
        <Row className="m-3">
          <Col>
            <h3>Scheduled Jobs</h3>
          </Col>
          <Col></Col>
        </Row>

        {!quotes_scheduled ? (
          <div className="d-flex justify-content-center mb-4 mx-2 mb-2 p-3">
            <div className="w-100 d-flex flex-column justify-content-center align-items-center">
              <ReactBootStrap.Spinner animation="border" role="status" />
            </div>
          </div>
        ) : quotes_scheduled.length > 0 ? (
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
                  {stableSort(
                    quotes_scheduled,
                    getComparator(order, orderBy)
                  ).map((quote, j) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={j}
                      // onClick={() =>
                      //   navigate(`./${quote.maintenance_quote_uid}`, {
                      //     state: { quote: quote },
                      //   })
                      // }
                    >
                      <TableCell padding="none" size="small" align="center">
                        {JSON.parse(quote.images).length > 0 ? (
                          <img
                            src={JSON.parse(quote.images)[0]}
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
                            quote.request_status === "New" ? "green" : "black",
                        }}
                      >
                        {quote.request_status}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {quote.title}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {quote.description}
                      </TableCell>

                      <TableCell padding="none" size="small" align="center">
                        {quote.address}
                        {quote.unit !== "" ? " " + quote.unit : ""},{" "}
                        {quote.city}, {quote.state} <br />
                        {quote.zip}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {quote.priority === "Low" ? (
                          <img alt="low priority" src={LowPriority} />
                        ) : quote.priority === "Medium" ? (
                          <img alt="medium priority" src={MediumPriority} />
                        ) : quote.priority === "High" ? (
                          <img alt="high priority" src={HighPriority} />
                        ) : (
                          ""
                        )}
                      </TableCell>

                      <TableCell padding="none" size="small" align="center">
                        {quote.request_created_date.split(" ")[0]}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {days(
                          new Date(quote.request_created_date.split(" ")[0]),
                          new Date()
                        )}{" "}
                        days
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {quote.quote_status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Row>
          </div>
        ) : (
          <Row className="m-3">
            <div className="m-3">No quotes scheduled</div>
          </Row>
        )}
      </Container>

      <Container className="pt-1 mb-5">
        <Row className="m-3">
          <Col>
            <h3>Quotes Accepted</h3>
          </Col>
          <Col></Col>
        </Row>
        {!quotes_accepted ? (
          <div className="d-flex justify-content-center mb-4 mx-2 mb-2 p-3">
            <div className="w-100 d-flex flex-column justify-content-center align-items-center">
              <ReactBootStrap.Spinner animation="border" role="status" />
            </div>
          </div>
        ) : quotes_accepted.length > 0 ? (
          <div
            className="mx-3 my-3 p-2 mb-5"
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
                  {stableSort(
                    quotes_accepted,
                    getComparator(order, orderBy)
                  ).map((quote, j) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={j}
                      onClick={() =>
                        navigate(
                          `/maintenanceScheduleRepair/${quote.maintenance_quote_uid}`,
                          {
                            state: { quote: quote },
                          }
                        )
                      }
                    >
                      <TableCell padding="none" size="small" align="center">
                        {JSON.parse(quote.images).length > 0 ? (
                          <img
                            src={JSON.parse(quote.images)[0]}
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
                          color:
                            quote.request_status === "New" ? "green" : "black",
                        }}
                      >
                        {quote.request_status}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {quote.title}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {quote.description}
                      </TableCell>

                      <TableCell padding="none" size="small" align="center">
                        {quote.address}
                        {quote.unit !== "" ? " " + quote.unit : ""},{" "}
                        {quote.city}, {quote.state} <br />
                        {quote.zip}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {quote.priority === "Low" ? (
                          <img alt="low priority" src={LowPriority} />
                        ) : quote.priority === "Medium" ? (
                          <img alt="medium priority" src={MediumPriority} />
                        ) : quote.priority === "High" ? (
                          <img alt="high priority" src={HighPriority} />
                        ) : (
                          ""
                        )}
                      </TableCell>

                      <TableCell padding="none" size="small" align="center">
                        {quote.request_created_date.split(" ")[0]}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {days(
                          new Date(quote.request_created_date.split(" ")[0]),
                          new Date()
                        )}{" "}
                        days
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {quote.quote_status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Row>
          </div>
        ) : (
          <Row className="m-3">
            <div className="m-3">No quotes accepted</div>
          </Row>
        )}
      </Container>

      <Footer tab={"DASHBOARD"} />
    </div>
  );
}

export default MaintenanceQuotesScheduled;
