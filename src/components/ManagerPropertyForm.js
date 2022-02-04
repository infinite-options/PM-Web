import React from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import AppContext from '../AppContext';
import {pillButton, squareForm, tileImg, xSmall, bold, hidden, red, small} from '../utils/styles';
import {post, put} from '../utils/api';
import Heart from '../icons/Heart.svg';
import Edit from '../icons/Edit.svg';
import Checkbox from './Checkbox';
import PropertyAppliances from './PropertyAppliances';
import PropertyUtilities from './PropertyUtilities';
import PropertyImages from './PropertyImages';

function ManagerPropertyForm(props) {
    const {userData} = React.useContext(AppContext);
    const {user} = userData;
    const applianceState = React.useState({
        Microwave: false,
        Dishwasher: false,
        Refrigerator: false,
        Washer: false,
        Dryer: false,
        Range: false
    });
    const utilityState = React.useState({
        Electricity: false,
        Trash: false,
        Water: false,
        Wifi: false,
        Gas: false
    });
    const imageState = React.useState([]);
    const [address, setAddress] = React.useState('');
    const [unit, setUnit] = React.useState('');
    const [city, setCity] = React.useState('');
    const [state, setState] = React.useState('');
    const [zip, setZip] = React.useState('');
    const [type, setType] = React.useState('');
    const [numBeds, setNumBeds] = React.useState('');
    const [numBaths, setNumBaths] = React.useState('');
    const [area, setArea] = React.useState('');
    const [rent, setRent] = React.useState('');
    const [deposit, setDeposit] = React.useState('');
    const [petsAllowed, setPetsAllowed] = React.useState(false);
    const [depositForRent, setDepositForRent] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const {property, edit, setEdit} = props;
    const loadProperty = () => {
        setAddress(property.address);
        setUnit(property.unit);
        setCity(property.city);
        setState(property.state);
        setZip(property.zip);
        setType(property.property_type);
        setNumBeds(property.num_beds);
        setNumBaths(property.num_baths);
        setArea(property.area);
        setRent(property.listed_rent);
        setDeposit(property.deposit);
        setPetsAllowed(property.pets_allowed);
        setDepositForRent(property.deposit_for_rent);
        applianceState[1](JSON.parse(property.appliances));
        utilityState[1](JSON.parse(property.utilities));
        loadImages();
    }
    React.useEffect(() => {
        if (property) {
            loadProperty();
        }
        if (edit) {
            window.scrollTo(0, 0);
        }
    }, [edit, property]);

    const submitForm = async () => {
        if (address === '' || city === '' || state === '' || zip === '' || type === ''
            || numBeds === '' || numBaths === '' || area === '' || rent === '' || deposit === '') {
            setErrorMessage('Please fill out all fields');
            return;
        }
        const newProperty = {
            owner_id: user.user_uid,
            manager_id: '',
            address: address,
            unit: unit,
            city: city,
            state: state,
            zip: zip,
            property_type: type,
            num_beds: numBeds,
            num_baths: numBaths,
            area: area,
            listed_rent: rent,
            deposit: deposit,
            appliances: JSON.stringify(applianceState[0]),
            utilities: JSON.stringify(utilityState[0]),
            pets_allowed: petsAllowed,
            deposit_for_rent: depositForRent
        };
        const files = imageState[0];
        let i = 0;
        for (const file of imageState[0]) {
            let key = (file.coverPhoto ? 'img_cover' : `img_${i++}`)
            if (file.file !== null) {
                newProperty[key] = file.file;
            } else {
                newProperty[key] = file.image;
            }
        }
        if (property) {
            newProperty.owner_id = property.owner_id;
            newProperty.manager_id = property.manager_id;
            console.log(newProperty)
            const response = await put(`/properties/${property.property_uid}`, newProperty, null, files);
        } else {
            const response = await post('/properties', newProperty, null, files);
        }
        // props.onSubmit();
        setEdit(false)
    }

    const loadImages = async () => {
        const files = [];
        const images = JSON.parse(property.images);
        for (let i = 0; i < images.length; i++) {
            files.push({
                index: i,
                image: images[i],
                file: null,
                coverPhoto: i === 0
            });
        }
        imageState[1](files);
    }

    const required = (
        errorMessage === 'Please fill out all fields' ? (
            <span style={red} className='ms-1'>*</span>
        ) : ''
    );
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    return (
        <div className='mx-2'>
            {edit ? (
                <div>
                    <Form.Group className='mx-2 my-3'>
                        <Form.Label as='h6' className='mb-0 ms-2'>Address {required}</Form.Label>
                        <Form.Control style={squareForm} placeholder='283 Barley St' value={address}
                                      onChange={(e) => setAddress(e.target.value)}/>
                    </Form.Group>
                    <div className='d-flex my-3'>
                        <Form.Group className='mx-2'>
                            <Form.Label as='h6' className='mb-0 ms-2'>Unit</Form.Label>
                            <Form.Control style={squareForm} placeholder='#122' value={unit}
                                          onChange={(e) => setUnit(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className='mx-2'>
                            <Form.Label as='h6' className='mb-0 ms-2'>City {required}</Form.Label>
                            <Form.Control style={squareForm} placeholder='San Jose' value={city}
                                          onChange={(e) => setCity(e.target.value)}/>
                        </Form.Group>
                    </div>
                    <div className='d-flex my-3'>
                        <Form.Group className='mx-2'>
                            <Form.Label as='h6' className='mb-0 ms-2'>State {required}</Form.Label>
                            <Form.Control style={squareForm} placeholder='CA' value={state}
                                          onChange={(e) => setState(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className='mx-2'>
                            <Form.Label as='h6' className='mb-0 ms-2'>Zip Code {required}</Form.Label>
                            <Form.Control style={squareForm} placeholder='90808' value={zip}
                                          onChange={(e) => setZip(e.target.value)}/>
                        </Form.Group>
                    </div>
                </div>
            ) : (
                <div>
                    <div className='d-flex justify-content-between'>
                        <h6>Property Address</h6>
                        <img src={Edit} alt='Edit' onClick={() => setEdit(true)}/>
                    </div>
                    <p>{address}{unit === '' ? ',' : ` ${unit},`} {city}, {state}, {zip}</p>
                </div>
            )}
            {edit ? (
                <Form.Group className='mx-2 my-3'>
                    <Form.Label as='h6' className='mb-0 ms-2'>Type {required}</Form.Label>
                    <Form.Control style={squareForm} placeholder='Apartment' value={type}
                                  onChange={(e) => setType(e.target.value)}/>
                </Form.Group>
            ) : (
                <div>
                    <h6>Type</h6>
                    <p>{type}</p>
                </div>
            )}
            {edit ? (
                <div className='d-flex my-3'>
                    <Form.Group className='mx-2'>
                        <Form.Label as='h6' className='mb-0 ms-2'>Bedroom {required}</Form.Label>
                        <Form.Control style={squareForm} placeholder='2' value={numBeds}
                                      onChange={(e) => setNumBeds(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mx-2'>
                        <Form.Label as='h6' className='mb-0 ms-2'>Bath {required}</Form.Label>
                        <Form.Control style={squareForm} placeholder='1.5' value={numBaths}
                                      onChange={(e) => setNumBaths(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mx-2'>
                        <Form.Label as='h6' className='mb-0 ms-2'>Sq. Ft. {required}</Form.Label>
                        <Form.Control style={squareForm} placeholder='1100' value={area}
                                      onChange={(e) => setArea(e.target.value)}/>
                    </Form.Group>
                </div>
            ) : (
                <Row>
                    <Col>
                        <h6>Bedroom</h6>
                        <p>{numBeds}</p>
                    </Col>
                    <Col>
                        <h6>Bath</h6>
                        <p>{numBaths}</p>
                    </Col>
                    <Col>
                        <h6>Sq. Ft.</h6>
                        <p>{area}</p>
                    </Col>
                </Row>
            )}
            {edit ? (
                <Form.Group className='mx-2 my-3'>
                    <Form.Label as='h6' className='mb-0 ms-2'>Monthly Rent {required}</Form.Label>
                    <Form.Control style={squareForm} placeholder='2000' value={rent}
                                  onChange={(e) => setRent(e.target.value)}/>
                </Form.Group>
            ) : (
                <div>
                    <h6>Monthly Rent</h6>
                    <p>{formatter.format(rent)}</p>
                </div>
            )}
            {edit ? (
                <Form.Group className='mx-2 my-3'>
                    <Form.Label as='h6' className='mb-0 ms-2'>Deposit {required}</Form.Label>
                    <Form.Control style={squareForm} placeholder='2000' value={deposit}
                                  onChange={(e) => setDeposit(e.target.value)}/>
                </Form.Group>
            ) : (
                <div>
                    <h6>Deposit</h6>
                    <p>{formatter.format(deposit)}</p>
                </div>
            )}
            <PropertyAppliances state={applianceState} edit={edit}/>
            <PropertyUtilities state={utilityState} edit={edit}/>
            <Container className='my-3'>
                <h6>Pets Allowed</h6>
                <Row>
                    <Col className='d-flex ps-4'>
                        <Checkbox type='CIRCLE' checked={petsAllowed} onClick={edit ? () => setPetsAllowed(true) : () => {}}/>
                        <p className='ms-1 mb-1'>Yes</p>
                    </Col>
                    <Col className='d-flex ps-4'>
                        <Checkbox type='CIRCLE' checked={!petsAllowed} onClick={edit ? () => setPetsAllowed(false) : () => {}}/>
                        <p className='ms-1 mb-1'>No</p>
                    </Col>
                </Row>
            </Container>
            <Container className='my-3'>
                <h6>Deposit can be used for last month's rent</h6>
                <Row>
                    <Col className='d-flex ps-4'>
                        <Checkbox type='CIRCLE' checked={depositForRent} onClick={edit ? () => setDepositForRent(true) : () => {}}/>
                        <p className='ms-1 mb-1'>Yes</p>
                    </Col>
                    <Col className='d-flex ps-4'>
                        <Checkbox type='CIRCLE' checked={!depositForRent} onClick={edit ? () => setDepositForRent(false) : () => {}}/>
                        <p className='ms-1 mb-1'>No</p>
                    </Col>
                </Row>
            </Container>
            {edit ? (
                <div>
                    <PropertyImages state={imageState}/>
                    <div className='text-center' style={errorMessage === '' ? hidden : {}}>
                        <p style={{...red, ...small}}>{errorMessage || 'error'}</p>
                    </div>
                    <div className='text-center my-5'>
                        <Button variant='outline-primary' style={pillButton} className='mx-2'
                                onClick={property ? () => setEdit(false) : props.cancel}>
                            Cancel
                        </Button>
                        <Button variant='outline-primary' style={pillButton} onClick={submitForm}
                                className='mx-2'>
                            Save
                        </Button>
                    </div>
                </div>
            ) : ''}
        </div>
    );

}

export default ManagerPropertyForm;
