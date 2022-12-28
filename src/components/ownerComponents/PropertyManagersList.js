import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Header";
import SideBar from "./SideBar";
import OwnerFooter from "./OwnerFooter";
import AppContext from "../../AppContext";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import BlueFilledBox from "../../icons/BlueFilledBox.svg";
import UnFilledBox from "../../icons/UnFilledBox.svg";
import Mail from "../../icons/Mail.svg";
import { get, put } from "../../utils/api";
import {
  mediumBold,
  xSmall,
  blue,
  smallImg,
  hidden,
  gray,
  pillButton,
} from "../../utils/styles";

function PropertyManagersList(props) {
  const navigate = useNavigate();

  const location = useLocation();
  // const { back, property_uid, property, reload } = props;

  const property_uid = location.state.property_uid;

  const property = location.state.property;
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [propertyManagers, setPropertyManagers] = useState([]);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedPropertyManagers, setSelectedPropertyManagers] =
    useState(null);
  const [stage, setStage] = React.useState("LIST");

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
    console.log(selectedPropertyManagers);
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
      console.log("in if");
      for (const prop of property.property_manager) {
        if (
          business_uid === prop.manager_id &&
          prop.management_status === "REFUSED"
        ) {
          console.log("here in if");

          // alert("youve already rejected this Management Company");
          setShowDialog(true);
          navigate(`/propertyDetails/${property_uid}`, {
            state: {
              property_uid: property_uid,
            },
          });
        } else {
          console.log("here in else");
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
          //   setAddPropertyManager(false);
          navigate(`/propertyDetails/${property_uid}`, {
            state: {
              property_uid: property_uid,
            },
          });
          setStage("LIST");
        }
      }
    } else if (property.property_manager.length == 0) {
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
      //   setAddPropertyManager(false);
      // reload();
      setStage("LIST");
    } else {
      console.log("in else");
      if (
        business_uid === property.property_manager[0].manager_id &&
        property.property_manager[0].management_status === "REJECTED"
      ) {
        console.log("here in if");
        setShowDialog(true);
        setStage("LIST");
        // alert("youve already rejected this Management Company");
      } else {
        console.log("here in else");
        const newProperty = {
          property_uid: property.property_uid,
          manager_id: business_uid,
          management_status: "FORWARDED",
        };
        // for (let i = -1; i < files.length - 1; i++) {
        //   let key = `img_${i}`;
        //   if (i === -1) {
        //     key = "img_cover";
        //   }
        //   newProperty[key] = files[i + 1];
        // }
        const response = await put("/properties", newProperty, null, files);
        // setAddPropertyManager(false);
        // navigate(`/propertyDetails/${property_uid}`);
        setStage("LIST");
      }
      setStage("LIST");
    }
  };

  return stage === "LIST" ? (
    <div className="flex-1">
      <div
        hidden={!responsiveSidebar.showSidebar}
        style={{
          backgroundColor: "#229ebc",
          width: "11rem",
          minHeight: "100%",
        }}
      >
        <SideBar />
      </div>
      <div className="w-100  mb-5">
        <Header
          title="Property Managers"
          leftText="< Back"
          leftFn={() =>
            navigate(`/propertyDetails/${property.property_uid}`, {
              state: {
                property_uid: property.property_uid,
              },
            })
          }
        />
        <Row className="m-3">
          {propertyManagers.map((property, i) => (
            <Container key={i} className="pt-1" style={{ height: "100px" }}>
              <Row
                className="h-100"
                onClick={() => {
                  setStage("PMDETAILS");
                  setSelectedPropertyManagers(property);
                }}
              >
                <Col className="ps-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0" style={{ fontWeight: "600" }}>
                      {property.business_name}
                    </h5>
                  </div>
                  <div>
                    <p style={gray} className="mt-1 mb-0">
                      {property.business_type}
                    </p>
                  </div>
                </Col>
                <Col>
                  <div className="d-flex  justify-content-end ">
                    <div
                      style={property.business_uid ? {} : hidden}
                      onClick={stopPropagation}
                    >
                      <a href={`tel:${property.business_phone_number}`}>
                        <img src={Phone} alt="Phone" style={smallImg} />
                      </a>
                      <a href={`mailto:${property.business_email}`}>
                        <img src={Message} alt="Message" style={smallImg} />
                      </a>
                      <a href={`mailto:${property.business_email}`}>
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
      <div
        hidden={!responsiveSidebar.showSidebar}
        style={{
          backgroundColor: "#229ebc",
          width: "11rem",
          minHeight: "100%",
        }}
      >
        <SideBar />
      </div>
      <div className="w-100  mb-5">
        <Header title="" leftText="< Back" leftFn={() => setStage("LIST")} />

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
            {console.log(selectedPropertyManagers.business_services_fees)}
            {JSON.parse(selectedPropertyManagers.business_services_fees).map(
              (bsf) => {
                return (
                  <div
                    className="m-2 p-2"
                    style={{
                      background: " #FFFFFF 0% 0% no-repeat padding-box",
                      boxShadow: " 0px 1px 6px #00000029",
                      borderRadius: "5px",
                    }}
                  >
                    <p> {bsf.fee_name}&nbsp;</p>
                    {bsf.fee_type === "%"
                      ? `${bsf.charge}% of ${bsf.of}`
                      : `$${bsf.charge}`}{" "}
                    {bsf.frequency}
                  </div>
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
            Payment Details
            <Row>
              <Col xs={1}>
                {selectedPropertyManagers.business_paypal === null ? (
                  <img src={UnFilledBox} />
                ) : (
                  <img src={BlueFilledBox} />
                )}
              </Col>
              <Col>PayPal</Col>
            </Row>
            <Row>
              <Col xs={1}>
                {selectedPropertyManagers.business_apple_pay === null ? (
                  <img src={UnFilledBox} />
                ) : (
                  <img src={BlueFilledBox} />
                )}
              </Col>
              <Col>Apple Pay</Col>
            </Row>
            <Row>
              <Col xs={1}>
                {selectedPropertyManagers.business_zelle === null ? (
                  <img src={UnFilledBox} />
                ) : (
                  <img src={BlueFilledBox} />
                )}
              </Col>
              <Col>Zelle</Col>
            </Row>
            <Row>
              <Col xs={1}>
                {selectedPropertyManagers.business_venmo === null ? (
                  <img src={UnFilledBox} />
                ) : (
                  <img src={BlueFilledBox} />
                )}
              </Col>
              <Col>Venmo</Col>
            </Row>
            <Row>
              <Col xs={1}>
                {selectedPropertyManagers.business_account_number === null ? (
                  <img src={UnFilledBox} />
                ) : (
                  <img src={BlueFilledBox} />
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
          </div>
        </div>
        <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-5">
          <OwnerFooter />
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default PropertyManagersList;
