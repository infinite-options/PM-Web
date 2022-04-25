import React from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import Document from "../icons/documents.svg";
import Check from "../icons/Check.svg";
import { useNavigate } from "react-router-dom";
import { greenPill, redPillButton } from "../utils/styles";
import No_Image from "../icons/No_Image_Available.jpeg";



function PropertyCard(props) {
    const { property, applied } = props;
    const navigate = useNavigate();

    const goToApplyToProperty = () => {
        // navigate("/applyToProperty");
        navigate(`/tenantPropertyView/${property.property_uid}`)
    }
    const stopEventPropagation = (e) =>{
        e.stopPropagation();
        e.preventDefault();
    }
    return (
        <div style={{height: "150px",border:"1px solid lightblue", cursor: "pointer", display: "flex" }} >
                <div className="img" style={{ flex: "0 0 35%", background:"lightgrey" }}>
                    {property.images && property.images.length ? (<img style={{width:"100%", height:"100%"}} src={property.images[0]}/>) : (<img style={{width:"100%", height:"100%"}} src={No_Image}/>) }
                </div>

                <div className="details"style={{ width:"100%", padding:"10px", display:"flex",flexDirection:"column" }} >
                     <div className="d-flex justify-content-between">
                            <div style={{fontWeight:"bold", fontSize:"18px",color:"black"}}> 
                                ${property.listed_rent}/month |   {property.area} .SqFt    
                            </div>

                            {applied === "NEW" ? 
                            (<p style={greenPill} className='mb-0'>{applied}</p>) 
                            : 
                            applied === "REFUSED" ?
                            (<p style={redPillButton} className='mb-0'>{applied}</p>) 
                            :
                           
                            ""
                            }
                     </div>

                     <div style={{marginTop:"10px",fontSize:"14px",color:"gray"}}>
                        <div>{property.address}, {property.unit} </div>
                        <div>{property.city}, {property.zip}</div>
                     </div>
                     
                     <div style={{display:"flex",marginTop:"auto"}} onClick={stopEventPropagation}>
                    {/* <div style={{display:"flex",marginTop:"auto"}}> */}

                        <div style={{flex:"1",fontSize:"12px",color:"blue",marginTop:"auto",marginBottom:"auto"}}>
                            {/* Manager : <span style={{marginLeft:"1px"}}>John Doe</span> */}
                            Manager : <span style={{marginLeft:"1px"}}>{property.manager_business_name}</span>
                        </div>

                        <Row className="btns"> 
                            {applied === "REFUSED" ?
                                (<Col className="view overlay zoom" >
                                    <img src={Document} onClick={goToApplyToProperty} alt="documentIcon" style={{marginRight:"5px", width:"25px"}} />
                                    {/* <img
                                    onClick={() => goToApplyToProperty  }
                                    src={Document}
                                     /> */}
                                    <div class="mask flex-center">
                                        <p class="white-text" style={{fontSize:"14px"}}> Reapply</p>
                                    </div>
                                </Col>)
                                :
                                (<Col className="view overlay zoom" >
                                    <img src={Document} onClick={goToApplyToProperty} alt="documentIcon" style={{marginRight:"5px", width:"25px"}} />
                                    {/* <img 
                                        onClick={() => goToApplyToProperty  }
                                        src={Document}
                                     /> */}
                                    <div class="mask flex-center">
                                        <p class="white-text" style={{fontSize:"14px"}}>Apply</p>
                                    </div>
                                </Col>)
                                }
                            <Col>
                                {/* <a href={`tel:${property.manager_phone_number}`}>
                                    <img src={Phone} alt="phoneIcon" style={{marginRight:"5px", width:"25px"}} />
                                </a> */}
                                <img
                                    onClick={() =>
                                    (window.location.href = `tel:${property.manager_phone_number}`)
                                    }
                                    src={Phone}
                                />
                                <div class="mask flex-center">
                                    <p class="white-text" style={{fontSize:"14px"}}>Call</p>
                                </div>
                            </Col>
                            <Col>
                                {/* <a href={`mailto:${property.manager_email}`}>
                                    <img src={Message} alt="messageIcon"  style={{width:"25px"}} />
                                </a> */}
                                <img
                                    onClick={() =>
                                    (window.location.href = `mailto:${property.manager_email}`)
                                    }
                                    src={Message}
                                />
                                <div class="mask flex-center">
                                    <p class="white-text" style={{fontSize:"14px"}}>Email</p>
                                </div>
                            </Col>
                        </Row>
                    </div>

                </div>
        </div>
    );
}
export default PropertyCard;
