import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import PropertyForm from '../components/PropertyForm';
import { get } from "../utils/api";
import { Row, Col, Button, Carousel, Image} from "react-bootstrap";
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
    console.log("tenantPropertyView");
    return(
        <div className=" d-flex flex-column">
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
            {property && JSON.parse(property.images).length > 0 ?
              <Carousel
                interval={null}
                prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon"/>}
                style={{ color: 'black', opacity: '1' }}
                nextIcon={<span aria-hidden="true" style={{ color: 'black' }} className="carousel-control-next-icon"/>}
              >
                {JSON.parse(property.images).map((img, i) => {
              return <Carousel.Item key={i}>
                    <Image
                        src={img}
                        style={{
                        margin: '0px 5% 0px 5%',
                        objectFit: "cover",
                        width: "90%",
                        height: " 198px",
                        border: "1px solid #C4C4C4",
                        borderRadius: "5px",
                        }}
                        alt="repair"
                    />
                </Carousel.Item>;
            })}   
              </Carousel> : null}
            <p style={{fontWeight:"bold",textAlign:"left",fontSize:"24px",marginLeft:"25px"}}><u>Review Property Details:</u></p>
            <div style={{padding: "40px",paddingTop:"15px",paddingBottom:"15px"}}>
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
                            justifyent: "space-evenly",
                            marginBottom:"25px"
                            }}
                        >
                            {" "}
                            <Button
                                onClick={() => navigate(`/reviewTenantProfile/${property_uid}`)}
                                variant='outline-primary'
                                style={{...bluePillButton, margin: '0 24%'}}>
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
