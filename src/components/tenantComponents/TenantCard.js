import React from "react"
import { useNavigate } from "react-router-dom";

export default function TenantCard(props){
    const imgS = JSON.parse(props.imgSrc)
    const navigate = useNavigate();

    const goToPropertyLeaseInfo = () => {
        console.log("card clicked");
        navigate(`/reviewPropertyLease/${props.property_uid}`, {
          state: {
            property_uid: props.property_uid,
          },
        });
      };
    return(
        // <div className="tenantCard">
        <div className="tenantCard">
            <div className="card-spacing">
                <img className="tenantImg" onClick={goToPropertyLeaseInfo} src ={imgS[0]} ></img>
                <h3 id="lease-ends" className="green-text">Lease Ends: {props.leaseEnds}</h3>
                <h4 className="add1 card-text"><strong>{props.address1}</strong></h4>
                <h4 className = "add1 card-text">{props.city}, {props.state}</h4>
                <h4 className="add1 blue-text card-text cost-text">${props.cost} / mo</h4>
            </div>
            <div>
            <table className="card-table">
                <thead>
                    <tr className="table-row blue-text">
                       <th className="table-col small">Bed</th>
                       <th className="table-col small">Bath</th>
                       <th className="table-col small">Area</th>
                       <th className="table-col small">Floors</th>
                    </tr>
                   
                </thead>
                <tbody>
                    <tr className="table-row blue-text">
                        <td className="table-col small">{props.beds}</td>
                        <td className="table-col small">{props.bath}</td>
                        <td className="table-col small">{props.size}</td>
                        <td className="table-col small">1</td>
                    </tr>
                </tbody>
            </table>

            </div>
        </div>
    )
}