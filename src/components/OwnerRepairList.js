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
import { useLocation, useNavigate } from "react-router-dom";
import { get } from "../utils/api";
import AppContext from "../AppContext";
import No_Image from "../icons/No_Image_Available.jpeg";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";

function OwnerRepairList(props) {
  const navigate = useNavigate();

  const { properties, ownerID, setStage } = props;
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [repairs, setRepairs] = useState([]);
  const [newRepairs, setNewRepairs] = useState([]);
  const [infoRepairs, setInfoRepairs] = useState([]);
  const [processingRepairs, setProcessingRepairs] = useState([]);
  const [scheduledRepairs, setScheduledRepairs] = useState([]);
  const [completedRepairs, setCompletedRepairs] = useState([]);
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
      console.log(repair.address);
    });

    const cats = repairs.reduce((catsSoFar, { address, title }) => {
      if (!catsSoFar[address]) catsSoFar[address] = [];
      catsSoFar[address].push(title);
      return catsSoFar;
    }, {});
    console.log(cats);
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
    sort_repairs_address(repairs);
    console.log(repairs_sorted);
    setRepairs(repairs_sorted);

    let new_repairs = repairs_sorted.filter(
      (item) => item.request_status === "NEW"
    );
    let info_repairs = repairs.filter((item) => item.request_status === "INFO");
    let processing_repairs = repairs_sorted.filter(
      (item) => item.request_status === "PROCESSING"
    );
    let scheduled_repairs = repairs_sorted.filter(
      (item) => item.request_status === "SCHEDULED"
    );
    let completed_repairs = repairs_sorted.filter(
      (item) => item.request_status === "COMPLETE"
    );

    new_repairs = new_repairs.reduce((newSoFar, { address, new_repairs }) => {
      if (!newSoFar[address]) newSoFar[address] = [];
      newSoFar[address].push(newSoFar);
      return newSoFar;
    }, {});

    info_repairs = info_repairs.reduce(
      (infoSoFar, { address, info_repairs }) => {
        if (!infoSoFar[address]) infoSoFar[address] = [];
        infoSoFar[address].push(infoSoFar);
        return infoSoFar;
      },
      {}
    );
    processing_repairs = processing_repairs.reduce(
      (processingSoFar, { address, processing_repairs }) => {
        if (!processingSoFar[address]) processingSoFar[address] = [];
        processingSoFar[address].push(processingSoFar);
        return processingSoFar;
      },
      {}
    );
    scheduled_repairs = scheduled_repairs.reduce(
      (scheduledSoFar, { address, scheduled_repairs }) => {
        if (!scheduledSoFar[address]) scheduledSoFar[address] = [];
        scheduledSoFar[address].push(scheduledSoFar);
        return scheduledSoFar;
      },
      {}
    );
    completed_repairs = completed_repairs.reduce(
      (completedSoFar, { address, completed_repairs }) => {
        if (!completedSoFar[address]) completedSoFar[address] = [];
        completedSoFar[address].push(completedSoFar);
        return completedSoFar;
      },
      {}
    );
    console.log(
      new_repairs,
      info_repairs,
      processing_repairs,
      scheduled_repairs,
      completed_repairs
    );

    setNewRepairs(new_repairs);
    setInfoRepairs(info_repairs);
    setProcessingRepairs(processing_repairs);
    setScheduledRepairs(scheduled_repairs);
    setCompletedRepairs(completed_repairs);

    setRepairIter([
      { title: "New Repair Requests", repairs_list: new_repairs },
      { title: "Info Requested", repairs_list: info_repairs },
      { title: "Processing", repairs_list: processing_repairs },
      { title: "Upcoming, Scheduled", repairs_list: scheduled_repairs },
      { title: "Completed", repairs_list: completed_repairs },
    ]);
  };

  useEffect(fetchRepairs, [access_token]);
  console.log(repairIter);
  return (
    <div
      className="h-100"
      style={{
        background: "#E9E9E9 0% 0% no-repeat padding-box",
        borderRadius: "10px",
        opacity: 1,
      }}
    >
      <Header
        title="Repairs"
        rightText="+ New"
        rightFn={() => setStage("REPAIRREQUEST")}
      />
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
                <h4 className="mt-2 mb-3" style={mediumBold}>
                  {row.title}
                </h4>

                {row.repairs_list.map((repair, j) => (
                  <Row
                    className="mb-4"
                    key={j}
                    onClick={() =>
                      navigate(`./${repair.maintenance_request_uid}`, {
                        state: { repair: repair },
                      })
                    }
                  >
                    <Row>
                      <p
                        style={{
                          font: "normal normal normal 16px/22px Bahnschrift-Regular",
                        }}
                        className="mt-2 mb-0"
                      >
                        {repair.address}
                        {repair.unit !== "" ? " " + repair.unit : ""},{" "}
                        {repair.city}, {repair.state} {repair.zip}
                      </p>
                    </Row>
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
                            style={{ borderRadius: "4px", objectFit: "cover" }}
                          />
                        )}
                      </div>
                    </Col>
                    <Col className="ps-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5
                          className="mb-0"
                          style={{
                            font: "normal normal normal 16px/22px Bahnschrift-Regular",
                          }}
                        >
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

                      <div className="d-flex">
                        <div className="flex-grow-1 d-flex flex-column justify-content-center">
                          <p style={{ ...blue, ...xSmall }} className="mb-0">
                            Requested {repair.days_since} days ago
                          </p>
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="flex-grow-1 d-flex flex-column justify-content-center">
                          <p style={{ ...blue, ...xSmall }} className="mb-0">
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
  );
}

export default OwnerRepairList;
