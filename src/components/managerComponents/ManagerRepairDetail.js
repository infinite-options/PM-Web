import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import Carousel from "react-multi-carousel";
import RepairImages from "../RepairImages";
import SideBar from "./SideBar";
import Checkbox from "../Checkbox";
import AppContext from "../../AppContext";
import Header from "../Header";
import ManagerFooter from "./ManagerFooter";
import MessageDialogOwner from "../MessageDialog";
import MessageDialogTenant from "../MessageDialog";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import HighPriority from "../../icons/highPriority.svg";
import MediumPriority from "../../icons/mediumPriority.svg";
import LowPriority from "../../icons/lowPriority.svg";
import RepairImg from "../../icons/RepairImg.svg";
import File from "../../icons/File.svg";
import {
  headings,
  pillButton,
  subHeading,
  subText,
  redPillButton,
  formLabel,
  bluePillButton,
  greenPill,
  redPill,
  squareForm,
  orangePill,
  mediumBold,
  smallImg,
  red,
  hidden,
  small,
  sidebarStyle,
} from "../../utils/styles";
import { get, post, put } from "../../utils/api";
import RescheduleRepair from "../maintenanceComponents/RescheduleRepair";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "2px 2px",
      border: "0.5px solid grey ",
      wordBreak: "break-word",
    },
    width: "100%",
    tableLayout: "fixed",
  },
});

