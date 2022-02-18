import React from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import Header from '../components/Header';
import Checkbox from '../components/Checkbox';
import {pillButton, red, small, hidden} from '../utils/styles';

function SignupRoleSelection(props) {
  const [userRoles, setUserRoles] = React.useState([]);
  const roleCodes = {
    'Property Manager (Business Owner)': 'MANAGER',
    'Property Manager (Employee)': 'PM_EMPLOYEE',
    'Property Owner': 'OWNER',
    'Tenant': 'TENANT',
    'Property Maintenance (Business Owner)': 'MAINTENANCE',
    'Property Maintenance (Employee)': 'MAINT_EMPLOYEE'
  }
  const availableRoles = Object.keys(roleCodes);
  const addRole = (role) => {
    const roleCode = roleCodes[role];
    const index = userRoles.indexOf(roleCode);
    if (index !== -1) {
      return;
    }
    const rolesCopy = [...userRoles];
    if (roleCode === 'MANAGER') {
      const employeeIndex = userRoles.indexOf('PM_EMPLOYEE');
      if (employeeIndex !== -1) rolesCopy.splice(employeeIndex, 1);
    } else if (roleCode === 'PM_EMPLOYEE') {
      const ownerIndex = userRoles.indexOf('MANAGER');
      if (ownerIndex !== -1) rolesCopy.splice(ownerIndex, 1);
    } else if (roleCode === 'MAINTENANCE') {
      const employeeIndex = userRoles.indexOf('MAINT_EMPLOYEE');
      if (employeeIndex !== -1) rolesCopy.splice(employeeIndex, 1);
    } else if (roleCode === 'MAINT_EMPLOYEE') {
      const ownerIndex = userRoles.indexOf('MAINTENANCE');
      if (ownerIndex !== -1) rolesCopy.splice(ownerIndex, 1);
    }
    rolesCopy.push(roleCode);
    setUserRoles(rolesCopy);
  }
  const removeRole = (role) => {
    const index = userRoles.indexOf(roleCodes[role]);
    if (index === -1) {
      return;
    }
    const rolesCopy = [...userRoles];
    rolesCopy.splice(index, 1);
    setUserRoles(rolesCopy);
  }
  const confirmRoles = () => {
    if (userRoles.length === 0) {
      setErrorMessage('Please select a role to proceed');
      return;
    }
    setErrorMessage('');
    props.onConfirm(userRoles);
  }
  const [errorMessage, setErrorMessage] = React.useState('');
  return (
    <div>
      <Header title='Sign Up' leftText='< Back' leftFn={props.back}/>
      <Container>
        <h5 className='mb-5'>How do you plan to use this app?</h5>
        {availableRoles.map((role, i) => (
          <div key={i} className='d-flex'>
            <Checkbox type='CIRCLE' checked={userRoles.indexOf(roleCodes[role]) !== -1}
            onClick={(checked) => checked ? addRole(role) : removeRole(role)}/>

            <div className='flex-grow-1'>
              <p className='d-inline-block text-left'>{role}</p>
            </div>
          </div>
        ))}
        <div className='text-center' style={errorMessage === '' ? hidden : {}}>
          <p style={{...red, ...small}}>{errorMessage || 'error'}</p>
        </div>
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
