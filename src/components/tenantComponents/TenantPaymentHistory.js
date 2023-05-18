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
import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import { makeStyles } from "@material-ui/core/styles";
import Verified from "../../icons/Verified.jpg";
import {
  descendingComparator as descendingComparator,
  getComparator as getComparator,
  stableSort as stableSort,
} from "../../utils/helper";

import { green, red, blue, xSmall } from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

export default function TenantPaymentHistory(props) {
  // sorting variables
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("payment_date");

  const classes = useStyles();
  const history = props.data; //array of objects
  const noRows = "No data available";

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const paymentsHeadCell = [
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
      id: "linked_bill_id",
      numeric: true,
      label: "Split",
    },

    {
      id: "payment_date",
      numeric: false,
      label: "Date Paid",
    },
    { id: "payment_type", numeric: false, label: "Payment Type" },
    {
      id: "payment_verify",
      numeric: false,
      label: "Payment Verification",
    },
    {
      id: "amount_paid",
      numeric: true,
      label: "Amount",
    },
  ];

  function EnhancedTableHeadPayments(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {paymentsHeadCell.map((headCell) => (
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

  EnhancedTableHeadPayments.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  return (
    <div className="payment-history">
      <Row className="mx-3">
        <Col>
          <h4>Payment History (Last 30 Days)</h4>
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
        <Row className="m-3" style={{ overflow: "scroll" }}>
          {history.filter((row) => row.purchase_status === "PAID").length ===
          0 ? (
            <Row className="m-3">
              <div className="m-3">No Payment History</div>
            </Row>
          ) : (
            <Table
              responsive="md"
              classes={{ root: classes.customTable }}
              size="small"
            >
              <EnhancedTableHeadPayments
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={history.length}
              />{" "}
              <TableBody>
                {stableSort(history, getComparator(order, orderBy)).map(
                  (row, index) => {
                    return row.purchase_status === "PAID" ? (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.purchase_uid}
                      >
                        <TableCell align="left">{row.purchase_uid}</TableCell>
                        <TableCell
                          align="left"
                          style={{
                            width: 'Dimensions.get("window").width * 0.7 ',
                          }}
                        >
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
                        <TableCell align="left">{row.description}</TableCell>
                        <TableCell align="left">{row.purchase_type}</TableCell>
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
                              }}
                            />
                          ) : (
                            "Unverified"
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {row.amount_paid.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ) : (
                      ""
                    );
                  }
                )}
              </TableBody>
            </Table>
          )}
        </Row>
      </div>
    </div>
  );
}
