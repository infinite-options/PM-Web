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
    const {property, createNewTenantAgreement, selectTenantApplication} = props;
    const [expandTenantApplications, setExpandTenantApplications] = React.useState(false);

    const [applications, setApplications] = React.useState([])
    // const [selectedApplications, setSelectedApplications] = React.useState([])
    const [forwardedApplications, setForwardedApplications] = React.useState([])
    const [rejectedApplications, setRejectedApplications] = React.useState([])

    const fetchApplications = async () => {
        if (access_token === null) {return;}

        const response = await get(`/applications?property_uid=${property.property_uid}`);
        if (response.msg === 'Token has expired') {
            refresh();
            return;
        }

        const applications = response.result.map(application => ({...application, application_selected: false}))
        console.log(applications)
        setApplications(applications.filter(a => a.application_status.toUpperCase() === "NEW"))
        setForwardedApplications(applications.filter(a => a.application_status.toUpperCase() === "FORWARDED"))
        setRejectedApplications(applications.filter(a => a.application_status.toUpperCase() === "REJECTED"))
    }

    React.useEffect(fetchApplications, [property]);

    // const toggleApplications = (index) => {
    //     const selected = [...applications];
    //     selected[index].application_selected = !selected[index].application_selected;
    //     setApplications(selected);
    // }

    const toggleApplications = (application) => {
        const selected = [...applications];
        const index = selected.findIndex(a => a.application_uid === application.application_uid);
        selected[index].application_selected = !selected[index].application_selected;
        setApplications(selected);
    }

    const applicationsResponse = async () => {

        const selected_applications = applications.filter(a => a.application_selected)
        if (selected_applications.length === 0) {
            alert('Please select at least one application')
            return
        }

        setExpandTenantApplications(false)
        createNewTenantAgreement(selected_applications)

        // const application_uids = applications.filter(a => a.application_selected).map(a => a.application_uid);
        // if (application_uids.length === 0) {
        //     alert('Please select at least one application')
        //     return
        // }

        // for (const id of application_uids){
        //     const request_body = {
        //         application_uid: id,
        //         message: "Your application is accepted.",
        //         application_status: "ACCEPTED"
        //     }
        //
        //     // console.log(request_body)
        //     const response = await put("/applications", request_body);
        //     // console.log(response)
        // }

        // console.log("Quotes Requested from", application_uids)
        // const request_body = {
        //     application_uids: application_uids
        // }
        // const response = await put("/applications", request_body);
        // const result = response.result

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

                            {forwardedApplications.length > 0 &&
                                <div>
                                    <h3 style={{color: "#3DB727"}}>Forwarded</h3>
                                    {forwardedApplications.map((application, i) => (
                                        <Row key={i} className="mt-2">
                                            <Col xs={2} className="mt-2">
                                                <Row></Row>
                                            </Col>
                                            <Col>
                                                <Row style={headings} onClick={() => selectTenantApplication(application)}>
                                                    {`${application.tenant_first_name} ${application.tenant_last_name} (${application.tenant_id})`}
                                                </Row>
                                                <Row style={subText}>
                                                    Note: {application.message}
                                                </Row>
                                            </Col>
                                        </Row>
                                    ))}
                                </div>
                            }

                            {rejectedApplications.length > 0 &&
                                <div className="mt-4">
                                    <h3 style={{color: "#E3441F"}}>Rejected</h3>
                                    {rejectedApplications.map((application, i) => (
                                        <Row key={i} className="mt-2">
                                            <Col xs={2} className="mt-2">
                                                <Row></Row>
                                            </Col>
                                            <Col>
                                                <Row style={headings} onClick={() => selectTenantApplication(application)}>
                                                    {`${application.tenant_first_name} ${application.tenant_last_name} (${application.tenant_id})`}
                                                </Row>
                                                <Row style={subText}>
                                                    Note: {application.message}
                                                </Row>
                                            </Col>
                                        </Row>
                                    ))}
                                </div>
                            }

                            {applications.length > 0 &&
                                <div className="mt-4">
                                    <h3 style={{color: "#007AFF"}}>New</h3>
                                    {applications.map((application, i) =>
                                        (<Row className="mt-2" key={i}>
                                                <Col xs={2} className="mt-2">
                                                    <Row>
                                                        <Checkbox type="BOX" checked={application.application_selected}
                                                                  onClick={() => toggleApplications(application)}/>
                                                    </Row>
                                                </Col>
                                                <Col>
                                                    <Row style={headings} onClick={() => selectTenantApplication(application)}>
                                                        {`${application.tenant_first_name} ${application.tenant_last_name} (${application.tenant_id})`}
                                                    </Row>
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
                                </div>}
                        </div>
                        <Row className="mt-4" hidden={forwardedApplications.length > 0}>
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
