import React from "react"

export default function UpcomingPayments(props){
    const history = props.data; //array of objects 
    
    // const rows = rents.map((row,index)=>{//row is an element in the array 
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
        <div className= "upcoming-payments">
            Payment History
            <table className="table-upcoming-payments">
            <thead>
                <tr className="table-row">
                    <th className="table-col">ID</th>
                    <th className="table-col">Description</th>
                    <th className="table-col">Type</th>
                    <th className="table-col">Date</th>
                    <th className="table-col">Invoice</th>
                    <th className="table-col">Amount</th>
                </tr>
            </thead>
            {/* <tbody>
                {rows}
            </tbody> */}

            </table>
        </div>
    )
}