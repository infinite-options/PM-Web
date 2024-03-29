import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import * as ReactBootStrap from "react-bootstrap";
import AppContext from "../../AppContext";
import Header from "../../components/Header";
import SideBar from "./SideBar";
import ManagerFooter from "./ManagerFooter";
import UpcomingManagerPayments from "./UpcomingManagerPayments";
import ManagerPaymentHistory from "./ManagerPaymentHistory";
import { get } from "../../utils/api";
import { sidebarStyle } from "../../utils/styles";

export default function ManagerPayments(props) {
  const [propertyData, setPropertyData] = useState([]);

  const [upcomingPaymentsData, setUpcomingPaymentsData] = useState([]);
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [width, setWindowWidth] = useState(1024);
  const [managerID, setManagerID] = useState("");
  const [verified, setVerified] = useState(false);
  const [unpaid, setUnpaid] = useState(false);

  const [deleted, setDeleted] = useState(false);
  const [paid, setPaid] = useState(false);
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
  const fetchManagerPayments = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length < 1) {
      // console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      // console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
    } else {
      management_buid = management_businesses[0].business_uid;
    }
    setManagerID(management_buid);
    const response = await get(
      `/managerPayments?manager_id=${management_buid}`
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
    let upcoming = response.result;

    upcoming.forEach((res) => {
      // console.log(res.purchase_type);
      if (
        res.payer.includes(res.owner_id) &&
        res.receiver === management_buid &&
        res.purchase_status === "UNPAID"
      ) {
        res.amount_due = -res.amount_due;
        // console.log(res.amount_due);
      } else if (
        res.payer.includes(res.owner_id) &&
        res.receiver === management_buid &&
        res.purchase_status === "PAID"
      ) {
        res.amount_due = -res.amount_due;
        res.amount_paid = -res.amount_paid;
        // console.log(res.amount_due);
        // console.log(res.amount_paid);
      } else {
        res.amount_due = res.amount_due;
        res.amount_paid = res.amount_paid;
        // console.log(res.amount_due);
        // console.log(res.amount_paid);
      }
      // updatedUpcoming.push(res);
    });

    setUpcomingPaymentsData(upcoming);
  };
  useEffect(() => {
    // console.log("in use effect");
    fetchManagerPayments();
  }, [paymentOptions, verified, deleted, paid, unpaid]);
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
        {" "}
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
                <UpcomingManagerPayments
                  data={upcomingPaymentsData}
                  type={false}
                  deleted={deleted}
                  setDeleted={setDeleted}
                  paid={paid}
                  setPaid={setPaid}
                  managerID={managerID}
                  selectedProperty={propertyData.result[0]}
                  paymentSelection={paymentOptions}
                />
              )}
              {propertyData.length !== 0 && (
                <ManagerPaymentHistory
                  data={upcomingPaymentsData}
                  managerID={managerID}
                  verified={verified}
                  setVerified={setVerified}
                  unpaid={unpaid}
                  setUnpaid={setUnpaid}
                />
              )}
            </Row>
          ) : (
            <div className="w-100 d-flex flex-column justify-content-center align-items-center">
              <ReactBootStrap.Spinner animation="border" role="status" />
            </div>
          )}
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <ManagerFooter />
          </div>
        </Col>
      </Row>
    </div>
  );
}
