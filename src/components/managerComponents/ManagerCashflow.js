import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Header from "../Header";
import SideBar from "./SideBar";
import AppContext from "../../AppContext";
import SortDown from "../../icons/Sort-down.svg";
import SortLeft from "../../icons/Sort-left.svg";
import { get } from "../../utils/api";
export default function ManagerCashflow() {
  const navigate = useNavigate();

  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [isLoading, setIsLoading] = useState(true);
  const [toggleRevenue, setToggleRevenue] = useState(false);
  const [toggleExpense, setToggleExpense] = useState(false);
  const [revenue, setRevenue] = useState(null);
  const [expense, setExpense] = useState(null);
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
  const fetchCashflow = async () => {
    if (access_token === null || user.role.indexOf("MANAGER") === -1) {
      navigate("/");
      return;
    }
    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid;
    }
    const cashflowResponse = await get(
      `/CashflowManager?manager_id=${management_buid}`
    );
    setRevenue(cashflowResponse.result.revenue);
    setExpense(cashflowResponse.result.expense);
  };
  useEffect(() => {
    fetchCashflow();
  }, []);
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
          <Header title="Manager Cashflow" />
          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <Row className="m-3">
              <Col>
                <h3>Portfolio Cashflow Summary</h3>
              </Col>
              <Col></Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}
