import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import AppContext from "../AppContext";
import TenantDashboard from "./TenantDashboard";
import TenantProfile from "./TenantProfile";
import TenantAvailableProperties from "./TenantAvailableProperties";
import SwitchRole from "../components/SwitchRole";
import { get } from "../utils/api";
import TenantWelcomePage from "./TenantWelcomePage";
import TenantProfileTab from "./TenantProfileTab";
import PaymentPage from "../components/PaymentPage";
import PaymentSelection from "../components/PaymentSelection";
import TenantDocumentUpload from "./TenantDocumentUpload";
import OwnerSwitchRole from "../components/OwnerSwitchRole";
function TenantHome() {
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [stage, setStage] = useState("DASHBOARD");
  const [footerTab, setFooterTab] = useState("DASHBOARD");
  const [showFooter, setShowFooter] = useState(true);
  const [profile, setProfile] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /*
   * Fetches user profile from the database based on a given access token.
   */
  const fetchProfile = async () => {
    // const response = await get("/tenantProperties", access_token);
    if (access_token === null || user.role.indexOf("TENANT") === -1) {
      navigate("/");
      return;
    }
    const response = await get("/tenantProfileInfo", access_token);
    console.log("first");
    console.log(response);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();

      return;
    }
    //Extracts user profile
    setProfile(response.result[0]);
  };

  /*
   * Fetches tenant properties based on user access_token
   */
  const fetchUserProperties = async () => {
    if (access_token === null || user.role.indexOf("TENANT") === -1) {
      navigate("/");
      return;
    }
    const response = await get("/tenantProperties", access_token);
    console.log("second");
    console.log(response);
    setIsLoading(false);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();

      return;
    }
    setProperties(response.result[0]);
  };
  useEffect(() => {
    if (access_token === null) {
      navigate("/");
    }
    fetchProfile();
    fetchUserProperties();
  }, []);

  return (
    <div className="d-flex flex-column h-100">
      {isLoading === false ? (
        <div>
          <div className="flex-grow-1">
            {footerTab === "DASHBOARD" && (
              <div>
                {properties !== undefined ? (
                  <TenantDashboard
                    setShowFooter={setShowFooter}
                    profile={profile}
                    setProfile={setProfile}
                  />
                ) : (
                  <TenantWelcomePage
                    setShowFooter={setShowFooter}
                    profile={profile}
                    setProfile={setProfile}
                  />
                )}
              </div>
            )}

            {footerTab === "PROFILE" ? (
              <div>
                {stage === "DASHBOARD" ? (
                  <TenantProfileTab
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
                  <TenantProfile
                    setStage={setStage}
                    setShowFooter={setShowFooter}
                    setTab={setFooterTab}
                  />
                ) : stage === "DOCUMENTS" ? (
                  <TenantDocumentUpload
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
            {footerTab === "ROLES" ? (
              <SwitchRole setShowFooter={setShowFooter} setTab={setFooterTab} />
            ) : (
              ""
            )}
            {footerTab === "PAYMENTS" ? <PaymentSelection /> : ""}
            {/*{footerTab === "PaymentMethods" ? (*/}
            {/*    <PaymentPage/>*/}
            {/*) : (*/}
            {/*    ""*/}
            {/*)}*/}
          </div>

          {showFooter ? (
            <Footer tab={footerTab} setTab={setFooterTab} profile={profile} />
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default TenantHome;
