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
import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import { makeStyles } from "@material-ui/core/styles";
import { subHeading } from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

export default function TenantUpcomingPayments(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const [totalSum, setTotalSum] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("next_payment");
  const [purchaseUIDs, setPurchaseUIDs] = useState([]); //figure out which payment is being payed for
  const [purchases, setPurchases] = useState([]); //figure out which payment is being payed for
  const rents = props.data; //array of objects
  const goToPayment = () => {
    navigate("/tenant-payments");
    // <PaymentComponent data = {rents}/>
  };

  function handleCheck(event, pur, amt, pid) {
    //pid is the purchase uid
    let tempPurchaseUID = purchaseUIDs;
    let tempPurchase = purchases;

    if (!purchaseUIDs.includes(pid)) {
      setTotalSum((prevState) => amt + prevState);

      tempPurchaseUID.push(pid);
      tempPurchase.push(pur);
    } else {
      setTotalSum((prevState) => prevState - amt);
      for (let uid in purchaseUIDs) {
        if (purchaseUIDs[uid] === pid) {
          purchaseUIDs.splice(uid, 1);
        }
      }
      for (let uid in purchases) {
        if (purchases[uid] === pur) {
          purchases.splice(uid, 1);
        }
      }
    }

    setPurchaseUIDs(tempPurchaseUID);
    setPurchases(tempPurchase);
  }
  function handleCheckAll(source) {
    //pid is the purchase uid
    let tempPurchaseUID = [];
    let tempPurchase = [];
    if (source.target.checked) {
      rents.forEach((row) => {
        if (row.purchase_status === "UNPAID") {
          tempPurchaseUID.push(row.purchase_uid);
          tempPurchase.push(row);
        }
      });
      setTotalSum(
        tempPurchase.reduce(function (prev, current) {
          return prev + +current.amount_due;
        }, 0)
      );
    } else {
      tempPurchaseUID = [];
      tempPurchase = [];
    }
    // var checkboxes = document.querySelectorAll('input[name="check"]');
    // for (var i = 0; i < checkboxes.length; i++) {
    //   if (checkboxes[i] != source.target) {
    //     checkboxes[i].checked = source.target.checked;
    //   }
    // }

    setPurchaseUIDs(tempPurchaseUID);
    setPurchases(tempPurchase);
  }
  // console.log(purchases);
  function navigateToPaymentPage() {
    navigate(`/paymentPage/${purchaseUIDs[0]}`, {
      state: {
        amount: totalSum.toFixed(2),
        selectedProperty: props.selectedProperty,
        purchaseUIDs: purchaseUIDs,
        purchases: purchases,
      },
    });
  }
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
      id: "linked_bill_id",
      numeric: true,
      label: "Split",
    },

    {
      id: "next_payment",
      numeric: false,
      label: "Date Due",
    },

    // {
    //   id: "",
    //   numeric: false,
    //   label: "Pay",
    // },
    {
      id: "amount_due",
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
  let pageURL = window.location.href.split("/");
  return (
    <div className="upcoming-payments">
      <Row className="mx-3">
        <Col>
          <h4>Upcoming Payments</h4>
        </Col>
      </Row>{" "}
      {props.type === false && (
        <Row className="m-3" style={subHeading}>
          <Col xs={1}>
            <h5> Pay All</h5>
          </Col>
          <Col>
            <input
              className="check"
              type="checkbox"
              name="selectall"
              onClick={(source) => handleCheckAll(source)}
            />
          </Col>
        </Row>
      )}
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
            <EnhancedTableHeadPayments
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
                          selected={
                            purchaseUIDs.includes(row.purchase_uid)
                              ? true
                              : false
                          }
                          onClick={(event) =>
                            handleCheck(
                              event,
                              row,
                              row.amount_due,
                              row.purchase_uid
                            )
                          }
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
                          </TableCell>
                          <TableCell align="left">{row.description}</TableCell>
                          <TableCell align="left">
                            {row.purchase_type}
                          </TableCell>
                          <TableCell align="center">
                            {row.linked_bill_id === null ? "No" : "Yes"}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              color:
                                new Date(row.next_payment) < new Date()
                                  ? "red"
                                  : "green",
                            }}
                          >
                            {row.next_payment.substring(0, 10)}
                          </TableCell>
                          {/* <TableCell align="right">
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
                                  name="check"
                                  onClick={(event) =>
                                    handleCheck(
                                      event,
                                      row,
                                      row.amount_due,
                                      row.purchase_uid
                                    )
                                  }
                                />
                              </label>
                            )}
                          </TableCell> */}
                          <TableCell align="right">
                            {row.amount_due.toFixed(2)}
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

        <div className="amount-pay">
          <h4 className="amount">Amount: ${totalSum.toFixed(2)}</h4>
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
      </div>
    </div>
  );
}
