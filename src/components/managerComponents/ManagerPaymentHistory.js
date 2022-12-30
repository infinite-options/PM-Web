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
import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import Verified from "../../icons/Verified.jpg";
import { put } from "../../utils/api";
import { headings, subHeading } from "../../utils/styles";
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
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("payment_date");
  const { verified, setVerified } = props;
  const managerID = props.managerID;
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

  const paymentsOutgoingHeadCell = [
    {
      id: "purchase_uid",
      numeric: false,
      label: "ID",
    },
    {
      id: "address",
      numeric: false,
      label: "Address",
    },
    {
      id: "receiver",
      numeric: false,
      label: "To",
    },

    {
      id: "description",
      numeric: true,
      label: "Description",
    },

    {
      id: "purchase_type",
      numeric: false,
      label: "Type",
    },

    {
      id: "payment_date",
      numeric: false,
      label: "Date Paid",
    },
    {
      id: "",
      numeric: false,
      label: "",
    },
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
              align="right"
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
  const paymentsIncomingHeadCell = [
    {
      id: "purchase_uid",
      numeric: false,
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
      numeric: true,
      label: "Description",
    },

    {
      id: "purchase_type",
      numeric: false,
      label: "Type",
    },

    {
      id: "next_payment",
      numeric: false,
      label: "Date Due",
    },
    {
      id: "payment_verify",
      numeric: true,
      label: "Verify",
    },
    {
      id: "amount_paid",
      numeric: true,
      label: "Amount",
    },
  ];

  function EnhancedTableHeadIncomingPayments(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {paymentsIncomingHeadCell.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="right"
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

  EnhancedTableHeadIncomingPayments.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  const verifyPayment = async (payID) => {
    let verifyObj = {
      payment_uid: payID,
      payment_verify: "Verified",
    };
    const response = await put("/payments", verifyObj);
    setVerified(true);
  };
  const unverifyPayment = async (payID) => {
    let verifyObj = {
      payment_uid: payID,
      payment_verify: "Unverified",
    };
    const response = await put("/payments", verifyObj);
    setVerified(true);
  };
  return (
    <div className="payment-history">
      <Row className="m-3" style={headings}>
        Payment History (Last 30 Days)
      </Row>
      <Row className="m-3" style={subHeading}>
        {" "}
        Outgoing Payments
      </Row>
      <Row className="m-3" style={{ overflow: "scroll" }}>
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
            {stableSort(history, getComparator(order, orderBy)).map(
              (row, index) => {
                return row.purchase_status === "PAID" &&
                  row.receiver !== managerID &&
                  row.amount_paid > 0 ? (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.purchase_uid}
                  >
                    <TableCell align="right">{row.purchase_uid}</TableCell>
                    <TableCell align="right" style={{ width: "300px" }}>
                      {row.address +
                        " " +
                        row.unit +
                        "," +
                        row.city +
                        ", " +
                        row.state +
                        " " +
                        row.zip}
                    </TableCell>
                    <TableCell align="right"> {row.receiver}</TableCell>
                    <TableCell align="right" style={{ width: "200px" }}>
                      {row.purchase_frequency === "One-time" ||
                      row.purchase_frequency === "Annually"
                        ? row.description
                        : row.purchase_notes + " " + row.description}
                    </TableCell>
                    <TableCell align="right">{row.purchase_type}</TableCell>
                    <TableCell align="right">
                      {row.payment_date !== null
                        ? row.payment_date.substring(0, 10)
                        : "Not Available"}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{ width: "83px" }}
                    ></TableCell>
                    <TableCell align="right">
                      {Math.abs(row.amount_paid).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ) : (
                  ""
                );
              }
            )}
          </TableBody>
        </Table>
      </Row>
      <Row className="m-3" style={subHeading}>
        {" "}
        Incoming Payments
      </Row>
      <Row className="m-3" style={{ overflow: "scroll" }}>
        <Table
          responsive="md"
          classes={{ root: classes.customTable }}
          size="small"
        >
          <EnhancedTableHeadIncomingPayments
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={history.length}
          />{" "}
          <TableBody>
            {stableSort(history, getComparator(order, orderBy)).map(
              (row, index) => {
                return (row.purchase_status === "PAID" &&
                  row.receiver === managerID &&
                  row.amount_paid > 0) ||
                  (row.purchase_status === "PAID" &&
                    row.receiver !== managerID &&
                    row.amount_paid < 0) ? (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.purchase_uid}
                  >
                    <TableCell align="right">{row.purchase_uid}</TableCell>
                    <TableCell align="right" style={{ width: "300px" }}>
                      {row.address +
                        " " +
                        row.unit +
                        "," +
                        row.city +
                        ", " +
                        row.state +
                        " " +
                        row.zip}
                    </TableCell>

                    <TableCell align="right"> {row.payer}</TableCell>
                    <TableCell align="right" style={{ width: "200px" }}>
                      {row.purchase_frequency === "One-time" ||
                      row.purchase_frequency === "Annually"
                        ? row.description
                        : row.purchase_notes + " " + row.description}
                    </TableCell>
                    <TableCell align="right">{row.purchase_type}</TableCell>
                    <TableCell align="right">
                      {row.payment_date !== null
                        ? row.payment_date.substring(0, 10)
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
                          }}
                          onClick={() => unverifyPayment(row.payment_uid)}
                        />
                      ) : (
                        <button
                          style={{
                            backgroundColor:
                              new Date(row.payment_date) < new Date()
                                ? "red"
                                : "green",
                            color: "white",
                            border: "none",
                          }}
                          onClick={() => verifyPayment(row.payment_uid)}
                        >
                          Verify
                        </button>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {Math.abs(row.amount_paid).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ) : (
                  ""
                );
              }
            )}
          </TableBody>
        </Table>
      </Row>
    </div>
  );
}
