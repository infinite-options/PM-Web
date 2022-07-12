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

function ManagerTenantList(props) {
  const navigate = useNavigate();

  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [tenants, setTenants] = useState([]);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState(null);
  const [stage, setStage] = React.useState("LIST");
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

    const response = await get(
      `/managerPropertyTenants?manager_id=` + management_buid
    );

    if (response.msg === "Token has expired") {
      refresh();
      return;
    }

    // console.log(response.result);
    setTenants(response.result);
    setSelectedTenants(response.result[0]);
    console.log(selectedTenants);
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
        title="Tenant Info"
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
        {tenants.map((property, i) => (
          <Container key={i} className="my-3">
            <Row
              onClick={() => {
                setStage("PMDETAILS");
                setSelectedTenants(property);
              }}
              className="p-2 mb-1"
              style={{
                boxShadow: " 0px 1px 6px #00000029",
                borderRadius: "5px",
              }}
            >
              <Col className="ps-0" xs={8}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0" style={{ fontWeight: "600" }}>
                    {property.tenant_first_name} {property.tenant_last_name}
                  </h5>
                </div>
              </Col>
              <Col>
                <div className="d-flex  justify-content-end ">
                  <div
                    style={property.tenant_id ? {} : hidden}
                    onClick={stopPropagation}
                  >
                    <a href={`tel:${property.tenant_phone_number}`}>
                      <img src={Phone} alt="Phone" style={smallImg} />
                    </a>
                    <a href={`mailto:${property.tenant_email}`}>
                      <img src={Message} alt="Message" style={smallImg} />
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        ))}
        <hr />
        <div className="text-center">Tenant Applications</div>
      </div>
    </div>
  );
}

export default ManagerTenantList;
