import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../utils/api";
import OwnerFooter from "../components/OwnerFooter";
import AppContext from "../AppContext";
import OwnerProperties from "./OwnerProperties";
import OwnerDashboard from "./OwnerDashboard";
import OwnerProfileTab from "./OwnerProfileTab";
import OwnerProfile from "./OwnerProfile";
import OwnerSwitchRole from "../components/OwnerSwitchRole";
import OwnerContacts from "./OwnerContacts";
import OwnerRepairList from "../components/OwnerRepairList";
import OwnerRepairRequest from "../components/OwnerRepairRequest";

function OwnerHome(props) {
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [footerTab, setFooterTab] = useState("DASHBOARD");
  const [showFooter, setShowFooter] = useState(true);
  const [stage, setStage] = useState("DASHBOARD");
  const [properties, setProperties] = useState([]);
  const [bills, setBills] = useState([]);
  const [ownerID, setOwnerID] = useState([]);
  // const [profileInfo, setProfileInfo] = useState([]);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const fetchProperties = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }
    setOwnerID(user.user_uid);
    const response = await get(`/propertiesOwner?owner_id=${user.user_uid}`);
    if (stage === "PROPERTY") {
      const property = response.result.filter(
        (item) => item.property_uid === selectedProperty.property_uid
      )[0];
      setSelectedProperty(property);
    }

    setProperties(response.result);
  };
  const fetchBills = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }
    const response = await get(`/ownerPropertyBills?owner_id=${user.user_uid}`);
    if (stage === "PROPERTY") {
      const bill = response.result.filter(
        (item) => item.property_uid === selectedProperty.property_uid
      )[0];
    }

    setBills(response.result);
  };

  // const fetchProfile = async () => {
  //   if (access_token === null || user.role.indexOf("OWNER") === -1) {
  //     navigate("/");
  //     return;
  //   }

  //   const response = await get("/ownerProfileInfo", access_token);
  //   console.log(response);

  //   if (response.msg === "Token has expired") {
  //     console.log("here msg");
  //     refresh();
  //     return;
  //   }
  //   setProfileInfo(response.result[0]);
  // };
  useEffect(() => {
    if (access_token === null) {
      navigate("/");
    }
    fetchProperties();
  }, [access_token]);
  useEffect(() => {
    if (access_token === null) {
      navigate("/");
    }
    fetchBills();
  }, [access_token]);
  // useEffect(() => {
  //   if (access_token === null) {
  //     navigate("/");
  //   }
  //   fetchProfile();
  // }, [access_token]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stage, footerTab]);

  const setTab = (tab) => {
    if (footerTab === "DASHBOARD" && tab === "DASHBOARD") {
      setStage("DASHBOARD");
    }
    setFooterTab(tab);
  };
  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1">
        {footerTab === "DASHBOARD" ? (
          <div>
            {stage === "DASHBOARD" ? (
              <OwnerDashboard
                setShowFooter={setShowFooter}
                stage={stage}
                setStage={setStage}
                properties={properties}
                bills={bills}
                fetchProperties={fetchProperties}
              />
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        {footerTab === "CONTACTS" ? (
          <OwnerContacts setShowFooter={setShowFooter} setTab={setFooterTab} />
        ) : (
          ""
        )}
        {footerTab === "PROFILE" ? (
          <div>
            {stage === "DASHBOARD" ? (
              <OwnerProfileTab
                // profileInfo={profileInfo}
                stage={stage}
                setStage={setStage}
                setShowFooter={setShowFooter}
                setTab={setFooterTab}
              />
            ) : stage === "ROLES" ? (
              <OwnerSwitchRole
                setStage={setStage}
                setShowFooter={setShowFooter}
                setTab={setFooterTab}
              />
            ) : stage === "PROFILE" ? (
              <OwnerProfile
                setStage={setStage}
                setShowFooter={setShowFooter}
                setTab={setFooterTab}
              />
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        {footerTab === "REPAIRS" ? (
          <div>
            {stage === "DASHBOARD" ? (
              <OwnerRepairList
                ownerID={ownerID}
                properties={properties}
                setShowFooter={setShowFooter}
                setTab={setFooterTab}
                setStage={setStage}
              />
            ) : stage === "REPAIRSREQUEST" ? (
              <OwnerRepairRequest
                setStage={setStage}
                setShowFooter={setShowFooter}
                setTab={setFooterTab}
                properties={properties}
              />
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      {/* <div className="flex-grow-1">
        {footerTab === "PROFILE" ? (
          <OwnerProfileTab setShowFooter={setShowFooter} setTab={setFooterTab} />
        ) : (
          ""
        )}
        {footerTab === "ROLES" ? (
          <SwitchRole setShowFooter={setShowFooter} setTab={setFooterTab} />
        ) : (
          ""
        )}
      </div> */}
      {/* <div
        className="flex-grow-1"
        style={{ height: "90%", overflow: "auto" }}
      ></div> */}
      {showFooter ? <OwnerFooter tab={footerTab} setTab={setTab} /> : ""}
    </div>
  );
}

export default OwnerHome;
