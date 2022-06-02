import React from 'react';
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import EditIcon from '../icons/EditIcon.svg';
import DeleteIcon from '../icons/DeleteIcon.svg';
import {
    pillButton,
    smallPillButton,
    squareForm,
    gray,
    small,
    red,
    hidden,
    headings,
    subText,
    formLabel
} from '../utils/styles';
import ArrowDown from "../icons/ArrowDown.svg";
import {useLocation} from "react-router-dom";

function ManagerUtilities(props) {
    const location = useLocation();
    const properties = location.state.properties
    console.log(properties)
    const [currentImg, setCurrentImg] = React.useState(0);
    const [utilityState, setUtilityState] = React.useState([]);
    const [totalEstimate, setTotalEstimate] = React.useState(0)
    const [tenants, setTenants] = React.useState([]);
    const [propertyManager, setPropertyManager] = React.useState([]);
    const [earliestAvailability, setEarliestAvailability] = React.useState('');
    const [eventType, setEventType] = React.useState('1 Hour Job');
    const [newUtility, setNewUtility] = React.useState(null);
    const [editingUtility, setEditingUtility] = React.useState(null);
    // const [totalEstimate, setTotalEstimate] = React.useState(0)
    const emptyUtility = {
        service_name: '',
        charge: '',
        property: ''
    }
    const [errorMessage, setErrorMessage] = React.useState('');

    const calculateEstimate = () => {
        // console.log('***')
        let total = 0
        // console.log(serviceState)
        // console.log(eventType)
        let hours = parseInt(eventType)
        if (eventType.toLowerCase().includes('day')) {
            hours = hours * 24
        }
        utilityState.forEach(utility => {
            if (utility.per.toLocaleLowerCase() === "hour") {
                total = total + parseInt(utility.charge) * hours
            } else if (utility.per.toLocaleLowerCase() === "one-time") {
                total = total + parseInt(utility.charge)
            }
        })
        setTotalEstimate(total)
    }

    React.useEffect(() => {
        // calculateEstimate();
    }, [utilityState, eventType]);

    const addUtility = () => {
        if (newUtility.service_name === '' || newUtility.charge === '' || newUtility.property === '') {
            setErrorMessage('Please fill out all fields');
            return;
        }
        const newUtilityState = [...utilityState];
        newUtilityState.push({...newUtility});
        setUtilityState(newUtilityState);
        setNewUtility(null);
        setErrorMessage('');
        // calculateEstimate()
    }
    const cancelEdit = () => {
        setNewUtility(null);
        setErrorMessage('');
        if (editingUtility !== null) {
            const newUtilityState = [...utilityState];
            newUtilityState.push(editingUtility);
            setUtilityState(newUtilityState);
        }
        setEditingUtility(null);
        // calculateEstimate();
    }
    const editUtility = (i) => {
        const newUtilityState = [...utilityState];
        const utility = newUtilityState.splice(i, 1)[0];
        setUtilityState(newUtilityState);
        setEditingUtility(utility);
        setNewUtility({...utility});
        // calculateEstimate()
    }
    const deleteUtility = (i) => {
        const newUtilityState = [...utilityState];
        newUtilityState.splice(i, 1);
        setUtilityState(newUtilityState);
        // calculateEstimate()
    }
    const changeNewUtility = (event, field) => {
        const changedUtility = {...newUtility};
        changedUtility[field] = event.target.value;
        setNewUtility(changedUtility);
        // calculateEstimate()
    }
    const required = (
        errorMessage === 'Please fill out all fields' ? (
            <span style={red} className='ms-1'>*</span>
        ) : ''
    );
    return (
        <Container className='px-2'>
            <Row className='my-4'>
                <div style={headings}>Utilities</div>
            </Row>
            {utilityState.length > 0 && utilityState.map((utility, i) => (
                <div key={i}>
                    <div className='d-flex'>
                        <div className='flex-grow-1'>
                            <h6 className='mb-1'>{utility.service_name}</h6>
                        </div>
                        <div>
                            <img src={EditIcon} alt='Edit' className='px-1 mx-2'
                                 onClick={() => editUtility(i)}/>
                            <img src={DeleteIcon} alt='Delete' className='px-1 mx-2'
                                 onClick={() => deleteUtility(i)}/>
                        </div>
                    </div>
                    <p style={gray} className='mb-1'>
                        ${utility.charge} from {utility.property}
                    </p>
                    <hr className='mt-1'/>
                </div>
            ))}
            {newUtility !== null ? (
                <div>
                    <Form.Group className='mx-2 my-3'>
                        <Form.Label as='h6' className='mb-0 ms-2'>
                            Utility Name {newUtility.service_name === '' ? required : ''}
                        </Form.Label>
                        <Form.Control style={squareForm} placeholder='Electricity' value={newUtility.service_name}
                                      onChange={(e) => changeNewUtility(e, 'service_name')}/>
                    </Form.Group>
                    <Row className='mb-2'>
                        <Col>
                            <Form.Group className='mx-2'>
                                <Form.Label as='h6' className='mb-0 ms-2'>
                                    Charge {newUtility.charge === '' ? required : ''}
                                </Form.Label>
                                <Form.Control style={squareForm} type="number" placeholder='20' value={newUtility.charge}
                                              onChange={(e) => changeNewUtility(e, 'charge')}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className='mx-2'>
                                <Form.Label as='h6' className='mb-0 ms-2'>
                                    Property {newUtility.property === '' ? required : ''}
                                </Form.Label>
                                <Form.Select
                                    style={{...squareForm, backgroundImage: `url(${ArrowDown})`,}}
                                    value={newUtility.property}
                                    onChange={(e) => changeNewUtility(e, 'property')}>
                                    {properties.map((property, i) => (
                                        <option key={i}>
                                            {property.address} {property.unit}
                                            ,&nbsp;
                                            {property.city}
                                            ,&nbsp;
                                            {property.state}&nbsp; {property.zip}
                                            {/*{property.property_uid}*/}
                                        </option>
                                    ))}
                                </Form.Select>
                                {/*<Form.Control style={squareForm} placeholder='Hour' value={newService.per}*/}
                                {/*  onChange={(e) => changeNewService(e, 'per')}/>*/}
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className='text-center' style={errorMessage === '' ? hidden : {}}>
                        <p style={{...red, ...small}}>{errorMessage || 'error'}</p>
                    </div>
                </div>
            ) : ''}
            {newUtility === null ? (
                <Button variant='outline-primary' style={smallPillButton}
                        onClick={() => setNewUtility({...emptyUtility})}>
                    Add Utility
                </Button>
            ) : (
                <div className='d-flex justify-content-center mb-4'>
                    <Button variant='outline-primary' style={pillButton} onClick={cancelEdit}
                            className='mx-2'>
                        Cancel
                    </Button>
                    <Button variant='outline-primary' style={pillButton} onClick={addUtility}
                            className='mx-2'>
                        Add Utility
                    </Button>
                </div>
            )}

        </Container>
    );
}

export default ManagerUtilities;
