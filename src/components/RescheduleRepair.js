import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

import Grid from "@mui/material/Grid";
import Item from "@mui/material/Grid";
import AppContext from "../AppContext";
import Header from "../components/Header";
import Calendar from "react-calendar";
import "./calendar.css";
import {
  headings,
  subHeading,
  timeslotButton,
  activeTimeSlotButton,
  bluePillButton,
} from "../utils/styles";

function RescheduleRepair(props) {
  const { userData } = useContext(AppContext);
  const { access_token, user } = userData;
  const navigate = useNavigate();

  //for axios.get
  const [date, setDate] = useState(new Date());
  const [timeSelected, setTimeSelected] = useState(false);
  const [minDate, setMinDate] = useState(new Date());
  const [dateString, setDateString] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [dateString1, setDateString1] = useState(null);
  const [dateHasBeenChanged, setDateHasBeenChanged] = useState(true);
  const [apiDateString, setApiDateString] = useState(null);
  const [timeAASlots, setTimeAASlots] = useState([]);
  const [duration, setDuration] = useState(null);

  const [buttonSelect, setButtonSelect] = useState(false);
  useEffect(() => {
    if (dateHasBeenChanged) {
      // console.log("here1");

      setTimeAASlots([]);
      // console.log("here2");
      axios
        .get(
          "https://mfrbehiqnb.execute-api.us-west-1.amazonaws.com/dev/api/v2/availableAppointments/" +
            apiDateString +
            "/" +
            "0:59:59"
        )
        .then((res) => {
          // console.log("This is the information we got" + res);
          // setTimeAASlots(res.data.result);
          // console.log("Timeslots Array " + timeSlots);

          res.data.result.map((r) => {
            timeAASlots.push(r["begin_time"]);
          });
          setTimeAASlots(timeAASlots);
        });
    }
    setDateHasBeenChanged(false);
  });
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
    setDateHasBeenChanged(true);
  };
  const dateChange = (date) => {
    // console.log(timeAASlots);

    setDate(date);
    // console.log("here3");
    dateStringChange(date);
    // setTimeSelected(true);
    if (timeSelected === true) {
      setTimeSelected(false);
    }
  };
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
    // console.log("TimeSlotsAA", timeAASlots);

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
          {timeAASlots.map(function (element) {
            return (
              <button
                style={
                  element === selectedTime
                    ? activeTimeSlotButton
                    : timeslotButton
                }
                onClick={() => selectApptTime(element)}
              >
                {formatTime(apiDateString, element)}
                {/* {console.log(element)} */}
              </button>
            );
          })}
        </Grid>
      </div>
    );
  }

  function selectApptTime(element) {
    // console.log("selected time", element);
    setSelectedTime(element);
    setTimeSelected(true);
    setButtonSelect(true);
  }

  return (
    <div atyle={{ display: "flex", flexDirection: "column", height: "auto" }}>
      <Header
        title="Schedule Repairs"
        leftText="+ New"
        //leftFn={() => setTab("DASHBOARD")}
        rightText="Sort by"
        // rightFn={() => {
        //   submitInfo();
        // }}
      />
      <div
        style={{ display: "flex", flexDirection: "column" }}
        className="pt-1 mb-2"
      >
        <div>
          <div style={headings}>Schedule the repair with Joe’s Plumbing</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Col style={subHeading}>Dates Available</Col>
        </div>
        <div>
          <Calendar
            calendarType="US"
            onClickDay={(e) => {
              setTimeAASlots([]);
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
        </div>
        <div style={{ display: "flex", justifyContent: "start" }}>
          {renderAvailableApptsVertical()}
        </div>
      </div>

      <div
        hidden={!buttonSelect}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10rem",
        }}
      >
        <Col>
          <Button
            size="medium"
            style={bluePillButton}
            variant="outline-primary"
            onClick={() => navigate("/repairStatus")}
          >
            Reschedule Repair
          </Button>
        </Col>
      </div>
    </div>
  );
}

export default RescheduleRepair;
