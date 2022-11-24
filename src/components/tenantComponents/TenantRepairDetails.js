import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import * as ReactBootStrap from "react-bootstrap";
import Carousel from "react-multi-carousel";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "../Checkbox";
import AppContext from "../../AppContext";
import Header from "../Header";
import RepairImages from "../RepairImages";
import SideBar from "./SideBar";
import TenantFooter from "./TenantFooter";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import RepairImg from "../../icons/RepairImg.svg";
import HighPriority from "../../icons/highPriority.svg";
import MediumPriority from "../../icons/mediumPriority.svg";
import LowPriority from "../../icons/lowPriority.svg";
import {
  headings,
  editButton,
  subHeading,
  subText,
  redPillButton,
  formLabel,
  bluePillButton,
  blue,
  mediumBold,
  orangePill,
} from "../../utils/styles";
import { get, put } from "../../utils/api";
import "react-multi-carousel/lib/styles.css";
const useStyles = makeStyles((theme) => ({
  priorityInactive: {
    opacity: "0.5",
  },
  priorityActive: {
    opacity: "1",
  },
}));
function TenantRepairDetails(props) {
  const classes = useStyles();
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
    },
  };
  const [width, setWindowWidth] = useState(0);
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
  const imageState = useState([]);
  const { userData, refresh } = useContext(AppContext);
  const { access_token } = userData;
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [canReschedule, setCanReschedule] = useState(false);
  const [requestQuote, setRequestQuote] = useState(false);
  const [scheduleMaintenance, setScheduleMaintenance] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [repairsDetail, setRepairsDetail] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const repair = location.state.repair;

  const fetchBusinesses = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const businesses_request = await get(
      "/businesses?business_type=MAINTENANCE"
    );
    const request_response = await get(
      `/maintenanceRequests?maintenance_request_uid=${repair.maintenance_request_uid}`
    );
    if (businesses_request.msg === "Token has expired") {
      refresh();
      return;
    }

    const businesses = businesses_request.result.map((business) => ({
      ...business,
      quote_requested: false,
    }));
    // console.log(repair)
    // console.log(businesses)
    setBusinesses(businesses);
    console.log(request_response.result[0]);
    setRepairsDetail(request_response.result[0]);
    setTitle(request_response.result[0].title);
    setDescription(request_response.result[0].description);
    setPriority(request_response.result[0].priority);
    setCanReschedule(request_response.result[0].can_reschedule === 1);
    const files = [];
    const images = JSON.parse(request_response.result[0].images);
    for (let i = 0; i < images.length; i++) {
      files.push({
        index: i,
        image: images[i],
        file: null,
        coverPhoto: i === 0,
      });
    }
    imageState[1](files);

    const response = await get(
      `/maintenanceQuotes?linked_request_uid=${repair.maintenance_request_uid}`
    );
    // console.log(response.result)
    setQuotes(response.result);
    setIsLoading(false);
  };

  useEffect(fetchBusinesses, [access_token]);
  const updateRepair = async () => {
    let newRepair = {
      maintenance_request_uid: repair.maintenance_request_uid,
      title: title,
      priority: priority,
      can_reschedule: true,
      assigned_business: repair.assigned_business,
      notes: repair.notes,
      request_status:
        repair.request_status === "INFO" ? "PROCESSING" : repair.request_status,
      description: description,
      scheduled_date: repair.scheduled_date,
      assigned_worker: repair.assigned_worker,
    };

    const files = imageState[0];
    let i = 0;
    for (const file of imageState[0]) {
      let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
      if (file.file !== null) {
        newRepair[key] = file.file;
      } else {
        newRepair[key] = file.image;
      }
    }
    setShowSpinner(true);
    console.log(newRepair);
    const res = await put("/maintenanceRequests", newRepair, null, files);
    setShowSpinner(false);
    fetchBusinesses();
    setIsEditing(false);
  };
  const toggleBusiness = (index) => {
    const newBusinesses = [...businesses];
    newBusinesses[index].quote_requested =
      !newBusinesses[index].quote_requested;
    setBusinesses(newBusinesses);
  };
  function editRepair() {
    setIsEditing(true);
  }
  const reload = () => {
    setIsEditing(false);
  };

  const acceptQuote = async (quote) => {
    const body = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      quote_status: "ACCEPTED",
    };
    const response = await put("/maintenanceQuotes", body);
    fetchBusinesses();
  };

  const rejectQuote = async (quote) => {
    const body = {
      maintenance_quote_uid: quote.maintenance_quote_uid,
      quote_status: "REJECTED",
    };
    const response = await put("/maintenanceQuotes", body);
    fetchBusinesses();
  };

  return (
    <div className="w-100 overflow-hidden">
      <div className="flex-1">
        <div
          hidden={!responsiveSidebar.showSidebar}
          style={{
            backgroundColor: "#229ebc",
            width: "11rem",
            minHeight: "100%",
          }}
        >
          <SideBar />
        </div>
        <div className="w-100 mb-5">
          <Header
            title="Repairs"
            leftText={"< Back"}
            leftFn={() => navigate(-1)}
            rightText="Edit"
            rightFn={() => editRepair()}
          />

          {repairsDetail === [] || isLoading === true ? (
            <Row className="mt-2 mb-2">
              <div style={blue}></div>
            </Row>
          ) : (
            <div
              className="mx-2 my-2 p-3"
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
              hidden={scheduleMaintenance || requestQuote}
            >
              {}
              {JSON.parse(repairsDetail.images).length === 0 ? (
                <Row className=" m-3">
                  <img
                    src={RepairImg}
                    style={{
                      objectFit: "contain",
                      width: "350px",
                      height: " 198px",
                    }}
                    alt="repair"
                  />
                </Row>
              ) : JSON.parse(repairsDetail.images).length > 1 ? (
                <Row className=" m-3">
                  <Carousel responsive={responsive}>
                    {JSON.parse(repairsDetail.images).map((images) => {
                      return (
                        <img
                          src={`${images}?${Date.now()}`}
                          style={{
                            width: "200px",
                            height: "200px",
                            objectFit: "cover",
                          }}
                          alt="repair"
                        />
                      );
                    })}
                  </Carousel>
                </Row>
              ) : (
                <Row className=" m-3">
                  <img
                    src={JSON.parse(repairsDetail.images)}
                    //className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      width: "350px",
                      height: " 198px",
                      border: "1px solid #C4C4C4",
                      borderRadius: "5px",
                    }}
                    alt="repair"
                  />
                </Row>
              )}
              {isEditing ? (
                <Row>
                  <RepairImages state={imageState} />
                </Row>
              ) : null}
              <Row
                className="my-4 p-2"
                style={
                  (headings,
                  {
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  })
                }
              >
                <Col>
                  {isEditing ? (
                    ((<RepairImages />),
                    (
                      <input
                        style={{ margin: "10px 0px" }}
                        defaultValue={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                        }}
                      ></input>
                    ))
                  ) : (
                    <div style={headings}>
                      <div style={subHeading}>Title</div>
                      {title}
                    </div>
                  )}
                </Col>
              </Row>

              <Row className="mt-2 mb-0">
                <div style={subText}>
                  {repair.address} {repair.unit}, {repair.city}, {repair.state}{" "}
                  {repair.zip}
                </div>
              </Row>

              {isEditing ? (
                <Row className="mt-2" style={{ padding: "7px 0px" }}>
                  <Col xs={4}>
                    <img
                      src={HighPriority}
                      onClick={() => setPriority("High")}
                      className={
                        priority === "High"
                          ? `${classes.priorityActive}`
                          : `${classes.priorityInactive}`
                      }
                    />
                  </Col>
                  <Col xs={4}>
                    <img
                      src={MediumPriority}
                      onClick={() => setPriority("Medium")}
                      className={
                        priority === "Medium"
                          ? `${classes.priorityActive}`
                          : `${classes.priorityInactive}`
                      }
                    />
                  </Col>
                  <Col xs={4}>
                    <img
                      src={LowPriority}
                      onClick={() => setPriority("Low")}
                      className={
                        priority === "Low"
                          ? `${classes.priorityActive}`
                          : `${classes.priorityInactive}`
                      }
                    />
                  </Col>
                </Row>
              ) : (
                <Row className="mt-2" style={{ padding: "7px 0px" }}>
                  <Col>
                    {priority === "High" ? (
                      <img src={HighPriority} />
                    ) : priority === "Medium" ? (
                      <img src={MediumPriority} />
                    ) : (
                      <img src={LowPriority} />
                    )}
                  </Col>
                </Row>
              )}

              <div className="mx-1 pt-2">
                <Row
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                  className="my-4 p-2"
                >
                  <div style={subHeading}>Description</div>
                  {isEditing ? (
                    <input
                      defaultValue={description}
                      style={{ width: "80vw" }}
                      onChange={(e) => {
                        console.log(e);
                        setDescription(e.target.value);
                      }}
                    ></input>
                  ) : (
                    <Row className="mt-2">
                      <div style={subText}>{description}</div>
                    </Row>
                  )}
                </Row>

                <Row
                  className="pt-1 mb-4"
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
                    opacity: 1,
                  }}
                >
                  <div style={subHeading} className="pt-1 mb-2">
                    Tenant can reschedule this job as needed
                  </div>
                  <Col className="pt-1 mx-2">
                    <Row>
                      <Checkbox type="CIRCLE" checked={canReschedule} /> Yes
                    </Row>
                  </Col>
                  <Col className="pt-1 mx-2">
                    <Row>
                      <Checkbox type="CIRCLE" checked={!canReschedule} /> No
                    </Row>
                  </Col>
                </Row>
                {showSpinner ? (
                  <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                    <ReactBootStrap.Spinner animation="border" role="status" />
                  </div>
                ) : (
                  ""
                )}
                {isEditing ? (
                  <button
                    style={{ ...editButton, margin: "5% 25%" }}
                    // onClick={() => setIsEditing(false)}
                    onClick={() => updateRepair()}
                  >
                    Done
                  </button>
                ) : null}
                <Row hidden={true} className="pt-1">
                  <Col className="d-flex flex-row justify-content-evenly">
                    <Button
                      style={bluePillButton}
                      onClick={() => setScheduleMaintenance(true)}
                    >
                      Schedule Maintenance
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          )}

          <div
            className="mx-2 my-2 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
            hidden={!requestQuote}
          >
            <Row className="mt-4">
              <Col>{repair.title}</Col>
              <Col xs={4}>
                {repair.priority === "High" ? (
                  <img src={HighPriority} />
                ) : repair.priority === "Medium" ? (
                  <img src={MediumPriority} />
                ) : (
                  <img src={LowPriority} />
                )}
              </Col>
            </Row>

            <Row style={subHeading}>
              <div>Select businesses to request a quote:</div>
            </Row>

            <div>
              {businesses.length > 0 &&
                businesses.map((business, i) => (
                  <Row
                    className="my-3 p-2"
                    key={i}
                    style={{
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                      boxShadow: business.quote_requested
                        ? "0px 3px 6px #00000029"
                        : "none",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <Col xs={2} className="mt-2">
                      <Row>
                        <Checkbox
                          type="BOX"
                          checked={businesses[i].quote_requested}
                          onClick={() => toggleBusiness(i)}
                        />
                      </Row>
                    </Col>
                    <Col>
                      <Row style={subHeading}>{business.business_name}</Row>
                      <Row style={subText}>
                        Services: Toilet repair, Plumbing, Kitchen repair
                      </Row>
                      <Row className="d-flex flex-row align-items-center justify-content-evenly">
                        <Col style={blue}> Manager: Jane Doe</Col>
                        <Col className="d-flex flex-row align-items-center justify-content-end">
                          <a href={`tel:${businesses.business_phone_number}`}>
                            <img
                              src={Phone}
                              className="mx-1"
                              style={{ width: "30px", height: "30px" }}
                            />
                          </a>
                          <a href={`mailto:${businesses.business_email}`}>
                            <img
                              src={Message}
                              style={{ width: "30px", height: "30px" }}
                            />
                          </a>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ))}
            </div>
          </div>

          <div hidden={!scheduleMaintenance}>
            <Row>
              <div style={headings}>Schedule Maintenace</div>
            </Row>
            <Form.Group className="mt-3 mb-2">
              <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                Date
              </Form.Label>
              <Form.Control style={{ borderRadius: 0 }} type="date" />
            </Form.Group>
            <Form.Group className="mt-3 mb-2">
              <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                Time
              </Form.Label>
              <Form.Control style={{ borderRadius: 0 }} type="time" />
            </Form.Group>
            <Row className="mt-4">
              <Col className="d-flex justify-content-evenly">
                <Button style={bluePillButton}>Schedule Maintenance</Button>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col className="d-flex justify-content-evenly">
                <Button
                  style={redPillButton}
                  onClick={() => setScheduleMaintenance(false)}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </div>

          {!scheduleMaintenance &&
            !requestQuote &&
            quotes &&
            quotes.length > 0 && (
              <div className="pb-4">
                <hr
                  style={{
                    border: "1px dashed #000000",
                    borderStyle: "none none dashed",
                    backgroundColor: "white",
                  }}
                />

                {quotes &&
                  quotes.length > 0 &&
                  quotes.map((quote, i) => (
                    <div key={i}>
                      <hr
                        style={{
                          border: "1px dashed #000000",
                          borderStyle: "none none dashed",
                          backgroundColor: "white",
                        }}
                      />
                      <Row className="mx-2 my-2" style={headings}>
                        <div>{quote.business_name}</div>
                      </Row>
                      <div className="mx-2 my-2 p-3">
                        <Row
                          hidden={
                            quote.quote_status !== "SENT" &&
                            quote.quote_status !== "REJECTED"
                          }
                        >
                          <div
                            className="my-2 p-3"
                            style={{
                              background: "#F3F3F3 0% 0% no-repeat padding-box",
                              borderRadius: "10px",
                              opacity: 1,
                            }}
                          >
                            <Row>
                              <div style={mediumBold}>Service Charges</div>
                            </Row>
                            <Row className="mx-2">
                              {quote.services_expenses &&
                                quote.services_expenses.length > 0 &&
                                JSON.parse(quote.services_expenses).map(
                                  (service, j) => (
                                    <div
                                      key={j}
                                      style={{
                                        background:
                                          "#FFFFFF 0% 0% no-repeat padding-box",
                                        boxShadow: "0px 3px 6px #00000029",
                                        borderRadius: "5px",
                                        opacity: 1,
                                      }}
                                    >
                                      <Row className="pt-1 mb-2">
                                        <div style={subHeading}>
                                          {service.service_name}
                                        </div>
                                        <div style={subText}>
                                          ${service.charge}{" "}
                                          {service.per === "Hour"
                                            ? `/${service.per}`
                                            : "One-Time Fee"}
                                        </div>
                                      </Row>
                                    </div>
                                  )
                                )}
                            </Row>
                          </div>
                          <div
                            className="my-2 p-3"
                            style={{
                              background: "#F3F3F3 0% 0% no-repeat padding-box",
                              borderRadius: "10px",
                              opacity: 1,
                            }}
                          >
                            <Row>
                              <div style={mediumBold}>Event Type</div>
                            </Row>
                            <Row className="mx-2">
                              <div
                                style={
                                  (subText,
                                  {
                                    background:
                                      "#FFFFFF 0% 0% no-repeat padding-box",
                                    boxShadow: "0px 3px 6px #00000029",
                                    borderRadius: "5px",
                                    opacity: 1,
                                  })
                                }
                              >
                                {quote.event_type}
                              </div>
                            </Row>
                          </div>
                          <div
                            className="my-2 p-3"
                            style={{
                              background: "#F3F3F3 0% 0% no-repeat padding-box",
                              borderRadius: "10px",
                              opacity: 1,
                            }}
                          >
                            <Row>
                              <div style={mediumBold}>Total Estimate</div>
                            </Row>
                            <Row className="mx-2">
                              {" "}
                              <div
                                style={
                                  (subText,
                                  {
                                    background:
                                      "#FFFFFF 0% 0% no-repeat padding-box",
                                    boxShadow: "0px 3px 6px #00000029",
                                    borderRadius: "5px",
                                    opacity: 1,
                                  })
                                }
                              >
                                $ {quote.total_estimate}
                              </div>
                            </Row>
                          </div>
                          <div
                            className="my-2 p-3"
                            style={{
                              background: "#F3F3F3 0% 0% no-repeat padding-box",
                              borderRadius: "10px",
                              opacity: 1,
                            }}
                          >
                            <Row>
                              <div style={mediumBold}>
                                Earliest Availability
                              </div>
                            </Row>
                            <Row className="mx-2">
                              {" "}
                              <div
                                style={
                                  (subText,
                                  {
                                    background:
                                      "#FFFFFF 0% 0% no-repeat padding-box",
                                    boxShadow: "0px 3px 6px #00000029",
                                    borderRadius: "5px",
                                    opacity: 1,
                                  })
                                }
                              >
                                {new Date(
                                  String(quote.earliest_availability).split(
                                    " "
                                  )[0]
                                ).toLocaleDateString()}
                              </div>
                            </Row>
                          </div>
                        </Row>
                      </div>

                      <Row
                        hidden={quote.quote_status !== "SENT"}
                        className="pt-1 mb-4"
                      >
                        <Col className="d-flex flex-row justify-content-evenly">
                          <Button
                            style={bluePillButton}
                            onClick={() => acceptQuote(quote)}
                          >
                            Accept Quote
                          </Button>
                        </Col>
                        <Col className="d-flex flex-row justify-content-evenly">
                          <Button
                            style={redPillButton}
                            onClick={() => rejectQuote(quote)}
                          >
                            Reject Quote
                          </Button>
                        </Col>
                      </Row>

                      <Row
                        hidden={quote.quote_status === "SENT"}
                        className="pt-1 mb-4"
                      >
                        <Col className="d-flex flex-row justify-content-evenly">
                          <Button style={orangePill}>
                            {quote.quote_status === "REQUESTED"
                              ? "Waiting for quote from business"
                              : quote.quote_status === "REJECTED"
                              ? "You've Rejected the Quote"
                              : quote.quote_status === "ACCEPTED"
                              ? "You've Accepted the Quote"
                              : quote.quote_status === "SENT"
                              ? "Waiting for quote from business"
                              : "Quote Withdrawn by Business"}
                          </Button>
                        </Col>
                      </Row>
                      <hr />
                    </div>
                  ))}
              </div>
            )}
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <TenantFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenantRepairDetails;
