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
      Payment History (Last 30 Days)
      <Row className="m-3" style={{ overflow: "scroll" }}>
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
      </Row>
    </div>
  );
}
