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
import SideBar from "./SideBar";
import Header from "../Header";
import ManagerFooter from "./ManagerFooter";
import AppContext from "../../AppContext";
import MessageDialog from "../MessageDialog";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import { get, put } from "../../utils/api";
import { smallImg, hidden } from "../../utils/styles";

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
  const [selectedOwner, setSelectedOwner] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [width, setWindowWidth] = useState(0);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const onCancel = () => {
    setShowMessageForm(false);
  };
  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };
  const responsive = {
    showSidebar: width > 1023,
  };
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
    if (response.result.length > 0) {
      setSelectedOwner(response.result[0]);
    }
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
    <div className="w-100 overflow-hidden">
      <div className="flex-1">
        <MessageDialog
          title={"Message"}
          isOpen={showMessageForm}
          senderPhone={user.phone_number}
          senderEmail={user.email}
          senderName={user.first_name + " " + user.last_name}
          requestCreatedBy={user.user_uid}
          userMessaged={selectedOwner.owner_id}
          receiverEmail={selectedOwner.owner_email}
          onCancel={onCancel}
        />
        <div
          hidden={!responsive.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </div>
        <div className="w-100  mb-5">
          <Header title="Owners" />
          <Row className="m-3">
            <Col>
              <h3>Owners</h3>
            </Col>
            <Col>
              {/* <h1 style={{ float: "right", marginRight: "3rem" }}>+</h1> */}
            </Col>
          </Row>
          {owners.length > 0 ? (
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
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                            onClick={() => {
                              setShowDetails(!showDetails);
                              setSelectedOwner(owner);
                            }}
                          >
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {owner.owner_first_name} {owner.owner_last_name}
                            </TableCell>

                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {owner.owner_phone_number}
                            </TableCell>

                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {owner.owner_email}
                            </TableCell>
                            <TableCell>
                              {owner.properties.map((property, i) => {
                                return (
                                  <Row
                                    onClick={() => {
                                      navigate(
                                        `/managerPropertyDetails/${property.property_uid}`,
                                        {
                                          state: {
                                            property: property,
                                            property_uid: property.property_uid,
                                          },
                                        }
                                      );
                                    }}
                                    className="p-1"
                                    style={{
                                      cursor: "pointer",
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
                                    {property.city}, {property.state}{" "}
                                    {property.zip}
                                  </Row>
                                );
                              })}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              <div className="d-flex  justify-content-end ">
                                <div
                                  style={owner.owner_id ? {} : hidden}
                                  onClick={stopPropagation}
                                >
                                  <a href={`tel:${owner.owner_phone_number}`}>
                                    <img
                                      src={Phone}
                                      alt="Phone"
                                      style={smallImg}
                                    />
                                  </a>
                                  <a
                                    onClick={() => {
                                      setShowMessageForm(true);
                                      setSelectedOwner(owner);
                                    }}
                                  >
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
            </div>
          ) : (
            <div className="m-3">No active owners</div>
          )}
        </div>
      </div>
      <div hidden={responsive.showSidebar} className="w-100 mt-3">
        <ManagerFooter />
      </div>
    </div>
  );
}

export default ManagerOwnerList;
