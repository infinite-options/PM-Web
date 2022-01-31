import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import moment from "moment";
import AppContext from "../AppContext";
import Header from "../components/Header";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import RepairRequest from "../icons/repair_request.svg";
import RepairStatus from "../icons/repair_status.svg";
import Documents from "../icons/documents.svg";
import QuotesRejected from "../icons/QuotesRejected.svg";
import JobCompleted from "../icons/JobCompleted.svg";
import SearchPM from "../icons/searchPM.svg";
import { get } from "../utils/api";
import {
  headings,
  upcoming,
  upcomingHeading,
  upcomingText,
  blue,
  bluePill,
  greenBorderPill,
  address,
  actions,
} from "../utils/styles";

function MaintenanceDashboard(props) {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const { setShowFooter } = props;
  const [profile, setProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  let access_token = userData.access_token;

  const fetchProfile = async () => {
    const response = await get(`/tenantProfileInfo`, access_token);
    console.log(response);
    setProfile(response.result[0]);
  };
  //console.log(profile);
  useEffect(() => {
    if (profile != undefined) {
      setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    setShowFooter(true);
  });

  //useEffect(fetchProfile, []);

  const goToQuotesRequested = () => {
    navigate("/ScheduledJobs");
  };
  const goToJobsCompleted = () => {
    navigate("/residentAnnouncements");
  };
  const goToQuotesRejectedM = () => {
    navigate("/emergency");
  };
  const goToQuotesRejectedY = () => {
    navigate("/emergency");
  };
  const goToScheduledJobs = () => {
    navigate("/scheduledJobs");
  };
  const goToQuotesSent = () => {
    navigate("/ScheduledJobs");
  };
  const goToSearchPM = () => {
    navigate("/tenantPropertyManagers");
  };
  console.log(profile);
  return (
    <div className="h-100">
      <Header title="All requests" />

      <Container className="pt-1 mb-4">
        <Row style={headings}>
          <div>Hector’s Plumbing</div>
        </Row>
        <Row style={upcoming} className="mt-2 mb-2">
          <div style={upcomingHeading} className="mt-1 mb-1">
            Upcoming job:
            <br />
            Toilet Plumbing scheduled for
            <br /> Today at 12:00 pm
            <br />
          </div>

          <Col className="mt-1 mb-1">
            <div style={upcomingText}>
              For questions / concerns, feel free to contact the property
              manager
            </div>
          </Col>
          <Col xs={2} style={upcomingText} className="mt-1 mb-1">
            <img src={Phone} />
          </Col>
          <Col xs={2} style={upcomingText} className="mt-1 mb-1">
            <img src={Message} />
          </Col>
        </Row>

        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
          className="mb-4"
        >
          <div style={headings} className="mt-4 mb-1">
            Actions
          </div>
          <Col xs={3} style={actions}>
            <img
              style={{ width: "50px", height: "50px", cursor: "pointer" }}
              src={RepairRequest}
              onClick={goToQuotesRequested}
            />
            <div>Quotes Requested</div>
          </Col>
          <Col xs={3} style={actions}>
            <img
              style={{ width: "50px", height: "50px", cursor: "pointer" }}
              src={RepairStatus}
              onClick={goToScheduledJobs}
            />
            <div>Scheduled Jobs</div>
          </Col>
          <Col xs={3} style={actions}>
            <img
              style={{ width: "50px", height: "50px", cursor: "pointer" }}
              src={Documents}
              onClick={goToQuotesSent}
            />
            <div>Quotes Sent</div>
          </Col>
        </Row>
        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
          className="mt-1 mb-4"
        >
          <Col xs={3} style={actions}>
            <img
              style={{ width: "50px", height: "50px", cursor: "pointer" }}
              src={JobCompleted}
              onClick={goToJobsCompleted}
            />
            <div>Jobs Completed</div>
          </Col>
          <Col xs={3} style={actions}>
            <img
              style={{ width: "50px", height: "50px", cursor: "pointer" }}
              src={QuotesRejected}
              onClick={goToQuotesRejectedM}
            />
            <div>Quotes Rejected by Manager</div>
          </Col>
          <Col xs={3} style={actions}>
            <div>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={QuotesRejected}
                onClick={goToQuotesRejectedY}
              />
              <div>Quotes Rejected by You</div>
            </div>
          </Col>
        </Row>
        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
          className="mt-1 mb-1"
        >
          <Col xs={3} style={actions}>
            <div>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={SearchPM}
                onClick={goToSearchPM}
              />
              <div>Search Property Managers</div>
            </div>
          </Col>
          <Col xs={3} style={actions}></Col>
          <Col xs={3} style={actions}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default MaintenanceDashboard;
