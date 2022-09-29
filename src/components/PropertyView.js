import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PropertyCashFlow from "./PropertyCashFlow";
import PropertyForm from "./PropertyForm";
import CreateExpense from "./CreateExpense";
import CreateRevenue from "./CreateRevenue";
import CreateTax from "./CreateTax";
import CreateMortgage from "./CreateMortgage";
import ManagerDocs from "./ManagerDocs";
import ManagementContract from "./ManagementContract";
import TenantAgreement from "./TenantAgreement";
import CreateInsurance from "./CreateInsurance";
import ConfirmDialog from "./ConfirmDialog";
import BusinessContact from "./BusinessContact";
import ManagerFees from "./ManagerFees";
import SideBar from "./ownerComponents/SideBar";
import File from "../icons/File.svg";
import BlueArrowUp from "../icons/BlueArrowUp.svg";
import BlueArrowDown from "../icons/BlueArrowDown.svg";
import BlueArrowRight from "../icons/BlueArrowRight.svg";
import OpenDoc from "../icons/OpenDoc.svg";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import No_Image from "../icons/No_Image_Available.jpeg";
import { get, put } from "../utils/api";
import {
  tileImg,
  squareForm,
  redPill,
  orangePill,
  greenPill,
  mediumBold,
  bluePillButton,
  redPillButton,
  smallImg,
} from "../utils/styles";
function PropertyView(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const property_uid = location.state.property_uid;
  // const { property_uid, back, reload, setStage } = props;
  const [property, setProperty] = useState({
    images: "[]",
  });
  const contactState = useState([]);
  const [feeState, setFeeState] = useState([]);
  const [tenantInfo, setTenantInfo] = useState([]);
  const [rentalInfo, setRentalInfo] = useState([]);
  const [cancel, setCancel] = useState(false);
  const [endEarlyDate, setEndEarlyDate] = useState("");
  const fetchProperty = async () => {
    // const response = await get(`/propertyInfo?property_uid=${property_uid}`);
    const response = await get(
      `/propertiesOwnerDetail?property_uid=${property_uid}`
    );
    console.log("property  in databse", response.result[0]);
    setProperty(response.result[0]);
    const res = await get(
      `/contracts?property_uid=${response.result[0].property_uid}`
    );

    setContracts(res.result);
    setRentalInfo(response.result[0].rentalInfo);
    contactState[1](JSON.parse(res.result[0].assigned_contacts));
    let tenant = [];
    let ti = {};
    response.result[0].rentalInfo.map((rentalInfo) => {
      if (rentalInfo.tenant_first_name.includes(",")) {
        let tenant_fns = rentalInfo.tenant_first_name.split(",");
        let tenant_lns = rentalInfo.tenant_last_name.split(",");
        let tenant_emails = rentalInfo.tenant_email.split(",");
        let tenant_phones = rentalInfo.tenant_phone_number.split(",");
        console.log("tennat", tenant_fns);
        for (let i = 0; i < tenant_fns.length; i++) {
          ti["tenantFirstName"] = tenant_fns[i];
          ti["tenantLastName"] = tenant_lns[i];
          ti["tenantEmail"] = tenant_emails[i];
          ti["tenantPhoneNumber"] = tenant_phones[i];
          console.log("tennat", ti);
          tenant.push(ti);
          ti = {};
        }
        console.log("tennat", tenant);
      } else {
        ti = {
          tenantFirstName: rentalInfo.tenant_first_name,
          tenantLastName: rentalInfo.tenant_last_name,
          tenantEmail: rentalInfo.tenant_email,
          tenantPhoneNumber: rentalInfo.tenant_phone_number,
        };
        console.log("tennat", ti);
        tenant.push(ti);
      }
    });
    console.log("tennat", tenant);
    setTenantInfo(tenant);
  };
  useState(() => {
    fetchProperty();
  });

  const [pmID, setPmID] = useState("");
  const [currentImg, setCurrentImg] = useState(0);
  const [expandDetails, setExpandDetails] = useState(false);

  const [expandMaintenanceR, setExpandMaintenanceR] = useState(false);
  const [editProperty, setEditProperty] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [showCreateRevenue, setShowCreateRevenue] = useState(false);
  const [showCreateTax, setShowCreateTax] = useState(false);
  const [showCreateMortgage, setShowCreateMortgage] = useState(false);
  const [showCreateInsurance, setShowCreateInsurance] = useState(false);
  const [expandManagerDocs, setExpandManagerDocs] = useState(false);
  const [expandAddManagerDocs, setExpandAddManagerDocs] = useState(false);

  const [expandTenantInfo, setExpandTenantInfo] = useState(false);
  const [expandLeaseDocs, setExpandLeaseDocs] = useState(false);
  const [showManagementContract, setShowManagementContract] = useState(false);
  const [showTenantAgreement, setShowTenantAgreement] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialog2, setShowDialog2] = useState(false);
  // React.useEffect(async () => {
  //   const response = await get(
  //     `/contracts?property_uid=${property.property_uid}`
  //   );
  //   setContracts(response.result);
  // }, []);
  console.log("contract", contracts);
  const headerBack = () => {
    editProperty
      ? setEditProperty(false)
      : showCreateExpense
      ? setShowCreateExpense(false)
      : showCreateRevenue
      ? setShowCreateRevenue(false)
      : showCreateTax
      ? setShowCreateTax(false)
      : showCreateMortgage
      ? setShowCreateMortgage(false)
      : showCreateInsurance
      ? setShowCreateInsurance(false)
      : navigate("../owner");
    navigate("../owner");
  };

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [
    editProperty,
    showCreateExpense,
    showCreateRevenue,
    showCreateTax,
    showCreateMortgage,
    showCreateInsurance,
    showManagementContract,
    showTenantAgreement,
  ]);

  const reloadProperty = () => {
    setEditProperty(false);
    fetchProperty();
  };

  const cashFlowState = {
    setShowCreateExpense,
    setShowCreateRevenue,
    setShowCreateTax,
    setShowCreateMortgage,
    setShowCreateInsurance,
  };

  const addContract = () => {
    setSelectedContract(null);
    setShowManagementContract(true);
  };
  const selectContract = (contract) => {
    setSelectedContract(contract);
    setShowManagementContract(true);
  };
  const closeContract = () => {
    fetchProperty();
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
    fetchProperty();
    setShowTenantAgreement(false);
  };
  const approvePropertyManager = async (pID) => {
    const files = JSON.parse(property.images);
    let pid = pID;
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "ACCEPTED",
      manager_id: pid,
    };
    // for (let i = -1; i < files.length - 1; i++) {
    //   let key = `img_${i}`;
    //   if (i === -1) {
    //     key = "img_cover";
    //   }
    //   updatedManagementContract[key] = files[i + 1];
    // }
    console.log(files);
    const response2 = await put(
      "/properties",
      updatedManagementContract,
      null,
      files
    );
    setExpandAddManagerDocs(!expandAddManagerDocs);
    reloadProperty();
  };

  const rejectPropertyManager = async () => {
    let pid = pmID;

    const files = JSON.parse(property.images);
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "REJECTED",
      manager_id: pid,
    };
    // }
    const response2 = await put(
      "/properties",
      updatedManagementContract,
      null,
      files
    );
    setShowDialog(false);
    setExpandAddManagerDocs(!expandAddManagerDocs);
    reloadProperty();
  };

  const cancelAgreement = async () => {
    let pid = pmID;
    const files = JSON.parse(property.images);
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "OWNER END EARLY",
      manager_id: pid,
      early_end_date: endEarlyDate,
    };

    const response2 = await put(
      "/cancelAgreement",
      updatedManagementContract,
      null,
      files
    );
    setShowDialog2(false);
    setExpandAddManagerDocs(!expandAddManagerDocs);
    reloadProperty();
  };
  const acceptCancelAgreement = async () => {
    const files = JSON.parse(property.images);
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "OWNER ACCEPTED",
      manager_id: property.managerInfo.manager_id,
    };

    await put("/cancelAgreement", updatedManagementContract, null, files);
    setExpandAddManagerDocs(!expandAddManagerDocs);
    reloadProperty();
  };

  const rejectCancelAgreement = async () => {
    const files = JSON.parse(property.images);
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "OWNER REJECTED",
      manager_id: property.managerInfo.manager_id,
    };

    await put("/cancelAgreement", updatedManagementContract, null, files);
    setExpandAddManagerDocs(!expandAddManagerDocs);
    reloadProperty();
  };

  const onCancel = () => {
    setShowDialog(false);
  };
  const onCancel2 = () => {
    setShowDialog2(false);
  };
  console.log(pmID);
  return Object.keys(property).length > 1 ? (
    showManagementContract ? (
      <ManagementContract
        back={closeContract}
        property={property}
        contract={selectedContract}
        reload={reloadProperty}
      />
    ) : showTenantAgreement ? (
      <TenantAgreement
        back={closeAgreement}
        property={property}
        agreement={selectedAgreement}
      />
    ) : (
      <div className="w-100">
        <ConfirmDialog
          title={"Are you sure you want to reject this Property Manager?"}
          isOpen={showDialog}
          onConfirm={rejectPropertyManager}
          onCancel={onCancel}
        />
        <ConfirmDialog
          title={
            "Are you sure you want to cancel the Agreement with this Property Management?"
          }
          isOpen={showDialog2}
          onConfirm={cancelAgreement}
          onCancel={onCancel2}
        />
        <div className="flex-1">
          <div className="sidebar">
            <SideBar />
          </div>
          <div className="w-100">
            <br />
            <Header title="Properties" leftText="< Back" leftFn={headerBack} />
            <Container>
              {editProperty ? (
                <PropertyForm
                  property={property}
                  edit={editProperty}
                  setEdit={setEditProperty}
                  onSubmit={reloadProperty}
                />
              ) : showCreateExpense ? (
                <CreateExpense
                  property={property}
                  reload={reloadProperty}
                  back={() => setShowCreateExpense(false)}
                />
              ) : showCreateRevenue ? (
                <CreateRevenue
                  property={property}
                  reload={reloadProperty}
                  back={() => setShowCreateRevenue(false)}
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
                <div>
                  <div
                    style={{
                      ...tileImg,
                      height: "200px",
                      position: "relative",
                    }}
                  >
                    {JSON.parse(property.images).length > 0 ? (
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
                      style={{
                        position: "absolute",
                        right: "5px",
                        top: "90px",
                      }}
                      onClick={nextImg}
                    >
                      {">"}
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
                    <Row>
                      <Col>
                        <h5
                          className="mt-2 mb-0"
                          style={{
                            font: "normal normal normal 20px Bahnschrift-Regular",
                            letterSpacing: "0px",
                            color: "#000000",
                          }}
                        >
                          ${property.listed_rent}/mo
                        </h5>
                      </Col>
                      <Col>
                        <div className="d-flex mt-2 mb-0 justify-content-end">
                          {property.management_status !== "ACCEPTED" ? (
                            <p style={redPill} className="mb-0">
                              New
                            </p>
                          ) : property.rental_status === "ACTIVE" ? (
                            <p style={greenPill} className="mb-0">
                              Rented
                            </p>
                          ) : property.rental_status === "PROCESSING" ? (
                            <p style={greenPill} className="mb-0">
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

                    <PropertyCashFlow
                      property={property}
                      state={cashFlowState}
                    />
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
                      // className=" d-flex flex-column justify-content-center align-items-center"
                      onClick={() => setExpandTenantInfo(!expandTenantInfo)}
                    >
                      <div className="d-flex mt-1 flex-column justify-content-center align-items-center">
                        <h6 style={mediumBold} className="mb-1">
                          Tenant Info
                        </h6>
                      </div>
                      {expandTenantInfo ? (
                        <div>
                          <div>
                            {tenantInfo.map((tf) => {
                              return (
                                <Row>
                                  <Col
                                    className=" d-flex align-items-left"
                                    style={{
                                      font: "normal normal 600 18px Bahnschrift-Regular",
                                    }}
                                  >
                                    Tenant: {tf.tenantFirstName}{" "}
                                    {tf.tenantLastName}
                                  </Col>
                                  <Col className="d-flex justify-content-end">
                                    <a href={`tel:${tf.tenantPhoneNumber}`}>
                                      <img
                                        src={Phone}
                                        alt="Phone"
                                        style={smallImg}
                                      />
                                    </a>
                                    <a href={`mailto:${tf.tenantEmail}`}>
                                      <img
                                        src={Message}
                                        alt="Message"
                                        style={smallImg}
                                      />
                                    </a>
                                  </Col>
                                </Row>
                              );
                            })}
                          </div>
                          <div>
                            {rentalInfo.map((rf) => {
                              return (
                                <Row>
                                  {JSON.parse(rf.rent_payments).map((rp) => {
                                    return (
                                      <Row className="mt-1">
                                        <Col
                                          className=" d-flex align-items-left"
                                          style={{
                                            font: "normal normal 600 18px Bahnschrift-Regular",
                                          }}
                                        >
                                          {rp.fee_name}:
                                        </Col>
                                        <Col className=" d-flex justify-content-end">
                                          ${rp.charge}
                                        </Col>
                                      </Row>
                                    );
                                  })}

                                  <Row className="mt-1">
                                    <Col
                                      style={{
                                        font: "normal normal 600 18px Bahnschrift-Regular",
                                      }}
                                    >
                                      Lease Length
                                    </Col>
                                  </Row>
                                  <Row className="mt-1">
                                    <Col
                                      className=" d-flex align-items-left"
                                      style={{
                                        font: "normal normal 600 18px Bahnschrift-Regular",
                                      }}
                                    >
                                      Start Date:
                                    </Col>
                                    <Col className=" d-flex justify-content-end">
                                      {rf.lease_start}
                                    </Col>
                                  </Row>
                                  <Row className="mt-1">
                                    <Col
                                      className=" d-flex align-items-left"
                                      style={{
                                        font: "normal normal 600 18px Bahnschrift-Regular",
                                      }}
                                    >
                                      End Date:
                                    </Col>
                                    <Col className=" d-flex justify-content-end">
                                      {rf.lease_end}
                                    </Col>
                                  </Row>
                                </Row>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="d-flex mt-1 flex-column justify-content-center align-items-center">
                        <img
                          src={expandTenantInfo ? BlueArrowUp : BlueArrowDown}
                          alt="Expand"
                        />
                      </div>
                    </div>
                  </div>
                  {rentalInfo.map((rf) => {
                    return (
                      JSON.parse(rf.documents).length > 0 && (
                        <div
                          className="mx-2 my-2 p-3"
                          style={{
                            background: "#FFFFFF 0% 0% no-repeat padding-box",
                            borderRadius: "10px",
                            opacity: 1,
                          }}
                        >
                          {console.log(
                            "rf.documents.length",
                            rf.documents.length,
                            rf.documents
                          )}
                          <div
                            style={mediumBold}
                            // className=" d-flex flex-column justify-content-center align-items-center"
                            onClick={() => setExpandLeaseDocs(!expandLeaseDocs)}
                          >
                            <div className="d-flex mt-1 flex-column justify-content-center align-items-center">
                              <h6 style={mediumBold} className="mb-1">
                                Lease Documents
                              </h6>
                            </div>
                            {expandLeaseDocs ? (
                              <div>
                                <div>
                                  {rentalInfo.map((rf) => {
                                    return (
                                      rf.documents.length > 0 && (
                                        <Row className="d-flex justify-content-center m-2">
                                          {JSON.parse(rf.documents).map(
                                            (rp) => {
                                              return (
                                                <Row
                                                  className="d-flex align-items-center p-2"
                                                  style={{
                                                    boxShadow:
                                                      "0px 1px 6px #00000029",
                                                    borderRadius: "5px",
                                                  }}
                                                >
                                                  <Col
                                                    className=" d-flex align-items-left"
                                                    style={{
                                                      font: "normal normal 600 18px Bahnschrift-Regular",
                                                      color: "#007AFF",
                                                      textDecoration:
                                                        "underline",
                                                    }}
                                                  >
                                                    {rp.description}
                                                  </Col>
                                                  <Col className=" d-flex justify-content-end">
                                                    <a
                                                      href={rp.link}
                                                      target="_blank"
                                                    >
                                                      <img src={OpenDoc} />
                                                    </a>
                                                  </Col>
                                                </Row>
                                              );
                                            }
                                          )}
                                        </Row>
                                      )
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            <div className="d-flex mt-1 flex-column justify-content-center align-items-center">
                              <img
                                src={
                                  expandLeaseDocs ? BlueArrowUp : BlueArrowDown
                                }
                                alt="Expand"
                              />
                            </div>
                          </div>
                        </div>
                      )
                    );
                  })}
                  {Object.keys(property.managerInfo).length !== 0 ? (
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
                            Property Management Agreement
                          </h6>
                        </div>

                        {expandManagerDocs &&
                        (property.management_status === "ACCEPTED" ||
                          property.management_status === "OWNER END EARLY" ||
                          property.management_status === "PM END EARLY") ? (
                          <Row className="d-flex justify-content-center">
                            <Row className="d-flex justify-content-center mt-3 p-0">
                              <Col>
                                <h6 style={mediumBold} className="mb-1">
                                  {property.managerInfo.manager_business_name}
                                </h6>
                                {/* <p
                                  style={{ ...gray, ...mediumBold }}
                                  className="mb-1"
                                >
                                  Property Manager
                                </p> */}
                              </Col>
                              <Col xs={3}>
                                <a
                                  href={`tel:${property.managerInfo.manager_phone_number}`}
                                >
                                  <img
                                    src={Phone}
                                    alt="Phone"
                                    style={smallImg}
                                  />
                                </a>
                                <a
                                  href={`mailto:${property.managerInfo.manager_email}`}
                                >
                                  <img
                                    src={Message}
                                    alt="Message"
                                    style={smallImg}
                                  />
                                </a>
                              </Col>
                            </Row>
                            <div>
                              {contracts.map((contract, i) =>
                                contract.business_uid ===
                                property.managerInfo.manager_id ? (
                                  <Row key={i}>
                                    <Row className="mt-1 align-items-center">
                                      <Col className="d-flex  align-items-left">
                                        {contract.contract_name != null ? (
                                          <p
                                            style={{
                                              font: "normal normal 600 18px Bahnschrift-Regular",
                                            }}
                                          >
                                            {contract.contract_name}{" "}
                                          </p>
                                        ) : (
                                          <p
                                            style={{
                                              font: "normal normal 600 18px Bahnschrift-Regular",
                                            }}
                                          >
                                            Contract {i + 1}{" "}
                                          </p>
                                        )}
                                      </Col>

                                      <Col
                                        xs={2}
                                        className="d-flex justify-content-end"
                                      >
                                        {JSON.parse(contract.documents)
                                          .length === 0
                                          ? ""
                                          : JSON.parse(contract.documents).map(
                                              (file) => {
                                                return (
                                                  <a
                                                    href={file.link}
                                                    target="_blank"
                                                  >
                                                    <img src={File} />
                                                  </a>
                                                );
                                              }
                                            )}
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col
                                        className="d-flex align-items-left"
                                        style={{
                                          font: "normal normal 600 18px Bahnschrift-Regular",
                                        }}
                                      >
                                        Contract Length
                                      </Col>
                                      <Col xs={2}></Col>
                                    </Row>
                                    <Row>
                                      <Col style={mediumBold}>
                                        <Form.Group className="mx-2 my-3">
                                          <Form.Label className="mb-0 ms-2">
                                            Start Date
                                          </Form.Label>
                                          <Row
                                            className="mb-0 ms-2 p-1"
                                            style={{
                                              background:
                                                "#F8F8F8 0% 0% no-repeat padding-box",
                                              border: "1px solid #EBEBEB",
                                              borderRadius: " 5px",
                                            }}
                                          >
                                            {contract.start_date}
                                          </Row>
                                        </Form.Group>
                                      </Col>
                                      <Col style={mediumBold}>
                                        <Form.Group className="mx-2 my-3">
                                          <Form.Label className="mb-0 ms-2">
                                            End Date
                                          </Form.Label>
                                          <Row
                                            className="mb-0 ms-2 p-1"
                                            style={{
                                              background:
                                                "#F8F8F8 0% 0% no-repeat padding-box",
                                              border: "1px solid #EBEBEB",
                                              borderRadius: " 5px",
                                            }}
                                          >
                                            {contract.end_date}
                                          </Row>
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                    <Row
                                      style={{
                                        font: "normal normal 600 18px Bahnschrift-Regular",
                                      }}
                                    >
                                      <Form.Group>
                                        <Form.Label>PM Fees</Form.Label>
                                        <Row className="mb-2 ms-2">
                                          <ManagerFees
                                            feeState={JSON.parse(
                                              contract.contract_fees
                                            )}
                                            setFeeState={setFeeState}
                                          />
                                        </Row>
                                      </Form.Group>
                                    </Row>
                                    {JSON.parse(contract.assigned_contacts)
                                      .length === 0 ? (
                                      ""
                                    ) : (
                                      <Row
                                        style={{
                                          font: "normal normal 600 18px Bahnschrift-Regular",
                                        }}
                                      >
                                        <Form.Group>
                                          <Form.Label>
                                            Contact Details
                                          </Form.Label>
                                          <Row className="mb-2 ms-2">
                                            <BusinessContact
                                              state={contactState}
                                            />
                                          </Row>
                                        </Form.Group>
                                      </Row>
                                    )}
                                  </Row>
                                ) : (
                                  ""
                                )
                              )}
                            </div>
                            {/* <Row className="mt-4">
                          <Col
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-evenly",
                              marginBottom: "25px",
                            }}
                          >
                            <Button
                              // onClick={cancelAgreement}
                              onClick={() => {
                                setShowDialog2(true);
                                setPmID(property.manager_id);
                              }}
                              variant="outline-primary"
                              style={redPillButton}
                            >
                              Cancel Agreement
                            </Button>
                          </Col>
                        </Row> */}
                          </Row>
                        ) : (
                          ""
                        )}
                        {expandManagerDocs &&
                        property.management_status === "ACCEPTED" &&
                        !cancel ? (
                          <Row className="mt-4">
                            <Col className="d-flex justify-content-center mb-1">
                              <Button
                                variant="outline-primary"
                                style={redPillButton}
                                // onClick={() => {
                                //   setShowDialog2(true);
                                //   setPmID(property.managerInfo.manager_id);
                                // }}
                                onClick={() => setCancel(true)}
                              >
                                Cancel Agreement
                              </Button>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {expandManagerDocs &&
                        property.management_status === "ACCEPTED" &&
                        cancel ? (
                          <Row className="mt-4">
                            <Col className="d-flex flex-column justify-content-center mb-1">
                              <Form.Group className="mx-2 mb-3">
                                <Form.Label as="h6">Early End Date</Form.Label>
                                <Form.Control
                                  style={squareForm}
                                  type="date"
                                  value={endEarlyDate}
                                  onChange={(e) =>
                                    setEndEarlyDate(e.target.value)
                                  }
                                />
                              </Form.Group>
                              <Button
                                variant="outline-primary"
                                style={redPillButton}
                                onClick={() => {
                                  setShowDialog2(true);
                                  setPmID(property.managerInfo.manager_id);
                                }}
                              >
                                Cancel Agreement
                              </Button>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {expandManagerDocs &&
                        property.management_status === "OWNER END EARLY" ? (
                          <Row className="mt-4">
                            <h6
                              className="d-flex justify-content-center"
                              style={mediumBold}
                            >
                              You have requested to end the agreement early on{" "}
                              {contracts[0].early_end_date}
                            </h6>
                          </Row>
                        ) : (
                          ""
                        )}

                        {expandManagerDocs &&
                        property.management_status === "PM END EARLY" ? (
                          <Row className="d-flex flex-grow-1 w-100 justify-content-center mt-3 mb-4">
                            <h6
                              className="d-flex justify-content-center"
                              style={mediumBold}
                            >
                              Property Manager requested to end the agreement
                              early on {contracts[0].early_end_date}
                            </h6>
                            <Col className="d-flex justify-content-center">
                              <Button
                                variant="outline-primary"
                                style={bluePillButton}
                                onClick={acceptCancelAgreement}
                              >
                                Accept
                              </Button>
                            </Col>
                            <Col className="d-flex justify-content-center">
                              <Button
                                variant="outline-primary"
                                style={redPillButton}
                                onClick={rejectCancelAgreement}
                              >
                                Reject
                              </Button>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}

                        <Row className="d-flex mt-1">
                          <img
                            onClick={() =>
                              setExpandManagerDocs(!expandManagerDocs)
                            }
                            src={
                              expandManagerDocs ? BlueArrowUp : BlueArrowDown
                            }
                            alt="Expand"
                          />
                        </Row>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
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
                      className=" d-flex flex-column justify-content-center align-items-center "
                      onClick={() =>
                        setExpandAddManagerDocs(!expandAddManagerDocs)
                      }
                    >
                      <div className="d-flex mt-1">
                        <h6 style={mediumBold} className="mb-1">
                          {Object.keys(property.managerInfo).length == 0
                            ? "Select a Property Manager"
                            : "Change Property Manager"}
                        </h6>
                      </div>
                      {property.property_manager.length == 0 ? (
                        ""
                      ) : property.property_manager.length > 1 ? (
                        property.property_manager.map((p, i) =>
                          p.management_status === "REJECTED" ? (
                            ""
                          ) : expandAddManagerDocs &&
                            p.management_status === "FORWARDED" ? (
                            <Row className="p-0 m-0">
                              <Row className="d-flex justify-content-between mt-3">
                                <Col
                                  xs={8}
                                  className="d-flex justify-content-start flex-column"
                                >
                                  <h6 style={mediumBold} className="mb-1">
                                    {p.manager_business_name}
                                  </h6>
                                  <p
                                    style={{ mediumBold, color: "blue" }}
                                    className="mb-1"
                                  >
                                    Property Manager Selected
                                  </p>
                                </Col>
                                <Col className="d-flex justify-content-end">
                                  <a href={`tel:${p.manager_phone_number}`}>
                                    <img
                                      src={Phone}
                                      alt="Phone"
                                      style={smallImg}
                                    />
                                  </a>
                                  <a href={`mailto:${p.manager_email}`}>
                                    <img
                                      src={Message}
                                      alt="Message"
                                      style={smallImg}
                                    />
                                  </a>
                                </Col>
                              </Row>
                              <Row className="mt-4">
                                <Col
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                    marginBottom: "25px",
                                  }}
                                >
                                  <Button
                                    // onClick={rejectPropertyManager}
                                    onClick={() => {
                                      setShowDialog(true);
                                      setPmID(p.manager_id);
                                    }}
                                    variant="outline-primary"
                                    style={redPillButton}
                                  >
                                    Reject
                                  </Button>
                                </Col>
                              </Row>
                            </Row>
                          ) : (
                            ""
                          )
                        )
                      ) : expandAddManagerDocs &&
                        property.property_manager[0].management_status ===
                          "FORWARDED" ? (
                        <Row className="p-0 m-0">
                          <Row className="d-flex justify-content-between mt-3">
                            <Col
                              xs={8}
                              className="d-flex flex-column justify-content-start p-0"
                            >
                              <Row>
                                <h6 style={mediumBold} className="mb-1">
                                  {
                                    property.property_manager[0]
                                      .manager_business_name
                                  }
                                </h6>
                              </Row>
                            </Col>
                            <Col className="d-flex justify-content-end">
                              <a
                                href={`tel:${property.property_manager[0].manager_phone_number}`}
                              >
                                <img src={Phone} alt="Phone" style={smallImg} />
                              </a>
                              <a
                                href={`mailto:${property.property_manager[0].manager_email}`}
                              >
                                <img
                                  src={Message}
                                  alt="Message"
                                  style={smallImg}
                                />
                              </a>
                            </Col>
                          </Row>
                          <Row className="mt-4">
                            <Col
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                marginBottom: "25px",
                              }}
                            >
                              <Button
                                // onClick={rejectPropertyManager}
                                onClick={() => {
                                  setShowDialog(true);
                                  setPmID(
                                    property.property_manager[0].manager_id
                                  );
                                }}
                                variant="outline-primary"
                                style={redPillButton}
                              >
                                Reject
                              </Button>
                            </Col>
                          </Row>
                        </Row>
                      ) : (
                        ""
                      )}
                      {property.property_manager.length == 0 ? (
                        ""
                      ) : property.property_manager.length > 1 ? (
                        property.property_manager.map((p, i) =>
                          p.management_status === "REJECTED" ? (
                            ""
                          ) : expandAddManagerDocs &&
                            p.management_status === "SENT" ? (
                            <Row className="p-0 m-0">
                              <Row className="d-flex justify-content-between mt-3">
                                <Row>
                                  <h6 style={mediumBold} className="mb-1">
                                    {p.manager_business_name}
                                  </h6>
                                  <p
                                    style={{ mediumBold, color: "#41fc03" }}
                                    className="mb-1"
                                  >
                                    Contract in Review
                                  </p>
                                </Row>
                              </Row>

                              <div>
                                {contracts.map((contract, i) =>
                                  contract.business_uid === p.manager_id ? (
                                    <Row key={i}>
                                      <Row className="mt-1 align-items-center">
                                        <Col className="d-flex  align-items-left">
                                          {contract.contract_name != null ? (
                                            <p
                                              style={{
                                                font: "normal normal 600 18px Bahnschrift-Regular",
                                              }}
                                            >
                                              {contract.contract_name}{" "}
                                            </p>
                                          ) : (
                                            <p
                                              style={{
                                                font: "normal normal 600 18px Bahnschrift-Regular",
                                              }}
                                            >
                                              Contract {i + 1}{" "}
                                            </p>
                                          )}
                                        </Col>
                                        <Col
                                          xs={2}
                                          className="d-flex justify-content-end"
                                        >
                                          {JSON.parse(contract.documents)
                                            .length === 0
                                            ? ""
                                            : JSON.parse(
                                                contract.documents
                                              ).map((file) => {
                                                return (
                                                  <a
                                                    href={file.link}
                                                    target="_blank"
                                                  >
                                                    <img src={File} />
                                                  </a>
                                                );
                                              })}
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col
                                          className="d-flex align-items-left"
                                          style={{
                                            font: "normal normal 600 18px Bahnschrift-Regular",
                                          }}
                                        >
                                          Contract Length
                                        </Col>
                                        <Col xs={2}></Col>
                                      </Row>
                                      <Row>
                                        <Col style={mediumBold}>
                                          <Form.Group className="mx-2 my-3">
                                            <Form.Label className="mb-0 ms-2">
                                              Start Date
                                            </Form.Label>
                                            <Row
                                              className="mb-0 ms-2 p-1"
                                              style={{
                                                background:
                                                  "#F8F8F8 0% 0% no-repeat padding-box",
                                                border: "1px solid #EBEBEB",
                                                borderRadius: " 5px",
                                              }}
                                            >
                                              {contract.start_date}
                                            </Row>
                                          </Form.Group>
                                        </Col>
                                        <Col style={mediumBold}>
                                          <Form.Group className="mx-2 my-3">
                                            <Form.Label className="mb-0 ms-2">
                                              End Date
                                            </Form.Label>
                                            <Row
                                              className="mb-0 ms-2 p-1"
                                              style={{
                                                background:
                                                  "#F8F8F8 0% 0% no-repeat padding-box",
                                                border: "1px solid #EBEBEB",
                                                borderRadius: " 5px",
                                              }}
                                            >
                                              {contract.end_date}
                                            </Row>
                                          </Form.Group>
                                        </Col>
                                      </Row>
                                      <Row
                                        style={{
                                          font: "normal normal 600 18px Bahnschrift-Regular",
                                        }}
                                      >
                                        <Form.Group>
                                          <Form.Label>PM Fees</Form.Label>
                                          <Row className="mb-2 ms-2">
                                            <ManagerFees
                                              feeState={JSON.parse(
                                                contract.contract_fees
                                              )}
                                              setFeeState={setFeeState}
                                            />
                                          </Row>
                                        </Form.Group>
                                      </Row>
                                      {JSON.parse(contract.assigned_contacts)
                                        .length === 0 ? (
                                        ""
                                      ) : (
                                        <Row
                                          style={{
                                            font: "normal normal 600 18px Bahnschrift-Regular",
                                          }}
                                        >
                                          <Form.Group>
                                            <Form.Label>
                                              Contact Details
                                            </Form.Label>
                                            <Row className="mb-2 ms-2">
                                              <BusinessContact
                                                state={contactState}
                                              />
                                            </Row>
                                          </Form.Group>
                                        </Row>
                                      )}
                                    </Row>
                                  ) : (
                                    ""
                                  )
                                )}
                              </div>

                              <Row className="mt-4">
                                <Col
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                    marginBottom: "25px",
                                  }}
                                >
                                  <Button
                                    onClick={() => {
                                      setPmID(p.manager_id);
                                      approvePropertyManager(p.manager_id);
                                    }}
                                    variant="outline-primary"
                                    style={bluePillButton}
                                  >
                                    Approve
                                  </Button>
                                </Col>
                                <Col
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                    marginBottom: "25px",
                                  }}
                                >
                                  <Button
                                    // onClick={rejectPropertyManager}
                                    onClick={() => {
                                      setShowDialog(true);
                                      setPmID(p.manager_id);
                                    }}
                                    variant="outline-primary"
                                    style={redPillButton}
                                  >
                                    Reject
                                  </Button>
                                </Col>
                              </Row>
                            </Row>
                          ) : (
                            ""
                          )
                        )
                      ) : expandAddManagerDocs &&
                        property.property_manager[0].management_status ===
                          "SENT" ? (
                        <Row>
                          <Row className="d-flex justify-content-between mt-3">
                            <Row>
                              <h6 style={mediumBold} className="mb-1">
                                {
                                  property.property_manager[0]
                                    .manager_business_name
                                }
                              </h6>
                              <p
                                style={{ mediumBold, color: "#41fc03" }}
                                className="mb-1"
                              >
                                Contract in Review
                              </p>
                            </Row>
                          </Row>
                          <div>
                            {contracts.map((contract, i) =>
                              contract.business_uid ===
                              property.property_manager[0].manager_id ? (
                                <Row key={i}>
                                  <Row className="mt-1 align-items-center">
                                    <Col className=" d-flex align-items-left">
                                      {contract.contract_name != null ? (
                                        <p
                                          style={{
                                            font: "normal normal 600 18px Bahnschrift-Regular",
                                          }}
                                        >
                                          {contract.contract_name}
                                        </p>
                                      ) : (
                                        <p
                                          style={{
                                            font: "normal normal 600 18px Bahnschrift-Regular",
                                          }}
                                        >
                                          Contract {i + 1}
                                        </p>
                                      )}
                                    </Col>
                                    <Col
                                      xs={2}
                                      className="d-flex justify-content-end"
                                    >
                                      {JSON.parse(contract.documents).length ===
                                      0
                                        ? ""
                                        : JSON.parse(contract.documents).map(
                                            (file) => {
                                              return (
                                                <a
                                                  href={file.link}
                                                  target="_blank"
                                                >
                                                  <img src={File} />
                                                </a>
                                              );
                                            }
                                          )}
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col
                                      className="d-flex align-items-left"
                                      style={{
                                        font: "normal normal 600 18px Bahnschrift-Regular",
                                      }}
                                    >
                                      Contract Length
                                    </Col>
                                    <Col xs={2}></Col>
                                  </Row>
                                  <Row>
                                    <Col style={mediumBold}>
                                      <Form.Group className="mx-2 my-3">
                                        <Form.Label className="mb-0 ms-2">
                                          Start Date
                                        </Form.Label>
                                        <Row
                                          className="mb-0 ms-2 p-1"
                                          style={{
                                            background:
                                              "#F8F8F8 0% 0% no-repeat padding-box",
                                            border: "1px solid #EBEBEB",
                                            borderRadius: " 5px",
                                          }}
                                        >
                                          {contract.start_date}
                                        </Row>
                                      </Form.Group>
                                    </Col>
                                    <Col style={mediumBold}>
                                      <Form.Group className="mx-2 my-3">
                                        <Form.Label className="mb-0 ms-2">
                                          End Date
                                        </Form.Label>
                                        <Row
                                          className="mb-0 ms-2 p-1"
                                          style={{
                                            background:
                                              "#F8F8F8 0% 0% no-repeat padding-box",
                                            border: "1px solid #EBEBEB",
                                            borderRadius: " 5px",
                                          }}
                                        >
                                          {contract.end_date}
                                        </Row>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                  <Row
                                    style={{
                                      font: "normal normal 600 18px Bahnschrift-Regular",
                                    }}
                                  >
                                    <Form.Group>
                                      <Form.Label>PM Fees</Form.Label>
                                      <Row className="mb-2 ms-2">
                                        <ManagerFees
                                          feeState={JSON.parse(
                                            contract.contract_fees
                                          )}
                                          setFeeState={setFeeState}
                                        />
                                      </Row>
                                    </Form.Group>
                                  </Row>
                                  {JSON.parse(contract.assigned_contacts)
                                    .length === 0 ? (
                                    ""
                                  ) : (
                                    <Row
                                      style={{
                                        font: "normal normal 600 18px Bahnschrift-Regular",
                                      }}
                                    >
                                      <Form.Group>
                                        <Form.Label>Contact Details</Form.Label>
                                        <Row className="mb-2 ms-2">
                                          <BusinessContact
                                            state={contactState}
                                          />
                                        </Row>
                                      </Form.Group>
                                    </Row>
                                  )}
                                </Row>
                              ) : (
                                ""
                              )
                            )}
                          </div>

                          <Row className="mt-4">
                            <Col
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                marginBottom: "25px",
                              }}
                            >
                              <Button
                                onClick={() => {
                                  setPmID(
                                    property.property_manager[0].manager_id
                                  );
                                  approvePropertyManager(
                                    property.property_manager[0].manager_id
                                  );
                                }}
                                style={bluePillButton}
                              >
                                Approve
                              </Button>
                            </Col>
                            <Col
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                marginBottom: "25px",
                              }}
                            >
                              <Button
                                // onClick={rejectPropertyManager}
                                onClick={() => {
                                  setShowDialog(true);
                                  setPmID(
                                    property.property_manager[0].manager_id
                                  );
                                }}
                                variant="outline-primary"
                                style={redPillButton}
                              >
                                Reject
                              </Button>
                            </Col>
                          </Row>
                        </Row>
                      ) : (
                        ""
                      )}

                      {expandAddManagerDocs ? (
                        <ManagerDocs
                          property={property}
                          addDocument={addContract}
                          selectContract={selectContract}
                          // reload={reloadProperty}
                          // setStage={setStage}
                        />
                      ) : (
                        ""
                      )}
                      <div className="d-flex mt-1">
                        <img
                          src={
                            expandAddManagerDocs ? BlueArrowUp : BlueArrowDown
                          }
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
                      className=" d-flex flex-column justify-content-center align-items-center"
                    >
                      <div className="d-flex mt-1">
                        <h6 style={mediumBold} className="mb-1">
                          Property Details
                        </h6>
                      </div>
                      {expandDetails ? (
                        <PropertyForm
                          property={property}
                          edit={editProperty}
                          setEdit={setEditProperty}
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
                  {property.maintenanceRequests.length > 0 ? (
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
                            Maintenance Requests
                          </h6>
                        </div>
                        {expandMaintenanceR ? (
                          <div
                            style={{ maxHeight: "220px", overflow: "scroll" }}
                          >
                            {property.maintenanceRequests.map((mr) => {
                              return (
                                <Row className="mx-2 mb-4 h-50">
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
                                        {new Date(
                                          mr.scheduled_date
                                        ).toLocaleDateString("en-us", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </Row>
                                    ) : mr.request_status === "SCHEDULED" ? (
                                      <Row
                                        style={{
                                          font: "normal normal normal 12px Bahnschrift-Regular",
                                          color: "#E3441F",
                                        }}
                                      >
                                        Scheduled for:{" "}
                                        {new Date(
                                          mr.scheduled_date
                                        ).toLocaleDateString("en-us", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
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
                            })}
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="d-flex mt-1">
                          <img
                            onClick={() =>
                              setExpandMaintenanceR(!expandMaintenanceR)
                            }
                            src={
                              expandMaintenanceR ? BlueArrowUp : BlueArrowDown
                            }
                            alt="Expand"
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
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
                      style={(mediumBold, { color: "#007AFF" })}
                      onClick={() => {
                        navigate(`/owner-appliances/${property.property_uid}`, {
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
              )}
            </Container>
          </div>{" "}
        </div>
      </div>
    )
  ) : (
    <div></div>
  );
}

export default PropertyView;
