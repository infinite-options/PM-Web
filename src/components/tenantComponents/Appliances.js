import React from "react";

export default function Appliances(props) {
  const apps = JSON.parse(props.data);
  const arr = Object.entries(apps);
  console.log(arr);
  const rows = arr.map((row, index) => {
    return (
      <tr>
        <th className="table-col">{row[0]}</th>
        <th className="table-col">{row[1].name}</th>
        <th className="table-col">{row[1].purchased_from}</th>
        <th className="table-col">{row[1].purchased_on}</th>
        <th className="table-col">{row[1].purchased_order}</th>
        <th className="table-col">{row[1].installed}</th>
        <th className="table-col">{row[1].serial_num}</th>
        <th className="table-col">{row[1].model_num}</th>
        <th className="table-col">{row[1].warranty_till}</th>

        <th className="table-col">{"Scheduled Date"}</th>
      </tr>
    );
  });

  return (
    <div className="appliances">
      Appliances:
      <table className="table-upcoming-payments appliances-table">
        <thead>
          <tr className="table-row">
            <th className="table-col">Appliance</th>
            <th className="table-col">Name</th>
            <th className="table-col">Purchased From</th>
            <th className="table-col">Purchased On</th>
            <th className="table-col">Purchase Order Number</th>
            <th className="table-col">Installed On</th>
            <th className="table-col">Serial Number</th>
            <th className="table-col">Model Number</th>
            <th className="table-col">Warranty Till</th>
            <th className="table-col">Scheduled Date</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
