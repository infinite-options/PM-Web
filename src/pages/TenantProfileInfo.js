import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';

import AppContext from '../AppContext';
import Header from '../components/Header';
import Checkbox from '../components/Checkbox';
import AddressForm from '../components/AddressForm';
import {get, post} from '../utils/api';
import {squareForm, pillButton, small, underline, red, hidden} from '../utils/styles';

function TenantProfileInfo(props) {
  const {userData} = React.useContext(AppContext);
  const {access_token, user} = userData;
  const navigate = useNavigate();
  const {autofillState, setAutofillState} = props;
  const updateAutofillState = (profile) => {
    const newAutofillState = {...autofillState};
    for (const key of Object.keys(newAutofillState)) {
      if (key in profile) {
        newAutofillState[key] = profile[key];
      }
    }
    setAutofillState(newAutofillState);
  }
  const [firstName, setFirstName] = React.useState(autofillState.first_name);
  const [lastName, setLastName] = React.useState(autofillState.last_name);
  const [salary, setSalary] = React.useState('');
  const [jobTitle, setJobTitle] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [ssn, setSsn] = React.useState(autofillState.ssn);
  const [dlNumber, setDLNumber] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const currentAddressState = React.useState({
    street: '',
    unit: '',
    city: '',
    state: '',
    zip: '',
    pm_name: '',
    pm_number: '',
    lease_start: '',
    lease_end: '',
    rent: ''
  });
  const [usePreviousAddress, setUsePreviousAddress] = React.useState(false);
  const previousAddressState = React.useState({
    street: '',
    unit: '',
    city: '',
    state: '',
    zip: '',
    pm_name: '',
    pm_number: '',
    lease_start: '',
    lease_end: '',
    rent: ''
  });
  React.useEffect(() => {
    if (access_token === null) {
      navigate('/');
      return;
    }
    if (user.role.indexOf('TENANT') === -1) {
      console.log('no tenant profile');
      props.onConfirm();
    }
    const fetchProfileInfo = async () => {
      const response = await get('/tenantProfileInfo', access_token);
      if (response.result.length !== 0) {
        console.log('tenant profile already set up');
        // eventually update page with current info, allow user to update and save new info
        props.onConfirm();
        return;
      }
    }
    fetchProfileInfo();
  }, []);
  const submitInfo = async () => {
    const currentAddressInvalid = (
      currentAddressState[0].street === '' ||
      currentAddressState[0].city === '' ||
      currentAddressState[0].state === '' ||
      currentAddressState[0].zip === '' ||
      currentAddressState[0].lease_start === '' ||
      currentAddressState[0].lease_end === '' ||
      currentAddressState[0].rent === ''
    );
    const previousAddressInvalid = (
      previousAddressState[0].street === '' ||
      previousAddressState[0].city === '' ||
      previousAddressState[0].state === '' ||
      previousAddressState[0].zip === '' ||
      previousAddressState[0].lease_start === '' ||
      previousAddressState[0].lease_end === '' ||
      previousAddressState[0].rent === ''
    );
    if (firstName === '' || lastName === '' || salary === '' || jobTitle === '' || ssn === '' ||
    dlNumber === '' || currentAddressInvalid || (usePreviousAddress && previousAddressInvalid)) {
      setErrorMessage('Please fill out all fields');
      return;
    }
    const tenantProfile = {
      first_name: firstName,
      last_name: lastName,
      current_salary: salary,
      current_job_title: jobTitle,
      ssn: ssn,
      drivers_license_number: dlNumber,
      current_address: currentAddressState[0],
      previous_address: usePreviousAddress ? previousAddressState[0] : null
    }
    await post('/tenantProfileInfo', tenantProfile, access_token);
    updateAutofillState(tenantProfile);
    props.onConfirm();
  }
  const required = (
    errorMessage === 'Please fill out all fields' ? (
      <span style={red} className='ms-1'>*</span>
    ) : ''
  );
  return (
    <div className='pb-4'>
      <Header title='Tenant Profile'/>
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
            Annual Salary {salary === '' ? required : ''}
          </Form.Label>
          <Form.Control style={squareForm} placeholder='75000' value={salary}
            onChange={(e) => setSalary(e.target.value)}/>
        </Form.Group>
        <Form.Group className='mx-2 my-3'>
          <Form.Label as='h6' className='mb-0 ms-2'>
            Current Job Title {jobTitle === '' ? required : ''}
          </Form.Label>
          <Form.Control style={squareForm} placeholder='Title' value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}/>
        </Form.Group>
        <Form.Group className='mx-2 my-3'>
          <Form.Label as='h6' className='mb-0 ms-2'>
            Company Name {company === '' ? required : ''}
          </Form.Label>
          <Form.Control style={squareForm} placeholder='Company' value={company}
            onChange={(e) => setCompany(e.target.value)}/>
        </Form.Group>
        <Form.Group className='mx-2 my-3'>
          <Form.Label as='h6' className='mb-0 ms-2'>
            Social Security Number {ssn === '' ? required : ''}
          </Form.Label>
          <Form.Control style={squareForm} placeholder='123-45-6789' value={ssn}
            onChange={(e) => setSsn(e.target.value)}/>
        </Form.Group>
        <Form.Group className='mx-2 my-3'>
          <Form.Label as='h6' className='mb-0 ms-2'>
            Driver's License Number {dlNumber === '' ? required : ''}
          </Form.Label>
          <Form.Control style={squareForm} placeholder='1234567890' value={dlNumber}
            onChange={(e) => setDLNumber(e.target.value)}/>
        </Form.Group>
        <h5 className='mx-2 my-3'>Current Address</h5>
        <AddressForm state={currentAddressState} errorMessage={errorMessage}/>
        <Row>
          <Col xs={2} className='px-0 d-flex justify-content-end align-items-center'>
            <div>
              <Checkbox type='BOX' onClick={() => setUsePreviousAddress(!usePreviousAddress)}/>
            </div>
          </Col>
          <Col>
            <p style={{...underline, ...small}} className='text-primary mb-3 me-3'>
              Add another property manager reference if your last lease was for less than 2 years.
            </p>
          </Col>
        </Row>
        {usePreviousAddress ? (
          <div className='mb-3'>
            <h5 className='mx-2 my-3'>Previous Address</h5>
            <AddressForm state={previousAddressState} errorMessage={errorMessage}/>
          </div>
        ) : ''}
        <div className='text-center' style={errorMessage === '' ? hidden : {}}>
          <p style={{...red, ...small}}>{errorMessage || 'error'}</p>
        </div>
        <div className='text-center my-5'>
          <Button variant='outline-primary' style={pillButton} onClick={submitInfo}>
            Save Tenant Profile
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default TenantProfileInfo;
