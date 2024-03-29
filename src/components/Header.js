import { Container, Row, Col, Button } from "react-bootstrap";
import { mediumBold } from "../utils/styles";

function Header(props) {
  const headerContainer = {
    backgroundColor: "#F5F5F5",
  };
  let className = props.customClass;
  if (!className) {
    className = "mb-4";
  }
  const textButton = {
    background: "none",
    border: "none",
    color: "#000000",
  };
  return (
    <Container fluid style={headerContainer} className={className}>
      <Row>
        {props.leftText ? (
          <Col className="d-flex flex-column justify-content-end">
            <Button style={textButton} onClick={props.leftFn}>
              {props.leftText}
            </Button>
          </Col>
        ) : (
          <Col />
        )}
        <Col
          xs={6}
          className="text-center d-flex flex-column justify-content-end"
        >
          <h6
            className="mt-5 mb-2"
            style={{
              font: "normal normal 600 17px/20px SFProText-Semibold",
              letterSpacing: "0px",
              color: "#000000",
            }}
          >
            {props.title}
          </h6>
        </Col>
        {props.rightText ? (
          <Col className="d-flex flex-column justify-content-end">
            <Button style={textButton} onClick={props.rightFn}>
              {props.rightText}
            </Button>
          </Col>
        ) : (
          <Col />
        )}
      </Row>
    </Container>
  );
}

export default Header;
