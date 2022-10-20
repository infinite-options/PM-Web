//I need to make this page the main page first
import React, { useState, useContext, useEffect } from "react";
// import * as React from 'react';\
import axios from "axios";

import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import SideBar from "../components/tenantComponents/SideBar";

import { get, post } from "../utils/api";
import "./tenantDash.css";

import Maintenence from "../components/tenantComponents/Maintenence";

import AppContext from "../AppContext";
import "./maintenance.css";
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";

import RepairImages from "../components/RepairImages";
// import { get, post } from "../utils/api";
export default function MaintenancePage() {
  const [propertyData, setPropertyData] = React.useState([]);
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;

  const [isLoading, setIsLoading] = useState(true);
  //form states
  const [issueDescription, setIssueDescription] = React.useState("");
  const [issueType, setIssueType] = React.useState("Plumbing");
  const [priority, setPriority] = React.useState("Low");
  const [textArea, setTextArea] = React.useState("");

  const location = useLocation();

  const [data, setData] = useState(location.state.property_uid);
  const [tenantId, setTenantId] = useState(location.state.tenant_id);
  const { state } = useLocation();
  const imageState = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = React.useState([]);

  //possible declarations for the submit portion

  // const { property_uid } = useParams();
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
  const getMaintenanceRequests = () => {
    //process to get data from aateButtons(pi using axios
    axios
      .get(
        "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests"
      )
      .then((response) => {
        setMaintenanceRequests(response.data); //useState is getting the data
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    console.log("in use effect");
    fetchTenantDashboard();
    getMaintenanceRequests();
  }, []);

  const handleSubmit = async () => {
    console.log(data);
    if (issueDescription === "") {
      setErrorMessage("Please fill out required fields");
      return;
    }
    const newRequest = {
      // property_uid: propertyData.length !== 0 && propertyData[0].properties !==0? propertyData[0].properties[0].property_uid : "propertyData not found",
      property_uid: data,
      title: issueDescription,
      request_type: issueType,
      description: textArea,
      request_created_by: tenantId,
      priority: priority,
    };
    const files = imageState[0];
    let i = 0;
    for (const file of imageState[0]) {
      let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
      if (file.file !== null) {
        newRequest[key] = file.file;
      } else {
        newRequest[key] = file.image;
      }
    }

    console.log(files);
    //   console.log(newRequest);
    await post("/maintenanceRequests", newRequest, null, files);
    navigate("/tenant");
  };

  return (
    <div className="maintenence-page">
      {propertyData.length !== 0 && (
        <div>
          <h3 style={{ paddingLeft: "7rem", paddingTop: "2rem" }}>
            {propertyData.result[0].tenant_first_name}
          </h3>
          <h8 style={{ paddingLeft: "7rem", paddingTop: "2rem" }}>Tenant</h8>
        </div>
      )}

      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div className="main-content2">
          <br />
          <h2>Mainenance Portal</h2>
          <h5>Current Tickets</h5>
          {propertyData.length !== 0 && (
            <Maintenence
              data={maintenanceRequests.result}
              address={propertyData?.result[0].properties[0].address}
            />
          )}
        </div>
      </div>
      <div className="below">
        <form>
          <label>
            {" "}
            Issue Description:
            <br />
            <input
              type="text"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              className="input-fields"
            />
          </label>

          <label>
            Select Issue Type:
            <br />
            <DropdownList
              value={issueType}
              onChange={(nextValue) => setIssueType(nextValue)}
              data={[
                "Plumbing",
                "Landscape",
                "Appliances",
                "Electrical",
                "Other",
              ]}
            />
          </label>
          <label>
            Priority
            <br />
            <DropdownList
              value={priority}
              onChange={(nextValue) => setPriority(nextValue)}
              data={["Low", "Medium", "High"]}
            />
          </label>
          <br />

          <label>
            {" "}
            Additional Information:
            <br />
            <input
              type="text"
              value={textArea}
              onChange={(e) => setTextArea(e.target.value)}
              className="input-fields last-text-area"
            />
          </label>
        </form>
        {/* <input type = "file" multiple accept="image/*" onChange ={onImageChange} />
                {imageURLs.map(imageSrc=><img src={imageSrc}/>)} */}
        <RepairImages state={imageState} />
        <input type="submit" onClick={handleSubmit} />
      </div>
    </div>
  );
}
