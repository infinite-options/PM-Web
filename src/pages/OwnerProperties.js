import React from "react";
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
  bPill,
} from "../utils/styles";

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

  const selectProperty = (property) => {
    setSelectedProperty(property);
    setStage("PROPERTY");
  };
  const addProperty = () => {
    fetchProperties();
    setStage("LIST");
  };

  React.useEffect(() => {
    setShowFooter(stage !== "NEW");
  }, [stage, setShowFooter]);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return stage === "LIST" ? (
    <div className="pb-5">
      <Header
        title="Properties"
        leftText="+ New"
        leftFn={() => setStage("NEW")}
        rightText="Sort by"
      />
      {properties.map((property, i) => (
        <Container
          key={i}
          onClick={() => selectProperty(property)}
          className="pt-1 mb-4"
          style={{ height: "100px" }}
        >
          <Row className="h-100">
            <Col xs={4} className="h-100">
              <div style={tileImg}>
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
                <h5 className="mb-0" style={{ fontWeight: "600" }}>
                  ${property.listed_rent}/mo
                </h5>
                {property.property_manager.length == 0 ? (
                  <p style={orangePill} className="mb-0">
                    New
                  </p>
                ) : property.property_manager.length > 1 ? (
                  property.property_manager.map((p, i) =>
                    p.management_status === "REJECTED" ? (
                      ""
                    ) : p.management_status !== "ACCEPTED" ? (
                      <p style={orangePill} className="mb-0">
                        New
                      </p>
                    ) : property.rental_uid !== null ? (
                      <p style={greenPill} className="mb-0">
                        Rented
                      </p>
                    ) : (
                      <p style={orangePill} className="mb-0">
                        Not Rented
                      </p>
                    )
                  )
                ) : property.property_manager[0].management_status !==
                  "ACCEPTED" ? (
                  <p style={orangePill} className="mb-0">
                    New
                  </p>
                ) : property.rental_uid !== null ? (
                  <p style={greenPill} className="mb-0">
                    Rented
                  </p>
                ) : (
                  <p style={orangePill} className="mb-0">
                    Not Rented
                  </p>
                )}
              </div>
              <p style={gray} className="mt-2 mb-0">
                {property.address}
                {property.unit !== "" ? " " + property.unit : ""},{" "}
                {property.city}, {property.state} <br />
                {property.zip}
              </p>
              {property.property_manager.length == 0 ? (
                <p style={{ ...blue, ...xSmall }} className="mb-0">
                  No Manager
                </p>
              ) : property.property_manager.length > 1 ? (
                property.property_manager.map((p, i) =>
                  p.management_status === "REJECTED" ? (
                    ""
                  ) : (
                    <div className="d-flex">
                      <div className="flex-grow-1 d-flex flex-column justify-content-center">
                        <p style={{ ...blue, ...xSmall }} className="mb-0">
                          {p.management_status === "ACCEPTED"
                            ? `Manager: ${p.manager_business_name}`
                            : "No Manager"}
                        </p>
                      </div>
                      <div
                        style={p.manager_id ? {} : hidden}
                        onClick={stopPropagation}
                      >
                        <a href={`tel:${p.manager_phone_number}`}>
                          <img src={Phone} alt="Phone" style={smallImg} />
                        </a>
                        <a href={`mailto:${p.manager_email}`}>
                          <img src={Message} alt="Message" style={smallImg} />
                        </a>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="d-flex">
                  <div className="flex-grow-1 d-flex flex-column justify-content-center">
                    <p style={{ ...blue, ...xSmall }} className="mb-0">
                      {property.property_manager[0].management_status ===
                      "ACCEPTED"
                        ? `Manager: ${property.property_manager[0].manager_business_name}`
                        : "No Manager"}
                    </p>
                  </div>
                  <div
                    style={
                      property.property_manager[0].manager_id ? {} : hidden
                    }
                    onClick={stopPropagation}
                  >
                    <a
                      href={`tel:${property.property_manager[0].manager_phone_number}`}
                    >
                      <img src={Phone} alt="Phone" style={smallImg} />
                    </a>
                    <a
                      href={`mailto:${property.property_manager[0].manager_email}`}
                    >
                      <img src={Message} alt="Message" style={smallImg} />
                    </a>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      ))}
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
        property_uid={selectedProperty.property_uid}
        back={() => setStage("LIST")}
        reload={fetchProperties}
      />
    </div>
  ) : (
    ""
  );
}

export default OwnerProperties;
