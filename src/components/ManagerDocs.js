import React from "react";
import { Button, Form } from "react-bootstrap";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import File from "../icons/File.svg";
import { get, put } from "../utils/api";
import {
  pillButton,
  smallPillButton,
  mediumBold,
  squareForm,
} from "../utils/styles";

function ManagerDocs(props) {
  const { addDocument, property, selectContract, reload } = props;
  const [contracts, setContracts] = React.useState([]);
  const [businesses, setBusinesses] = React.useState([]);
  const [selectedBusiness, setSelectedBusiness] = React.useState(null);
  const [addPropertyManager, setAddPropertyManager] = React.useState(false);

  const [showDialog, setShowDialog] = React.useState(false);
  console.log(property);
  const updateBusiness = async () => {
    const files = JSON.parse(property.images);
    const business_uid = JSON.parse(selectedBusiness).business_uid;

    if (property.property_manager.length > 0) {
      console.log("in if");
      for (const prop of property.property_manager) {
        if (
          business_uid === prop.manager_id &&
          prop.management_status === "REJECTED"
        ) {
          console.log("here in if");

          // alert("youve already rejected this Management Company");
          setShowDialog(true);
          reload();
        } else {
          console.log("here in else");
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
      console.log("in else");
      if (
        business_uid === property.property_manager[0].manager_id &&
        property.property_manager[0].management_status === "REJECTED"
      ) {
        console.log("here in if");
        setShowDialog(true);
        // alert("youve already rejected this Management Company");
      } else {
        console.log("here in else");
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

  React.useEffect(async () => {
    const response = await get(
      `/contracts?property_uid=${property.property_uid}`
    );
    setContracts(response.result);
  }, []);
  React.useEffect(async () => {
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
            This Property Manager has already been rejected. Please choose
            another one.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>

      {property.management_status === "ACCEPTED" ? (
        <div className="d-flex flex-column gap-2">
          {contracts.map((contract, i) => (
            <div key={i} onClick={() => selectContract(contract)}>
              <div className="d-flex justify-content-between align-items-end">
                <h6 style={mediumBold}>Contract {i + 1}</h6>
                <img src={File} />
              </div>
              <hr style={{ opacity: 1 }} className="mb-0 mt-2" />
            </div>
          ))}
          <div>
            <Button
              variant="outline-primary"
              style={smallPillButton}
              onClick={addDocument}
            >
              Add Document
            </Button>
          </div>
        </div>
      ) : addPropertyManager ? (
        <div>
          <Form.Group>
            <Form.Select
              style={squareForm}
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
            >
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
      ) : (
        <div>
          <Button
            variant="outline-primary"
            style={smallPillButton}
            onClick={() => setAddPropertyManager(true)}
          >
            Add Property Manager
          </Button>
        </div>
      )}
    </div>
  );
}

export default ManagerDocs;
