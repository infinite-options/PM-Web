import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Col, Container, Row} from 'react-bootstrap';
import Header from '../components/Header';
import {green, bolder, red, xSmall, smallLine, mediumBold, redPillButton} from '../utils/styles';
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
        <div>
            <Header title='Properties' rightText='Sort by'/>
            <Container className='px-3 pb-5 mb-5'>
                <div>

                    <h6 style={bolder} className='mb-1'>Total No. of Unique Clients</h6>
                    <h6 style={{...bolder, ...green}} className='mb-1'>{unique_clients}</h6>
                    <hr style={{opacity: 1}} className='mt-1 mb-3'/>

                    <h6 style={bolder} className='mb-1'>Total No. of Properties</h6>
                    <h6 style={{...bolder, ...green}} className='mb-1'>{property_count}</h6>
                    <hr style={{opacity: 1}} className='mt-1 mb-3'/>

                    <h6 style={bolder} className='mb-1'>Estimated Monthly Revenue</h6>
                    <h6 style={{...bolder, ...green}} className='mb-1'>$16,500</h6>
                    <hr style={{opacity: 1}} className='mt-1 mb-3'/>

                    <h6 style={bolder} className='mb-1'>MTD Revenue</h6>
                    <div className='d-flex justify-content-between'>
                        <h6 style={{...bolder, ...green}} className='mb-1'>$14,500</h6>
                        <h6 style={{...bolder, ...green}} className='mb-1'>80%</h6>
                    </div>
                    <hr style={{opacity: 1}} className='mt-1 mb-3'/>

                    <h6 style={bolder} className='mb-1'>MTD Maintenance Cost</h6>
                    <h6 style={{...bolder, ...red}} className='mb-1'>$9,000</h6>
                    <hr style={{opacity: 1}} className='mt-1 mb-3'/>

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

                    <Row className='px-2'>
                        <Col onClick={() => navigate('/manager-properties')}
                             className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
                             style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
                            <img src={Property} alt='Properties' style={{width: '50px'}}/>
                            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
                                Properties
                            </p>
                        </Col>

                        <Col onClick={() => ''}
                            className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
                             style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
                            <img src={Repair} alt='Repair Requests' style={{width: '50px'}}/>
                            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
                                Repair Requests
                            </p>
                        </Col>

                        <Col onClick={() => ''}
                            className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
                             style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
                            <img src={Repair} alt='Maintenance' style={{width: '50px'}}/>
                            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
                                Maintenance
                            </p>
                        </Col>
                    </Row>

                    <Row className='px-2'>
                        <Col onClick={() => ''}
                            className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
                             style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
                            <img src={Document} alt='Document' style={{width: '50px'}}/>
                            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
                                Tenant Documents
                            </p>
                        </Col>
                        <Col onClick={() => ''}
                            className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
                             style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
                            <img src={Document} alt='Document' style={{width: '50px'}}/>
                            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
                                Manager Documents
                            </p>
                        </Col>
                        <Col onClick={() => ''}
                            className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
                             style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
                            <img src={Emergency} alt='Emergency' style={{width: '50px'}}/>
                            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
                                Emergency
                            </p>
                        </Col>
                    </Row>

                    <h6 style={bolder} className='mt-4 mb-1'>New Maintenance Requests</h6>

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
