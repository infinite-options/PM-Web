import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropertyManagersList from "./PropertyManagersList";
import File from "../../icons/File.svg";
import { get, put } from "../../utils/api";
import {
  pillButton,
  smallPillButton,
  mediumBold,
  squareForm,
} from "../../utils/styles";

function ManagerDocs(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    addDocument,
    property,
    selectContract,
    reload,
    setStage,
    searchPM,
    setSearchPM,
  } = props;
  const [contracts, setContracts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [addPropertyManager, setAddPropertyManager] = useState(false);

  const contactState = useState([]);
  const [feeState, setFeeState] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  const [files, setFiles] = useState([]);
  // console.log(property);
  const updateBusiness = async () => {
    const files = JSON.parse(property.images);
    const business_uid = JSON.parse(selectedBusiness).business_uid;

    if (property.property_manager.length > 0) {
      // console.log("in if");
      for (const prop of property.property_manager) {
        if (
          business_uid === prop.manager_id &&
          prop.management_status === "REFUSED"
        ) {
          // console.log("here in if");

          // alert("youve already rejected this Management Company");
          setShowDialog(true);
          reload();
        } else {
          // console.log("here in else");
          const newProperty = {
            property_uid: property.property_uid,
            manager_id: business_uid,
            management_status: "FORWARDED",
          };
          for (let i = -1; i < files.length - 1; i++) {
            let key = `img_${i}`;
            if (i === -1) {
              key = "img_cover";
            }
            newProperty[key] = files[i + 1];
          }
          const response = await put("/properties", newProperty, null, files);
          setAddPropertyManager(false);
          reload();
        }
      }
    } else if (property.property_manager.length == 0) {
      const newProperty = {
        property_uid: property.property_uid,
        manager_id: business_uid,
        management_status: "FORWARDED",
      };
      for (let i = -1; i < files.length - 1; i++) {
        let key = `img_${i}`;
        if (i === -1) {
          key = "img_cover";
        }
        newProperty[key] = files[i + 1];
      }
      const response = await put("/properties", newProperty, null, files);
      setAddPropertyManager(false);
      reload();
    } else {
      // console.log("in else");
      if (
        business_uid === property.property_manager[0].manager_id &&
        property.property_manager[0].management_status === "REJECTED"
      ) {
        // console.log("here in if");
        setShowDialog(true);
        // alert("youve already rejected this Management Company");
      } else {
        // console.log("here in else");
        const newProperty = {
          property_uid: property.property_uid,
          manager_id: business_uid,
          management_status: "FORWARDED",
        };
        for (let i = -1; i < files.length - 1; i++) {
          let key = `img_${i}`;
          if (i === -1) {
            key = "img_cover";
          }
          newProperty[key] = files[i + 1];
        }
        const response = await put("/properties", newProperty, null, files);
        setAddPropertyManager(false);
        reload();
      }
    }
  };

  // useEffect(async () => {
  //   const response = await get(
  //     `/contracts?property_uid=${property.property_uid}`
  //   );
  //   setContracts(response.result);
  //   setFeeState(JSON.parse(response.result[0].contract_fees));

  //   setFiles(JSON.parse(response.result[0].documents));

  //   contactState[1](JSON.parse(response.result[0].assigned_contacts));
  // }, []);
  useEffect(async () => {
    const response = await get(`/businesses?business_type=MANAGEMENT`);
    setBusinesses(response.result);
    setSelectedBusiness(JSON.stringify(response.result[0]));
  }, []);

  return (
    <div className=" mx-4 d-flex flex-column gap-2">
      <Dialog
        open={showDialog}
        // onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Already Rejected</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This Property Manager has already refused. Please choose another
            one.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>

      {property.management_status === "ACCEPTED" ? (
        <div className="mt-2 mb-4">
          <Button
            variant="outline-primary"
            style={smallPillButton}
            // onClick={() => setAddPropertyManager(true)}
            onClick={() => {
              // console.log(addPropertyManager);
              // setAddPropertyManager(true);
              setSearchPM(true);
              // console.log(addPropertyManager);
              // navigate("/pm-list", {
              //   state: {
              //     property: property,
              //     property_uid: property.property_uid,
              //   },
              // });
            }}
          >
            Change Property Manager
          </Button>
        </div>
      ) : addPropertyManager ? (
        <div className="mt-2 mb-4">
          {/* {console.log("here")} */}
          <Form.Group>
            <Form.Select
              style={squareForm}
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
            >
              {/* {console.log("here")} */}
              {businesses.map((business, i) => (
                <option key={i} value={JSON.stringify(business)}>
                  {business.business_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <div className="mt-2 text-center">
            <Button
              variant="outline-primary"
              style={pillButton}
              className="mx-1"
              onClick={() => setAddPropertyManager(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline-primary"
              style={pillButton}
              className="mx-1"
              onClick={updateBusiness}
            >
              Save
            </Button>
          </div>
        </div>
      ) : property.management_status !== "ACCEPTED" ? (
        <div className="mt-2 mb-4">
          <Button
            variant="outline-primary"
            style={smallPillButton}
            onClick={() => {
              // console.log(addPropertyManager);
              // setAddPropertyManager(true);
              // setAddPropertyManager(true);
              setSearchPM(true);
              // console.log(addPropertyManager);
              // navigate("/pm-list", {
              //   state: {
              //     property: property,
              //     property_uid: property.property_uid,
              //   },
              // });
            }}
          >
            Search Property Managers
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ManagerDocs;
