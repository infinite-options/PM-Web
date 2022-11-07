import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
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
import * as ReactBootStrap from "react-bootstrap";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import Header from "../components/Header";
import SideBar from "../components/ownerComponents/SideBar";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import Mail from "../icons/Mail.svg";
import AppContext from "../AppContext";
import { get } from "../utils/api";
import { smallImg, hidden, gray } from "../utils/styles";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});

function OwnerContacts() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [propertyManagers, setPropertyManagers] = useState([]);

  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");

  const fetchContacts = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const response = await get(`/businesses`);

    if (response.msg === "Token has expired") {
      refresh();
      return;
    }

    console.log(response.result);
    setPropertyManagers(response.result);
    console.log(JSON.parse(response.result[0].business_locations).length);
    // await getAlerts(properties_unique)
  };

  useEffect(fetchContacts, [access_token]);
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

  const contactsHeadCell = [
    {
      id: "business_name",
      numeric: false,
      label: "Business Name",
    },
    {
      id: "business_type",
      numeric: false,
      label: "Business Type",
    },
    {
      id: "business_email",
      numeric: false,
      label: "Email",
    },
    {
      id: "business_phone_number",
      numeric: true,
      label: "Phone Number",
    },
    {
      id: "actions",
      numeric: false,
      label: "Actions",
    },
  ];
  function EnhancedTableHeadContacts(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {contactsHeadCell.map((headCell) => (
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

  EnhancedTableHeadContacts.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  return (
    <div>
      <Header title="Contacts" />
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div className="w-100">
          <Row className="w-100 m-3">
            <Col> Search by</Col>

            <Col>
              <input
                type="text"
                placeholder="Search"
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
              />
            </Col>
          </Row>
          <Row className="m-3">
            <Table classes={{ root: classes.customTable }} size="small">
              <EnhancedTableHeadContacts
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={propertyManagers.length}
              />{" "}
              <TableBody>
                {stableSort(propertyManagers, getComparator(order, orderBy))
                  // for filtering
                  .filter((val) => {
                    const query = search.toLowerCase();

                    return (
                      val.business_name.toLowerCase().indexOf(query) >= 0 ||
                      val.business_type.toLowerCase().indexOf(query) >= 0
                    );
                  })
                  .map((property, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={property.business_name}
                      >
                        <TableCell padding="none" size="small" align="left">
                          {property.business_name}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {property.business_type}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {property.business_email}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          {property.business_phone_number}
                        </TableCell>
                        <TableCell padding="none" size="small" align="center">
                          <div
                            style={property.business_uid ? {} : hidden}
                            onClick={stopPropagation}
                          >
                            <a href={`tel:${property.business_phone_number}`}>
                              <img src={Phone} alt="Phone" style={smallImg} />
                            </a>
                            <a href={`mailto:${property.business_email}`}>
                              <img
                                src={Message}
                                alt="Message"
                                style={smallImg}
                              />
                            </a>
                            <a href={`mailto:${property.business_email}`}>
                              <img src={Mail} alt="Mail" style={smallImg} />
                            </a>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Row>
          {/* <div
            className="mx-2 my-2 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            {propertyManagers.map((property, i) => (
              <Container key={i} className="pt-1" style={{ height: "100px" }}>
                <Row className="h-100">
                  <Col className="ps-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0" style={{ fontWeight: "600" }}>
                        {property.business_name}
                      </h5>
                    </div>
                    <div>
                      <p style={gray} className="mt-1 mb-0">
                        {property.business_type}
                      </p>
                    </div>
                  </Col>
                  <Col>
                    <div className="d-flex  justify-content-end ">
                      <div
                        style={property.business_uid ? {} : hidden}
                        onClick={stopPropagation}
                      >
                        <a href={`tel:${property.business_phone_number}`}>
                          <img src={Phone} alt="Phone" style={smallImg} />
                        </a>
                        <a href={`mailto:${property.business_email}`}>
                          <img src={Message} alt="Message" style={smallImg} />
                        </a>
                        <a href={`mailto:${property.business_email}`}>
                          <img src={Mail} alt="Mail" style={smallImg} />
                        </a>
                      </div>
                    </div>
                  </Col>
                  <hr />
                </Row>
              </Container>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default OwnerContacts;
