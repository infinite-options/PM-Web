import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';

import Header from '../components/Header';
import Emergency from '../icons/Emergency.svg';
import Document from '../icons/Document.svg';
import Property from '../icons/Property.svg';
import Repair from '../icons/Repair.svg';
import UserSearch from '../icons/UserSearch.svg';
import {tileImg, xSmall, smallLine, mediumBold, green, red} from '../utils/styles';

function OwnerDashboard(props) {
  const {setStage, properties} = props;

  return (
    <div>
      <Header title='Dashboard'/>
      <Container className='px-3 pb-5 mb-5'>
        <div>
          <h5 style={mediumBold}>Total Properties</h5>
          <h5 style={{...green, ...mediumBold}} className='mb-0'>
            {properties.length}
          </h5>
          <hr style={{opacity: 1}} className='mt-1'/>
        </div>
        <div>
          <h5 style={mediumBold}>Cashflow</h5>
          <h5 style={{...green, ...mediumBold}} className='mb-0'>
            $3450/mo
          </h5>
          <hr style={{opacity: 1}} className='mt-1'/>
        </div>
        <div>
          <h5 style={mediumBold}>Revenue</h5>
          <h5 style={{...green, ...mediumBold}} className='mb-0'>
            $6000/mo
          </h5>
          <hr style={{opacity: 1}} className='mt-1'/>
        </div>
        <div>
          <h5 style={mediumBold}>Expenses</h5>
          <h5 style={{...red, ...mediumBold}} className='mb-0'>
            $1550/mo
          </h5>
          <hr style={{opacity: 1}} className='mt-1'/>
        </div>
        <div>
          <h5 style={mediumBold}>Taxes</h5>
          <h5 style={{...red, ...mediumBold}} className='mb-0'>
            $150/mo
          </h5>
          <hr style={{opacity: 1}} className='mt-1'/>
        </div>
        <div>
          <h5 style={mediumBold}>Mortgage</h5>
          <h5 style={{...red, ...mediumBold}} className='mb-0'>
            $850/mo
          </h5>
          <hr style={{opacity: 1}} className='mt-1'/>
        </div>
        <Row className='px-2'>
          <Col onClick={() => setStage('PROPERTIES')} className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
            style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
            <img src={Property} alt='Property' style={{width: '50px'}}/>
            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
              Properties
            </p>
          </Col>
          <Col className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
            style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
            <img src={Document} alt='Document' style={{width: '50px'}}/>
            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
              Lease Documents
            </p>
          </Col>
          <Col className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
            style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
            <img src={Document} alt='Document' style={{width: '50px'}}/>
            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
              Manager Documents
            </p>
          </Col>
        </Row>
        <Row className='px-2'>
          <Col className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
            style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
            <img src={Repair} alt='Repair' style={{width: '50px'}}/>
            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
              Request Repair
            </p>
          </Col>
          <Col className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
            style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
            <img src={Emergency} alt='Emergency' style={{width: '50px'}}/>
            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
              Emergency
            </p>
          </Col>
          <Col className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
            style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
            <img src={UserSearch} alt='Search' style={{width: '50px'}}/>
            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
              Search Property Managers
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OwnerDashboard;
