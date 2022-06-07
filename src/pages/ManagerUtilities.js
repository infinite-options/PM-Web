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
} from '../utils/styles';
import ArrowDown from "../icons/ArrowDown.svg";
import {useLocation, useNavigate} from "react-router-dom";
import Checkbox from "../components/Checkbox";
import Header from "../components/Header";
import {post} from "../utils/api";
import AppContext from "../AppContext";

function ManagerUtilities(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const {userData, refresh} = React.useContext(AppContext);
    const {access_token, user} = userData;
    const properties = location.state.properties

    const [utilityState, setUtilityState] = React.useState([]);
    const [newUtility, setNewUtility] = React.useState(null);
    const [editingUtility, setEditingUtility] = React.useState(null);
    const [propertyState, setPropertyState] = React.useState(properties);
    // const [dueDate, setDueDate] = React.useState("");

    const emptyUtility = {
        service_name: '',
        charge: '',
        properties: [],
        split_type: 'even',
        due_date: ""
    }
    const [errorMessage, setErrorMessage] = React.useState('');

    React.useEffect(() => {
        // console.log(properties)
        properties.forEach((p) => p.checked = false)
    }, [properties]);

    const splitFees = (newUtility) => {
        let charge = parseFloat(newUtility.charge)

        if (newUtility.split_type === 'even') {
            let count = newUtility.properties.length
            let charge_per = charge / count
            newUtility.properties.forEach((p) => p.charge = charge_per)
        }

        if (newUtility.split_type === 'tenant') {
            let count = newUtility.properties.length
            let charge_per = charge / count
            newUtility.properties.forEach((p) => p.charge = charge_per)
        }

        if (newUtility.split_type === 'area') {
            let total_area = 0
            newUtility.properties.forEach((p) => total_area = total_area + p.area)
            console.log(total_area)
            newUtility.properties.forEach((p) => p.charge = (p.area / total_area) * charge)
        }
    }

    const addCharges = async (newUtility) => {

        const management_businesses = user.businesses.filter(business => business.business_type === "MANAGEMENT")
        let management_buid = null
        if (management_businesses.length < 1) {
            console.log('No associated PM Businesses')
            return
        } else if (management_businesses.length > 1) {
            console.log('Multiple associated PM Businesses')
            management_buid = management_businesses[0].business_uid
        } else {
            management_buid = management_businesses[0].business_uid
        }

        const bill = {
            bill_property_id: '',
            bill_created_by: management_buid,
            bill_description: newUtility.service_name,
            bill_utility_type: '',
            bill_distribution_type: newUtility.split_type
        }
        const response = await post("/bills", bill, null);
    }

    const addUtility = async () => {
        if (newUtility.service_name === '' || newUtility.charge === '' || newUtility.due_date === '') {
            setErrorMessage('Please fill out all fields');
            return;
        }
        if (propertyState.filter((p) => p.checked).length < 1) {
            setErrorMessage('Select at least one property');
            return;
        }

        let due_date = new Date(newUtility.due_date);
        let current_date = new Date();
        if (current_date >= due_date) {
            setErrorMessage("Select a Due by Date later than current date");
            return;
        }
        setErrorMessage("");

        newUtility.properties = propertyState.filter((p) => p.checked)
        splitFees(newUtility)
        console.log('after split')
        console.log(newUtility)
        // await addCharges(newUtility)
        const newUtilityState = [...utilityState];
        newUtilityState.push({...newUtility});
        setUtilityState(newUtilityState);
        setNewUtility(null);
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
    }
    const editUtility = (i) => {
        // const newUtilityState = [...utilityState];
        // const utility = newUtilityState.splice(i, 1)[0];
        // setUtilityState(newUtilityState);
        // setEditingUtility(utility);
        // setNewUtility({...utility});
    }
    const deleteUtility = (i) => {
        // const newUtilityState = [...utilityState];
        // newUtilityState.splice(i, 1);
        // setUtilityState(newUtilityState);
    }
    const changeNewUtility = (event, field) => {
        const changedUtility = {...newUtility};
        changedUtility[field] = event.target.value;
        setNewUtility(changedUtility);
    }
    const toggleProperty = (i) => {
        const newPropertyState = [...propertyState];
        newPropertyState[i].checked = !newPropertyState[i].checked;
        setPropertyState(newPropertyState)
    }
    const required = (
        errorMessage === 'Please fill out all fields' ? (
            <span style={red} className='ms-1'>*</span>
        ) : ''
    );
    return (
        <div className="h-100">

            <Header title="Utilities" leftText="< Back" leftFn={() => {navigate(-1)}}/>

            <Container className='px-2'>
                <Row className='my-4'>
                    <div style={headings}>Utilities</div>
                </Row>

                {utilityState.length > 0 && utilityState.map((utility, i) => (
                    <div key={i}>
                        <div className='d-flex'>
                            <div className='flex-grow-1'>
                                <h6 className='mb-1'>
                                    ${utility.charge} {utility.service_name} Fee &nbsp;
                                    {utility.split_type === 'even' ? 'Split Evenly' : ''}
                                    {utility.split_type === 'tenant' ? 'Split based on Tenant Count' : ''}
                                    {utility.split_type === 'area' ? 'Split based on Square Footage' : ''}
                                </h6>
                            </div>
                            <div>
                                {/*<img src={EditIcon} alt='Edit' className='px-1 mx-2'*/}
                                {/*     onClick={() => editUtility(i)}/>*/}
                                {/*<img src={DeleteIcon} alt='Delete' className='px-1 mx-2'*/}
                                {/*     onClick={() => deleteUtility(i)}/>*/}
                            </div>
                        </div>
                        {utility.properties.map((property, j) =>
                            <p key={j} style={gray} className='mb-1'>
                                {property.address} {property.unit}
                                ,&nbsp;{property.city},&nbsp;{property.state}&nbsp; {property.zip}
                            </p>
                        )}
                        <hr className='mt-1'/>
                    </div>
                ))}

                {newUtility !== null ? (
                    <div>
                        <Row className='mb-2'>
                            <Col>
                                <Form.Group className='mx-2'>
                                    <Form.Label as='h6' className='mb-0 ms-2'>
                                        Utility Name {newUtility.service_name === '' ? required : ''}
                                    </Form.Label>
                                    <Form.Control style={squareForm} placeholder='Electricity' value={newUtility.service_name}
                                                  onChange={(e) => changeNewUtility(e, 'service_name')}/>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className='mx-2'>
                                    <Form.Label as='h6' className='mb-0 ms-2'>
                                        Charge {newUtility.charge === '' ? required : ''}
                                    </Form.Label>
                                    <Form.Control style={squareForm} type="number" placeholder='20' value={newUtility.charge}
                                                  onChange={(e) => changeNewUtility(e, 'charge')}/>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className='mx-2 my-3'>
                                    <Form.Label as='h6' className='mb-0 ms-2'>
                                        Fee Distribution
                                    </Form.Label>
                                    <Form.Select
                                        style={{...squareForm, backgroundImage: `url(${ArrowDown})`,}}
                                        value={newUtility.split_type}
                                        onChange={(e) => changeNewUtility(e, 'split_type')}>
                                        <option value='even'>Uniform</option>
                                        <option value='tenant'>By Tenant Count</option>
                                        <option value='area'>By Square Footage</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mx-2 my-3">
                                    <Form.Label as="h6" className="mb-0 ms-2">
                                        Due by Date {newUtility.due_date === "" ? required : ""}
                                    </Form.Label>
                                    <Form.Control
                                        style={squareForm}
                                        type="date"
                                        value={newUtility.due_date}
                                        onChange={(e) => changeNewUtility(e, 'due_date')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>


                        <Container className='my-3'>
                            <h6>Properties</h6>
                            {properties.map((property, i) => (
                                <div key={i} className='d-flex ps-2 align-items-center my-2'>
                                    <Checkbox type='BOX' checked={propertyState[i].checked}
                                              onClick={ () => toggleProperty(i)}/>
                                    <p className='ms-1 mb-1'>{property.address} {property.unit}
                                        ,&nbsp;{property.city},&nbsp;{property.state}&nbsp; {property.zip}</p>
                                </div>
                            ))}
                        </Container>

                        <div className='text-center my-2' style={errorMessage === '' ? hidden : {}}>
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

        </div>
    );
}

export default ManagerUtilities;
