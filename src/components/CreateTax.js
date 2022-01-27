import React from 'react';
import {Form, Button} from 'react-bootstrap';
import {squareForm, pillButton, small, hidden, red} from '../utils/styles';
import ArrowDown from '../icons/ArrowDown.svg';

function CreateTax(props) {
  const [category, setCategory] = React.useState('Tax');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [frequency, setFrequency] = React.useState('Monthly');
  const [frequencyOfPayment, setFrequencyOfPayment] = React.useState('Every other month');
  const [date, setDate] = React.useState('');
  React.useEffect(() => {
    if (frequency === 'Monthly') {
      const newFrequencyOfPayment = frequencyOfPayment.replace('year', 'month');
      setFrequencyOfPayment(newFrequencyOfPayment);
    } else if (frequency === 'Annually') {
      const newFrequencyOfPayment = frequencyOfPayment.replace('month', 'year');
      setFrequencyOfPayment(newFrequencyOfPayment);
    }
  }, [frequency])
  const submitForm = () => {
    if (title === '' || amount === '' || date === '') {
      setErrorMessage('Please fill out all fields');
      return;
    }
    const newTax = {
      category: category,
      title: title,
      description: description,
      amount: amount,
      frequency: frequency,
      frequency_of_payment: frequencyOfPayment,
      next_date: date
    };
    console.log(newTax);
    props.back();
  }
  const [errorMessage, setErrorMessage] = React.useState('');
  const required = (
    errorMessage === 'Please fill out all fields' ? (
      <span style={red} className='ms-1'>*</span>
    ) : ''
  );
  return (
    <div>
      <h5>Add New Tax Payment</h5>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>
          Category
        </Form.Label>
        <Form.Select style={{...squareForm, backgroundImage: `url(${ArrowDown})`}}
          value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Tax</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>
          Title {title === '' ? required : ''}
        </Form.Label>
        <Form.Control style={squareForm} placeholder='Painting'
          value={title} onChange={(e) => setTitle(e.target.value)}/>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>
          Description
        </Form.Label>
        <Form.Control style={squareForm} placeholder='Apartment Maintenance'
          value={description} onChange={(e) => setDescription(e.target.value)}/>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>
          Amount {amount === '' ? required : ''}
        </Form.Label>
        <Form.Control style={squareForm} placeholder='200'
          value={amount} onChange={(e) => setAmount(e.target.value)}/>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>
          Frequency
        </Form.Label>
        <Form.Select style={{...squareForm, backgroundImage: `url(${ArrowDown})`}}
          value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option>Monthly</option>
          <option>Annually</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>
          Frequency of payment
        </Form.Label>
        <Form.Select style={{...squareForm, backgroundImage: `url(${ArrowDown})`}}
          value={frequencyOfPayment} onChange={(e) => setFrequencyOfPayment(e.target.value)}>
          <option>Every other {frequency === 'Monthly' ? 'month' : 'year'}</option>
          <option>Once a {frequency === 'Monthly' ? 'month' : 'year'}</option>
          <option>Twice a {frequency === 'Monthly' ? 'month' : 'year'}</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className='mx-2 my-3'>
        <Form.Label as='h6' className='mb-0 ms-2'>
          Next payment {date === '' ? required : ''}
        </Form.Label>
        <Form.Control style={squareForm} placeholder='200' type='date'
          value={date} onChange={(e) => setDate(e.target.value)}/>
      </Form.Group>
      <div className='text-center' style={errorMessage === '' ? hidden : {}}>
        <p style={{...red, ...small}}>{errorMessage || 'error'}</p>
      </div>
      <div className='d-flex justify-content-center my-4'>
        <Button variant='outline-primary' style={pillButton} onClick={props.back}
          className='mx-2'>
          Cancel
        </Button>
        <Button variant='outline-primary' style={pillButton} onClick={submitForm}
          className='mx-2'>
          Save Tax
        </Button>
      </div>
    </div>
  );
}

export default CreateTax;
