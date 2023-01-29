import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Header from "../Header";
import Checkbox from "../Checkbox";
import SideBar from "./SideBar";
import TenantFooter from "./TenantFooter";
import AppContext from "../../AppContext";
import Radiobutton_filled from "../../icons/Radiobutton_filled.svg";
import Radiobutton_unfilled from "../../icons/Radiobutton_unfilled.svg";
import {
  squareForm,
  pillButton,
  bluePillButton,
  headings,
  subHeading,
  red,
} from "../../utils/styles";
import { get, put, post } from "../../utils/api";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});
function ReviewTenantProfile(props) {
  const classes = useStyles();
  const { property_uid } = useParams();
  const { userData } = useContext(AppContext);
  const { user, access_token } = userData;
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [filesOrigignal, setFilesOriginal] = useState([]);
  const [files, setFiles] = useState([]);
  const [filesCopy, setFilesCopy] = useState([]);
  const [message, setMessage] = useState("");
  const [numAdults, setNumAdults] = useState(0);
  const [numChildren, setNumChildren] = useState(0);
  const [numPets, setNumPets] = useState(0);
  const [numVehicles, setNumVehicles] = useState(0);
  const [numReferences, setNumReferences] = useState(0);
  const [adultsApplication, setAdultsApplication] = useState([]);
  const [childrenApplication, setChildrenApplication] = useState([]);
  const [petsApplication, setPetsApplication] = useState([]);
  const [vehiclesApplication, setVehiclesApplication] = useState([]);
  const [referencesApplication, setReferencesApplication] = useState([]);
  const [adults, setAdults] = useState([]);
  const [children, setChildren] = useState([]);
  const [pets, setPets] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [references, setReferences] = useState([]);

  const [width, setWindowWidth] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };
  const responsive = {
    showSidebar: width > 1023,
  };
  const goToPropertyView = () => {
    navigate(`/propertyApplicationView/${property_uid}`);
  };
  const goToShowApplied = () => {
    navigate("/applyToProperty");
  };
  // const updateNewFile = (i, field, value) => {
  //   const newFileCopy = { ...files[i] };
  //   newFileCopy[field] = value;
  //   console.log(newFileCopy);
  //   newFile.push(newFileCopy);
  //   setNewFile(newFile);
  // };

  // console.log("Files", files);
  // console.log("Files Copy", filesCopy);
  // console.log("New Files", filesOrigignal);
  const apply = async () => {
    // console.log(files);
    // console.log(filesOrigignal);
    let application_docs = [];
    for (let i = 0; i < filesCopy.length; i++) {
      if (filesCopy[i].shared === true) {
        application_docs.push(filesCopy[i]);
      }
    }
    // if (numPets > 0 && typePets == "") {
    //   setErrorMessage("Please fill out the type of pets");
    //   return;
    // }
    console.log(application_docs);
    // console.log(adultsApplication);
    const newApplication = {
      property_uid: property_uid,
      message: message,
      adults: adultsApplication,
      children: childrenApplication,
      pets: petsApplication,
      vehicles: vehiclesApplication,
      referred: referencesApplication,
      documents: application_docs,
    };
    console.log(application_docs);
    const response = await post("/applications", newApplication, access_token);

    const tenantProfile = {};
    let update_tenant_docs = [];
    for (let i = 0; i < filesCopy.length; i++) {
      //if no change, then we push original
      if (filesCopy[i].shared === filesOrigignal[i].shared) {
        // push the original info in database
        update_tenant_docs.push(filesOrigignal[i]);
      }
      // if original data is shared, and current NOT, then push the original
      else if (
        filesCopy[i].shared === false &&
        filesOrigignal[i].shared === true
      ) {
        //push original info in database
        update_tenant_docs.push(filesOrigignal[i]);
      }
      // if original data is NOT shared, and current IS, then push the current
      else if (
        filesCopy[i].shared === true &&
        filesOrigignal[i].shared === false
      ) {
        // push the current info in database
        update_tenant_docs.push(filesCopy[i]);
      } else {
        //do nothing
      }
    }

    console.log(update_tenant_docs);

    for (let i = 0; i < update_tenant_docs.length; i++) {
      let key = `doc_${i}`;
      tenantProfile[key] = update_tenant_docs[i].file;
      delete update_tenant_docs[i].file;
    }
    tenantProfile.documents = JSON.stringify(update_tenant_docs);
    console.log(update_tenant_docs);

    const res = await put(
      "/tenantProfileInfo",
      tenantProfile,
      access_token,
      update_tenant_docs
    );
    goToShowApplied();
  };

  //   const updateNewFile = (field, value) => {
  //     const newFileCopy = {...newFile};
  //     newFileCopy[field] = value;
  //     setNewFile(newFileCopy);
  //   }

  const editDocument = (i) => {
    const newFiles = [...filesCopy];
    const file = newFiles.splice(i, 1)[0];
    // console.log(file);
    file["shared"] = !file.shared;
    // console.log(file);
    setFiles(newFiles);
    // setNewFile({ ...file });
    // newFile.push(file);
    // setNewFile(newFile);
  };

  const fetchProfileInfo = async () => {
    const response = await get(`/tenantProfileInfo?tenant_id=${user.user_uid}`);
    if (response.result && response.result.length !== 0) {
      const res = response.result[0];

      const currentAdd = JSON.parse(res.tenant_current_address);
      const previousAdd = JSON.parse(res.tenant_previous_address);
      res.tenant_current_address = currentAdd;
      res.tenant_previous_address = previousAdd;

      setProfile(res);
      const documents = response.result[0].documents
        ? JSON.parse(response.result[0].documents)
        : [];
      // setFiles(documents);
      setFilesCopy(documents);
      setNumAdults(
        JSON.parse(response.result[0].tenant_adult_occupants).length
      );
      setAdults(JSON.parse(response.result[0].tenant_adult_occupants));
      setNumChildren(
        JSON.parse(response.result[0].tenant_children_occupants).length
      );
      setChildren(JSON.parse(response.result[0].tenant_children_occupants));
      setNumPets(JSON.parse(response.result[0].tenant_pet_occupants).length);
      setPets(JSON.parse(response.result[0].tenant_pet_occupants));
      setNumVehicles(JSON.parse(response.result[0].tenant_vehicle_info).length);
      setVehicles(JSON.parse(response.result[0].tenant_vehicle_info));
      setNumReferences(JSON.parse(response.result[0].tenant_references).length);
      setReferences(JSON.parse(response.result[0].tenant_references));
      let fo = JSON.parse(JSON.stringify(documents));
      setFilesOriginal(fo);
      return;
    }
    if (user.role.indexOf("TENANT") === -1) {
      // console.log("no tenant profile");
      props.onConfirm();
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  // console.log(files);
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );

  const handleAdultsClick = (adult) => {
    setAdultsApplication((nums) =>
      nums.includes(adult) ? nums.filter((n) => n !== adult) : [adult, ...nums]
    );
  };
  const handleChildrenClick = (child) => {
    setChildrenApplication((nums) =>
      nums.includes(child) ? nums.filter((n) => n !== child) : [child, ...nums]
    );
  };
  const handlePetsClick = (pet) => {
    setPetsApplication((nums) =>
      nums.includes(pet) ? nums.filter((n) => n !== pet) : [pet, ...nums]
    );
  };
  const handleVehiclesClick = (vehicle) => {
    setVehiclesApplication((nums) =>
      nums.includes(vehicle)
        ? nums.filter((n) => n !== vehicle)
        : [vehicle, ...nums]
    );
  };
  const handleReferencesClick = (reference) => {
    setReferencesApplication((nums) =>
      nums.includes(reference)
        ? nums.filter((n) => n !== reference)
        : [reference, ...nums]
    );
  };
  // console.log("adultsApplication", adultsApplication);
  // function handleDocumentClick(i){
  //   console.log("clicked");
  //   const temp = documentClick;
  //   temp[i] = !temp[i];
  //   setDocumentClick(temp);
  // }
  // console.log(documentClick);
  return (
    <div className="w-100 overflow-hidden">
      <div className="flex-1">
        <div
          hidden={!responsive.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </div>
        <div className="w-100 mb-5 overflow-scroll">
          <Header
            title="Profile"
            leftText="< Back"
            leftFn={goToPropertyView}
            // rightText="Edit"
            rightFn={() => {
              navigate(`/tenant`);
            }}
            //    rightFn ={() => setTab("PROFILE")}
          />
          <Row className="m-3">
            <h3>Tenant Profile</h3>
          </Row>
          {profile ? (
            <Row className="m-3" style={{ overflow: "scroll" }}>
              <Table
                classes={{ root: classes.customTable }}
                size="small"
                responsive="md"
              >
                <TableHead>
                  <TableRow>
                    <TableCell> First Name</TableCell>
                    <TableCell> Last Name</TableCell>
                    <TableCell> Current Address</TableCell>
                    <TableCell> Current Salary</TableCell>
                    <TableCell> Current Job Title</TableCell>
                    <TableCell> Current Company Name</TableCell>
                    <TableCell> SSN</TableCell>
                    <TableCell> Driver's Licence Number(State)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell> {user.first_name}</TableCell>
                    <TableCell> {user.last_name}</TableCell>
                    <TableCell>
                      {profile.tenant_current_address.street}{" "}
                      {profile.tenant_current_address.unit},{" "}
                      {profile.tenant_current_address.city},{" "}
                      {profile.tenant_current_address.state}{" "}
                      {profile.tenant_current_address.zip}{" "}
                    </TableCell>
                    <TableCell>
                      {profile.tenant_current_salary} /
                      {profile.tenant_salary_frequency}
                    </TableCell>
                    <TableCell> {profile.tenant_current_job_title}</TableCell>
                    <TableCell> {profile.tenant_current_job_company}</TableCell>
                    <TableCell> {profile.tenant_ssn}</TableCell>
                    <TableCell>
                      {profile.tenant_drivers_license_number} (
                      {profile.tenant_drivers_license_state})
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {/* ======================  <Current Address> ======================================== */}
              <div style={{ marginTop: "40px" }}>
                {profile.tenant_current_address.pm_name ? (
                  <Row className="m-3" style={{ overflow: "scroll" }}>
                    <h3>Current Address info</h3>

                    <Table
                      classes={{ root: classes.customTable }}
                      size="small"
                      responsive="md"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell> Name of the Property Manager</TableCell>
                          <TableCell>
                            {" "}
                            Property Manager's Phone Number
                          </TableCell>
                          <TableCell> Lease Start Dates</TableCell>
                          <TableCell> Lease End Dates</TableCell>
                          <TableCell> Monthly Rent</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            {" "}
                            {profile.tenant_current_address.pm_name}
                          </TableCell>
                          <TableCell>
                            {" "}
                            {profile.tenant_current_address.pm_number}
                          </TableCell>
                          <TableCell>
                            {profile.tenant_current_address.lease_start}
                          </TableCell>
                          <TableCell>
                            {profile.tenant_current_address.lease_end}
                          </TableCell>
                          <TableCell>
                            {profile.tenant_current_address.rent}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Row>
                ) : (
                  ""
                )}
              </div>
              {/* =============================== <Previous Address> ==================================== */}
              {profile.tenant_previous_address ? (
                <Row className="m-3" style={{ overflow: "scroll" }}>
                  <h3>Previous Address info</h3>

                  <Table
                    classes={{ root: classes.customTable }}
                    size="small"
                    responsive="md"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Address</TableCell>
                        <TableCell> Name of the Property Manager</TableCell>
                        <TableCell> Property Manager's Phone Number</TableCell>
                        <TableCell> Lease Start Dates</TableCell>
                        <TableCell> Lease End Dates</TableCell>
                        <TableCell> Monthly Rent</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          {" "}
                          {profile.tenant_previous_address.street}{" "}
                          {profile.tenant_previous_address.unit},{" "}
                          {profile.tenant_previous_address.city},{" "}
                          {profile.tenant_previous_address.state}{" "}
                          {profile.tenant_previous_address.zip}{" "}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {profile.tenant_previous_address.pm_name}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {profile.tenant_previous_address.pm_number}
                        </TableCell>
                        <TableCell>
                          {profile.tenant_previous_address.lease_start}
                        </TableCell>
                        <TableCell>
                          {profile.tenant_previous_address.lease_end}
                        </TableCell>
                        <TableCell>
                          {profile.tenant_previous_address.rent}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Row>
              ) : (
                ""
              )}
            </Row>
          ) : (
            ""
          )}
          {/* =======================================Documents display================================================ */}
          <Row
            className="m-3"
            style={{
              marginTop: "40px",
              paddingLeft: "20px",
              fontWeight: "bold",
            }}
          >
            <h3>Documents</h3>
          </Row>
          <Row className="m-3">
            {filesCopy.length > 0 ? (
              <div className="mb-4">
                {filesCopy.map((file, i) => (
                  <div key={i}>
                    <div className="d-flex justify-content-left align-items-start">
                      <Checkbox
                        type="CIRCLE"
                        checked={file.shared}
                        onClick={() => editDocument(i)}
                      />
                      <div>
                        <h6 style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                          {file.name}
                        </h6>
                        <p style={{ paddingLeft: "20px" }} className="m-0">
                          {file.description}
                        </p>
                      </div>
                    </div>
                    <hr style={{ opacity: 1 }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mx-3 mb-4 px-5">None uploaded</div>
            )}
          </Row>

          <Row
            className="m-3"
            style={{
              marginTop: "40px",
              paddingLeft: "20px",
              fontWeight: "bold",
            }}
          >
            <h3>Who plans to live in the unit?</h3>
          </Row>
          <Row className="m-3">
            <div>
              {Object.values(adults).length > 0 ? (
                <div className="mx-3 ">
                  <Row style={subHeading}>Adults</Row>
                  <Row style={subHeading}>
                    <Col xs={1}></Col>
                    <Col>Name</Col>
                    <Col>Relationship</Col>
                    <Col>DOB(YYYY-MM-DD)</Col>
                  </Row>
                  {Object.values(adults).map((adult, i) => {
                    return (
                      <div>
                        <Row>
                          <Col xs={1}>
                            {adultsApplication.includes(adult) ? (
                              <img
                                src={Radiobutton_filled}
                                style={{ width: "15px", height: "15px" }}
                                onClick={() => handleAdultsClick(adult)}
                              />
                            ) : (
                              <img
                                src={Radiobutton_unfilled}
                                style={{ width: "15px", height: "15px" }}
                                onClick={() => handleAdultsClick(adult)}
                              />
                            )}
                          </Col>
                          <Col>{adult.name}</Col>
                          <Col>{adult.relationship}</Col>
                          <Col>{adult.dob}</Col>
                        </Row>
                      </div>
                    );
                  })}
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              {Object.values(children).length > 0 ? (
                <div className="mx-3 ">
                  <Row style={subHeading}>Children</Row>
                  <Row style={subHeading}>
                    <Col xs={1}></Col>
                    <Col>Name</Col>
                    <Col>Relationship</Col>
                    <Col>DOB(YYYY-MM-DD)</Col>
                  </Row>
                  {Object.values(children).map((child) => {
                    return (
                      <div>
                        <Row>
                          <Col xs={1}>
                            {childrenApplication.includes(child) ? (
                              <img
                                src={Radiobutton_filled}
                                style={{ width: "15px", height: "15px" }}
                                onClick={() => handleChildrenClick(child)}
                              />
                            ) : (
                              <img
                                src={Radiobutton_unfilled}
                                style={{ width: "15px", height: "15px" }}
                                onClick={() => handleChildrenClick(child)}
                              />
                            )}
                          </Col>
                          <Col>{child.name}</Col>
                          <Col>{child.relationship}</Col>
                          <Col>{child.dob}</Col>
                        </Row>
                      </div>
                    );
                  })}
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              {Object.values(pets).length > 0 ? (
                <div className="mx-3 ">
                  <Row style={subHeading}>Pets</Row>
                  <Row style={subHeading}>
                    <Col xs={1}></Col>
                    <Col>Name</Col>
                    <Col>Type</Col>
                    <Col>Breed</Col>
                    <Col>Weight</Col>
                  </Row>
                  {Object.values(pets).map((pet) => {
                    return (
                      <div>
                        <Row>
                          {" "}
                          <Col xs={1}>
                            {petsApplication.includes(pet) ? (
                              <img
                                src={Radiobutton_filled}
                                style={{ width: "15px", height: "15px" }}
                                onClick={() => handlePetsClick(pet)}
                              />
                            ) : (
                              <img
                                src={Radiobutton_unfilled}
                                style={{ width: "15px", height: "15px" }}
                                onClick={() => handlePetsClick(pet)}
                              />
                            )}
                          </Col>
                          <Col>{pet.name}</Col>
                          <Col>{pet.type}</Col>
                          <Col>{pet.breed}</Col>
                          <Col>{pet.weight}</Col>
                        </Row>
                      </div>
                    );
                  })}
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              {Object.values(vehicles).length > 0 ? (
                <div className="mx-3 ">
                  <Row style={subHeading}>Vehicles</Row>
                  <Row style={subHeading}>
                    <Col xs={1}></Col>
                    <Col>Make</Col>
                    <Col>Model</Col>
                    <Col>Year</Col>
                    <Col>State</Col>
                    <Col>License</Col>
                  </Row>
                  {Object.values(vehicles).map((vehicle) => {
                    return (
                      <div>
                        <Row>
                          <Col xs={1}>
                            {vehiclesApplication.includes(vehicle) ? (
                              <img
                                src={Radiobutton_filled}
                                style={{ width: "15px", height: "15px" }}
                                onClick={() => handleVehiclesClick(vehicle)}
                              />
                            ) : (
                              <img
                                src={Radiobutton_unfilled}
                                style={{ width: "15px", height: "15px" }}
                                onClick={() => handleVehiclesClick(vehicle)}
                              />
                            )}
                          </Col>
                          <Col>{vehicle.make}</Col>
                          <Col>{vehicle.model}</Col>
                          <Col>{vehicle.year}</Col>
                          <Col>{vehicle.state}</Col>
                          <Col>{vehicle.license}</Col>
                        </Row>
                      </div>
                    );
                  })}
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              {Object.values(references).length > 0 ? (
                <div className="mx-3 ">
                  <Row style={subHeading}>References</Row>
                  <Row style={subHeading}>
                    <Col xs={1}></Col>
                    <Col>Name</Col>
                    <Col>Address</Col>
                    <Col>Phone Number</Col>
                    <Col>Email</Col>
                    <Col>Relationship</Col>
                  </Row>
                  {Object.values(references).map((reference) => {
                    return (
                      <div>
                        <Row>
                          <Col xs={1}>
                            {referencesApplication.includes(reference) ? (
                              <img
                                src={Radiobutton_filled}
                                style={{ width: "15px", height: "15px" }}
                                onClick={() => handleReferencesClick(reference)}
                              />
                            ) : (
                              <img
                                src={Radiobutton_unfilled}
                                style={{ width: "15px", height: "15px" }}
                                onClick={() => handleReferencesClick(reference)}
                              />
                            )}
                          </Col>
                          <Col>{reference.name}</Col>
                          <Col>{reference.address}</Col>
                          <Col>{reference.phone}</Col>
                          <Col>{reference.email}</Col>
                          <Col>{reference.relationship}</Col>
                        </Row>
                      </div>
                    );
                  })}
                </div>
              ) : (
                ""
              )}
            </div>
          </Row>

          {/* =======================================Application
          Occupants================================================ */}
          {/* <Row className="m-3">
            <Row>
              <Col>
                <Form.Group className="mx-2 my-3">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Adult Occupants
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="No. of Adult Occupants"
                    value={adultOccupants}
                    onChange={(e) => setAdultOccupants(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mx-2 my-3">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Children Occupants
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="No. of Children Occupants"
                    value={childrenOccupants}
                    onChange={(e) => setChildrenOccupants(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Row> */}
          {/* =======================================Application
          Occupants================================================ */}
          {/* <Row className="m-3">
            <Row>
              <Col>
                <Form.Group className="mx-2 my-3">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    No. of Pets
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="No. of pets"
                    value={numPets}
                    onChange={(e) => setNumPets(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mx-2 my-3">
                  <Form.Label as="h6" className="mb-0 ms-2">
                    Types of Pets {typePets === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="Type of Pets"
                    value={typePets}
                    onChange={(e) => setTypePets(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Row> */}
          {/* =======================================Application Message================================================ */}
          <Row className="m-3">
            <Form.Group className="mx-2 my-3">
              <Form.Label as="h6" className="mb-0 ms-2">
                Application Message
              </Form.Label>
              <Form.Control
                style={squareForm}
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
          </Row>
          {/* =======================================Send Button================================================ */}
          <Row className="m-3">
            <Col
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              {" "}
              <Button
                variant="outline-primary"
                style={bluePillButton}
                onClick={apply}
              >
                Send Application to rent
              </Button>
            </Col>
          </Row>
        </div>
      </div>
      <div hidden={responsive.showSidebar} className="w-100 mt-3">
        <TenantFooter />
      </div>
    </div>
  );
}
export default ReviewTenantProfile;
