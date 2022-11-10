import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "./Header";
import SideBar from "./managerComponents/SideBar";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import { headings, subHeading, subText, pillButton } from "../utils/styles";

function DetailAnnouncements(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const announcement = location.state.announcement;

  console.log(announcement);
  return (
    <div>
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div
          className="w-100"
          style={{
            width: "calc(100vw - 13rem)",
            position: "relative",
          }}
        >
          <Header
            title="Announcements"
            leftText="< Back"
            leftFn={() => navigate("/manager-announcements")}
          />
          <Container className="pt-1 mb-4">
            <div>
              <Row style={headings} className="mt-1 mx-2">
                {announcement.announcement_title}
              </Row>
              <Row style={subHeading} className="mx-2">
                {announcement.announcement_msg}
              </Row>
              {announcement.announcement_mode == "Tenants" ? (
                <div>
                  <Row className="mt-1 mx-2" style={headings}>
                    Sent to tenants:
                  </Row>
                  {announcement.receiver_details.map((receiver) => {
                    return (
                      <Row className="mt-1 mx-2">
                        <Col>
                          <div style={subHeading}>
                            {receiver.tenant_first_name}{" "}
                            {receiver.tenant_last_name}
                          </div>
                          <div style={subText}>
                            {receiver.address} {receiver.unit}
                            ,&nbsp;{receiver.city},&nbsp;{receiver.state}&nbsp;{" "}
                            {receiver.zip}
                          </div>
                        </Col>
                        <Col xs={2} className="mt-1 mb-1">
                          <a href={`tel:${receiver.teanant_phone_number}`}>
                            <img src={Phone} />
                          </a>
                        </Col>
                        <Col xs={2} className="mt-1 mb-1">
                          <img src={Message} />
                        </Col>
                        <hr />
                      </Row>
                    );
                  })}{" "}
                </div>
              ) : (
                <div>
                  <Row className="mt-1 mx-2" style={headings}>
                    Sent to properties:
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
                            {receiver.tenant_first_name}{" "}
                            {receiver.tenant_last_name}
                          </div>
                        </Col>
                        <Col xs={2} className="mt-1 mb-1">
                          <a href={`tel:${receiver.teanant_phone_number}`}>
                            <img src={Phone} />
                          </a>
                        </Col>
                        <Col xs={2} className="mt-1 mb-1">
                          <img src={Message} />
                        </Col>
                        <hr />
                      </Row>
                    );
                  })}{" "}
                </div>
              )}

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
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default DetailAnnouncements;
