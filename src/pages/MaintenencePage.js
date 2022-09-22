//I need to make this page the main page first
import React, { useState, useContext, useEffect } from "react";
// import * as React from 'react';
import { useLocation } from "react-router-dom";
import { useParams } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/tenantComponents/TopBar";
import SideBar from "../components/tenantComponents/SideBar";
import TenantCard from "../components/tenantComponents/TenantCard";
import { get, post } from "../utils/api";
import "./tenantDash.css";
import UpcomingPayments from "../components/tenantComponents/UpcomingPayments";
import PaymentHistory from "../components/tenantComponents/PaymentHistory";
import Maintenence from "../components/tenantComponents/Maintenence";
import Appliances from "../components/tenantComponents/Appliances";
import PersonalInfo from "../components/tenantComponents/PersonalInfo";
import AppContext from "../AppContext";
import "./maintenance.css"
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
import { ImageList, TableSortLabel } from "@material-ui/core";
import { upload } from "@testing-library/user-event/dist/upload";
// import { get, post } from "../utils/api";
export default function MaintenancePage(){
    const [propertyData, setPropertyData] = React.useState([]);
    const navigate = useNavigate();
    const { userData, refresh } = useContext(AppContext);
    const { access_token, user } = userData;
  
    const [isLoading, setIsLoading] = useState(true);
    //form states
    const [issueDescription, setIssueDescription] = React.useState("")
    const [issueType, setIssueType] = React.useState("Plumbing")

    const [textArea, setTextArea] = React.useState("");
    const [uploadImages, setUploadImages] = React.useState([]);
    const [imageURLs, setImageURLs] = React.useState([]);

    //possible declarations for the submit portion
    
    const { property_uid } = useParams();
    const [errorMessage, setErrorMessage] = useState("");
    const fetchTenantDashboard = async () => {
      if (access_token === null || user.role.indexOf("TENANT") === -1) {
        navigate("/");
        return;
      }
      const response = await get("/tenantDashboard", access_token);
      console.log("second");
      console.log(response);
      setIsLoading(false);
  
      if (response.msg === "Token has expired") {
        console.log("here msg");
        refresh();
  
        return;
      }
      setPropertyData(response);
    };
    useEffect(() => {
      console.log("in use effect");
      fetchTenantDashboard();
    }, []);
    

    const handleSubmit = async () => {
        // event.preventDefault();
        console.log("print something please")
        console.log(issueDescription)
        console.log(issueType)
        console.log(textArea)
        console.log(uploadImages)
        console.log(imageURLs);
        if (issueDescription === "") {
            setErrorMessage("Please fill out required fields");
            return;
        }
        const newRequest = {
            // property_uid: propertyData.length !== 0 && propertyData[0].properties !==0? propertyData[0].properties[0].property_uid : "propertyData not found",
            property_uid: property_uid,
            description: issueDescription,
            request_type: issueType,
            additional_info: textArea
          };
          const files = uploadImages;
          let i = 0;
          for (const file of uploadImages) {
            let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
            if (file.file !== null) {
              newRequest[key] = file.file;
            } else {
              newRequest[key] = file.image;
            }
          }

          console.log(files);
          await post("/maintenanceRequests", newRequest, null, files);
          navigate("/tenant");
    }
    function onImageChange(e){
        setUploadImages([...e.target.files]);
    }
    React.useEffect(()=>{
        if(uploadImages.length < 1 ) return;
        const newImageUrls = [];
        uploadImages.forEach(img => newImageUrls.push(URL.createObjectURL(img)));
        setImageURLs(newImageUrls);
    },[uploadImages]
    )
    return(
        <div className="maintenence-page">
            {propertyData.length !== 0 && (
                // <TopBar
                //   firstName={propertyData.result[0].tenant_first_name}
                //   lastName={propertyData.result[0].tenant_last_name}
                // />
                // <div className="topBar">
                //   <div className="circle"></div>
                //   <div>
                //     <h1>{propertyData.result[0].tenant_first_name}</h1>
                //     <h2>Tenant</h2>
                //   </div>
                // </div>
                <div>
                <h3 style={{paddingLeft: "7rem", paddingTop:"2rem"}}>{propertyData.result[0].tenant_first_name}</h3> 
                <h8 style={{paddingLeft: "7rem", paddingTop:"2rem"}}>Tenant</h8>
                </div>
            )}
        
            <div className="flex-1">
                <div className="sidebar">
                    <SideBar />
                </div>
                <div className="main-content2">
                    <br />
                    <h2>Mainenance Portal</h2>
                    <h5>Current Tickets</h5>
                    <Maintenence data={""} />
                    
                </div>
            </div>
            <div className="below">
                <form >
                    <label> Issue Description: 
                        <br/>
                        <input 
                            type = "text"
                            value = {issueDescription}
                            onChange={(e)=>setIssueDescription(e.target.value)}
                            className="input-fields"
                        />
                    </label>


                    <label>Select Issue Type: 
                        <br/>
                        <DropdownList
                            value={issueType}
                            onChange={(nextValue) => setIssueType(nextValue)}
                            data={["Plumbing", "Landscape", "Appliances", "Electrical", "Other"]}
                        />
                    
                    </label>
                <br/>

                    <label> Additional Information: 
                            <br/>
                            <input 
                                type = "text"
                                value = {textArea}
                                onChange={(e)=>setTextArea(e.target.value)}
                                className="input-fields last-text-area"
                            />
                    </label>

                </form>
                <input type = "file" multiple accept="image/*" onChange ={onImageChange} />
                {imageURLs.map(imageSrc=><img src={imageSrc}/>)}
                <input type="submit" onClick={handleSubmit}/>
            </div>
        </div>
    )
}