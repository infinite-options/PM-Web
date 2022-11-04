import React from "react";
import axios from "axios";

export default function ApplePay(props){

    const style = {
        "display": "inline-block",
        "-webkit-appearance": "-apple-pay-button",
        "-apple-pay-button-type": "plain",
        "-apple-pay-button-style": "black",
        "border-radius": "25px",
        "width": "500px",
        "height": "200px"
    }

    let displayButton = false
    if(window.ApplePaySession && window.ApplePaySession.canMakePayments())
        displayButton = true
    React.useEffect(() => {
        if(displayButton){
            const applepayButton = document.getElementById("apple-pay-button")
            applepayButton.addEventListener("click", handleClick)
        }
    }, [])

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
                    initiativeContext: "io-pm.netlify.app"
                },
                json: true
            }
            const merchantSession = await axios.post("/apple_pay_session", payload)
            session.completeMerchantValidation(merchantSession.data)
        }

        session.onpaymentauthorized = event => {
            console.log("ON PAYMENT AUTHORIZED")
            // Define ApplePayPaymentAuthorizationResult
            const result = {
                "status": session.STATUS_SUCCESS
            };
            session.completePayment(result);
        };

        session.onpaymentmethodselected = event => {
            console.log("ON PAYMENT METHOD SELECTED")
            // Define ApplePayPaymentMethodUpdate based on the selected payment method.
            // No updates or errors are needed, pass an empty object.
            const update = {};
            session.completePaymentMethodSelection(update);
        };

        session.onshippingmethodselected = event => {
            console.log("ON SHIPPING METHOD SELECTED")
            // Define ApplePayShippingMethodUpdate based on the selected shipping method.
            // No updates or errors are needed, pass an empty object.
            const update = {};
            session.completeShippingMethodSelection(update);
        };

        session.oncancel = event => {
            // Payment cancelled by WebKit
        };

        session.begin();
    }

    return(
        <div>
            {displayButton && <div id="apple-pay-button" style={style} />}
        </div>
    )
}