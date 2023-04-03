import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row } from "react-bootstrap";
import AppContext from "../../AppContext";
import Header from "../../components/Header";
import SideBar from "./SideBar";
import MaintenanceFooter from "./MaintenanceFooter";
import UpcomingMaintenancePayments from "./UpcomingMaintenancePayments";
import { get } from "../../utils/api";
import MaintenancePaymentHistory from "./MaintenancePaymentHistory";
export default function MaintenancePayments(props) {
  const [propertyData, setPropertyData] = React.useState([]);

  const [upcomingPaymentsData, setUpcomingPaymentsData] = useState([]);
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [width, setWindowWidth] = useState(0);
  const [maintenanceID, setMaintenanceID] = useState("");
  const [verified, setVerified] = useState(false);

  const [deleted, setDeleted] = useState(false);
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
  const fetchMaintenancePayments = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const maintenance_businesses = user.businesses.filter(
      (business) => business.business_type === "MAINTENANCE"
    );
    let maintenance_buid = null;
    if (maintenance_businesses.length < 1) {
      // console.log("No associated PM Businesses");
      return;
    } else if (maintenance_businesses.length > 1) {
      // console.log("Multiple associated PM Businesses");
      maintenance_buid = maintenance_businesses[0].business_uid;
    } else {
      maintenance_buid = maintenance_businesses[0].business_uid;
    }
    setMaintenanceID(maintenance_buid);
    const response = await get(
      `/maintenancePayments?business_id=${maintenance_buid}`
    );
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
    // console.log(response.result);
    setUpcomingPaymentsData(response.result);
  };
  useEffect(() => {
    // console.log("in use effect");
    fetchMaintenancePayments();
  }, [paymentOptions, verified, deleted]);
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
          <Row>
            {propertyData.length !== 0 && (
              <UpcomingMaintenancePayments
                data={upcomingPaymentsData}
                type={false}
                deleted={deleted}
                setDeleted={setDeleted}
                maintenanceID={maintenanceID}
                selectedProperty={propertyData.result[0]}
                paymentSelection={paymentOptions}
              />
            )}
            {propertyData.length !== 0 && (
              <MaintenancePaymentHistory
                data={upcomingPaymentsData}
                maintenanceID={maintenanceID}
                verified={verified}
                setVerified={setVerified}
              />
            )}
          </Row>
          <div hidden={responsive.showSidebar} className="w-100 mt-3">
            <MaintenanceFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
