import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../Header";
import AppContext from "../../AppContext";
import PropertyCard from "../PropertyCard";
import PropertyCard2 from "./PropertyCard";
import SideBar from "./SideBar";
import TenantFooter from "./TenantFooter";
import { get } from "../../utils/api";
import { sidebarStyle } from "../../utils/styles";
export default function TenantAvailableProperties(props) {
  const { hideBackButton } = props;
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const { userData } = React.useContext(AppContext);
  const { user } = userData;
  const [appliedProperties, setAppliedProperties] = useState({});
  const [view, setView] = useState(true);

  // search variables
  const [search, setSearch] = useState("");
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
      const response = await get(
        `/applications?tenant_id=${user.tenant_id[0].tenant_id}`
      );
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
  const tableView = properties
    .filter((val) => {
      const query = search.toLowerCase();
      return (
        val.address.toLowerCase().indexOf(query) >= 0 ||
        val.city.toLowerCase().indexOf(query) >= 0 ||
        val.zip.toLowerCase().indexOf(query) >= 0 ||
        val.state.toLowerCase().indexOf(query) >= 0 ||
        String(val.listed_rent).toLowerCase().indexOf(query) >= 0 ||
        String(val.num_beds).toLowerCase().indexOf(query) >= 0 ||
        String(val.num_baths).toLowerCase().indexOf(query) >= 0 ||
        String(val.area).toLowerCase().indexOf(query) >= 0
      );
    })
    .map((value, i) => {
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

  const boxView = properties
    .filter((val) => {
      const query = search.toLowerCase();

      return (
        val.address.toLowerCase().indexOf(query) >= 0 ||
        val.city.toLowerCase().indexOf(query) >= 0 ||
        val.zip.toLowerCase().indexOf(query) >= 0 ||
        String(val.oldestOpenMR).toLowerCase().indexOf(query) >= 0
      );
    })
    .map((prop, index) => {
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
      <Row className="w-100 mb-5 overflow-hidden">
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5">
          <Header
            title="Available Properties"
            leftText={hideBackButton ? "" : "< Back"}
            leftFn={() => navigate("/tenant")}
            rightFn={changeView}
            rightText="Change View"
          />
          <Row className="w-100 m-3">
            <Col xs={2}> Search by</Col>

            <Col>
              <input
                type="text"
                placeholder="Search"
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                style={{
                  width: "400px",
                  border: "1px solid black",
                  padding: "5px",
                }}
              />
            </Col>
          </Row>
          {view ? (
            <div>{tableView}</div>
          ) : (
            <div className="p-container">{boxView}</div>
          )}
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <TenantFooter />
          </div>
        </Col>
      </Row>{" "}
    </div>
  );
}
