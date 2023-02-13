import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useParams } from "react-router";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import * as ReactBootStrap from "react-bootstrap";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import { makeStyles } from "@material-ui/core/styles";
import Header from "./Header";
import SideBar from "./tenantComponents/SideBar";
import TenantFooter from "./tenantComponents/TenantFooter";
import StripePayment from "./StripePayment";
import PayPal from "./PayPal";
// import ApplePay from "./ApplePay";
import WF_Logo from "../icons/WF-Logo.png";
import BofA_Logo from "../icons/BofA-Logo.png";
import Chase_Logo from "../icons/Chase-Logo.png";
import Citi_Logo from "../icons/Citi-Logo.jpg";
import ConfirmCheck from "../icons/confirmCheck.svg";
import { get, post } from "../utils/api";
import {
  headings,
  bluePillButton,
  subHeading,
  squareForm,
  pillButton,
} from "../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value

      border: "0.5px solid grey ",
    },
  },
});
function PaymentPage(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { purchase_uid } = useParams();
  const location = useLocation();
  const [totalSum, setTotalSum] = useState(location.state.amount);
  const selectedProperty = location.state.selectedProperty;
  const purchaseUIDs = location.state.purchaseUIDs;
  const purchases = location.state.purchases;
  const [stripePayment, setStripePayment] = useState(false);
  const [paymentConfirm, setPaymentConfirm] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);
  const [purchase, setPurchase] = useState({});
  const [message, setMessage] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [amount, setAmount] = useState(totalSum);
  const [allPurchases, setAllPurchases] = useState([]);
  const [bankPayment, setBankPayment] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
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

  useEffect(async () => {
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

  const cancel = () => setStripePayment(false);
  const submit = () => {
    cancel();
    setPaymentConfirm(true);
  };
  const submitPayment = async () => {
    setShowSpinner(true);

    let newPayment = {};
    if (allPurchases.length === 1) {
      // console.log(allPurchases[0]);
      newPayment = {
        pay_purchase_id: allPurchases[0].purchase_uid,
        //Need to make change here
        amount: parseFloat(amount),
        payment_notes: message,
        charge_id: confirmationCode,
        payment_type: paymentType,
      };
      await post("/payments", newPayment);
    } else {
      for (let purchase of allPurchases) {
        // console.log(purchase);
        newPayment = {
          pay_purchase_id: purchase.purchase_uid,
          //Need to make change here
          amount: parseFloat(purchase.amount_due - purchase.amount_paid),
          payment_notes: message,
          charge_id: confirmationCode,
          payment_type: paymentType,
        };
        await post("/payments", newPayment);
      }
    }
    setShowSpinner(false);
    submit();
  };
  console.log(purchases);
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
              paymentConfirm === false ? navigate(-1) : console.log("");
            }}
          />
          <Row
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontSize: "28px",
                padding: "10px",
              }}
            >
              {selectedProperty.address},&nbsp;
              {selectedProperty.city},&nbsp;
              {selectedProperty.state}&nbsp;
              {selectedProperty.zip}
            </div>
            {paymentConfirm ? (
              <div>
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
                    }}
                    style={bluePillButton}
                  >
                    Go to payment history
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <Row>
                  {/* {purchases.length > 1 ? (
                  purchases.map((purchase) => {
                    return (
                      <div style={headings}>
                        Pay Fees {purchase.description && `(Multiple Fees)`}
                      </div>
                    );
                  })
                ) : (
                  <div style={headings}>
                    Pay Fees{" "}
                    {purchases[0].description &&
                      `(${purchases[0].description})`}
                  </div>
                )} */}
                  <Row className="m-3">
                    <Table
                      responsive="md"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Description</TableCell>
                          <TableCell>Type</TableCell>{" "}
                          <TableCell>Date Due</TableCell>{" "}
                          <TableCell>Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      {purchases.map((purchase) => {
                        return (
                          <TableBody>
                            <TableRow>
                              <TableCell>{purchase.description}</TableCell>
                              <TableCell>{purchase.purchase_type}</TableCell>
                              <TableCell>
                                {purchase.next_payment.substring(0, 10)}
                              </TableCell>
                              <TableCell>${purchase.amount_due}</TableCell>
                            </TableRow>
                          </TableBody>
                        );
                      })}
                    </Table>
                  </Row>

                  {stripePayment || bankPayment ? (
                    <div style={subHeading}>Amount to be paid: ${amount}</div>
                  ) : null}
                </Row>
                <div
                  style={{ margin: "0px 0px 100px 0px" }}
                  className="mt-5"
                  hidden={stripePayment || bankPayment}
                >
                  <h2>Total Payment: ${totalSum}</h2>
                  <Form.Group>
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      placeholder="PMTEST"
                      style={squareForm}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </Form.Group>
                  <Row className="text-center mt-5">
                    <Col>
                      <a
                        href="https://www.bankofamerica.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          onClick={() => {
                            setBankPayment(true);
                            setPaymentType("BANK OF AMERICA");
                          }}
                          src={BofA_Logo}
                          style={{
                            width: "160px",
                            height: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </a>
                    </Col>
                    <Col>
                      <a
                        href="https://www.chase.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          onClick={() => {
                            setBankPayment(true);
                            setPaymentType("CHASE");
                          }}
                          src={Chase_Logo}
                          style={{
                            width: "160px",
                            height: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </a>
                    </Col>
                    <Col>
                      <a
                        href="https://www.citi.com/login?deepdrop=true&checkAuth=Y"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          onClick={() => {
                            setBankPayment(true);
                            setPaymentType("CITI");
                          }}
                          src={Citi_Logo}
                          style={{
                            width: "160px",
                            height: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </a>
                    </Col>
                    <Col>
                      <a
                        href="https://www.wellsfargo.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          onClick={() => {
                            setBankPayment(true);
                            setPaymentType("WELLS FARGO");
                          }}
                          src={WF_Logo}
                          style={{
                            width: "160px",
                            height: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </a>
                    </Col>
                  </Row>
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
                <div hidden={!bankPayment}>
                  <div
                    style={{
                      border: "1px solid black",
                      borderRadius: "10px",
                      padding: "10px",
                      margin: "20px",
                    }}
                  >
                    <Form.Group>
                      <Form.Label>Please enter confirmation code</Form.Label>
                      <Form.Control
                        placeholder="Confirmation Code"
                        style={squareForm}
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div className="text-center mt-2">
                    {showSpinner ? (
                      <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                        <ReactBootStrap.Spinner
                          animation="border"
                          role="status"
                        />
                      </div>
                    ) : (
                      ""
                    )}
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
              </div>
            )}
          </Row>
          <div hidden={responsive.showSidebar} className="w-100 mt-3">
            <TenantFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
