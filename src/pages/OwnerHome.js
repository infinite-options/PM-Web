import React from 'react';
import {useNavigate} from 'react-router-dom';
import Footer from '../components/Footer';
import AppContext from '../AppContext';
import OwnerProperties from './OwnerProperties';

function OwnerHome() {
  const navigate = useNavigate();
  const {userData} = React.useContext(AppContext);
  const [footerTab, setFooterTab] = React.useState('DASHBOARD');
  const [showFooter, setShowFooter] = React.useState(true);
  React.useEffect(() => {
    if (userData.access_token === null) {
      navigate('/');
    }
  }, []);
  return (
    <div className='d-flex flex-column h-100'>
      <div className='flex-grow-1'>
        {footerTab === 'DASHBOARD' ? (
          <OwnerProperties setShowFooter={setShowFooter}/>
        ) : ''}
      </div>
      {showFooter ? (
        <Footer tab={footerTab} setTab={setFooterTab}/>
      ) : ''}
    </div>
  );
}

export default OwnerHome;
