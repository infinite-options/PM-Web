import React from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import {useLocation, useNavigate} from "react-router-dom";
import { useParams } from "react-router";
import Header from '../components/Header';
import {tileImg, gray, greenPill, mediumBold, mediumImg, redPill, xSmall, smallLine, orangePill, bluePill} from '../utils/styles';
import ArrowUp from '../icons/ArrowUp.svg';
import ArrowDown from '../icons/ArrowDown.svg';
import Phone from '../icons/Phone.svg';
import Message from '../icons/Message.svg';
import Emergency from '../icons/Emergency.svg';
import Announcements from "../icons/announcements.svg";
import SearchPM from "../icons/searchPM.svg";
import ManagerRentalHistory from "../components/ManagerRentalHistory";
import ManagerPropertyForm from "../components/ManagerPropertyForm";
import ManagementContract from "../components/ManagementContract";
import TenantAgreement from "../components/TenantAgreement";
import ManagerDocs from "../components/ManagerDocs";
import LeaseDocs from "../components/LeaseDocs";
import Repair from '../icons/Repair.svg';
import Document from "../icons/Document.svg";
import {get} from "../utils/api";
import ManagerTenantApplications from "../components/ManagerTenantApplications";

function ManagerPropertyView(props) {

    const navigate = useNavigate();
    const location = useLocation();
    // const property = location.state.property
    // const { mp_id } = useParams();
    const property_uid = location.state.property_uid

    const [property, setProperty] = React.useState({images: '[]'});

    const fetchProperty = async () => {
        const response = await get(`/propertyInfo?property_uid=${property_uid}`);
        setProperty(response.result[0]);
    }
    React.useState(() => {
        fetchProperty();
    });

    const [currentImg, setCurrentImg] = React.useState(0);
    const [expandDetails, setExpandDetails] = React.useState(false);
    const [editProperty, setEditProperty] = React.useState(false);

    const [expandManagerDocs, setExpandManagerDocs] = React.useState(false);
    const [expandLeaseDocs, setExpandLeaseDocs] = React.useState(false);
    const [showManagementContract, setShowManagementContract] = React.useState(false);
    const [showTenantAgreement, setShowTenantAgreement] = React.useState(false);
    const [selectedContract, setSelectedContract] = React.useState(null);
    const [selectedAgreement, setSelectedAgreement] = React.useState(null);
    const [acceptedTenants, setAcceptedTenants] = React.useState([]);

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

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [editProperty, showManagementContract, showTenantAgreement]);

    const addContract = () => {
        setSelectedContract(null);
        setShowManagementContract(true);
    }
    const selectContract = (contract) => {
        setSelectedContract(contract);
        setShowManagementContract(true);
    }
    const closeContract = () => {
        // reload();
        setShowManagementContract(false);
    }

    const addAgreement = () => {
        setSelectedAgreement(null);
        setShowTenantAgreement(true);
    }
    const selectAgreement = (agreement) => {
        setSelectedAgreement(agreement);
        setShowTenantAgreement(true);
    }
    const closeAgreement = () => {
        // reload();
        setAcceptedTenants([])
        setShowTenantAgreement(false);
    }

    const reloadProperty = () => {
        setEditProperty(false);
        fetchProperty();
    }

    const createNewTenantAgreement = (application_uids, tenant_uids) => {
        // console.log(tenant_uids)
        setAcceptedTenants(tenant_uids)
        setShowTenantAgreement(true)
    }

    return(
        showManagementContract ? (
            <ManagementContract back={closeContract} property={property} contract={selectedContract}/>
        ) : showTenantAgreement ? (
            <TenantAgreement back={closeAgreement} property={property} agreement={selectedAgreement}
                             acceptedTenants={acceptedTenants} setAcceptedTenants={setAcceptedTenants}/>
        ) : (
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
                        {property.rental_status === "ACTIVE" ? <p style={greenPill} className='mb-0'>Rented</p>
                            : property.tenant_id === null ? <p style={orangePill} className='mb-0'>Not Rented</p>:
                                <p style={bluePill} className='mb-0'>Status Unknown</p>}
                    </div>

                    {(property.rental_status === "ACTIVE") ? <ManagerRentalHistory property={property}/> :
                        <ManagerTenantApplications property={property} createNewTenantAgreement={createNewTenantAgreement}/>}

                    <div onClick={() => setExpandDetails(!expandDetails)}>
                        <div className='d-flex justify-content-between mt-3'>
                            <h6 style={mediumBold} className='mb-1'>Details</h6>
                            <img src={expandDetails ? ArrowUp : ArrowDown} alt='Expand'/>
                        </div>
                        <hr style={{opacity: 1}} className='mt-1'/>
                    </div>
                    {expandDetails ? (
                        <ManagerPropertyForm property={property} edit={editProperty} setEdit={setEditProperty} onSubmit={reloadProperty}/>
                    ) : ''}


                    <div onClick={() => setExpandManagerDocs(!expandManagerDocs)}>
                        <div className='d-flex justify-content-between mt-3'>
                            <h6 style={mediumBold} className='mb-1'>Management Contract</h6>
                            <img src={expandManagerDocs ? ArrowUp : ArrowDown} alt='Expand'/>
                        </div>
                        <hr style={{opacity: 1}} className='mt-1'/>
                    </div>
                    {expandManagerDocs ? (
                        <ManagerDocs property={property} addDocument={addContract} selectContract={selectContract} reload={''}/>
                    ) : ''}
                    <div onClick={() => setExpandLeaseDocs(!expandLeaseDocs)}>
                        <div className='d-flex justify-content-between mt-3'>
                            <h6 style={mediumBold} className='mb-1'>Tenant Agreement</h6>
                            <img src={expandLeaseDocs ? ArrowUp : ArrowDown} alt='Expand'/>
                        </div>
                        <hr style={{opacity: 1}} className='mt-1'/>
                    </div>
                    {expandLeaseDocs ? (
                        <LeaseDocs property={property} addDocument={addAgreement} selectAgreement={selectAgreement}/>
                    ) : ''}


                    <Row className='px-2'>
                        <Col onClick={() => {navigate('./repairs', { state: {property: property }})}}
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
                        <Col onClick={() => ''}
                             className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
                             style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
                            <img src={Document} alt='Document' style={{width: '50px'}}/>
                            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
                                Tenant Documents
                            </p>
                        </Col>
                    </Row>

                    <Row className='px-2'>
                        <Col onClick={() => {navigate("./resident-announcements", { state: {property_uid: property.property_uid}})}}
                             className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
                             style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
                            <img src={Announcements} alt='ResidentAnnouncements' style={{width: '50px'}}/>
                            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
                                Resident Announcements
                            </p>
                        </Col>
                        <Col onClick={() => {navigate("./emergency", { state: {property_uid: property.property_uid}})}}
                             className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
                             style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
                            <img src={Emergency} alt='Emergency' style={{width: '50px'}}/>
                            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
                                Emergency
                            </p>
                        </Col>
                        <Col onClick={() => ''}
                             className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'
                             style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>
                            <img src={Announcements} alt='EmployeesAssociated' style={{width: '50px'}}/>
                            <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>
                                Employees Associated
                            </p>
                        </Col>
                    </Row>


                    {property.owner_id !== null ? (
                        <div className='mt-4'>
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
    )
}

export default ManagerPropertyView;
