import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../utils/api";
import AppContext from "../AppContext";
import SideBar from "./tenantComponents/SideBar";
import UpcomingPayments from "./tenantComponents/UpcomingPayments";
import PayPal from "./PayPal";
import Venmo from "./Venmo";
import "../pages/maintenance.css"
export default function TenantDuePayments(props) {
  const [propertyData, setPropertyData] = React.useState([]);
  const [tenantExpenses, setTenantExpenses] = React.useState([]);
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  // const {paypal, setPaypal} = React.useState(false)
  // const {zelle, setZelle} = React.useState(false)

  // const {ahc, setAhc} = React.useState(false)
  // const {apple, setApple} = React.useState(false)
  const [paymentOptions, setPaymentOptions] = React.useState([
    { name: "paypal", isActive: false },
    { name: "zelle", isActive: false },
    { name: "ahc", isActive: false },
    { name: "apple", isActive: false },
  ]);
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

    // const {ahc, setAhc} = React.useState(false)
    // const {apple, setApple} = React.useState(false)
    const [paymentOptions, setPaymentOptions] = React.useState([
        {name:"paypal", isActive: false},
        {name:"zelle", isActive: false},
        {name:"ahc", isActive: false},
        {name:"apple", isActive: false},
    ])
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
        setTenantExpenses(response.result[0].properties[0].tenantExpenses);


      return;
    }
    setPropertyData(response);
    setTenantExpenses(response.result[0].properties[0].tenantExpenses);
  };
  useEffect(() => {
    console.log("in use effect");
    fetchTenantDashboard();

    }, [paymentOptions]);
    const handlePaymentOption = (index)=>{
        console.log("payment choice called")
        let temp = paymentOptions.slice();
        for(var i = 0; i < temp.length; i ++){
            if(i==index){
                temp[index].isActive = !temp[index].isActive;
            }
            else{
                temp[i].isActive = false;
            }
        }

        setPaymentOptions(temp)
    }



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
                <h6 style={{paddingLeft: "7rem", paddingTop:"2rem"}}>Tenant</h6>
                </div>
            )}

            <div className="flex-1">
                <div className="sidebar">
                    <SideBar />
                </div>
                <div className="main-content2" >
                    <h2>Payment Portal</h2>
                    {/*<div id = "payment-options2">*/}
                    {/*    <button className="pay1"*/}
                    {/*        style={{backgroundColor: paymentOptions[0].isActive? "rgb(181, 180, 180)" : "white"}}*/}
                    {/*        onClick={()=>handlePaymentOption(0)}*/}

                    {/*    >*/}
                    {/*        Paypal*/}
                    {/*    </button>*/}
                    {/*    <button className="pay1"*/}
                    {/*        style={{backgroundColor: paymentOptions[1].isActive? "rgb(181, 180, 180)" : "white"}}*/}

                    {/*    onClick={()=>handlePaymentOption(1)}*/}
                    {/*    >*/}
                    {/*        Zelle*/}
                    {/*    </button>*/}
                    {/*    <button className="pay1"*/}
                    {/*    style={{backgroundColor: paymentOptions[2].isActive? "rgb(181, 180, 180)" : "white"}}*/}
                    {/*    onClick={()=>handlePaymentOption(2)}*/}
                    {/*    >*/}
                    {/*        ACH Bank*/}
                    {/*    </button>*/}
                    {/*    <button className="pay1"*/}
                    {/*    style={{backgroundColor: paymentOptions[3].isActive? "rgb(181, 180, 180)" : "white"}}*/}

                    {/*    onClick={()=>handlePaymentOption(3)}*/}
                    {/*    >*/}
                    {/*        Apple Pay*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                    {propertyData.length!==0 && <UpcomingPayments
                        data = {propertyData.result[0].properties[0].tenantExpenses}
                        type = {false}
                        selectedProperty = {propertyData.result[0].properties[0]}
                        paymentSelection = {paymentOptions}
                    />}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
