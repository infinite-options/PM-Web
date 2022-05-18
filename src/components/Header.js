import {Container, Row, Col, Button} from 'react-bootstrap';
import {mediumBold} from '../utils/styles';

function Header(props) {
  const headerContainer = {
    backgroundColor: "#F5F5F5",
  };
  const textButton = {
    background: "none",
    border: "none",
    color: "#007AFF",
  };
  return (
    <Container fluid style={headerContainer} className="mb-4">
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
          xs={5}
          className="text-center d-flex flex-column justify-content-end"
        >
          <h6
            className="mt-5 mb-2"
            style={{
              font: "normal normal 600 17px/20px SFProText-Semibold",
              letterSpacing: "0px",
              color: "#007AFF",
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
