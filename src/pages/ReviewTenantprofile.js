import React, { Component } from 'react';
import Header from "../components/Header";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {squareForm, pillButton, bluePillButton, bold} from '../utils/styles';
import AppContext from "../AppContext";


function ReviewTenantProfile (props) {
    const { userData } = React.useContext(AppContext);
    const { user } = userData;
    console.table(user);
    return (
        <div className="h-100 d-flex flex-column">
            <Header
                title="Profile"
                leftText="< Back"
                leftFn={() => {}}
                // leftFn={() => setTab("DASHBOARD")}
                rightText="Edit"
                rightFn={() => { }}
            />
    {/* ========================Personal Details================================================= */}
        <Container>
            <div style={{marginLeft:"20px"}}> 
                 <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>First Name </Row>
                 <Row style={{paddingLeft:"20px"}}> {user.first_name} </Row>
            </div>
            <div style={{marginLeft:"20px"}}> 
                 <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Last Name </Row>
                 <Row style={{paddingLeft:"20px"}}> {user.last_name} </Row>
            </div>
            <Row style={{marginLeft:"10px"}}>
                <Col>
                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Salary </Row>
                    <Row style={{paddingLeft:"20px"}}> 123000 </Row>
                </Col>
                <Col>
                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Frequency </Row>
                    <Row style={{paddingLeft:"20px"}}> Annual </Row>
                </Col>
            </Row>
            <div style={{marginLeft:"20px"}}> 
                 <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Current Job Title </Row>
                 <Row style={{paddingLeft:"20px"}}> {user.last_name} </Row>
            </div>
            <div style={{marginLeft:"20px"}}> 
                 <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Company Name </Row>
                 <Row style={{paddingLeft:"20px"}}> {user.last_name} </Row>
            </div>
            <div style={{marginLeft:"20px"}}> 
                 <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Social Security </Row>
                 <Row style={{paddingLeft:"20px"}}> {user.last_name} </Row>
            </div>
            <Row style={{marginLeft:"10px"}}>
                <Col>
                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Driver's License Number </Row>
                    <Row style={{paddingLeft:"20px"}}> 123000 </Row>
                </Col>
                <Col>
                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>State(licence) </Row>
                    <Row style={{paddingLeft:"20px"}}> Annual </Row>
                </Col>
            </Row>
        </Container>
    {/* ========================Current Address================================================= */}
        <Container style={{marginTop:"40px"}}>
            <div style={{paddingLeft:"20px",fontWeight:"bold"}} >Current Address </div>
            <Row style={{marginLeft:"10px"}}>
                <Col>
                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Street </Row>
                    <Row style={{paddingLeft:"20px"}}> 123000 </Row>
                </Col>
                <Col>
                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Unit </Row>
                    <Row style={{paddingLeft:"20px"}}> Annual </Row>
                </Col>
            </Row>
            <Row style={{marginLeft:"10px"}}>
                <Col>
                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>City </Row>
                    <Row style={{paddingLeft:"20px"}}> 123000 </Row>
                </Col>
                <Col>
                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>State </Row>
                    <Row style={{paddingLeft:"20px"}}> Annual </Row>
                </Col>
            </Row>
            <div style={{marginLeft:"20px"}}> 
                 <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Zip Code </Row>
                 <Row style={{paddingLeft:"20px"}}> {user.last_name} </Row>
            </div>
            <div style={{marginLeft:"20px"}}> 
                 <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Name of the Property Manager </Row>
                 <Row style={{paddingLeft:"20px"}}> {user.last_name} </Row>
            </div>
            <div style={{marginLeft:"20px"}}> 
                 <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Property Manager's Phone Number </Row>
                 <Row style={{paddingLeft:"20px"}}> {user.last_name} </Row>
            </div>
            <Row style={{marginLeft:"10px"}}>
                <Col>
                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Lease Start Date </Row>
                    <Row style={{paddingLeft:"20px"}}> 123000 </Row>
                </Col>
                <Col>
                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Lease End Date </Row>
                    <Row style={{paddingLeft:"20px"}}> Annual </Row>
                </Col>
            </Row>
            <div style={{marginLeft:"20px"}}> 
                 <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Monthly Rent </Row>
                 <Row style={{paddingLeft:"20px"}}> {user.last_name} </Row>
            </div>
        </Container>
    {/* ========================Previous Address details (Optional)================================================= */}
        <Container style={{marginTop:"40px"}}>
                <div style={{paddingLeft:"20px",fontWeight:"bold"}} >Previous Address </div>
                <Row style={{marginLeft:"10px"}}>
                    <Col>
                        <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Street </Row>
                        <Row style={{paddingLeft:"20px"}}> 123000 </Row>
                    </Col>
                    <Col>
                        <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Unit </Row>
                        <Row style={{paddingLeft:"20px"}}> Annual </Row>
                    </Col>
                </Row>
                <Row style={{marginLeft:"10px"}}>
                    <Col>
                        <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>City </Row>
                        <Row style={{paddingLeft:"20px"}}> 123000 </Row>
                    </Col>
                    <Col>
                        <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>State </Row>
                        <Row style={{paddingLeft:"20px"}}> Annual </Row>
                    </Col>
                </Row>
                <div style={{marginLeft:"20px"}}> 
                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Zip Code </Row>
                    <Row style={{paddingLeft:"20px"}}> {user.last_name} </Row>
                </div>
                <div style={{marginLeft:"20px"}}> 
                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Name of the Property Manager </Row>
                    <Row style={{paddingLeft:"20px"}}> {user.last_name} </Row>
                </div>
                <div style={{marginLeft:"20px"}}> 
                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Property Manager's Phone Number </Row>
                    <Row style={{paddingLeft:"20px"}}> {user.last_name} </Row>
                </div>
                <Row style={{marginLeft:"10px"}}>
                    <Col>
                        <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Lease Start Date </Row>
                        <Row style={{paddingLeft:"20px"}}> 123000 </Row>
                    </Col>
                    <Col>
                        <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Lease End Date </Row>
                        <Row style={{paddingLeft:"20px"}}> Annual </Row>
                    </Col>
                </Row>
                <div style={{marginLeft:"20px"}}> 
                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Monthly Rent </Row>
                    <Row style={{paddingLeft:"20px"}}> {user.last_name} </Row>
                </div>
            </Container>
{/* =======================================Send Button================================================ */}
            <Row className="mt-4">
            <Col
                style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                }}
            >
                {" "}
                <Button variant='outline-primary' style={bluePillButton}>Send Application to rent</Button>
            </Col>
            </Row>
        </div>
    )
}
export default ReviewTenantProfile;