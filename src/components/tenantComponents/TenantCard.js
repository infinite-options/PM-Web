import React from "react"

export default function TenantCard(props){
    const imgS = JSON.parse(props.imgSrc)
    
    return(
        <div className="tenantCard">
            <img src = {imgS[2]}></img>
            <h3>Lease Ends: {props.leaseEnds}</h3>
            <h4><strong>{props.address1}</strong></h4>
            <h4>{props.city}, {props.state}</h4>
            <h4>{props.cost} / mon</h4>
            <div>
                Some complex bed bath info
            </div>
        </div>
    )
}