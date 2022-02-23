import React from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import Document from "../icons/documents.svg";
import { useNavigate } from "react-router-dom";



function PropertyCard(props) {
    const { property } = props;
    const navigate = useNavigate();

    const goToApplyToProperty = () => {
        navigate("/applyToProperty");
    }
    return (      
        <div style={{height: "150px",border:"1px solid lightblue", cursor: "pointer", display: "flex" }} >
                <div className="img" style={{ flex: "0 0 35%", background:"lightgray" }}>
                    
                    {property.images && property.images.length ? (<img style={{width:"100%", height:"100%"}} src={property.images[0]}/>) : "" }
                </div> 
                <div className="details"style={{ width:"100%", padding:"10px", display:"flex",flexDirection:"column" }} >
                     <div style={{fontWeight:"bold", fontSize:"18px",color:"black"}}> ${property.listed_rent}/month
                     </div>
                     <div style={{marginTop:"10px",fontSize:"14px",color:"gray"}}>
                        <div>{property.address}, {property.area}, </div>
                        <div>{property.city}, {property.zip}</div>
                     </div>
                    <div style={{display:"flex",marginTop:"auto"}}>
                        <div style={{flex:"1",fontSize:"12px",color:"blue",marginTop:"auto",marginBottom:"auto"}}>
                            Manager :
                            <span style={{marginLeft:"1px"}}>John Doe</span>
                        </div>
                        <div className="btns">
                            <img src={Document} onClick={goToApplyToProperty} alt="documentIcon" style={{marginRight:"5px", width:"25px"}} />
                             <img src={Phone} alt="phoneIcon" style={{marginRight:"5px", width:"25px"}} />
                             <img src={Message} alt="messageIcon"  style={{width:"25px"}} />

                        </div>
                    </div>
                     
                </div>
        </div>
    );
}
export default PropertyCard;