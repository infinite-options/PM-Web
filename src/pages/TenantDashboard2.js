//I need to make this page the main page first
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
import Carousel from "react-elastic-carousel";
import ReviewPropertyLease from "./reviewPropertyLease";
import { propTypes } from "react-bootstrap/esm/Image";
//dont have documents added page
import { Element } from "react-scroll";
//tenant get request: https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/tenantDashboard
export default function TenantDashboard2() {
  const [propertyData, setPropertyData] = React.useState([]);
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [maintenanceRequests, setMaintenanceRequests] = React.useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [p, setP] = React.useState([]);
  const location = useLocation();
  const [lookingAt, setLookingAt] = React.useState(location.state.lookingAt);
  console.log(lookingAt);
  const [propertyClicked, setPropertyClicked] = React.useState(false);
  const [applications, setApplications] = useState([]);
  const [appUid, setAppUid] = useState("");
  const [appstat1, setAppstat1] = useState("");

  const [msg, setMsg] = useState("");

  const fetchTenantDashboard = async () => {
    if (access_token === null || user.role.indexOf("TENANT") === -1) {
      navigate("/");
      return;
    }
    const response = await get("/tenantDashboard", access_token);
    console.log(response);
    console.log("message response: " + response.msg);
    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();
      console.log("After refresh response: " + response);
      return;
    }

    setPropertyData(response);
    console.log("Received Property Data" + propertyData);
    setP(response.result[0]);
    console.log("Result from property data" + p);

    console.log(p.tenant_id);
    const response2 = await get(
      `/applications?tenant_id=${response.result[0].tenant_id}`
    );
    console.log("applications: ", response2);
    const appArray = response2.result || [];
    appArray.forEach((app) => {
      app.images = app.images ? JSON.parse(app.images) : [];
    });
    setApplications(appArray);
    console.log("applications", appArray);
    console.log(
      "applications array in the go to proprty lease function: " + applications
    );
    console.log(applications);
    for (var i = 0; i < appArray.length; i++) {
      console.log("insdie go to property lease info for loop");
      if (
        appArray[i].address ===
        response.result[0]?.properties[lookingAt]?.address
      ) {
        // we know which card we are in
        setAppUid(appArray[i].application_uid);
        console.log(appUid);
        // appstat1 = applications[i].application_status;
        setAppstat1(appArray[i].application_status);
        // msg = applications[i].message;
        setMsg(appArray[i].message);
      }
    }
    setIsLoading(false);
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
    console.log("dashboard data fetched");
    console.log(p);
    getMaintenanceRequests();
    console.log("maintenance data fetched");
    fetchApplications();
    console.log("applications data fetched");
    console.log(applications);
    console.log("end of use effect");
    // goToPropertyLeaseInfo();
    // console.log("lease info data fetched");
  }, []);
  const goToMaintenence = () => {
    navigate("/maintenencePage", {
      state: {
        property_uid:
          propertyData?.result[0].properties[lookingAt].property_uid,
        tenant_id: propertyData?.result[0].tenant_id,
      },
    });
  };
  const nextSlide = () => {
    if (lookingAt === p.properties.length - 1) {
      setLookingAt(0);
    } else {
      setLookingAt(lookingAt + 1);
    }
  };
  const prevSlide = () => {
    if (lookingAt === 0) {
      setLookingAt(p.properties.length - 1);
    } else {
      setLookingAt(lookingAt - 1);
    }
  };
  const goToAnnouncements = () => {
    navigate("/residentAnnouncements");
  };
  const fetchApplications = async () => {
    // console.log("profile", profile);
    // console.log("user", user);
    // const response = await get(`/applications?tenant_id=${profile.tenant_id}`);
    // console.log(p.tenant_id);
    // const response = await get(`/applications?tenant_id=${p.tenant_id}`);
    // console.log("applications: ", response);
    // const appArray = response.result || [];
    // appArray.forEach((app) => {
    //   app.images = app.images ? JSON.parse(app.images) : [];
    // });
    // setApplications(appArray);
    // console.log("applications", appArray);
    // console.log("applications array in the go to proprty lease function: " + applications)
    // console.log(applications);
    // for(var i = 0; i < appArray.length; i  ++){
    //     console.log("insdie go to property lease info for loop");
    //     if(appArray[i].address === propertyData.result[0].properties[lookingAt].address){ // we know which card we are in
    //         setAppUid(appArray[i].application_uid);
    //         console.log(appUid);
    //         // appstat1 = applications[i].application_status;
    //         setAppstat1(appArray[i].application_status);
    //         // msg = applications[i].message;
    //         setMsg(appArray[i].message);
    //     }
  };

  // console.log(propertyData.result[0]);
  //END OF POSSIBLY IMPORTANT STUFF
  // console.log(p);
  // return null
  //PROBLEMS:
  //1.the if else statement does not seem to work because of undefined readings
  // console.log(p)

  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 1 },
    { width: 768, itemsToShow: 1 },
    { width: 1200, itemsToShow: 1 },
  ];
  console.log("Loading: " + isLoading);
  console.log("properties " + p.properties);

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
          {propertyData !== undefined && p.properties?.length > 0 ? (
            <div>
              {/* {propertyData?.length !== 0 && (
          <div>
            <h3 style={{paddingLeft: "7rem", paddingTop:"2rem"}}>{propertyData.result[0].tenant_first_name}</h3> 
            <h8 style={{paddingLeft: "7rem", paddingTop:"2rem"}}>Tenant</h8>
          </div>
        )} */}
              <div className="flex-1">
                <div>
                  <SideBar
                    uid={
                      propertyData.result[0].properties[lookingAt].property_uid
                    }
                  />
                </div>

                <div className="main-content" style={{ marginTop: "1rem" }}>
                  <br />
                  <div className="box1">
                    <div className="tenantCard-witharrows-container">
                      <div onClick={prevSlide} className="left-arrow2">
                        {"<"}
                      </div>
                      {propertyData.length !== 0 && (
                        <TenantCard
                          imgSrc={
                            propertyData.result[0].properties[lookingAt]?.images
                          }
                          leaseEnds={
                            propertyData.result[0].properties[lookingAt]
                              ?.active_date
                          }
                          address1={
                            propertyData.result[0].properties[lookingAt]
                              ?.address
                          }
                          city={
                            propertyData.result[0].properties[lookingAt]?.city
                          }
                          state={
                            propertyData.result[0].properties[lookingAt]?.state
                          }
                          zip={
                            propertyData.result[0].properties[lookingAt]?.zip
                          }
                          cost={
                            propertyData.result[0].properties[lookingAt]
                              ?.listed_rent
                          }
                          beds={
                            propertyData.result[0].properties[lookingAt]
                              ?.num_beds
                          }
                          bath={
                            propertyData.result[0].properties[lookingAt]
                              ?.num_baths
                          }
                          size={
                            propertyData.result[0].properties[lookingAt]?.area
                          }
                          property={
                            propertyData.result[0].properties[lookingAt]
                              ?.property_uid
                          }
                          data={p}
                          type={1}
                          lookingAt={lookingAt}
                        />
                      )}
                      <div onClick={nextSlide} className="right-arrow2">
                        {">"}
                      </div>
                    </div>

                    <button className="b yellow" onClick={goToMaintenence}>
                      Submit Maintenence Ticket
                    </button>
                    <button className="b">Contact Property Manager</button>
                  </div>
                  <div className="box2">
                    <div className="announcements" onClick={goToAnnouncements}>
                      Announcements
                      <h3 className="ann"></h3>
                    </div>
                    <div id="scroll-to-expenses">
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
                            propertyData.result[0].properties[lookingAt]
                              ?.tenantExpenses
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-2">
                {/* <Element id="scroll-to-maintenance" name="scroll-to-maintenance"> 
          {propertyData.length !== 0 && <Maintenence 
                                          data={maintenanceRequests.result}
                                          address = {propertyData.result[0].properties[lookingAt]?.address} 
                                          propertyId = {propertyData.result[0].properties[lookingAt]?.property_uid}
                                          />
                                          }
          
          </Element> */}
                <div id="scroll-to-maintenance">
                  {propertyData.length !== 0 && (
                    <Maintenence
                      data={maintenanceRequests.result}
                      address={
                        propertyData.result[0].properties[lookingAt]?.address
                      }
                      propertyId={
                        propertyData.result[0].properties[lookingAt]
                          ?.property_uid
                      }
                    />
                  )}
                </div>

                {propertyData.length !== 0 && (
                  <div>
                    <Appliances
                      data={
                        propertyData.result[0].properties[lookingAt]?.appliances
                      }
                    />
                    <div id="scroll-to-profile">
                      <PersonalInfo
                        id="profile"
                        data={propertyData.result[0]}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div id="scroll-to-lease">
                <ReviewPropertyLease
                  application_uid={appUid}
                  application_status_1={appstat1}
                  message={msg}
                  property_uid={
                    propertyData.result[0].properties[lookingAt]?.property_uid
                  }
                />
                {console.log(
                  "prop uid: " +
                    propertyData.result[0].properties[lookingAt]?.property_uid
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
