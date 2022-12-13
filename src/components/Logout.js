import React from "react";
import { Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { redPillButton } from "../utils/styles";
import AppContext from "../AppContext";

function Logout(props) {
  const navigate = useNavigate();
  const { logout } = React.useContext(AppContext);

  return (
    <Button
      style={{
        backgroundColor: "#fb8500",
        borderColor: "#fb8500",
        borderRadius: "10px",
        color: "white",
        maxWidth: "10rem",
        minWidth: "10rem",
        font: "normal normal normal 18px Avenir-Light",
      }}
      onClick={() => {
        logout();
        navigate("/");
      }}
    >
      {" "}
      Logout
    </Button>
  );
}

export default Logout;
