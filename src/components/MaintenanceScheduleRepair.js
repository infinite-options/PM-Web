import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import { put } from "../utils/api";
import Grid from "@mui/material/Grid";
import AppContext from "../AppContext";
import Header from "../components/Header";
import Calendar from "react-calendar";
import "./calendar.css";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import {
  headings,
  subHeading,
  timeslotButton,
  activeTimeSlotButton,
  bluePillButton,
  subText,
} from "../utils/styles";

function MaintenanceScheduleRepair(props) {
  const { userData } = useContext(AppContext);
  const { user } = userData;

  const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

  const location = useLocation();
  const quotes = location.state.quote;
  const [date, setDate] = useState(new Date());
  const [minDate, setMinDate] = useState(
    new Date(moment(quotes.earliest_availability))
  );
  const [dateString, setDateString] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [timeSelected, setTimeSelected] = useState(false);
  const [showTimes, setShowTimes] = useState(false);
  const [buttonSelect, setButtonSelect] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const [timeSlotsTenant, setTimeSlotsTenant] = useState([]);
  const [timeAASlotsTenant, setTimeAASlotsTenant] = useState([]);
  const [timeSlotsMaintenance, setTimeSlotsMaintenance] = useState([]);
  const [timeAASlotsMaintenance, setTimeAASlotsMaintenance] = useState([]);

  const [meetDate, setMeetDate] = useState("");
  const [meetTime, setMeetTime] = useState("");
  const [attendees, setAttendees] = useState([{ email: "" }]);

  const [accessTokenTenant, setAccessTokenTenant] = useState("");
  const [accessTokenMaintenance, setAccessTokenMaintenance] = useState("");
  const [userEmail, setUserEmail] = useState("");

  function convert(value) {
    var a = value.split(":"); // split it at the colons

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

    return seconds + 1;
  }

  const doubleDigitMonth = (date) => {
    let str = "00" + (date.getMonth() + 1);
    return str.substring(str.length - 2);
  };

  const doubleDigitDay = (date) => {
    let str = "00" + date.getDate();
    return str.substring(str.length - 2);
  };

  // This one is for doing the sendToDatabase Post Call
  const dateFormat = (date) => {
    // console.log("dateFormat", date);

    return (
      date.getFullYear() +
      "-" +
      doubleDigitMonth(date) +
      "-" +
      doubleDigitDay(date)
    );
  };
  useEffect(() => {
    axios
      .get(BASE_URL + `/UserDetails/${quotes.rentalInfo[0].tenant_id}`)
      .then((response) => {
        // console.log(response.data);
        setAccessTokenTenant(response.data.result[0].google_auth_token);
        setUserEmail(response.data.result[0].email);
        setAttendees([{ email: response.data.result[0].email }]);

        var old_at = response.data.result[0].google_auth_token;
        var refresh_token = response.data.result[0].google_refresh_token;
        fetch(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${old_at}`,
          {
            method: "GET",
          }
        ).then((response) => {
          //console.log('in events', response);
          if (response["status"] === 400) {
            //console.log('in events if');
            let authorization_url =
              "https://accounts.google.com/o/oauth2/token";

            var details = {
              refresh_token: refresh_token,
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
              grant_type: "refresh_token",
            };
            //console.log(details);
            var formBody = [];
            for (var property in details) {
              var encodedKey = encodeURIComponent(property);
              var encodedValue = encodeURIComponent(details[property]);
              formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            fetch(authorization_url, {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded;charset=UTF-8",
              },
              body: formBody,
            })
              .then((response) => {
                return response.json();
              })
              .then((responseData) => {
                // console.log(responseData);
                return responseData;
              })
              .then((data) => {
                //console.log(data);
                let at = data["access_token"];
                setAccessTokenTenant(at);
                //console.log('in events', at);
                let url =
                  BASE_URL +
                  `/UpdateAccessToken/${quotes.rentalInfo[0].tenant_id}`;
                axios
                  .post(url, {
                    google_auth_token: at,
                  })
                  .then((response) => {})
                  .catch((err) => {
                    console.log(err);
                  });
                return accessTokenTenant;
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            setAccessTokenTenant(old_at);
            //console.log(old_at);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + `/UserDetails/${quotes.quote_business_uid}`)
      .then((response) => {
        // console.log(response.data);
        setAccessTokenMaintenance(response.data.result[0].google_auth_token);

        var old_at = response.data.result[0].google_auth_token;
        var refresh_token = response.data.result[0].google_refresh_token;
        var maintenance_user_id = response.data.result[0].user_uid;
        fetch(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${old_at}`,
          {
            method: "GET",
          }
        ).then((response) => {
          //console.log('in events', response);
          if (response["status"] === 400) {
            //console.log('in events if');
            let authorization_url =
              "https://accounts.google.com/o/oauth2/token";

            var details = {
              refresh_token: refresh_token,
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
              grant_type: "refresh_token",
            };
            //console.log(details);
            var formBody = [];
            for (var property in details) {
              var encodedKey = encodeURIComponent(property);
              var encodedValue = encodeURIComponent(details[property]);
              formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            fetch(authorization_url, {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded;charset=UTF-8",
              },
              body: formBody,
            })
              .then((response) => {
                return response.json();
              })
              .then((responseData) => {
                // console.log(responseData);
                return responseData;
              })
              .then((data) => {
                //console.log(data);
                let at = data["access_token"];
                setAccessTokenMaintenance(at);
                //console.log('in events', at);
                let url =
                  BASE_URL + `/UpdateAccessToken/${maintenance_user_id}`;
                axios
                  .post(url, {
                    google_auth_token: at,
                  })
                  .then((response) => {})
                  .catch((err) => {
                    console.log(err);
                  });
                return accessTokenTenant;
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            setAccessTokenMaintenance(old_at);
            //console.log(old_at);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (timeSelected) {
      setTimeSlotsMaintenance([]);
      setTimeSlotsTenant([]);
      let timeMini = dateString + "T" + "08:00:00";
      let timeMaxi = dateString + "T" + "20:00:00";

      const headersTenant = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + accessTokenTenant,
      };
      const headersMaintenance = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + accessTokenMaintenance,
      };
      const data = {
        timeMin: moment(timeMini).format("YYYY-MM-DDTHH:mm:ssZZ"),
        timeMax: moment(timeMaxi).format("YYYY-MM-DDTHH:mm:ssZZ"),
        items: [
          {
            id: "primary",
          },
        ],
      };

      const timeMin = dateString + "T" + "08:00:00";
      const timeMax = dateString + "T" + "20:00:00";

      axios
        .post(
          `https://www.googleapis.com/calendar/v3/freeBusy?key=${API_KEY}`,
          data,
          {
            headers: headersTenant,
          }
        )
        .then((res) => {
          let busy = res.data.calendars.primary.busy;
          // console.log("freebusy", busy);
          let start_time = Date.parse(timeMin) / 1000;
          let end_time = Date.parse(timeMax) / 1000;
          let free = [];
          let appt_start_time = start_time;
          let seconds = convert(quotes.event_duration);

          // Loop through each appt slot in the search range.
          while (appt_start_time < end_time) {
            // Add appt duration to the appt start time so we know where the appt will end.
            let appt_end_time = appt_start_time + seconds;
            // console.log("freebusy in while");
            // For each appt slot, loop through the current appts to see if it falls
            // in a slot that is already taken.

            let slot_available = true;
            busy.forEach((times) => {
              let this_start = Date.parse(times["start"]) / 1000;
              let this_end = Date.parse(times["end"]) / 1000;

              // If the appt start time or appt end time falls on a current appt, slot is taken.

              if (
                (appt_start_time >= this_start && appt_start_time < this_end) ||
                (appt_end_time > this_start && appt_end_time <= this_end) ||
                (appt_start_time < this_start && appt_end_time > this_end) ||
                appt_end_time > end_time
              ) {
                slot_available = false;
                return; // No need to continue if it's taken.
              }
            });

            // If we made it through all appts and the slot is still available, it's an open slot.
            if (slot_available) {
              free.push(
                moment(new Date(appt_start_time * 1000)).format("HH:mm:ss")
              );
            }
            // + duration minutes
            appt_start_time += 60 * 30;
          }
          // console.log("freebusy tenant", free);
          setTimeSlotsTenant(free);
        })
        .catch((error) => {
          console.log("error", error);
        });
      axios
        .post(
          `https://www.googleapis.com/calendar/v3/freeBusy?key=${API_KEY}`,
          data,
          {
            headers: headersMaintenance,
          }
        )
        .then((response) => {
          let busyM = response.data.calendars.primary.busy;

          let start_time = Date.parse(timeMin) / 1000;
          let end_time = Date.parse(timeMax) / 1000;
          let freeM = [];
          let appt_start_time = start_time;
          let seconds = convert(quotes.event_duration);

          // Loop through each appt slot in the search range.
          while (appt_start_time < end_time) {
            // Add appt duration to the appt start time so we know where the appt will end.
            let appt_end_time = appt_start_time + seconds;

            // For each appt slot, loop through the current appts to see if it falls
            // in a slot that is already taken.

            let slot_availableM = true;
            busyM.forEach((times) => {
              let this_start = Date.parse(times["start"]) / 1000;
              let this_end = Date.parse(times["end"]) / 1000;

              // If the appt start time or appt end time falls on a current appt, slot is taken.

              if (
                (appt_start_time >= this_start && appt_start_time < this_end) ||
                (appt_end_time > this_start && appt_end_time <= this_end) ||
                (appt_start_time < this_start && appt_end_time > this_end) ||
                appt_end_time > end_time
              ) {
                slot_availableM = false;
                return; // No need to continue if it's taken.
              }
            });

            // If we made it through all appts and the slot is still available, it's an open slot.
            if (slot_availableM) {
              freeM.push(
                moment(new Date(appt_start_time * 1000)).format("HH:mm:ss")
              );
            }
            // + duration minutes
            appt_start_time += 60 * 30;
          }
          // console.log("freebusy", freeM);
          setTimeSlotsMaintenance(freeM);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
    setTimeSelected(false);
  });
  useEffect(() => {
    if (timeSelected) {
      setTimeAASlotsTenant([]);
      setTimeAASlotsMaintenance([]);
      axios
        .get(
          BASE_URL +
            "/AvailableAppointmentsTenant/" +
            dateString +
            "/" +
            quotes.event_duration +
            "/" +
            quotes.rentalInfo[0].tenant_id +
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
      axios
        .get(
          BASE_URL +
            "/AvailableAppointmentsMaintenance/" +
            dateString +
            "/" +
            quotes.event_duration +
            "/" +
            quotes.quote_business_uid +
            "/" +
            "08:00" +
            "," +
            "20:00"
        )
        .then((response) => {
          // console.log("This is the information we got", response.data.result);
          response.data.result.map((r) => {
            timeAASlotsMaintenance.push(r["begin_time"]);
          });
          // console.log("This is the information we got", timeAASlotsMaintenance);
          setTimeAASlotsMaintenance(timeAASlotsMaintenance);
        });
    }
    setTimeSelected(false);
  });

  const dateChange = (date) => {
    setTimeSelected(true);
    setShowTimes(true);
    // console.log(date);
    setDate(date);
    setDateString(date);
    dateStringChange(date);
    // setTimeSelected(true);
    if (timeSelected === true) {
      setTimeSelected(false);
    }
  };

  const dateStringChange = (date) => {
    setDateString(dateFormat(date));
  };
  function selectApptTime(element) {
    // console.log("selected time", element);
    setSelectedTime(element);
    setMeetDate(dateString);
    setMeetTime(element);
    setShowButton(true);
    setButtonSelect(true);
  }

  function formatTime(date, time) {
    if (time === null) {
      return "?";
    } else {
      var newDate = new Date((date + "T" + time).replace(/\s/, "T"));
      var hours = newDate.getHours();
      var minutes = newDate.getMinutes();

      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    }
  }
  function renderAvailableApptsVertical() {
    let result = [];
    let resultTenant = [];
    let resultMaintenance = [];
    {
      timeSlotsTenant.length === 0
        ? (resultTenant = timeAASlotsTenant)
        : timeAASlotsTenant.length === 0
        ? (resultTenant = timeSlotsTenant)
        : (resultTenant = timeSlotsTenant.filter((o1) =>
            timeAASlotsTenant.some((o2) => o1 === o2)
          ));
    }
    // console.log("TimeSlots Tenant", timeAASlotsTenant);
    // console.log("TimeSlots Tenant", timeSlotsTenant);
    // console.log("TimeSlots Tenant", resultTenant);
    {
      timeSlotsMaintenance.length === 0
        ? (resultMaintenance = timeAASlotsMaintenance)
        : timeAASlotsMaintenance.length === 0
        ? (resultMaintenance = timeSlotsMaintenance)
        : (resultMaintenance = timeSlotsMaintenance.filter((o1) =>
            timeAASlotsMaintenance.some((o2) => o1 === o2)
          ));
    }
    // console.log("TimeSlots Maintenance", timeAASlotsMaintenance);
    // console.log("TimeSlots Maintenance", timeSlotsMaintenance);
    // console.log("TimeSlots Maintenance", resultMaintenance);

    result = resultTenant.filter((o1) =>
      resultMaintenance.some((o2) => o1 === o2)
    );
    // console.log("TimeSlots joined", result);
    return (
      <div style={{ height: "10rem" }}>
        <Grid
          container
          direction="column"
          spacing={1}
          style={{ height: "20rem" }}
          justifyContent="center"
          alignItems="left"
        >
          {result.map(function (element) {
            return (
              <button
                style={
                  element === selectedTime
                    ? activeTimeSlotButton
                    : timeslotButton
                }
                onClick={() => selectApptTime(element)}
              >
                {formatTime(dateString, element)}
              </button>
            );
          })}
        </Grid>
      </div>
    );
  }

  const scheduleRequest = async () => {
    // console.log("selected", meetTime, dateString);
    let meeting = {
      maintenance_request_uid: quotes.maintenance_request_uid,
      request_status: "SCHEDULED",
      scheduled_date: meetDate,
      scheduled_time: meetTime,
    };

    const response = await put("/maintenanceRequests", meeting, null, meeting);
  };

  function createMeet() {
    // console.log("selected", meetTime, dateString);
    let start_time = meetDate + "T" + meetTime;
    // console.log(start_time);
    let d = convert(quotes.event_duration);
    let et = Date.parse(start_time) / 1000 + d;
    // console.log(d);
    // console.log(et);
    let end_time = moment(new Date(et * 1000)).format();
    attendees.push({ email: userEmail });
    // console.log(attendees);
    var meet = {
      summary: quotes.title,
      location:
        quotes.address +
        ", " +
        quotes.city +
        ", " +
        quotes.state +
        " " +
        quotes.zip,
      creator: {
        email: user.email,
        self: true,
      },
      organizer: {
        email: user.email,
        self: true,
      },
      start: {
        dateTime: moment(start_time).format(),
      },
      end: {
        dateTime: moment(end_time).format(),
      },
      attendees: attendees,
    };
    // console.log(meet);

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + accessTokenTenant,
    };
    axios
      .post(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${API_KEY}`,
        meet,
        {
          headers: headers,
        }
      )
      .then((response) => {})
      .catch((error) => {
        console.log("error", error);
      });

    setAttendees([{ email: "" }]);
  }

  return (
    <div className="d-flex flex-column" style={{ overflow: "auto" }}>
      <Header
        title="Schedule Repair"
        // leftText="< Back"
        // leftFn={() => navigate("/quotes-scheduled")}
        //rightText="Sort by"
        // rightFn={() => {
        //   submitInfo();
        // }}
      />
      <div
        style={{ display: "flex", flexDirection: "column" }}
        className="pt-1 mb-2"
      >
        {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Col style={subHeading}>Dates Available</Col>
        </div> */}
        <div>
          <Calendar
            calendarType="US"
            onClickDay={(e) => {
              setTimeAASlotsMaintenance([]);
              setTimeAASlotsTenant([]);
              setTimeSlotsMaintenance([]);
              setTimeSlotsTenant([]);
              dateChange(e);
            }}
            value={date}
            minDate={minDate}
            next2Label={null}
            prev2Label={null}
          />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Col style={subHeading}>Times Available</Col>
          <Col
            hidden={showTimes}
            style={{
              font: "normal normal normal 20px/28px Bahnschrift",
              color: "#A2A2A2",
              marginTop: "3rem",
            }}
          >
            Please Select a Date Above
          </Col>
        </div>
      </div>
      {showTimes === true ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              height: "50vh",
              overflow: "scroll",
            }}
          >
            {renderAvailableApptsVertical()}
          </div>
        </div>
      ) : (
        <div></div>
      )}

      <div
        hidden={!buttonSelect}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "10rem",
        }}
      >
        <Col>
          <Button
            size="medium"
            style={bluePillButton}
            variant="outline-primary"
            onClick={() => {
              scheduleRequest();
              createMeet();
            }}
          >
            Share schedule with tenant
          </Button>
        </Col>
      </div>

      <div className="d-flex align-items-center fixed-bottom flex-grow-1">
        <Row style={{ background: "white" }}>
          <hr />
          <Col>
            <div style={headings}>
              {quotes.property_manager[0].manager_business_name}
            </div>
            <div style={subText}>Property Manager</div>
          </Col>
          <Col xs={2} className="mt-1 mb-1">
            <img
              onClick={() =>
                (window.location.href = `tel:${quotes.property_manager[0].manager_phone_number}`)
              }
              src={Phone}
              alt="Phone"
            />
          </Col>
          <Col xs={2} className="mt-1 mb-1">
            <img
              onClick={() =>
                (window.location.href = `mailto:${quotes.property_manager[0].manager_email}`)
              }
              src={Message}
              alt="Message"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default MaintenanceScheduleRepair;
