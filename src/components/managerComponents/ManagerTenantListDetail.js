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
import AppContext from "../../AppContext";
import MailDialogTenant from "../MailDialog";
import MessageDialogTenant from "../MessageDialog";
import ManagerFooter from "./ManagerFooter";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import Mail from "../../icons/Mail.svg";
import RepairImg from "../../icons/RepairImg.svg";
import { put } from "../../utils/api";
import {
  mediumBold,
  subText,
  smallImg,
  hidden,
  redPill,
  greenPill,
  headings,
  sidebarStyle,
} from "../../utils/styles";
import { ordinal_suffix_of, MaskCharacter } from "../../utils/helper";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 16px 6px 16px", // <-- arbitrary value
    },
  },
  customTableDetail: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});

function ManagerTenantListDetail(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const { userData, ably } = useContext(AppContext);
  const { access_token, user } = userData;
  // sorting variables
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [showDL, setShowDL] = useState(true);
  const [showSSN, setShowSSN] = useState(true);
  const selectedTenant = location.state.selectedTenant;

  const [managementBusiness, setManagementBusiness] = useState("");
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showMailForm, setShowMailForm] = useState(false);
  const onCancelMail = () => {
    setShowMailForm(false);
  };
  const onCancelMessage = () => {
    setShowMessageForm(false);
  };
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
  useEffect(() => {
    let business_uid = "";
    for (const business of userData.user.businesses) {
      if (business.business_type === "MANAGEMENT") {
        business_uid = business.business_uid;
        setManagementBusiness(business);
        break;
      }
    }
    if (business_uid === "") {
    }
  }, []);

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
  // console.log(selectedTenant);

  return (
    <div className="w-100 overflow-hidden">
      <MailDialogTenant
        title={"Email"}
        isOpen={showMailForm}
        senderPhone={managementBusiness.business_phone_number}
        senderEmail={managementBusiness.business_email}
        senderName={managementBusiness.business_name}
        requestCreatedBy={managementBusiness.business_uid}
        userMessaged={selectedTenant.tenant_id}
        receiverEmail={selectedTenant.tenant_email}
        receiverPhone={selectedTenant.tenant_phone_number}
        onCancel={onCancelMail}
      />

      <MessageDialogTenant
        title={"Text Message"}
        isOpen={showMessageForm}
        senderPhone={managementBusiness.business_phone_number}
        senderEmail={managementBusiness.business_email}
        senderName={managementBusiness.business_name}
        requestCreatedBy={managementBusiness.business_uid}
        userMessaged={selectedTenant.tenant_id}
        receiverEmail={selectedTenant.tenant_email}
        receiverPhone={selectedTenant.tenant_phone_number}
        onCancel={onCancelMessage}
      />
      <Row className="w-100 mb-5 overflow-hidden">
        {" "}
        <Col xs={2} hidden={!responsive.showSidebar} style={sidebarStyle}>
          <SideBar />
        </Col>
        <Col className="w-100 mb-5 overflow-scroll">
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
            <Row
              className="d-flex justify-content-center my-2"
              style={mediumBold}
            >
              Personal Info
            </Row>

            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="mb-4 m-3">
                <h5 style={mediumBold}>Personal Details</h5>

                <Table
                  classes={{ root: classes.customTableDetail }}
                  size="small"
                  responsive="md"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell> First Name</TableCell>
                      <TableCell> Last Name</TableCell>
                      <TableCell> Address</TableCell>
                      <TableCell> Phone Number</TableCell>
                      <TableCell> Email</TableCell>
                      <TableCell> Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {" "}
                        {selectedTenant.tenant_first_name &&
                        selectedTenant.tenant_first_name !== "NULL"
                          ? selectedTenant.tenant_first_name
                          : "No First Name Provided"}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {selectedTenant.tenant_last_name &&
                        selectedTenant.tenant_last_name !== "NULL"
                          ? selectedTenant.tenant_last_name
                          : "No Last Name Provided"}
                      </TableCell>
                      <TableCell>
                        {selectedTenant.address}
                        {selectedTenant.unit !== ""
                          ? " " + selectedTenant.unit
                          : ""}
                        , <br />
                        {selectedTenant.city}, {selectedTenant.state}{" "}
                        {selectedTenant.zip}
                      </TableCell>
                      <TableCell>
                        {selectedTenant.tenant_phone_number &&
                        selectedTenant.tenant_phone_number !== "NULL"
                          ? selectedTenant.tenant_phone_number
                          : "No Phone Number Provided"}
                      </TableCell>
                      <TableCell>
                        {selectedTenant.tenant_email &&
                        selectedTenant.tenant_email !== "NULL"
                          ? selectedTenant.tenant_email
                          : "No Email Provided"}
                      </TableCell>
                      <TableCell>
                        <div className="d-flex  justify-content-end ">
                          <div
                            style={selectedTenant.tenant_id ? {} : hidden}
                            onClick={stopPropagation}
                          >
                            <a
                              href={`tel:${selectedTenant.tenant_phone_number}`}
                            >
                              <img src={Phone} alt="Phone" style={smallImg} />
                            </a>
                            <a
                              onClick={() => {
                                setShowMessageForm(true);
                                // setSelectedTenant(tf);
                              }}
                            >
                              <img
                                src={Message}
                                alt="Message"
                                style={smallImg}
                              />
                            </a>
                            <a
                              onClick={() => {
                                setShowMailForm(true);
                                // setSelectedTenant(tf);
                              }}
                            >
                              <img src={Mail} alt="Mail" style={smallImg} />
                            </a>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Row>

              <Row className="mb-4 m-3">
                <h5 style={mediumBold}>Current Job Details</h5>

                <Table
                  classes={{ root: classes.customTableDetail }}
                  size="small"
                  responsive="md"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell> Current Salary</TableCell>
                      <TableCell>Salary Frequency</TableCell>
                      <TableCell> Current Job Title</TableCell>
                      <TableCell> Current Company Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {selectedTenant.tenant_current_salary &&
                        selectedTenant.tenant_current_salary !== "NULL"
                          ? selectedTenant.tenant_current_salary
                          : "No Salary Info Provided"}
                      </TableCell>
                      <TableCell>
                        {selectedTenant.tenant_salary_frequency &&
                        selectedTenant.tenant_salary_frequency !== "NULL"
                          ? selectedTenant.tenant_salary_frequency
                          : "No Salary Info Provided"}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {selectedTenant.tenant_current_job_title &&
                        selectedTenant.tenant_current_job_title !== "NULL"
                          ? selectedTenant.tenant_current_job_title
                          : "No Job Title Provided"}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {selectedTenant.tenant_current_job_company &&
                        selectedTenant.tenant_current_job_company !== "NULL"
                          ? selectedTenant.tenant_current_job_company
                          : "No Company Provided"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Row>
              <Row className="mb-4 m-3">
                <h5 style={mediumBold}>Identification Details</h5>

                <Table
                  classes={{ root: classes.customTableDetail }}
                  size="small"
                  responsive="md"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell> SSN</TableCell>
                      <TableCell> Driver's Licence Number</TableCell>
                      <TableCell> Driver's Licence State</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell onClick={() => setShowSSN(!showSSN)}>
                        {" "}
                        {showSSN ? (
                          <div>
                            {MaskCharacter(selectedTenant.tenant_ssn, "*")}
                          </div>
                        ) : (
                          <div>{selectedTenant.tenant_ssn}</div>
                        )}
                      </TableCell>
                      <TableCell onClick={() => setShowDL(!showDL)}>
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
                      </TableCell>
                      <TableCell>
                        {selectedTenant.tenant_drivers_license_state &&
                        selectedTenant.tenant_drivers_license_state !== "NULL"
                          ? selectedTenant.tenant_drivers_license_state
                          : "No DL state Provided"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Row>
            </div>

            <Row
              className="d-flex justify-content-center my-2"
              style={mediumBold}
            >
              Lease Details
            </Row>
            <div
              className="mx-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "0px 0px 10px 10px",
                opacity: 1,
              }}
            >
              <div>
                <Row className="mb-4 m-3" style={{ hidden: "overflow" }}>
                  <h5>Lease Details</h5>
                  <Table
                    responsive="md"
                    classes={{ root: classes.customTableDetail }}
                    size="small"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Lease Start</TableCell>
                        <TableCell>Lease End</TableCell>
                        <TableCell>Rent Due</TableCell>
                        <TableCell>Later Fees After (days)</TableCell>
                        <TableCell>Late Fee (one-time)</TableCell>
                        <TableCell>Late Fee (per day)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{selectedTenant.lease_start}</TableCell>

                        <TableCell>{selectedTenant.lease_end}</TableCell>

                        <TableCell>
                          {`${ordinal_suffix_of(
                            selectedTenant.due_by
                          )} of the month`}
                        </TableCell>

                        <TableCell>{selectedTenant.late_by} days</TableCell>
                        <TableCell> ${selectedTenant.late_fee}</TableCell>
                        <TableCell>
                          {" "}
                          ${selectedTenant.perDay_late_fee}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Row>

                <Row className="mb-4 m-3" style={{ overflow: "scroll" }}>
                  <h5>Lease Payments</h5>
                  <Table
                    responsive="md"
                    classes={{ root: classes.customTableDetail }}
                    size="small"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Fee Name</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Of</TableCell>
                        <TableCell>Frequency</TableCell>
                        <TableCell>Available to Pay</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Late Fees After (days)</TableCell>
                        <TableCell>
                          Late Fee <br /> (one-time)
                        </TableCell>
                        <TableCell>
                          Late Fee <br /> (per day)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {JSON.parse(selectedTenant.rent_payments).map(
                        (fee, i) => (
                          <TableRow>
                            <TableCell>{fee.fee_name}</TableCell>

                            <TableCell>
                              {fee.fee_type === "%"
                                ? `${fee.charge}%`
                                : `$${fee.charge}`}
                            </TableCell>

                            <TableCell>
                              {fee.fee_type === "%" ? `${fee.of}` : ""}
                            </TableCell>

                            <TableCell>{fee.frequency}</TableCell>
                            <TableCell>{`${fee.available_topay} days before`}</TableCell>
                            <TableCell>
                              {fee.frequency === "Weekly" ||
                              fee.frequency === "Biweekly"
                                ? fee.due_by === ""
                                  ? `1st day of the week`
                                  : `${ordinal_suffix_of(
                                      fee.due_by
                                    )} day of the week`
                                : fee.due_by === ""
                                ? `1st of the month`
                                : `${ordinal_suffix_of(
                                    fee.due_by
                                  )} of the month`}
                            </TableCell>
                            <TableCell>{fee.late_by} days</TableCell>
                            <TableCell>${fee.late_fee}</TableCell>
                            <TableCell>${fee.perDay_late_fee}/day</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </Row>

                <Row
                  className="mb-4 m-3"
                  hidden={
                    JSON.parse(selectedTenant.assigned_contacts).length === 0
                  }
                >
                  <h5 style={mediumBold}>Contact Details</h5>
                  <Table
                    classes={{ root: classes.customTableDetail }}
                    size="small"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Contact Name</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone Number</TableCell>

                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {JSON.parse(selectedTenant.assigned_contacts).map(
                        (contact, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              {contact.first_name} {contact.last_name}
                            </TableCell>
                            <TableCell>{contact.company_role}</TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>{contact.phone_number}</TableCell>
                            <TableCell>
                              <a href={`tel:${contact.phone_number}`}>
                                <img src={Phone} alt="Phone" style={smallImg} />
                              </a>
                              <a href={`mailto:${contact.email}`}>
                                <img
                                  src={Message}
                                  alt="Message"
                                  style={smallImg}
                                />
                              </a>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </Row>
              </div>
            </div>

            <Row
              className="d-flex justify-content-center my-2"
              style={mediumBold}
            >
              Payment History
            </Row>
            {selectedTenant.user_payments.length > 0 ? (
              <div
                className="mx-3 my-3 p-2"
                style={{
                  background: "#E9E9E9 0% 0% no-repeat padding-box",
                  borderRadius: "10px",
                  opacity: 1,
                }}
              >
                <Row className="m-3">
                  <Table
                    responsive="md"
                    classes={{ root: classes.customTableDetail }}
                    size="small"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell>Purchase Type</TableCell>
                        <TableCell>Split Payment</TableCell>
                        <TableCell>Payment Type</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Payment Date</TableCell>
                        <TableCell>Purchase Status</TableCell>
                        <TableCell>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedTenant.user_payments.map((payment) => (
                        <TableRow>
                          <TableCell>{payment.description}</TableCell>
                          <TableCell>{payment.purchase_type}</TableCell>

                          <TableCell>
                            {payment.linked_bill_id === null ? "No" : "Yes"}
                          </TableCell>
                          <TableCell>
                            {payment.payment_type !== null
                              ? payment.payment_type
                              : "Not Available"}
                          </TableCell>
                          <TableCell>
                            {moment(payment.next_payment).format("MMM D, YYYY")}
                          </TableCell>
                          <TableCell>
                            {moment(payment.payment_date).format("MMM D, YYYY")}
                          </TableCell>
                          <TableCell>
                            {payment.purchase_status === "PAID" ? (
                              <div style={greenPill}>Paid</div>
                            ) : payment.payment_date > payment.next_payment ? (
                              <div style={redPill}>Unpaid</div>
                            ) : payment.payment_date < payment.next_payment ? (
                              <div style={greenPill}>On-time</div>
                            ) : (
                              <div style={redPill}>Unpaid</div>
                            )}
                          </TableCell>

                          <TableCell>
                            {formatter.format(payment.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Row>
              </div>
            ) : (
              <div
                className="mx-3 my-3 p-2"
                style={{
                  background: "#E9E9E9 0% 0% no-repeat padding-box",
                  borderRadius: "10px",
                  opacity: 1,
                }}
              >
                <Row className="m-3">No payments added</Row>
              </div>
            )}

            <Row
              className="d-flex justify-content-center my-2"
              style={mediumBold}
            >
              Repair Requests
            </Row>
            {selectedTenant.user_repairRequests.length > 0 ? (
              <div
                className="mx-3 my-3 p-2"
                style={{
                  background: "#E9E9E9 0% 0% no-repeat padding-box",
                  borderRadius: "10px",
                  opacity: 1,
                }}
              >
                <Row className="m-3">
                  <Table
                    responsive="md"
                    classes={{ root: classes.customTableDetail }}
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
              </div>
            ) : (
              <div
                className="mx-3 my-3 p-2"
                style={{
                  background: "#E9E9E9 0% 0% no-repeat padding-box",
                  borderRadius: "10px",
                  opacity: 1,
                }}
              >
                <Row className="m-3">No repairs requested</Row>
              </div>
            )}
          </div>
          <div hidden={responsive.showSidebar} className="w-100 mt-3">
            <ManagerFooter />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ManagerTenantListDetail;
