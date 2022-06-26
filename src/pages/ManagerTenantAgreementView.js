import React from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import Header from "../components/Header";
import File from '../icons/File.svg';
import {put, post, get} from '../utils/api';
import {
    small,
    hidden,
    red,
    squareForm,
    mediumBold,
    smallPillButton,
    bluePillButton,
    redPillButton, pillButton, gray
} from '../utils/styles';
import ManagerTenantAgreement from "./ManagerTenantAgreement";

function ManagerTenantAgreementView(props) {
    const {back, property, renewLease, acceptedTenantApplications, setAcceptedTenantApplications} = props;

    const [tenantID, setTenantID] = React.useState('');
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [feeState, setFeeState] = React.useState([]);
    const [contactState, setContactState] = React.useState([]);
    const [files, setFiles] = React.useState([]);

    const [dueDate, setDueDate] = React.useState('1')
    const [lateAfter, setLateAfter] = React.useState('')
    const [lateFee, setLateFee] = React.useState('')
    const [lateFeePer, setLateFeePer] = React.useState('')
    // const [renewLease, setRenewLease] = React.useState(false)
    const [terminateLease, setTerminateLease] = React.useState(false)
    const [lastDate, setLastDate] = React.useState('');
    const [tenantEndEarly, setTenantEndEarly] = React.useState(false);
    const [agreements, setAgreements] = React.useState([]);
    const [agreement, setAgreement] = React.useState(null);

    const loadAgreement = (agreement) => {
        // console.log(agreement)
        // console.log(contactState)
        // console.log(typeof contactState)
        setTenantID(agreement.tenant_id);
        setStartDate(agreement.lease_start);
        setEndDate(agreement.lease_end);
        setFeeState(JSON.parse(agreement.rent_payments));
        // contactState[1](JSON.parse(agreement.assigned_contacts));
        setContactState(JSON.parse(agreement.assigned_contacts))
        setFiles(JSON.parse(agreement.documents));

        setDueDate(agreement.due_by)
        setLateAfter(agreement.late_by)
        setLateFee(agreement.late_fee)
        setLateFeePer(agreement.perDay_late_fee)

        let app = property.applications.filter((a) => a.application_status === "TENANT END EARLY")
        if (app.length > 0) {
            setTenantEndEarly(true)
        }
    }
    React.useEffect(async () => {
        // if (agreement) {
        //     loadAgreement();
        // }
        const response = await get(`/rentals?rental_property_id=${property.property_uid}`);
        setAgreements(response.result);
        let agreement = response.result[0]
        console.log(agreement)
        setAgreement(agreement)
        loadAgreement(agreement)
    }, []);

    const [errorMessage, setErrorMessage] = React.useState('');
    const required = (
        errorMessage === 'Please fill out all fields' ? (
            <span style={red} className='ms-1'>*</span>
        ) : ''
    );

    const renewLeaseAgreement = async () => {
        back();
    }

    const terminateLeaseAgreement = async () => {
        if (lastDate === '') {
            setErrorMessage('Please select a last date');
            return;
        }

        const request_body = {
            application_status : "PM END EARLY",
            property_uid: property.property_uid,
            early_end_date : lastDate
        }
        const response = await put('/endEarly', request_body);
        back();
    }

    const endEarlyRequestResponse = async (end_early) => {
        let request_body = {
            application_status : "",
            property_uid: property.property_uid,
        }

        if (end_early) {
            request_body.application_status = "PM ENDED"

            let apps = property.applications.filter((a) => a.application_status === "TENANT END EARLY")
            request_body.application_uid = apps.length > 0 ? apps[0].application_uid : null
        } else {
            request_body.application_status = "REFUSED"
        }
        const response = await put('/endEarly', request_body);
        back();
    }

    return (
        <div className='mb-2 pb-2'>
                {agreement ?
                    <Container>
                    {/*<div className='mb-4'>*/}
                    {/*    <h5 style={mediumBold}>Tenant(s)</h5>*/}
                    {/*    {acceptedTenantApplications && acceptedTenantApplications.length > 0 && acceptedTenantApplications.map((application, i) =>*/}
                    {/*        <Form.Group className='mx-2 my-3' key={i}>*/}
                    {/*            <Form.Label as='h6' className='mb-0 ms-2'>*/}
                    {/*                Tenant ID {application.tenant_id === '' ? required : ''}*/}
                    {/*            </Form.Label>*/}
                    {/*            <Form.Control style={squareForm} value={application.tenant_id} readOnly={true}/>*/}
                    {/*        </Form.Group>*/}
                    {/*    )}*/}
                    {/*</div>*/}

                    <div className='mb-4'>
                        {/*<h5 style={mediumBold}>Lease Dates</h5>*/}
                        <Row>
                            <Col>
                                <h6>Lease Start Date</h6>
                                <p style={gray}>{agreement.lease_start}</p>
                            </Col>
                            <Col>
                                <h6>Lease End Date</h6>
                                <p style={gray}>{agreement.lease_end}</p>
                            </Col>
                        </Row>
                    </div>

                    <div className='my-4'>
                        <h6>Rent Payments</h6>
                        {feeState.map((fee, i) => (
                            <div key={i}>
                                <Row>
                                    <Col>
                                        <p className="mb-1">{fee.fee_name}</p>
                                    </Col>
                                    <Col>
                                        <p style={gray} className="mb-1">
                                            {fee.fee_type === "%"
                                                ? `${fee.charge}% of ${fee.of}`
                                                : `$${fee.charge}`}{" "}
                                            {fee.frequency}
                                        </p>
                                    </Col>
                                </Row>
                                {/*<hr className="mt-1" />*/}
                            </div>
                        ))}
                    </div>

                    <div className='my-4'>
                        {/*<h6>Due date and late fees</h6>*/}
                        <Row>
                            <Col>
                                <h6>Rent due</h6>
                                <p style={gray}>{`No. ${dueDate} day of the month`}</p>
                            </Col>
                            <Col>
                                <h6>Late fees after (days)</h6>
                                <p style={gray}>{lateAfter}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h6>Late Fee (one-time)</h6>
                                <p style={gray}>{lateFee}</p>
                            </Col>
                            <Col>
                                <h6>Late Fee (per day)</h6>
                                <p style={gray}>{lateFeePer}</p>
                            </Col>
                        </Row>
                    </div>

                    <div className='mb-4' hidden={contactState.length === 0}>
                        <h5 style={mediumBold}>Contact Details</h5>
                        {contactState.map((contact, i) => (
                            <Row className='mx-2' key={i}>
                                <h6 className="mb-1">
                                    {contact.first_name} {contact.last_name} ({contact.company_role})
                                </h6>

                                <hr className='mt-1'/>
                            </Row>
                        ))}
                    </div>


                    <div className='mb-4' hidden={files.length === 0}>
                        <h5 style={mediumBold}>Lease Documents</h5>
                        {files.map((file, i) => (
                            <Row className='mx-2' key={i}>
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
                                        <a href={file.link} target='_blank'>
                                            <img src={File}/>
                                        </a>
                                    </div>
                                </div>
                                <hr className='my-2'/>
                            </Row>
                        ))}
                    </div>


                    <Row className="pt-4 my-4" hidden={agreement === null || tenantEndEarly}>
                        <Col className='d-flex flex-row justify-content-evenly'>
                            <Button style={bluePillButton} variant="outline-primary"
                                    onClick={() => renewLease(agreement)}>
                                Renew Lease
                            </Button>
                        </Col>
                        {/*<Col className='d-flex flex-row justify-content-evenly'>*/}
                        {/*    <Button style={redPillButton} variant="outline-primary"*/}
                        {/*            onClick={() => setTerminateLease(true)}>*/}
                        {/*        Terminate Lease*/}
                        {/*    </Button>*/}
                        {/*</Col>*/}
                    </Row>

                    {terminateLease ?
                        <div hidden={agreement === null || tenantEndEarly}>
                            <Row>
                                <Col className='d-flex flex-row justify-content-evenly'>
                                    <Form.Group className='mx-2 my-3'>
                                        <Form.Label as='h6' className='mb-0 ms-2'>
                                            Select the Last Date {lastDate === '' ? required : ''}
                                        </Form.Label>
                                        <Form.Control style={squareForm} type='date' value={lastDate}
                                                      onChange={(e) => setLastDate(e.target.value)}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='d-flex flex-row justify-content-evenly'>
                                    <Button style={redPillButton} variant="outline-primary"
                                            onClick={() => terminateLeaseAgreement()}>
                                        Notify intent to terminate
                                    </Button>
                                </Col>
                                <Col className='d-flex flex-row justify-content-evenly'>
                                    <Button style={bluePillButton} variant="outline-primary"
                                            onClick={() => setTerminateLease(false)}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                        :
                        <Row hidden={agreement === null || tenantEndEarly}>
                            <Col className='d-flex flex-row justify-content-evenly'>
                                <Button style={redPillButton} variant="outline-primary"
                                        onClick={() => setTerminateLease(true)}>
                                    Terminate Lease
                                </Button>
                            </Col>
                        </Row>
                    }

                    {tenantEndEarly ?
                        <div className='my-4'>
                            <h5 style={mediumBold}>Tenant Requests to end lease early on {agreement.early_end_date}</h5>
                            <Row className='my-4'>
                                <Col className='d-flex flex-row justify-content-evenly'>
                                    <Button style={bluePillButton} variant="outline-primary"
                                            onClick={() => endEarlyRequestResponse(true)}>
                                        Terminate Lease
                                    </Button>
                                </Col>
                                <Col className='d-flex flex-row justify-content-evenly'>
                                    <Button style={redPillButton} variant="outline-primary"
                                            onClick={() => endEarlyRequestResponse(false)}>
                                        Reject request
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                        : ''}

                </Container>
                    : 'No Active Lease Agreements'
                }
            </div>
    );

}

export default ManagerTenantAgreementView;
