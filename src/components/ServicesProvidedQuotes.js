import React from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "../icons/EditIcon.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";
import ArrowDown from "../icons/ArrowDown.svg";
import {
  pillButton,
  smallPillButton,
  squareForm,
  gray,
  small,
  hidden,
  headings,
  red,
  formLabel,
  subHeading,
} from "../utils/styles";

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
function ServicesProvidedQuotes(props) {
  const classes = useStyles();
  const {
    serviceState,
    setServiceState,
    eventType,
    setEventType,
    totalEstimate,
    setTotalEstimate,
    editQuote,
    addQuote,
  } = props;
  const [newService, setNewService] = React.useState(null);
  const [editingService, setEditingService] = React.useState(null);
  // const [totalEstimate, setTotalEstimate] = React.useState(0)
  const emptyService = {
    service_name: "",
    charge: "",
    per: "Hour",
    event_type: "1 Hour Job",
    total_estimate: "",
  };
  const [errorMessage, setErrorMessage] = React.useState("");

  const calculateEstimate = () => {
    // console.log("in calculate estimate");

    // console.log("in calculate estimate serevicestate", serviceState);
    // console.log(eventType)
    if (newService !== null) {
      // console.log("in calculate estimate newservice", newService);
      let total = 0;
      let hours = parseInt(newService.event_type);
      if (
        newService.event_type !== undefined &&
        newService.event_type.toLowerCase().includes("day")
      ) {
        hours = hours * 24;
      }
      if (newService.per.toLocaleLowerCase() === "hour") {
        total = total + parseInt(newService.charge) * hours;
      } else if (newService.per.toLocaleLowerCase() === "one-time") {
        total = total + parseInt(newService.charge);
      }
      newService.total_estimate = total;
    }
  };
  const calculateTotalEstimate = () => {
    // console.log('***')
    let totalEst = 0;
    let totalHrs = 0;
    // console.log(serviceState)
    // console.log(eventType)
    let hours = parseInt(eventType);

    if (serviceState !== []) {
      serviceState.forEach((service) => {
        totalHrs = totalHrs + parseInt(service.event_type);
        totalEst = totalEst + parseInt(service.total_estimate);
      });
    }
    setTotalEstimate(totalEst);
    setEventType(totalHrs);
  };

  // React.useEffect(() => {
  //   calculateEstimate();
  // }, [serviceState, eventType]);
  React.useEffect(() => {
    calculateEstimate();
    calculateTotalEstimate();
  }, [newService, serviceState]);
  // console.log(serviceState);
  // console.log(eventType);
  // console.log(totalEstimate);
  const addService = () => {
    if (
      newService.service_name === "" ||
      newService.charge === "" ||
      newService.per === ""
    ) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    const newServiceState = [...serviceState];
    newServiceState.push({ ...newService });
    setServiceState(newServiceState);
    setNewService(null);
    setErrorMessage("");
    calculateTotalEstimate();
  };
  const cancelEdit = () => {
    setNewService(null);
    setErrorMessage("");
    if (editingService !== null) {
      const newServiceState = [...serviceState];
      newServiceState.push(editingService);
      setServiceState(newServiceState);
    }
    setEditingService(null);
    calculateEstimate();
  };
  const editService = (i) => {
    const newServiceState = [...serviceState];
    const service = newServiceState.splice(i, 1)[0];
    setServiceState(newServiceState);
    setEditingService(service);
    setNewService({ ...service });
    calculateEstimate();
  };
  const deleteService = (i) => {
    const newServiceState = [...serviceState];
    newServiceState.splice(i, 1);
    setServiceState(newServiceState);
    calculateEstimate();
  };
  const changeNewService = (event, field) => {
    const changedService = { ...newService };
    changedService[field] = event.target.value;
    setNewService(changedService);
    calculateEstimate();
  };
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  return (
    <Container className="px-2">
      {serviceState !== null && serviceState.length > 0 ? (
        <Table classes={{ root: classes.customTable }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Fee Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Per</TableCell>
              <TableCell>Hours</TableCell>
              <TableCell>Total Estimate</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serviceState.map((service, i) => (
              <TableRow key={i}>
                <TableCell>{service.service_name}</TableCell>
                <TableCell>${service.charge}</TableCell>

                <TableCell>{service.per}</TableCell>
                <TableCell>{service.event_type}</TableCell>
                <TableCell>${service.total_estimate}</TableCell>
                <TableCell>
                  <img
                    src={EditIcon}
                    alt="Edit"
                    className="px-1 mx-2"
                    onClick={() => editService(i)}
                  />
                  <img
                    src={DeleteIcon}
                    alt="Delete Icon"
                    className="px-1 mx-2"
                    onClick={() => deleteService(i)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div>No Services</div>
      )}
      {newService !== null ? (
        <div>
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Service Name {newService.service_name === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="Service Name"
              value={newService.service_name}
              onChange={(e) => changeNewService(e, "service_name")}
            />
          </Form.Group>
          <Row className="mb-2">
            <Col>
              <Form.Group className="mx-2">
                <Form.Label as="h6" className="mb-0 ms-2">
                  Charge {newService.charge === "" ? required : ""}
                </Form.Label>
                <Form.Control
                  style={squareForm}
                  min="0"
                  type="number"
                  placeholder="Amount($)"
                  value={newService.charge}
                  onChange={(e) => changeNewService(e, "charge")}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mx-2">
                <Form.Label as="h6" className="mb-0 ms-2">
                  Per {newService.per === "" ? required : ""}
                </Form.Label>
                <Form.Select
                  style={{
                    ...squareForm,
                    backgroundImage: `url(${ArrowDown})`,
                  }}
                  value={newService.per}
                  onChange={(e) => changeNewService(e, "per")}
                >
                  <option>Hour</option>
                  <option>One-time</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mx-2">
                <Form.Label as="h6" className="mb-0 ms-2">
                  Type
                </Form.Label>
                <Form.Select
                  style={squareForm}
                  value={newService.event_type}
                  onChange={(e) => changeNewService(e, "event_type")}
                >
                  <option>1 Hour Job</option>
                  <option>2 Hour Job</option>
                  <option>3 Hour Job</option>
                  <option>4 Hour Job</option>
                  <option>6 Hour Job</option>
                  <option>8 Hour Job</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div
            className="text-center"
            style={errorMessage === "" ? hidden : {}}
          >
            <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
          </div>
        </div>
      ) : (
        ""
      )}
      {newService === null ? (
        <Button
          className="mt-2"
          hidden={!addQuote && !editQuote}
          variant="outline-primary"
          style={smallPillButton}
          onClick={() => setNewService({ ...emptyService })}
        >
          Add Service
        </Button>
      ) : editingService !== null ? (
        <div className="d-flex justify-content-center mb-4">
          <Button
            variant="outline-primary"
            style={pillButton}
            onClick={cancelEdit}
            className="mx-2"
          >
            Cancel
          </Button>
          <Button
            variant="outline-primary"
            style={pillButton}
            onClick={addService}
            className="mx-2"
          >
            Update Service
          </Button>
        </div>
      ) : (
        <div className="d-flex justify-content-center mb-4">
          <Button
            variant="outline-primary"
            style={pillButton}
            onClick={cancelEdit}
            className="mx-2"
          >
            Cancel
          </Button>
          <Button
            variant="outline-primary"
            style={pillButton}
            onClick={addService}
            className="mx-2"
          >
            Add Service
          </Button>
        </div>
      )}
      {editQuote || addQuote ? (
        <div className="mt-4 mb-4">
          <Row>
            <div style={headings}>Event Type</div>
          </Row>
          <Row>
            <Col>
              {" "}
              <Form.Group className="mt-2 mb-2">
                <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                  Type
                </Form.Label>
                <div className="mt-2"> {eventType} Hour Job</div>
              </Form.Group>
            </Col>
            <Col>
              {" "}
              <div className="mt-2 mb-2">
                <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                  Total Estimate
                </Form.Label>
                <div className="mt-2">$ {totalEstimate}</div>
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        <div className="mt-4 mb-4">
          <Row>
            <div style={headings}>Event Type</div>
          </Row>
          <Row>
            <Col>
              {" "}
              <Form.Group className="mt-2 mb-2">
                <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                  Type
                </Form.Label>
                <div className="mt-2">{eventType} Hour Job</div>
              </Form.Group>
            </Col>
            <Col>
              {" "}
              <div className="mt-2 mb-2">
                <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                  Total Estimate
                </Form.Label>
                <div className="mt-2">$ {totalEstimate}</div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
}

export default ServicesProvidedQuotes;
