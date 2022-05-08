import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Header from "../components/Header";
import Emergency from "../icons/Emergency.svg";
import Document from "../icons/Document.svg";
import Property from "../icons/Property.svg";
import Repair from "../icons/Repair.svg";
import UserSearch from "../icons/UserSearch.svg";
import {
  tileImg,
  xSmall,
  smallLine,
  mediumBold,
  green,
  red,
} from "../utils/styles";

function OwnerDashboard(props) {
  const { setStage, properties } = props;

  return (
    <div style={{ background: "#E9E9E9 0% 0% no-repeat padding-box" }}>
      <Header title="Dashboard" />
      <Container className="px-3 pb-5 mb-5">
        <div
          className="px-2 p-2"
          style={{
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            borderRadius: "10px",
            opacity: 1,
          }}
        >
          <h5 style={mediumBold}>Overview</h5>
          <Row
            className="mx-2 my-2 p-3"
            style={{
              background: "#93EE9C 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col style={mediumBold}>Properties</Col>
            <Col style={mediumBold}>{properties.length}</Col>
          </Row>
          <Row
            className="mx-2 my-2 p-3"
            style={{
              background: "#93EE9C 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col style={mediumBold}>Cash Flow</Col>
            <Col style={mediumBold}>$3000</Col>
          </Row>
          <Row
            className="mx-2 my-2 p-3"
            style={{
              background: "#93EE9C 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col style={mediumBold}>Revenue</Col>
            <Col style={mediumBold}>$5850</Col>
          </Row>
          <Row
            className="mx-2 my-2 p-3"
            style={{
              background: "#FFBCBC 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col style={mediumBold}>Expenses</Col>
            <Col style={mediumBold}>$1250</Col>
          </Row>
          {/* <div>
            <h5 style={mediumBold}>Cashflow</h5>
            <h5 style={{ ...green, ...mediumBold }} className="mb-0">
              $3450/mo
            </h5>
            <hr style={{ opacity: 1 }} className="mt-1" />
          </div>
          <div>
            <h5 style={mediumBold}>Revenue</h5>
            <h5 style={{ ...green, ...mediumBold }} className="mb-0">
              $6000/mo
            </h5>
            <hr style={{ opacity: 1 }} className="mt-1" />
          </div>
          <div>
            <h5 style={mediumBold}>Expenses</h5>
            <h5 style={{ ...red, ...mediumBold }} className="mb-0">
              $1550/mo
            </h5>
            <hr style={{ opacity: 1 }} className="mt-1" />
          </div>
          <div>
            <h5 style={mediumBold}>Taxes</h5>
            <h5 style={{ ...red, ...mediumBold }} className="mb-0">
              $150/mo
            </h5>
            <hr style={{ opacity: 1 }} className="mt-1" />
          </div>
          <div>
            <h5 style={mediumBold}>Mortgage</h5>
            <h5 style={{ ...red, ...mediumBold }} className="mb-0">
              $850/mo
            </h5>
            <hr style={{ opacity: 1 }} className="mt-1" />
          </div> */}
        </div>

        <Row className="px-2">
          <Col
            onClick={() => setStage("PROPERTIES")}
            className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
            style={{
              height: "87px",
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col>
              <img src={Property} alt="Property" style={{ width: "50px" }} />
            </Col>
            <Col>
              <p
                style={{ ...xSmall, ...smallLine, ...mediumBold }}
                className="mb-0"
              >
                {"    "}
                Properties
              </p>
            </Col>
          </Col>
          <Col
            className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
            style={{
              height: "87px",
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col>
              <img src={Document} alt="Document" style={{ width: "50px" }} />
            </Col>
            <Col>
              <p
                style={{ ...xSmall, ...smallLine, ...mediumBold }}
                className="mb-0"
              >
                Lease <br /> Documents
              </p>
            </Col>
          </Col>
        </Row>
        <Row className="px-2">
          <Col
            className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
            style={{
              height: "87px",
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col>
              <img src={Document} alt="Document" style={{ width: "50px" }} />
            </Col>
            <Col>
              {" "}
              <p
                style={{ ...xSmall, ...smallLine, ...mediumBold }}
                className="mb-0"
              >
                Manager <br /> Documents
              </p>
            </Col>
          </Col>
          <Col
            className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
            style={{
              height: "87px",
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col>
              <img src={Repair} alt="Repair" style={{ width: "50px" }} />
            </Col>
            <Col>
              <p
                style={{ ...xSmall, ...smallLine, ...mediumBold }}
                className="mb-0"
              >
                Request a <br /> Repair
              </p>
            </Col>
          </Col>
        </Row>
        <Row className="px-2">
          <Col
            className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
            style={{
              height: "87px",
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col>
              <img src={Emergency} alt="Emergency" style={{ width: "50px" }} />
            </Col>
            <Col>
              <p
                style={{ ...xSmall, ...smallLine, ...mediumBold }}
                className="mb-0"
              >
                Emergency
              </p>
            </Col>
          </Col>
          <Col
            className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
            style={{
              height: "87px",
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 3px 3px #00000029",
              borderRadius: "20px",
            }}
          >
            <Col>
              <img src={UserSearch} alt="Search" style={{ width: "50px" }} />
            </Col>
            <Col>
              <p
                style={{ ...xSmall, ...smallLine, ...mediumBold }}
                className="mb-0"
              >
                Search <br /> Property <br /> Managers
              </p>
            </Col>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OwnerDashboard;
