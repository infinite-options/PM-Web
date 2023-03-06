import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import AppContext from "../../AppContext";
import HighPriority from "../../icons/highPriority.svg";
import MediumPriority from "../../icons/mediumPriority.svg";
import LowPriority from "../../icons/lowPriority.svg";
import RepairImg from "../../icons/RepairImg.svg";
import {
  headings,
  subHeading,
  subText,
  blue,
  hidden,
  tileImg,
} from "../../utils/styles";
import { get } from "../../utils/api";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

function MaintenanceQuotesRequested(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData } = useContext(AppContext);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // search variables
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

  const loadJobs = async () => {
    let business_uid = "";
    for (const business of userData.user.businesses) {
      if (business.business_type === "MAINTENANCE") {
        business_uid = business.business_uid;
        break;
      }
    }
    if (business_uid === "") {
      // console.log('no maintenance business found');
    }
    const response = await get(
      `/maintenanceQuotes?quote_business_uid=${business_uid}`
    );
    // console.log(response);
    setJobs(response.result);
    setIsLoading(false);
  };
  useEffect(loadJobs, []);
  const requestedQuotes = jobs.filter(
    (job) => job.quote_status === "REQUESTED"
  );
  const sentQuotes = jobs.filter((job) => job.quote_status === "SENT");
  const scheduledJobs = jobs.filter((job) => job.quote_status === "ACCEPTED");

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
      <div className="w-100 mb-5 overflow-scroll">
        <Header
          title="Requested"
          leftText="< Back"
          leftFn={() => navigate("/maintenance")}
        />
        <Row className="m-3">
          <Col>
            <h3>Quotes Requested</h3>
          </Col>
          <Col></Col>
        </Row>

        {isLoading ? (
          <div className="d-flex justify-content-center mb-4 mx-2 mb-2 p-3">
            <div className="w-100 d-flex flex-column justify-content-center align-items-center">
              <ReactBootStrap.Spinner animation="border" role="status" />
            </div>
          </div>
        ) : requestedQuotes.length > 0 ? (
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
                    requestedQuotes,
                    getComparator(order, orderBy)
                  ).map((quote, j) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={j}
                      onClick={() =>
                        navigate(
                          `/detailQuoteRequest/${quote.maintenance_quote_uid}`
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
                        {quote.days_open} days
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {quote.quotes_to_review > 0
                          ? `${quote.quotes_to_review} new quote(s) to review`
                          : "No new quotes"}
                      </TableCell>
                    </TableRow>
                  ))}
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

      {/*<Container className="pt-1 mb-4">*/}
      {/*  <Row style={headings}>*/}
      {/*    <div>Upcoming, Scheduled</div>*/}
      {/*  </Row>*/}
      {/*  {scheduledJobs.length === 0 ? 'None' : ''}*/}
      {/*  {scheduledJobs.map((quote, i) => (*/}
      {/*    <Row className="mt-2 mb-2" key={i}>*/}
      {/*      <Col style={{ padding: "5px" }}>*/}
      {/*        <div style={tileImg}>*/}
      {/*          {JSON.parse(quote.images).length > 0 ? (*/}
      {/*            <img src={JSON.parse(quote.images)[0]} alt='Quote' className='w-100 h-100'*/}
      {/*              style={{borderRadius: '4px', objectFit: 'cover'}}/>*/}
      {/*          ) : ''}*/}
      {/*        </div>*/}
      {/*      </Col>*/}
      {/*      <Col xs={8} style={{ padding: "5px" }}>*/}
      {/*        <div onClick={() => navigate(`/detailQuote/${quote.maintenance_quote_uid}`)}>*/}
      {/*          <Row style={subHeading}>*/}
      {/*            <Col>{quote.title}</Col>*/}
      {/*            <Col xs={5}>*/}
      {/*              {quote.priority === 'Low' ? <img src={LowPriority} />*/}
      {/*              : quote.priority === 'Medium' ? <img src={MediumPriority} />*/}
      {/*              : quote.priority === 'High' ? <img src={HighPriority} />*/}
      {/*              : ''}*/}
      {/*            </Col>*/}
      {/*          </Row>*/}
      {/*          <Row style={subText}>*/}
      {/*            {quote.description}*/}
      {/*            <hr/>*/}
      {/*          </Row>*/}
      {/*          <Row style={blue}>*/}
      {/*            Scheduled for*/}
      {/*            {moment(quote.scheduled_date).format(' dddd, MMM DD, YYYY')}*/}
      {/*          </Row>*/}
      {/*        </div>*/}
      {/*      </Col>*/}
      {/*    </Row>*/}
      {/*  ))}*/}
      {/*</Container>*/}
      {/*<Container className="pt-1 mb-4 pb-5">*/}
      {/*  <Row style={headings}>*/}
      {/*    <div>Quotes Sent</div>*/}
      {/*  </Row>*/}
      {/*  {sentQuotes.length === 0 ? 'None' : ''}*/}
      {/*  {sentQuotes.map((quote, i) => (*/}
      {/*    <Row className="mt-2 mb-2" key={i}>*/}
      {/*      <Col style={{ padding: "5px" }}>*/}
      {/*        <div style={tileImg}>*/}
      {/*          {JSON.parse(quote.images).length > 0 ? (*/}
      {/*            <img src={JSON.parse(quote.images)[0]} alt='Quote' className='w-100 h-100'*/}
      {/*              style={{borderRadius: '4px', objectFit: 'cover'}}/>*/}
      {/*          ) : ''}*/}
      {/*        </div>*/}
      {/*      </Col>*/}
      {/*      <Col xs={8} style={{ padding: "5px" }}>*/}
      {/*        <div onClick={() => navigate(`/quotesAccepted/${quote.maintenance_quote_uid}`)}>*/}
      {/*          <Row style={subHeading}>*/}
      {/*            <Col>{quote.title}</Col>*/}
      {/*            <Col xs={5}>*/}
      {/*              {quote.priority === 'Low' ? <img src={LowPriority} />*/}
      {/*              : quote.priority === 'Medium' ? <img src={MediumPriority} />*/}
      {/*              : quote.priority === 'High' ? <img src={HighPriority} />*/}
      {/*              : ''}*/}
      {/*            </Col>*/}
      {/*          </Row>*/}
      {/*          <Row style={subText}>*/}
      {/*            {quote.description}*/}
      {/*            <hr/>*/}
      {/*          </Row>*/}
      {/*        </div>*/}
      {/*      </Col>*/}
      {/*    </Row>*/}
      {/*  ))}*/}
      {/*</Container>*/}
      <div style={hidden}>footer space</div>
      <Footer tab={"DASHBOARD"} />
    </div>
  );
}

export default MaintenanceQuotesRequested;
