import React from "react";
import Footer from "../components/Footer";
import AppContext from "../AppContext";
import TenantDashboard from "./TenantDashboard";
import TenantProfile from "./TenantProfile";

function TenantHome() {
  const { userData } = React.useContext(AppContext);
  const [footerTab, setFooterTab] = React.useState("DASHBOARD");
  const [showFooter, setShowFooter] = React.useState(true);
  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1">
        {footerTab === "DASHBOARD" ? (
          <TenantDashboard setShowFooter={setShowFooter} />
        ) : (
          ""
        )}
      </div>
      <div className="flex-grow-1">
        {footerTab === "PROFILE" ? (
          <TenantProfile setShowFooter={setShowFooter} setTab={setFooterTab} />
        ) : (
          ""
        )}
      </div>
      {showFooter ? <Footer tab={footerTab} setTab={setFooterTab} /> : ""}
    </div>
  );
}

export default TenantHome;
