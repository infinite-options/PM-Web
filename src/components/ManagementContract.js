import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "./Header";
import ManagerFees from "./ManagerFees";
import BusinessContact from "./BusinessContact";
import ConfirmDialog from "./ConfirmDialog";
import File from "../icons/File.svg";
import EditIcon from "../icons/EditIcon.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";
import { put, post } from "../utils/api";
import {
  small,
  hidden,
  red,
  squareForm,
  mediumBold,
  smallPillButton,
  bluePillButton,
  redPillButton,
} from "../utils/styles";
import AppContext from "../AppContext";

function ManagementContract(props) {
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const { back, property, contract, reload } = props;
  console.log(property);
  let pageURL = window.location.href.split("/");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [feeState, setFeeState] = useState([]);
  const contactState = useState([]);
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const onCancel = () => {
    setShowDialog(false);
  };

  const addFile = (e) => {
    const file = e.target.files[0];
    const newFile = {
      name: file.name,
      description: "",
      file: file,
    };
    setNewFile(newFile);
  };
  const updateNewFile = (field, value) => {
    const newFileCopy = { ...newFile };
    newFileCopy[field] = value;
    setNewFile(newFileCopy);
  };
  const cancelEdit = () => {
    setNewFile(null);
    if (editingDoc !== null) {
      const newFiles = [...files];
      newFiles.push(editingDoc);
      setFiles(newFiles);
    }
    setEditingDoc(null);
  };
  const editDocument = (i) => {
    const newFiles = [...files];
    const file = newFiles.splice(i, 1)[0];
    setFiles(newFiles);
    setEditingDoc(file);
    setNewFile({ ...file });
  };
  const saveNewFile = (e) => {
    // copied from addFile, change e.target.files to state.newFile
    const newFiles = [...files];
    newFiles.push(newFile);
    setFiles(newFiles);
    setNewFile(null);
  };
  const deleteDocument = (i) => {
    const newFiles = [...files];
    newFiles.splice(i, 1);
    setFiles(newFiles);
  };
  const loadContract = () => {
    setStartDate(contract.start_date);
    setEndDate(contract.end_date);
    setFeeState(JSON.parse(contract.contract_fees));
    contactState[1](JSON.parse(contract.assigned_contacts));
    setFiles(JSON.parse(contract.documents));
  };
  useEffect(() => {
    if (contract) {
      loadContract();
    }
  }, [contract]);
  const approvePropertyManager = async () => {
    const files = JSON.parse(property.images);
    if (property.property_manager.length > 0) {
      for (const prop of property.property_manager) {
        if (prop.management_status !== "REJECTED") {
          const updatedManagementContract = {
            property_uid: property.property_uid,
            management_status: "ACCEPTED",
            manager_id: prop.manager_id,
          };
          for (let i = -1; i < files.length - 1; i++) {
            let key = `img_${i}`;
            if (i === -1) {
              key = "img_cover";
            }
            updatedManagementContract[key] = files[i + 1];
          }
          console.log(files);
          const response2 = await put(
            "/properties",
            updatedManagementContract,
            null,
            files
          );

          reload();
          //navigate("/tenant");
        }
      }
    } else {
      const updatedManagementContract = {
        property_uid: property.property_uid,
        management_status: "ACCEPTED",
        manager_id: property.property_manager[0].manager_id,
      };
      for (let i = -1; i < files.length - 1; i++) {
        let key = `img_${i}`;
        if (i === -1) {
          key = "img_cover";
        }
        updatedManagementContract[key] = files[i + 1];
      }
      console.log(files);
      const response2 = await put(
        "/properties",
        updatedManagementContract,
        null,
        files
      );

      reload();
      //navigate("/tenant");
    }
  };

  const rejectPropertyManager = async () => {
    const files = JSON.parse(property.images);
    if (property.property_manager.length > 0) {
      for (const prop of property.property_manager) {
        if (prop.management_status !== "REJECTED") {
          const updatedManagementContract = {
            property_uid: property.property_uid,
            management_status: "REJECTED",
            manager_id: prop.manager_id,
          };
          for (let i = -1; i < files.length - 1; i++) {
            let key = `img_${i}`;
            if (i === -1) {
              key = "img_cover";
            }
            updatedManagementContract[key] = files[i + 1];
          }
          const response2 = await put(
            "/properties",
            updatedManagementContract,
            null,
            files
          );

          reload();
        }
      }

      //navigate("/tenant");
    } else {
      const updatedManagementContract = {
        property_uid: property.property_uid,
        management_status: "REJECTED",
        manager_id: property.property_manager[0].manager_id,
      };
      for (let i = -1; i < files.length - 1; i++) {
        let key = `img_${i}`;
        if (i === -1) {
          key = "img_cover";
        }
        updatedManagementContract[key] = files[i + 1];
      }
      const response2 = await put(
        "/properties",
        updatedManagementContract,
        null,
        files
      );
      setShowDialog(false);

      reload();
      //navigate("/tenant");
    }
  };
  const save = async () => {
    const newContract = {
      property_uid: property.property_uid,
      business_uid: property.manager_id,
      start_date: startDate,
      end_date: endDate,
      contract_fees: JSON.stringify(feeState),
      assigned_contacts: JSON.stringify(contactState[0]),
    };
    for (let i = 0; i < files.length; i++) {
      let key = `doc_${i}`;
      newContract[key] = files[i].file;
      delete files[i].file;
    }
    newContract.documents = JSON.stringify(files);

    if (contract) {
      newContract.contract_uid = contract.contract_uid;
      console.log(newContract);
      const response = await put(`/contracts`, newContract, null, files);
    } else {
      console.log(newContract);
      const response = await post("/contracts", newContract, null, files);
    }

    // Updating Management Status in property to SENT
    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid;
    }
    const newProperty = {
      property_uid: property.property_uid,
      manager_id: management_buid,
      management_status: "SENT",
    };
    const images = JSON.parse(property.images);
    for (let i = -1; i < images.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      newProperty[key] = images[i + 1];
    }
    await put("/properties", newProperty, null, images);
    back();
    reload();
  };
  const [errorMessage, setErrorMessage] = useState("");
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  return (
    <div className="mb-5 pb-5">
      <ConfirmDialog
        title={"Are you sure you want to reject this Property Manager?"}
        isOpen={showDialog}
        onConfirm={rejectPropertyManager}
        onCancel={onCancel}
      />
      {pageURL[3] !== "owner" ? (
        <Header
          title="Management Contract"
          leftText="< Back"
          leftFn={back}
          rightText="Save"
          rightFn={save}
        />
      ) : (
        <Header
          title="Management Contract"
          leftText="< Back"
          leftFn={back}
          // rightText="Save"
          // rightFn={save}
        />
      )}

      <Container>
        <div className="mb-4">
          <h5 style={mediumBold}>PM Agreement Dates</h5>
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Start Date {startDate === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              End Date {endDate === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </div>
        <div className="mb-4">
          <h5 style={mediumBold}>PM Fees</h5>
          <div className="mx-2">
            <ManagerFees feeState={feeState} setFeeState={setFeeState} />
          </div>
        </div>

        <div className="mb-4">
          <h5 style={mediumBold}>Contact Details</h5>
          <BusinessContact state={contactState} />
        </div>
        <div className="mb-4">
          <h5 style={mediumBold}>Property Manager Documents</h5>
          {files.map((file, i) => (
            <div key={i}>
              <div className="d-flex justify-content-between align-items-end">
                <div>
                  <h6 style={mediumBold}>{file.name}</h6>
                  <p style={small} className="m-0">
                    {file.description}
                  </p>
                </div>
                {pageURL[3] !== "owner" ? (
                  <div>
                    <img
                      src={EditIcon}
                      alt="Edit"
                      className="px-1 mx-2"
                      onClick={() => editDocument(i)}
                    />
                    <img
                      src={DeleteIcon}
                      alt="Delete"
                      className="px-1 mx-2"
                      onClick={() => deleteDocument(i)}
                    />
                  </div>
                ) : (
                  ""
                )}
                <a href={file.link} target="_blank">
                  <img src={File} />
                </a>
              </div>
              <hr style={{ opacity: 1 }} />
            </div>
          ))}
          {(newFile !== null) & (pageURL[3] !== "owner") ? (
            <div>
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Document Name
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  value={newFile.name}
                  placeholder="Name"
                  onChange={(e) => updateNewFile("name", e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label as="h6" className="mb-0 ms-2">
                  Description
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  value={newFile.description}
                  placeholder="Description"
                  onChange={(e) => updateNewFile("description", e.target.value)}
                />
              </Form.Group>
              <div className="text-center my-3">
                <Button
                  variant="outline-primary"
                  style={smallPillButton}
                  as="p"
                  onClick={cancelEdit}
                  className="mx-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline-primary"
                  style={smallPillButton}
                  as="p"
                  onClick={saveNewFile}
                  className="mx-2"
                >
                  Save Document
                </Button>
              </div>
            </div>
          ) : (newFile === null) & (pageURL[3] === "owner") ? (
            ""
          ) : (
            <div>
              <input
                id="file"
                type="file"
                accept="image/*,.pdf"
                onChange={addFile}
                className="d-none"
              />
              <label htmlFor="file">
                <Button
                  variant="outline-primary"
                  style={smallPillButton}
                  as="p"
                >
                  Add Document
                </Button>
              </label>
            </div>
          )}
        </div>
        {property.property_manager.length && (pageURL[3] === "owner") == 0 ? (
          ""
        ) : property.property_manager.length && pageURL[3] === "owner" > 1 ? (
          property.property_manager.map((p, i) =>
            p.management_status === "REJECTED" ? (
              ""
            ) : pageURL[3] === "owner" && p.management_status === "SENT" ? (
              <Row className="mt-4">
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginBottom: "25px",
                  }}
                >
                  {" "}
                  <Button
                    onClick={approvePropertyManager}
                    variant="outline-primary"
                    style={bluePillButton}
                  >
                    Approve
                  </Button>
                </Col>
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginBottom: "25px",
                  }}
                >
                  {" "}
                  <Button
                    // onClick={rejectPropertyManager}
                    onClick={() => setShowDialog(true)}
                    variant="outline-primary"
                    style={redPillButton}
                  >
                    Reject
                  </Button>
                </Col>
              </Row>
            ) : (
              ""
            )
          )
        ) : pageURL[3] === "owner" &&
          property.property_manager[0].management_status === "SENT" ? (
          <Row className="mt-4">
            <Col
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginBottom: "25px",
              }}
            >
              {" "}
              <Button
                onClick={approvePropertyManager}
                variant="outline-primary"
                style={bluePillButton}
              >
                Approve
              </Button>
            </Col>
            <Col
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginBottom: "25px",
              }}
            >
              {" "}
              <Button
                // onClick={rejectPropertyManager}
                onClick={() => setShowDialog(true)}
                variant="outline-primary"
                style={redPillButton}
              >
                Reject
              </Button>
            </Col>
          </Row>
        ) : (
          ""
        )}
      </Container>
    </div>
  );
}

export default ManagementContract;
