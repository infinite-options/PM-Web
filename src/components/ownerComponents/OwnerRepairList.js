import React, { useState, useEffect, useContext } from "react";
import { Row } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableSortLabel,
  Box,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import * as ReactBootStrap from "react-bootstrap";
import Header from "../Header";
import SideBar from "./SideBar";
import OwnerRepairRequest from "./OwnerRepairRequest";
import AppContext from "../../AppContext";
import { get } from "../../utils/api";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

function OwnerRepairList(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [repairIter, setRepairIter] = useState([]);
  const [stage, setStage] = useState("LIST");
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");

  const fetchProperties = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }
    const response = await get(`/propertiesOwner?owner_id=${user.user_uid}`);

    const properties = response.result;
    const pids = new Set();
    const properties_unique = [];
    properties.forEach((property) => {
      if (pids.has(property.property_uid)) {
        // console.log("here in if");
        // properties_unique[properties_unique.length-1].tenants.push(property)
        const index = properties_unique.findIndex(
          (item) => item.property_uid === property.property_uid
        );
        if (
          property.rental_status === "ACTIVE" ||
          property.rental_status === "PROCESSING"
        ) {
          // console.log("here", property);
          properties_unique[index].tenants.push(property.rentalInfo);
        }
      } else {
        // console.log("here in else");
        pids.add(property.property_uid);
        properties_unique.push(property);
        if (
          property.rental_status === "ACTIVE" ||
          property.rental_status === "PROCESSING"
        ) {
          // console.log("here", property);
          properties_unique[properties_unique.length - 1].tenants = [
            property.rentalInfo,
          ];
        }
      }
    });

    setProperties(properties_unique);
  };
  useEffect(() => {
    if (access_token === null) {
      navigate("/");
    }
    fetchProperties();
  }, [access_token]);

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

  const sort_repairs_address = (repairs) => {
    repairs.forEach((repair, i) => {
      console.log("");
    });
  };

  const fetchRepairs = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }
    const response = await get(
      `/maintenanceRequestsandQuotes?owner_id=${user.user_uid}`
    );
    if (response.msg === "Token has expired") {
      refresh();
      return;
    }

    let repairI = [];
    let repairIT = [];
    let new_repairs = [];
    let info_repairs = [];
    let processing_repairs = [];
    let scheduled_repairs = [];
    let completed_repairs = [];
    let newrepairs = "";
    let inforepairs = "";
    let processingrepairs = "";
    let scheduledrepairs = "";
    let completedrepairs = "";
    for (let r = 0; r < response.result.length; r++) {
      console.log(response.result[r]);

      let repairs = response.result[r].maintenanceRequests;
      repairs.forEach((repair, i) => {
        console.log(repair);
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
      console.log("repairs unsorted", repairs);
      let repairs_sorted = sort_repairs(repairs);
      sort_repairs_address(repairs);
      console.log("repairs sorted", repairs_sorted);

      repairs_sorted.forEach((repair_sorted, i) => {
        // console.log("repairs sorted in for each ", i, repair_sorted);

        if (repair_sorted.request_status === "NEW") {
          newrepairs = repair_sorted;
          new_repairs.push(newrepairs);
        } else if (repair_sorted.request_status === "INFO") {
          inforepairs = repair_sorted;
          info_repairs.push(inforepairs);
        } else if (repair_sorted.request_status === "PROCESSING") {
          processingrepairs = repair_sorted;
          processing_repairs.push(processingrepairs);
        } else if (repair_sorted.request_status === "SCHEDULED") {
          scheduledrepairs = repair_sorted;
          scheduled_repairs.push(scheduledrepairs);
        } else {
          completedrepairs = repair_sorted;
          completed_repairs.push(completedrepairs);
        }
      });

      repairI = [
        { title: "New", repairs_list: new_repairs },
        { title: "Info Requested", repairs_list: info_repairs },
        { title: "Processing", repairs_list: processing_repairs },
        { title: "Upcoming, Scheduled", repairs_list: scheduled_repairs },
        { title: "Completed", repairs_list: completed_repairs },
      ];
      console.log(repairI);
      repairIT.push(repairI);
      // setRepairIter(repairI.push(repairI));
    }
    console.log("repairs_sorted", repairI, repairIT);
    setRepairIter(repairI);
  };
  useEffect(() => {
    if (access_token === null) {
      navigate("/");
    }
    fetchRepairs();
  }, [access_token]);
  // console.log(repairIter);
  const days = (date_1, date_2) => {
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
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

  const headCells = [
    {
      id: "images",
      numeric: false,
      label: "Repair Images",
    },
    {
      id: "status",
      numeric: false,
      label: "Status",
    },
    {
      id: "title",
      numeric: false,
      label: "Issue",
    },
    {
      id: "description",
      numeric: false,
      label: "Description",
    },
    {
      id: "address",
      numeric: false,
      label: "Address",
    },
    {
      id: "priority",
      numeric: false,
      label: "Priority",
    },
    {
      id: "request_created_date",
      numeric: false,
      label: "Date Reported",
    },
    {
      id: `days_open`,
      numeric: true,
      label: "Days Open",
    },
    {
      id: "quote_status",
      numeric: false,
      label: "Quote Status",
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

  return stage === "LIST" ? (
    <div>
      <Header
        title="Repairs"
        rightText="+ New"
        rightFn={() => setStage("ADDREQUEST")}
      />
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div className="w-100">
          <div
            className="mx-2 my-2 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            {repairIter.length > 1 ? (
              <Row className="m-3">
                <Table classes={{ root: classes.customTable }} size="small">
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    // rowCount="4"
                  />{" "}
                  <TableBody>
                    {repairIter.map((row, index) => {
                      return stableSort(
                        row.repairs_list,
                        getComparator(order, orderBy)
                      ).map((repair, j) => (
                        <TableRow hover role="checkbox" tabIndex={-1} key={j}>
                          <TableCell padding="none" size="small" align="center">
                            {JSON.parse(repair.images).length > 0 ? (
                              <img
                                src={JSON.parse(repair.images)[0]}
                                // onClick={() => selectRepair(repair)}
                                onClick={() => {
                                  navigate(
                                    `/owner-repairs/${repair.maintenance_request_uid}`,
                                    {
                                      state: {
                                        repair: repair,
                                        property: repair.address,
                                      },
                                    }
                                  );
                                }}
                                alt="repair"
                                style={{
                                  borderRadius: "4px",
                                  objectFit: "cover",
                                  width: "100px",
                                  height: "100px",
                                }}
                              />
                            ) : (
                              ""
                            )}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {row.title}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {repair.title}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {repair.description}
                          </TableCell>

                          <TableCell padding="none" size="small" align="center">
                            {repair.address}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {repair.priority}
                          </TableCell>

                          <TableCell padding="none" size="small" align="center">
                            {repair.request_created_date.split(" ")[0]}
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {repair.days_open} days
                          </TableCell>
                          <TableCell padding="none" size="small" align="center">
                            {repair.quotes_to_review > 0
                              ? `${repair.quotes_to_review} new quote(s) to review`
                              : "No new quotes"}
                          </TableCell>
                        </TableRow>
                      ));
                    })}
                  </TableBody>
                </Table>
              </Row>
            ) : (
              <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                <ReactBootStrap.Spinner animation="border" role="status" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : stage === "ADDREQUEST" ? (
    <div className="OwnerReapirRequest">
      <Header title="Add Repair Request" />
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div className="w-100">
          <OwnerRepairRequest
            properties={properties}
            cancel={() => setStage("LIST")}
            // onSubmit={addRequest}
          />
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default OwnerRepairList;
