import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "../components/Header";
import { get } from "../utils/api";
import AppContext from "../AppContext";

import PropertyCard from "../components/PropertyCard";
import PropertyCard2 from "../components/tenantComponents/PropertyCard";
import SideBar from "../components/tenantComponents/SideBar";
export default function TenantAvailableProperties(props) {
  const { hideBackButton } = props;
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const { userData } = React.useContext(AppContext);
  const { user } = userData;
  const [appliedProperties, setAppliedProperties] = useState({});
  const [view, setView] = useState(true);

  // useEffect(() => {
  // }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await get(`/availableProperties`);
      console.log(response);
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
      console.log("applications :", response);

      const appliedPropertes = {};
      for (const a of response.result) {
        // appliedProperties[a.property_uid] = true;
        appliedProperties[a.property_uid] = a.application_status;
      }
      console.log("appliedProperties :", appliedProperties);
      await setAppliedProperties(appliedProperties);
    };
    fetchApplications().then(fetchProperties);
  }, []);

  const changeView = () => {
    setView((prev) => !prev);
    console.log(view);
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
    console.log(prop);
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
    <div className="mb-5 pb-5">
      <Header
        title="Available Properties"
        leftText={hideBackButton ? "" : "< Back"}
        leftFn={() => navigate("/tenant")}
        rightFn={changeView}
        rightText="Change View"
      />
      <div className="available-props-container">
        <div>
          <SideBar />
        </div>
        <div>
          {view ? (
            <Container>{tableView}</Container>
          ) : (
            <Container className="p-container">{boxView}</Container>
          )}
        </div>
      </div>
    </div>
  );
}
