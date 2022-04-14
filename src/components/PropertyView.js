import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "../components/Header";
import {
  tileImg,
  gray,
  orangePill,
  greenPill,
  mediumBold,
  mediumImg,
  bluePillButton,
  redPillButton,
} from "../utils/styles";
import PropertyCashFlow from "./PropertyCashFlow";
import PropertyForm from "./PropertyForm";
import ArrowUp from "../icons/ArrowUp.svg";
import ArrowDown from "../icons/ArrowDown.svg";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import CreateExpense from "./CreateExpense";
import CreateTax from "./CreateTax";
import CreateMortgage from "./CreateMortgage";
import ManagerDocs from "./ManagerDocs";
import LeaseDocs from "./LeaseDocs";
import ManagementContract from "./ManagementContract";
import TenantAgreement from "./TenantAgreement";
import { get, put } from "../utils/api";

function PropertyView(props) {
  const { property_uid, back, reload, hideEdit } = props;
  const [property, setProperty] = React.useState({
    images: "[]",
  });
  const fetchProperty = async () => {
    const response = await get(`/propertyInfo?property_uid=${property_uid}`);
    setProperty(response.result[0]);
  };
  React.useState(() => {
    fetchProperty();
  });

  const [currentImg, setCurrentImg] = React.useState(0);
  const [expandDetails, setExpandDetails] = React.useState(false);
  const [editProperty, setEditProperty] = React.useState(false);
  const [showCreateExpense, setShowCreateExpense] = React.useState(false);
  const [showCreateTax, setShowCreateTax] = React.useState(false);
  const [showCreateMortgage, setShowCreateMortgage] = React.useState(false);
  const [expandManagerDocs, setExpandManagerDocs] = React.useState(false);
  const [expandLeaseDocs, setExpandLeaseDocs] = React.useState(false);
  const [showManagementContract, setShowManagementContract] =
    React.useState(false);
  const [showTenantAgreement, setShowTenantAgreement] = React.useState(false);
  const [selectedContract, setSelectedContract] = React.useState(null);
  const [selectedAgreement, setSelectedAgreement] = React.useState(null);

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

  React.useEffect(() => {
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
    // const updatedRental = {
    //     // rental_uid: filteredRentals[0].rental_uid,
    //     rental_uid: rentals[0].rental_uid,
    //     rental_status: 'ACTIVE'
    // }
    // const response1 = await put('/rentals', updatedRental , null, []);
    const files = JSON.parse(property.images);

    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "ACCEPTED",
      manager_id: property.manager_id,
    };
    for (let i = -1; i < files.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      updatedManagementContract[key] = files[i + 1];
    }
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
  };

  const rejectPropertyManager = async () => {
    const files = JSON.parse(property.images);

    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "REJECTED",
      manager_id: property.manager_id,
    };
    for (let i = -1; i < files.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      updatedManagementContract[key] = files[i + 1];
    }
    const response2 = await put(
      "/properties",
      updatedManagementContract,
      null,
      files
    );
    reloadProperty();
    setExpandManagerDocs(!expandManagerDocs);
    //navigate("/tenant");
  };
  return showManagementContract ? (
    <ManagementContract
      back={closeContract}
      property={property}
      contract={selectedContract}
    />
  ) : showTenantAgreement ? (
    <TenantAgreement
      back={closeAgreement}
      property={property}
      agreement={selectedAgreement}
    />
  ) : (
    <div>
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
          <CreateExpense back={() => setShowCreateExpense(false)} />
        ) : showCreateTax ? (
          <CreateTax back={() => setShowCreateTax(false)} />
        ) : showCreateMortgage ? (
          <CreateMortgage back={() => setShowCreateMortgage(false)} />
        ) : (
          <div>
            <div style={{ ...tileImg, height: "200px", position: "relative" }}>
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
              {property.rental_uid !== null ? (
                <p style={greenPill} className="mb-0">
                  Rented
                </p>
              ) : (
                <p style={orangePill} className="mb-0">
                  Not Rented
                </p>
              )}
            </div>
            <PropertyCashFlow property={property} state={cashFlowState} />
            {property.manager_business_name !== null &&
            property.management_status === "ACCEPTED" ? (
              <div>
                <div className="d-flex justify-content-between mt-3">
                  <div>
                    <h6 style={mediumBold} className="mb-1">
                      {property.manager_business_name}
                    </h6>
                    <p style={{ ...gray, ...mediumBold }} className="mb-1">
                      Property Manager
                    </p>
                  </div>
                  <div>
                    <a href={`tel:${property.manager_phone_number}`}>
                      <img src={Phone} alt="Phone" style={mediumImg} />
                    </a>
                    <a href={`mailto:${property.manager_email}`}>
                      <img src={Message} alt="Message" style={mediumImg} />
                    </a>
                  </div>
                </div>
                <hr style={{ opacity: 1 }} className="mt-1" />
              </div>
            ) : (
              ""
            )}
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
            {expandManagerDocs && property.management_status === "FORWARDED" ? (
              <div>
                <div className="d-flex justify-content-between mt-3">
                  <div>
                    <h6 style={mediumBold} className="mb-1">
                      {property.manager_business_name}
                    </h6>
                    <p style={{ mediumBold, color: "blue" }} className="mb-1">
                      {property.management_status}
                    </p>
                  </div>
                  <div>
                    <a href={`tel:${property.manager_phone_number}`}>
                      <img src={Phone} alt="Phone" style={mediumImg} />
                    </a>
                    <a href={`mailto:${property.manager_email}`}>
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
                      onClick={rejectPropertyManager}
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
            {expandManagerDocs && property.management_status === "SENT" ? (
              <div>
                <div className="d-flex justify-content-between mt-3">
                  <div>
                    <h6 style={mediumBold} className="mb-1">
                      {property.manager_business_name}
                    </h6>
                    <p
                      style={{ mediumBold, color: "#41fc03" }}
                      className="mb-1"
                    >
                      {property.management_status}
                    </p>
                  </div>
                  <div>
                    <a href={`tel:${property.manager_phone_number}`}>
                      <img src={Phone} alt="Phone" style={mediumImg} />
                    </a>
                    <a href={`mailto:${property.manager_email}`}>
                      <img src={Message} alt="Message" style={mediumImg} />
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
                      onClick={rejectPropertyManager}
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
                <img src={expandLeaseDocs ? ArrowUp : ArrowDown} alt="Expand" />
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
  );
}

export default PropertyView;
