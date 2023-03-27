import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactBootStrap from "react-bootstrap";
import moment from "moment";
import Carousel from "react-multi-carousel";
import Header from "../Header";
import SideBar from "./SideBar";
import MaintenanceFooter from "./MaintenanceFooter";
import DetailQuoteRequest from "./DetailQuoteRequest";
import MaintenanceQuoteScheduledDetail from "./MaintenanceQuoteScheduledDetail";
import ImageModal from "../ImageModal";
import AppContext from "../../AppContext";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
import HighPriority from "../../icons/highPriority.svg";
import MediumPriority from "../../icons/mediumPriority.svg";
import LowPriority from "../../icons/lowPriority.svg";
import RepairImg from "../../icons/RepairImg.svg";
import AddIcon from "../../icons/AddIcon.svg";
import EditIconNew from "../../icons/EditIconNew.svg";
import { get } from "../../utils/api";
import {
  subHeading,
  smallImg,
  bluePillButton,
  headings,
} from "../../utils/styles";
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
export default function MaintenanceRequestView() {
  const { userData } = useContext(AppContext);
  const { user } = userData;
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const quote_id = location.state.quote_id;
  const [isLoading, setIsLoading] = useState(true);
  const [quote, setQuote] = useState([]);
  const [editQuote, setEditQuote] = useState(false);
  const [addQuote, setAddQuote] = useState(false);

  const [quoteSent, setQuoteSent] = useState(false);
  const [quoteRefused, setQuoteRefused] = useState(false);
  const [quoteRejected, setQuoteRejected] = useState(false);
  const [quoteWithdrawn, setQuoteWithdrawn] = useState(false);
  const [quoteAccepted, setQuoteAccepted] = useState(false);
  const [quoteSchedule, setQuoteSchedule] = useState(false);
  const [quoteReschedule, setQuoteReschedule] = useState(false);
  const [quoteScheduled, setQuoteScheduled] = useState(false);
  const [quoteFinished, setQuoteFinished] = useState(false);
  const [quoteCompleted, setQuoteCompleted] = useState(false);
  const [quotePaid, setQuotePaid] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
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

  const showImage = (src) => {
    setOpenImage(true);
    setImageSrc(src);
  };
  const unShowImage = () => {
    setOpenImage(false);
    setImageSrc(null);
  };

  const fetchQuoteDetails = async () => {
    // console.log("in fetchquotedetails");
    let business_uid = "";
    for (const business of userData.user.businesses) {
      if (business.business_type === "MAINTENANCE") {
        business_uid = business.business_uid;

        break;
      }
    }
    if (business_uid === "") {
    }

    const quotes_response = await get(
      `/maintenanceQuotes?maintenance_quote_uid=${quote_id}`
    );
    let quote_r = quotes_response.result[0];
    setQuote(quotes_response.result[0]);
    // console.log(quote_r.quote_status);
    if (quote_r.quote_status === "SENT") {
      setQuoteSent(true);
    }
    if (
      quote_r.quote_status === "ACCEPTED" &&
      quote_r.request_status === "PROCESSING"
    ) {
      setQuoteAccepted(true);
    }
    if (quote_r.quote_status === "REFUSED") {
      setQuoteRefused(true);
    }
    if (quote_r.quote_status === "REJECTED") {
      setQuoteRejected(true);
    }
    if (quote_r.quote_status === "WITHDRAWN") {
      setQuoteWithdrawn(true);
    }
    if (quote_r.request_status === "SCHEDULE") {
      setQuoteSchedule(true);
    }
    if (quote_r.request_status === "RESCHEDULE") {
      setQuoteReschedule(true);
    }
    if (quote_r.request_status === "SCHEDULED") {
      setQuoteScheduled(true);
    }
    if (quote_r.request_status === "FINISHED") {
      setQuoteFinished(true);
    }

    if (
      quote_r.request_status === "COMPLETED" &&
      quote_r.quote_status === "AGREED"
    ) {
      setQuoteCompleted(true);
    }
    if (quote_r.quote_status === "PAID") {
      setQuotePaid(true);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchQuoteDetails();
  }, [addQuote, editQuote, quoteSent, quoteRejected, quoteRefused]);
  const headerBack = () => {
    navigate(-1);
  };
  // console.log(quoteSent, quoteRejected, quote.quote_status);
  return (
    <div className="w-100 overflow-hidden">
      {!isLoading && quote !== null ? (
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
          <div className="w-100 mb-5 overflow-scroll">
            <Header
              title="Maintenance Request Details"
              leftText={location.state === null ? "" : "< Back"}
              leftFn={headerBack}
            />
            <ImageModal
              src={imageSrc}
              isOpen={openImage}
              onCancel={unShowImage}
            />
            <Row className=" d-flex align-items-center justify-content-center m-3">
              {JSON.parse(quote.images).length === 0 ? (
                <img
                  src={RepairImg}
                  alt="Property"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              ) : JSON.parse(quote.images).length > 4 ? (
                <Carousel
                  responsive={responsive}
                  infinite={true}
                  arrows={true}
                  partialVisible={false}
                  // className=" d-flex align-items-center justify-content-center"
                >
                  {JSON.parse(quote.images).map((image) => {
                    return (
                      // <div className="d-flex align-items-center justify-content-center">
                      <img
                        // key={Date.now()}
                        src={`${image}?${Date.now()}`}
                        // src={image}
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "cover",
                        }}
                        onClick={() => showImage(`${image}?${Date.now()}`)}
                      />
                      // </div>
                    );
                  })}
                </Carousel>
              ) : JSON.parse(quote.images).length < 4 ? (
                <Carousel
                  responsive={responsive}
                  infinite={true}
                  arrows={true}
                  partialVisible={false}
                  className=" d-flex align-items-center justify-content-center"
                >
                  {JSON.parse(quote.images).map((image) => {
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
                          onClick={() => showImage(`${image}?${Date.now()}`)}
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
              <Row className="m-3">
                <Col>
                  <h3>Request Summary</h3>
                </Col>
              </Row>
              <Row className="m-3" style={{ overflow: "scroll" }}>
                <Table
                  classes={{ root: classes.customTable }}
                  size="small"
                  responsive="md"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell padding="none" size="small" align="center">
                        Issue
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        Description
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        Address
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        Priority
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        Type
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        Date Reported
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {" "}
                    <TableCell padding="none" size="small" align="center">
                      {quote.title}
                    </TableCell>
                    <TableCell padding="none" size="small" align="center">
                      {quote.description}
                    </TableCell>
                    <TableCell padding="none" size="small" align="center">
                      {" "}
                      {quote.address}
                      {quote.unit !== "" ? " " + quote.unit : ""}, {quote.city},{" "}
                      {quote.state} {quote.zip}
                    </TableCell>
                    <TableCell padding="none" size="small" align="center">
                      {quote.priority === "High" ? (
                        <img alt="low priority" src={HighPriority} />
                      ) : quote.priority === "Medium" ? (
                        <img alt="medium priority" src={MediumPriority} />
                      ) : (
                        <img alt="high priority" src={LowPriority} />
                      )}
                    </TableCell>
                    <TableCell padding="none" size="small" align="center">
                      {quote.request_type}
                    </TableCell>
                    <TableCell padding="none" size="small" align="center">
                      {quote.request_created_date.split(" ")[0]}
                    </TableCell>
                  </TableBody>
                </Table>
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
                  <h3>Quote Summary</h3>
                </Col>
                <Col xs={2}>
                  {" "}
                  {quote.quote_status === "REQUESTED" ? (
                    <img
                      src={AddIcon}
                      alt="Add Icon"
                      onClick={() => setAddQuote(true)}
                      style={{
                        width: "30px",
                        height: "30px",
                        float: "right",
                        marginRight: "5rem",
                      }}
                    />
                  ) : quote.quote_status === "SENT" ||
                    quote.quote_status === "REJECTED" ? (
                    <img
                      src={EditIconNew}
                      alt="Edit Icon"
                      onClick={() => setEditQuote(true)}
                      style={{
                        width: "30px",
                        height: "30px",
                        float: "right",
                        marginRight: "5rem",
                      }}
                    />
                  ) : (
                    ""
                  )}
                </Col>
              </Row>

              <DetailQuoteRequest
                quote={quote}
                addQuote={addQuote}
                editQuote={editQuote}
                setAddQuote={setAddQuote}
                setEditQuote={setEditQuote}
                setQuoteSent={setQuoteSent}
                setQuoteRefused={setQuoteRefused}
                setQuoteRejected={setQuoteRejected}
              />
            </div>
            {quote.quote_status !== "REQUESTED" ? (
              <div
                className="mx-3 my-3 p-2"
                style={{
                  background: "#E9E9E9 0% 0% no-repeat padding-box",
                  borderRadius: "10px",
                  opacity: 1,
                }}
              >
                <Container hidden={!quoteAccepted}>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <Col style={headings}>Quote Accepted!</Col>
                  </Row>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                    className="mt-3"
                  >
                    <Col style={subHeading}>
                      Your quote has been accepted by{" "}
                      {quote.property_manager.length === 0
                        ? quote.owner[0].owner_first_name +
                          " " +
                          quote.owner[0].owner_last_name
                        : quote.property_manager[0].manager_business_name}{" "}
                      Please Schedule Maintenance
                    </Col>
                  </Row>

                  <Row className="mt-3 mx-2">
                    <Col
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Button
                        variant="outline-primary"
                        style={bluePillButton}
                        onClick={() =>
                          navigate(
                            `/maintenanceScheduleRepair/${quote.maintenance_quote_uid}`,
                            {
                              state: { quote: quote },
                            }
                          )
                        }
                      >
                        Schedule Repair
                      </Button>
                    </Col>
                  </Row>
                </Container>
                <Container hidden={!quoteSent}>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <Col style={headings}>Quote Sent!</Col>
                  </Row>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                    className="mt-3"
                  >
                    <Col style={subHeading}>
                      Your quote was sent to{" "}
                      {quote.property_manager.length === 0
                        ? quote.owner[0].owner_first_name +
                          " " +
                          quote.owner[0].owner_last_name
                        : quote.property_manager[0].manager_business_name}{" "}
                      for review. We will let you know once they respond.
                    </Col>
                  </Row>
                </Container>

                <Container hidden={!quoteSchedule}>
                  <MaintenanceQuoteScheduledDetail quote={quote} />
                </Container>
                <Container hidden={!quoteReschedule}>
                  <MaintenanceQuoteScheduledDetail quote={quote} />
                </Container>
                <Container hidden={!quoteScheduled}>
                  <MaintenanceQuoteScheduledDetail quote={quote} />
                </Container>
                <Container hidden={!quoteFinished}>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <Col style={headings}>You finished the maintenance</Col>
                  </Row>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                    className="mt-3"
                  >
                    <Col style={subHeading}>
                      {quote.property_manager.length === 0
                        ? quote.owner[0].owner_first_name +
                          " " +
                          quote.owner[0].owner_last_name
                        : quote.property_manager[0].manager_business_name}{" "}
                      was notified and will confirm the completion and pay
                    </Col>
                  </Row>
                  {JSON.parse(quote.maintenance_images) !== null ? (
                    <Row className=" d-flex align-items-center justify-content-center m-3">
                      {JSON.parse(quote.maintenance_images).length === 0 ? (
                        <img
                          src={RepairImg}
                          alt="Property"
                          style={{
                            width: "200px",
                            height: "200px",
                            objectFit: "cover",
                          }}
                        />
                      ) : JSON.parse(quote.maintenance_images).length > 4 ? (
                        <Carousel
                          responsive={responsive}
                          infinite={true}
                          arrows={true}
                          partialVisible={false}
                          // className=" d-flex align-items-center justify-content-center"
                        >
                          {JSON.parse(quote.maintenance_images).map((image) => {
                            return (
                              // <div className="d-flex align-items-center justify-content-center">
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
                              // </div>
                            );
                          })}
                        </Carousel>
                      ) : JSON.parse(quote.maintenance_images).length < 4 ? (
                        <Carousel
                          responsive={responsive}
                          infinite={true}
                          arrows={true}
                          partialVisible={false}
                          className=" d-flex align-items-center justify-content-center"
                        >
                          {JSON.parse(quote.maintenance_images).map((image) => {
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
                  ) : (
                    ""
                  )}

                  <Row
                    style={{
                      textAlign: "center",
                    }}
                    className="mt-3"
                  >
                    <Col style={subHeading}>Notes: {quote.notes}</Col>
                  </Row>
                </Container>
                <Container hidden={!quoteCompleted}>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <Col style={headings}>Maintenace Completed </Col>
                  </Row>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                    className="mt-3"
                  >
                    <Col style={subHeading}>
                      {quote.property_manager.length === 0
                        ? quote.owner[0].owner_first_name +
                          " " +
                          quote.owner[0].owner_last_name
                        : quote.property_manager[0].manager_business_name}{" "}
                      has verified the maintenance and will pay soon.
                    </Col>
                  </Row>
                  {JSON.parse(quote.maintenance_images) !== null ? (
                    <Row className=" d-flex align-items-center justify-content-center m-3">
                      {JSON.parse(quote.maintenance_images).length === 0 ? (
                        <img
                          src={RepairImg}
                          alt="Property"
                          style={{
                            width: "200px",
                            height: "200px",
                            objectFit: "cover",
                          }}
                        />
                      ) : JSON.parse(quote.maintenance_images).length > 4 ? (
                        <Carousel
                          responsive={responsive}
                          infinite={true}
                          arrows={true}
                          partialVisible={false}
                          // className=" d-flex align-items-center justify-content-center"
                        >
                          {JSON.parse(quote.maintenance_images).map((image) => {
                            return (
                              // <div className="d-flex align-items-center justify-content-center">
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
                              // </div>
                            );
                          })}
                        </Carousel>
                      ) : JSON.parse(quote.maintenance_images).length < 4 ? (
                        <Carousel
                          responsive={responsive}
                          infinite={true}
                          arrows={true}
                          partialVisible={false}
                          className=" d-flex align-items-center justify-content-center"
                        >
                          {JSON.parse(quote.maintenance_images).map((image) => {
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
                  ) : (
                    ""
                  )}
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                    className="mt-3"
                  >
                    <Col style={subHeading}>Notes: {quote.notes}</Col>
                  </Row>
                </Container>
                <Container hidden={!quotePaid}>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <Col style={headings}>Payment Completed </Col>
                  </Row>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                    className="mt-3"
                  >
                    <Col style={subHeading}>
                      {quote.property_manager.length === 0
                        ? quote.owner[0].owner_first_name +
                          " " +
                          quote.owner[0].owner_last_name
                        : quote.property_manager[0].manager_business_name}{" "}
                      has verified the maintenance and made the payment. Make
                      sure to check your payments
                    </Col>
                  </Row>
                </Container>
                <Container hidden={!quoteRefused}>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <Col style={headings}>Request refused!</Col>
                  </Row>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                    className="mt-3"
                  >
                    <Col style={subHeading}>
                      You rejected the request for a quote. We will let{" "}
                      {quote.property_manager.length === 0
                        ? quote.owner[0].owner_first_name +
                          " " +
                          quote.owner[0].owner_last_name
                        : quote.property_manager[0].manager_business_name}{" "}
                      know that you do not wish to do the job.
                    </Col>
                  </Row>
                </Container>
                <Container hidden={!quoteRejected}>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <Col style={headings}>Quote rejected!</Col>
                  </Row>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                    className="mt-3"
                  >
                    <Col style={subHeading}>
                      {quote.property_manager.length === 0
                        ? quote.owner[0].owner_first_name +
                          " " +
                          quote.owner[0].owner_last_name
                        : quote.property_manager[0].manager_business_name}{" "}
                      rejected your quote.
                    </Col>
                  </Row>
                  <Row>
                    <Col style={subHeading}>
                      Notes from manager: {quote.notes}
                    </Col>
                  </Row>
                </Container>
                <Container hidden={!quoteWithdrawn}>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <Col style={headings}>Quote Withdrawn!</Col>
                  </Row>
                  <Row
                    style={{
                      textAlign: "center",
                    }}
                    className="mt-3"
                  >
                    <Col style={subHeading}>
                      {quote.property_manager.length === 0
                        ? quote.owner[0].owner_first_name +
                          " " +
                          quote.owner[0].owner_last_name
                        : quote.property_manager[0].manager_business_name}{" "}
                      has withdrawn the quote request.
                    </Col>
                  </Row>
                  <Row>
                    <Col style={subHeading}>
                      Notes from manager:{" "}
                      {quote.notes === null
                        ? "Went with another quote"
                        : quote.notes}
                    </Col>
                  </Row>
                </Container>
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
              <Row className="mt-3 mx-2">
                <Table classes={{ root: classes.customTable }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Contact Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone Number</TableCell>

                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quote.property_manager.length === 0
                      ? quote.owner.map((contact, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              {contact.owner_first_name}{" "}
                              {contact.owner_last_name}
                            </TableCell>

                            <TableCell>{contact.owner_email}</TableCell>
                            <TableCell>{contact.owner_phone_number}</TableCell>

                            <TableCell>
                              <a href={`tel:${contact.owner_phone_number}`}>
                                <img src={Phone} alt="Phone" style={smallImg} />
                              </a>
                              <a href={`mailto:${contact.owner_email}`}>
                                <img
                                  src={Message}
                                  alt="Message"
                                  style={smallImg}
                                />
                              </a>
                            </TableCell>
                          </TableRow>
                        ))
                      : quote.property_manager.map((contact, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              {contact.manager_business_name}
                            </TableCell>

                            <TableCell>{contact.manager_email}</TableCell>
                            <TableCell>
                              {contact.manager_phone_number}
                            </TableCell>

                            <TableCell>
                              <a href={`tel:${contact.manager_phone_number}`}>
                                <img src={Phone} alt="Phone" style={smallImg} />
                              </a>
                              <a href={`mailto:${contact.manager_email}`}>
                                <img
                                  src={Message}
                                  alt="Message"
                                  style={smallImg}
                                />
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </Row>
            </div>

            <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
              <MaintenanceFooter />
            </div>
          </div>
        </div>
      ) : (
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
          <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            <ReactBootStrap.Spinner animation="border" role="status" />
          </div>
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <MaintenanceFooter />
          </div>
        </div>
      )}
    </div>
  );
}
