import React from "react"
//change tenant to role
export default function TopBar(props){
    console.log(props.firstName);
    return(
        <div className="top-bar">
            <div className="circle"></div>
            <div>
                <h4 className="header-name">{props.firstName} {props.lastName}</h4>
                <h5 className="text-size">Tenant</h5>
            </div>
             
        </div>
    )
}