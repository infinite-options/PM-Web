import React, { Component } from 'react';
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {squareForm, pillButton, bluePillButton,small, mediumBold} from '../utils/styles';
import AppContext from "../AppContext";
import { get, post } from "../utils/api";
import EditIcon from '../icons/EditIcon.svg';
import DeleteIcon from '../icons/DeleteIcon.svg';


function ReviewTenantProfile (props) {
    const { property_uid } = useParams();
    const { userData } = React.useContext(AppContext);
    const { user,access_token } = userData;
    const navigate = useNavigate();
    const [profile,setProfile] = React.useState(null);
    const [files, setFiles] = React.useState([]);

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
    // const addFile = (e) => {
    //     const file = e.target.files[0];
    //     const newFile = {
    //       name: file.name,
    //       description: '',
    //       file: file
    //     }
    //     setNewFile(newFile);
    //   }
    //   const updateNewFile = (field, value) => {
    //     const newFileCopy = {...newFile};
    //     newFileCopy[field] = value;
    //     setNewFile(newFileCopy);
    //   }
    //   const cancelEdit = () => {
    //     setNewFile(null);
    //     if (editingDoc !== null) {
    //       const newFiles = [...files];
    //       newFiles.push(editingDoc);
    //       setFiles(newFiles);
    //     }
    //     setEditingDoc(null);
    //   }
      const editDocument = (i) => {
        // const newFiles = [...files];
        // const file = newFiles.splice(i, 1)[0];
        // setFiles(newFiles);
        // setEditingDoc(file);
        // setNewFile({...file});
      }
    //   const saveNewFile = (e) => {
    //     // copied from addFile, change e.target.files to state.newFile
    //     const newFiles = [...files];
    //     newFiles.push(newFile);
    //     setFiles(newFiles);
    //     setNewFile(null);
    //   }
      const deleteDocument = (i) => {
        const newFiles = [...files];
        newFiles.splice(i, 1);
        setFiles(newFiles);
      }
    React.useEffect(() => {

        const fetchProfileInfo = async () => {
          const response = await get("/tenantProfileInfo", access_token);
          console.log(response);
          if (response.result && response.result.length !== 0) {
                const res = response.result[0];

                const currentAdd = JSON.parse(res.tenant_current_address);
                const previousAdd = JSON.parse(res.tenant_previous_address);
                res.tenant_current_address = currentAdd;
                res.tenant_previous_address = previousAdd;

                setProfile(res);
                const documents = response.result[0].documents? (JSON.parse(response.result[0].documents)) : [];
                setFiles(documents);
                return;
          }
          if (user.role.indexOf("TENANT") === -1) {
            console.log("no tenant profile");
            props.onConfirm();
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
                rightFn={() => {navigate(`/tenantProfile`) }}
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
{/* =======================================Documents display================================================ */}
     <div style={{marginTop:"40px",paddingLeft:"20px",fontWeight:"bold"}} > Documents</div>
     
      <Container fluid>
        <div className='mb-4'>
        {files.map((file, i) => (
            <div key={i}>
              <div className='d-flex justify-content-between align-items-end'>
                <div>
                  <h6 style={{paddingLeft:"20px",fontWeight:"bold"}}>
                    {file.name}
                  </h6>
                  <p style={{paddingLeft:"20px"}} className='m-0'>
                    {file.description}
                  </p>
                </div>
                {/* <div>
                  <img src={EditIcon} alt='Edit' className='px-1 mx-2'
                    onClick={() => editDocument(i)}/>
                  <img src={DeleteIcon} alt='Delete' className='px-1 mx-2'
                    onClick={() => deleteDocument(i)}/>
                  <a href={file.link} target='_blank'>
                    <img src={File}/>
                  </a>
                </div> */}
              </div>
              <hr style={{opacity: 1}}/>
            </div>
          ))}
          </div>
       </Container>   
{/* =======================================Application Message================================================ */}

            <Container fluid>
              <Form.Group className='mx-2 my-3'>
                <Form.Label as='h6' className='mb-0 ms-2'>
                  Application Message
                </Form.Label>
                <Form.Control style={squareForm} placeholder='Message'
                  value={message} onChange={(e) => setMessage(e.target.value)}/>
              </Form.Group>
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
                <Button variant='outline-primary' style={bluePillButton} onClick={apply}>Send Application to rent</Button>
            </Col>
            </Row>
        </div>

    )
}
export default ReviewTenantProfile;
