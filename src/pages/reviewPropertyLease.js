import React, { useState, useContext, useEffect } from "react";
import Header from "../components/Header";
import AppContext from "../AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import TenantPropertyView from "./TenantPropertyView";
import { Row, Col, Button, Container, Carousel, Image} from "react-bootstrap";
import { bluePillButton, greenPill, redPillButton } from "../utils/styles";
import { get, put } from "../utils/api";
import No_Image from "../icons/No_Image_Available.jpeg";

function ReviewPropertyLease(props) {
  const context = useContext(AppContext);
  const { userData } = context;
  const { access_token, user } = userData;

  const { property_uid } = useParams();
  console.log(property_uid);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [rentals, setRentals] = useState([]);
  const [rentPayments, setRentPayments] = useState([]);
  const [lease, setLease] = useState([]);
  const application_uid = location.state.application_uid;
  const application_status_1 = location.state.application_status_1;
  console.log(application_status_1);
  const { setTab } = props;
  const [properties, setProperties] = useState([]);
  const [images, setImages] = useState({});
  const [showLease, setShowLease] = useState("True");
  const [endLeaseMessage, setEndLeaseMessage] = useState("No message has been set by Tenant.");
  const pmMessage = location.state.message;

  useEffect(() => {
    const fetchRentals = async () => {
      const response = await get( `/leaseTenants?linked_tenant_id=${user.user_uid}` );
      console.log("rentals", response);

      const filteredRentals = [];
      for (let i = 0; i < response.result.length; i++) {
        if (response.result[i].rental_property_id === property_uid) {
          //Should always be no larger than size of 1
          filteredRentals.push(response.result[i]);
        }
      }
      console.log("required1", filteredRentals);

      if (filteredRentals && filteredRentals.length) {
        const leaseDoc = filteredRentals[0].documents
          ? JSON.parse(filteredRentals[0].documents)
          : [];
        const rentPayments = filteredRentals[0].rent_payments
          ? JSON.parse(filteredRentals[0].rent_payments)
          : [];
          console.log("payment0",rentPayments);

        setLease(leaseDoc);
        setRentPayments(rentPayments);
        // setRentPayments2(rentPayments2);
      }
      setRentals(filteredRentals);
    };

      if(!rentals){
       setShowLease("false");
      }
    fetchRentals();
  }, [user]);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await get(`/propertyInfo?property_uid=${property_uid}`);
      console.log(response);
      const imageParsed = response.result.length
        ? JSON.parse(response.result[0].images)
        : [];
      setImages(imageParsed);
      setProperties(response.result);
    };
    fetchProperties();
  }, [property_uid]);

  const approveLease = async () => {
    // const updatedRental = {
    //     // rental_uid: filteredRentals[0].rental_uid,
    //     rental_uid: rentals[0].rental_uid,
    //     rental_status: 'ACTIVE'
    // }
    // const response1 = await put('/rentals', updatedRental , null, []);

    const updatedApplication = {
      application_uid: application_uid,
      application_status: "RENTED",
      property_uid: property_uid,
    };
    const response2 = await put(
      "/applications",
      updatedApplication,
      access_token
    );

    navigate("/tenant");
  };

  const displayLease = (path) => {
      window.location.href = path;
  }

  const extendLease = async () => {
    console.log("Extending Lease");
    const extendObject = {
      "application_uid":application_uid,
      "application_status": "LEASE EXTENSION",
      "property_uid": rentals[0].rental_property_id, 
      "message": "requesting EXTENSION",
    }
    const response6 = await put("/extendLease", extendObject, access_token);
    console.log(response6.result);
    navigate("/tenant");
  }
  const endLeaseEarly = async () => {
    console.log("ending lease early");
    const currentMonth = new Date().getMonth() + 1;
    const currentDay = new Date().getDate();
    const currentYear = new Date().getFullYear();
    let endDate = `${currentYear}-${currentMonth}-${currentDay}`
    const updatedRental = {
      "application_uid":application_uid,
      "application_status":"TENANT END EARLY",
      "property_uid": rentals[0].rental_property_id,
      "early_end_date": endDate,
      "message": endLeaseMessage,
    }
    console.log(updatedRental);
    const response3 = await put("/endEarly", updatedRental, access_token);
    console.log(response3.result);
    navigate("/tenant");
  }
  const approveEndEarly = async () => {
    console.log("Approved end lease early.");
    const updatedApprove = {
      "application_uid":application_uid,
      "application_status":"TENANT ENDED",
      "property_uid": rentals[0].rental_property_id,
    }
    const response4 = await put("/endEarly", updatedApprove, access_token);
    console.log(response4.result);
    navigate("/tenant");
  }
  const denyEndEarly = async() => {
    console.log("Deny end lease early.");
    const updatedApprove = {
      "application_status":"REFUSED",
      "property_uid": rentals[0].rental_property_id,
    }
    const response5 = await put("/endEarly", updatedApprove, access_token);
    console.log(response5.result);
    navigate("/tenant");
  }
  const rejectLease = async () => {
    // const updatedRental = {
    //   // rental_uid: filteredRentals[0].rental_uid,
    //   rental_uid: rentals[0].rental_uid,
    //   rental_status: "REFUSED",
    // };
    // const response = await put("/rentals", updatedRental, null, []);
    const updatedApplication = {
      application_uid: application_uid,
      application_status: "REFUSED",
      property_uid: property_uid,
    };
    const response2 = await put(
      "/applications",
      updatedApplication,
      access_token
    );
    navigate("/tenant");
  };
  const fromPage = "homePage";
  const goToApplyToProperty = () => {
    // navigate(`/tenantPropertyView/${property_uid}`,{ state: {from: "homePage"}})
    navigate(`/tenantPropertyView/${property_uid}`,{state:{fromPage: fromPage}})
  }
  console.log('reviewPropertyLease');
  return (
    <div className="h-100 d-flex flex-column">
      {/* ==================< Header >=======================================  */}
      {/* <Header title="Property Lease Details" /> */}
      <Header
        title="Property Lease Details"
        leftText="< Back"
        leftFn={() => navigate("/tenant")}
      />
      
      {/* ==================< Property Details >=======================================  */}
      <TenantPropertyView forPropertyLease="true" />
      {/* ==================< Lease Details >=======================================  */}
      {(application_status_1 === "FORWARDED" || application_status_1 === "RENTED") ?
          (<div style={{ marginLeft: "20px" }}>
            <p style={{ fontWeight: "bold", textAlign: "left", fontSize: "24px" }}>
              <u>Lease Details:</u>
            </p>
            <Row style={{ marginLeft: "10px" }}>
              <Col>
                <Row style={{ paddingLeft: "15px", fontWeight: "bold" }}>
                  Lease Start Date{" "}
                </Row>
                <Row style={{ paddingLeft: "15px" }}>
                  {" "}
                  {rentals && rentals.length ? rentals[0].lease_start : ""}{" "}
                </Row>
              </Col>
              <Col>
                <Row style={{ paddingLeft: "15px", fontWeight: "bold" }}>
                  Lease End Date{" "}
                </Row>
                <Row style={{ paddingLeft: "15px" }}>
                  {" "}
                  {rentals && rentals.length ? rentals[0].lease_end : ""}
                </Row>
              </Col>
            </Row>
            {/* <Row style={{ marginLeft: "10px",paddingTop: "5px" }}>
              <Col>
                <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                  Monthly Rent{" "}
                </Row>
                <Row style={{ paddingLeft: "20px" }}>
                  {" "}
                  $ {properties && properties.length ? properties[0].listed_rent : ""}
                </Row>
              </Col>
              <Col>
                <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                   Deposit {" "}
                </Row>
                <Row style={{ paddingLeft: "20px" }}>
                  {" "}
                  $ {properties && properties.length ? properties[0].deposit : ""}
                </Row>
              </Col>
            </Row> */}
            {/* <div style={{marginLeft:"20px"}}>
                            <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Monthly Rent </Row>
                            <Row style={{paddingLeft:"20px"}}> $2000 </Row>
                        </div> */}
{/* 
          {rentPayments && rentPayments.length ?
            (
                <Row style={{ marginLeft: "10px" }}>
                      <Col>
                        <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                        Fee Name{" "}
                        </Row>
                      </Col>
                      <Col>
                        <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                          Fee Type{" "}
                        </Row>
                      </Col>
                      <Col>
                        <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                          Charges{" "}
                        </Row>
                      </Col>
                      <Col>
                        <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                          Frequency{" "}
                        </Row>
                      </Col>
                </Row>)
              
                (rentPayments.map((rentPayment, i ) => (
                
                    <Row style={{ marginLeft: "10px" }}>
                      <Col>
                        <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                        Fee Name{" "}
                        </Row>
                        <Row style={{ paddingLeft: "20px" }}>
                        {i+1}. {rentPayment.fee_name}
                            {" "}
                        </Row>
                      </Col>
                      <Col>
                        <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                          Fee Type{" "}
                        </Row>
                        <Row style={{ paddingLeft: "20px" }}>
                          {" "}
                          { rentPayment.fee_type}{" "}
                        </Row>
                      </Col>
                      <Col>
                        <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                          Charges{" "}
                        </Row>
                        <Row style={{ paddingLeft: "20px" }}>
                          {" "}
                          {rentPayment.charge}{" "}
                        </Row>
                      </Col>
                      <Col>
                        <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                          Frequency{" "}
                        </Row>
                        <Row style={{ paddingLeft: "20px" }}>
                          {" "}
                          {rentPayment.frequency}{" "}
                        </Row>
                      </Col>
                    </Row>
                )))
             : 
             ""
             } */}

           {rentPayments && rentPayments.length ?
            (
            <>
            <div
              style={{
                fontWeight: "bold",
                textAlign: "left",
                fontSize: "18px",
                paddingLeft: "25px",
                marginTop: "20px",
              }}
            >
              <u>Charges:</u>
            </div>
          <Row style={{ marginLeft: "10px" }}>
            <Col>
              <Row style={{ paddingLeft: "15px", fontWeight: "bold" }}>
              Fee Name{" "}
              </Row>
              <Row style={{ paddingLeft: "20px" }}>
               1. {rentPayments[0].fee_name}
                  {" "}
              </Row>
            </Col>
            <Col>
              <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Fee Type{" "}
              </Row>
              <Row style={{ paddingLeft: "20px" }}>
                {" "}
                { rentPayments[0].fee_type}{" "}
              </Row>
            </Col>
            <Col>
              <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Charges{" "}
              </Row>
              <Row style={{ paddingLeft: "20px" }}>
                {" "}
                {rentPayments[0].charge}{" "}
              </Row>
            </Col>
            <Col>
              <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Frequency{" "}
              </Row>
              <Row style={{ paddingLeft: "20px" }}>
                {" "}
                {rentPayments[0].frequency}{" "}
              </Row>
            </Col>
          </Row>
          </>) : ""}


          {rentPayments[1] && rentPayments.length ?
          (<>
            <Row style={{ marginLeft: "10px" }}>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Fee Name{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px",paddingTop: "10px"  }}>
                2. { rentPayments[1].fee_name}{" "}
              </Row>
            </Col>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Fee Type{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px ",paddingTop: "10px" }}>
                {" "}
                {rentPayments[1].fee_type}{" "}
              </Row>
            </Col>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Charges{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px",paddingTop: "10px"  }}>
                {" "}
                {rentPayments[1].charge}{" "}
              </Row>
            </Col>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Frequency{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px",paddingTop: "10px"  }}>
                {" "}
                {rentPayments[1].frequency}{" "}
              </Row>
            </Col>

          </Row>
          </>) : ""}

          {rentPayments[2] && rentPayments.length ?
          (<>
            <Row style={{ marginLeft: "10px" }}>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Fee Name{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px",paddingTop: "10px"  }}>
                3. { rentPayments[2].fee_name}{" "}
              </Row>
            </Col>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Fee Type{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px ",paddingTop: "10px" }}>
                {" "}
                {rentPayments[2].fee_type}{" "}
              </Row>
            </Col>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Charges{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px",paddingTop: "10px"  }}>
                {" "}
                {rentPayments[2].charge}{" "}
              </Row>
            </Col>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Frequency{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px",paddingTop: "10px"  }}>
                {" "}
                {rentPayments[2].frequency}{" "}
              </Row>
            </Col>

          </Row>
          </>) : ""}

          {rentPayments[3] && rentPayments.length ?
          (<>
            <Row style={{ marginLeft: "10px" }}>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Fee Name{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px",paddingTop: "10px"  }}>
                4. { rentPayments[3].fee_name}{" "}
              </Row>
            </Col>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Fee Type{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px ",paddingTop: "10px" }}>
                {" "}
                {rentPayments[3].fee_type}{" "}
              </Row>
            </Col>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Charges{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px",paddingTop: "10px"  }}>
                {" "}
                {rentPayments[3].charge}{" "}
              </Row>
            </Col>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Frequency{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px",paddingTop: "10px"  }}>
                {" "}
                {rentPayments[3].frequency}{" "}
              </Row>
            </Col>

          </Row>
          </>) : ""}

        </div>)
       :
       ""
      }
      
      {/* ===============Manager Contact =================================== */}
      { (application_status_1 === "FORWARDED" || application_status_1 === "RENTED") ?
      (
        <div style={{ marginLeft: "45px", marginTop:"25px", paddingBottom:"20px"  }}>
            <p style={{ fontWeight: "bold", textAlign: "left", fontSize: "18px" }}>
              <u>Contact:</u>
            </p>
            <Row style={{ marginLeft: "0px" }}>
              <Col>
                <Row style={{ paddingLeft: "0px", fontWeight: "bold" }}>
                  Management Name{" "}
                </Row>
                <Row style={{ paddingLeft: "0px" }}>
                  {" "}
                  {properties && properties.length ? properties[0].manager_business_name : ""}{" "}
                </Row>
              </Col>
            </Row>
            <Row style={{ marginLeft: "0px",paddingTop: "10px" }}>
              <Col>
                <Row style={{ paddingLeft: "0px", fontWeight: "bold" }}>
                  Email{" "}
                </Row>
                <Row style={{ paddingLeft: "0px" }}>
                  {" "}
                  {properties && properties.length ? properties[0].manager_email : ""}{" "}
                </Row>
              </Col>
              <Col>
                <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                  Phone Number{" "}
                </Row>
                <Row style={{ paddingLeft: "20px" }}>
                  {" "}
                  {properties && properties.length ? properties[0].manager_phone_number : ""}{" "}
                </Row>
              </Col>
              </Row>
        </div>
      )
      :
      ""
      }
      {/* ==================< Lease Documents >=======================================  */}
      {(application_status_1 === "FORWARDED" || application_status_1 === "RENTED") && lease.length ?
        (
            <div>
              <p
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  fontSize: "18px",
                  marginLeft: "50px",
                  marginTop: "20px",
                }}
              >
                Lease Documents
              </p>

              {/* <div style={{marginTop:"40px",paddingLeft:"20px",fontWeight:"bold"}} > Documents</div> */}

              <Container fluid>
                <div
                  className="mb-4"
                  style={{
                    textAlign: "left",
                    fontSize: "18px",
                    paddingLeft: "50px",
                    marginTop: "20px",
                  }}
                >
                  {lease.map((lease, i) => (
                    <div key={i}>
                      <div className="d-flex justify-content-between align-items-end">
                        <div style={{display:"flex",width:"85%"}}>
                          <div style={{display: "flex", flexDirection: "column"}}>
                          <div
                            
                            style={{ paddingLeft: "20px" }}
                            target="_blank"
                          >
                            {" "}
                            {lease.name}{" "}
                          </div>
                          {/* <h6 style={{paddingLeft:"20px",fontWeight:"bold"}}>
                                          {lease.name}
                                      </h6> */}
                          <p style={{ paddingLeft: "20px" }} className="m-0">
                            {lease.description}
                          </p>
                          {/* <a href={lease.link} style={{paddingLeft:"20px"}}> {lease.name} </a> */}
                        </div>
                        <Button style={{marginLeft: "auto"}} onClick={() => displayLease(lease.link)}>View</Button>
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
                      <hr style={{ opacity: 1 }} />
                    </div>
                  ))}
                </div>
              </Container>
            </div>
          ) 
         :
         (application_status_1 === "FORWARDED" || application_status_1 === "RENTED") && !lease.length ?
          (
              <>
                  <p
                    style={{
                      fontWeight: "bold",
                      textAlign: "left",
                      fontSize: "18px",
                      marginLeft: "45px",
                      marginTop: "20px"
                    }}
                  >
                    <u>Lease Documents:</u>
                  </p>
                  <h6 style={{ paddingLeft: "45px",paddingBottom:"30px" }}> Property Manager is yet to upload the lease document. Please contact him </h6>
                 
              </>
          )
        :
        (application_status_1 === "REFUSED" || application_status_1 === "NEW") ?
        ""
        :
        ""
      }

      {/* ========= Extend Lease Stuff ========= */}
      {application_status_1 === "RENTED" ? 
      <Col>
        <p
          style={{
            fontWeight: "bold",
            textAlign: "left",
            fontSize: "24px",
            marginLeft: "20px",
          }}
        >
          <u>Extend Lease:</u>
        </p>
        <p
        style={{
          fontWeight: "bold",
          textAlign: "left",
          fontSize: "14px",
          marginLeft: "40px",
          marginRight: '20px'
        }}>
          Option to extend your current lease. Will require approval from your property manager.
        </p>
        <Col
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            paddingBottom: '15px'
        }}
        >
          <Button 
            style={{
              backgroundColor: "#3DB727",
              borderColor: "#3DB727",
              color: "white",
              fontSize: "large",
              borderRadius: "50px",
              padding: "2px 7px",
            }}
            onClick={extendLease}
          >Extend Lease</Button>
        </Col>
        
      </Col>
      : null}
      {/* ========== End Lease Early Button ========== */}
      {application_status_1 === "RENTED" ? 
      <Col>
        <p
          style={{
            fontWeight: "bold",
            textAlign: "left",
            fontSize: "24px",
            marginLeft: "20px",
          }}
        >
          <u>End Lease Early:</u>
        </p>
        <p
        style={{
          fontWeight: "bold",
          textAlign: "left",
          fontSize: "14px",
          marginLeft: "40px",
          marginRight: '20px'
        }}>
          Please leave a short message dicussing why you wish to end the lease early.
        </p>
        <input 
          type="text" 
          style={{width: '80%', margin: '0% 10% 5% 10%'}} 
          onChange={(e)=>{
            setEndLeaseMessage(e.target.value);
          }}
          >

        </input>
      </Col> : null
      }
      {application_status_1 === "RENTED" ? 
        <Col
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            paddingBottom: '15px'
        }}
        >
          <Button 
            style={redPillButton}
            onClick={endLeaseEarly}
          >End Lease</Button>
        </Col> : null
      }
      {/* ========== Property Manager requests lease end early ========== */}
      {application_status_1 === "PM END EARLY" ? 
        <Row>
          <b
            style={{padding: '0px 40px 0px 40px', fontSize: '22px'}}>
              <u>Action Needed: Approve/Deny</u>
          </b>
          <Row
            className="my-3 mx-2"
            style={{padding: '0px 40px 0px 40px', fontSize: '22px'}}
          >
            
            <p style={{fontSize: '16px'}}>The Property Manager has requested to terminate this lease early and has left a message:</p>
            <p style={{fontSize: '16px'}}>{pmMessage}</p>
            
          </Row>
          <Row
            style={{
              margin: "0px",
              padding: "0px 0px 25px 0px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              paddingBottom: '20px'
            }}
            >
            <Button 
              style={{...bluePillButton, width: "90px", textAlign: 'center'}}
              onClick={approveEndEarly}
            >
              Approve
            </Button>
            <Button
              style={{...redPillButton, width: "90px", textAlign: 'center'}}
              onClick={denyEndEarly}
            >
              Deny
            </Button>
          </Row>
        </Row>: null
      }
      {/* ========== Tenant has requested to end the lease early ==========
      {application_status_1 === "TENANT END EARLY" ? 
        <Row>
          <Row
            className="my-3 mx-2"
            style={{padding: '0px 40px 0px 40px', fontSize: '22px'}}
          >
            <b>Action Needed: Approve/Deny</b>
            <p style={{fontSize: '16px'}}>The Property Manager has requested to terminate this lease early</p>
          </Row>
          <Row
            style={{
              margin: "0px",
              padding: "0px 0px 25px 0px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              paddingBottom: '20px'
            }}
            >
            <Button 
              style={{...bluePillButton, width: "90px", textAlign: 'center'}}
              onClick={approveEndEarly}
            >
              Approve
            </Button>
            <Button
              style={{...redPillButton, width: "90px", textAlign: 'center'}}
              onClick={denyEndEarly}
            >
              Deny
            </Button>
          </Row>
        </Row>: null
      } */}

      {rentals.length > 0 && rentals[0].rental_status !== "ACTIVE" && rentals[0].early_end_date !== null ? 
        <Row>
            <Row
              className="my-3 mx-2"
              style={{padding: '0px 40px 0px 40px', fontSize: '22px'}}
            >
              <b>Announcement:</b>
              <p style={{fontSize: '16px'}}>This property is set to have its lease ended on {rentals[0].early_end_date}</p>
            </Row>
        </Row>: null
      }

      {rentals.length > 0 && rentals[0].rental_status === "ACTIVE" && rentals[0].early_end_date !== null ? 
        <Row>
            <Row
              className="my-3 mx-2"
              style={{padding: '0px 40px 0px 40px', fontSize: '22px'}}
            >
              <b>Announcement:</b>
              <p style={{fontSize: '16px'}}>The tenant has requested a lease termination effective on {rentals[0].early_end_date}</p>
            </Row>
        </Row>: null
      }

      {/* ==================< Approval|Disapprove buttons >=======================================  */}
      <Row className="mt-4">
        {application_status_1 === "FORWARDED" ? (
          <Col
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginBottom: "25px",
            }}
          >
            {" "}
            <Button
              onClick={approveLease}
              variant="outline-primary"
              style={bluePillButton}
            >
              Approve
            </Button>
          </Col>
        ) : (
          ""
        )}

        {application_status_1 === "FORWARDED" ||
        application_status_1 === "NEW" ? (
          <Col
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginBottom: "25px",
            }}
          >
            {" "}
            <Button
              onClick={rejectLease}
              variant="outline-primary"
              style={redPillButton}
            >
              Reject
            </Button>
          </Col>
        ) : (
          ""
        )}

      {application_status_1 === "REFUSED" ?
        (
          <Col
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginBottom: "25px",
            }}
          >
            {" "}
            <Button
              onClick={goToApplyToProperty}
              variant="outline-primary"
              style={bluePillButton}
            >
              Reapply
            </Button>
          </Col>
        ) : (
          ""
        )}
      </Row>
    </div>
  );
}

export default ReviewPropertyLease;
