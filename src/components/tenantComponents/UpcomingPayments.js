import React from "react"
import {BrowserRouter as Router, Link} from 'react-router-dom';
// import { get } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function UpcomingPayments(props){
    const navigate = useNavigate();

    const rents = props.data; //array of objects 
    const goToPayment = () => {
        navigate("/tenantDuePayments");
      };
    const rows = rents.map((row,index)=>{//row is an element in the array 
        return(
            <tr>
                <th className="table-col">{index+1}</th>
                <th className="table-col">{"" + row.purchase_notes+ " " + row.description}</th>
                <th className="table-col blue-text">{row.purchase_type}</th>
                <th className="table-col green-text">{row.next_payment.substring(0,10)}</th>
                <th className="table-col">
                    <button className="yellow payB" onClick={goToPayment}>
                        Pay
                    </button>
                    
                   
                        {/* <button className="yellow payB" >
                            <a href="tenantComponents/test">Pay</a>
                        </button> */}
                    
                </th>
                <th className="table-col">{row.amount_due}</th>
            </tr>
        )
    })
    return(
        <div className= "upcoming-payments">
            Upcoming Payments
            <table className="table-upcoming-payments">
            <thead>
                <tr className="table-row blue-text">
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