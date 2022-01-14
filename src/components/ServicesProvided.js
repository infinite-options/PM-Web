import React from 'react';
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import EditIcon from '../icons/EditIcon.svg';
import DeleteIcon from '../icons/DeleteIcon.svg';
import {pillButton, smallPillButton, squareForm, gray} from '../utils/styles';

function ServicesProvided(props) {
  const [serviceState, setServiceState] = props.state;
  const [newService, setNewService] = React.useState(null);
  const emptyService = {
    service_name: '',
    charge: '',
    per: ''
  }
  const addService = () => {
    const newServiceState = [...serviceState];
    newServiceState.push({...newService});
    setServiceState(newServiceState);
    cancelEdit();
  }
  const cancelEdit = () => {
    setNewService(null);
  }
  const editService = (i) => {
    setNewService(serviceState[i]);
  }
  const deleteService = (i) => {
    const newServiceState = [...serviceState];
    newServiceState.splice(i, 1);
    setServiceState(newServiceState);
  }
  const changeNewService = (event, field) => {
    const changedService = {...newService};
    changedService[field] = event.target.value;
    setNewService(changedService);
  }
  return (
    <Container className='px-2'>
      <h6 className='mb-3'>Services you provide:</h6>
      {serviceState.map((service, i) => (
        <div key={i}>
          <div className='d-flex'>
            <div className='flex-grow-1'>
              <h6 className='mb-1'>{service.service_name}</h6>
            </div>
            <div>
              <img src={EditIcon} alt='Edit' className='px-1 mx-2'
                onClick={() => editService(i)}/>
              <img src={DeleteIcon} alt='Delete' className='px-1 mx-2'
                onClick={() => deleteService(i)}/>
            </div>
          </div>
          <p style={gray} className='mb-1'>
            {service.charge} per {service.per}
          </p>
          <hr className='mt-1'/>
        </div>
      ))}
      {newService !== null ? (
        <div>
          <Form.Group className='mx-2 my-3'>
            <Form.Label as='h6' className='mb-0 ms-2'>Service Name</Form.Label>
            <Form.Control style={squareForm} placeholder='Name' value={newService.service_name}
              onChange={(e) => changeNewService(e, 'service_name')}/>
          </Form.Group>
          <Row>
            <Col>
              <Form.Group className='mx-2'>
                <Form.Label as='h6' className='mb-0 ms-2'>Charge</Form.Label>
                <Form.Control style={squareForm} placeholder='$00.00' value={newService.charge}
                  onChange={(e) => changeNewService(e, 'charge')}/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mx-2'>
                <Form.Label as='h6' className='mb-0 ms-2'>Per</Form.Label>
                <Form.Control style={squareForm} placeholder='Hour' value={newService.per}
                  onChange={(e) => changeNewService(e, 'per')}/>
              </Form.Group>
            </Col>
          </Row>
        </div>
      ) : ''}
      {newService === null ? (
        <Button variant='outline-primary' style={smallPillButton}
          onClick={() => setNewService({...emptyService})}>
          Add Service
        </Button>
      ) : (
        <div className='d-flex justify-content-center my-4'>
          <Button variant='outline-primary' style={pillButton} onClick={cancelEdit}
            className='mx-2'>
            Cancel
          </Button>
          <Button variant='outline-primary' style={pillButton} onClick={addService}
            className='mx-2'>
            Add Service
          </Button>
        </div>
      )}
    </Container>
  );
}

export default ServicesProvided;
