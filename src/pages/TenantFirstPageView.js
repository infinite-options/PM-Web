import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppContext from "../AppContext";
import { get } from "../utils/api";
import TenantCard from "../components/tenantComponents/TenantCard";

export default function TenantFirstPageView(){

    const [propertyData, setPropertyData] = React.useState([]);
    const navigate = useNavigate();
    const { userData, refresh } = useContext(AppContext);
    const { access_token, user } = userData;
    const [maintenanceRequests, setMaintenanceRequests] = React.useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [p, setP] = React.useState([]);
    const [lookingAt, setLookingAt] = React.useState(0)
    const [propertyClicked, setPropertyClicked] = React.useState(false);
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
        setIsLoading(false);
        
        
        
      };
      useEffect(() => {
        fetchTenantDashboard();
      }, []);
    const rentedProperties = p.properties?.map((property)=>{
        return(
            <TenantCard
                    imgSrc={property.images}
                    leaseEnds={property.active_date}
                    address1={property.address}
                    city={property.city}
                    state={property.state}
                    zip={property.zip}
                    cost={property.listed_rent}
                    beds={property.num_beds}
                    bath={property.num_baths}
                    size={property.area}
                    property={property.property_uid}
                    data = {p}
                    type = {2}
                    lookingAt = {lookingAt}
            />
        )
    })
    return (
        <div>
            <div >
                <h1>Properties Rented</h1>
                <div className="first-page-card-organization">
                    {rentedProperties}
                </div>
            </div>
                
            <div>
                <h1>Lease Received</h1>
                <h3>Not sure what to do here for now</h3>
            </div>
            <div>
                <h1>Application Submitted</h1>
                
            </div>
            <div>
                <h1>Terminated Leases</h1>
                
            </div>
        </div>
    )
}