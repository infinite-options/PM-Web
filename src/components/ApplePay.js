import React from "react"
import axios from "axios"
import { post } from "../utils/api"
import { useNavigate } from "react-router-dom"

export default function ApplePay(props){
    const navigate = useNavigate()
    //Style the Apple Pay button
    const style = {
        "display": "inline-block",
        "margin-top": "8px",
        "cursor": "pointer",
        "-webkit-appearance": "-apple-pay-button",
        "-apple-pay-button-type": "plain",
        "-apple-pay-button-style": "black",
        "border-radius": "30px",
        "width": "750px",
        "height": "60px"
    }
    //Variable for displaying the button
    let displayButton = false
    //Check if browser supports Apple Pay
    if(window.ApplePaySession && window.ApplePaySession.canMakePayments())
        displayButton = true
    React.useEffect(() => {
        //If browser supports Apple Pay create click event listener for button
        if(displayButton){
            const applepayButton = document.getElementById("apple-pay-button")
            applepayButton.addEventListener("click", handleClick)
        }
        //Create payment info request
        const paymentRequest = {
            currencyCode: 'USD',
            countryCode: 'US',
            supportedCountries: ['US'],
            total: {
                label: "Manifest",
                amount: props.amount
            },
            supportedNetworks: ['masterCard', 'visa', 'mada', 'discover'],
            merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit']
        }
        //Initiate Apple Pay session if button is clicked
        function handleClick() {
            //Create a new Apple Pay session
            const session = new window.ApplePaySession(8, paymentRequest)
            //Variables for switching between environments
            const devDomain = "localhost"
            const productionDomain = "io-pm.netlify.app"
            //Validate merchant for Apple Pay transaction
            session.onvalidatemerchant = async (event) => {
                //Create payload for backend to use in a post request to Apple Pay Gateway API endpoint
                const payload = {
                    "url": event.validationURL,
                    "merchantIdentifier": "merchant.com.infiniteoptions",
                    "displayName": "Manifest",
                    "initiative": "web",
                    "initiativeContext": devDomain
                }
                //Send post request to backend to receive a valid merchant session object
                const merchantSession = await axios.post("/applepay", payload)
                    .then(response => response.data)
                //Confirm if merchant session object is valid to allow transaction
                if(merchantSession && merchantSession.merchantSessionIdentifier)
                    session.completeMerchantValidation(merchantSession)
                //Otherwise, end Apple Pay session
                else
                    session.abort()
            }
            //If merchant session object is accepted, confirm payment has authorization for transaction
            session.onpaymentauthorized = event => {
                //Confirm status of authorization
                const result = { "status": session.STATUS_SUCCESS }
                session.completePayment(result)
                //Pass transaction info for updating database
                const charge_id = event.payment.token.transactionIdentifier
                updateDatabase(charge_id)
                //Take user back to tenant dashboard with payments updated
                navigateToTenantDashBoard()
            }
            //Ends Apple Pay session
            session.oncancel = event => {
                console.log(event)
            }
            //Begin Apple Pay session
            session.begin()
        }
        //Record new payment and update backend
        async function updateDatabase(charge_id) {
            //Create payment info to be passed to database
            const newPayment = {
                pay_purchase_id: props.pay_purchase_id,
                amount: props.amount,
                payment_notes: props.payment_notes,
                charge_id: charge_id,
                payment_type: props.payment_type
            }
            //Post payment info to backend endpoint
            await post("/payments", newPayment)
        }
        //Navigate to the tenant dashboard
        function navigateToTenantDashBoard(){
            navigate('/tenant_dash', {
                //Set property slider to the first element
                state:{
                    lookingAt: 0,
                },
            })
        }
    }, [displayButton, props.amount, props.pay_purchase_id, props.payment_notes, props.payment_type, navigate])
    //Display Apple Pay button HTML only if browser supports it
    return (
        <div className="applepay">
            {displayButton && <div id="apple-pay-button" style={style} />}
        </div>
    )
}