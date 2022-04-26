import React, { useState, useContext, useEffect } from "react";
import Header from "../components/Header";
import AppContext from "../AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import TenantPropertyView from "./TenantPropertyView";
import { Row, Col, Button, Container } from "react-bootstrap";
import { bluePillButton, redPillButton } from "../utils/styles";
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
  const [rentPayments0, setRentPayments0] = useState([]);
  // const [rentPayments1, setRentPayments1] = useState([]);
  // const [rentPayments2, setRentPayments2] = useState([]);
  const [lease, setLease] = useState([]);
  const application_uid = location.state.application_uid;
  const application_status_1 = location.state.application_status_1;
  console.log(application_status_1);
  const { setTab } = props;
  const [properties, setProperties] = useState([]);
  const [images, setImages] = useState({});
  const [showLease, setShowLease] = useState("True");

  useEffect(() => {
    const fetchRentals = async () => {
      // const response = await get(`/rentals?property_id=${property_uid}`);
      const response = await get(
        `/leaseTenants?linked_tenant_id=${user.user_uid}`
      );
      console.log(response);

      const filteredRentals = [];
      for (let i = 0; i < response.result.length; i++) {
        if (response.result[i].rental_property_id === property_uid) {
          filteredRentals.push(response.result[i]);
        }
      }
      // filteredRentals = response.result.filter(rental => (rental.rental_property_id === property_uid));
      console.log("required1", filteredRentals);

      // setRentals(response.result);

      if (filteredRentals && filteredRentals.length) {
        const leaseDoc = filteredRentals[0].documents
          ? JSON.parse(filteredRentals[0].documents)
          : [];
        const rentPayments0 = filteredRentals[0].rent_payments
          ? JSON.parse(filteredRentals[0].rent_payments)
          : [];
          console.log("payment0",rentPayments0);

        setLease(leaseDoc);
        setRentPayments0(rentPayments0);
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

  return (
    <div className="h-100 d-flex flex-column">
      {/* ==================< Header >=======================================  */}
      {/* <Header title="Property Lease Details" /> */}
      <Header
        title="Property Lease Details"
        leftText="< Back"
        leftFn={() => navigate("/tenant")}
      />
      {/* ==================< Images properties >=======================================  */}
      {images && images.length ? (
        <img style={{ margin: "20px", padding: "10px" }} src={images[0]} />
      ) : (
        <img style={{ margin: "20px", padding: "10px" }} src={No_Image} />
      )}
      {/* ==================< Property Details >=======================================  */}
      <TenantPropertyView forPropertyLease="true" />
      {/* ==================< Lease Details >=======================================  */}
      {(application_status_1 === "FORWARDED" || application_status_1 === "RENTED") ?
          (<div style={{ marginLeft: "50px" }}>
            <p style={{ fontWeight: "bold", textAlign: "left", fontSize: "18px" }}>
              Lease Details
            </p>
            <Row style={{ marginLeft: "10px" }}>
              <Col>
                <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                  Lease Start Date{" "}
                </Row>
                <Row style={{ paddingLeft: "20px" }}>
                  {" "}
                  {rentals && rentals.length ? rentals[0].lease_start : ""}{" "}
                </Row>
              </Col>
              <Col>
                <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                  Lease End Date{" "}
                </Row>
                <Row style={{ paddingLeft: "20px" }}>
                  {" "}
                  {rentals && rentals.length ? rentals[0].lease_end : ""}
                </Row>
              </Col>
            </Row>
            <Row style={{ marginLeft: "10px",paddingTop: "5px" }}>
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
            </Row>
            {/* <div style={{marginLeft:"20px"}}>
                            <Row style={{paddingLeft:"20px",fontWeight:"bold"}}>Monthly Rent </Row>
                            <Row style={{paddingLeft:"20px"}}> $2000 </Row>
                        </div> */}
           {rentPayments0 && rentPayments0.length ?
            (
            <>
            <div
              style={{
                fontWeight: "bold",
                textAlign: "left",
                fontSize: "18px",
                paddingLeft: "20px",
                marginTop: "20px",
              }}
            >
              Extra charges
            </div>
          <Row style={{ marginLeft: "10px" }}>
            <Col>
              <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
              Fee Name{" "}
              </Row>
              <Row style={{ paddingLeft: "20px" }}>
               1. {rentPayments0[0].fee_name}
                  {" "}
              </Row>
            </Col>
            <Col>
              <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Fee Type{" "}
              </Row>
              <Row style={{ paddingLeft: "20px" }}>
                {" "}
                { rentPayments0[0].fee_type}{" "}
              </Row>
            </Col>
            <Col>
              <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Charges{" "}
              </Row>
              <Row style={{ paddingLeft: "20px" }}>
                {" "}
                {rentPayments0[0].charge}{" "}
              </Row>
            </Col>
            <Col>
              <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Frequency{" "}
              </Row>
              <Row style={{ paddingLeft: "20px" }}>
                {" "}
                {rentPayments0[0].frequency}{" "}
              </Row>
            </Col>
          </Row>
          </>) : ""}


          {rentPayments0[1] && rentPayments0.length ?
          (<>
            <Row style={{ marginLeft: "10px" }}>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Fee Name{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px",paddingTop: "10px"  }}>
                2. { rentPayments0[1].fee_name}{" "}
              </Row>
            </Col>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Fee Type{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px ",paddingTop: "10px" }}>
                {" "}
                {rentPayments0[1].fee_type}{" "}
              </Row>
            </Col>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Charges{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px",paddingTop: "10px"  }}>
                {" "}
                {rentPayments0[1].charge}{" "}
              </Row>
            </Col>
            <Col>
              {/* <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                Frequency{" "}
              </Row> */}
              <Row style={{ paddingLeft: "20px",paddingTop: "10px"  }}>
                {" "}
                {rentPayments0[1].frequency}{" "}
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
        <div style={{ marginLeft: "50px",marginTop:"25px", paddingBottom:"20px"  }}>
            <p style={{ fontWeight: "bold", textAlign: "left", fontSize: "18px" }}>
              Contact
            </p>
            <Row style={{ marginLeft: "10px" }}>
              <Col>
                <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                  Management Name{" "}
                </Row>
                <Row style={{ paddingLeft: "20px" }}>
                  {" "}
                  {properties && properties.length ? properties[0].manager_business_name : ""}{" "}
                </Row>
              </Col>
            </Row>
            <Row style={{ marginLeft: "10px",paddingTop: "10px" }}>
              <Col>
                <Row style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                  Email{" "}
                </Row>
                <Row style={{ paddingLeft: "20px" }}>
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
                      marginLeft: "50px",
                      marginTop: "20px"
                    }}
                  >
                    Lease Documents
                  </p>
                  <h6 style={{ paddingLeft: "70px",paddingBottom:"40px" }}> Property Manager is yet to upload the lease document. Please contact him </h6>
                 
              </>
          )
        :
        (application_status_1 === "REFUSED" || application_status_1 === "NEW") ?
        ""
        :
        ""
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
