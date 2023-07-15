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
import { headings, subHeading, blue, xSmall } from "../../utils/styles";
import {
  descendingComparator as descendingComparator,
  getComparator as getComparator,
  stableSort as stableSort,
} from "../../utils/helper";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});
export default function OwnerPaymentHistory(props) {
  const classes = useStyles();
  const history = props.data; //array of objects

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("payment_date");
  const [searchOutgoing, setSearchOutgoing] = useState("");
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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

  return (
    <div className="payment-history">
      <Row className="m-3">
        <Col>
          <h3>Payment History (Last 30 Days)</h3>
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
                    return row.purchase_status === "PAID" ? (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.purchase_uid}
                      >
                        <TableCell align="left">{row.purchase_uid}</TableCell>
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
                          {row.payment_date !== null
                            ? row.payment_date.substring(0, 10)
                            : "Not Available"}
                        </TableCell>
                        <TableCell align="right">
                          {row.payment_type !== null
                            ? row.payment_type
                            : "Not Available"}{" "}
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
                  })}
              </TableBody>
            </Table>
          )}
        </Row>
      </div>
    </div>
  );
}
