import React, { useState, useContext, useEffect } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableSortLabel,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import { useNavigate } from "react-router-dom";
import * as ReactBootStrap from "react-bootstrap";
import Checkbox from "../Checkbox";
import MailDialogManager from "../MailDialog";
import MessageDialogManager from "../MessageDialog";
import Header from "../Header";
import AppContext from "../../AppContext";
import SideBar from "./SideBar";
import TenantFooter from "./TenantFooter";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";

import Mail from "../../icons/Mail.svg";
import { post, get } from "../../utils/api";
import {
  headings,
  subHeading,
  subText,
  mediumBold,
  smallImg,
  sidebarStyle,
} from "../../utils/styles";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});
function TenantAnnouncements(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [announcementDetail, setAnnouncementDetail] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [showMessageFormManager, setShowMessageFormManager] = useState(false);
  const [showMailFormManager, setShowMailFormManager] = useState(false);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [width, setWindowWidth] = useState(1024);
  const onCancelManagerMail = () => {
    setShowMailFormManager(false);
  };
  const onCancelManagerMessage = () => {
    setShowMessageFormManager(false);
  };
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

  const fetchProperties = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    setIsLoading(false);

    const responseAnnouncement = await get(
      `/announcement?receiver=${user.tenant_id[0].tenant_id}`
    );

    let response_announcement = responseAnnouncement.result;
    response_announcement = response_announcement
      .sort((a, b) => {
        return (
          new Date(a.date_announcement).getTime() -
          new Date(b.date_announcement).getTime()
        );
      })
      .reverse();

    setAnnouncements(responseAnnouncement.result);
  };
  useEffect(() => {
    fetchProperties();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    {
      id: "announcement_title",
      numeric: false,
      label: "Title",
    },
    {
      id: "announcement_msg",
      numeric: false,
      label: "Announcement Message",
    },
    {
      id: "announcement_mode",
      numeric: false,
      label: "Announcement Mode",
    },

    {
      id: "announcement_date",
      numeric: false,
      label: "Announcement Date",
    },
  ];
  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              size="small"
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
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

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    // rowCount: PropTypes.number.isRequired,
  };
  return (
    <div className="w-100 overflow-hidden">
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
      <Row className="w-100 mb-5 overflow-hidden">
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5 overflow-scroll">
          <Header
            title="Announcements"
            leftText={announcementDetail ? "< Back" : ""}
            leftFn={() => {
              setAnnouncementDetail(false);
            }}
          />
          <Row className="m-3">
            <Col>
              {" "}
              <h3>Announcements </h3>
            </Col>

            <Col></Col>
          </Row>

          <div
            className="mx-3 my-3 p-2"
            style={{
              background: "#E9E9E9 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            {announcements.length > 0 && !announcementDetail ? (
              <div className="mx-2 my-2 p-3">
                <Row className="m-3" style={{ overflow: "scroll" }}>
                  <Table
                    responsive="md"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
                    <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      // rowCount="4"
                    />{" "}
                    <TableBody>
                      {stableSort(
                        announcements,
                        getComparator(order, orderBy)
                      ).map((announce, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={announce.announce}
                            onClick={() => {
                              setAnnouncementDetail(true);
                              setSelectedAnnouncement(announce);
                            }}
                          >
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {announce.announcement_title}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {announce.announcement_msg}
                            </TableCell>
                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {announce.announcement_mode}
                            </TableCell>

                            <TableCell
                              padding="none"
                              size="small"
                              align="center"
                            >
                              {" "}
                              {new Date(
                                announce.date_announcement
                              ).toLocaleString("default", {
                                month: "long",
                              })}{" "}
                              {new Date(announce.date_announcement).getDate()},{" "}
                              {new Date(
                                announce.date_announcement
                              ).getFullYear()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Row>
              </div>
            ) : (
              <Row className="m-3">
                {" "}
                <div className="m-3">No announcements</div>
              </Row>
            )}
            {announcementDetail ? (
              <Row className="m-3 p-2">
                <Row
                  style={
                    (headings,
                    {
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                      borderRadius: "5px",
                    })
                  }
                  className="mt-3 mb-4 p-2"
                >
                  <div className="mt-1 mx-2" style={headings}>
                    Announcement Title
                  </div>
                  <div className="mt-1 mx-2" style={subHeading}>
                    {" "}
                    {selectedAnnouncement.announcement_title}
                  </div>
                </Row>
                <Row
                  style={
                    (headings,
                    {
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                      borderRadius: "5px",
                    })
                  }
                  className="mt-3 mb-4 p-2"
                >
                  <div className="mt-1 mx-2" style={headings}>
                    Announcement Message
                  </div>
                  <div className="mt-1 mx-2" style={subHeading}>
                    {" "}
                    {selectedAnnouncement.announcement_msg}
                  </div>
                </Row>
                {selectedAnnouncement.announcement_mode === "Tenants" ? (
                  <Row
                    style={{
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                      borderRadius: "5px",
                    }}
                    className="mt-3 mb-4 p-2"
                  >
                    <Row className="mt-1 mx-2" style={headings}>
                      Sent to tenants
                    </Row>
                    {selectedAnnouncement.receiver_details.map((receiver) => {
                      return (
                        <Row className="mt-1 mx-2">
                          <Col>
                            <div style={subHeading}>
                              {receiver.first_name} {receiver.last_name}
                            </div>
                            <div style={subText}>
                              {receiver.address} {receiver.unit}
                              ,&nbsp;{receiver.city},&nbsp;{receiver.state}
                              &nbsp; {receiver.zip}
                            </div>
                          </Col>
                          <Col xs={2} className="mt-1 mb-1">
                            <a href={`tel:${receiver.phone_number}`}>
                              <img src={Phone} alt="Phone" />
                            </a>
                          </Col>
                          <Col xs={2} className="mt-1 mb-1">
                            <a
                              onClick={() => {
                                setShowMessageFormManager(true);
                                setSelectedManager(receiver);
                              }}
                            >
                              <img
                                src={Message}
                                alt="Message"
                                style={smallImg}
                              />
                            </a>
                          </Col>
                          <Col>
                            {" "}
                            <a
                              // href={`mailto:${tf.tenantEmail}`}
                              onClick={() => {
                                setShowMailFormManager(true);
                                setSelectedManager(receiver);
                              }}
                            >
                              <img src={Mail} alt="Mail" style={smallImg} />
                            </a>
                          </Col>

                          <hr />
                        </Row>
                      );
                    })}{" "}
                  </Row>
                ) : (
                  <Row
                    style={{
                      background: "#F3F3F3 0% 0% no-repeat padding-box",
                      borderRadius: "5px",
                    }}
                    className="mt-3 mb-4 p-2"
                  >
                    <Row className="mt-1 mx-2" style={headings}>
                      Sent to properties
                    </Row>
                    {selectedAnnouncement.receiver_details.map((receiver) => {
                      return (
                        <Row className="mt-1 mx-2">
                          <Col>
                            <div style={subHeading}>
                              {receiver.address} {receiver.unit}
                              ,&nbsp;{receiver.city},&nbsp;{receiver.state}
                              &nbsp; {receiver.zip}
                            </div>
                            <div style={subText}>
                              {receiver.tenant_first_name}{" "}
                              {receiver.tenant_last_name}
                            </div>
                          </Col>
                          <Col xs={2} className="mt-1 mb-1">
                            <a href={`tel:${receiver.teanant_phone_number}`}>
                              <img src={Phone} alt="Phone" />
                            </a>
                          </Col>
                          <Col xs={2} className="mt-1 mb-1">
                            <a
                              onClick={() => {
                                setShowMessageFormManager(true);
                                setSelectedManager(receiver);
                              }}
                            >
                              <img
                                src={Message}
                                alt="Message"
                                style={smallImg}
                              />
                            </a>
                          </Col>
                          <Col>
                            {" "}
                            <a
                              // href={`mailto:${tf.tenantEmail}`}
                              onClick={() => {
                                setShowMailFormManager(true);
                                setSelectedManager(receiver);
                              }}
                            >
                              <img src={Mail} alt="Mail" style={smallImg} />
                            </a>
                          </Col>
                          <hr />
                        </Row>
                      );
                    })}{" "}
                  </Row>
                )}
                <Row
                  style={{
                    background: "#F3F3F3 0% 0% no-repeat padding-box",
                    borderRadius: "5px",
                  }}
                  className="mt-3 mb-4 p-2"
                >
                  <Row className="mt-1 mx-2" style={headings}>
                    Sent Out On:
                  </Row>
                  <Row className="mt-1 mx-2" style={subHeading}>
                    {new Date(
                      selectedAnnouncement.date_announcement
                    ).toLocaleString("default", { month: "long" })}{" "}
                    {new Date(selectedAnnouncement.date_announcement).getDate()}
                    ,{" "}
                    {new Date(
                      selectedAnnouncement.date_announcement
                    ).getFullYear()}
                  </Row>
                </Row>
              </Row>
            ) : (
              ""
            )}
          </div>
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <TenantFooter />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default TenantAnnouncements;
