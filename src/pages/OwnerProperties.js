import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import AppContext from '../AppContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyForm from '../components/PropertyForm';
import PropertyView from '../components/PropertyView';
import Phone from '../icons/Phone.svg';
import Message from '../icons/Message.svg';
import {get} from '../utils/api';
import {blue, gray, greenPill, orangePill, redPill, tileImg, smallImg, xSmall, hidden} from '../utils/styles';

function OwnerProperties(props) {
  const {setShowFooter} = props;
  const {userData} = React.useContext(AppContext);
  const [footerTab, setFooterTab] = React.useState('DASHBOARD');
  const [stage, setStage] = React.useState('LIST');
  const [selectedProperty, setSelectedProperty] = React.useState(null);
  const {access_token, user} = userData;
  const [properties, setProperties] = React.useState([]);

  const fetchProperties = async () => {
    const response = await get(`/ownerProperties`, access_token);
    setProperties(response.result);
  }
  const selectProperty = (property) => {
    setSelectedProperty(property);
    setStage('PROPERTY');
  }
  const addProperty = () => {
    fetchProperties();
    setStage('LIST');
  }

  React.useEffect(fetchProperties, []);
  React.useEffect(() => {
    setShowFooter(stage !== 'NEW');
  }, [stage]);

  const stopPropagation = (e) => {
    e.stopPropagation();
  }

  return (
    stage === 'LIST' ? (
      <div className='h-100'>
        <Header title='Properties' leftText='+ New' leftFn={() => setStage('NEW')}
          rightText='Sort by'/>
        {properties.map((property, i) => (
          <Container key={i} onClick={() => selectProperty(property)} className='pt-1 mb-4'>
            <Row>
              <Col xs={4}>
                <div style={tileImg}>
                  {JSON.parse(property.images).length > 0 ? (
                    <img src={JSON.parse(property.images)[0]} alt='Image'
                      className='h-100 w-100' style={{objectFit: 'cover'}}/>
                  ) : ''}
                </div>
              </Col>
              <Col className='ps-0'>
                <div className='d-flex justify-content-between align-items-center'>
                  <h5 className='mb-0' style={{fontWeight: '600'}}>
                    ${property.listed_rent}/mo
                  </h5>
                  <p style={greenPill} className='mb-0'>Rent Paid</p>
                </div>
                <p style={gray} className='mt-2 mb-0'>
                  {property.address}{property.unit !== '' ? ' '+property.unit : ''}, {property.city}, {property.state} <br/>
                  {property.zip}
                </p>
                <div className='d-flex'>
                  <div className='flex-grow-1 d-flex flex-column justify-content-center'>
                    <p style={{...blue, ...xSmall}} className='mb-0'>
                      {property.manager_id ?
                        `Manager: ${property.manager_first_name} ${property.manager_last_name}`
                        : 'No Manager'}
                    </p>
                  </div>
                  <div style={property.manager_id ? {} : hidden} onClick={stopPropagation}>
                    <a href={`tel:${property.manager_phone_number}`}>
                      <img src={Phone} alt='Phone' style={smallImg}/>
                    </a>
                    <a href={`mailto:${property.manager_email}`}>
                      <img src={Message} alt='Message' style={smallImg}/>
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        ))}
      </div>
    ) : stage === 'NEW' ? (
      <div className='flex-grow-1'>
        <Header title='Properties' leftText='< Back' leftFn={() => setStage('LIST')}/>
        <PropertyForm cancel={() => setStage('LIST')} onAdd={addProperty}/>
      </div>
    ) : stage === 'PROPERTY' ? (
      <div className='flex-grow-1'>
        <Header title='Properties' leftText='< Back' leftFn={() => setStage('LIST')}/>
        <PropertyView property={selectedProperty}/>
      </div>
    ) : ''
  );

}

export default OwnerProperties;
