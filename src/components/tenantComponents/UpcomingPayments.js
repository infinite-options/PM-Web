import React, { useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
// import { get } from "../utils/api";
import { useNavigate } from "react-router-dom";
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
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

export default function UpcomingPayments(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const [totalSum, setTotalSum] = useState(0);
  const [purchaseUIDs, setPurchaseUIDs] = useState([]); //figure out which payment is being payed for
  const rents = props.data; //array of objects
  const goToPayment = () => {
    navigate("/tenantDuePayments");
    // <PaymentComponent data = {rents}/>
  };

  function handleCheck(event, amt, pid) {
    //pid is the purchase uid
    let tempPurchaseUID = purchaseUIDs;
    if (event.target.checked) {
      setTotalSum((prevState) => amt + prevState);
      // setPurchaseUIDs(prev=>.)
      tempPurchaseUID.push(pid);
    } else {
      setTotalSum((prevState) => prevState - amt);
      for (let uid in purchaseUIDs) {
        if (purchaseUIDs[uid] === pid) {
          purchaseUIDs.splice(uid, 1);
        }
      }
    }
    setPurchaseUIDs(tempPurchaseUID);
  }
  function navigateToPaymentPage() {
    if (props.paymentSelection[1].isActive == true) {
      console.log("zelle selected");
      navigate("/zelle", {
        state: {
          amount: totalSum,
          selectedProperty: props.selectedProperty,
          purchaseUIDs: purchaseUIDs,
        },
      });
    } else {
      navigate(`/paymentPage/${purchaseUIDs[0]}`, {
        state: {
          amount: totalSum,
          selectedProperty: props.selectedProperty,
          purchaseUIDs: purchaseUIDs,
        },
      });
    }
  }
  const rows = rents.map((row, index) => {
    //row is an element in the array
    if (row.purchase_status == "UNPAID") {
      return (
        <TableRow>
          <TableCell>{index + 1}</TableCell>
          <TableCell>
            {"" + row.purchase_notes + " " + row.description}
          </TableCell>
          <TableCell>{row.purchase_type}</TableCell>
          <TableCell>{row.next_payment.substring(0, 10)}</TableCell>
          <TableCell>
            {props.type ? (
              <button className="yellow payB" onClick={goToPayment}>
                Pay
              </button>
            ) : (
              <label>
                <input
                  className="check"
                  type="checkbox"
                  onClick={(event) =>
                    handleCheck(event, row.amount_due, row.purchase_uid)
                  }
                />
              </label>
            )}
          </TableCell>
          <TableCell>{row.amount_due}</TableCell>
        </TableRow>
      );
    }
  });

  return (
    <div className="upcoming-payments">
      Upcoming Payments
      <Table
        responsive="xl"
        classes={{ root: classes.customTable }}
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Pay</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rents.length !== 0 ? (
            rows
          ) : (
            <TableRow>
              <TableCell>No upcoming payments</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {props.type == false && (
        <div className="amount-pay">
          <h4 className="amount">Amount: ${totalSum}</h4>
          {totalSum === 0 ? (
            <button className="pay-button2">Pay Now</button>
          ) : (
            <button
              className="pay-button2"
              onClick={() => {
                navigateToPaymentPage();
              }}
            >
              Pay Now
            </button>
          )}
        </div>
      )}
    </div>
  );
}
