import React from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import Header from '../components/Header';
import Checkbox from '../components/Checkbox';
import {pillButton} from '../utils/styles';

function SignupRoleSelection(props) {
  const [userRoles, setUserRoles] = React.useState([]);
  const availableRoles = ['Property Manager', 'Property Owner', 'Tenant', 'Property Maintenance'];
  const roleCodes = {
    'Property Manager': 'MANAGER',
    'Property Owner': 'OWNER',
    'Tenant': 'TENANT',
    'Property Maintenance': 'MAINTENANCE'
  }
  const addRole = (role) => {
    const index = userRoles.indexOf(role);
    if (index !== -1) {
      return;
    }
    userRoles.push(roleCodes[role]);
    setUserRoles(userRoles);
  }
  const removeRole = (role) => {
    const index = userRoles.indexOf(roleCodes[role]);
    if (index === -1) {
      return;
    }
    userRoles.splice(index, 1);
    setUserRoles(userRoles);
  }
  const confirmRoles = () => {
    props.onConfirm(userRoles);
  }
  return (
    <div>
      <Header title='Sign Up' back={props.back}/>
      <Container>
        <h5 className='mb-5'>How do you plan to use this app?</h5>
        {availableRoles.map((role, i) => (
          <Row key={i}>
            <Col xs={2} className='d-flex justify-content-end p-0'>
              <Checkbox onClick={(checked) => checked ? addRole(role) : removeRole(role)}/>
            </Col>
            <Col className='p-0'>
              <p className='d-inline-block text-left'>{role}</p>
            </Col>
          </Row>
        ))}
        <div className='text-center mt-5'>
          <Button variant='outline-primary' style={pillButton} onClick={confirmRoles}>
            Next
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default SignupRoleSelection;
