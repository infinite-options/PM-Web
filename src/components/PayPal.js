import React from "react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useNavigate } from "react-router-dom"
import { post } from "../utils/api";

export default function PayPal(props) {

    //Update backend with new payment
    async function updateDatabase(charge_id) {
        const newPayment = {
            pay_purchase_id: props.pay_purchase_id,
            amount: props.amount,
            payment_notes: props.payment_notes,
            charge_id: charge_id,
            payment_type: props.payment_type
        }
        await post("/payments", newPayment)
    }

    //Navigate to the tenant dashboard
    const navigate = useNavigate();
    function navigateToTenantDashBoard(){
        navigate('/tenant_dash', {
            state:{
                lookingAt: 0,
            },
        })
    }

    //Set up PayPal component with initial settings
    const initialOptions = {
        "client-id": "ATrAfbibjxaSvw_vq_sJbPtTfk5wcF-Jg8OarO09zTCMVN7nnqY5f9okZCBDC-jSrg9qo8oLVnl_bHnA",
        "currency": "USD",
        "intent": "capture",
        "commit": "true",
        "disable-funding": ["card", "paylater"],
        "enable-funding": "venmo"
    }
    const style = {
        shape: "pill"
    }
    // Sets up the transaction when a payment button is clicked
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: props.amount.toString() // Can also reference a variable or function
                }
            }]
        })
    }
    // Finalize the transaction after payer approval
    const onApprove = (data, actions) => {
        return actions.order.capture().then(function(orderData) {
            // Successful capture! For dev/demo purposes:
            //alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
            // When ready to go live, remove the alert and show a success message within this page. For example:
            // const element = document.getElementById('paypal-button-container');
            // element.innerHTML = '<h3>Thank you for your payment!</h3>';
            // Or go to another URL:  actions.redirect('thank_you.html');
            const transaction = orderData.purchase_units[0].payments.captures[0];
            if(transaction.status == "COMPLETED"){
                updateDatabase(transaction.id)
                navigateToTenantDashBoard()
                setTimeout(() => {
                    alert("Thank you for your payment!")
                }, 1500)
            }
        })
    }

    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
                style={style}
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </PayPalScriptProvider>
    )
}