import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  headings,
  subText,
  tileImg,
  greenPill,
  orangePill,
  redPill,
  blue,
  xSmall,
} from "../utils/styles";
import No_Image from "../icons/No_Image_Available.jpeg";

function MaintenanceQuotesScheduled(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const quotes = location.state.quotes;
  const quotes_accepted = quotes.filter(
    (quote) => quote.quote_status === "ACCEPTED"
  );
  const quotes_scheduled = quotes.filter(
    (quote) => quote.quote_status === "SCHEDULED"
  );

  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Quotes Accepted"
        leftText="< Back"
        leftFn={() => navigate("/maintenance")}
        rightText="Sort by"
      />

      <Container className="pt-1 mb-5">
        <Row className="mb-4" style={headings}>
          <div>Scheduled Jobs</div>
        </Row>

        {quotes_scheduled &&
          quotes.length > 0 &&
          quotes_scheduled.map((quote, i) => (
            <Row
              className="mt-2 mb-2"
              key={i}
              onClick={() =>
                navigate(`./${quote.maintenance_quote_uid}`, {
                  state: { quote: quote },
                })
              }
            >
              <Col xs={4}>
                <div style={tileImg}>
                  {JSON.parse(quote.images).length > 0 ? (
                    <img
                      src={JSON.parse(quote.images)[0]}
                      alt="Quote"
                      className="w-100 h-100"
                      style={{ borderRadius: "4px", objectFit: "cover" }}
                    />
                  ) : (
                    <img
                      src={No_Image}
                      alt="No Repair Image"
                      className="h-100 w-100"
                      style={{ borderRadius: "4px", objectFit: "cover" }}
                    />
                  )}
                </div>
              </Col>
              <Col className="">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0" style={{ fontWeight: "600" }}>
                    {quote.title}
                  </h5>
                  {quote.priority === "Low" ? (
                    <p style={greenPill} className="mb-0">
                      Low Priority
                    </p>
                  ) : quote.priority === "Medium" ? (
                    <p style={orangePill} className="mb-0">
                      Medium Priority
                    </p>
                  ) : quote.priority === "High" ? (
                    <p style={redPill} className="mb-0">
                      High Priority
                    </p>
                  ) : (
                    <p style={greenPill} className="mb-0">
                      No Priority
                    </p>
                  )}
                </div>

                <p
                  className="pt-1 d-flex justify-content-between align-items-center"
                  style={subText}
                >
                  {quote.description}
                </p>

                <div className="d-flex ">
                  <div className="flex-grow-1 d-flex flex-column justify-content-center">
                    <p style={blue} className="mb-0">
                      {quote.address}
                      {quote.unit !== "" ? " " + quote.unit : ""}, {quote.city},
                      {quote.state}, {quote.zip}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          ))}
      </Container>

      <Container className="pt-1 mb-5">
        <Row className="mb-4" style={headings}>
          <div>Quotes Accepted</div>
        </Row>

        {quotes_accepted &&
          quotes.length > 0 &&
          quotes_accepted.map((quote, i) => (
            <Row
              className="mt-2 mb-2"
              key={i}
              //  onClick={() =>
              //      navigate(`./${quote.maintenance_quote_uid}`, { state: {quote: quote }})}
              onClick={() =>
                navigate(
                  `/maintenanceScheduleRepair/${quote.maintenance_quote_uid}`,
                  {
                    state: { quote: quote },
                  }
                )
              }
            >
              <Col xs={4}>
                <div style={tileImg}>
                  {JSON.parse(quote.images).length > 0 ? (
                    <img
                      src={JSON.parse(quote.images)[0]}
                      alt="Quote"
                      className="w-100 h-100"
                      style={{ borderRadius: "4px", objectFit: "cover" }}
                    />
                  ) : (
                    <img
                      src={No_Image}
                      alt="No Repair Image"
                      className="h-100 w-100"
                      style={{ borderRadius: "4px", objectFit: "cover" }}
                    />
                  )}
                </div>
              </Col>
              <Col className="">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0" style={{ fontWeight: "600" }}>
                    {quote.title}
                  </h5>
                  {quote.priority === "Low" ? (
                    <p style={greenPill} className="mb-0">
                      Low Priority
                    </p>
                  ) : quote.priority === "Medium" ? (
                    <p style={orangePill} className="mb-0">
                      Medium Priority
                    </p>
                  ) : quote.priority === "High" ? (
                    <p style={redPill} className="mb-0">
                      High Priority
                    </p>
                  ) : (
                    <p style={greenPill} className="mb-0">
                      No Priority
                    </p>
                  )}
                </div>

                <p
                  className="pt-1 d-flex justify-content-between align-items-center"
                  style={subText}
                >
                  {quote.description}
                </p>

                <div className="d-flex ">
                  <div className="flex-grow-1 d-flex flex-column justify-content-center">
                    <p style={blue} className="mb-0">
                      {quote.address}
                      {quote.unit !== "" ? " " + quote.unit : ""}, {quote.city},
                      {quote.state}, {quote.zip}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          ))}
      </Container>

      <Footer tab={"DASHBOARD"} />
    </div>
  );
}

export default MaintenanceQuotesScheduled;
