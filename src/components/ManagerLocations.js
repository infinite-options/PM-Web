import React from 'react';
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import EditIcon from '../icons/EditIcon.svg';
import DeleteIcon from '../icons/DeleteIcon.svg';
import {pillButton, smallPillButton, squareForm, gray} from '../utils/styles';

function ManagerLocations(props) {
  const [locationState, setLocationState] = props.state;
  const [newLocation, setNewLocation] = React.useState(null);
  const emptyLocation = {
    location: '',
    distance: ''
  }
  const addLocation = () => {
    const newLocationState = [...locationState];
    newLocationState.push({...newLocation});
    setLocationState(newLocationState);
    cancelEdit();
  }
  const cancelEdit = () => {
    setNewLocation(null);
  }
  const editLocation = (i) => {
    setNewLocation(locationState[i]);
  }
  const deleteLocation = (i) => {
    const newLocationState = [...locationState];
    newLocationState.splice(i, 1);
    setLocationState(newLocationState);
  }
  const changeNewLocation = (event, field) => {
    const changedLocation = {...newLocation};
    changedLocation[field] = event.target.value;
    setNewLocation(changedLocation);
  }
  return (
    <Container className='px-2 py-4'>
      <h6 className='mb-3'>Locations of Service:</h6>
      {locationState.map((location, i) => (
        <div key={i}>
          <div className='d-flex'>
            <div className='flex-grow-1'>
              <h6 className='mb-1'>{location.location}</h6>
            </div>
            <div>
              <img src={EditIcon} alt='Edit' className='px-1 mx-2'
                onClick={() => editLocation(i)}/>
              <img src={DeleteIcon} alt='Delete' className='px-1 mx-2'
                onClick={() => deleteLocation(i)}/>
            </div>
          </div>
          <p style={gray} className='mb-1'>
            (+)(-) {location.distance} miles
          </p>
          <hr className='mt-1'/>
        </div>
      ))}
      {newLocation !== null ? (
        <Container>
          <Row className='my-3'>
            <Col xs={8} className='ps-0'>
              <Form.Group>
                <Form.Label as='h6' className='mb-0 ms-2'>Location</Form.Label>
                <Form.Control style={squareForm} placeholder='City, State' value={newLocation.location}
                  onChange={(e) => changeNewLocation(e, 'location')}/>
              </Form.Group>
            </Col>
            <Col className='px-0'>
              <Form.Group>
                <Form.Label as='h6' className='mb-0 ms-2'>(+)(-) miles</Form.Label>
                <Form.Control style={squareForm} placeholder='5' value={newLocation.distance}
                  onChange={(e) => changeNewLocation(e, 'distance')}/>
              </Form.Group>
            </Col>
          </Row>
        </Container>
      ) : ''}
      {newLocation=== null ? (
        <Button variant='outline-primary' style={smallPillButton}
          onClick={() => setNewLocation({...emptyLocation})}>
          Add Location
        </Button>
      ) : (
        <div className='d-flex justify-content-center my-4'>
          <Button variant='outline-primary' style={pillButton} onClick={cancelEdit}
            className='mx-2'>
            Cancel
          </Button>
          <Button variant='outline-primary' style={pillButton} onClick={addLocation}
            className='mx-2'>
            Add Location
          </Button>
        </div>
      )}
    </Container>
  );
}

export default ManagerLocations;
