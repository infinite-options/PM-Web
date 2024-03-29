import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import AppContext from "../AppContext";
import Checkbox from "../components/Checkbox";
import { pillButton } from "../utils/styles";

function SelectRole() {
  const navigate = useNavigate();
  const { userData } = React.useContext(AppContext);
  const { user } = userData;
  const availableRoles = user.role.split(",");
  const [selectedRole, setSelectedRole] = useState(null);
  const navigateToRole = (role) => {
    // add navigation to correct role pages
    // console.log(`load ${role}`);
    if (role === "OWNER") {
      navigate("/owner");
    } else if (role === "MANAGER") {
      navigate("/manager");
    } else if (role === "PM_EMPLOYEE") {
      navigate("/manager");
    } else if (role === "TENANT") {
      navigate("/tenant");
    } else if (role === "MAINTENANCE") {
      navigate("/maintenance", { state: { roles: role } });
    } else if (role === "MAINT_EMPLOYEE") {
      navigate("/maintenance", { state: { roles: role } });
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
    MANAGER: "Property Manager",
    PM_EMPLOYEE: "Property Manager (Employee)",
    OWNER: "Property Owner",
    TENANT: "Tenant",
    MAINTENANCE: "Property Maintenance",
    MAINT_EMPLOYEE: "Property Maintenance (Employee)",
  };
  useState(() => {}, []);
  return (
    <div className="flex-grow-1 d-flex flex-column pb-5 mb-5">
      <div className="flex-grow-1 mx-3">
        <h5 className="mb-4">Login as: (choose one)</h5>
        {availableRoles.map((role, i) => (
          <div key={i} className="d-flex px-4">
            <Checkbox
              type="CIRCLE"
              checked={role === selectedRole}
              onClick={() => setSelectedRole(role)}
            />
            <p className="d-inline-block text-left">{longNames[role]}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Button
          variant="outline-primary"
          style={pillButton}
          onClick={selectRole}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default SelectRole;
