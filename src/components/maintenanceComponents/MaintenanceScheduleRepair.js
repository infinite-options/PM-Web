import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import Grid from "@mui/material/Grid";
import * as ReactBootStrap from "react-bootstrap";
import Calendar from "react-calendar";
import AppContext from "../../AppContext";
import MaintenanceFooter from "./MaintenanceFooter";
import MailDialogManager from "../MailDialog";
import MessageDialogManager from "../MessageDialog";
import MailDialogOwner from "../MailDialog";
import MessageDialogOwner from "../MessageDialog";
import Header from "../Header";
import SideBar from "./SideBar";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import Mail from "../../icons/Mail.svg";
import {
  headings,
  subHeading,
  timeslotButton,
  activeTimeSlotButton,
  bluePillButton,
  subText,
  sidebarStyle,
} from "../../utils/styles";
import { put } from "../../utils/api";
import "./calendar.css";

function MaintenanceScheduleRepair(props) {
  const { userData, ably } = useContext(AppContext);
  const { user } = userData;
  const channel_maintenance = ably.channels.get("maintenance_status");
  const imageState = useState([]);

  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

  const location = useLocation();
  const quotes = location.state.quote;
  const user_book =
    quotes.rentalInfo.length > 0
      ? quotes.rentalInfo[0].tenant_id
      : quotes.property_manager.length > 0
      ? quotes.property_manager[0].manager_id
      : quotes.owner_id;
  const [date, setDate] = useState(new Date());
  var currentDate = new Date(+new Date() + 86400000);
  const [minDate, setMinDate] = useState(
    currentDate > new Date(moment(quotes.earliest_availability))
      ? currentDate
      : new Date(moment(quotes.earliest_availability))
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

  const [showSpinner, setShowSpinner] = useState(false);
  const [accessTokenTenant, setAccessTokenTenant] = useState("");
  const [accessTokenMaintenance, setAccessTokenMaintenance] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [maintenanceBusiness, setMaintenanceBusiness] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [showMailFormManager, setShowMailFormManager] = useState(false);
  const [showMessageFormManager, setShowMessageFormManager] = useState(false);
  const onCancelManagerMail = () => {
    setShowMailFormManager(false);
  };
  const onCancelManagerMessage = () => {
    setShowMessageFormManager(false);
  };
  const [selectedOwner, setSelectedOwner] = useState("");
  const [showMailFormOwner, setShowMailFormOwner] = useState(false);
  const [showMessageFormOwner, setShowMessageFormOwner] = useState(false);
  const onCancelOwnerMail = () => {
    setShowMailFormOwner(false);
  };
  const onCancelOwnerMessage = () => {
    setShowMessageFormOwner(false);
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
  // console.log(accessTokenTenant);
  useEffect(() => {
    if (quotes.rentalInfo.length > 0) {
      // console.log("tenant get access token", quotes.rentalInfo[0]);
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
    } else if (quotes.property_manager.length > 0) {
      // console.log("pm get access token");
    } else {
      // console.log("owner get access token");
      axios
        .get(BASE_URL + `/UserDetails/${quotes.owner_id}`)
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
                  let url = BASE_URL + `/UpdateAccessToken/${quotes.owner_id}`;
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
    }
  }, []);
  useEffect(() => {
    let business_uid = "";
    for (const business of userData.user.businesses) {
      if (business.business_type === "MAINTENANCE") {
        business_uid = business.business_uid;
        setMaintenanceBusiness(business);
        break;
      }
    }
    if (business_uid === "") {
    }
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

      let date =
        dateString >
        moment(new Date(+new Date() + 86400000)).format("YYYY-MM-DD")
          ? dateString
          : moment(new Date(+new Date() + 86400000)).format("YYYY-MM-DD");
      axios
        .get(
          BASE_URL +
            "/AvailableAppointmentsTenant/" +
            date +
            "/" +
            quotes.event_duration +
            "/" +
            user_book +
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

    {
      timeSlotsMaintenance.length === 0
        ? (resultMaintenance = timeAASlotsMaintenance)
        : timeAASlotsMaintenance.length === 0
        ? (resultMaintenance = timeSlotsMaintenance)
        : (resultMaintenance = timeSlotsMaintenance.filter((o1) =>
            timeAASlotsMaintenance.some((o2) => o1 === o2)
          ));
    }

    result = resultTenant.filter((o1) =>
      resultMaintenance.some((o2) => o1 === o2)
    );
    // console.log("TimeSlots joined", result);
    return (
      <div className="m-5" style={{ height: "5rem" }}>
        <MailDialogManager
          title={"Email"}
          isOpen={showMailFormManager}
          senderPhone={maintenanceBusiness.business_phone_number}
          senderEmail={maintenanceBusiness.business_email}
          senderName={maintenanceBusiness.business_name}
          requestCreatedBy={maintenanceBusiness.business_uid}
          userMessaged={selectedManager.manager_business_name}
          receiverEmail={selectedManager.manager_email}
          receiverPhone={selectedManager.manager_phone_number}
          onCancel={onCancelManagerMail}
        />

        <MessageDialogManager
          title={"Text Message"}
          isOpen={showMessageFormManager}
          senderPhone={maintenanceBusiness.business_phone_number}
          senderEmail={maintenanceBusiness.business_email}
          senderName={maintenanceBusiness.business_name}
          requestCreatedBy={maintenanceBusiness.business_uid}
          userMessaged={selectedManager.manager_business_name}
          receiverEmail={selectedManager.manager_email}
          receiverPhone={selectedManager.manager_phone_number}
          onCancel={onCancelManagerMessage}
        />
        <MailDialogOwner
          title={"Email"}
          isOpen={showMailFormOwner}
          senderPhone={maintenanceBusiness.business_phone_number}
          senderEmail={maintenanceBusiness.business_email}
          senderName={maintenanceBusiness.business_name}
          requestCreatedBy={maintenanceBusiness.business_uid}
          userMessaged={
            selectedOwner.owner_first_name + " " + selectedOwner.owner_last_name
          }
          receiverEmail={selectedOwner.owmer_email}
          receiverPhone={selectedOwner.owmer_phone_number}
          onCancel={onCancelOwnerMail}
        />

        <MessageDialogOwner
          title={"Text Message"}
          isOpen={showMessageFormOwner}
          senderPhone={maintenanceBusiness.business_phone_number}
          senderEmail={maintenanceBusiness.business_email}
          senderName={maintenanceBusiness.business_name}
          requestCreatedBy={maintenanceBusiness.business_uid}
          userMessaged={
            selectedOwner.owner_first_name + " " + selectedOwner.owner_last_name
          }
          receiverEmail={selectedOwner.owmer_email}
          receiverPhone={selectedOwner.owmer_phone_number}
          onCancel={onCancelOwnerMessage}
        />
        <Grid
          container
          direction="column"
          spacing={1}
          style={{ height: "25rem" }}
          justifyContent="center"
          alignItems="start"
        >
          <Row className="d-flex flex-start m-3">
            {" "}
            Morning Time:{" "}
            {result.map(function (element) {
              return "08:00:00" <= element && element < "12:00:00" ? (
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
              ) : (
                ""
              );
            })}
          </Row>{" "}
          <Row className="d-flex flex-start m-3">
            Afternoon Time:{" "}
            {result.map(function (element) {
              return "12:00:00" <= element && element < "17:00:00" ? (
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
              ) : (
                ""
              );
            })}
          </Row>
          <Row className="d-flex flex-start m-3">
            Evening Time:{" "}
            {result.map(function (element) {
              return "17:00:00" <= element ? (
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
              ) : (
                ""
              );
            })}
          </Row>
        </Grid>
      </div>
    );
  }

  const scheduleRequest = async () => {
    // console.log("selected", meetTime, dateString);
    setShowSpinner(true);
    let meeting = {
      maintenance_request_uid: quotes.maintenance_request_uid,
      request_status: "SCHEDULE",
      scheduled_date: meetDate,
      scheduled_time: meetTime,
      request_adjustment_date: new Date(),
    };
    const images = JSON.parse(quotes.images);
    for (let i = -1; i < images.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      meeting[key] = images[i + 1];
    }

    const response = await put("/maintenanceRequests", meeting, null, images);

    channel_maintenance.publish({ data: { te: meeting } });
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
    setShowSpinner(false);
    navigate(-2);
  }
  // console.log(quotes);
  return (
    <div className="w-100 overflow-hidden">
      <Row className="w-100 mb-5 overflow-hidden">
        {" "}
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5 overflow-scroll">
          <Header
            title={`Schedule Repair with a${
              quotes.rentalInfo.length > 0
                ? ` Tenant`
                : quotes.property_manager.length > 0
                ? ` Property Manager`
                : ` Owner`
            }`}
            leftText="< Back"
            leftFn={() => navigate(-1)}
          />
          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
            // style={{ display: "flex", flexDirection: "column" }}
            // className="pt-1 mb-2"
          >
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
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
          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
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
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: "60vh",
                  overflow: "scroll",
                }}
              >
                {renderAvailableApptsVertical()}
              </div>
            </div>
          ) : (
            <div></div>
          )}
          {showSpinner ? (
            <div className="w-100 d-flex flex-column justify-content-center align-items-center">
              <ReactBootStrap.Spinner animation="border" role="status" />
            </div>
          ) : (
            ""
          )}
          <div
            hidden={!buttonSelect}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "5rem",
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
                Share Schedule
              </Button>
            </Col>
          </div>
          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            {quotes.property_manager.length > 0 ? (
              <Row className="m-3">
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
                    onClick={() => {
                      setShowMessageFormManager(true);
                      setSelectedManager(quotes.property_manager[0]);
                    }}
                    src={Message}
                    alt="Message"
                  />
                </Col>
                <Col xs={2} className="mt-1 mb-1">
                  <img
                    onClick={() => {
                      setShowMailFormManager(true);
                      setSelectedManager(quotes.property_manager[0]);
                    }}
                    src={Mail}
                    alt="Mail"
                  />
                </Col>
              </Row>
            ) : (
              <Row className="m-3">
                <Col>
                  <div style={headings}>
                    {quotes.owner[0].owner_first_name}{" "}
                    {quotes.owner[0].owner_last_name}
                  </div>
                  <div style={subText}>Property Owner</div>
                </Col>
                <Col xs={2} className="mt-1 mb-1">
                  <img
                    onClick={() =>
                      (window.location.href = `tel:${quotes.owner[0].owner_phone_number}`)
                    }
                    src={Phone}
                    alt="Phone"
                  />
                </Col>
                <Col xs={2} className="mt-1 mb-1">
                  <img
                    onClick={() => {
                      setShowMessageFormOwner(true);
                      setSelectedOwner(quotes.owner[0]);
                    }}
                    src={Message}
                    alt="Message"
                  />
                </Col>
                <Col xs={2} className="mt-1 mb-1">
                  <img
                    onClick={() => {
                      setShowMailFormOwner(true);
                      setSelectedOwner(quotes.owner[0]);
                    }}
                    src={Mail}
                    alt="Mail"
                  />
                </Col>
              </Row>
            )}
          </div>

          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <MaintenanceFooter />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default MaintenanceScheduleRepair;
