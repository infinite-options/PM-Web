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

  const [properties, setProperties] = useState([]);
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

  const fetchProperties = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length < 1) {
      console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
    } else {
      management_buid = management_businesses[0].business_uid;
    }

    // const response =  await get(`/businesses?business_uid=${management_buid}`);
    const response = await get(`/propertyInfo?manager_id=${management_buid}`);
    if (response.msg === "Token has expired") {
      refresh();
      return;
    }

    // const properties = response.result
    const properties = response.result.filter(
      (property) => property.management_status !== "REJECTED"
    );

    const properties_unique = [];
    const pids = new Set();
    properties.forEach((property) => {
      if (pids.has(property.property_uid)) {
        // properties_unique[properties_unique.length-1].tenants.push(property)
        const index = properties_unique.findIndex(
          (item) => item.property_uid === property.property_uid
        );
        properties_unique[index].tenants.push(property);
      } else {
        pids.add(property.property_uid);
        properties_unique.push(property);
        properties_unique[properties_unique.length - 1].tenants = [property];
      }
    });
    console.log(properties_unique);
    setProperties(properties_unique);

    // await getAlerts(properties_unique)
  };

  React.useEffect(fetchProperties, [access_token]);

  const unique_clients = [...new Set(properties.map((item) => item.owner_id))]
    .length;
  const property_count = properties.length;

  // const getAlerts = async (properties_unique) => {
  //     const property = properties_unique[0]
  //     const repairs_response = await get(`/maintenanceRequests`, access_token);
  //     const repairs = repairs_response.result.filter(item => item.property_uid === property.property_uid);
  //     const applications_response = await get(`/applications?property_uid=${property.property_uid}`);
  //     const applications = applications_response.result.map(application => ({...application, application_selected: false}))
  //     const count = repairs.length + applications.length
  //
  //     setAlerts({repairs: repairs, applications: applications, count: count})
  // }

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
            onClick={() => setExpandProperties(!expandProperties)}
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
          interval={null}
          className="mx-2 p-3 "
          style={{
            background: "#F3F3F3 0% 0% no-repeat padding-box",
          }}
        >
          <Carousel.Item>
            <div
              style={{
                textAlign: "center",
                font: "normal normal bold 22px Bahnschrift-Bold",
                color: "#007AFF",
              }}
            >
              Resident Announcements
            </div>
            <div className="mx-2 mt-3 mb-2 px-3 pb-3 ">
              <p className="d-flex">No Announcements</p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div
              style={{
                textAlign: "center",
                font: "normal normal bold 22px Bahnschrift-Bold",
                color: "#007AFF",
              }}
            >
              Resident Announcements
            </div>
            <div className="mx-2 mt-3 mb-2 px-3 pb-3 ">
              <p className="d-flex">No Announcements</p>
            </div>
          </Carousel.Item>
        </Carousel>
        <div>
          <Row className="mx-1 mt-2 px-2">
            <Col
              onClick={() => navigate("/manager-properties")}
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
                navigate("/manager-repairs", {
                  state: { properties: properties },
                });
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
