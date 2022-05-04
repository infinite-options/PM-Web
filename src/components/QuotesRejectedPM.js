import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {headings, subText, tileImg, greenPill, orangePill, redPill,} from "../utils/styles";
import No_Image from "../icons/No_Image_Available.jpeg";

function QuotesRejectedPM(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const quotes = location.state.quotes;


  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Quotes Rejected (PM)"
        leftText="< Back"
        leftFn={() => navigate("/maintenance")}
        rightText="Sort by"
      />

      <Container className="pt-1 mb-5">
          <Row style={headings}>
              <div>Quotes Rejected</div>
          </Row>

          {quotes.length > 0 && quotes.map((quote, i) => (
            <Row className="mt-2 mb-2" key={i}>
              <Col xs={4}>
                  <div style={tileImg}>
                      {JSON.parse(quote.images).length > 0 ? (
                          <img src={JSON.parse(quote.images)[0]} alt='Quote' className='w-100 h-100'
                               style={{borderRadius: '4px', objectFit: 'cover'}}/>
                      ) : <img src={No_Image} alt='No Repair Image'
                               className='h-100 w-100' style={{borderRadius: '4px', objectFit: 'cover'}}/>}
                  </div>
              </Col>
            <Col className=''>
                <div className='d-flex justify-content-between align-items-center'>
                    <h5 className='mb-0' style={{fontWeight: '600'}}>
                        {quote.title}
                    </h5>
                    {quote.priority === 'Low' ? <p style={greenPill} className='mb-0'>Low Priority</p>
                        : quote.priority === 'Medium' ? <p style={orangePill} className='mb-0'>Medium Priority</p>
                            : quote.priority === 'High' ? <p style={redPill} className='mb-0'>High Priority</p>:
                                <p style={greenPill} className='mb-0'>No Priority</p>}
                </div>
                <div className='d-flex justify-content-between align-items-center' style={subText}>

                        {quote.description}


                </div>

            </Col>
              {/*<Col xs={8} style={{ padding: "5px" }}>*/}
              {/*  <div>*/}
              {/*    <Row style={subHeading}>*/}
              {/*      <Col>{quote.title}</Col>*/}
              {/*      <Col xs={5}>*/}
              {/*        {quote.priority === 'Low' ? <img src={LowPriority} />*/}
              {/*            : quote.priority === 'Medium' ? <img src={MediumPriority} />*/}
              {/*                : quote.priority === 'High' ? <img src={HighPriority} />*/}
              {/*                    : ''}*/}
              {/*      </Col>*/}
              {/*    </Row>*/}
              {/*    <Row style={subText}>*/}
              {/*      {quote.description}*/}
              {/*      <hr />*/}
              {/*    </Row>*/}
              {/*    <Row style={red} className="mt=0 pt=0">*/}
              {/*      Price too high*/}
              {/*    </Row>*/}
              {/*  </div>*/}
              {/*</Col>*/}
            </Row>
          ))}

      </Container>
      <Footer tab={"DASHBOARD"} />
    </div>
  );
}

export default QuotesRejectedPM;
