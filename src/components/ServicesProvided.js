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
  red,
  hidden,
  headings,
  subText,
  formLabel,
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

function ServicesProvided(props) {
  const classes = useStyles();
  const {
    serviceState,
    setServiceState,
    eventType,
    setEventType,
    totalEstimate,
    setTotalEstimate,
    businessType,
  } = props;
  // console.log(serviceState);
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

  // const calculateEstimate = () => {
  //   console.log("in calculate estimate");

  //   console.log("in calculate estimate serevicestate", serviceState);
  //   // console.log(eventType)

  //   if (serviceState !== []) {
  //     serviceState.forEach((service) => {
  //       console.log("in calculate estimate service", service);
  //       let total = 0;
  //       let hours = parseInt(service.event_type);
  //       if (
  //         service.event_type !== undefined &&
  //         service.event_type.toLowerCase().includes("day")
  //       ) {
  //         hours = hours * 24;
  //       }
  //       if (service.per.toLocaleLowerCase() === "hour") {
  //         total = total + parseInt(service.charge) * hours;
  //       } else if (service.per.toLocaleLowerCase() === "one-time") {
  //         total = total + parseInt(service.charge);
  //       }
  //       service.total_estimate = total;
  //     });
  //     // setTotalEstimate(total);
  //   }
  // };
  const calculateEstimate = () => {
    console.log("in calculate estimate");

    console.log("in calculate estimate serevicestate", serviceState);
    // console.log(eventType)
    if (newService !== null) {
      console.log("in calculate estimate newservice", newService);
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

  React.useEffect(() => {
    calculateEstimate();
  }, [newService]);

  const addService = () => {
    if (
      newService.service_name === "" ||
      newService.charge === "" ||
      newService.per === ""
    ) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    // console.log(newService);
    const newServiceState = [...serviceState];
    // console.log(newServiceState);
    newServiceState.push({ ...newService });
    // console.log(newServiceState);
    setServiceState(newServiceState);
    calculateEstimate();
    setNewService(null);
    setErrorMessage("");
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
  console.log("serviceState", serviceState);
  console.log("newService", newService);
  return (
    <div>
      <Row className="mx-2">
        {" "}
        {serviceState.length > 0 ? (
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
          ""
        )}
      </Row>

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
                  <option>1 Day Job</option>
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
          variant="outline-primary"
          style={smallPillButton}
          onClick={() => setNewService({ ...emptyService })}
        >
          Add Service
        </Button>
      ) : (
        <div className="d-flex justify-content-center mb-4 ">
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
    </div>
  );
}

export default ServicesProvided;
