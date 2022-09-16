import React, { useState, useContext, useEffect } from "react";
import LandingNavbar from "./LandingNavbar"
import RenterMap from "../icons/RenterRoadMap.webp"
import Options from "../icons/RenterRoadMap.webp"
import "./renterLand.css";
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
            
        </div>
    )
}