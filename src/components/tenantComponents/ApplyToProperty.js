import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import SideBar from "./SideBar";
import TenantFooter from "./TenantFooter";
import SearchPM from "../../icons/searchPM.svg";
import Dashboard_Blue from "../../icons/Dashboard_Blue.svg";
import { welcome } from "../../utils/styles";

const divStyle = {
  fontSize: "20px",
};
function ApplyToProperty() {
  const navigate = useNavigate();
  const goToDashboard = () => {
    navigate("/tenant");
  };
  const goToAvailableProperties = () => {
    navigate("/tenantAvailableProperties");
  };
  const [width, setWindowWidth] = useState(0);
  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };
  const responsive = {
    showSidebar: width > 1023,
  };

  return (
    <div className="w-100 overflow-hidden">
      <div className="flex-1">
        <div
          hidden={!responsive.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </div>
        <div className="w-100 mb-5 overflow-scroll">
          <Header />
          <Container>
            <div style={welcome}>
              <Row>
                <div style={{ fontSize: "30px" }}>
                  {" "}
                  Your documents have been shared with the Property Manager !
                </div>
              </Row>
            </div>
            <div style={welcome}>
              <div style={{ fontSize: "25px" }}>
                {" "}
                Where would you like to proceed?
              </div>
              <div style={{ display: "flex", padding: "20px" }}>
                <Col>
                  {/* <a onClick={goToDashboard} style={divStyle}> A. DashBoard </a> */}
                  <img
                    style={{
                      width: "50px",
                      height: "50px",
                      cursor: "pointer",
                    }}
                    src={Dashboard_Blue}
                    onClick={goToDashboard}
                  />
                  <div>DashBoard</div>
                </Col>
                <Col>
                  {/* <a onClick={goToAvailableProperties} style={divStyle}> B. Available Properties </a> */}
                  <div>
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        cursor: "pointer",
                      }}
                      src={SearchPM}
                      onClick={goToAvailableProperties}
                    />
                    <div>Available Properties</div>
                  </div>
                </Col>
              </div>
            </div>
          </Container>
        </div>
      </div>
      <div hidden={responsive.showSidebar} className="w-100 mt-3">
        <TenantFooter />
      </div>
    </div>
  );
}

export default ApplyToProperty;
