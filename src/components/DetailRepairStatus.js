import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import {
  Container,
  Row,
  Col,
  Button,
  Carousel,
  CarouselItem,
  Image,
  Form,
} from "react-bootstrap";
import * as ReactBootStrap from "react-bootstrap";
import moment from "moment";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppContext from "../AppContext";
import HighPriority from "../icons/highPriority.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import RepairImg from "../icons/RepairImg.svg";
import { get, put } from "../utils/api";
import RepairImages from "./RepairImages";
import {
  headings,
  subHeading,
  subText,
  pillButton,
  blue,
  editButton,
  squareForm,
  payNowButton,
  bluePillButton,
} from "../utils/styles";
import { relativeTimeRounding } from "moment";
import Calendar from "react-calendar";
import axios from "axios";

function DetailRepairStatus(props) {
  const imageState = useState([]);
  const navigate = useNavigate();
  const { maintenance_request_uid, property_uid } = useParams();
  const context = useContext(AppContext);
  const { userData, refresh, ably } = context;
  const { access_token, user } = userData;
  const channel_maintenance = ably.channels.get("maintenance_status");
  const [profile, setProfile] = useState([]);
  const [repairsDetail, setRepairsDetail] = useState([]);
  const [busineesAssigned, setBusineesAssigned] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  //Editable information
  const [repairsImages, setRepairsImages] = useState([]);
  const [priority, setPriority] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pmNotes, setPMNotes] = useState("");

  const [calVisible, setCalVisible] = useState(false);
  const [calDate, setCalDate] = useState(null);
  const [dateString, setDateString] = useState("");
  const [apiDateString, setApiDateString] = useState("");
  const [date, setDate] = useState();
  const [dateString1, setDateString1] = useState("");
  const [showAccept, setShowAccept] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [timeArr, setTimeArr] = useState([
    "9:00",
    "10:00",
    "12:00",
    "3:00",
    "5:00",
  ]);
  const [timeAASlotsTenant, setTimeAASlotsTenant] = useState([]);
  const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

  function toggleCalVisible() {
    setCalVisible(!calVisible);
  }

  const doubleDigitMonth = (date) => {
    let str = "00" + (date.getMonth() + 1);
    return str.substring(str.length - 2);
  };

  const doubleDigitDay = (date) => {
    let str = "00" + date.getDate();
    return str.substring(str.length - 2);
  };

  const dateFormat1 = (date) => {
    return (
      doubleDigitMonth(date) +
      "/" +
      doubleDigitDay(date) +
      "/" +
      date.getFullYear()
    );
  };

  // This one is for the timeslotAPI call
  const dateFormat2 = (date) => {
    var months = {
      "01": "Jan",
      "02": "Feb",
      "03": "Mar",
      "04": "Apr",
      "05": "May",
      "06": "Jun",
      "07": "Jul",
      "08": "Aug",
      "09": "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dec",
      "": "",
    };
    // console.log("dateformat2", date);

    return (
      months[doubleDigitMonth(date)] +
      " " +
      doubleDigitDay(date) +
      ", " +
      date.getFullYear() +
      " "
    );
  };

  // This one is for doing the sendToDatabase Post Call
  const dateFormat3 = (date) => {
    // console.log("dateformat3", date);

    return (
      date.getFullYear() +
      "-" +
      doubleDigitMonth(date) +
      "-" +
      doubleDigitDay(date)
    );
  };
  const dateStringChange = (date) => {
    setDateString(dateFormat1(date));
    setApiDateString(dateFormat3(date));
    setDateString1(dateFormat2(date));
    // setDateHasBeenChanged(true);
  };

  function dateChange(e) {
    setDate(e);
    // console.log("here", e);
    dateStringChange(e);
  }

  function selectTime(e) {
    setScheduledTime(e);
    // console.log("here", e);
  }

  const putRepairAppt = async () => {
    const payload = {
      maintenance_request_uid: maintenance_request_uid,
      request_status: "SCHEDULE",
      scheduled_date: apiDateString,
      scheduled_time: scheduledTime,
    };
    const response = await put(
      `/maintenanceRequests?maintenance_request_uid=${maintenance_request_uid}`,
      payload
    );
    channel_maintenance.publish({ data: { te: payload } });
  };

  const acceptRepairAppt = async () => {
    const payload = {
      maintenance_request_uid: maintenance_request_uid,
      request_status: "CONFIRMED",
      scheduled_date: repairsDetail[0].scheduled_date,
      scheduled_time: repairsDetail[0].scheduled_time,
    };
    const response = await put(
      `/maintenanceRequests?maintenance_request_uid=${maintenance_request_uid}`,
      payload
    );
    channel_maintenance.publish({ data: { te: payload } });
  };

  function displayMessage() {
    if (repairsDetail.length === 0) return "loading";
    else if ((apiDateString !== "") & (scheduledTime !== "")) {
      if (!showAccept) setShowAccept(true);
      return (
        "This Repair is currently scheduled for " +
        apiDateString +
        " at " +
        scheduledTime
      );
    } else return "Repair Request is not yet scheduled.";
  }

  useEffect(() => {
    setTimeAASlotsTenant([]);
    axios
      .get(
        BASE_URL +
          "/AvailableAppointmentsTenant/" +
          // dateString +
          apiDateString +
          "/" +
          // quotes.event_duration +
          "01:59:59" +
          "/" +
          // quotes.rentalInfo[0].tenant_id +
          user.user_uid +
          "/" +
          "08:00" +
          "," +
          "20:00"
      )
      .then((res) => {
        // console.log("This is the information we got" + res);

        res.data.result.map((r) => {
          timeAASlotsTenant.push(r["begin_time"]);
        });
        setTimeAASlotsTenant(timeAASlotsTenant);
      });
    // console.log("Here are teh available time slots ", timeAASlotsTenant);
  }, [apiDateString]);

  useEffect(() => {
    if (repairsDetail !== undefined) {
      setIsLoading(false);
    }
  }, [repairsDetail]);
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await get("/tenantProperties", access_token);
      // console.log("Tenant Profile", response);
      if (response.msg === "Token has expired") {
        // console.log("here msg");
        refresh();

        return;
      }
      setProfile(response.result[0]);
    };

    fetchProfile();
  }, []);

  const fetchRepairsDetail = async () => {
    const response = await get(
      `/maintenanceRequests?maintenance_request_uid=${maintenance_request_uid}`
    );
    if (response.msg === "Token has expired") {
      // console.log("here msg");
      refresh();
      return;
    }
    setRepairsDetail(response.result);
    // console.log(response.result);
    setPMNotes(response.result[0].notes);
    // console.log(response.result[0].notes);
    // console.log(response.result[0]);
    setRepairsImages(JSON.parse(response.result[0].images));
    // console.log(response.result);
    setPriority(response.result[0].priority);
    setDescription(response.result[0].description);
    setTitle(response.result[0].title);
    const files = [];
    const images = JSON.parse(response.result[0].images);
    for (let i = 0; i < images.length; i++) {
      files.push({
        index: i,
        image: images[i],
        file: null,
        coverPhoto: i === 0,
      });
    }
    imageState[1](files);
    const fetchBusinessAssigned = async () => {
      const res = await get(
        `/businesses?business_uid=${response.result[0].assigned_business}`
      );

      setBusineesAssigned(res.result[0]);
    };
    fetchBusinessAssigned();
  };
  useEffect(() => {
    fetchRepairsDetail();
  }, []);

  function editRepair() {
    // console.log("Editing repair");
    setIsEditing(true);
  }
  const reload = () => {
    setIsEditing(false);
    fetchRepairsDetail();
  };
  const updateRepair = async () => {
    // console.log("Putting changes to database");
    // let files = JSON.parse(repairsDetail[0].images);
    // let files = imageState[0];
    let newRepair = {
      maintenance_request_uid: maintenance_request_uid,
      title: title,
      priority: priority,
      can_reschedule: true,
      assigned_business: repairsDetail[0].assigned_business,
      notes: repairsDetail[0].notes,
      request_status:
        repairsDetail[0].request_status === "INFO"
          ? "PROCESSING"
          : repairsDetail[0].request_status,
      description: description,
      scheduled_date: repairsDetail[0].scheduled_date,
      assigned_worker: repairsDetail[0].assigned_worker,
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

    // console.log(newRepair);
    setShowSpinner(true);
    const res = await put("/maintenanceRequests", newRepair, null, files);
    channel_maintenance.publish({ data: { te: newRepair } });
    setShowSpinner(false);
    reload();
    // setIsEditing(false);
  };

  return (
    <div className="h-100 d-flex flex-column" style={{ minHeight: "100%" }}>
      <Header
        title="Repairs"
        leftText="< Back"
        leftFn={() => navigate(`/${property_uid}/repairStatus`)}
        rightText="Edit"
        rightFn={() => editRepair()}
      />
      {repairsDetail === [] || isLoading === true ? (
        <Row className="mt-2 mb-2">
          <div style={blue}></div>
        </Row>
      ) : (
        <div>
          {repairsDetail.map((repair) => {
            return (
              <Container className="pt-1 mb-4">
                <Row>
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {JSON.parse(repair.images).length === 0 ? (
                      <img
                        src={RepairImg}
                        //className="w-100 h-100"
                        style={{
                          objectFit: "contain",
                          width: "350px",
                          height: " 198px",
                          // border: "1px solid #C4C4C4",
                          // borderRadius: "5px",
                        }}
                        alt="repair"
                      />
                    ) : JSON.parse(repair.images).length > 1 ? (
                      <Carousel>
                        {repairsImages.map((img) => {
                          return (
                            <Carousel.Item>
                              <Image
                                src={img}
                                style={{
                                  objectFit: "cover",
                                  width: "350px",
                                  height: " 198px",
                                  border: "1px solid #C4C4C4",
                                  borderRadius: "5px",
                                }}
                                alt="repair"
                              />
                            </Carousel.Item>
                          );
                        })}
                      </Carousel>
                    ) : (
                      <img
                        src={JSON.parse(repair.images)}
                        //className="w-100 h-100"
                        style={{
                          objectFit: "cover",
                          width: "350px",
                          height: " 198px",
                          border: "1px solid #C4C4C4",
                          borderRadius: "5px",
                        }}
                        alt="repair"
                      />
                    )}
                  </Col>
                </Row>
                {isEditing ? (
                  <Row>
                    <RepairImages state={imageState} />
                  </Row>
                ) : null}

                <Row className="mt-4">
                  <Col>
                    {isEditing ? (
                      ((<RepairImages />),
                      (
                        <input
                          style={{ margin: "10px 0px" }}
                          defaultValue={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                          }}
                        ></input>
                      ))
                    ) : (
                      <div style={headings}>{title}</div>
                    )}
                  </Col>
                </Row>

                <Row>
                  <div style={subText}>
                    {profile.address},&nbsp;
                    {profile.city},&nbsp;
                    {profile.state}&nbsp;
                    {profile.zip}
                  </div>
                </Row>

                <Row className="mt-2" style={{ padding: "7px 0px" }}>
                  {isEditing ? (
                    <Form.Group>
                      <Form.Select
                        style={squareForm}
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </Form.Select>
                    </Form.Group>
                  ) : (
                    <Col>
                      {priority === "High" ? (
                        <img alt="low priority" src={HighPriority} />
                      ) : priority === "Medium" ? (
                        <img alt="medium priority" src={MediumPriority} />
                      ) : (
                        <img alt="high priority" src={LowPriority} />
                      )}
                    </Col>
                  )}
                </Row>
                {isEditing ? (
                  <input
                    defaultValue={description}
                    style={{ width: "80vw" }}
                    onChange={(e) => {
                      // console.log(e);
                      setDescription(e.target.value);
                    }}
                  ></input>
                ) : (
                  <Row className="mt-2">
                    <div style={subText}>{description}</div>
                  </Row>
                )}

                {repair.status === "NEW" ? (
                  <Row></Row>
                ) : repair.status === "SCHEDULE" ? (
                  <Row className="mt-4">
                    <div style={headings}>Scheduled for</div>
                    <div style={subHeading}>
                      {moment(repair.scheduled_date).format(
                        "ddd, MMM DD, YYYY "
                      )}{" "}
                      at {moment(repair.scheduled_date).format("hh:mm a")}{" "}
                      <hr />
                    </div>
                    <Row>
                      <Col>
                        <Button
                          variant="outline-primary"
                          style={pillButton}
                          onClick={() => navigate("/rescheduleRepair")}
                        >
                          Reschedule
                        </Button>
                      </Col>
                    </Row>
                  </Row>
                ) : (
                  <Row className="mt-4">
                    <div style={headings}>Completed on</div>
                    <div style={subHeading}>
                      {moment(repair.scheduled_date).format(
                        "ddd, MMM DD, YYYY "
                      )}{" "}
                      at {moment(repair.scheduled_date).format("hh:mm a")}{" "}
                      <hr />
                    </div>
                  </Row>
                )}

                <div className="mt-4">
                  <Row>
                    <Col>
                      <div style={headings}>
                        {profile.manager_business_name}
                      </div>
                      <div style={subText}>Property Manager</div>
                    </Col>
                    <Col xs={2} className="mt-1 mb-1">
                      <img
                        onClick={() =>
                          (window.location.href = `tel:${profile.manager_phone_number}`)
                        }
                        src={Phone}
                        alt="Phone"
                      />
                    </Col>
                    <Col xs={2} className="mt-1 mb-1">
                      <img
                        onClick={() =>
                          (window.location.href = `mailto:${profile.manager_email}`)
                        }
                        src={Message}
                        alt="Message"
                      />
                    </Col>
                    <hr />
                  </Row>
                  {busineesAssigned ? (
                    <Row>
                      <Col>
                        <div style={headings}>
                          {busineesAssigned.business_name
                            ? busineesAssigned.business_name
                            : "hi"}
                        </div>
                        <div style={subText}>
                          {busineesAssigned.business_name
                            ? busineesAssigned.business_name
                            : "hi"}
                        </div>
                      </Col>
                      <Col xs={2} className="mt-1 mb-1">
                        <img
                          onClick={() =>
                            (window.location.href = `tel:${busineesAssigned.business_phone_number}`)
                          }
                          src={Phone}
                          alt="Phone"
                        />
                      </Col>
                      <Col xs={2} className="mt-1 mb-1">
                        <img
                          onClick={() =>
                            (window.location.href = `mailto:${busineesAssigned.business_email}`)
                          }
                          src={Message}
                          alt="Message"
                        />
                      </Col>
                      <hr />
                    </Row>
                  ) : (
                    <Row></Row>
                  )}
                </div>
              </Container>
            );
          })}
        </div>
      )}
      {calVisible ? (
        <div>
          <Calendar
            calendarType="US"
            // onClickDay={(e) => {
            //     setTimeAASlots([]);
            //     dateChange(e);
            // }}
            onClickDay={(e) => dateChange(e)}
            // value={date}
            // minDate={minDate}
            // next2Label={null}
            // prev2Label={null}
          />
          {/*{timeArr.map((time) =>*/}
          {/*      <button onClick={() => setScheduledTime(time)} style = {bluePillButton}>{time}</button>)}*/}
          {timeAASlotsTenant.map((time) => (
            <button
              onClick={() => setScheduledTime(time)}
              style={bluePillButton}
            >
              {time}
            </button>
          ))}
        </div>
      ) : (
        ""
      )}

      {displayMessage()}
      {showAccept ? (
        <button
          style={payNowButton}
          onClick={acceptRepairAppt}
          children="Accept"
        />
      ) : (
        ""
      )}
      <button
        style={payNowButton}
        onClick={toggleCalVisible}
        children="Reschedule"
      />
      {showAccept ? (
        <button
          style={payNowButton}
          onClick={putRepairAppt}
          children="Confirm"
        />
      ) : (
        ""
      )}

      {repairsDetail && pmNotes ? (
        <div>
          <div style={{ ...headings, marginLeft: "10px" }}>
            Property Manager Notes:
          </div>
          <div style={{ ...subHeading, marginLeft: "20px" }}>{pmNotes}</div>
        </div>
      ) : null}
      {showSpinner ? (
        <div className="w-100 d-flex flex-column justify-content-center align-items-center">
          <ReactBootStrap.Spinner animation="border" role="status" />
        </div>
      ) : (
        ""
      )}
      {isEditing ? (
        <button
          style={{ ...editButton, margin: "5% 25%" }}
          onClick={() => updateRepair()}
        >
          Done
        </button>
      ) : null}
    </div>
  );
}

export default DetailRepairStatus;
