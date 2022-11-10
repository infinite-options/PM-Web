import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
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
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import SideBar from "./managerComponents/SideBar";
import Header from "../components/Header";
import AppContext from "../AppContext";
import { get, put } from "../utils/api";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import {
  mediumBold,
  xSmall,
  blue,
  smallImg,
  hidden,
  gray,
  pillButton,
} from "../utils/styles";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 16px 6px 16px", // <-- arbitrary value
    },
  },
});

function ManagerOwnerList(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const fetchProperties = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length < 1) {
      console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
    } else {
      management_buid = management_businesses[0].business_uid;
    }

    const response = await get(`/managerClients?manager_id=` + management_buid);

    if (response.msg === "Token has expired") {
      refresh();
      return;
    }

    // console.log(response.result);
    setOwners(response.result);
    setSelectedOwner(response.result[0]);
    console.log(selectedOwner);
    // await getAlerts(properties_unique)
  };

  useEffect(fetchProperties, [access_token]);
  const stopPropagation = (e) => {
    e.stopPropagation();
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
      id: "owner_last_name",
      numeric: false,
      label: "Name",
    },

    {
      id: "owner_phone_number",
      numeric: true,
      label: "Phone Number",
    },
    {
      id: "owner_email",
      numeric: false,
      label: "Email address",
    },
    {
      id: "properties",
      numeric: false,
      label: "Properties",
    },
    {
      id: "actions",
      numeric: false,
      label: "Actions",
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
    rowCount: PropTypes.number.isRequired,
  };

  return (
    <div className="pb-5 mb-5 h-100">
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div
          className="w-100 m-3"
          style={{
            width: "calc(100vw - 13rem)",
            position: "relative",
          }}
        >
          <br />
          {/* <Header
            title="Owner Info"
            leftText="<Back"
            leftFn={() => navigate("/manager")}
          /> */}
          {/* <Row className="w-100 m-3">
            {owners.map((owner, i) => (
              <Container
                key={i}
                className="p-3 mb-2"
                style={{
                  boxShadow: " 0px 1px 6px #00000029",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                <Row
                  onClick={() => {
                    setShowDetails(!showDetails);
                    setSelectedOwner(owner);
                  }}
                >
                  <Col className="ps-0" xs={8}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0" style={{ fontWeight: "600" }}>
                        {owner.owner_first_name} {owner.owner_last_name}
                      </h5>
                    </div>
                  </Col>
                  <Col>
                    <div className="d-flex  justify-content-end ">
                      <div
                        style={owner.owner_id ? {} : hidden}
                        onClick={stopPropagation}
                      >
                        <a href={`tel:${owner.owner_phone_number}`}>
                          <img src={Phone} alt="Phone" style={smallImg} />
                        </a>
                        <a href={`mailto:${owner.owner_email}`}>
                          <img src={Message} alt="Message" style={smallImg} />
                        </a>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row
                  style={{
                    font: "normal normal 600 16px/22px Bahnschrift-Regular",
                    color: "#007AFF",
                  }}
                >
                  {owner.properties.length} Properties
                </Row>
                {showDetails && selectedOwner.owner_id === owner.owner_id ? (
                  <Row className="mx-2">
                    {selectedOwner.properties.map((property, i) => {
                      return (
                        <Row
                          className="p-1"
                          style={{
                            background:
                              i % 2 === 0
                                ? "#FFFFFF 0% 0% no-repeat padding-box"
                                : "#F3F3F3 0% 0% no-repeat padding-box",
                            font: "normal normal normal 16px Bahnschrift-Regular",
                          }}
                        >
                          {property.address}
                          {property.unit !== "" ? ` ${property.unit}, ` : ", "}
                          {property.city}, {property.state} {property.zip}
                        </Row>
                      );
                    })}
                  </Row>
                ) : null}
              </Container>
            ))}
          </Row>  */}
          <Row className="m-3">
            <Table classes={{ root: classes.customTable }} size="small">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={owners.length}
              />{" "}
              <TableBody>
                {stableSort(owners, getComparator(order, orderBy))
                  // for filtering
                  .filter((val) => {
                    const query = search.toLowerCase();
                    return (
                      val.owner_first_name.toLowerCase().indexOf(query) >= 0
                    );
                  })
                  .map((owner, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell
                          padding="none"
                          size="small"
                          align="center"
                          onClick={() => {
                            setShowDetails(!showDetails);
                            setSelectedOwner(owner);
                          }}
                        >
                          {owner.owner_first_name} {owner.owner_last_name}
                        </TableCell>

                        <TableCell padding="none" size="small" align="center">
                          {owner.owner_phone_number}
                        </TableCell>

                        <TableCell padding="none" size="small" align="center">
                          {owner.owner_email}
                        </TableCell>
                        <TableCell>
                          {owner.properties.map((property, i) => {
                            return (
                              <Row
                                className="p-1"
                                style={{
                                  background:
                                    i % 2 === 0
                                      ? "#FFFFFF 0% 0% no-repeat padding-box"
                                      : "#F3F3F3 0% 0% no-repeat padding-box",
                                  font: "normal normal normal 16px Bahnschrift-Regular",
                                }}
                              >
                                {property.address}
                                {property.unit !== ""
                                  ? ` ${property.unit}, `
                                  : ", "}
                                {property.city}, {property.state} {property.zip}
                              </Row>
                            );
                          })}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          <div className="d-flex  justify-content-end ">
                            <div
                              style={owner.owner_id ? {} : hidden}
                              onClick={stopPropagation}
                            >
                              <a href={`tel:${owner.owner_phone_number}`}>
                                <img src={Phone} alt="Phone" style={smallImg} />
                              </a>
                              <a href={`mailto:${owner.owner_email}`}>
                                <img
                                  src={Message}
                                  alt="Message"
                                  style={smallImg}
                                />
                              </a>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Row>
          {/* {showDetails ? (
            <Row className="mx-2">
              {selectedOwner.properties.map((property, i) => {
                return (
                  <Row
                    className="p-1"
                    style={{
                      background:
                        i % 2 === 0
                          ? "#FFFFFF 0% 0% no-repeat padding-box"
                          : "#F3F3F3 0% 0% no-repeat padding-box",
                      font: "normal normal normal 16px Bahnschrift-Regular",
                    }}
                  >
                    {property.address}
                    {property.unit !== "" ? ` ${property.unit}, ` : ", "}
                    {property.city}, {property.state} {property.zip}
                  </Row>
                );
              })}
            </Row>
          ) : null} */}
        </div>
      </div>
    </div>
  );
}

export default ManagerOwnerList;
