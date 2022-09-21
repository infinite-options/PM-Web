import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  blue,
  gray,
  greenPill,
  orangePill,
  redPill,
  tileImg,
  xSmall,
} from "../utils/styles";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { get } from "../utils/api";
import AppContext from "../AppContext";
import No_Image from "../icons/No_Image_Available.jpeg";
import ManagerRepairDetail from "./ManagerRepairDetail";
import SideBar from "../components/managerComponents/SideBar";
function ManagerRepairsOverview(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, refresh } = React.useContext(AppContext);
  const { access_token, user } = userData;
  const [repair, setRepair] = useState([]);
  const [repairs, setRepairs] = React.useState([]);
  const [stage, setStage] = React.useState("LIST");
  const [newRepairs, setNewRepairs] = React.useState([]);
  const [infoRepairs, setInfoRepairs] = React.useState([]);
  const [processingRepairs, setProcessingRepairs] = React.useState([]);
  const [scheduledRepairs, setScheduledRepairs] = React.useState([]);
  const [completedRepairs, setCompletedRepairs] = React.useState([]);
  const [repairIter, setRepairIter] = React.useState([]);

  const { properties, setFooterTab } = props;

  const sort_repairs = (repairs) => {
    const repairs_with_quotes = repairs.filter(
      (repair) => repair.quotes_to_review > 0
    );
    repairs_with_quotes.sort(
      (a, b) => b.priority_n - a.priority_n || b.days_since - a.days_since
    );
    const repairs_without_quotes = repairs.filter(
      (repair) => repair.quotes_to_review === 0
    );
    repairs_without_quotes.sort(
      (a, b) => b.priority_n - a.priority_n || b.days_since - a.days_since
    );
    return [...repairs_with_quotes, ...repairs_without_quotes];
  };

  const fetchRepairs = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const management_businesses = user.businesses.filter(
      (business) => business.business_type === "MANAGEMENT"
    );
    let management_buid = null;
    if (management_businesses.length < 1) {
      console.log("No associated PM Businesses");
      return;
    } else if (management_businesses.length > 1) {
      console.log("Multiple associated PM Businesses");
      management_buid = management_businesses[0].business_uid;
    } else {
      management_buid = management_businesses[0].business_uid;
    }

    const response = await get(
      `/maintenanceRequestsandQuotes?manager_id=${management_buid}`
    );
    if (response.msg === "Token has expired") {
      refresh();
      return;
    }
    let repairs = response.result;
    console.log(repairs);
    repairs.forEach((repair, i) => {
      const request_created_date = new Date(
        Date.parse(repair.request_created_date)
      );
      const current_date = new Date();
      repairs[i].days_since = Math.ceil(
        (current_date.getTime() - request_created_date.getTime()) /
          (1000 * 3600 * 24)
      );
      repairs[i].quotes_to_review = repair.quotes.filter(
        (quote) => quote.quote_status === "SENT"
      ).length;

      repair.priority_n = 0;
      if (repair.priority.toLowerCase() === "high") {
        repair.priority_n = 3;
      } else if (repair.priority.toLowerCase() === "medium") {
        repair.priority_n = 2;
      } else if (repair.priority.toLowerCase() === "low") {
        repair.priority_n = 1;
      }
    });

    let repairs_sorted = sort_repairs(repairs);
    console.log(repairs_sorted);
    setRepairs(repairs_sorted);

    const new_repairs = repairs_sorted.filter(
      (item) => item.request_status === "NEW"
    );
    const info_repairs = repairs.filter(
      (item) => item.request_status === "INFO"
    );
    const processing_repairs = repairs_sorted.filter(
      (item) => item.request_status === "PROCESSING"
    );
    const scheduled_repairs = repairs_sorted.filter(
      (item) => item.request_status === "SCHEDULED"
    );
    const completed_repairs = repairs_sorted.filter(
      (item) => item.request_status === "COMPLETE"
    );
    setNewRepairs(new_repairs);
    setInfoRepairs(info_repairs);
    setProcessingRepairs(processing_repairs);
    setScheduledRepairs(scheduled_repairs);
    setCompletedRepairs(completed_repairs);
    setRepairIter([
      { title: "New", repairs_list: new_repairs },
      { title: "Info Requested", repairs_list: info_repairs },
      { title: "Processing", repairs_list: processing_repairs },
      { title: "Upcoming, Scheduled", repairs_list: scheduled_repairs },
      { title: "Completed", repairs_list: completed_repairs },
    ]);
  };

  React.useEffect(fetchRepairs, [access_token]);

  const selectRepair = (repair) => {
    setRepair(repair);
    setStage("REPAIRDETAILS");
  };
  const days = (date_1, date_2) => {
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  };
  return stage === "LIST" ? (
    <div>
      <div className="flex-1">
        <div className="sidebar">
          <SideBar />
        </div>
        <div className="w-100">
          <br />
          <div
            className="mx-2 my-2 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            {repairIter.map(
              (row, i) =>
                row.repairs_list.length > 0 && (
                  <Container className="mb-5" key={i}>
                    <h4 className="mt-2 mb-3" style={{ fontWeight: "600" }}>
                      {row.title}
                    </h4>

                    {row.repairs_list.map((repair, j) => (
                      <Row
                        className="mb-4"
                        key={j}
                        // onClick={() =>
                        //   navigate(
                        //     `/manager-repairs/${repair.maintenance_request_uid}`,
                        //     {
                        //       state: {
                        //         repair: repair,
                        //       },
                        //     }
                        //   )
                        // }

                        onClick={() => selectRepair(repair)}
                      >
                        <Col xs={4}>
                          <div style={tileImg}>
                            {JSON.parse(repair.images).length > 0 ? (
                              <img
                                src={JSON.parse(repair.images)[0]}
                                alt="Repair Image"
                                className="h-100 w-100"
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <img
                                src={No_Image}
                                alt="No Repair Image"
                                className="h-100 w-100"
                                style={{
                                  borderRadius: "4px",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </div>
                        </Col>
                        <Col className="ps-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0" style={{ fontWeight: "600" }}>
                              {repair.title}
                            </h5>
                            {repair.priority === "Low" ? (
                              <p style={greenPill} className="mb-0">
                                Low Priority
                              </p>
                            ) : repair.priority === "Medium" ? (
                              <p style={orangePill} className="mb-0">
                                Medium Priority
                              </p>
                            ) : repair.priority === "High" ? (
                              <p style={redPill} className="mb-0">
                                High Priority
                              </p>
                            ) : (
                              <p style={greenPill} className="mb-0">
                                No Priority
                              </p>
                            )}
                          </div>
                          <p style={gray} className="mt-2 mb-0">
                            {/*{repair.property.address}{repair.property.unit !== '' ? ' '+repair.property.unit : ''}, {repair.property.city}, {repair.property.state} <br/>*/}
                            {/*{repair.property.zip}*/}
                            {repair.address}
                            {repair.unit !== "" ? " " + repair.unit : ""},{" "}
                            {repair.city}, {repair.state} <br />
                            {repair.zip}
                          </p>
                          <div className="d-flex">
                            <div className="flex-grow-1 d-flex flex-column justify-content-center">
                              <p
                                style={{ ...blue, ...xSmall }}
                                className="mb-0"
                              >
                                Requested{" "}
                                {days(
                                  new Date(
                                    repair.request_created_date.split(" ")[0]
                                  ),
                                  new Date()
                                )}{" "}
                                days ago
                              </p>
                            </div>
                          </div>
                          <div className="d-flex">
                            <div className="flex-grow-1 d-flex flex-column justify-content-center">
                              <p
                                style={{ ...blue, ...xSmall }}
                                className="mb-0"
                              >
                                {repair.quotes_to_review > 0
                                  ? `${repair.quotes_to_review} new quote(s) to review`
                                  : "No new quotes"}
                              </p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    ))}
                  </Container>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  ) : stage === "REPAIRDETAILS" ? (
    <div className="flex-grow-1">
      <ManagerRepairDetail
        repair={repair}
        back={() => setStage("LIST")}
        reload={fetchRepairs}
      />
    </div>
  ) : (
    ""
  );
}

export default ManagerRepairsOverview;
