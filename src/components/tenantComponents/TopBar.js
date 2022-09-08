import React from "react"
//change tenant to role
export default function TopBar(props){
    return(
        <div className="top-bar">
            <div className="circle"></div>
            <div>
                <h4 className="header-name">{props.firstName} {props.lastName}</h4>
                <h5>Tenant</h5>
            </div>
             
        </div>
    )
}