import React from 'react';
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useElements, useStripe, CardElement, Elements } from '@stripe/react-stripe-js';
import AppContext from '../AppContext';
import {
  bluePillButton,
  pillButton
} from "../utils/styles";
import { post } from '../utils/api';

function StripePayment(props) {
  const {purchase} = props;
  const {userData} = React.useContext(AppContext);
  const {user} = userData;
  const elements = useElements();
  const stripe = useStripe();

  const submitPayment = async () => {
    const paymentData = {
      customer_uid: user.user_uid,
      business_code: 'M4METEST',
      payment_summary: {
        total: purchase.amount
      }
    }
    const response = await fetch('https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createPaymentIntent', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(paymentData)
    });
    const clientSecret = await response.json();
    console.log(clientSecret);
    const cardElement = await elements.getElement(CardElement);
    const stripeResponse = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${user.first_name} ${user.last_name}`
        }
    });
    console.log(stripeResponse);
    const confirmedCardPayment = await stripe.confirmCardPayment(clientSecret, {
      payment_method: stripeResponse.paymentMethod.id,
      setup_future_usage: 'off_session'
    });
    console.log(confirmedCardPayment);
    const paymentIntentID = confirmedCardPayment.paymentIntent.id;
    console.log(paymentIntentID);
    const newPayment = {
      pay_purchase_id: purchase.purchase_uid,
      amount_due: purchase.amount,
      charge_id: paymentIntentID,
      payment_type: 'STRIPE'
    }
    await post('/payments', newPayment);
    props.submit();
  }

  return (
    <div>
      <div style={{border: '1px solid black', borderRadius: '10px', padding: '10px', margin: '20px'}}>
        <CardElement elementRef={(c) => (this._element = c)}/>
      </div>

      <div className="text-center mt-2">
        <Row
          style={{
            display: "text",
            flexDirection: "row",
            textAlign: "center",
          }}
        >
          <Col>
            <Button
              variant="outline-primary"
              onClick={props.cancel}
              style={pillButton}
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              variant="outline-primary"
              //onClick={submitForm}
              style={bluePillButton}
              onClick={submitPayment}
            >
              Pay Now
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );

}

export default StripePayment;
