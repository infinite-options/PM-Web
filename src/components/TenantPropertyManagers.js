import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import { headings, subHeading, subText, blue } from "../utils/styles";

function TenantPropertyManagers(props) {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Property Managers"
        leftText="< Back"
        leftFn={() => navigate("/tenant")}
      />
      <Row>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search by city"
            style={{
              border: "1px solid #707070",
              borderRadius: "50px",
              width: "90%",
              padding: "0.5rem",
            }}
            onChange={(event) => {
              setSearchName(event.target.value);
            }}
          />
        </div>
      </Row>
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
                <Col>Beverly Management</Col>
              </Row>
              <Row style={subText}>
                <Col>Residential. Commercial Spaces</Col>
              </Row>
              <Row style={blue} className="mt-4">
                <Col>Contact</Col>
                <Col>
                  <Row>
                    <Col>
                      <img
                        src={Phone}
                        style={{ width: "30px", height: "30px" }}
                      />
                    </Col>
                    <Col>
                      <img
                        src={Message}
                        style={{ width: "30px", height: "30px" }}
                      />
                    </Col>
                  </Row>
                </Col>
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
                <Col>Beverly Management</Col>
              </Row>
              <Row style={subText}>
                <Col>Residential. Commercial Spaces</Col>
              </Row>
              <Row style={blue} className="mt-4">
                <Col>Contact</Col>
                <Col>
                  <Row>
                    <Col>
                      <img
                        src={Phone}
                        style={{ width: "30px", height: "30px" }}
                      />
                    </Col>
                    <Col>
                      <img
                        src={Message}
                        style={{ width: "30px", height: "30px" }}
                      />
                    </Col>
                  </Row>
                </Col>
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
                <Col>Beverly Management</Col>
              </Row>
              <Row style={subText}>
                <Col>Residential. Commercial Spaces</Col>
              </Row>
              <Row style={blue} className="mt-4">
                <Col>Contact</Col>
                <Col>
                  <Row>
                    <Col>
                      <img
                        src={Phone}
                        style={{ width: "30px", height: "30px" }}
                      />
                    </Col>
                    <Col>
                      <img
                        src={Message}
                        style={{ width: "30px", height: "30px" }}
                      />
                    </Col>
                  </Row>
                </Col>
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
                <Col>Beverly Management</Col>
              </Row>
              <Row style={subText}>
                <Col>Residential. Commercial Spaces</Col>
              </Row>
              <Row style={blue} className="mt-4">
                <Col>Contact</Col>
                <Col>
                  <Row>
                    <Col>
                      <img
                        src={Phone}
                        style={{ width: "30px", height: "30px" }}
                      />
                    </Col>
                    <Col>
                      <img
                        src={Message}
                        style={{ width: "30px", height: "30px" }}
                      />
                    </Col>
                  </Row>
                </Col>
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
