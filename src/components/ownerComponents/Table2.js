// import React from "react";
// import './table.css'
// export default function Table(props){
//   const properties = props.data;
//   const rows = properties.map((row, index)=>{

//     return(

//       <tr>
//         <th>{index+1}</th>
//         <th>{row.address + " " + row.unit + ', ' + row.city + ', ' + row.state + ' ' + row.zip}</th>
//         <th style={{color:"blue"}}>{row.maintenanceRequests.length !==0 ? row.maintenanceRequests[0].title : "None"}</th>
//         <th style={{color:"blue"}}>{row.maintenanceRequests.length !==0 ? row.maintenanceRequests[0].request_created_date : "None"}</th>
//         <th>{"N/A"}</th>
//         <th style={{color:"blue"}}>{"N/A"}</th>
//         <th>{row.maintenanceRequests.length !==0 ? row.maintenanceRequests[0].priority : "None"}</th>
//         <th>{row.maintenanceRequests.length !==0 ? row.maintenanceRequests[0].request_created_by : "None"}</th>
//         <th>{row.maintenanceRequests.length !==0 ? "$" + row.maintenanceRequests[0].total_quotes : "None"}</th>
//         <th style={{color:"blue"}}>N/A</th>
//       </tr>
//     )

//   })

import React from "react";
import { useNavigate } from "react-router-dom";
import "./table.css";
export default function Table(props) {
  const navigate = useNavigate();
  const properties = props.data;
  var totalRequests = 0;
  var totalUrgent = 0;
  var numOverDays = 0;
  var indexes = 0;
  const numDays = (date_1, date_2) => {
    let difference = date_2.getTime() - date_1.getTime();
    let totalDays = Math.ceil(difference / (1000 * 3600 * 24));

    return totalDays;
  };
  const rows = properties.map((row, index) => {
    return row.maintenanceRequests.map((request, index2) => {
      request != null
        ? (totalRequests = totalRequests + 1)
        : (totalRequests = totalRequests + 0);
      request.priority === "High"
        ? (totalUrgent = totalUrgent + 1)
        : (totalUrgent = totalUrgent + 0);
      indexes = indexes + 1;

      const created_date = new Date(request.request_created_date);
      // console.log(created_date)
      const current = new Date();
      console.log(created_date);
      console.log(current);

      const totalNumofDays = numDays(created_date, current);
      if (totalNumofDays > 30) {
        numOverDays = numOverDays + 1;
      }
      console.log(totalNumofDays);

      return (
        console.log(row.maintenanceRequests),
        console.log(request),
        (
          <tr
            onClick={() =>
              navigate(
                `/owner-repairs/${row.maintenanceRequests[0].maintenance_request_uid}`,
                {
                  state: {
                    repair: row.maintenanceRequests[0],
                    property: row.address,
                  },
                }
              )
            }
          >
            <th>{indexes}</th>
            <th>
              {row.address +
                " " +
                row.unit +
                ", " +
                row.city +
                ", " +
                row.state +
                " " +
                row.zip}
            </th>
            <th style={{ color: "blue" }}>
              {row.maintenanceRequests.length !== 0
                ? row.maintenanceRequests[0].title
                : "None"}
            </th>
            <th style={{ color: "blue" }}>
              {row.maintenanceRequests.length !== 0
                ? row.maintenanceRequests[0].request_created_date
                : "None"}
            </th>
            <th style={{ color: "blue" }}>{totalNumofDays}</th>
            <th style={{ color: "blue" }}>{"N/A"}</th>
            <th>
              {row.maintenanceRequests.length !== 0
                ? row.maintenanceRequests[0].priority
                : "None"}
            </th>
            <th>
              {row.maintenanceRequests.length !== 0 &&
              row.maintenanceRequests[0].assigned_business != null
                ? row.maintenanceRequests[0].assigned_business
                : "None"}
            </th>
            <th>
              {row.maintenanceRequests.length !== 0
                ? "$" + row.maintenanceRequests[0].total_quotes
                : "None"}
            </th>
            <th style={{ color: "blue" }}>N/A</th>
          </tr>
        )
      );
    });
  });

  //   console.log(rows)

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th colSpan={"2"} style={{ fontSize: "40px", color: "blue" }}>
              {"Maintenance"}
            </th>
            <th colSpan={"1"} style={{ fontSize: "16px", textAlign: "center" }}>
              <span style={{ color: "blue", fontSize: "40px" }}>
                {totalRequests}
              </span>
              {"    Issues"}
            </th>
            <th colSpan={"3"} style={{ fontSize: "16px", textAlign: "center" }}>
              <span style={{ color: "Gold", fontSize: "40px" }}>
                {numOverDays}
              </span>
              {" Over 30 Days"}
            </th>
            <th colSpan={"3"} style={{ fontSize: "16px", textAlign: "center" }}>
              <span style={{ color: "red", fontSize: "40px" }}>{}</span>
              {"Important"}
            </th>
            <th colSpan={"3"} style={{ fontSize: "16px", textAlign: "center" }}>
              <span style={{ color: "red", fontSize: "40px" }}>
                {totalUrgent}
              </span>
              {"  Urgent"}
            </th>
          </tr>
          <tr>
            <th style={{ textAlign: "center" }}>ID</th>
            <th style={{ textAlign: "center" }}>Addresses</th>
            <th style={{ textAlign: "center" }}>Issue</th>
            <th style={{ textAlign: "center" }}>Date Reported</th>
            <th style={{ textAlign: "center" }}>Days Open</th>
            <th style={{ textAlign: "center" }}>Type</th>
            <th style={{ textAlign: "center" }}>Priority</th>
            <th style={{ textAlign: "center" }}>Assigned</th>
            <th style={{ textAlign: "center" }}>Cost</th>
            <th style={{ textAlign: "center" }}>Closed Date</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
