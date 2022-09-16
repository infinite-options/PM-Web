import React, { useState, useContext, useEffect } from "react";
import LandingNavbar from "./LandingNavbar"
import RenterMap from "../icons/RenterRoadMap.webp"
import Options from "../icons/RenterRoadMap.webp"
import "./renterLand.css";
import PropertyCard from "../components/tenantComponents/PropertyCard"
// import {PropImg} from "../icons/propImg.webp"
export default function renderLanding(){
    return(
        <div className="main-renter-page">
            <LandingNavbar/>
            <img className="main-img" src = {RenterMap}/>
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
            <div className="p-container">
                <div>
                    <PropertyCard 
                        color="#628191" 
                        add1="1234 Market St, San Francisco"
                        cost="$2700"
                        bedrooms = "1"
                        bathrooms = "1"

                    />
                    <PropertyCard 
                        color="#FB8500" 
                        add1="1234 Market St, San Francisco"
                        cost="$2700"
                        bedrooms = "1"
                        bathrooms = "1"

                    />
                </div>
                <div>
                    <PropertyCard 
                        color="rgb(255,183,3)" 
                        add1="1234 Market St, San Francisco"
                        cost="$2700"
                        bedrooms = "1"
                        bathrooms = "1"

                    />
                    <PropertyCard 
                        color="rgb(33,158,188)" 
                        add1="1234 Market St, San Francisco"
                        cost="$2700"
                        bedrooms = "1"
                        bathrooms = "1"

                    />
                </div>
            </div>
            
        </div>
    )
}