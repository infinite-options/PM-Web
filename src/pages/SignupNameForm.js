import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Container, Form, Button} from 'react-bootstrap';
import Header from '../components/Header';

function SignupNameForm(props) {
  const navigate = useNavigate();
  const firstNameRef = React.createRef();
  const lastNameRef = React.createRef();
  const phoneNumberRef = React.createRef();
  const submitForm = () => {
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;
    props.onConfirm(firstName, lastName, phoneNumber);
  }
  const pillButton = {
    borderRadius: '50px',
    padding: '5px 20px'
  }
  const boldSmall = {
    fontWeight: 'bolder',
    fontSize: 'smaller'
  }
  const goToLogin = () => {
    navigate('/login');
  }
  return (
    <div className='h-100 d-flex flex-column'>
      <Header title='Sign Up' leftText='< Back' leftFn={props.back}/>
      <Container>
        <Form>
          <Form.Group className='mx-2 my-3'>
            <Form.Label as='h5' className='ms-1 mb-0'>First Name</Form.Label>
            <Form.Control style={{borderRadius: 0}} ref={firstNameRef} placeholder='First'/>
          </Form.Group>
          <Form.Group className='mx-2 my-3'>
            <Form.Label as='h5' className='ms-1 mb-0'>Last Name</Form.Label>
            <Form.Control style={{borderRadius: 0}} ref={lastNameRef} placeholder='Last'/>
          </Form.Group>
          <Form.Group className='mx-2 my-3'>
            <Form.Label as='h5' className='ms-1 mb-0'>Phone Number</Form.Label>
            <Form.Control style={{borderRadius: 0}} ref={phoneNumberRef} placeholder='(xxx)xxx-xxxx'/>
          </Form.Group>
        </Form>
        <div className='text-center mt-5'>
          <Button variant='outline-primary' onClick={submitForm} style={pillButton}>
            Proceed
          </Button>
        </div>
      </Container>
      <div className='flex-grow-1 d-flex flex-column justify-content-end'>
        <div className='text-center'>
          <p style={boldSmall} className='mb-1'>Already have an account?</p>
          <Button variant='outline-primary' onClick={goToLogin} style={pillButton}
            className='mb-4'>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SignupNameForm;
