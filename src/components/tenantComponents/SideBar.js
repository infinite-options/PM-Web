import React, { useState, useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import TenantDocumentUpload from "../../pages/TenantDocumentUpload";

import Scroll from 'react-scroll'
const ScrollLink = Scroll.ScrollLink
export default function SideBar(props){
    const navigate = useNavigate();
    const goToSearchPM = () => {
        navigate("/tenantAvailableProperties");
      };
      const goToDash = () => {
        navigate("/tenant");
      };
      const goToRepairs = () =>{
        navigate(`/${props.uid}/repairStatus`)
      };
    function scrollM(){
      const anchor = document.querySelector('#scroll-to-maintenance')
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })

    }function scrollProfile(){
      const anchor = document.querySelector('#scroll-to-profile')
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })

    }
    function scrollExpenses(){
      const anchor = document.querySelector('#scroll-to-expenses')
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })

    }
    function scrollLease(){
      const anchor = document.querySelector('#scroll-to-lease')
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })

    }
    function goToDocuments(){
      console.log("Go to documents");
      // <TenantDocumentUpload
      //               setStage={"DOCUMENTS"}
      //               setShowFooter={true}
      //               setTab={"DASHBOARD"}
      //   />
    }
    return(
        <div className="sidebar">
            <a className="sidenav-elements"onClick={goToDash}>DASHBOARD</a>
            <a className="sidenav-elements"onClick={scrollProfile}>PROFILE</a>
            <a className="sidenav-elements"href={scrollExpenses}>EXPENSES</a>
            {/* <div className="sidenav-elements">
              <ScrollLink 
                to="scroll-to-maintenance" 
                spy={true} 
                smooth={true} 
                duration={500} 
                className='some-class' 
                activeClass='some-active-class'
              >
                  <a>Maintenance</a>
              </ScrollLink>
            </div> */}
            <a className="sidenav-elements" onClick ={scrollM}>MAINTENANCE</a>
            <a className="sidenav-elements" onClick = {goToDocuments}>DOCUMENTS</a>
            <a className="sidenav-elements" onClick={goToSearchPM}>SEARCH PROPERTIES</a>
            <a className="sidenav-elements" onClick ={scrollLease}>LEASE INFO</a>

        </div>
    )
}