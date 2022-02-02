import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {blue, gray, orangePill, redPill, tileImg, xSmall} from '../utils/styles';
import Header from "../components/Header";
import {useLocation, useNavigate} from "react-router-dom";
import {get} from "../utils/api";
import AppContext from "../AppContext";

function ManagerRepairsList(props) {

    const navigate = useNavigate();
    const location = useLocation();
    const {userData, refresh} = React.useContext(AppContext);
    const {access_token} = userData;
    const [repairs, setRepairs] = React.useState([]);

    const property = location.state.property

    const fetchRepairs = async () => {
        if (access_token === null) {
            navigate('/');
            return;
        }

        const response = await get(`/maintenanceRequests`, access_token);
        if (response.msg === 'Token has expired') {
            refresh();
            return;
        }

        const repairs = response.result.filter(item => item.property_uid === property.property_uid);
        console.log(repairs)
        setRepairs(repairs);
    }

    React.useEffect(fetchRepairs, [access_token]);


    const property1 = {
        images: ['https://static9.depositphotos.com/1029202/1109/i/950/depositphotos_11092371-stock-photo-suburban-house.jpg'],
        repair_title: 'Broken Shower',
        address: '213 Gardenia Avenue',
        city: 'Santa Monica',
        state: 'CA',
        zip: '90809'
    }

    const property2 = {
        images: ['https://cdn.pixabay.com/photo/2016/08/05/17/32/new-1572747_1280.jpg'],
        repair_title: 'Leaky Faucet',
        address: '417 Parkland Boulevard',
        unit: '',
        city: 'San Diego',
        state: 'CA',
        zip: '91004',
    }

    return (
        <div className='h-100'>
            <Header title='Repairs' leftText='< Back' leftFn={() => ''}
                    rightText='Sort by'/>
            <Container>
                <h4 className='mt-2 mb-3' style={{fontWeight: '600'}}>
                    New Requests
                </h4>
                <Row onClick={() => navigate('/pmRepairRequestDetail')}>
                    <Col xs={4}>
                        <div style={tileImg}>
                            {property1.images.length > 0 ? (
                                <img src={property1.images[0]} alt='Image'
                                     className='h-100 w-100' style={{objectFit: 'cover'}}/>
                            ) : ''}
                        </div>
                    </Col>
                    <Col className='ps-0'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <h5 className='mb-0' style={{fontWeight: '600'}}>
                                {property1.repair_title}
                            </h5>
                            <p style={redPill} className='mb-0'>High Priority</p>
                        </div>
                        <p style={gray} className='mt-2 mb-0'>
                            {property1.address}{property1.unit !== '' ? ' '+property1.unit : ''}, {property1.city}, {property1.state} <br/>
                            {property1.zip}
                        </p>
                        <div className='d-flex'>
                            <div className='flex-grow-1 d-flex flex-column justify-content-center'>
                                <p style={{...blue, ...xSmall}} className='mb-0'>
                                    Request Sent to Property Manager
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>

                <h4 className='mt-5 mb-3' style={{fontWeight: '600'}}>
                    Pending
                </h4>
                <Row onClick={() => navigate('/pmRepairRequestDetail')}>
                    <Col xs={4}>
                        <div style={tileImg}>
                            {property2.images.length > 0 ? (
                                <img src={property2.images[0]} alt='Image'
                                     className='h-100 w-100' style={{objectFit: 'cover'}}/>
                            ) : ''}
                        </div>
                    </Col>
                    <Col className='ps-0'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <h5 className='mb-0' style={{fontWeight: '600'}}>
                                {property2.repair_title}
                            </h5>
                            <p style={orangePill} className='mb-0'>Medium Priority</p>
                        </div>
                        <p style={gray} className='mt-2 mb-0'>
                            {property2.address}{property.unit !== '' ? ' '+property2.unit : ''}, {property2.city}, {property2.state} <br/>
                            {property2.zip}
                        </p>
                        <div className='d-flex'>
                            <div className='flex-grow-1 d-flex flex-column justify-content-center'>
                                <p style={{...blue, ...xSmall}} className='mb-0'>
                                    Request Sent to Property Manager
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );

}

export default ManagerRepairsList;
