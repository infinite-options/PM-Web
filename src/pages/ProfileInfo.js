import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BusinessProfileInfo from "./BusinessProfileInfo";
import OwnerProfileInfo from "./OwnerProfileInfo";
import TenantProfileInfo from "./TenantProfileInfo";
import ManagerProfileInfo from "./ManagerProfileInfo";
import Header from "../components/Header";
import EmployeeProfile from "../components/EmployeeProfile";
import SelectRole from "../components/SelectRole";
import AppContext from "../AppContext";

import { bolder } from "../utils/styles";

function ProfileInfo() {
  const location = useLocation();
  const role = location.state.role;
  const [profileStage, setProfileStage] = useState([
    "MANAGER",
    "PM_EMPLOYEE",
    "OWNER",
    "TENANT",
    "MAINTENANCE",
    "MAINT_EMPLOYEE",
    "ROLE",
  ]);
  const { userData, refresh } = useContext(AppContext);

  const { user } = userData;

  const [autofillState, setAutofillState] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number,
    email: user.email,
    paypal: "",
    apple_pay: "",
    zelle: "",
    venmo: "",
    account_number: "",
    routing_number: "",
    ssn: "",
    ein_number: "",
  });
  useEffect(() => {
    if (profileStage.includes("ROLE")) {
      refresh();
    }
    window.scrollTo(0, 0);
  }, [profileStage]);
  console.log("profileStage", profileStage, role);
  return (
    <div className="h-100 pb-5">
      {profileStage.includes("MANAGER") && role.includes("MANAGER") ? (
        <BusinessProfileInfo
          businessType="MANAGEMENT"
          onConfirm={() =>
            setProfileStage([
              "PM_EMPLOYEE",
              "OWNER",
              "TENANT",
              "MAINTENANCE",
              "MAINT_EMPLOYEE",
              "ROLE",
            ])
          }
          autofillState={autofillState}
          setAutofillState={setAutofillState}
        />
      ) : profileStage.includes("PM_EMPLOYEE") &&
        role.includes("PM_EMPLOYEE") ? (
        <EmployeeProfile
          businessType="MANAGEMENT"
          onConfirm={() =>
            setProfileStage([
              "OWNER",
              "TENANT",
              "MAINTENANCE",
              "MAINT_EMPLOYEE",
              "ROLE",
            ])
          }
          autofillState={autofillState}
          setAutofillState={setAutofillState}
        />
      ) : profileStage.includes("OWNER") && role.includes("OWNER") ? (
        <OwnerProfileInfo
          onConfirm={() =>
            setProfileStage(["TENANT", "MAINTENANCE", "MAINT_EMPLOYEE", "ROLE"])
          }
          autofillState={autofillState}
          setAutofillState={setAutofillState}
        />
      ) : profileStage.includes("TENANT") && role.includes("TENANT") ? (
        <TenantProfileInfo
          onConfirm={() =>
            setProfileStage(["MAINTENANCE", "MAINT_EMPLOYEE", "ROLE"])
          }
          autofillState={autofillState}
          setAutofillState={setAutofillState}
        />
      ) : profileStage.includes("MAINTENANCE") &&
        role.includes("MAINTENANCE") ? (
        <BusinessProfileInfo
          businessType="MAINTENANCE"
          onConfirm={() => setProfileStage(["MAINT_EMPLOYEE", "ROLE"])}
          autofillState={autofillState}
          setAutofillState={setAutofillState}
        />
      ) : profileStage.includes("MAINTENANCE") &&
        role.includes("MAINT_EMPLOYEE") ? (
        <EmployeeProfile
          businessType="MAINTENANCE"
          onConfirm={() => setProfileStage(["ROLE"])}
          autofillState={autofillState}
          setAutofillState={setAutofillState}
        />
      ) : profileStage.includes("ROLE") ? (
        <div className="h-100 d-flex flex-column pb-5">
          <Header title="Sign Up" />
          <div className="text-center mb-5">
            <h5 style={bolder} className="mb-1">
              Great Job!
            </h5>
            <h5 style={bolder} className="mb-1">
              Your profiles have been set up
            </h5>
          </div>
          <SelectRole />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ProfileInfo;
