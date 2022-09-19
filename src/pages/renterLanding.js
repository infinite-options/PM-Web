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
        <div>
          <PropertyCard
            color="#628191"
            add1={data.result[0].address}
            cost={data.result[0].listed_rent}
            bedrooms={data.result[0].num_beds}
            bathrooms={data.result[0].num_baths}
            property_type={data.result[0].property_type}
            city = {data.result[0].city}
            imgSrc = {data.result[0].images}
          />
          <PropertyCard
            color="#FB8500"
            add1={data.result[1].address}
            cost={data.result[1].listed_rent}
            bedrooms={data.result[1].num_beds}
            bathrooms={data.result[1].num_baths}
            property_type={data.result[1].property_type}
            city = {data.result[1].city}
            imgSrc = {data.result[1].images}
          />
        </div>
        <div>
          <PropertyCard
            color="rgb(255,183,3)"
            add1={data.result[2].address}
            cost={data.result[2].listed_rent}
            bedrooms={data.result[2].num_beds}
            bathrooms={data.result[2].num_baths}
            property_type={data.result[2].property_type}
            city = {data.result[2].city}
            imgSrc = {data.result[2].images}
          />
          <PropertyCard
            color="rgb(33,158,188)"
            add1={data.result[3].address}
            cost={data.result[3].listed_rent}
            bedrooms={data.result[3].num_beds}
            bathrooms={data.result[3].num_baths}
            property_type={data.result[3].property_type}
            city = {data.result[3].city}
            imgSrc = {data.result[3].images}
          />
        </div>
      </div>} 
    </div>
  );
}
