import React from "react";
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
  const [selectedRole, setSelectedRole] = React.useState(null);
  const selectRole = () => {
    // add navigation to correct role pages
    console.log(`load ${selectedRole}`);
    if (selectedRole === "OWNER") {
      navigate("/owner");
    } else if (selectedRole === "MANAGER") {
      navigate("/manager");
    } else if (selectedRole === "PM_EMPLOYEE") {
      navigate("/manager");
    } else if (selectedRole === "TENANT") {
      navigate("/tenant");
    } else if (selectedRole === "MAINTENANCE") {
      navigate("/maintenance");
    } else if (selectedRole === "MAINT_EMPLOYEE") {
      navigate("/maintenance");
    }
  };
  const longNames = {
    MANAGER: "Property Manager (Owner)",
    PM_EMPLOYEE: "Property Manager (Employee)",
    OWNER: "Property Owner",
    TENANT: "Tenant",
    MAINTENANCE: "Property Maintenance (Owner)",
    MAINT_EMPLOYEE: "Property Maintenance (Employee)"
  };
  React.useState(() => {}, []);
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
