import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HighPriority from "../icons/highPriority.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import { headings, subHeading, subText, blue } from "../utils/styles";

function TenantPropertyManagers(props) {
  const navigate = useNavigate();
  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Property Managers"
        leftText="< Back"
        leftFn={() => navigate("/tenant")}
      />
      <Container className="pt-1 mb-4">
        <Row className="mt-2 mb-2">
          <Col style={{ padding: "5px" }}>
            <div
              style={{
                width: "110px",
                height: "100%",
                background: "#F5F5F5 0% 0% no-repeat padding-box",
                border: "1px solid #C4C4C4",
                borderRadius: "5px",
              }}
            ></div>
          </Col>
          <Col xs={8} style={{ padding: "5px" }}>
            <div>
              <Row style={subHeading}>
                <Col>Carpet Cleaning</Col>
                <Col xs={5}>
                  <img src={HighPriority} />
                </Col>
              </Row>
              <Row style={subText}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod
                <hr />
              </Row>
              <Row style={blue}>
                Status: Scheduled for <br /> Monday, Dec 16, 2021
              </Row>
            </div>
          </Col>
        </Row>
      </Container>

      <Footer tab={"DASHBOARD"} />
    </div>
  );
}

export default TenantPropertyManagers;