import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../components/Header";
import ConfirmCheck from "../icons/confirmCheck.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import {
  headings,
  formLabel,
  bluePillButton,
  pillButton,
  subHeading,
} from "../utils/styles";

function RentPayment(props) {
  const navigate = useNavigate();
  const [stripePayment, setStripePayment] = useState(false);
  const [paymentConfirm, setPaymentConfirm] = useState(false);
  const requestTitleRef = React.createRef();
  const requestDescriptionRef = React.createRef();
  const tagPriorityRef = React.createRef();

  const submitForm = () => {
    const requestTitle = requestTitleRef.current.value;
    const requestDescription = requestDescriptionRef.current.value;
    const tagPriority = tagPriorityRef.current.value;

    props.onConfirm(requestTitle, requestDescription, tagPriority);
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
              Payment Received
            </Row>
            <Row style={subHeading} className="mt-2 mb-2">
              Rent for Dec, 2021: $500
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
            <div style={headings}>Pay Rent</div>
            <div style={subHeading}>Rent due for Dec, 2021: $500</div>
          </Row>
          <Form>
            <Form.Group className="mt-3 mb-4">
              <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                Full Name
              </Form.Label>
              <Form.Control
                style={{ borderRadius: 0 }}
                ref={requestTitleRef}
                placeholder="Ex: Paint"
              />
            </Form.Group>
            <Form.Group className="mt-3 mb-4">
              <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                Message
              </Form.Label>
              <Form.Control
                style={{ borderRadius: 0 }}
                as="textarea"
                ref={requestDescriptionRef}
                placeholder="Message"
              />
            </Form.Group>
          </Form>
          <div className="text-center mt-5" hidden={stripePayment}>
            <Row
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
            <Form>
              <Form.Group className="mt-3 mb-4">
                <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                  Card Number
                </Form.Label>
                <Form.Control
                  style={{ borderRadius: 0 }}
                  ref={requestTitleRef}
                  placeholder="Ex: Paint"
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mt-3 mb-4">
                    <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                      CVV
                    </Form.Label>
                    <Form.Control
                      style={{ borderRadius: 0 }}
                      ref={requestDescriptionRef}
                      placeholder="***"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mt-3 mb-4">
                    <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                      Zip
                    </Form.Label>
                    <Form.Control
                      style={{ borderRadius: 0 }}
                      ref={requestDescriptionRef}
                      placeholder="*****"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mt-3 mb-4">
                    <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                      Exp MM
                    </Form.Label>
                    <Form.Control
                      style={{ borderRadius: 0 }}
                      ref={requestDescriptionRef}
                      placeholder="**"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mt-3 mb-4">
                    <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                      Exp YY
                    </Form.Label>
                    <Form.Control
                      style={{ borderRadius: 0 }}
                      ref={requestDescriptionRef}
                      placeholder="**"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
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
                    onClick={() => navigate("/tenant")}
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
                    onClick={() => setPaymentConfirm(true)}
                  >
                    Pay Now
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </Container>
      )}
    </div>
  );
}

export default RentPayment;
