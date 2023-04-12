import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableSortLabel,
  Box,
  Grid,
} from "@material-ui/core";
import Carousel from "react-multi-carousel";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import Header from "../Header";
import SideBar from "./SideBar";
import AppContext from "../../AppContext";
import TenantFooter from "./TenantFooter";
import MailDialogManager from "../MailDialog";
import MessageDialogManager from "../MessageDialog";
import ImageModal from "../ImageModal";
import PropertyIcon from "../../icons/PropertyIcon.svg";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import Mail from "../../icons/Mail.svg";
import { get } from "../../utils/api";
import { bluePillButton, sidebarStyle, smallImg } from "../../utils/styles";

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

function PropertyApplicationView(props) {
  const classes = useStyles();
  const { property_uid } = useParams();
  const { forPropertyLease } = props;
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [property, setProperty] = React.useState(null);
  const [openImage, setOpenImage] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const applianceState = useState({
    Microwave: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      url: "",
    },
    Dishwasher: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      url: "",
    },
    Refrigerator: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      url: "",
    },
    Washer: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      url: "",
    },
    Dryer: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      url: "",
    },
    Range: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      url: "",
    },
  });
  const [selectedManager, setSelectedManager] = useState("");
  const [showMailFormManager, setShowMailFormManager] = useState(false);
  const [showMessageFormManager, setShowMessageFormManager] = useState(false);
  const onCancelManagerMail = () => {
    setShowMailFormManager(false);
  };
  const onCancelManagerMessage = () => {
    setShowMessageFormManager(false);
  };
  const appliances = Object.keys(applianceState[0]);
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 3000, min: 1560 },
      items: 5,
    },

    desktop: {
      breakpoint: { max: 1560, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const [width, setWindowWidth] = useState(0);
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
  const showImage = (src) => {
    setOpenImage(true);
    setImageSrc(src);
  };
  const unShowImage = () => {
    setOpenImage(false);
    setImageSrc(null);
  };
  useEffect(() => {
    const fetchProperty = async () => {
      const response = await get(`/propertyInfo?property_uid=${property_uid}`);
      setProperty(response.result[0]);
      applianceState[1](JSON.parse(response.result[0].appliances));
    };
    fetchProperty();
  }, []);
  // console.log("propertyApplicationView", property);
  // console.log(forPropertyLease, property, width);
  return (
    <div className="w-100 overflow-hidden p-0 m-0">
      <MailDialogManager
        title={"Email"}
        isOpen={showMailFormManager}
        senderPhone={user.phone_number}
        senderEmail={user.email}
        senderName={user.first_name + " " + user.last_name}
        requestCreatedBy={user.user_uid}
        userMessaged={selectedManager.manager_id}
        receiverEmail={selectedManager.manager_email}
        receiverPhone={selectedManager.manager_phone_number}
        onCancel={onCancelManagerMail}
      />

      <MessageDialogManager
        title={"Text Message"}
        isOpen={showMessageFormManager}
        senderPhone={user.phone_number}
        senderEmail={user.email}
        senderName={user.first_name + " " + user.last_name}
        requestCreatedBy={user.user_uid}
        userMessaged={selectedManager.manager_id}
        receiverEmail={selectedManager.manager_email}
        receiverPhone={selectedManager.manager_phone_number}
        onCancel={onCancelManagerMessage}
      />

      <Row
        className="mb-5"
        style={{
          maxWidth: forPropertyLease
            ? "100%"
            : width < 1024 && !forPropertyLease
            ? "100%"
            : property !== null && JSON.parse(property.images).length < 4
            ? "100%"
            : "86%",
        }}
      >
        {forPropertyLease ? (
          ""
        ) : (
          <Col
            xs={2}
            hidden={!responsiveSidebar.showSidebar}
            style={sidebarStyle}
          >
            <SideBar />
          </Col>
        )}

        <Col className="w-100">
          {forPropertyLease ? (
            ""
          ) : (
            <div>
              <Header
                title="Application"
                leftText="< Back"
                leftFn={() => navigate("/tenantAvailableProperties")}
              />
              <p
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "20px",
                }}
              >
                Let's Start the Application Process
              </p>
            </div>
          )}
          <ImageModal
            src={imageSrc}
            isOpen={openImage}
            onCancel={unShowImage}
          />

          <Row className=" d-flex align-items-center justify-content-center m-3">
            {property && JSON.parse(property.images).length === 0 ? (
              <img
                src={PropertyIcon}
                alt="Property"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
            ) : property && JSON.parse(property.images).length > 4 ? (
              <Carousel
                responsive={responsive}
                infinite={true}
                arrows={true}
                partialVisible={false}
                // className=" d-flex align-items-center justify-content-center"
              >
                {JSON.parse(property.images).map((image) => {
                  return (
                    // <div className="d-flex align-items-center justify-content-center">
                    <img
                      // key={Date.now()}
                      src={`${image}?${Date.now()}`}
                      onClick={() => showImage(`${image}?${Date.now()}`)}
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    // </div>
                  );
                })}
              </Carousel>
            ) : property && JSON.parse(property.images).length < 4 ? (
              <Carousel
                responsive={responsive}
                infinite={true}
                arrows={true}
                partialVisible={false}
                className=" d-flex align-items-center justify-content-center"
              >
                {JSON.parse(property.images).map((image) => {
                  return (
                    <div className="d-flex align-items-center justify-content-center">
                      <img
                        // key={Date.now()}
                        src={`${image}?${Date.now()}`}
                        onClick={() => showImage(`${image}?${Date.now()}`)}
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  );
                })}
              </Carousel>
            ) : (
              ""
            )}
          </Row>

          {property ? (
            <div
              className="mx-3 my-3 p-2 "
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="m-3 ">
                <Col>
                  <h3>Property Summary</h3>
                </Col>
                <Col></Col>
              </Row>

              <Row className="m-3" style={{ overflow: "scroll" }}>
                <Table
                  classes={{ root: classes.customTable }}
                  size="small"
                  responsive="md"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell> Property Images</TableCell>
                      <TableCell>Street Address</TableCell>
                      <TableCell>City,State</TableCell>
                      <TableCell>Zip</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Rent</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={property.property_uid}
                    >
                      <TableCell padding="none" size="small" align="center">
                        {JSON.parse(property.images).length > 0 ? (
                          <img
                            key={Date.now()}
                            src={`${
                              JSON.parse(property.images)[0]
                            }?${Date.now()}`}
                            alt="Property"
                            style={{
                              borderRadius: "4px",
                              objectFit: "cover",
                              width: "100px",
                              height: "100px",
                            }}
                          />
                        ) : (
                          <img
                            src={PropertyIcon}
                            alt="Property"
                            style={{
                              borderRadius: "4px",
                              objectFit: "cover",
                              width: "100px",
                              height: "100px",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {property.address}
                        {property.unit !== "" ? " " + property.unit : ""}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {property.city}, {property.state}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {property.zip}
                      </TableCell>

                      <TableCell padding="none" size="small" align="center">
                        {property.property_type}
                      </TableCell>

                      <TableCell padding="none" size="small" align="center">
                        {property.num_beds + "/" + property.num_baths}
                      </TableCell>

                      <TableCell padding="none" size="small" align="center">
                        {"$" + property.listed_rent}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Row>
            </div>
          ) : (
            ""
          )}
          {property ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="m-3">
                <Col>
                  <h3>Appliances</h3>
                </Col>
                <Col></Col>
              </Row>
              <Row className="m-3">
                <Table
                  responsive="md"
                  classes={{ root: classes.customTable }}
                  size="small"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Appliance</TableCell>
                      <TableCell>Manufacturer</TableCell>

                      <TableCell>Images</TableCell>
                    </TableRow>
                  </TableHead>
                  {/* {console.log("appliances", appliances, applianceState)} */}
                  <TableBody>
                    {appliances.map((appliance, i) => {
                      return applianceState[0][appliance]["available"] ==
                        true ||
                        applianceState[0][appliance]["available"] === "True" ? (
                        <TableRow>
                          <TableCell>{appliance}</TableCell>
                          <TableCell>
                            {applianceState[0][appliance]["anufacturer"]}
                          </TableCell>

                          {applianceState[0][appliance]["images"] !==
                            undefined &&
                          applianceState[0][appliance]["images"].length > 0 ? (
                            <TableCell>
                              <Row className="d-flex justify-content-center align-items-center p-1">
                                <Col className="d-flex justify-content-center align-items-center p-0 m-0">
                                  <img
                                    key={Date.now()}
                                    src={`${
                                      applianceState[0][appliance]["images"][0]
                                    }?${Date.now()}`}
                                    style={{
                                      borderRadius: "4px",
                                      objectFit: "contain",
                                      width: "50px",
                                      height: "50px",
                                    }}
                                    onClick={() =>
                                      showImage(
                                        `${
                                          applianceState[0][appliance][
                                            "images"
                                          ][0]
                                        }?${Date.now()}`
                                      )
                                    }
                                    alt="Property"
                                  />
                                </Col>
                              </Row>
                            </TableCell>
                          ) : (
                            <TableCell>None</TableCell>
                          )}
                        </TableRow>
                      ) : (
                        ""
                      );
                    })}
                  </TableBody>
                </Table>
              </Row>
            </div>
          ) : (
            ""
          )}
          {property ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              {" "}
              <Row className="m-3">
                <Col>
                  <h3>Other Info</h3>
                </Col>
              </Row>
              <Row className="m-3">
                <Table
                  classes={{ root: classes.customTable }}
                  size="small"
                  responsive="md"
                >
                  <TableRow>
                    <TableCell>Pets Allowed</TableCell>
                    <TableCell>
                      {property.pets_allowed === 0 ? "No" : "Yes"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      Deposit can be used for last month's rent
                    </TableCell>
                    <TableCell>
                      {property.deposit_for_rent === 0 ? "No" : "Yes"}
                    </TableCell>
                  </TableRow>
                </Table>
              </Row>
              <Row className="m-3">
                <Table
                  classes={{ root: classes.customTable }}
                  size="small"
                  responsive="md"
                >
                  <TableRow>
                    <TableCell>Utilities</TableCell>

                    <TableCell>Paid by</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Electricity</TableCell>
                    <TableCell>
                      {JSON.parse(property.utilities)["Electricity"]
                        ? "Owner"
                        : "Tenant"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Trash</TableCell>
                    <TableCell>
                      {JSON.parse(property.utilities)["Trash"]
                        ? "Owner"
                        : "Tenant"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Water</TableCell>
                    <TableCell>
                      {JSON.parse(property.utilities)["Water"]
                        ? "Owner"
                        : "Tenant"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Wifi </TableCell>
                    <TableCell>
                      {JSON.parse(property.utilities)["Wifi"]
                        ? "Owner"
                        : "Tenant"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gas</TableCell>
                    <TableCell>
                      {JSON.parse(property.utilities)["Gas"]
                        ? "Owner"
                        : "Tenant"}
                    </TableCell>
                  </TableRow>
                </Table>
              </Row>
            </div>
          ) : (
            ""
          )}
          {property ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <Row className="m-3">
                <Col>
                  <h3>Property Manager Info</h3>
                </Col>
              </Row>
              <Row className="m-3">
                <Table
                  classes={{ root: classes.customTable }}
                  size="small"
                  responsive="md"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Manager Business</TableCell>
                      <TableCell>Manager Email</TableCell>
                      <TableCell>Manager Phone</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      {" "}
                      <TableCell>{property.manager_business_name}</TableCell>
                      <TableCell>{property.manager_email}</TableCell>
                      <TableCell>{property.manager_phone_number}</TableCell>
                      <TableCell>
                        {" "}
                        <a href={`tel:${property.manager_phone_number}`}>
                          <img src={Phone} alt="Phone" style={smallImg} />
                        </a>
                        <a
                          onClick={() => {
                            setShowMessageFormManager(true);
                            setSelectedManager(property);
                          }}
                        >
                          <img src={Message} alt="Message" style={smallImg} />
                        </a>
                        <a
                          // href={`mailto:${tf.tenantEmail}`}
                          onClick={() => {
                            setShowMailFormManager(true);
                            setSelectedManager(property);
                          }}
                        >
                          <img src={Mail} alt="Mail" style={smallImg} />
                        </a>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Row>
            </div>
          ) : (
            ""
          )}
          {/* {console.log(forPropertyLease)} */}
          {/* ====================  < Button >==================================== */}
          {!property && forPropertyLease ? (
            ""
          ) : property && forPropertyLease ? (
            ""
          ) : (
            <Row className="mt-4 mb04">
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
                  onClick={() =>
                    navigate(`/reviewTenantProfile/${property_uid}`)
                  }
                  variant="outline-primary"
                  style={{ ...bluePillButton, margin: "0 24%" }}
                >
                  Start Application to rent
                </Button>
              </Col>
            </Row>
          )}
          {forPropertyLease ? (
            ""
          ) : (
            <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
              <TenantFooter />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default PropertyApplicationView;
