import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableSortLabel,
  Box,
} from "@material-ui/core";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import {
  blue,
  gray,
  greenPill,
  orangePill,
  redPill,
  tileImg,
  xSmall,
} from "../../utils/styles";
import Header from "../Header";
import AppContext from "../../AppContext";
import No_Image from "../../icons/No_Image_Available.jpeg";
import { get } from "../../utils/api";

function ManagerRepairsList(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, refresh } = useContext(AppContext);
  const { access_token } = userData;
  const [repairs, setRepairs] = useState([]);
  const [newRepairs, setNewRepairs] = useState([]);
  const [infoRepairs, setInfoRepairs] = useState([]);
  const [processingRepairs, setProcessingRepairs] = useState([]);
  const [scheduledRepairs, setScheduledRepairs] = useState([]);
  const [completedRepairs, setCompletedRepairs] = useState([]);
  const [repairIter, setRepairIter] = useState([]);
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");

  const property = location.state.property;

  const sort_repairs = (repairs) => {
    const repairs_with_quotes = repairs.filter(
      (repair) => repair.quotes_to_review > 0
    );
    repairs_with_quotes.sort(
      (a, b) => b.priority_n - a.priority_n || b.days_since - a.days_since
    );
    const repairs_without_quotes = repairs.filter(
      (repair) => repair.quotes_to_review === 0
    );
    repairs_without_quotes.sort(
      (a, b) => b.priority_n - a.priority_n || b.days_since - a.days_since
    );
    return [...repairs_with_quotes, ...repairs_without_quotes];
  };
  const days = (date_1, date_2) => {
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  };
  const fetchRepairs = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    // const response = await get(`/maintenanceRequests?property_uid=${property.property_uid}`, access_token);
    const response = await get(
      `/maintenanceRequestsandQuotes?property_uid=${property.property_uid}`
    );
    if (response.msg === "Token has expired") {
      refresh();
      return;
    }

    let repairs = response.result.filter(
      (item) => item.property_uid === property.property_uid
    );
    repairs.forEach((repair, i) => {
      const request_created_date = new Date(
        Date.parse(repair.request_created_date)
      );
      const current_date = new Date();
      repairs[i].days_since = Math.ceil(
        (current_date.getTime() - request_created_date.getTime()) /
          (1000 * 3600 * 24)
      );
      repairs[i].quotes_to_review = repair.quotes.filter(
        (quote) => quote.quote_status === "SENT"
      ).length;

      repair.priority_n = 0;
      if (repair.priority.toLowerCase() === "high") {
        repair.priority_n = 3;
      } else if (repair.priority.toLowerCase() === "medium") {
        repair.priority_n = 2;
      } else if (repair.priority.toLowerCase() === "low") {
        repair.priority_n = 1;
      }
    });
    // repairs.sort((a, b) =>  b.quotes_to_review - a.quotes_to_review);
    repairs = sort_repairs(repairs);
    console.log(repairs);
    setRepairs(repairs);

    const new_repairs = repairs.filter((item) => item.request_status === "NEW");
    const info_repairs = repairs.filter(
      (item) => item.request_status === "INFO"
    );
    const processing_repairs = repairs.filter(
      (item) => item.request_status === "PROCESSING"
    );
    const scheduled_repairs = repairs.filter(
      (item) => item.request_status === "SCHEDULED"
    );
    const completed_repairs = repairs.filter(
      (item) => item.request_status === "COMPLETE"
    );
    setNewRepairs(new_repairs);
    setInfoRepairs(info_repairs);
    setProcessingRepairs(processing_repairs);
    setScheduledRepairs(scheduled_repairs);
    setCompletedRepairs(completed_repairs);
    setRepairIter([
      { title: "New", repairs_list: new_repairs },
      { title: "Info Requested", repairs_list: info_repairs },
      { title: "Processing", repairs_list: processing_repairs },
      { title: "Upcoming, Scheduled", repairs_list: scheduled_repairs },
      { title: "Completed", repairs_list: completed_repairs },
    ]);
  };

  useEffect(fetchRepairs, [access_token]);
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
      id: "images",
      numeric: false,
      label: "Repair Images",
    },
    {
      id: "title",
      numeric: false,
      label: "Repair Title",
    },
    {
      id: "desc",
      numeric: false,
      label: "Description",
    },
    {
      id: "address",
      numeric: true,
      label: "address",
    },
    {
      id: "priority",
      numeric: false,
      label: "Priority",
    },
    {
      id: "created_day",
      numeric: false,
      label: "Request Created Date",
    },
    {
      id: "quote_status",
      numeric: false,
      label: "Quote Status",
    },
    // {
    //   id: "late_date",
    //   numeric: true,
    //   label: "Days Late",
    // },
    // {
    //   id: "num_maintenanceRequests",
    //   numeric: true,
    //   label: "Maintenance Requests Open",
    // },
    // {
    //   id: "oldestOpenMR",
    //   numeric: true,
    //   label: "Longest duration",
    // },
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
              align={headCell.numeric ? "right" : "left"}
              padding={"normal"}
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
    rowCount: PropTypes.number.isRequired,
  };
  return (
    <div
      className="h-100 pb-5 mb-5"
      style={{
        background: "#E9E9E9 0% 0% no-repeat padding-box",
        borderRadius: "10px",
        opacity: 1,
      }}
    >
      <Header
        title="Repairs"
        leftText="< Back"
        leftFn={() => navigate(-1)}
        rightText="Sort by"
      />
      <div
        className="mx-2 my-2 p-3"
        style={{
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        {repairIter.map(
          (row, i) =>
            row.repairs_list.length > 0 && (
              <div className="mb-5" key={i}>
                <h4 className="mt-2 mb-3" style={{ fontWeight: "600" }}>
                  {row.title}
                </h4>

                {row.repairs_list.map((repair, j) => (
                  <Row
                    className="mb-4"
                    key={j}
                    onClick={() =>
                      navigate(`./${repair.maintenance_request_uid}`, {
                        state: { repair: repair, property: property },
                      })
                    }
                  >
                    <Col xs={4}>
                      <div style={tileImg}>
                        {JSON.parse(repair.images).length > 0 ? (
                          <img
                            src={JSON.parse(repair.images)[0]}
                            alt="Repair Image"
                            className="h-100 w-100"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <img
                            src={No_Image}
                            alt="No Repair Image"
                            className="h-100 w-100"
                            style={{ borderRadius: "4px", objectFit: "cover" }}
                          />
                        )}
                      </div>
                    </Col>
                    <Col className="ps-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0" style={{ fontWeight: "600" }}>
                          {repair.title}
                        </h5>
                        {repair.priority === "Low" ? (
                          <p style={greenPill} className="mb-0">
                            Low Priority
                          </p>
                        ) : repair.priority === "Medium" ? (
                          <p style={orangePill} className="mb-0">
                            Medium Priority
                          </p>
                        ) : repair.priority === "High" ? (
                          <p style={redPill} className="mb-0">
                            High Priority
                          </p>
                        ) : (
                          <p style={greenPill} className="mb-0">
                            No Priority
                          </p>
                        )}
                      </div>
                      <p style={gray} className="mt-2 mb-0">
                        {property.address}
                        {property.unit !== "" ? " " + property.unit : ""},{" "}
                        {property.city}, {property.state} <br />
                        {property.zip}
                      </p>
                      <div className="d-flex">
                        <div className="flex-grow-1 d-flex flex-column justify-content-center">
                          <p style={{ ...blue, ...xSmall }} className="mb-0">
                            Requested{" "}
                            {days(
                              new Date(repair.request_created_date),
                              new Date()
                            )}{" "}
                            days ago
                          </p>
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="flex-grow-1 d-flex flex-column justify-content-center">
                          <p style={{ ...blue, ...xSmall }} className="mb-0">
                            Request Created on{" "}
                            {repair.request_created_date.split(" ")[0]}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="flex-grow-1 d-flex flex-column justify-content-center">
                          <p style={{ ...blue, ...xSmall }} className="mb-0">
                            {repair.quotes_to_review > 0
                              ? `${repair.quotes_to_review} new quote(s) to review`
                              : "No new quotes"}
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                ))}
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default ManagerRepairsList;
