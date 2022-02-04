import React from 'react';
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import EditIcon from '../icons/EditIcon.svg';
import DeleteIcon from '../icons/DeleteIcon.svg';
import {pillButton, smallPillButton, squareForm, gray} from '../utils/styles';

function ManagerFees(props) {
  // const [feeState, setFeeState] = props.state;
  const {feeState, setFeeState} = props;
  const [newFee, setNewFee] = React.useState(null);
  const emptyFee = {
    fee_name: '',
    fee_type: '',
    charge: '',
    of: '',
    frequency: ''
  }
  const addFee = () => {
    const newFeeState = [...feeState];
    newFeeState.push({...newFee});
    setFeeState(newFeeState);
    cancelEdit();
  }
  const cancelEdit = () => {
    setNewFee(null);
  }
  const editFee = (i) => {
    setNewFee(feeState[i]);
  }
  const deleteFee = (i) => {
    const newFeeState = [...feeState];
    newFeeState.splice(i, 1);
    setFeeState(newFeeState);
  }
  const changeNewFee = (event, field) => {
    const changedFee = {...newFee};
    changedFee[field] = event.target.value;
    setNewFee(changedFee);
  }
  return (
    <Container className='px-2'>
      <h6 className='mb-3'>Fees you charge:</h6>
      {feeState.map((fee, i) => (
        <div key={i}>
          <div className='d-flex'>
            <div className='flex-grow-1'>
              <h6 className='mb-1'>{fee.fee_name}</h6>
            </div>
            <div>
              <img src={EditIcon} alt='Edit' className='px-1 mx-2'
                onClick={() => editFee(i)}/>
              <img src={DeleteIcon} alt='Delete' className='px-1 mx-2'
                onClick={() => deleteFee(i)}/>
            </div>
          </div>
          <p style={gray} className='mb-1'>
            {fee.charge} {fee.of !== '' ? `of ${fee.of}` : ''} {fee.frequency}
          </p>
          <hr className='mt-1'/>
        </div>
      ))}
      {newFee !== null ? (
        <Container>
          <Row className='my-3'>
            <Col className='ps-0'>
              <Form.Group>
                <Form.Label as='h6' className='mb-0 ms-2'>Fee Name</Form.Label>
                <Form.Control style={squareForm} placeholder='Service Charge' value={newFee.fee_name}
                  onChange={(e) => changeNewFee(e, 'fee_name')}/>
              </Form.Group>
            </Col>
            <Col className='px-0'>
              <Form.Group>
                <Form.Label as='h6' className='mb-0 ms-2'>Charge Type</Form.Label>
                <Form.Control style={squareForm} placeholder='%' value={newFee.fee_type}
                  onChange={(e) => changeNewFee(e, 'fee_type')}/>
              </Form.Group>
            </Col>
          </Row>
          <Row className='my-3'>
            <Col className='ps-0'>
              <Form.Group>
                <Form.Label as='h6' className='mb-0 ms-2'>Charge</Form.Label>
                <Form.Control style={squareForm} placeholder='10%' value={newFee.charge}
                  onChange={(e) => changeNewFee(e, 'charge')}/>
              </Form.Group>
            </Col>
            <Col className='ps-0'>
              <Form.Group>
                <Form.Label as='h6' className='mb-0 ms-2'>Of</Form.Label>
                <Form.Control style={squareForm} placeholder='Gross Rent' value={newFee.of}
                  onChange={(e) => changeNewFee(e, 'of')}/>
              </Form.Group>
            </Col>
            <Col className='px-0'>
              <Form.Group>
                <Form.Label as='h6' className='mb-0 ms-2'>Frequency</Form.Label>
                <Form.Control style={squareForm} placeholder='Monthly' value={newFee.frequency}
                  onChange={(e) => changeNewFee(e, 'frequency')}/>
              </Form.Group>
            </Col>
          </Row>
        </Container>
      ) : ''}
      {newFee=== null ? (
        <Button variant='outline-primary' style={smallPillButton}
          onClick={() => setNewFee({...emptyFee})}>
          Add Fee
        </Button>
      ) : (
        <div className='d-flex justify-content-center my-4'>
          <Button variant='outline-primary' style={pillButton} onClick={cancelEdit}
            className='mx-2'>
            Cancel
          </Button>
          <Button variant='outline-primary' style={pillButton} onClick={addFee}
            className='mx-2'>
            Add Fee
          </Button>
        </div>
      )}
    </Container>
  );
}

export default ManagerFees;
