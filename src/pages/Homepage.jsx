import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Landing1_1 from "../icons/Landing1_1.svg";
import Landing1_2 from "../icons/Landing1_2.png";

import Landing2_1 from "../icons/Landing2_1.jpg";
import Landing2_2 from "../icons/Landing2_2.jpg";
import Landing2_3 from "../icons/Landing2_3.jpg";
import Landing2_4 from "../icons/Landing2_4.jpg";
import Landing2_5 from "../icons/Landing2_5.jpg";

import Next from "../icons/Next.svg";
import Landing3_1 from "../icons/Landing3_1.png";
import Landing3_2 from "../icons/Landing3_2.png";
import Landing3_3 from "../icons/Landing3_3.png";

import AppContext from "../AppContext";
function Homepage() {
  const navigate = useNavigate();
  const { userData } = React.useContext(AppContext);
  React.useEffect(() => {
    if (userData.access_token !== null) {
      login();
    }
  }, []);
  const login = () => {
    navigate("/login");
  };
  const signup = () => {
    navigate("/signup");
  };
  const signupexisting = () => {
    // navigate('/signup');
    navigate("/signupexisting");
  };
  return (
    <div className="d-flex">
      <Container fluid className="w-100">
        <Row
          className="d-flex justify-content-center aling-items-center"
          style={{
            // marginTop: "20rem",
            padding: "2rem",
            backgroundColor: "#ffffff",
            height: "400px",
          }}
        >
          <Col>
            <img
              src={Landing1_1}
              style={{
                height: "50%",
                width: "70%",
                objectFit: "contain",
                objectPosition: "right",
              }}
              alt="PM"
            />
          </Col>
          <Col
            xs={7}
            style={{
              padding: "2rem",
            }}
          >
            <Row
              className="d-flex justify-content-center align-items-center"
              style={{
                padding: "5px 0px 5px 0px",
                color: "#219dbc",
                fontFamily: "normal normal normal 46px Helvetica",
                fontSize: "46px",
              }}
            >
              {" "}
              Buy. Sell. Rent. Manage. Finance.
            </Row>

            <Row
              className="d-flex justify-content-center align-items-center"
              style={{
                marginTop: "2rem",
                textAlign: "center",
                fontFamily: "normal normal normal 20px Helvetica",
                fontSize: "20px",
              }}
            >
              We're not your average property management company. We're here to
              support property owners, managers, renters, service professionals,
              and investors.
            </Row>
            <Row
              className="d-flex justify-content-center align-items-center"
              style={{
                marginTop: "2rem",
              }}
            >
              <Button
                style={{
                  backgroundColor: "#628191",
                  borderColor: "#628191",
                  // borderRadius: "10px",
                  color: "white",
                  width: "10rem",
                  font: "normal normal normal 18px Avenir-Light",
                }}
              >
                Learn More
              </Button>
            </Row>
          </Col>
          <Col>
            <img
              src={Landing1_2}
              style={{ height: "70%", width: "70%", objectFit: "cover" }}
              alt="PM"
            />
          </Col>
        </Row>
        <Row
          className="d-flex justify-content-center aling-items-center"
          style={{
            backgroundColor: "#229ebc",
            padding: "2rem",
            height: "600px",
          }}
        >
          <Col
            xs={4}
            className="d-flex justify-content-center aling-items-center"
            style={{ position: "relative" }}
          >
            <img
              src={Landing2_1}
              style={{
                height: "491px",
                width: "350px",
                objectFit: "cover",
                objectPosition: "center",
                borderTopLeftRadius: "25rem",
                borderTopRightRadius: "25rem",
                position: "absolute",
              }}
              alt="PM"
            />
            <div
              style={{
                backgroundColor: "white",
                position: "absolute",
                width: "350px",
                top: "369px",
                height: "160px",
                padding: "10px",
              }}
            >
              <div style={{ font: "normal normal normal 20px Helvetica-Bold" }}>
                Owners{" "}
              </div>
              <div style={{ font: "normal normal normal 16px Helvetica" }}>
                Why use our software to manage your portfolio <br />
                <br />
              </div>
              <div style={{ textAlign: "right" }}>
                <img src={Next} style={{ height: "55px", width: "55px" }} />
              </div>
            </div>
          </Col>
          <Col
            xs={4}
            className="d-flex justify-content-center aling-items-center"
            style={{ position: "relative" }}
          >
            <img
              src={Landing2_2}
              style={{
                height: "491px",
                width: "350px",
                objectFit: "cover",
                objectPosition: "center",
                borderTopLeftRadius: "25rem",
                borderTopRightRadius: "25rem",
                position: "absolute",
              }}
              alt="PM"
            />
            <div
              style={{
                backgroundColor: "white",
                position: "absolute",
                width: "350px",
                top: "369px",
                height: "160px",
                padding: "10px",
              }}
            >
              <div style={{ font: "normal normal normal 20px Helvetica-Bold" }}>
                Property Managers
              </div>
              <div style={{ font: "normal normal normal 16px Helvetica" }}>
                Why use our software to manage your clients <br />
                <br />
              </div>
              <div style={{ textAlign: "right" }}>
                <img src={Next} style={{ height: "55px", width: "55px" }} />
              </div>
            </div>
          </Col>
          <Col
            xs={4}
            className="d-flex justify-content-center aling-items-center"
            style={{ position: "relative" }}
          >
            <img
              src={Landing2_3}
              style={{
                height: "491px",
                width: "350px",
                objectFit: "cover",
                objectPosition: "center",
                borderTopLeftRadius: "25rem",
                borderTopRightRadius: "25rem",
                position: "absolute",
              }}
              alt="PM"
            />
            <div
              style={{
                backgroundColor: "white",
                position: "absolute",
                width: "350px",
                top: "369px",
                height: "160px",
                padding: "10px",
              }}
            >
              <div style={{ font: "normal normal normal 20px Helvetica-Bold" }}>
                Renters{" "}
              </div>
              <div style={{ font: "normal normal normal 16px Helvetica" }}>
                How to pay rent, manage maintenance requests, review documents,
                sign electronically
              </div>
              <div style={{ textAlign: "right" }}>
                <img src={Next} style={{ height: "55px", width: "55px" }} />
              </div>
            </div>
          </Col>
        </Row>
        <Row
          className="d-flex justify-content-center aling-items-center"
          style={{
            backgroundColor: "#229ebc",
            padding: "2rem",
            height: "600px",
          }}
        >
          <Col
            className="d-flex justify-content-center aling-items-center"
            style={{ position: "relative" }}
          >
            <img
              src={Landing2_4}
              style={{
                height: "491px",
                width: "350px",
                objectFit: "cover",
                objectPosition: "center",
                borderTopLeftRadius: "25rem",
                borderTopRightRadius: "25rem",
                position: "absolute",
              }}
              alt="PM"
            />
            <div
              style={{
                backgroundColor: "white",
                position: "absolute",
                width: "350px",
                top: "369px",
                height: "160px",
                padding: "10px",
              }}
            >
              <div style={{ font: "normal normal normal 20px Helvetica-Bold" }}>
                Maintenance{" "}
              </div>
              <div style={{ font: "normal normal normal 16px Helvetica" }}>
                How to see Quote Requests, see Jobs Awarded, Schedule Jobs,
                Complete Tickets, Invoice, Get Paid
              </div>
              <div style={{ textAlign: "right" }}>
                <img src={Next} style={{ height: "55px", width: "55px" }} />
              </div>
            </div>
          </Col>
          <Col
            className="d-flex justify-content-center aling-items-center"
            style={{ position: "relative" }}
          >
            <img
              src={Landing2_5}
              style={{
                height: "491px",
                width: "350px",
                objectFit: "cover",
                objectPosition: "center",
                borderTopLeftRadius: "25rem",
                borderTopRightRadius: "25rem",
                position: "absolute",
              }}
              alt="PM"
            />
            <div
              style={{
                backgroundColor: "white",
                position: "absolute",
                width: "350px",
                top: "369px",
                height: "160px",
                padding: "10px",
              }}
            >
              <div style={{ font: "normal normal normal 20px Helvetica-Bold" }}>
                Investors{" "}
              </div>
              <div style={{ font: "normal normal normal 16px Helvetica" }}>
                How to see our portfolio, select a property, become a client{" "}
                <br />
                <br />
              </div>
              <div style={{ textAlign: "right" }}>
                <img src={Next} style={{ height: "55px", width: "55px" }} />
              </div>
            </div>
          </Col>
        </Row>
        <Row
          className="d-flex justify-content-center aling-items-center"
          style={{
            backgroundColor: "#ffffff",
            padding: "2rem",
            height: "300px",
          }}
        >
          <div
            style={{
              color: "#219dbc",
              font: "normal normal normal 46px Quicksand-Regular",
              fontSize: "46px",
              textAlign: "center",
            }}
          >
            Recent Blog Posts
          </div>
          <Col
            xs={4}
            className="d-flex justify-content-center aling-items-center"
            style={{ position: "relative" }}
          >
            <img
              src={Landing3_1}
              style={{
                height: "239px",
                width: "319px",
                objectFit: "cover",
                objectPosition: "center",
                position: "absolute",
                // border: "1px solid red",
              }}
              alt="PM"
            />
            <div
              style={{
                backgroundColor: "white",
                position: "absolute",
                width: "319px",
                top: "239px",
                height: "100px",
                border: "1px solid grey",
              }}
            >
              <div
                style={{
                  font: "normal normal normal 24px Quicksand-Regular",
                  padding: "10px",
                }}
              >
                10 Things to Look For in a Rental Property
              </div>
            </div>
          </Col>
          <Col
            xs={4}
            className="d-flex justify-content-center aling-items-center"
            style={{ position: "relative" }}
          >
            <img
              src={Landing3_2}
              style={{
                height: "239px",
                width: "319px",
                objectFit: "cover",
                objectPosition: "center",
                position: "absolute",
              }}
              alt="PM"
            />
            <div
              style={{
                backgroundColor: "white",
                position: "absolute",
                width: "319px",
                top: "239px",
                height: "100px",
                border: "1px solid grey",
              }}
            >
              <div
                style={{
                  font: "normal normal normal 24px Quicksand-Regular",
                  padding: "10px",
                }}
              >
                Forecasting: A Look Into the 2023 Real Estate Market
              </div>
            </div>
          </Col>
          <Col
            xs={4}
            className="d-flex justify-content-center aling-items-center"
            style={{ position: "relative" }}
          >
            <img
              src={Landing3_3}
              style={{
                height: "239px",
                width: "319px",
                objectFit: "cover",
                objectPosition: "center",
                position: "absolute",
              }}
              alt="PM"
            />
            <div
              style={{
                backgroundColor: "white",
                position: "absolute",
                width: "319px",
                top: "239px",
                height: "100px",
                border: "1px solid grey",
              }}
            >
              <div
                style={{
                  font: "normal normal normal 24px Quicksand-Regular",
                  padding: "10px",
                }}
              >
                Buying Your First Investment Property 101{" "}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Homepage;
