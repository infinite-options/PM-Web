import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import AppContext from "../AppContext";
import Header from "../components/Header";
import ReviewPropertyLease from "./reviewPropertyLease";
import RepairRequest from "../icons/repair_request.svg";
import RepairStatus from "../icons/repair_status.svg";
import Documents from "../icons/documents.svg";
import Announcements from "../icons/announcements.svg";
import Emergency from "../icons/Emergency.svg";
import SearchPM from "../icons/searchPM.svg";
import { get } from "../utils/api";
import {
  headings,
  actions,
  actionsDisabled,
  welcome,
  mediumBold
} from "../utils/styles";

function TenantWelcomePage(props) {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const { refresh, userData } = context;
  const { access_token, user } = userData;
  const { setShowFooter, profile, setProfile } = props;
  const [repairs, setRepairs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rent, setRent] = React.useState(0);
  const [rentPurchase, setRentPurchase] = React.useState({});
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
      const response = await get('/tenantProfileInfo', access_token);
      if (response.msg === "Token has expired") {
        console.log("here msg");
        refresh();
        return;
      }
      setProfile(response.result[0]);
      const payments = response.result.length ? JSON.parse(response.result[0].rent_payments) : [];
      let rentTotal = 0;
      for (const payment of payments) {
        if (payment.frequency === 'Monthly' && payment.fee_type === '$') {
          rentTotal += parseFloat(payment.charge);
        }
      }
      setRent(rentTotal);
      const purchases = response.result.length ? JSON.parse(response.result[0].purchases)  : [];
      console.log(purchases);
      for (const purchase of purchases) {
        if (purchase.description.toLowerCase().indexOf('rent') !== -1) {
          setRentPurchase(purchase);
          break;
        }
      }
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

 

  useEffect(() => {
    const fetchApplications = async () => {
      const response = await get(
        `/applications?tenant_id=${profile.tenant_id}`
      );
      console.log(response);
      //.filter ==== status .map ===  property ids to fetch
      // const a  = [{name: 'asf', id: 'gfsg'}, ..];
     // const ids = a.filter((obj) => obj.status === 'forwarded').map(application => application.id); // ['gfsg', '...g]
      setApplications(response.result);
    };
    fetchApplications();
  });

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await get(
        `/properties/${applications[0].property_uid}`,
      );
      console.log(response);

      setProperties(response.result);
    };
    if(applications && applications.length){fetchProperties();}
  }, [applications]);

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
    navigate("/uploadTenantDocuments");
    // navigate("/tenantDocuments");
  };
  const goToSearchPM = () => {
    navigate("/tenantAvailableProperties");
  };

  const goToReviewPropertyLease = (application) => {
    navigate(`/reviewPropertyLease/${application.property_uid}`,{ state: {application_uid: application.application_uid}});
  };

  console.log(profile);
  return (
    <div className="h-100">
      <Header title="Home" />
      {isLoading === true || (!profile || profile.length)  === 0 ? null : (
        <Container className="pt-1 mb-4" style={{ minHeight: "100%" }}>
          <div style={welcome}>
              <Row style={headings}>
                  <div style={{fontSize:"30px"}}>Welcome {profile.tenant_first_name}!</div>
              </Row>
          </div>
          <div>
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
                
                <Col xs={3} style={actionsDisabled}>
                    <img
                        style={{ width: "50px", height: "50px", cursor: "pointer" }}
                        src={RepairRequest}
                    />
                    <div>Request Repair</div>
                </Col>
                <Col xs={3} style={actionsDisabled}>
                    <img
                        style={{ width: "50px", height: "50px", cursor: "pointer" }}
                        src={RepairStatus}
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
              <Row style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
                className="mt-1 mb-1"
              >
                <Col xs={3} style={actionsDisabled}>
                    <img
                        style={{ width: "50px", height: "50px", cursor: "pointer" }}
                        src={Announcements}
                    />
                    <div>
                        Resident <br />
                        Announcements
                    </div>
                </Col>
                <Col xs={3} style={actionsDisabled}>
                    <img
                        style={{ width: "50px", height: "50px", cursor: "pointer" }}
                        src={Emergency}
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
                        <div>Search Properties</div>
                    </div>
                </Col>
              </Row>
            </div>
            {/* ============================APPLICATION STATUS=========================== */}
              <div style={headings} className="mt-4 mb-1">
                  Application Status </div>
              <p>Your lease applications and their statuses </p>

              <div className='mb-4' style={{margin:"20px"}}>
                  {applications? (applications.map((application, i) => (
                        <div key={i} onClick={() => goToReviewPropertyLease(application)}>
                              <div className='d-flex justify-content-between align-items-end'>
                                        <div>
                                            <h6 style={mediumBold}>
                                              {application.property_uid}
                                            </h6>
                                            <h6 style={mediumBold}>
                                              {application.application_status}
                                            </h6>
                                        </div>
                                       
                              </div>
                              <hr style={{opacity: 1}}/>
                        </div>
                  )))
                :
                ""}
              </div>
        </Container>
    )}
      </div>  
    ) 
}  
  

export default TenantWelcomePage;
