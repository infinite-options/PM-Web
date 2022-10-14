import React from "react"
import {useLocation} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Component } from 'react';

import Appliances from "../components/tenantComponents/Appliances";
import Apply from "../icons/ApplyIcon.svg";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import Carousel from 'react-elastic-carousel'
import ReviewPropertyLease from "./reviewPropertyLease";
export default function PropertyInfo(){
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state.property;
    const type = location.state.type;
    const imgs = data.images;
    const util = Object.entries(JSON.parse(data.utilities));
    // const [currentImg, setCurrentImg] = React.useState(0);
    const [currentImg, setCurrentImg] = React.useState(0)
    console.log(util);
    var counter = 0;
    var counter2 = 0;
    var counter3 = 0;
    const appliances = JSON.parse(data.appliances);
    const arr = Object.entries(appliances);
    const apps = arr.map((a) =>{
        counter2+=1;
        return (
           
            <ol>{counter2}. {a[0]}</ol>
        )
    })
    const breakPoints = [
        {width: 1, itemsToShow: 1},
        {width: 550, itemsToShow: 2},
        {width: 768, itemsToShow: 3},
        {width: 1200, itemsToShow: 3}
    ]
    const availUtils = util?.map((u)=>{
        
        if(u[1] == true){
            counter+=1;
            return(
                <ol>{counter}. {u[0]}</ol>
            )
        }
        
    })
    const tenantUtils = util?.map((u)=>{
        
        if(u[1] == false){
            counter3+=1;
            return(
                <ol>{counter3}. {u[0]}</ol>
            )
        }
        
    })
    const goToApplyToProperty = () => {
        // navigate("/applyToProperty");
        navigate(`/tenantPropertyView/${data.property_uid}`)
    }
    const nextImg = () => {
        if (currentImg === imgs.length - 1) {
          setCurrentImg(0);
        } else {
          setCurrentImg((prev) => prev+1);
        }
      };
      const previousImg = () => {
        if (currentImg === 0) {
          setCurrentImg(imgs.length - 1);
        } else {
          setCurrentImg((prev)=> prev- 1);
        }
      };
    const showImgs = imgs?.map((img)=>{
        return(
            <img className="more-info-prop-images" src={img}/>
        )
    })
    
    return(
        <div className="prop-info-container">
            {imgs.length>3?
                <h3 className="prop-info-images-container" >
                    {/* <div onClick={previousImg} className="left-arrow">{"<"}</div>
                    <img className="more-info-prop-images" src={imgs[currentImg]}/>
                    <div onClick={nextImg} className="right-arrow">{">"}</div>  */}
                        <Carousel breakPoints = {breakPoints}>
                            {showImgs}
                        </Carousel>
                </h3>
                :
                <h3 className="prop-info-images-container" >
                    {/* <div onClick={previousImg} className="left-arrow">{"<"}</div>
                    <img className="more-info-prop-images" src={imgs[currentImg]}/>
                    <div onClick={nextImg} className="right-arrow">{">"}</div>  */}
                    {showImgs}
                </h3>
                
            }
            
            <h1 className="prop-info-address">{data.address}</h1>
            
            <h3 className="prop-info-prop-type">{data.property_type}</h3>
            <div className="info-container">
                <div className="left box">
                    <h3 className="prop-info-stats">Rent : ${data.listed_rent} / mo</h3>
                    <h3 className="prop-info-stats">Bedrooms: {data.num_beds}</h3>
                    <h3 className="prop-info-stats">Bathrooms: {data.num_baths}</h3>
                    <h3 className="prop-info-stats">Active Since: {data.active_date}</h3>
                    <h3 className="prop-info-stats">Area : {data.area} SqFt</h3>
                    <h3 className="prop-info-stats">City: {data.city}</h3>
                    <div className= "contacts" style={{marginTop: "10vh"}}>
                        <div>
                            {/* {console.log("im trying to print an apply button")} */}
                            <img src={Apply} onClick={goToApplyToProperty} alt="documentIcon"  />
                            <div className="mask flex-center">
                                <p className="white-text" style={{fontSize:"14px"}}>Apply</p>
                            </div>
                        </div>
                        <div>
                            <img
                                onClick={() =>
                                    (window.location.href = `tel:${location.state.business_number}`)
                                    }
                                src={Phone}
                                style={{marginRight:"10px"}}
                            />
                            <div className="mask flex-center">
                                <p className="white-text" style={{fontSize:"14px" ,marginRight:"0px"}}>Call</p>
                            </div>

                        </div>
                        <div>
                        <img
                            onClick={() =>
                                (window.location.href = `mailto:${location.state.business_email}`)
                                }
                                src={Message}
                                style={{marginRight:"10px"}}
                            />
                            <div className="mask flex-center">
                                <p className="white-text" style={{fontSize:"14px",marginLeft:"0px"}}>Email</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* <Appliances data = {data.appliances}/> */}
                <div className="right box">
                    <h3 className="prop-info-stats">Included Utilities <br/></h3>
                    {availUtils}
                    <h3 className="prop-info-stats">Utilities covered by Tenant <br/></h3>
                    {tenantUtils}
                    <h3 className="prop-info-stats">Included Appliances:</h3>
                    {apps}

                </div>
            </div>
            {type == 2 && 
                <div> 
                    <div>
                        <ReviewPropertyLease 
                            application_uid = {location.state.application_uid} 
                            application_status_1 =  {location.state.application_status_1}
                            message = {location.state.msg}
                            property_uid = {location.state.property_uid}
                        />
                    </div>
                    <div>
                        Property Manager Information
                        <br></br>
                        <u>Property Manager</u>: {location.state.business_name}
                        <br></br>
                        <u>Manager Email</u>: {location.state.business_email}
                        <br></br>
                        <u>Manager Number</u> : {location.state.business_number}
                        <br></br>
                    </div>
                </div>
            }
            
        </div>
    )
}