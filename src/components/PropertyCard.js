import React, { useContext, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MailDialogManager from "./MailDialog";
import MessageDialogManager from "./MessageDialog";
import AppContext from "../AppContext";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import Mail from "../icons/Mail.svg";
import Apply from "../icons/ApplyIcon.svg";

import No_Image from "../icons/No_Image_Available.jpeg";

function PropertyCard(props) {
  const navigate = useNavigate();
  const { property, applied } = props;
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [selectedManager, setSelectedManager] = useState("");
  const [showMailFormManager, setShowMailFormManager] = useState(false);
  const [showMessageFormManager, setShowMessageFormManager] = useState(false);
  const onCancelManagerMail = () => {
    setShowMailFormManager(false);
  };
  const onCancelManagerMessage = () => {
    setShowMessageFormManager(false);
  };

  const goToApplyToProperty = () => {
    // navigate("/applyToProperty");
    navigate(`/propertyApplicationView/${property.property_uid}`);
  };
  const stopEventPropagation = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      className="mx-3 my-3 p-2"
      style={{
        cursor: "pointer",
        display: "flex",

        background: "#E9E9E9 0% 0% no-repeat padding-box",
        borderRadius: "10px",
        opacity: 1,
      }}
      // onClick={goToApplyToProperty}
    >
      <MailDialogManager
        title={"Email"}
        isOpen={showMailFormManager}
        senderPhone={user.phone_number}
        senderEmail={user.email}
        senderName={user.first_name + " " + user.last_name}
        requestCreatedBy={user.user_uid}
        userMessaged={selectedManager.manager_id}
        receiverEmail={selectedManager.manager_email}
        receiverPhone={selectedManager.manager_phone_number}
        onCancel={onCancelManagerMail}
      />

      <MessageDialogManager
        title={"Text Message"}
        isOpen={showMessageFormManager}
        senderPhone={user.phone_number}
        senderEmail={user.email}
        senderName={user.first_name + " " + user.last_name}
        requestCreatedBy={user.user_uid}
        userMessaged={selectedManager.manager_id}
        receiverEmail={selectedManager.manager_email}
        receiverPhone={selectedManager.manager_phone_number}
        onCancel={onCancelManagerMessage}
      />
      <div className="img">
        {property.images && property.images.length > 0 ? (
          <img
            style={{ width: "200px", height: "200px" }}
            src={property.images[0]}
          />
        ) : (
          <img
            style={{ width: "200px", height: "200px" }}
            alt="No Image Uploaded"
            src={No_Image}
          />
        )}
      </div>

      <div
        className="details"
        style={{
          width: "100%",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="d-flex justify-content-between">
          <div style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
            ${property.listed_rent}/month | {property.area} sqFt
          </div>
        </div>

        <div style={{ marginTop: "10px", fontSize: "14px", color: "gray" }}>
          <div>
            {property.address}, {property.unit}{" "}
          </div>
          <div>
            {property.city}, {property.state} - {property.zip}
          </div>
          {/* <div></div> */}
        </div>

        <div
          style={{ display: "flex", marginTop: "10px", marginBottom: "10px" }}
          onClick={stopEventPropagation}
        >
          {/*//Remove property management*/}
          <Row
            style={{
              flex: "1",
              fontSize: "12px",
              color: "blue",
              marginTop: "auto",
              paddingRight: "20px",
              marginBottom: "auto",
            }}
          >
            <span style={{ marginLeft: "1px" }}>
              {property.manager_business_name}
            </span>
          </Row>
          {/*//Remove property management*/}
        </div>
        <Row className="btns" style={{ width: "350px" }}>
          {applied === "REFUSED" ? (
            <Col className="view overlay zoom" style={{ marginRight: "8px" }}>
              <img
                src={Apply}
                onClick={goToApplyToProperty}
                alt="documentIcon"
              />
              <div className="mask flex-center">
                <p className="white-text" style={{ fontSize: "14px" }}>
                  ReApply
                </p>
              </div>
            </Col>
          ) : (
            <Col className="view overlay zoom">
              <img
                src={Apply}
                onClick={goToApplyToProperty}
                alt="documentIcon"
              />
              <div className="mask flex-center">
                <p className="white-text" style={{ fontSize: "14px" }}>
                  Apply
                </p>
              </div>
            </Col>
          )}
          <Col>
            <img
              onClick={() =>
                (window.location.href = `tel:${property.business_number}`)
              }
              src={Phone}
              alt="Phone"
              style={{ marginRight: "10px" }}
            />
            <div className="mask flex-center">
              <p className="white-text" style={{ fontSize: "14px" }}>
                Call
              </p>
            </div>
          </Col>
          <Col>
            <img
              onClick={() => {
                setShowMessageFormManager(true);
                setSelectedManager(property);
              }}
              src={Message}
              alt="Message"
              style={{ marginRight: "10px" }}
            />
            <div className="mask flex-center">
              <p className="white-text" style={{ fontSize: "14px" }}>
                Text
              </p>
            </div>
          </Col>
          <Col>
            <img
              onClick={() => {
                setShowMailFormManager(true);
                setSelectedManager(property);
              }}
              src={Mail}
              alt="Mail"
              style={{ marginRight: "10px" }}
            />
            <div className="mask flex-center">
              <p className="white-text" style={{ fontSize: "14px" }}>
                Email
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
export default PropertyCard;
