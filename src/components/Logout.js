import React from "react";
import { Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { bluePillButton } from "../utils/styles";
import AppContext from "../AppContext";

function Logout(props) {
  const navigate = useNavigate();
  const { logout } = React.useContext(AppContext);

  return (
    <div className="text-center d-flex flex-column justify-content-end">
      <Col>
        <Button
          style={bluePillButton}
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          {" "}
          Logout
        </Button>
      </Col>
    </div>
  );
}

export default Logout;
