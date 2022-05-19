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
    formLabel, mediumBold, gray, mediumImg, redPillButton, squareForm, pillButton, red, subHeading,
} from "../utils/styles";
import No_Image from "../icons/No_Image_Available.jpeg";
import HighPriority from "../icons/highPriority.svg";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import {put} from "../utils/api";
import ServicesProvided from "../components/ServicesProvided";
import ConfirmDialog from "../components/ConfirmDialog";

function  MaintenanceQuotesScheduledDetail (props) {
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

    const scheduleRepair = async () => {
       alert('TODO')
    }

    React.useEffect(() => {
        if (quote) {
            loadQuote();
        }
    }, [quote]);

    return(
        <div className="h-100 d-flex flex-column">
            {/*<ConfirmDialog*/}
            {/*    title={dialogText}*/}
            {/*    isOpen={showDialog}*/}
            {/*    onConfirm={onConfirm}*/}
            {/*    onCancel={onCancel}/>*/}

            <Header title="Quote Details" leftText="< Back"
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

                <Row className="mt-4">
                    <div style={headings}>Fees Included:</div>
                </Row>
                {quote.services_expenses && ( quote.services_expenses.length > 0) && JSON.parse(quote.services_expenses).map((service, j) => (
                    <Container key={j}>
                        <Row className="pt-1 mb-2 mx-3">
                            <div style={subHeading}>{service.service_name}</div>
                            <div style={subText}>${service.charge} {service.per === 'Hour' ? `per ${service.per}` : 'One-Time Fee'}</div>
                        </Row>
                    </Container>
                ))}

                <div className="d-flex justify-content-between mt-4 mb-4">
                    <Row className="">
                        <div style={headings}>Event Type</div>
                        <div style={subText}>{quote.event_type}</div>
                    </Row>

                    <Row className="">
                        <div style={headings}>Total Estimate</div>
                        <div style={subText}>$ {quote.total_estimate}</div>
                    </Row>
                </div>

                <Row className="mb-4">
                    <div style={headings}>Earliest Availability</div>
                    <div style={subText}>{quote.earliest_availability}</div>
                </Row>

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
                                onClick={() => scheduleRepair()}>
                            Schedule Repair
                        </Button>
                    </Col>
                </Row>

            </Container>
        </div>
    )
}

export default MaintenanceQuotesScheduledDetail
