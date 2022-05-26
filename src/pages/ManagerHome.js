import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import AppContext from "../AppContext";
import ManagerOverview from "./ManagerOverview";
import ManagerProfile from "../components/ManagerProfile";
import SwitchRole from "../components/SwitchRole";

function ManagerHome() {
  const navigate = useNavigate();
  const { userData } = React.useContext(AppContext);
  const [footerTab, setFooterTab] = React.useState("DASHBOARD");
  const [showFooter, setShowFooter] = React.useState(true);
  React.useEffect(() => {
    if (userData.access_token === null) {
      navigate("/");
    }
  }, []);
  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1">
        {footerTab === "DASHBOARD" ? (
          <ManagerOverview setShowFooter={setShowFooter} />
        ) : (
          ""
        )}
        {footerTab === "ROLES" ? (
          <SwitchRole
            setShowFooter={setShowFooter}
            setFooterTab={setFooterTab}
          />
        ) : (
          ""
        )}
        {footerTab === "PROFILE" ? (
          <ManagerProfile
            setFooterTab={setFooterTab}
            setShowFooter={setShowFooter}
          />
        ) : (
          ""
        )}
      </div>
      {showFooter ? <Footer tab={footerTab} setTab={setFooterTab} /> : ""}
    </div>
  );
}

export default ManagerHome;
