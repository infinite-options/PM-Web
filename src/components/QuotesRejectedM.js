import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HighPriority from "../icons/highPriority.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import { headings, subHeading, subText, blue } from "../utils/styles";

function QuotesRejectedM(props) {
  const navigate = useNavigate();
  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Quotes Rejected"
        leftText="< Back"
        leftFn={() => navigate("/maintenance")}
        rightText="Sort by"
      />

      <Container className="pt-1 mb-4">
        <Row style={headings}>
          <div>Quotes Rejected</div>
        </Row>
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
                <Col>Broken Shower</Col>
                <Col xs={5}>
                  <img src={LowPriority} />
                </Col>
              </Row>
              <Row style={subText}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod
                <hr />
              </Row>
              <Row style={blue} className="mt=0 pt=0">
                Received: Dec 1, 2021
              </Row>
            </div>
          </Col>
        </Row>
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
                <Col>Broken Shower</Col>
                <Col xs={5}>
                  <img src={LowPriority} />
                </Col>
              </Row>
              <Row style={subText}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod
                <hr />
              </Row>
              <Row style={blue} className="mt=0 pt=0">
                Received: Dec 1, 2021
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer tab={"DASHBOARD"} />
    </div>
  );
}

export default QuotesRejectedM;
