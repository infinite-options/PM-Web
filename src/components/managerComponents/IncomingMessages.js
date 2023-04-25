import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Button, Form } from "react-bootstrap";
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
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

const accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;

function IncomingMessages(props) {
  const classes = useStyles();
  const [listIncoming, setListIncoming] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const getMessages = () => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + authToken,
    };
    let phone = "(925) 481-5757";
    axios
      .get(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json?To='${phone}`,
        {
          auth: {
            username: accountSid,
            password: authToken,
          },
        }
      )

      .then((response) => {
        console.log(response.data.messages);
        setListIncoming(response.data.messages);
      });
  };
  useEffect(() => {
    getMessages();
  }, []);
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

  const headCells = [
    {
      id: "from",
      numeric: false,
      label: "From",
    },
    {
      id: "body",
      numeric: false,
      label: "Message",
    },

    {
      id: "date_sent",
      numeric: false,
      label: "Date Received",
    },
  ];
  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              size="small"
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
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

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    // rowCount: PropTypes.number.isRequired,
  };
  return (
    <div>
      <Row className="m-3">
        <Col>
          <h3>Incoming Messages</h3>
        </Col>
        <Col>
          {/* <h3 style={{ float: "right", marginRight: "3rem" }}>+</h3> */}
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
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              // rowCount="4"
            />{" "}
            <TableBody>
              {stableSort(listIncoming, getComparator(order, orderBy)).map(
                (announce, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={announce.announce}
                    >
                      <TableCell padding="none" size="small" align="center">
                        {announce.from}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {announce.body}
                      </TableCell>

                      <TableCell padding="none" size="small" align="center">
                        {" "}
                        {new Date(announce.date_sent).toLocaleString(
                          "default",
                          {
                            month: "long",
                          }
                        )}{" "}
                        {new Date(announce.date_sent).getDate()},{" "}
                        {new Date(announce.date_sent).getFullYear()}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </Row>
      </div>
    </div>
  );
}

export default IncomingMessages;
