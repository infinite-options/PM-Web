import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../Header";
import ManagerFees from "../ManagerFees";
import BusinessContact from "../BusinessContact";
import ConfirmDialog from "../ConfirmDialog";
import AppContext from "../../AppContext";
import File from "../../icons/File.svg";
import EditIcon from "../../icons/EditIcon.svg";
import DeleteIcon from "../../icons/DeleteIcon.svg";
import { put, post } from "../../utils/api";
import {
  small,
  hidden,
  red,
  squareForm,
  mediumBold,
  smallPillButton,
  bluePillButton,
  redPillButton,
} from "../../utils/styles";

function ManagementContract(props) {
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const { back, property, contract, reload } = props;
  // console.log(property);
  let pageURL = window.location.href.split("/");
  const [pmID, setPmID] = useState("");
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

  // console.log(contract);
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

  const approvePropertyManager = async (pID) => {
    const files = JSON.parse(property.images);
    let pid = pID;
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "ACCEPTED",
      manager_id: pid,
    };
    // for (let i = -1; i < files.length - 1; i++) {
    //   let key = `img_${i}`;
    //   if (i === -1) {
    //     key = "img_cover";
    //   }
    //   updatedManagementContract[key] = files[i + 1];
    // }
    // console.log(files);
    const response2 = await put(
      "/properties",
      updatedManagementContract,
      null,
      files
    );
    back();
    reload();
  };

  const rejectPropertyManager = async () => {
    const files = JSON.parse(property.images);
    let pid = pmID;
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "REJECTED",
      manager_id: pid,
    };
    // for (let i = -1; i < files.length - 1; i++) {
    //   let key = `img_${i}`;
    //   if (i === -1) {
    //     key = "img_cover";
    //   }
    //   updatedManagementContract[key] = files[i + 1];
    // }
    // console.log(updatedManagementContract);
    const response2 = await put(
      "/properties",
      updatedManagementContract,
      null,
      files
    );

    reload();
  };

  return (
    <div
      className="mb-5 pb-5"
      style={{ background: "#E9E9E9 0% 0% no-repeat padding-box" }}
    >
      <ConfirmDialog
        title={"Are you sure you want to reject this Property Manager?"}
        isOpen={showDialog}
        onConfirm={rejectPropertyManager}
        onCancel={onCancel}
      />

      <Header
        title="Management Contract"
        leftText="< Back"
        leftFn={back}
        // rightText="Save"
        // rightFn={save}
      />

      <div
        className="mx-2 my-2 p-3"
        style={{
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        <Row>
          <Col>
            <Form.Group className="mx-2 my-3">
              <Form.Label as="h6" className="mb-0 ms-2">
                Start Date
              </Form.Label>
              <div className="mb-0 ms-2">{startDate}</div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mx-2 my-3">
              <Form.Label as="h6" className="mb-0 ms-2">
                End Date
              </Form.Label>
              <div className="mb-0 ms-2">{endDate}</div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <div className="mb-4">
            <h5 style={mediumBold}>PM Fees</h5>
            <div className="mx-2">
              <ManagerFees feeState={feeState} setFeeState={setFeeState} />
            </div>
          </div>
        </Row>
        <Row>
          <div className="mb-4">
            <h5 style={mediumBold}>Contact Details</h5>
            <BusinessContact state={contactState} />
          </div>
        </Row>
        <Row>
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

                <a href={file.link} target="_blank">
                  <img src={File} />
                </a>
              </div>
              <hr style={{ opacity: 1 }} />
            </div>
          ))}
        </Row>

        {property.property_manager.length == 0 ? (
          ""
        ) : property.property_manager.length > 1 ? (
          property.property_manager.map((p, i) =>
            p.management_status === "REJECTED" ? (
              ""
            ) : p.management_status === "SENT" ? (
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
                    onClick={() => {
                      approvePropertyManager(p.manager_id);
                    }}
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
                  <Button
                    // onClick={rejectPropertyManager}
                    onClick={() => {
                      setShowDialog(true);
                      setPmID(p.manager_id);
                    }}
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
        ) : property.property_manager[0].management_status === "SENT" ? (
          <Row className="mt-4">
            <Col
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginBottom: "25px",
              }}
            >
              <Button
                onClick={() => {
                  approvePropertyManager(
                    property.property_manager[0].manager_id
                  );
                }}
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
      </div>
    </div>
  );
}

export default ManagementContract;
