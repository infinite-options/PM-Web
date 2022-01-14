import {Container, Row, Col, Button} from 'react-bootstrap';

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
      <Row>
        {props.back ? (
          <Col className='d-flex flex-column justify-content-end'>
            <Button style={textButton} onClick={props.back}>
              {'< Back'}
            </Button>
          </Col>
        ) : <Col/>}
        <Col xs={5} className='text-center d-flex flex-column justify-content-end'>
          <h6 className='mt-5 mb-2'>{props.title}</h6>
        </Col>
        <Col/>
      </Row>
    </Container>
  );
}

export default Header
