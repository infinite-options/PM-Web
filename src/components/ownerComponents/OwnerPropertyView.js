import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableSortLabel,
  Box,
} from "@material-ui/core";
import Carousel from "react-multi-carousel";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import Header from "../Header";
import OwnerFooter from "./OwnerFooter";
import ImageModal from "../ImageModal";
import PropertyAppliances from "../PropertyAppliances";
import OwnerPropertyForm from "./OwnerPropertyForm";
import OwnerCreateExpense from "./OwnerCreateExpense";
import CreateRevenue from "../CreateRevenue";
import ManagerDocs from "./ManagerDocs";
import ManagementContract from "./ManagementContract";
import OwnerRepairRequest from "./OwnerRepairRequest";
import PropertyManagersList from "./PropertyManagersList";
import OwnerCashflow from "./OwnerCashflow";
import ConfirmDialog from "../ConfirmDialog";
import BusinessContact from "../BusinessContact";
import ManagerFees from "../ManagerFees";
import MailDialogManager from "../MailDialog";
import MessageDialogManager from "../MessageDialog";
import MailDialogTenant from "../MailDialog";
import MessageDialogTenant from "../MessageDialog";
import SideBar from "./SideBar";
import AppContext from "../../AppContext";
import CopyDialog from "../CopyDialog";
import File from "../../icons/File.svg";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import Mail from "../../icons/Mail.svg";
import EditIconNew from "../../icons/EditIconNew.svg";
import AddIcon from "../../icons/AddIcon.svg";
import CopyIcon from "../../icons/CopyIcon.png";
import PropertyIcon from "../../icons/PropertyIcon.svg";
import RepairImg from "../../icons/RepairImg.svg";
import { get, put, post } from "../../utils/api";
import {
  squareForm,
  mediumBold,
  bluePillButton,
  redPillButton,
  smallImg,
  sidebarStyle,
} from "../../utils/styles";
import "react-multi-carousel/lib/styles.css";
import Appliances from "../tenantComponents/Appliances";
import {
  descendingComparator as descendingComparator,
  getComparator as getComparator,
  stableSort as stableSort,
} from "../../utils/helper";

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

