import React, { useEffect, useState, createRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  useElements,
  useStripe,
  CardElement,
  Elements,
} from "@stripe/react-stripe-js";
import { useParams } from "react-router";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "./Header";
import Footer from "./Footer";
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
  mediumBold,
} from "../utils/styles";

function OwnerPaymentPage(props) {
  const navigate = useNavigate();
  console.log("here");
  const { totalSum, selectedProperty, purchaseUID, setStage } = props;
  const [stripePayment, setStripePayment] = useState(false);
  const [paymentConfirm, setPaymentConfirm] = useState(false);
  const requestTitleRef = createRef();
  const requestDescriptionRef = createRef();
  const tagPriorityRef = createRef();
  const [stripePromise, setStripePromise] = useState(null);
  const [purchase, setPurchase] = useState({});
  const useLiveStripeKey = false;
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);

  const [amount, setAmount] = useState(totalSum);
  const submitForm = () => {
    const requestTitle = requestTitleRef.current.value;
    const requestDescription = requestDescriptionRef.current.value;
    const tagPriority = tagPriorityRef.current.value;
    props.onConfirm(requestTitle, requestDescription, tagPriority);
  };

  useEffect(async () => {
    const url = useLiveStripeKey
      ? "https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/stripe_key/LIVE"
      : "https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/stripe_key/M4METEST";
    let response = await fetch(url);
    const responseData = await response.json();
    const stripePromise = loadStripe(responseData.publicKey);
    setStripePromise(stripePromise);
    let tempAllPurchases = [];
    console.log(purchaseUID);

    response = await get(`/purchases?purchase_uid=${purchaseUID}`);
    console.log("Print 1", response);
    setPurchase(response.result);
    // setAmount(response.result[0].amount_due - response.result[0].amount_paid);
  }, []);

  const cancel = () => setStripePayment(false);
  const submit = () => {
    cancel();
    setPaymentConfirm(true);
  };

  return (
    <div className="h-100 d-flex flex-column pb-5">
      <Header
        title="Payment"
        leftText={paymentConfirm === false ? `< Back` : ""}
        leftFn={() => {
          setStage("DASHBOARD");
        }}
      />
      <div
        className="mb-4 p-2 m-2"
        style={{
          background: "#F3F3F3 0% 0% no-repeat padding-box",
          borderRadius: "5px",
        }}
      >
        <div style={(mediumBold, { textAlign: "center" })}>
          {selectedProperty.address}
          {selectedProperty.unit !== "" ? " " + selectedProperty.unit : ""},
          {selectedProperty.city}, {selectedProperty.state}{" "}
          {selectedProperty.zip}
        </div>
      </div>
      {paymentConfirm ? (
        <div
          className="mx-2 my-2 p-3"
          style={{
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            borderRadius: "10px",
            opacity: 1,
          }}
        >
          <div
            className="mx-2 my-2 p-3"
            style={{
              background: "#F3F3F3 0% 0% no-repeat padding-box",
              borderRadius: "5px",
              opacity: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {console.log(purchase)}
            <Row style={mediumBold} className="mt-2 mb-2">
              Payment Received{" "}
              {purchase[0].purchase_notes && `(${purchase[0].purchase_notes})`}
            </Row>
            <Row style={mediumBold} className="mt-2 mb-2">
              {purchase[0].description}: ${amount}
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
                navigate("/ownerPaymentHistory");
                //setStripePayment(true);
              }}
              style={bluePillButton}
            >
              Go to payment history
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="mx-2 my-2 p-3"
          style={{
            background: "#F3F3F3 0% 0% no-repeat padding-box",
            borderRadius: "5px",
            opacity: 1,
          }}
        >
          <Row>
            <div style={mediumBold}>
              Pay Fees
              {purchase[0].description && `(${purchase[0].description})`}
            </div>

            {stripePayment ? (
              <div style={mediumBold}>Amount to be paid: ${amount}</div>
            ) : null}
          </Row>

          <div className="mt-5" hidden={stripePayment}>
            <Form.Group>
              <Form.Label>Amount</Form.Label>

              <Form.Control
                placeholder={purchase[0].amount_due - purchase[0].amount_paid}
                style={squareForm}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Message</Form.Label>
              <Form.Control
                placeholder="M4METEST"
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
              {disabled ? (
                <Row style={{ width: "80%", margin: " 10%" }}>
                  Amount to be paid must be greater than 0 and less than or
                  equal total:
                </Row>
              ) : null}

              {disabled ? (
                <Col>
                  <Button
                    className="mt-2 mb-2"
                    variant="outline-primary"
                    disabled
                    style={bluePillButton}
                  >
                    Pay with Stripe
                  </Button>
                </Col>
              ) : (
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
              )}
              {disabled ? (
                <Col>
                  <Button
                    className="mt-2 mb-2"
                    variant="outline-primary"
                    disabled
                    style={pillButton}
                  >
                    Pay with PayPal
                  </Button>
                </Col>
              ) : (
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
              )}
            </Row>
          </div>

          <div hidden={!stripePayment}>
            <Elements stripe={stripePromise}>
              <StripePayment
                cancel={cancel}
                submit={submit}
                purchases={purchase}
                message={message}
                amount={amount}
              />
            </Elements>
            {console.log(purchase, amount, message)}
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerPaymentPage;
