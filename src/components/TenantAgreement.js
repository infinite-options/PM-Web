import React from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import Header from './Header';
import File from '../icons/File.svg';
import ManagerFees from './ManagerFees';
import BusinessContact from './BusinessContact';
import {put, post} from '../utils/api';
import {small, hidden, red, squareForm, mediumBold, smallPillButton} from '../utils/styles';

function TenantAgreement(props) {
  const {back, property, agreement, acceptedTenants, setAcceptedTenants} = props;

  const [tenantID, setTenantID] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [feeState, setFeeState] = React.useState([]);
  const contactState = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const addFile = (e) => {
    const newFiles = [...files];
    newFiles.push(e.target.files[0]);
    setFiles(newFiles);
  }
  const loadAgreement = () => {
    setTenantID(agreement.tenant_id);
    setStartDate(agreement.lease_start);
    setEndDate(agreement.lease_end);
    setFeeState(JSON.parse(agreement.rent_payments));
    contactState[1](JSON.parse(agreement.assigned_contacts));
    setFiles(JSON.parse(agreement.documents));
  }
  React.useEffect(() => {
    if (agreement) {
      loadAgreement();
    }
  }, [agreement]);
  const save = async () => {
    const newAgreement = {
      rental_property_id: property.property_uid,
      tenant_id: tenantID,
      lease_start: startDate,
      lease_end: endDate,
      rent_payments: JSON.stringify(feeState),
      assigned_contacts: JSON.stringify(contactState[0])
    }
    for (let i = 0; i < files.length; i++) {
      let key = `img_${i}`;
      newAgreement[key] = files[i];
    }
    if (agreement) {
      newAgreement.rental_uid = agreement.rental_uid;
      console.log(newAgreement);
      const response = await put(`/rentals`, newAgreement, null, files);
    } else {
      console.log(newAgreement);
      const response = await post('/rentals', newAgreement, null, files);
    }
    back();
  }
  const [errorMessage, setErrorMessage] = React.useState('');
  const required = (
    errorMessage === 'Please fill out all fields' ? (
      <span style={red} className='ms-1'>*</span>
    ) : ''
  );
  return (
    <div className='mb-5 pb-5'>
      <Header title='Tenant Agreement' leftText='< Back' leftFn={back}
        rightText='Save' rightFn={save}/>
      <Container>
        <div className='mb-4'>
          <h5 style={mediumBold}>Tenant(s)</h5>
          {/*<Form.Group className='mx-2 my-3'>*/}
          {/*  <Form.Label as='h6' className='mb-0 ms-2'>*/}
          {/*    Tenant ID {tenantID === '' ? required : ''}*/}
          {/*  </Form.Label>*/}
          {/*  <Form.Control style={squareForm} value={tenantID} placeholder='100-000001'*/}
          {/*    onChange={(e) => setTenantID(e.target.value)}/>*/}
          {/*</Form.Group>*/}
          {acceptedTenants && acceptedTenants.length > 0 && acceptedTenants.map((tenant_id, i) =>
              <Form.Group className='mx-2 my-3' key={i}>
                <Form.Label as='h6' className='mb-0 ms-2'>
                  Tenant ID {tenantID === '' ? required : ''}
                </Form.Label>
                <Form.Control style={squareForm} value={tenant_id} readOnly={true}/>
              </Form.Group>
          )}
        </div>
        <div className='mb-4'>
          <h5 style={mediumBold}>Lease Dates</h5>
          <Form.Group className='mx-2 my-3'>
            <Form.Label as='h6' className='mb-0 ms-2'>
              Start Date {startDate === '' ? required : ''}
            </Form.Label>
            <Form.Control style={squareForm} type='date' value={startDate}
              onChange={(e) => setStartDate(e.target.value)}/>
          </Form.Group>
          <Form.Group className='mx-2 my-3'>
            <Form.Label as='h6' className='mb-0 ms-2'>
              End Date {endDate === '' ? required : ''}
            </Form.Label>
            <Form.Control style={squareForm} type='date' value={endDate}
              onChange={(e) => setEndDate(e.target.value)}/>
          </Form.Group>
        </div>
        <div className='mb-4'>
          <h5 style={mediumBold}>Rent Payments</h5>
          <div className='mx-2'>
            <ManagerFees feeState={feeState} setFeeState={setFeeState}/>
          </div>
        </div>
        <div className='mb-4'>
          <h5 style={mediumBold}>Contact Details</h5>
          <BusinessContact state={contactState}/>
        </div>
        <div className='mb-4'>
          <h5 style={mediumBold}>Tenant Documents</h5>
          {files.map((file, i) => (
            <div key={i}>
              <div className='d-flex justify-content-between align-items-end'>
                <h6 style={mediumBold}>{file.name}</h6>
                <img src={File}/>
              </div>
              <hr style={{opacity: 1}}/>
            </div>
          ))}
          <input id='file' type='file' accept='image/*,.pdf' onChange={addFile} className='d-none'/>
          <label htmlFor='file'>
            <Button variant='outline-primary' style={smallPillButton} as='p'>
              Add Document
            </Button>
          </label>
        </div>
      </Container>
    </div>
  );

}

export default TenantAgreement;