function OwnerPropertyView(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const { userData, refresh, ably } = useContext(AppContext);

  const channel = ably.channels.get("management_status");
  const { access_token, user } = userData;
  const property_uid =
    location.state === null ? props.property_uid : location.state.property_uid;
  const [isLoading, setIsLoading] = useState(true);
  const [property, setProperty] = useState({
    images: "[]",
  });
  const [copied, setCopied] = useState(false);
  const [imagesProperty, setImagesProperty] = useState([]);
  const [showAddRequest, setShowAddRequest] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 3000, min: 1560 },
      items: 5,
    },

    desktop: {
      breakpoint: { max: 1560, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const [editAppliances, setEditAppliances] = useState(false);
  const [selectedManager, setSelectedManager] = useState("");
  const [showMailFormManager, setShowMailFormManager] = useState(false);
  const [showMessageFormManager, setShowMessageFormManager] = useState(false);
  const onCancelManagerMail = () => {
    setShowMailFormManager(false);
  };
  const onCancelManagerMessage = () => {
    setShowMessageFormManager(false);
  };

  const [selectedTenant, setSelectedTenant] = useState("");
  const [showMailFormTenant, setShowMailFormTenant] = useState(false);
  const [showMessageFormTenant, setShowMessageFormTenant] = useState(false);
  const onCancelTenantMail = () => {
    setShowMailFormTenant(false);
  };
  const onCancelTenantMessage = () => {
    setShowMessageFormTenant(false);
  };
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

  const contactState = useState([]);
  const applianceState = useState({
    Microwave: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      documents: [],
      url: [],
    },
    Dishwasher: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      documents: [],
      url: [],
    },
    Refrigerator: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      documents: [],
      url: [],
    },
    Washer: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      documents: [],
      url: [],
    },
    Dryer: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      documents: [],
      url: [],
    },
    Range: {
      available: false,
      manufacturer: "",
      purchased: "",
      purchased_from: "",
      purchased_order: "",
      installed: "",
      serial_num: "",
      model_num: "",
      warranty_till: "",
      warranty_info: "",
      images: [],
      documents: [],
      url: [],
    },
  });
  const [feeState, setFeeState] = useState([]);
  const appliances = Object.keys(applianceState[0]);
  const [tenantInfo, setTenantInfo] = useState([]);
  const [rentalInfo, setRentalInfo] = useState([]);
  const [cancel, setCancel] = useState(false);
  const [showDetailPM, setShowDetailPM] = useState("");

  const [showDetailPMToggle, setShowDetailPMToggle] = useState(false);
  const [endEarlyDate, setEndEarlyDate] = useState("");
  // sorting variables
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("days_open");

  const [openImage, setOpenImage] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const showImage = (src) => {
    setOpenImage(true);
    setImageSrc(src);
  };
  const unShowImage = () => {
    setOpenImage(false);
    setImageSrc(null);
  };
  const duplicate_request = async (request) => {
    let selectedRequest = request;
    // console.log(selectedRequest);
    const newRequest = {
      property_uid: selectedRequest.property_uid,
      title: "Copy " + selectedRequest.title,
      request_type: selectedRequest.request_type,
      description: selectedRequest.description,
      priority: selectedRequest.priority,
      request_created_by: selectedRequest.request_created_by,
    };

    const files = JSON.parse(selectedRequest.images);
    let i = 0;
    for (const file of files) {
      let key = "";
      // console.log(file, file.file, file.image);
      if (file.file !== null && file.file !== undefined) {
        key = file.coverPhoto ? "img_cover" : `img_${i++}`;
        // console.log("in if", file.file);
        newRequest[key] = file.file;
      } else if (file.image !== null && file.image !== undefined) {
        key = file.coverPhoto ? "img_cover" : `img_${i++}`;
        // console.log("in if else", file.image);
        newRequest[key] = file.image;
      } else {
        // console.log("in else");
        key = file.includes("img_cover") ? "img_cover" : `img_${i++}`;
        newRequest[key] = file;
      }
    }
    // console.log(newRequest);
    setCopied(true);
    await post("/maintenanceRequests", newRequest, null, files);
    setCopied(false);
    fetchProperty();
  };
  const fetchProperty = async () => {
    const response = await get(
      `/propertiesOwnerDetail?property_uid=${property_uid}`
    );

    setProperty(response.result[0]);
    setImagesProperty(JSON.parse(response.result[0].images));
    let show = JSON.parse(response.result[0].images).length < 5 ? false : true;
    setShowControls(show);
    // console.log(response.result[0]);
    applianceState[1](JSON.parse(response.result[0].appliances));
    const res = await get(
      `/contracts?property_uid=${response.result[0].property_uid}`
    );
    // if (res.result.length > 0) {
    //   res.result.forEach((r) => {
    //     if (r.contract_status !== "INACTIVE") {
    //       setContracts(r);
    //     }
    //   });
    // } else {
    //   ;
    // }
    setContracts(res.result);
    setRentalInfo(response.result[0].rentalInfo);
    setIsLoading(false);
    // console.log(res.result[0]);
    if (res.result[0] !== undefined) {
      contactState[1](JSON.parse(res.result[0].assigned_contacts));
    }

    let tenant = [];
    let ti = {};
    response.result[0].rentalInfo.map((rentalInfo) => {
      if (rentalInfo.tenant_first_name.includes(",")) {
        let tenant_ids = rentalInfo.tenant_id.split(",");
        let tenant_fns = rentalInfo.tenant_first_name.split(",");
        let tenant_lns = rentalInfo.tenant_last_name.split(",");
        let tenant_emails = rentalInfo.tenant_email.split(",");
        let tenant_phones = rentalInfo.tenant_phone_number.split(",");
        for (let i = 0; i < tenant_fns.length; i++) {
          ti["tenantId"] = tenant_ids[i];
          ti["tenantFirstName"] = tenant_fns[i];
          ti["tenantLastName"] = tenant_lns[i];
          ti["tenantEmail"] = tenant_emails[i];
          ti["tenantPhoneNumber"] = tenant_phones[i];
          tenant.push(ti);
          ti = {};
        }
      } else {
        ti = {
          tenantId: rentalInfo.tenant_id,
          tenantFirstName: rentalInfo.tenant_first_name,
          tenantLastName: rentalInfo.tenant_last_name,
          tenantEmail: rentalInfo.tenant_email,
          tenantPhoneNumber: rentalInfo.tenant_phone_number,
        };
        tenant.push(ti);
      }
    });
    setTenantInfo(tenant);
  };
  useEffect(() => {
    fetchProperty();
  }, []);

  const [pmID, setPmID] = useState("");
  const [currentImg, setCurrentImg] = useState(0);
  const [editProperty, setEditProperty] = useState(false);

  const [searchPM, setSearchPM] = useState(false);

  const [contracts, setContracts] = useState([]);
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [showCreateRevenue, setShowCreateRevenue] = useState(false);

  const [showManagementContract, setShowManagementContract] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialog2, setShowDialog2] = useState(false);

  const headerBack = () => {
    if (editAppliances && editProperty) {
      setEditAppliances(false);
    } else if (editAppliances) {
      // reloadProperty();
      setEditAppliances(false);
      setEditProperty(true);
    } else {
      editProperty
        ? reloadProperty()
        : searchPM
        ? setSearchPM(false)
        : showAddRequest
        ? setShowAddRequest(false)
        : showCreateExpense
        ? setShowCreateExpense(false)
        : showCreateRevenue
        ? setShowCreateRevenue(false)
        : navigate("../owner");
    }
    // navigate("../owner");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showCreateExpense, showCreateRevenue, showManagementContract]);

  const reloadProperty = () => {
    setEditProperty(false);
    setShowAddRequest(false);
    window.scrollTo(0, 0);
    fetchProperty();
  };

  const addContract = () => {
    setSelectedContract(null);
    setShowManagementContract(true);
  };
  const selectContract = (contract) => {
    setSelectedContract(contract);
    setShowManagementContract(true);
  };
  const closeContract = () => {
    fetchProperty();
    setShowManagementContract(false);
  };

  const approvePropertyManager = async (pID) => {
    // const files = JSON.parse(property.images);
    let pid = pID;
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "ACCEPTED",
      manager_id: pid,
    };
    const files = JSON.parse(property.images);

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
    channel.publish({ data: { te: updatedManagementContract } });
    reloadProperty();
  };

  const rejectPropertyManager = async () => {
    let pid = pmID;

    const files = JSON.parse(property.images);
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "REJECTED",
      manager_id: pid,
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
    channel.publish({ data: { te: updatedManagementContract } });
    reloadProperty();
  };

  const cancelAgreement = async () => {
    let pid = pmID;
    const files = JSON.parse(property.images);
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "OWNER END EARLY",
      manager_id: pid,
      early_end_date: endEarlyDate,
    };
    for (let i = -1; i < files.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      updatedManagementContract[key] = files[i + 1];
    }
    const response2 = await put(
      "/cancelAgreement",
      updatedManagementContract,
      null,
      files
    );
    channel.publish({ data: { te: updatedManagementContract } });
    setShowDialog2(false);
    reloadProperty();
  };
  const acceptCancelAgreement = async () => {
    const files = JSON.parse(property.images);
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "OWNER ACCEPTED",
      manager_id: property.managerInfo.manager_id,
    };
    for (let i = -1; i < files.length - 1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = "img_cover";
      }
      updatedManagementContract[key] = files[i + 1];
    }
    await put("/cancelAgreement", updatedManagementContract, null, files);
    channel.publish({ data: { te: updatedManagementContract } });
    reloadProperty();
  };

  const rejectCancelAgreement = async () => {
    const files = JSON.parse(property.images);
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "OWNER REJECTED",
      manager_id: property.managerInfo.manager_id,
    };

    await put("/cancelAgreement", updatedManagementContract, null, files);
    channel.publish({ data: { te: updatedManagementContract } });
    reloadProperty();
  };

  const onCancel = () => {
    setShowDialog(false);
  };
  const onCancel2 = () => {
    setShowDialog2(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const propertiesHeadCell = [
    {
      id: "images",
      numeric: false,
      label: "Property Images",
    },
    {
      id: "address",
      numeric: false,
      label: "Street Address",
    },
    {
      id: "city",
      numeric: false,
      label: "City,State",
    },
    {
      id: "zip",
      numeric: true,
      label: "Zip",
    },
    {
      id: "tenant",
      numeric: false,
      label: "Tenant",
    },
    {
      id: "rent_paid",
      numeric: true,
      label: "Rent Status",
    },
    {
      id: "listed_rent",
      numeric: true,
      label: "Rent",
    },
    {
      id: "per_sqft",
      numeric: true,
      label: " $/Sq Ft",
    },
    {
      id: "property_type",
      numeric: false,
      label: "Type",
    },
    {
      id: "num_beds",
      numeric: true,
      label: "Size",
    },

    {
      id: "property_manager",
      numeric: true,
      label: "Property Manager",
    },
    {
      id: "lease_end",
      numeric: true,
      label: "Lease End",
    },
  ];
  function EnhancedTableHeadProperties(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {propertiesHeadCell.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              size="small"
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                align="center"
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHeadProperties.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const maintenancesHeadCell = [
    {
      id: "images",
      numeric: false,
      label: "Request Images",
    },
    {
      id: "request_status",
      numeric: false,
      label: "Status",
    },
    {
      id: "title",
      numeric: false,
      label: "Issue",
    },
    {
      id: "description",
      numeric: false,
      label: "Description",
    },
    {
      id: "request_created_date",
      numeric: true,
      label: "Date Reported",
    },
    {
      id: "days_open",
      numeric: false,
      label: "Days Open",
    },
    {
      id: "request_type",
      numeric: true,
      label: "Type",
    },
    {
      id: "priority",
      numeric: false,
      label: "Priority",
    },
    {
      id: "assigned_business",
      numeric: false,
      label: "Assigned",
    },

    {
      id: "scheduled_date",
      numeric: true,
      label: "Scheduled Date",
    },
    {
      id: "",
      numeric: true,
      label: "",
    },
  ];
  function EnhancedTableHeadMaintenance(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {maintenancesHeadCell.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              size="small"
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                align="center"
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHeadMaintenance.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  // console.log(selectedTenant);

  return Object.keys(property).length > 1 ? (
    showManagementContract ? (
      <ManagementContract
        back={closeContract}
        property={property}
        contract={selectedContract}
        reload={fetchProperty}
      />
    ) : (
      <div className="w-100">
        <MailDialogManager
          title={"Email"}
          isOpen={showMailFormManager}
          senderPhone={user.phone_number}
          senderEmail={user.email}
          senderName={user.first_name + " " + user.last_name}
          requestCreatedBy={user.user_uid}
          userMessaged={selectedManager.manager_id}
          receiverEmail={selectedManager.manager_email}
          receiverPhone={selectedManager.manager_phone_number}
          onCancel={onCancelManagerMail}
        />

        <MessageDialogManager
          title={"Text Message"}
          isOpen={showMessageFormManager}
          senderPhone={user.phone_number}
          senderEmail={user.email}
          senderName={user.first_name + " " + user.last_name}
          requestCreatedBy={user.user_uid}
          userMessaged={selectedManager.manager_id}
          receiverEmail={selectedManager.manager_email}
          receiverPhone={selectedManager.manager_phone_number}
          onCancel={onCancelManagerMessage}
        />
        <MailDialogTenant
          title={"Email"}
          isOpen={showMailFormTenant}
          senderPhone={user.phone_number}
          senderEmail={user.email}
          senderName={user.first_name + " " + user.last_name}
          requestCreatedBy={user.user_uid}
          userMessaged={selectedTenant.tenant_id}
          receiverEmail={selectedTenant.tenantEmail}
          receiverPhone={selectedTenant.tenantPhoneNumber}
          onCancel={onCancelTenantMail}
        />

        <MessageDialogTenant
          title={"Text Message"}
          isOpen={showMessageFormTenant}
          senderPhone={user.phone_number}
          senderEmail={user.email}
          senderName={user.first_name + " " + user.last_name}
          requestCreatedBy={user.user_uid}
          userMessaged={selectedTenant.tenant_id}
          receiverEmail={selectedTenant.tenantEmail}
          receiverPhone={selectedTenant.tenantPhoneNumber}
          onCancel={onCancelTenantMessage}
        />
        <ConfirmDialog
          title={"Are you sure you want to reject this Property Manager?"}
          isOpen={showDialog}
          onConfirm={rejectPropertyManager}
          onCancel={onCancel}
        />
        <CopyDialog copied={copied} />
        <ConfirmDialog
          title={
            "Are you sure you want to cancel the Agreement with this Property Management?"
          }
          isOpen={showDialog2}
          onConfirm={cancelAgreement}
          onCancel={onCancel2}
        />
        <Row className="w-100 mb-5 overflow-hidden">
          {location.state === null ? (
            ""
          ) : (
            <Col
              xs={2}
              hidden={!responsiveSidebar.showSidebar}
              style={sidebarStyle}
            >
              <SideBar />
            </Col>
          )}

          <Col className="w-100 mb-5 overflow-scroll overflow-hidden">
            <Header
              title={
                editProperty
                  ? "Edit Property"
                  : searchPM
                  ? "Property Managers"
                  : "Property Details"
              }
              leftText={location.state === null ? "" : "< Back"}
              leftFn={headerBack}
            />
            <div className="w-100 mb-5 overflow-scroll">
              {editProperty ? (
                <OwnerPropertyForm
                  property={property}
                  edit={editProperty}
                  setEdit={setEditProperty}
                  onSubmit={reloadProperty}
                  editAppliances={editAppliances}
                  setEditAppliances={setEditAppliances}
                />
              ) : editAppliances ? (
                <div className="d-flex flex-column w-100 overflow-hidden p-2">
                  <div
                    className="mx-3 my-3 p-0"
                    style={{
                      background: "#E9E9E9 0% 0% no-repeat padding-box",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <PropertyAppliances
                      state={applianceState}
                      property={property}
                      editAppliances={editAppliances}
                      setEditAppliances={setEditAppliances}
                      edit={true}
                    />
                  </div>
                </div>
              ) : searchPM ? (
                <PropertyManagersList
                  property={property}
                  property_uid={property.property_uid}
                  reload={reloadProperty}
                />
              ) : showAddRequest ? (
                <OwnerRepairRequest
                  properties={[property]}
                  cancel={() => setShowAddRequest(false)}
                  onSubmit={reloadProperty}
                />
              ) : showCreateExpense ? (
                <OwnerCreateExpense
                  properties={property}
                  cancel={() => setShowCreateExpense(false)}
                  onSubmit={reloadProperty}
                />
              ) : showCreateRevenue ? (
                <CreateRevenue
                  property={property}
                  reload={reloadProperty}
                  back={() => setShowCreateRevenue(false)}
                />
              ) : (
                <div className="w-100 my-5 overflow-hidden">
                  <ImageModal
                    src={imageSrc}
                    isOpen={openImage}
                    onCancel={unShowImage}
                  />
                  <Row className=" d-flex align-items-center justify-content-center m-3">
                    {imagesProperty.length === 0 ? (
                      <img
                        src={PropertyIcon}
                        alt="Property"
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    ) : imagesProperty.length >= 4 ? (
                      <Carousel
                        responsive={responsive}
                        infinite={true}
                        arrows={true}
                        partialVisible={false}
                        // className=" d-flex align-items-center justify-content-center"
                      >
                        {imagesProperty.map((image) => {
                          return (
                            // <div className="d-flex align-items-center justify-content-center">
                            <img
                              // key={Date.now()}
                              src={`${image}?${Date.now()}`}
                              onClick={() =>
                                showImage(`${image}?${Date.now()}`)
                              }
                              style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "cover",
                              }}
                            />
                            // </div>
                          );
                        })}
                      </Carousel>
                    ) : imagesProperty.length < 4 ? (
                      <Carousel
                        responsive={responsive}
                        infinite={true}
                        arrows={true}
                        partialVisible={false}
                        className=" d-flex align-items-center justify-content-center"
                      >
                        {imagesProperty.map((image) => {
                          return (
                            <div className="d-flex align-items-center justify-content-center">
                              <img
                                // key={Date.now()}
                                src={`${image}?${Date.now()}`}
                                onClick={() =>
                                  showImage(`${image}?${Date.now()}`)
                                }
                                style={{
                                  width: "200px",
                                  height: "200px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          );
                        })}
                      </Carousel>
                    ) : (
                      ""
                    )}
                  </Row>
                  <div
                    className="mx-3 my-3 p-2"
                    style={{
                      background: "#E9E9E9 0% 0% no-repeat padding-box",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <OwnerCashflow
                      ownerData={[property]}
                      byProperty={false}
                      propertyView={true}
                      addExpense={showCreateExpense}
                      setAddExpense={setShowCreateExpense}
                    />
                  </div>
                  <div
                    className="mx-3 my-3 p-2"
                    style={{
                      background: "#E9E9E9 0% 0% no-repeat padding-box",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <Row className="m-3">
                      <Col>
                        <h3>Property Summary</h3>
                      </Col>
                      <Col>
                        <img
                          src={EditIconNew}
                          alt="Edit Icon"
                          onClick={() => {
                            window.scrollTo(0, 0);
                            setEditProperty(true);
                          }}
                          style={{
                            width: "30px",
                            height: "30px",
                            float: "right",
                            marginRight: "5rem",
                          }}
                        />
                      </Col>
                    </Row>

                    <Row className="m-3" style={{ overflow: "scroll" }}>
                      <div>
                        <Table
                          classes={{ root: classes.customTable }}
                          size="small"
                          responsive="md"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Property Images</TableCell>
                              <TableCell>Street Address</TableCell>
                              <TableCell>City,State</TableCell>
                              <TableCell>Zip</TableCell>
                              <TableCell>Tenant</TableCell>
                              <TableCell>Rent Status</TableCell>
                              <TableCell>Rent</TableCell>{" "}
                              <TableCell>$/SqFt</TableCell>{" "}
                              <TableCell>Type</TableCell>{" "}
                              <TableCell>Size</TableCell>
                              <TableCell>Property Manager</TableCell>
                              <TableCell>Lease End</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={property.property_uid}
                            >
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  window.scrollTo(0, 1500);
                                  setEditProperty(true);
                                }}
                              >
                                {JSON.parse(property.images).length > 0 ? (
                                  <img
                                    // key={Date.now()}
                                    src={`${
                                      JSON.parse(property.images)[0]
                                    }?${Date.now()}`}
                                    alt="Property"
                                    style={{
                                      borderRadius: "4px",
                                      objectFit: "contain",
                                      maxWidth: "50px",
                                      maxHeight: "50px",
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={PropertyIcon}
                                    alt="Property"
                                    style={{
                                      borderRadius: "4px",
                                      objectFit: "contain",
                                      maxWidth: "50px",
                                      maxHeight: "50px",
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  window.scrollTo(0, 0);
                                  setEditProperty(true);
                                }}
                              >
                                {property.address}
                                {property.unit !== ""
                                  ? " " + property.unit
                                  : ""}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  window.scrollTo(0, 0);
                                  setEditProperty(true);
                                }}
                              >
                                {property.city}, {property.state}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  window.scrollTo(0, 0);
                                  setEditProperty(true);
                                }}
                              >
                                {property.zip}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {property.rentalInfo.length !== 0
                                  ? property.rentalInfo[0].tenant_first_name +
                                    " " +
                                    property.rentalInfo[0].tenant_last_name
                                  : "None"}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {property.rent_paid !== ""
                                  ? property.rent_paid
                                  : "None"}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  window.scrollTo(0, 800);
                                  setEditProperty(true);
                                }}
                              >
                                {"$" + property.listed_rent}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  window.scrollTo(0, 800);
                                  setEditProperty(true);
                                }}
                              >
                                ${property.per_sqft}
                              </TableCell>

                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  window.scrollTo(0, 800);
                                  setEditProperty(true);
                                }}
                              >
                                {property.property_type}
                              </TableCell>

                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                                onClick={() => {
                                  window.scrollTo(0, 800);
                                  setEditProperty(true);
                                }}
                              >
                                {property.num_beds + "/" + property.num_baths}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {property.property_manager.length > 1 ? (
                                  Object.values(property.property_manager).map(
                                    (pm) =>
                                      pm.management_status === "ACCEPTED" ||
                                      pm.management_status === "PM END EARLY" ||
                                      pm.management_status === "OWNER END EARLY"
                                        ? pm.manager_business_name
                                        : ""
                                  )
                                ) : property.property_manager.length === 1 ? (
                                  <div>
                                    {
                                      property.property_manager[0]
                                        .manager_business_name
                                    }
                                  </div>
                                ) : (
                                  "None"
                                )}
                              </TableCell>
                              <TableCell
                                padding="none"
                                size="small"
                                align="center"
                              >
                                {property.rentalInfo.length !== 0
                                  ? property.rentalInfo[0].lease_end
                                  : "None"}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Table
                          classes={{ root: classes.customTable }}
                          size="small"
                          responsive="md"
                        >
                          {" "}
                          <TableRow>
                            <TableCell style={{ width: "136px" }}>
                              Description
                            </TableCell>
                            <TableCell>
                              {property.description === "null" ||
                              property.description === "" ||
                              property.description === null
                                ? "Not Available"
                                : property.description}
                            </TableCell>
                          </TableRow>
                        </Table>
                        <Table
                          classes={{ root: classes.customTable }}
                          size="small"
                          responsive="md"
                        >
                          {" "}
                          <TableRow>
                            <TableCell style={{ width: "136px" }}>
                              Notes
                            </TableCell>
                            <TableCell>
                              {property.notes === "null" ||
                              property.notes === "" ||
                              property.notes === null
                                ? "Not Available"
                                : property.notes}
                            </TableCell>
                          </TableRow>
                        </Table>
                      </div>
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
                    <Row className="m-3">
                      <Col>
                        <h3>Maintenance and Repairs</h3>
                      </Col>
                      <Col>
                        {" "}
                        <img
                          src={AddIcon}
                          alt="Add Icon"
                          onClick={() => {
                            window.scrollTo(0, 0);
                            setShowAddRequest(true);
                          }}
                          style={{
                            width: "30px",
                            height: "30px",
                            float: "right",
                            marginRight: "5rem",
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="m-3">
                      {property.maintenanceRequests.length > 0 ? (
                        <div style={{ overflow: "scroll" }}>
                          <Table
                            classes={{ root: classes.customTable }}
                            size="small"
                            responsive="md"
                          >
                            <EnhancedTableHeadMaintenance
                              order={order}
                              orderBy={orderBy}
                              onRequestSort={handleRequestSort}
                              rowCount={property.maintenanceRequests.length}
                            />{" "}
                            <TableBody>
                              {stableSort(
                                property.maintenanceRequests,
                                getComparator(order, orderBy)
                              ).map((request, index) => {
                                return (
                                  <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={request.maintenance_request_uid}
                                  >
                                    <TableCell
                                      padding="none"
                                      size="small"
                                      align="center"
                                      onClick={() =>
                                        navigate(
                                          `/owner-repairs/${request.maintenance_request_uid}`,
                                          {
                                            state: {
                                              repair: request,
                                              property: request.address,
                                            },
                                          }
                                        )
                                      }
                                    >
                                      {JSON.parse(request.images).length > 0 ? (
                                        <img
                                          src={JSON.parse(request.images)[0]}
                                          alt="Repair"
                                          style={{
                                            borderRadius: "4px",
                                            objectFit: "cover",
                                            width: "50px",
                                            height: "50px",
                                          }}
                                        />
                                      ) : (
                                        <img
                                          src={RepairImg}
                                          alt="Repair"
                                          style={{
                                            borderRadius: "4px",
                                            objectFit: "cover",
                                            width: "50px",
                                            height: "50px",
                                          }}
                                        />
                                      )}
                                    </TableCell>
                                    <TableCell
                                      padding="none"
                                      size="small"
                                      align="center"
                                      onClick={() => {
                                        navigate(
                                          `/owner-repairs/${request.maintenance_request_uid}`,
                                          {
                                            state: {
                                              repair: request,
                                              property: request.address,
                                            },
                                          }
                                        );
                                      }}
                                      style={{
                                        color:
                                          request.request_status === "NEW"
                                            ? "red"
                                            : request.request_status ===
                                              "PROCESSING"
                                            ? "orange"
                                            : request.request_status ===
                                              "SCHEDULE"
                                            ? "blue"
                                            : request.request_status ===
                                              "RESCHEDULE"
                                            ? "yellow"
                                            : request.request_status ===
                                              "SCHEDULED"
                                            ? "green"
                                            : "black",
                                      }}
                                    >
                                      {request.request_status}
                                    </TableCell>
                                    <TableCell
                                      padding="none"
                                      size="small"
                                      align="center"
                                      onClick={() =>
                                        navigate(
                                          `/owner-repairs/${request.maintenance_request_uid}`,
                                          {
                                            state: {
                                              repair: request,
                                              property: request.address,
                                            },
                                          }
                                        )
                                      }
                                      style={{
                                        color:
                                          request.title === "New"
                                            ? "green"
                                            : "black",
                                      }}
                                    >
                                      {" "}
                                      {request.title}
                                    </TableCell>
                                    <TableCell
                                      padding="none"
                                      size="small"
                                      align="center"
                                      onClick={() => {
                                        navigate(
                                          `/owner-repairs/${request.maintenance_request_uid}`,
                                          {
                                            state: {
                                              repair: request,
                                              property: request.address,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      {request.description}
                                    </TableCell>
                                    <TableCell
                                      padding="none"
                                      size="small"
                                      align="center"
                                      onClick={() =>
                                        navigate(
                                          `/owner-repairs/${request.maintenance_request_uid}`,
                                          {
                                            state: {
                                              repair: request,
                                              property: request.address,
                                            },
                                          }
                                        )
                                      }
                                    >
                                      {" "}
                                      {
                                        request.request_created_date.split(
                                          " "
                                        )[0]
                                      }
                                    </TableCell>
                                    <TableCell
                                      padding="none"
                                      size="small"
                                      align="center"
                                      onClick={() =>
                                        navigate(
                                          `/owner-repairs/${request.maintenance_request_uid}`,
                                          {
                                            state: {
                                              repair: request,
                                              property: request.address,
                                            },
                                          }
                                        )
                                      }
                                    >
                                      {request.days_open} days
                                    </TableCell>
                                    <TableCell
                                      padding="none"
                                      size="small"
                                      align="center"
                                      onClick={() =>
                                        navigate(
                                          `/owner-repairs/${request.maintenance_request_uid}`,
                                          {
                                            state: {
                                              repair: request,
                                              property: request.address,
                                            },
                                          }
                                        )
                                      }
                                    >
                                      {request.request_type !== null
                                        ? request.request_type
                                        : "None"}
                                    </TableCell>
                                    <TableCell
                                      padding="none"
                                      size="small"
                                      align="center"
                                      onClick={() =>
                                        navigate(
                                          `/owner-repairs/${request.maintenance_request_uid}`,
                                          {
                                            state: {
                                              repair: request,
                                              property: request.address,
                                            },
                                          }
                                        )
                                      }
                                    >
                                      {request.priority}
                                    </TableCell>
                                    <TableCell
                                      padding="none"
                                      size="small"
                                      align="center"
                                      onClick={() =>
                                        navigate(
                                          `/owner-repairs/${request.maintenance_request_uid}`,
                                          {
                                            state: {
                                              repair: request,
                                              property: request.address,
                                            },
                                          }
                                        )
                                      }
                                    >
                                      {request.assigned_business !== null &&
                                      request.assigned_business !== "null"
                                        ? request.assigned_business
                                        : "None"}
                                    </TableCell>

                                    <TableCell
                                      padding="none"
                                      size="small"
                                      align="center"
                                      onClick={() =>
                                        navigate(
                                          `/owner-repairs/${request.maintenance_request_uid}`,
                                          {
                                            state: {
                                              repair: request,
                                              property: request.address,
                                            },
                                          }
                                        )
                                      }
                                    >
                                      {request.scheduled_date !== null &&
                                      request.scheduled_date !== "null"
                                        ? request.scheduled_date
                                        : "Not Scheduled"}
                                    </TableCell>
                                    <TableCell
                                      padding="none"
                                      size="small"
                                      align="center"
                                    >
                                      {" "}
                                      <img
                                        src={CopyIcon}
                                        title="Duplicate"
                                        style={{
                                          width: "15px",
                                          height: "15px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          duplicate_request(request);
                                        }}
                                      />
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <Row className="m-3">
                          <div className="m-3">
                            No maintenance or repair requests
                          </div>
                        </Row>
                      )}
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
                    <Row className="m-3">
                      <Col>
                        <h3>Appliances</h3>
                      </Col>
                      <Col>
                        <img
                          src={EditIconNew}
                          alt="Edit Icon"
                          onClick={() => {
                            window.scrollTo(0, 0);
                            setEditAppliances(true);
                            setEditProperty(true);
                          }}
                          style={{
                            width: "30px",
                            height: "30px",
                            float: "right",
                            marginRight: "5rem",
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="m-3" style={{ overflow: "scroll" }}>
                      <div>
                        {appliances.filter(
                          (appliance) =>
                            applianceState[0][appliance]["available"] ===
                              true ||
                            applianceState[0][appliance]["available"] == "True"
                        ).length === 0 ? (
                          <Row className="m-3">
                            <div className="m-3">Add Appliance Information</div>
                          </Row>
                        ) : (
                          <Appliances
                            appliances={appliances}
                            applianceState={applianceState}
                          />
                        )}
                      </div>
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
                    <Row className="m-3">
                      <Col>
                        <h3>Other Info</h3>
                      </Col>
                      <Col xs={2}></Col>
                    </Row>
                    <Row className="m-3">
                      <div>
                        <Table
                          classes={{ root: classes.customTable }}
                          size="small"
                          responsive="md"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Utilities</TableCell>
                              <TableCell>Electricity</TableCell>
                              <TableCell>Trash</TableCell>
                              <TableCell>Water</TableCell>
                              <TableCell>Wifi </TableCell>
                              <TableCell>Gas</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Paid by</TableCell>
                              <TableCell>
                                {JSON.parse(property.utilities)["Electricity"]
                                  ? "Owner"
                                  : "Tenant"}
                              </TableCell>
                              <TableCell>
                                {JSON.parse(property.utilities)["Trash"]
                                  ? "Owner"
                                  : "Tenant"}
                              </TableCell>
                              <TableCell>
                                {JSON.parse(property.utilities)["Water"]
                                  ? "Owner"
                                  : "Tenant"}
                              </TableCell>
                              <TableCell>
                                {JSON.parse(property.utilities)["Wifi"]
                                  ? "Owner"
                                  : "Tenant"}
                              </TableCell>
                              <TableCell>
                                {JSON.parse(property.utilities)["Gas"]
                                  ? "Owner"
                                  : "Tenant"}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </Row>
                    <Row className="m-3">
                      <div>
                        <Table
                          classes={{ root: classes.customTable }}
                          size="small"
                          responsive="md"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Pets Allowed</TableCell>
                              <TableCell>
                                Deposit can be used for last month's rent
                              </TableCell>
                              <TableCell>Available to Rent</TableCell>
                              <TableCell>Featured</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                {property.pets_allowed === 0 ? "No" : "Yes"}
                              </TableCell>
                              <TableCell>
                                {property.deposit_for_rent === 0 ? "No" : "Yes"}
                              </TableCell>
                              <TableCell>
                                {property.available_to_rent === 0
                                  ? "No"
                                  : "Yes"}
                              </TableCell>
                              <TableCell>
                                {property.featured ? "No" : "Yes"}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </Row>
                  </div>

                  {Object.keys(property.managerInfo).length !== 0 ? (
                    <div
                      className="mx-3 my-3 p-2"
                      style={{
                        background: "#E9E9E9 0% 0% no-repeat padding-box",
                        borderRadius: "10px",
                        opacity: 1,
                      }}
                    >
                      <Row className="m-3" style={{ overflow: "scroll" }}>
                        {property.management_status === "ACCEPTED" ||
                        property.management_status === "OWNER END EARLY" ||
                        property.management_status === "PM END EARLY" ? (
                          <div>
                            <Row>
                              <Col>
                                <h3>Property Management Agreement</h3>
                              </Col>
                              <Col xs={2}></Col>
                            </Row>
                            <Table
                              responsive="md"
                              classes={{ root: classes.customTable }}
                              size="small"
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center">
                                    Business Name
                                  </TableCell>
                                  <TableCell>Contract Name</TableCell>
                                  <TableCell>Start Date</TableCell>
                                  <TableCell>End Date</TableCell>
                                  <TableCell align="center">Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    {property.managerInfo.manager_business_name}
                                  </TableCell>

                                  {contracts.map((contract, i) =>
                                    contract.business_uid ===
                                      property.managerInfo.manager_id &&
                                    contract.contract_status === "ACTIVE" ? (
                                      contract.contract_name !== null ? (
                                        <TableCell>
                                          {contract.contract_name}{" "}
                                        </TableCell>
                                      ) : (
                                        <TableCell>Contract {i + 1} </TableCell>
                                      )
                                    ) : (
                                      ""
                                    )
                                  )}

                                  {contracts.map((contract, i) =>
                                    contract.business_uid ===
                                      property.managerInfo.manager_id &&
                                    contract.contract_status === "ACTIVE" ? (
                                      <TableCell>
                                        {contract.start_date}
                                      </TableCell>
                                    ) : (
                                      ""
                                    )
                                  )}
                                  {contracts.map((contract, i) =>
                                    contract.business_uid ===
                                      property.managerInfo.manager_id &&
                                    contract.contract_status === "ACTIVE" ? (
                                      <TableCell>{contract.end_date}</TableCell>
                                    ) : (
                                      ""
                                    )
                                  )}

                                  <TableCell>
                                    <a
                                      href={`tel:${property.managerInfo.manager_phone_number}`}
                                    >
                                      <img
                                        src={Phone}
                                        alt="Phone"
                                        style={smallImg}
                                      />
                                    </a>
                                    <a
                                      onClick={() => {
                                        setShowMessageFormManager(true);
                                        setSelectedManager(
                                          property.managerInfo
                                        );
                                      }}
                                    >
                                      <img
                                        src={Message}
                                        alt="Message"
                                        style={smallImg}
                                      />
                                    </a>
                                    <a
                                      // href={`mailto:${tf.tenantEmail}`}
                                      onClick={() => {
                                        setShowMailFormManager(true);
                                        setSelectedManager(
                                          property.managerInfo
                                        );
                                      }}
                                    >
                                      <img
                                        src={Mail}
                                        alt="Mail"
                                        style={smallImg}
                                      />
                                    </a>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          ""
                        )}
                        {property.management_status === "ACCEPTED" ||
                        property.management_status === "OWNER END EARLY" ||
                        property.management_status === "PM END EARLY" ? (
                          <div>
                            <Row className="mt-1">
                              <h5>Property Manager Documents</h5>
                            </Row>
                            <div>
                              <Table
                                responsive="md"
                                classes={{ root: classes.customTable }}
                                size="small"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Document Name</TableCell>
                                    <TableCell>View Document</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {contracts.map((contract, i) =>
                                    contract.business_uid ===
                                      property.managerInfo.manager_id &&
                                    contract.contract_status === "ACTIVE" ? (
                                      JSON.parse(contract.documents).length ===
                                      0 ? (
                                        <TableRow>
                                          <TableCell> No documents </TableCell>
                                          <TableCell></TableCell>
                                        </TableRow>
                                      ) : (
                                        JSON.parse(contract.documents).map(
                                          (file) => {
                                            return (
                                              <TableRow>
                                                {file.description !== "" ? (
                                                  <TableCell>
                                                    {file.description}
                                                  </TableCell>
                                                ) : (
                                                  <TableCell>
                                                    Document {i + 1}{" "}
                                                  </TableCell>
                                                )}
                                                <TableCell>
                                                  <a
                                                    href={file.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                  >
                                                    <img
                                                      src={File}
                                                      alt="open document"
                                                      style={{
                                                        width: "15px",
                                                        height: "15px",
                                                      }}
                                                    />
                                                  </a>
                                                </TableCell>
                                              </TableRow>
                                            );
                                          }
                                        )
                                      )
                                    ) : (
                                      ""
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </div>

                            <Row className="mt-1">
                              <h5>Property Manager Fee Details</h5>
                            </Row>
                            {contracts.map((contract, i) =>
                              contract.business_uid ===
                                property.managerInfo.manager_id &&
                              contract.contract_status === "ACTIVE" ? (
                                <ManagerFees
                                  feeState={JSON.parse(contract.contract_fees)}
                                  setFeeState={setFeeState}
                                />
                              ) : (
                                ""
                              )
                            )}
                          </div>
                        ) : (
                          ""
                        )}

                        {contracts.map((contract, i) =>
                          contract.business_uid ===
                            property.managerInfo.manager_id &&
                          contract.contract_status === "ACTIVE" ? (
                            JSON.parse(contract.assigned_contacts).length ===
                            0 ? (
                              ""
                            ) : (
                              <Row className="mt-1">
                                <h5>Property Manager Contact Details</h5>
                              </Row>
                            )
                          ) : (
                            ""
                          )
                        )}
                        {contracts.map((contract, i) =>
                          contract.business_uid ===
                            property.managerInfo.manager_id &&
                          contract.contract_status === "ACTIVE" ? (
                            JSON.parse(contract.assigned_contacts).length ===
                            0 ? (
                              ""
                            ) : (
                              <BusinessContact state={contactState} />
                            )
                          ) : (
                            ""
                          )
                        )}

                        {property.management_status === "ACCEPTED" &&
                        !cancel ? (
                          <Row className="mt-4">
                            <Col className="d-flex justify-content-center mb-1">
                              <Button
                                variant="outline-primary"
                                style={redPillButton}
                                // onClick={() => {
                                //   setShowDialog2(true);
                                //   setPmID(property.managerInfo.manager_id);
                                // }}
                                onClick={() => setCancel(true)}
                              >
                                Cancel Agreement
                              </Button>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.management_status === "ACCEPTED" && cancel ? (
                          <Row className="mt-4">
                            <Col className="d-flex flex-column justify-content-center mb-1">
                              <Form.Group className="mx-2 mb-3">
                                <Form.Label as="h6">Early End Date</Form.Label>
                                <Form.Control
                                  style={squareForm}
                                  type="date"
                                  value={endEarlyDate}
                                  onChange={(e) =>
                                    setEndEarlyDate(e.target.value)
                                  }
                                />
                              </Form.Group>
                              <Button
                                variant="outline-primary"
                                style={redPillButton}
                                onClick={() => {
                                  setShowDialog2(true);
                                  setPmID(property.managerInfo.manager_id);
                                }}
                              >
                                Cancel Agreement
                              </Button>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        {property.management_status === "OWNER END EARLY" ? (
                          <Row className="mt-4">
                            {contracts.map((contract, i) =>
                              contract.business_uid ===
                                property.managerInfo.manager_id &&
                              contract.contract_status === "ACTIVE" ? (
                                contract.contract_name !== null ? (
                                  <h6
                                    className="d-flex justify-content-center"
                                    style={mediumBold}
                                  >
                                    You have requested to end the agreement
                                    early on {contract.early_end_date}
                                  </h6>
                                ) : (
                                  ""
                                )
                              ) : (
                                ""
                              )
                            )}
                          </Row>
                        ) : (
                          ""
                        )}

                        {property.management_status === "PM END EARLY" ? (
                          <Row className="d-flex flex-grow-1 w-100 justify-content-center mt-3 mb-4">
                            {contracts.map((contract, i) =>
                              contract.business_uid ===
                                property.managerInfo.manager_id &&
                              contract.contract_status === "ACTIVE" ? (
                                contract.contract_name !== null ? (
                                  <h6
                                    className="d-flex justify-content-center"
                                    style={mediumBold}
                                  >
                                    Property Manager requested to end the
                                    agreement early on{" "}
                                    {contracts[0].early_end_date}
                                  </h6>
                                ) : (
                                  ""
                                )
                              ) : (
                                ""
                              )
                            )}

                            <Col className="d-flex justify-content-center">
                              <Button
                                variant="outline-primary"
                                style={bluePillButton}
                                onClick={acceptCancelAgreement}
                              >
                                Accept
                              </Button>
                            </Col>
                            <Col className="d-flex justify-content-center">
                              <Button
                                variant="outline-primary"
                                style={redPillButton}
                                onClick={rejectCancelAgreement}
                              >
                                Reject
                              </Button>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </Row>
                    </div>
                  ) : (
                    ""
                  )}

                  <div
                    className="mx-3 my-3 p-2"
                    style={{
                      background: "#E9E9E9 0% 0% no-repeat padding-box",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <Row className="m-3">
                      <Col>
                        <h3>
                          {Object.keys(property.managerInfo).length === 0 ||
                          property.management_status === "END EARLY"
                            ? "Select a Property Manager"
                            : "Change Property Manager"}
                        </h3>
                      </Col>
                      <Col>
                        {/* <img
                        src={AddIcon} alt="Add Icon"
                        onClick={() => setShowCreateExpense(true)}
                        style={{
                          width: "30px",
                          height: "30px",
                          float: "right",
                          marginRight: "5rem",
                        }}
                      /> */}
                      </Col>
                    </Row>
                    {property.property_manager.length === 0 ? (
                      ""
                    ) : property.property_manager.length > 1 ? (
                      property.property_manager.map((p, i) =>
                        p.management_status === "REJECTED" ? (
                          ""
                        ) : p.management_status === "FORWARDED" ? (
                          <Row className="p-0 m-3">
                            <Row
                              className="d-flex justify-content-between mt-3 mx-2"
                              onClick={() => {
                                setShowDetailPM(p.manager_id);
                                setShowDetailPMToggle(!showDetailPMToggle);
                              }}
                            >
                              <Col
                                xs={8}
                                className="d-flex justify-content-start flex-column"
                              >
                                <h6 style={mediumBold} className="mb-1">
                                  {p.manager_business_name}
                                </h6>
                                <p
                                  style={{ mediumBold, color: "blue" }}
                                  className="mb-1"
                                >
                                  Property Manager Selected
                                </p>
                              </Col>
                              <Col className="d-flex justify-content-end">
                                <a href={`tel:${p.manager_phone_number}`}>
                                  <img
                                    src={Phone}
                                    alt="Phone"
                                    style={smallImg}
                                  />
                                </a>
                                <a
                                  onClick={() => {
                                    setShowMessageFormManager(true);
                                    setSelectedManager(p);
                                  }}
                                >
                                  <img
                                    src={Message}
                                    alt="Message"
                                    style={smallImg}
                                  />
                                </a>
                                <a
                                  // href={`mailto:${tf.tenantEmail}`}
                                  onClick={() => {
                                    setShowMailFormManager(true);
                                    setSelectedManager(p);
                                  }}
                                >
                                  <img src={Mail} alt="Mail" style={smallImg} />
                                </a>
                              </Col>
                            </Row>
                            {showDetailPM === p.manager_id &&
                            showDetailPMToggle ? (
                              <div>
                                <Row
                                  className="m-2 p-2"
                                  style={{
                                    background:
                                      "#F3F3F3 0% 0% no-repeat padding-box",
                                    borderRadius: "5px",
                                  }}
                                >
                                  {" "}
                                  Fees Charged:
                                  <Table
                                    classes={{ root: classes.customTable }}
                                    size="small"
                                  >
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Fee Name</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Of</TableCell>
                                        <TableCell>Frequency</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {JSON.parse(p.business_services_fees).map(
                                        (fee, i) => (
                                          <TableRow key={i}>
                                            <TableCell>
                                              {fee.fee_name}
                                            </TableCell>
                                            <TableCell>
                                              {fee.fee_type === "%"
                                                ? `${fee.charge}%`
                                                : `$${fee.charge}`}
                                            </TableCell>
                                            <TableCell>
                                              {fee.fee_type === "%"
                                                ? `${fee.of}`
                                                : ""}
                                            </TableCell>
                                            <TableCell>
                                              {fee.frequency}
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                    </TableBody>
                                  </Table>
                                </Row>
                                <Row
                                  className="m-2 p-2"
                                  style={{
                                    background:
                                      "#F3F3F3 0% 0% no-repeat padding-box",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <Row>
                                    <Col>Locations of Service</Col>
                                    <Col xs={3}>(-)(+) miles</Col>
                                  </Row>
                                  {JSON.parse(p.business_locations).map(
                                    (bl) => {
                                      return (
                                        <Row>
                                          <Col
                                            className="m-2 p-2"
                                            style={{
                                              background:
                                                " #FFFFFF 0% 0% no-repeat padding-box",
                                              boxShadow:
                                                " 0px 1px 6px #00000029",
                                              borderRadius: "5px",
                                            }}
                                          >
                                            {bl.location}
                                          </Col>
                                          <Col
                                            xs={3}
                                            className="m-2 p-2"
                                            style={{
                                              background:
                                                " #FFFFFF 0% 0% no-repeat padding-box",
                                              boxShadow:
                                                " 0px 1px 6px #00000029",
                                              borderRadius: "5px",
                                            }}
                                          >
                                            {bl.distance}
                                          </Col>
                                        </Row>
                                      );
                                    }
                                  )}
                                </Row>
                              </div>
                            ) : (
                              ""
                            )}
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
                                  // onClick={rejectPropertyManager}
                                  onClick={() => {
                                    setShowDialog(true);
                                    setPmID(p.manager_id);
                                  }}
                                  variant="outline-primary"
                                  style={redPillButton}
                                >
                                  Withdraw
                                </Button>
                              </Col>
                            </Row>
                          </Row>
                        ) : (
                          ""
                        )
                      )
                    ) : property.property_manager[0].management_status ===
                      "FORWARDED" ? (
                      <Row className="p-0 m-3">
                        <Row
                          className="d-flex justify-content-between mt-3"
                          onClick={() => {
                            setShowDetailPM(
                              property.property_manager[0].manager_id
                            );
                            setShowDetailPMToggle(!showDetailPMToggle);
                          }}
                        >
                          <Col
                            xs={8}
                            className="d-flex flex-column justify-content-start p-0"
                          >
                            <Row>
                              <h6 style={mediumBold} className="mb-1">
                                {
                                  property.property_manager[0]
                                    .manager_business_name
                                }
                              </h6>
                            </Row>
                          </Col>
                          <Col className="d-flex justify-content-end">
                            <a
                              href={`tel:${property.property_manager[0].manager_phone_number}`}
                            >
                              <img src={Phone} alt="Phone" style={smallImg} />
                            </a>
                            <a
                              onClick={() => {
                                setShowMessageFormManager(true);
                                setSelectedManager(
                                  property.property_manager[0]
                                );
                              }}
                            >
                              <img
                                src={Message}
                                alt="Message"
                                style={smallImg}
                              />
                            </a>
                            <a
                              // href={`mailto:${tf.tenantEmail}`}
                              onClick={() => {
                                setShowMailFormManager(true);
                                setSelectedManager(
                                  property.property_manager[0]
                                );
                              }}
                            >
                              <img src={Mail} alt="Mail" style={smallImg} />
                            </a>
                          </Col>
                        </Row>
                        {showDetailPM ==
                          property.property_manager[0].manager_id &&
                        showDetailPMToggle ? (
                          <div>
                            <Row
                              className="m-2 p-2"
                              style={{
                                background:
                                  "#F3F3F3 0% 0% no-repeat padding-box",
                                borderRadius: "5px",
                              }}
                            >
                              {" "}
                              Fees Charged:
                              <Table
                                classes={{ root: classes.customTable }}
                                size="small"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Fee Name</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Of</TableCell>
                                    <TableCell>Frequency</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {JSON.parse(
                                    property.property_manager[0]
                                      .business_services_fees
                                  ).map((fee, i) => (
                                    <TableRow key={i}>
                                      <TableCell>{fee.fee_name}</TableCell>
                                      <TableCell>
                                        {fee.fee_type === "%"
                                          ? `${fee.charge}%`
                                          : `$${fee.charge}`}
                                      </TableCell>
                                      <TableCell>
                                        {fee.fee_type === "%"
                                          ? `${fee.of}`
                                          : ""}
                                      </TableCell>
                                      <TableCell>{fee.frequency}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Row>
                            <Row
                              className="m-2 p-2"
                              style={{
                                background:
                                  "#F3F3F3 0% 0% no-repeat padding-box",
                                borderRadius: "5px",
                              }}
                            >
                              <Row>
                                <Col>Locations of Service</Col>
                                <Col xs={3}>(-)(+) miles</Col>
                              </Row>
                              {JSON.parse(
                                property.property_manager[0].business_locations
                              ).map((bl) => {
                                return (
                                  <Row>
                                    <Col
                                      className="m-2 p-2"
                                      style={{
                                        background:
                                          " #FFFFFF 0% 0% no-repeat padding-box",
                                        boxShadow: " 0px 1px 6px #00000029",
                                        borderRadius: "5px",
                                      }}
                                    >
                                      {bl.location}
                                    </Col>
                                    <Col
                                      xs={3}
                                      className="m-2 p-2"
                                      style={{
                                        background:
                                          " #FFFFFF 0% 0% no-repeat padding-box",
                                        boxShadow: " 0px 1px 6px #00000029",
                                        borderRadius: "5px",
                                      }}
                                    >
                                      {bl.distance}
                                    </Col>
                                  </Row>
                                );
                              })}
                            </Row>
                          </div>
                        ) : (
                          ""
                        )}
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
                              // onClick={rejectPropertyManager}
                              onClick={() => {
                                setShowDialog(true);
                                setPmID(
                                  property.property_manager[0].manager_id
                                );
                              }}
                              variant="outline-primary"
                              style={redPillButton}
                            >
                              Withdraw
                            </Button>
                          </Col>
                        </Row>
                      </Row>
                    ) : (
                      ""
                    )}
                    {property.property_manager.length === 0 ? (
                      ""
                    ) : property.property_manager.length > 1 ? (
                      property.property_manager.map((p, i) =>
                        p.management_status === "REJECTED" ? (
                          ""
                        ) : p.management_status === "SENT" ? (
                          <div>
                            <Row
                              className="mt-1 mx-3"
                              style={{ overflow: "scroll" }}
                            >
                              <Table
                                responsive="md"
                                classes={{ root: classes.customTable }}
                                size="small"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Business Name</TableCell>
                                    <TableCell>Contract Name</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>
                                      {p.manager_business_name}

                                      <p
                                        style={{
                                          color: "#007AFF",
                                          fontSize: "12px",
                                        }}
                                        className="m-1"
                                      >
                                        Contract in Review
                                      </p>
                                    </TableCell>
                                    {contracts.map((contract, i) =>
                                      contract.business_uid === p.manager_id &&
                                      contract.contract_status === "ACTIVE" ? (
                                        contract.contract_name !== null ? (
                                          <TableCell>
                                            {contract.contract_name}{" "}
                                          </TableCell>
                                        ) : (
                                          <TableCell>
                                            Contract {i + 1}{" "}
                                          </TableCell>
                                        )
                                      ) : (
                                        ""
                                      )
                                    )}

                                    {contracts.map((contract, i) =>
                                      contract.business_uid === p.manager_id ? (
                                        <TableCell>
                                          {contract.start_date}
                                        </TableCell>
                                      ) : (
                                        ""
                                      )
                                    )}
                                    {contracts.map((contract, i) =>
                                      contract.business_uid === p.manager_id &&
                                      contract.contract_status === "ACTIVE" ? (
                                        <TableCell>
                                          {contract.end_date}
                                        </TableCell>
                                      ) : (
                                        ""
                                      )
                                    )}

                                    <TableCell>
                                      <a
                                        href={`tel:${property.managerInfo.manager_phone_number}`}
                                      >
                                        <img
                                          src={Phone}
                                          alt="Phone"
                                          style={smallImg}
                                        />
                                      </a>
                                      <a
                                        onClick={() => {
                                          setShowMessageFormManager(true);
                                          setSelectedManager(
                                            property.managerInfo
                                          );
                                        }}
                                      >
                                        <img
                                          src={Message}
                                          alt="Message"
                                          style={smallImg}
                                        />
                                      </a>
                                      <a
                                        // href={`mailto:${tf.tenantEmail}`}
                                        onClick={() => {
                                          setShowMailFormManager(true);
                                          setSelectedManager(
                                            property.managerInfo
                                          );
                                        }}
                                      >
                                        <img
                                          src={Mail}
                                          alt="Mail"
                                          style={smallImg}
                                        />
                                      </a>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Row>
                            <Row className="mt-1 mx-3">
                              <h5>Property Manager Documents</h5>
                            </Row>
                            <Row className="mt-1 mx-3">
                              <Table
                                responsive="md"
                                classes={{ root: classes.customTable }}
                                size="small"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Document Name</TableCell>
                                    <TableCell>View Document</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {contracts.map((contract, i) =>
                                    contract.business_uid === p.manager_id &&
                                    contract.contract_status === "ACTIVE" ? (
                                      JSON.parse(contract.documents).length ===
                                      0 ? (
                                        <TableRow>
                                          <TableCell> No documents </TableCell>
                                          <TableCell></TableCell>
                                        </TableRow>
                                      ) : (
                                        JSON.parse(contract.documents).map(
                                          (file) => {
                                            return (
                                              <TableRow>
                                                {file.description !== "" ? (
                                                  <TableCell>
                                                    {file.description}
                                                  </TableCell>
                                                ) : (
                                                  <TableCell>
                                                    Document {i + 1}{" "}
                                                  </TableCell>
                                                )}
                                                <TableCell>
                                                  <a
                                                    href={file.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                  >
                                                    <img
                                                      src={File}
                                                      alt="open document"
                                                      style={{
                                                        width: "15px",
                                                        height: "15px",
                                                      }}
                                                    />
                                                  </a>
                                                </TableCell>
                                              </TableRow>
                                            );
                                          }
                                        )
                                      )
                                    ) : (
                                      ""
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </Row>
                            <Row className="mt-1 mx-3">
                              <h5>Property Manager Fee Details</h5>
                            </Row>{" "}
                            <Row className="mt-1 mx-1">
                              {" "}
                              {contracts.map((contract, i) =>
                                contract.business_uid === p.manager_id &&
                                contract.contract_status === "ACTIVE" ? (
                                  <ManagerFees
                                    feeState={JSON.parse(
                                      contract.contract_fees
                                    )}
                                    setFeeState={setFeeState}
                                  />
                                ) : (
                                  ""
                                )
                              )}
                            </Row>
                            <Row className="mt-1 mx-3">
                              <h5>Property Manager Contact Details</h5>
                            </Row>
                            <Row className="mt-1 mx-1">
                              {contracts.map((contract, i) =>
                                contract.business_uid === p.manager_id &&
                                contract.contract_status === "ACTIVE" ? (
                                  JSON.parse(contract.assigned_contacts)
                                    .length === 0 ? (
                                    <Row className="mt-1 mx-3">
                                      No Contacts Provided
                                    </Row>
                                  ) : (
                                    <BusinessContact state={contactState} />
                                  )
                                ) : (
                                  ""
                                )
                              )}
                            </Row>
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
                                    setPmID(p.manager_id);
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
                          </div>
                        ) : (
                          ""
                        )
                      )
                    ) : property.property_manager[0].management_status ===
                      "SENT" ? (
                      <Row className="p-0 m-3">
                        <div>
                          <Table
                            responsive="md"
                            classes={{ root: classes.customTable }}
                            size="small"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Business Name</TableCell>
                                <TableCell>Contract Name</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  {
                                    property.property_manager[0]
                                      .manager_business_name
                                  }

                                  <p
                                    style={{
                                      color: "#007AFF",
                                      fontSize: "12px",
                                    }}
                                    className="m-1"
                                  >
                                    Contract in Review
                                  </p>
                                </TableCell>
                                {contracts.map((contract, i) =>
                                  contract.business_uid ===
                                    property.property_manager[0].manager_id &&
                                  contract.contract_status === "ACTIVE" ? (
                                    contract.contract_name !== null ? (
                                      <TableCell>
                                        {contract.contract_name}{" "}
                                      </TableCell>
                                    ) : (
                                      <TableCell>Contract {i + 1} </TableCell>
                                    )
                                  ) : (
                                    ""
                                  )
                                )}

                                {contracts.map((contract, i) =>
                                  contract.business_uid ===
                                    property.property_manager[0].manager_id &&
                                  contract.contract_status === "ACTIVE" ? (
                                    <TableCell>{contract.start_date}</TableCell>
                                  ) : (
                                    ""
                                  )
                                )}
                                {contracts.map((contract, i) =>
                                  contract.business_uid ===
                                    property.property_manager[0].manager_id &&
                                  contract.contract_status === "ACTIVE" ? (
                                    <TableCell>{contract.end_date}</TableCell>
                                  ) : (
                                    ""
                                  )
                                )}

                                <TableCell>
                                  <a
                                    href={`tel:${property.managerInfo.manager_phone_number}`}
                                  >
                                    <img
                                      src={Phone}
                                      alt="Phone"
                                      style={smallImg}
                                    />
                                  </a>
                                  <a
                                    onClick={() => {
                                      setShowMessageFormManager(true);
                                      setSelectedManager(property.managerInfo);
                                    }}
                                  >
                                    <img
                                      src={Message}
                                      alt="Message"
                                      style={smallImg}
                                    />
                                  </a>
                                  <a
                                    // href={`mailto:${tf.tenantEmail}`}
                                    onClick={() => {
                                      setShowMailFormManager(true);
                                      setSelectedManager(property.managerInfo);
                                    }}
                                  >
                                    <img
                                      src={Mail}
                                      alt="Mail"
                                      style={smallImg}
                                    />
                                  </a>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <Row className="mt-1">
                          <h5>Property Manager Documents</h5>
                        </Row>
                        <div>
                          <Table
                            responsive="md"
                            classes={{ root: classes.customTable }}
                            size="small"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Document Name</TableCell>
                                <TableCell>View Document</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {contracts.map((contract, i) =>
                                contract.business_uid ===
                                  property.property_manager[0].manager_id &&
                                contract.contract_status === "ACTIVE" ? (
                                  JSON.parse(contract.documents).length ===
                                  0 ? (
                                    <TableRow>
                                      <TableCell> No documents </TableCell>
                                      <TableCell></TableCell>
                                    </TableRow>
                                  ) : (
                                    JSON.parse(contract.documents).map(
                                      (file) => {
                                        return (
                                          <TableRow>
                                            {file.description !== "" ? (
                                              <TableCell>
                                                {file.description}
                                              </TableCell>
                                            ) : (
                                              <TableCell>
                                                Document {i + 1}{" "}
                                              </TableCell>
                                            )}
                                            <TableCell>
                                              <a
                                                href={file.link}
                                                target="_blank"
                                                rel="noreferrer"
                                              >
                                                <img
                                                  src={File}
                                                  alt="open document"
                                                  style={{
                                                    width: "15px",
                                                    height: "15px",
                                                  }}
                                                />
                                              </a>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      }
                                    )
                                  )
                                ) : (
                                  ""
                                )
                              )}
                            </TableBody>
                          </Table>
                        </div>

                        <Row className="mt-1">
                          <h5>Property Manager Fee Details</h5>
                        </Row>
                        {contracts.map((contract, i) =>
                          contract.business_uid ===
                            property.property_manager[0].manager_id &&
                          contract.contract_status === "ACTIVE" ? (
                            <ManagerFees
                              feeState={JSON.parse(contract.contract_fees)}
                              setFeeState={setFeeState}
                            />
                          ) : (
                            ""
                          )
                        )}
                        <Row className="mt-1">
                          <h5>Property Manager Contact Details</h5>
                        </Row>
                        {contracts.map((contract, i) =>
                          contract.business_uid ===
                            property.property_manager[0].manager_id &&
                          contract.contract_status === "ACTIVE" ? (
                            JSON.parse(contract.assigned_contacts).length ===
                            0 ? (
                              "No Contacts Provided"
                            ) : (
                              <BusinessContact state={contactState} />
                            )
                          ) : (
                            ""
                          )
                        )}

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
                                setPmID(
                                  property.property_manager[0].manager_id
                                );
                                approvePropertyManager(
                                  property.property_manager[0].manager_id
                                );
                              }}
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
                                setPmID(
                                  property.property_manager[0].manager_id
                                );
                              }}
                              variant="outline-primary"
                              style={redPillButton}
                            >
                              Reject
                            </Button>
                          </Col>
                        </Row>
                      </Row>
                    ) : (
                      ""
                    )}
                    <ManagerDocs
                      property={property}
                      addDocument={addContract}
                      selectContract={selectContract}
                      searchPM={searchPM}
                      setSearchPM={setSearchPM}
                      // reload={reloadProperty}
                      // setStage={setStage}
                    />
                  </div>
                  <div
                    className="mx-3 my-3 p-2"
                    style={{
                      background: "#E9E9E9 0% 0% no-repeat padding-box",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <Row className="m-3">
                      <Col>
                        <h3>Tenant Info</h3>
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row className="m-3" style={{ overflow: "scroll" }}>
                      {rentalInfo.length > 0 ? (
                        <div>
                          <Table
                            responsive="md"
                            classes={{ root: classes.customTable }}
                            size="small"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Lease Start Date</TableCell>
                                <TableCell>Lease End Date</TableCell>
                                <TableCell>Tenant Payments</TableCell>
                                <TableCell>Lease Docs</TableCell>
                                <TableCell>Tenant Name</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rentalInfo.map((rf) => {
                                return (
                                  <TableRow>
                                    <TableCell>{rf.lease_start}</TableCell>
                                    <TableCell>{rf.lease_end}</TableCell>
                                    <TableCell>
                                      {JSON.parse(rf.rent_payments).map(
                                        (rp) => {
                                          return (
                                            <Row className="d-flex align-items-center p-2">
                                              {rp.fee_name}: ${rp.charge}
                                            </Row>
                                          );
                                        }
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {JSON.parse(rf.documents).map((rp) => {
                                        return (
                                          <Row className="d-flex align-items-center p-2">
                                            <Col
                                              className=" d-flex align-items-left"
                                              style={{
                                                font: "normal normal 600 18px Bahnschrift-Regular",
                                                color: "#007AFF",
                                                textDecoration: "underline",
                                              }}
                                            >
                                              {rp.description == ""
                                                ? rp.name
                                                : rp.description}
                                            </Col>
                                            <Col className=" d-flex justify-content-end">
                                              <a
                                                href={rp.link}
                                                target="_blank"
                                                rel="noreferrer"
                                              >
                                                <img
                                                  src={File}
                                                  alt="open document"
                                                />
                                              </a>
                                            </Col>
                                          </Row>
                                        );
                                      })}
                                    </TableCell>
                                    <TableCell>
                                      {tenantInfo.map((tf) => {
                                        return (
                                          <p>
                                            {" "}
                                            {tf.tenantFirstName}{" "}
                                            {tf.tenantLastName}
                                          </p>
                                        );
                                      })}
                                    </TableCell>
                                    <TableCell>
                                      {tenantInfo.map((tf) => {
                                        return (
                                          <Row>
                                            <Col className="d-flex justify-content-end">
                                              <a
                                                href={`tel:${tf.tenantPhoneNumber}`}
                                              >
                                                <img
                                                  src={Phone}
                                                  alt="Phone"
                                                  style={smallImg}
                                                />
                                              </a>
                                              <a
                                                onClick={() => {
                                                  setShowMessageFormTenant(
                                                    true
                                                  );
                                                  setSelectedTenant(tf);
                                                }}
                                              >
                                                <img
                                                  src={Message}
                                                  alt="Message"
                                                  style={smallImg}
                                                />
                                              </a>
                                              <a
                                                // href={`mailto:${tf.tenantEmail}`}
                                                onClick={() => {
                                                  setShowMailFormTenant(true);
                                                  setSelectedTenant(tf);
                                                }}
                                              >
                                                <img
                                                  src={Mail}
                                                  alt="Mail"
                                                  style={smallImg}
                                                />
                                              </a>
                                            </Col>
                                          </Row>
                                        );
                                      })}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <Row className="m-3">
                          <div className="m-3">Not Rented</div>
                        </Row>
                      )}
                    </Row>
                  </div>
                </div>
              )}
            </div>
            <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-5">
              <OwnerFooter />
            </div>
          </Col>
        </Row>
      </div>
    )
  ) : (
    <div className="w-100 d-flex flex-column justify-content-center align-items-center h-50">
      <ReactBootStrap.Spinner animation="border" role="status" />
    </div>
  );
}

export default OwnerPropertyView;
