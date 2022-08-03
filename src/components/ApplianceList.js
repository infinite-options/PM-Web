import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

import BlueArrowUp from "../icons/BlueArrowUp.svg";
import BlueArrowDown from "../icons/BlueArrowDown.svg";
import { mediumBold } from "../utils/styles";

function ApplianceList(props) {
  const navigate = useNavigate();
  const { back, property } = props;

  const [listAppliances, setListAppliances] = useState(false);
  const [currentAppliance, setCurrentAppliance] = useState([]);

  var num_appliances = Object.values(JSON.parse(property.appliances)).filter(
    function (appliance) {
      return appliance.available;
    }
  ).length;

  const toggleList = (x) => {
    console.log(x);
    console.log(currentAppliance);
    if (currentAppliance.includes(x)) {
      console.log("in if");
      if (currentAppliance.length === 1) {
        let ap = [];
        console.log(ap);
        setCurrentAppliance(ap);
      } else {
        let ap = currentAppliance.filter((item) => item !== x);
        console.log(ap);
        setCurrentAppliance(ap);
      }
    } else {
      console.log("in else");
      let ap = currentAppliance.filter((item, i) => item !== x);
      console.log(ap);
      ap.push(x);
      console.log(ap);
      setCurrentAppliance(ap);
      setListAppliances(true);
    }
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
      <Header title="Appliances" leftText="< Back" leftFn={back} />
      <div
        className="mx-2 my-2 p-3"
        style={{
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        <p style={mediumBold}>
          {property.address}
          {property.unit !== "" ? ` ${property.unit}, ` : ", "}
          {property.city}, {property.state} {property.zip}
        </p>
        {num_appliances} appliances
      </div>
      {Object.values(JSON.parse(property.appliances)).map((appliance, i) => {
        return appliance.available ? (
          <div
            className="mx-2 my-2 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 6px #00000029",
              border: "1px solid #007AFF",
              borderRadius: "5px",
              opacity: 1,
            }}
            key={i}
          >
            <Row>
              <Col style={mediumBold}>
                <div style={{ color: "#007AFF" }}>{appliance.name}</div>
                <div>
                  Purchased: {appliance.purchased ? appliance.purchased : "NA"}
                </div>
              </Col>
              <Col
                xs={2}
                className="justify-content-end"
                onClick={() => {
                  toggleList(i);
                }}
              >
                <img
                  src={
                    listAppliances && currentAppliance == appliance.name
                      ? BlueArrowUp
                      : BlueArrowDown
                  }
                />
              </Col>
            </Row>
            <Row>
              {listAppliances && currentAppliance.includes(i) ? (
                <div>
                  <div>
                    Purchased From:{" "}
                    {appliance.purchased_from ? appliance.purchased_from : "NA"}
                  </div>
                  <div>
                    Order Number:{" "}
                    {appliance.purchased_order
                      ? appliance.purchased_order
                      : "NA"}
                  </div>
                  <div>
                    Installed On:{" "}
                    {appliance.installed ? appliance.installed : "NA"}
                  </div>

                  <div>
                    Serial Number:{" "}
                    {appliance.serial_num ? appliance.serial_num : "NA"}
                  </div>
                  <div>
                    Model Number:{" "}
                    {appliance.model_num ? appliance.model_num : "NA"}
                  </div>

                  <div>
                    Warranty till:{" "}
                    {appliance.warranty_till ? appliance.warranty_till : "NA"}
                  </div>

                  <div>
                    Warranty Info:{" "}
                    {appliance.warranty_info ? appliance.warranty_info : "NA"}
                  </div>
                </div>
              ) : (
                ""
              )}
            </Row>
          </div>
        ) : null;
      })}
    </div>
  );
}

export default ApplianceList;
