import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HighPriority from "../icons/highPriority.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import {
  headings,
  subHeading,
  subText,
  blue,
  hidden,
  tileImg,
} from "../utils/styles";
import { get } from "../utils/api";
import AppContext from "../AppContext";
import moment from "moment";

function ScheduledJobs(props) {
  const navigate = useNavigate();
  const { userData } = React.useContext(AppContext);
  const [jobs, setJobs] = React.useState([]);
  const loadJobs = async () => {
    let business_uid = "";
    for (const business of userData.user.businesses) {
      if (business.business_type === "MAINTENANCE") {
        business_uid = business.business_uid;
        break;
      }
    }
    if (business_uid === "") {
      // console.log('no maintenance business found');
    }
    const response = await get(
      `/maintenanceQuotes?quote_business_uid=${business_uid}`
    );
    // console.log(response);
    setJobs(response.result);
  };
  React.useEffect(loadJobs, []);
  const requestedQuotes = jobs.filter(
    (job) => job.quote_status === "REQUESTED"
  );
  const sentQuotes = jobs.filter((job) => job.quote_status === "SENT");
  const scheduledJobs = jobs.filter((job) => job.quote_status === "ACCEPTED");
  // console.log(requestedQuotes);
  // console.log(sentQuotes);
  // console.log(scheduledJobs);
  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="All Requests"
        leftText="< Back"
        leftFn={() => navigate("/maintenance")}
        rightText="Sort by"
      />
      <Container className="pt-1 mb-4">
        <Row style={headings}>
          <div>Quotes Requested</div>
        </Row>
        {requestedQuotes.length === 0 ? "None" : ""}
        {requestedQuotes.map((quote, i) => (
          <Row className="mt-2 mb-2" key={i}>
            <Col style={{ padding: "5px" }}>
              <div style={tileImg}>
                {JSON.parse(quote.images).length > 0 ? (
                  <img
                    src={JSON.parse(quote.images)[0]}
                    alt="Quote"
                    className="w-100 h-100"
                    style={{ borderRadius: "4px", objectFit: "cover" }}
                  />
                ) : (
                  ""
                )}
              </div>
            </Col>
            <Col xs={8} style={{ padding: "5px" }}>
              <div
                onClick={() =>
                  navigate(`/detailQuoteRequest/${quote.maintenance_quote_uid}`)
                }
              >
                <Row style={subHeading}>
                  <Col>{quote.title}</Col>
                  <Col xs={5}>
                    {quote.priority === "Low" ? (
                      <img alt="low priority" src={LowPriority} />
                    ) : quote.priority === "Medium" ? (
                      <img alt="medium priority" src={MediumPriority} />
                    ) : quote.priority === "High" ? (
                      <img alt="high priority" src={HighPriority} />
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
                <Row style={subText}>
                  {quote.description}
                  <hr />
                </Row>
                <Row style={blue}>
                  Received:
                  {moment(quote.quote_created_date).format(
                    " dddd, MMM DD, YYYY"
                  )}
                </Row>
              </div>
            </Col>
          </Row>
        ))}
      </Container>
      {/*<Container className="pt-1 mb-4">*/}
      {/*  <Row style={headings}>*/}
      {/*    <div>Upcoming, Scheduled</div>*/}
      {/*  </Row>*/}
      {/*  {scheduledJobs.length === 0 ? 'None' : ''}*/}
      {/*  {scheduledJobs.map((quote, i) => (*/}
      {/*    <Row className="mt-2 mb-2" key={i}>*/}
      {/*      <Col style={{ padding: "5px" }}>*/}
      {/*        <div style={tileImg}>*/}
      {/*          {JSON.parse(quote.images).length > 0 ? (*/}
      {/*            <img src={JSON.parse(quote.images)[0]} alt='Quote' className='w-100 h-100'*/}
      {/*              style={{borderRadius: '4px', objectFit: 'cover'}}/>*/}
      {/*          ) : ''}*/}
      {/*        </div>*/}
      {/*      </Col>*/}
      {/*      <Col xs={8} style={{ padding: "5px" }}>*/}
      {/*        <div onClick={() => navigate(`/detailQuote/${quote.maintenance_quote_uid}`)}>*/}
      {/*          <Row style={subHeading}>*/}
      {/*            <Col>{quote.title}</Col>*/}
      {/*            <Col xs={5}>*/}
      {/*              {quote.priority === 'Low' ? <img src={LowPriority} />*/}
      {/*              : quote.priority === 'Medium' ? <img src={MediumPriority} />*/}
      {/*              : quote.priority === 'High' ? <img src={HighPriority} />*/}
      {/*              : ''}*/}
      {/*            </Col>*/}
      {/*          </Row>*/}
      {/*          <Row style={subText}>*/}
      {/*            {quote.description}*/}
      {/*            <hr/>*/}
      {/*          </Row>*/}
      {/*          <Row style={blue}>*/}
      {/*            Scheduled for*/}
      {/*            {moment(quote.scheduled_date).format(' dddd, MMM DD, YYYY')}*/}
      {/*          </Row>*/}
      {/*        </div>*/}
      {/*      </Col>*/}
      {/*    </Row>*/}
      {/*  ))}*/}
      {/*</Container>*/}
      {/*<Container className="pt-1 mb-4 pb-5">*/}
      {/*  <Row style={headings}>*/}
      {/*    <div>Quotes Sent</div>*/}
      {/*  </Row>*/}
      {/*  {sentQuotes.length === 0 ? 'None' : ''}*/}
      {/*  {sentQuotes.map((quote, i) => (*/}
      {/*    <Row className="mt-2 mb-2" key={i}>*/}
      {/*      <Col style={{ padding: "5px" }}>*/}
      {/*        <div style={tileImg}>*/}
      {/*          {JSON.parse(quote.images).length > 0 ? (*/}
      {/*            <img src={JSON.parse(quote.images)[0]} alt='Quote' className='w-100 h-100'*/}
      {/*              style={{borderRadius: '4px', objectFit: 'cover'}}/>*/}
      {/*          ) : ''}*/}
      {/*        </div>*/}
      {/*      </Col>*/}
      {/*      <Col xs={8} style={{ padding: "5px" }}>*/}
      {/*        <div onClick={() => navigate(`/quotesAccepted/${quote.maintenance_quote_uid}`)}>*/}
      {/*          <Row style={subHeading}>*/}
      {/*            <Col>{quote.title}</Col>*/}
      {/*            <Col xs={5}>*/}
      {/*              {quote.priority === 'Low' ? <img src={LowPriority} />*/}
      {/*              : quote.priority === 'Medium' ? <img src={MediumPriority} />*/}
      {/*              : quote.priority === 'High' ? <img src={HighPriority} />*/}
      {/*              : ''}*/}
      {/*            </Col>*/}
      {/*          </Row>*/}
      {/*          <Row style={subText}>*/}
      {/*            {quote.description}*/}
      {/*            <hr/>*/}
      {/*          </Row>*/}
      {/*        </div>*/}
      {/*      </Col>*/}
      {/*    </Row>*/}
      {/*  ))}*/}
      {/*</Container>*/}
      <div style={hidden}>footer space</div>
      <Footer tab={"DASHBOARD"} />
    </div>
  );
}

export default ScheduledJobs;
