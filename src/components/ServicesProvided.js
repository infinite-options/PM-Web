import React from 'react';
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import EditIcon from '../icons/EditIcon.svg';
import DeleteIcon from '../icons/DeleteIcon.svg';
import {pillButton, smallPillButton, squareForm, gray, small, red, hidden} from '../utils/styles';

function ServicesProvided(props) {
  const [serviceState, setServiceState] = props.state;
  const [newService, setNewService] = React.useState(null);
  const [editingService, setEditingService] = React.useState(null);
  const emptyService = {
    service_name: '',
    charge: '',
    per: ''
  }
  const [errorMessage, setErrorMessage] = React.useState('');
  const addService = () => {
    if (newService.service_name === '' || newService.charge === '' || newService.per === '') {
      setErrorMessage('Please fill out all fields');
      return;
    }
    const newServiceState = [...serviceState];
    newServiceState.push({...newService});
    setServiceState(newServiceState);
    setNewService(null);
    setErrorMessage('');
  }
  const cancelEdit = () => {
    setNewService(null);
    setErrorMessage('');
    if (editingService !== null) {
      const newServiceState = [...serviceState];
      newServiceState.push(editingService);
      setServiceState(newServiceState);
    }
    setEditingService(null);
  }
  const editService = (i) => {
    const newServiceState = [...serviceState];
    const service = newServiceState.splice(i, 1)[0];
    setServiceState(newServiceState);
    setEditingService(service);
    setNewService({...service});
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
  const required = (
    errorMessage === 'Please fill out all fields' ? (
      <span style={red} className='ms-1'>*</span>
    ) : ''
  );
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
            ${service.charge} / {service.per}
          </p>
          <hr className='mt-1'/>
        </div>
      ))}
      {newService !== null ? (
        <div>
          <Form.Group className='mx-2 my-3'>
            <Form.Label as='h6' className='mb-0 ms-2'>
              Service Name {newService.service_name === '' ? required : ''}
            </Form.Label>
            <Form.Control style={squareForm} placeholder='Toilet Plumbing' value={newService.service_name}
              onChange={(e) => changeNewService(e, 'service_name')}/>
          </Form.Group>
          <Row className='mb-2'>
            <Col>
              <Form.Group className='mx-2'>
                <Form.Label as='h6' className='mb-0 ms-2'>
                  Charge {newService.charge === '' ? required : ''}
                </Form.Label>
                <Form.Control style={squareForm} placeholder='20' value={newService.charge}
                  onChange={(e) => changeNewService(e, 'charge')}/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mx-2'>
                <Form.Label as='h6' className='mb-0 ms-2'>
                  Per {newService.per === '' ? required : ''}
                </Form.Label>
                <Form.Control style={squareForm} placeholder='Hour' value={newService.per}
                  onChange={(e) => changeNewService(e, 'per')}/>
              </Form.Group>
            </Col>
          </Row>
          <div className='text-center' style={errorMessage === '' ? hidden : {}}>
            <p style={{...red, ...small}}>{errorMessage || 'error'}</p>
          </div>
        </div>
      ) : ''}
      {newService === null ? (
        <Button variant='outline-primary' style={smallPillButton}
          onClick={() => setNewService({...emptyService})}>
          Add Service
        </Button>
      ) : (
        <div className='d-flex justify-content-center mb-4'>
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
