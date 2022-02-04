import React from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import {useLocation, useNavigate} from "react-router-dom";
import Header from '../components/Header';
import {tileImg, gray, greenPill, mediumBold, mediumImg, redPill} from '../utils/styles';
import ArrowUp from '../icons/ArrowUp.svg';
import ArrowDown from '../icons/ArrowDown.svg';
import Phone from '../icons/Phone.svg';
import Message from '../icons/Message.svg';
import RequestRepairs from '../icons/request_repair.svg'
import Emergency from '../icons/emergency.svg'
import YourDocuments from '../icons/Your_Documents.svg'
import ResidentAnnouncements from '../icons/Resident_Announcements.svg'
import ManagerRentalHistory from "../components/ManagerRentalHistory";
import ManagerPropertyForm from "../components/ManagerPropertyForm";

function ManagerPropertyView(props) {

    const navigate = useNavigate();
    const location = useLocation();
    const property = location.state.property

    const [currentImg, setCurrentImg] = React.useState(0);
    const [expandDetails, setExpandDetails] = React.useState(false);
    const [editProperty, setEditProperty] = React.useState(false);

    const nextImg = () => {
        if (currentImg === JSON.parse(property.images).length - 1) {
            setCurrentImg(0);
        } else {
            setCurrentImg(currentImg+1);
        }
    }
    const previousImg = () => {
        if (currentImg === 0) {
            setCurrentImg(JSON.parse(property.images).length - 1);
        } else {
            setCurrentImg(currentImg-1);
        }
    }

    const headerBack = () => {
        navigate('../manager-properties')
    }

    console.log(property)
    return(
        <div>
            <Header title='Properties' leftText='< Back' leftFn={headerBack}/>
            <Container className='pb-5 mb-5'>
                <div>
                    <div style={{...tileImg, height: '200px', position: 'relative'}}>
                        {property.images.length > 0 ? (
                            <img src={JSON.parse(property.images)[currentImg]} className='w-100 h-100'
                                 style={{borderRadius: '4px', objectFit: 'contain'}} alt='Property'/>
                        ) : ''}
                        <div style={{position: 'absolute', left: '5px', top: '90px'}}
                             onClick={previousImg}>
                            {'<'}
                        </div>
                        <div style={{position: 'absolute', right: '5px', top: '90px'}}
                             onClick={nextImg}>
                            {'>'}
                        </div>
                    </div>
                    <h5 className='mt-2 mb-0' style={mediumBold}>
                        ${property.listed_rent}/mo
                    </h5>
                    <p style={gray} className='mt-1 mb-2'>
                        {property.address}{property.unit !== '' ? ` ${property.unit}, ` : ', '}
                        {property.city}, {property.state} {property.zip}
                    </p>
                    <div className='d-flex'>
                        {property.rental_uid !== null ? (
                            <p style={greenPill} className='mb-0'>Rent Paid</p>
                        ) : (
                            <p style={redPill} className='mb-0'>Past Due</p>
                        ) }
                    </div>

                    <ManagerRentalHistory property={property}/>

                    <div onClick={() => setExpandDetails(!expandDetails)}>
                        <div className='d-flex justify-content-between mt-3'>
                            <h6 style={mediumBold} className='mb-1'>Details</h6>
                            <img src={expandDetails ? ArrowUp : ArrowDown} alt='Expand'/>
                        </div>
                        <hr style={{opacity: 1}} className='mt-1'/>
                    </div>
                    {expandDetails ? (
                        <ManagerPropertyForm property={property} edit={editProperty} setEdit={setEditProperty}/>
                    ) : ''}

                    <Container  className='mt-4 mb-4'>
                        <Row>
                            <Col>
                                <img src={RequestRepairs} alt='RequestRepairs' style={tileImg}
                                     onClick={() => {navigate('./repairs', { state: {property: property }})}}/>
                            </Col>
                            <Col>
                                <img src={RequestRepairs} alt='Maintenance' style={tileImg}/>
                            </Col>
                            <Col>
                                <img src={YourDocuments} alt='Tenant Documents' style={tileImg}/>
                            </Col>
                        </Row>

                        <Row className='mt-3'>
                            <Col>
                                <img src={ResidentAnnouncements} alt='ResidentAnnouncements' style={tileImg}/>
                            </Col>
                            <Col>
                                <img src={Emergency} alt='Emergency' style={tileImg}/>
                            </Col>
                            <Col>
                                <img src={RequestRepairs} alt='Employees Associated' style={tileImg}/>
                            </Col>
                        </Row>
                    </Container>


                    {property.owner_id !== null ? (
                        <div>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <h6 style={mediumBold} className='mb-1'>
                                        {property.owner_first_name} {property.owner_last_name}
                                    </h6>
                                    <p style={{...gray, ...mediumBold}} className='mb-1'>
                                        Owner
                                    </p>
                                </div>
                                <div>
                                    <a href={`tel:${property.owner_phone_number}`}>
                                        <img src={Phone} alt='Phone' style={mediumImg}/>
                                    </a>
                                    <a href={`mailto:${property.owner_email}`}>
                                        <img src={Message} alt='Message' style={mediumImg}/>
                                    </a>
                                </div>
                            </div>
                            <hr style={{opacity: 1}} className='mt-1'/>
                        </div>
                    ) : ''}

                    {property.tenant_id !== null ? (
                        <div>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <h6 style={mediumBold} className='mb-1'>
                                        {property.tenant_first_name} {property.tenant_last_name}
                                    </h6>
                                    <p style={{...gray, ...mediumBold}} className='mb-1'>
                                        Tenant
                                    </p>
                                </div>
                                <div>
                                    <a href={`tel:${property.owner_phone_number}`}>
                                        <img src={Phone} alt='Phone' style={mediumImg}/>
                                    </a>
                                    <a href={`mailto:${property.owner_email}`}>
                                        <img src={Message} alt='Message' style={mediumImg}/>
                                    </a>
                                </div>
                            </div>
                            <hr style={{opacity: 1}} className='mt-1'/>
                        </div>
                    ) : ''}

                </div>
            </Container>
        </div>
    )
}

export default ManagerPropertyView;
