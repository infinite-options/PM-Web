import React, { useEffect } from 'react';
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import PropertyForm from '../components/PropertyForm';
import { get } from "../utils/api";
import { Row, Col, Button } from "react-bootstrap";
import { bluePillButton} from '../utils/styles';


function TenantPropertyView(props) {
    const { property_uid } = useParams();
      const navigate = useNavigate();

    const [property, setProperty] = React.useState(null);

    useEffect(() => {
        const fetchProperty = async () => {
            const response = await get(`/propertyInfo?property_uid=${property_uid}`);
            setProperty(response.result[0]);
        }
         fetchProperty();

    }, []);

    return(
        <div className="h-100 d-flex flex-column">
            <Header
                title="Property Details"
                leftText="< Back"
                leftFn={() => navigate("/tenantAvailableProperties")}
            />

            <div style={{padding:"100px",paddingTop:"15px",paddingBottom:"15px"}}>
                {property?
                (<PropertyForm property={property}/>)
                :
                ""}
            </div>
            {/* ====================  < Button >==================================== */}
             <Row className="mt-4">
                <Col
                    style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginBottom:"25px"
                    }}
                >
                    {" "}
                    <Button
                        onClick={() => navigate(`/reviewTenantProfile/${property_uid}`)}
                        variant='outline-primary'
                        style={bluePillButton}>
                            Start Application to rent
                        </Button>
                </Col>
            </Row>
        </div>


    )
}

export default TenantPropertyView;
