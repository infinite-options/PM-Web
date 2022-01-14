import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Container, Form, Button} from 'react-bootstrap';

import AppContext from '../AppContext';
import Header from '../components/Header';
import AppleLogin from '../icons/AppleLogin.svg';
import FacebookLogin from '../icons/FacebookLogin.svg';
import GoogleLogin from '../icons/GoogleLogin.svg';
import {post} from '../utils/api';
import {pillButton, boldSmall, underline, gray} from '../utils/styles';

function SignupEmailForm(props) {
  const context = React.useContext(AppContext);
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = React.useState(false);
  const emailRef = React.createRef();
  const confirmEmailRef = React.createRef();
  const passwordRef = React.createRef();
  const confirmPasswordRef = React.createRef();
  const submitForm = async () => {
    const email = emailRef.current.value;
    const confirmEmail = confirmEmailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    if (email !== confirmEmail) {
      // add validation
    }
    if (password !== confirmPassword) {
      // add validation
    }
    const user = {
      first_name: props.firstName,
      last_name: props.lastName,
      phone_number: props.phoneNumber,
      email: email,
      password: password,
      role: props.role
    }
    const response = await post('/users', user);
    if (response.code !== 200) {
      console.log(response.message);
      return;
      // add validation
    }
    context.updateUserData(response.result);
    // save to app state / context
    props.onConfirm();
  }
  const goToLogin = () => {
    navigate('/login');
  }
  return (
    <div className='d-flex flex-column h-100'>
      <Header title='Sign Up' back={props.back}/>
      <Container className='px-4'>
        <h5>Full Name</h5>
        <p style={gray}>{props.firstName+' '+props.lastName}</p>
        <h5>Phone Number</h5>
        <p style={gray}>{props.phoneNumber}</p>
        {!showEmailForm ? (
          <h5 className='mb-4'>Choose login method:</h5>
        ) : ''}
        <div className='text-center'>
          <img src={AppleLogin} alt='Apple Login' className='m-1'/>
          <img src={FacebookLogin} alt='Facebook Login' className='m-1'/>
          <img src={GoogleLogin} alt='Google Login' className='m-1'/>
        </div>
        <hr className={showEmailForm ? 'mt-4 mb-1' : 'my-4'}/>
        <div className='text-center d-flex justify-content-center'>
          <div onClick = {() => setShowEmailForm(!showEmailForm)}>
            <p style={showEmailForm ? boldSmall : {...boldSmall, ...underline}}
              className={showEmailForm ? '' : 'mb-4'}>
              Or continue with email
            </p>
          </div>
        </div>
        {showEmailForm ? (
          <div>
            <Form>
              <Form.Group className='mx-2 my-3'>
                <Form.Label as='h5' className='mb-0 ms-1'>Email Address</Form.Label>
                <Form.Control style={{borderRadius: 0}} ref={emailRef} placeholder='Email'/>
              </Form.Group>
              <Form.Group className='mx-2 my-3'>
                <Form.Label as='h5' className='mb-0 ms-1'>Confirm Email Address</Form.Label>
                <Form.Control style={{borderRadius: 0}} ref={confirmEmailRef} placeholder='Confirm Email'/>
              </Form.Group>
              <Form.Group className='mx-2 my-3'>
                <Form.Label as='h5' className='mb-0 ms-1'>Enter Password</Form.Label>
                <Form.Control style={{borderRadius: 0}} ref={passwordRef} placeholder='Password' type='password'/>
              </Form.Group>
              <Form.Group className='mx-2 my-3'>
                <Form.Label as='h5' className='mb-0 ms-1'>Confirm Password</Form.Label>
                <Form.Control style={{borderRadius: 0}} ref={confirmPasswordRef} placeholder='Confirm Password' type='password'/>
              </Form.Group>
            </Form>
            <div className='text-center pt-1 pb-3'>
              <Button variant='outline-primary' style={pillButton} onClick={submitForm}>
                Next
              </Button>
            </div>
          </div>
        ) : ''}

      </Container>
      {!showEmailForm ? (
        <div className='flex-grow-1 d-flex flex-column justify-content-end'>
          <div className='text-center'>
            <p style={boldSmall} className='mb-1'>Already have an account?</p>
            <Button variant='outline-primary' onClick={goToLogin} style={pillButton}
              className='mb-4'>
              Login
            </Button>
          </div>
        </div>
      ) : ''}
    </div>

  );
}

export default SignupEmailForm;
