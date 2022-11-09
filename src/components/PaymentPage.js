import React, { useEffect, useState } from "react";
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
} from "../utils/styles";
import PayPal from "./PayPal";
import ApplePay from "./ApplePay";

function PaymentPage(props) {
  const navigate = useNavigate();
  const { purchase_uid } = useParams();
  const location = useLocation();
  const [totalSum, setTotalSum] = useState(location.state.amount);
  const selectedProperty = location.state.selectedProperty;
  const purchaseUIDs = location.state.purchaseUIDs;
  const [stripePayment, setStripePayment] = useState(false);
  const [paymentConfirm, setPaymentConfirm] = useState(false);
  const requestTitleRef = React.createRef();
  const requestDescriptionRef = React.createRef();
  const tagPriorityRef = React.createRef();
  const [stripePromise, setStripePromise] = useState(null);
  const [purchase, setPurchase] = useState({});
  const useLiveStripeKey = false;
  const [message, setMessage] = React.useState("");
  const [amount, setAmount] = React.useState(totalSum);
  const [allPurchases, setAllPurchases] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const submitForm = () => {
    const requestTitle = requestTitleRef.current.value;
    const requestDescription = requestDescriptionRef.current.value;
    const tagPriority = tagPriorityRef.current.value;
    props.onConfirm(requestTitle, requestDescription, tagPriority);
  };

  React.useEffect(async () => {
    // const url = useLiveStripeKey
    //   ? "https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/stripe_key/LIVE"
    //   : "https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/stripe_key/M4METEST";
    // let response = await fetch(url);
    // const responseData = await response.json();
    // const stripePromise = loadStripe(responseData.publicKey);
    // setStripePromise(stripePromise);
    let tempAllPurchases = [];
    for (let i in purchaseUIDs) {
      let response1 = await get(`/purchases?purchase_uid=${purchaseUIDs[i]}`);
      tempAllPurchases.push(response1.result[0]);
    }
    let response = await get(`/purchases?purchase_uid=${purchase_uid}`);
    //console.log("Print 1", response);
    setPurchase(response.result[0]);
    // setAmount(response.result[0].amount_due - response.result[0].amount_paid);
    setAllPurchases(tempAllPurchases);
  }, []);

  const toggleKeys = async () => {
    //console.log("inside toggle keys");
    const url =
      message === "PMTEST"
        ? "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PMTEST"
        : "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PM";
    let response = await fetch(url);
    //console.log("response data ");
    //console.log(response);
    const responseData = await response.json();
    //console.log(responseData);
    //console.log("This is the responseData.publicKey");
    //console.log(responseData.publicKey);
    //console.log("type of responseData.publicKey");
    //console.log(typeof(responseData.publicKey));
    const stripePromise = loadStripe(responseData.publicKey);
    setStripePromise(stripePromise);
  };

  useEffect(() => {
    //console.log("allPurchases", allPurchases);
  }, [allPurchases]);

  useEffect(() => {
    if (amount > totalSum || amount <= 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [amount]);

  const cancel = () => setStripePayment(false);
  const submit = () => {
    cancel();
    setPaymentConfirm(true);
  };

  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Payment"
        leftText={paymentConfirm === false ? `< Back` : ""}
        leftFn={() => {
          paymentConfirm === false
            ? navigate(
                // `/rentPayment/${selectedProperty.nextPurchase.purchase_uid}`
                `/tenantDuePayments`,
                {
                  state: {
                    selectedProperty: selectedProperty,
                  },
                }
              )
            : console.log("");
        }}
      />
      <Row
        style={{
          height: "40px",
          fontFamily: "bahnschrift",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "28px",
            padding: "10px",
          }}
        >
          {selectedProperty.address}
        </div>
      </Row>
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
                navigate("/tenant"); //should change the navigation to tenantDashboard
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
            {/* <div style={headings}>Pay Rent {purchase.purchase_notes && `(${purchase.purchase_notes})`}</div>
            <div style={subHeading}>{purchase.description}: ${stripePayment ? amount : purchase.amount_due - purchase.amount_paid}</div> */}
            {allPurchases.length > 1 ? (
              <div style={headings}>
                Pay Fees {purchase.description && `(Multiple Fees)`}
              </div>
            ) : (
              <div style={headings}>
                Pay Fees {purchase.description && `(${purchase.description})`}
              </div>
            )}
            {/*<div style={subHeading}>Max Payment: ${totalSum}</div>*/}
            {stripePayment ? (
              <div style={subHeading}>Amount to be paid: ${amount}</div>
            ) : null}
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
          <div style={{"margin": "0px 0px 100px 0px"}} className="mt-5" hidden={stripePayment}>
            {/*<Form.Group>*/}
            {/*  <Form.Label>Amount</Form.Label>*/}
            {/*  {purchaseUIDs.length === 1 ? (*/}
            {/*    <Form.Control*/}
            {/*      placeholder={purchase.amount_due - purchase.amount_paid}*/}
            {/*      style={squareForm}*/}
            {/*      value={amount}*/}
            {/*      onChange={(e) => setAmount(e.target.value)}*/}
            {/*    />*/}
            {/*  ) : (*/}
            {/*    <Form.Control*/}
            {/*      disabled*/}
            {/*      placeholder={purchase.amount_due - purchase.amount_paid}*/}
            {/*      style={squareForm}*/}
            {/*      value={amount}*/}
            {/*      onChange={(e) => setAmount(e.target.value)}*/}
            {/*    />*/}
            {/*  )}*/}
            {/*</Form.Group>*/}
            <h2>Max Payment: ${totalSum}</h2>
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
              <Col>
                <Button className="mt-2 mb-2" variant="outline-primary"
                    onClick={() => {
                      //navigate("/tenant");
                      toggleKeys();
                      setStripePayment(true);
                    }}
                    style={bluePillButton}
                >
                  Pay with Stripe
                </Button>
                <PayPal pay_purchase_id={purchase_uid}
                        amount={totalSum}
                        payment_notes={message}
                        payment_type={"PAYPAL"}
                />
                <ApplePay pay_purchase_id={purchase_uid}
                          amount={totalSum}
                          payment_notes={message}
                          payment_type={"APPLEPAY"}
                />
              </Col>
            </Row>
          </div>

          {/* {allPurchases.map((purchase, i) => {
            console.log(purchase);
            return <div hidden={!stripePayment}>
            <Elements stripe={stripePromise}>
              <StripePayment cancel={cancel} submit={submit} purchase={purchase}
                message={message} amount={amount}/>
            </Elements>
          </div>
          })} */}
          <div hidden={!stripePayment}>
            <Elements stripe={stripePromise}>
              <StripePayment
                cancel={cancel}
                submit={submit}
                purchases={allPurchases}
                message={message}
                amount={amount}
              />
              {/* console.log(allPurchases, amount, message) */}
              {/* <StripePayment cancel={cancel} submit={submit} purchase={purchase}
                message={message} amount={amount}/> */}
            </Elements>
          </div>
        </Container>
      )}
      <Footer tab={"DASHBOARD"} />
    </div>
  );
}

export default PaymentPage;
