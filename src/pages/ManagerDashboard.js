import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/managerComponents/SideBar";
import { get } from "../utils/api";
import "./tenantDash.css";
import { Row, Col } from "react-bootstrap";
import { subHeading } from "../utils/styles";
import AppContext from "../AppContext";
export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;

  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchZip, setSearchZip] = useState("");
  const [searchRentStatus, setSearchRentStatus] = useState("");
  const fetchTenantDashboard = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }
    const response = await get("/managerDashboard", access_token);
    console.log("second");
    console.log(response);
    setIsLoading(false);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();

      return;
    }

    const properties = response.result.filter(
      (property) => property.management_status !== "REJECTED"
    );

    let properties_unique = [];
    const pids = new Set();
    properties.forEach((property) => {
      if (pids.has(property.property_uid)) {
        // properties_unique[properties_unique.length-1].tenants.push(property)
        const index = properties_unique.findIndex(
          (item) => item.property_uid === property.property_uid
        );
        properties_unique[index].tenants.push(property);
      } else {
        pids.add(property.property_uid);
        properties_unique.push(property);
        properties_unique[properties_unique.length - 1].tenants = [property];
      }
    });

    properties_unique.forEach((property) => {
      const new_repairs = property.maintenanceRequests.filter(
        (item) => item.request_status === "NEW"
      );
      const processing_repairs = property.maintenanceRequests.filter(
        (item) => item.request_status === "PROCESSING"
      );
      const scheduled_repairs = property.maintenanceRequests.filter(
        (item) => item.request_status === "SCHEDULED"
      );
      const completed_repairs = property.maintenanceRequests.filter(
        (item) => item.request_status === "COMPLETE"
      );
      property.repairs = {
        new: new_repairs.length,
        processing: processing_repairs.length,
        scheduled: scheduled_repairs.length,
        complete: completed_repairs.length,
      };

      property.new_tenant_applications = property.applications.filter(
        (a) => a.application_status === "NEW"
      );

      property.end_early_applications = property.applications.filter(
        (a) => a.application_status === "TENANT END EARLY"
      );
    });

    console.log(properties_unique);
    setProperties(properties_unique);
  };
  useEffect(() => {
    console.log("in use effect");
    fetchTenantDashboard();
  }, []);

  const days = (date_1, date_2) => {
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  };

  return (
    <div>
      {/* {propertyData.length !== 0 && (
        <div>
          <h3 style={{ paddingLeft: "7rem", paddingTop: "2rem" }}>
            {propertyData.result[0].tenant_first_name}
          </h3>
          <h8 style={{ paddingLeft: "7rem", paddingTop: "2rem" }}>Manager</h8>
        </div>
      )} */}

      <div className="flex-1">
        <div className="sidebar">
          <SideBar />
        </div>
        <div>
          <br />
          <Row className="w-100 m-3">
            <Col> Search by</Col>
            {/* <Col>
              <input
                type="text"
                placeholder="City"
                onChange={(event) => {
                  setSearchCity(event.target.value);
                }}
              />
            </Col>
            <Col></Col>
            <Col>
              <input
                type="text"
                placeholder="Zip"
                onChange={(event) => {
                  setSearchZip(event.target.value);
                }}
              />
            </Col>
            <Col></Col>
            <Col>
              <input
                type="text"
                placeholder="Rent Status"
                onChange={(event) => {
                  setSearchRentStatus(event.target.value);
                }}
              />
            </Col>
            <Col></Col> */}
            <Col>
              <input
                type="text"
                placeholder="Search"
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
              />
            </Col>
          </Row>
          <Row className="w-100 m-3">
            <table style={subHeading} class="table-hover">
              <thead>
                <tr>
                  <th>Property Images</th>
                  <th>Street Address</th>
                  <th>City,State</th>
                  <th>Zip</th>
                  <th>Rent Status</th>
                  <th>Days Late</th>
                  <th>Maintenance Requests Open</th>
                  <th>Longest duration</th>
                </tr>
              </thead>

              <tbody>
                {properties
                  // .filter((val) => {
                  //   if (searchCity === "") {
                  //     return val;
                  //   } else if (
                  //     val.city.toLowerCase().includes(searchCity.toLowerCase())
                  //   ) {
                  //     return val;
                  //   }
                  // })
                  // .filter((val) => {
                  //   if (searchZip === "") {
                  //     return val;
                  //   } else if (
                  //     val.zip.toLowerCase().includes(searchZip.toLowerCase())
                  //   ) {
                  //     return val;
                  //   }
                  // })
                  // .filter((val) => {
                  //   if (searchRentStatus === "") {
                  //     return val;
                  //   } else if (
                  //     val.rent_status
                  //       .toLowerCase()
                  //       .includes(searchRentStatus.toLowerCase())
                  //   ) {
                  //     return val;
                  //   }
                  // })
                  .filter((val) => {
                    const query = search.toLowerCase();

                    return (
                      val.address.toLowerCase().indexOf(query) >= 0 ||
                      val.city.toLowerCase().indexOf(query) >= 0 ||
                      val.zip.toLowerCase().indexOf(query) >= 0 ||
                      val.rent_status.toLowerCase().indexOf(query) >= 0 ||
                      val.oldestOpenMR.toLowerCase().indexOf(query) >= 0 ||
                      val.late_date.toLowerCase().indexOf(query) >= 0
                    );
                  })
                  .map((property, i) => (
                    <tr>
                      <td>
                        {JSON.parse(property.images).length > 0 ? (
                          <img
                            src={JSON.parse(property.images)[0]}
                            alt="Property"
                            style={{
                              borderRadius: "4px",
                              objectFit: "cover",
                              width: "100px",
                              height: "100px",
                            }}
                          />
                        ) : (
                          ""
                        )}
                      </td>
                      <td>
                        {property.address}
                        {property.unit !== "" ? " " + property.unit : ""},{" "}
                        <br />
                      </td>
                      <td>
                        {property.city}, {property.state}
                      </td>
                      <td> {property.zip}</td>
                      <td>{property.rent_status}</td>
                      <td>
                        {/* {property.late_date != "" ? (
                          <div>{property.late_date}</div>
                        ) : (
                          "Not applicable"
                        )} */}
                        {property.late_date}
                      </td>
                      <td>{property.maintenanceRequests.length}</td>
                      <td>
                        {/* {property.oldestOpenMR != "" ? (
                          <div>{property.oldestOpenMR}</div>
                        ) : (
                          "Not applicable"
                        )} */}
                        {property.oldestOpenMR}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Row>
        </div>
      </div>
    </div>
  );
}
