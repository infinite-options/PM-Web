import React from 'react';

import BusinessProfileInfo from './BusinessProfileInfo';
import OwnerProfileInfo from './OwnerProfileInfo';
import TenantProfileInfo from './TenantProfileInfo';
import ManagerProfileInfo from './ManagerProfileInfo';
import Header from '../components/Header';
import EmployeeProfile from '../components/EmployeeProfile';
import SelectRole from '../components/SelectRole';
import AppContext from '../AppContext';

import {bolder} from '../utils/styles';

function ProfileInfo() {
  const [profileStage, setProfileStage] = React.useState('MANAGER');
  const {userData, refresh} = React.useContext(AppContext);
  const {user} = userData;
  const [autofillState, setAutofillState] = React.useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number,
    email: user.email,
    paypal: '',
    apple_pay: '',
    zelle: '',
    venmo: '',
    account_number: '',
    routing_number: '',
    ssn: '',
    ein_number: '',
  });
  React.useEffect(() => {
    if (profileStage === 'ROLE') {
      refresh();
    }
    window.scrollTo(0, 0);
  }, [profileStage])
  return (
    <div className='h-100 pb-5'>
      {profileStage === 'MANAGER' ? (
        <BusinessProfileInfo businessType='MANAGEMENT' onConfirm={() => setProfileStage('PM_EMPLOYEE')}
          autofillState={autofillState} setAutofillState={setAutofillState}/>
      ) : profileStage === 'PM_EMPLOYEE' ? (
        <EmployeeProfile businessType='MANAGEMENT' onConfirm={() => setProfileStage('OWNER')}
          autofillState={autofillState} setAutofillState={setAutofillState}/>
      ) : profileStage === 'OWNER' ? (
        <OwnerProfileInfo onConfirm={() => setProfileStage('TENANT')}
          autofillState={autofillState} setAutofillState={setAutofillState}/>
      ) : profileStage === 'TENANT' ? (
        <TenantProfileInfo onConfirm={() => setProfileStage('MAINTENANCE')}
          autofillState={autofillState} setAutofillState={setAutofillState}/>
      ) : profileStage === 'MAINTENANCE' ? (
        <BusinessProfileInfo businessType='MAINTENANCE' onConfirm={() => setProfileStage('MAINT_EMPLOYEE')}
          autofillState={autofillState} setAutofillState={setAutofillState}/>
      ) : profileStage === 'MAINT_EMPLOYEE' ? (
        <EmployeeProfile businessType='MAINTENANCE' onConfirm={() => setProfileStage('ROLE')}
          autofillState={autofillState} setAutofillState={setAutofillState}/>
      ) : profileStage === 'ROLE' ? (
        <div className='h-100 d-flex flex-column pb-5'>
          <Header title='Sign Up'/>
          <div className='text-center mb-5'>
            <h5 style={bolder} className='mb-1'>Great Job!</h5>
            <h5 style={bolder} className='mb-1'>Your profiles have been set up</h5>
          </div>
          <SelectRole/>
        </div>
      ) : ''}
    </div>
  );
}

export default ProfileInfo;
