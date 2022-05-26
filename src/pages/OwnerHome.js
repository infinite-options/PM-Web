import React from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../utils/api";
import Footer from "../components/Footer";
import AppContext from "../AppContext";
import OwnerProperties from "./OwnerProperties";
import OwnerDashboard from "./OwnerDashboard";
import OwnerProfile from "./OwnerProfile";
import SwitchRole from "../components/SwitchRole";

function OwnerHome() {
  const navigate = useNavigate();
  const { userData, refresh } = React.useContext(AppContext);
  const { access_token, user } = userData;
  const [footerTab, setFooterTab] = React.useState("DASHBOARD");
  const [showFooter, setShowFooter] = React.useState(true);
  const [stage, setStage] = React.useState("DASHBOARD");
  const [properties, setProperties] = React.useState([]);

  const [selectedProperty, setSelectedProperty] = React.useState(null);
  const fetchProperties = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }
    const response = await get(`/propertiesOwner?owner_id=${user.user_uid}`);
    if (stage === "PROPERTY") {
      const property = response.result.filter(
        (item) => item.property_uid === selectedProperty.property_uid
      )[0];
      setSelectedProperty(property);
    }

    setProperties(response.result);
  };
  React.useEffect(() => {
    if (access_token === null) {
      navigate("/");
    }
    fetchProperties();
  }, [access_token]);
  React.useEffect(() => {
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
                setStage={setStage}
                properties={properties}
              />
            ) : stage === "PROPERTIES" ? (
              <OwnerProperties
                setShowFooter={setShowFooter}
                properties={properties}
                fetchProperties={fetchProperties}
                selectedProperty={selectedProperty}
                setSelectedProperty={setSelectedProperty}
              />
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        {footerTab === "PROFILE" ? (
          <OwnerProfile setShowFooter={setShowFooter} setTab={setFooterTab} />
        ) : (
          ""
        )}
        {footerTab === "ROLES" ? (
          <SwitchRole setShowFooter={setShowFooter} setTab={setFooterTab} />
        ) : (
          ""
        )}
      </div>
      {/* <div className="flex-grow-1">
        {footerTab === "PROFILE" ? (
          <OwnerProfile setShowFooter={setShowFooter} setTab={setFooterTab} />
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
      {showFooter ? <Footer tab={footerTab} setTab={setTab} /> : ""}
    </div>
  );
}

export default OwnerHome;
