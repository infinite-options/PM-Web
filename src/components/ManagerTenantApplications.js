import React from 'react';
import {Button, Col, Container, Row} from 'react-bootstrap';
import {mediumBold, headings, subText, bluePillButton, underline} from '../utils/styles';
import ArrowUp from '../icons/ArrowUp.svg';
import ArrowDown from '../icons/ArrowDown.svg';
import {get, put} from "../utils/api";
import AppContext from "../AppContext";
import Checkbox from "./Checkbox";
import File from '../icons/File.svg';

function ManagerTenantApplications(props) {
    const {userData, refresh} = React.useContext(AppContext);
    const {access_token} = userData;
    const {property, createNewTenantAgreement} = props;
    const [expandTenantApplications, setExpandTenantApplications] = React.useState(false);

    const [applications, setApplications] = React.useState([])
    // const [selectedApplications, setSelectedApplications] = React.useState([])

    const fetchApplications = async () => {
        if (access_token === null) {return;}

        const response = await get(`/applications?property_uid=${property.property_uid}`);
        if (response.msg === 'Token has expired') {
            refresh();
            return;
        }

        const applications = response.result.map(application => ({...application, application_selected: false}))
        console.log(applications)
        setApplications(applications)
    }

    React.useEffect(fetchApplications, [property]);

    const toggleApplications = (index) => {
        const selected = [...applications];
        selected[index].application_selected = !selected[index].application_selected;
        setApplications(selected);
    }

    const applicationsResponse = async () => {
        const application_uids = applications.filter(a => a.application_selected).map(a => a.application_uid);
        if (application_uids.length === 0) {
            alert('No Applications Selected')
            return
        }

        for (const id of application_uids){
            const request_body = {
                application_uid: id,
                message: "Your application is accepted.",
                application_status: "ACCEPTED"
            }

            // console.log(request_body)
            const response = await put("/applications", request_body);
            // console.log(response)
        }

        const tenant_uids = applications.filter(a => a.application_selected).map(a => a.tenant_id);
        setExpandTenantApplications(false)
        createNewTenantAgreement(tenant_uids)


        // console.log("Quotes Requested from", application_uids)
        // const request_body = {
        //     application_uids: application_uids
        // }
        // const response = await put("/applications", request_body);
        // const result = response.result

        setExpandTenantApplications(false)

    }

    return (
        <div>
            <div>
                <div onClick={() => setExpandTenantApplications(!expandTenantApplications)}>
                    <div className='d-flex justify-content-between mt-3'>
                        <h6 style={mediumBold} className='mb-1'>Tenant Applications</h6>
                        <img src={expandTenantApplications ? ArrowUp : ArrowDown} alt='Expand'/>
                    </div>
                    <hr style={{opacity: 1}} className='mt-1'/>
                </div>
                {expandTenantApplications ? (
                    <Container>
                        {/*<Row style={headings}>*/}
                        {/*    <div>Applications:</div>*/}
                        {/*</Row>*/}
                        <div>
                            {applications.length > 0 && applications.map((application, i) =>
                                (<Row className="mt-2" key={i}>
                                        <Col xs={2} className="mt-2">
                                            <Row>
                                                <Checkbox type="BOX" checked={application.application_selected}
                                                          onClick={() => toggleApplications(i)}/>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row style={headings}>{`${application.tenant_first_name} ${application.tenant_last_name} (${application.tenant_id}) `}</Row>
                                            <Row style={subText}>
                                                Note: {application.message}
                                            </Row>
                                            <Row>
                                                {application.documents && application.documents.length > 0
                                                    && JSON.parse(application.documents).map((document, i) =>
                                                        <div className='d-flex justify-content-between align-items-end ps-0' key={i}>
                                                            <h6 style={mediumBold}>{document.name}</h6>
                                                            <a href={document.link} target='_blank'>
                                                                <img src={File} alt="Document"/>
                                                            </a>
                                                        </div>
                                                    )}
                                            </Row>
                                        </Col>
                                    </Row>
                                ))}
                        </div>
                        <Row className="mt-4">
                            <Col className='d-flex justify-content-evenly'>
                                <Button style={bluePillButton} onClick={applicationsResponse}>Accept Selected Applicants</Button>
                            </Col>
                        </Row>
                    </Container>
                ) : ''}
            </div>
        </div>
    )
}

export default ManagerTenantApplications;
