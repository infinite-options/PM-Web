import React, { useState, useEffect, useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CreateInsurance from "../components/CreateInsurance";
import CreateExpense from "../components/CreateExpense";
import CreateTax from "../components/CreateTax";
import CreateMortgage from "../components/CreateMortgage";
import ManagerTenantApplications from "../components/ManagerTenantApplications";
import ManagerTenantProfileView from "./ManagerTenantProfileView";
import PropertyManagerDocs from "../components/PropertyManagerDocs";
import AppContext from "../AppContext";
import ManagerManagementContract from "../components/ManagerManagementContract";
import ManagerTenantAgreementView from "./ManagerTenantAgreementView";
import PropertyCashFlow from "../components/PropertyCashFlow";
import ManagerRentalHistory from "../components/ManagerRentalHistory";
import ManagerPropertyForm from "../components/ManagerPropertyForm";
import ManagerTenantAgreement from "./ManagerTenantAgreement";
import BlueArrowUp from "../icons/BlueArrowUp.svg";
import BlueArrowDown from "../icons/BlueArrowDown.svg";
import BlueArrowRight from "../icons/BlueArrowRight.svg";

import No_Image from "../icons/No_Image_Available.jpeg";
import Repair from "../icons/Repair.svg";
import {
  tileImg,
  greenPill,
  mediumBold,
  redPill,
  xSmall,
  smallLine,
  orangePill,
  bluePill,
} from "../utils/styles";
import { get } from "../utils/api";

function ManagerPropertyView(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  // const property = location.state.property
  // const { mp_id } = useParams();
  const property_uid = location.state.property_uid;

  const [property, setProperty] = useState({ images: "[]" });
  const [hideEdit, setHideEdit] = useState(true);
  const [recentMaintenanceRequests, setRecentMaintenanceRequests] = useState(
    []
  );
  const [pastMaintenanceRequests, setPastMaintenanceRequests] = useState([]);
  const days = (date_1, date_2) => {
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  };
  const fetchProperty = async () => {
    // const response = await get(`/propertiesOwnerDetail?property_uid=${property_uid}`);
    const response = await get(
      `/propertiesManagerDetail?property_uid=${property_uid}`
    );
    const property_details = response.result[0];

    property_details.tenants = property_details.rentalInfo.filter(
      (r) => r.rental_status === "ACTIVE"
    );

    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid;
    }
    let owner_negotiations = property_details.property_manager.filter(
      (pm) => pm.linked_business_id === management_buid
    );
    if (owner_negotiations.length === 0) {
      property_details.management_status = null;
    } else if (owner_negotiations.length === 1) {
      property_details.management_status =
        owner_negotiations[0].management_status;
    } else {
      // placeholder, scenario needs to be tested and updated
      property_details.management_status =
        owner_negotiations[0].management_status;
    }
    console.log(property_details);
    setProperty(property_details);
    if (property_details.management_status === "ACCEPTED") {
      setHideEdit(false);
    }
    // setSelectedAgreement(property_details.rentalInfo);
    property_details.rentalInfo.forEach((rental) => {
      if (rental.rental_status === "ACTIVE") {
        setSelectedAgreement(rental);
      }
    });
    let recent_mr = [];
    let past_mr = [];
    console.log(property_details.maintenanceRequests);
    property_details.maintenanceRequests.forEach((request) => {
      if (
        days(new Date(request.request_created_date.split(" ")[0]), new Date()) >
        30
      ) {
        past_mr.push(request);
      } else recent_mr.push(request);
    });
    console.log(recent_mr, past_mr);
    setRecentMaintenanceRequests(recent_mr);
    setPastMaintenanceRequests(past_mr);
  };

  useState(() => {
    fetchProperty();
  });

  const [currentImg, setCurrentImg] = useState(0);
  const [expandDetails, setExpandDetails] = useState(false);
  const [editProperty, setEditProperty] = useState(false);
  const [expandMaintenanceR, setExpandMaintenanceR] = useState(false);
  const [expandManagerDocs, setExpandManagerDocs] = useState(false);
  const [expandLeaseDocs, setExpandLeaseDocs] = useState(false);
  const [showManagementContract, setShowManagementContract] = useState(false);
  const [showTenantAgreement, setShowTenantAgreement] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [acceptedTenantApplications, setAcceptedTenantApplications] = useState(
    []
  );
  const [showTenantProfile, setShowTenantProfile] = useState(false);
  const [selectedTenantApplication, setSelectedTenantApplication] =
    useState(null);
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [showCreateTax, setShowCreateTax] = useState(false);
  const [showCreateMortgage, setShowCreateMortgage] = useState(false);
  const [showCreateInsurance, setShowCreateInsurance] = useState(false);

  const nextImg = () => {
    if (currentImg === JSON.parse(property.images).length - 1) {
      setCurrentImg(0);
    } else {
      setCurrentImg(currentImg + 1);
    }
  };
  const previousImg = () => {
    if (currentImg === 0) {
      setCurrentImg(JSON.parse(property.images).length - 1);
    } else {
      setCurrentImg(currentImg - 1);
    }
  };

  const headerBack = () => {
    showCreateExpense
      ? setShowCreateExpense(false)
      : showCreateTax
      ? setShowCreateTax(false)
      : showCreateMortgage
      ? setShowCreateMortgage(false)
      : showCreateInsurance
      ? setShowCreateInsurance(false)
      : back();
    navigate("../manager-properties");
  };

  const back = () => {
    fetchProperty();
    navigate("../manager-properties");
  };

  const cashFlowState = {
    setShowCreateExpense,
    setShowCreateTax,
    setShowCreateMortgage,
    setShowCreateInsurance,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [editProperty, showManagementContract, showTenantAgreement]);

  const addContract = () => {
    setSelectedContract(null);
    setShowManagementContract(true);
  };
  const selectContract = (contract) => {
    setSelectedContract(contract);
    setShowManagementContract(true);
  };
  const closeContract = () => {
    // reload();
    setShowManagementContract(false);
  };

  const addAgreement = () => {
    setSelectedAgreement(null);
    setShowTenantAgreement(true);
  };
  const selectAgreement = (agreement) => {
    setSelectedAgreement(agreement);
    setShowTenantAgreement(true);
  };
  const closeAgreement = () => {
    // reload();
    setAcceptedTenantApplications([]);
    setShowTenantAgreement(false);
  };

  const reloadProperty = () => {
    setEditProperty(false);
    fetchProperty();
  };

  const createNewTenantAgreement = (selected_applications) => {
    setAcceptedTenantApplications(selected_applications);
    setShowTenantAgreement(true);
  };

  const selectTenantApplication = (application) => {
    setSelectedTenantApplication(application);
    setShowTenantProfile(true);
  };

  const closeTenantApplication = () => {
    setShowTenantProfile(false);
  };

  const renewLease = (agreement) => {
    setShowTenantAgreement(true);
    setSelectedAgreement(agreement);
  };
  return showManagementContract ? (
    <ManagerManagementContract
      back={closeContract}
      property={property}
      contract={selectedContract}
      reload={reloadProperty}
    />
  ) : showTenantAgreement ? (
    <ManagerTenantAgreement
      back={closeAgreement}
      property={property}
      agreement={selectedAgreement}
      acceptedTenantApplications={acceptedTenantApplications}
      setAcceptedTenantApplications={setAcceptedTenantApplications}
    />
  ) : showTenantProfile ? (
    <ManagerTenantProfileView
      back={closeTenantApplication}
      application={selectedTenantApplication}
    />
  ) : showCreateExpense ? (
    <CreateExpense
      property={property}
      reload={reloadProperty}
      back={() => setShowCreateExpense(false)}
    />
  ) : showCreateTax ? (
    <CreateTax
      property={property}
      reload={reloadProperty}
      back={() => setShowCreateTax(false)}
    />
  ) : showCreateMortgage ? (
    <CreateMortgage
      property={property}
      reload={reloadProperty}
      back={() => setShowCreateMortgage(false)}
    />
  ) : showCreateInsurance ? (
    <CreateInsurance
      property={property}
      reload={reloadProperty}
      back={() => setShowCreateInsurance(false)}
    />
  ) : (
    <div style={{ background: "#E9E9E9 0% 0% no-repeat padding-box" }}>
      <Header title="Properties" leftText="<Back" leftFn={headerBack} />
      <Container className="pb-5 mb-5">
        <div>
          <div>
            <div
              className="mx-2 my-2 p-3"
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <div
                style={{ ...tileImg, height: "200px", position: "relative" }}
              >
                {property.images.length > 0 ? (
                  <img
                    src={JSON.parse(property.images)[currentImg]}
                    className="w-100 h-100"
                    style={{ borderRadius: "4px", objectFit: "contain" }}
                    alt="Property"
                  />
                ) : (
                  ""
                )}
                <div
                  style={{ position: "absolute", left: "5px", top: "90px" }}
                  onClick={previousImg}
                >
                  {"<"}
                </div>
                <div
                  style={{ position: "absolute", right: "5px", top: "90px" }}
                  onClick={nextImg}
                >
                  {">"}
                </div>
              </div>
              <Row>
                <Col>
                  <h5 className="mt-2 mb-0" style={mediumBold}>
                    ${property.listed_rent}/mo
                  </h5>
                </Col>
                <Col>
                  <div className="d-flex mt-2 mb-0 justify-content-end">
                    {property.rental_status === "ACTIVE" ? (
                      <p style={greenPill} className="mb-0">
                        Rented
                      </p>
                    ) : property.rental_status === "PROCESSING" ? (
                      <p style={bluePill} className="mb-0">
                        Processing
                      </p>
                    ) : property.management_status === "FORWARDED" ? (
                      <p style={redPill} className="mb-0">
                        New
                      </p>
                    ) : property.management_status === "SENT" ? (
                      <p style={orangePill} className="mb-0">
                        Processing
                      </p>
                    ) : (
                      <p style={orangePill} className="mb-0">
                        Not Rented
                      </p>
                    )}
                  </div>
                </Col>
              </Row>

              <p
                style={{
                  font: "normal normal normal 20px Bahnschrift-Regular",
                  letterSpacing: "0px",
                  color: "#000000",
                }}
                className="mt-1 mb-2"
              >
                {property.address}
                {property.unit !== "" ? ` ${property.unit}, ` : ", "}
                {property.city}, {property.state} {property.zip}
              </p>
              {/* <PropertyCashFlow property={property} state={cashFlowState} /> */}
            </div>

            {property.rental_status === "ACTIVE" ? (
              <ManagerRentalHistory property={property} />
            ) : (
              <ManagerTenantApplications
                property={property}
                createNewTenantAgreement={createNewTenantAgreement}
                selectTenantApplication={selectTenantApplication}
              />
            )}
            <div
              className="mx-2 my-2 py-3"
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <div
                style={mediumBold}
                className=" d-flex flex-column justify-content-center align-items-center"
              >
                <div className="d-flex mt-1">
                  <h6 style={mediumBold} className="mb-1">
                    Property Details
                  </h6>
                </div>
                {expandDetails ? (
                  <ManagerPropertyForm
                    property={property}
                    edit={editProperty}
                    setEdit={setEditProperty}
                    hideEdit={hideEdit}
                    onSubmit={reloadProperty}
                  />
                ) : (
                  ""
                )}
                <div className="d-flex mt-1">
                  <img
                    onClick={() => setExpandDetails(!expandDetails)}
                    src={expandDetails ? BlueArrowUp : BlueArrowDown}
                    alt="Expand"
                  />
                </div>
              </div>
            </div>
            <div
              className="mx-2 my-2 py-3"
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <div
                style={mediumBold}
                className="d-flex flex-column justify-content-center align-items-center"
                onClick={() => setExpandManagerDocs(!expandManagerDocs)}
              >
                <div className="d-flex mt-1">
                  <h6 style={mediumBold} className="mb-1">
                    Property Owner
                  </h6>
                </div>
                {expandManagerDocs ? (
                  <PropertyManagerDocs
                    property={property}
                    fetchProperty={fetchProperty}
                    addDocument={addContract}
                    selectContract={selectContract}
                    setExpandManagerDocs={setExpandManagerDocs}
                    reload={""}
                  />
                ) : (
                  ""
                )}
                <div className="d-flex mt-1">
                  <img
                    src={expandManagerDocs ? BlueArrowUp : BlueArrowDown}
                    alt="Expand"
                  />
                </div>
              </div>
            </div>

            <div
              className="mx-2 my-2 p-3"
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <div
                style={mediumBold}
                className=" d-flex flex-column justify-content-center align-items-center"
                onClick={() => setExpandLeaseDocs(!expandLeaseDocs)}
              >
                <div className="d-flex mt-1">
                  <h6 style={mediumBold} className="mb-1">
                    Tenant Info
                  </h6>
                </div>
                {expandLeaseDocs ? (
                  // <ManagerLeaseDocs property={property} addDocument={addAgreement} selectAgreement={selectAgreement}/>
                  <ManagerTenantAgreementView
                    back={closeAgreement}
                    property={property}
                    selectedAgreement={selectedAgreement}
                    renewLease={renewLease}
                    acceptedTenantApplications={acceptedTenantApplications}
                    setAcceptedTenantApplications={
                      setAcceptedTenantApplications
                    }
                  />
                ) : (
                  ""
                )}
                <div className="d-flex mt-1">
                  <img
                    src={expandLeaseDocs ? BlueArrowUp : BlueArrowDown}
                    alt="Expand"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="mx-2 my-2 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <div
              style={mediumBold}
              className=" d-flex flex-column justify-content-center align-items-center"
            >
              <div className="d-flex mt-1">
                <h6 style={mediumBold} className="mb-1">
                  Recent Maintenance Requests
                </h6>
              </div>
              <div style={{ maxHeight: "220px", overflow: "scroll" }}>
                {recentMaintenanceRequests.length > 0 ? (
                  recentMaintenanceRequests.map((mr) => {
                    return (
                      <Row className="mx-2 mb-4">
                        <Col xs={3}>
                          <div style={tileImg}>
                            {JSON.parse(mr.images).length > 0 ? (
                              <img
                                src={JSON.parse(mr.images)[0]}
                                alt="Repair Image"
                                className="h-100 w-100"
                                style={{
                                  objectFit: "cover",
                                  height: "50px",
                                  width: "50px",
                                }}
                              />
                            ) : (
                              <img
                                src={No_Image}
                                alt="No Repair Image"
                                className="h-100 w-100"
                                style={{
                                  borderRadius: "4px",
                                  objectFit: "cover",
                                  height: "50px",
                                  width: "50px",
                                }}
                              />
                            )}
                          </div>
                        </Col>
                        <Col>
                          <Row
                            style={{
                              font: "normal normal normal 14px Bahnschrift-Regular",
                            }}
                          >
                            {mr.title}
                          </Row>
                          <Row
                            className="mb-2"
                            style={{
                              font: "normal normal normal 12px Bahnschrift-Regular",
                            }}
                          >
                            {mr.description}
                          </Row>
                          <Row>
                            <hr opacity={1} />
                          </Row>

                          {mr.request_status === "COMPLETED" ? (
                            <Row
                              style={{
                                font: "normal normal normal 12px Bahnschrift-Regular",
                                color: "#007AFF",
                              }}
                            >
                              Completed on:{" "}
                              {new Date(mr.scheduled_date).toLocaleDateString(
                                "en-us",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </Row>
                          ) : mr.request_status === "SCHEDULED" ? (
                            <Row
                              style={{
                                font: "normal normal normal 12px Bahnschrift-Regular",
                                color: "#E3441F",
                              }}
                            >
                              Scheduled for:{" "}
                              {new Date(mr.scheduled_date).toLocaleDateString(
                                "en-us",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </Row>
                          ) : (
                            <Row
                              style={{
                                font: "normal normal normal 12px Bahnschrift-Regular",
                                color: "#007AFF",
                              }}
                            >
                              Requested on:{" "}
                              {new Date(
                                mr.request_created_date.split(" ")[0]
                              ).toLocaleDateString("en-us", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </Row>
                          )}
                        </Col>
                      </Row>
                    );
                  })
                ) : (
                  <div style={mediumBold} className="d-flex mt-3">
                    No requests in past 30 days
                  </div>
                )}
              </div>
              <div
                style={(mediumBold, { color: "#007AFF", cursor: "pointer" })}
                className="d-flex mt-3"
                onClick={() => {
                  navigate("./repairs", { state: { property: property } });
                }}
              >
                <div className="d-flex mt-1  align-items-center">
                  <h6 style={mediumBold} className="mb-1">
                    Past Maintenance Requests
                  </h6>
                  &nbsp; &nbsp;
                  <div className="d-flex align-items-center">
                    <img src={BlueArrowRight} alt="Expand" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="mx-2 my-2 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              border: " 1px solid #007AFF",
              borderRadius: "5px",
              opacity: 1,
            }}
          >
            <div
              style={(mediumBold, { color: "#007AFF", cursor: "pointer" })}
              onClick={() => {
                navigate(`/appliances/${property.property_uid}`, {
                  state: {
                    property: property,
                    property_uid: property.property_uid,
                  },
                });
              }}
              className=" d-flex flex-row justify-content-center align-items-center"
            >
              <div className="d-flex mt-1  align-items-center">
                <h6 style={mediumBold} className="mb-1">
                  List of Appliances
                </h6>
                &nbsp; &nbsp;
                <div className="d-flex align-items-center">
                  <img src={BlueArrowRight} alt="Expand" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ManagerPropertyView;
