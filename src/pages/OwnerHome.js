import React from 'react';
import Footer from '../components/Footer';
import AppContext from '../AppContext';
import OwnerProperties from './OwnerProperties';

function OwnerHome() {
  const {userData} = React.useContext(AppContext);
  const [footerTab, setFooterTab] = React.useState('DASHBOARD');
  const [showFooter, setShowFooter] = React.useState(true);
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
