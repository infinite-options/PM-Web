import React from 'react';

import BusinessProfileInfo from './BusinessProfileInfo';
import OwnerProfileInfo from './OwnerProfileInfo';
import TenantProfileInfo from './TenantProfileInfo';
import ManagerProfileInfo from './ManagerProfileInfo';
import Header from '../components/Header';
import EmployeeProfile from '../components/EmployeeProfile';
import SelectRole from '../components/SelectRole';

import {bolder} from '../utils/styles';

function ProfileInfo() {
  const [profileStage, setProfileStage] = React.useState('MANAGER');
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [profileStage])
  return (
    <div className='h-100 pb-5'>
      {profileStage === 'MANAGER' ? (
        <ManagerProfileInfo onConfirm={() => setProfileStage('PM_EMPLOYEE')}/>
      ) : profileStage === 'PM_EMPLOYEE' ? (
        <EmployeeProfile businessType='MANAGEMENT' onConfirm={() => setProfileStage('OWNER')}/>
      ) : profileStage === 'OWNER' ? (
        <OwnerProfileInfo onConfirm={() => setProfileStage('TENANT')}/>
      ) : profileStage === 'TENANT' ? (
        <TenantProfileInfo onConfirm={() => setProfileStage('MAINTENANCE')}/>
      ) : profileStage === 'MAINTENANCE' ? (
        <BusinessProfileInfo onConfirm={() => setProfileStage('MAINT_EMPLOYEE')}/>
      ) : profileStage === 'MAINT_EMPLOYEE' ? (
        <EmployeeProfile businessType='MAINTENANCE' onConfirm={() => setProfileStage('ROLE')}/>
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
