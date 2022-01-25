import {Container, Row, Col} from 'react-bootstrap';
import Checkbox from './Checkbox';

function PropertyUtilities(props) {
  const {state, edit} = props;
  const [utilityState, setUtilityState] = state;
  const utilities = Object.keys(utilityState);

  const setUtility = (utility, value) => {
    const newUtilityState = {...utilityState};
    newUtilityState[utility] = value;
    setUtilityState(newUtilityState);
  }

  const removeUtility = (utility) => {
    setUtility(utility, false);
  }
  const addUtility = (utility) => {
    setUtility(utility, true);
  }

  return (
    <Container className='my-4'>
      <Row>
        <Col xs={6}>
          <h6>Utilities Paid by</h6>
        </Col>
        <Col className='text-center'>
          <h6>Owner</h6>
        </Col>
        <Col className='text-center'>
          <h6>Tenant</h6>
        </Col>
      </Row>
      {utilities.map((utility, i) => (
        <Row key={i} className='mb-2'>
          <Col xs={6}>
            {utility}
          </Col>
          <Col className='d-flex justify-content-center align-items-center'>
            <Checkbox type='CIRCLE' checked={utilityState[utility]}
              onClick={edit ? () => addUtility(utility) : () => {}}/>
          </Col>
          <Col className='d-flex justify-content-center align-items-center'>
            <Checkbox type='CIRCLE' checked={!utilityState[utility]}
              onClick={edit ? () => removeUtility(utility) : () => {}}/>
          </Col>
        </Row>
      ))}
    </Container>
  );
}

export default PropertyUtilities;
