import React from 'react';
import {Form, Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

import AppContext from '../AppContext';
import Header from '../components/Header';
import PaymentSelection from '../components/PaymentSelection';
import {get, post} from '../utils/api';
import {squareForm, pillButton} from '../utils/styles';

function OwnerProfileInfo(props) {
  const context = React.useContext(AppContext);
  const {access_token} = context.userData;
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
  React.useEffect(() => {
    if (context.userData.access_token === null) {
      navigate('/');
      return;
    }
    const userRole = context.userData.user.role;
    if (userRole.indexOf('OWNER') === -1) {
      console.log('no owner profile');
      props.onConfirm();
    }
    const fetchProfileInfo = async () => {
      const response = await get('/ownerProfileInfo', access_token);
      if (response.result.length !== 0) {
        console.log('owner profile already set up');
        // eventually update page with current info, allow user to update and save new info
        props.onConfirm();
        return;
      }
    }
    fetchProfileInfo();
  }, []);
  const submitInfo = async () => {
    const {paypal, applePay, zelle, venmo, accountNumber, routingNumber} = paymentState[0];
    if (firstName === '' || lastName === '' || phoneNumber === '' || email === '' ||
    einNumber === '' || ssn === '' || (paypal === '' && applePay === '' && zelle === '' &&
    venmo === '' && (accountNumber === '' || routingNumber === ''))) {
      console.log('missing fields');
      // add validation
      return;
    }
    const ownerProfile = {
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
      routing_number: routingNumber || 'NULL'
    }
    await post('/ownerProfileInfo', ownerProfile, access_token);
    props.onConfirm();
  }
  return (
    <div className='pb-5'>
      <Header title='Owner Profile'/>
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
        <Form.Control style={squareForm} placeholder='Email' value={email} type='email'
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
      <div className='text-center my-3'>
        <Button variant='outline-primary' style={pillButton} onClick={submitInfo}>
          Save Owner Profile
        </Button>
      </div>
    </div>
  );
}

export default OwnerProfileInfo;
