import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import * as ReactBootStrap from "react-bootstrap";
import AppContext from "../../AppContext";
import Header from "../Header";
import SideBar from "./SideBar";
import TenantFooter from "./TenantFooter";
import TenantUpcomingPayments from "./TenantUpcomingPayments";
import { get } from "../../utils/api";
import TenantPaymentHistory from "./TenantPaymentHistory";
import { sidebarStyle } from "../../utils/styles";
export default function TenantPayments(props) {
  const [propertyData, setPropertyData] = useState([]);
  const [tenantExpenses, setTenantExpenses] = useState([]);

  const [upcomingPaymentsData, setUpcomingPaymentsData] = useState([]);
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [width, setWindowWidth] = useState(1024);
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
  const [paymentOptions, setPaymentOptions] = useState([
    { name: "paypal", isActive: false },
    { name: "zelle", isActive: false },
    { name: "ahc", isActive: false },
    { name: "apple", isActive: false },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchTenantPayments = async () => {
    if (access_token === null || user.role.indexOf("TENANT") === -1) {
      navigate("/");
      return;
    }
    const response = await get("/tenantDashboard", access_token);
    // console.log("second");
    // console.log(response);
    setIsLoading(false);

    if (response.msg === "Token has expired") {
      // console.log("here msg");
      refresh();

      return;
    }
    setPropertyData(response);
    let upcoming = [];
    response.result[0].properties.forEach((res) => {
      if (res.tenantExpenses.length > 0) {
        res.tenantExpenses.forEach((mr) => {
          upcoming.push(mr);
        });
      }
    });
    setUpcomingPaymentsData(upcoming);
    setTenantExpenses(response.result[0].properties[0].tenantExpenses);
  };
  useEffect(() => {
    // console.log("in use effect");
    fetchTenantPayments();
  }, [paymentOptions]);
  const handlePaymentOption = (index) => {
    // console.log("payment choice called");
    let temp = paymentOptions.slice();
    for (var i = 0; i < temp.length; i++) {
      if (i === index) {
        temp[index].isActive = !temp[index].isActive;
      } else {
        temp[i].isActive = false;
      }
    }

    setPaymentOptions(temp);
  };
  // console.log(paymentOptions);

  return (
    <div className="w-100 overflow-hidden">
      <Row className="w-100 mb-5 overflow-hidden">
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5">
          <Header title="Payment Portal" />
          {!isLoading ? (
            <Row>
              {propertyData.length !== 0 && (
                <TenantUpcomingPayments
                  data={upcomingPaymentsData}
                  type={false}
                  selectedProperty={propertyData.result[0].properties[0]}
                  paymentSelection={paymentOptions}
                />
              )}

              {propertyData.length !== 0 && (
                <TenantPaymentHistory
                  data={upcomingPaymentsData}
                  type={false}
                  selectedProperty={propertyData.result[0].properties[0]}
                  paymentSelection={paymentOptions}
                />
              )}
            </Row>
          ) : (
            <div className="w-100 d-flex flex-column justify-content-center align-items-center">
              <ReactBootStrap.Spinner animation="border" role="status" />
            </div>
          )}
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <TenantFooter />
          </div>
        </Col>
      </Row>
    </div>
  );
}
