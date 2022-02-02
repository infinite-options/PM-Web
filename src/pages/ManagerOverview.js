import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Col, Container, Row} from 'react-bootstrap';
import Header from '../components/Header';
import { tileImg, green, bolder, red} from '../utils/styles';
import YourDocuments from '../icons/Your_Documents.svg';
import RequestRepairs from '../icons/request_repair.svg'
import Emergency from '../icons/emergency.svg'
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
            <Container className='pb-5 mb-5'>
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


                    <Container  className='mt-4 mb-4'>
                        <Row>
                            <Col>
                                <Button className='px-0 py-0' variant="outline-light" onClick={() => navigate('/manager-properties')}>
                                    <img src={RequestRepairs} alt='Properties' style={tileImg}/>
                                </Button>
                            </Col>
                            <Col>
                                <img src={RequestRepairs} alt='Repair Requests' style={tileImg}/>
                            </Col>
                            <Col>
                                <img src={RequestRepairs} alt='Maintenance' style={tileImg}/>
                            </Col>
                        </Row>

                        <Row className='mt-3'>
                            <Col>
                                <img src={YourDocuments} alt='Tenant Documents' style={tileImg}/>
                            </Col>
                            <Col>
                                <img src={YourDocuments} alt='Manager Documents' style={tileImg}/>
                            </Col>
                            <Col>
                                <img src={Emergency} alt='Phone' style={tileImg}/>
                            </Col>
                        </Row>
                    </Container>

                    <h6 style={bolder} className='mb-1'>New Maintenance Requests</h6>


                </div>
            </Container>
        </div>
    );

}

export default ManagerOverview;
