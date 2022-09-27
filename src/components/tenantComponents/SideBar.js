import React, { useState, useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";

export default function SideBar(){
    const navigate = useNavigate();
    const goToSearchPM = () => {
        navigate("/tenantAvailableProperties");
      };
      const goToDash = () => {
        navigate("/tenant");
      };
      
    return(
        <div className="sidebar">
            <a className="sidenav-elements"onClick={goToDash}>Dashboard</a>
            <a className="sidenav-elements"href="#">Profile</a>
            <a className="sidenav-elements"href="#">Expenses</a>
            <a className="sidenav-elements"href="#">Maintenance </a>
            <a className="sidenav-elements" onClick={goToSearchPM}>Search Properties</a>
        </div>
    )
}