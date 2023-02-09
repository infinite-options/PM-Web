import React, { useState, useEffect, useContext } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import * as ReactBootStrap from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import MailDialog from "../MailDialog";
import AppContext from "../../AppContext";
import File from "../../icons/File.svg";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import EditIconNew from "../../icons/EditIconNew.svg";
import { get, put } from "../../utils/api";
import {
  mediumBold,
  smallImg,
  redPillButton,
  bluePillButton,
  gray,
  squareForm,
  small,
} from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});
function PropertyManagerDocs(props) {
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  // console.log(user);
  let pageURL = window.location.href.split("/");

  const navigate = useNavigate();
  const {
    addDocument,
    property,
    selectContract,
    reload,
    fetchProperty,
    setShowDialog,
    endEarlyDate,
    setEndEarlyDate,
    cancel,
    setCancel,
    managerID,
    selectedBusiness,
    setSelectedBusiness,
  } = props;
  const [contracts, setContracts] = useState([]);
  // const [showDialog, setShowDialog] = useState(false);
  const [activeContract, setActiveContract] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [addPropertyManager, setAddPropertyManager] = useState(false);
  const [showMailForm, setShowMailForm] = useState(false);
  const onCancel = () => {
    setShowMailForm(false);
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
    for (let i = -1; i < files.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      updatedManagementContract[key] = files[i + 1];
    }

    await put("/cancelAgreement", updatedManagementContract, null, files);

    navigate("../manager");
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
    for (let i = -1; i < files.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      updatedManagementContract[key] = files[i + 1];
    }
    await put("/cancelAgreement", updatedManagementContract, null, files);
    fetchProperty();
  };
  const getContract = async () => {
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
    // console.log(response.result);
    const ac = response.result;

    // console.log(management_buid);

    if (response.result.length > 0) {
      ac.forEach((contract) => {
        if (contract.business_uid === management_buid) {
          // console.log("here");
          const aContract = contract;
          aContract.fees = JSON.parse(contract.contract_fees);
          aContract.contacts = JSON.parse(contract.assigned_contacts);
          aContract.docs = JSON.parse(contract.documents);
          // console.log(aContract);
          setActiveContract(aContract);
        }
      });
    }

    setContracts(response.result);
  };

  useEffect(() => {
    getContract();
  }, []);

  useEffect(async () => {
    const response = await get(`/businesses?business_type=MANAGEMENT`);
    setBusinesses(response.result);
    for (let i = 0; i < response.result.length; i++) {
      if (response.result[i].business_uid === managerID) {
        setSelectedBusiness(response.result[i]);
      }
    }
  }, []);
  // console.log("selectedBusiness", selectedBusiness);
  return (
    <div className="d-flex flex-column flex-grow-1 w-100 justify-content-center">
      <Row className="m-3">
        <Col>
          <h3>Property Owner Agreement</h3>
        </Col>
        {activeContract !== null ? (
          <Col xs={2}>
            <img
              src={EditIconNew}
              alt="Edit Icon"
              style={{
                width: "30px",
                height: "30px",
                float: "right",
                marginRight: "5rem",
              }}
              onClick={() => selectContract(activeContract)}
            />
          </Col>
        ) : (
          <Col xs={2}></Col>
        )}
      </Row>
      <MailDialog
        title={"Message"}
        isOpen={showMailForm}
        senderPhone={user.phone_number}
        senderEmail={user.email}
        senderName={user.first_name + " " + user.last_name}
        requestCreatedBy={user.user_uid}
        userMessaged={property.owner_id}
        receiverEmail={property.owner[0].owner_email}
        onCancel={onCancel}
      />

      {(property.management_status === "ACCEPTED" ||
        property.management_status === "SENT" ||
        property.management_status === "OWNER END EARLY" ||
        property.management_status === "PM END EARLY" ||
        property.management_status === "END EARLY") &&
      activeContract ? (
        <Row className="mx-2">
          <div>
            <Table
              responsive="md"
              classes={{ root: classes.customTable }}
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">Owner Name</TableCell>
                  <TableCell align="center">Contract Name</TableCell>
                  <TableCell align="center">Start Date</TableCell>
                  <TableCell align="center">End Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {property.owner[0].owner_first_name}{" "}
                    {property.owner[0].owner_last_name}
                  </TableCell>

                  <TableCell>
                    <Row>
                      <Col>
                        {" "}
                        {activeContract.contract_name
                          ? activeContract.contract_name
                          : "Unnamed Contract"}
                      </Col>
                      {/* <Col xs={2}>
                        <img
                          src={Edit}
                          alt="Edit"
                          style={{ width: "15px", height: "25px" }}
                          onClick={() => selectContract(activeContract)}
                        />
                      </Col> */}
                    </Row>
                  </TableCell>

                  <TableCell>{activeContract.start_date}</TableCell>
                  <TableCell>{activeContract.end_date}</TableCell>

                  <TableCell>
                    <Row>
                      <Col className="d-flex justify-content-center">
                        {" "}
                        <a href={`tel:${property.owner[0].owner_phone_number}`}>
                          <img src={Phone} alt="Phone" style={smallImg} />
                        </a>
                      </Col>
                      <Col className="d-flex justify-content-center">
                        <a onClick={() => setShowMailForm(true)}>
                          {/*  href={`mailto:${property.owner[0].owner_email}`}> */}
                          <img src={Message} alt="Message" style={smallImg} />
                        </a>
                      </Col>
                    </Row>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="my-4">
            <h5>Property Manager Fee Details</h5>

            <Table classes={{ root: classes.customTable }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fee Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Of</TableCell>
                  <TableCell>Frequency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeContract.fees.map((fee, i) => (
                  <TableRow key={i}>
                    <TableCell>{fee.fee_name}</TableCell>
                    <TableCell>
                      {fee.fee_type === "%"
                        ? `${fee.charge}%`
                        : `$${fee.charge}`}
                    </TableCell>
                    <TableCell>
                      {fee.fee_type === "%" ? `${fee.of}` : ""}
                    </TableCell>
                    <TableCell>{fee.frequency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {activeContract.contacts.length === 0 ? (
            ""
          ) : (
            <div className="my-4">
              <h5>Contact Details</h5>

              <Table classes={{ root: classes.customTable }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Contact Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone Number</TableCell>

                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeContract.contacts.map((contact, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {contact.first_name} {contact.last_name}
                      </TableCell>
                      <TableCell>{contact.company_role}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone_number}</TableCell>
                      <TableCell>
                        <a href={`tel:${contact.phone_number}`}>
                          <img src={Phone} alt="Phone" style={smallImg} />
                        </a>
                        <a href={`mailto:${contact.email}`}>
                          <img src={Message} alt="Message" style={smallImg} />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {activeContract.docs.length === 0 ? (
            ""
          ) : (
            <div className="my-3">
              <h5>Contract Documents</h5>

              <Table
                responsive="md"
                classes={{ root: classes.customTable }}
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Document Name</TableCell>
                    <TableCell>View Document</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeContract.docs.map((file) => {
                    return (
                      <TableRow>
                        <TableCell>{file.description}</TableCell>
                        <TableCell>
                          <a href={file.link} target="_blank" rel="noreferrer">
                            <img
                              src={File}
                              alt="open document"
                              style={{
                                width: "15px",
                                height: "15px",
                              }}
                            />
                          </a>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </Row>
      ) : (
        <div>
          <div className="w-100 d-flex flex-column justify-content-center align-items-center h-50">
            <ReactBootStrap.Spinner animation="border" role="status" />
          </div>
        </div>
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
      {activeContract !== null &&
      property.management_status === "PM END EARLY" ? (
        <Row className="d-flex flex-grow-1 w-100 justify-content-center mt-3 mb-4">
          <h6 className="d-flex justify-content-center" style={mediumBold}>
            You have requested to end the agreement early on{" "}
            {activeContract.early_end_date}
          </h6>
        </Row>
      ) : (
        ""
      )}
      {/* {console.log(activeContract)} */}
      {activeContract !== null &&
      property.management_status === "OWNER END EARLY" ? (
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
