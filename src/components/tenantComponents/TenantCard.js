import React from "react"

export default function TenantCard(props){
    const imgS = JSON.parse(props.imgSrc)
    
    return(
        <div className="tenantCard">
            <img className="tenantImg" src ={imgS[0]}></img>
            <h3 id="lease-ends">Lease Ends: {props.leaseEnds}</h3>
            <h4 className="add1"><strong>{props.address1}</strong></h4>
            <h4 className = "add1">{props.city}, {props.state}</h4>
            <h4 className="add1 blue-text">${props.cost} / mo</h4>
            <div>
            <table className="card-table">
                <thead>
                    <tr className="table-row blue-text">
                       <th  className="table-col">Bed</th>
                       <th className="table-col">Bath</th>
                       <th className="table-col">Area</th>
                       <th className="table-col">Floors</th>
                    </tr>
                   
                </thead>
                <tbody>
                    <tr className="table-row blue-text">
                        <td className="table-col">{props.beds}</td>
                        <td className="table-col">{props.bath}</td>
                        <td className="table-col">{props.size}</td>
                        <td className="table-col">1</td>
                    </tr>
                </tbody>
            </table>

            </div>
        </div>
    )
}