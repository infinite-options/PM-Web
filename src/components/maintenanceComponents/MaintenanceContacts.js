import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SideBar from "./SideBar";
import MaintenanceFooter from "./MaintenanceFooter";
import Header from "../Header";
export default function MaintenanceContacts() {
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
  const responsiveSidebar = {
    showSidebar: width > 1023,
  };

  return (
    <div className="w-100 overflow-hidden">
      <div className="flex-1">
        <div
          hidden={!responsiveSidebar.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </div>
        <div className="w-100 mb-5 overflow-scroll">
          <Header title="Maintenance Contacts" />
          <Row className="m-3">
            <Col>
              <h3>Maintenance Contacts</h3>
            </Col>
            <Col></Col>
          </Row>
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <MaintenanceFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
