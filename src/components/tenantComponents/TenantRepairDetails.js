import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import * as ReactBootStrap from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import Carousel from "react-multi-carousel";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "../Checkbox";
import AppContext from "../../AppContext";
import Header from "../Header";
import RepairImages from "../RepairImages";
import SideBar from "./SideBar";
import TenantFooter from "./TenantFooter";
import RepairImg from "../../icons/RepairImg.svg";
import HighPriority from "../../icons/highPriority.svg";
import MediumPriority from "../../icons/mediumPriority.svg";
import LowPriority from "../../icons/lowPriority.svg";
import {
  headings,
  squareForm,
  subHeading,
  redPillButton,
  formLabel,
  bluePillButton,
  blue,
  subText,
  pillButton,
  sidebarStyle,
  small,
} from "../../utils/styles";
import { get, put, post } from "../../utils/api";
import "react-multi-carousel/lib/styles.css";
import RescheduleRepair from "../maintenanceComponents/RescheduleRepair";
const useStyles = makeStyles((theme) => ({
  priorityInactive: {
    opacity: "0.5",
  },
  priorityActive: {
    opacity: "1",
  },
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "2px 2px",
      border: "0.5px solid grey ",
      wordBreak: "break-word",
    },
    width: "100%",
    tableLayout: "fixed",
  },
}));
function TenantRepairDetails(props) {
  const classes = useStyles();
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
    },
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
  const imageState = useState([]);
  const { userData, refresh, ably } = useContext(AppContext);
  const { user, access_token } = userData;
  const channel_maintenance = ably.channels.get("maintenance_status");
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [issueType, setIssueType] = useState("Plumbing");
  const [requestQuote, setRequestQuote] = useState(false);
  const [scheduleMaintenance, setScheduleMaintenance] = useState(false);
  const [morePictures, setMorePictures] = useState(false);
  const [morePicturesNotes, setMorePicturesNotes] = useState("");
  const [finishMaintenance, setFinishMaintenance] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [repairsDetail, setRepairsDetail] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);

  const [reDate, setReDate] = useState("");
  const [reTime, setReTime] = useState("");
  const [allLinkedMessages, setAllLinkedMessages] = useState("");
  const repair = location.state.repair;

  const fetchBusinesses = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const businesses_request = await get(
      "/businesses?business_type=MAINTENANCE"
    );
    const request_response = await get(
      `/maintenanceRequests?maintenance_request_uid=${repair.maintenance_request_uid}`
    );
    const resMessage = await get(
      `/messageText?request_linked_id=${repair.maintenance_request_uid}`
    );
    setAllLinkedMessages(resMessage.result);
    if (businesses_request.msg === "Token has expired") {
      refresh();
      return;
    }

    const businesses = businesses_request.result.map((business) => ({
      ...business,
      quote_requested: false,
    }));
    // console.log(repair)
    // console.log(businesses)
    setAllLinkedMessages(resMessage.result);
    setBusinesses(businesses);
    // console.log(request_response.result[0]);
    setRepairsDetail(request_response.result[0]);
    setTitle(request_response.result[0].title);
    setDescription(request_response.result[0].description);
    setPriority(request_response.result[0].priority);
    setIssueType(request_response.result[0].request_type);
    if (
      request_response.result[0].request_status === "SCHEDULE" ||
      request_response.result[0].request_status === "RESCHEDULE"
    ) {
      setReDate(request_response.result[0].scheduled_date);
      setReTime(request_response.result[0].scheduled_time);
    }
    const files = [];
    const images = JSON.parse(request_response.result[0].images);
    for (let i = 0; i < images.length; i++) {
      files.push({
        index: i,
        image: images[i],
        file: null,
        coverPhoto: i === 0,
      });
    }
    imageState[1](files);
    if (repair.request_status === "FINISHED") {
      setFinishMaintenance(true);
    }
    const response = await get(
      `/maintenanceQuotes?linked_request_uid=${repair.maintenance_request_uid}`
    );
    // console.log(response.result)
    setQuotes(response.result);
    setIsLoading(false);
  };

  const [maintenanceStatus, setMaintenanceStatus] = useState("");
  useEffect(() => {
    async function maintenance_message() {
      await channel_maintenance.subscribe((message) => {
        // console.log(message);
        setMaintenanceStatus(message.data.te);
      });
    }
    maintenance_message();
    fetchBusinesses();
    return function cleanup() {
      channel_maintenance.unsubscribe();
    };
  }, [access_token, , maintenanceStatus]);
  const updateRepair = async () => {
    let newRepair = {
      maintenance_request_uid: repair.maintenance_request_uid,
      title: title,
      priority: priority,
      request_type: issueType,
      can_reschedule: true,
      assigned_business: repair.assigned_business,
      notes: repair.notes,
      request_status:
        repair.request_status === "INFO" ? "PROCESSING" : repair.request_status,
      description: description,
      scheduled_date: repair.scheduled_date,
      assigned_worker: repair.assigned_worker,
    };

    const files = imageState[0];
    let i = 0;
    for (const file of imageState[0]) {
      let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
      if (file.file !== null) {
        newRepair[key] = file.file;
      } else {
        newRepair[key] = file.image;
      }
    }
    setShowSpinner(true);
    // console.log(newRepair);
    const res = await put("/maintenanceRequests", newRepair, null, files);
    channel_maintenance.publish({ data: { te: newRepair } });
    setShowSpinner(false);
    fetchBusinesses();
    setIsEditing(false);
  };
  const toggleBusiness = (index) => {
    const newBusinesses = [...businesses];
    newBusinesses[index].quote_requested =
      !newBusinesses[index].quote_requested;
    setBusinesses(newBusinesses);
  };
  function editRepair() {
    setIsEditing(true);
  }
  const reload = () => {
    setIsEditing(false);
  };
  const rescheduleRepair = async () => {
    const body = {
      maintenance_request_uid: repair.maintenance_request_uid,
      request_status: "RESCHEDULE",
      notes: "Request to reschedule",
      scheduled_date: reDate,
      scheduled_time: reTime,
    };
    const files = imageState[0];
    let i = 0;
    for (const file of imageState[0]) {
      let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
      if (file.file !== null) {
        body[key] = file.file;
      } else {
        body[key] = file.image;
      }
    }
    const response = await put("/maintenanceRequests", body, null, files);

    channel_maintenance.publish({ data: { te: body } });
    fetchBusinesses();
    setScheduleMaintenance(false);
    setIsEditing(false);
  };
  const CompleteMaintenance = async () => {
    const newRepair = {
      maintenance_request_uid: repair.maintenance_request_uid,
      request_status: "COMPLETED",
    };
    const files = imageState[0];
    let i = 0;
    for (const file of imageState[0]) {
      let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
      if (file.file !== null) {
        newRepair[key] = file.file;
      } else {
        newRepair[key] = file.image;
      }
    }

    // console.log("Repair Object to be updated", newRepair);

    const response = await put("/maintenanceRequests", newRepair, null, files);
    channel_maintenance.publish({ data: { te: newRepair } });
    fetchBusinesses();
  };
  const acceptSchedule = async (quote) => {
    const body = {
      maintenance_request_uid: repair.maintenance_request_uid,
      request_status: "SCHEDULED",
      notes: "Maintenance Scheduled",
      scheduled_date: reDate,
      scheduled_time: reTime,
    };
    const files = imageState[0];
    let i = 0;
    for (const file of imageState[0]) {
      let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
      if (file.file !== null) {
        body[key] = file.file;
      } else {
        body[key] = file.image;
      }
    }
    const responseMR = await put("/maintenanceRequests", body, null, files);

    const updatedQuote = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      quote_status: "AGREED",
      quote_adjustment_date: new Date(),
    };
    const responseMQ = await put("/maintenanceQuotes", updatedQuote);
    channel_maintenance.publish({ data: { te: updatedQuote } });

    fetchBusinesses();
    setScheduleMaintenance(false);
    setIsEditing(false);
  };
  const acceptQuote = async (quote) => {
    const body = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      quote_status: "ACCEPTED",
      quote_adjustment_date: new Date(),
    };
    const response = await put("/maintenanceQuotes", body);
    channel_maintenance.publish({ data: { te: body } });
    fetchBusinesses();
  };

  const rejectQuote = async (quote) => {
    const body = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      quote_status: "REJECTED",
      quote_adjustment_date: new Date(),
    };
    const response = await put("/maintenanceQuotes", body);
    channel_maintenance.publish({ data: { te: body } });
    fetchBusinesses();
  };
  const requestMorePictures = async (quote) => {
    const newRepair = {
      maintenance_request_uid: repair.maintenance_request_uid,
      request_status: "PROCESSING",
      notes: morePicturesNotes,
    };

    // console.log("Repair Object to be updated");
    // console.log(newRepair);
    setShowSpinner(true);
    const response = await put("/RequestMorePictures", newRepair);
    channel_maintenance.publish({ data: { te: newRepair } });
    const newMessage = {
      receiver_email: repair.managerInfo[0].business_email,
      receiver_phone: repair.managerInfo[0].business_phone_number,
      message_subject: "Additional info for " + repair.title,
      message_details: morePicturesNotes,
      message_created_by: repair.rentalInfo[0].tenant_id,
      user_messaged: repair.managerInfo[0].business_uid,
      message_status: "PENDING",
      sender_name:
        repair.rentalInfo[0].tenant_first_name +
        " " +
        repair.rentalInfo[0].tenant_last_name,
      sender_email: repair.rentalInfo[0].tenant_email,
      sender_phone: repair.rentalInfo[0].tenant_phone_number,
      request_linked_id: repair.maintenance_request_uid,
    };
    // console.log(newMessage);
    const responseText = await post("/messageText", newMessage);
    setShowSpinner(false);
    setMorePictures(false);
    channel_maintenance.publish({ data: { te: newMessage } });
    fetchBusinesses();
  };

  return (
    <div className="w-100 overflow-hidden">
      <Row className="w-100 mb-5 overflow-hidden">
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5">
          <Header
            title="Repairs"
            leftText={isEditing ? null : "< Back"}
            leftFn={() => (isEditing ? setIsEditing(false) : navigate(-1))}
            rightText={isEditing ? null : "Edit"}
            rightFn={() => (isEditing ? updateRepair() : setIsEditing(true))}
          />

          {repairsDetail === [] || isLoading === true ? (
            <Row className="mt-2 mb-2">
              <div style={blue}></div>
            </Row>
          ) : (
            <div
              className="mx-2 my-2 p-3"
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
              hidden={requestQuote}
            >
              {isEditing ? (
                <div className="d-flex flex-column w-100 p-2 overflow-hidden">
                  {" "}
                  <Form.Group
                    className="p-2"
                    style={{
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                      borderRadius: "5px",
                    }}
                  >
                    <Form.Label style={subHeading} className="ms-1 mb-0">
                      Property
                    </Form.Label>

                    <Row style={formLabel} as="h5" className="ms-1 mb-0">
                      {repair.address} {repair.unit}
                      ,&nbsp;
                      {repair.city}
                      ,&nbsp;
                      {repair.state}&nbsp; {repair.zip}
                    </Row>
                  </Form.Group>
                  <Form.Group className="mx-2 my-3">
                    <Form.Label as="h6" className="mb-0 ms-2">
                      Issue Type
                    </Form.Label>
                    <Form.Select
                      style={squareForm}
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                    >
                      <option>Plumbing</option>
                      <option>Landscape</option>
                      <option>Appliances</option>
                      <option>Electrical</option>
                      <option>HVAC</option>
                      <option>Other</option>
                    </Form.Select>
                  </Form.Group>
                  <Form>
                    <Form.Group
                      className="mt-3 mb-4 p-2"
                      style={{
                        background: "#F3F3F3 0% 0% no-repeat padding-box",
                        borderRadius: "5px",
                      }}
                    >
                      <Form.Label
                        style={formLabel}
                        as="h5"
                        className="ms-1 mb-0"
                      >
                        Title
                      </Form.Label>
                      <Form.Control
                        style={{ borderRadius: 0 }}
                        defaultValue={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter Title"
                      />
                    </Form.Group>
                    <Form.Group
                      className="mt-3 mb-4 p-2"
                      style={{
                        background: "#F3F3F3 0% 0% no-repeat padding-box",
                        borderRadius: "5px",
                      }}
                    >
                      <Form.Label
                        style={formLabel}
                        as="h5"
                        className="mt-2 mb-1"
                      >
                        Tags
                      </Form.Label>
                      <Row
                        className="mt-2 mb-2"
                        style={{
                          display: "text",
                          flexDirection: "row",
                          textAlign: "center",
                        }}
                      >
                        <Col xs={4}>
                          <img
                            src={HighPriority}
                            onClick={() => setPriority("High")}
                            className={
                              priority === "High"
                                ? `${classes.priorityActive}`
                                : `${classes.priorityInactive}`
                            }
                            //style={{ opacity: "0.5" }}
                          />
                        </Col>
                        <Col xs={4}>
                          <img
                            src={MediumPriority}
                            onClick={() => setPriority("Medium")}
                            className={
                              priority === "Medium"
                                ? `${classes.priorityActive}`
                                : `${classes.priorityInactive}`
                            }
                            //style={{ opacity: "0.5" }}
                          />
                        </Col>
                        <Col xs={4}>
                          <img
                            src={LowPriority}
                            onClick={() => setPriority("Low")}
                            className={
                              priority === "Low"
                                ? `${classes.priorityActive}`
                                : `${classes.priorityInactive}`
                            }
                            //style={{ opacity: "0.5" }}
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group
                      className="mt-3 mb-4 p-2"
                      style={{
                        background: "#F3F3F3 0% 0% no-repeat padding-box",
                        borderRadius: "5px",
                      }}
                    >
                      <Form.Label
                        style={formLabel}
                        as="h5"
                        className="ms-1 mb-0"
                      >
                        Description
                      </Form.Label>
                      <Form.Control
                        style={{ borderRadius: 0 }}
                        as="textarea"
                        defaultValue={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter Description"
                      />
                    </Form.Group>
                    <Form.Group
                      className="mt-3 mb-4 p-2"
                      style={{
                        background: "#F3F3F3 0% 0% no-repeat padding-box",
                        borderRadius: "5px",
                      }}
                    >
                      <RepairImages state={imageState} />
                    </Form.Group>
                  </Form>
                  <div className="text-center mt-5">
                    {showSpinner ? (
                      <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                        <ReactBootStrap.Spinner
                          animation="border"
                          role="status"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <Row
                      style={{
                        display: "text",
                        flexDirection: "row",
                        textAlign: "center",
                        marginBottom: "5rem",
                      }}
                    >
                      <Col>
                        <Button
                          variant="outline-primary"
                          onClick={() => updateRepair()}
                          style={bluePillButton}
                        >
                          Save
                        </Button>
                      </Col>
                      <Col xs={4}>
                        <Button
                          variant="outline-primary"
                          onClick={() => setIsEditing(false)}
                          style={pillButton}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              ) : (
                <div>
                  <Row className=" d-flex align-items-center justify-content-center m-3">
                    {JSON.parse(repairsDetail.images).length === 0 ? (
                      <img
                        src={RepairImg}
                        alt="Property"
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    ) : JSON.parse(repairsDetail.images).length >= 4 ? (
                      <Carousel
                        responsive={responsive}
                        infinite={true}
                        arrows={true}
                        partialVisible={false}
                        // className=" d-flex align-items-center justify-content-center"
                      >
                        {JSON.parse(repairsDetail.images).map((image) => {
                          return (
                            // <div className="d-flex align-items-center justify-content-center">
                            <img
                              // key={Date.now()}
                              src={`${image}?${Date.now()}`}
                              // onClick={() =>
                              //   showImage(`${image}?${Date.now()}`)
                              // }
                              style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "cover",
                              }}
                            />
                            // </div>
                          );
                        })}
                      </Carousel>
                    ) : JSON.parse(repairsDetail.images).length < 4 ? (
                      <Carousel
                        responsive={responsive}
                        infinite={true}
                        arrows={true}
                        partialVisible={false}
                        className=" d-flex align-items-center justify-content-center"
                      >
                        {JSON.parse(repairsDetail.images).map((image) => {
                          return (
                            <div className="d-flex align-items-center justify-content-center">
                              <img
                                // key={Date.now()}
                                src={`${image}?${Date.now()}`}
                                // onClick={() =>
                                //   showImage(`${image}?${Date.now()}`)
                                // }
                                style={{
                                  width: "200px",
                                  height: "200px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          );
                        })}
                      </Carousel>
                    ) : (
                      ""
                    )}
                  </Row>
                  <Row
                    className="p-2"
                    style={{
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                      borderRadius: "5px",
                    }}
                  >
                    <div style={subHeading} className="ms-1 mb-0">
                      Property
                    </div>

                    <Row style={subHeading} className="ms-1 mb-0">
                      {repair.address} {repair.unit}
                      ,&nbsp;
                      {repair.city}
                      ,&nbsp;
                      {repair.state}&nbsp; {repair.zip}
                    </Row>
                  </Row>
                  <Row
                    className="mt-3 mb-4 p-2"
                    style={{
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                      borderRadius: "5px",
                    }}
                  >
                    <div style={subHeading} className="ms-1 mb-0">
                      Issue Type
                    </div>
                    <div className="ms-1 mb-0"> {issueType}</div>
                  </Row>
                  <Form>
                    <Row
                      className="mt-3 mb-4 p-2"
                      style={{
                        background: "#F3F3F3 0% 0% no-repeat padding-box",
                        borderRadius: "5px",
                      }}
                    >
                      <div style={subHeading} className="ms-1 mb-0">
                        Title
                      </div>
                      <div className="ms-1 mb-0"> {title}</div>
                    </Row>
                    <Row
                      className="mt-3 mb-4 p-2"
                      style={{
                        background: "#F3F3F3 0% 0% no-repeat padding-box",
                        borderRadius: "5px",
                      }}
                    >
                      <div style={subHeading} className="mt-2 mb-1">
                        Tags
                      </div>
                      <Row
                        className="mt-2 ms-1 mb-0"
                        style={{ padding: "7px 0px" }}
                      >
                        <Col>
                          {priority === "High" ? (
                            <img alt="Low priority" src={HighPriority} />
                          ) : priority === "Medium" ? (
                            <img alt="Medium priority" src={MediumPriority} />
                          ) : (
                            <img alt="High priority" src={LowPriority} />
                          )}
                        </Col>
                      </Row>
                    </Row>
                    <Row
                      className="mt-3 mb-4 p-2"
                      style={{
                        background: "#F3F3F3 0% 0% no-repeat padding-box",
                        borderRadius: "5px",
                      }}
                    >
                      <div style={subHeading} className="ms-1 mb-0">
                        Description
                      </div>
                      <div className="ms-1 mb-0">{description}</div>
                    </Row>
                  </Form>
                  {allLinkedMessages.length > 0 ? (
                    <Row
                      className="mt-3 mb-4 p-2"
                      style={{
                        background: "#F3F3F3 0% 0% no-repeat padding-box",
                        borderRadius: "5px",
                      }}
                    >
                      <div style={subHeading} className="mt-2 mb-1">
                        Messages History Logs
                      </div>
                      {allLinkedMessages.map((message) => {
                        return (
                          <Row
                            style={{
                              display: "flex",
                              justifyContent:
                                message.message_created_by ===
                                user.tenant_id[0].tenant_id
                                  ? "right"
                                  : "left",
                              alignItems:
                                message.message_created_by ===
                                user.tenant_id[0].tenant_id
                                  ? "right"
                                  : "left",
                            }}
                          >
                            <div
                              className="p-3 m-1"
                              style={{
                                flexDirection: "column",
                                borderRadius: "50px",
                                width: "max-content",
                                textAlign:
                                  message.message_created_by ===
                                  user.tenant_id[0].tenant_id
                                    ? "right"
                                    : "left",
                                backgroundColor:
                                  message.message_created_by ===
                                  user.tenant_id[0].tenant_id
                                    ? "#007aff"
                                    : "grey",
                              }}
                            >
                              {message.message_details}
                              <div
                                style={{
                                  fontSize: "x-small",
                                  textAlign: "right",
                                }}
                              >
                                {message.message_created_at}
                              </div>
                            </div>
                          </Row>
                        );
                      })}
                      <div className="pt-1 m-2 d-flex justify-content-center">
                        <Button
                          style={pillButton}
                          variant="outline-primary"
                          hidden={morePictures}
                          onClick={() => setMorePictures(!morePictures)}
                        >
                          Send additional information
                        </Button>
                      </div>
                    </Row>
                  ) : (
                    <div className="pt-1 mb-2 d-flex justify-content-center">
                      <Button
                        style={pillButton}
                        variant="outline-primary"
                        hidden={morePictures}
                        onClick={() => setMorePictures(!morePictures)}
                      >
                        Send additional information
                      </Button>
                    </div>
                  )}
                </div>
              )}
              <Row
                style={{
                  background: "#F3F3F3 0% 0% no-repeat padding-box",
                  borderRadius: "10px",
                  opacity: 1,
                }}
              >
                <Row className="pt-1 mb-4" hidden={!morePictures}>
                  <div className="pt-1 mb-2" style={subHeading}>
                    Request more pictures or additional information
                  </div>{" "}
                  (Limit: 1000 characters)
                  <Form.Group className="mt-3 mb-4">
                    <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                      Description of the request
                    </Form.Label>
                    <Form.Control
                      style={squareForm}
                      value={morePicturesNotes}
                      placeholder="Please Enter Additional Information"
                      onChange={(e) => setMorePicturesNotes(e.target.value)}
                      as="textarea"
                    />
                  </Form.Group>
                  {showSpinner ? (
                    <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                      <ReactBootStrap.Spinner
                        animation="border"
                        role="status"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <Row className="pt-1 mb-2">
                    <Col className="d-flex flex-row justify-content-evenly">
                      <Button
                        style={pillButton}
                        variant="outline-primary"
                        onClick={() => setMorePictures(false)}
                      >
                        Cancel
                      </Button>
                    </Col>
                    <Col className="d-flex flex-row justify-content-evenly">
                      <Button
                        style={bluePillButton}
                        onClick={requestMorePictures}
                      >
                        Send
                      </Button>
                    </Col>
                  </Row>
                </Row>
              </Row>
            </div>
          )}

          {!isEditing && !requestQuote && quotes && quotes.length > 0 && (
            <div className="pb-4 mb-4">
              {quotes &&
                quotes.length > 0 &&
                quotes.map((quote, i) =>
                  quote.quote_status === "AGREED" ||
                  quote.quote_status === "PAID" ? (
                    <div key={i}>
                      <hr
                        style={{
                          border: "1px dashed #000000",
                          borderStyle: "none none dashed",
                          backgroundColor: "white",
                        }}
                      />
                      <Row className="mx-2 my-2" style={headings}>
                        <div>{quote.business_name}</div>
                      </Row>
                      {quote.quote_status === "ACCEPTED" ||
                      quote.quote_status === "AGREED" ||
                      quote.quote_status === "SENT" ||
                      quote.quote_status === "REJECTED" ? (
                        <div className="mx-2 my-2 p-3">
                          <Row>
                            <Table
                              responsive="md"
                              classes={{ root: classes.customTable }}
                              size="small"
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center">
                                    Service Charges
                                  </TableCell>
                                  <TableCell align="center">
                                    Event Type
                                  </TableCell>
                                  <TableCell align="center">Notes</TableCell>
                                  <TableCell align="center">
                                    Earliest Availability
                                  </TableCell>
                                  <TableCell align="center">
                                    Scheduled Date
                                  </TableCell>
                                  <TableCell align="center">
                                    Scheduled Time
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell align="center">
                                    {" "}
                                    {quote.services_expenses &&
                                      quote.services_expenses.length > 0 &&
                                      JSON.parse(quote.services_expenses).map(
                                        (service, j) => (
                                          <div className="pt-1 mb-2 align-items-center">
                                            <div
                                              style={
                                                (subHeading,
                                                { textAlign: "center" })
                                              }
                                            >
                                              {service.service_name}
                                            </div>
                                          </div>
                                        )
                                      )}
                                  </TableCell>
                                  <TableCell align="center">
                                    {" "}
                                    {quote.event_type} hour job
                                  </TableCell>
                                  <TableCell align="center">
                                    {quote.notes}
                                  </TableCell>
                                  <TableCell align="center">
                                    {" "}
                                    {
                                      String(quote.earliest_availability).split(
                                        " "
                                      )[0]
                                    }
                                  </TableCell>
                                  <TableCell align="center">
                                    {" "}
                                    {repair.scheduled_date !== null &&
                                    repair.scheduled_date !== "null"
                                      ? repair.scheduled_date.split(" ")[0]
                                      : "Not Scheduled"}
                                  </TableCell>
                                  <TableCell align="center">
                                    {" "}
                                    {repair.scheduled_time !== null &&
                                    repair.scheduled_time !== "null"
                                      ? repair.scheduled_time
                                      : "Not Scheduled"}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Row>
                        </div>
                      ) : quote.quote_status === "REQUESTED" ||
                        quote.quote_status === "REFUSED" ||
                        quote.quote_status === "WITHDRAW" ? (
                        ""
                      ) : (
                        ""
                      )}

                      {!scheduleMaintenance &&
                      repair.can_reschedule &&
                      (quote.request_status === "SCHEDULE" ||
                        quote.request_status === "RESCHEDULE") &&
                      quote.quote_status === "ACCEPTED" ? (
                        <Row className="pt-1">
                          <Col className="d-flex flex-row justify-content-evenly">
                            <Button
                              style={bluePillButton}
                              onClick={() => acceptSchedule(quote)}
                            >
                              Accept
                            </Button>
                          </Col>
                          <Col className="d-flex flex-row justify-content-evenly">
                            <Button
                              style={bluePillButton}
                              onClick={() => setScheduleMaintenance(true)}
                            >
                              Reschedule
                            </Button>
                          </Col>
                        </Row>
                      ) : (
                        <Row></Row>
                      )}
                      {scheduleMaintenance ? (
                        <Row className="mx-2 my-2 p-3">
                          <RescheduleRepair quotes={quote} />
                        </Row>
                      ) : (
                        <Row></Row>
                      )}
                      {finishMaintenance &&
                      repair.request_created_by ===
                        user.tenant_id[0].tenant_id &&
                      JSON.parse(quote.maintenance_images) !== null &&
                      quote.request_status === "FINISHED" ? (
                        <Row className="mx-2 my-2 p-3">
                          <Row>
                            <div style={headings}>
                              Images Uploaded by Maintenance
                            </div>
                          </Row>
                          <Row className=" d-flex align-items-center justify-content-center m-3">
                            {JSON.parse(quote.maintenance_images).length ===
                            0 ? (
                              <img
                                src={RepairImg}
                                alt="Property"
                                style={{
                                  width: "200px",
                                  height: "200px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : JSON.parse(quote.maintenance_images).length >
                              4 ? (
                              <Carousel
                                responsive={responsive}
                                infinite={true}
                                arrows={true}
                                partialVisible={false}
                                // className=" d-flex align-items-center justify-content-center"
                              >
                                {JSON.parse(quote.maintenance_images).map(
                                  (image) => {
                                    return (
                                      // <div className="d-flex align-items-center justify-content-center">
                                      <img
                                        // key={Date.now()}
                                        src={`${image}?${Date.now()}`}
                                        // onClick={() =>
                                        //   showImage(`${image}?${Date.now()}`)
                                        // }
                                        style={{
                                          width: "200px",
                                          height: "200px",
                                          objectFit: "cover",
                                        }}
                                      />
                                      // </div>
                                    );
                                  }
                                )}
                              </Carousel>
                            ) : JSON.parse(quote.maintenance_images).length <
                              4 ? (
                              <Carousel
                                responsive={responsive}
                                infinite={true}
                                arrows={true}
                                partialVisible={false}
                                className=" d-flex align-items-center justify-content-center"
                              >
                                {JSON.parse(quote.maintenance_images).map(
                                  (image) => {
                                    return (
                                      <div className="d-flex align-items-center justify-content-center">
                                        <img
                                          // key={Date.now()}
                                          src={`${image}?${Date.now()}`}
                                          // onClick={() =>
                                          //   showImage(`${image}?${Date.now()}`)
                                          // }
                                          style={{
                                            width: "200px",
                                            height: "200px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      </div>
                                    );
                                  }
                                )}
                              </Carousel>
                            ) : (
                              ""
                            )}
                          </Row>
                          <Row
                            className="pt-1 mb-4"
                            style={{
                              background: "#F3F3F3 0% 0% no-repeat padding-box",
                              borderRadius: "10px",
                              opacity: 1,
                            }}
                          >
                            <div style={subHeading}>Notes</div>
                            <div style={subText}>{quote.notes}</div>
                          </Row>
                          <Row>
                            <Col className="d-flex flex-row justify-content-evenly">
                              {" "}
                              <Button
                                style={bluePillButton}
                                onClick={() => CompleteMaintenance()}
                              >
                                Completed
                              </Button>
                            </Col>
                          </Row>
                        </Row>
                      ) : (
                        <Row></Row>
                      )}
                      <hr />
                    </div>
                  ) : (
                    ""
                  )
                )}
            </div>
          )}
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <TenantFooter />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default TenantRepairDetails;
