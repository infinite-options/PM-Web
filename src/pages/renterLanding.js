import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LandingNavbar from "./LandingNavbar";
import RenterMap from "../icons/RenterRoadMap.webp";
import Options from "../icons/RenterRoadMap.webp";
import "./renterLand.css"
import axios from 'axios'
import PropertyCard from "../components/tenantComponents/PropertyCard";
// import {PropImg} from "../icons/propImg.webp"
export default function RenterLanding() {
  const navigate = useNavigate();
  const [data,setData] = useState([])
  const getDataFromApi = () => { //process to get data from aateButtons(pi using axios
    axios.get('https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/availableProperties')
    .then(response => {
      setData(response.data) //useState is getting the data

    }).catch(err =>{
      console.log(err)
    })

  }
  useEffect(()=>{ // so that this program doesn't run too many times.
    getDataFromApi();
     
  },[])
  console.log(data);
  //things to do:
  //->change maintainence thing to remove assigned, schedule and closed date and add an image thing
  //working on payment pages
  //formatting
  const featuredProperties = data.result;
  // for(var i =0 ; i < data.result.length; i++){
  //   if(data.result[i].featured == "True"){
  //     featuredProperties.push(data.result[i]);
  //   }
  // }
  console.log(featuredProperties);
  const colors = ["#628191","#FB8500", "rgb(255,183,3)", "rgb(33,158,188)"];
  //need to make it so that only featured proerties are mapped
  const mapProperty = featuredProperties?.map((prop,index)=>{
    if(prop.featured == "True"){
      return(
        <PropertyCard
              color= {colors[index%4]}
              add1={prop.address}
              cost={prop.listed_rent}
              bedrooms={prop.num_beds}
              bathrooms={prop.num_baths}
              property_type={prop.property_type}
              city = {prop.city}
              imgSrc = {prop.images}
              unit = {prop.unit}
        />
      )
    }
    else{
      
    }
    
  })
  return (
    <div className="main-renter-page">
      {/* <LandingNavbar/> */}
      <img className="main-img" src={RenterMap} />
      <h1>Welcome To Your New Home </h1>
      <div className="options">
        <div className="o">All cities</div>
        <div className="o">All neighborhoods</div>
        <div className="o">Bedrooms</div>
        <div className="o search">Search</div>
      </div>
      <h1>Schedule A Tour Today</h1>
      <h1>Featured Properties</h1>
      {/* <PropertyCard propImg={PropImg}/> */}
      {data.length !== 0 && <div className="p-container">
        {mapProperty}
      </div>} 
    </div>
  );
}
