import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import AppContext from "../AppContext";
import Checkbox from "../components/Checkbox";
import Header from "../components/Header";
import { pillButton, bluePillButton } from "../utils/styles";

function OwnerSwitchRole(props) {
  const navigate = useNavigate();
  const { userData } = React.useContext(AppContext);
  const { user } = userData;
  const [footerTab, setFooterTab] = React.useState("ROLES");
  const availableRoles = user.role.split(",");
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [currentRole, setCurrentRole] = React.useState(
    window.location.href.split("/")[3]
  );

  const { setStage } = props;
  const navigateToRole = (role) => {
    // add navigation to correct role pages
    console.log(`load ${role}`);
    if (role === "OWNER") {
      navigate("/owner");
    } else if (role === "MANAGER") {
      navigate("/manager");
    } else if (role === "PM_EMPLOYEE") {
      navigate("/manager");
    } else if (role === "TENANT") {
      navigate("/tenant");
    } else if (role === "MAINTENANCE") {
      navigate("/maintenance");
    } else if (role === "MAINT_EMPLOYEE") {
      navigate("/maintenance");
    }
  };
  const selectRole = () => {
    navigateToRole(selectedRole);
  };
  React.useEffect(() => {
    if (availableRoles.length === 1) {
      navigateToRole(availableRoles[0]);
    }
  }, []);
  const longNames = {
    MANAGER: "Property Manager (Owner)",
    PM_EMPLOYEE: "Property Manager (Employee)",
    OWNER: "Property Owner",
    TENANT: "Tenant",
    MAINTENANCE: "Property Maintenance (Owner)",
    MAINT_EMPLOYEE: "Property Maintenance (Employee)",
  };

  React.useState(() => {}, []);
  return (
    <div
      style={{
        background: "#E9E9E9 0% 0% no-repeat padding-box",
        borderRadius: "10px",
        opacity: 1,
        height: "100vh",
      }}
    >
      <Header
        title="Switch Roles"
        leftText="< Back"
        leftFn={() => setStage("DASHBOARD")}
      />
      <div
        className="mx-2 my-2 p-3"
        style={{
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        <div className="flex-grow-1 mx-3">
          <h5 className="mb-4">Switch to one of the following roles:</h5>
          {availableRoles.map((role, i) => (
            <div key={i} className="d-flex px-4">
              <Checkbox
                type="CIRCLE"
                checked={
                  role === selectedRole || role === currentRole.toUpperCase()
                }
                onClick={() => {
                  setSelectedRole(role);
                  setCurrentRole(role);
                }}
              />
              <p className="d-inline-block text-left">{longNames[role]}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button
            variant="outline-primary"
            style={bluePillButton}
            onClick={selectRole}
          >
            Switch Roles
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OwnerSwitchRole;
