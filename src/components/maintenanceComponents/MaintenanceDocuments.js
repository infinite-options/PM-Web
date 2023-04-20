import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import SideBar from "./SideBar";
import MaintenanceFooter from "./MaintenanceFooter";
import Header from "../Header";
import AppContext from "../../AppContext";
import DocumentsUploadPut from "../DocumentsUploadPut";
import File from "../../icons/File.svg";
import { get, put } from "../../utils/api";
import { sidebarStyle } from "../../utils/styles";

export default function MaintenanceDocuments() {
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [documents, setDocuments] = useState([]);
  const [maintenanceID, setMaintenanceID] = useState([]);

  const [businessUploadDocuments, setBusinessUploadDocuments] = useState({});
  const [newFile, setNewFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDoc, setEditingDoc] = useState(null);
  const [files, setFiles] = useState([]);
  const [addDoc, setAddDoc] = useState(false);
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
  const fetchProfile = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const maintenance_businesses = user.businesses.filter(
      (business) => business.business_type === "MAINTENANCE"
    );
    let maintenance_buid = null;
    if (maintenance_businesses.length < 1) {
      // console.log("No associated PM Businesses");
      return;
    } else if (maintenance_businesses.length > 1) {
      // console.log("Multiple associated PM Businesses");
      maintenance_buid = maintenance_businesses[0].business_uid;
    } else {
      maintenance_buid = maintenance_businesses[0].business_uid;
    }
    setMaintenanceID(maintenance_buid);
    const response = await get(
      `/maintenanceDocuments?business_id=${maintenance_buid}`
    );
    setDocuments(response.result);
    // console.log(response.result[0]);

    if (response.msg === "Token has expired") {
      // console.log("here msg");
      refresh();
      return;
    }
    let documents = response.result[0];

    var business_uploaded_docs = Object.keys(documents)
      .filter((key) => key.includes("business_uploaded_docs"))
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: documents[key] });
      }, {});
    // console.log(business_uploaded_docs);
    setBusinessUploadDocuments(business_uploaded_docs);
    setFiles(Object.values(business_uploaded_docs)[0]);
    setIsLoading(false);
  };
  useEffect(() => {
    if (access_token === null) {
      navigate("/");
    }
    fetchProfile();
  }, [access_token]);
  const editDocument = (i) => {
    const newFiles = [...files];
    const file = newFiles.splice(i, 1)[0];
    setFiles(newFiles);
    setEditingDoc(file);
    setNewFile({ ...file });
  };
  // console.log(businessUploadDocuments);
  const deleteDocument = async (i) => {
    const newFiles = files.filter((file, index) => index !== i);
    setFiles(newFiles);
    const businessProfile = {};
    for (let i = 0; i < newFiles.length; i++) {
      let key = `doc_${i}`;
      // businessProfile[key] = newFiles[i].file;
      // delete newFiles[i].file;
      if (newFiles[i].file !== undefined) {
        businessProfile[key] = newFiles[i].file;
      } else {
        businessProfile[key] = newFiles[i].link;
      }
    }
    businessProfile.business_documents = JSON.stringify(newFiles);
    businessProfile.business_uid = maintenanceID;
    await put("/businesses", businessProfile, null, files);
    setAddDoc(!addDoc);
  };
  return (
    <div className="w-100 overflow-hidden">
      <Row className="w-100 mb-5 overflow-hidden">
        {" "}
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5 overflow-scroll">
          <Header title="Maintenance Documents" />
          {!isLoading ? (
            <div>
              <Row className="m-3">
                <Col>
                  <h3>Maintenance Documents</h3>
                </Col>
                <Col></Col>
              </Row>
              <div
                className="mx-3 my-3 p-2"
                style={{
                  background: "#E9E9E9 0% 0% no-repeat padding-box",
                  borderRadius: "10px",
                  opacity: 1,
                }}
              >
                <Row className="m-3">
                  <h5>Business Documents</h5>{" "}
                  <DocumentsUploadPut
                    files={files}
                    setFiles={setFiles}
                    addDoc={addDoc}
                    setAddDoc={setAddDoc}
                    endpoint="/businesses"
                    editingDoc={editingDoc}
                    setEditingDoc={setEditingDoc}
                    id={maintenanceID}
                  />
                </Row>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <MaintenanceFooter />
          </div>
        </Col>
      </Row>
    </div>
  );
}
