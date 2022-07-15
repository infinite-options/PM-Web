import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { get } from "../utils/api";
import AppContext from "../AppContext";
import moment from "moment";

import { subHeading, subText, blueRight, redRight } from "../utils/styles";

function OwnerPaymentHistory(props) {
  const navigate = useNavigate();
  const { userData } = React.useContext(AppContext);
  const { access_token, user } = userData;
  console.log("Hello");
  const [userPayments, setUserPayments] = React.useState([]);

  React.useState(async () => {
    const response = await get(`/ownerPayments?owner_id=${user.user_uid}`);

    setUserPayments(response.result);
  }, []);

  const paymentsByMonth = {};
  for (const payment of userPayments) {
    const month = moment(payment.payment_date).format("MMMM YYYY");
    if (month in paymentsByMonth) {
      paymentsByMonth[month].total += payment.amount;
      paymentsByMonth[month].payments.push(payment);
    } else {
      paymentsByMonth[month] = {
        total: payment.amount,
        payments: [payment],
      };
    }
  }
  const sortedMonths = Object.keys(paymentsByMonth).sort((a, b) => {
    const aDate = moment(a);
    const bDate = moment(b);
    if (aDate < bDate) return 1;
    else if (aDate > bDate) return -1;
    else return 0;
  });
  for (const month of sortedMonths) {
    paymentsByMonth[month].payments = paymentsByMonth[month].payments.sort(
      (a, b) => {
        const aDate = moment(a.payment_date);
        const bDate = moment(b.payment_date);
        if (aDate < bDate) return 1;
        else if (aDate > bDate) return -1;
        else return 0;
      }
    );
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div
      className="h-100 d-flex flex-column pb-5"
      style={{
        background: "#E9E9E9 0% 0% no-repeat padding-box",
        borderRadius: "10px",
        opacity: 1,
        height: "100vh",
      }}
    >
      <Header
        title="Payment"
        leftText="< Back"
        leftFn={() => navigate("/owner")}
      />
      <div
        className="mx-2 my-2 p-3"
        style={{
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        {sortedMonths.map((month) => {
          const { total, payments } = paymentsByMonth[month];
          return (
            <div>
              <Row className="mt-4 mb-1 mx-2">
                <Col style={subHeading}>{month}</Col>
                <Col style={redRight}>{formatter.format(total)}</Col>
              </Row>
              {payments.map((payment) => (
                <div
                  style={{ border: "1px solid #707070" }}
                  className="mt-2 mx-2 p-2"
                >
                  <Row style={subHeading} className="mx-2">
                    <Col>
                      {payment.description}{" "}
                      {payment.purchase_notes && `(${payment.purchase_notes})`}
                    </Col>
                  </Row>
                  <Row className="mx-2">
                    <Col style={subText}>
                      {moment(payment.payment_date).format("MMM D, YYYY")}
                    </Col>
                    <Col style={blueRight} className="mt-2">
                      {formatter.format(payment.amount)}
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <Footer tab={"DASHBOARD"} />
    </div>
  );
}

export default OwnerPaymentHistory;
