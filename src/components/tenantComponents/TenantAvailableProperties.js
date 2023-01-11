import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "../Header";
import AppContext from "../../AppContext";
import PropertyCard from "../PropertyCard";
import PropertyCard2 from "./PropertyCard";
import SideBar from "./SideBar";
import TenantFooter from "./TenantFooter";
import { get } from "../../utils/api";
export default function TenantAvailableProperties(props) {
  const { hideBackButton } = props;
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const { userData } = React.useContext(AppContext);
  const { user } = userData;
  const [appliedProperties, setAppliedProperties] = useState({});
  const [view, setView] = useState(true);

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
  const responsive = {
    showSidebar: width > 1023,
  };

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await get(`/availableProperties`);
      // console.log(response);
      const res = response.result;
      if (res) {
        res.forEach((property) => {
          if (property.images && property.images.length) {
            property.images = JSON.parse(property.images);
          }
        });
      }
      await setProperties(res);
    };
    const fetchApplications = async () => {
      const response = await get(`/applications?tenant_id=${user.user_uid}`);
      // console.log("applications :", response);

      const appliedPropertes = {};
      for (const a of response.result) {
        // appliedProperties[a.property_uid] = true;
        appliedProperties[a.property_uid] = a.application_status;
      }
      // console.log("appliedProperties :", appliedProperties);
      await setAppliedProperties(appliedProperties);
    };
    fetchApplications().then(fetchProperties);
  }, []);

  const changeView = () => {
    setView((prev) => !prev);
    // console.log(view);
  };
  const tableView = properties.map((value, i) => {
    // const applied = appliedProperties.hasOwnProperty(value.property_uid);
    let applied = null;
    if (appliedProperties.hasOwnProperty(value.property_uid)) {
      applied = appliedProperties[value.property_uid];
    }
    return (
      <div key={i} style={{ marginBottom: "10px" }}>
        <PropertyCard property={value} applied={applied}></PropertyCard>
      </div>
    );
  });
  const colors = ["#628191", "#FB8500", "rgb(255,183,3)", "rgb(33,158,188)"];

  const boxView = properties.map((prop, index) => {
    // console.log(prop);
    return (
      <PropertyCard2
        color={colors[index % 4]}
        add1={prop.address}
        cost={prop.listed_rent}
        bedrooms={prop.num_beds}
        bathrooms={prop.num_baths}
        property_type={prop.property_type}
        city={prop.city}
        imgSrc={prop.images}
        part={2}
        uid={prop.property_uid}
        property={prop}
        unit={prop.unit}
        description={prop.description}
      />
    );
  });

  return (
    <div className="w-100 overflow-hidden">
      <div className="flex-1">
        <div
          hidden={!responsive.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </div>
        <div className="w-100 mb-5 overflow-scroll">
          <Header
            title="Available Properties"
            leftText={hideBackButton ? "" : "< Back"}
            leftFn={() => navigate("/tenant")}
            rightFn={changeView}
            rightText="Change View"
          />
          {view ? (
            <div>{tableView}</div>
          ) : (
            <div className="p-container">{boxView}</div>
          )}
        </div>
      </div>{" "}
      <div hidden={responsive.showSidebar} className="w-100 mt-3">
        <TenantFooter />
      </div>
    </div>
  );
}
