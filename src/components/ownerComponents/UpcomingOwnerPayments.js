import React, { useState } from "react";
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
import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import { makeStyles } from "@material-ui/core/styles";
import { headings, subHeading } from "../../utils/styles";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

export default function UpcomingOwnerPayments(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const [totalSum, setTotalSum] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("next_payment");
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
      navigate(`/ownerPaymentPage/${purchaseUIDs[0]}`, {
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
          <TableCell align="center">{row.purchase_uid}</TableCell>
          <TableCell align="center">
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
          <TableCell align="center">
            {row.purchase_frequency === "One-time" ||
            row.purchase_frequency === "Annually"
              ? row.description
              : row.purchase_notes + " " + row.description}
          </TableCell>
          <TableCell align="center">{row.purchase_type}</TableCell>

          <TableCell align="center">{row.receiver}</TableCell>
          <TableCell
            align="center"
            style={{
              color: new Date(row.next_payment) < new Date() ? "red" : "green",
            }}
          >
            {row.next_payment.substring(0, 10)}
          </TableCell>
          <TableCell align="center">
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
          <TableCell align="right">{row.amount_due.toFixed(2)}</TableCell>
        </TableRow>
      );
    }
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
      id: "next_payment",
      numeric: false,
      label: "Date Due",
    },

    {
      id: "",
      numeric: false,
      label: "Pay",
    },
    {
      id: "amount_due",
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
  return (
    <div className="upcoming-payments">
      <Row className="m-3">
        <Col>
          <h3>Upcoming Payments</h3>
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
          <Table
            responsive="md"
            classes={{ root: classes.customTable }}
            size="small"
          >
            <EnhancedTableHeadOutgoingPayments
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rents.length}
            />{" "}
            <TableBody>
              {rents.length !== 0
                ? stableSort(rents, getComparator(order, orderBy)).map(
                    (row, index) => {
                      return row.purchase_status === "UNPAID" ? (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.purchase_uid}
                        >
                          <TableCell align="right">
                            {row.purchase_uid}
                          </TableCell>
                          <TableCell align="right">
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
                          <TableCell align="right">
                            {row.purchase_frequency === "One-time" ||
                            row.purchase_frequency === "Annually"
                              ? row.description
                              : row.purchase_notes + " " + row.description}
                          </TableCell>
                          <TableCell align="right">
                            {row.purchase_type}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              color:
                                new Date(row.next_payment) < new Date()
                                  ? "red"
                                  : "green",
                            }}
                          >
                            {row.next_payment.substring(0, 10)}
                          </TableCell>
                          <TableCell align="right">
                            {props.type ? (
                              <button
                                style={{
                                  backgroundColor:
                                    new Date(row.next_payment) < new Date()
                                      ? "red"
                                      : "green",
                                  color: "white",
                                  border: "none",
                                }}
                                onClick={goToPayment}
                              >
                                Pay
                              </button>
                            ) : (
                              <label>
                                <input
                                  className="check"
                                  type="checkbox"
                                  onClick={(event) =>
                                    handleCheck(
                                      event,
                                      row.amount_due,
                                      row.purchase_uid
                                    )
                                  }
                                />
                              </label>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {Math.abs(row.amount_due).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        ""
                      );
                    }
                  )
                : "No upcoming payments"}
            </TableBody>
          </Table>
        </Row>
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
    </div>
  );
}
