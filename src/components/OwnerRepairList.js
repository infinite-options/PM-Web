import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  blue,
  gray,
  greenPill,
  mediumBold,
  orangePill,
  redPill,
  tileImg,
  xSmall,
} from "../utils/styles";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { get } from "../utils/api";
import AppContext from "../AppContext";
import No_Image from "../icons/No_Image_Available.jpeg";

function OwnerRepairList(props) {
  const navigate = useNavigate();

  const { properties, ownerID, setStage } = props;
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [repairs, setRepairs] = useState([]);
  const [repairIter, setRepairIter] = useState([]);

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

  const sort_repairs_address = (repairs) => {
    repairs.forEach((repair, i) => {
      console.log("");
    });
  };

  const fetchRepairs = async () => {
    if (access_token === null) {
      navigate("/");
      return;
    }
    const response = await get(
      `/maintenanceRequestsandQuotes?owner_id=${ownerID}`
    );
    if (response.msg === "Token has expired") {
      refresh();
      return;
    }

    let repairI = [];
    let repairIT = [];
    for (let r = 0; r <= response.result.length - 1; r++) {
      let new_repairs = [];
      let info_repairs = [];
      let processing_repairs = [];
      let scheduled_repairs = [];
      let completed_repairs = [];
      let newrepairs = "";
      let inforepairs = "";
      let processingrepairs = "";
      let scheduledrepairs = "";
      let completedrepairs = "";
      let repairs = response.result[r].maintenanceRequests;
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
      // console.log("repairs unsorted", repairs);
      let repairs_sorted = sort_repairs(repairs);
      sort_repairs_address(repairs);
      // console.log("repairs sorted", repairs_sorted);
      setRepairs(repairs_sorted);
      repairs_sorted.forEach((repair_sorted, i) => {
        // console.log("repairs sorted in for each ", i, repair_sorted);

        if (repair_sorted.request_status === "NEW") {
          newrepairs = repair_sorted;
          new_repairs.push(newrepairs);
        } else if (repair_sorted.request_status === "INFO") {
          inforepairs = repair_sorted;
          info_repairs.push(inforepairs);
        } else if (repair_sorted.request_status === "PROCESSING") {
          processingrepairs = repair_sorted;
          processing_repairs.push(processingrepairs);
        } else if (repair_sorted.request_status === "SCHEDULED") {
          scheduledrepairs = repair_sorted;
          scheduled_repairs.push(scheduledrepairs);
        } else {
          completedrepairs = repair_sorted;
          completed_repairs.push(completedrepairs);
        }

        // if (newrepairs !== "") {
        //   new_repairs.push(newrepairs);
        // } else if (inforepairs !== "") {
        //   info_repairs.push(inforepairs);
        // } else if (processingrepairs !== "") {
        //   processing_repairs.push(processingrepairs);
        // } else if (scheduledrepairs !== "") {
        //   scheduled_repairs.push(scheduledrepairs);
        // } else if (completedrepairs !== "") {
        //   completed_repairs.push(completedrepairs);
        // } else {
        //   console.log("idk");
        // }
        // setNewRepairs(new_repairs);
        // setInfoRepairs(info_repairs);
        // setProcessingRepairs(processing_repairs);
        // setScheduledRepairs(scheduled_repairs);
        // setCompletedRepairs(completed_repairs);
      });

      repairI = [
        [
          {
            address:
              response.result[r].address +
              " " +
              response.result[r].unit +
              ", " +
              response.result[r].city +
              ", " +
              response.result[r].state +
              " " +
              response.result[r].zip,
          },
        ],
        [
          { title: "New Repair Requests", repairs_list: new_repairs },
          { title: "Info Requested", repairs_list: info_repairs },
          { title: "Processing", repairs_list: processing_repairs },
          { title: "Upcoming, Scheduled", repairs_list: scheduled_repairs },
          { title: "Completed", repairs_list: completed_repairs },
        ],
      ];
      // console.log(repairI);
      repairIT.push(repairI);
      // setRepairIter(repairI.push(repairI));
    }
    console.log("repairs_sorted", repairIT);
    setRepairIter(repairIT);
  };

  useEffect(fetchRepairs, [access_token]);
  // console.log(repairIter);
  const days = (date_1, date_2) => {
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  };

  console.log(days(new Date("2022-06-02"), new Date()));
  return (
    <div
      className="h-100 pb-5 mb-5"
      style={{
        background: "#E9E9E9 0% 0% no-repeat padding-box",
        borderRadius: "10px",
        opacity: 1,
      }}
    >
      <Header
        title="Repairs"
        rightText="+ New"
        rightFn={() => setStage("REPAIRSREQUEST")}
      />
      <div
        className="mx-2 my-2 p-3"
        style={{
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          borderRadius: "10px",
          opacity: 1,
        }}
      >
        {repairIter.map((row, i) => (
          <Container className="mb-5" key={i}>
            <Row>
              <p style={mediumBold} className="mt-2 mb-0">
                {row[0][0].address}
              </p>
            </Row>

            <div>
              {row[1].map((rows, i) => (
                <Container className="mb-2" key={i}>
                  {rows.repairs_list.length > 0 ? (
                    <div>
                      <Container className="mb-0 p-0" key={i}>
                        <h4 className="mt-0 mb-3" style={mediumBold}>
                          {rows.title}
                        </h4>

                        {rows.repairs_list.map((repair, j) => (
                          <Row
                            className="mb-4 p-0"
                            key={j}
                            onClick={() =>
                              navigate(
                                `/owner-repairs/${repair.maintenance_request_uid}`,
                                {
                                  state: {
                                    repair: repair,
                                    property: row[0][0].address,
                                  },
                                }
                              )
                            }
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
                              <Row className="d-flex justify-content-between align-items-center">
                                <Col>
                                  <h5
                                    className="mb-0"
                                    style={{
                                      font: "normal normal normal 16px/22px Bahnschrift-Regular",
                                    }}
                                  >
                                    {repair.title}
                                  </h5>
                                </Col>
                                <Col>
                                  {repair.priority === "Low" ? (
                                    <p
                                      // style={greenPill}
                                      style={{
                                        backgroundColor: "#3DB727",
                                        borderRadius: "20px",
                                        fontSize: "13px",
                                        height: "24px",
                                        padding: "2px",
                                        textAlign: "center",
                                        color: "white",
                                      }}
                                      className="mb-0"
                                    >
                                      Low Priority
                                    </p>
                                  ) : repair.priority === "Medium" ? (
                                    <p
                                      // style={orangePill}
                                      style={{
                                        backgroundColor: "#F89A03",
                                        borderRadius: "20px",
                                        fontSize: "13px",
                                        height: "24px",
                                        padding: "2px",
                                        textAlign: "center",
                                        color: "white",
                                      }}
                                      className="mb-0"
                                    >
                                      Medium Priority
                                    </p>
                                  ) : repair.priority === "High" ? (
                                    <p
                                      // style={redPill}
                                      style={{
                                        backgroundColor: "#E3441F",
                                        borderRadius: "20px",
                                        fontSize: "13px",
                                        height: "24px",
                                        padding: "2px",
                                        textAlign: "center",
                                        color: "white",
                                      }}
                                      className="mb-0"
                                    >
                                      High Priority
                                    </p>
                                  ) : (
                                    <p
                                      // style={greenPill}
                                      style={{
                                        backgroundColor: "#3DB727",
                                        borderRadius: "20px",
                                        fontSize: "13px",
                                        height: "24px",
                                        padding: "2px",
                                        textAlign: "center",
                                        color: "white",
                                      }}
                                      className="mb-0"
                                    >
                                      No Priority
                                    </p>
                                  )}
                                </Col>
                              </Row>

                              <div className="d-flex">
                                <div className="flex-grow-1 d-flex flex-column justify-content-center">
                                  <p
                                    style={{ ...blue, ...xSmall }}
                                    className="mb-0"
                                  >
                                    Requested &nbsp;
                                    {days(
                                      new Date(
                                        repair.request_created_date.split(
                                          " "
                                        )[0]
                                      ),
                                      new Date()
                                    )}
                                    &nbsp; days ago
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
                    </div>
                  ) : null}
                </Container>
              ))}
            </div>
          </Container>
        ))}
      </div>
    </div>
  );
}

export default OwnerRepairList;
