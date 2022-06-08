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
    headings, mediumBold,
} from '../utils/styles';
import ArrowDown from "../icons/ArrowDown.svg";
import {useLocation, useNavigate} from "react-router-dom";
import Checkbox from "../components/Checkbox";
import Header from "../components/Header";
import {post} from "../utils/api";
import AppContext from "../AppContext";
import File from "../icons/File.svg";

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

    const [files, setFiles] = React.useState([]);
    const [newFile, setNewFile] = React.useState(null);
    const [editingDoc, setEditingDoc] = React.useState(null);
    // const [dueDate, setDueDate] = React.useState("");

    const emptyUtility = {
        service_name: '',
        charge: '',
        properties: [],
        split_type: 'uniform',
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

    const postCharges = async (newUtility) => {

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

        console.log('*&^')
        console.log(newUtility)

        const new_bill = {
            bill_created_by: management_buid,
            bill_description: newUtility.service_name,
            bill_utility_type: newUtility.service_name,
            bill_algorithm: newUtility.split_type,
            bill_docs: files
        }
        for (let i = 0; i < files.length; i++) {
            let key = `file_${i}`;
            new_bill[key] = files[i].file;
            delete files[i].file;
        }
        new_bill.bill_docs = JSON.stringify(files);
        const response = await post("/bills", new_bill, null, files);
        console.log(response)
        const bill_uid = response.bill_uid
        // const bill_uid = "040-000014"
        console.log(bill_uid)

        for (const property of newUtility.properties) {
            console.log(property)

            // const new_purchase = {
            //     linked_bill_id: bill_uid,
            //     pur_property_id: property.property_uid,
            //     payer: null,
            //     receiver: management_buid,
            //     purchase_type: "UTILITY",
            //     description: newUtility.service_name,
            //     amount_due: newUtility.charge,
            //     purchase_notes: newUtility.service_name,
            //     purchase_date: "2022-06-10 00:00:00",
            //     purchase_frequency: "One-time"
            // }

            const new_purchase = {
                linked_bill_id : bill_uid,
                pur_property_id : property.property_uid,
                payer :"100-000006",
                receiver : management_buid,
                purchase_type :"UTILITY",
                description : newUtility.service_name,
                amount_due : newUtility.charge,
                purchase_notes : newUtility.service_name,
                purchase_date :"2022-06-07 00:00:00",
                purchase_frequency :"One-time",
                next_payment :"2022-06-07 00:00:00"
            }

            if (property.rental_status === "ACTIVE") {
                const tenants = property.applications.filter(a => a.application_status === "RENTED")
                new_purchase.payer = [tenants[0].tenant_id]
                console.log('new purchase')
                console.log(new_purchase)
                const response_p = await post("/purchases", new_purchase, null, null);
                console.log(response_p)
            }
        }
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
        // console.log('after split')
        // console.log(newUtility)
        await postCharges(newUtility)
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

    const editDocument = (i) => {
        const newFiles = [...files];
        const file = newFiles.splice(i, 1)[0];
        setFiles(newFiles);
        setEditingDoc(file);
        setNewFile({...file});
    }

    const cancelDocumentEdit = () => {
        setNewFile(null);
        if (editingDoc !== null) {
            const newFiles = [...files];
            newFiles.push(editingDoc);
            setFiles(newFiles);
        }
        setEditingDoc(null);
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
                                    {utility.split_type === 'uniform' ? 'Split Uniformly' : ''}
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
                                        <option value='uniform'>Uniform</option>
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


                        {/*Add Documents functionality*/}
                        <div className='mb-4'>
                            <h6 style={mediumBold}>Utility Documents</h6>
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
                                                onClick={cancelDocumentEdit} className='mx-2'>
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
