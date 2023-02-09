import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../../utils/api";

export default function TenantCard(props) {
  const imgS = JSON.parse(props.imgSrc);

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);

  const goToActualDashboard = () => {
    navigate("/tenant_dash", {
      state: {
        lookingAt: props.lookingAt,
      },
    });
  };
  return (
    // <div className="tenantCard">
    <div className={props.type === 1 ? "tenantCard" : "tenantCard2"}>
      <div className={props.type === 1 ? "card-spacing" : "card-spacing2"}>
        {props.type === 1 && (
          <img className="tenantImg" alt="property image" src={imgS[0]}></img>
        )}
        {props.type === 2 && (
          <img
            className="tenantImg2"
            onClick={goToActualDashboard}
            src={imgS[0]}
          />
        )}
        {props.type === 1 && (
          <div>
            <h3 id="lease-ends" className="green-text">
              Lease Ends: {props.leaseEnds}
            </h3>
            <h4 className="add1 card-text">
              <strong>{props.address1}</strong>
            </h4>
            <h4 className="add1 card-text">
              {props.city}, {props.state}
            </h4>
            <h4 className="add1 blue-text card-text cost-text">
              ${props.cost} / mo
            </h4>
          </div>
        )}
      </div>
      <div>
        {props.type === 1 && (
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
        )}
        {props.type === 2 && (
          <div>
            <h3 id="lease-ends" className="green-text">
              Lease Ends: {props.leaseEnds}
            </h3>
            <h4 className="add1 card-text">
              <strong>{props.address1}</strong>
            </h4>
            <h5>
              Application Status:{" "}
              <h4 className="in-green">{props.application_type}</h4>
            </h5>
          </div>
        )}
      </div>
    </div>
  );
}
