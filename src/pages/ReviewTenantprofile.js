import React, { Component } from 'react';
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {squareForm, pillButton, bluePillButton, bold} from '../utils/styles';
import AppContext from "../AppContext";
import { get, post } from "../utils/api";


function ReviewTenantProfile (props) {
    const { property_uid } = useParams();
    const { userData } = React.useContext(AppContext);
    const { user,access_token } = userData;
    const navigate = useNavigate();
    const [profile,setProfile] = React.useState(null);
    const goToPropertyView = () => {
        navigate(`/tenantPropertyView/${property_uid}`)
    }
    const goToShowApplied = () => {
        navigate('/applyToProperty')
    }

    const [message, setMessage] = React.useState('');
    const apply = async () => {
      const newApplication = {
        'property_uid': property_uid,
        'message': message
      }
      const response = await post('/applications', newApplication, access_token);
      goToShowApplied();
    }

    React.useEffect(() => {

        const fetchProfileInfo = async () => {
          const response = await get("/tenantProfileInfo", access_token);
          if (response.result && response.result.length !== 0) {
            const res = response.result[0];
            const currentAdd = JSON.parse(res.tenant_current_address);
            const previousAdd = JSON.parse(res.tenant_previous_address);
            res.tenant_current_address = currentAdd;
            res.tenant_previous_address = previousAdd;

            setProfile(res);
            return;
          }
        };
        fetchProfileInfo();
      }, []);

    return (

        <div className="h-100 d-flex flex-column">
            <Header
                title="Profile"
                leftText="< Back"
                leftFn={goToPropertyView}
                rightText="Edit"
               // rightFn={() => {navigate(`/tenantProfile/${profile.tenant_id}`) }}
            //    rightFn ={() => setTab("PROFILE")}
            />
            {profile ? (<div>
                <div>
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
                            <Row style={{paddingLeft:"20px"}}> {profile.tenant_current_salary} </Row>
                        </Col>
                        <Col>
                            <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Frequency </Row>
                            <Row style={{paddingLeft:"20px"}}> {profile.tenant_salary_frequency} </Row>
                        </Col>
                    </Row>
                    <div style={{marginLeft:"20px"}}>
                        <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Current Job Title </Row>
                        <Row style={{paddingLeft:"20px"}}> {profile.tenant_current_job_title} </Row>
                    </div>
                    <div style={{marginLeft:"20px"}}>
                        <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Company Name </Row>
                        <Row style={{paddingLeft:"20px"}}> {profile.tenant_current_job_company} </Row>
                    </div>
                    <div style={{marginLeft:"20px"}}>
                        <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Social Security </Row>
                        <Row style={{paddingLeft:"20px"}}> {profile.tenant_ssn} </Row>
                    </div>
                    <Row style={{marginLeft:"10px"}}>
                        <Col>
                            <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Driver's License Number </Row>
                            <Row style={{paddingLeft:"20px"}}> {profile.tenant_drivers_license_number} </Row>
                        </Col>
                        <Col>
                            <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>State(licence) </Row>
                            <Row style={{paddingLeft:"20px"}}> {profile.tenant_drivers_license_state} </Row>
                        </Col>
                    </Row>
                </div>
                {/* ======================  <Current Address> ======================================== */}
                <div style={{marginTop:"40px"}}>
                    <div style={{paddingLeft:"20px",fontWeight:"bold"}} >Current Address </div>
                    <Row style={{marginLeft:"10px"}}>
                        <Col>
                            <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Street </Row>
                            <Row style={{paddingLeft:"20px"}}> {profile.tenant_current_address.street} </Row>
                        </Col>
                        <Col>
                            <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Unit </Row>
                            <Row style={{paddingLeft:"20px"}}> {profile.tenant_current_address.unit} </Row>
                        </Col>
                    </Row>
                    <Row style={{marginLeft:"10px"}}>
                        <Col>
                            <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>City </Row>
                            <Row style={{paddingLeft:"20px"}}> {profile.tenant_current_address.city} </Row>
                        </Col>
                        <Col>
                            <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>State </Row>
                            <Row style={{paddingLeft:"20px"}}> {profile.tenant_current_address.state} </Row>
                        </Col>
                    </Row>
                    <div style={{marginLeft:"20px"}}>
                        <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Zip Code </Row>
                        <Row style={{paddingLeft:"20px"}}> {profile.tenant_current_address.zip} </Row>
                    </div>

                    { profile.tenant_current_address.pm_name ?
                    (<div>
                        <div style={{marginLeft:"20px"}}>
                            <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Name of the Property Manager </Row>
                            <Row style={{paddingLeft:"20px"}}> {profile.tenant_current_address.pm_name} </Row>
                        </div>
                        <div style={{marginLeft:"20px"}}>
                            <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Property Manager's Phone Number </Row>
                            <Row style={{paddingLeft:"20px"}}> {profile.tenant_current_address.pm_number} </Row>
                        </div>
                        <Row style={{marginLeft:"10px"}}>
                            <Col>
                                <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Lease Start Date </Row>
                                <Row style={{paddingLeft:"20px"}}> {profile.tenant_current_address.lease_start} </Row>
                            </Col>
                            <Col>
                                <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Lease End Date </Row>
                                <Row style={{paddingLeft:"20px"}}> {profile.tenant_current_address.lease_end} </Row>
                            </Col>
                        </Row>
                        <div style={{marginLeft:"20px"}}>
                            <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Monthly Rent </Row>
                            <Row style={{paddingLeft:"20px"}}> {profile.tenant_current_address.rent} </Row>
                        </div>
                    </div> ) : ("")}
                </div>
                {/* =============================== <Previous Address> ==================================== */}
                {profile.tenant_previous_address ?
                    (<div style={{marginTop:"40px"}}>
                            <div style={{paddingLeft:"20px",fontWeight:"bold"}} >Previous Address </div>
                            <Row style={{marginLeft:"10px"}}>
                                <Col>
                                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Street </Row>
                                    <Row style={{paddingLeft:"20px"}}> {profile.tenant_previous_address.street} </Row>
                                </Col>
                                <Col>
                                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Unit </Row>
                                    <Row style={{paddingLeft:"20px"}}> {profile.tenant_previous_address.unit} </Row>
                                </Col>
                            </Row>
                            <Row style={{marginLeft:"10px"}}>
                                <Col>
                                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>City </Row>
                                    <Row style={{paddingLeft:"20px"}}> {profile.tenant_previous_address.city} </Row>
                                </Col>
                                <Col>
                                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>State </Row>
                                    <Row style={{paddingLeft:"20px"}}> {profile.tenant_previous_address.state} </Row>
                                </Col>
                            </Row>
                            <div style={{marginLeft:"20px"}}>
                                <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Zip Code </Row>
                                <Row style={{paddingLeft:"20px"}}> {profile.tenant_previous_address.zip} </Row>
                            </div>
                            <div style={{marginLeft:"20px"}}>
                                <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Name of the Property Manager </Row>
                                <Row style={{paddingLeft:"20px"}}> {profile.tenant_previous_address.pm_name} </Row>
                            </div>
                            <div style={{marginLeft:"20px"}}>
                                <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Property Manager's Phone Number </Row>
                                <Row style={{paddingLeft:"20px"}}> {profile.tenant_previous_address.pm_number} </Row>
                            </div>
                            <Row style={{marginLeft:"10px"}}>
                                <Col>
                                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Lease Start Date </Row>
                                    <Row style={{paddingLeft:"20px"}}> {profile.tenant_previous_address.lease_start} </Row>
                                </Col>
                                <Col>
                                    <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Lease End Date </Row>
                                    <Row style={{paddingLeft:"20px"}}> {profile.tenant_previous_address.lease_end} </Row>
                                </Col>
                            </Row>
                            <div style={{marginLeft:"20px"}}>
                                <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Monthly Rent </Row>
                                <Row style={{paddingLeft:"20px"}}> {profile.tenant_previous_address.rent} </Row>
                            </div>
                        </div>) : ""}
               </div> ) : ""}
{/* =======================================Send Button================================================ */}

            <Container fluid>
              <Form.Group className='mx-2 my-3'>
                <Form.Label as='h6' className='mb-0 ms-2'>
                  Application Message
                </Form.Label>
                <Form.Control style={squareForm} placeholder='Message'
                  value={message} onChange={(e) => setMessage(e.target.value)}/>
              </Form.Group>
            </Container>


            <Row className="mt-4">
            <Col
                style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                }}
            >
                {" "}
                <Button variant='outline-primary' style={bluePillButton} onClick={apply}>Send Application to rent</Button>
            </Col>
            </Row>
        </div>

    )
}
export default ReviewTenantProfile;
