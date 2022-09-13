import React from "react"

export default function TenantCard(props){
    const imgS = JSON.parse(props.imgSrc)
    
    return(
        <div className="tenantCard">
            <div className="card-spacing">
                <img className="tenantImg" src ={imgS[0]}></img>
                <h3 id="lease-ends" className="green-text">Lease Ends: {props.leaseEnds}</h3>
                <h4 className="add1 card-text"><strong>{props.address1}</strong></h4>
                <h4 className = "add1 card-text">{props.city}, {props.state}</h4>
                <h4 className="add1 blue-text card-text cost-text">${props.cost} / mo</h4>
            </div>
            <div>
            <table className="card-table">
                <thead>
                    <tr className="table-row blue-text">
                       <th className="table-col">Bed</th>
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