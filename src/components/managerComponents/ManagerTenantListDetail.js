import React, { useState, useContext, useEffect } from "react";

import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableSortLabel,
  Box,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import SideBar from "./SideBar";
import Header from "../Header";
import ManagerFooter from "./ManagerFooter";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import RepairImg from "../../icons/RepairImg.svg";
import {
  mediumBold,
  subText,
  smallImg,
  hidden,
  redPill,
  greenPill,
} from "../../utils/styles";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 16px 6px 16px", // <-- arbitrary value
    },
  },
});

function ManagerTenantListDetail(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  // sorting variables
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [showDL, setShowDL] = useState(true);
  const [showSSN, setShowSSN] = useState(true);
  const selectedTenant = location.state.selectedTenant;
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
  function ordinal_suffix_of(i) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }
  const paymentsByMonth = {};
  for (const payment of selectedTenant.user_payments) {
    const month = moment(payment.payment_date).format("MMMM YYYY");
    if (month in paymentsByMonth) {
      paymentsByMonth[month].total += payment.amount;
      paymentsByMonth[month].payments.push(payment);
    } else {
      paymentsByMonth[month] = {
        total: payment.amount,
        payments: [payment],
      };
    }
  }
  const sortedMonths = Object.keys(paymentsByMonth).sort((a, b) => {
    const aDate = moment(a);
    const bDate = moment(b);
    if (aDate < bDate) return 1;
    else if (aDate > bDate) return -1;
    else return 0;
  });
  for (const month of sortedMonths) {
    paymentsByMonth[month].payments = paymentsByMonth[month].payments.sort(
      (a, b) => {
        const aDate = moment(a.payment_date);
        const bDate = moment(b.payment_date);
        if (aDate < bDate) return 1;
        else if (aDate > bDate) return -1;
        else return 0;
      }
    );
  }
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

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
      id: "days_open",
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
    rowCount: PropTypes.number.isRequired,
  };
  console.log(selectedTenant);

  function MaskCharacter(str, mask, n = 1) {
    return ("" + str).slice(0, -n).replace(/./g, mask) + ("" + str).slice(-n);
  }

  return (
    <div>
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
            title="Tenant Details"
            leftText="< Back"
            leftFn={() => navigate(-1)}
          />
          <div
            className="mx-2 my-2 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <Row className="p-1">
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0" style={mediumBold}>
                    {selectedTenant.tenant_first_name}{" "}
                    {selectedTenant.tenant_last_name}
                  </h5>
                </div>
              </Col>
            </Row>
            <Row className="px-1 mb-1">
              <Col
                style={{
                  color: "#777777",
                  font: "normal normal normal 14px Bahnschrift-Regular",
                }}
              >
                {selectedTenant.address}
                {selectedTenant.unit !== ""
                  ? " " + selectedTenant.unit
                  : ""}, <br />
                {selectedTenant.city}, {selectedTenant.state}{" "}
                {selectedTenant.zip}
              </Col>

              <Col>
                <div className="d-flex  justify-content-end ">
                  <div
                    style={selectedTenant.tenant_id ? {} : hidden}
                    onClick={stopPropagation}
                  >
                    <a href={`tel:${selectedTenant.tenant_phone_number}`}>
                      <img src={Phone} alt="Phone" style={smallImg} />
                    </a>
                    <a href={`mailto:${selectedTenant.tenant_email}`}>
                      <img src={Message} alt="Message" style={smallImg} />
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
            <Row
              className="d-flex justify-content-center my-2"
              style={mediumBold}
            >
              Personal Info
            </Row>

            <Container
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                boxShadow: "0px 3px 6px #00000029",
                border: "0.5px solid #707070",
                borderRadius: "5px",
                maxHeight: "500px",
                overflow: "scroll",
              }}
            >
              <div
                className="my-3 p-2"
                style={{
                  boxShadow: " 0px 1px 6px #00000029",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                <Row className="mx-2">
                  Current Job Details
                  <Row className="mx-2">
                    <Col style={subText}>Job Company</Col>
                    <Col style={subText}>
                      {selectedTenant.tenant_current_job_company}
                    </Col>
                  </Row>
                  <Row className="mx-2">
                    <Col style={subText}>Job Title</Col>
                    <Col style={subText}>
                      {selectedTenant.tenant_current_job_title}
                    </Col>
                  </Row>
                  <Row className="mx-2">
                    <Col style={subText}>Job Salary</Col>
                    <Col style={subText}>
                      {selectedTenant.tenant_current_salary}/{" "}
                      {selectedTenant.tenant_salary_frequency}
                    </Col>
                  </Row>
                </Row>
              </div>
              <div
                className="my-3 p-2"
                style={{
                  boxShadow: " 0px 1px 6px #00000029",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                <Row className="mx-2">
                  Personal Details
                  <Row className="mx-2">
                    <Col style={subText}>DL Number</Col>
                    <Col style={subText} onClick={() => setShowDL(!showDL)}>
                      {showDL ? (
                        <div>
                          {MaskCharacter(
                            selectedTenant.tenant_drivers_license_number,
                            "*"
                          )}
                        </div>
                      ) : (
                        <div>
                          {selectedTenant.tenant_drivers_license_number}
                        </div>
                      )}
                    </Col>
                  </Row>
                  <Row className="mx-2">
                    <Col style={subText}>SSN</Col>
                    <Col style={subText} onClick={() => setShowSSN(!showSSN)}>
                      {showSSN ? (
                        <div>
                          {MaskCharacter(selectedTenant.tenant_ssn, "*")}
                        </div>
                      ) : (
                        <div>{selectedTenant.tenant_ssn}</div>
                      )}
                      {}
                    </Col>
                  </Row>
                  <Row className="mx-2">
                    <Col style={subText}>Email</Col>
                    <Col style={subText}>{selectedTenant.tenant_email}</Col>
                  </Row>
                  <Row className="mx-2">
                    <Col style={subText}>Phone Number</Col>
                    <Col style={subText}>
                      {selectedTenant.tenant_phone_number}
                    </Col>
                  </Row>
                </Row>
              </div>
            </Container>

            <Row
              className="d-flex justify-content-center my-2"
              style={mediumBold}
            >
              Lease Details
            </Row>
            <Container
              className="my-3"
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                boxShadow: "0px 3px 6px #00000029",
                border: "0.5px solid #707070",
                borderRadius: "5px",
                maxHeight: "500px",
                overflow: "scroll",
              }}
            >
              <Row
                className="my-3 p-2 mx-1"
                style={{
                  boxShadow: " 0px 1px 6px #00000029",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                <Col className="d-flex justify-content-start flex-column">
                  <h6>Lease Start Date</h6>
                  <h6>Lease End Date</h6>
                  <h6>Rent Due</h6>
                  <h6>Late After</h6>
                  <h6>Late Fee</h6>
                  <h6>Per Day Late Fee</h6>
                </Col>
                <Col className="d-flex flex-column ">
                  <h6
                    className="d-flex justify-content-end"
                    style={{
                      font: "normal normal normal 16px Bahnschrift-Regular",
                    }}
                  >
                    {selectedTenant.lease_start}
                  </h6>

                  <h6
                    className="d-flex justify-content-end"
                    style={{
                      font: "normal normal normal 16px Bahnschrift-Regular",
                    }}
                  >
                    {selectedTenant.lease_end}
                  </h6>
                  <h6
                    className="d-flex justify-content-end"
                    style={{
                      font: "normal normal normal 16px Bahnschrift-Regular",
                    }}
                  >
                    {`${ordinal_suffix_of(selectedTenant.due_by)} of the month`}
                  </h6>
                  <h6
                    className="d-flex justify-content-end"
                    style={{
                      font: "normal normal normal 16px Bahnschrift-Regular",
                    }}
                  >
                    {selectedTenant.late_by} days
                  </h6>
                  <h6
                    className="d-flex justify-content-end"
                    style={{
                      font: "normal normal normal 16px Bahnschrift-Regular",
                    }}
                  >
                    ${selectedTenant.late_fee}
                  </h6>
                  <h6
                    className="d-flex justify-content-end"
                    style={{
                      font: "normal normal normal 16px Bahnschrift-Regular",
                    }}
                  >
                    ${selectedTenant.perDay_late_fee}
                  </h6>
                </Col>
              </Row>
              <Row
                className="my-3 p-2 mx-1"
                style={{
                  boxShadow: " 0px 1px 6px #00000029",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                <h6 style={mediumBold}>Rent Payments</h6>
                {JSON.parse(selectedTenant.rent_payments).map((fee, i) => (
                  <Row key={i}>
                    <Col className="d-flex justify-content-start">
                      <h6 className="mb-1">{fee.fee_name}</h6>
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <h6
                        style={{
                          font: "normal normal normal 16px Bahnschrift-Regular",
                        }}
                        className="mb-1"
                      >
                        {fee.fee_type === "%"
                          ? `${fee.charge}% of ${fee.of}`
                          : `$${fee.charge}`}{" "}
                        {fee.frequency}
                      </h6>
                    </Col>
                  </Row>
                ))}
              </Row>
            </Container>

            <Row
              className="d-flex justify-content-center my-2"
              style={mediumBold}
            >
              Payment History
            </Row>
            {selectedTenant.user_payments.length > 0 ? (
              <Container
                style={{
                  background: "#FFFFFF 0% 0% no-repeat padding-box",
                  boxShadow: "0px 3px 6px #00000029",
                  border: "0.5px solid #707070",
                  borderRadius: "5px",
                  maxHeight: "500px",
                  overflow: "scroll",
                }}
              >
                {selectedTenant.user_payments.map((payment) => (
                  <div
                    className="my-3 p-2"
                    style={{
                      boxShadow: " 0px 1px 6px #00000029",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <Row className="mx-2">
                      <Col style={subText}>
                        {moment(payment.payment_date).format("MMM D, YYYY")}
                      </Col>
                    </Row>
                    <Row style={mediumBold} className="d-flex mx-2">
                      <Col>
                        {payment.description}{" "}
                        {payment.purchase_notes &&
                          `(${payment.purchase_notes})`}
                      </Col>
                      <Col
                        xs={2}
                        style={{
                          fontWeight: "600",
                          font: "normal normal normal 20px/28px Bahnschrift-Regular",
                          color: "#007Aff",
                        }}
                        className="d-flex justify-content-end"
                      >
                        {formatter.format(payment.amount)}
                      </Col>
                      <Col xs={3} className="d-flex justify-content-center">
                        {payment.payment_date > payment.next_payment ? (
                          <div style={redPill}>Late</div>
                        ) : (
                          <div style={greenPill}>On-time</div>
                        )}
                        {console.log(
                          payment.payment_date > payment.next_payment
                        )}
                      </Col>
                    </Row>
                  </div>
                ))}
              </Container>
            ) : (
              <Container className="d-flex my-2">No payments made</Container>
            )}

            <Row
              className="d-flex justify-content-center my-2"
              style={mediumBold}
            >
              Repair Requests
            </Row>
            {selectedTenant.user_repairRequests.length > 0 ? (
              <Container
                style={{
                  background: "#FFFFFF 0% 0% no-repeat padding-box",
                  boxShadow: "0px 3px 6px #00000029",
                  border: "0.5px solid #707070",
                  borderRadius: "5px",
                  maxHeight: "500px",
                  overflow: "scroll",
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
                      rowCount={selectedTenant.user_repairRequests.length}
                    />{" "}
                    <TableBody>
                      {stableSort(
                        selectedTenant.user_repairRequests,
                        getComparator(order, orderBy)
                      ).map((repair, j) => (
                        <TableRow hover role="checkbox" tabIndex={-1} key={j}>
                          <TableCell padding="none" size="small" align="center">
                            {JSON.parse(repair.images).length > 0 ? (
                              <img
                                src={JSON.parse(repair.images)[0]}
                                // onClick={() => selectRepair(repair)}
                                onClick={() => {
                                  navigate(
                                    `../manager-repairs/${repair.maintenance_request_uid}`,
                                    {
                                      state: {
                                        repair: repair,
                                      },
                                    }
                                  );
                                }}
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
                            {repair.days_open} days
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {repair.quotes_to_review > 0
                              ? `${repair.quotes_to_review} new quote(s) to review`
                              : "No new quotes"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Row>
              </Container>
            ) : (
              <Container className="d-flex my-2">
                No repairs requested
              </Container>
            )}
          </div>
        </div>
      </div>
      <div hidden={responsive.showSidebar} className="w-100 mt-3">
        <ManagerFooter />
      </div>
    </div>
  );
}

export default ManagerTenantListDetail;
