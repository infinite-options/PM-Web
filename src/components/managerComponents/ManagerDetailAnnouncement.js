import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../Header";
import SideBar from "./SideBar";
import MailDialogTenant from "../MailDialog";
import MessageDialogTenant from "../MessageDialog";
import ManagerFooter from "./ManagerFooter";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import Mail from "../../icons/Mail.svg";
import { put, post, get } from "../../utils/api";
import {
  headings,
  subHeading,
  subText,
  smallImg,
  sidebarStyle,
} from "../../utils/styles";

function DetailAnnouncements(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const announcement = location.state.announcement;
  const managerInfo = location.state.managerInfo;
  const [width, setWindowWidth] = useState(1024);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showMailForm, setShowMailForm] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState([]);
  console.log(announcement, managerInfo);
  const onCancelMail = () => {
    setShowMailForm(false);
  };

  const onCancelMessage = () => {
    setShowMessageForm(false);
  };

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
  console.log(selectedReceiver);

  return (
    <div className="w-100 overflow-hidden">
      <MailDialogTenant
        title={"Email"}
        isOpen={showMailForm}
        senderPhone={managerInfo.business_phone_number}
        senderEmail={managerInfo.business_email}
        senderName={managerInfo.business_name}
        requestCreatedBy={managerInfo.business_uid}
        userMessaged={selectedReceiver.id}
        receiverEmail={selectedReceiver.email}
        receiverPhone={selectedReceiver.phone_number}
        onCancel={onCancelMail}
      />
      <MessageDialogTenant
        title={"Text Message"}
        isOpen={showMessageForm}
        senderPhone={managerInfo.business_phone_number}
        senderEmail={managerInfo.business_email}
        senderName={managerInfo.business_name}
        requestCreatedBy={managerInfo.business_uid}
        userMessaged={selectedReceiver.id}
        receiverEmail={selectedReceiver.email}
        receiverPhone={selectedReceiver.phone_number}
        onCancel={onCancelMessage}
      />
      <Row className="w-100 mb-5 overflow-hidden">
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5 overflow-scroll">
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

                      <Col xs={3}>
                        <Row>
                          <Col className="d-flex justify-content-center">
                            {" "}
                            <a href={`tel:${receiver.phone_number}`}>
                              <img src={Phone} alt="Phone" style={smallImg} />
                            </a>
                          </Col>

                          <Col className="d-flex justify-content-center">
                            <a
                              // href={`mailto:${receiver.tenantEmail}`}
                              onClick={() => {
                                setShowMessageForm(true);
                                setSelectedReceiver(receiver);
                              }}
                            >
                              <img
                                src={Message}
                                alt="Message"
                                style={smallImg}
                              />
                            </a>
                          </Col>
                          <Col className="d-flex justify-content-center">
                            <a
                              // href={`mailto:${receiver.tenantEmail}`}
                              onClick={() => {
                                setShowMailForm(true);
                                setSelectedReceiver(receiver);
                              }}
                            >
                              <img src={Mail} alt="Mail" style={smallImg} />
                            </a>
                          </Col>
                        </Row>
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
                      <Col xs={3}>
                        <Row>
                          <Col className="d-flex justify-content-center">
                            {" "}
                            <a href={`tel:${receiver.phone_number}`}>
                              <img src={Phone} alt="Phone" style={smallImg} />
                            </a>
                          </Col>

                          <Col className="d-flex justify-content-center">
                            <a
                              // href={`mailto:${receiver.tenantEmail}`}
                              onClick={() => {
                                setShowMessageForm(true);
                                setSelectedReceiver(receiver);
                              }}
                            >
                              <img
                                src={Message}
                                alt="Message"
                                style={smallImg}
                              />
                            </a>
                          </Col>
                          <Col className="d-flex justify-content-center">
                            <a
                              // href={`mailto:${receiver.tenantEmail}`}
                              onClick={() => {
                                setShowMailForm(true);
                                setSelectedReceiver(receiver);
                              }}
                            >
                              <img src={Mail} alt="Mail" style={smallImg} />
                            </a>
                          </Col>
                        </Row>
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
        </Col>
      </Row>
    </div>
  );
}

export default DetailAnnouncements;
