import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row } from "react-bootstrap";
import AppContext from "../../AppContext";
import Header from "../../components/Header";
import SideBar from "./SideBar";
import OwnerFooter from "./OwnerFooter";
import UpcomingOwnerPayments from "./UpcomingOwnerPayments";
import OwnerPaymentHistory from "./OwnerPaymentHistory";
import { get } from "../../utils/api";
import "../../pages/maintenance.css";
export default function OwnerPayments(props) {
  const [propertyData, setPropertyData] = React.useState([]);

  const [upcomingPaymentsData, setUpcomingPaymentsData] = useState([]);
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
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
  const [paymentOptions, setPaymentOptions] = React.useState([
    { name: "paypal", isActive: false },
    { name: "zelle", isActive: false },
    { name: "ahc", isActive: false },
    { name: "apple", isActive: false },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchOwnerPayments = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }
    const response = await get(`/ownerPayments?owner_id=${user.user_uid}`);
    console.log("second");
    console.log(response.result);

    setPropertyData(response);
    setUpcomingPaymentsData(response.result);
    setIsLoading(false);
  };
  useEffect(() => {
    console.log("in use effect");
    fetchOwnerPayments();
  }, [paymentOptions]);
  const handlePaymentOption = (index) => {
    console.log("payment choice called");
    let temp = paymentOptions.slice();
    for (var i = 0; i < temp.length; i++) {
      if (i == index) {
        temp[index].isActive = !temp[index].isActive;
      } else {
        temp[i].isActive = false;
      }
    }

    setPaymentOptions(temp);
  };
  console.log(paymentOptions);

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
        <div className="w-100 mb-5">
          <Header title="Payment Portal" />
          <Row className="m-3">
            {propertyData.length !== 0 && (
              <UpcomingOwnerPayments
                data={upcomingPaymentsData}
                type={false}
                selectedProperty={propertyData.result[0]}
                paymentSelection={paymentOptions}
              />
            )}
            {propertyData.length !== 0 && (
              <OwnerPaymentHistory data={upcomingPaymentsData} />
            )}
          </Row>
        </div>
        <div hidden={responsive.showSidebar} className="w-100 mt-3">
          <OwnerFooter />
        </div>
      </div>
    </div>
  );
}
