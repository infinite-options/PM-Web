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
export default function UpcomingPayments(props) {
  const classes = useStyles();
  const history = props.data; //array of objects

  const noRows = "No data available";

  const rows = history?.map((row, index) => {
    //row is an element in the array
    if (row.purchase_status == "PAID") {
      return (
        <TableRow>
          <TableCell>{index + 1}</TableCell>
          <TableCell>
            {"" +
              row.address +
              " " +
              row.unit +
              "," +
              row.city +
              ", " +
              row.state +
              " " +
              row.zip}
          </TableCell>
          <TableCell>
            {"" + row.purchase_notes + " " + row.description}
          </TableCell>
          <TableCell>{row.purchase_type}</TableCell>
          <TableCell>{row.next_payment.substring(0, 10)}</TableCell>
          <TableCell></TableCell>
          <TableCell>{row.amount_paid}</TableCell>
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
            <TableCell>ID</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Invoice</TableCell>
            <TableCell>Amount</TableCell>
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
