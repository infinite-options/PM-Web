import React from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import Header from "../components/Header";
import {put} from '../utils/api';
import {gray, mediumBold, redPillButton} from '../utils/styles';
import File from "../icons/File.svg";

function ManagerTenantProfileView(props) {
    const {back, application} = props;

    const rejectApplication = async () => {
        const request_body = {
            application_uid: application.application_uid,
            message: "Application has been rejected by the Property Manager",
            application_status: "REJECTED"
        }
        // console.log(request_body)
        const response = await put("/applications", request_body);
        back();
    }

    return (
        <div className='mb-5 pb-5'>
            <Header title='Tenant Application' leftText='< Back' leftFn={back}/>
            <Container>

                <h6>First Name</h6>
                <p style={gray}>
                    {((application.tenant_first_name !== null) && (application.tenant_first_name !== 'null')) ?
                        application.tenant_first_name : 'No First Name Provided'}</p>

                <h6>Last Name</h6>
                <p style={gray}>
                    {((application.tenant_last_name !== null) && (application.tenant_last_name !== 'null')) ?
                        application.tenant_last_name : 'No Last Name Provided'}</p>

                <h6>Phone Number</h6>
                <p style={gray}>
                    {((application.tenant_phone_number !== null) && (application.tenant_phone_number !== 'null')) ?
                        application.tenant_phone_number : 'No Phone Number Provided'}</p>

                <h6>Email</h6>
                <p style={gray}>
                    {((application.tenant_email !== null) && (application.tenant_email !== 'null')) ?
                        application.tenant_email : 'No Email Provided'}</p>

                <h6>SSN</h6>
                <p style={gray}>
                    {((application.tenant_ssn !== null) && (application.tenant_ssn !== 'null')) ?
                        application.tenant_ssn : 'No SSN Provided'}</p>

                <h6>Drivers Licence</h6>
                <p style={gray}>
                    {((application.tenant_drivers_license_number !== null) && (application.tenant_drivers_license_number !== 'null')) ?
                        application.tenant_drivers_license_number : 'No Drivers Licence Provided'}</p>

                <h6>Salary</h6>
                <p style={gray}>
                    {((application.tenant_current_salary !== null) && (application.tenant_current_salary !== 'null')) ?
                        application.tenant_current_salary : 'No Salary Provided'}</p>

                <h6>Current Address</h6>
                <p style={gray}>
                    {((application.tenant_current_address !== null) && (application.tenant_current_address !== 'null')) ?
                        application.tenant_current_address : 'No Address Provided'}</p>


                <h6>Documents</h6>
                <Row>
                    {application.documents && application.documents.length > 0
                        && JSON.parse(application.documents).map((document, i) =>
                            <div className='d-flex justify-content-between align-items-end' key={i}>
                                <p style={gray}>{document.name}</p>
                                <a href={document.link} target='_blank'>
                                    <img src={File} alt="Document"/>
                                </a>
                            </div>
                        )}
                </Row>

                <Row className="mt-4">
                    <Col className='d-flex justify-content-evenly'>
                        <Button style={redPillButton} onClick={rejectApplication}>Reject Application</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );

}

export default ManagerTenantProfileView;
