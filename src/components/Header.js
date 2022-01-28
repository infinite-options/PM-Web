import {Container, Row, Col, Button} from 'react-bootstrap';
import {mediumBold} from '../utils/styles';

function Header(props) {
  const headerContainer = {
    backgroundColor: '#F5F5F5'
  }
  const textButton = {
    background: 'none',
    border: 'none',
    color: '#007AFF'
  }
  return (
    <Container fluid style={headerContainer} className='mb-4'>
      <Row className='px-3'>
        {props.leftText ? (
          <Col xs={2} className='d-flex flex-column justify-content-end align-items-start px-0'>
            <Button style={textButton} onClick={props.leftFn} className='px-0'>
              {props.leftText}
            </Button>
          </Col>
        ) : <Col/>}
        <Col xs={8} className='text-center d-flex flex-column justify-content-end px-0'>
          <h6 className='mt-5 mb-2' style={mediumBold}>{props.title}</h6>
        </Col>
        {props.rightText ? (
          <Col xs={2} className='d-flex flex-column justify-content-end align-items-end px-0'>
            <Button style={textButton} onClick={props.rightFn} className='px-0'>
              {props.rightText}
            </Button>
          </Col>
        ) : <Col/>}
      </Row>
    </Container>
  );
}

export default Header
