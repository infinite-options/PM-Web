import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Container, Form, Button} from 'react-bootstrap';

import AppContext from '../AppContext';
import Header from '../components/Header';
import ServicesProvided from '../components/ServicesProvided';
import PaymentSelection from '../components/PaymentSelection';
import BusinessContact from '../components/BusinessContact';
import {get, post} from '../utils/api';
import {pillButton, squareForm, hidden, red, small} from '../utils/styles';

function BusinessProfileInfo(props) {
  const context = React.useContext(AppContext);
  const {access_token, user} = context.userData;
  const navigate = useNavigate();
  const [businessName, setBusinessName] = React.useState('');
  const [einNumber, setEinNumber] = React.useState('');
  const serviceState = React.useState([]);
  const paymentState = React.useState({
    paypal: '',
    applePay: '',
    zelle: '',
    venmo: '',
    accountNumber: '',
    routingNumber: ''
  });
  const [errorMessage, setErrorMessage] = React.useState('');
  const contactState = React.useState([]);
  React.useEffect(() => {
    if (access_token === null) {
      navigate('/');
      return;
    }
    if (user.role.indexOf('MAINTENANCE') === -1) {
      console.log('no business in user role');
      props.onConfirm();
      return;
    }
    const fetchProfileInfo = async () => {
      const response = await get('/businessProfileInfo', access_token);
      if (response.result.length !== 0) {
        console.log('business profile already set up');
        // eventually update page with current info, allow user to update and save new info
        props.onConfirm();
        return;
      }
    }
    fetchProfileInfo();
  }, []);
  const submitInfo = async () => {
    const {paypal, applePay, zelle, venmo, accountNumber, routingNumber} = paymentState[0];
    if (businessName === '' || einNumber === '') {
      setErrorMessage('Please fill out all fields');
      return;
    }
    if (serviceState[0].length === 0) {
      setErrorMessage('Please add at least one service');
      return;
    }
    if (paypal === '' && applePay === '' && zelle === '' && venmo === '' && (accountNumber === '' || routingNumber === '')) {
      setErrorMessage('Please add at least one payment method');
      return;
    }
    if (contactState[0].length === 0) {
      setErrorMessage('Please add at least one contact');
      return;
    }
    const businessProfile = {
      name: businessName,
      ein_number: einNumber,
      paypal: paypal || 'NULL',
      apple_pay: applePay || 'NULL',
      zelle: zelle || 'NULL',
      venmo: venmo || 'NULL',
      account_number: accountNumber || 'NULL',
      routing_number: routingNumber || 'NULL',
      services: JSON.stringify(serviceState[0]),
      contact: JSON.stringify(contactState[0])
    }
    console.log(businessProfile);
    await post('/businessProfileInfo', businessProfile, access_token);
    props.onConfirm();
  }
  const required = (
    errorMessage === 'Please fill out all fields' ? (
      <span style={red} className='ms-1'>*</span>
    ) : ''
  );
  return (
    <div>
      <Header title='Business Profile'/>
      <Container className='pb-4'>
        <Form.Group className='mx-2 my-3'>
          <Form.Label as='h6' className='mb-0 ms-2'>
            Business Name {businessName === '' ? required : ''}
          </Form.Label>
          <Form.Control style={squareForm} placeholder='Business Name' value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}/>
        </Form.Group>

        <ServicesProvided state={serviceState}/>

        <Form.Group className='mx-2 my-3'>
          <Form.Label as='h6' className='mb-0 ms-2'>
            EIN Number {einNumber === '' ? required : ''}
          </Form.Label>
          <Form.Control style={squareForm} placeholder='12-1234567' value={einNumber}
            onChange={(e) => setEinNumber(e.target.value)}/>
        </Form.Group>

        <PaymentSelection state={paymentState}/>

        <Container className='mb-4'>
          <h6 className='mb-3'>Contact Info:</h6>
          <BusinessContact state={contactState}/>
        </Container>

        <div className='text-center' style={errorMessage === '' ? hidden : {}}>
          <p style={{...red, ...small}}>{errorMessage || 'error'}</p>
        </div>

        <div className='text-center mt-4 mb-5'>
          <Button variant='outline-primary' style={pillButton} onClick={submitInfo}>
            Save Business Profile
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default BusinessProfileInfo;
