import React, { useState } from "react";
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
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Fade } from "@mui/material";
import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import Verified from "../../icons/Verified.svg";
import RedReverse from "../../icons/RedReverse.svg";
import { put } from "../../utils/api";
import { headings, subHeading, blue, xSmall } from "../../utils/styles";
import {
  descendingComparator as descendingComparator,
  getComparator as getComparator,
  stableSort as stableSort,
} from "../../utils/helper";
import {
  descendingComparator as descendingComparatorIncoming,
  getComparator as getComparatorIncoming,
  stableSort as stableSortIncoming,
} from "../../utils/helper";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

export default function ManagerPaymentHistory(props) {
  const classes = useStyles();
  const history = props.data; //array of objects
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("payment_date");
  const [orderIncoming, setOrderIncoming] = useState("desc");
  const [orderIncomingBy, setOrderIncomingBy] = useState("payment_date");
  const [unpaidModalShow, setUnpaidModalShow] = useState(false);
  const { verified, setVerified, unpaid, setUnpaid } = props;
  const managerID = props.managerID;
  const [searchOutgoing, setSearchOutgoing] = useState("");
  const [searchIncoming, setSearchIncoming] = useState("");

  const hideModal = () => {
    setUnpaidModalShow(false);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const paymentsOutgoingHeadCell = [
    {
      id: "purchase_uid",
      numeric: true,
      label: "ID",
    },
    {
      id: "address",
      numeric: false,
      label: "Address",
    },
    {
      id: "receiver",
      numeric: true,
      label: "To",
    },

    {
      id: "description",
      numeric: false,
      label: "Description",
    },

    {
      id: "purchase_type",
      numeric: false,
      label: "Type",
    },

    {
      id: "linked_bill_id",
      numeric: true,
      label: "Split",
    },

    {
      id: "payment_date",
      numeric: true,
      label: "Date Paid",
    },
    { id: "payment_type", numeric: false, label: "Payment Type" },

    {
      id: "amount_paid",
      numeric: true,
      label: "Amount",
    },
  ];

  function EnhancedTableHeadOutgoingPayments(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {paymentsOutgoingHeadCell.map((headCell) => (
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

  EnhancedTableHeadOutgoingPayments.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  const handleRequestSortIncoming = (event, property) => {
    const isAsc = orderIncomingBy === property && orderIncoming === "asc";
    setOrderIncoming(isAsc ? "desc" : "asc");
    setOrderIncomingBy(property);
  };

  const paymentsIncomingHeadCell = [
    {
      id: "purchase_uid",
      numeric: true,
      label: "ID",
    },
    {
      id: "address",
      numeric: false,
      label: "Address",
    },

    {
      id: "payer",
      numeric: true,
      label: "From",
    },
    {
      id: "description",
      numeric: false,
      label: "Description",
    },

    {
      id: "purchase_type",
      numeric: false,
      label: "Type",
    },
    {
      id: "linked_bill_id",
      numeric: true,
      label: "Split",
    },

    {
      id: "payment_date",
      numeric: true,
      label: "Date Paid",
    },
    { id: "payment_type", numeric: false, label: "Payment Type" },
    {
      id: "payment_verify",
      numeric: false,
      label: "Verify",
    },
    {
      id: "purchase_status",
      numeric: false,
      label: "Mark Unpaid",
    },
    {
      id: "amount_paid",
      numeric: true,
      label: "Amount",
    },
  ];

  function EnhancedTableHeadIncomingPayments(props) {
    const { orderIncoming, orderIncomingBy, onRequestSortIncoming } = props;
    const createSortHandlerIncoming = (property) => (event) => {
      onRequestSortIncoming(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {paymentsIncomingHeadCell.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              size="small"
              sortDirection={orderIncomingBy === headCell.id ? order : false}
            >
              <TableSortLabel
                align="center"
                active={orderIncomingBy === headCell.id}
                direction={orderIncomingBy === headCell.id ? order : "asc"}
                onClick={createSortHandlerIncoming(headCell.id)}
              >
                {headCell.label}
                {orderIncomingBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {orderIncoming === "desc"
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

  EnhancedTableHeadIncomingPayments.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSortIncoming: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    orderIncoming: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderIncomingBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  const verifyPayment = async (payID) => {
    let verifyObj = {
      payment_uid: payID,
      payment_verify: "Verified",
    };
    const response = await put("/payments", verifyObj);
    setVerified(!verified);
  };
  const unverifyPayment = async (payID) => {
    let verifyObj = {
      payment_uid: payID,
      payment_verify: "Unverified",
    };
    const response = await put("/payments", verifyObj);
    setVerified(!verified);
  };
  const MarkUnpaid = async (payPurID) => {
    console.log(payPurID);
    let unpaidObj = {
      purchase_uid: payPurID,
    };
    console.log(unpaidObj);
    const response = await put("/MarkUnpaid", unpaidObj);
    setUnpaid(!unpaid);
    setUnpaidModalShow(false);
  };

  const paidModal = () => {
    const footerStyle = {
      border: "none",
      backgroundColor: " #F3F3F8",
    };
    const bodyStyle = {
      backgroundColor: " #F3F3F8",
    };
    return (
      <Dialog
        open={unpaidModalShow}
        transition={Fade}
        onClose={hideModal}
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <div className="d-flex justify-content-center align-items-center m-5">
            <h5>Marked as Unpaid</h5>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  return (
    <div className="payment-history">
      <Row className="m-3">
        <Col>
          <h3>Payment History (Last 30 Days)</h3>
        </Col>
      </Row>
      <div
        className="mx-3 my-3 p-2"
        style={{
          background: "#E9E9E9 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        <Row className="m-3" style={subHeading}>
          <Col xs={4}>
            {" "}
            <h5> Outgoing Payments</h5>
          </Col>

          <Col xs={2}> Search by</Col>

          <Col>
            <input
              type="text"
              placeholder="Search"
              onChange={(event) => {
                setSearchOutgoing(event.target.value);
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
          {history.filter(
            (row) =>
              row.purchase_status === "PAID" &&
              row.receiver !== managerID &&
              row.amount_paid > 0
          ).length === 0 ? (
            <Row className="m-3">
              <div className="m-3">No Payment History</div>
            </Row>
          ) : (
            <Table
              responsive="md"
              classes={{ root: classes.customTable }}
              size="small"
            >
              <EnhancedTableHeadOutgoingPayments
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={history.length}
              />{" "}
              <TableBody>
                {stableSort(history, getComparator(order, orderBy))
                  .filter((val) => {
                    const query = searchOutgoing.toLowerCase();

                    return (
                      val.address.toLowerCase().includes(query) ||
                      String(val.unit).toLowerCase().includes(query) ||
                      val.city.toLowerCase().includes(query) ||
                      val.zip.toLowerCase().includes(query)
                    );
                  })
                  .map((row, index) => {
                    return row.purchase_status === "PAID" &&
                      row.receiver !== managerID &&
                      row.amount_paid > 0 ? (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.payment_uid}
                      >
                        <TableCell align="left">
                          {row.pay_purchase_id}
                        </TableCell>
                        <TableCell align="left">
                          {row.address +
                            " " +
                            row.unit +
                            "," +
                            row.city +
                            ", " +
                            row.state +
                            " " +
                            row.zip}
                          <div className="d-flex">
                            <div className="d-flex align-items-end">
                              <p
                                style={{ ...blue, ...xSmall }}
                                className="mb-0"
                              >
                                {row.payment_notes}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell align="left"> {row.receiver}</TableCell>
                        <TableCell align="left">{row.description}</TableCell>
                        <TableCell align="right">{row.purchase_type}</TableCell>
                        <TableCell align="center">
                          {row.linked_bill_id === null ? "No" : "Yes"}
                        </TableCell>
                        <TableCell align="center">
                          {row.payment_date.substring(0, 10)}
                        </TableCell>
                        <TableCell align="right">
                          {row.payment_type !== null
                            ? row.payment_type
                            : "Not Available"}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ width: "83px" }}
                        ></TableCell>
                        <TableCell align="right">
                          {Math.abs(row.amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ) : (
                      ""
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </Row>
      </div>
      <div
        className="mx-3 my-3 p-2"
        style={{
          background: "#E9E9E9 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        <Row className="m-3" style={subHeading}>
          <Col xs={4}>
            <h5> Incoming Payments</h5>
          </Col>

          <Col xs={2}> Search by</Col>

          <Col>
            <input
              type="text"
              placeholder="Search"
              onChange={(event) => {
                setSearchIncoming(event.target.value);
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
          {history.filter(
            (row) =>
              (row.purchase_status === "PAID" &&
                row.receiver === managerID &&
                row.amount_paid > 0) ||
              (row.purchase_status === "PAID" &&
                row.receiver !== managerID &&
                row.amount_paid < 0)
          ).length === 0 ? (
            <Row className="m-3">
              <div className="m-3">No Payment History</div>
            </Row>
          ) : (
            <Table
              responsive="md"
              classes={{ root: classes.customTable }}
              size="small"
            >
              <EnhancedTableHeadIncomingPayments
                orderIncoming={orderIncoming}
                orderIncomingBy={orderIncomingBy}
                onRequestSortIncoming={handleRequestSortIncoming}
                rowCount={history.length}
              />{" "}
              <TableBody>
                {stableSortIncoming(
                  history,
                  getComparatorIncoming(orderIncoming, orderIncomingBy)
                )
                  .filter((val) => {
                    const query = searchIncoming.toLowerCase();

                    return (
                      val.address.toLowerCase().includes(query) ||
                      String(val.unit).toLowerCase().includes(query) ||
                      val.city.toLowerCase().includes(query) ||
                      val.zip.toLowerCase().includes(query)
                    );
                  })
                  .map((row, index) => {
                    return (row.purchase_status === "PAID" &&
                      row.receiver === managerID &&
                      row.amount_paid > 0) ||
                      (row.purchase_status === "PAID" &&
                        row.receiver !== managerID &&
                        row.amount_paid < 0) ? (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell align="left">
                          {row.pay_purchase_id}
                        </TableCell>
                        <TableCell align="left">
                          {row.address +
                            " " +
                            row.unit +
                            "," +
                            row.city +
                            ", " +
                            row.state +
                            " " +
                            row.zip}
                          <div className="d-flex">
                            <div className="d-flex align-items-end">
                              <p
                                style={{ ...blue, ...xSmall }}
                                className="mb-0"
                              >
                                {row.payment_notes}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell align="left"> {row.payer}</TableCell>
                        <TableCell align="left">{row.description}</TableCell>
                        <TableCell align="right">{row.purchase_type}</TableCell>
                        <TableCell align="center">
                          {row.linked_bill_id === null ? "No" : "Yes"}
                        </TableCell>
                        <TableCell align="center">
                          {row.payment_date !== null
                            ? row.payment_date.substring(0, 10)
                            : "Not Available"}
                        </TableCell>
                        <TableCell align="right">
                          {row.payment_type !== null
                            ? row.payment_type
                            : "Not Available"}
                        </TableCell>
                        <TableCell align="right" style={{ width: "83px" }}>
                          {row.payment_verify === "Verified" ? (
                            <img
                              src={Verified}
                              style={{
                                width: "25px",
                                height: "25px",
                                objectFit: "contain",
                                cursor: "pointer",
                              }}
                              title="Unverify"
                              onClick={() => unverifyPayment(row.payment_uid)}
                            />
                          ) : (
                            <button
                              style={{
                                backgroundColor: "red",
                                color: "white",
                                border: "none",
                              }}
                              onClick={() => verifyPayment(row.payment_uid)}
                            >
                              Verify
                            </button>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {row.payment_verify === "Verified" ? (
                            <img
                              src={RedReverse}
                              style={{
                                width: "35px",
                                height: "35px",
                                objectFit: "contain",
                              }}
                              title="Mark Unpaid Disabled"
                            />
                          ) : (
                            <img
                              src={RedReverse}
                              style={{
                                width: "35px",
                                height: "35px",
                                objectFit: "contain",
                                cursor: "pointer",
                              }}
                              title="Mark Unpaid"
                              onClick={() => {
                                setUnpaidModalShow(true);
                                MarkUnpaid(row.pay_purchase_id);
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {Math.abs(row.amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ) : (
                      ""
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </Row>
      </div>
    </div>
  );
}
