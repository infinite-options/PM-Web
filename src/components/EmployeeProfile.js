import React from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import {squareForm, hidden, red, small, pillButton} from '../utils/styles';
import {get, post} from '../utils/api';
import AppContext from '../AppContext';
import Checkbox from '../components/Checkbox';
import Header from '../components/Header';
import ArrowDown from '../icons/ArrowDown.svg';

function EmployeeProfile(props) {
  const {businessType, onConfirm} = props;
  const {userData} = React.useContext(AppContext);
  const {user, access_token} = userData;

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [ssn, setSsn] = React.useState('');
  const [einNumber, setEinNumber] = React.useState('');
  const [companyRole, setCompanyRole] = React.useState('');
  const [company, setCompany] = React.useState(null);
  const [businesses, setBusinesses] = React.useState([]);
  const [showSsn, setShowSsn] = React.useState(false);
  const [showEin, setShowEin] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const required = (
    errorMessage === 'Please fill out all fields' ? (
      <span style={red} className='ms-1'>*</span>
    ) : ''
  );

  React.useEffect(async () => {
    const response = await get(`/businesses?business_type=${businessType}`);
    setBusinesses(response.result);
    setCompany(JSON.stringify(response.result[0]));
  }, []);

  const submitForm = async () => {
    if (firstName === '' || lastName === '' || phoneNumber === '' || email === '' || companyRole === '') {
      setErrorMessage('Please fill out all fields');
      return;
    }
    if (ssn === '' && einNumber === '') {
      setErrorMessage('Please include at least one identification number');
      return;
    }
    console.log(company);
    const employeeInfo = {
      user_uid: user.user_uid,
      business_uid: JSON.parse(company).business_uid,
      role: companyRole,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email: email,
      ssn: ssn,
      ein_number: einNumber
    }
    console.log(employeeInfo);
    const response = await post('/employees', employeeInfo, access_token)
    onConfirm();
  }

  return (
    <div className='pb-5'>
      <Header title={`${businessType === 'MANAGEMENT' ? 'PM' : 'Mainenance'} Employee Profile`}/>
      <Container>
        <Form.Group className='mx-2 my-3'>
          <Form.Label as='h6' className='mb-0 ms-2'>
            First Name {firstName === '' ? required : ''}
          </Form.Label>
          <Form.Control style={squareForm} placeholder='First' value={firstName}
            onChange={(e) => setFirstName(e.target.value)}/>
        </Form.Group>
        <Form.Group className='mx-2 my-3'>
          <Form.Label as='h6' className='mb-0 ms-2'>
            Last Name {lastName === '' ? required : ''}
          </Form.Label>
          <Form.Control style={squareForm} placeholder='Last' value={lastName}
            onChange={(e) => setLastName(e.target.value)}/>
        </Form.Group>
        <Form.Group className='mx-2 my-3'>
          <Form.Label as='h6' className='mb-0 ms-2'>
            Phone Number {phoneNumber === '' ? required : ''}
          </Form.Label>
          <Form.Control style={squareForm} placeholder='(xxx)xxx-xxxx' value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}/>
        </Form.Group>
        <Form.Group className='mx-2 my-3'>
          <Form.Label as='h6' className='mb-0 ms-2'>
            Email Address {email === '' ? required : ''}
          </Form.Label>
          <Form.Control style={squareForm} placeholder='Email' value={email} type='email'
            onChange={(e) => setEmail(e.target.value)}/>
        </Form.Group>
        <Form.Group className='mx-2 my-3'>
          <Form.Label as='h6' className='mb-0 ms-2'>
            Company of Employment
          </Form.Label>
          <Form.Select style={{...squareForm, backgroundImage: `url(${ArrowDown})`}} value={company}
            onChange={(e) => setCompany(e.target.value)}>
            {businesses.map((business, i) => (
              <option key={i} value={JSON.stringify(business)}>
                {business.business_name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className='mx-2 my-3'>
          <Form.Label as='h6' className='mb-0 ms-2'>
            Your Role at the Company {companyRole === '' ? required : ''}
          </Form.Label>
          <Form.Control style={squareForm} placeholder='Role' value={companyRole}
            onChange={(e) => setCompanyRole(e.target.value)}/>
        </Form.Group>
        <Container className='my-5'>
          <h6>Please add at least one:</h6>
          <Row className='mb-1'>
            <Col className='d-flex align-items-center'>
              <Checkbox type='BOX' onClick={(checked) => setShowSsn(checked)}/>
              <p className='d-inline-block mb-0'>SSN</p>
            </Col>
            <Col>
              <Form.Control style={showSsn ? squareForm : hidden} placeholder='123-45-6789'
                value={ssn} onChange={e => setSsn(e.target.value)}/>
            </Col>
          </Row>
          <Row className='mb-1'>
            <Col className='d-flex align-items-center'>
              <Checkbox type='BOX' onClick={(checked) => setShowEin(checked)}/>
              <p className='d-inline-block mb-0'>EIN Number</p>
            </Col>
            <Col>
              <Form.Control style={showEin ? squareForm : hidden} placeholder='12-1234567'
                value={einNumber} onChange={e => setEinNumber(e.target.value)}/>
            </Col>
          </Row>
          <div className='text-center' style={errorMessage === '' ? hidden : {}}>
            <p style={{...red, ...small}}>{errorMessage || 'error'}</p>
          </div>
        </Container>
        <div className='my-3 text-center'>
          <Button variant='outline-primary' style={pillButton} onClick={submitForm}>
            Save Profile
          </Button>
        </div>
      </Container>
    </div>
  );

}

export default EmployeeProfile;
