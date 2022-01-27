import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../components/Header";
import HighPriority from "../icons/highPriority.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import {
  headings,
  formLabel,
  bluePillButton,
  pillButton,
} from "../utils/styles";

function RepairRequest(props) {
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

  const goToLogin = () => {
    navigate("/login");
  };
  return (
    <div className="h-100 d-flex flex-column">
      <Header
        title="Repairs"
        leftText="< Back"
        leftFn={() => navigate("/tenant")}
      />
      <Container className="pt-1 mb-4">
        <Row style={headings}>
          <div>New Pair Request</div>
        </Row>
        <Form>
          <Form.Group className="mt-3 mb-4">
            <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
              Title (character limit: 15)
            </Form.Label>
            <Form.Control
              style={{ borderRadius: 0 }}
              ref={requestTitleRef}
              placeholder="Ex: Paint"
            />
          </Form.Group>
          <Form.Group className="mt-3 mb-4">
            <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
              Description
            </Form.Label>
            <Form.Control
              style={{ borderRadius: 0 }}
              as="textarea"
              ref={requestDescriptionRef}
              placeholder="Ex: Kitchen wall needs repaint. It’s been chipping."
            />
          </Form.Group>
          <Form.Group className="mt-3 mb-4">
            <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
              Take pictures
            </Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => console.log(e.target.files)}
            />
          </Form.Group>
          <Form.Group className="mt-3 mb-4">
            <Form.Label style={formLabel} as="h5" className="mt-2 mb-1">
              Tag Priority (Select one)
            </Form.Label>
            <Row
              className="mt-2 mb-2"
              style={{
                display: "text",
                flexDirection: "row",
                textAlign: "center",
              }}
            >
              <Col xs={4}>
                <img
                  src={HighPriority}
                  ref={tagPriorityRef}
                  style={{ opacity: "0.5" }}
                />
              </Col>
              <Col xs={4}>
                <img
                  src={MediumPriority}
                  ref={tagPriorityRef}
                  style={{ opacity: "0.5" }}
                />
              </Col>
              <Col xs={4}>
                <img
                  src={LowPriority}
                  ref={tagPriorityRef}
                  style={{ opacity: "0.5" }}
                />
              </Col>
            </Row>
          </Form.Group>
        </Form>
        <div className="text-center mt-5">
          <Row
            style={{
              display: "text",
              flexDirection: "row",
              textAlign: "center",
            }}
          >
            <Col>
              <Button
                variant="outline-primary"
                onClick={() => navigate("/tenant")}
                style={pillButton}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                variant="outline-primary"
                onClick={submitForm}
                style={bluePillButton}
              >
                Add Request
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default RepairRequest;
