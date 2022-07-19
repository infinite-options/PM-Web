import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AppContext from "../AppContext";
import { get, put } from "../utils/api";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import BlueFilledBox from "../icons/BlueFilledBox.svg";
import UnFilledBox from "../icons/UnFilledBox.svg";
import Mail from "../icons/Mail.svg";
import {
  mediumBold,
  xSmall,
  blue,
  smallImg,
  hidden,
  gray,
  pillButton,
} from "../utils/styles";

function ManagerOwnerList(props) {
  const navigate = useNavigate();

  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
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

    const response = await get(`/managerClients?manager_id=` + management_buid);

    if (response.msg === "Token has expired") {
      refresh();
      return;
    }

    // console.log(response.result);
    setOwners(response.result);
    setSelectedOwner(response.result[0]);
    console.log(selectedOwner);
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
        title="Owner Info"
        leftText="<Back"
        leftFn={() => navigate("/manager")}
      />
      <div
        className="mx-2 my-2 p-3"
        style={{
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        {owners.map((owner, i) => (
          <Container
            key={i}
            className="p-3 mb-2"
            style={{
              boxShadow: " 0px 1px 6px #00000029",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            <Row
              onClick={() => {
                setShowDetails(!showDetails);
                setSelectedOwner(owner);
              }}
            >
              <Col className="ps-0" xs={8}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0" style={{ fontWeight: "600" }}>
                    {owner.owner_first_name} {owner.owner_last_name}
                  </h5>
                </div>
              </Col>
              <Col>
                <div className="d-flex  justify-content-end ">
                  <div
                    style={owner.owner_id ? {} : hidden}
                    onClick={stopPropagation}
                  >
                    <a href={`tel:${owner.owner_phone_number}`}>
                      <img src={Phone} alt="Phone" style={smallImg} />
                    </a>
                    <a href={`mailto:${owner.owner_email}`}>
                      <img src={Message} alt="Message" style={smallImg} />
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
            <Row
              style={{
                font: "normal normal 600 16px/22px Bahnschrift-Regular",
                color: "#007AFF",
              }}
            >
              {owner.properties.length} Properties
            </Row>
            {showDetails && selectedOwner.owner_id === owner.owner_id ? (
              <Row className="mx-2">
                {selectedOwner.properties.map((property, i) => {
                  return (
                    <Row
                      className="p-1"
                      style={{
                        background:
                          i % 2 === 0
                            ? "#FFFFFF 0% 0% no-repeat padding-box"
                            : "#F3F3F3 0% 0% no-repeat padding-box",
                        font: "normal normal normal 16px Bahnschrift-Regular",
                      }}
                    >
                      {property.address}
                      {property.unit !== "" ? ` ${property.unit}, ` : ", "}
                      {property.city}, {property.state} {property.zip}
                    </Row>
                  );
                })}
              </Row>
            ) : null}
          </Container>
        ))}
      </div>
    </div>
  );
}

export default ManagerOwnerList;
