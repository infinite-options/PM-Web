import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Col, Container, Row} from 'react-bootstrap';
import Header from '../components/Header';
import {green, bolder, red, xSmall, smallLine, mediumBold, redPillButton, small, underline} from '../utils/styles';
import Repair from '../icons/Repair.svg';
import Property from '../icons/Property.svg';
import Emergency from '../icons/Emergency.svg';
import Document from '../icons/Document.svg';
import AppContext from "../AppContext";
import {get} from '../utils/api';

function ManagerOverview(props) {

    const navigate = useNavigate();
    const {userData, refresh} = React.useContext(AppContext);
    const {access_token, user} = userData;

    const [properties, setProperties] = useState([]);
    const [alerts, setAlerts] = useState({repairs: [], applications: [], count: 0})

    const [expandProperties, setExpandProperties] = React.useState(false);

    React.useEffect(() => {
        if (userData.access_token === null) {
            navigate('/');
        }
    }, []);

    const fetchProperties = async () => {
        if (access_token === null) {
            navigate('/');
            return;
        }

        // const response = await get(`/managerProperties`, access_token);
        // const response =  await get(`/propertyInfo?manager_id=${user.user_uid}`);

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

        // const response =  await get(`/businesses?business_uid=${management_buid}`);
        const response =  await get(`/propertyInfo?manager_id=${management_buid}`);
        if (response.msg === 'Token has expired') {
            refresh();
            return;
        }

        // const properties = response.result
        const properties = response.result.filter(property => property.management_status !== "REJECTED")

        const properties_unique = []
        const pids = new Set()
        properties.forEach(property => {
            if (pids.has(property.property_uid)) {
                // properties_unique[properties_unique.length-1].tenants.push(property)
                const index = properties_unique.findIndex(item => item.property_uid === property.property_uid);
                properties_unique[index].tenants.push(property)
            } else {
                pids.add(property.property_uid)
                properties_unique.push(property)
                properties_unique[properties_unique.length-1].tenants = [property]
            }
        });
        console.log(properties_unique)
        setProperties(properties_unique)

        // await getAlerts(properties_unique)
    }

    React.useEffect(fetchProperties, [access_token]);

    const unique_clients =  [...new Set(properties.map(item => item.owner_id))].length
    const property_count = properties.length


    // const getAlerts = async (properties_unique) => {
    //     const property = properties_unique[0]
    //     const repairs_response = await get(`/maintenanceRequests`, access_token);
    //     const repairs = repairs_response.result.filter(item => item.property_uid === property.property_uid);
    //     const applications_response = await get(`/applications?property_uid=${property.property_uid}`);
    //     const applications = applications_response.result.map(application => ({...application, application_selected: false}))
    //     const count = repairs.length + applications.length
    //
    //     setAlerts({repairs: repairs, applications: applications, count: count})
    // }

    return (
        <div style={{ background: "#E9E9E9 0% 0% no-repeat padding-box" }}>
            <Header title='PM Dashboard' rightText='Sort by'/>
            <Container className='px-3 pb-5 mb-5'>
                <div className="p-2 my-3"
                     style={{
                        background: "#FFFFFF 0% 0% no-repeat padding-box",
                        borderRadius: "10px",
                        opacity: 1,
                     }}>
                    <Row className="mx-2 my-3 p-2"
                        style={{
                            background: "#007AFF 0% 0% no-repeat padding-box",
                            boxShadow: "0px 3px 3px #00000029",
                            borderRadius: "20px",
                        }}>
                        <Col xs={8} style={{ ...mediumBold, ...{color: "#FFFFFF"} }}>Unique Clients</Col>
                        <Col style={{ ...mediumBold, ...{color: "#FFFFFF"} }}>{unique_clients}</Col>
                    </Row>

                    <Row className="mx-2 my-3 p-2"
                         style={{
                             background: "#007AFF 0% 0% no-repeat padding-box",
                             boxShadow: "0px 3px 3px #00000029",
                             borderRadius: "20px",
                         }}
                        onClick={() => setExpandProperties(!expandProperties)}>
                        <Col xs={8} style={{ ...mediumBold, ...{color: "#FFFFFF"} }}>Properties</Col>
                        <Col style={{ ...mediumBold, ...{color: "#FFFFFF"} }}>{property_count}</Col>
                    </Row>

                    {expandProperties ? (
                        <div>
                            <Container style={{ border: "1px solid #707070", borderRadius: "5px" }}>
                                <Row>
                                    <Col>
                                        <p style={{ ...small }} className=" m-1">Properties</p>
                                    </Col>
                                </Row>

                                {properties.map((property, i) =>
                                    <Row key={i}
                                        onClick={() => {
                                            navigate(`/manager-properties/${property.property_uid}`, { state: {property: property, property_uid: property.property_uid}})
                                        }}
                                        style={{cursor: "pointer",
                                            background: i % 2 === 0 ? "#FFFFFF 0% 0% no-repeat padding-box"
                                                : "#F3F3F3 0% 0% no-repeat padding-box",}}>
                                        <Col>
                                            <p style={{ ...small, ...mediumBold }} className=" m-1">
                                                {property.address} {property.unit}, {property.city},{" "}
                                                {property.state} {property.zip}
                                            </p>
                                        </Col>
                                    </Row>
                                )}
                            </Container>
                        </div>
                    ) : (
                        ""
                    )}

                    <Row className="mx-2 my-3 p-2"
                         style={{
                             background: "#3DB727 0% 0% no-repeat padding-box",
                             boxShadow: "0px 3px 3px #00000029",
                             borderRadius: "20px",
                         }}>
                        <Col xs={8} style={{ ...mediumBold, ...{color: "#FFFFFF"} }}>Estimated Monthly Revenue</Col>
                        <Col style={{ ...mediumBold, ...{color: "#FFFFFF"} }}>$10,000</Col>
                    </Row>

                    <Row className="mx-2 my-3 p-2"
                         style={{
                             background: "#3DB727 0% 0% no-repeat padding-box",
                             boxShadow: "0px 3px 3px #00000029",
                             borderRadius: "20px",
                         }}>
                        <Col xs={8} style={{ ...mediumBold, ...{color: "#FFFFFF"} }}>MTD Revenue</Col>
                        <Col style={{ ...mediumBold, ...{color: "#FFFFFF"} }}>$16,500</Col>
                    </Row>

                    <Row className="mx-2 my-3 p-2"
                         style={{
                             background: "#E3441F 0% 0% no-repeat padding-box",
                             boxShadow: "0px 3px 3px #00000029",
                             borderRadius: "20px",
                         }}>
                        <Col xs={8} style={{ ...mediumBold, ...{color: "#FFFFFF"} }}>MTD Maintenance Cost</Col>
                        <Col style={{ ...mediumBold, ...{color: "#FFFFFF"} }}>$9,500</Col>
                    </Row>

                </div>

                <div>

                    {/*<h6 style={bolder} className='mb-1'>Total No. of Unique Clients</h6>*/}
                    {/*<h6 style={{...bolder, ...green}} className='mb-1'>{unique_clients}</h6>*/}

                    {/*<hr style={{opacity: 1}} className='mt-1 mb-3'/>*/}

                    {/*<h6 style={bolder} className='mb-1'>Total No. of Properties</h6>*/}
                    {/*<div onClick={() => setExpandProperties(!expandProperties)}>*/}
                    {/*    <h6 style={{...bolder, ...green}} className='mb-1'>{property_count}</h6>*/}
                    {/*</div>*/}

                    {/*<hr style={{opacity: 1}} className='mt-1 mb-3'/>*/}

                    {/*<h6 style={bolder} className='mb-1'>Estimated Monthly Revenue</h6>*/}
                    {/*<h6 style={{...bolder, ...green}} className='mb-1'>$16,500</h6>*/}
                    {/*<hr style={{opacity: 1}} className='mt-1 mb-3'/>*/}

                    {/*<h6 style={bolder} className='mb-1'>MTD Revenue</h6>*/}
                    {/*<div className='d-flex justify-content-between'>*/}
                    {/*    <h6 style={{...bolder, ...green}} className='mb-1'>$14,500</h6>*/}
                    {/*    <h6 style={{...bolder, ...green}} className='mb-1'>80%</h6>*/}
                    {/*</div>*/}
                    {/*<hr style={{opacity: 1}} className='mt-1 mb-3'/>*/}

                    {/*<h6 style={bolder} className='mb-1'>MTD Maintenance Cost</h6>*/}
                    {/*<h6 style={{...bolder, ...red}} className='mb-1'>$9,000</h6>*/}
                    {/*<hr style={{opacity: 1}} className='mt-1 mb-3'/>*/}

                    {/*Sample Notifications for the first property*/}
                    {/*{*/}
                    {/*    alerts.count === 0 ? "No New Alerts" :*/}
                    {/*        <div>*/}
                    {/*            You have {alerts.count} new alerts*/}
                    {/*            {alerts.applications.length > 0 && alerts.applications.map((application, i) => (*/}
                    {/*                <div key={i}>*/}
                    {/*                    1 {application.application_status} tenant application from {application.tenant_first_name}*/}
                    {/*                </div>))}*/}
                    {/*            {alerts.repairs.length > 0 && alerts.repairs.map((repair, i) => (*/}
                    {/*                <div key={i}>*/}
                    {/*                    1 {repair.priority} priority repair with status "{repair.request_status}"*/}
                    {/*                </div>))}*/}
                    {/*        </div>*/}
                    {/*}*/}

                    <Row className="px-2">
                        <Col onClick={() => navigate('/manager-properties')}
                            className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
                            style={{
                                height: "87px",
                                background: "#FFFFFF 0% 0% no-repeat padding-box",
                                boxShadow: "0px 3px 3px #00000029",
                                borderRadius: "20px",
                                cursor: "pointer",
                            }}>
                            <Col>
                                <img src={Property} alt="Property" style={{ width: "50px" }} />
                            </Col>
                            <Col>
                                <p style={{ ...xSmall, ...smallLine, ...mediumBold }} className="mb-0">
                                    Properties
                                </p>
                            </Col>
                        </Col>

                        <Col onClick={() => {navigate('/manager-repairs', { state: {properties: properties }})}}
                            className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
                            style={{
                                height: "87px",
                                background: "#FFFFFF 0% 0% no-repeat padding-box",
                                boxShadow: "0px 3px 3px #00000029",
                                borderRadius: "20px",
                                cursor: "pointer",
                            }}>
                            <Col>
                                <img src={Repair} alt="Document" style={{ width: "50px" }} />
                            </Col>
                            <Col>
                                <p style={{ ...xSmall, ...smallLine, ...mediumBold }} className="mb-0">
                                    Repair <br />  Requests
                                </p>
                            </Col>
                        </Col>
                    </Row>

                    <Row className="px-2">
                        <Col onClick={() => {navigate('/manager-utilities', { state: {properties: properties }})}}
                             className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
                             style={{
                                 height: "87px",
                                 background: "#FFFFFF 0% 0% no-repeat padding-box",
                                 boxShadow: "0px 3px 3px #00000029",
                                 borderRadius: "20px",
                                 cursor: "pointer",
                             }}>
                            <Col>
                                <img src={Repair} alt="Property" style={{ width: "50px" }} />
                            </Col>
                            <Col>
                                <p style={{ ...xSmall, ...smallLine, ...mediumBold }} className="mb-0">
                                    Utilities
                                </p>
                            </Col>
                        </Col>

                        <Col
                             className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
                             style={{
                                 height: "87px",
                                 background: "#FFFFFF 0% 0% no-repeat padding-box",
                                 boxShadow: "0px 3px 3px #00000029",
                                 borderRadius: "20px",
                                 cursor: "pointer",
                             }}>
                            <Col>
                                <img src={Repair} alt="Document" style={{ width: "50px" }} />
                            </Col>
                            <Col>
                                <p style={{ ...xSmall, ...smallLine, ...mediumBold }} className="mb-0">
                                    Maintenance
                                </p>
                            </Col>
                        </Col>
                    </Row>

                    <Row className="px-2">
                        <Col onClick={() => {navigate('/manager-utilities', { state: {properties: properties }})}}
                             className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
                             style={{
                                 height: "87px",
                                 background: "#FFFFFF 0% 0% no-repeat padding-box",
                                 boxShadow: "0px 3px 3px #00000029",
                                 borderRadius: "20px",
                                 cursor: "pointer",
                             }}>
                            <Col>
                                <img src={Document} alt="Property" style={{ width: "50px" }} />
                            </Col>
                            <Col>
                                <p style={{ ...xSmall, ...smallLine, ...mediumBold }} className="mb-0">
                                    Documents
                                </p>
                            </Col>
                        </Col>

                        <Col
                            className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
                            style={{
                                height: "87px",
                                background: "#FFFFFF 0% 0% no-repeat padding-box",
                                boxShadow: "0px 3px 3px #00000029",
                                borderRadius: "20px",
                                cursor: "pointer",
                            }}>
                            <Col>
                                <img src={Emergency} alt="Document" style={{ width: "50px" }} />
                            </Col>
                            <Col>
                                <p style={{ ...xSmall, ...smallLine, ...mediumBold }} className="mb-0">
                                    Emergency
                                </p>
                            </Col>
                        </Col>
                    </Row>

                    {/*<Row className='px-2'>*/}
                    {/*    <Col onClick={() => navigate('/manager-properties')}*/}
                    {/*         className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'*/}
                    {/*         style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>*/}
                    {/*        <img src={Property} alt='Properties' style={{width: '50px'}}/>*/}
                    {/*        <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>*/}
                    {/*            Properties*/}
                    {/*        </p>*/}
                    {/*    </Col>*/}

                    {/*    <Col onClick={() => {navigate('/manager-repairs', { state: {properties: properties }})}}*/}
                    {/*        className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'*/}
                    {/*         style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>*/}
                    {/*        <img src={Repair} alt='Repair Requests' style={{width: '50px'}}/>*/}
                    {/*        <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>*/}
                    {/*            Repair Requests*/}
                    {/*        </p>*/}
                    {/*    </Col>*/}

                    {/*    <Col onClick={() => {navigate('/manager-utilities', { state: {properties: properties }})}}*/}
                    {/*        className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'*/}
                    {/*         style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>*/}
                    {/*        <img src={Repair} alt='Maintenance' style={{width: '50px'}}/>*/}
                    {/*        <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>*/}
                    {/*            Maintenance*/}
                    {/*        </p>*/}
                    {/*    </Col>*/}
                    {/*</Row>*/}

                    {/*<Row className='px-2'>*/}
                    {/*    <Col onClick={() => ''}*/}
                    {/*        className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'*/}
                    {/*         style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>*/}
                    {/*        <img src={Document} alt='Document' style={{width: '50px'}}/>*/}
                    {/*        <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>*/}
                    {/*            Tenant Documents*/}
                    {/*        </p>*/}
                    {/*    </Col>*/}
                    {/*    <Col onClick={() => ''}*/}
                    {/*        className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'*/}
                    {/*         style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>*/}
                    {/*        <img src={Document} alt='Document' style={{width: '50px'}}/>*/}
                    {/*        <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>*/}
                    {/*            Manager Documents*/}
                    {/*        </p>*/}
                    {/*    </Col>*/}
                    {/*    <Col onClick={() => ''}*/}
                    {/*        className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'*/}
                    {/*         style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>*/}
                    {/*        <img src={Emergency} alt='Emergency' style={{width: '50px'}}/>*/}
                    {/*        <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>*/}
                    {/*            Emergency*/}
                    {/*        </p>*/}
                    {/*    </Col>*/}
                    {/*</Row>*/}

                    {/*<h6 style={bolder} className='mt-4 mb-1'>New Maintenance Requests</h6>*/}

                    {/*<br/>*/}
                    {/*<ConfirmDialog*/}
                    {/*    title={'You are about to delete your profile'}*/}
                    {/*    isOpen={showDialog}*/}
                    {/*    onConfirm={onConfirm}*/}
                    {/*    onCancel={onCancel}*/}
                    {/*/>*/}
                    {/*<Button variant='outline-primary' style={redPillButton} onClick={() => setShowDialog(true)}>*/}
                    {/*    Delete*/}
                    {/*</Button>*/}


                </div>
            </Container>
        </div>
    );

}

export default ManagerOverview;
