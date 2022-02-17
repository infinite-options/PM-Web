import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import AppContext from "../AppContext";
import Header from "../components/Header";
import { headings,welcome } from "../utils/styles";
import { fontSize } from "@mui/system";


function TenantWelcomePage(props) {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const { userData } = context;
    const { access_token, user } = userData;
    const { profile } = props;
    const goToTenantAvailableProperties = () => {
        navigate("/tenantAvailableProperties");
    };
    const divStyle = {
        color: 'blue',
        fontSize: "20px",
        textDecoration: "underline"
      };
    return(
        <div className="h-100">
            <Header title="Home" />
            {!profile ? (<div>abc</div>) : (
                <Container className="pt-1 mb-4" style={{ minHeight: "100%", height:"65vh" }}>
                    <div style={welcome}>
                        <Row style={headings}>
                            <div style={{fontSize:"50px"}}>Welcome {profile.tenant_first_name}!</div>
                        </Row>
                        <Row>
                            <div style={{fontSize:"30px"}}>
                                Not signed a lease yet? 
                            </div>
                            <a onClick={goToTenantAvailableProperties} style={divStyle}> Check out the available properties</a>
                        </Row>
                    </div>
                    
                </Container>
             )}

        </div>

    )
}

export default TenantWelcomePage;