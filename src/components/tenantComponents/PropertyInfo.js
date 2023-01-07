import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import SideBar from "./SideBar";
import TenantFooter from "./TenantFooter";
import Header from "../Header";
import Appliances from "./Appliances";
import ReviewPropertyLease from "./reviewPropertyLease";
import Apply from "../../icons/ApplyIcon.svg";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import "react-multi-carousel/lib/styles.css";

export default function PropertyInfo() {
  const location = useLocation();
  const navigate = useNavigate();
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
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
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
  const data = location.state.property;
  console.log(data);
  const type = location.state.type;
  const imgs = data.images;
  console.log(imgs);
  const util = Object.entries(JSON.parse(data.utilities));
  // const [currentImg, setCurrentImg] = React.useState(0);
  const [currentImg, setCurrentImg] = React.useState(0);
  console.log(util);
  var counter = 0;
  var counter2 = 0;
  var counter3 = 0;
  const appliances = JSON.parse(data.appliances);
  const arr = Object.entries(appliances);
  const apps = arr.map((a) => {
    counter2 += 1;
    return (
      <ol>
        {counter2}. {a[0]}
      </ol>
    );
  });

  const availUtils = util?.map((u) => {
    if (u[1] == true) {
      counter += 1;
      return (
        <ol>
          {counter}. {u[0]}
        </ol>
      );
    }
  });
  const tenantUtils = util?.map((u) => {
    if (u[1] == false) {
      counter3 += 1;
      return (
        <ol>
          {counter3}. {u[0]}
        </ol>
      );
    }
  });
  const goToApplyToProperty = () => {
    // navigate("/applyToProperty");
    navigate(`/propertyApplicationView/${data.property_uid}`);
  };

  // const showImgs = imgs?.map((img) => {
  //   return <img className="more-info-prop-images" src={img} />;
  // });

  return (
    <div className="w-100 overflow-hidden">
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
        <div className="w-100 mb-5">
          <Header title="Tenant Dashboard" />
          <Row className="m-3">
            {imgs.length > 0 ? (
              <Carousel
                responsive={responsive}
                infinite={true}
                arrows={true}
                className=" d-flex align-items-center justify-content-center"
              >
                {imgs.map((imagesGroup) => {
                  return (
                    <div className="d-flex align-items-center justify-content-center">
                      {console.log(imagesGroup)}
                      <img
                        key={Date.now()}
                        src={imagesGroup}
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

            <h3 className="prop-info-address">{data.address}</h3>

            <h3 className="prop-info-prop-type">{data.property_type}</h3>
            <div className="info-container">
              <div className="left box">
                <h3 className="prop-info-stats">
                  Rent : ${data.listed_rent} / mo
                </h3>
                <h3 className="prop-info-stats">Bedrooms: {data.num_beds}</h3>
                <h3 className="prop-info-stats">Bathrooms: {data.num_baths}</h3>
                <h3 className="prop-info-stats">
                  Active Since: {data.active_date}
                </h3>
                <h3 className="prop-info-stats">Area : {data.area} SqFt</h3>
                <h3 className="prop-info-stats">City: {data.city}</h3>
                <div className="contacts" style={{ marginTop: "10vh" }}>
                  <div>
                    {/* {console.log("im trying to print an apply button")} */}
                    <img
                      src={Apply}
                      onClick={goToApplyToProperty}
                      alt="documentIcon"
                    />
                    <div className="mask flex-center">
                      <p className="white-text" style={{ fontSize: "14px" }}>
                        Apply
                      </p>
                    </div>
                  </div>
                  <div>
                    <img
                      onClick={() =>
                        (window.location.href = `tel:${location.state.property.business_number}`)
                      }
                      src={Phone}
                      style={{ marginRight: "10px" }}
                    />
                    <div className="mask flex-center">
                      <p
                        className="white-text"
                        style={{ fontSize: "14px", marginRight: "0px" }}
                      >
                        Call
                      </p>
                    </div>
                  </div>
                  <div>
                    <img
                      onClick={() =>
                        (window.location.href = `mailto:${location.state.property.business_email}`)
                      }
                      src={Message}
                      style={{ marginRight: "10px" }}
                    />
                    <div className="mask flex-center">
                      <p
                        className="white-text"
                        style={{ fontSize: "14px", marginLeft: "0px" }}
                      >
                        Email
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* <Appliances data = {data.appliances}/> */}
              <div className="right box">
                <h3 className="prop-info-stats">
                  Included Utilities <br />
                </h3>
                {availUtils}
                <h3 className="prop-info-stats">
                  Utilities covered by Tenant <br />
                </h3>
                {tenantUtils}
                <h3 className="prop-info-stats">Included Appliances:</h3>
                {apps}
              </div>
            </div>
          </Row>
        </div>
      </div>
      <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
        <TenantFooter />
      </div>
      {type == 2 && (
        <div>
          <div>
            <ReviewPropertyLease
              application_uid={location.state.application_uid}
              application_status_1={location.state.application_status_1}
              message={location.state.msg}
              property_uid={location.state.property_uid}
            />
          </div>
          <div>
            Property Manager Information
            <br></br>
            <u>Property Manager</u>: {location.state.business_name}
            <br></br>
            <u>Manager Email</u>: {location.state.business_email}
            <br></br>
            <u>Manager Number</u> : {location.state.business_number}
            <br></br>
          </div>
        </div>
      )}
    </div>
  );
}
