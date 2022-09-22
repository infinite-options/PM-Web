import React from "react"

export default function Maintenence(props){
    const main = props.data; //array of objects 
    const noRows = "No data available"
    // const rows = main.map((row,index)=>{//row is an element in the array 
    //     return(
    //         <tr>
    //             <th className="table-col">{index+1}</th>
    //             <th className="table-col">{"" + row.purchase_notes+ " " + row.description}</th>
    //             <th className="table-col">{row.purchase_type}</th>
    //             <th className="table-col">{row.next_payment.substring(0,10)}</th>
    //             <th className="table-col"><button>Pay</button></th>
    //             <th className="table-col">{row.amount_due}</th>
    //         </tr>
    //     )
    // })
    return(
        <div className= "maintenence">
            Maintenence
            <table className="table-upcoming-payments">
            <thead>
                <tr className="table-row blue-text">
                    <th className="table-col">ID</th>
                    <th className="table-col">Address</th>
                    <th className="table-col">Issue</th>
                    <th className="table-col">Date Reported</th>
                    <th className="table-col">Days Open</th>
                    <th className="table-col">Type</th>
                    <th className="table-col">Status</th>
                    <th className="table-col">Upload Images</th>
            
                </tr>
            </thead>
            <tbody>
                {main === '' && <tr className="table-row no-data">{noRows}</tr>}
            </tbody>

            </table>
        </div>
    )
}