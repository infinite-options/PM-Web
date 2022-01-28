import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
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

  useEffect(fetchProfile, []);

  const goToRequest = () => {
    navigate("/repairRequest");
  };
  const goToAnnouncements = () => {
    navigate("/residentAnnouncements");
  };
  const goToEmergency = () => {
    navigate("/emergency");
  };
  const goToStatus = () => {
    navigate("/repairStatus");
  };
  const goToDocuments = () => {
    navigate("/tenantDocuments");
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
          <Row style={upcoming} className="mt-2 mb-2">
            <div style={upcomingHeading} className="mt-1 mb-1">
              Upcoming:
              <br />
              Toilet Maintenance is scheduled for
              <br /> Dec 12, 2021 at 12:00 pm
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
          <Row>
            <div style={headings} className="mt-4 mb-1">
              ${JSON.parse(profile.tenant_current_address).rent}/mo
            </div>
            {isLoading === true ? null : (
              <div style={address} className="mt-1 mb-1">
                {JSON.parse(profile.tenant_current_address).street},&nbsp;
                {JSON.parse(profile.tenant_current_address).city},&nbsp;
                {JSON.parse(profile.tenant_current_address).state}&nbsp;
                {JSON.parse(profile.tenant_current_address).zip}
              </div>
            )}

            <div style={blue} className="mt-1 mb-1">
              Rent paid for Dec, 2021: $1500
            </div>
            <div>
              <Col xs={7} className="mt-1 mb-1">
                <div style={bluePill} onClick={() => navigate("/rentPayment")}>
                  Rent due for Dec 2021: $500
                </div>
              </Col>
            </div>
            <div>
              <Col xs={8} className="mt-1 mb-1">
                <div style={greenBorderPill}>
                  Upcoming rent for Jan 2021: $2,200
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
                  onClick={goToEmergency}
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
