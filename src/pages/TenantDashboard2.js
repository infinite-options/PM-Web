//I need to make this page the main page first
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as ReactBootStrap from "react-bootstrap";
import TopBar from "../components/tenantComponents/TopBar";
import SideBar from "../components/tenantComponents/SideBar";
import TenantCard from "../components/tenantComponents/TenantCard";
import { get } from "../utils/api";
import "./tenantDash.css";
import UpcomingPayments from "../components/tenantComponents/UpcomingPayments";
import PaymentHistory from "../components/tenantComponents/PaymentHistory";
import Maintenence from "../components/tenantComponents/Maintenence";
import Appliances from "../components/tenantComponents/Appliances";
import PersonalInfo from "../components/tenantComponents/PersonalInfo";
import AppContext from "../AppContext";
import loadinggif from "../icons/loading.gif";
//tenant get request: https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/tenantDashboard
export default function TenantDashboard2() {
  const [propertyData, setPropertyData] = React.useState([]);
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [maintenanceRequests, setMaintenanceRequests] = React.useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [p, setP] = React.useState([]);
  const fetchTenantDashboard = async () => {
    if (access_token === null || user.role.indexOf("TENANT") === -1) {
      navigate("/");
      return;
    }
    const response = await get("/tenantDashboard", access_token);
    console.log(response);
    setPropertyData(response);
    setP(response.result[0]);
    setIsLoading(false);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();

      return;
    }
  };
  const getMaintenanceRequests = () => {
    //process to get data from aateButtons(pi using axios
    axios
      .get(
        "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests"
      )
      .then((response) => {
        setMaintenanceRequests(response.data); //useState is getting the data
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchTenantDashboard();
    getMaintenanceRequests();
  }, []);
  const goToMaintenence = () => {
    navigate("/maintenencePage", {
      state: {
        property_uid: propertyData?.result[0].properties[0].property_uid,
        tenant_id: propertyData?.result[0].tenant_id,
      },
    });
  };
  // console.log(propertyData.result[0]);
  //END OF POSSIBLY IMPORTANT STUFF
  // console.log(p);
  // return null
  //PROBLEMS:
  //1.the if else statement does not seem to work because of undefined readings
  // console.log(p)
  console.log(isLoading);
  console.log(propertyData);
  console.log(p.properties);

  return (
    // p.length > 0?
    <div>
      {isLoading === true && (
        <div className="w-100 d-flex flex-column justify-content-center align-items-center">
          <ReactBootStrap.Spinner animation="border" role="status" />
        </div>
      )}
      {propertyData !== undefined && isLoading === false && (
        <div>
          {console.log("on line 80")}
          {propertyData !== undefined && p.properties?.length > 0 ? (
            <div>
              {propertyData?.length !== 0 && (
                <div>
                  <h3 style={{ paddingLeft: "7rem", paddingTop: "2rem" }}>
                    {propertyData.result[0].tenant_first_name}
                  </h3>
                  <h8 style={{ paddingLeft: "7rem", paddingTop: "2rem" }}>
                    Tenant
                  </h8>
                </div>
              )}
              <div className="flex-1">
                <div className="sidebar">
                  <SideBar
                    uid={propertyData.result[0].properties[0].property_uid}
                  />
                </div>
                <div className="main-content">
                  <br />
                  <div className="box1">
                    {propertyData.length !== 0 && (
                      <TenantCard
                        imgSrc={propertyData.result[0].properties[0]?.images}
                        leaseEnds={
                          propertyData.result[0].properties[0]?.active_date
                        }
                        address1={propertyData.result[0].properties[0]?.address}
                        city={propertyData.result[0].properties[0]?.city}
                        state={propertyData.result[0].properties[0]?.state}
                        zip={propertyData.result[0].properties[0]?.zip}
                        cost={propertyData.result[0].properties[0]?.listed_rent}
                        beds={propertyData.result[0].properties[0]?.num_beds}
                        bath={propertyData.result[0].properties[0]?.num_baths}
                        size={propertyData.result[0].properties[0]?.area}
                        property={
                          propertyData.result[0].properties[0]?.property_uid
                        }
                      />
                    )}
                    <button className="b yellow" onClick={goToMaintenence}>
                      Submit Maintenence Ticket
                    </button>
                    <button className="b">Contact Property Manager</button>
                  </div>
                  <div className="box2">
                    <div className="announcements">
                      Announcements
                      <h3 className="ann"></h3>
                    </div>

                    {propertyData.length !== 0 && (
                      <UpcomingPayments
                        data={
                          propertyData.result[0].properties[0]?.tenantExpenses
                        }
                        type={true}
                      />
                    )}
                    {propertyData.length !== 0 && (
                      <PaymentHistory
                        data={
                          propertyData.result[0].properties[0]?.tenantExpenses
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-2">
                {propertyData.length !== 0 && (
                  <Maintenence
                    data={maintenanceRequests.result}
                    address={propertyData.result[0].properties[0]?.address}
                  />
                )}
                {propertyData.length !== 0 && (
                  <div>
                    <Appliances
                      data={propertyData.result[0].properties[0]?.appliances}
                    />
                    <PersonalInfo id="profile" data={propertyData.result[0]} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              {/* {console.log(propertyData)}
          {console.log("not working correctly")} */}
              {navigate("/tenant_original")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
