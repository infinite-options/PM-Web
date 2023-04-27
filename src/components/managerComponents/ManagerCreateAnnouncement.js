import React, { useState, useContext, useEffect } from "react";
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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import { useNavigate } from "react-router-dom";
import * as ReactBootStrap from "react-bootstrap";
import Checkbox from "../Checkbox";
import Header from "../Header";
import AppContext from "../../AppContext";
import SideBar from "./SideBar";
import ManagerFooter from "./ManagerFooter";
import { post, get, put } from "../../utils/api";
import DeleteIcon from "../../icons/DeleteIcon.svg";
import ThreeDots from "../../icons/Threedots.gif";
import {
  pillButton,
  squareForm,
  small,
  red,
  hidden,
  headings,
  mediumBold,
  sidebarStyle,
} from "../../utils/styles";
import IncomingMessages from "./IncomingMessages";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});
function ManagerCreateAnnouncement(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { userData, refresh, ably } = useContext(AppContext);
  const { access_token, user } = userData;
  const [properties, setProperties] = useState([]);
  const [newTenants, setNewTenants] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [owners, setOwners] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [managerID, setManagerID] = useState("");
  const [announcementState, setAnnouncementState] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(false);
  const [propertyState, setPropertyState] = useState([]);
  const [newTenantsState, setNewTenantsState] = useState([]);
  const [tenantState, setTenantState] = useState([]);
  const [ownerState, setOwnerState] = useState([]);
  const [failed, setFailed] = useState([]);
  const [byProperty, setByProperty] = useState(false);
  const [byTenants, setByTenants] = useState(false);
  const [byNewTenants, setByNewTenants] = useState(false);
  const [byOwners, setByOwners] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showDialogSendingText, setShowDialogSendingText] = useState(false);
  const [showDialogSendingEmail, setShowDialogSendingEmail] = useState(false);
  const [showSendingFailed, setShowSendingFailed] = useState(false);
  const [announcementDetail, setAnnouncementDetail] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
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
  const channel = ably.channels.get(`announcements`);
  const emptyAnnouncement = {
    pm_id: "",
    announcement_title: "",
    announcement_msg: "",
    announcement_mode: "",
    receiver: [],
    receiver_properties: [],
  };
  const [errorMessage, setErrorMessage] = useState("");
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
      // console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      // console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
    } else {
      management_buid = management_businesses[0].business_uid;
    }
    setManagerID(management_buid);
    const response = await get("/managerDashboard", access_token);

    setIsLoading(false);

    if (response.msg === "Token has expired") {
      // console.log("here msg");
      refresh();

      return;
    }
    const responseAnnouncement = await get(
      `/announcement?pm_id=${management_buid}`
    );

    let response_announcement = responseAnnouncement.result;
    response_announcement = response_announcement
      .sort((a, b) => {
        return (
          new Date(a.date_announcement).getTime() -
          new Date(b.date_announcement).getTime()
        );
      })
      .reverse();

    setAnnouncements(responseAnnouncement.result);
    const properties = response.result.filter(
      (property) => property.management_status !== "REJECTED"
    );

    const properties_unique = [];
    const pids = new Set();
    const mr = [];
    properties.forEach((property) => {
      if (pids.has(property.property_uid)) {
        // properties_unique[properties_unique.length-1].tenants.push(property)
        const index = properties_unique.findIndex(
          (item) => item.property_uid === property.property_uid
        );
        if (
          property.rental_status === "ACTIVE" ||
          property.rental_status === "PROCESSING"
        ) {
          properties_unique[index].tenants.push(property);
        }
      } else {
        pids.add(property.property_uid);
        properties_unique.push(property);
        if (
          property.rental_status === "ACTIVE" ||
          property.rental_status === "PROCESSING"
        ) {
          properties_unique[properties_unique.length - 1].tenants = [property];
        }
      }
    });
    // console.log(properties_unique);
    let new_tenant_info = [];
    let new_tenant_details = {
      tenant_id: "",
      tenant_name: "",
      address: "",
      property_uid: "",
    };
    let tenant_info = [];
    let tenant_details = {
      tenant_id: "",
      tenant_name: "",
      address: "",
      property_uid: "",
    };
    let owner_info = [];
    let owner_details = {
      owner_id: "",
      owner_name: "",
      address: "",
      property_uid: "",
    };
    properties_unique.forEach((property) => {
      // console.log(
      //   property,
      //   property.property_uid,
      //   property.rentalInfo,
      //   property.owner_id
      // );
      if (property.owner_id !== "") {
        owner_details = {
          owner_id: property.owner_id,
          owner_name:
            property.owner_first_name + " " + property.owner_last_name,
          property_uid: property.property_uid,
          address:
            property.address +
            " " +
            property.unit +
            ", " +
            property.city +
            ", " +
            property.state +
            " " +
            property.zip,
        };
        owner_info.push(owner_details);
      }
      if (property.rentalInfo !== "Not Rented") {
        property.rentalInfo.forEach((tenant) => {
          tenant_details = {
            tenant_id: tenant.tenant_id,
            tenant_name:
              tenant.tenant_first_name + " " + tenant.tenant_last_name,
            property_uid: property.property_uid,
            address:
              property.address +
              " " +
              property.unit +
              ", " +
              property.city +
              ", " +
              property.state +
              " " +
              property.zip,
          };
          tenant_info.push(tenant_details);
        });
      }
      if (
        property.rentalInfo === "Not Rented" ||
        property.rentalInfo === "" ||
        property.rentalInfo[0].rental_status !== "ACTIVE"
      ) {
        property.applications.forEach((tenant) => {
          new_tenant_details = {
            tenant_id: tenant.tenant_id,
            tenant_name:
              tenant.tenant_first_name + " " + tenant.tenant_last_name,
            property_uid: property.property_uid,
            address:
              property.address +
              " " +
              property.unit +
              ", " +
              property.city +
              ", " +
              property.state +
              " " +
              property.zip,
          };
          new_tenant_info.push(new_tenant_details);
        });
      }
    });
    // console.log(tenant_info);
    setNewTenants(new_tenant_info);
    setNewTenantsState(new_tenant_info);
    setTenants(tenant_info);
    setTenantState(tenant_info);
    setOwners(owner_info);
    setOwnerState(owner_info);
    setProperties(properties_unique);
    setPropertyState(properties_unique);
  };
  useEffect(() => {
    // console.log("in use effect");
    fetchProperties();
  }, [deleted]);
  const deleteAnnouncement = async (announcement_id) => {
    let delAnnouncement = {
      announcement_uid: announcement_id,
    };
    const response = await put("/DeleteAnnouncement", delAnnouncement);
    setDeleted(!deleted);
    channel.publish({ data: { te: delAnnouncement } });
  };
  //post announcements to database and send out emails
  const postAnnouncement = async (newAnnouncement) => {
    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length < 1) {
      // console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      // console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
    } else {
      management_buid = management_businesses[0].business_uid;
    }
    setManagerID(management_buid);

    let receiver_uid = [];
    let receiver_properties_id = [];
    if (byProperty) {
      newAnnouncement.properties.forEach((prop) =>
        prop.rentalInfo !== "Not Rented"
          ? prop.rentalInfo.map((tf, i) => receiver_uid.push(tf.tenant_id))
          : ""
      );
      newAnnouncement.properties.forEach((prop) =>
        prop.rentalInfo !== "Not Rented"
          ? receiver_properties_id.push(prop.property_uid)
          : ""
      );
    }
    if (byTenants) {
      newAnnouncement.tenants.forEach((tenant) => {
        receiver_uid.push(tenant.tenant_id);
        receiver_properties_id.push(tenant.property_uid);
      });
    }
    if (byNewTenants) {
      newAnnouncement.newTenants.forEach((tenant) => {
        receiver_uid.push(tenant.tenant_id);
        receiver_properties_id.push(tenant.property_uid);
      });
    }
    if (byOwners) {
      newAnnouncement.owners.forEach((owner) => {
        receiver_uid.push(owner.owner_id);
        receiver_properties_id.push(owner.property_uid);
      });
    }
    const new_announcement = {
      pm_id: managerID,
      announcement_title: newAnnouncement.announcement_title,
      announcement_msg: newAnnouncement.announcement_msg,
      announcement_mode: byNewTenants
        ? "New Tenants"
        : byTenants
        ? "Tenants"
        : byProperty
        ? "Properties"
        : "Owners",
      receiver: receiver_uid,
      receiver_properties: receiver_properties_id,
    };
    setShowSpinner(true);
    const response = await post("/announcement", new_announcement);
    channel.publish({ data: { te: new_announcement } });
    setNewAnnouncement({ ...emptyAnnouncement });

    propertyState.forEach((prop) => (prop.checked = false));
    setPropertyState(propertyState);
    newTenantsState.forEach((prop) => (prop.checked = false));
    setNewTenantsState(newTenantsState);
    tenantState.forEach((prop) => (prop.checked = false));
    setTenantState(tenantState);
    ownerState.forEach((prop) => (prop.checked = false));
    setOwnerState(ownerState);
    setShowDialogSendingText(true);
    const newText = {
      announcement_msg: new_announcement.announcement_msg,
      announcement_title: new_announcement.announcement_title,
      name: response["name"],
      pno: response["pno"],
      sender_name: management_businesses[0]["business_name"],
      sender_phone: management_businesses[0]["business_phone_number"],
    };
    // console.log(newText);
    const responseText = await post("/messageGroupText", newText);
    setShowDialogSendingText(false);
    setShowDialogSendingEmail(true);
    const newMail = {
      announcement_msg: new_announcement.announcement_msg,
      announcement_title: new_announcement.announcement_title,
      name: response["name"],
      email: response["email"],
      sender_name: management_businesses[0]["business_name"],
      sender_email: management_businesses[0]["business_email"],
    };
    // console.log(newMail);
    const responseEmail = await post("/messageGroupEmail", newMail);
    setShowDialogSendingEmail(false);
    setShowSpinner(false);
    let failedMessages = [];
    for (let i = 0; i < responseText.message.length; i++) {
      if (responseText["message"][i].includes("failed")) {
        failedMessages.push(responseText["message"][i]);
      }
    }
    for (let i = 0; i < responseEmail.message.length; i++) {
      if (responseEmail["message"][i].includes("failed")) {
        failedMessages.push(responseEmail["message"][i]);
      }
    }
    setFailed(failedMessages);
    setShowSendingFailed(true);
    setEditingAnnouncement(null);
    const newAnnouncementState = [...announcementState];
    newAnnouncementState.push({ ...newAnnouncement });
    setAnnouncementState(newAnnouncementState);
    setNewAnnouncement(null);

    fetchProperties();
  };

  // onclick save button
  const addAnnouncement = async () => {
    if (newAnnouncement.announcement_msg === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    if (byProperty) {
      if (propertyState.filter((p) => p.checked).length < 1) {
        setErrorMessage("Select at least one property");
        return;
      }
      newAnnouncement.properties = [...propertyState.filter((p) => p.checked)];
    }
    if (byNewTenants) {
      if (newTenantsState.filter((p) => p.checked).length < 1) {
        setErrorMessage("Select at least one tenant");
        return;
      }
      newAnnouncement.newTenants = [
        ...newTenantsState.filter((p) => p.checked),
      ];
    }
    if (byTenants) {
      if (tenantState.filter((p) => p.checked).length < 1) {
        setErrorMessage("Select at least one tenant");
        return;
      }
      newAnnouncement.tenants = [...tenantState.filter((p) => p.checked)];
    }
    if (byOwners) {
      if (ownerState.filter((p) => p.checked).length < 1) {
        setErrorMessage("Select at least one owner");
        return;
      }
      newAnnouncement.owners = [...ownerState.filter((p) => p.checked)];
    }

    setErrorMessage("");

    await postAnnouncement(newAnnouncement);

    // fetchProperties();
  };
  const cancelEdit = () => {
    setNewAnnouncement(null);
    setErrorMessage("");
    if (editingAnnouncement !== null) {
      const newAnnouncementState = [...announcementState];
      newAnnouncementState.push(editingAnnouncement);
      setAnnouncementState(newAnnouncementState);
    }
    setEditingAnnouncement(null);
  };

  const changenewAnnouncement = (event, field) => {
    const changedAnnouncement = { ...newAnnouncement };
    if (event.target.type === "checkbox") {
      changedAnnouncement[field] = event.target.checked;
    } else {
      changedAnnouncement[field] = event.target.value;
    }
    // changedAnnouncement[field] = event.target.value;
    setNewAnnouncement(changedAnnouncement);
  };
  const toggleProperty = (i) => {
    const newPropertyState = [...propertyState];
    newPropertyState[i].checked = !newPropertyState[i].checked;
    setPropertyState(newPropertyState);
  };
  const toggleNewTenant = (i) => {
    const newTenantState = [...newTenantsState];
    newTenantState[i].checked = !newTenantState[i].checked;
    setNewTenantsState(newTenantState);
  };
  const toggleTenant = (i) => {
    const newTenantState = [...tenantState];
    newTenantState[i].checked = !newTenantState[i].checked;
    setTenantState(newTenantState);
  };
  const toggleOwner = (i) => {
    const newOwnerState = [...ownerState];
    newOwnerState[i].checked = !newOwnerState[i].checked;
    setOwnerState(newOwnerState);
  };

  const DialogSendingText = () => {
    return (
      <Dialog
        open={showDialogSendingText}
        // onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <div className="d-flex justify-content-center align-items-center m-5">
            <h5> Sending Texts</h5>

            <img src={ThreeDots} style={{ width: "20%" }} alt="loading..." />
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  const DialogSendingEmail = () => {
    return (
      <Dialog
        open={showDialogSendingEmail}
        // onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <div className="d-flex justify-content-center align-items-center m-5">
            <h5> Sending Emails</h5>

            <img src={ThreeDots} style={{ width: "20%" }} alt="loading..." />
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  const DialogSendingFailed = () => {
    return (
      <Dialog
        open={showSendingFailed}
        // onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Failed Messages</DialogTitle>
        <DialogContent>
          <div className=" m-5">
            {failed.map((fail) => {
              return (
                <div>
                  <h5> {fail}</h5> <br />
                </div>
              );
            })}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSendingFailed(false)}>Okay</Button>
        </DialogActions>
      </Dialog>
    );
  };
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );

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
      id: "announcement_title",
      numeric: false,
      label: "Title",
    },
    {
      id: "announcement_msg",
      numeric: false,
      label: "Announcement Message",
    },
    {
      id: "announcement_mode",
      numeric: false,
      label: "Announcement Mode",
    },

    {
      id: "announcement_date",
      numeric: false,
      label: "Announcement Date",
    },
    {
      id: "",
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
    // rowCount: PropTypes.number.isRequired,
  };
  return (
    <div className="w-100 overflow-hidden">
      {DialogSendingText()}
      {DialogSendingEmail()}
      {DialogSendingFailed()}
      <Row className="w-100 mb-5 overflow-hidden">
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5 overflow-scroll">
          <Header
            title="Announcements"
            leftText={editingAnnouncement || announcementDetail ? "< Back" : ""}
            leftFn={() => {
              setNewAnnouncement(null);
              setAnnouncementDetail(false);
              propertyState.forEach((prop) => (prop.checked = false));
              newTenantsState.forEach((prop) => (prop.checked = false));
              tenantState.forEach((prop) => (prop.checked = false));
              ownerState.forEach((prop) => (prop.checked = false));
              setNewTenantsState(newTenantsState);
              setTenantState(tenantState);
              setOwnerState(ownerState);
              setPropertyState(propertyState);
              setByNewTenants(false);
              setByProperty(false);
              setByTenants(false);
              setByOwners(false);
              setEditingAnnouncement(false);
            }}
            rightText={editingAnnouncement || announcementDetail ? "" : "+ New"}
            rightFn={() => {
              setNewAnnouncement({ ...emptyAnnouncement });
              propertyState.forEach((prop) => (prop.checked = false));
              newTenantsState.forEach((prop) => (prop.checked = false));
              tenantState.forEach((prop) => (prop.checked = false));
              ownerState.forEach((prop) => (prop.checked = false));
              setPropertyState(propertyState);
              setNewTenantsState(newTenantsState);
              setTenantState(tenantState);
              setOwnerState(ownerState);
              setByNewTenants(false);
              setByProperty(false);
              setByTenants(false);
              setByOwners(false);
              setEditingAnnouncement(true);
            }}
          />

          <div>
            {newAnnouncement !== null &&
            editingAnnouncement &&
            !announcementDetail ? (
              <div
                className="mx-2 mt-2 p-3"
                style={{
                  background: "#FFFFFF 0% 0% no-repeat padding-box",
                  borderRadius: "5px",
                  opacity: 1,
                }}
              >
                <Row className="my-4 text-center">
                  <div style={headings}>New Announcement</div>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <Form.Group className="mx-2">
                      <Form.Label style={mediumBold} className="mb-0 ms-2">
                        Announcement Title{" "}
                        {newAnnouncement.announcement_title === ""
                          ? required
                          : ""}
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        required
                        type="text"
                        placeholder="Message Title"
                        value={newAnnouncement.announcement_title}
                        onChange={(e) =>
                          changenewAnnouncement(e, "announcement_title")
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <Form.Group className="mx-2">
                      <Form.Label style={mediumBold} className="mb-0 ms-2">
                        Announcement Message{" "}
                        {newAnnouncement.announcement_msg === ""
                          ? required
                          : ""}
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        as="textarea"
                        required
                        type="text"
                        placeholder="Message Details"
                        value={newAnnouncement.announcement_msg}
                        onChange={(e) =>
                          changenewAnnouncement(e, "announcement_msg")
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={3}>
                    <Form.Group
                      className="mx-2 mb-3"
                      controlId="formBasicCheckbox"
                    >
                      <div
                        className="d-flex mx-2 ps-2 align-items-center my-2"
                        style={{
                          font: "normal normal normal 18px Bahnschrift-Regular",
                        }}
                      >
                        <Checkbox
                          type="BOX"
                          checked={byProperty}
                          onClick={() => {
                            setByProperty(!byProperty);
                            setByTenants(false);
                            setByOwners(false);
                            setByNewTenants(false);
                          }}
                        />
                        <p className="ms-1 mb-1">Tenants By Property</p>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col xs={3}>
                    <Form.Group
                      className="mx-2 mb-3"
                      controlId="formBasicCheckbox"
                    >
                      <div
                        className="d-flex mx-2 ps-2 align-items-center my-2"
                        style={{
                          font: "normal normal normal 18px Bahnschrift-Regular",
                        }}
                      >
                        {" "}
                        <Checkbox
                          type="BOX"
                          checked={byTenants}
                          onClick={() => {
                            setByTenants(!byTenants);
                            setByProperty(false);
                            setByOwners(false);
                            setByNewTenants(false);
                          }}
                        />
                        <p className="ms-1 mb-1">Tenants By Name</p>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col xs={3}>
                    <Form.Group
                      className="mx-2 mb-3"
                      controlId="formBasicCheckbox"
                    >
                      <div
                        className="d-flex mx-2 ps-2 align-items-center my-2"
                        style={{
                          font: "normal normal normal 18px Bahnschrift-Regular",
                        }}
                      >
                        {" "}
                        <Checkbox
                          type="BOX"
                          checked={byOwners}
                          onClick={() => {
                            setByOwners(!byOwners);
                            setByProperty(false);
                            setByTenants(false);
                            setByNewTenants(false);
                          }}
                        />
                        <p className="ms-1 mb-1">Owners By Name</p>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col xs={3}>
                    <Form.Group
                      className="mx-2 mb-3"
                      controlId="formBasicCheckbox"
                    >
                      <div
                        className="d-flex mx-2 ps-2 align-items-center my-2"
                        style={{
                          font: "normal normal normal 18px Bahnschrift-Regular",
                        }}
                      >
                        {" "}
                        <Checkbox
                          type="BOX"
                          checked={byNewTenants}
                          onClick={() => {
                            setByNewTenants(!byNewTenants);
                            setByProperty(false);
                            setByTenants(false);
                            setByOwners(false);
                          }}
                        />
                        <p className="ms-1 mb-1">New Tenants By Name</p>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                {byProperty ? (
                  <Row className="mx-1 mt-3 mb-2">
                    <h6 style={mediumBold}>Properties</h6>
                    <Table
                      responsive="md"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell align="left">Address</TableCell>
                          <TableCell align="left">Tenant</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {properties.map((property, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Checkbox
                                type="BOX"
                                checked={propertyState[i].checked}
                                onClick={() => toggleProperty(i)}
                              />
                            </TableCell>
                            <TableCell align="left">
                              {" "}
                              <p className="ms-1 mb-1">
                                {property.address} {property.unit}
                                ,&nbsp;{property.city},&nbsp;{property.state}
                                &nbsp; {property.zip}
                              </p>
                            </TableCell>
                            <TableCell align="left">
                              {property.rentalInfo !== "Not Rented" ? (
                                property.rentalInfo.map((tf, i) => {
                                  return (
                                    <div>
                                      {tf.tenant_first_name}{" "}
                                      {tf.tenant_last_name}
                                    </div>
                                  );
                                })
                              ) : (
                                <div>{property.rentalInfo}</div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Row>
                ) : (
                  <div></div>
                )}

                {byTenants ? (
                  <Row className="mx-1 mt-3 mb-2">
                    <h6 style={mediumBold}>Tenants</h6>
                    <Table
                      responsive="md"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell align="left">Tenant</TableCell>
                          <TableCell align="left">Address</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tenants.map((tenant, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Checkbox
                                type="BOX"
                                checked={tenantState[i].checked}
                                onClick={() => toggleTenant(i)}
                              />
                            </TableCell>

                            <TableCell align="left">
                              <p className="ms-1 mb-1">{tenant.tenant_name}</p>
                            </TableCell>

                            <TableCell align="left">{tenant.address}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Row>
                ) : (
                  <div></div>
                )}
                {byNewTenants ? (
                  <Row className="mx-1 mt-3 mb-2">
                    <h6 style={mediumBold}>Tenants</h6>
                    <Table
                      responsive="md"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell align="left">Tenant</TableCell>
                          <TableCell align="left">Address</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {newTenants.map((tenant, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Checkbox
                                type="BOX"
                                checked={newTenantsState[i].checked}
                                onClick={() => toggleNewTenant(i)}
                              />
                            </TableCell>

                            <TableCell align="left">
                              <p className="ms-1 mb-1">{tenant.tenant_name}</p>
                            </TableCell>

                            <TableCell align="left">{tenant.address}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Row>
                ) : (
                  <div></div>
                )}
                {byOwners ? (
                  <Row className="mx-1 mt-3 mb-2">
                    <h6 style={mediumBold}>Owners</h6>
                    <Table
                      responsive="md"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell align="left">Owners</TableCell>
                          <TableCell align="left">Address</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {owners.map((owner, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Checkbox
                                type="BOX"
                                checked={ownerState[i].checked}
                                onClick={() => toggleOwner(i)}
                              />
                            </TableCell>

                            <TableCell align="left">
                              <p className="ms-1 mb-1">{owner.owner_name}</p>
                            </TableCell>

                            <TableCell align="left">{owner.address}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Row>
                ) : (
                  <div></div>
                )}

                <div
                  className="text-center my-2"
                  style={errorMessage === "" ? hidden : {}}
                >
                  <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
                </div>

                <div
                  className="d-flex justify-content-center mb-4 mx-2 mb-2 p-3"
                  style={{
                    background: "#FFFFFF 0% 0% no-repeat padding-box",

                    opacity: 1,
                  }}
                >
                  <Button
                    variant="outline-primary"
                    style={pillButton}
                    onClick={cancelEdit}
                    className="mx-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline-primary"
                    style={pillButton}
                    onClick={addAnnouncement}
                    className="mx-2"
                  >
                    Send
                  </Button>
                </div>
                {showSpinner ? (
                  <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                    <ReactBootStrap.Spinner animation="border" role="status" />
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
            {announcements.length > 0 &&
            newAnnouncement === null &&
            !editingAnnouncement &&
            !announcementDetail ? (
              <div>
                <Row className="m-3">
                  <Col>
                    <h3>Announcements</h3>
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
                        {stableSort(
                          announcements,
                          getComparator(order, orderBy)
                        ).map((announce, index) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={announce.announce}
                            >
                              <TableCell
                                onClick={() =>
                                  navigate("/detailAnnouncements", {
                                    state: {
                                      announcement: announce,
                                    },
                                  })
                                }
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {announce.announcement_title}
                              </TableCell>
                              <TableCell
                                onClick={() =>
                                  navigate("/detailAnnouncements", {
                                    state: {
                                      announcement: announce,
                                    },
                                  })
                                }
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {announce.announcement_msg}
                              </TableCell>
                              <TableCell
                                onClick={() =>
                                  navigate("/detailAnnouncements", {
                                    state: {
                                      announcement: announce,
                                    },
                                  })
                                }
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {announce.announcement_mode}
                              </TableCell>

                              <TableCell
                                onClick={() =>
                                  navigate("/detailAnnouncements", {
                                    state: {
                                      announcement: announce,
                                    },
                                  })
                                }
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {" "}
                                {new Date(
                                  announce.date_announcement
                                ).toLocaleString("default", {
                                  month: "long",
                                })}{" "}
                                {new Date(announce.date_announcement).getDate()}
                                ,{" "}
                                {new Date(
                                  announce.date_announcement
                                ).getFullYear()}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                <img
                                  src={DeleteIcon}
                                  alt="Delete Icon"
                                  className="px-1 mx-2"
                                  onClick={() =>
                                    deleteAnnouncement(
                                      announce.announcement_uid
                                    )
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Row>
                </div>
              </div>
            ) : newAnnouncement === null &&
              !editingAnnouncement &&
              !announcementDetail ? (
              <div>
                <Row className="m-3">
                  <Col>
                    <h3>Announcements</h3>
                  </Col>
                  <Col>
                    {/* <h3 style={{ float: "right", marginRight: "3rem" }}>+</h3> */}
                  </Col>
                </Row>{" "}
                <Row className="m-3">
                  {" "}
                  <div className="m-3">No announcements</div>
                </Row>
              </div>
            ) : (
              ""
            )}
            {newAnnouncement === null &&
            !editingAnnouncement &&
            !announcementDetail ? (
              <IncomingMessages />
            ) : (
              ""
            )}
          </div>
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <ManagerFooter />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ManagerCreateAnnouncement;
