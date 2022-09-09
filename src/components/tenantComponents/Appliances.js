import React from "react";


export default function Appliances(props){
    const apps = JSON.parse(props.data);
    console.log(apps)
    
    return(
        <div className= "upcoming-payments">
            Appliances:
            <table className="table-upcoming-payments">
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
                        <th className="table-col">Closed Date</th>
                    </tr>
                </thead>
            {/* <tbody>
                {rows}
            </tbody> */}

            </table>
        </div>
    )
}