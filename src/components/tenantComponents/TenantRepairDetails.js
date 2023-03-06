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
  orangePill,
  pillButton,
} from "../../utils/styles";
import { get, put } from "../../utils/api";
import "react-multi-carousel/lib/styles.css";
const useStyles = makeStyles((theme) => ({
  priorityInactive: {
    opacity: "0.5",
  },
  priorityActive: {
    opacity: "1",
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
  const imageState = useState([]);
  const { userData, refresh } = useContext(AppContext);
  const { access_token } = userData;
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [issueType, setIssueType] = useState("Plumbing");
  const [requestQuote, setRequestQuote] = useState(false);
  const [scheduleMaintenance, setScheduleMaintenance] = useState(false);
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
    setBusinesses(businesses);
    // console.log(request_response.result[0]);
    setRepairsDetail(request_response.result[0]);
    setTitle(request_response.result[0].title);
    setDescription(request_response.result[0].description);
    setPriority(request_response.result[0].priority);
    setIssueType(request_response.result[0].request_type);
    if (request_response.result[0].request_status === "SCHEDULED") {
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

    const response = await get(
      `/maintenanceQuotes?linked_request_uid=${repair.maintenance_request_uid}`
    );
    // console.log(response.result)
    setQuotes(response.result);
    setIsLoading(false);
  };

  useEffect(fetchBusinesses, [access_token]);
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

    fetchBusinesses();
    setScheduleMaintenance(false);
    setIsEditing(false);
  };
  const acceptQuote = async (quote) => {
    const body = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      quote_status: "ACCEPTED",
    };
    const response = await put("/maintenanceQuotes", body);
    fetchBusinesses();
  };

  const rejectQuote = async (quote) => {
    const body = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      quote_status: "REJECTED",
    };
    const response = await put("/maintenanceQuotes", body);
    fetchBusinesses();
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
        <div className="w-100 mb-5 overflow-scroll">
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
                    <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
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
                  {JSON.parse(repairsDetail.images).length === 0 ? (
                    <Row className=" m-3">
                      <img
                        src={RepairImg}
                        style={{
                          objectFit: "contain",
                          width: "200px",
                          height: " 200px",
                        }}
                        alt="repair"
                      />
                    </Row>
                  ) : JSON.parse(repairsDetail.images).length > 1 ? (
                    <Row className=" m-3">
                      <Carousel responsive={responsive}>
                        {JSON.parse(repairsDetail.images).map((images) => {
                          return (
                            <img
                              src={`${images}?${Date.now()}`}
                              style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "contain",
                              }}
                              alt="repair"
                            />
                          );
                        })}
                      </Carousel>
                    </Row>
                  ) : (
                    <Row className=" m-3">
                      <img
                        src={JSON.parse(repairsDetail.images)}
                        //className="w-100 h-100"
                        style={{
                          objectFit: "contain",
                          width: "200px",
                          height: " 200px",
                          border: "1px solid #C4C4C4",
                          borderRadius: "5px",
                        }}
                        alt="repair"
                      />
                    </Row>
                  )}
                  <Form.Group
                    className="p-2"
                    style={{
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                      borderRadius: "5px",
                    }}
                  >
                    <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
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
                  <Form.Group
                    className="mt-3 mb-4 p-2"
                    style={{
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                      borderRadius: "5px",
                    }}
                  >
                    <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                      Issue Type
                    </Form.Label>
                    <div className="ms-1 mb-0"> {issueType}</div>
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
                      <div className="ms-1 mb-0"> {title}</div>
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
                      <div className="ms-1 mb-0">{description}</div>
                    </Form.Group>
                  </Form>
                </div>
              )}
            </div>
          )}
          {!isEditing && !requestQuote && quotes && quotes.length > 0 && (
            <div className="pb-4 mb-4">
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
                    {quote.quote_status === "ACCEPTED" ||
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
                                <TableCell align="center">Event Type</TableCell>
                                {/* <TableCell align="center">
                                  Total Estimate
                                </TableCell> */}
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
                                  {quote.event_type}
                                </TableCell>
                                {/* <TableCell align="center">
                                  {" "}
                                  $ {quote.total_estimate}
                                </TableCell> */}
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

                    {/* <Row
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
                          onClick={() => rejectQuote(quote)}
                        >
                          Reject Quote
                        </Button>
                      </Col>
                    </Row> */}

                    {/* <Row
                      hidden={quote.quote_status === "SENT"}
                      className="pt-1 mb-4"
                    >
                      <Col className="d-flex flex-row justify-content-evenly">
                        <Button style={orangePill}>
                           {quote.quote_status === "REQUESTED"
                            ? "Waiting for quote from business"
                            : quote.quote_status === "REJECTED"
                            ? "You've Rejected the Quote"
                            : quote.quote_status === "ACCEPTED" &&
                              quote.request_status !== "SCHEDULED"
                            ? "You've Accepted the Quote"
                            : quote.quote_status === "SENT"
                            ? "Waiting for quote from business"
                            : quote.quote_status === "REFUSED"
                            ? "Business refused to send a quote"
                            : quote.quote_status === "ACCEPTED" &&
                              quote.request_status === "SCHEDULED"
                            ? "Maintenace Scheduled"
                            : "Another quote accepted"}
                        </Button>
                      </Col>
                    </Row> */}
                    {!scheduleMaintenance &&
                    repair.can_reschedule &&
                    quote.quote_status === "ACCEPTED" ? (
                      <Row className="pt-1">
                        <Col className="d-flex flex-row justify-content-evenly">
                          <Button
                            style={bluePillButton}
                            onClick={() => setScheduleMaintenance(true)}
                          >
                            Reschedule Maintenance
                          </Button>
                        </Col>
                      </Row>
                    ) : (
                      <Row></Row>
                    )}
                    {scheduleMaintenance ? (
                      <Row className="mx-2 my-2 p-3">
                        <Row>
                          <div style={headings}>Schedule Maintenace</div>
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
                              Schedule Maintenance
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
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <TenantFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenantRepairDetails;
