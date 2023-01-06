import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import Document from "../icons/documents.svg";
import Apply from "../icons/ApplyIcon.svg";
import ReApply from "../icons/ReApply.svg";
import Check from "../icons/Check.svg";
import { useNavigate } from "react-router-dom";
import { greenPill, redPillButton } from "../utils/styles";
import No_Image from "../icons/No_Image_Available.jpeg";
import { fontSize } from "@mui/system";

function PropertyCard(props) {
  const { property, applied } = props;
  const navigate = useNavigate();

  const goToApplyToProperty = () => {
    // navigate("/applyToProperty");
    navigate(`/propertyApplicationView/${property.property_uid}`);
  };
  const stopEventPropagation = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };
  // const goToPropertyInfo = () => {
  //   navigate("/propertyInfo", {
  //     state: {
  //       property: props.property,
  //     },
  //   });
  // };
  console.log(property);
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
      onClick={goToApplyToProperty}
    >
      <div className="img">
        {property.images && property.images.length > 0 ? (
          <img
            style={{ width: "200px", height: "200px" }}
            src={property.images[0]}
          />
        ) : (
          <img style={{ width: "200px", height: "200px" }} src={No_Image} />
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

          {applied === "NEW" ? (
            <p style={{ ...greenPill, height: "25px" }} className="mb-0">
              {applied}
            </p>
          ) : applied === "REFUSED" ? (
            <p style={{ ...redPillButton, height: "25px" }} className="mb-0">
              {applied}
            </p>
          ) : (
            ""
          )}
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
        <Row className="btns" style={{ width: "250px" }}>
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
              onClick={() =>
                (window.location.href = `mailto:${property.business_email}`)
              }
              src={Message}
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
