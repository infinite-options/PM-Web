import React, { useState, useEffect, useContext } from "react";
import { Col, Row } from "react-bootstrap";
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
import ManagerFooter from "./ManagerFooter";
import ImageModal from "../ImageModal";
import ManagerCreateExpense from "./ManagerCreateExpense";
import CreateRevenue from "../CreateRevenue";
import ManagerTenantRefusedAgreementView from "./ManagerTenantRefusedAgreementView";
import ManagerTenantApplications from "./ManagerTenantApplications";
import ManagerTenantProfileView from "./ManagerTenantProfileView";
import PropertyManagerDocs from "./PropertyManagerDocs";
import PropertyAppliances from "../PropertyAppliances";
import AppContext from "../../AppContext";
import ManagerManagementContract from "./ManagerManagementContract";
import ManagerTenantAgreementView from "./ManagerTenantAgreementView";
import ManagerTenantExtendedAgreementView from "./ManagerTenantExtendedAgreementView";
import ConfirmDialog from "../ConfirmDialog";
import ManagerRepairRequest from "./ManagerRepairRequest";
import ManagerPropertyForm from "./ManagerPropertyForm";
import ManagerTenantAgreement from "./ManagerTenantAgreement";
import ManagerCashflow from "./ManagerCashflow";
import SideBar from "./SideBar";
import Appliances from "../tenantComponents/Appliances";
import CopyDialog from "../CopyDialog";
import EditIconNew from "../../icons/EditIconNew.svg";
import AddIcon from "../../icons/AddIcon.svg";
import CopyIcon from "../../icons/CopyIcon.png";
import PropertyIcon from "../../icons/PropertyIcon.svg";
import RepairImg from "../../icons/RepairImg.svg";
import { get, put, post } from "../../utils/api";
import { sidebarStyle, blue, xSmall } from "../../utils/styles";
import {
  days,
  descendingComparator as descendingComparator,
  getComparator as getComparator,
  stableSort as stableSort,
} from "../../utils/helper";

import "react-multi-carousel/lib/styles.css";

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

