import React, {useEffect} from "react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

export default function PayPal(props) {

    const navigate = useNavigate();
    function navigateToTenantDuePayments(){
        navigate(`/tenantDuePayments`);
    }

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
                    value: props.balance // Can also reference a variable or function
                }
            }]
        })
    }

    // Finalize the transaction after payer approval
    const onApprove = (data, actions) => {
        return actions.order.capture().then(function(orderData) {
            // Successful capture! For dev/demo purposes:
            console.log(orderData);
            const transaction = orderData.purchase_units[0].payments.captures[0];
            alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
            // When ready to go live, remove the alert and show a success message within this page. For example:
            // const element = document.getElementById('paypal-button-container');
            // element.innerHTML = '<h3>Thank you for your payment!</h3>';
            // Or go to another URL:  actions.redirect('thank_you.html');
            if(transaction.status == "COMPLETED")
                navigateToTenantDuePayments()
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