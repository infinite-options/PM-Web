import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "../components/Header";
import PropertyCashFlow from "./PropertyCashFlow";
import PropertyForm from "./PropertyForm";
import CreateExpense from "./CreateExpense";
import CreateTax from "./CreateTax";
import CreateMortgage from "./CreateMortgage";
import ManagerDocs from "./ManagerDocs";
import LeaseDocs from "./LeaseDocs";
import ManagementContract from "./ManagementContract";
import TenantAgreement from "./TenantAgreement";
import ConfirmDialog from "./ConfirmDialog";
import File from "../icons/File.svg";
import ArrowUp from "../icons/ArrowUp.svg";
import ArrowDown from "../icons/ArrowDown.svg";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import { get, put } from "../utils/api";
import {
  tileImg,
  gray,
  bPill,
  redPill,
  orangePill,
  greenPill,
  mediumBold,
  mediumImg,
  bluePillButton,
  redPillButton,
} from "../utils/styles";
function PropertyView(props) {
  const { property_uid, back, reload, hideEdit } = props;
  const [property, setProperty] = useState({
    images: "[]",
  });
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
  };
  useState(() => {
    fetchProperty();
  });

  const [currentImg, setCurrentImg] = useState(0);
  const [expandDetails, setExpandDetails] = useState(false);
  const [editProperty, setEditProperty] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [showCreateTax, setShowCreateTax] = useState(false);
  const [showCreateMortgage, setShowCreateMortgage] = useState(false);
  const [expandManagerDocs, setExpandManagerDocs] = useState(false);
  const [expandLeaseDocs, setExpandLeaseDocs] = useState(false);
  const [showManagementContract, setShowManagementContract] = useState(false);
  const [showTenantAgreement, setShowTenantAgreement] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  // React.useEffect(async () => {
  //   const response = await get(
  //     `/contracts?property_uid=${property.property_uid}`
  //   );
  //   setContracts(response.result);
  // }, []);
  const headerBack = () => {
    editProperty
      ? setEditProperty(false)
      : showCreateExpense
      ? setShowCreateExpense(false)
      : showCreateTax
      ? setShowCreateTax(false)
      : showCreateMortgage
      ? setShowCreateMortgage(false)
      : back();
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
    showCreateTax,
    showCreateMortgage,
    showManagementContract,
    showTenantAgreement,
  ]);

  const reloadProperty = () => {
    setEditProperty(false);
    fetchProperty();
  };

  const cashFlowState = {
    setShowCreateExpense,
    setShowCreateTax,
    setShowCreateMortgage,
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
  const approvePropertyManager = async () => {
    const files = JSON.parse(property.images);
    if (property.property_manager.length > 0) {
      for (const prop of property.property_manager) {
        if (prop.management_status !== "REJECTED") {
          const updatedManagementContract = {
            property_uid: property.property_uid,
            management_status: "ACCEPTED",
            manager_id: prop.manager_id,
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
          setExpandManagerDocs(!expandManagerDocs);
          reloadProperty();
          //navigate("/tenant");
        }
      }
    } else {
      const updatedManagementContract = {
        property_uid: property.property_uid,
        management_status: "ACCEPTED",
        manager_id: property.property_manager[0].manager_id,
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
      setExpandManagerDocs(!expandManagerDocs);
      reloadProperty();
      //navigate("/tenant");
    }
  };

  const rejectPropertyManager = async () => {
    const files = JSON.parse(property.images);
    if (property.property_manager.length > 0) {
      for (const prop of property.property_manager) {
        if (prop.management_status !== "REJECTED") {
          const updatedManagementContract = {
            property_uid: property.property_uid,
            management_status: "REJECTED",
            manager_id: prop.manager_id,
          };
          // for (let i = -1; i < files.length - 1; i++) {
          //   let key = `img_${i}`;
          //   if (i === -1) {
          //     key = "img_cover";
          //   }
          //   updatedManagementContract[key] = files[i + 1];
          // }
          const response2 = await put(
            "/properties",
            updatedManagementContract,
            null,
            files
          );
          setShowDialog(false);
          setExpandManagerDocs(!expandManagerDocs);
          reloadProperty();
        }
      }

      //navigate("/tenant");
    } else {
      const updatedManagementContract = {
        property_uid: property.property_uid,
        management_status: "REJECTED",
        manager_id: property.property_manager[0].manager_id,
      };
      // for (let i = -1; i < files.length - 1; i++) {
      //   let key = `img_${i}`;
      //   if (i === -1) {
      //     key = "img_cover";
      //   }
      //   updatedManagementContract[key] = files[i + 1];
      // }
      const response2 = await put(
        "/properties",
        updatedManagementContract,
        null,
        files
      );
      setShowDialog(false);
      setExpandManagerDocs(!expandManagerDocs);
      reloadProperty();
      //navigate("/tenant");
    }
  };

  const onCancel = () => {
    setShowDialog(false);
  };
  console.log(property);
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
      <div className="pb-5 mb-5">
        <ConfirmDialog
          title={"Are you sure you want to reject this Property Manager?"}
          isOpen={showDialog}
          onConfirm={rejectPropertyManager}
          onCancel={onCancel}
        />

        <Header title="Properties" leftText="< Back" leftFn={headerBack} />
        <Container className="pb-5 mb-5">
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
          ) : (
            <div>
              <div
                style={{ ...tileImg, height: "200px", position: "relative" }}
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
                  style={{ position: "absolute", right: "5px", top: "90px" }}
                  onClick={nextImg}
                >
                  {">"}
                </div>
              </div>
              <h5 className="mt-2 mb-0" style={mediumBold}>
                ${property.listed_rent}/mo
              </h5>
              <p style={gray} className="mt-1 mb-2">
                {property.address}
                {property.unit !== "" ? ` ${property.unit}, ` : ", "}
                {property.city}, {property.state} {property.zip}
              </p>
              <div className="d-flex">
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
              <PropertyCashFlow property={property} state={cashFlowState} />

              <div onClick={() => setExpandDetails(!expandDetails)}>
                <div className="d-flex justify-content-between mt-3">
                  <h6 style={mediumBold} className="mb-1">
                    Details
                  </h6>
                  <img src={expandDetails ? ArrowUp : ArrowDown} alt="Expand" />
                </div>
                <hr style={{ opacity: 1 }} className="mt-1" />
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
              <div onClick={() => setExpandManagerDocs(!expandManagerDocs)}>
                <div className="d-flex justify-content-between mt-3">
                  <h6 style={mediumBold} className="mb-1">
                    Management Contract
                  </h6>
                  <img
                    src={expandManagerDocs ? ArrowUp : ArrowDown}
                    alt="Expand"
                  />
                </div>
                <hr style={{ opacity: 1 }} className="mt-1" />
              </div>
              {property.property_manager.length == 0 ? (
                ""
              ) : property.property_manager.length > 1 ? (
                property.property_manager.map((p, i) =>
                  p.management_status === "REJECTED" ? (
                    ""
                  ) : expandManagerDocs &&
                    p.management_status === "FORWARDED" ? (
                    <div>
                      <div className="d-flex justify-content-between mt-3">
                        <div>
                          <h6 style={mediumBold} className="mb-1">
                            {p.manager_business_name}
                          </h6>
                          <p
                            style={{ mediumBold, color: "blue" }}
                            className="mb-1"
                          >
                            Property Manager Selected
                          </p>
                        </div>
                        <div>
                          <a href={`tel:${p.manager_phone_number}`}>
                            <img src={Phone} alt="Phone" style={mediumImg} />
                          </a>
                          <a href={`mailto:${p.manager_email}`}>
                            <img
                              src={Message}
                              alt="Message"
                              style={mediumImg}
                            />
                          </a>
                        </div>
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
                          {" "}
                          <Button
                            // onClick={rejectPropertyManager}
                            onClick={() => setShowDialog(true)}
                            variant="outline-primary"
                            style={redPillButton}
                          >
                            Reject
                          </Button>
                        </Col>
                      </Row>
                      <hr style={{ opacity: 1 }} className="mt-1" />
                    </div>
                  ) : (
                    ""
                  )
                )
              ) : expandManagerDocs &&
                property.property_manager[0].management_status ===
                  "FORWARDED" ? (
                <div>
                  <div className="d-flex justify-content-between mt-3">
                    <div>
                      <h6 style={mediumBold} className="mb-1">
                        {property.property_manager[0].manager_business_name}
                      </h6>
                      <p style={{ mediumBold, color: "blue" }} className="mb-1">
                        Property Manager Selected
                      </p>
                    </div>
                    <div>
                      <a
                        href={`tel:${property.property_manager[0].manager_phone_number}`}
                      >
                        <img src={Phone} alt="Phone" style={mediumImg} />
                      </a>
                      <a
                        href={`mailto:${property.property_manager[0].manager_email}`}
                      >
                        <img src={Message} alt="Message" style={mediumImg} />
                      </a>
                    </div>
                  </div>
                  <Row className="mt-4">
                    {/* <Col
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      marginBottom: "25px",
                    }}
                  >
                    {" "}
                    <Button
                      // onClick={approvePropertyManager}
                      variant="outline-primary"
                      style={bluePillButton}
                    >
                      Approve
                    </Button>
                  </Col> */}
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
                        // onClick={rejectPropertyManager}
                        onClick={() => setShowDialog(true)}
                        variant="outline-primary"
                        style={redPillButton}
                      >
                        Reject
                      </Button>
                    </Col>
                  </Row>
                  <hr style={{ opacity: 1 }} className="mt-1" />
                </div>
              ) : (
                ""
              )}
              {property.property_manager.length == 0 ? (
                ""
              ) : property.property_manager.length > 1 ? (
                property.property_manager.map((p, i) =>
                  p.management_status === "REJECTED" ? (
                    ""
                  ) : expandManagerDocs && p.management_status === "SENT" ? (
                    <div>
                      <div className="d-flex justify-content-between mt-3">
                        <div>
                          <h6 style={mediumBold} className="mb-1">
                            {p.manager_business_name}
                          </h6>
                          <p
                            style={{ mediumBold, color: "#41fc03" }}
                            className="mb-1"
                          >
                            Contract in Review
                          </p>
                        </div>
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
                          {" "}
                          <Button
                            onClick={approvePropertyManager}
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
                          {" "}
                          <Button
                            // onClick={rejectPropertyManager}
                            onClick={() => setShowDialog(true)}
                            variant="outline-primary"
                            style={redPillButton}
                          >
                            Reject
                          </Button>
                        </Col>
                      </Row>
                      <hr style={{ opacity: 1 }} className="mt-1" />
                    </div>
                  ) : (
                    ""
                  )
                )
              ) : expandManagerDocs &&
                property.property_manager[0].management_status === "SENT" ? (
                <div>
                  <div className="d-flex justify-content-between mt-3">
                    <div>
                      <h6 style={mediumBold} className="mb-1">
                        {property.property_manager[0].manager_business_name}
                      </h6>
                      <p
                        style={{ mediumBold, color: "#41fc03" }}
                        className="mb-1"
                      >
                        Contract in Review
                      </p>
                    </div>
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
                      {" "}
                      <Button
                        onClick={approvePropertyManager}
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
                      {" "}
                      <Button
                        // onClick={rejectPropertyManager}
                        onClick={() => setShowDialog(true)}
                        variant="outline-primary"
                        style={redPillButton}
                      >
                        Reject
                      </Button>
                    </Col>
                  </Row>
                  <hr style={{ opacity: 1 }} className="mt-1" />
                </div>
              ) : (
                ""
              )}
              {expandManagerDocs &&
              property.management_status !== "ACCEPTED" ? (
                ""
              ) : expandManagerDocs && property.property_manager.length > 1 ? (
                property.property_manager.map((p, i) =>
                  p.management_status === "REJECTED" ? (
                    ""
                  ) : p.manager_business_name !== null &&
                    p.management_status === "ACCEPTED" ? (
                    <div>
                      <div className="d-flex justify-content-between mt-3">
                        <div>
                          <h6 style={mediumBold} className="mb-1">
                            {p.manager_business_name}
                          </h6>
                          <p
                            style={{ ...gray, ...mediumBold }}
                            className="mb-1"
                          >
                            Property Manager
                          </p>
                        </div>
                        <div>
                          <a href={`tel:${p.manager_phone_number}`}>
                            <img src={Phone} alt="Phone" style={mediumImg} />
                          </a>
                          <a href={`mailto:${p.manager_email}`}>
                            <img
                              src={Message}
                              alt="Message"
                              style={mediumImg}
                            />
                          </a>
                        </div>
                      </div>

                      <hr style={{ opacity: 1 }} className="mt-1" />
                    </div>
                  ) : (
                    ""
                  )
                )
              ) : expandManagerDocs &&
                property.property_manager[0].manager_business_name !== null &&
                property.property_manager[0].management_status ===
                  "ACCEPTED" ? (
                <div>
                  <div className="d-flex justify-content-between mt-3">
                    <div>
                      <h6 style={mediumBold} className="mb-1">
                        {property.property_manager[0].manager_business_name}
                      </h6>
                      <p style={{ ...gray, ...mediumBold }} className="mb-1">
                        Property Manager
                      </p>
                    </div>
                    <div>
                      <a
                        href={`tel:${property.property_manager[0].manager_phone_number}`}
                      >
                        <img src={Phone} alt="Phone" style={mediumImg} />
                      </a>
                      <a
                        href={`mailto:${property.property_manager[0].manager_email}`}
                      >
                        <img src={Message} alt="Message" style={mediumImg} />
                      </a>
                    </div>
                  </div>

                  <hr style={{ opacity: 1 }} className="mt-1" />
                </div>
              ) : (
                ""
              )}

              {expandManagerDocs ? (
                <ManagerDocs
                  property={property}
                  addDocument={addContract}
                  selectContract={selectContract}
                  reload={reloadProperty}
                />
              ) : (
                ""
              )}

              <div onClick={() => setExpandLeaseDocs(!expandLeaseDocs)}>
                <div className="d-flex justify-content-between mt-3">
                  <h6 style={mediumBold} className="mb-1">
                    Tenant Agreement
                  </h6>
                  <img
                    src={expandLeaseDocs ? ArrowUp : ArrowDown}
                    alt="Expand"
                  />
                </div>
                <hr style={{ opacity: 1 }} className="mt-1" />
              </div>
              {expandLeaseDocs ? (
                <LeaseDocs
                  property={property}
                  addDocument={addAgreement}
                  selectAgreement={selectAgreement}
                />
              ) : (
                ""
              )}
            </div>
          )}
        </Container>
      </div>
    )
  ) : (
    <div></div>
  );
}

export default PropertyView;
