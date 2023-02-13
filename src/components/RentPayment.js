import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  useElements,
  useStripe,
  CardElement,
  Elements,
} from "@stripe/react-stripe-js";
import { useParams } from "react-router";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { get } from "../utils/api";
import StripePayment from "./StripePayment";

import ConfirmCheck from "../icons/confirmCheck.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import {
  headings,
  formLabel,
  bluePillButton,
  pillButton,
  subHeading,
  squareForm,
} from "../utils/styles";

function RentPayment(props) {
  const navigate = useNavigate();
  const { purchase_uid } = useParams();
  const [stripePayment, setStripePayment] = useState(false);
  const [paymentConfirm, setPaymentConfirm] = useState(false);
  const requestTitleRef = React.createRef();
  const requestDescriptionRef = React.createRef();
  const tagPriorityRef = React.createRef();
  const [stripePromise, setStripePromise] = useState(null);
  const [purchase, setPurchase] = useState({});
  const useLiveStripeKey = false;
  const [message, setMessage] = React.useState("");
  const [amount, setAmount] = React.useState(0);
  // console.log(amount);

  const submitForm = () => {
    const requestTitle = requestTitleRef.current.value;
    const requestDescription = requestDescriptionRef.current.value;
    const tagPriority = tagPriorityRef.current.value;

    props.onConfirm(requestTitle, requestDescription, tagPriority);
  };

  React.useEffect(async () => {
    const url = useLiveStripeKey
      ? "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PMTEST"
      : "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PM";
    let response = await fetch(url);
    const responseData = await response.json();
    const stripePromise = loadStripe(responseData.publicKey);
    setStripePromise(stripePromise);
    response = await get(`/purchases?purchase_uid=${purchase_uid}`);
    // console.log(response.result[0]);
    setPurchase(response.result[0]);
    setAmount(response.result[0].amount_due - response.result[0].amount_paid);
  }, []);

  const cancel = () => setStripePayment(false);
  const submit = () => {
    cancel();
    setPaymentConfirm(true);
  };

  return (
    <div className="h-100 d-flex flex-column">
      <Header title="Payment" />
      {paymentConfirm ? (
        <Container className="pt-1 mb-4">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Row style={headings} className="mt-2 mb-2">
              Payment Received{" "}
              {purchase.purchase_notes && `(${purchase.purchase_notes})`}
            </Row>
            <Row style={subHeading} className="mt-2 mb-2">
              {purchase.description}: ${amount}
            </Row>
            <Row className="mt-2 mb-2">
              <img
                src={ConfirmCheck}
                style={{ width: "58px", height: "58px" }}
              />
            </Row>
            <Button
              className="mt-8 mb-2"
              variant="outline-primary"
              onClick={() => {
                navigate("/paymentHistory");
                //setStripePayment(true);
              }}
              style={bluePillButton}
            >
              Go to payment history
            </Button>
          </div>
        </Container>
      ) : (
        <Container className="pt-1 mb-4">
          <Row>
            <div style={headings}>
              Pay Rent{" "}
              {purchase.purchase_notes && `(${purchase.purchase_notes})`}
            </div>
            <div style={subHeading}>
              {purchase.description}: $
              {stripePayment
                ? amount
                : purchase.amount_due - purchase.amount_paid}
            </div>
          </Row>
          {/*
            <StripeElement
                stripePromise={this.state.stripePromise}
                customerPassword={this.state.customerPassword}
                deliveryInstructions={this.state.instructions}
                setPaymentType={this.setPaymentType}
                paymentSummary={this.state.paymentSummary}
                loggedInByPassword={loggedInByPassword}
                latitude={this.state.latitude.toString()}
                longitude={this.state.longitude.toString()}
                email={this.state.email}
                customerUid={this.state.customerUid}
                phone={this.state.phone}
                fetchingFees={this.state.fetchingFees}
                displayError={this.displayError}
                dpvCode={this.state.responseCode}
                ambassadorCode={this.state.ambassadorCode_applied}
              />
          */}
          <div className="mt-5" hidden={stripePayment}>
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                placeholder={purchase.amount_due - purchase.amount_paid}
                style={squareForm}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Message</Form.Label>
              <Form.Control
                placeholder="PMTEST"
                style={squareForm}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
            <Row
              className="text-center mt-5"
              style={{
                display: "text",
                flexDirection: "column",
                textAlign: "center",
                justifyContent: "space-between",
              }}
            >
              <Col>
                <Button
                  className="mt-2 mb-2"
                  variant="outline-primary"
                  onClick={() => {
                    //navigate("/tenant");
                    setStripePayment(true);
                  }}
                  style={bluePillButton}
                >
                  Pay with Stripe
                </Button>
              </Col>
              <Col>
                <Button
                  className="mt-2 mb-2"
                  variant="outline-primary"
                  onClick={submitForm}
                  style={pillButton}
                >
                  Pay with PayPal
                </Button>
              </Col>
            </Row>
          </div>
          <div hidden={!stripePayment}>
            <Elements stripe={stripePromise}>
              <StripePayment
                cancel={cancel}
                submit={submit}
                purchase={purchase}
                message={message}
                amount={amount}
              />
            </Elements>
          </div>
        </Container>
      )}
      <Footer tab={"DASHBOARD"} />
    </div>
  );
}

export default RentPayment;
