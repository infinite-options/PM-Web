import React from "react"
import axios from "axios"
import { post } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function ApplePay(props){
    const navigate = useNavigate();
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
    let displayButton = false
    if(window.ApplePaySession && window.ApplePaySession.canMakePayments())
        displayButton = true
    React.useEffect(() => {
        if(displayButton){
            const applepayButton = document.getElementById("apple-pay-button")
            applepayButton.addEventListener("click", handleClick)
        }
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
        function handleClick() {
            const session = new window.ApplePaySession(8, paymentRequest)
            const devDomain = "localhost"
            const productionDomain = "io-pm.netlify.app"
            session.onvalidatemerchant = async (event) => {
                const payload = {
                    url: event.validationURL,
                    method: 'post',
                    body: {
                        merchantIdentifier: "merchant.com.infiniteoptions",
                        displayName: "Manifest",
                        initiative: "web",
                        //Replace domain to match environment
                        initiativeContext: devDomain
                    },
                    json: true
                }
                const merchantSession = await axios.post("/apple_pay_session", payload)
                    .then(response => response.data)
                if(merchantSession && merchantSession.merchantSessionIdentifier)
                    session.completeMerchantValidation(merchantSession)
                else
                    session.abort()
            }
            session.onpaymentauthorized = event => {
                const result = { "status": session.STATUS_SUCCESS }
                session.completePayment(result)
                const charge_id = event.payment.token.transactionIdentifier
                updateDatabase(charge_id)
                navigateToTenantDashBoard()
            }
            session.oncancel = event => {
                console.log(event)
            }
            session.begin()
        }
        //Create new payment and update backend
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
        function navigateToTenantDashBoard(){
            navigate('/tenant_dash', {
                //Set property slider to the first element
                state:{
                    lookingAt: 0,
                },
            })
        }
    }, [displayButton, props.amount, props.pay_purchase_id, props.payment_notes, props.payment_type, navigate])
    return (
        <div className="applepay">
            {displayButton && <div id="apple-pay-button" style={style} />}
        </div>
    )
}