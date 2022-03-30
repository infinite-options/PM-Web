import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "../components/Header";
import { get } from "../utils/api";
import AppContext from "../AppContext";

import PropertyCard from "../components/PropertyCard";

function TenantAvailableProperties(props) {
  const { hideBackButton } = props;
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const { userData } = React.useContext(AppContext);
  const { user } = userData;
  const [appliedProperties, setAppliedProperties] = useState({});

  useEffect(() => {
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await get(`/availableProperties/${user.user_uid}`);
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
      const appliedPropertes = {};
      for (const a of response.result) {
        appliedProperties[a.property_uid] = true;
      }
      console.log(appliedProperties);
      await setAppliedProperties(appliedProperties);
    };
    fetchApplications().then(fetchProperties);
  }, []);



  return (
    <div className="mb-5 pb-5">
      <Header
        title="Available Properties"
        leftText={hideBackButton ? "" : "< Back"}
        leftFn={() => navigate("/tenant")}
        rightText="Filter by"
      />

      <Container>
        {properties.map((value, i) => {
          const applied = appliedProperties.hasOwnProperty(value.property_uid);
          return (
            <div key={i} style={{ marginBottom: "10px" }} onClick={applied ? () => {} : () => navigate(`/tenantPropertyView/${value.property_uid}`)}>
              <PropertyCard property={value} applied={applied}></PropertyCard>
            </div>
          );
        })}
      </Container>
    </div>
  );
}

export default TenantAvailableProperties;
