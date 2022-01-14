import React from 'react';
import {useNavigate} from 'react-router-dom';

import AppContext from '../AppContext';
import Header from '../components/Header';

function TenantProfileInfo(props) {
  const context = React.useContext(AppContext);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (context.userData.access_token === null) {
      navigate('/');
      return;
    }
    const userRole = context.userData.user.role;
    if (userRole.indexOf('TENANT') === -1) {
      console.log('no tenant profile');
      props.onConfirm();
    }
  }, []);
  return (
    <div>
      <Header title='Tenant Profile'/>
    </div>
  );
}

export default TenantProfileInfo;
