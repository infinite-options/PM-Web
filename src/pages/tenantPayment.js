// import TopBar from "../components/tenantComponents/TopBar"
// import SideBar from "../components/tenantComponents/SideBar"
// import React, { useState, useContext, useEffect } from "react";
// import axios from "axios"
// import { useNavigate } from "react-router-dom";
// import { get } from "../utils/api";

export default function tenantPayment(){
    // const [propertyData, setPropertyData] = React.useState([])
    // const navigate = useNavigate();
    // const { userData, refresh } = useContext(AppContext);
    // const { access_token, user } = userData;
    
    // const [isLoading, setIsLoading] = useState(true);
    
    //   const fetchTenantDashboard = async () => {
    //     if (access_token === null || user.role.indexOf("TENANT") === -1) {
    //       navigate("/");
    //       return;
    //     }
    //     const response = await get("/tenantDashboard", access_token);
    //     console.log("second");
    //     console.log(response);
    //     setIsLoading(false);
    
    //     if (response.msg === "Token has expired") {
    //       console.log("here msg");
    //       refresh();
    
    //       return;
    //     }
    //     setPropertyData(response);
    //   };
    // useEffect(() => {
    //     console.log("in use effect");
    //     fetchTenantDashboard();
    // }, []);
    console.log("inside tenant payment")
    return(
        <div className="payment-info">
            {/* {propertyData.length !== 0 && <TopBar 
                firstName={propertyData.result[0].tenant_first_name}
                lastName={propertyData.result[0].tenant_last_name}
                
            />}
            <SideBar/> */}
            hello it is i 
        </div>
    )
}