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
import { post, get } from "../../utils/api";
import {
  pillButton,
  squareForm,
  small,
  red,
  hidden,
  headings,
  mediumBold,
} from "../../utils/styles";

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
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [managerID, setManagerID] = useState("");
  const [announcementState, setAnnouncementState] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(false);
  const [propertyState, setPropertyState] = useState([]);
  const [tenantState, setTenantState] = useState([]);
  const [byProperty, setByProperty] = useState(false);
  const [byTenants, setByTenants] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [announcementDetail, setAnnouncementDetail] = useState(false);

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [width, setWindowWidth] = useState(0);
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
      console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
    } else {
      management_buid = management_businesses[0].business_uid;
    }
    setManagerID(management_buid);
    const response = await get("/managerDashboard", access_token);

    setIsLoading(false);

    if (response.msg === "Token has expired") {
      console.log("here msg");
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
    let tenat_info = [];
    let tenant_details = {
      tenant_id: "",
      tenant_name: "",
      address: "",
      property_uid: "",
    };
    properties_unique.forEach((property) => {
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
          tenat_info.push(tenant_details);
        });
      }
    });
    console.log(tenat_info);
    setTenants(tenat_info);
    setTenantState(tenat_info);
    setProperties(properties_unique);
    setPropertyState(properties_unique);
  };
  useEffect(() => {
    console.log("in use effect");
    fetchProperties();
  }, []);

  //post announcements to database and send out emails
  const postAnnouncement = async (newAnnouncement) => {
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
    setManagerID(management_buid);
    console.log(newAnnouncement);
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
    const new_announcement = {
      pm_id: managerID,
      announcement_title: newAnnouncement.announcement_title,
      announcement_msg: newAnnouncement.announcement_msg,
      announcement_mode: byTenants ? "Tenants" : "Properties",
      receiver: receiver_uid,
      receiver_properties: receiver_properties_id,
    };
    // setShowSpinner(true);
    const response = await post("/announcement", new_announcement);
    setNewAnnouncement({ ...emptyAnnouncement });
    propertyState.forEach((prop) => (prop.checked = false));
    setPropertyState(propertyState);
    tenantState.forEach((prop) => (prop.checked = false));

    setTenantState(tenantState);
    // setShowSpinner(false);
    setEditingAnnouncement(null);
    const newAnnouncementState = [...announcementState];
    newAnnouncementState.push({ ...newAnnouncement });
    setAnnouncementState(newAnnouncementState);
    setNewAnnouncement(null);
    fetchProperties();
    const send_announcement = {
      announcement_msg: new_announcement.announcement_msg,
      announcement_title: new_announcement.announcement_title,
      tenant_name: response["tenant_name"],
      tenant_pno: response["tenant_pno"],
      tenant_email: response["tenant_email"],
    };
    const res = await post("/SendAnnouncement", send_announcement);
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
    if (byTenants) {
      if (tenantState.filter((p) => p.checked).length < 1) {
        setErrorMessage("Select at least one property");
        return;
      }
      newAnnouncement.tenants = [...tenantState.filter((p) => p.checked)];
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
  const toggleTenant = (i) => {
    const newTenantState = [...tenantState];
    newTenantState[i].checked = !newTenantState[i].checked;
    setTenantState(newTenantState);
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
      <div className="flex-1">
        <div
          hidden={!responsiveSidebar.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </div>
        <div className="w-100 mb-5">
          <Header
            title="Announcements"
            leftText={editingAnnouncement || announcementDetail ? "< Back" : ""}
            leftFn={() => {
              setNewAnnouncement(null);
              setAnnouncementDetail(false);
              propertyState.forEach((prop) => (prop.checked = false));
              tenantState.forEach((prop) => (prop.checked = false));
              setTenantState(tenantState);
              setPropertyState(propertyState);
              setByProperty(false);
              setByTenants(false);
              setEditingAnnouncement(false);
            }}
            rightText={editingAnnouncement || announcementDetail ? "" : "+ New"}
            rightFn={() => {
              setNewAnnouncement({ ...emptyAnnouncement });
              propertyState.forEach((prop) => (prop.checked = false));
              setPropertyState(propertyState);
              tenantState.forEach((prop) => (prop.checked = false));
              setTenantState(tenantState);
              setByProperty(false);
              setByTenants(false);
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
                  <Col xs={6}>
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
                          }}
                        />
                        <p className="ms-1 mb-1">By Property</p>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
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
                          }}
                        />
                        <p className="ms-1 mb-1">By Tenants</p>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                {byProperty ? (
                  <Row className="mx-1 mt-3 mb-2">
                    <h6 style={mediumBold}>Properties</h6>
                    {properties.map((property, i) => (
                      <div
                        key={i}
                        className="d-flex mx-2 ps-2 justify-content-left align-items-left my-2 flex-column"
                        style={{
                          font: "normal normal normal 18px Bahnschrift-Regular",
                        }}
                      >
                        <div className="d-flex mx-2 ps-2 align-items-center my-2 flex-row">
                          {" "}
                          <Checkbox
                            type="BOX"
                            checked={propertyState[i].checked}
                            onClick={() => toggleProperty(i)}
                          />
                          <p className="ms-1 mb-1">
                            {property.address} {property.unit}
                            ,&nbsp;{property.city},&nbsp;{property.state}&nbsp;{" "}
                            {property.zip}
                          </p>
                        </div>

                        <div className="d-flex mx-2 ps-2 justify-content-left align-items-left my-2 flex-column">
                          {property.rentalInfo !== "Not Rented" ? (
                            property.rentalInfo.map((tf, i) => {
                              return (
                                <div>
                                  {tf.tenant_first_name} {tf.tenant_last_name}
                                </div>
                              );
                            })
                          ) : (
                            <div>{property.rentalInfo}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </Row>
                ) : (
                  <div></div>
                )}

                {byTenants ? (
                  <Row className="mx-1 mt-3 mb-2">
                    <h6 style={mediumBold}>Tenants</h6>
                    {tenants.map((tenant, i) => (
                      <div
                        key={i}
                        className="d-flex mx-2 ps-2 justify-content-left align-items-left my-2 flex-column"
                        style={{
                          font: "normal normal normal 18px Bahnschrift-Regular",
                        }}
                      >
                        <div className="d-flex mx-2 ps-2 align-items-center my-2 flex-row">
                          <Checkbox
                            type="BOX"
                            checked={tenantState[i].checked}
                            onClick={() => toggleTenant(i)}
                          />
                          <p className="ms-1 mb-1">{tenant.tenant_name}</p>
                        </div>

                        <div className="d-flex mx-2 ps-2 justify-content-left align-items-left my-2 flex-column">
                          {tenant.address}
                        </div>
                      </div>
                    ))}
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
                    Save
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
              <div className="mx-2 my-2 p-3">
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
                            onClick={() =>
                              navigate("/detailAnnouncements", {
                                state: {
                                  announcement: announce,
                                },
                              })
                            }
                          >
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {announce.announcement_title}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {announce.announcement_msg}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {announce.announcement_mode}
                            </TableCell>

                            <TableCell
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
                              {new Date(announce.date_announcement).getDate()},{" "}
                              {new Date(
                                announce.date_announcement
                              ).getFullYear()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Row>
              </div>
            ) : (
              ""
            )}
          </div>
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <ManagerFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerCreateAnnouncement;
