import React from 'react';
import {useNavigate} from 'react-router-dom';

import AppContext from '../AppContext';
import Header from '../components/Header';

function ManagerProfileInfo(props) {
  const context = React.useContext(AppContext);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (context.userData.access_token === null) {
      navigate('/');
      return;
    }
    const userRole = context.userData.user.role;
    if (userRole.indexOf('MANAGER') === -1) {
      console.log('no manager profile');
      props.onConfirm();
    }
  }, []);
  return (
    <div>
      <Header title='PM Profile'/>
    </div>
  );
}

export default ManagerProfileInfo;
