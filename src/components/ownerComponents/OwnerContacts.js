import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
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
import Header from "../Header";
import SideBar from "./SideBar";
import MailDialogManager from "../MailDialog";
import MessageDialogManager from "../MessageDialog";
import OwnerFooter from "./OwnerFooter";
import AppContext from "../../AppContext";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import Mail from "../../icons/Mail.svg";
import AddIcon from "../../icons/AddIcon.svg";
import ArrowDown from "../../icons/ArrowDown.svg";
import { get, post } from "../../utils/api";
import {
  descendingComparator as descendingComparator,
  getComparator as getComparator,
  stableSort as stableSort,
} from "../../utils/helper";
import {
  smallImg,
  hidden,
  squareForm,
  pillButton,
  small,
  red,
  formLabel,
  sidebarStyle,
} from "../../utils/styles";

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
  const [addContacts, setAddContacts] = useState(false);

  const [contactName, setContactName] = useState("");
  const [contactType, setContactType] = useState("MANAGEMENT");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhoneNumber, setContactPhoneNumber] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  // search variables
  const [search, setSearch] = useState("");
  // sorting variables
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selectedManager, setSelectedManager] = useState("");
  const [showMailFormManager, setShowMailFormManager] = useState(false);
  const [showMessageFormManager, setShowMessageFormManager] = useState(false);
  const onCancelManagerMail = () => {
    setShowMailFormManager(false);
  };
  const onCancelManagerMessage = () => {
    setShowMessageFormManager(false);
  };
  const [width, setWindowWidth] = useState(1024);
  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };
  const responsiveSidebar = {
    showSidebar: width > 1023,
  };

  const fetchContacts = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const response = await get(`/contact?contact_created_by=${user.user_uid}`);

    if (response.msg === "Token has expired") {
      refresh();
      return;
    }

    // console.log(response.result);
    setPropertyManagers(response.result);

    setIsLoading(false);
    // console.log(JSON.parse(response.result[0].contact_locations).length);
    // await getAlerts(properties_unique)
  };

  useEffect(() => {
    fetchContacts();
  }, [access_token]);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const contactsHeadCell = [
    {
      id: "contact_name",
      numeric: false,
      label: "Business Name",
    },
    {
      id: "contact_type",
      numeric: false,
      label: "Business Type",
    },
    {
      id: "contact_email",
      numeric: false,
      label: "Email",
    },
    {
      id: "contact_phone_number",
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
  const submitForm = async () => {
    if (
      contactType === "" ||
      contactName === "" ||
      contactEmail === "" ||
      contactPhoneNumber === ""
    ) {
      setErrorMessage("Please fill out all fields");
      return;
    }

    const newContact = {
      type: contactType,
      name: contactName,
      email: contactEmail,
      phone_number: contactPhoneNumber,
      created_by: user.user_uid,
    };

    // console.log(newContact);
    const response = await post("/contact", newContact);
    setContactName("");
    setContactEmail("");
    setContactPhoneNumber("");
    setContactType("MANAGEMENT");
    setAddContacts(false);
    fetchContacts();
  };
  const [errorMessage, setErrorMessage] = useState("");
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );

  return (
    <div className="w-100 overflow-hidden">
      <MailDialogManager
        title={"Email"}
        isOpen={showMailFormManager}
        senderPhone={user.phone_number}
        senderEmail={user.email}
        senderName={user.first_name + " " + user.last_name}
        requestCreatedBy={user.user_uid}
        userMessaged={selectedManager.contact_name}
        receiverEmail={selectedManager.contact_email}
        receiverPhone={selectedManager.contact_phone_number}
        onCancel={onCancelManagerMail}
      />

      <MessageDialogManager
        title={"Text Message"}
        isOpen={showMessageFormManager}
        senderPhone={user.phone_number}
        senderEmail={user.email}
        senderName={user.first_name + " " + user.last_name}
        requestCreatedBy={user.user_uid}
        userMessaged={selectedManager.contact_name}
        receiverEmail={selectedManager.contact_email}
        receiverPhone={selectedManager.contact_phone_number}
        onCancel={onCancelManagerMessage}
      />
      <Row className="w-100 mb-5 overflow-hidden">
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5">
          <Header title="Contacts" />
          {!isLoading ? (
            <div>
              {addContacts ? (
                <Row className="m-3">
                  <Col>
                    <h3>Create New Contact </h3>
                  </Col>
                  <Col></Col>
                </Row>
              ) : propertyManagers.length > 0 && !addContacts ? (
                <Row className="w-100 m-3">
                  <Col>
                    <h3>Contacts </h3>
                  </Col>
                  <Col>
                    <img
                      src={AddIcon}
                      alt="Add Icon"
                      onClick={() => setAddContacts(true)}
                      style={{
                        width: "30px",
                        height: "30px",
                        float: "right",
                        marginRight: "5rem",
                      }}
                    />
                  </Col>
                </Row>
              ) : (
                <Row className="w-100 m-3">
                  <Col>
                    <h3>Add Contact </h3>
                  </Col>
                  <Col>
                    <img
                      src={AddIcon}
                      alt="Add Icon"
                      onClick={() => setAddContacts(true)}
                      style={{
                        width: "30px",
                        height: "30px",
                        float: "right",
                        marginRight: "5rem",
                      }}
                    />
                  </Col>
                </Row>
              )}

              {addContacts ? (
                <Row className="m-3">
                  <Form.Group className="mx-2 mb-3">
                    <Form.Label as="h6">
                      Contact Name
                      {contactName === "" ? required : ""}
                    </Form.Label>
                    <Form.Control
                      style={squareForm}
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mx-2 mb-3">
                    <Form.Label as="h6">
                      Contact Type
                      {contactType === "" ? required : ""}
                    </Form.Label>
                    <Form.Select
                      style={{
                        ...squareForm,
                        backgroundImage: `url(${ArrowDown})`,
                      }}
                      value={contactType}
                      onChange={(e) => setContactType(e.target.value)}
                    >
                      <option>MANAGEMENT</option>
                      <option>MAINTENANCE</option>
                      <option>OTHER</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mx-2 mb-3">
                    <Form.Label as="h6">
                      Contact Email
                      {contactEmail === "" ? required : ""}
                    </Form.Label>
                    <Form.Control
                      style={squareForm}
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mx-2 mb-3">
                    <Form.Label as="h6">
                      Contact Phone Number{" "}
                      {contactPhoneNumber === "" ? required : ""}
                    </Form.Label>
                    <Form.Control
                      style={squareForm}
                      value={contactPhoneNumber}
                      type="tel"
                      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                      onChange={(e) => setContactPhoneNumber(e.target.value)}
                    />
                  </Form.Group>
                  <div
                    className="text-center"
                    style={errorMessage === "" ? hidden : {}}
                  >
                    <p style={{ ...red, ...small }}>
                      {errorMessage || "error"}
                    </p>
                  </div>
                  <div className="d-flex justify-content-center my-4">
                    <Button
                      variant="outline-primary"
                      style={pillButton}
                      onClick={() => setAddContacts(false)}
                      className="mx-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline-primary"
                      style={pillButton}
                      onClick={() => submitForm()}
                      className="mx-2"
                    >
                      Save Contact
                    </Button>
                  </div>
                </Row>
              ) : propertyManagers.length > 0 && !addContacts ? (
                <div
                  className="mx-3 my-3 p-2"
                  style={{
                    background: "#E9E9E9 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                >
                  <Row className="m-3">
                    <Row className="w-100 m-3">
                      <Col xs={2}> Search by</Col>

                      <Col>
                        <input
                          type="text"
                          placeholder="Search"
                          onChange={(event) => {
                            setSearch(event.target.value);
                          }}
                          style={{
                            width: "400px",
                            border: "1px solid black",
                            padding: "5px",
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="m-3" style={{ overflow: "scroll" }}>
                      <Table
                        responsive="md"
                        classes={{ root: classes.customTable }}
                        size="small"
                      >
                        <EnhancedTableHeadContacts
                          order={order}
                          orderBy={orderBy}
                          onRequestSort={handleRequestSort}
                          rowCount={propertyManagers.length}
                        />{" "}
                        <TableBody>
                          {stableSort(
                            propertyManagers,
                            getComparator(order, orderBy)
                          )
                            // for filtering
                            .filter((val) => {
                              const query = search.toLowerCase();

                              return (
                                val.contact_name.toLowerCase().indexOf(query) >=
                                  0 ||
                                val.contact_type.toLowerCase().indexOf(query) >=
                                  0
                              );
                            })
                            .map((property, index) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={property.contact_name}
                                >
                                  <TableCell
                                    padding="none"
                                    size="small"
                                    align="left"
                                  >
                                    {property.contact_name}
                                  </TableCell>
                                  <TableCell
                                    padding="none"
                                    size="small"
                                    align="center"
                                  >
                                    {property.contact_type}
                                  </TableCell>
                                  <TableCell
                                    padding="none"
                                    size="small"
                                    align="center"
                                  >
                                    {property.contact_email}
                                  </TableCell>
                                  <TableCell
                                    padding="none"
                                    size="small"
                                    align="center"
                                  >
                                    {property.contact_phone_number}
                                  </TableCell>
                                  <TableCell
                                    padding="none"
                                    size="small"
                                    align="center"
                                  >
                                    <div
                                      style={property.contact_uid ? {} : hidden}
                                      onClick={stopPropagation}
                                    >
                                      <a
                                        href={`tel:${property.contact_phone_number}`}
                                      >
                                        <img
                                          src={Phone}
                                          alt="Phone"
                                          style={smallImg}
                                        />
                                      </a>
                                      <a
                                        onClick={() => {
                                          setShowMessageFormManager(true);
                                          setSelectedManager(property);
                                        }}
                                      >
                                        <img
                                          src={Message}
                                          alt="Message"
                                          style={smallImg}
                                        />
                                      </a>
                                      <a
                                        // href={`mailto:${tf.tenantEmail}`}
                                        onClick={() => {
                                          setShowMailFormManager(true);
                                          setSelectedManager(property);
                                        }}
                                      >
                                        <img
                                          src={Mail}
                                          alt="Mail"
                                          style={smallImg}
                                        />
                                      </a>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </Row>
                  </Row>
                </div>
              ) : (
                <Row></Row>
              )}
            </div>
          ) : (
            <div className="w-100 d-flex flex-column justify-content-center align-items-center">
              <ReactBootStrap.Spinner animation="border" role="status" />
            </div>
          )}
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <OwnerFooter />
          </div>{" "}
        </Col>
      </Row>
    </div>
  );
}

export default OwnerContacts;
