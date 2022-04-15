import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {blue, bluePill, gray, greenPill, orangePill, redPill, tileImg, xSmall} from '../utils/styles';
import Header from '../components/Header';
import AppContext from "../AppContext";
import {useNavigate} from "react-router-dom";
import {get} from "../utils/api";

function ManagerProperties(props) {

    const navigate = useNavigate();
    const {userData, refresh} = React.useContext(AppContext);
    const {access_token, user} = userData;
    const [properties, setProperties] = React.useState([]);

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

        const response =  await get(`/propertyInfo?manager_id=${management_buid}`);

        if (response.msg === 'Token has expired') {
            refresh();
            return;
        }

        const properties = response.result
        // setProperties(properties);

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
        // console.log(properties_unique)
        setProperties(properties_unique)
    }

    React.useEffect(fetchProperties, [access_token]);

    // const selectProperty = (property) => {
    //     setSelectedProperty(property);
    //     setStage('PROPERTY');
    // }


    return (
        <div className='h-100'>
            <Header title='Properties' leftText='< Back' leftFn={() => {navigate('/manager')}}
                    rightText='Sort by'/>
            {properties.map((property, i) => (
                <Container key={i} className='pt-1 mb-4' onClick={() => {
                    navigate(`./${property.property_uid}`, { state: {property: property, property_uid: property.property_uid}})
                }}>
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

                                {property.rental_status === "ACTIVE" ? <p style={greenPill} className='mb-0'>Rented</p>
                                    : property.rental_status === "PROCESSING" ? <p style={bluePill} className='mb-0'>Processing</p>
                                    : property.management_status === "FORWARDED" ? <p style={orangePill} className='mb-0'>New</p>:
                                            <p style={orangePill} className='mb-0'>Not Rented</p>}
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
