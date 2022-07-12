import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import File from "../icons/File.svg";
import { get, put } from "../utils/api";
import {
  pillButton,
  smallPillButton,
  mediumBold,
  smallImg,
  redPillButton,
  bluePillButton,
  mediumImg,
  gray,
  headings,
  small,
} from "../utils/styles";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import AppContext from "../AppContext";
import EditIcon from "../icons/EditIcon.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";
import Edit from "../icons/Edit.svg";

function PropertyManagerDocs(props) {
  const { userData, refresh } = React.useContext(AppContext);
  const { access_token, user } = userData;

  const {
    addDocument,
    property,
    selectContract,
    reload,
    setExpandManagerDocs,
  } = props;
  const [contracts, setContracts] = React.useState([]);
  const [activeContract, setActiveContract] = React.useState(null);
  const [businesses, setBusinesses] = React.useState([]);
  const [selectedBusiness, setSelectedBusiness] = React.useState(null);
  const [addPropertyManager, setAddPropertyManager] = React.useState(false);

  const updateBusiness = async () => {
    const files = JSON.parse(property.images);
    const business_uid = JSON.parse(selectedBusiness).business_uid;
    const newProperty = {
      property_uid: property.property_uid,
      manager_id: business_uid,
      management_status: "FORWARDED",
    };
    // for (let i = -1; i < files.length-1; i++) {
    //     let key = `img_${i}`;
    //     if (i === -1) {
    //         key = 'img_cover';
    //     }
    //     newProperty[key] = files[i+1];
    // }
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
      // manager_id: management_buid,
      management_status: "REJECTED",
    };
    const files = JSON.parse(property.images);
    // for (let i = -1; i < files.length-1; i++) {
    //     let key = `img_${i}`;
    //     if (i === -1) {
    //         key = 'img_cover';
    //     }
    //     newProperty[key] = files[i+1];
    // }
    await put("/properties", newProperty, null, files);
    setExpandManagerDocs(false);
  };

  React.useEffect(async () => {
    const response = await get(
      `/contracts?property_uid=${property.property_uid}`
    );
    console.log(response.result);
    const ac = response.result[0];
    ac.fees = JSON.parse(ac.contract_fees);
    ac.contacts = JSON.parse(ac.assigned_contacts);
    ac.docs = JSON.parse(ac.documents);
    console.log("134", ac);
    setActiveContract(ac);
    setContracts(response.result);
  }, []);
  React.useEffect(async () => {
    const response = await get(`/businesses?business_type=MANAGEMENT`);
    setBusinesses(response.result);
    setSelectedBusiness(JSON.stringify(response.result[0]));
  }, []);

  return (
    <div className="d-flex flex-column gap-2">
      {/*<Row className="mb-2" style={{...headings}}>*/}
      {/*  <div>Active Contract</div>*/}
      {/*</Row>*/}

      {(property.management_status === "ACCEPTED" ||
        property.management_status === "SENT") &&
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

      <div className="md-flex flex-column gap-2">
        <div>
          {property.management_status === "FORWARDED" ? (
            <Row className="mt-3 mb-4">
              <Col className="d-flex flex-row justify-content-evenly mb-1">
                <Button
                  variant="outline-primary"
                  style={bluePillButton}
                  onClick={addDocument}
                >
                  Create Contract
                </Button>
              </Col>
              <Col className="d-flex flex-row justify-content-evenly mb-1">
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
            <Row className="mt-3 mb-4">
              <Col className="d-flex flex-row justify-content-evenly mb-1">
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

          {/*<hr style={{ opacity: 1 }} className="mt-1" />*/}
        </div>
      </div>
    </div>
  );
}

export default PropertyManagerDocs;
