import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppContext from "../AppContext";
import { get } from "../utils/api";
import TenantCard from "../components/tenantComponents/TenantCard";
import SubmitAppTenantCard from "../components/tenantComponents/SubmitAppTenantCard";
export default function TenantFirstPageView(){

    const [propertyData, setPropertyData] = React.useState([]);
    const navigate = useNavigate();
    const { userData, refresh } = useContext(AppContext);
    const { access_token, user } = userData;
    const [isLoading, setIsLoading] = useState(true);
    const [p, setP] = React.useState([]);
    const [lookingAt, setLookingAt] = React.useState(0)
    // const [propertyClicked, setPropertyClicked] = React.useState(false);
    const [applications, setApplications] = React.useState([]);
    const fetchTenantDashboard = async () => {
        if (access_token === null || user.role.indexOf("TENANT") === -1) {
          navigate("/");
          return;
        }
        const response = await get("/tenantDashboard", access_token);
        console.log("dashboard response: " + response);
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
        
        const response2 = await get(`/applications?tenant_id=${response.result[0].tenant_id}`);
        console.log("applications: ", response2);
        const appArray = response2.result || [];
        appArray.forEach((app) => {
          app.images = app.images ? JSON.parse(app.images) : [];
        });
        setApplications(appArray);
        console.log("applications", appArray);
        setIsLoading(false);
        
        
        
      };
      const fetchApplications = async () => {
        // console.log("profile", profile);
        // console.log("user", user);
        // const response = await get(`/applications?tenant_id=${profile.tenant_id}`);
        
    };
      useEffect(() => {
        
        fetchTenantDashboard();
        fetchApplications();
        // console.log("tenant id " + p.tenant_id);
      }, []);
    console.log(applications);
    const rentedProperties = p.properties?.map((property,i)=>{
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
                    lookingAt = {i}
                    application_type = {"RENTED"}
            />
        )
    })
  
    const applicationList = applications?.map((app,i)=>{
        console.log("Inside application list");
        if(app.application_status === "NEW"){
            console.log(app.images);

            return(
                // <div> Inside Return Statement {i}</div>
                <SubmitAppTenantCard 

                        imgSrc={app.images[0]}
                        leaseEnds={app.active_date}
                        address1={app.address}
                        city={app.city}
                        state={app.state}
                        zip={app.zip}
                        cost={app.listed_rent}
                        beds={app.num_beds}
                        bath={app.num_baths}
                        size={app.area}
                        property={app.property_uid}
                        data = {p}
                        type = {3}
                        lookingAt = {i}
                        application_type = {"NEW"}
                />
            )
        }
        
    })
    const leaseReceived = applications?.map((app,i)=>{
        console.log("Inside application list");
        if(app.application_status === "FORWARDED"){
            console.log(app.images);

            return(
                // <div> Inside Return Statement {i}</div>
                <SubmitAppTenantCard 

                        imgSrc={app.images[0]}
                        leaseEnds={app.active_date}
                        address1={app.address}
                        city={app.city}
                        state={app.state}
                        zip={app.zip}
                        cost={app.listed_rent}
                        beds={app.num_beds}
                        bath={app.num_baths}
                        size={app.area}
                        property={app.property_uid}
                        data = {p}
                        type = {3}
                        lookingAt = {i}
                        application_type = {"FORWARDED"}
                />
            )
        }
        
    })
    //application_status has to be "FORWARDED" for lease received
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
                <div className="first-page-card-organization">
                    {leaseReceived}
                </div>
            </div>
            <div>
                <h1>Application Submitted</h1>
                <div className="first-page-card-organization">
                    {applicationList}
                </div>
                
            </div>
            <div>
                <h1>Terminated Leases</h1>
                
            </div>
        </div>
    )
}