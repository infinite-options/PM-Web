import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AppContext from "../AppContext";
import { get } from "../utils/api";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import { tileImg, xSmall, blue, smallImg, hidden, gray } from "../utils/styles";

function OwnerDashboard() {
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [propertyManagers, setPropertyManagers] = useState([]);
  const fetchProperties = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const response = await get(`/businesses?business_type=` + "MANAGEMENT");

    if (response.msg === "Token has expired") {
      refresh();
      return;
    }

    console.log(response.result);
    setPropertyManagers(response.result);
    console.log(JSON.parse(response.result[0].business_locations).length);
    // await getAlerts(properties_unique)
  };

  useEffect(fetchProperties, [access_token]);
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="h-100 pb-5">
      <Header
        title="Property Managers"
        leftText="< Back"
        leftFn={() => {
          navigate("/owner");
        }}
      />
      {propertyManagers.map((property, i) => (
        <Container key={i} className="pt-1 mb-4" style={{ height: "100px" }}>
          <Row className="h-100">
            <Col xs={4} className="h-100">
              <div style={tileImg} className="h-100 w-100">
                {/* {JSON.parse(property.images).length > 0 ? (
                      <img
                        src={JSON.parse(property.images)[0]}
                        alt="Property"
                        className="w-100 h-100"
                        style={{ borderRadius: "4px", objectFit: "cover" }}
                      />
                    ) : (
                      ""
                    )} */}
              </div>
            </Col>
            <Col className="ps-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0" style={{ fontWeight: "600" }}>
                  {property.business_name}
                </h5>
              </div>
              <div>
                {JSON.parse(property.business_locations).map((loc) => {
                  return (
                    <p style={gray} className="mt-1 mb-0">
                      {loc.location},+/- {loc.distance} miles
                    </p>
                  );
                })}
              </div>

              <div className="d-flex ">
                <div className="flex-grow-1 d-flex flex-column justify-content-center">
                  <p style={{ ...blue, ...xSmall }} className="mb-0">
                    Contact{" "}
                  </p>
                </div>
                <div
                  style={property.business_uid ? {} : hidden}
                  onClick={stopPropagation}
                >
                  <a href={`tel:${property.business_phone_number}`}>
                    <img src={Phone} alt="Phone" style={smallImg} />
                  </a>
                  <a href={`mailto:${property.business_email}`}>
                    <img src={Message} alt="Message" style={smallImg} />
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      ))}
    </div>
  );
}

export default OwnerDashboard;
