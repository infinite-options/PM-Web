import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../Header";
import SideBar from "./SideBar";
import ManagerFooter from "./ManagerFooter";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import { headings, subHeading, subText, pillButton } from "../../utils/styles";

function DetailAnnouncements(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const announcement = location.state.announcement;
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
            title="Announcements"
            leftText="< Back"
            leftFn={() => navigate("/manager-announcements")}
          />
          <Row className="m-3 p-2">
            <Row
              style={
                (headings,
                {
                  background: "#F3F3F3 0% 0% no-repeat padding-box",
                  borderRadius: "5px",
                })
              }
              className="mt-3 mb-4 p-2"
            >
              <div className="mt-1 mx-2" style={headings}>
                Announcement Title
              </div>
              <div className="mt-1 mx-2" style={subHeading}>
                {" "}
                {announcement.announcement_title}
              </div>
            </Row>
            <Row
              style={
                (headings,
                {
                  background: "#F3F3F3 0% 0% no-repeat padding-box",
                  borderRadius: "5px",
                })
              }
              className="mt-3 mb-4 p-2"
            >
              <div className="mt-1 mx-2" style={headings}>
                Announcement Message
              </div>
              <div className="mt-1 mx-2" style={subHeading}>
                {" "}
                {announcement.announcement_msg}
              </div>
            </Row>
            {announcement.announcement_mode === "Tenants" ? (
              <Row
                style={{
                  background: "#F3F3F3 0% 0% no-repeat padding-box",
                  borderRadius: "5px",
                }}
                className="mt-3 mb-4 p-2"
              >
                <Row className="mt-1 mx-2" style={headings}>
                  Sent to tenants
                </Row>
                {announcement.receiver_details.map((receiver) => {
                  return (
                    <Row className="mt-1 mx-2">
                      <Col>
                        <div style={subHeading}>
                          {receiver.first_name} {receiver.last_name}
                        </div>
                        <div style={subText}>
                          {receiver.address} {receiver.unit}
                          ,&nbsp;{receiver.city},&nbsp;{receiver.state}&nbsp;{" "}
                          {receiver.zip}
                        </div>
                      </Col>
                      <Col xs={2} className="mt-1 mb-1">
                        <a href={`tel:${receiver.phone_number}`}>
                          <img src={Phone} alt="Phone" />
                        </a>
                      </Col>
                      <Col xs={2} className="mt-1 mb-1">
                        <img src={Message} alt="Message" />
                      </Col>
                      <hr />
                    </Row>
                  );
                })}{" "}
              </Row>
            ) : (
              <Row
                style={{
                  background: "#F3F3F3 0% 0% no-repeat padding-box",
                  borderRadius: "5px",
                }}
                className="mt-3 mb-4 p-2"
              >
                <Row className="mt-1 mx-2" style={headings}>
                  Sent to properties
                </Row>
                {announcement.receiver_details.map((receiver) => {
                  return (
                    <Row className="mt-1 mx-2">
                      <Col>
                        <div style={subHeading}>
                          {receiver.address} {receiver.unit}
                          ,&nbsp;{receiver.city},&nbsp;{receiver.state}&nbsp;{" "}
                          {receiver.zip}
                        </div>
                        <div style={subText}>
                          {receiver.first_name} {receiver.last_name}
                        </div>
                      </Col>
                      <Col xs={2} className="mt-1 mb-1">
                        <a href={`tel:${receiver.phone_number}`}>
                          <img src={Phone} alt="Phone" />
                        </a>
                      </Col>
                      <Col xs={2} className="mt-1 mb-1">
                        <img src={Message} alt="Message" />
                      </Col>
                      <hr />
                    </Row>
                  );
                })}{" "}
              </Row>
            )}
            <Row
              style={{
                background: "#F3F3F3 0% 0% no-repeat padding-box",
                borderRadius: "5px",
              }}
              className="mt-3 mb-4 p-2"
            >
              <Row className="mt-1 mx-2" style={headings}>
                Sent Out On:
              </Row>
              <Row className="mt-1 mx-2" style={subHeading}>
                {new Date(announcement.date_announcement).toLocaleString(
                  "default",
                  { month: "long" }
                )}{" "}
                {new Date(announcement.date_announcement).getDate()},{" "}
                {new Date(announcement.date_announcement).getFullYear()}
              </Row>
            </Row>
          </Row>
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <ManagerFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailAnnouncements;
