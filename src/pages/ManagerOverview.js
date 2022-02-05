import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Col, Container, Row} from 'react-bootstrap';
import Header from '../components/Header';
import {green, bolder, red, xSmall, smallLine, mediumBold} from '../utils/styles';
import Repair from '../icons/Repair.svg';
import Property from '../icons/Property.svg';
import Emergency from '../icons/Emergency.svg';
import Document from '../icons/Document.svg';
import AppContext from "../AppContext";
import {get} from '../utils/api';

function ManagerOverview(props) {

    const navigate = useNavigate();
    const {userData, refresh} = React.useContext(AppContext);
    const {access_token} = userData;

    const [properties, setProperties] = useState([]);

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

        const response = await get(`/managerProperties`, access_token);
        if (response.msg === 'Token has expired') {
            refresh();
            return;
        }

        const properties = response.result
        setProperties(properties);
    }

    React.useEffect(fetchProperties, [access_token]);

    const unique_clients =  [...new Set(properties.map(item => item.owner_id))].length
    const property_count = properties.length


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


                </div>
            </Container>
        </div>
    );

}

export default ManagerOverview;
