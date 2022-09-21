import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../utils/api";
import AppContext from "../AppContext";
import SideBar from "./tenantComponents/SideBar";
export default function TenantDuePayments() {

    const [propertyData, setPropertyData] = React.useState([]);
    const [tenantExpenses, setTenantExpenses] = React.useState([]);
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
    
    
    
    
    return(
        <div className="tenant-payment-page">
            {propertyData.length !== 0 && (
                // <TopBar
                //   firstName={propertyData.result[0].tenant_first_name}
                //   lastName={propertyData.result[0].tenant_last_name}
                // />
                // <div className="topBar">
                //   <div className="circle"></div>
                //   <div>
                //     <h1>{propertyData.result[0].tenant_first_name}</h1>
                //     <h2>Tenant</h2>
                //   </div>
                // </div>
                <div>
                <h3 style={{paddingLeft: "7rem", paddingTop:"2rem"}}>{propertyData.result[0].tenant_first_name}</h3> 
                <h8 style={{paddingLeft: "7rem", paddingTop:"2rem"}}>Tenant</h8>
                </div>
            )}
        
            <div className="flex-1">
                <div className="sidebar">
                    <SideBar />
                </div>
                <div className="main-content2">
                    <h2>Payment Portal</h2>
                    <div>
                        <button>
                            Paypal
                        </button>
                        <button>
                            Zelle
                        </button>
                        <button>
                            ACH Bank
                        </button>
                        <button>
                            Apple Pay
                        </button>
                    </div>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}