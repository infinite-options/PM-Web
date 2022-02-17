import React, { useState, useContext, useEffect } from "react";
import Footer from "../components/Footer";
import AppContext from "../AppContext";
import TenantDashboard from "./TenantDashboard";
import TenantProfile from "./TenantProfile";
import TenantAvailableProperties from "./TenantAvailableProperties";
import { get } from "../utils/api";
import TenantWelcomePage from "./TenantWelcomePage";

function TenantHome() {
  const { userData, refresh } = React.useContext(AppContext);
  const [footerTab, setFooterTab] = React.useState("DASHBOARD");
  const [showFooter, setShowFooter] = React.useState(true);
  const [profile, setProfile] = useState([]);
  const [properties, setProperties] = useState([]);
  const { access_token } = userData;
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    const fetchProfile = async () => {
      // const response = await get("/tenantProperties", access_token);
      const response = await get("/tenantProfileInfo", access_token);

      console.log(response);

      if (response.msg === "Token has expired") {
        console.log("here msg");
        refresh();

        return;
      }
      setProfile(response.result[0]);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchUserProperties = async () => {
       const response = await get("/tenantProperties", access_token);

      console.log(response);
      setIsLoading(false);

      if (response.msg === "Token has expired") {
        console.log("here msg");
        refresh();

        return;
      }
      setProperties(response.result[0]);
    };
    fetchUserProperties();
  }, []);

  return (
    <div className="d-flex flex-column h-100">
    {isLoading === false ?
      (<div>
          <div className="flex-grow-1">
            {footerTab === "DASHBOARD" &&  (
            properties  ? (
            <TenantDashboard setShowFooter={setShowFooter} profile={profile} setProfile={setProfile}/>
          ) : (
            // <TenantAvailableProperties hideBackButton="true"/>
             <TenantWelcomePage setShowFooter={setShowFooter} profile={profile} setProfile={setProfile} />
          ))}
          </div>
          <div className="flex-grow-1">
            {footerTab === "PROFILE" ? (
              <TenantProfile setShowFooter={setShowFooter} setTab={setFooterTab} />
            ) : (
              ""
            )}
          </div>
          {showFooter ? <Footer tab={footerTab} setTab={setFooterTab} /> : ""}
      </div>) : ("") }
    </div>
  );
}

export default TenantHome;
