import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AppContext from "../AppContext";
import { get } from "../utils/api";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";

import Mail from "../icons/Mail.svg";
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

    const response = await get(`/businesses`);

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
    <div
      className="pb-5 mb-5 h-100"
      style={{
        background: "#E9E9E9 0% 0% no-repeat padding-box",
        borderRadius: "10px",
        opacity: 1,
      }}
    >
      <Header
        title="Property Managers"
        leftText="< Back"
        leftFn={() => {
          navigate("/owner");
        }}
      />
      <div
        className="mx-2 my-2 p-3"
        style={{
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        {propertyManagers.map((property, i) => (
          <Container key={i} className="pt-1" style={{ height: "100px" }}>
            <Row className="h-100">
              <Col className="ps-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0" style={{ fontWeight: "600" }}>
                    {property.business_name}
                  </h5>
                </div>
                <div>
                  <p style={gray} className="mt-1 mb-0">
                    {property.business_type}
                  </p>
                </div>
              </Col>
              <Col>
                <div className="d-flex  justify-content-end ">
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
                    <a href={`mailto:${property.business_email}`}>
                      <img src={Mail} alt="Mail" style={smallImg} />
                    </a>
                  </div>
                </div>
              </Col>
              <hr />
            </Row>
          </Container>
        ))}
      </div>
    </div>
  );
}

export default OwnerDashboard;
