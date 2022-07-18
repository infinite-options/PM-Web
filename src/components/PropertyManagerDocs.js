import React, { useState, useEffect, useContext } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";
import File from "../icons/File.svg";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import AppContext from "../AppContext";
import Edit from "../icons/Edit.svg";
import { get, put } from "../utils/api";
import {
  mediumBold,
  smallImg,
  redPillButton,
  bluePillButton,
  gray,
  squareForm,
  small,
} from "../utils/styles";

function PropertyManagerDocs(props) {
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;

  const navigate = useNavigate();
  const {
    addDocument,
    property,
    selectContract,
    reload,
    setExpandManagerDocs,
    fetchProperty,
    setShowDialog,
    endEarlyDate,
    setEndEarlyDate,
    cancel,
    setCancel,
  } = props;
  const [contracts, setContracts] = useState([]);
  // const [showDialog, setShowDialog] = useState(false);
  const [activeContract, setActiveContract] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [addPropertyManager, setAddPropertyManager] = useState(false);

  const updateBusiness = async () => {
    const files = JSON.parse(property.images);
    const business_uid = JSON.parse(selectedBusiness).business_uid;
    const newProperty = {
      property_uid: property.property_uid,
      manager_id: business_uid,
      management_status: "FORWARDED",
    };
    const response = await put("/properties", newProperty, null, files);
    setAddPropertyManager(false);
    reload();
  };

  const rejectManagement = async () => {
    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid;
    }
    const newProperty = {
      property_uid: property.property_uid,
      management_status: "REJECTED",
    };
    const files = JSON.parse(property.images);

    await put("/properties", newProperty, null, files);
    setExpandManagerDocs(false);
  };

  const acceptCancelAgreement = async () => {
    const files = JSON.parse(property.images);
    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid;
    }
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "PM ACCEPTED",
      manager_id: management_buid,
    };

    await put("/cancelAgreement", updatedManagementContract, null, files);
    setExpandManagerDocs(false);
    navigate("/manager-properties");
  };

  const rejectCancelAgreement = async () => {
    const files = JSON.parse(property.images);
    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid;
    }
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "PM REJECTED",
      manager_id: management_buid,
    };

    await put("/cancelAgreement", updatedManagementContract, null, files);
    setExpandManagerDocs(false);
    fetchProperty();
  };

  useEffect(async () => {
    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid;
    }
    const response = await get(
      `/contracts?property_uid=${property.property_uid}`
    );
    console.log(response.result);
    const ac = response.result;

    console.log(management_buid);
    if (response.result.length > 0) {
      ac.forEach((contract) => {
        if (contract.business_uid === management_buid) {
          console.log("here");
          const aContract = contract;
          aContract.fees = JSON.parse(contract.contract_fees);
          aContract.contacts = JSON.parse(contract.assigned_contacts);
          aContract.docs = JSON.parse(contract.documents);
          console.log(aContract);
          setActiveContract(aContract);
        }
      });
    }

    setContracts(response.result);
  }, []);
  useEffect(async () => {
    const response = await get(`/businesses?business_type=MANAGEMENT`);
    setBusinesses(response.result);
    setSelectedBusiness(JSON.stringify(response.result[0]));
  }, []);

  return (
    <div className="d-flex flex-column flex-grow-1 w-100 justify-content-center">
      {/* <ConfirmDialog
        title={"Are you sure you want to cancel the agreement?"}
        isOpen={showDialog}
        onConfirm={cancelAgreement}
        onCancel={onCancel}
      /> */}

      {(property.management_status === "ACCEPTED" ||
        property.management_status === "SENT" ||
        property.management_status === "OWNER END EARLY" ||
        property.management_status === "PM END EARLY" ||
        property.management_status === "END EARLY") &&
      activeContract ? (
        <Row className="mx-2">
          <Row className="flex-grow-1 my-2">
            <Col
              className=" d-flex align-items-left"
              style={{
                font: "normal normal 600 18px Bahnschrift-Regular",
              }}
            >
              Owner: {property.owner[0].owner_first_name}{" "}
              {property.owner[0].owner_last_name}
            </Col>
            <Col className="d-flex justify-content-end">
              <a href={`tel:${property.owner_phone_number}`}>
                <img src={Phone} alt="Phone" style={smallImg} />
              </a>
              <a href={`mailto:${property.owner_email}`}>
                <img src={Message} alt="Message" style={smallImg} />
              </a>
            </Col>
          </Row>

          <Row className="flex-grow-1">
            <Col className=" d-flex align-items-left">
              <p>
                {activeContract.contract_name
                  ? activeContract.contract_name
                  : "Unnamed Contract"}
              </p>
            </Col>
            <Col className="d-flex justify-content-end">
              <img
                src={Edit}
                alt="Edit"
                style={{ width: "15px", height: "25px" }}
                onClick={() => selectContract(activeContract)}
              />
            </Col>
          </Row>
          <Row className="mt-1">
            <Col
              style={{
                font: "normal normal 600 18px Bahnschrift-Regular",
              }}
            >
              Contract Length
            </Col>
          </Row>
          <Row className="mt-1">
            <Col
              className=" d-flex align-items-left"
              style={{
                font: "normal normal 600 18px Bahnschrift-Regular",
              }}
            >
              Start Date
            </Col>
            <Col className=" d-flex justify-content-end">
              <h6
                style={{
                  font: "normal normal normal 16px Bahnschrift-Regular",
                }}
              >
                {activeContract.start_date}
              </h6>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col
              className=" d-flex align-items-left"
              style={{
                font: "normal normal 600 18px Bahnschrift-Regular",
              }}
            >
              End Date
            </Col>
            <Col className=" d-flex justify-content-end">
              <h6
                style={{
                  font: "normal normal normal 16px Bahnschrift-Regular",
                }}
              >
                {activeContract.end_date}
              </h6>
            </Col>
          </Row>

          <Row className="my-1">
            <Row className="mt-1">
              <Col
                style={{
                  font: "normal normal 600 18px Bahnschrift-Regular",
                }}
              >
                Fees Charged
              </Col>
            </Row>
            {activeContract.fees.map((fee, i) => (
              <div key={i}>
                <Row className="mt-1">
                  <Col
                    style={{
                      font: "normal normal normal 16px Bahnschrift-Regular",
                    }}
                  >
                    {fee.fee_name}
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <p style={gray} className="mb-1">
                      {fee.fee_type === "%"
                        ? `${fee.charge}% of ${fee.of}`
                        : `$${fee.charge}`}{" "}
                      {fee.frequency}
                    </p>
                  </Col>
                </Row>
                {/*<hr className="mt-1" />*/}
              </div>
            ))}
          </Row>
          {activeContract.contacts.length === 0 ? (
            ""
          ) : (
            <Row className="my-4">
              <h6>Contact Details</h6>
              {activeContract.contacts.map((contact, i) => (
                <div key={i}>
                  <Row>
                    <Col>
                      <p className="mb-1">
                        {contact.first_name} {contact.last_name} (
                        {contact.company_role})
                      </p>
                    </Col>
                    <Col>
                      <p style={gray} className="mb-1">
                        {contact.phone_number}
                      </p>
                    </Col>
                    <Col>
                      <p style={gray} className="mb-1">
                        {contact.email}
                      </p>
                    </Col>
                  </Row>
                </div>
              ))}
            </Row>
          )}
          {activeContract.docs.length === 0 ? (
            ""
          ) : (
            <Row className="my-3">
              <h6>Contract Documents</h6>
              {activeContract.docs.map((file, i) => (
                <div key={i}>
                  <div className="d-flex justify-content-between align-items-end">
                    <div>
                      <p className="mb-1">{file.name}</p>
                      <p style={small} className="m-0">
                        {file.description}
                      </p>
                    </div>
                    <div>
                      <a href={file.link} target="_blank">
                        <img src={File} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </Row>
          )}
        </Row>
      ) : (
        ""
      )}

      {property.management_status === "FORWARDED" ? (
        <Row className="d-flex flex-grow-1 w-100 justify-content-center mt-3 mb-4">
          <Col className="d-flex justify-content-center">
            <Button
              variant="outline-primary"
              style={bluePillButton}
              onClick={addDocument}
            >
              Create Contract
            </Button>
          </Col>
          <Col className="d-flex justify-content-center">
            <Button
              variant="outline-primary"
              style={redPillButton}
              onClick={rejectManagement}
            >
              Reject
            </Button>
          </Col>
        </Row>
      ) : (
        ""
      )}

      {property.management_status === "SENT" ? (
        <Row className="d-flex flex-grow-1 w-100 justify-content-center mt-3 mb-4">
          <Col className="d-flex justify-content-center mb-1">
            <Button
              variant="outline-primary"
              style={redPillButton}
              onClick={rejectManagement}
            >
              Withdraw
            </Button>
          </Col>
        </Row>
      ) : (
        ""
      )}

      {property.management_status === "ACCEPTED" && !cancel ? (
        <Row className="d-flex flex-grow-1 w-100 justify-content-center mt-3 mb-4">
          <Col className="d-flex justify-content-center mb-1">
            <Button
              variant="outline-primary"
              style={redPillButton}
              // onClick={cancelAgreement}
              // onClick={() => setShowDialog(true)}
              onClick={() => setCancel(true)}
            >
              Cancel Agreement
            </Button>
          </Col>
        </Row>
      ) : (
        ""
      )}
      {property.management_status === "ACCEPTED" && cancel ? (
        <Row className="d-flex flex-grow-1 w-100 justify-content-center mt-3 mb-4">
          <Col></Col>
          <Col
            xs={6}
            className="d-flex flex-column justify-content-center mb-1"
          >
            <Form.Group className="mx-2 mb-3">
              <Form.Label as="h6">Early End Date</Form.Label>
              <Form.Control
                style={squareForm}
                type="date"
                value={endEarlyDate}
                onChange={(e) => setEndEarlyDate(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="outline-primary"
              style={redPillButton}
              // onClick={cancelAgreement}
              onClick={() => setShowDialog(true)}
              // onClick={() => setCancel(true)}
            >
              Cancel Agreement
            </Button>
          </Col>
          <Col></Col>
        </Row>
      ) : (
        ""
      )}
      {property.management_status === "PM END EARLY" ? (
        <Row className="d-flex flex-grow-1 w-100 justify-content-center mt-3 mb-4">
          <h6 className="d-flex justify-content-center" style={mediumBold}>
            You have requested to end the agreement early on{" "}
            {activeContract.early_end_date}
          </h6>
        </Row>
      ) : (
        ""
      )}

      {property.management_status === "OWNER END EARLY" ? (
        <Row className="d-flex flex-grow-1 w-100 justify-content-center mt-3 mb-4">
          <h6 className="d-flex justify-content-center" style={mediumBold}>
            Owner requested to end the agreement <br /> early on{" "}
            {activeContract.early_end_date}
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

      {/*<hr style={{ opacity: 1 }} className="mt-1" />*/}
    </div>
  );
}

export default PropertyManagerDocs;
