//I need to make this page the main page first
import React, { useState, useContext, useEffect } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import TopBar from "../components/tenantComponents/TopBar"
import SideBar from "../components/tenantComponents/SideBar"
import TenantCard from "../components/tenantComponents/TenantCard"
import { get } from "../utils/api";
import "./tenantDash.css"
import UpcomingPayments from "../components/tenantComponents/UpcomingPayments"
import PaymentHistory from "../components/tenantComponents/PaymentHistory"
import Maintenence from "../components/tenantComponents/Maintenence"
import Appliances from "../components/tenantComponents/Appliances"
import AppContext from "../AppContext";
//tenant get request: https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/tenantDashboard
export default function TenantDashboard2(){

    const [propertyData, setPropertyData] = React.useState([])
    const navigate = useNavigate();
    const { userData, refresh } = useContext(AppContext);
    const { access_token, user } = userData;
    
    const [isLoading, setIsLoading] = useState(true);
    
      const fetchTenantDashboard = async () => {
        if (access_token === null || user.role.indexOf("TENANT") === -1) {
          navigate("/");
          return;
        }
        const response = await get("/tenantDashboard", access_token);
        console.log("second");
        console.log(response);
        setIsLoading(false);
    
        if (response.msg === "Token has expired") {
          console.log("here msg");
          refresh();
    
          return;
        }
        setPropertyData(response);
      };
    useEffect(() => {
        console.log("in use effect");
        fetchTenantDashboard();
    }, []);
    console.log(propertyData)
    console.log(access_token)
    //END OF POSSIBLY IMPORTANT STUFF
    return(
        <div>
            
            {propertyData.length !== 0 && <TopBar 
                firstName={propertyData.result[0].tenant_first_name}
                lastName={propertyData.result[0].tenant_last_name}
            />}
             <SideBar/>
            {propertyData.length !== 0 && <TenantCard 
                imgSrc = {propertyData.result[0].properties[0].images}
                leaseEnds = {propertyData.result[0].properties[0].active_date}
                address1 = {propertyData.result[0].properties[0].address}
                city = {propertyData.result[0].properties[0].city}
                state = {propertyData.result[0].properties[0].state}
                zip = {propertyData.result[0].properties[0].zip}
                cost = {propertyData.result[0].properties[0].listed_rent}
                beds = {propertyData.result[0].properties[0].num_beds}
                bath = {propertyData.result[0].properties[0].num_baths}
                size = {propertyData.result[0].properties[0].area}

            />}
            {/* <div className="announcements">
                <h2>Announcements</h2>
                <h3>Tenant must evacuate within 3 months</h3>
            </div> */}
             {propertyData.length !== 0 && <UpcomingPayments
                 data = {propertyData.result[0].properties[0].tenantExpenses}
             /> }
             {propertyData.length !== 0 && <PaymentHistory
                data = {null}
             /> }
             {propertyData.length !== 0 && <Maintenence
                data = {null}
             /> }
             {propertyData.length !== 0 && <Appliances
                data = {propertyData.result[0].properties[0].appliances}
             /> }

    </div>
    )
}