import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import {
  Container,
  Row,
  Col,
  Button,
  Carousel,
  CarouselItem,
  Image,
  Form,
} from "react-bootstrap";
import moment from "moment";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppContext from "../AppContext";
import HighPriority from "../icons/highPriority.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import RepairImg from "../icons/RepairImg.svg";
import { get, put } from "../utils/api";
import RepairImages from "./RepairImages";
import {
  headings,
  subHeading,
  subText,
  pillButton,
  blue,
  editButton,
  squareForm,
} from "../utils/styles";
import { relativeTimeRounding } from "moment";

function DetailRepairStatus(props) {
  const imageState = useState([]);
  const navigate = useNavigate();
  const { maintenance_request_uid, property_uid } = useParams();
  const context = useContext(AppContext);
  const { userData, refresh } = context;
  const { access_token, user } = userData;
  const [profile, setProfile] = useState([]);
  const [repairsDetail, setRepairsDetail] = useState([]);
  const [busineesAssigned, setBusineesAssigned] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  //Editable information
  const [repairsImages, setRepairsImages] = useState([]);
  const [priority, setPriority] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (repairsDetail !== undefined) {
      setIsLoading(false);
    }
  }, [repairsDetail]);
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await get("/tenantProperties", access_token);
      console.log("Tenant Profile", response);
      if (response.msg === "Token has expired") {
        console.log("here msg");
        refresh();

        return;
      }
      setProfile(response.result[0]);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchRepairsDetail = async () => {
      const response = await get(
        `/maintenanceRequests?maintenance_request_uid=${maintenance_request_uid}`
      );
      if (response.msg === "Token has expired") {
        console.log("here msg");
        refresh();
        return;
      }
      setRepairsDetail(response.result);
      setRepairsImages(JSON.parse(response.result[0].images));

      setPriority(response.result[0].priority);
      setDescription(response.result[0].description);
      setTitle(response.result[0].title);
      const fetchBusinessAssigned = async () => {
        const res = await get(
          `/businesses?business_uid=${response.result[0].assigned_business}`
        );

        setBusineesAssigned(res.result[0]);
      };
      fetchBusinessAssigned();
    };
    fetchRepairsDetail();
  }, []);
  // useEffect(() => {
  //   const fetchBusinessAssigned = async () => {
  //     const response = await get(
  //       `/businesses?business_uid=${repairsDetail.assigned_business}`
  //     );
  //     console.log(response.result[0]);

  //     setBusineesAssigned(response.result);
  //   };
  //   fetchBusinessAssigned();
  // }, []);

  function editRepair() {
    console.log("Editing repair");
    setIsEditing(true);
  }
  const updateRepair = async () => {
    console.log("Putting changes to database");
    console.log("repairsDetails\n", repairsDetail);
    console.log("repairsImages\n", repairsImages);
    console.log(imageState);
    const files = JSON.parse(repairsDetail[0].images);
    console.log(files);
    const newRepair = {
      maintenance_request_uid: maintenance_request_uid,
      title: title,
      priority: priority,
      can_reschedule: true,
      assigned_business: repairsDetail[0].assigned_business,
      notes: repairsDetail[0].notes,
      request_status:
        repairsDetail[0].request_status === "INFO"
          ? "PROCESSING"
          : repairsDetail[0].request_status,
      description: description,
      scheduled_date: repairsDetail[0].scheduled_date,
      assigned_worker: repairsDetail[0].assigned_worker,
    };
    console.log(newRepair);
    // const files = imageState[0];
    let i = 0;
    for (const file of imageState[0]) {
      let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
      if (file.file !== null) {
        newRepair[key] = file.file;
      } else {
        newRepair[key] = file.image;
      }
    }
    const res = await put("/maintenanceRequests", newRepair, null, files);
    console.log(res);
    setIsEditing(false);
  };

  return (
    <div className="h-100 d-flex flex-column" style={{ minHeight: "100%" }}>
      <Header
        title="Repairs"
        leftText="< Back"
        leftFn={() => navigate(`/${property_uid}/repairStatus`)}
        rightText="Edit"
        rightFn={() => editRepair()}
      />
      {repairsDetail === [] || isLoading === true ? (
        <Row className="mt-2 mb-2">
          <div style={blue}></div>
        </Row>
      ) : (
        <div>
          {repairsDetail.map((repair) => {
            return (
              <Container className="pt-1 mb-4">
                <Row>
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {JSON.parse(repair.images).length === 0 ? (
                      <img
                        src={RepairImg}
                        //className="w-100 h-100"
                        style={{
                          objectFit: "contain",
                          width: "350px",
                          height: " 198px",
                          // border: "1px solid #C4C4C4",
                          // borderRadius: "5px",
                        }}
                        alt="repair"
                      />
                    ) : JSON.parse(repair.images).length > 1 ? (
                      // <div>

                      // {console.log(repairsImages.length)}
                      // {repairsImages.map((img) => {
                      //    return <img src = {img} style = {{width: "350px", height: "198px", borderRadius: "5px", objectFit: "cover"}}></img>

                      // })}
                      // </div>
                      <Carousel>
                        {repairsImages.map((img) => {
                          return (
                            <Carousel.Item>
                              <Image
                                src={img}
                                style={{
                                  objectFit: "cover",
                                  width: "350px",
                                  height: " 198px",
                                  border: "1px solid #C4C4C4",
                                  borderRadius: "5px",
                                }}
                                alt="repair"
                              />
                            </Carousel.Item>
                          );
                        })}
                        {imageState[0].length > 0
                          ? imageState[0].map((img) => {
                              return (
                                <Carousel.Item>
                                  <Image
                                    src={JSON.parse(img.image)}
                                    style={{
                                      objectFit: "cover",
                                      width: "350px",
                                      height: " 198px",
                                      border: "1px solid #C4C4C4",
                                      borderRadius: "5px",
                                    }}
                                    alt="repair"
                                  />
                                </Carousel.Item>
                              );
                            })
                          : null}
                      </Carousel>
                    ) : (
                      <img
                        src={JSON.parse(repair.images)}
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
                    )}
                  </Col>
                </Row>
                {isEditing ? (
                  <Row>
                    <RepairImages state={imageState} />
                  </Row>
                ) : null}

                <Row className="mt-4">
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
                      <div style={headings}>{title}</div>
                    )}
                  </Col>
                </Row>

                <Row>
                  <div style={subText}>
                    {profile.address},&nbsp;
                    {profile.city},&nbsp;
                    {profile.state}&nbsp;
                    {profile.zip}
                  </div>
                </Row>

                <Row className="mt-2" style={{ padding: "7px 0px" }}>
                  {isEditing ? (
                    <Form.Group>
                      <Form.Select
                        style={squareForm}
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                        {/* {properties.map((property, i) => (
                        <option key={i} value={JSON.stringify(property)}>
                          {property.property.address} {property.property.unit}
                          ,&nbsp;
                          {property.property.city}
                          ,&nbsp;
                          {property.property.state}&nbsp; {property.property.zip}
                        </option>
                      ))} */}
                      </Form.Select>
                    </Form.Group>
                  ) : (
                    <Col>
                      {priority === "High" ? (
                        <img src={HighPriority} />
                      ) : priority === "Medium" ? (
                        <img src={MediumPriority} />
                      ) : (
                        <img src={LowPriority} />
                      )}
                    </Col>
                  )}
                </Row>
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

                {repair.status === "NEW" ? (
                  <Row></Row>
                ) : repair.status === "SCHEDULED" ? (
                  <Row className="mt-4">
                    <div style={headings}>Scheduled for</div>
                    <div style={subHeading}>
                      {moment(repair.scheduled_date).format(
                        "ddd, MMM DD, YYYY "
                      )}{" "}
                      at {moment(repair.scheduled_date).format("hh:mm a")}{" "}
                      <hr />
                    </div>
                    <Row>
                      <Col>
                        <Button
                          variant="outline-primary"
                          style={pillButton}
                          onClick={() => navigate("/rescheduleRepair")}
                        >
                          Reschedule
                        </Button>
                      </Col>
                    </Row>
                  </Row>
                ) : (
                  <Row className="mt-4">
                    <div style={headings}>Completed on</div>
                    <div style={subHeading}>
                      {moment(repair.scheduled_date).format(
                        "ddd, MMM DD, YYYY "
                      )}{" "}
                      at {moment(repair.scheduled_date).format("hh:mm a")}{" "}
                      <hr />
                    </div>
                  </Row>
                )}

                <div className="mt-4">
                  <Row>
                    <Col>
                      <div style={headings}>
                        {profile.manager_business_name}
                      </div>
                      <div style={subText}>Property Manager</div>
                    </Col>
                    <Col xs={2} className="mt-1 mb-1">
                      <img
                        onClick={() =>
                          (window.location.href = `tel:${profile.manager_phone_number}`)
                        }
                        src={Phone}
                      />
                    </Col>
                    <Col xs={2} className="mt-1 mb-1">
                      <img
                        onClick={() =>
                          (window.location.href = `mailto:${profile.manager_email}`)
                        }
                        src={Message}
                      />
                    </Col>
                    <hr />
                  </Row>
                  {busineesAssigned ? (
                    <Row>
                      <Col>
                        <div style={headings}>
                          {busineesAssigned.business_name
                            ? busineesAssigned.business_name
                            : "hi"}
                        </div>
                        <div style={subText}>
                          {busineesAssigned.business_name
                            ? busineesAssigned.business_name
                            : "hi"}
                        </div>
                      </Col>
                      <Col xs={2} className="mt-1 mb-1">
                        <img
                          onClick={() =>
                            (window.location.href = `tel:${busineesAssigned.business_phone_number}`)
                          }
                          src={Phone}
                        />
                      </Col>
                      <Col xs={2} className="mt-1 mb-1">
                        <img
                          onClick={() =>
                            (window.location.href = `mailto:${busineesAssigned.business_email}`)
                          }
                          src={Message}
                        />
                      </Col>
                      <hr />
                    </Row>
                  ) : (
                    <Row></Row>
                  )}
                </div>
              </Container>
            );
          })}
        </div>
      )}
      {isEditing ? (
        <button style={editButton} onClick={() => updateRepair()}>
          Done
        </button>
      ) : null}
    </div>
  );
}

export default DetailRepairStatus;
