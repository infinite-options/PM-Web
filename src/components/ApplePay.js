import React from "react"
import axios from "axios"

export default function ApplePay(props){
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
    }, [displayButton])
    function handleClick() {
        const paymentRequest = {
            currencyCode: 'USD',
            countryCode: 'US',
            supportedCountries: ['US'],
            total: {
                label: "Manifest",
                amount: '0.01'
            },
            supportedNetworks: ['masterCard', 'visa', 'mada', 'discover'],
            merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit']
        }
        const session = new window.ApplePaySession(8, paymentRequest)
        session.onvalidatemerchant = async (event) => {
            const payload = {
                url: event.validationURL,
                method: 'post',
                body: {
                    merchantIdentifier: "merchant.com.infiniteoptions",
                    displayName: "Manifest",
                    initiative: "web",
                    //Replace domain with current url environment domain
                    initiativeContext: "localhost"
                },
                json: true
            }
            const merchantSession = await axios.post("/apple_pay_session", payload)
            session.completeMerchantValidation(merchantSession.data)
        }
        session.onpaymentauthorized = event => {
            const result = { "status": session.STATUS_SUCCESS }
            session.completePayment(result)
        }
        session.oncancel = event => {
            console.log(event)
        }
        session.begin()
    }
    return (
        <div className="applepay">
            {displayButton && <div id="apple-pay-button" style={style} />}
        </div>
    )
}