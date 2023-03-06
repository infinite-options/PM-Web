import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import moment from "moment";
import AppContext from "../AppContext";
import Header from "../components/Header";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import RepairRequest from "../icons/repair_request.svg";
import RepairStatus from "../icons/repair_status.svg";
import Documents from "../icons/documents.svg";
import QuotesRejected from "../icons/QuotesRejected.svg";
import JobCompleted from "../icons/JobCompleted.svg";
import SearchPM from "../icons/searchPM.svg";
import { get } from "../utils/api";
import {
  headings,
  upcoming,
  upcomingHeading,
  upcomingText,
  actionsNoColor,
  actions,
} from "../utils/styles";

function MaintenanceDashboard(props) {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const { setShowFooter } = props;
  const [profile, setProfile] = useState([]);
  const [upcomingJob, setUpcomingJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);

  let access_token = userData.access_token;

  const sort_quotes = (quotes) => {
    quotes.sort(
      (a, b) => b.priority_n - a.priority_n || b.days_since - a.days_since
    );
    return quotes;
  };

  const fetchProfile = async () => {
    let business_uid = "";
    for (const business of userData.user.businesses) {
      if (business.business_type === "MAINTENANCE") {
        business_uid = business.business_uid;
        // console.log(business_uid);
        break;
      }
    }
    if (business_uid === "") {
      // console.log("no maintenance business found");
    }
    const response = await get(`/businesses?business_uid=${business_uid}`);
    // console.log(response);
    setProfile(response.result[0]);

    const quotes_response = await get(
      `/maintenanceQuotes?quote_business_uid=${business_uid}`
    );
    // console.log("Quotes associated with business")
    // console.log(quotes_response.result)
    const quotes_unsorted = quotes_response.result;
    quotes_unsorted.forEach((quote, i) => {
      const quote_created_date = new Date(Date.parse(quote.quote_created_date));
      const current_date = new Date();
      quotes_unsorted[i].days_since = Math.ceil(
        (current_date.getTime() - quote_created_date.getTime()) /
          (1000 * 3600 * 24)
      );

      quote.priority_n = 0;
      if (quote.priority.toLowerCase() === "high") {
        quote.priority_n = 3;
      } else if (quote.priority.toLowerCase() === "medium") {
        quote.priority_n = 2;
      } else if (quote.priority.toLowerCase() === "low") {
        quote.priority_n = 1;
      }
    });
    setQuotes(sort_quotes(quotes_unsorted));
  };
  //console.log(profile);
  useEffect(() => {
    if (profile !== undefined) {
      setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    setShowFooter(true);
  });

  useEffect(fetchProfile, []);

  const goToQuotesRequested = () => {
    navigate("/quotes-requested");
  };
  const goToJobsCompleted = () => {
    const quotes_rejected = quotes.filter(
      (quote) => quote.request_status === "COMPLETE"
    );
    navigate(`/jobsCompleted`, { state: { quotes: quotes_rejected } });
  };
  const goToQuotesRejectedM = () => {
    const quotes_rejected = quotes.filter(
      (quote) => quote.quote_status === "REJECTED"
    );
    navigate(`/quotesRejectedPM`, { state: { quotes: quotes_rejected } });
  };
  const goToQuotesRejectedY = () => {
    const quotes_rejected = quotes.filter(
      (quote) => quote.quote_status === "REFUSED"
    );
    navigate(`/quotesRejectedM`, { state: { quotes: quotes_rejected } });
  };
  const goToMaintenanceQuotesRequested = () => {
    const quotes_accepted = quotes.filter(
      (quote) => quote.quote_status === "ACCEPTED"
    );
    const quotes_scheduled = quotes.filter(
      (quote) => quote.quote_status === "SCHEDULED"
    );
    const quotes_total = [...quotes_accepted, ...quotes_scheduled];
    navigate(`/quotes-scheduled`, { state: { quotes: quotes_total } });
  };
  const goToQuotesSent = () => {
    const quotes_sent = quotes.filter((quote) => quote.quote_status === "SENT");
    navigate(`/quotes-sent`, { state: { quotes: quotes_sent } });
  };
  const goToSearchPM = () => {
    navigate("/maintenancePropertyManagers");
  };
  // console.log(profile);
  return (
    <div className="h-100">
      <Header title="Home" />

      <Container className="pt-1 mb-5 pb-5">
        <Row style={headings}>
          <div>{profile.business_name}</div>
        </Row>

        {upcomingJob ? (
          <Row style={upcoming} className="mt-2 mb-2">
            <div style={upcomingHeading} className="mt-1 mb-1">
              Upcoming job:
              <br />
              Toilet Plumbing scheduled for
              <br /> Today at 12:00 pm
              <br />
            </div>

            <Col className="mt-1 mb-1">
              <div style={upcomingText}>
                For questions / concerns, feel free to contact the property
                manager
              </div>
            </Col>
            <Col xs={2} style={upcomingText} className="mt-1 mb-1">
              <img src={Phone} alt="Phone" />
            </Col>
            <Col xs={2} style={upcomingText} className="mt-1 mb-1">
              <img src={Message} alt="Message" />
            </Col>
          </Row>
        ) : (
          ""
        )}

        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
          className="mb-4"
        >
          <div style={headings} className="mt-4 mb-1">
            Actions
          </div>
          <Col xs={3} style={actions}>
            <img
              style={{ width: "50px", height: "50px", cursor: "pointer" }}
              src={RepairRequest}
              onClick={goToQuotesRequested}
            />
            <div>Quotes Requested</div>
          </Col>
          <Col xs={3} style={actions}>
            <img
              style={{ width: "50px", height: "50px", cursor: "pointer" }}
              src={Documents}
              onClick={goToQuotesSent}
            />
            <div>Quotes Sent</div>
          </Col>
          <Col xs={3} style={actions}>
            <img
              style={{ width: "50px", height: "50px", cursor: "pointer" }}
              src={RepairStatus}
              onClick={goToMaintenanceQuotesRequested}
            />
            <div>Scheduled Jobs</div>
          </Col>
        </Row>
        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
          className="mt-1 mb-4"
        >
          <Col xs={3} style={actions}>
            <img
              style={{ width: "50px", height: "50px", cursor: "pointer" }}
              src={JobCompleted}
              onClick={goToJobsCompleted}
            />
            <div>Jobs Completed</div>
          </Col>
          <Col xs={3} style={actions}>
            <img
              style={{ width: "50px", height: "50px", cursor: "pointer" }}
              src={QuotesRejected}
              onClick={goToQuotesRejectedM}
            />
            <div>Quotes Rejected by Manager</div>
          </Col>
          <Col xs={3} style={actions}>
            <div>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={QuotesRejected}
                onClick={goToQuotesRejectedY}
              />
              <div>Quotes Rejected by You</div>
            </div>
          </Col>
        </Row>
        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
          className="mt-1 mb-1"
        >
          <Col xs={3} style={actions}>
            <div>
              <img
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={SearchPM}
                onClick={goToSearchPM}
              />
              <div>Search Property Managers</div>
            </div>
          </Col>
          <Col xs={3} style={actionsNoColor}></Col>
          <Col xs={3} style={actionsNoColor}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default MaintenanceDashboard;
