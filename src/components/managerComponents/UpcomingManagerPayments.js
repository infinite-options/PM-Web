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
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import DeleteIcon from "../../icons/DeleteIcon.svg";
import { put } from "../../utils/api";
import { headings, subHeading } from "../../utils/styles";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

export default function UpcomingManagerPayments(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const [totalSum, setTotalSum] = useState(0);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("next_payment");
  const [orderIncoming, setOrderIncoming] = useState("asc");
  const [orderIncomingBy, setOrderIncomingBy] = useState("next_payment");
  const [purchaseUIDs, setPurchaseUIDs] = useState([]); //figure out which payment is being payed for
  const [purchases, setPurchases] = useState([]); //figure out which payment is being payed for
  const rents = props.data; //array of objects
  const { deleted, setDeleted } = props;
  const managerID = props.managerID;
  const goToPayment = () => {
    navigate("/manager-payments");
    // <PaymentComponent data = {rents}/>
  };

  function handleCheck(event, pur, amt, pid) {
    //pid is the purchase uid
    let tempPurchaseUID = purchaseUIDs;
    let tempPurchase = purchases;
    if (event.target.checked) {
      setTotalSum((prevState) => amt + prevState);
      // setPurchaseUIDs(prev=>.)
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
  function navigateToPaymentPage() {
    if (props.paymentSelection[1].isActive === true) {
      // console.log("zelle selected");
      navigate("/zelle", {
        state: {
          amount: totalSum.toFixed(2),
          selectedProperty: props.selectedProperty,
          purchaseUIDs: purchaseUIDs,
        },
      });
    } else {
      navigate(`/managerPaymentPage/${purchaseUIDs[0]}`, {
        state: {
          amount: totalSum.toFixed(2),
          selectedProperty: props.selectedProperty,
          purchaseUIDs: purchaseUIDs,
          purchases: purchases,
        },
      });
    }
  }
  const deletePurchase = async (purchase_id) => {
    let delPurchase = {
      purchase_uid: purchase_id,
    };
    const response = await put("/DeletePurchase", delPurchase);
    setDeleted(!deleted);
  };
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
      id: "linked_bill_id",
      numeric: true,
      label: "Split Payment",
    },

    {
      id: "next_payment",
      numeric: true,
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

  const handleRequestSortIncoming = (event, property) => {
    const isAsc = orderIncomingBy === property && orderIncoming === "asc";
    setOrderIncoming(isAsc ? "desc" : "asc");
    setOrderIncomingBy(property);
  };

  function descendingComparatorIncoming(a, b, orderIncomingBy) {
    if (b[orderIncomingBy] < a[orderIncomingBy]) {
      return -1;
    }
    if (b[orderIncomingBy] > a[orderIncomingBy]) {
      return 1;
    }
    return 0;
  }

  function getComparatorIncoming(orderIncoming, orderIncomingBy) {
    return orderIncoming === "desc"
      ? (a, b) => descendingComparatorIncoming(a, b, orderIncomingBy)
      : (a, b) => -descendingComparatorIncoming(a, b, orderIncomingBy);
  }

  function stableSortIncoming(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const orderIncoming = comparator(a[0], b[0]);
      if (orderIncoming !== 0) {
        return orderIncoming;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

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
      id: "linked_bill_id",
      numeric: true,
      label: "Split Payment",
    },

    {
      id: "next_payment",
      numeric: true,
      label: "Date Due",
    },
    {
      id: "",
      numeric: false,
      label: "Delete",
    },
    {
      id: "amount_due",
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
              align="right"
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
  return (
    <div className="upcoming-payments">
      <Row className="m-3">
        <Col>
          <h3> Upcoming Payments</h3>
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
        {" "}
        <Row className="m-3" style={subHeading}>
          {" "}
          <h5> Outgoing Payments</h5>
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
              rowCount={rents.length}
            />{" "}
            <TableBody>
              {rents.length !== 0
                ? stableSort(rents, getComparator(order, orderBy)).map(
                    (row, index) => {
                      return row.purchase_status === "UNPAID" &&
                        row.receiver !== managerID &&
                        row.amount_due > 0 ? (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          <TableCell align="left">{row.purchase_uid}</TableCell>
                          <TableCell align="left" style={{ width: "300px" }}>
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
                            {row.description}
                          </TableCell>
                          <TableCell align="right">
                            {row.purchase_type}
                          </TableCell>
                          <TableCell align="right">
                            {row.linked_bill_id === null ? "No" : "Yes"}
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
                          <TableCell align="right" style={{ width: "83px" }}>
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
                                      row,
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
        {props.type === false && (
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
        )}
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
          {" "}
          <h5> Incoming Payments</h5>
        </Row>
        <Row className="m-3" style={{ overflow: "scroll" }}>
          <Table
            responsive="md"
            classes={{ root: classes.customTable }}
            size="small"
          >
            <EnhancedTableHeadIncomingPayments
              orderIncoming={orderIncoming}
              orderIncomingBy={orderIncomingBy}
              onRequestSortIncoming={handleRequestSortIncoming}
              rowCount={rents.length}
            />{" "}
            <TableBody>
              {rents.length !== 0
                ? stableSortIncoming(
                    rents,
                    getComparatorIncoming(orderIncoming, orderIncomingBy)
                  ).map((row, index) => {
                    return ((row.purchase_status === "UNPAID" ||
                      row.purchase_status === "DELETED") &&
                      row.receiver === managerID &&
                      row.amount_due > 0) ||
                      ((row.purchase_status === "UNPAID" ||
                        row.purchase_status === "DELETED") &&
                        row.receiver !== managerID &&
                        row.amount_due < 0) ? (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                        style={{
                          textDecoration:
                            row.purchase_status === "DELETED"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        <TableCell align="left">{row.purchase_uid}</TableCell>
                        <TableCell align="left" style={{ width: "300px" }}>
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
                          {row.description}
                        </TableCell>
                        <TableCell align="right">{row.purchase_type}</TableCell>
                        <TableCell align="right">
                          {row.linked_bill_id === null ? "No" : "Yes"}
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
                        <TableCell align="right" style={{ width: "83px" }}>
                          <img
                            src={DeleteIcon}
                            alt="Delete Icon"
                            className="px-1 mx-2"
                            onClick={() => deletePurchase(row.purchase_uid)}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {Math.abs(row.amount_due).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ) : (
                      ""
                    );
                  })
                : "No upcoming payments"}
            </TableBody>
          </Table>
        </Row>
      </div>
    </div>
  );
}
