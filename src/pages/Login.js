import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Container, Form, Button} from 'react-bootstrap';

import AppContext from '../AppContext';
import Header from '../components/Header';
import SelectRole from '../components/SelectRole';
import AppleLogin from '../icons/AppleLogin.svg';
import FacebookLogin from '../icons/FacebookLogin.svg';
import GoogleLogin from '../icons/GoogleLogin.svg';
import {post} from '../utils/api';
import {pillButton, boldSmall} from '../utils/styles';

function Login(props) {
  const context = React.useContext(AppContext);
  const navigate = useNavigate();
  const [loginStage, setLoginStage] = React.useState('LOGIN');
  const emailRef = React.createRef();
  const passwordRef = React.createRef();
  const submitForm = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const user = {
      email: email,
      password: password
    }
    const response = await post('/login', user);
    if (response.code !== 200) {
      console.log(response.message);
      return;
      // add validation
    }
    context.updateUserData(response.result);
    // save to app state / context
    setLoginStage('ROLE')
  }
  return (
    <div className='h-100 pb-5'>
      {loginStage === 'LOGIN' ? (
        <div className='d-flex flex-column h-100'>
          <Header title='Login' back={() => navigate('/')}/>
          <Container className='px-4'>
            <div className='text-center'>
              <img src={AppleLogin} alt='Apple Login' className='m-1'/>
              <img src={FacebookLogin} alt='Facebook Login' className='m-1'/>
              <img src={GoogleLogin} alt='Google Login' className='m-1'/>
            </div>
            <hr className='mt-4 mb-1'/>
            <div className='text-center mb-4'>
              <p style={boldSmall}>
                Or continue with email
              </p>
            </div>
            <Form>
              <Form.Group className='mx-2 my-3'>
                <Form.Label as='h5' className='mb-0 ms-1'>Email Address</Form.Label>
                <Form.Control style={{borderRadius: 0}} ref={emailRef} placeholder='Email' type='email'/>
              </Form.Group>
              <Form.Group className='mx-2 my-3'>
                <Form.Label as='h5' className='mb-0 ms-1'>Password</Form.Label>
                <Form.Control style={{borderRadius: 0}} ref={passwordRef} placeholder='Password' type='password'/>
              </Form.Group>
            </Form>
            <div className='text-center pt-1 pb-3'>
              <Button variant='outline-primary' style={pillButton} onClick={submitForm}>
                Login
              </Button>
            </div>
          </Container>
          <div className='flex-grow-1 d-flex flex-column justify-content-end'>
            <div className='text-center'>
              <p style={boldSmall} className='mb-1'>Don't have an account?</p>
              <Button variant='outline-primary' onClick={() => navigate('/signup')}
                style={pillButton} className='mb-4'>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      ) : loginStage === 'ROLE' ? (
        <div className='d-flex flex-column h-100 pb-5'>
          <Header title='Login'/>
          <SelectRole/>
        </div>
      ) : ''}
    </div>

  );
}

export default Login;
