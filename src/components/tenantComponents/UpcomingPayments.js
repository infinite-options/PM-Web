import React from "react"

export default function UpcomingPayments(props){
    const rents = JSON.parse(props.data);
    console.log(rents);
    const rows = rents.map((row,index)=>{
        return(
            <tr>
                <th className="table-col">{index+1}</th>
                <th className="table-col">{row.of}</th>
                <th className="table-col">{row.fee_name}</th>
                <th className="table-col">{row.due_by}</th>
                <th className="table-col"><button>Pay</button></th>
                <th className="table-col">{row.charge}</th>
            </tr>
            
        )
    })
    return(
        <div className= "upcoming-payments">
            Upcoming Payments
            <table className="table-upcoming-payments">
            <thead>
                <tr className="table-row">
                    <th className="table-col">ID</th>
                    <th className="table-col">Description</th>
                    <th className="table-col">Type</th>
                    <th className="table-col">Date</th>
                    <th className="table-col">Pay</th>
                    <th className="table-col">Amount</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>

            </table>
        </div>
    )
}