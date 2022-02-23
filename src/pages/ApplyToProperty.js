import React from "react";
import Header from "../components/Header";
import { Container, Row, Col } from "react-bootstrap";
import {welcome } from "../utils/styles";
import { useNavigate } from "react-router-dom";
import SearchPM from "../icons/searchPM.svg";
import Dashboard_Blue from "../icons/Dashboard_Blue.svg";

  
const divStyle = {
    color: 'blue',
    fontSize: "20px"
  };
function ApplyToProperty(){
    const navigate = useNavigate();
    const goToDashboard = () => {
        navigate("/tenant")
    }
    const goToAvailableProperties = () => {
        navigate("/tenantAvailableProperties");
    }

    return(
        <div className="h-100">
            <Header/>
            <Container>
                <div style={welcome}>
                    <Row >
                        <div style={{fontSize:"30px"}}> Your documents have been shared with the Property Manager !</div>
                    </Row>
                </div >
                <div style={welcome}>
                    <div style={{fontSize:"25px"}}> Where do you like to proceed?</div>
                    <div style={{display:"flex",padding:"20px"}}>
                        <Col>
                            {/* <a onClick={goToDashboard} style={divStyle}> A. DashBoard </a> */}
                            <img
                                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                                src={Dashboard_Blue}
                                onClick={goToDashboard}
                                />
                                <div>DashBoard</div>
                        </Col>
                        <Col>
                            {/* <a onClick={goToAvailableProperties} style={divStyle}> B. Available Properties </a> */}
                            <div>
                                <img
                                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                                src={SearchPM}
                                onClick={goToAvailableProperties}
                                />
                                <div>Available Properties</div>
                            </div>
                        </Col>
                    </div>
                </div>
            </Container>
        </div>
    )


}

export default ApplyToProperty;