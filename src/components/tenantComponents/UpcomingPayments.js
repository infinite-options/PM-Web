import React from "react"
import {BrowserRouter as Router, Link} from 'react-router-dom';
// import { get } from "../utils/api";
import { useNavigate } from "react-router-dom";
import PaymentComponent from "../TenantDuePayments2"
export default function UpcomingPayments(props){
    const navigate = useNavigate();
    const [totalSum, setTotalSum] = React.useState(0);
    const [purchaseUIDs, setPurchaseUIDs] = React.useState([]);//figure out which payment is being payed for
    const rents = props.data; //array of objects
    console.log(props.data) 
    const goToPayment = () => {
        navigate("/tenantDuePayments");
        // <PaymentComponent data = {rents}/>
      };

    function handleCheck(event, amt,pid){ //pid is the purchase uid
        let tempPurchaseUID = purchaseUIDs;
        if(event.target.checked){
            setTotalSum(prev=>amt+prev)
            // setPurchaseUIDs(prev=>.)
            tempPurchaseUID.push(pid);
        }
        else{
            setTotalSum(prev=>prev-amt)
            for (let uid in purchaseUIDs) {
                if (purchaseUIDs[uid] === pid) {
                    purchaseUIDs.splice(uid, 1);
                }
            }
        }
        setPurchaseUIDs(tempPurchaseUID);

    }
    function navigateToPaymentPage(){
        if(props.paymentSelection[1].isActive == true){
            console.log("zelle selected")
            navigate('/zelle',{
                state:{
                    amount: totalSum,
                    selectedProperty: props.selectedProperty,
                    purchaseUIDs,purchaseUIDs
                },
            })
        }
        else{
            navigate(`/paymentPage/${purchaseUIDs[0]}`, {
                state: {
                    amount: totalSum,
                    selectedProperty: props.selectedProperty,
                    purchaseUIDs: purchaseUIDs
                },
            });
        }
    }
    const rows = rents.map((row,index)=>{//row is an element in the array 
        return(
            <tr>
                <th className="table-col">{index+1}</th>
                <th className="table-col">{"" + row.purchase_notes+ " " + row.description}</th>
                <th className="table-col blue-text">{row.purchase_type}</th>
                <th className="table-col green-text">{row.next_payment.substring(0,10)}</th>
                <th className="table-col">
                    {props.type?
                    <button className="yellow payB" onClick={goToPayment}>
                        Pay
                    </button>:
                    <label>
                        <input 
                            className="check" 
                            type = "checkbox" 
                            onClick={event=>handleCheck(event,row.amount_due, row.purchase_uid)}
                        />
                    </label>
                    
                    }
                   
                        {/* <button className="yellow payB" >
                            <a href="tenantComponents/test">Pay</a>
                        </button> */}
                    
                </th>
                <th className="table-col">{row.amount_due}</th>
            </tr>
        )
    })
    //confused about: where to send info?
    console.log(props)
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
            {props.type == false && 
                    <div className="amount-pay">
                        <h4 className="amount">Amount: {totalSum}</h4>
                        <button 
                        className="pay-button2"
                        onClick={()=> {
                            navigateToPaymentPage()
                        }}                        
                        >
                            Pay Now
                        </button>
                    </div>
                }
        </div>
    )
}