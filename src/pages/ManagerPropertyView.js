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
import ManagerTenantAgreement from "./ManagerTenantAgreement";
import ManagerLeaseDocs from "../components/ManagerLeaseDocs";
import Repair from '../icons/Repair.svg';
import Document from "../icons/Document.svg";
import {get} from "../utils/api";
import ManagerTenantApplications from "../components/ManagerTenantApplications";
import ManagerTenantProfileView from "./ManagerTenantProfileView";
import PropertyManagerDocs from "../components/PropertyManagerDocs";
import AppContext from "../AppContext";
import ManagerManagementContract from "../components/ManagerManagementContract";
import ManagerTenantAgreementView from "./ManagerTenantAgreementView";
import Property from "../icons/Property.svg";

function ManagerPropertyView(props) {

    const navigate = useNavigate();
    const location = useLocation();
    const {userData, refresh} = React.useContext(AppContext);
    const {access_token, user} = userData;
    // const property = location.state.property
    // const { mp_id } = useParams();
    const property_uid = location.state.property_uid

    const [property, setProperty] = React.useState({images: '[]'});

    const fetchProperty = async () => {
        // const response = await get(`/propertiesOwnerDetail?property_uid=${property_uid}`);
        const response = await get(`/propertiesManagerDetail?property_uid=${property_uid}`);
        const property_details = response.result[0]

        property_details.tenants = property_details.rentalInfo.filter(r => r.rental_status === "ACTIVE")

        const management_businesses = user.businesses.filter(business => business.business_type === "MANAGEMENT")
        let management_buid = null
        if (management_businesses.length >= 1) {
            management_buid = management_businesses[0].business_uid
        }
        let owner_negotiations = property_details.property_manager.filter(pm => pm.linked_business_id === management_buid)
        if (owner_negotiations.length === 0) {
            property_details.management_status = null
        } else if (owner_negotiations.length === 1) {
            property_details.management_status = owner_negotiations[0].management_status
        } else {
            // placeholder, scenario needs to be tested and updated
            property_details.management_status = owner_negotiations[0].management_status
        }

        setProperty(property_details);

        // Older Approach
        const r = await get(`/propertyInfo?property_uid=${property_uid}`);
        const property_info = r.result[0]

        property_info.tenants = []
        if ((r.result.length > 1) || (r.result[0].tenant_id !== null)) {
            r.result.forEach(row => {
                property_info.tenants.push(row)
            });
        }
        console.log("Property Details Comparison")
        console.log(property_info)
        console.log(property_details)
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
    const [acceptedTenantApplications, setAcceptedTenantApplications] = React.useState([]);
    const [showTenantProfile, setShowTenantProfile] = React.useState(false);
    const [selectedTenantApplication, setSelectedTenantApplication] = React.useState(null);

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
        setAcceptedTenantApplications([])
        setShowTenantAgreement(false);
    }

    const reloadProperty = () => {
        setEditProperty(false);
        fetchProperty();
    }

    const createNewTenantAgreement = (selected_applications) => {
        // console.log(selected_applications)
        setAcceptedTenantApplications(selected_applications)
        setShowTenantAgreement(true)
    }

    const selectTenantApplication = (application) => {
        setSelectedTenantApplication(application);
        setShowTenantProfile(true);
    }

    const closeTenantApplication = () => {
        setShowTenantProfile(false);
    }

    return(
        showManagementContract ? (
            <ManagerManagementContract back={closeContract} property={property} contract={selectedContract} reload={reloadProperty}/>
        ) : showTenantAgreement ? (
            selectedAgreement ? (
                <ManagerTenantAgreementView back={closeAgreement} property={property} agreement={selectedAgreement}
                                            acceptedTenantApplications={acceptedTenantApplications}
                                            setAcceptedTenantApplications={setAcceptedTenantApplications}/>
                ) :
                <ManagerTenantAgreement back={closeAgreement} property={property} agreement={selectedAgreement}
                                        acceptedTenantApplications={acceptedTenantApplications}
                                        setAcceptedTenantApplications={setAcceptedTenantApplications}/>

        ) : showTenantProfile ? (
            <ManagerTenantProfileView back={closeTenantApplication} application={selectedTenantApplication}/>
        ) : (
            <div style={{ background: "#E9E9E9 0% 0% no-repeat padding-box" }}>
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
                            : property.rental_status === "PROCESSING" ? <p style={bluePill} className='mb-0'>Processing</p>
                                : property.management_status === "FORWARDED" ? <p style={redPill} className='mb-0'>New</p>
                                    : property.management_status === "SENT" ? <p style={orangePill} className='mb-0'>Processing</p>
                                        : <p style={orangePill} className='mb-0'>Not Rented</p>}
                    </div>

                    {(property.rental_status === "ACTIVE") ? <ManagerRentalHistory property={property}/> :
                        <ManagerTenantApplications property={property} createNewTenantAgreement={createNewTenantAgreement}
                                                   selectTenantApplication={selectTenantApplication}/>}

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
                        <PropertyManagerDocs property={property} addDocument={addContract} selectContract={selectContract}
                                             setExpandManagerDocs={setExpandManagerDocs} reload={''}/>
                    ) : ''}
                    <div onClick={() => setExpandLeaseDocs(!expandLeaseDocs)}>
                        <div className='d-flex justify-content-between mt-3'>
                            <h6 style={mediumBold} className='mb-1'>Tenant Agreement</h6>
                            <img src={expandLeaseDocs ? ArrowUp : ArrowDown} alt='Expand'/>
                        </div>
                        <hr style={{opacity: 1}} className='mt-1'/>
                    </div>
                    {expandLeaseDocs ? (
                        <ManagerLeaseDocs property={property} addDocument={addAgreement} selectAgreement={selectAgreement}/>
                    ) : ''}

                    <Row className="px-2">
                        <Col onClick={() => {navigate('./repairs', { state: {property: property }})}}
                             className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
                             style={{
                                 height: "87px",
                                 background: "#FFFFFF 0% 0% no-repeat padding-box",
                                 boxShadow: "0px 3px 3px #00000029",
                                 borderRadius: "20px",
                                 cursor: "pointer",
                             }}>
                            <Col>
                                <img src={Repair} alt="Repair" style={{ width: "50px" }} />
                            </Col>
                            <Col>
                                <p style={{ ...xSmall, ...smallLine, ...mediumBold }} className="mb-0">
                                    Repair <br /> Requests
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
                        <Col className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
                             style={{
                                 height: "87px",
                                 background: "#FFFFFF 0% 0% no-repeat padding-box",
                                 boxShadow: "0px 3px 3px #00000029",
                                 borderRadius: "20px",
                                 cursor: "pointer",
                             }}>
                            <Col>
                                <img src={Document} alt="Repair" style={{ width: "50px" }} />
                            </Col>
                            <Col>
                                <p style={{ ...xSmall, ...smallLine, ...mediumBold }} className="mb-0">
                                    Tenant <br /> Documents
                                </p>
                            </Col>
                        </Col>

                        <Col className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
                            style={{
                                height: "87px",
                                background: "#FFFFFF 0% 0% no-repeat padding-box",
                                boxShadow: "0px 3px 3px #00000029",
                                borderRadius: "20px",
                                cursor: "pointer",
                            }}>
                            <Col>
                                <img src={Announcements} alt="Document" style={{ width: "50px" }} />
                            </Col>
                            <Col>
                                <p style={{ ...xSmall, ...smallLine, ...mediumBold }} className="mb-0">
                                    Associated <br /> Employees
                                </p>
                            </Col>
                        </Col>
                    </Row>

                    <Row className="px-2">
                        <Col className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
                             style={{
                                 height: "87px",
                                 background: "#FFFFFF 0% 0% no-repeat padding-box",
                                 boxShadow: "0px 3px 3px #00000029",
                                 borderRadius: "20px",
                                 cursor: "pointer",
                             }}>
                            <Col>
                                <img src={Announcements} alt="Announcements" style={{ width: "50px" }} />
                            </Col>
                            <Col>
                                <p style={{ ...xSmall, ...smallLine, ...mediumBold }} className="mb-0">
                                    Resident <br /> Announcements
                                </p>
                            </Col>
                        </Col>

                        <Col className="text-center m-1 p-2 d-flex flex-row justify-content-between align-items-center"
                             style={{
                                 height: "87px",
                                 background: "#FFFFFF 0% 0% no-repeat padding-box",
                                 boxShadow: "0px 3px 3px #00000029",
                                 borderRadius: "20px",
                                 cursor: "pointer",
                             }}>
                            <Col>
                                <img src={Emergency} alt="Emergency" style={{ width: "50px" }} />
                            </Col>
                            <Col>
                                <p style={{ ...xSmall, ...smallLine, ...mediumBold }} className="mb-0">
                                    Emergency
                                </p>
                            </Col>
                        </Col>
                    </Row>

                    {/*<Row className='px-2'>*/}
                    {/*    <Col onClick={() => {navigate('./repairs', { state: {property: property }})}}*/}
                    {/*         className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'*/}
                    {/*         style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>*/}
                    {/*        <img src={Repair} alt='Repair Requests' style={{width: '50px'}}/>*/}
                    {/*        <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>*/}
                    {/*            Repair Requests*/}
                    {/*        </p>*/}
                    {/*    </Col>*/}
                    {/*    <Col onClick={() => ''}*/}
                    {/*         className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'*/}
                    {/*         style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>*/}
                    {/*        <img src={Repair} alt='Maintenance' style={{width: '50px'}}/>*/}
                    {/*        <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>*/}
                    {/*            Maintenance*/}
                    {/*        </p>*/}
                    {/*    </Col>*/}
                    {/*    <Col onClick={() => ''}*/}
                    {/*         className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'*/}
                    {/*         style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>*/}
                    {/*        <img src={Document} alt='Document' style={{width: '50px'}}/>*/}
                    {/*        <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>*/}
                    {/*            Tenant Documents*/}
                    {/*        </p>*/}
                    {/*    </Col>*/}
                    {/*</Row>*/}

                    {/*<Row className='px-2'>*/}
                    {/*    <Col onClick={() => {navigate("./resident-announcements", { state: {property_uid: property.property_uid}})}}*/}
                    {/*         className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'*/}
                    {/*         style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>*/}
                    {/*        <img src={Announcements} alt='ResidentAnnouncements' style={{width: '50px'}}/>*/}
                    {/*        <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>*/}
                    {/*            Resident Announcements*/}
                    {/*        </p>*/}
                    {/*    </Col>*/}
                    {/*    <Col onClick={() => {navigate("./emergency", { state: {property_uid: property.property_uid}})}}*/}
                    {/*         className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'*/}
                    {/*         style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>*/}
                    {/*        <img src={Emergency} alt='Emergency' style={{width: '50px'}}/>*/}
                    {/*        <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>*/}
                    {/*            Emergency*/}
                    {/*        </p>*/}
                    {/*    </Col>*/}
                    {/*    <Col onClick={() => ''}*/}
                    {/*         className='text-center m-1 p-2 d-flex flex-column justify-content-between align-items-center'*/}
                    {/*         style={{border: '1px solid black', borderRadius: '5px', height: '100px'}}>*/}
                    {/*        <img src={Announcements} alt='EmployeesAssociated' style={{width: '50px'}}/>*/}
                    {/*        <p style={{...xSmall, ...smallLine, ...mediumBold}} className='mb-0'>*/}
                    {/*            Employees Associated*/}
                    {/*        </p>*/}
                    {/*    </Col>*/}
                    {/*</Row>*/}


                    {property.owner && (property.owner.length > 0) ? (
                        <div className='mt-4'>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <h6 style={mediumBold} className='mb-1'>
                                        {property.owner[0].owner_first_name} {property.owner[0].owner_last_name}
                                    </h6>
                                    <p style={{...gray, ...mediumBold}} className='mb-1'>
                                        Owner
                                    </p>
                                </div>
                                <div>
                                    <a href={`tel:${property.owner[0].owner_phone_number}`}>
                                        <img src={Phone} alt='Phone' style={mediumImg}/>
                                    </a>
                                    <a href={`mailto:${property.owner[0].owner_email}`}>
                                        <img src={Message} alt='Message' style={mediumImg}/>
                                    </a>
                                </div>
                            </div>
                            <hr style={{opacity: 1}} className='mt-1'/>
                        </div>
                    ) : ''}

                    {property.tenants !== undefined  && property.tenants.length > 0 &&
                        property.tenants.map((tenant, i) => (
                            <div key={i}>
                                <div className='d-flex justify-content-between'>
                                    <div>
                                        <h6 style={mediumBold} className='mb-1'>
                                            {tenant.tenant_first_name} {tenant.tenant_last_name}
                                        </h6>
                                        <p style={{...gray, ...mediumBold}} className='mb-1'>
                                            Tenant
                                        </p>
                                    </div>
                                    <div>
                                        <a href={`tel:${tenant.tenant_email}`}>
                                            <img src={Phone} alt='Phone' style={mediumImg}/>
                                        </a>
                                        <a href={`mailto:${tenant.tenant_phone_number}`}>
                                            <img src={Message} alt='Message' style={mediumImg}/>
                                        </a>
                                    </div>
                                </div>
                                <hr style={{opacity: 1}} className='mt-1'/>
                            </div>
                        ))
                    }

                </div>
            </Container>
        </div>
        )
    )
}

export default ManagerPropertyView;
