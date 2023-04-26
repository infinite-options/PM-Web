import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "../Checkbox";
import { squareForm, hidden, gray, headings } from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "2px 2px",
      border: "0.5px solid grey ",
      wordBreak: "break-word",
    },
    width: "100%",
    tableLayout: "fixed",
  },
});
function ManagerPaymentSelection(props) {
  const classes = useStyles();
  const { editProfile, paymentState, setPaymentState } = props;
  const { paypal, applePay, zelle, venmo, accountNumber, routingNumber } =
    paymentState;
  const [showPayPal, setShowPayPal] = useState(false);
  const [showApplePay, setShowApplePay] = useState(false);
  const [showZelle, setShowZelle] = useState(false);
  const [showVenmo, setShowVenmo] = useState(false);
  const [showChecking, setShowChecking] = useState(false);
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
    <div
      className="mx-3 my-3 p-2"
      style={{
        background: "#E9E9E9 0% 0% no-repeat padding-box",
        borderRadius: "10px",
        opacity: 1,
      }}
    >
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
                maxLength="9"
                onChange={(e) => onChange(e, "routingNumber")}
              />
            </Col>
          </Row>
        </div>
      ) : (
        <div className="my-3">
          <Row className="mb-4" style={headings}>
            <div>Payment Details</div>
          </Row>

          <Row className="mx-3">
            <Table
              classes={{ root: classes.customTable }}
              size="small"
              responsive="md"
            >
              <TableHead>
                <TableRow>
                  <TableCell>PayPal</TableCell>
                  <TableCell>Apple Pay</TableCell>
                  <TableCell>Zelle</TableCell>
                  <TableCell>Venmo</TableCell>
                  <TableCell>Checking Acc. Number</TableCell>
                  <TableCell>Checking Acc. Routing Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {paymentState.paypal !== ""
                      ? paymentState.paypal
                      : "No PayPal Provided"}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {paymentState.applePay !== ""
                      ? paymentState.applePay
                      : "No Apple Pay Provided"}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {paymentState.applePay !== ""
                      ? paymentState.applePay
                      : "No Zelle Provided"}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {paymentState.venmo !== ""
                      ? paymentState.venmo
                      : "No Venmo Provided"}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {paymentState.accountNumber !== ""
                      ? paymentState.accountNumber
                      : "No Acct No. Provided"}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {paymentState.routingNumber !== ""
                      ? paymentState.routingNumber
                      : "No Routing No. Provided"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Row>
        </div>
      )}
    </div>
  );
}

export default ManagerPaymentSelection;
