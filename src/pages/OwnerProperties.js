import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import AppContext from "../AppContext";
import Header from "../components/Header";
import PropertyForm from "../components/PropertyForm";
import PropertyView from "../components/PropertyView";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import { get } from "../utils/api";
import {
  blue,
  gray,
  greenPill,
  orangePill,
  tileImg,
  smallImg,
  xSmall,
  hidden,
  redPill,
  mediumBold,
} from "../utils/styles";
import PropertyManagersList from "../components/PropertyManagersList";

function OwnerProperties(props) {
  const navigate = useNavigate();
  const {
    setShowFooter,
    properties,
    fetchProperties,
    selectedProperty,
    setSelectedProperty,
  } = props;
  const { userData, refresh } = React.useContext(AppContext);
  const [stage, setStage] = React.useState("LIST");
  const { access_token, user } = userData;
  const [propertiesUnique, setPropertiesUnique] = useState([]);
  const selectProperty = (property) => {
    setSelectedProperty(property);
    setStage("PROPERTY");
  };
  useEffect(() => {
    let pu = properties;
    pu.forEach((property) => {
      const forwarded = property.property_manager.filter(
        (item) => item.management_status === "FORWARDED"
      );
      const sent = property.property_manager.filter(
        (item) => item.management_status === "SENT"
      );
      const refused = property.property_manager.filter(
        (item) => item.management_status === "REFUSED"
      );

      const pmendearly = property.property_manager.filter(
        (item) => item.management_status === "PM END EARLY"
      );
      const ownerendearly = property.property_manager.filter(
        (item) => item.management_status === "OWNER END EARLY"
      );
      property.management = {
        forwarded: forwarded.length,
        sent: sent.length,
        refused: refused.length,
        pmendearly: pmendearly.length,
        ownerendearly: ownerendearly.length,
      };
    });
    console.log(pu);
    setPropertiesUnique(pu);
  });
  const addProperty = () => {
    fetchProperties();
    setStage("LIST");
  };

  useEffect(() => {
    setShowFooter(stage !== "NEW");
  }, [stage, setShowFooter]);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  console.log(propertiesUnique);
  return stage === "LIST" ? (
    <div
      className="pb-5 mb-5"
      style={{
        background: "#E9E9E9 0% 0% no-repeat padding-box",
        borderRadius: "10px",
        opacity: 1,
      }}
    >
      <Header
        title="Properties"
        rightText="+ New"
        rightFn={() => setStage("NEW")}
        // leftText="< Back"
        // leftFn={() => setStage("DASHBOARD")}
        // leftFn={() => {
        //   navigate("/owner");
        // }}
      />
      {console.log(stage)}
      <div
        className="mx-2 my-2 p-3"
        style={{
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        {propertiesUnique.map((property, i) => (
          <Container
            key={i}
            onClick={() => selectProperty(property)}
            className="pt-1 mb-4"
          >
            <Row>
              <Col xs={4}>
                <div style={tileImg} className="mt-1">
                  {JSON.parse(property.images).length > 0 ? (
                    <img
                      src={JSON.parse(property.images)[0]}
                      alt="Property"
                      className="w-100 h-100"
                      style={{ borderRadius: "4px", objectFit: "cover" }}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </Col>
              <Col className="ps-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0" style={mediumBold}>
                    ${property.listed_rent}/mo
                  </h5>
                  <div className="d-flex justify-content-end">
                    {property.management_status !== "ACCEPTED" ? (
                      <p style={redPill} className="mb-0">
                        New
                      </p>
                    ) : property.rental_status === "ACTIVE" ? (
                      <p style={greenPill} className="mb-0">
                        Rented
                      </p>
                    ) : property.rental_status === "PROCESSING" ? (
                      <p style={greenPill} className="mb-0">
                        Processing
                      </p>
                    ) : (
                      <p style={orangePill} className="mb-0">
                        Not Rented
                      </p>
                    )}
                  </div>
                </div>
                <p
                  style={{
                    color: "#777777",
                    font: "normal normal normal 14px Bahnschrift-Regular",
                  }}
                  className="mt-0 mb-0"
                >
                  {property.address}
                  {property.unit !== "" ? " " + property.unit : ""}, <br />
                  {property.city}, {property.state} {property.zip}
                </p>
                {property.property_manager.length == 0 ? (
                  <p style={{ ...blue, ...xSmall }} className="mb-0">
                    No Manager
                  </p>
                ) : property.management_status === "ACCEPTED" ? (
                  <div className="d-flex flex-column">
                    <div className="flex-grow-1 d-flex flex-column justify-content-center">
                      <p
                        style={{
                          ...blue,
                          ...xSmall,
                          font: "normal normal normal 12px/12px Bahnschrift-Regular",
                        }}
                        className="mb-1"
                      >
                        Manager: {property.managerInfo.manager_business_name}
                      </p>
                    </div>

                    <div
                      className="mb-1"
                      style={property.managerInfo.manager_id ? {} : hidden}
                      onClick={stopPropagation}
                    >
                      <a
                        href={`tel:${property.managerInfo.manager_phone_number}`}
                      >
                        <img src={Phone} alt="Phone" style={smallImg} />
                      </a>
                      <a href={`mailto:${property.managerInfo.manager_email}`}>
                        <img src={Message} alt="Message" style={smallImg} />
                      </a>
                    </div>
                  </div>
                ) : property.management_status === "OWNER END EARLY" ? (
                  <div className="flex-grow-1 d-flex flex-column justify-content-center">
                    {property.management.ownerendearly > 0 ? (
                      <div style={{ ...blue, ...xSmall }} className="mb-1">
                        You requested to end agreement
                      </div>
                    ) : (
                      ""
                    )}
                    <div
                      className="mb-1"
                      style={property.managerInfo.manager_id ? {} : hidden}
                      onClick={stopPropagation}
                    >
                      <a
                        href={`tel:${property.managerInfo.manager_phone_number}`}
                      >
                        <img src={Phone} alt="Phone" style={smallImg} />
                      </a>
                      <a href={`mailto:${property.managerInfo.manager_email}`}>
                        <img src={Message} alt="Message" style={smallImg} />
                      </a>
                    </div>
                  </div>
                ) : property.management_status === "PM END EARLY" ? (
                  <div className="flex-grow-1 d-flex flex-column justify-content-center">
                    {property.management.pmendearly > 0 ? (
                      <div style={{ ...blue, ...xSmall }} className="mb-1">
                        PM requested to end agreement
                      </div>
                    ) : (
                      ""
                    )}
                    <div
                      className="mb-1"
                      style={property.managerInfo.manager_id ? {} : hidden}
                      onClick={stopPropagation}
                    >
                      <a
                        href={`tel:${property.managerInfo.manager_phone_number}`}
                      >
                        <img src={Phone} alt="Phone" style={smallImg} />
                      </a>
                      <a href={`mailto:${property.managerInfo.manager_email}`}>
                        <img src={Message} alt="Message" style={smallImg} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex">
                    <div className="d-flex align-items-start flex-column">
                      {property.management.forwarded > 0 ? (
                        <div style={{ ...blue, ...xSmall }} className="mb-0">
                          {property.management.forwarded} Property Manager
                          Selected
                        </div>
                      ) : (
                        ""
                      )}

                      {property.management.sent > 0 ? (
                        <div style={{ ...blue, ...xSmall }} className="mb-0">
                          {property.management.sent} Contract in Review
                        </div>
                      ) : (
                        ""
                      )}

                      {property.management.refused > 0 ? (
                        <div style={{ ...blue, ...xSmall }} className="mb-0">
                          {property.management.sent} PM declined
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}
              </Col>
            </Row>
            <hr className="mt-4" />
          </Container>
        ))}
      </div>
    </div>
  ) : stage === "NEW" ? (
    <div className="flex-grow-1">
      <Header
        title="Properties"
        leftText="< Back"
        leftFn={() => setStage("LIST")}
      />
      <PropertyForm
        edit
        cancel={() => setStage("LIST")}
        onSubmit={addProperty}
      />
    </div>
  ) : stage === "PROPERTY" ? (
    <div className="flex-grow-1">
      <PropertyView
        stage={stage}
        setStage={setStage}
        property_uid={selectedProperty.property_uid}
        back={() => setStage("LIST")}
        reload={fetchProperties}
      />
    </div>
  ) : stage === "PROPERTYMANAGERLISTS" ? (
    <div className="flex-grow-1">
      <PropertyManagersList
        property={selectedProperty}
        property_uid={selectedProperty.property_uid}
        back={() => setStage("PROPERTY")}
        reload={fetchProperties}
      />
    </div>
  ) : (
    ""
  );
}

export default OwnerProperties;
