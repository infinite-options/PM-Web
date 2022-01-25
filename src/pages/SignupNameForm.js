import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Container, Form, Button} from 'react-bootstrap';
import Header from '../components/Header';
import {pillButton, boldSmall, hidden, red, small} from '../utils/styles';

function SignupNameForm(props) {
  const navigate = useNavigate();
  const firstNameRef = React.createRef();
  const lastNameRef = React.createRef();
  const phoneNumberRef = React.createRef();
  const [errorMessage, setErrorMessage] = React.useState('');
  const submitForm = () => {
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;
    if (firstName === '' || lastName === '' || phoneNumber === '') {
      setErrorMessage('Please fill out all fields');
      return;
    }
    setErrorMessage('');
    props.onConfirm(firstName, lastName, phoneNumber);
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
            <Form.Label as='h5' className='ms-1 mb-0'>
              First Name
              {errorMessage === 'Please fill out all fields' ? (
                <span style={red} className='ms-1'>*</span>
              ) : ''}
            </Form.Label>
            <Form.Control style={{borderRadius: 0}} ref={firstNameRef} placeholder='First'/>
          </Form.Group>
          <Form.Group className='mx-2 my-3'>
            <Form.Label as='h5' className='ms-1 mb-0'>
              Last Name
              {errorMessage === 'Please fill out all fields' ? (
                <span style={red} className='ms-1'>*</span>
              ) : ''}
            </Form.Label>
            <Form.Control style={{borderRadius: 0}} ref={lastNameRef} placeholder='Last'/>
          </Form.Group>
          <Form.Group className='mx-2 my-3'>
            <Form.Label as='h5' className='ms-1 mb-0'>
              Phone Number
              {errorMessage === 'Please fill out all fields' ? (
                <span style={red} className='ms-1'>*</span>
              ) : ''}
            </Form.Label>
            <Form.Control style={{borderRadius: 0}} ref={phoneNumberRef} placeholder='(xxx)xxx-xxxx'/>
          </Form.Group>
        </Form>
        <div className='text-center' style={errorMessage === '' ? hidden : {}}>
          <p style={{...red, ...small}}>{errorMessage || 'error'}</p>
        </div>
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
