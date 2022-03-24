import React, { useEffect } from 'react';
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import PropertyForm from '../components/PropertyForm';
import { get } from "../utils/api";
import { Row, Col, Button } from "react-bootstrap";
import { bluePillButton} from '../utils/styles';
import { fontWeight } from '@mui/system';


function TenantPropertyView(props) {
    const { property_uid } = useParams();
    const {forPropertyLease} = props;
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
            {forPropertyLease ?
                 ""
                 :
                ( <div>
                    <Header
                        title="Application"
                        leftText="< Back"
                        leftFn={() => navigate("/tenantAvailableProperties")}
                    />
                    <p style={{fontWeight:"bold",textAlign:"center",fontSize:"20px"}}>Let's Start the Application Process</p>
                    </div> )
            }

            <p style={{fontWeight:"bold",textAlign:"left",fontSize:"18px",marginLeft:"50px"}}>Review Property details</p>
            <div style={{padding:"100px",paddingTop:"15px",paddingBottom:"15px"}}>
                {property?
                (<PropertyForm property={property} hideEdit="true"/>)
                :
                ""}
            </div>
            {/* ====================  < Button >==================================== */}
            {forPropertyLease ?
                 ""
                 :
                 (  <Row className="mt-4">
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
                 )
            }
        </div>


    )
}

export default TenantPropertyView;
