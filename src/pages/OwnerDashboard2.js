import React from "react";
import { Row, Col } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as ReactBootStrap from "react-bootstrap";
import SideBar from "../components/ownerComponents/SideBar";
import Header from "../components/Header";
import Table from "../components/ownerComponents/Table";
import Table2 from "../components/ownerComponents/Table2";
import AppContext from "../AppContext";
import PropertyForm from "../components/PropertyForm";
import { get } from "../utils/api";
export default function OwnerDashboard2() {
  const [ownerData, setOwnerData] = useState([]);
  const [dataTable, setDataTable] = useState([]);

  const [stage, setStage] = useState("LIST");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;

  const fetchOwnerDashboard = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }
    const response = await get("/ownerDashboard", access_token);
    console.log("second");
    console.log(response);
    // setIsLoading(false);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();

      return;
    }
    setIsLoading(false);
    setOwnerData(response);
    setDataTable(response.result);
  };

  useEffect(() => {
    console.log("in use effect");
    fetchOwnerDashboard();
  }, []);
  const addProperty = () => {
    fetchOwnerDashboard();
    setStage("LIST");
  };

  return stage === "LIST" ? (
    <div className="OwnerDashboard2">
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        {dataTable.length > 0 ? (
          <div className="w-100">
            <Header
              title="Owner"
              rightText="+ New"
              rightFn={() => setStage("NEW")}
            />

            <Row>{dataTable.length !== 0 && <Table data={dataTable} />}</Row>
            <Row>{dataTable.length !== 0 && <Table2 data={dataTable} />}</Row>
          </div>
        ) : (
          <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            <ReactBootStrap.Spinner animation="border" role="status" />
          </div>
        )}
      </div>
    </div>
  ) : stage === "NEW" ? (
    <div className="OwnerDashboard2">
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div className="w-100">
          <Header
            title="Properties"
            leftText="< Back"
            leftFn={() => setStage("LIST")}
          />
          <PropertyForm
            edit
            cancel={() => setStage("LIST")}
            onSubmit={addProperty}
          />
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
