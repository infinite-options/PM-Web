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
import { get } from "../utils/api";
import {
  headings,
  subHeading,
  subText,
  pillButton,
  blue,
} from "../utils/styles";

function DetailRepairStatus(props) {
  const navigate = useNavigate();
  const { maintenance_request_uid, property_uid } = useParams();
  const context = useContext(AppContext);
  const { userData, refresh } = context;
  const { access_token, user } = userData;
  const [profile, setProfile] = useState([]);
  const [repairsDetail, setRepairsDetail] = useState([]);
  const [repairsImages, setRepairsImages] = useState([]);
  const [busineesAssigned, setBusineesAssigned] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (repairsDetail !== undefined) {
      setIsLoading(false);
    }
  }, [repairsDetail]);
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await get("/tenantProperties", access_token);
      console.log(response);

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
      console.log(response.result[0]);
      setRepairsDetail(response.result);
      setRepairsImages(JSON.parse(response.result[0].images));
      const fetchBusinessAssigned = async () => {
        const res = await get(
          `/businesses?business_uid=${response.result[0].assigned_business}`
        );
        console.log(res.result[0]);

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

  console.log(repairsImages);

  return (
    <div className="h-100 d-flex flex-column" style={{ minHeight: "100%" }}>
      <Header
        title="Repairs"
        leftText="< Back"
        leftFn={() => navigate(`/${property_uid}/repairStatus`)}
      />
      {console.log(repairsDetail)}
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
                    {console.log(repair)}
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
                      <Carousel>
                        {repairsImages.map((img) => {
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
                            <Carousel.Caption>
                              <h3>New York</h3>
                              <p>We love the Big Apple!</p>
                            </Carousel.Caption>
                          </Carousel.Item>;
                        })}
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

                <Row className="mt-4">
                  <div style={headings}>{repair.title}</div>
                </Row>

                <Row>
                  <div style={subText}>
                    {profile.address},&nbsp;
                    {profile.city},&nbsp;
                    {profile.state}&nbsp;
                    {profile.zip}
                  </div>
                </Row>

                <Row className="mt-2">
                  <Col>
                    {repair.priority === "High" ? (
                      <img src={HighPriority} />
                    ) : repair.priority === "Medium" ? (
                      <img src={MediumPriority} />
                    ) : (
                      <img src={LowPriority} />
                    )}
                  </Col>
                </Row>
                <Row className="mt-2">
                  <div style={subText}>{repair.description}</div>
                </Row>
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
                  {repair.assigned_business === null ? (
                    <Row></Row>
                  ) : (
                    <Row>
                      <Col>
                        <div style={headings}>
                          {busineesAssigned.business_name}
                        </div>
                        <div style={subText}>
                          {busineesAssigned.business_name}
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
                  )}
                </div>
              </Container>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DetailRepairStatus;
