import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import Header from "../Header";
import BusinessContact from "../BusinessContact";
import ManagerTenantRentPayments from "./ManagerTenantRentPayments";
import ManagerFooter from "./ManagerFooter";
import SideBar from "./SideBar";
import UpdateConfirmDialog from "./UpdateConfirmDialog";
import DocumentsUploadPost from "../DocumentsUploadPost";
import ArrowDown from "../../icons/ArrowDown.svg";
import File from "../../icons/File.svg";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import { put, post } from "../../utils/api";
import { days } from "../../utils/helper";
import {
  small,
  hidden,
  red,
  squareForm,
  mediumBold,
  smallPillButton,
  bluePillButton,
  smallImg,
  subHeading,
  gray,
  sidebarStyle,
} from "../../utils/styles";
import AppContext from "../../AppContext";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "2px 2px",
      border: "0.5px solid grey ",
      wordBreak: "break-word",
    },
    width: "100%",
    tableLayout: "fixed",
  },
});

function ManagerTenantAgreement(props) {
  const classes = useStyles();

  const navigate = useNavigate();
  const {
    back,
    property,
    agreement,
    acceptedTenantApplications,
    setAcceptedTenantApplications,
  } = props;
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  console.log(property, agreement, acceptedTenantApplications);
  const { ably } = useContext(AppContext);
  const [tenantID, setTenantID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [feeState, setFeeState] = useState([]);
  const [oldAgreement, setOldAgreement] = useState([]);
  const [updatedAgreement, setUpdatedAgreement] = useState([]);
  const contactState = useState([]);
  const [files, setFiles] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [rentalStatus, setRentalStatus] = useState("");
  const [editingDoc, setEditingDoc] = useState(null);
  const [addDoc, setAddDoc] = useState(false);
  const [dueDate, setDueDate] = useState("1");
  const [lateAfter, setLateAfter] = useState("");
  const [lateFee, setLateFee] = useState("");
  const [lateFeePer, setLateFeePer] = useState("");
  const [available, setAvailable] = useState("");

  const [adults, setAdults] = useState([]);
  const [children, setChildren] = useState([]);
  const [pets, setPets] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [referred, setReferences] = useState([]);

  const [showSpinner, setShowSpinner] = useState(false);
  const [width, setWindowWidth] = useState(0);

  const channel_application = ably.channels.get("application_status");
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
  const onCancel = () => {
    setShowDialog(false);
  };

  const loadAgreement = () => {
    // console.log(agreement);
    // setOldAgreement(agreement);
    setTenantID(agreement.tenant_id);
    setStartDate(agreement.lease_start);
    setEndDate(agreement.lease_end);
    // setEffectiveDate(agreement.effective_date);
    setFeeState(JSON.parse(agreement.rent_payments));
    // console.log(agreement.rent_payments);
    contactState[1](JSON.parse(agreement.assigned_contacts));
    setFiles(JSON.parse(agreement.documents));
    setAvailable(agreement.available_topay);
    setRentalStatus(agreement.rental_status);
    setDueDate(agreement.due_by);
    setLateAfter(agreement.late_by);
    setLateFee(agreement.late_fee);
    setLateFeePer(agreement.perDay_late_fee);
    setAdults(JSON.parse(agreement.adults));
    setChildren(JSON.parse(agreement.children));
    setPets(JSON.parse(agreement.pets));
    setVehicles(JSON.parse(agreement.vehicles));
    setReferences(JSON.parse(agreement.referred));
    const newAgreement = {
      rental_property_id: property.property_uid,
      lease_start: agreement.lease_start,
      lease_end: agreement.lease_end,
      rental_status: agreement.rental_status,
      rent_payments: JSON.parse(agreement.rent_payments),
      available_topay: agreement.available_topay,
      due_by: agreement.due_by,
      late_by: agreement.late_by,
      late_fee: agreement.late_fee,
      perDay_late_fee: agreement.perDay_late_fee,
      assigned_contacts: JSON.parse(agreement.assigned_contacts),
      adults: JSON.parse(agreement.adults),
      children: JSON.parse(agreement.children),
      pets: JSON.parse(agreement.pets),
      vehicles: JSON.parse(agreement.vehicles),
      referred: JSON.parse(agreement.referred),
      documents: JSON.parse(agreement.documents),
    };
    setOldAgreement(newAgreement);
  };
  useEffect(() => {
    // console.log("in useeffect", agreement);
    if (agreement) {
      loadAgreement();
    }
    if (acceptedTenantApplications[0].adults) {
      setAdults(JSON.parse(acceptedTenantApplications[0].adults));
    }
    if (acceptedTenantApplications[0].children) {
      setChildren(JSON.parse(acceptedTenantApplications[0].children));
    }
    if (acceptedTenantApplications[0].pets) {
      setPets(JSON.parse(acceptedTenantApplications[0].pets));
    }

    if (acceptedTenantApplications[0].vehicles) {
      setVehicles(JSON.parse(acceptedTenantApplications[0].vehicles));
    }
    if (acceptedTenantApplications[0].referred) {
      setReferences(JSON.parse(acceptedTenantApplications[0].referred));
    }
  }, []);

  // first time lease creation
  const forwardLeaseAgreement = async () => {
    if (startDate === "" || endDate === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }

    let start_date = new Date(startDate);
    let end_date = new Date(endDate);
    if (start_date >= end_date) {
      setErrorMessage("Select an End Date later than Start Date");
      return;
    }

    if (
      dueDate === "" ||
      lateAfter === "" ||
      lateFee === "" ||
      lateFeePer === ""
    ) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    setErrorMessage("");

    setShowSpinner(true);
    for (let i = 0; i < feeState.length; i++) {
      if (feeState[i]["fee_name"] === "Deposit") {
        feeState[i]["available_topay"] = available;
        feeState[i]["due_by"] =
          startDate && startDate.split("-")[2].charAt(0) === "0"
            ? startDate.split("-")[2].charAt(1)
            : startDate.split("-")[2];
        feeState[i]["late_by"] = lateAfter;
        feeState[i]["late_fee"] = lateFee;
        feeState[i]["perDay_late_fee"] = lateFeePer;
      } else if (feeState[i]["fee_name"] === "Rent") {
        feeState[i]["available_topay"] = available;
        feeState[i]["due_by"] = dueDate;
        feeState[i]["late_by"] = lateAfter;
        feeState[i]["late_fee"] = lateFee;
        feeState[i]["perDay_late_fee"] = lateFeePer;
      } else {
      }
    }
    for (let i = 0; i < feeState.length; i++) {
      if (feeState[i]["fee_name"] === "Rent") {
        if (
          parseInt(feeState[i]["charge"]) !== parseInt(property.listed_rent)
        ) {
          const updateRent = {
            property_uid: property.property_uid,
            listed_rent: feeState[i]["charge"],
          };

          const images = JSON.parse(property.images);
          for (let i = -1; i < images.length - 1; i++) {
            let key = `img_${i}`;
            if (i === -1) {
              key = "img_cover";
            }
            updateRent[key] = images[i + 1];
          }

          const response = await put("/properties", updateRent, null, images);
        }
      } else if (feeState[i]["fee_name"] === "Deposit") {
        if (parseInt(feeState[i]["charge"]) !== parseInt(property.deposit)) {
          const updateDeposit = {
            property_uid: property.property_uid,
            deposit: feeState[i]["charge"],
          };

          const images = JSON.parse(property.images);
          for (let i = -1; i < images.length - 1; i++) {
            let key = `img_${i}`;
            if (i === -1) {
              key = "img_cover";
            }
            updateDeposit[key] = images[i + 1];
          }

          const response = await put(
            "/properties",
            updateDeposit,
            null,
            images
          );
        }
      }
    }
    const newAgreement = {
      rental_property_id: property.property_uid,
      tenant_id: null,
      lease_start: startDate,
      lease_end: endDate,
      rent_payments: JSON.stringify(feeState),
      assigned_contacts: JSON.stringify(contactState[0]),
      available_topay: available,
      due_by: dueDate,
      late_by: lateAfter,
      late_fee: lateFee,
      perDay_late_fee: lateFeePer,
      adults: JSON.stringify(adults),
      children: JSON.stringify(children),
      pets: JSON.stringify(pets),
      vehicles: JSON.stringify(vehicles),
      referred: JSON.stringify(referred),
      effective_date: startDate,
    };
    const newFiles = [...files];

    for (let i = 0; i < newFiles.length; i++) {
      let key = `doc_${i}`;
      if (newFiles[i].file !== undefined) {
        newAgreement[key] = newFiles[i].file;
      } else {
        newAgreement[key] = newFiles[i].link;
      }

      delete newFiles[i].file;
    }
    newAgreement.documents = JSON.stringify(newFiles);
    newAgreement.linked_application_id = JSON.stringify(
      acceptedTenantApplications.map(
        (application) => application.application_uid
      )
    );

    for (const application of acceptedTenantApplications) {
      newAgreement.tenant_id = application.tenant_id;
      // console.log(newAgreement);

      const request_body = {
        application_uid: application.application_uid,
        message: "Lease details forwarded for review",
        application_status: "FORWARDED",
      };
      // console.log(request_body)
      const update_application = await put("/applications", request_body);
      channel_application.publish({ data: { te: request_body } });
      // console.log(response)
      // console.log(application);
      const newMessage = {
        sender_name: application.business_name,
        sender_email: application.business_email,
        sender_phone: application.business_phone_number,
        message_subject: "New Lease Uploaded",
        message_details: "PM has started the lease process",
        message_created_by: application.business_uid,
        user_messaged: application.tenant_id,
        message_status: "PENDING",
        receiver_email: application.tenant_email,
        receiver_phone: application.tenant_phone_number,
      };
      // console.log(newMessage);
      const responseMsg = await post("/messageEmail", newMessage);
    }

    // const tenant_ids = acceptedTenantApplications.map(application => application.tenant_id)
    newAgreement.tenant_id = JSON.stringify(
      acceptedTenantApplications.map((application) => application.tenant_id)
    );
    newAgreement.rental_status = "PROCESSING";
    // console.log(newAgreement);
    const create_rental = await post("/rentals", newAgreement, null, files);

    setShowSpinner(false);

    back();
  };
  // save
  const save = async () => {
    setShowSpinner(true);
    // update properties table if change in rent or deposit
    for (let i = 0; i < feeState.length; i++) {
      if (feeState[i]["fee_name"] === "Rent") {
        if (
          parseInt(feeState[i]["charge"]) !== parseInt(property.listed_rent)
        ) {
          const updateRent = {
            property_uid: property.property_uid,
            listed_rent: feeState[i]["charge"],
          };

          const images = JSON.parse(property.images);
          for (let i = -1; i < images.length - 1; i++) {
            let key = `img_${i}`;
            if (i === -1) {
              key = "img_cover";
            }
            updateRent[key] = images[i + 1];
          }

          const response = await put("/properties", updateRent, null, images);
        }
      } else if (feeState[i]["fee_name"] === "Deposit") {
        if (parseInt(feeState[i]["charge"]) !== parseInt(property.deposit)) {
          const updateDeposit = {
            property_uid: property.property_uid,
            deposit: feeState[i]["charge"],
          };

          const images = JSON.parse(property.images);
          for (let i = -1; i < images.length - 1; i++) {
            let key = `img_${i}`;
            if (i === -1) {
              key = "img_cover";
            }
            updateDeposit[key] = images[i + 1];
          }

          const response = await put(
            "/properties",
            updateDeposit,
            null,
            images
          );
        }
      }
    }
    // lease status is processing to active
    if (agreement.rental_status === "PROCESSING") {
      // console.log(lateFee);
      const newAgreement = {
        rental_property_id: property.property_uid,
        lease_start: startDate,
        lease_end: endDate,
        rental_status: rentalStatus,
        rent_payments: JSON.stringify(feeState),
        available_topay: available,
        due_by: dueDate,
        late_by: lateAfter,
        late_fee: lateFee,
        perDay_late_fee: lateFeePer,
        assigned_contacts: JSON.stringify(contactState[0]),
        adults: JSON.stringify(adults),
        children: JSON.stringify(children),
        pets: JSON.stringify(pets),
        vehicles: JSON.stringify(vehicles),
        referred: JSON.stringify(referred),
        effective_date: effectiveDate,
      };

      // console.log(newAgreement);
      const newFiles = [...files];

      for (let i = 0; i < newFiles.length; i++) {
        let key = `doc_${i}`;
        if (newFiles[i].file !== undefined) {
          newAgreement[key] = newFiles[i].file;
        } else {
          newAgreement[key] = newFiles[i].link;
        }

        delete newFiles[i].file;
      }
      newAgreement.documents = JSON.stringify(newFiles);
      newAgreement.linked_application_id = JSON.stringify(
        acceptedTenantApplications.map(
          (application) => application.application_uid
        )
      );
      newAgreement.tenant_id = JSON.stringify(
        acceptedTenantApplications.map((application) => application.tenant_id)
      );
      // console.log("in if");
      newAgreement.rental_uid = agreement.rental_uid;
      // console.log(newAgreement);
      const response = await put(`/rentals`, newAgreement, null, newFiles);

      setShowSpinner(false);

      navigate("../manager");
    } else if (agreement.rental_status === "PENDING") {
      let newAgreement = {
        rental_property_id: property.property_uid,
        lease_start: startDate,
        lease_end: endDate,
        rental_status: rentalStatus,
        rent_payments: JSON.stringify(feeState),
        available_topay: available,
        due_by: dueDate,
        late_by: lateAfter,
        late_fee: lateFee,
        perDay_late_fee: lateFeePer,
        assigned_contacts: JSON.stringify(contactState[0]),
        adults: JSON.stringify(adults),
        children: JSON.stringify(children),
        pets: JSON.stringify(pets),
        vehicles: JSON.stringify(vehicles),
        referred: JSON.stringify(referred),
        effective_date: effectiveDate,
      };

      // console.log(newAgreement);
      newAgreement.linked_application_id = JSON.stringify(
        acceptedTenantApplications.map(
          (application) => application.application_uid
        )
      );
      newAgreement.tenant_id = JSON.stringify(
        acceptedTenantApplications.map((application) => application.tenant_id)
      );
      const newFiles = [...files];

      for (let i = 0; i < newFiles.length; i++) {
        let key = `doc_${i}`;
        if (newFiles[i].file !== undefined) {
          newAgreement[key] = newFiles[i].file;
        } else {
          newAgreement[key] = newFiles[i].link;
        }

        delete newFiles[i].file;
      }
      newAgreement.documents = JSON.stringify(newFiles);

      // console.log("in if");
      newAgreement.rental_uid = agreement.rental_uid;
      // console.log(newAgreement);
      const response = await put(`/rentals`, newAgreement, null, newFiles);

      setShowSpinner(false);

      navigate("../manager");
    } else {
      // lease status is not PROCESSING
      {
        for (const application of acceptedTenantApplications.map(
          (application) => application.application_uid
        )) {
          // console.log(application);
          if (
            property.rentalInfo.some((rent) => rent.rental_status === "ACTIVE")
          ) {
            if (
              application ==
                JSON.parse(
                  property.rentalInfo.find(
                    (rent) => rent.rental_status === "ACTIVE"
                  ).linked_application_id
                )[0] &&
              oldAgreement.lease_start !== startDate
            ) {
              const request_body = {
                application_uid: application,
                message: "Requesting to Extend Lease",
                application_status: "LEASE EXTENSION",
              };
              // console.log(request_body);
              const update_application = await put(
                "/applications",
                request_body
              );
              channel_application.publish({ data: { te: request_body } });
              // console.log(update_application);
            } else {
              const request_body = {
                application_uid: application,
                message: "Lease details forwarded for review",
                application_status: "FORWARDED",
              };
              // console.log(request_body);
              const update_application = await put(
                "/applications",
                request_body
              );
              channel_application.publish({ data: { te: request_body } });
              // console.log(update_application);
            }
          } else {
            const request_body = {
              application_uid: application,
              message: "Lease details forwarded for review",
              application_status: "FORWARDED",
            };
            // console.log(request_body);
            const update_application = await put("/applications", request_body);
            channel_application.publish({ data: { te: request_body } });
            // console.log(update_application);
          }
        }
      }

      let newAgreement = {};
      // if rental status is REFUSED

      if (
        rentalStatus === "REFUSED" &&
        property.rentalInfo.some((rent) => rent.rental_status === "ACTIVE")
      ) {
        newAgreement = {
          rental_property_id: property.property_uid,
          lease_start: startDate,
          lease_end: endDate,
          rental_status: "PENDING",
          rent_payments: JSON.stringify(feeState),
          available_topay: available,
          due_by: dueDate,
          late_by: lateAfter,
          late_fee: lateFee,
          perDay_late_fee: lateFeePer,
          assigned_contacts: JSON.stringify(contactState[0]),
          adults: JSON.stringify(adults),
          children: JSON.stringify(children),
          pets: JSON.stringify(pets),
          vehicles: JSON.stringify(vehicles),
          referred: JSON.stringify(referred),
          effective_date: effectiveDate,
        };
      } else if (rentalStatus === "REFUSED") {
        newAgreement = {
          rental_property_id: property.property_uid,
          lease_start: startDate,
          lease_end: endDate,
          rental_status: "PROCESSING",
          rent_payments: JSON.stringify(feeState),
          available_topay: available,
          due_by: dueDate,
          late_by: lateAfter,
          late_fee: lateFee,
          perDay_late_fee: lateFeePer,
          assigned_contacts: JSON.stringify(contactState[0]),
          adults: JSON.stringify(adults),
          children: JSON.stringify(children),
          pets: JSON.stringify(pets),
          vehicles: JSON.stringify(vehicles),
          referred: JSON.stringify(referred),
          effective_date: effectiveDate,
        };
      } else {
        newAgreement = {
          rental_property_id: property.property_uid,
          lease_start: startDate,
          lease_end: endDate,
          rental_status: rentalStatus,
          rent_payments: JSON.stringify(feeState),
          available_topay: available,
          due_by: dueDate,
          late_by: lateAfter,
          late_fee: lateFee,
          perDay_late_fee: lateFeePer,
          assigned_contacts: JSON.stringify(contactState[0]),
          adults: JSON.stringify(adults),
          children: JSON.stringify(children),
          pets: JSON.stringify(pets),
          vehicles: JSON.stringify(vehicles),
          referred: JSON.stringify(referred),
          effective_date: effectiveDate,
        };
      }

      // console.log(newAgreement);
      newAgreement.linked_application_id = JSON.stringify(
        acceptedTenantApplications.map(
          (application) => application.application_uid
        )
      );
      newAgreement.tenant_id = JSON.stringify(
        acceptedTenantApplications.map((application) => application.tenant_id)
      );
      const newFiles = [...files];

      for (let i = 0; i < newFiles.length; i++) {
        let key = `doc_${i}`;
        if (newFiles[i].file !== undefined) {
          newAgreement[key] = newFiles[i].file;
        } else {
          newAgreement[key] = newFiles[i].link;
        }

        delete newFiles[i].file;
      }
      newAgreement.documents = JSON.stringify(newFiles);

      // console.log("in if");
      newAgreement.rental_uid = agreement.rental_uid;
      // console.log(newAgreement);
      const response = await put(`/rentals`, newAgreement, null, newFiles);

      setShowSpinner(false);

      navigate("../manager");
    }
  };

  // on lease renewal
  const renewLease = async () => {
    if (startDate === "" || endDate === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }

    let start_date = new Date(startDate);
    let end_date = new Date(endDate);
    if (start_date >= end_date) {
      setErrorMessage("Select an End Date later than Start Date");
      return;
    }

    if (
      dueDate === "" ||
      lateAfter === "" ||
      lateFee === "" ||
      lateFeePer === ""
    ) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    setErrorMessage("");
    setShowSpinner(true);
    for (let i = 0; i < feeState.length; i++) {
      if (feeState[i]["fee_name"] === "Rent") {
        if (
          parseInt(feeState[i]["charge"]) !== parseInt(property.listed_rent)
        ) {
          const updateRent = {
            property_uid: property.property_uid,
            listed_rent: feeState[i]["charge"],
          };

          const images = JSON.parse(property.images);
          for (let i = -1; i < images.length - 1; i++) {
            let key = `img_${i}`;
            if (i === -1) {
              key = "img_cover";
            }
            updateRent[key] = images[i + 1];
          }

          const response = await put("/properties", updateRent, null, images);
        }
      } else if (feeState[i]["fee_name"] === "Deposit") {
        if (parseInt(feeState[i]["charge"]) !== parseInt(property.deposit)) {
          const updateDeposit = {
            property_uid: property.property_uid,
            deposit: feeState[i]["charge"],
          };

          const images = JSON.parse(property.images);
          for (let i = -1; i < images.length - 1; i++) {
            let key = `img_${i}`;
            if (i === -1) {
              key = "img_cover";
            }
            updateDeposit[key] = images[i + 1];
          }

          const response = await put(
            "/properties",
            updateDeposit,
            null,
            images
          );
        }
      }
    }
    // if refused or processing and change in start date
    if (rentalStatus === "REFUSED" || rentalStatus === "PROCESSING") {
      // console.log(agreement.linked_application_id);
      for (const application of acceptedTenantApplications.map(
        (application) => application.application_uid
      )) {
        // console.log(application);

        const request_body = {
          application_uid: application,
          message: "Lease details forwarded for review",
          application_status: "FORWARDED",
        };
        // console.log(request_body);
        const update_application = await put("/applications", request_body);
        channel_application.publish({ data: { te: request_body } });
      }
      let newAgreement = {
        rental_property_id: property.property_uid,
        lease_start: startDate,
        lease_end: endDate,
        rental_status: "PROCESSING",
        rent_payments: JSON.stringify(feeState),
        available_topay: available,
        due_by: dueDate,
        late_by: lateAfter,
        late_fee: lateFee,
        perDay_late_fee: lateFeePer,
        assigned_contacts: JSON.stringify(contactState[0]),
        adults: JSON.stringify(adults),
        children: JSON.stringify(children),
        pets: JSON.stringify(pets),
        vehicles: JSON.stringify(vehicles),
        referred: JSON.stringify(referred),
        effective_date: effectiveDate,
      };
      // console.log(newAgreement);
      const newFiles = [...files];

      for (let i = 0; i < newFiles.length; i++) {
        let key = `doc_${i}`;
        if (newFiles[i].file !== undefined) {
          newAgreement[key] = newFiles[i].file;
        } else {
          newAgreement[key] = newFiles[i].link;
        }

        delete newFiles[i].file;
      }
      newAgreement.documents = JSON.stringify(newFiles);
      newAgreement.linked_application_id = JSON.stringify(
        acceptedTenantApplications.map(
          (application) => application.application_uid
        )
      );
      newAgreement.tenant_id = JSON.stringify(
        acceptedTenantApplications.map((application) => application.tenant_id)
      );
      // console.log("in if");
      newAgreement.rental_uid = agreement.rental_uid;
      // console.log(newAgreement);
      const response = await put(`/rentals`, newAgreement, null, newFiles);

      setShowSpinner(false);

      navigate("../manager");
    } else {
      // full renewal
      const newAgreement = {
        rental_property_id: property.property_uid,
        tenant_id: null,
        lease_start: startDate,
        lease_end: endDate,
        rent_payments: JSON.stringify(feeState),
        assigned_contacts: JSON.stringify(contactState[0]),
        rental_status: "PENDING",
        available_topay: available,
        due_by: dueDate,
        late_by: lateAfter,
        late_fee: lateFee,
        perDay_late_fee: lateFeePer,
        adults: adults,
        children: children,
        pets: pets,
        vehicles: vehicles,
        referred: referred,
        documents: files,
        effective_date: effectiveDate,
      };
      const newFiles = [...files];

      for (let i = 0; i < newFiles.length; i++) {
        let key = `doc_${i}`;
        if (newFiles[i].file !== undefined) {
          newAgreement[key] = newFiles[i].file;
        } else {
          newAgreement[key] = newFiles[i].link;
        }

        delete newFiles[i].file;
      }
      newAgreement.documents = JSON.stringify(newFiles);
      newAgreement.tenant_id = JSON.stringify(
        acceptedTenantApplications.map((application) => application.tenant_id)
      );
      newAgreement.linked_application_id = JSON.stringify(
        acceptedTenantApplications.map(
          (application) => application.application_uid
        )
      );
      // console.log(newAgreement);
      const create_rental = await post(
        "/extendLease",
        newAgreement,
        null,
        files
      );
      let apps = property.applications.filter(
        (a) => a.application_status === "RENTED"
      );
      let extendObject = {};
      if (
        apps[0].application_uid ==
        acceptedTenantApplications.map(
          (application) => application.application_uid
        )
      ) {
        extendObject = {
          application_status: "LEASE EXTENSION",
          property_uid: property.property_uid,
          message: "Requesting to Extend Lease",
        };
        channel_application.publish({ data: { te: extendObject } });
        extendObject.application_uid =
          apps.length > 0 ? apps[0].application_uid : null;
        const newMessage = {
          sender_name: property.managerInfo.manager_business_name,
          sender_email: property.managerInfo.manager_email,
          sender_phone: property.managerInfo.manager_phone_number,
          message_subject: "Extend Lease",
          message_details: "PM has started the extend lease process",
          message_created_by: property.managerInfo.manager_id,
          user_messaged: property.rentalInfo[0].tenant_id,
          message_status: "PENDING",
          receiver_email: property.rentalInfo[0].tenant_email,
          receiver_phone: property.rentalInfo[0].tenant_phone_number,
        };
        // console.log(newMessage);
        const responseMsg = await post("/messageEmail", newMessage);
      } else {
        extendObject = {
          application_status: "FORWARDED",
          property_uid: property.property_uid,
          message: "Lease details forwarded for review",
        };
        extendObject.application_uid = acceptedTenantApplications.map(
          (application) => application.application_uid
        );
        const newMessage = {
          sender_name: property.managerInfo.manager_business_name,
          sender_email: property.managerInfo.manager_email,
          sender_phone: property.managerInfo.manager_phone_number,
          message_subject: "New Lease Uploaded",
          message_details: "PM has started the lease process",
          message_created_by: property.managerInfo.manager_id,
          user_messaged: property.rentalInfo[0].tenant_id,
          message_status: "PENDING",
          receiver_email: property.rentalInfo[0].tenant_email,
          receiver_phone: property.rentalInfo[0].tenant_phone_number,
        };
        // console.log(newMessage);
        const responseMsg = await post("/messageEmail", newMessage);
      }

      // console.log(extendObject);
      if (apps.length > 0) {
        const response6 = await put("/extendLease", extendObject);
      }
      channel_application.publish({ data: { te: extendObject } });
      setShowSpinner(false);
      back();
    }
  };

  // filter old and new lease agreements
  const filterAgreement = () => {
    if (effectiveDate === "") {
      setErrorMessage("Please fill out the effective date");
      return;
    } else {
      setErrorMessage("");
    }
    let og = oldAgreement;
    const newAgreement = {
      rental_property_id: property.property_uid,
      lease_start: startDate,
      lease_end: endDate,
      rental_status: rentalStatus,
      rent_payments: feeState,
      available_topay: available,
      due_by: dueDate,
      late_by: lateAfter,
      late_fee: lateFee,
      perDay_late_fee: lateFeePer,
      assigned_contacts: contactState[0],
      adults: adults,
      children: children,
      pets: pets,
      vehicles: vehicles,
      referred: referred,
      documents: files,
      effective_date: effectiveDate,
    };
    let up = newAgreement;
    // console.log("og", oldAgreement);
    // console.log("up", up);
    setUpdatedAgreement(up);
    setShowDialog(true);
  };

  const [errorMessage, setErrorMessage] = useState("");
  const required =
    errorMessage === "Please fill out all fields" ||
    errorMessage === "Please fill out the effective date" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  return (
    <Row>
      <UpdateConfirmDialog
        title={"Review the lease"}
        updatedAgreement={updatedAgreement}
        oldAgreement={oldAgreement}
        button1={"Go back to Edit"}
        button2={"Send Updated Lease Details to Tenant(s)"}
        isOpen={showDialog}
        onConfirm={oldAgreement.lease_start !== startDate ? renewLease : save}
        onCancel={onCancel}
        showSpinner={showSpinner}
      />
      <Col xs={2} hidden={!responsiveSidebar.showSidebar} style={sidebarStyle}>
        <SideBar />
      </Col>
      <Col className="w-100 mb-5 overflow-hidden">
        <Header
          title="Tenant Agreement"
          leftText="< Back"
          leftFn={back}
          rightText=""
        />
        <div className=" w-100 ">
          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <h5 style={mediumBold}>Tenant(s)</h5>

            {acceptedTenantApplications &&
              acceptedTenantApplications.length > 0 &&
              acceptedTenantApplications.map((application, i) => (
                <div>
                  <Row className="p-1">
                    <Col>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0" style={mediumBold}>
                          {application.tenant_first_name}{" "}
                          {application.tenant_last_name}
                        </h5>
                      </div>
                    </Col>

                    <Col>
                      <div className="d-flex  justify-content-end ">
                        <div
                          style={application.tenant_id ? {} : hidden}
                          onClick={stopPropagation}
                        >
                          <a href={`tel:${application.tenant_phone_number}`}>
                            <img src={Phone} alt="Phone" style={smallImg} />
                          </a>
                          <a href={`mailto:${application.tenant_email}`}>
                            <img src={Message} alt="Message" style={smallImg} />
                          </a>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label as="h6" className="my-2">
                          Adult Occupants
                        </Form.Label>
                        {application.adults &&
                        JSON.parse(application.adults).length > 0 ? (
                          <Table
                            responsive="md"
                            classes={{ root: classes.customTable }}
                            size="small"
                          >
                            <TableHead>
                              {" "}
                              <TableRow style={subHeading}>
                                <TableCell>Name</TableCell>
                                <TableCell>Relationship</TableCell>
                                <TableCell>DOB(YYYY-MM-DD)</TableCell>
                              </TableRow>
                            </TableHead>

                            {JSON.parse(application.adults).map((adult) => {
                              return (
                                <TableBody>
                                  <TableRow style={gray}>
                                    <TableCell>{adult.name}</TableCell>
                                    <TableCell>{adult.relationship}</TableCell>
                                    <TableCell>{adult.dob}</TableCell>
                                  </TableRow>
                                </TableBody>
                              );
                            })}
                          </Table>
                        ) : (
                          <Row className="mx-3 ">None</Row>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Label as="h6" className="my-2">
                        Children Occupants
                      </Form.Label>
                      <Form.Group>
                        {application.children &&
                        JSON.parse(application.children).length > 0 ? (
                          <Table
                            responsive="md"
                            classes={{ root: classes.customTable }}
                            size="small"
                          >
                            <TableHead>
                              {" "}
                              <TableRow style={subHeading}>
                                <TableCell>Name</TableCell>
                                <TableCell>Relationship</TableCell>
                                <TableCell>DOB(YYYY-MM-DD)</TableCell>
                              </TableRow>
                            </TableHead>

                            {JSON.parse(application.children).map((child) => {
                              return (
                                <TableBody>
                                  <TableRow style={gray}>
                                    <TableCell>{child.name}</TableCell>
                                    <TableCell>{child.relationship}</TableCell>
                                    <TableCell>{child.dob}</TableCell>
                                  </TableRow>
                                </TableBody>
                              );
                            })}
                          </Table>
                        ) : (
                          <Row className="mx-3 ">None</Row>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label as="h6" className="my-2">
                          Pets
                        </Form.Label>
                        {application.pets &&
                        JSON.parse(application.pets).length > 0 ? (
                          <Table
                            responsive="md"
                            classes={{ root: classes.customTable }}
                            size="small"
                          >
                            <TableHead>
                              <TableRow style={subHeading}>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Breed</TableCell>
                                <TableCell>Weight (lbs)</TableCell>
                              </TableRow>
                            </TableHead>

                            {JSON.parse(application.pets).map((pet) => {
                              return (
                                <TableBody>
                                  <TableRow style={gray}>
                                    <TableCell>{pet.name}</TableCell>
                                    <TableCell>{pet.type}</TableCell>
                                    <TableCell>{pet.breed}</TableCell>
                                    <TableCell>{pet.weight}</TableCell>
                                  </TableRow>
                                </TableBody>
                              );
                            })}
                          </Table>
                        ) : (
                          <Row className="mx-3 ">None</Row>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label as="h6" className="my-2">
                          Vehicles
                        </Form.Label>
                        {application.vehicles &&
                        JSON.parse(application.vehicles).length > 0 ? (
                          <Table
                            responsive="md"
                            classes={{ root: classes.customTable }}
                            size="small"
                          >
                            <TableHead>
                              {" "}
                              <TableRow style={subHeading}>
                                <TableCell>Make</TableCell>
                                <TableCell>Model</TableCell>
                                <TableCell>Year</TableCell>
                                <TableCell>State</TableCell>
                                <TableCell>License</TableCell>
                              </TableRow>
                            </TableHead>

                            {JSON.parse(application.vehicles).map((vehicle) => {
                              return (
                                <TableBody>
                                  <TableRow style={gray}>
                                    <TableCell>{vehicle.make}</TableCell>
                                    <TableCell>{vehicle.model}</TableCell>
                                    <TableCell>{vehicle.year}</TableCell>
                                    <TableCell>{vehicle.state}</TableCell>
                                    <TableCell>{vehicle.license}</TableCell>
                                  </TableRow>
                                </TableBody>
                              );
                            })}
                          </Table>
                        ) : (
                          <Row className="mx-3 ">None</Row>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label as="h6" className="my-2">
                          References
                        </Form.Label>
                        {application.referred &&
                        JSON.parse(application.referred).length > 0 ? (
                          <Table
                            responsive="md"
                            classes={{ root: classes.customTable }}
                            size="small"
                          >
                            <TableHead>
                              {" "}
                              <TableRow style={subHeading}>
                                <TableCell>Name</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Relationship</TableCell>
                              </TableRow>
                            </TableHead>
                            {JSON.parse(application.referred).map(
                              (reference) => {
                                return (
                                  <TableBody>
                                    <TableRow style={gray}>
                                      <TableCell>{reference.name}</TableCell>
                                      <TableCell>{reference.address}</TableCell>
                                      <TableCell>{reference.phone}</TableCell>
                                      <TableCell>{reference.email}</TableCell>
                                      <TableCell>
                                        {reference.relationship}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                );
                              }
                            )}
                          </Table>
                        ) : (
                          <Row className="mx-3 ">None</Row>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              ))}
          </div>
          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <Row className="mb-4">
              <Col>
                <Form.Group>
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Lease Start Date {startDate === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setEffectiveDate(e.target.value);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Lease End Date {endDate === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            {" "}
            <div className="my-3 mx-2">
              <h5 style={mediumBold}>Default Payment Parameters</h5>
              <Row>
                <Col>
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Rent Available to Pay(days before due){" "}
                    {available === "" ? required : ""}
                  </Form.Label>
                </Col>
                <Col>
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Rent Payment Due Date {dueDate === "" ? required : ""}
                  </Form.Label>
                </Col>
                <Col>
                  {" "}
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Effective Date {effectiveDate === "" ? required : ""}
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Control
                      type="number"
                      min="0"
                      style={squareForm}
                      placeholder="days"
                      value={available}
                      onChange={(e) => setAvailable(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    {/*<Form.Control style={squareForm} placeholder='5 Days' />*/}
                    <Form.Select
                      style={{
                        ...squareForm,
                      }}
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    >
                      <option value="1">1st of the month</option>
                      <option value="2">2nd of the month</option>
                      <option value="3">3rd of the month</option>
                      <option value="4">4th of the month</option>
                      <option value="5">5th of the month</option>
                      <option value="10">10th of the month</option>
                      <option value="15">15th of the month</option>
                      <option value="20">20th of the month</option>
                      <option value="25">25th of the month</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Control
                      type="date"
                      style={{
                        ...squareForm,
                        padding: "3px",
                      }}
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
            <div className="mx-2 mb-2">
              <h5 style={mediumBold}>Late Payment Details</h5>
              <Row>
                <Col>
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Late fees after (days)
                    {lateAfter === "" ? required : ""}
                  </Form.Label>
                </Col>
                <Col>
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Late Fee (one-time) {lateFee === "" ? required : ""}
                  </Form.Label>
                </Col>
                <Col>
                  {" "}
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Late Fee (per day) {lateFeePer === "" ? required : ""}
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Control
                      value={lateAfter}
                      style={squareForm}
                      placeholder="days"
                      type="number"
                      min="0"
                      onChange={(e) => setLateAfter(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Control
                      value={lateFee}
                      type="number"
                      min="0"
                      style={squareForm}
                      placeholder="amount($)"
                      onChange={(e) => setLateFee(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Control
                      value={lateFeePer}
                      type="number"
                      min="0"
                      style={squareForm}
                      placeholder="amount($)"
                      onChange={(e) => setLateFeePer(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>

          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <h5 style={mediumBold}>Rent Payments</h5>
            <div className="mx-2">
              <ManagerTenantRentPayments
                agreement={agreement}
                feeState={feeState}
                setFeeState={setFeeState}
                property={property}
                startDate={startDate}
                endDate={endDate}
                dueDate={dueDate}
                lateAfter={lateAfter}
                lateFee={lateFee}
                lateFeePer={lateFeePer}
                available={available}
              />
            </div>
          </div>

          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <h5 style={mediumBold}>Contact Details</h5>
            <div className="mx-2">
              <BusinessContact state={contactState} />
            </div>
          </div>

          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <h5 style={mediumBold}>Lease Documents</h5>
            <div className="mx-2">
              {" "}
              <DocumentsUploadPost
                files={files}
                setFiles={setFiles}
                addDoc={addDoc}
                setAddDoc={setAddDoc}
                editingDoc={editingDoc}
                setEditingDoc={setEditingDoc}
              />
            </div>
          </div>
          {showSpinner ? (
            <div className="w-100 d-flex flex-column justify-content-center align-items-center">
              <ReactBootStrap.Spinner animation="border" role="status" />
            </div>
          ) : (
            ""
          )}
          <Row className="mt-4" hidden={agreement !== null}>
            <div
              className="text-center"
              style={errorMessage === "" ? hidden : {}}
            >
              <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
            </div>
            <Col className="d-flex justify-content-evenly">
              <Button style={bluePillButton} onClick={forwardLeaseAgreement}>
                Send Lease Details to Tenant(s)
              </Button>
            </Col>
          </Row>
          {acceptedTenantApplications !== [] &&
          acceptedTenantApplications[0] !== undefined &&
          agreement !== null ? (
            <Row className="pt-1 mt-3 mb-2">
              <div
                className="text-center"
                style={errorMessage === "" ? hidden : {}}
              >
                <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
              </div>
              <Col className="d-flex justify-content-evenly">
                <Button
                  style={bluePillButton}
                  // onClick={save}
                  onClick={filterAgreement}
                  on
                  // hidden={
                  //   acceptedTenantApplications[0].application_status !==
                  //     "RENTED" &&
                  //   acceptedTenantApplications[0].application_status !==
                  //     "FORWARDED" &&
                  //   acceptedTenantApplications[0].application_status !==
                  //     "LEASE EXTENSION" &&
                  //   acceptedTenantApplications[0].application_status !==
                  //     "TENANT LEASE EXTENSION" &&
                  //   acceptedTenantApplications[0].application_status !==
                  //     "REFUSED"
                  // }
                >
                  Review Changes to the Lease
                </Button>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* {acceptedTenantApplications !== [] &&
          acceptedTenantApplications[0] !== undefined &&
          agreement !== null ? (
            <Row className="pt-1 mt-3 mb-2">
              <div
                className="text-center"
                style={errorMessage === "" ? hidden : {}}
              >
                <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
              </div>
              <Col className="d-flex justify-content-evenly">
                <Button
                  style={bluePillButton}
                  // onClick={save}
                  onClick={filterAgreement}
                  on
                  hidden={
                    (acceptedTenantApplications[0].application_status !==
                      "RENTED" &&
                      Math.floor(
                        (new Date(agreement.lease_end).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) > 60) ||
                    (acceptedTenantApplications[0].application_status !==
                      "FORWARDED" &&
                      Math.floor(
                        (new Date(agreement.lease_end).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) > 60) ||
                    acceptedTenantApplications[0].application_status ===
                      "LEASE EXTENSION"
                  }
                >
                  Review Changes to the Lease
                </Button>
              </Col>
            </Row>
          ) : (
            ""
          )} */}

          {/* {agreement !== null ? (
            (acceptedTenantApplications[0].application_status !== "RENTED" &&
              Math.floor(
                (new Date(agreement.lease_end).getTime() -
                  new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              ) < 60) ||
            (acceptedTenantApplications[0].application_status !== "FORWARDED" &&
              Math.floor(
                (new Date(agreement.lease_end).getTime() -
                  new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              ) < 60) ||
            agreement.lease_start !== startDate ? (
              <Row className="pt-1 mt-3 mb-2">
                <Col className="d-flex flex-row justify-content-evenly">
                  <Button
                    style={bluePillButton}
                    variant="outline-primary"
                    onClick={() => renewLease()}
                  >
                    Forward New Lease Agreement
                  </Button>
                </Col>
              </Row>
            ) : (
              ""
            )
          ) : (
            ""
          )} */}
        </div>

        <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-5">
          <ManagerFooter />
        </div>
      </Col>
    </Row>
  );
}

export default ManagerTenantAgreement;
