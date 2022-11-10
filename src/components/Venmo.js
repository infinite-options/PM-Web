import {PayPalScriptProvider, PayPalButtons} from "@paypal/react-paypal-js";

export default function Venmo() {

    const initialOptions = {
        "client-id": "test",
        "disable-funding": "credit"
    }

    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons />
        </PayPalScriptProvider>
    );
}