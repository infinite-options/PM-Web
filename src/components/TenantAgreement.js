import React from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import Header from './Header';
import File from '../icons/File.svg';
import ManagerFees from './ManagerFees';
import BusinessContact from './BusinessContact';
import {small, hidden, red, squareForm, mediumBold, smallPillButton} from '../utils/styles';

function TenantAgreement(props) {
  const {back} = props;

  const [address, setAddress] = React.useState('');
  const [unit, setUnit] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [zip, setZip] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const feeState = React.useState([]);
  const contactState = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const addFile = (e) => {
    const newFiles = [...files];
    newFiles.push(e.target.files[0]);
    setFiles(newFiles);
  }
  const save = () => {
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
          <h5 style={mediumBold}>Property Details</h5>
          <Form.Group className='mx-2 my-3'>
            <Form.Label as='h6' className='mb-0 ms-2'>
              Property Street {address === '' ? required : ''}
            </Form.Label>
            <Form.Control style={squareForm} placeholder='283 Barley St' value={address}
              onChange={(e) => setAddress(e.target.value)}/>
          </Form.Group>
          <div className='d-flex my-3'>
            <Form.Group className='mx-2'>
              <Form.Label as='h6' className='mb-0 ms-2'>
                Unit {unit === '' ? required : ''}
              </Form.Label>
              <Form.Control style={squareForm} placeholder='#122' value={unit}
                onChange={(e) => setUnit(e.target.value)}/>
            </Form.Group>
            <Form.Group className='mx-2'>
              <Form.Label as='h6' className='mb-0 ms-2'>
                City {city === '' ? required : ''}
              </Form.Label>
              <Form.Control style={squareForm} placeholder='San Jose' value={city}
                onChange={(e) => setCity(e.target.value)}/>
            </Form.Group>
          </div>
          <div className='d-flex my-3'>
            <Form.Group className='mx-2'>
              <Form.Label as='h6' className='mb-0 ms-2'>
                State {state === '' ? required : ''}
              </Form.Label>
              <Form.Control style={squareForm} placeholder='CA' value={state}
                onChange={(e) => setState(e.target.value)}/>
            </Form.Group>
            <Form.Group className='mx-2'>
              <Form.Label as='h6' className='mb-0 ms-2'>
                Zip Code {zip === '' ? required : ''}
              </Form.Label>
              <Form.Control style={squareForm} placeholder='95120' value={zip}
                onChange={(e) => setZip(e.target.value)}/>
            </Form.Group>
          </div>
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
            <ManagerFees state={feeState}/>
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
            <p style={smallPillButton}>
              Add Document
            </p>
          </label>
        </div>
      </Container>
    </div>
  );

}

export default TenantAgreement;
