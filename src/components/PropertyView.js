import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';

import {tileImg, gray, greenPill} from '../utils/styles';
import Phone from '../icons/Phone.svg';
import Message from '../icons/Message.svg';

function PropertyView(props) {

  const {listed_rent, address, city, state, zip, manager_id, manager_first_name, manager_last_name, manager_} = props.property;

  return (
    <Container>
      <div style={{...tileImg, height: '200px'}}/>
      <h5 className='mt-2 mb-0' style={{fontWeight: '600'}}>
        ${listed_rent}/mo
      </h5>
      <p style={gray} className='mt-1 mb-2'>
        {address}, {city}, {state} {zip}
      </p>
      <div className='d-flex'>
        <p style={greenPill} className='mb-0'>Rent Paid</p>
      </div>
      <Row>

      </Row>
    </Container>
  );

}

export default PropertyView;
