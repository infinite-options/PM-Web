import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Row, Col, Form, Button} from 'react-bootstrap';

import AppContext from '../AppContext';
import Header from '../components/Header';
import Checkbox from '../components/Checkbox';
import AddressForm from '../components/AddressForm';
import {post} from '../utils/api';
import {squareForm, pillButton, small, underline} from '../utils/styles';

function TenantProfileInfo(props) {
  const {userData} = React.useContext(AppContext);
  const {access_token, user} = userData;
  const navigate = useNavigate();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [salary, setSalary] = React.useState('');
  const [jobTitle, setJobTitle] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [ssn, setSsn] = React.useState('');
  const [dlNumber, setDLNumber] = React.useState('');
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
  }, []);
  const submitInfo = async () => {
    const tenantProfile = {
      first_name: firstName,
      last_name: lastName,
      current_salary: salary,
      current_job_title: jobTitle,
      ssn: ssn,
      drivers_livense_number: dlNumber,
      current_address: currentAddressState[0],
      previous_address: usePreviousAddress ? previousAddressState[0] : null
    }
    await post('/tenantProfileInfo', tenantProfile, access_token);
    props.onConfirm();
  }
  return (
    <div className='pb-4'>
      <Header title='Tenant Profile'/>
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
        <Form.Label as='h6' className='mb-0 ms-2'>Annual Salary</Form.Label>
        <Form.Control style={squareForm} placeholder='$75,000' value={salary}
          onChange={(e) => setSalary(e.target.value)}/>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>Current Job Title</Form.Label>
        <Form.Control style={squareForm} placeholder='Title' value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}/>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>Company Name</Form.Label>
        <Form.Control style={squareForm} placeholder='Company' value={company}
          onChange={(e) => setCompany(e.target.value)}/>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>Social Security Number</Form.Label>
        <Form.Control style={squareForm} placeholder='123-45-6789' value={ssn}
          onChange={(e) => setSsn(e.target.value)}/>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>Driver's License Number</Form.Label>
        <Form.Control style={squareForm} placeholder='1234567890' value={dlNumber}
          onChange={(e) => setDLNumber(e.target.value)}/>
      </Form.Group>
      <h5 className='mx-2 my-3'>Current Address</h5>
      <AddressForm state={currentAddressState}/>
      <Row>
        <Col xs={2} className='px-0 d-flex justify-content-end align-items-center'>
          <div>
            <Checkbox onClick={() => setUsePreviousAddress(!usePreviousAddress)}/>
          </div>
        </Col>
        <Col>
          <p style={{...underline, ...small}} className='text-primary mb-1 me-3'>
            Add another property manager reference if your last lease was for less than 2 years.
          </p>
        </Col>
      </Row>
      {usePreviousAddress ? (
        <div>
          <h5 className='mx-2 my-3'>Previous Address</h5>
          <AddressForm state={previousAddressState}/>
        </div>
      ) : ''}
      <div className='text-center my-5'>
        <Button variant='outline-primary' style={pillButton} onClick={submitInfo}>
          Save Tenant Profile
        </Button>
      </div>
    </div>
  );
}

export default TenantProfileInfo;
