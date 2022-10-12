import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../../utils/api";

export default function SubmitAppTenantCard(props){
    
    const navigate = useNavigate();
    

    //need profile and user information first

    const goToActualDashboard=()=>{
        console.log("going to another page with property information and another renter lease info");
        // navigate('/tenant_dash', {
        //     state:{
        //         lookingAt: props.lookingAt,
        //     },
        // })
        
        // console.log(props.data.properties);
        // navigate('/applied_dashboard',{
        //     state:{
        //         lookingAt: props.lookingAt,
        //         // propertyId: props.property,
        //     },
        // })
        console.log("property data information" + props.data)
        navigate('/propertyInfo',{
            state:{
                property: props.data,
                type : 2,
                application_uid : props.application_uid,
                application_status_1: props.application_status_1,
                message: props.message,
                property_uid: props.property_uid,

            }
        });
    }
    //nothing happens on click on this card?

    return(
        // <div className="tenantCard">
        <div className="tenantCard3">
            <div className="card-spacing">
               
                {props.type == 3 && <img className="tenantImg3" onClick={goToActualDashboard} src ={props.imgSrc}/>}
                {/* {props.type == 1 && <div> 
                <h3 id="lease-ends" className="green-text">Lease Ends: {props.leaseEnds}</h3>
                <h4 className="add1 card-text"><strong>{props.address1}</strong></h4>
                <h4 className = "add1 card-text">{props.city}, {props.state}</h4>
                <h4 className="add1 blue-text card-text cost-text">${props.cost} / mo</h4>
                
                </div>} */}
                
            </div>
            <div>
                <div>
                    <h3 id="lease-ends" className="green-text">Lease Ends: {props.leaseEnds}</h3>
                    <h4 className="add1 card-text"><strong>{props.address1}</strong></h4>
                    <h4>Application Status: <h4 className="in-green">{props.application_type}</h4></h4>
                </div>
            </div>
        </div>
    )
}