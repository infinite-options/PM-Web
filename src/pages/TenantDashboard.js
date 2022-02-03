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
import Announcements from "../icons/announcements.svg";
import Emergency from "../icons/emergency.svg";
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

function TenantDashboard(props) {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const { userData, refresh } = React.useContext(AppContext);
  const { access_token, user } = userData;
  const { setShowFooter } = props;
  const [profile, setProfile] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log(context, access_token, user);

  useEffect(() => {
    if (profile != undefined && repairs.length === 0) {
      setIsLoading(false);
    }
  }, [profile, repairs]);

  useEffect(() => {
    setShowFooter(true);
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await get("/tenantProperties", access_token);
      console.log(response);

      if (response.msg === "Token has expired") {
        console.log("here msg");
        refresh();

        return;
      }
      setProfile(response.result[0]);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchRepairs = async () => {
      const response = await get(
        `/maintenanceRequests?property_uid=${profile.property_uid}`
      );
      console.log(response);

      setRepairs(response.result);
    };
    fetchRepairs();
  }, []);

  const goToRequest = () => {
    navigate(`/${profile.property_uid}/repairRequest`);
  };
  const goToAnnouncements = () => {
    navigate("/residentAnnouncements");
  };
  const goToEmergency = () => {
    navigate("/emergency");
  };
  const goToStatus = () => {
    navigate(`/${profile.property_uid}/repairStatus`);
  };
  const goToDocuments = () => {
    navigate("/tenantDocuments");
  };
  const goToSearchPM = () => {
    navigate("/tenantPropertyManagers");
  };
  console.log(profile);
  return (
    <div className="h-100">
      <Header title="Home" />
      {isLoading === true || profile.length === 0 ? null : (
        <Container className="pt-1 mb-4">
          <Row style={headings}>
            <div>Hello {profile.tenant_first_name},</div>
          </Row>
          {repairs.length === 0 ? (
            <Row style={upcoming} className="mt-2 mb-2">
              <div style={upcomingHeading} className="mt-1 mb-1">
                Upcoming:
                <br />
                <br />
                Nothing Scheduled
              </div>
            </Row>
          ) : repairs.status === "SCHEDULED" ? (
            <Row style={upcoming} className="mt-2 mb-2">
              <div style={upcomingHeading} className="mt-1 mb-1">
                Upcoming:
                <br />
                Toilet Maintenance is scheduled for
                <br /> {repairs.scheduled_date}
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
          ) : (
            <Row style={upcoming} className="mt-2 mb-2">
              <div style={upcomingHeading} className="mt-1 mb-1">
                Upcoming:
                <br />
                <br />
                Nothing scheduled
              </div>
            </Row>
          )}

          <Row>
            <div style={headings} className="mt-4 mb-1">
              ${profile.actual_rent}/mo
            </div>
            {isLoading === true ? null : (
              <div style={address} className="mt-1 mb-1">
                {profile.address},&nbsp;
                {profile.city},&nbsp;
                {profile.state}&nbsp;
                {profile.zip}
              </div>
            )}

            <div style={blue} className="mt-1 mb-1">
              Rent paid for {moment().format("MMM")}, {moment().format("YYYY")}:
              $1400
            </div>
            <div>
              <Col xs={7} className="mt-1 mb-1">
                <div style={bluePill} onClick={() => navigate("/rentPayment")}>
                  Rent due for {moment().format("MMM")},{" "}
                  {moment().format("YYYY")}: $500
                </div>
              </Col>
            </div>
            <div>
              <Col xs={8} className="mt-1 mb-1">
                <div style={greenBorderPill}>
                  Upcoming rent for {moment().add(1, "months").format("MMM")},{" "}
                  {moment().format("YYYY")}: ${profile.actual_rent}
                </div>
              </Col>
            </div>
          </Row>
          {/* <Row style={headings}>
          <div>Actions</div>
        </Row> */}
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
                onClick={goToRequest}
              />
              <div>Request Repair</div>
            </Col>
            <Col xs={3} style={actions}>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={RepairStatus}
                onClick={goToStatus}
              />
              <div>Repair Status</div>
            </Col>
            <Col xs={3} style={actions}>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={Documents}
                onClick={goToDocuments}
              />
              <div>
                Your <br /> Documents
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
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={Announcements}
                onClick={goToAnnouncements}
              />
              <div>
                Resident <br />
                Announcements
              </div>
            </Col>
            <Col xs={3} style={actions}>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={Emergency}
                onClick={goToEmergency}
              />
              <div>Emergency</div>
            </Col>
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
          </Row>
        </Container>
      )}
    </div>
  );
}

export default TenantDashboard;
