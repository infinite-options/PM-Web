import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { get } from "../../utils/api";
import AppContext from "../../AppContext";
import "./sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [properties, setProperties] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchProperties = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length < 1) {
      console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
    } else {
      management_buid = management_businesses[0].business_uid;
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

    const properties_unique = [];
    const pids = new Set();
    const mr = [];
    properties.forEach((property) => {
      if (pids.has(property.property_uid)) {
        console.log("here in if");
        // properties_unique[properties_unique.length-1].tenants.push(property)
        const index = properties_unique.findIndex(
          (item) => item.property_uid === property.property_uid
        );
        if (
          property.rental_status === "ACTIVE" ||
          property.rental_status === "PROCESSING"
        ) {
          console.log("here", property);
          properties_unique[index].tenants.push(property);
        }
      } else {
        console.log("here in else");
        pids.add(property.property_uid);
        properties_unique.push(property);
        if (
          property.rental_status === "ACTIVE" ||
          property.rental_status === "PROCESSING"
        ) {
          console.log("here", property);
          properties_unique[properties_unique.length - 1].tenants = [property];
        }
      }
    });
    setProperties(properties_unique);
    let expense = [];
    properties_unique.forEach((property) => {
      if (property.expenses.length > 0) {
        console.log("has expense");
        property.expenses.forEach((ex) => {
          console.log("has expense", ex);
          expense.push(ex);
        });
      }
    });

    console.log(expense);
    console.log(properties_unique);
    setExpenses(expense);
  };
  useEffect(() => {
    console.log("in use effect");
    fetchProperties();
  }, []);
  let sidebarButtonsActive = {
    padding: "20px",
    color: "#c93667",
    textDecoration: "none",
    textTransform: "uppercase",
    fontFamily: "Avenir-Light",
    cursor: "pointer",
    fontWeight: "700",
  };
  let sidebarButtons = {
    padding: "20px",
    color: "#000000",
    textDecoration: "none",
    textTransform: "uppercase",
    fontFamily: "Avenir-Light",
    cursor: "pointer",
  };

  return (
    <div>
      <Row>
        <nav class="sidebar">
          <div>
            <div className="sidebarLinks">
              <NavLink
                to="/manager"
                className="sidebarButtons"
                activeClassName="sidebarButtonsActive"
                style={({ isActive }) =>
                  isActive ? sidebarButtonsActive : sidebarButtons
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/manager-properties"
                className="sidebarButtons"
                activeClassName="sidebarButtonsActive"
                style={({ isActive }) =>
                  isActive ? sidebarButtonsActive : sidebarButtons
                }
              >
                Properties
              </NavLink>
              <NavLink
                to="/OwnersTab"
                className="sidebarButtons"
                style={({ isActive }) =>
                  isActive ? sidebarButtonsActive : sidebarButtons
                }
              >
                Tenants
              </NavLink>
              <NavLink
                to="/manager-repairs"
                className="sidebarButtons"
                style={({ isActive }) =>
                  isActive ? sidebarButtonsActive : sidebarButtons
                }
              >
                Maintenance
              </NavLink>
              <NavLink
                to="/manager-utilities"
                state={{ properties: properties, expenses: expenses }}
                className="sidebarButtons"
                style={({ isActive }) =>
                  isActive ? sidebarButtonsActive : sidebarButtons
                }
              >
                Accounting
              </NavLink>
              <NavLink
                to="/manager_original"
                className="sidebarButtons"
                style={({ isActive }) =>
                  isActive ? sidebarButtonsActive : sidebarButtons
                }
              >
                Reports
              </NavLink>
            </div>
          </div>
        </nav>
      </Row>
    </div>
  );
}

export default Sidebar;
