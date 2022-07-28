import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { mediumBold } from "../utils/styles";
import Checkbox from "./Checkbox";
import ConfirmDialog2 from "./ConfirmDialog2";
function PropertyUtilities(props) {
  const { state, edit } = props;
  const [utilityState, setUtilityState] = state;
  const utilities = Object.keys(utilityState);

  const [showDialog, setShowDialog] = useState(false);

  const setUtility = (utility, value) => {
    const newUtilityState = { ...utilityState };
    newUtilityState[utility] = value;
    setUtilityState(newUtilityState);
  };

  const removeUtility = (utility) => {
    setUtility(utility, false);
  };
  const addUtility = (utility) => {
    setUtility(utility, true);
  };
  const onConfirm = () => {
    setShowDialog(false);
  };

  return (
    <Container style={({ paddingLeft: "0px" }, mediumBold)} className="my-4">
      <ConfirmDialog2
        title={"Can't edit here. Click on the edit icon to make any changes"}
        isOpen={showDialog}
        onConfirm={onConfirm}
      />
      <Row>
        <Col xs={6}>
          <h6>Utilities Paid by</h6>
        </Col>
        <Col className="text-center">
          <h6>Owner</h6>
        </Col>
        <Col className="text-center">
          <h6>Tenant</h6>
        </Col>
      </Row>
      {utilities.map((utility, i) => (
        <Row key={i} className="mb-2">
          <Col xs={6}>{utility}</Col>
          <Col className="d-flex justify-content-center align-items-center">
            <Checkbox
              type="CIRCLE"
              checked={utilityState[utility]}
              onClick={
                edit
                  ? () => addUtility(utility)
                  : () => {
                      setShowDialog(true);
                    }
              }
            />
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <Checkbox
              type="CIRCLE"
              checked={!utilityState[utility]}
              onClick={
                edit
                  ? () => removeUtility(utility)
                  : () => {
                      setShowDialog(true);
                    }
              }
            />
          </Col>
        </Row>
      ))}
    </Container>
  );
}

export default PropertyUtilities;
