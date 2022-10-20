import React, { useState, useContext, useEffect } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import {
  pillButton,
  squareForm,
  small,
  red,
  hidden,
  headings,
  mediumBold,
  subHeading,
  address,
  blue,
} from "../utils/styles";
import { useNavigate } from "react-router-dom";
import Checkbox from "../components/Checkbox";
import Header from "../components/Header";
import { post, get } from "../utils/api";
import AppContext from "../AppContext";
import SideBar from "../components/managerComponents/SideBar";

function CreateAnnouncement(props) {
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [manager, setManager] = useState([]);
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
  const [announcementDetail, setAnnouncementDetail] = useState(false);

  const emptyAnnouncement = {
    pm_id: "",
    announcement_msg: "",
    receiver: [],
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
    console.log("second");
    console.log(response);
    setIsLoading(false);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();

      return;
    }
    const responseAnnouncement = await get(
      `/announcement?pm_id=${management_buid}`
    );
    console.log(responseAnnouncement);
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
    };
    properties_unique.forEach((property) => {
      if (property.rentalInfo !== "NOT RENTED") {
        property.rentalInfo.forEach((tenant) => {
          tenant_details = {
            tenant_id: tenant.tenant_id,
            tenant_name:
              tenant.tenant_first_name + " " + tenant.tenant_last_name,
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
  console.log(tenants);

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
    let receiver_uid = [];
    if (byProperty) {
      newAnnouncement.properties.forEach((prop) =>
        prop.rentalInfo !== "NOT RENTED"
          ? prop.rentalInfo.map((tf, i) => receiver_uid.push(tf.tenant_id))
          : ""
      );
    }
    if (byTenants) {
      newAnnouncement.tenants.forEach((tenant) =>
        receiver_uid.push(tenant.tenant_id)
      );
    }

    const new_announcement = {
      pm_id: managerID,
      announcement_msg: newAnnouncement.announcement_msg,
      receiver: receiver_uid,
    };

    const response = await post("/announcement", new_announcement);
    setNewAnnouncement({ ...emptyAnnouncement });
    propertyState.forEach((prop) => (prop.checked = false));
    setPropertyState(propertyState);
    tenantState.forEach((prop) => (prop.checked = false));
    setTenantState(tenantState);
    setEditingAnnouncement(null);
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
    const newAnnouncementState = [...announcementState];
    newAnnouncementState.push({ ...newAnnouncement });
    setAnnouncementState(newAnnouncementState);
    setNewAnnouncement(null);
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

  return (
    <div>
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div className="w-100">
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
                          onClick={() => setByProperty(!byProperty)}
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
                          onClick={() => setByTenants(!byTenants)}
                        />
                        <p className="ms-1 mb-1">By Tenants</p>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                {console.log(properties)}
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
                          {property.rentalInfo !== "NOT RENTED" ? (
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
              </div>
            ) : (
              ""
            )}
            {announcements.length > 0 &&
            newAnnouncement === null &&
            !editingAnnouncement &&
            !announcementDetail ? (
              <div className="mx-2 my-2 p-3">
                {console.log(announcements)}
                <div>
                  {announcements.map((announce) => {
                    return (
                      <div>
                        <Row
                          className="my-2 p-3"
                          style={{
                            background: "#FFFFFF 0% 0% no-repeat padding-box",
                            boxShadow: "0px 3px 6px #00000029",
                            borderRadius: "5px",
                            opacity: 1,
                            color: "black",
                          }}
                        >
                          <Col style={headings}>
                            {announce.announcement_msg}
                          </Col>
                          <Col style={{ textAlign: "right" }}>
                            {new Date(
                              announce.date_announcement
                            ).toLocaleString("default", { month: "long" })}{" "}
                            {new Date(announce.date_announcement).getDate()},{" "}
                            {new Date(announce.date_announcement).getFullYear()}
                          </Col>
                          <Row
                            style={blue}
                            className="mx-2"
                            onClick={() =>
                              navigate("/detailAnnouncements", {
                                state: {
                                  announcement: announce,
                                },
                              })
                            }
                          >
                            Learn More
                          </Row>
                        </Row>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAnnouncement;
