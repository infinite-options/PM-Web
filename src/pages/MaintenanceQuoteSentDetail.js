import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Container, Row, Col, Button, Form} from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
    headings,
    subText,
    tileImg,
    greenPill,
    orangePill,
    redPill,
    blueLarge,
    bluePillButton,
    formLabel, mediumBold, gray, mediumImg, redPillButton, squareForm, pillButton, red,
} from "../utils/styles";
import No_Image from "../icons/No_Image_Available.jpeg";
import HighPriority from "../icons/highPriority.svg";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import {put} from "../utils/api";
import ServicesProvided from "../components/ServicesProvided";
import ConfirmDialog from "../components/ConfirmDialog";

function  MaintenanceQuoteSentDetail (props) {
    const navigate = useNavigate();
    const location = useLocation();
    const quote = location.state.quote;

    const [currentImg, setCurrentImg] = React.useState(0);
    const [serviceState, setServiceState] = React.useState([]);
    const [totalEstimate, setTotalEstimate] = React.useState(0)
    const [tenants, setTenants] = React.useState([]);
    const [propertyManager, setPropertyManager] = React.useState([]);
    const [earliestAvailability, setEarliestAvailability] = React.useState('');
    const [eventType, setEventType] = React.useState('1 Hour Job');

    const [showDialog, setShowDialog] = useState(false);
    const [dialogText, setDialogText] = useState('')
    const [onConfirm, setOnConfirm] = useState(null)
    const onCancel = () => setShowDialog(false);
    // const onConfirm = () => setShowDialog(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const required = (
        errorMessage === 'Please fill out all fields' ? (
            <span style={red} className='ms-1'>*</span>
        ) : ''
    );

    const nextImg = () => {
        if (currentImg === JSON.parse(quote.images).length - 1) {
            setCurrentImg(0);
        } else {
            setCurrentImg(currentImg+1);
        }
    }
    const previousImg = () => {
        if (currentImg === 0) {
            setCurrentImg(JSON.parse(quote.images).length - 1);
        } else {
            setCurrentImg(currentImg-1);
        }
    }

    const loadQuote = () =>  {
        console.log('loaded quote details', quote)
        let earliest_availability = new Date(quote.earliest_availability).toISOString().slice(0,10);
        setEarliestAvailability(earliest_availability)
        // setEventType(quote.event_type)
        setPropertyManager(quote.property_manager.filter(manager => manager.management_status === "ACCEPTED"))
        setTenants(quote.rentalInfo.filter(r => r.rental_status === "ACTIVE"))
        setServiceState(JSON.parse(quote.services_expenses))
        setEventType(quote.event_type)
    }

    const updateQuote = async () => {
        if (earliestAvailability === '' || eventType === '') {
            setErrorMessage('Please fill out all fields');
            return;
        }
        setErrorMessage('');

        const updatedQuote = {
            maintenance_quote_uid: quote.maintenance_quote_uid,
            services_expenses: serviceState,
            total_estimate: totalEstimate,
            earliest_availability: earliestAvailability,
            event_type: eventType,
            quote_status: 'SENT'
        }
        const response = await put('/maintenanceQuotes', updatedQuote);
        navigate(-2);
    }

    const withdrawQuote = async () => {
        const updatedQuote = {
            maintenance_quote_uid: quote.maintenance_quote_uid,
            quote_status: 'REJECTED'
        }
        const response = await put('/maintenanceQuotes', updatedQuote);
        navigate('/maintenance')
    }

    React.useEffect(() => {
        if (quote) {
            loadQuote();
        }
    }, [quote]);

    return(
        <div className="h-100 d-flex flex-column">
            <ConfirmDialog
                title={dialogText}
                isOpen={showDialog}
                onConfirm={onConfirm}
                onCancel={onCancel}/>

            <Header title="Quote Sent (Detail)" leftText="< Back"
                    leftFn={() => navigate(-1)}
                    rightText=""/>

            <Container className='pb-5 mb-5'>
                <div style={{...tileImg, height: '200px', position: 'relative'}}>
                    {JSON.parse(quote.images).length > 0 ? (
                        <img src={JSON.parse(quote.images)[currentImg]} className='w-100 h-100'
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

                <div className="d-flex justify-content-between">
                    <div className="pt-1">
                        <h5 className='mt-2 mb-0' style={mediumBold}>
                            {quote.title}
                        </h5>
                        <p style={gray} className='mt-1 mb-2'>
                            {quote.address}{quote.unit !== '' ? ` ${quote.unit}, ` : ', '}
                            {quote.city}, {quote.state} {quote.zip}
                        </p>
                    </div>
                    <div className="pt-3">
                        {quote.priority === 'Low' ? <p style={greenPill} className='mb-0'>Low Priority</p>
                            : quote.priority === 'Medium' ? <p style={orangePill} className='mb-0'>Medium Priority</p>
                                : quote.priority === 'High' ? <p style={redPill} className='mb-0'>High Priority</p>:
                                    <p style={greenPill} className='mb-0'>No Priority</p>}
                    </div>
                </div>


                <Row className="mt-2">
                    <div style={subText}>
                        {quote.description}
                    </div>
                </Row>

                <div className='mt-4 mb-4'>
                    <Row>
                        <div style={headings}>Service Charge(s)</div>
                    </Row>
                    <ServicesProvided serviceState={serviceState} setServiceState={setServiceState}
                                      eventType={eventType} setEventType={setEventType}
                                      totalEstimate={totalEstimate} setTotalEstimate={setTotalEstimate}
                    />
                </div>


                <div className="mt-2 mx-2 mb-4">
                    <Row>
                        <div style={headings}>Earliest Availabilty</div>
                    </Row>
                    <div>
                        <Form.Group className="mt-2 mb-2">
                            <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                                Date
                            </Form.Label>
                            <Form.Control type='date' style={squareForm} value={earliestAvailability}
                                          onChange={(e) => setEarliestAvailability(e.target.value)}/>
                        </Form.Group>
                    </div>
                </div>

                {/*<div className="mt-2 mx-2 mb-4">*/}
                {/*    <Row>*/}
                {/*        <div style={headings}>Event Type</div>*/}
                {/*    </Row>*/}
                {/*    <div>*/}
                {/*        <Form.Group className="mt-2 mb-2">*/}
                {/*            <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">*/}
                {/*                Type*/}
                {/*            </Form.Label>*/}
                {/*            <Form.Select style={squareForm} value={eventType}*/}
                {/*                         onChange={(e) => setEventType(e.target.value)}>*/}
                {/*                <option>1 Hour Job</option>*/}
                {/*                <option>2 Hour Job</option>*/}
                {/*                <option>3 Hour Job</option>*/}
                {/*                <option>4 Hour Job</option>*/}
                {/*                <option>6 Hour Job</option>*/}
                {/*                <option>8 Hour Job</option>*/}
                {/*                <option>1 Day Job</option>*/}
                {/*            </Form.Select>*/}
                {/*        </Form.Group>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {propertyManager && (propertyManager.length > 0) ? (
                    <div className='mt-5'>
                        <div className='d-flex justify-content-between'>
                            <div>
                                <h6 style={headings} className='mb-1'>
                                    {propertyManager[0].manager_business_name}
                                </h6>
                                <p style={subText} className='mb-1'>
                                    Property Management
                                </p>
                            </div>
                            <div>
                                <a href={`tel:${propertyManager[0].manager_phone_number}`}>
                                    <img src={Phone} alt='Phone' style={mediumImg}/>
                                </a>
                                <a href={`mailto:${propertyManager[0].manager_email}`}>
                                    <img src={Message} alt='Message' style={mediumImg}/>
                                </a>
                            </div>
                        </div>
                        <hr style={{opacity: 1}} className='mt-1'/>
                    </div>
                ) : ''}

                {tenants  && tenants.length > 0 &&
                    tenants.map((tenant, i) => (
                        <div key={i}>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <h6 style={headings} className='mb-1'>
                                        {tenant.tenant_first_name} {tenant.tenant_last_name}
                                    </h6>
                                    <p style={subText} className='mb-1'>
                                        Tenant
                                    </p>
                                </div>
                                <div>
                                    <a href={`tel:${tenant.tenant_email}`}>
                                        <img src={Phone} alt='Phone' style={mediumImg}/>
                                    </a>
                                    <a href={`mailto:${tenant.tenant_phone_number}`}>
                                        <img src={Message} alt='Message' style={mediumImg}/>
                                    </a>
                                </div>
                            </div>
                            <hr style={{opacity: 1}} className='mt-1'/>
                        </div>
                    ))
                }

                <Row className="mt-5 mx-2 mb-4">
                    <Col className='d-flex flex-row justify-content-evenly mb-1'>
                        <Button variant='outline-primary' style={bluePillButton}
                                onClick={() => {
                                    setOnConfirm(() => updateQuote)
                                    setDialogText("Your quote will be updated")
                                    setShowDialog(true)
                                }}>
                            Update Quote
                        </Button>
                    </Col>

                    <Col className='d-flex flex-row justify-content-evenly mb-1'>
                        <Button variant='outline-primary' style={redPillButton}
                                onClick={() => {
                                    setOnConfirm(() => withdrawQuote)
                                    setDialogText("Your quote will be withdrawn and the request rejected")
                                    setShowDialog(true)
                                }}>
                            Withdraw Quote
                        </Button>
                    </Col>
                </Row>

            </Container>
        </div>
    )
}

export default MaintenanceQuoteSentDetail
