import React from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import AppContext from '../AppContext';
import {pillButton, squareForm, tileImg, xSmall, bold} from '../utils/styles';
import {post} from '../utils/api';
import Heart from '../icons/Heart.svg';
import Checkbox from './Checkbox';
import PropertyAppliances from './PropertyAppliances';
import PropertyUtilities from './PropertyUtilities';
import PropertyImages from './PropertyImages';

function PropertyForm(props) {
  const {userData} = React.useContext(AppContext);
  const {user} = userData;
  const applianceState = React.useState({
    Microwave: false,
    Dishwasher: false,
    Refrigerator: false,
    Washer: false,
    Dryer: false,
    Range: false
  });
  const utilityState = React.useState({
    Electricity: false,
    Trash: false,
    Water: false,
    Wifi: false,
    Gas: false
  });
  const imageState = React.useState([]);
  const [address, setAddress] = React.useState('');
  const [unit, setUnit] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [zip, setZip] = React.useState('');
  const [type, setType] = React.useState('');
  const [numBeds, setNumBeds] = React.useState('');
  const [numBaths, setNumBaths] = React.useState('');
  const [area, setArea] = React.useState('');
  const [rent, setRent] = React.useState('');
  const [deposit, setDeposit] = React.useState('');
  const [petsAllowed, setPetsAllowed] = React.useState(false);
  const [depositForRent, setDepositForRent] = React.useState(false);

  const submitForm = async () => {
    const newProperty = {
      owner_id: user.user_uid,
      manager_id: '',
      address: address,
      unit: unit,
      city: city,
      state: state,
      zip: zip,
      property_type: type,
      num_beds: numBeds,
      num_baths: numBaths,
      area: area,
      listed_rent: rent,
      deposit: deposit,
      appliances: JSON.stringify(applianceState[0]),
      utilities: JSON.stringify(utilityState[0]),
      pets_allowed: petsAllowed,
      deposit_for_rent: depositForRent
    };
    const files = imageState[0];
    let i = 0;
    for (const file of imageState[0]) {
      let key = (file.coverPhoto ? 'img_cover' : `img_${i++}`)
      newProperty[key] = file.file;
    }
    console.log(newProperty);
    console.log(files);
    const response = await post('/properties', newProperty, null, files);
    props.onAdd();
  }



  return (
    <div className='mx-2'>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>Address</Form.Label>
        <Form.Control style={squareForm} placeholder='283 Barley St' value={address}
          onChange={(e) => setAddress(e.target.value)}/>
      </Form.Group>
      <div className='d-flex my-3'>
        <Form.Group className='mx-2'>
          <Form.Label as='h6' className='mb-0 ms-2'>Unit</Form.Label>
          <Form.Control style={squareForm} placeholder='#122' value={unit}
            onChange={(e) => setUnit(e.target.value)}/>
        </Form.Group>
        <Form.Group className='mx-2'>
          <Form.Label as='h6' className='mb-0 ms-2'>City</Form.Label>
          <Form.Control style={squareForm} placeholder='San Jose' value={city}
            onChange={(e) => setCity(e.target.value)}/>
        </Form.Group>
      </div>
      <div className='d-flex my-3'>
        <Form.Group className='mx-2'>
          <Form.Label as='h6' className='mb-0 ms-2'>State</Form.Label>
          <Form.Control style={squareForm} placeholder='CA' value={state}
            onChange={(e) => setState(e.target.value)}/>
        </Form.Group>
        <Form.Group className='mx-2'>
          <Form.Label as='h6' className='mb-0 ms-2'>Zip Code</Form.Label>
          <Form.Control style={squareForm} placeholder='90808' value={zip}
            onChange={(e) => setZip(e.target.value)}/>
        </Form.Group>
      </div>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>Type</Form.Label>
        <Form.Control style={squareForm} placeholder='Apartment' value={type}
          onChange={(e) => setType(e.target.value)}/>
      </Form.Group>
      <div className='d-flex my-3'>
        <Form.Group className='mx-2'>
          <Form.Label as='h6' className='mb-0 ms-2'>Bedroom</Form.Label>
          <Form.Control style={squareForm} placeholder='2' value={numBeds}
            onChange={(e) => setNumBeds(e.target.value)}/>
        </Form.Group>
        <Form.Group className='mx-2'>
          <Form.Label as='h6' className='mb-0 ms-2'>Bath</Form.Label>
          <Form.Control style={squareForm} placeholder='1.5' value={numBaths}
            onChange={(e) => setNumBaths(e.target.value)}/>
        </Form.Group>
        <Form.Group className='mx-2'>
          <Form.Label as='h6' className='mb-0 ms-2'>Sq. Ft.</Form.Label>
          <Form.Control style={squareForm} placeholder='1100' value={area}
            onChange={(e) => setArea(e.target.value)}/>
        </Form.Group>
      </div>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>Monthly Rent</Form.Label>
        <Form.Control style={squareForm} placeholder='$2000.00' value={rent}
          onChange={(e) => setRent(e.target.value)}/>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>Deposit</Form.Label>
        <Form.Control style={squareForm} placeholder='$2000.00' value={deposit}
          onChange={(e) => setDeposit(e.target.value)}/>
      </Form.Group>
      <PropertyAppliances state={applianceState}/>
      <PropertyUtilities state={utilityState}/>
      <Container className='my-3'>
        <h6>Pets Allowed</h6>
        <Row>
          <Col className='d-flex ps-4'>
            <Checkbox type='CIRCLE' checked={petsAllowed} onClick={() => setPetsAllowed(true)}/>
            <p className='ms-1 mb-1'>Yes</p>
          </Col>
          <Col className='d-flex ps-4'>
            <Checkbox type='CIRCLE' checked={!petsAllowed} onClick={() => setPetsAllowed(false)}/>
            <p className='ms-1 mb-1'>No</p>
          </Col>
        </Row>
      </Container>
      <Container className='my-3'>
        <h6>Deposit can be used for last month's rent</h6>
        <Row>
          <Col className='d-flex ps-4'>
            <Checkbox type='CIRCLE' checked={depositForRent} onClick={() => setDepositForRent(true)}/>
            <p className='ms-1 mb-1'>Yes</p>
          </Col>
          <Col className='d-flex ps-4'>
            <Checkbox type='CIRCLE' checked={!depositForRent} onClick={() => setDepositForRent(false)}/>
            <p className='ms-1 mb-1'>No</p>
          </Col>
        </Row>
      </Container>
      <PropertyImages state={imageState}/>
      <div className='text-center my-5'>
        <Button variant='outline-primary' style={pillButton} onClick={props.cancel}
          className='mx-2'>
          Cancel
        </Button>
        <Button variant='outline-primary' style={pillButton} onClick={submitForm}
          className='mx-2'>
          Save
        </Button>
      </div>
    </div>
  );

}

export default PropertyForm;
