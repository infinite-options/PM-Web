import React from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import Header from './Header';
import File from '../icons/File.svg';
import ManagerFees from './ManagerFees';
import BusinessContact from './BusinessContact';
import {put, post} from '../utils/api';
import {small, hidden, red, squareForm, mediumBold, smallPillButton} from '../utils/styles';

function ManagementContract(props) {
  const {back, property, contract} = props;


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
  const loadContract = () => {
    setStartDate(contract.start_date);
    setEndDate(contract.end_date);
    setFeeState(JSON.parse(contract.contract_fees));
    contactState[1](JSON.parse(contract.assigned_contacts));
    setFiles(JSON.parse(contract.documents));
  }
  React.useEffect(() => {
    if (contract) {
      loadContract();
    }
  }, [contract]);
  const save = async () => {
    const newContract = {
      property_uid: property.property_uid,
      business_uid: property.manager_id,
      start_date: startDate,
      end_date: endDate,
      contract_fees: JSON.stringify(feeState),
      assigned_contacts: JSON.stringify(contactState[0])
    }
    for (let i = 0; i < files.length; i++) {
      let key = `doc_${i}`;
      newContract[key] = files[i];
    }
    if (contract) {
      newContract.contract_uid = contract.contract_uid;
      console.log(newContract);
      const response = await put(`/contracts`, newContract, null, files);
    } else {
      console.log(newContract);
      const response = await post('/contracts', newContract, null, files);
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
      <Header title='Management Contract' leftText='< Back' leftFn={back}
        rightText='Save' rightFn={save}/>
      <Container>
        <div className='mb-4'>
          <h5 style={mediumBold}>PM Agreement Dates</h5>
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
          <h5 style={mediumBold}>PM Fees</h5>
          <div className='mx-2'>
            <ManagerFees feeState={feeState} setFeeState={setFeeState}/>
          </div>
        </div>
        <div className='mb-4'>
          <h5 style={mediumBold}>Contact Details</h5>
          <BusinessContact state={contactState}/>
        </div>
        <div className='mb-4'>
          <h5 style={mediumBold}>Property Manager Documents</h5>
          {files.map((file, i) => (
            <div key={i}>
              <div className='d-flex justify-content-between align-items-end'>
                <h6 style={mediumBold}>
                  {typeof(file) === typeof('') ? file.split('/').pop() : file.name}
                </h6>
                <a href={file} target='_blank'>
                  <img src={File}/>
                </a>
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

export default ManagementContract;
