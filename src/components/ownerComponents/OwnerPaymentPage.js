import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useParams } from "react-router";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../Header";
import StripePayment from "../StripePayment";
import SideBar from "./SideBar";
import OwnerFooter from "./OwnerFooter";
import PayPal from "../PayPal";
import ConfirmCheck from "../../icons/confirmCheck.svg";
import { get } from "../../utils/api";
import {
  headings,
  bluePillButton,
  subHeading,
  squareForm,
} from "../../utils/styles";
// import ApplePay from "./ApplePay";

function OwnerPaymentPage(props) {
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
  const [width, setWindowWidth] = useState(0);
  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };
  const responsive = {
    showSidebar: width > 1023,
  };
  const submitForm = () => {
    const requestTitle = requestTitleRef.current.value;
    const requestDescription = requestDescriptionRef.current.value;
    const tagPriority = tagPriorityRef.current.value;
    props.onConfirm(requestTitle, requestDescription, tagPriority);
  };

  React.useEffect(async () => {
    let tempAllPurchases = [];
    for (let i in purchaseUIDs) {
      let response1 = await get(`/purchases?purchase_uid=${purchaseUIDs[i]}`);
      tempAllPurchases.push(response1.result[0]);
    }
    let response = await get(`/purchases?purchase_uid=${purchase_uid}`);
    setPurchase(response.result[0]);
    setAllPurchases(tempAllPurchases);
  }, []);

  const toggleKeys = async () => {
    //console.log("inside toggle keys");
    const url =
      message === "PMTEST"
        ? "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PMTEST"
        : "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PM";
    let response = await fetch(url);
    const responseData = await response.json();
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
    <div className="w-100 overflow-hidden">
      <div className="flex-1">
        <div
          hidden={!responsive.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </div>
        <div className="w-100 mb-5 overflow-scroll">
          <Header
            title="Payment"
            leftText={paymentConfirm === false ? `< Back` : ""}
            leftFn={() => {
              paymentConfirm === false
                ? navigate("/owner-payments")
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
                    navigate("/owner-payments"); //should change the navigation to tenantDashboard
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
                {allPurchases.length > 1 ? (
                  <div style={headings}>
                    Pay Fees {purchase.description && `(Multiple Fees)`}
                  </div>
                ) : (
                  <div style={headings}>
                    Pay Fees{" "}
                    {purchase.description && `(${purchase.description})`}
                  </div>
                )}
                {stripePayment ? (
                  <div style={subHeading}>Amount to be paid: ${amount}</div>
                ) : null}
              </Row>
              <div
                style={{ margin: "0px 0px 100px 0px" }}
                className="mt-5"
                hidden={stripePayment}
              >
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
                    <Button
                      className="mt-2 mb-2"
                      variant="outline-primary"
                      onClick={() => {
                        //navigate("/tenant");
                        toggleKeys();
                        setStripePayment(true);
                      }}
                      style={bluePillButton}
                    >
                      Pay with Stripe
                    </Button>
                    <PayPal
                      pay_purchase_id={purchase_uid}
                      amount={totalSum}
                      payment_notes={message}
                      payment_type={"PAYPAL"}
                    />
                  </Col>
                </Row>
              </div>

              <div hidden={!stripePayment}>
                <Elements stripe={stripePromise}>
                  <StripePayment
                    cancel={cancel}
                    submit={submit}
                    purchases={allPurchases}
                    message={message}
                    amount={amount}
                  />
                </Elements>
              </div>
            </Container>
          )}
        </div>
        <div hidden={responsive.showSidebar} className="w-100 mt-3">
          <OwnerFooter />
        </div>
      </div>
    </div>
  );
}

export default OwnerPaymentPage;
