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

export default function AppliedDashboard(){
    return(
        <div>
            <div>Property info </div>
            <div>Thing two that is the lease information stuff</div>
        </div>
    )
}