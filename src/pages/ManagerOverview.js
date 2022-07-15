import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Carousel, Row } from "react-bootstrap";
import Header from "../components/Header";
import {
  green,
  bolder,
  red,
  xSmall,
  smallLine,
  mediumBold,
  redPillButton,
  small,
  underline,
} from "../utils/styles";
import SearchProperties from "../icons/SearchProperties.svg";
import Tenants from "../icons/Tenants.svg";
import AppContext from "../AppContext";
import { get } from "../utils/api";

function ManagerOverview(props) {
  const navigate = useNavigate();
  const { userData, refresh } = React.useContext(AppContext);
  const { access_token, user } = userData;

  const { properties, maintenanceRequests } = props;
  const [alerts, setAlerts] = useState({
    repairs: [],
    applications: [],
    count: 0,
  });

  const [expandProperties, setExpandProperties] = React.useState(false);

  React.useEffect(() => {
    if (userData.access_token === null) {
      navigate("/");
    }
  }, []);

  const unique_clients = [...new Set(properties.map((item) => item.owner_id))]
    .length;
  const property_count = properties.length;

  return (
    <div style={{ background: "#E9E9E9 0% 0% no-repeat padding-box" }}>
      <Header title="PM Dashboard" />
      <Container className="px-3 pb-5 mb-5">
        <div
          className="p-2 my-3"
          style={{
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            borderRadius: "10px",
            opacity: 1,
          }}
        >
          <Row
            className="mx-2 mt-4 p-3"
            style={{
              background: "#007AFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
            onClick={() => navigate("/owner-list")}
          >
            <Col xs={8} style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              Owners
            </Col>
            <Col style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              {unique_clients}
            </Col>
          </Row>

          <Row
            className="mx-2 mt-4 p-3"
            style={{
              background: "#007AFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
            // onClick={() => setExpandProperties(!expandProperties)}
            onClick={() => navigate("/manager-properties")}
          >
            <Col xs={8} style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              Properties
            </Col>
            <Col style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              {property_count}
            </Col>
          </Row>

          {expandProperties ? (
            <div>
              <Container
                style={{ border: "1px solid #707070", borderRadius: "5px" }}
              >
                <Row>
                  <Col>
                    <p style={{ ...small }} className=" m-1">
                      Properties
                    </p>
                  </Col>
                </Row>

                {properties.map((property, i) => (
                  <Row
                    key={i}
                    onClick={() => {
                      navigate(`/manager-properties/${property.property_uid}`, {
                        state: {
                          property: property,
                          property_uid: property.property_uid,
                        },
                      });
                    }}
                    style={{
                      cursor: "pointer",
                      background:
                        i % 2 === 0
                          ? "#FFFFFF 0% 0% no-repeat padding-box"
                          : "#F3F3F3 0% 0% no-repeat padding-box",
                    }}
                  >
                    <Col>
                      <p style={{ ...small, ...mediumBold }} className=" m-1">
                        {property.address} {property.unit}, {property.city},{" "}
                        {property.state} {property.zip}
                      </p>
                    </Col>
                  </Row>
                ))}
              </Container>
            </div>
          ) : (
            ""
          )}

          <Row
            className="mx-2 mt-4 p-3"
            style={{
              background: "#3DB727 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col xs={8} style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              Estimated Monthly Revenue
            </Col>
            <Col style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              $10,000
            </Col>
          </Row>

          <Row
            className="mx-2 mt-4 p-3"
            style={{
              background: "#3DB727 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col xs={8} style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              MTD Revenue
            </Col>
            <Col style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              $16,500
            </Col>
          </Row>

          <Row
            className="mx-2 mt-4 p-3"
            style={{
              background: "#E3441F 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col xs={8} style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>
              MTD Maintenance Cost
            </Col>
            <Col style={{ ...mediumBold, ...{ color: "#FFFFFF" } }}>$9,500</Col>
          </Row>
        </div>
        <Carousel
          id="owner-bills"
          interval={null}
          controls={false}
          className="mx-2 p-3 "
          style={{
            background: "#007AFF 0% 0% no-repeat padding-box",
          }}
        >
          {maintenanceRequests.map((request) => {
            return request.request_status === "SCHEDULED" ? (
              <Carousel.Item className="px-2 pb-3 ">
                <div
                  style={{
                    textAlign: "left",
                    font: "normal normal bold 22px Bahnschrift-Bold",
                    color: "#ffffff",
                  }}
                >
                  Upcoming Repairs:
                </div>
                <div
                  style={{
                    textAlign: "left",
                    font: "normal normal normal 16px Bahnschrift-Regular",
                    color: "#ffffff",
                    textTransform: "capitalize",
                  }}
                >
                  {request.title} is scheduled for{" "}
                  {new Date(request.scheduled_date).toLocaleDateString(
                    "en-us",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </div>

                {properties.map((property) => {
                  return property.property_uid === request.property_uid ? (
                    <div
                      style={{
                        textAlign: "left",
                        font: "normal normal normal 16px Bahnschrift-Regular",
                        color: "#ffffff",
                        textTransform: "capitalize",
                      }}
                    >
                      {" "}
                      {property.address}
                      {property.unit !== "" ? ` ${property.unit}, ` : ", "}
                      {property.city}, {property.state} {property.zip}{" "}
                    </div>
                  ) : null;
                })}
              </Carousel.Item>
            ) : null;
          })}
        </Carousel>
        <div
          className="mx-2 p-3 "
          style={{
            background: "#F3F3F3 0% 0% no-repeat padding-box",
          }}
        >
          <div
            style={{
              textAlign: "left",
              font: "normal normal bold 22px Bahnschrift-Bold",
              color: "#007AFF",
            }}
          >
            Resident Announcements {">"}
          </div>
        </div>
        <div>
          <Row className="mx-1 mt-2 px-2">
            <Col
              onClick={() => navigate("/properties")}
              className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
              style={{
                height: "87px",
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                boxShadow: "0px 3px 3px #00000029",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              <Col>
                <img
                  src={SearchProperties}
                  alt="Property"
                  style={{ width: "50px" }}
                />
              </Col>
              <Col>
                <p
                  style={{ ...xSmall, ...smallLine, ...mediumBold }}
                  className="mb-0"
                >
                  Search for Properties
                </p>
              </Col>
            </Col>

            <Col
              onClick={() => {
                navigate("/tenant-list");
              }}
              className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
              style={{
                height: "87px",
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                boxShadow: "0px 3px 3px #00000029",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              <Col>
                <img src={Tenants} alt="Document" style={{ width: "50px" }} />
              </Col>
              <Col>
                <p
                  style={{ ...xSmall, ...smallLine, ...mediumBold }}
                  className="mb-0"
                >
                  Tenants
                </p>
              </Col>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default ManagerOverview;
