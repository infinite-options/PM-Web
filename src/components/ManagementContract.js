import React from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import Header from './Header';
import File from '../icons/File.svg';
import ManagerFees from './ManagerFees';
import BusinessContact from './BusinessContact';
import EditIcon from '../icons/EditIcon.svg';
import DeleteIcon from '../icons/DeleteIcon.svg';
import {put, post} from '../utils/api';
import {small, hidden, red, squareForm, mediumBold, smallPillButton} from '../utils/styles';
import AppContext from "../AppContext";

function ManagementContract(props) {
  const {userData, refresh} = React.useContext(AppContext);
  const {access_token, user} = userData;
  const {back, property, contract, reload} = props;

  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [feeState, setFeeState] = React.useState([]);
  const contactState = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const [newFile, setNewFile] = React.useState(null);
  const [editingDoc, setEditingDoc] = React.useState(null);
  const addFile = (e) => {
    const file = e.target.files[0];
    const newFile = {
      name: file.name,
      description: '',
      file: file
    }
    setNewFile(newFile);
  }
  const updateNewFile = (field, value) => {
    const newFileCopy = {...newFile};
    newFileCopy[field] = value;
    setNewFile(newFileCopy);
  }
  const cancelEdit = () => {
    setNewFile(null);
    if (editingDoc !== null) {
      const newFiles = [...files];
      newFiles.push(editingDoc);
      setFiles(newFiles);
    }
    setEditingDoc(null);
  }
  const editDocument = (i) => {
    const newFiles = [...files];
    const file = newFiles.splice(i, 1)[0];
    setFiles(newFiles);
    setEditingDoc(file);
    setNewFile({...file});
  }
  const saveNewFile = (e) => {
    // copied from addFile, change e.target.files to state.newFile
    const newFiles = [...files];
    newFiles.push(newFile);
    setFiles(newFiles);
    setNewFile(null);
  }
  const deleteDocument = (i) => {
    const newFiles = [...files];
    newFiles.splice(i, 1);
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
      newContract[key] = files[i].file;
      delete files[i].file;
    }
    newContract.documents = JSON.stringify(files);

    if (contract) {
      newContract.contract_uid = contract.contract_uid;
      console.log(newContract);
      const response = await put(`/contracts`, newContract, null, files);
    } else {
      console.log(newContract);
      const response = await post('/contracts', newContract, null, files);
    }

    // Updating Management Status in property to SENT
    const management_businesses = user.businesses.filter(business => business.business_type === "MANAGEMENT")
    let management_buid = null
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid
    }
    const newProperty = {
      property_uid: property.property_uid,
      manager_id: management_buid,
      management_status: "SENT"
    }
    const images = JSON.parse(property.images);
    for (let i = -1; i < images.length-1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = 'img_cover';
      }
      newProperty[key] = images[i+1];
    }
    await put('/properties', newProperty, null, images);
    back();
    reload();
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
                <div>
                  <h6 style={mediumBold}>
                    {file.name}
                  </h6>
                  <p style={small} className='m-0'>
                    {file.description}
                  </p>
                </div>
                <div>
                  <img src={EditIcon} alt='Edit' className='px-1 mx-2'
                    onClick={() => editDocument(i)}/>
                  <img src={DeleteIcon} alt='Delete' className='px-1 mx-2'
                    onClick={() => deleteDocument(i)}/>
                  <a href={file.link} target='_blank'>
                    <img src={File}/>
                  </a>
                </div>
              </div>
              <hr style={{opacity: 1}}/>
            </div>
          ))}
          {newFile !== null ? (
            <div>
              <Form.Group>
                <Form.Label as='h6' className='mb-0 ms-2'>
                  Document Name
                </Form.Label>
                <Form.Control style={squareForm} value={newFile.name} placeholder='Name'
                  onChange={(e) => updateNewFile('name', e.target.value)}/>
              </Form.Group>
              <Form.Group>
                <Form.Label as='h6' className='mb-0 ms-2'>
                  Description
                </Form.Label>
                <Form.Control style={squareForm} value={newFile.description} placeholder='Description'
                  onChange={(e) => updateNewFile('description', e.target.value)}/>
              </Form.Group>
              <div className='text-center my-3'>
                <Button variant='outline-primary' style={smallPillButton} as='p'
                  onClick={cancelEdit} className='mx-2'>
                  Cancel
                </Button>
                <Button variant='outline-primary' style={smallPillButton} as='p'
                  onClick={saveNewFile} className='mx-2'>
                  Save Document
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <input id='file' type='file' accept='image/*,.pdf' onChange={addFile} className='d-none'/>
              <label htmlFor='file'>
                <Button variant='outline-primary' style={smallPillButton} as='p'>
                  Add Document
                </Button>
              </label>
            </div>
          )}
        </div>
      </Container>
    </div>
  );

}

export default ManagementContract;
