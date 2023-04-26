import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Checkbox from "./Checkbox";
import { squareForm, hidden } from "../utils/styles";

function PaymentSelection(props) {
  const [showPayPal, setShowPayPal] = useState(false);
  const [showApplePay, setShowApplePay] = useState(false);
  const [showZelle, setShowZelle] = useState(false);
  const [showVenmo, setShowVenmo] = useState(false);
  const [showChecking, setShowChecking] = useState(false);
  const [paymentState, setPaymentState] = props.state;
  const { paypal, applePay, zelle, venmo, accountNumber, routingNumber } =
    paymentState;
  const onChange = (event, field) => {
    const newPaymentState = { ...paymentState };
    newPaymentState[field] = event.target.value;
    setPaymentState(newPaymentState);
  };
  React.useEffect(() => {
    if (!showPayPal) {
      const newPaymentState = { ...paymentState };
      newPaymentState.paypal = "";
      setPaymentState(newPaymentState);
    }
  }, [showPayPal]);
  React.useEffect(() => {
    if (!showApplePay) {
      const newPaymentState = { ...paymentState };
      newPaymentState.applePay = "";
      setPaymentState(newPaymentState);
    }
  }, [showApplePay]);
  React.useEffect(() => {
    if (!showZelle) {
      const newPaymentState = { ...paymentState };
      newPaymentState.zelle = "";
      setPaymentState(newPaymentState);
    }
  }, [showZelle]);
  React.useEffect(() => {
    if (!showVenmo) {
      const newPaymentState = { ...paymentState };
      newPaymentState.venmo = "";
      setPaymentState(newPaymentState);
    }
  }, [showVenmo]);
  React.useEffect(() => {
    if (!showChecking) {
      const newPaymentState = { ...paymentState };
      newPaymentState.accountNumber = "";
      newPaymentState.routingNumber = "";
      setPaymentState(newPaymentState);
    }
  }, [showChecking]);
  return (
    <Container className="mt-3">
      <h6>Accept Payments via:</h6>
      <Row className="mb-1">
        <Col className="d-flex align-items-center">
          <Checkbox type="BOX" onClick={(checked) => setShowPayPal(checked)} />
          <p className="d-inline-block mb-0">PayPal</p>
        </Col>
        <Col>
          <Form.Control
            style={showPayPal ? squareForm : hidden}
            placeholder="PayPal"
            value={paypal}
            onChange={(e) => onChange(e, "paypal")}
          />
        </Col>
      </Row>
      <Row className="mb-1">
        <Col className="d-flex align-items-center">
          <Checkbox
            type="BOX"
            onClick={(checked) => setShowApplePay(checked)}
          />
          <p className="d-inline-block mb-0">Apple Pay</p>
        </Col>
        <Col>
          <Form.Control
            style={showApplePay ? squareForm : hidden}
            placeholder="Apple Pay"
            value={applePay}
            onChange={(e) => onChange(e, "applePay")}
          />
        </Col>
      </Row>
      <Row className="mb-1">
        <Col className="d-flex align-items-center">
          <Checkbox type="BOX" onClick={(checked) => setShowZelle(checked)} />
          <p className="d-inline-block mb-0">Zelle</p>
        </Col>
        <Col>
          <Form.Control
            style={showZelle ? squareForm : hidden}
            placeholder="Zelle"
            value={zelle}
            onChange={(e) => onChange(e, "zelle")}
          />
        </Col>
      </Row>
      <Row className="mb-1">
        <Col className="d-flex align-items-center">
          <Checkbox type="BOX" onClick={(checked) => setShowVenmo(checked)} />
          <p className="d-inline-block mb-0">Venmo</p>
        </Col>
        <Col>
          <Form.Control
            style={showVenmo ? squareForm : hidden}
            placeholder="Venmo"
            value={venmo}
            onChange={(e) => onChange(e, "venmo")}
          />
        </Col>
      </Row>
      <Row className="mb-1">
        <Col className="d-flex align-items-center">
          <Checkbox
            type="BOX"
            onClick={(checked) => setShowChecking(checked)}
          />
          <p className="d-inline-block mb-0">Checking Acct.</p>
        </Col>
        <Col>
          <Form.Control
            style={showChecking ? squareForm : hidden}
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => onChange(e, "accountNumber")}
          />
        </Col>
      </Row>
      <Row style={showChecking ? {} : hidden}>
        <Col />
        <Col>
          <Form.Control
            style={squareForm}
            placeholder="Routing Number"
            value={routingNumber}
            maxLength="9"
            onChange={(e) => onChange(e, "routingNumber")}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default PaymentSelection;
