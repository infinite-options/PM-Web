import {Container, Row, Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

import PM_icon from '../icons/PM_icon.svg';

function Landing() {
  const navigate = useNavigate();
  const login = () => {
    navigate('/login');
  }
  const signup = () => {
    navigate('/signup');
  }
  const pillButton = {
    borderRadius: '50px',
    padding: '5px 20px'
  }
  return (
    <div className='d-flex flex-column justify-content-center h-100'>
      <Container fluid className='w-100 text-center py-5'>
        <Row className='d-flex justify-content-center py-5'>
          <img src={PM_icon} alt='PM' height='150px'/>
          <p className='text-primary'>Property Management</p>
        </Row>
        <Button variant='outline-primary' style={pillButton} onClick={login}>
          Login
        </Button>
        <p className='pt-5 pb-0'><b>Don't have an account?</b></p>
        <Button variant='outline-primary' style={pillButton} onClick={signup}>
          Sign Up
        </Button>
      </Container>
    </div>
  );
}

export default Landing;