function ManagerPropertyView(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const { userData, refresh, ably } = useContext(AppContext);
  const { access_token, user } = userData;
  const channel = ably.channels.get("management_status");
  // const property = location.state.property
  // const { mp_id } = useParams();
  const property_uid =
    location.state === null ? props.property_uid : location.state.property_uid;
  const [isLoading, setIsLoading] = useState(true);
  const [addDoc, setAddDoc] = useState(false);
  const [copied, setCopied] = useState(false);
  const [managerID, setManagerID] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [property, setProperty] = useState({ images: "[]" });
  const [hideEdit, setHideEdit] = useState(true);
  const [openImage, setOpenImage] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [daysCompleted, setDaysCompleted] = useState("10");
  const [editAppliances, setEditAppliances] = useState(false);
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
  const [showDialog, setShowDialog] = useState(false);
  const [showAddRequest, setShowAddRequest] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [endEarlyDate, setEndEarlyDate] = useState("");

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
  const appliances = Object.keys(applianceState[0]);
  const [imagesProperty, setImagesProperty] = useState([]);
  const [editProperty, setEditProperty] = useState(false);
  const [showManagementContract, setShowManagementContract] = useState(false);
  const [showTenantAgreement, setShowTenantAgreement] = useState(false);
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

  const [showTenantAgreementEdit, setShowTenantAgreementEdit] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [refusedAgreement, setRefusedAgreement] = useState(null);
  const [extendedAgreement, setExtendedAgreement] = useState(null);
  const [acceptedTenantApplications, setAcceptedTenantApplications] = useState(
    []
  );
  const [showTenantProfile, setShowTenantProfile] = useState(false);
  const [selectedTenantApplication, setSelectedTenantApplication] =
    useState(null);
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [showCreateRevenue, setShowCreateRevenue] = useState(false);
  // sorting variables
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");

  const showImage = (src) => {
    setOpenImage(true);
    setImageSrc(src);
  };
  const unShowImage = () => {
    setOpenImage(false);
    setImageSrc(null);
  };
  const cancelAgreement = async () => {
    const files = JSON.parse(property.images);
    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid;
    }
    const updatedManagementContract = {
      property_uid: property.property_uid,
      management_status: "PM END EARLY",
      manager_id: management_buid,
      early_end_date: endEarlyDate,
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
    setShowDialog(false);
    reloadProperty();
  };
  const onCancel = () => {
    setShowDialog(false);
  };
  const fetchProperty = async () => {
    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length >= 1) {
      management_buid = management_businesses[0].business_uid;
    }
    const response = await get(
      `/propertiesManagerDetail?property_uid=${property_uid}`
    );

    setManagerID(management_buid);
    setImagesProperty(JSON.parse(response.result[0].images));
    let show = JSON.parse(response.result[0].images).length < 5 ? false : true;

    // console.log(response.result[0]);
    applianceState[1](JSON.parse(response.result[0].appliances));
    const property_details = response.result[0];

    property_details.tenants = property_details.rentalInfo.filter(
      (r) => r.rental_status === "ACTIVE"
    );

    let owner_negotiations = property_details.property_manager.filter(
      (pm) => pm.linked_business_id === management_buid
    );
    if (owner_negotiations.length === 0) {
      property_details.management_status = null;
    } else if (owner_negotiations.length === 1) {
      property_details.management_status =
        owner_negotiations[0].management_status;
    } else {
      // placeholder, scenario needs to be tested and updated
      property_details.management_status =
        owner_negotiations[0].management_status;
    }
    // console.log(property_details);
    setProperty(property_details);
    let requests = [];
    if (parseInt(daysCompleted) >= 0) {
      response.result[0].maintenanceRequests.forEach((res) => {
        if (
          days(new Date(res.request_closed_date), new Date()) >=
            parseInt(daysCompleted) &&
          res.request_status === "COMPLETED"
        ) {
        } else {
          requests.push(res);
        }
      });
    } else {
      response.result[0].maintenanceRequests.forEach((res) => {
        requests.push(res);
      });
    }

    setMaintenanceRequests(requests);
    if (
      property_details.management_status === "ACCEPTED" ||
      property_details.management_status === "END EARLY" ||
      property_details.management_status === "PM END EARLY" ||
      property_details.management_status === "OWNER END EARLY"
    ) {
      setHideEdit(false);
    }
    // setSelectedAgreement(property_details.rentalInfo);
    property_details.rentalInfo.forEach((rental) => {
      if (
        rental.rental_status === "ACTIVE" ||
        rental.rental_status === "PROCESSING"
      ) {
        setSelectedAgreement(rental);
      }
    });

    property_details.rentalInfo.forEach((rental) => {
      if (
        rental.rental_status === "REFUSED" ||
        property_details.rentalInfo.some(
          (uid) => uid.rental_status == "REFUSED"
        ).linked_application_uid !=
          property_details.rentalInfo.some(
            (uid) => uid.rental_status === "ACTIVE"
          ).linked_application_uid
      ) {
        setRefusedAgreement(rental);
      }
    });

    property_details.rentalInfo.forEach((rental) => {
      if (
        rental.rental_status === "PENDING" ||
        rental.rental_status === "TENANT APPROVED"
      ) {
        setExtendedAgreement(rental);
      }
    });
    property_details.applications.forEach((application) => {
      if (
        application.application_status === "FORWARDED" ||
        application.application_status === "RENTED" ||
        application.application_status === "PM END EARLY" ||
        application.application_status === "TENANT END EARLY" ||
        application.application_status === "LEASE EXTENSION" ||
        application.application_status === "TENANT LEASE EXTENSION"
      ) {
        setAcceptedTenantApplications([application]);
      }
    });
    let recent_mr = [];
    let past_mr = [];
    // console.log(property_details.maintenanceRequests);
    property_details.maintenanceRequests.forEach((request) => {
      if (
        days(new Date(request.request_created_date.split(" ")[0]), new Date()) >
        30
      ) {
        past_mr.push(request);
      } else recent_mr.push(request);
    });
    // console.log(recent_mr, past_mr);
    setIsLoading(false);
  };
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
        : showTenantProfile
        ? setShowTenantProfile(false)
        : showAddRequest
        ? setShowAddRequest(false)
        : showCreateExpense
        ? setShowCreateExpense(false)
        : showCreateRevenue
        ? setShowCreateRevenue(false)
        : navigate("../manager");
    }
  };
  useEffect(() => {
    filterRequests();
  }, [daysCompleted]);
  const filterRequests = () => {
    let requests = [];
    if (Object.keys(property).length > 1) {
      if (property.maintenanceRequests.length > 0) {
        if (parseInt(daysCompleted) >= 0) {
          property.maintenanceRequests.forEach((res) => {
            if (
              days(new Date(res.request_closed_date), new Date()) >=
                parseInt(daysCompleted) &&
              res.request_status === "COMPLETED"
            ) {
            } else {
              requests.push(res);
            }
          });
        } else {
          property.maintenanceRequests.forEach((res) => {
            requests.push(res);
          });
        }

        setMaintenanceRequests(requests);
      }
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [
    editProperty,
    showCreateExpense,
    showCreateRevenue,
    showManagementContract,
    showTenantAgreement,
    showTenantAgreementEdit,
  ]);
  useEffect(() => {
    // console.log("in useeffect");
    fetchProperty();
  }, [addDoc]);
  const addContract = () => {
    setSelectedContract(null);
    setShowManagementContract(true);
  };
  const selectContract = (contract) => {
    setSelectedContract(contract);
    setShowManagementContract(true);
  };
  const closeContract = () => {
    setShowManagementContract(false);
    // reload();
  };

  const addAgreement = () => {
    setSelectedAgreement(null);
    setShowTenantAgreement(true);
  };
  const selectAgreement = (agreement) => {
    // console.log("agreement in selectagreement", agreement);
    setSelectedAgreement(agreement);
    setShowTenantAgreement(true);
  };
  const closeAgreement = () => {
    // reload();
    setShowTenantAgreement(false);
    setShowTenantProfile(false);
    setAcceptedTenantApplications([]);
    setSelectedAgreement(null);
    window.scrollTo(0, 0);
    // console.log("in close agreement");
    fetchProperty();
  };

  const reloadProperty = () => {
    setEditProperty(false);
    setShowAddRequest(false);
    window.scrollTo(0, 0);
    // console.log("in reload property");
    fetchProperty();
  };

  const createNewTenantAgreement = (selected_applications) => {
    setAcceptedTenantApplications(selected_applications);

    setShowTenantAgreement(true);
  };

  const selectTenantApplication = (application) => {
    setSelectedTenantApplication(application);
    setShowTenantProfile(true);
  };

  const closeTenantApplication = () => {
    setShowTenantProfile(false);
  };

  const renewLease = (agreement) => {
    setShowTenantAgreement(true);
    setSelectedAgreement(agreement);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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

  return Object.keys(property).length > 1 ? (
    showManagementContract ? (
      <ManagerManagementContract
        back={closeContract}
        property={property}
        contract={selectedContract}
        reload={reloadProperty}
        selectedBusiness={selectedBusiness}
      />
    ) : showTenantAgreement ? (
      <ManagerTenantAgreement
        back={closeAgreement}
        property={property}
        agreement={
          selectedAgreement == null
            ? refusedAgreement
            : acceptedTenantApplications[0].application_uid !==
              JSON.parse(selectedAgreement.linked_application_id)[0]
            ? refusedAgreement
            : selectedAgreement
        }
        acceptedTenantApplications={acceptedTenantApplications}
        setAcceptedTenantApplications={setAcceptedTenantApplications}
      />
    ) : (
      <div>
        <ConfirmDialog
          title={"Are you sure you want to cancel the agreement?"}
          isOpen={showDialog}
          onConfirm={cancelAgreement}
          onCancel={onCancel}
        />
        <CopyDialog copied={copied} />
        {/* {console.log("showdialog", showDialog)} */}
        <Row className="w-100 mb-5 overflow-hidden">
          <Col
            xs={2}
            hidden={!responsiveSidebar.showSidebar}
            style={sidebarStyle}
          >
            <SideBar />
          </Col>
          <Col className="w-100 mb-5 overflow-hidden">
            <Header
              title="Property Details"
              leftText={location.state === null ? "" : "< Back"}
              leftFn={headerBack}
            />
            {editProperty ? (
              <ManagerPropertyForm
                property={property}
                edit={editProperty}
                setEdit={setEditProperty}
                editAppliances={editAppliances}
                setEditAppliances={setEditAppliances}
                hideEdit={hideEdit}
                onSubmit={reloadProperty}
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
            ) : showTenantProfile ? (
              <ManagerTenantProfileView
                back={closeTenantApplication}
                application={selectedTenantApplication}
                createNewTenantAgreement={createNewTenantAgreement}
              />
            ) : showAddRequest ? (
              <ManagerRepairRequest
                properties={[property]}
                cancel={() => setShowAddRequest(false)}
                onSubmit={reloadProperty}
              />
            ) : showCreateExpense ? (
              <ManagerCreateExpense
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
                          <img
                            key={Date.now()}
                            src={`${image}?${Date.now()}`}
                            // src={image}
                            style={{
                              width: "200px",
                              height: "200px",
                              objectFit: "cover",
                            }}
                            onClick={() => showImage(`${image}?${Date.now()}`)}
                          />
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
                              // src={image}
                              style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "cover",
                              }}
                              onClick={() =>
                                showImage(`${image}?${Date.now()}`)
                              }
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
                  <ManagerCashflow
                    managerData={[property]}
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
                    {property.management_status === "ACCEPTED" ? (
                      <Col>
                        <img
                          src={EditIconNew}
                          alt="Edit Icon"
                          onClick={
                            property.management_status === "ACCEPTED"
                              ? () => {
                                  window.scrollTo(0, 0);
                                  setEditProperty(true);
                                }
                              : () => {}
                          }
                          style={{
                            width: "30px",
                            height: "30px",
                            float: "right",
                            marginRight: "5rem",
                          }}
                        />
                      </Col>
                    ) : (
                      <Col></Col>
                    )}
                  </Row>
                  <Row className="m-3" style={{ overflow: "scroll" }}>
                    <div>
                      <Table
                        classes={{ root: classes.customTable }}
                        size="small"
                        responsive="md"
                      >
                        <TableHead>
                          {" "}
                          <TableRow>
                            <TableCell> Property Images</TableCell>
                            <TableCell>Street Address</TableCell>
                            <TableCell>City,State</TableCell>
                            <TableCell>Zip</TableCell>
                            <TableCell>Owner</TableCell>
                            <TableCell>Tenant</TableCell>{" "}
                            <TableCell>Rent Status</TableCell>
                            <TableCell>Lease End</TableCell>
                            <TableCell>Rent</TableCell>{" "}
                            <TableCell>Type</TableCell>{" "}
                            <TableCell>Size</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {" "}
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
                              onClick={
                                property.management_status === "ACCEPTED"
                                  ? () => {
                                      window.scrollTo(0, 1500);
                                      setEditProperty(true);
                                    }
                                  : () => {}
                              }
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
                                    maxWidth: "80px",
                                    maxHeight: "80px",
                                  }}
                                />
                              ) : (
                                <img
                                  src={PropertyIcon}
                                  alt="Property"
                                  style={{
                                    borderRadius: "4px",
                                    objectFit: "contain",
                                    maxWidth: "80px",
                                    maxHeight: "80px",
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              onClick={
                                property.management_status === "ACCEPTED"
                                  ? () => {
                                      window.scrollTo(0, 0);
                                      setEditProperty(true);
                                    }
                                  : () => {}
                              }
                            >
                              {property.address}
                              {property.unit !== "" ? " " + property.unit : ""}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              onClick={
                                property.management_status === "ACCEPTED"
                                  ? () => {
                                      window.scrollTo(0, 0);
                                      setEditProperty(true);
                                    }
                                  : () => {}
                              }
                            >
                              {property.city}, {property.state}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              onClick={
                                property.management_status === "ACCEPTED"
                                  ? () => {
                                      window.scrollTo(0, 0);
                                      setEditProperty(true);
                                    }
                                  : () => {}
                              }
                            >
                              {property.zip}
                            </TableCell>
                            {/* {console.log(property)} */}
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {property.owner.length !== 0
                                ? property.owner[0].owner_first_name +
                                  " " +
                                  property.owner[0].owner_last_name
                                : "None"}
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
                            >
                              {property.rentalInfo.length !== 0
                                ? property.rentalInfo[0].lease_end
                                : "None"}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              onClick={
                                property.management_status === "ACCEPTED"
                                  ? () => {
                                      window.scrollTo(0, 800);
                                      setEditProperty(true);
                                    }
                                  : () => {}
                              }
                            >
                              {"$" + property.listed_rent}
                            </TableCell>

                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              onClick={
                                property.management_status === "ACCEPTED"
                                  ? () => {
                                      window.scrollTo(0, 800);
                                      setEditProperty(true);
                                    }
                                  : () => {}
                              }
                            >
                              {property.property_type}
                            </TableCell>

                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                              onClick={
                                property.management_status === "ACCEPTED"
                                  ? () => {
                                      window.scrollTo(0, 800);
                                      setEditProperty(true);
                                    }
                                  : () => {}
                              }
                            >
                              {property.num_beds + "/" + property.num_baths}
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
                          <TableCell style={{ width: "149px" }}>
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
                          <TableCell style={{ width: "149px" }}>
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
                  className="mx-3 my-3 p-2 "
                  style={{
                    background: "#E9E9E9 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                >
                  <Row className="m-3">
                    <Col>
                      <h3>Maintenance and Repair Requests</h3>
                    </Col>
                    <Col xs={4}>
                      Hide requests completed <span>&#62;</span>{" "}
                      <input
                        style={{
                          borderRadius: "5px",
                          border: "1px solid #707070",
                          width: "2rem",
                        }}
                        value={daysCompleted}
                        onChange={(e) => {
                          setDaysCompleted(e.target.value);
                        }}
                      />{" "}
                      days
                    </Col>
                    {property.management_status === "ACCEPTED" ? (
                      <Col xs={2}>
                        {" "}
                        <img
                          src={AddIcon}
                          alt="Add Icon"
                          onClick={() => setShowAddRequest(true)}
                          style={{
                            width: "30px",
                            height: "30px",
                            float: "right",
                            marginRight: "5rem",
                          }}
                        />
                      </Col>
                    ) : (
                      <Col></Col>
                    )}
                  </Row>
                  <Row className="m-3">
                    {maintenanceRequests.length > 0 &&
                    property.management_status === "ACCEPTED" ? (
                      <div style={{ overflow: "hidden" }}>
                        <Table
                          classes={{ root: classes.customTable }}
                          size="small"
                          responsive="md"
                        >
                          <EnhancedTableHeadMaintenance
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={maintenanceRequests.length}
                          />{" "}
                          <TableBody>
                            {stableSort(
                              maintenanceRequests,
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
                                    onClick={() => {
                                      navigate(
                                        `../manager-repairs/${request.maintenance_request_uid}`,
                                        {
                                          state: {
                                            repair: request,
                                          },
                                        }
                                      );
                                    }}
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
                                        `../manager-repairs/${request.maintenance_request_uid}`,
                                        {
                                          state: {
                                            repair: request,
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
                                    {request.request_status}{" "}
                                    {request.request_status === "COMPLETED" ? (
                                      <div className="d-flex">
                                        <div className="d-flex justify-content-right">
                                          <p
                                            style={{ ...blue, ...xSmall }}
                                            className="mb-0"
                                          >
                                            {days(
                                              new Date(
                                                request.request_closed_date
                                              ),
                                              new Date()
                                            )}{" "}
                                            days
                                          </p>
                                        </div>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </TableCell>
                                  <TableCell
                                    padding="none"
                                    size="small"
                                    align="center"
                                    onClick={() => {
                                      navigate(
                                        `../manager-repairs/${request.maintenance_request_uid}`,
                                        {
                                          state: {
                                            repair: request,
                                          },
                                        }
                                      );
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
                                        `../manager-repairs/${request.maintenance_request_uid}`,
                                        {
                                          state: {
                                            repair: request,
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
                                    onClick={() => {
                                      navigate(
                                        `../manager-repairs/${request.maintenance_request_uid}`,
                                        {
                                          state: {
                                            repair: request,
                                          },
                                        }
                                      );
                                    }}
                                  >
                                    {" "}
                                    {request.request_created_date.split(" ")[0]}
                                  </TableCell>
                                  <TableCell
                                    padding="none"
                                    size="small"
                                    align="center"
                                    onClick={() => {
                                      navigate(
                                        `../manager-repairs/${request.maintenance_request_uid}`,
                                        {
                                          state: {
                                            repair: request,
                                          },
                                        }
                                      );
                                    }}
                                  >
                                    {request.days_open} days
                                  </TableCell>
                                  <TableCell
                                    padding="none"
                                    size="small"
                                    align="center"
                                    onClick={() => {
                                      navigate(
                                        `../manager-repairs/${request.maintenance_request_uid}`,
                                        {
                                          state: {
                                            repair: request,
                                          },
                                        }
                                      );
                                    }}
                                  >
                                    {request.request_type !== null
                                      ? request.request_type
                                      : "None"}
                                  </TableCell>
                                  <TableCell
                                    padding="none"
                                    size="small"
                                    align="center"
                                    onClick={() => {
                                      navigate(
                                        `../manager-repairs/${request.maintenance_request_uid}`,
                                        {
                                          state: {
                                            repair: request,
                                          },
                                        }
                                      );
                                    }}
                                  >
                                    {request.priority}
                                  </TableCell>
                                  <TableCell
                                    padding="none"
                                    size="small"
                                    align="center"
                                    onClick={() => {
                                      navigate(
                                        `../manager-repairs/${request.maintenance_request_uid}`,
                                        {
                                          state: {
                                            repair: request,
                                          },
                                        }
                                      );
                                    }}
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
                                    onClick={() => {
                                      navigate(
                                        `../manager-repairs/${request.maintenance_request_uid}`,
                                        {
                                          state: {
                                            repair: request,
                                          },
                                        }
                                      );
                                    }}
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
                  className="mx-3 my-3  p-2"
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
                    {property.management_status === "ACCEPTED" ? (
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
                    ) : (
                      <Col></Col>
                    )}
                  </Row>
                  <Row className="m-3" style={{ overflow: "scroll" }}>
                    <div>
                      {appliances.filter(
                        (appliance) =>
                          applianceState[0][appliance]["available"] === true ||
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
                  <Row className="m-3" style={{ overflow: "scroll" }}>
                    <div>
                      {" "}
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
                  <Row className="m-3" style={{ overflow: "scroll" }}>
                    <div>
                      {" "}
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
                              {property.available_to_rent === 0 ? "No" : "Yes"}
                            </TableCell>
                            <TableCell>
                              {property.featured === "True" ? "Yes" : "No"}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </Row>
                </div>

                <div
                  className="mx-3 p-2"
                  style={{
                    background: "#E9E9E9 0% 0% no-repeat padding-box",
                    borderRadius: "10px 10px 0px 0px",
                    opacity: 1,
                  }}
                >
                  <Row className="m-3">
                    <Col>
                      <h3>Tenant Applications</h3>
                    </Col>
                    <Col xs={2}></Col>
                  </Row>
                </div>

                <div
                  className="mx-3 p-2"
                  style={{
                    background: "#E9E9E9 0% 0% no-repeat padding-box",
                    borderRadius: "0px 0px 10px 10px",
                    opacity: 1,
                  }}
                >
                  <div className="mx-3">
                    <ManagerTenantApplications
                      property={property}
                      reload={reloadProperty}
                      agreement={
                        selectedAgreement == null
                          ? refusedAgreement
                          : selectedAgreement
                      }
                      createNewTenantAgreement={createNewTenantAgreement}
                      selectTenantApplication={selectTenantApplication}
                      selectedTenantApplication={selectedTenantApplication}
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
                  <Row>
                    <ManagerTenantAgreementView
                      property={property}
                      closeAgreement={closeAgreement}
                      selectedAgreement={selectedAgreement}
                      extendedAgreement={extendedAgreement}
                      selectAgreement={selectAgreement}
                      renewLease={renewLease}
                      addDoc={addDoc}
                      setAddDoc={setAddDoc}
                      acceptedTenantApplications={acceptedTenantApplications}
                      setAcceptedTenantApplications={
                        setAcceptedTenantApplications
                      }
                    />
                  </Row>
                </div>
                {extendedAgreement ? (
                  <div
                    className="mx-3 my-3 p-2"
                    style={{
                      background: "#E9E9E9 0% 0% no-repeat padding-box",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <Row>
                      <ManagerTenantExtendedAgreementView
                        property={property}
                        closeAgreement={closeAgreement}
                        selectedAgreement={extendedAgreement}
                        selectAgreement={selectAgreement}
                        renewLease={renewLease}
                        acceptedTenantApplications={acceptedTenantApplications}
                        setAcceptedTenantApplications={
                          setAcceptedTenantApplications
                        }
                      />
                    </Row>
                  </div>
                ) : (
                  ""
                )}
                {refusedAgreement ? (
                  <div
                    className="mx-3 my-3 p-2"
                    style={{
                      background: "#E9E9E9 0% 0% no-repeat padding-box",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <Row>
                      <ManagerTenantRefusedAgreementView
                        property={property}
                        closeAgreement={closeAgreement}
                        selectedAgreement={refusedAgreement}
                        selectAgreement={selectAgreement}
                        renewLease={renewLease}
                        acceptedTenantApplications={acceptedTenantApplications}
                        setAcceptedTenantApplications={
                          setAcceptedTenantApplications
                        }
                      />
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
                  <Row>
                    {" "}
                    <PropertyManagerDocs
                      property={property}
                      managerID={managerID}
                      fetchProperty={fetchProperty}
                      addDocument={addContract}
                      selectContract={selectContract}
                      selectedBusiness={selectedBusiness}
                      setSelectedBusiness={setSelectedBusiness}
                      setShowDialog={setShowDialog}
                      endEarlyDate={endEarlyDate}
                      setEndEarlyDate={setEndEarlyDate}
                      cancel={cancel}
                      setCancel={setCancel}
                      reload={""}
                    />
                  </Row>
                </div>
              </div>
            )}
            <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-5">
              <ManagerFooter />
            </div>{" "}
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

export default ManagerPropertyView;
