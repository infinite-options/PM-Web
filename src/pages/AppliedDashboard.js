import React, { useState, useContext, useEffect } from "react";
import Header from "../components/Header";
import AppContext from "../AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import TenantPropertyView from "./TenantPropertyView";
import { Row, Col, Button, Container, Image } from "react-bootstrap";
import { bluePillButton, greenPill, redPillButton } from "../utils/styles";
import { get, put } from "../utils/api";
import No_Image from "../icons/No_Image_Available.jpeg";
import ReviewPropertyLease from "./reviewPropertyLease";

export default function AppliedDashboard(){
  //its getting confusing;
  //so write down what I need first
  //available property information
  //the property clicked on
  //
    return(
        <div>
            <div>Property info </div>
            <div>
            {/* <ReviewPropertyLease 
                application_uid = {appUid} 
                application_status_1 =  {appstat1}
                message = {msg}
                property_uid = {appArray[lookingAt].property_uid}
            /> */}
            Lease Information must be called here
            </div>
        </div>
    )
}