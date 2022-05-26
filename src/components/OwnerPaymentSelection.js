import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Checkbox from "./Checkbox";
import { squareForm, hidden, gray, headings } from "../utils/styles";

function OwnerPaymentSelection(props) {
  const { editProfile, paymentState, setPaymentState } = props;
  const { paypal, applePay, zelle, venmo, accountNumber, routingNumber } =
    paymentState;
  const [showPayPal, setShowPayPal] = React.useState(false);
  const [showApplePay, setShowApplePay] = React.useState(false);
  const [showZelle, setShowZelle] = React.useState(false);
  const [showVenmo, setShowVenmo] = React.useState(false);
  const [showChecking, setShowChecking] = React.useState(false);
  const onChange = (event, field) => {
    const newPaymentState = { ...paymentState };
    newPaymentState[field] = event.target.value;
    setPaymentState(newPaymentState);
  };

  React.useEffect(() => {
    setShowPayPal(paymentState.paypal !== "");
    setShowApplePay(paymentState.applePay !== "");
    setShowZelle(paymentState.zelle !== "");
    setShowVenmo(paymentState.venmo !== "");
    setShowChecking(paymentState.accountNumber !== "");
  }, [paymentState]);

  return (
    <div>
      {editProfile ? (
        <div className="mx-3 mt-5">
          <Row className="mb-4" style={headings}>
            <div>Payment Details</div>
          </Row>

          <Row className="mb-1">
            <Col className="d-flex align-items-center">
              <Checkbox
                type="BOX"
                checked={showPayPal ? "checked" : ""}
                onClick={(checked) => setShowPayPal(checked)}
              />
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
                checked={showApplePay ? "checked" : ""}
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
              <Checkbox
                type="BOX"
                checked={showZelle ? "checked" : ""}
                onClick={(checked) => setShowZelle(checked)}
              />
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
              <Checkbox
                checked={showVenmo ? "checked" : ""}
                type="BOX"
                onClick={(checked) => setShowVenmo(checked)}
              />
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
                checked={showChecking ? "checked" : ""}
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
                onChange={(e) => onChange(e, "routingNumber")}
              />
            </Col>
          </Row>
        </div>
      ) : (
        <div className="mx-3 my-3">
          <Row className="mb-4" style={headings}>
            <div>Payment Details</div>
          </Row>

          <Row>
            <Col>
              <h6>PayPal</h6>
              <p style={gray}>
                {paymentState.paypal !== ""
                  ? paymentState.paypal
                  : "No PayPal Provided"}
              </p>
            </Col>
            <Col>
              <h6>Apple Pay</h6>
              <p style={gray}>
                {paymentState.applePay !== ""
                  ? paymentState.applePay
                  : "No Apple Pay Provided"}
              </p>
            </Col>
          </Row>

          <Row>
            <Col>
              <h6>Zelle</h6>
              <p style={gray}>
                {paymentState.applePay !== ""
                  ? paymentState.applePay
                  : "No Apple Pay Provided"}
              </p>
            </Col>
            <Col>
              <h6>Venmo</h6>
              <p style={gray}>
                {paymentState.venmo !== ""
                  ? paymentState.venmo
                  : "No Venmo Provided"}
              </p>
            </Col>
          </Row>

          <Row>
            <Col>
              <h6>Checking Acc. Number</h6>
              <p style={gray}>
                {paymentState.accountNumber !== ""
                  ? paymentState.accountNumber
                  : "No Acct No. Provided"}
              </p>
            </Col>
            <Col>
              <h6>Checking Acc. Routing Number</h6>
              <p style={gray}>
                {paymentState.routingNumber !== ""
                  ? paymentState.routingNumber
                  : "No Routing No. Provided"}
              </p>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default OwnerPaymentSelection;
