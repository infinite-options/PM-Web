import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {blue, gray, greenPill, orangePill, redPill, tileImg, xSmall} from '../utils/styles';
import Header from '../components/Header';
import AppContext from "../AppContext";
import {useNavigate} from "react-router-dom";
import {get} from "../utils/api";

function ManagerProperties(props) {

    const navigate = useNavigate();
    const {userData, refresh} = React.useContext(AppContext);
    const {access_token} = userData;
    const [properties, setProperties] = React.useState([]);

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


    return (
        <div className='h-100'>
            <Header title='Properties' leftText='< Back' leftFn={() => {}}
                    rightText='Sort by'/>
            {properties.map((property, i) => (
                <Container key={i} className='pt-1 mb-4'>
                    <Row>
                        <Col xs={4}>
                            <div style={tileImg}>
                                {JSON.parse(property.images).length > 0 ? (
                                    <img src={JSON.parse(property.images)[0]} alt='Property'
                                         className='h-100 w-100' style={{borderRadius: '4px', objectFit: 'cover'}}/>
                                ) : ''}
                            </div>
                        </Col>
                        <Col className='ps-0'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <h5 className='mb-0' style={{fontWeight: '600'}}>
                                    ${property.listed_rent}/mo
                                </h5>
                                {property.rent_status === 'green' ? <p style={greenPill} className='mb-0'>Rent Paid</p>
                                    : property.rent_status === 'orange' ? <p style={orangePill} className='mb-0'>Not Rented</p>
                                        : property.rent_status === 'red' ? <p style={redPill} className='mb-0'>Past Due</p>:
                                            <p style={greenPill} className='mb-0'>Rent Status</p>}
                            </div>
                            <p style={gray} className='mt-2 mb-0'>
                                {property.address}{property.unit !== '' ? ' '+property.unit : ''}, {property.city}, {property.state} <br/>
                                {property.zip}
                            </p>
                            <div className='d-flex'>
                                <div className='flex-grow-1 d-flex flex-column justify-content-center'>
                                    <p style={{...blue, ...xSmall}} className='mb-0'>
                                        {property.owner_id ?
                                            `Owner: ${property.owner_first_name} ${property.owner_last_name}`
                                            : 'No Owner'}
                                    </p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            ))}
        </div>
    )
}

export default ManagerProperties
