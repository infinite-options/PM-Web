import React from 'react';
import Checkbox from './Checkbox';
import {Container, Form, Button} from 'react-bootstrap';
import {squareForm, pillButton, blue, hidden} from '../utils/styles';

function PropertyAppliances(props) {
  const {state, edit} = props;
  const [applianceState, setApplianceState] = state;
  const appliances = Object.keys(applianceState);
  const toggleAppliance = (appliance) => {
    const newApplianceState = {...applianceState};
    newApplianceState[appliance] = !newApplianceState[appliance];
    setApplianceState(newApplianceState);
  }

  const [newAppliance, setNewAppliance] = React.useState(null);
  const addAppliance = () => {
    const newApplianceState = {...applianceState};
    newApplianceState[newAppliance] = true;
    setApplianceState(newApplianceState);
    setNewAppliance(null);
  }

  return (
    <Container className='my-4'>
      <h6>Appliances</h6>
      {appliances.map((appliance, i) => (
        <div key={i} className='d-flex ps-2 align-items-center'>
          <Checkbox type='BOX' checked={applianceState[appliance]}
            onClick={edit ? () => toggleAppliance(appliance) : () => {}}/>
          <p className='ms-1 mb-1'>{appliance}</p>
        </div>
      ))}
      {!edit ? '' : newAppliance === null ? (
        <div className='d-flex ps-2 align-items-center' onClick={() => setNewAppliance('')}>
          <div style={hidden}>
            <Checkbox type='BOX'/>
          </div>
          <p className='ms-1 mb-1' style={blue}>Add Other +</p>
        </div>
      ) : (
        <div>
          <div className='d-flex ps-2 align-items-center'>
            <Checkbox type='BOX' checked={true}/>
            <Form.Control style={squareForm} value={newAppliance} placeholder='Appliance'
              onChange={e => setNewAppliance(e.target.value)}/>
          </div>
          <div className='text-center my-3'>
            <Button variant='outline-primary' style={pillButton} className='mx-2'
              onClick={() => setNewAppliance(null)}>
              Cancel
            </Button>
            <Button variant='outline-primary' style={pillButton} className='mx-2'
              onClick={addAppliance}>
              Save
            </Button>
          </div>
        </div>
      )}
    </Container>
  );

}

export default PropertyAppliances;
