import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

import HighPriority from "../icons/highPriority.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import Reject from "../icons/Reject.svg";
import AppContext from "../AppContext";
import Header from "../components/Header";
import {
  actions,
  headings,
  pillButton,
  redPill,
  subHeading,
  subText,
  blueBorderButton,
  redPillButton,
  formLabel,
  bluePillButton,
  red,
  small,
} from "../utils/styles";

function PMRepairRequestDetail(props) {
  const navigate = useNavigate();
  const [morePictures, setMorePictures] = useState(false);
  const [addBufferAmount, setAddBufferAmount] = useState(false);
  const [rejectQuote, setRejectQuote] = useState(false);
  const [quoteRejected, setQuoteRejected] = useState(false);
  const [quote, setQuote] = useState(false);
  return (
    <div className="h-100">
      <Header
        title="Repairs"
        leftText="< Back"
        //leftFn={() => navigate("/maintenance")}
        rightText="Edit"
      />

      <Container className="pt-1 mb-4">
        <Row style={headings}>
          <div>New Repair Request</div>
        </Row>
        <Row className="pt-1 mb-4">
          <div style={subHeading}>Title (character limit: 15)</div>
          <div style={subText}>Bathroom leaking</div>
        </Row>
        <Row className="pt-1 mb-4">
          <div style={subHeading}>Description</div>
          <div style={subText}>The toilet plumbing is leaking at the base.</div>
        </Row>
        <Row className="pt-1 mb-4">
          <div className="pt-1 mb-2" style={subHeading}>
            Pictures from tenant
          </div>
          <div
            className="pt-1 mb-2"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Col xs={3} style={actions}></Col>
            <Col xs={3} style={actions}></Col>
            <Col xs={3} style={actions}></Col>
          </div>
          <div className="pt-1 mb-2">
            <Button
              style={pillButton}
              variant="outline-primary"
              onClick={() => setMorePictures(!morePictures)}
            >
              Request more pictures
            </Button>
          </div>
        </Row>
        <Row>
          <Row className="pt-1 mb-4" hidden={!morePictures}>
            <div className="pt-1 mb-2" style={subHeading}>
              Request more pictures
            </div>

            <Form.Group className="mt-3 mb-4">
              <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                Description of what kind of pictures needed
              </Form.Label>
              <Form.Control
                style={{ borderRadius: 0 }}
                //ref={requestTitleRef}
                placeholder="Can you pls share more pictures with the Shower model number?"
                as="textarea"
              />
            </Form.Group>

            <Row className="pt-1 mb-2">
              <Col
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  style={pillButton}
                  variant="outline-primary"
                  onClick={() => setMorePictures(false)}
                >
                  Cancel
                </Button>
              </Col>
              <Col
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Button style={bluePillButton}>Send Request</Button>
              </Col>
            </Row>
          </Row>

          <div style={subHeading} className="pt-1 mb-2">
            Tag Priority
          </div>
          <Col xs={4}>
            <img src={HighPriority} style={{ opacity: "1" }} />
          </Col>
          <Col xs={4}>
            <img src={MediumPriority} style={{ opacity: "0.5" }} />
          </Col>
          <Col xs={4}>
            <img src={LowPriority} style={{ opacity: "0.5" }} />
          </Col>
        </Row>
      </Container>
      <hr
        style={{
          border: "1px dashed #000000",
          borderStyle: "none none dashed",
          backgroundColor: "white",
        }}
      />
      <Container className="pt-1 mb-4">
        <Row style={headings}>
          <div>Joe’s Plumbing: Quote</div>
        </Row>
        <Row hidden={!quoteRejected}>
          <div style={red}>Quote Rejected</div>
          <div style={small}>Reason for rejecting the quote</div>
          <div style={red}>Price too high</div>
        </Row>
        <Row className="pt-1 mb-2">
          <div style={subHeading}>Sealing base - labor cost</div>
          <div style={subText}>$30.00 one-time cost</div>
        </Row>
        <hr />
        <Row className="pt-1 mb-2" hidden={quoteRejected}>
          <Col
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              style={blueBorderButton}
              variant="outline-primary"
              onClick={() => setAddBufferAmount(!addBufferAmount)}
            >
              Add buffer amount
            </Button>
          </Col>
          <Col
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              style={redPill}
              onClick={() => setRejectQuote(!rejectQuote)}
            >
              Reject Quote
            </Button>
          </Col>
        </Row>
        <Row className="pt-1 mb-4" hidden={!addBufferAmount}>
          <Form.Group className="mt-3 mb-4">
            <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
              Buffer Amt. note
            </Form.Label>
            <Form.Control
              style={{ borderRadius: 0 }}
              //ref={requestTitleRef}
              as="textarea"
              placeholder="Use this money if extra work is needed. For anything more than this amount, contact me immediately before doing the work."
            />
          </Form.Group>
          <Form.Group className="mt-3 mb-4">
            <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
              Buffer Amt.
            </Form.Label>
            <Form.Control
              style={{ borderRadius: 0 }}
              //ref={requestTitleRef}
              placeholder="(+)$30.00"
            />
          </Form.Group>

          <Row className="pt-1 mb-2">
            <Col
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Button
                style={pillButton}
                variant="outline-primary"
                onClick={() => setAddBufferAmount(false)}
              >
                Cancel
              </Button>
            </Col>
            <Col
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Button style={bluePillButton} onClick={() => setQuote(!quote)}>
                Add Amount
              </Button>
            </Col>
          </Row>
        </Row>
        <Row className="pt-1 mb-4" hidden={!rejectQuote}>
          <Form.Group className="mt-3 mb-4">
            <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
              Reason for rejecting the quote
            </Form.Label>
            <Form.Control
              style={{ borderRadius: 0 }}
              //ref={requestTitleRef}
              as="textarea"
              placeholder="Price too high"
            />
          </Form.Group>

          <Row className="pt-1 mb-2" hidden={quoteRejected}>
            <Col
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Button
                style={pillButton}
                variant="outline-primary"
                onClick={() => setRejectQuote(false)}
              >
                Cancel
              </Button>
            </Col>
            <Col
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Button
                style={redPillButton}
                onClick={() => {
                  setQuoteRejected(true);
                  setRejectQuote(false);
                }}
              >
                Reject Quote
              </Button>
            </Col>
          </Row>
        </Row>
        <Row className="pt-1 ">
          <div style={subHeading}>Earliest Availability</div>
          <div className="px-4 ">
            <Col style={subText}>Date</Col>
            <Col style={subText}>Monday, Jan 1, 2022</Col>
          </div>
        </Row>
        <hr />
        <Row style={headings}>
          <div>Hector’s Plumbing: Quote</div>
        </Row>
        <Row className="pt-1">
          <div style={subHeading}>Sealing base - labor cost</div>
          <div style={subText}>$30.00 one-time cost</div>
        </Row>
        <hr />
        <Row className="pt-1">
          <Col
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Button style={blueBorderButton} variant="outline-primary">
              Add buffer amount
            </Button>
          </Col>
          <Col
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              style={redPill}
              onClick={() => setRejectQuote(!rejectQuote)}
            >
              Reject Quote
            </Button>
          </Col>
        </Row>
        <Row className="pt-1 ">
          <div style={subHeading}>Earliest Availability</div>
          <div className="px-4 ">
            <Col style={subText}>Date</Col>
            <Col style={subText}>Monday, Jan 1, 2022</Col>
          </div>
        </Row>
      </Container>
      <hr />
      <Row className="pt-1 mb-4" hidden={!quote}>
        <Col
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            style={pillButton}
            variant="outline-primary"
            //onClick={() => setAddBufferAmount(false)}
          >
            Reject Quote
          </Button>
        </Col>
        <Col
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Button style={bluePillButton}>Accept Quote</Button>
        </Col>
      </Row>
    </div>
  );
}

export default PMRepairRequestDetail;
