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
import AppContext from "../AppContext";
//tenant get request: https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/tenantProfileInfo
export default function TenantDashboard2(){

    const [tenantData, setTenantData] = React.useState([]) 
    const [propertyData, setPropertyData] = React.useState([])
    const getProfileFromApi = () => { //process to get data from aateButtons(pi using axios
        axios.get('https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/tenantProfileInfo?',{
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY2MjYwODg4MywianRpIjoiZTk4YThmNmEtNjUxMC00Y2IyLWJkM2EtNzQ3ZmUxNDIxNDJlIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJ1c2VyX3VpZCI6IjEwMC0wMDAwMTgiLCJmaXJzdF9uYW1lIjoiVmloYSIsImxhc3RfbmFtZSI6IlNoYWgiLCJwaG9uZV9udW1iZXIiOiI0MDg3Njc4MTU3IiwiZW1haWwiOiJ2aWhhLnNoYWhAc2pzdS5lZHUiLCJyb2xlIjoiVEVOQU5ULE9XTkVSIiwiZ29vZ2xlX2F1dGhfdG9rZW4iOiJ5YTI5LmEwQVZBOXkxdGxDd2RzZEwtTVg1SnFaN3l1Xy1MY2phZXFLZm5aNlE0SGZvY0cwaHMzQ3d2RVhmaFowUUxQcGs2RzN5STN6U3o1bUNaMGJqMHhvaEcxNDBDZHgzY1BBZzlsQ08xQ2NVUXRqZ3pER1NvM3dqdE1pRDMwRUllVjF5LWVISU85TUdEcnlzaWVfVDZpaXBHSTE2ODRoOS1JYUNnWUtBVEFTQVFBU0ZRRTY1ZHI4enA2NHVpS3kzMFI0UVptOW52TDBMQTAxNjMiLCJidXNpbmVzc2VzIjpbXX0sIm5iZiI6MTY2MjYwODg4MywiZXhwIjoxNjYyNjEyNDgzfQ.PehfaVCiNWlYNDy9fjn7MJc9Rqb9ajlCr2S2YpzHIa4'
            }
        })
        .then(response => {
          setTenantData(response.data) //useState is getting the data
          
    
        }).catch(err =>{
          console.log(err)
        })
    
    }
    const getPropertiesFromApi = () => { //process to get data from aateButtons(pi using axios
        axios.get('https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/tenantProperties?',{
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY2MjYwODg4MywianRpIjoiZTk4YThmNmEtNjUxMC00Y2IyLWJkM2EtNzQ3ZmUxNDIxNDJlIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJ1c2VyX3VpZCI6IjEwMC0wMDAwMTgiLCJmaXJzdF9uYW1lIjoiVmloYSIsImxhc3RfbmFtZSI6IlNoYWgiLCJwaG9uZV9udW1iZXIiOiI0MDg3Njc4MTU3IiwiZW1haWwiOiJ2aWhhLnNoYWhAc2pzdS5lZHUiLCJyb2xlIjoiVEVOQU5ULE9XTkVSIiwiZ29vZ2xlX2F1dGhfdG9rZW4iOiJ5YTI5LmEwQVZBOXkxdGxDd2RzZEwtTVg1SnFaN3l1Xy1MY2phZXFLZm5aNlE0SGZvY0cwaHMzQ3d2RVhmaFowUUxQcGs2RzN5STN6U3o1bUNaMGJqMHhvaEcxNDBDZHgzY1BBZzlsQ08xQ2NVUXRqZ3pER1NvM3dqdE1pRDMwRUllVjF5LWVISU85TUdEcnlzaWVfVDZpaXBHSTE2ODRoOS1JYUNnWUtBVEFTQVFBU0ZRRTY1ZHI4enA2NHVpS3kzMFI0UVptOW52TDBMQTAxNjMiLCJidXNpbmVzc2VzIjpbXX0sIm5iZiI6MTY2MjYwODg4MywiZXhwIjoxNjYyNjEyNDgzfQ.PehfaVCiNWlYNDy9fjn7MJc9Rqb9ajlCr2S2YpzHIa4'
            }
        })
        .then(response => {
            setPropertyData(response.data) //useState is getting the data
          
    
        }).catch(err =>{
          console.log(err)
        })
    
    }
    React.useEffect(()=>{ //gets the data from api only once. 
        getProfileFromApi();
        getPropertiesFromApi();
    },[]) //empty brackets prevents stuff from refreshing
    // console.log(tenantData.result)
    console.log(tenantData)
    console.log(propertyData)
    //THIS ENTIRE SECTION MAKES IT SO THAT SOMEONE NAMED VIHA WHO IS A TENANT CAN ONLY ACCESS THE TENANTS INFORMATION
    // const navigate = useNavigate();
    // const { userData, refresh } = useContext(AppContext);
    // const { access_token, user } = userData;
    // const [profile, setProfile] = useState([]);
    // const [properties, setProperties] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);
    // const fetchProfile = async () => {
    //     // const response = await get("/tenantProperties", access_token);
    //     if (access_token === null || user.role.indexOf("TENANT") === -1) {
    //       navigate("/");
    //       return;
    //     }
    //     const response = await get("/tenantProfileInfo", access_token);
    //     console.log("first");
    //     console.log(response);
    
    //     if (response.msg === "Token has expired") {
    //       console.log("here msg");
    //       refresh();
    
    //       return;
    //     }
    //     //Extracts user profile
    //     setProfile(response.result[0]);
    //   };
    
    //   /*
    //    * Fetches tenant properties based on user access_token
    //    */
    //   const fetchUserProperties = async () => {
    //     if (access_token === null || user.role.indexOf("TENANT") === -1) {
    //       navigate("/");
    //       return;
    //     }
    //     const response = await get("/tenantProperties", access_token);
    //     console.log("second");
    //     console.log(response);
    //     setIsLoading(false);
    
    //     if (response.msg === "Token has expired") {
    //       console.log("here msg");
    //       refresh();
    
    //       return;
    //     }
    //     setProperties(response.result[0]);
    //   };
    //   useEffect(() => {
    //     if (access_token === null) {
    //       navigate("/");
    //     }
    //     fetchProfile();
    //     fetchUserProperties();
    //   }, []);
    // console.log("profile: " + profile)
    // console.log("properties: " + properties)
    //END OF POSSIBLY IMPORTANT STUFF
    return(
        <div>
            
            {tenantData.length !== 0 && <TopBar 
                firstName={tenantData.result[0].tenant_first_name}
                lastName={tenantData.result[0].tenant_last_name}
            />}
             <SideBar/>
            {propertyData.length !== 0 && <TenantCard 
                imgSrc = {propertyData.result[0].images}
                leaseEnds = {propertyData.result[0].active_date}
                address1 = {propertyData.result[0].address}
                city = {propertyData.result[0].city}
                state = {propertyData.result[0].state}
                zip = {propertyData.result[0].zip}
                cost = {propertyData.result[0].listed_rent}
                beds = {propertyData.result[0].num_beds}
                bath = {propertyData.result[0].num_baths}
                size = {propertyData.result[0].area}

            />}
            {/* <div className="announcements">
                <h2>Announcements</h2>
                <h3>Tenant must evacuate within 3 months</h3>
            </div> */}
            {propertyData.length !== 0 && <UpcomingPayments
                data = {propertyData.result[0].rent_payments}
            />}

        </div>
    )
}