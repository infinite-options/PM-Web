import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../Header";
import { get } from "../../utils/api";
import AppContext from "../../AppContext";
import moment from "moment";

import { subHeading, subText, blueRight, redRight } from "../../utils/styles";
import ManagerFooter from "./ManagerFooter";

function ManagerPaymentHistory(props) {
  const navigate = useNavigate();
  const { userData } = React.useContext(AppContext);
  const { access_token, user } = userData;
  console.log("Hello");
  const [userPayments, setUserPayments] = React.useState([]);

  React.useState(async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length < 1) {
      console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
    } else {
      management_buid = management_businesses[0].business_uid;
    }
    const response = await get(
      `/managerPayments?manager_id=${management_buid}`
    );

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
        leftFn={() => navigate("/manager")}
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
      <ManagerFooter tab={"EXPENSES"} />
    </div>
  );
}

export default ManagerPaymentHistory;
