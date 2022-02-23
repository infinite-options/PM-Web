import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import moment from "moment";
import AppContext from "../AppContext";
import Header from "../components/Header";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import RepairRequest from "../icons/repair_request.svg";
import RepairStatus from "../icons/repair_status.svg";
import Documents from "../icons/documents.svg";
import Announcements from "../icons/announcements.svg";
import Emergency from "../icons/Emergency.svg";
import SearchPM from "../icons/searchPM.svg";
import { get } from "../utils/api";
import {
  headings,
  upcoming,
  upcomingHeading,
  upcomingText,
  blue,
  bluePill,
  greenBorderPill,
  address,
  actions,
} from "../utils/styles";

function TenantDashboard(props) {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const { refresh, userData } = context;
  const { access_token, user } = userData;
  const { setShowFooter, profile, setProfile } = props;
  const [repairs, setRepairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rent, setRent] = React.useState(0);
  const [lastPurchase, setLastPurchase] = React.useState(null);
  const [currentPurchase, setCurrentPurchase] = React.useState(null);
  const [nextPurchase, setNextPurchase] = React.useState(null);
  const [property, setProperty] = React.useState({});
  console.log(context, access_token, user);

  useEffect(() => {
    if (profile != undefined && repairs.length === 0) {
      setIsLoading(false);
    }
  }, [profile, repairs]);

  useEffect(() => {
    setShowFooter(true);
  });


  useEffect(() => {
    const fetchProfile = async () => {
      let response = await get('/tenantProfileInfo', access_token);
      if (response.msg === "Token has expired") {
        console.log("here msg");
        refresh();
        return;
      }
      setProfile(response.result[0]);
      response = await get('/tenantProperties', access_token);
      const payments = response.result.length ? JSON.parse(response.result[0].rent_payments) : [];
      let rentTotal = 0;
      for (const payment of payments) {
        if (payment.frequency === 'Monthly' && payment.fee_type === '$') {
          rentTotal += parseFloat(payment.charge);
        }
      }
      setRent(rentTotal);
      setProperty(response.result[0]);
      const purchases = response.result.length ? JSON.parse(response.result[0].purchases)  : [];
      let lastPaidPurchase = null;
      let firstUnpaidPurchase = null;
      let nextUnpaidPurchase = null;
      for (const purchase of purchases) {
        if (purchase.purchase_status === 'UNPAID' && firstUnpaidPurchase === null) {
          firstUnpaidPurchase = purchase;
        } else if (purchase.purchase_status === 'UNPAID' && nextUnpaidPurchase === null) {
          nextUnpaidPurchase = purchase;
        } else if (purchase.purchase_status === 'PAID') {
          lastPaidPurchase = purchase;
        }
      }
      setLastPurchase(lastPaidPurchase);
      setCurrentPurchase(firstUnpaidPurchase);
      setNextPurchase(nextUnpaidPurchase);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchRepairs = async () => {
      const response = await get(
        `/maintenanceRequests?property_uid=${profile.property_uid}`
      );
      console.log(response);

      setRepairs(response.result);
    };
    fetchRepairs();
  }, [profile]);

  const goToRequest = () => {
    navigate(`/${profile.property_uid}/repairRequest`);
  };
  const goToAnnouncements = () => {
    navigate("/residentAnnouncements");
  };
  const goToEmergency = () => {
    navigate("/emergency");
  };
  const goToStatus = () => {
    navigate(`/${profile.property_uid}/repairStatus`);
  };
  const goToDocuments = () => {
    navigate("/tenantDocuments");
  };
  const goToSearchPM = () => {
    navigate("/tenantAvailableProperties");
  };
  console.log(profile);
  return (
    <div className="h-100">
      <Header title="Home" />
      {isLoading === true || (!profile || profile.length)  === 0 ? null : (
        <Container className="pt-1 mb-4" style={{ minHeight: "100%" }}>
          <Row style={headings}>
            <div>Hello {profile.tenant_first_name},</div>
          </Row>
          {repairs.length === 0 ? (
            <Row style={upcoming} className="mt-2 mb-2">
              <div style={upcomingHeading} className="mt-1 mb-1">
                Upcoming:
                <br />
                <br />
                Nothing Scheduled
              </div>
            </Row>
          ) : (
            <div>
              {repairs.map((repair) => {
                return repair.status === "SCHEDULED" ? (
                  <Row style={upcoming} className="mt-2 mb-2">
                    <div style={upcomingHeading} className="mt-1 mb-1">
                      Upcoming:
                      <br />
                      Toilet Maintenance is scheduled for
                      <br />{" "}
                      {moment(repair.scheduled_date).format(
                        "MMM DD, YYYY "
                      )} at {moment(repair.scheduled_date).format("hh:mm a")}
                      <br />
                    </div>

                    <Col className="mt-1 mb-1">
                      <div style={upcomingText}>
                        For questions / concerns, feel free to contact the
                        property manager
                      </div>
                    </Col>
                    <Col xs={2} style={upcomingText} className="mt-1 mb-1">
                      <img src={Phone} />
                    </Col>
                    <Col xs={2} style={upcomingText} className="mt-1 mb-1">
                      <img src={Message} />
                    </Col>
                  </Row>
                ) : null;
              })}
            </div>
          )}

          <Row>
            <div style={headings} className="mt-4 mb-1">
              ${rent}/mo
            </div>
            {isLoading === true ? null : (
              <div style={address} className="mt-1 mb-1">
                {`${property.address}, ${property.city}, ${property.state} ${property.zip}`}
              </div>
            )}

            {lastPurchase && (
              <div style={blue} className="mt-1 mb-1" onClick={() => navigate('/paymentHistory')}>
                Rent paid for {lastPurchase.purchase_notes}:
                ${lastPurchase.amount_paid}
              </div>
            )}
            {currentPurchase && (
              <div>
                <Col xs={7} className="mt-1 mb-1">
                  <div style={bluePill} onClick={() => navigate(`/rentPayment/${currentPurchase.purchase_uid}`)}>
                    Rent due for {currentPurchase.purchase_notes}:
                    ${currentPurchase.amount_due - currentPurchase.amount_paid}
                  </div>
                </Col>
              </div>
            )}
            {nextPurchase && (
              <div>
                <Col xs={8} className="mt-1 mb-1">
                  <div style={greenBorderPill} onClick={() => navigate(`/rentPayment/${nextPurchase.purchase_uid}`)}>
                    Upcoming rent for {nextPurchase.purchase_notes}:
                    ${nextPurchase.amount_due - nextPurchase.amount_paid}
                  </div>
                </Col>
              </div>
            )}
          </Row>
          {/* <Row style={headings}>
          <div>Actions</div>
        </Row> */}
          <Row
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
            className="mb-4"
          >
            <div style={headings} className="mt-4 mb-1">
              Actions
            </div>
            <Col xs={3} style={actions}>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={RepairRequest}
                onClick={goToRequest}
              />
              <div>Request Repair</div>
            </Col>
            <Col xs={3} style={actions}>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={RepairStatus}
                onClick={goToStatus}
              />
              <div>Repair Status</div>
            </Col>
            <Col xs={3} style={actions}>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={Documents}
                onClick={goToDocuments}
              />
              <div>
                Your <br /> Documents
              </div>
            </Col>
          </Row>
          <Row
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
            className="mt-1 mb-1"
          >
            <Col xs={3} style={actions}>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={Announcements}
                onClick={goToAnnouncements}
              />
              <div>
                Resident <br />
                Announcements
              </div>
            </Col>
            <Col xs={3} style={actions}>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={Emergency}
                onClick={goToEmergency}
              />
              <div>Emergency</div>
            </Col>
            <Col xs={3} style={actions}>
              <div>
                <img
                  style={{ width: "50px", height: "50px", cursor: "pointer" }}
                  src={SearchPM}
                  onClick={goToSearchPM}
                />
                <div>Search Property Managers</div>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}

export default TenantDashboard;
