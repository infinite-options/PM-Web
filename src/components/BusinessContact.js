import React from 'react';
import {Form, Button} from 'react-bootstrap';
import EditIcon from '../icons/EditIcon.svg';
import DeleteIcon from '../icons/DeleteIcon.svg';
import {squareForm, pillButton, smallPillButton, gray} from '../utils/styles';

function BusinessContact(props) {
  const [contactState, setContactState] = props.state;
  const [newContact, setNewContact] = React.useState(null);
  const emptyContact = {
    first_name: '',
    last_name: '',
    company_role: '',
    phone_number: '',
    email: ''
  }
  const addContact = () => {
    const newContactState = [...contactState];
    newContactState.push({...newContact});
    setContactState(newContactState);
    cancelEdit();
  }
  const cancelEdit = () => {
    setNewContact(null);
  }
  const editContact = (i) => {
    setNewContact(contactState[i]);
  }
  const deleteContact = (i) => {
    const newContactState = [...contactState];
    newContactState.splice(i, 1);
    setContactState(newContactState);
  }
  const changeNewContact = (event, field) => {
    const changedContact = {...newContact};
    changedContact[field] = event.target.value;
    setNewContact(changedContact);
  }
  return (
    <div>
      <h6 className='mb-3'>Contact Info:</h6>
      {contactState.map((contact, i) => (
        <div key={i}>
          <div className='d-flex'>
            <div className='flex-grow-1'>
              <h6 className='mb-1'>
                {contact.first_name} {contact.last_name} ({contact.company_role})
              </h6>
            </div>
            <div>
              <img src={EditIcon} alt='Edit' className='px-1 mx-2'
                onClick={() => editContact(i)}/>
              <img src={DeleteIcon} alt='Delete' className='px-1 mx-2'
                onClick={() => deleteContact(i)}/>
            </div>
          </div>
          <div className='d-flex'>
            <div className='me-4'>
              <p style={gray} className='mb-1'>{contact.phone_number}</p>
            </div>
            <div>
              <p style={gray} className='mb-1'>{contact.email}</p>
            </div>
          </div>
          <hr className='mt-1'/>
        </div>
      ))}
      {newContact !== null ? (
        <div>
          <Form.Group className='mx-2 my-3'>
            <Form.Label as='h6' className='mb-0 ms-2'>First Name</Form.Label>
            <Form.Control style={squareForm} placeholder='First' value={newContact.first_name}
              onChange={(e) => changeNewContact(e, 'first_name')}/>
          </Form.Group>
          <Form.Group className='mx-2 my-3'>
            <Form.Label as='h6' className='mb-0 ms-2'>Last Name</Form.Label>
            <Form.Control style={squareForm} placeholder='Last' value={newContact.last_name}
              onChange={(e) => changeNewContact(e, 'last_name')}/>
          </Form.Group>
          <Form.Group className='mx-2 my-3'>
            <Form.Label as='h6' className='mb-0 ms-2'>Role at the company</Form.Label>
            <Form.Control style={squareForm} placeholder='Role' value={newContact.company_role}
              onChange={(e) => changeNewContact(e, 'company_role')}/>
          </Form.Group>
          <Form.Group className='mx-2 my-3'>
            <Form.Label as='h6' className='mb-0 ms-2'>Phone Number</Form.Label>
            <Form.Control style={squareForm} placeholder='(xxx)xxx-xxxx' value={newContact.phone_number}
              onChange={(e) => changeNewContact(e, 'phone_number')}/>
          </Form.Group>
          <Form.Group className='mx-2 my-3'>
            <Form.Label as='h6' className='mb-0 ms-2'>Email Address</Form.Label>
            <Form.Control style={squareForm} placeholder='Email' value={newContact.email}
              onChange={(e) => changeNewContact(e, 'email')}/>
          </Form.Group>
        </div>
      ) : ''}

      {newContact === null ? (
        <Button variant='outline-primary' style={smallPillButton}
          onClick={() => setNewContact({...emptyContact})}>
          Add Another Person
        </Button>
      ) : (
        <div className='d-flex justify-content-center my-4'>
          <Button variant='outline-primary' style={pillButton} onClick={cancelEdit}
            className='mx-2'>
            Cancel
          </Button>
          <Button variant='outline-primary' style={pillButton} onClick={addContact}
            className='mx-2'>
            Add Contact
          </Button>
        </div>
      )}
    </div>
  );
}

export default BusinessContact;
