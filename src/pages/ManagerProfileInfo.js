import React from 'react';
import {Form, Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

import AppContext from '../AppContext';
import Header from '../components/Header';
import PaymentSelection from '../components/PaymentSelection';
import ManagerFees from '../components/ManagerFees';
import ManagerLocations from '../components/ManagerLocations';
import {get, post} from '../utils/api';
import {squareForm, pillButton} from '../utils/styles';

function ManagerProfileInfo(props) {
  const context = React.useContext(AppContext);
  const {access_token, user} = context.userData;
  const navigate = useNavigate();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [einNumber, setEinNumber] = React.useState('');
  const [ssn, setSsn] = React.useState('');
  const paymentState = React.useState({
    paypal: '',
    applePay: '',
    zelle: '',
    venmo: '',
    accountNumber: '',
    routingNumber: ''
  });
  const feeState = React.useState([]);
  const locationState = React.useState([]);
  React.useEffect(() => {
    if (access_token === null) {
      navigate('/');
      return;
    }
    if (user.role.indexOf('MANAGER') === -1) {
      console.log('no manager profile');
      props.onConfirm();
    }
    const fetchProfileInfo = async () => {
      const response = await get('/managerProfileInfo', access_token);
      if (response.result.length !== 0) {
        console.log('manager profile already set up');
        // eventually update page with current info, allow user to update and save new info
        props.onConfirm();
        return;
      }
    }
    fetchProfileInfo();
  }, []);
  const submitInfo = async () => {
    const {paypal, applePay, zelle, venmo, accountNumber, routingNumber} = paymentState[0];
    const managerProfile = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email: email,
      ein_number: einNumber,
      ssn: ssn,
      paypal: paypal || 'NULL',
      apple_pay: applePay || 'NULL',
      zelle: zelle || 'NULL',
      venmo: venmo || 'NULL',
      account_number: accountNumber || 'NULL',
      routing_number: routingNumber || 'NULL',
      fees: feeState[0],
      locations: locationState[0]
    }
    await post('/managerProfileInfo', managerProfile, access_token);
    props.onConfirm();
  }
  return (
    <div className='pb-5'>
      <Header title='PM Profile'/>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>First Name</Form.Label>
        <Form.Control style={squareForm} placeholder='First' value={firstName}
          onChange={(e) => setFirstName(e.target.value)}/>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>Last Name</Form.Label>
        <Form.Control style={squareForm} placeholder='Last' value={lastName}
          onChange={(e) => setLastName(e.target.value)}/>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>Phone Number</Form.Label>
        <Form.Control style={squareForm} placeholder='(xxx)xxx-xxxx' value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}/>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>Email Address</Form.Label>
        <Form.Control style={squareForm} placeholder='Email' value={email}
          onChange={(e) => setEmail(e.target.value)}/>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>EIN Number</Form.Label>
        <Form.Control style={squareForm} placeholder='12-1234567' value={einNumber}
          onChange={(e) => setEinNumber(e.target.value)}/>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>Social Security Number</Form.Label>
        <Form.Control style={squareForm} placeholder='123-45-6789' value={ssn}
          onChange={(e) => setSsn(e.target.value)}/>
      </Form.Group>
      <PaymentSelection state={paymentState}/>
      <ManagerFees state={feeState}/>
      <ManagerLocations state={locationState}/>
      <div className='text-center my-3'>
        <Button variant='outline-primary' style={pillButton} onClick={submitInfo}>
          Save Manager Profile
        </Button>
      </div>
    </div>
  );
}

export default ManagerProfileInfo;
