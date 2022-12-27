import React from "react";
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
import { Tab } from "react-bootstrap";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});
export default function TenantPaymentHistory(props) {
  const classes = useStyles();
  const history = props.data; //array of objects

  const noRows = "No data available";

  const rows = history?.map((row, index) => {
    //row is an element in the array
    if (row.purchase_status == "PAID") {
      return (
        <TableRow>
          <TableCell align="center">{row.purchase_uid}</TableCell>
          <TableCell align="center" style={{ width: "368px" }}>
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
          <TableCell align="center" style={{ width: "261px" }}>
            {row.purchase_frequency === "One-time" ||
            row.purchase_frequency === "Annually"
              ? row.description
              : row.purchase_notes + " " + row.description}
          </TableCell>
          <TableCell align="center">{row.purchase_type}</TableCell>
          <TableCell align="center">
            {row.payment_date !== null
              ? row.payment_date.substring(0, 10)
              : "Not Available"}
          </TableCell>
          <TableCell align="center" style={{ width: "67px" }}></TableCell>
          <TableCell align="right">{row.amount_paid.toFixed(2)}</TableCell>
        </TableRow>
      );
    }
  });

  return (
    <div className="payment-history">
      Payment History (Last 30 Days)
      <Table
        responsive="xl"
        classes={{ root: classes.customTable }}
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Address</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">Date Paid</TableCell>
            <TableCell align="center" style={{ width: "67px" }}></TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history === "" && <TableRow>{noRows}</TableRow>}
          {props.length != 0 && rows}
        </TableBody>
      </Table>
    </div>
  );
}
