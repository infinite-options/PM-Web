import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import AppContext from "../AppContext";
import Header from "../components/Header";
import { headings,welcome } from "../utils/styles";


function TenantWelcomePage(props) {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const { userData } = context;
    const { access_token, user } = userData;
    const { profile } = props;
    const goToTenantAvailableProperties = () => {
        navigate("/tenantAvailableProperties");
      };
    return(
        <div className="h-100">
            <Header title="Home" />
            {(!profile || profile.length) ? null : (
                <Container className="pt-1 mb-4" style={{ minHeight: "100%", height:"65vh" }}>
                    <div style={welcome}>
                        <Row style={headings}>
                            <div>Hello {profile.tenant_first_name},</div>
                        </Row>
                        <Row>
                            <div>
                                No lease yet? 
                            </div>
                            <a onClick={goToTenantAvailableProperties} > Check out the available properties here</a>
                        </Row>
                    </div>
                    
                </Container>
             )}

        </div>

    )
}

export default TenantWelcomePage;