function ManagerRepairDetail(props) {
  const { userData, refresh, ably } = React.useContext(AppContext);
  const { access_token, user } = userData;
  const channel_maintenance = ably.channels.get("maintenance_status");
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();

  const [selectedOwner, setSelectedOwner] = useState("");

  const [showMessageFormOwner, setShowMessageFormOwner] = useState(false);

  const onCancelOwnerMessage = () => {
    setShowMessageFormOwner(false);
  };

  const [selectedTenant, setSelectedTenant] = useState("");

  const [showMessageFormTenant, setShowMessageFormTenant] = useState(false);
  const onCancelTenantMessage = () => {
    setShowMessageFormTenant(false);
  };

  const [morePictures, setMorePictures] = useState(false);
  const [morePicturesNotes, setMorePicturesNotes] = useState(
    "Can you please share more pictures regarding the request?"
  );
  const [canReschedule, setCanReschedule] = useState(false);
  const [rejectQuote, setRejectQuote] = useState(false);
  const [requestQuote, setRequestQuote] = useState(false);
  const [scheduleMaintenance, setScheduleMaintenance] = useState(false);
  const [finishMaintenance, setFinishMaintenance] = useState(false);
  const [cancelMaintenance, setCancelMaintenance] = useState(false);
  const [withdrawQuote, setWithdrawQuote] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const imageState = useState([]);
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState("");
  const [notes, setNotes] = useState("");
  const [messagetoM, setMessagetoM] = useState("");
  const [priority, setPriority] = useState("");
  const [tenantInfo, setTenantInfo] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const repair = location.state.repair;
  const [reDate, setReDate] = useState("");
  const [reTime, setReTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
  // const { repair, back } = props;

  // console.log(repair)
  // console.log(mp_id, rr_id)

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
    const response = await get(
      `/maintenanceQuotes?linked_request_uid=${repair.maintenance_request_uid}`
    );
    // console.log(response.result);

    if (businesses_request.msg === "Token has expired") {
      refresh();
      return;
    }

    const businesses = businesses_request.result.map((business) => ({
      ...business,
      quote_requested: false,
    }));
    // console.log("repair", repair);
    // console.log("request_response.result[0]", request_response.result[0]);
    // console.log(businesses)
    setBusinesses(businesses);
    setQuotes(response.result);
    setTitle(request_response.result[0].title);
    setDescription(request_response.result[0].description);
    setIssueType(request_response.result[0].request_type);
    setNotes(request_response.result[0].notes);
    setPriority(request_response.result[0].priority);
    setCanReschedule(request_response.result[0].can_reschedule === 1);
    if (
      request_response.result[0].request_status === "SCHEDULE" ||
      request_response.result[0].request_status === "RESCHEDULE"
    ) {
      setReDate(request_response.result[0].scheduled_date);
      setReTime(request_response.result[0].scheduled_time);
    }

    let tenant = [];
    let ti = {};
    if (repair.rentalInfo !== "Not Rented") {
      repair.rentalInfo.map((rentalInfo) => {
        if (rentalInfo.tenant_first_name.includes(",")) {
          let tenant_fns = rentalInfo.tenant_first_name.split(",");
          let tenant_lns = rentalInfo.tenant_last_name.split(",");
          let tenant_emails = rentalInfo.tenant_email.split(",");
          let tenant_phones = rentalInfo.tenant_phone_number.split(",");
          for (let i = 0; i < tenant_fns.length; i++) {
            ti["tenantFirstName"] = tenant_fns[i];
            ti["tenantLastName"] = tenant_lns[i];
            ti["tenantEmail"] = tenant_emails[i];
            ti["tenantPhoneNumber"] = tenant_phones[i];
            tenant.push(ti);
            ti = {};
          }
        } else {
          ti = {
            tenantFirstName: rentalInfo.tenant_first_name,
            tenantLastName: rentalInfo.tenant_last_name,
            tenantEmail: rentalInfo.tenant_email,
            tenantPhoneNumber: rentalInfo.tenant_phone_number,
          };
          tenant.push(ti);
        }
      });
      setTenantInfo(tenant);
    }

    const files = [];
    const images = JSON.parse(repair.images);
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
  };

  useEffect(fetchBusinesses, [access_token]);

  const toggleBusiness = (index) => {
    const newBusinesses = [...businesses];
    newBusinesses[index].quote_requested =
      !newBusinesses[index].quote_requested;
    setBusinesses(newBusinesses);
  };
  const rescheduleRepair = async () => {
    const body = {
      maintenance_request_uid: repair.maintenance_request_uid,
      request_status: "RESCHEDULE",
      notes: "Request to reschedule",
      scheduled_date: reDate,
      scheduled_time: reTime,
      request_adjustment_date: new Date(),
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
    setEdit(false);
  };
  const acceptSchedule = async (quote) => {
    const body = {
      maintenance_request_uid: repair.maintenance_request_uid,
      request_status: "SCHEDULED",
      notes: "Maintenance Scheduled",
      scheduled_date: reDate,
      scheduled_time: reTime,
      request_adjustment_date: new Date(),
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
    setEdit(false);
  };
  const sendQuotesRequest = async () => {
    const business_ids = businesses
      .filter((b) => b.quote_requested)
      .map((b) => b.business_uid);
    if (business_ids.length === 0) {
      alert("No businesses Selected");
      return;
    }

    // console.log("Quotes Requested from", business_ids);
    const quote_details = {
      linked_request_uid: repair.maintenance_request_uid,
      quote_business_uid: business_ids,

      quote_adjustment_date: new Date(),
    };
    const response = await post("/maintenanceQuotes", quote_details);
    channel_maintenance.publish({ data: { te: quote_details } });
    const result = response.result;
    setRequestQuote(false);
    if (
      repair.request_status === "SCHEDULE" ||
      repair.request_status === "RESCHEDULE"
    ) {
      setScheduleMaintenance(true);
    }

    fetchBusinesses();
  };

  const updateRepair = async () => {
    const newRepair = {
      maintenance_request_uid: repair.maintenance_request_uid,
      title: title,
      description: description,
      request_type: issueType,
      priority: priority,
      can_reschedule: canReschedule ? 1 : 0,
      request_status: repair.request_status,
      request_adjustment_date: new Date(),
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
    // console.log(response.result);
    setTitle(title);
    setDescription(description);
    setIssueType(issueType);
    setPriority(priority);
    setCanReschedule(canReschedule ? 1 : 0);
    setEdit(false);
    fetchBusinesses();
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
  const CompleteMaintenance = async () => {
    const newRepair = {
      maintenance_request_uid: repair.maintenance_request_uid,
      request_status: "COMPLETED",
      request_adjustment_date: new Date(),
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
  const CancelMaintenanceFunc = async () => {
    if (messagetoM === "") {
      setErrorMessage("Please fill out the reason");
      return;
    }
    const newRepair = {
      maintenance_request_uid: repair.maintenance_request_uid,
      request_status: "CANCELLED",
      request_adjustment_date: new Date(),
      notes: messagetoM,
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
    setShowSpinner(true);
    const response = await put("/maintenanceRequests", newRepair, null, files);
    repair.quotes.forEach(async (quote) => {
      if (quote.quote_status === "REQUESTED" || quote.quote_status === "SENT") {
        const body = {
          maintenance_quote_uid: quote.maintenance_quote_uid,
          quote_status: "WITHDRAWN",
          quote_adjustment_date: new Date(),
          notes: messagetoM,
        };
        const response = await put("/maintenanceQuotes", body);
      }
    });
    channel_maintenance.publish({ data: { te: newRepair } });
    setShowSpinner(false);
    navigate(-1);
  };
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  const rejectQuoteFunc = async (quote) => {
    if (messagetoM === "") {
      setErrorMessage("Please fill out the reason");
      return;
    }
    const body = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      notes: messagetoM,
      quote_status: "REJECTED",
      quote_adjustment_date: new Date(),
    };
    const response = await put("/maintenanceQuotes", body);
    channel_maintenance.publish({ data: { te: body } });
    fetchBusinesses();
  };
  const withdrawQuoteFunc = async (quote) => {
    if (messagetoM === "") {
      setErrorMessage("Please fill out the reason");
      return;
    }
    const body = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      quote_status: "WITHDRAWN",
      notes: messagetoM,
      quote_adjustment_date: new Date(),
    };
    const response = await put("/maintenanceQuotes", body);
    channel_maintenance.publish({ data: { te: body } });
    fetchBusinesses();
  };

  const requestMorePictures = async (quote) => {
    const newRepair = {
      maintenance_request_uid: repair.maintenance_request_uid,
      request_status: "INFO",
      notes: morePicturesNotes,
    };

    // console.log("Repair Object to be updated");
    // console.log(newRepair);
    setShowSpinner(true);
    const response = await put("/RequestMorePictures", newRepair);
    channel_maintenance.publish({ data: { te: newRepair } });
    setShowSpinner(false);
    setMorePictures(false);
    fetchBusinesses();
  };

  return (
    <div className="w-100 overflow-hidden">
      <MessageDialogOwner
        title={"Text Message"}
        isOpen={showMessageFormOwner}
        senderPhone={user.phone_number}
        senderEmail={user.email}
        senderName={user.first_name + " " + user.last_name}
        requestCreatedBy={user.user_uid}
        userMessaged={selectedOwner.owner_id}
        receiverEmail={selectedOwner.owner_email}
        receiverPhone={selectedOwner.owner_phone_number}
        onCancel={onCancelOwnerMessage}
      />{" "}
      <MessageDialogTenant
        title={"Text Message"}
        isOpen={showMessageFormTenant}
        senderPhone={user.phone_number}
        senderEmail={user.email}
        senderName={user.first_name + " " + user.last_name}
        requestCreatedBy={user.user_uid}
        userMessaged={selectedTenant.tenantId}
        receiverEmail={selectedTenant.tenantEmail}
        receiverPhone={selectedTenant.TenantPhoneNumber}
        onCancel={onCancelTenantMessage}
      />
      <Row className="w-100 mb-5 overflow-hidden">
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5 ">
          <Header
            title="Repairs"
            leftText={
              scheduleMaintenance || requestQuote
                ? null
                : edit
                ? null
                : "< Back"
            }
            leftFn={() => (edit ? setEdit(false) : navigate(-1))}
            rightText={
              scheduleMaintenance || requestQuote ? null : edit ? null : "Edit"
            }
            rightFn={() => (edit ? updateRepair() : setEdit(true))}
          />
          <br />
          <div className="mx-2 my-4 p-3" hidden={requestQuote}>
            <Row style={headings}>
              <Row className=" d-flex align-items-center justify-content-center m-3">
                {JSON.parse(repair.images).length === 0 ? (
                  <img
                    src={RepairImg}
                    alt="Property"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                ) : JSON.parse(repair.images).length > 4 ? (
                  <Carousel
                    responsive={responsive}
                    infinite={true}
                    arrows={true}
                    partialVisible={false}
                    // className=" d-flex align-items-center justify-content-center"
                  >
                    {JSON.parse(repair.images).map((image) => {
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
                ) : JSON.parse(repair.images).length < 4 ? (
                  <Carousel
                    responsive={responsive}
                    infinite={true}
                    arrows={true}
                    partialVisible={false}
                    className=" d-flex align-items-center justify-content-center"
                  >
                    {JSON.parse(repair.images).map((image) => {
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
              <Col>{title}</Col>
              <Col xs={4}>
                {priority === "High" ? (
                  <img alt="low priority" src={HighPriority} />
                ) : priority === "Medium" ? (
                  <img alt="medium priority" src={MediumPriority} />
                ) : (
                  <img alt="high priority" src={LowPriority} />
                )}
              </Col>
              <Row>
                <p style={subHeading} className="mt-2 mb-0">
                  {repair.address}
                  {repair.unit !== "" ? " " + repair.unit : ""}, {repair.city},{" "}
                  {repair.state} {repair.zip}
                </p>
              </Row>
            </Row>
            {edit ? (
              <div className="mx-1 pt-2">
                <Row
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                  className="my-4 p-2"
                >
                  <Form.Group className="mx-2 my-3">
                    <Form.Label style={subHeading} className="mb-0 ms-2">
                      Title (character limit: 15)
                    </Form.Label>
                    <Form.Control
                      style={squareForm}
                      placeholder={title}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Group>
                </Row>
                <Row
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                >
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
                </Row>
                <Row
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                  className="my-4 p-2"
                >
                  <Form.Group className="mx-2 my-3">
                    <Form.Label style={subHeading} className="mb-0 ms-2">
                      Description
                    </Form.Label>
                    <Form.Control
                      style={squareForm}
                      placeholder={description}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                </Row>
                <Row
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                  className="my-4 p-2"
                >
                  <Row className="my-4 pt-1 mx-1">
                    <div style={subHeading} className="pt-1 mb-2">
                      Tag Priority
                    </div>
                    <Col xs={4}>
                      <img
                        src={HighPriority}
                        style={{ opacity: priority === "High" ? "1" : 0.5 }}
                        onClick={() => setPriority("High")}
                      />
                    </Col>
                    <Col xs={4}>
                      <img
                        src={MediumPriority}
                        style={{ opacity: priority === "Medium" ? "1" : 0.5 }}
                        onClick={() => setPriority("Medium")}
                      />
                    </Col>
                    <Col xs={4}>
                      <img
                        src={LowPriority}
                        style={{ opacity: priority === "Low" ? "1" : 0.5 }}
                        onClick={() => setPriority("Low")}
                      />
                    </Col>
                  </Row>
                </Row>

                <Row
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                  className="my-4  p-2"
                >
                  <Row className="my-4 pt-1 mx-1">
                    <div style={subHeading} className="pt-1 mb-2">
                      Tenant can reschedule this job as needed
                    </div>
                    <Col className="pt-1 mx-2">
                      <Row>
                        <Checkbox
                          type="CIRCLE"
                          checked={canReschedule}
                          onClick={() => setCanReschedule(true)}
                        />
                        Yes
                      </Row>
                    </Col>
                    <Col className="pt-1 mx-2">
                      <Row>
                        <Checkbox
                          type="CIRCLE"
                          checked={!canReschedule}
                          onClick={() => setCanReschedule(false)}
                        />
                        No
                      </Row>
                    </Col>
                  </Row>
                </Row>
                <Form.Group
                  className="mt-3 mb-4 p-2"
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "5px",
                  }}
                >
                  <RepairImages state={imageState} />
                </Form.Group>
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
                  <Row className="pt-1 mb-4">
                    <Col className="d-flex flex-row justify-content-evenly">
                      <Button
                        style={bluePillButton}
                        onClick={() => updateRepair()}
                      >
                        Save
                      </Button>
                    </Col>
                    <Col className="d-flex flex-row justify-content-evenly">
                      <Button
                        style={pillButton}
                        variant="outline-primary"
                        onClick={() => setEdit(false)}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            ) : (
              ""
            )}

            {!edit ? (
              <div className="mx-1 pt-2">
                <Row
                  className="pt-1 mb-4"
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                >
                  <div style={subHeading}>Request Type</div>
                  <div style={subText}>{issueType}</div>
                </Row>
                <Row
                  className="pt-1 mb-4"
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                >
                  <div style={subHeading}>Description</div>
                  <div style={subText}>{description}</div>
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
                  <div style={subText}>{notes}</div>
                </Row>
                <Row
                  className="pt-1 mb-4"
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                >
                  {repair.request_status === "NEW" ? (
                    <div className="pt-1 mb-2">
                      <Button
                        style={pillButton}
                        variant="outline-primary"
                        hidden={morePictures}
                        onClick={() => setMorePictures(!morePictures)}
                      >
                        Request more pictures
                      </Button>
                    </div>
                  ) : repair.request_status === "INFO" ? (
                    <div className="pt-1 mb-2" style={subHeading}>
                      Requested more pictures from tenant
                    </div>
                  ) : (
                    ""
                  )}
                </Row>
                <Row
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                >
                  <Row className="pt-1 mb-4" hidden={!morePictures}>
                    <div className="pt-1 mb-2" style={subHeading}>
                      Request more pictures
                    </div>

                    <Form.Group className="mt-3 mb-4">
                      <Form.Label
                        style={formLabel}
                        as="h5"
                        className="ms-1 mb-0"
                      >
                        Description of the request
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        value={morePicturesNotes}
                        placeholder="Can you please share more pictures regarding the request?"
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
                          Send Request
                        </Button>
                      </Col>
                    </Row>
                  </Row>
                </Row>

                <Row
                  className="pt-1 mb-4"
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                >
                  <div style={subHeading} className="pt-1 mb-2">
                    Tenant can reschedule this job as needed
                  </div>
                  <Col className="pt-1 mx-2">
                    <Row>
                      <Checkbox type="CIRCLE" checked={canReschedule} /> Yes
                    </Row>
                  </Col>
                  <Col className="pt-1 mx-2">
                    <Row>
                      <Checkbox type="CIRCLE" checked={!canReschedule} /> No
                    </Row>
                  </Col>
                </Row>
                <Row
                  className="pt-1 mb-4"
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                    overflow: "scroll",
                  }}
                >
                  <div style={subHeading} className="pt-1 mb-2">
                    Owner Info
                  </div>
                  {/* {console.log(repair)} */}
                  <Table
                    responsive="md"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Owner Name</TableCell>
                        <TableCell align="center">Email</TableCell>
                        <TableCell align="center">Phone Number</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell align="center">
                          {repair.owner[0].owner_first_name}{" "}
                          {repair.owner[0].owner_last_name}
                        </TableCell>
                        <TableCell align="center">
                          {repair.owner[0].owner_email}
                        </TableCell>
                        <TableCell align="center">
                          {repair.owner[0].owner_phone_number}
                        </TableCell>
                        <TableCell align="center">
                          <a href={`tel:${repair.owner[0].owner_phone_number}`}>
                            <img src={Phone} alt="Phone" style={smallImg} />
                          </a>
                          {/* <a href={`mailto:${repair.owner[0].owner_email}`}> */}
                          <img
                            onClick={() => {
                              setShowMessageFormOwner(true);
                              setSelectedOwner(repair.owner[0]);
                            }}
                            src={Message}
                            alt="Message"
                            style={smallImg}
                          />
                          {/* </a> */}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Row>
                {repair.rentalInfo !== "Not Rented" ? (
                  <Row
                    className="pt-1 mb-4"
                    style={{
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                      borderRadius: "10px",
                      opacity: 1,
                      overflow: "scroll",
                    }}
                  >
                    {" "}
                    <div style={subHeading} className="pt-1 mb-2">
                      Tenant Info
                    </div>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Tenant Name </TableCell>
                          <TableCell align="center">Tenant Email</TableCell>
                          <TableCell align="center">
                            Tenant Phone Number
                          </TableCell>
                          <TableCell align="center">Lease Start Date</TableCell>
                          <TableCell align="center">Lease End Date</TableCell>
                          <TableCell align="center">Tenant Payments</TableCell>
                          <TableCell align="center">Lease Docs</TableCell>

                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {repair.rentalInfo.map((rf) => {
                          return (
                            <TableRow>
                              <TableCell align="center">
                                {tenantInfo.map((tf) => {
                                  return (
                                    <p>
                                      {" "}
                                      {tf.tenantFirstName} {tf.tenantLastName}
                                    </p>
                                  );
                                })}
                              </TableCell>{" "}
                              <TableCell align="center">
                                {tenantInfo.map((tf) => {
                                  return <p> {tf.tenantEmail}</p>;
                                })}
                              </TableCell>{" "}
                              <TableCell align="center">
                                {tenantInfo.map((tf) => {
                                  return <p> {tf.tenantPhoneNumber}</p>;
                                })}
                              </TableCell>
                              <TableCell align="center">
                                {rf.lease_start}
                              </TableCell>
                              <TableCell align="center">
                                {rf.lease_end}
                              </TableCell>
                              <TableCell align="center">
                                {JSON.parse(rf.rent_payments).map((rp) => {
                                  return (
                                    <Row className="d-flex justify-content-center align-items-center p-2">
                                      {rp.fee_name}: ${rp.charge}
                                    </Row>
                                  );
                                })}
                              </TableCell>
                              <TableCell align="center">
                                {JSON.parse(rf.documents).length > 0
                                  ? JSON.parse(rf.documents).map((rp) => {
                                      return (
                                        <Row className="d-flex justify-content-center align-items-center p-2">
                                          <Col
                                            className=" d-flex align-items-left"
                                            style={{
                                              font: "normal normal 600 18px Bahnschrift-Regular",
                                              color: "#007AFF",
                                              textDecoration: "underline",
                                            }}
                                          >
                                            {rp.description == ""
                                              ? rp.name
                                              : rp.description}
                                          </Col>
                                          <Col className=" d-flex justify-content-end">
                                            <a
                                              href={rp.link}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              <img
                                                src={File}
                                                style={smallImg}
                                                alt="open document"
                                              />
                                            </a>
                                          </Col>
                                        </Row>
                                      );
                                    })
                                  : "No documents"}
                              </TableCell>
                              <TableCell align="center">
                                {tenantInfo.map((tf) => {
                                  return (
                                    <Row>
                                      <Col className="d-flex justify-content-center">
                                        <a href={`tel:${tf.tenantPhoneNumber}`}>
                                          <img
                                            src={Phone}
                                            alt="Phone"
                                            style={smallImg}
                                          />
                                        </a>
                                        {/* <a href={`mailto:${tf.tenantEmail}`}> */}
                                        <img
                                          onClick={() => {
                                            setShowMessageFormTenant(true);
                                            setSelectedTenant(tf);
                                          }}
                                          src={Message}
                                          alt="Message"
                                          style={smallImg}
                                        />
                                        {/* </a> */}
                                      </Col>
                                    </Row>
                                  );
                                })}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Row>
                ) : (
                  <Row
                    className="pt-1 mb-4"
                    style={{
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                      borderRadius: "10px",
                      opacity: 1,
                      overflow: "scroll",
                    }}
                  >
                    {" "}
                    Not Rented
                  </Row>
                )}

                <Row hidden={true} className="pt-1">
                  <Col className="d-flex flex-row justify-content-evenly">
                    <Button
                      style={bluePillButton}
                      onClick={() => setScheduleMaintenance(true)}
                    >
                      Schedule Maintenance
                    </Button>
                  </Col>
                </Row>
                <Row className="pt-1 mt-3 mb-2">
                  <Col className="d-flex flex-row justify-content-evenly">
                    <Button
                      style={pillButton}
                      variant="outline-primary"
                      onClick={() => setRequestQuote(true)}
                    >
                      Request Quotes from Maintenance
                    </Button>
                  </Col>
                </Row>
              </div>
            ) : (
              ""
            )}
          </div>
          <div
            className="mx-2 mt-2 mb-5 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
            hidden={!requestQuote}
          >
            <Row style={headings}>
              <Col>{repair.title}</Col>
              <Col xs={4}>
                {repair.priority === "High" ? (
                  <img alt="low priority" src={HighPriority} />
                ) : repair.priority === "Medium" ? (
                  <img alt="medium priority" src={MediumPriority} />
                ) : (
                  <img alt="high priority" src={LowPriority} />
                )}
              </Col>
            </Row>
            <Row style={subHeading}>
              <div>Select businesses to request a quote:</div>
            </Row>
            <div>
              {businesses.length > 0 &&
                businesses.map((business, i) => (
                  <Row
                    className="my-3 p-2"
                    key={i}
                    style={{
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                      boxShadow: business.quote_requested
                        ? "0px 3px 6px #00000029"
                        : "none",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <Col xs={1} className="mt-2">
                      <Row>
                        <Checkbox
                          type="BOX"
                          checked={businesses[i].quote_requested}
                          onClick={() => toggleBusiness(i)}
                        />
                      </Row>
                    </Col>
                    <Col>
                      <Row style={mediumBold}>{business.business_name}</Row>
                      <Row className="m-3" style={subText}>
                        {JSON.parse(business.business_services_fees).length >
                        0 ? (
                          <Table
                            classes={{ root: classes.customTable }}
                            size="small"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Fee Name</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Per</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {JSON.parse(business.business_services_fees).map(
                                (service, i) => (
                                  <TableRow key={i}>
                                    <TableCell>
                                      {service.service_name}
                                    </TableCell>
                                    <TableCell>${service.charge}</TableCell>

                                    <TableCell>{service.per}</TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        ) : (
                          ""
                        )}
                      </Row>
                      <Row className="d-flex flex-row align-items-center justify-content-evenly">
                        <Col className="d-flex flex-row align-items-center justify-content-end">
                          <a href={`tel:${businesses.business_phone_number}`}>
                            <img
                              src={Phone}
                              className="mx-1"
                              style={{ width: "30px", height: "30px" }}
                            />
                          </a>
                          <a href={`mailto:${businesses.business_email}`}>
                            <img
                              src={Message}
                              alt="Message"
                              style={{ width: "30px", height: "30px" }}
                            />
                          </a>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ))}
            </div>
            <Row className="mt-4 mb-4">
              <Col className="d-flex justify-content-evenly">
                <Button style={bluePillButton} onClick={sendQuotesRequest}>
                  Send Quote Request to Maintenace
                </Button>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col className="d-flex justify-content-evenly">
                <Button
                  style={redPillButton}
                  onClick={() => setRequestQuote(false)}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </div>
          {!edit && !requestQuote && quotes && quotes.length > 0 && (
            <div className="pb-4 mb-4">
              {/* {console.log("here")} */}
              {quotes &&
                quotes.length > 0 &&
                quotes.map((quote, i) => (
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
                    {quote.quote_status === "AGREED" ||
                    quote.quote_status === "ACCEPTED" ||
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
                                <TableCell align="center">Notes</TableCell>
                                <TableCell align="center">Event Type</TableCell>
                                <TableCell align="center">
                                  Total Estimate
                                </TableCell>
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
                                            {service.service_name}: $
                                            {service.charge}{" "}
                                            {service.per === "Hour"
                                              ? `/${service.per}`
                                              : "One-Time Fee"}
                                          </div>
                                        </div>
                                      )
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                  {quote.notes}
                                </TableCell>
                                <TableCell align="center">
                                  {" "}
                                  {quote.event_type} hour job
                                </TableCell>
                                <TableCell align="center">
                                  {" "}
                                  $ {quote.total_estimate}
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
                      <div className="mx-2 my-2 p-3">No quote info</div>
                    ) : (
                      ""
                    )}
                    <Row
                      hidden={quote.quote_status !== "SENT"}
                      className="pt-1 mb-4"
                    >
                      <Col className="d-flex flex-row justify-content-evenly">
                        <Button
                          style={bluePillButton}
                          onClick={() => acceptQuote(quote)}
                        >
                          Accept Quote
                        </Button>
                      </Col>
                      <Col className="d-flex flex-row justify-content-evenly">
                        <Button
                          style={redPillButton}
                          onClick={() => setRejectQuote(true)}
                        >
                          Reject Quote
                        </Button>
                      </Col>
                    </Row>
                    <Row
                      hidden={quote.quote_status === "SENT"}
                      className="pt-1 mb-4"
                    >
                      <Col className="d-flex flex-row justify-content-evenly">
                        <Button
                          style={
                            (quote.quote_status === "ACCEPTED" ||
                              quote.quote_status === "AGREED" ||
                              quote.quote_status === "PAID") &&
                            (quote.request_status === "PROCESSING" ||
                              quote.request_status === "SCHEDULED" ||
                              quote.request_status === "SCHEDULE" ||
                              quote.request_status === "RESCHEDULE" ||
                              quote.request_status === "FINISHED" ||
                              quote.request_status === "COMPLETED")
                              ? greenPill
                              : quote.quote_status === "REJECTED" ||
                                quote.quote_status === "REFUSED"
                              ? redPill
                              : orangePill
                          }
                        >
                          {quote.quote_status === "REQUESTED"
                            ? "Waiting for quote from business"
                            : quote.quote_status === "REJECTED"
                            ? "You've Rejected the Quote"
                            : quote.quote_status === "ACCEPTED" &&
                              quote.request_status === "PROCESSING"
                            ? "You've Accepted the Quote"
                            : quote.quote_status === "SENT"
                            ? "Waiting for quote from business"
                            : quote.quote_status === "REFUSED"
                            ? "Business refused to send a quote"
                            : quote.quote_status === "ACCEPTED" &&
                              quote.request_status === "SCHEDULE"
                            ? "Maintenance Sent Schedule"
                            : quote.quote_status === "ACCEPTED" &&
                              quote.request_status === "RESCHEDULE"
                            ? "Reschedule Requested"
                            : quote.quote_status === "AGREED" &&
                              quote.request_status === "SCHEDULED"
                            ? "Maintenance Scheduled"
                            : quote.quote_status === "AGREED" &&
                              quote.request_status === "FINISHED"
                            ? "Maintenance Finished"
                            : quote.request_status === "COMPLETED" &&
                              quote.quote_status === "AGREED"
                            ? "Maintenance Completed"
                            : quote.quote_status === "PAID" &&
                              quote.request_status === "COMPLETED"
                            ? "Maintenance Paid"
                            : quote.quote_status === "WITHDRAWN" &&
                              quote.request_status === "PROCESSING"
                            ? "Quote Request Withdrawn"
                            : quote.request_status === "CANCELLED"
                            ? "Maintenance Request Cancelled"
                            : "Another quote accepted"}
                        </Button>
                      </Col>
                    </Row>
                    <Row className="pt-1 mb-4">
                      <Col className="d-flex flex-row justify-content-evenly">
                        {" "}
                        {!withdrawQuote &&
                        quote.quote_status === "REQUESTED" ? (
                          <Button
                            style={bluePillButton}
                            // onClick={() => withdrawQuoteFunc(quote)}
                            onClick={() => setWithdrawQuote(true)}
                          >
                            Withdraw Quote
                          </Button>
                        ) : (
                          ""
                        )}
                      </Col>
                    </Row>
                    {!scheduleMaintenance &&
                    withdrawQuote &&
                    quote.quote_status === "REQUESTED" ? (
                      <Row className="pt-1">
                        <Form.Group className="mx-2 my-3">
                          <Form.Label style={subHeading} className="mb-0 ms-2">
                            Reason for Withdraw{" "}
                            {messagetoM === "" ? required : ""}
                          </Form.Label>
                          <Form.Control
                            style={squareForm}
                            placeholder=" Reason for Withdraw"
                            value={messagetoM}
                            onChange={(e) => setMessagetoM(e.target.value)}
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
                        <Row>
                          {" "}
                          <Col className="d-flex flex-row justify-content-evenly">
                            <Button
                              style={bluePillButton}
                              onClick={() => withdrawQuoteFunc(quote)}
                              // onClick={() => setWithdrawQuote(true)}
                            >
                              Withdraw Quote
                            </Button>
                          </Col>
                        </Row>
                      </Row>
                    ) : (
                      <Row></Row>
                    )}
                    {!scheduleMaintenance &&
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
                            // onClick={() =>
                            //   navigate(`/rescheduleRepair`, {
                            //     state: { quote: quote },
                            //   })
                            // }
                          >
                            Reschedule
                          </Button>
                        </Col>
                      </Row>
                    ) : (
                      <Row></Row>
                    )}
                    {rejectQuote &&
                    !requestQuote &&
                    !scheduleMaintenance &&
                    quote.request_status === "PROCESSING" &&
                    quote.quote_status === "SENT" ? (
                      <Row
                        style={{
                          background: "#F3F3F3 0% 0% no-repeat padding-box",
                          borderRadius: "10px",
                          opacity: 1,
                        }}
                        className="my-4 p-2"
                      >
                        <Form.Group className="mx-2 my-3">
                          <Form.Label style={subHeading} className="mb-0 ms-2">
                            Reason for Reject{" "}
                            {messagetoM === "" ? required : ""}
                          </Form.Label>
                          <Form.Control
                            style={squareForm}
                            placeholder=" Reason for Reject"
                            value={messagetoM}
                            onChange={(e) => setMessagetoM(e.target.value)}
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
                        <Row>
                          <Col className="d-flex flex-row justify-content-evenly">
                            <Button
                              style={redPillButton}
                              onClick={() => rejectQuoteFunc(quote)}
                            >
                              Reject Quote
                            </Button>
                          </Col>
                        </Row>
                      </Row>
                    ) : (
                      <Row></Row>
                    )}
                    {scheduleMaintenance &&
                    (quote.request_status === "SCHEDULE" ||
                      quote.request_status === "RESCHEDULE") &&
                    quote.quote_status === "ACCEPTED" ? (
                      <Row className="mx-2 my-2 p-3">
                        <RescheduleRepair
                          quotes={quote}
                          setScheduleMaintenance={setScheduleMaintenance}
                        />
                        {/* <Row>
                          <div style={headings}>Reschedule Maintenace</div>
                        </Row>
                        <Form.Group className="mt-3 mb-2">
                          <Form.Label
                            style={formLabel}
                            as="h5"
                            className="ms-1 mb-0"
                          >
                            Date
                          </Form.Label>
                          <Form.Control
                            style={{ borderRadius: 0 }}
                            type="date"
                            value={reDate}
                            onChange={(e) => setReDate(e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group className="mt-3 mb-2">
                          <Form.Label
                            style={formLabel}
                            as="h5"
                            className="ms-1 mb-0"
                          >
                            Time
                          </Form.Label>
                          <Form.Control
                            style={{ borderRadius: 0 }}
                            type="time"
                            value={reTime}
                            onChange={(e) => setReTime(e.target.value)}
                          />
                        </Form.Group>
                        <Row className="mt-4">
                          <Col className="d-flex justify-content-evenly">
                            <Button
                              style={bluePillButton}
                              onClick={rescheduleRepair}
                            >
                              Reschedule Maintenance
                            </Button>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col className="d-flex justify-content-evenly">
                            <Button
                              style={redPillButton}
                              onClick={() => setScheduleMaintenance(false)}
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Row> */}
                      </Row>
                    ) : (
                      <Row></Row>
                    )}
                    {finishMaintenance &&
                    JSON.parse(quote.maintenance_images) !== null &&
                    quote.request_status === "FINISHED" ? (
                      <Row className="mx-2 my-2 p-3">
                        <Row>
                          <div style={headings}>
                            Images Uploaded by Maintenance
                          </div>
                        </Row>
                        <Row className=" d-flex align-items-center justify-content-center m-3">
                          {JSON.parse(quote.maintenance_images).length === 0 ? (
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
                ))}
            </div>
          )}
          {!edit && !cancelMaintenance ? (
            <Row className="pt-1 mt-3 mb-2">
              <Col className="d-flex flex-row justify-content-evenly">
                <Button
                  style={pillButton}
                  variant="outline-primary"
                  onClick={() => setCancelMaintenance(true)}
                >
                  Cancel Maintenance
                </Button>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {cancelMaintenance ? (
            <Row>
              <Form.Group className="mx-2 my-3">
                <Form.Label style={subHeading} className="mb-0 ms-2">
                  Reason for Cancelling Maintenance{" "}
                  {messagetoM === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  placeholder=" Reason for Cancelling Maintenance"
                  value={messagetoM}
                  onChange={(e) => setMessagetoM(e.target.value)}
                />
              </Form.Group>
              <div
                className="text-center"
                style={errorMessage === "" ? hidden : {}}
              >
                <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
              </div>
              <Row className="pt-1 mt-3 mb-2">
                {showSpinner ? (
                  <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                    <ReactBootStrap.Spinner animation="border" role="status" />
                  </div>
                ) : (
                  ""
                )}

                <Col className="d-flex flex-row justify-content-evenly">
                  <Button
                    style={pillButton}
                    variant="outline-primary"
                    onClick={() => CancelMaintenanceFunc()}
                  >
                    Cancel Maintenance
                  </Button>
                </Col>
              </Row>
            </Row>
          ) : (
            ""
          )}
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <ManagerFooter />
          </div>{" "}
        </Col>
      </Row>
    </div>
  );
}

export default ManagerRepairDetail;
