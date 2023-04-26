import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import OwnerFooter from "./OwnerFooter";
import AppContext from "../../AppContext";
import MailDialogManager from "../MailDialog";
import MessageDialogManager from "../MessageDialog";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import BlueFilledBox from "../../icons/BlueFilledBox.svg";
import UnFilledBox from "../../icons/UnFilledBox.svg";
import Mail from "../../icons/Mail.svg";
import Verified from "../../icons/Verified.jpg";
import { get, put } from "../../utils/api";
import {
  mediumBold,
  smallImg,
  hidden,
  gray,
  pillButton,
} from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "2px 2px",
      border: "0.5px solid grey ",
      wordBreak: "break-word",
    },
    width: "100%",
    tableLayout: "fixed",
  },
});
function PropertyManagersList(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const { property_uid, property, reload } = props;
  const { userData, refresh, ably } = useContext(AppContext);
  const { access_token, user } = userData;
  const [propertyManagers, setPropertyManagers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  const [selectedManager, setSelectedManager] = useState("");
  const [showMailFormManager, setShowMailFormManager] = useState(false);
  const [showMessageFormManager, setShowMessageFormManager] = useState(false);
  const onCancelManagerMail = () => {
    setShowMailFormManager(false);
  };
  const onCancelManagerMessage = () => {
    setShowMessageFormManager(false);
  };
  const [selectedPropertyManagers, setSelectedPropertyManagers] =
    useState(null);
  const [stage, setStage] = useState("LIST");

  const [width, setWindowWidth] = useState(1024);
  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };
  const responsiveSidebar = {
    showSidebar: width > 1023,
  };
  const channel = ably.channels.get(`management_status`);

  const fetchProperties = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const response = await get(`/businesses?business_type=` + "MANAGEMENT");

    if (response.msg === "Token has expired") {
      refresh();
      return;
    }

    // console.log(response.result);
    setPropertyManagers(response.result);
    setSelectedPropertyManagers(response.result[0]);
    // console.log(selectedPropertyManagers);
    // await getAlerts(properties_unique)
  };

  useEffect(fetchProperties, [access_token]);
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  const updateBusiness = async () => {
    const files = JSON.parse(property.images);
    const business_uid = selectedPropertyManagers.business_uid;
    if (property.property_manager.length > 0) {
      // console.log("in if");
      for (const prop of property.property_manager) {
        if (
          business_uid === prop.manager_id &&
          prop.management_status === "REFUSED"
        ) {
          setShowDialog(true);
        } else {
          // console.log("here in else");
          const newProperty = {
            property_uid: property.property_uid,
            manager_id: business_uid,
            management_status: "FORWARDED",
          };
          for (let i = -1; i < files.length - 1; i++) {
            let key = `img_${i}`;
            if (i === -1) {
              key = "img_cover";
            }
            newProperty[key] = files[i + 1];
          }
          const response = await put("/properties", newProperty, null, files);
          channel.publish({ data: { te: newProperty } });
        }
      }
    } else if (property.property_manager.length === 0) {
      const newProperty = {
        property_uid: property.property_uid,
        manager_id: business_uid,
        management_status: "FORWARDED",
      };

      for (let i = -1; i < files.length - 1; i++) {
        let key = `img_${i}`;
        if (i === -1) {
          key = "img_cover";
        }
        newProperty[key] = files[i + 1];
      }
      const response = await put("/properties", newProperty, null, files);
      channel.publish({ data: { te: newProperty } });
    } else {
      // console.log("in else");
      if (
        business_uid === property.property_manager[0].manager_id &&
        property.property_manager[0].management_status === "REJECTED"
      ) {
        // console.log("here in if");
        setShowDialog(true);
        setStage("LIST");
      } else {
        const newProperty = {
          property_uid: property.property_uid,
          manager_id: business_uid,
          management_status: "FORWARDED",
        };

        const response = await put("/properties", newProperty, null, files);
        channel.publish({ data: { te: newProperty } });
        setStage("LIST");
      }
    }
    reload();
    setStage("LIST");
  };
  return stage === "LIST" ? (
    <div className="flex-1">
      <MailDialogManager
        title={"Email"}
        isOpen={showMailFormManager}
        senderPhone={user.phone_number}
        senderEmail={user.email}
        senderName={user.first_name + " " + user.last_name}
        requestCreatedBy={user.user_uid}
        userMessaged={selectedManager.business_uid}
        receiverEmail={selectedManager.business_email}
        receiverPhone={selectedManager.business_phone_number}
        onCancel={onCancelManagerMail}
      />

      <MessageDialogManager
        title={"Text Message"}
        isOpen={showMessageFormManager}
        senderPhone={user.phone_number}
        senderEmail={user.email}
        senderName={user.first_name + " " + user.last_name}
        requestCreatedBy={user.user_uid}
        userMessaged={selectedManager.business_uid}
        receiverEmail={selectedManager.business_email}
        receiverPhone={selectedManager.business_phone_number}
        onCancel={onCancelManagerMessage}
      />
      <div className="w-100  mb-5">
        <Row className="m-3">
          {propertyManagers.map((pm, i) => (
            <Container
              className="pt-1"
              style={{
                height: "100px",
              }}
            >
              <Row
                key={i}
                className="h-100"
                onClick={() => {
                  setStage("PMDETAILS");
                  setSelectedPropertyManagers(pm);
                }}
              >
                <Col xs={1}>
                  {property.property_manager.some(
                    (prop, i) => prop.linked_business_id === pm.business_uid
                  ) ? (
                    <img
                      src={Verified}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    ""
                  )}
                </Col>
                <Col className="ps-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0" style={{ fontWeight: "600" }}>
                      {pm.business_name}
                    </h5>
                  </div>
                  <div>
                    <p style={gray} className="mt-1 mb-0">
                      {pm.business_type}
                    </p>
                  </div>
                </Col>

                <Col>
                  <div className="d-flex  justify-content-end ">
                    <div
                      style={pm.business_uid ? {} : hidden}
                      onClick={stopPropagation}
                    >
                      <a href={`tel:${pm.business_phone_number}`}>
                        <img src={Phone} alt="Phone" style={smallImg} />
                      </a>
                      <a
                        onClick={() => {
                          setShowMessageFormManager(true);
                          setSelectedManager(pm);
                        }}
                      >
                        <img src={Message} alt="Message" style={smallImg} />
                      </a>
                      <a
                        // href={`mailto:${tf.tenantEmail}`}
                        onClick={() => {
                          setShowMailFormManager(true);
                          setSelectedManager(pm);
                        }}
                      >
                        <img src={Mail} alt="Mail" style={smallImg} />
                      </a>
                    </div>
                  </div>
                </Col>
                <hr />
              </Row>
            </Container>
          ))}
        </Row>
        <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-5">
          <OwnerFooter />
        </div>
      </div>
    </div>
  ) : stage === "PMDETAILS" ? (
    <div className="flex-1">
      <div className="w-100  mb-5">
        <div
          className="mx-2 my-2 p-3"
          style={{
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            borderRadius: "10px",
            opacity: 1,
          }}
        >
          <p style={mediumBold}>{selectedPropertyManagers.business_name}</p>

          <div
            className="m-2 p-2"
            style={{
              background: "#F3F3F3 0% 0% no-repeat padding-box",
              borderRadius: "5px",
            }}
          >
            Fees Charged:
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
                {JSON.parse(
                  selectedPropertyManagers.business_services_fees
                ).map((fee, i) => (
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
          <div
            className="m-2 p-2"
            style={{
              background: "#F3F3F3 0% 0% no-repeat padding-box",
              borderRadius: "5px",
            }}
          >
            Payment Details
            <Row>
              <Col xs={1}>
                {selectedPropertyManagers.business_paypal === null ? (
                  <img alt="unfilled box" src={UnFilledBox} />
                ) : (
                  <img alt="filled box" src={BlueFilledBox} />
                )}
              </Col>
              <Col>PayPal</Col>
            </Row>
            <Row>
              <Col xs={1}>
                {selectedPropertyManagers.business_apple_pay === null ? (
                  <img alt="unfilled box" src={UnFilledBox} />
                ) : (
                  <img alt="filled box" src={BlueFilledBox} />
                )}
              </Col>
              <Col>Apple Pay</Col>
            </Row>
            <Row>
              <Col xs={1}>
                {selectedPropertyManagers.business_zelle === null ? (
                  <img alt="unfilled box" src={UnFilledBox} />
                ) : (
                  <img alt="filled box" src={BlueFilledBox} />
                )}
              </Col>
              <Col>Zelle</Col>
            </Row>
            <Row>
              <Col xs={1}>
                {selectedPropertyManagers.business_venmo === null ? (
                  <img alt="unfilled box" src={UnFilledBox} />
                ) : (
                  <img alt="filled box" src={BlueFilledBox} />
                )}
              </Col>
              <Col>Venmo</Col>
            </Row>
            <Row>
              <Col xs={1}>
                {selectedPropertyManagers.business_account_number === null ? (
                  <img alt="unfilled box" src={UnFilledBox} />
                ) : (
                  <img alt="filled box" src={BlueFilledBox} />
                )}
              </Col>
              <Col>Checking Acct.</Col>
            </Row>
          </div>
          <div
            className="m-2 p-2"
            style={{
              background: "#F3F3F3 0% 0% no-repeat padding-box",
              borderRadius: "5px",
            }}
          >
            <Row>
              <Col>Locations of Service</Col>
              <Col xs={3}>(-)(+) miles</Col>
            </Row>
            {JSON.parse(selectedPropertyManagers.business_locations).map(
              (bl) => {
                return (
                  <Row>
                    <Col
                      className="m-2 p-2"
                      style={{
                        background: " #FFFFFF 0% 0% no-repeat padding-box",
                        boxShadow: " 0px 1px 6px #00000029",
                        borderRadius: "5px",
                      }}
                    >
                      {bl.location}
                    </Col>
                    <Col
                      xs={3}
                      className="m-2 p-2"
                      style={{
                        background: " #FFFFFF 0% 0% no-repeat padding-box",
                        boxShadow: " 0px 1px 6px #00000029",
                        borderRadius: "5px",
                      }}
                    >
                      {bl.distance}
                    </Col>
                  </Row>
                );
              }
            )}
          </div>
          <div
            className="m-2 p-2"
            style={{
              background: "#F3F3F3 0% 0% no-repeat padding-box",
              borderRadius: "5px",
            }}
          >
            <div> File a request</div>

            <Button
              variant="outline-primary"
              style={pillButton}
              className="mx-1"
              onClick={updateBusiness}
            >
              Request Quote from PM
            </Button>
            <Button
              variant="outline-primary"
              style={pillButton}
              className="mx-1"
              onClick={() => setStage("LIST")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default PropertyManagersList;
