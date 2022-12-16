import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableSortLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../Header";
import { headings, subHeading, subText, blue } from "../../utils/styles";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});
function ManagerResidentAnnouncements(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const requestTitleRef = React.createRef();
  const requestDescriptionRef = React.createRef();
  const tagPriorityRef = React.createRef();

  const submitForm = () => {
    const requestTitle = requestTitleRef.current.value;
    const requestDescription = requestDescriptionRef.current.value;
    const tagPriority = tagPriorityRef.current.value;

    props.onConfirm(requestTitle, requestDescription, tagPriority);
  };

  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Announcements"
        leftText="< Back"
        leftFn={() => ""}
        rightText="Sort by"
        //rightFn={() => ''}
      />
      <Container className="pt-1 mb-4">
        <Row style={headings}>
          <div>Resident Announcements</div>
        </Row>
        <div>
          <Row style={subHeading} className="mt-1 mb-1 mx-2">
            December 2021
            <hr />
          </Row>
          <div>
            <Row style={subHeading} className="mt-1 mx-2">
              Lease Renewal
              <hr />
            </Row>
            <Row style={subText} className="mx-2">
              Click below to renew your lease in time. Your current lease ends
              on January 31, 2021.
              <hr />
            </Row>
            <Row
              style={blue}
              className="mx-2"
              onClick={() => navigate("/detailAnnouncements")}
            >
              Learn More
            </Row>
          </div>
          <div>
            <Row style={subHeading} className="mt-1 mx-2">
              Water Outage
              <hr />
            </Row>
            <Row style={subText} className="mx-2">
              Click below to renew your lease in time. Your current lease ends
              on January 31, 2021.
              <hr />
            </Row>
            <Row style={blue} className="mx-2">
              Learn More
            </Row>
          </div>
        </div>
        <div>
          <Row style={subHeading} className="mt-1 mb-1 mx-2">
            November 2021
            <hr />
          </Row>
          <div>
            <Row style={subHeading} className="mt-1 mx-2">
              Power Outage
              <hr />
            </Row>
            <Row style={subText} className="mx-2">
              Click below to renew your lease in time. Your current lease ends
              on January 31, 2021.
              <hr />
            </Row>
            <Row style={blue} className="mx-2">
              Learn More
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ManagerResidentAnnouncements;
