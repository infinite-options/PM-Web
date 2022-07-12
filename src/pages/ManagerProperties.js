import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import {
  blue,
  bluePill,
  gray,
  smallImg,
  hidden,
  greenPill,
  mediumBold,
  orangePill,
  redPill,
  tileImg,
  xSmall,
} from "../utils/styles";
import Header from "../components/Header";
import AppContext from "../AppContext";
import { get } from "../utils/api";

function ManagerProperties(props) {
  const navigate = useNavigate();
  const { userData, refresh } = React.useContext(AppContext);
  const { access_token, user } = userData;
  const [properties, setProperties] = React.useState([]);

  const fetchProperties = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    // const response = await get(`/managerProperties`, access_token);
    // const response =  await get(`/propertyInfo?manager_id=${user.user_uid}`);

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

    const response = await get(`/propertyInfo?manager_id=${management_buid}`);

    if (response.msg === "Token has expired") {
      refresh();
      return;
    }

    // const properties = response.result
    const properties = response.result.filter(
      (property) => property.management_status !== "REJECTED"
    );

    let properties_unique = [];
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

    properties_unique.forEach((property) => {
      const new_repairs = property.maintenanceRequests.filter(
        (item) => item.request_status === "NEW"
      );
      const processing_repairs = property.maintenanceRequests.filter(
        (item) => item.request_status === "PROCESSING"
      );
      const scheduled_repairs = property.maintenanceRequests.filter(
        (item) => item.request_status === "SCHEDULED"
      );
      const completed_repairs = property.maintenanceRequests.filter(
        (item) => item.request_status === "COMPLETE"
      );
      property.repairs = {
        new: new_repairs.length,
        processing: processing_repairs.length,
        scheduled: scheduled_repairs.length,
        complete: completed_repairs.length,
      };

      property.new_tenant_applications = property.applications.filter(
        (a) => a.application_status === "NEW"
      );

      property.end_early_applications = property.applications.filter(
        (a) => a.application_status === "TENANT END EARLY"
      );
    });

    console.log(properties_unique);
    setProperties(properties_unique);
  };

  React.useEffect(fetchProperties, [access_token]);

  // const selectProperty = (property) => {
  //     setSelectedProperty(property);
  //     setStage('PROPERTY');
  // }
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
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
        leftText="<Back"
        leftFn={() => {
          navigate("/manager");
        }}
        // rightText="Sort by"
      />
      <div
        className="mx-2 my-2 p-3"
        style={{
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        {properties.map((property, i) => (
          <Container
            key={i}
            className="pt-1 mb-4"
            onClick={() => {
              navigate(`./${property.property_uid}`, {
                state: {
                  property: property,
                  property_uid: property.property_uid,
                },
              });
            }}
          >
            <Row>
              <Col xs={4}>
                <div style={tileImg}>
                  {JSON.parse(property.images).length > 0 ? (
                    <img
                      src={JSON.parse(property.images)[0]}
                      alt="Property"
                      className="h-100 w-100"
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

                  {property.rental_status === "ACTIVE" ? (
                    <p style={greenPill} className="mb-0">
                      Rented
                    </p>
                  ) : property.rental_status === "PROCESSING" ? (
                    <p style={bluePill} className="mb-0">
                      Processing
                    </p>
                  ) : property.management_status === "FORWARDED" ? (
                    <p style={redPill} className="mb-0">
                      New
                    </p>
                  ) : property.management_status === "SENT" ? (
                    <p style={orangePill} className="mb-0">
                      Processing
                    </p>
                  ) : (
                    <p style={orangePill} className="mb-0">
                      Not Rented
                    </p>
                  )}
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
                  {property.city}, {property.state}
                  {property.zip}
                </p>

                <div className="d-flex">
                  <div className="d-flex align-items-end">
                    <p style={{ ...blue, ...xSmall }} className="mb-0">
                      {property.repairs.new > 0
                        ? `${property.repairs.new} new repair requests to review`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="d-flex align-items-end">
                    <p style={{ ...blue, ...xSmall }} className="mb-0">
                      {property.new_tenant_applications.length > 0
                        ? `${property.new_tenant_applications.length} new tenant application(s) to review`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="d-flex align-items-end">
                    <p style={{ ...blue, ...xSmall }} className="mb-0">
                      {property.end_early_applications.length > 0
                        ? "Tenant(s) requested to end the lease early"
                        : ""}
                    </p>
                  </div>
                </div>
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
                      Owner: {property.owner_first_name}{" "}
                      {property.owner_last_name}
                    </p>
                  </div>
                  <div
                    className="mb-1"
                    style={property.owner_id ? {} : hidden}
                    onClick={stopPropagation}
                  >
                    <a href={`tel:${property.owner_phone_number}`}>
                      <img src={Phone} alt="Phone" style={smallImg} />
                    </a>
                    <a href={`mailto:${property.owner_email}`}>
                      <img src={Message} alt="Message" style={smallImg} />
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
            <hr className="mt-4" />
          </Container>
        ))}
      </div>
    </div>
  );
}

export default ManagerProperties;
