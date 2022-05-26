import React from "react";
import Footer from "../components/Footer";
import AppContext from "../AppContext";
import MaintenanceDashboard from "./MaintenanceDashboard";
import BusinessProfile from "./BusinessProfile";
import SwitchRole from "../components/SwitchRole";
function MaintenanceHome() {
  const { userData } = React.useContext(AppContext);
  const [footerTab, setFooterTab] = React.useState("DASHBOARD");
  const [showFooter, setShowFooter] = React.useState(true);
  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1">
        {footerTab === "DASHBOARD" ? (
          <MaintenanceDashboard setShowFooter={setShowFooter} />
        ) : (
          ""
        )}

        {footerTab === "PROFILE" ? (
          <BusinessProfile
            setShowFooter={setShowFooter}
            setTab={setFooterTab}
          />
        ) : (
          ""
        )}
        {footerTab === "ROLES" ? (
          <SwitchRole setShowFooter={setShowFooter} setTab={setFooterTab} />
        ) : (
          ""
        )}
      </div>
      {showFooter ? <Footer tab={footerTab} setTab={setFooterTab} /> : ""}
    </div>
  );
}

export default MaintenanceHome;
