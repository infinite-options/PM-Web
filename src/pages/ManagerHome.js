import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import AppContext from "../AppContext";
import ManagerOverview from "./ManagerOverview";
import ManagerProfile from "../components/ManagerProfile";
import SwitchRole from "../components/SwitchRole";
import ManagerFooter from "../components/ManagerFooter";
import ManagerRepairsOverview from "./ManagerRepairsOverview";
import { get } from "../utils/api";
import ManagerUtilities from "./ManagerUtilities";
import ManagerProfileTab from "./ManagerProfileTab";
import OwnerSwitchRole from "../components/OwnerSwitchRole";
import ManagerDocuments from "../components/ManagerDocuments";
function ManagerHome() {
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [footerTab, setFooterTab] = useState("DASHBOARD");
  const [stage, setStage] = useState("DASHBOARD");
  const [showFooter, setShowFooter] = useState(true);
  const [properties, setProperties] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);

  useEffect(() => {
    if (userData.access_token === null) {
      navigate("/");
    }
  }, []);

  const fetchProperties = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length < 1) {
      console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
    } else {
      management_buid = management_businesses[0].business_uid;
    }

    // const response =  await get(`/businesses?business_uid=${management_buid}`);
    const response = await get(`/propertyInfo?manager_id=${management_buid}`);
    if (response.msg === "Token has expired") {
      refresh();
      return;
    }

    // const properties = response.result
    const properties = response.result.filter(
      (property) => property.management_status !== "REJECTED"
    );

    const properties_unique = [];
    const pids = new Set();
    const mr = [];
    properties.forEach((property) => {
      if (pids.has(property.property_uid)) {
        // properties_unique[properties_unique.length-1].tenants.push(property)
        const index = properties_unique.findIndex(
          (item) => item.property_uid === property.property_uid
        );
        properties_unique[index].tenants.push(property);
      } else {
        pids.add(property.property_uid);
        properties_unique.push(property);
        properties_unique[properties_unique.length - 1].tenants = [property];
      }
    });
    properties_unique.forEach((property) => {
      if (property.maintenanceRequests.length > 0) {
        console.log("has maintenanceRequests");
        property.maintenanceRequests.forEach((request) => {
          mr.push(request);
        });
      }
    });
    console.log(mr);
    console.log(properties_unique);
    setMaintenanceRequests(mr);
    setProperties(properties_unique);

    // await getAlerts(properties_unique)
  };

  useEffect(fetchProperties, [access_token]);

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1">
        {footerTab === "DASHBOARD" ? (
          <ManagerOverview
            properties={properties}
            maintenanceRequests={maintenanceRequests}
            setShowFooter={setShowFooter}
          />
        ) : (
          ""
        )}
        {footerTab === "EXPENSES" ? (
          <ManagerUtilities
            properties={properties}
            setShowFooter={setShowFooter}
            setFooterTab={setFooterTab}
          />
        ) : (
          ""
        )}

        {footerTab === "PROFILE" ? (
          <div>
            {stage === "DASHBOARD" ? (
              <ManagerProfileTab
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
              <ManagerProfile
                setStage={setStage}
                setShowFooter={setShowFooter}
                setTab={setFooterTab}
              />
            ) : stage === "DOCUMENTS" ? (
              <ManagerDocuments
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
          <ManagerRepairsOverview
            properties={properties}
            setFooterTab={setFooterTab}
            setShowFooter={setShowFooter}
          />
        ) : (
          ""
        )}
      </div>
      {showFooter ? (
        <ManagerFooter
          properties={properties}
          tab={footerTab}
          setTab={setFooterTab}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default ManagerHome;
