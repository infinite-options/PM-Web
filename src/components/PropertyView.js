import React from 'react';
import {Container, Form} from 'react-bootstrap';
import Header from '../components/Header';
import {tileImg, gray, orangePill, greenPill, mediumBold, mediumImg} from '../utils/styles';
import PropertyCashFlow from './PropertyCashFlow';
import PropertyForm from './PropertyForm';
import ArrowUp from '../icons/ArrowUp.svg';
import ArrowDown from '../icons/ArrowDown.svg';
import Phone from '../icons/Phone.svg';
import Message from '../icons/Message.svg';
import CreateTax from './CreateTax';

function PropertyView(props) {

  const {property, back, reload} = props;

  const [currentImg, setCurrentImg] = React.useState(0);
  const [expandDetails, setExpandDetails] = React.useState(false);
  const [editProperty, setEditProperty] = React.useState(false);
  const [showCreateExpense, setShowCreateExpense] = React.useState(false);
  const [showCreateTax, setShowCreateTax] = React.useState(false);
  const [showCreateMortgage, setShowCreateMortgage] = React.useState(false);

  const headerBack = () => {
    editProperty ? setEditProperty(false) :
    showCreateExpense ? setShowCreateExpense(false) :
    showCreateTax ? setShowCreateTax(false) :
    showCreateMortgage ? setShowCreateMortgage(false) :
    back();
  }

  const nextImg = () => {
    if (currentImg === JSON.parse(property.images).length - 1) {
      setCurrentImg(0);
    } else {
      setCurrentImg(currentImg+1);
    }
  }
  const previousImg = () => {
    if (currentImg === 0) {
      setCurrentImg(JSON.parse(property.images).length - 1);
    } else {
      setCurrentImg(currentImg-1);
    }
  }

  const reloadProperty = () => {
    setEditProperty(false);
    reload();
  }

  const cashFlowState = {
    setShowCreateExpense,
    setShowCreateTax,
    setShowCreateMortgage
  };

  return (
    <div>
      <Header title='Properties' leftText='< Back' leftFn={headerBack}/>
      <Container className='pb-5 mb-5'>
        {editProperty ? (
          <PropertyForm property={property} edit={editProperty} setEdit={setEditProperty}
            onSubmit={reloadProperty}/>
        ) : showCreateExpense ? (
          <div>
            Create Expense
            <Form.Control type='date'/>
          </div>
        ) : showCreateTax ? (
          <CreateTax back={() => setShowCreateTax(false)}/>
        ) : showCreateMortgage ? (
          <div>
            Create Mortgage
          </div>
        ) : (
          <div>
            <div style={{...tileImg, height: '200px', position: 'relative'}}>
              {JSON.parse(property.images).length > 0 ? (
                <img src={JSON.parse(property.images)[currentImg]} className='w-100 h-100'
                  style={{borderRadius: '4px', objectFit: 'contain'}} alt='Property'/>
              ) : ''}
              <div style={{position: 'absolute', left: '5px', top: '90px'}}
                onClick={previousImg}>
                {'<'}
              </div>
              <div style={{position: 'absolute', right: '5px', top: '90px'}}
                onClick={nextImg}>
                {'>'}
              </div>
            </div>
            <h5 className='mt-2 mb-0' style={mediumBold}>
              ${property.listed_rent}/mo
            </h5>
            <p style={gray} className='mt-1 mb-2'>
              {property.address}{property.unit !== '' ? ` ${property.unit}, ` : ', '}
              {property.city}, {property.state} {property.zip}
            </p>
            <div className='d-flex'>
              {property.rental_uid !== null ? (
                <p style={greenPill} className='mb-0'>Rented</p>
              ) : (
                <p style={orangePill} className='mb-0'>Not Rented</p>
              )}
            </div>
            <PropertyCashFlow property={property} state={cashFlowState}/>
            {property.manager_first_name !== null ? (
              <div>
                <div className='d-flex justify-content-between mt-3'>
                  <div>
                    <h6 style={mediumBold} className='mb-1'>
                      {property.manager_first_name} {property.manager_last_name}
                    </h6>
                    <p style={{...gray, ...mediumBold}} className='mb-1'>
                      Property Manager
                    </p>
                  </div>
                  <div>
                    <a href={`tel:${property.manager_phone_number}`}>
                      <img src={Phone} alt='Phone' style={mediumImg}/>
                    </a>
                    <a href={`mailto:${property.manager_email}`}>
                      <img src={Message} alt='Message' style={mediumImg}/>
                    </a>
                  </div>
                </div>
                <hr style={{opacity: 1}} className='mt-1'/>
              </div>
            ) : ''}
            <div onClick={() => setExpandDetails(!expandDetails)}>
              <div className='d-flex justify-content-between mt-3'>
                <h6 style={mediumBold} className='mb-1'>Details</h6>
                <img src={expandDetails ? ArrowUp : ArrowDown} alt='Expand'/>
              </div>
              <hr style={{opacity: 1}} className='mt-1'/>
            </div>
            {expandDetails ? (
              <PropertyForm property={property} edit={editProperty} setEdit={setEditProperty}/>
            ) : ''}
          </div>
        )}
      </Container>
    </div>
  );

}

export default PropertyView;
