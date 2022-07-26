import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import moment from "moment";
import EditIcon from "../icons/EditIcon.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";

import { Elements } from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";
import StripePayment from "../components/StripePayment.js";
import {
  pillButton,
  smallPillButton,
  squareForm,
  redPill,
  small,
  red,
  hidden,
  headings,
  mediumBold,
  subHeading,
  bluePillButton,
  greenPill,
} from "../utils/styles";
import ArrowDown from "../icons/ArrowDown.svg";
import { useLocation, useNavigate } from "react-router-dom";
import Checkbox from "../components/Checkbox";
import Header from "../components/Header";
import { post, get } from "../utils/api";
import AppContext from "../AppContext";
import File from "../icons/File.svg";

function ManagerUtilities(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, refresh } = React.useContext(AppContext);
  const { access_token, user } = userData;
  const [stripePromise, setStripePromise] = useState(null);
  // const [expenses, setExpenses] = React.useState([]);
  const { properties, setStage, expenses } = props;

  const useLiveStripeKey = false;
  const [message, setMessage] = React.useState("");

  const [utilityState, setUtilityState] = React.useState([]);
  const [newUtility, setNewUtility] = React.useState(null);
  const [editingUtility, setEditingUtility] = React.useState(false);
  const [propertyState, setPropertyState] = React.useState(properties);

  const [files, setFiles] = React.useState([]);
  const [newFile, setNewFile] = React.useState(null);
  const [editingDoc, setEditingDoc] = React.useState(null);
  const [tenantPay, setTenantPay] = React.useState(false);
  const [ownerPay, setOwnerPay] = React.useState(false);
  const [expenseDetail, setExpenseDetail] = React.useState(false);
  const [maintenanceExpenseDetail, setMaintenanceExpenseDetail] =
    React.useState(false);
  const [payment, setPayment] = React.useState(false);
  const emptyUtility = {
    provider: "",
    service_name: "",
    charge: "",
    properties: [],
    split_type: "uniform",
    due_date: "",
    add_to_rent: false,
  };
  const [errorMessage, setErrorMessage] = React.useState("");

  const [stripePayment, setStripePayment] = useState(false);
  const [paymentConfirm, setPaymentConfirm] = useState(false);
  React.useEffect(async () => {
    const url = useLiveStripeKey
      ? "https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/stripe_key/LIVE"
      : "https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/stripe_key/M4METEST";
    let response = await fetch(url);
    const responseData = await response.json();
    const stripePromise = loadStripe(responseData.publicKey);
    setStripePromise(stripePromise);
    // let tempAllPurchases = [];
    // for (let i in purchaseUID) {
    //   let response1 = await get(`/purchases?purchase_uid=${purchaseUID[i]}`);
    //   tempAllPurchases.push(response1.result[0]);
    // }
    // response = await get(`/purchases?purchase_uid=${purchaseUID}`);
    // setPurchase(response.result[0]);
    // setAllPurchases(tempAllPurchases);
  }, []);
  React.useEffect(() => {
    console.log(properties);
    properties.forEach((p) => (p.checked = false));
  }, [properties]);
  const cancel = () => setStripePayment(false);
  const submit = () => {
    cancel();
    setPaymentConfirm(true);
  };
  const splitFees = (newUtility) => {
    let charge = parseFloat(newUtility.charge);

    if (newUtility.split_type === "uniform") {
      let count = newUtility.properties.length;
      let charge_per = charge / count;
      newUtility.properties.forEach((p) => (p.charge = charge_per));
    }

    if (newUtility.split_type === "tenant") {
      let total = 0;
      newUtility.properties.forEach((p, i) => {
        if (p.rental_status === "ACTIVE") {
          let tenants = p.applications.filter(
            (a) => a.application_status === "RENTED"
          );
          let occupants =
            tenants[0].adult_occupants + tenants[0].children_occupants;
          total = total + occupants;
          p.tenants = tenants;
          p.occupants = occupants;
        } else {
          total = total + 1;
          p.occupants = 1;
        }
      });
      newUtility.properties.forEach(
        (p) => (p.charge = (p.occupants / total) * charge)
      );
    }

    if (newUtility.split_type === "area") {
      let total_area = 0;
      newUtility.properties.forEach((p) => (total_area = total_area + p.area));
      // console.log(total_area)
      newUtility.properties.forEach(
        (p) => (p.charge = (p.area / total_area) * charge)
      );
    }
  };

  const postCharges = async (newUtility) => {
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
    let properties_uid = [];
    newUtility.properties.forEach((prop) =>
      properties_uid.push(prop.property_uid)
    );
    const new_bill = {
      bill_created_by: management_buid,
      bill_description: newUtility.provider,
      bill_utility_type: newUtility.service_name,
      bill_algorithm: newUtility.split_type,
      bill_docs: files,
    };
    for (let i = 0; i < files.length; i++) {
      let key = `file_${i}`;
      new_bill[key] = files[i].file;
      delete files[i].file;
    }

    new_bill.bill_docs = JSON.stringify(files);
    const response = await post("/bills", new_bill, null, files);
    const bill_uid = response.bill_uid;
    console.log(bill_uid);

    const new_purchase_pm = {
      linked_bill_id: bill_uid,
      pur_property_id: properties_uid,
      payer: [management_buid],
      receiver: newUtility.provider,
      purchase_type: "UTILITY",
      description: newUtility.service_name,
      amount_due: newUtility.charge,
      purchase_notes: moment().format("MMMM"),
      purchase_date: moment().format("YYYY-MM-DD") + " 00:00:00",
      purchase_frequency: "One-time",
      next_payment: newUtility.due_date,
    };
    console.log(new_purchase_pm);
    const response_pm = await post("/purchases", new_purchase_pm, null, null);
    const purchase_uid = response_pm.purchase_uid;
    console.log(response_pm);
    splitFees(newUtility);
    for (const property of newUtility.properties) {
      console.log(property);
      const new_purchase = {
        linked_bill_id: bill_uid,
        pur_property_id: property.property_uid,
        payer: "",
        receiver: management_buid,
        purchase_type: "UTILITY",
        description: newUtility.service_name,
        amount_due: property.charge,
        purchase_notes: moment().format("MMMM"),
        purchase_date: moment().format("YYYY-MM-DD") + " 00:00:00",
        purchase_frequency: "One-time",
        next_payment: newUtility.due_date,
      };

      if (newUtility.add_to_rent) {
        new_purchase.next_payment = "0000-00-00 00:00:00";
      }
      if (tenantPay) {
        if (property.rental_status === "ACTIVE") {
          let tenant_ids = property.tenants.map((t) => t.tenant_id);
          new_purchase.payer = tenant_ids;
        } else {
          new_purchase.payer = [property.owner_id];
        }
      } else {
        new_purchase.payer = [property.owner_id];
      }

      console.log("New Purchase", new_purchase);
      const response_t = await post("/purchases", new_purchase, null, null);
    }
    navigate(`/managerPaymentPage/${purchase_uid}`, {
      state: {
        amount: newUtility.charge,
        selectedProperty: "",
        purchaseUID: purchase_uid,
      },
    });
    setNewUtility({ ...emptyUtility });
    propertyState.forEach((prop) => (prop.checked = false));
    setPropertyState(propertyState);
    setEditingUtility(false);
    setTenantPay(false);
    setOwnerPay(false);
  };

  const addUtility = async () => {
    if (newUtility.service_name === "" || newUtility.charge === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    if (propertyState.filter((p) => p.checked).length < 1) {
      setErrorMessage("Select at least one property");
      return;
    }

    if (!newUtility.add_to_rent) {
      if (newUtility.due_date === "") {
        setErrorMessage("Please fill out all fields");
        return;
      }
      let due_date = new Date(newUtility.due_date);
      let current_date = new Date();
      if (current_date >= due_date) {
        setErrorMessage("Select a Due by Date later than current date");
        return;
      }
    }

    setErrorMessage("");

    newUtility.properties = [...propertyState.filter((p) => p.checked)];
    // newUtility.properties = propertyState.filter((p) => p.checked)
    // splitFees(newUtility);
    await postCharges(newUtility);
    const newUtilityState = [...utilityState];
    newUtilityState.push({ ...newUtility });
    setUtilityState(newUtilityState);
    setNewUtility(null);
  };
  const cancelEdit = () => {
    setNewUtility(null);
    setErrorMessage("");
    if (editingUtility !== null) {
      const newUtilityState = [...utilityState];
      newUtilityState.push(editingUtility);
      setUtilityState(newUtilityState);
    }
    setEditingUtility(null);
  };
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  const editUtility = (i) => {
    // const newUtilityState = [...utilityState];
    // const utility = newUtilityState.splice(i, 1)[0];
    // setUtilityState(newUtilityState);
    // setEditingUtility(utility);
    // setNewUtility({...utility});
  };
  const deleteUtility = (i) => {
    // const newUtilityState = [...utilityState];
    // newUtilityState.splice(i, 1);
    // setUtilityState(newUtilityState);
  };
  const changeNewUtility = (event, field) => {
    // console.log('as')
    // console.log(event)
    // console.log(field)
    // console.log(event.target.checked)
    const changedUtility = { ...newUtility };
    if (event.target.type === "checkbox") {
      changedUtility[field] = event.target.checked;
    } else {
      changedUtility[field] = event.target.value;
    }
    // changedUtility[field] = event.target.value;
    setNewUtility(changedUtility);
  };
  const toggleProperty = (i) => {
    const newPropertyState = [...propertyState];
    newPropertyState[i].checked = !newPropertyState[i].checked;
    setPropertyState(newPropertyState);
  };

  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );

  const addFile = (e) => {
    const file = e.target.files[0];
    const newFile = {
      name: file.name,
      description: "",
      file: file,
    };
    setNewFile(newFile);
  };

  const updateNewFile = (field, value) => {
    const newFileCopy = { ...newFile };
    newFileCopy[field] = value;
    setNewFile(newFileCopy);
  };

  const editDocument = (i) => {
    const newFiles = [...files];
    const file = newFiles.splice(i, 1)[0];
    setFiles(newFiles);
    setEditingDoc(file);
    setNewFile({ ...file });
  };

  const cancelDocumentEdit = () => {
    setNewFile(null);
    if (editingDoc !== null) {
      const newFiles = [...files];
      newFiles.push(editingDoc);
      setFiles(newFiles);
    }
    setEditingDoc(null);
  };

  const saveNewFile = (e) => {
    // copied from addFile, change e.target.files to state.newFile
    const newFiles = [...files];
    newFiles.push(newFile);
    setFiles(newFiles);
    setNewFile(null);
  };
  const deleteDocument = (i) => {
    const newFiles = [...files];
    newFiles.splice(i, 1);
    setFiles(newFiles);
  };

  return (
    <div
      className="h-100 pb-5 mb-5"
      style={{ background: "#E9E9E9 0% 0% no-repeat padding-box" }}
    >
      <Header
        title="Expenses"
        leftText={
          editingUtility || expenseDetail || maintenanceExpenseDetail
            ? "< Back"
            : ""
        }
        leftFn={() => {
          setNewUtility(null);
          setExpenseDetail(false);
          setMaintenanceExpenseDetail(false);
          setPayment(null);
          propertyState.forEach((prop) => (prop.checked = false));
          setPropertyState(propertyState);
          setTenantPay(false);
          setOwnerPay(false);
          setEditingUtility(false);
        }}
        rightText={
          editingUtility || expenseDetail || maintenanceExpenseDetail
            ? ""
            : "+ New"
        }
        rightFn={() => {
          setNewUtility({ ...emptyUtility });
          propertyState.forEach((prop) => (prop.checked = false));
          setPropertyState(propertyState);
          setTenantPay(false);
          setOwnerPay(false);
          setEditingUtility(true);
        }}
      />

      <div>
        {newUtility !== null &&
        editingUtility &&
        !expenseDetail &&
        !maintenanceExpenseDetail ? (
          <div
            className="mx-2 mt-2 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              borderRadius: "5px",
              opacity: 1,
            }}
          >
            <Row className="my-4 text-center">
              <div style={headings}>New Utility Payment</div>
            </Row>
            <Row className="mb-2">
              <Col>
                <Form.Group className="mx-2">
                  <Form.Label style={mediumBold} className="mb-0 ms-2">
                    Utility Type{" "}
                    {newUtility.service_name === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="Electricity"
                    value={newUtility.service_name}
                    onChange={(e) => changeNewUtility(e, "service_name")}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mx-2">
                  <Form.Label style={mediumBold} className="mb-0 ms-2">
                    Amount {newUtility.charge === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    type="number"
                    placeholder="20"
                    value={newUtility.charge}
                    onChange={(e) => changeNewUtility(e, "charge")}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <Form.Group className="mx-2">
                  <Form.Label style={mediumBold} className="mb-0 ms-2">
                    Provider {newUtility.provider === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    style={squareForm}
                    placeholder="Electricity"
                    value={newUtility.provider}
                    onChange={(e) => changeNewUtility(e, "provider")}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Group className="mx-2 mt-3 mb-2">
                  <Form.Label style={mediumBold} className="mb-0 ms-2">
                    Due by Date {newUtility.due_date === "" ? required : ""}
                  </Form.Label>
                  <Form.Control
                    disabled={newUtility.add_to_rent}
                    style={squareForm}
                    type="date"
                    value={newUtility.due_date}
                    onChange={(e) => changeNewUtility(e, "due_date")}
                  />
                </Form.Group>
                <Form.Group className="mx-2 mb-3" controlId="formBasicCheckbox">
                  <Form.Check
                    type="checkbox"
                    style={subHeading}
                    label="Pay with next rent"
                    onChange={(e) => changeNewUtility(e, "add_to_rent")}
                  />
                </Form.Group>
                {/*<Checkbox type='BOX' checked={newUtility.add_to_rent ? 'checked' : ''}*/}
                {/*          onClick={(checked) => changeNewUtility(checked, 'add_to_rent')} />*/}
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Group className="mx-2 mb-3" controlId="formBasicCheckbox">
                  <div
                    className="d-flex mx-2 ps-2 align-items-center my-2"
                    style={{
                      font: "normal normal normal 18px Bahnschrift-Regular",
                    }}
                  >
                    <Checkbox
                      type="BOX"
                      checked={tenantPay}
                      onClick={() => setTenantPay(!tenantPay)}
                    />
                    <p className="ms-1 mb-1">Tenant</p>
                  </div>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mx-2 mb-3" controlId="formBasicCheckbox">
                  <div
                    className="d-flex mx-2 ps-2 align-items-center my-2"
                    style={{
                      font: "normal normal normal 18px Bahnschrift-Regular",
                    }}
                  >
                    {" "}
                    <Checkbox
                      type="BOX"
                      checked={ownerPay}
                      onClick={() => setOwnerPay(!ownerPay)}
                    />
                    <p className="ms-1 mb-1">Owner</p>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mx-1 mt-3 mb-2">
              <h6 style={mediumBold}>Properties</h6>
              {properties.map((property, i) => (
                <div
                  key={i}
                  className="d-flex mx-2 ps-2 align-items-center my-2"
                  style={{
                    font: "normal normal normal 18px Bahnschrift-Regular",
                  }}
                >
                  <Checkbox
                    type="BOX"
                    checked={propertyState[i].checked}
                    onClick={() => toggleProperty(i)}
                  />
                  <p className="ms-1 mb-1">
                    {property.address} {property.unit}
                    ,&nbsp;{property.city},&nbsp;{property.state}&nbsp;{" "}
                    {property.zip}
                  </p>
                </div>
              ))}
            </Row>

            {/*Add Documents functionality*/}
            <Row className="mx-1 mt-3 mb-2">
              <h6 style={mediumBold}>Utility Documents</h6>
              {files.map((file, i) => (
                <div key={i}>
                  <div className="d-flex justify-content-between align-items-end">
                    <div>
                      <h6 style={mediumBold}>{file.name}</h6>
                      <p style={small} className="m-0">
                        {file.description}
                      </p>
                    </div>
                    <div>
                      <img
                        src={EditIcon}
                        alt="Edit"
                        className="px-1 mx-2"
                        onClick={() => editDocument(i)}
                      />
                      <img
                        src={DeleteIcon}
                        alt="Delete"
                        className="px-1 mx-2"
                        onClick={() => deleteDocument(i)}
                      />
                      <a href={file.link} target="_blank">
                        <img src={File} />
                      </a>
                    </div>
                  </div>
                  <hr style={{ opacity: 1 }} />
                </div>
              ))}
              {newFile !== null ? (
                <div>
                  <Form.Group>
                    <Form.Label style={mediumBold} className="mb-0 ms-2">
                      Document Name
                    </Form.Label>
                    <Form.Control
                      style={squareForm}
                      value={newFile.name}
                      placeholder="Name"
                      onChange={(e) => updateNewFile("name", e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label style={mediumBold} className="mb-0 ms-2">
                      Description
                    </Form.Label>
                    <Form.Control
                      style={squareForm}
                      value={newFile.description}
                      placeholder="Description"
                      onChange={(e) =>
                        updateNewFile("description", e.target.value)
                      }
                    />
                  </Form.Group>
                  <div className="text-center my-3">
                    <Button
                      variant="outline-primary"
                      style={smallPillButton}
                      as="p"
                      onClick={cancelDocumentEdit}
                      className="mx-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline-primary"
                      style={smallPillButton}
                      as="p"
                      onClick={saveNewFile}
                      className="mx-2"
                    >
                      Save Document
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    id="file"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={addFile}
                    className="d-none"
                  />
                  <label htmlFor="file">
                    <Button
                      variant="outline-primary"
                      style={smallPillButton}
                      as="p"
                    >
                      Add Document
                    </Button>
                  </label>
                </div>
              )}
              <Row>
                <Col>
                  <Form.Group
                    className="mx-2 my-3"
                    hidden={propertyState.filter((p) => p.checked).length <= 1}
                  >
                    <Form.Label style={mediumBold} className="mb-0 ms-2">
                      Split Method
                    </Form.Label>
                    <Form.Select
                      style={{
                        ...squareForm,
                        backgroundImage: `url(${ArrowDown})`,
                      }}
                      value={newUtility.split_type}
                      onChange={(e) => changeNewUtility(e, "split_type")}
                    >
                      <option value="uniform">Uniform</option>
                      <option value="tenant">By Tenant Count</option>
                      <option value="area">By Square Footage</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              {/* <Row>
                <Col>
                  <Form.Group className="mx-2 my-3">
                    <Form.Label style={mediumBold} className="mb-0 ms-2">
                      Message
                    </Form.Label>
                    <Form.Control
                      placeholder="M4METEST"
                      style={squareForm}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Elements stripe={stripePromise}>
                    <StripePayment
                      cancel={cancel}
                      submit={submit}
                      purchases={[purchase]}
                      message={message}
                      amount={amount}
                    />
                  </Elements>
                </Col>
              </Row> */}
            </Row>

            <div
              className="text-center my-2"
              style={errorMessage === "" ? hidden : {}}
            >
              <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
            </div>
          </div>
        ) : (
          ""
        )}

        {newUtility === null &&
        !editingUtility &&
        !expenseDetail &&
        !maintenanceExpenseDetail ? (
          <div className="mx-2 my-2 p-3">
            <div>
              <Row style={headings}>Utility Payments</Row>

              {expenses.map((expense) => {
                return expense.purchase_type === "UTILITY" ? (
                  <Row
                    className="my-2 p-3"
                    style={{
                      background: "#FFFFFF 0% 0% no-repeat padding-box",
                      boxShadow: "0px 3px 6px #00000029",
                      borderRadius: "5px",
                      opacity: 1,
                    }}
                    onClick={() => {
                      setExpenseDetail(true);
                      setPayment(expense);
                    }}
                  >
                    <Col
                      xs={3}
                      className="pt-4 justify-content-center align-items-center"
                      style={
                        (mediumBold,
                        {
                          color: "#007AFF",
                          border: "4px solid #007AFF",
                          borderRadius: "50%",
                          height: "83px",
                          width: "83px",
                        })
                      }
                    >
                      ${expense.amount_due.toFixed(2)}
                    </Col>
                    <Col style={mediumBold}>
                      <div>
                        {expense.description} -{" "}
                        {new Date(
                          String(expense.purchase_date).split(" ")[0]
                        ).toDateString()}
                      </div>
                      <div>{expense.address}</div>
                    </Col>
                  </Row>
                ) : (
                  <Row></Row>
                );
              })}
            </div>
            <div>
              <Row style={headings}> Maintenance Payments</Row>

              {expenses.map((expense) => {
                return expense.purchase_type === "MAINTENANCE" ||
                  expense.purchase_type === "REPAIRS" ? (
                  <Row
                    className="my-2 p-3"
                    style={
                      (mediumBold,
                      {
                        background: "#FFFFFF 0% 0% no-repeat padding-box",
                        boxShadow: "0px 3px 6px #00000029",
                        borderRadius: "5px",
                        opacity: 1,
                      })
                    }
                    onClick={() => {
                      setMaintenanceExpenseDetail(true);
                      setPayment(expense);
                    }}
                  >
                    <Col
                      xs={3}
                      className="pt-4 justify-content-center align-items-center"
                      style={{
                        color: "#007AFF",
                        border: "4px solid #007AFF",
                        borderRadius: "50%",
                        height: "83px",
                        width: "83px",
                      }}
                    >
                      ${expense.amount_due.toFixed(2)}
                    </Col>
                    <Col style={mediumBold}>
                      {expense.description} -{" "}
                      {new Date(
                        String(expense.purchase_date).split(" ")[0]
                      ).toDateString()}
                    </Col>
                  </Row>
                ) : (
                  <div></div>
                );
              })}
            </div>
          </div>
        ) : !expenseDetail && !maintenanceExpenseDetail ? (
          <div
            className="d-flex justify-content-center mb-4 mx-2 mb-2 p-3"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",

              opacity: 1,
            }}
          >
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
              onClick={addUtility}
              className="mx-2"
            >
              Add Utility
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>
      {expenseDetail && !maintenanceExpenseDetail ? (
        <div
          className="d-flex flex-column mx-2 p-3"
          style={{
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            opacity: 1,
            height: "100%",
          }}
        >
          {console.log(payment)}
          <Row
            className="my-2 align-items-center justify-content-center"
            style={headings}
          >
            {payment.bill_utility_type}
          </Row>
          <Row
            className="my-2 align-items-center justify-content-center"
            style={mediumBold}
          >
            {payment.bill_description}{" "}
          </Row>
          <Row className="my-2 align-items-center justify-content-center">
            <Col
              xs={3}
              className="pt-4 justify-content-center align-items-center"
              style={
                (mediumBold,
                {
                  color: "#007AFF",
                  border: "4px solid #007AFF",
                  borderRadius: "50%",
                  height: "83px",
                  width: "83px",
                })
              }
            >
              ${payment.amount_due.toFixed(2)}
            </Col>
          </Row>
          <Row className="my-2 mx-2" style={mediumBold}>
            Properties Billed:
          </Row>
          <Row
            className="my-2 mx-2 p-1"
            style={
              (mediumBold, { border: "1px solid #707070", borderRadius: "5px" })
            }
          >
            {payment.address}
          </Row>
          <Row className="d-flex my-2 mx-2" style={mediumBold}>
            <Col className="d-flex p-0 justify-content-left">Expense type:</Col>
            <Col className="d-flex p-0 justify-content-end">Utility</Col>
          </Row>
          <Row className="d-flex my-2 mx-2" style={mediumBold}>
            <Col className="d-flex p-0 justify-content-left">Split Method:</Col>
            <Col className="d-flex p-0 justify-content-end">
              {payment.bill_algorithm}
            </Col>
          </Row>
          <Row className="d-flex my-2 mx-2" style={mediumBold}>
            <Col className="d-flex p-0 justify-content-left">Bill Sent on:</Col>
            <Col className="d-flex p-0 justify-content-end">
              {new Date(
                String(payment.purchase_date).split(" ")[0]
              ).toDateString()}
            </Col>
          </Row>
          <Row className="d-flex my-2 mx-2" style={mediumBold}>
            <Col className="d-flex p-0 justify-content-left">
              Payment Status:
            </Col>
            {payment.purchase_status === "UNPAID" ? (
              <Col xs={3} className="mt-0" style={redPill}>
                {payment.purchase_status}
              </Col>
            ) : (
              <Col xs={3} className="mt-0" style={greenPill}>
                {payment.purchase_status}
              </Col>
            )}
          </Row>
          <Row className="d-flex my-5 mx-2">
            <Col></Col>
            <Col className="d-flex p-0 justify-content-center">
              <Button
                style={bluePillButton}
                onClick={() => setExpenseDetail(false)}
              >
                Okay
              </Button>
            </Col>
            <Col></Col>
          </Row>
          {/* {payment.purchase_status === "UNPAID" ? (
            <Row className="d-flex mx-2">
              <Col></Col>
              <Col xs={6} className="d-flex p-0 justify-content-center">
                <Button
                  style={bluePillButton}
                  onClick={() => {
                    navigate(`/managerPaymentPage/${payment.purchase_uid}`, {
                      state: {
                        amount: payment.amount_due,
                        selectedProperty: payment,
                        purchaseUID: payment.purchase_uid,
                      },
                    });
                  }}
                >
                  Paid by Manager
                </Button>
              </Col>
              <Col></Col>
            </Row>
          ) : (
            ""
          )} */}
        </div>
      ) : (
        ""
      )}
      {!expenseDetail && maintenanceExpenseDetail ? (
        <div
          className="d-flex flex-column mx-2 p-3"
          style={{
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            opacity: 1,
            height: "100%",
          }}
        >
          {console.log(payment)}
          <Row
            className="my-2 align-items-center justify-content-center"
            style={headings}
          >
            {payment.description}
          </Row>
          <Row
            className="my-2 align-items-center justify-content-center"
            style={mediumBold}
          >
            {payment.business_name}{" "}
          </Row>
          <Row className="my-2 align-items-center justify-content-center">
            <Col
              xs={3}
              className="pt-4 justify-content-center align-items-center"
              style={
                (mediumBold,
                {
                  color: "#007AFF",
                  border: "4px solid #007AFF",
                  borderRadius: "50%",
                  height: "83px",
                  width: "83px",
                })
              }
            >
              ${payment.amount_due.toFixed(2)}
            </Col>
          </Row>
          <Row className="my-2 mx-2" style={mediumBold}>
            Properties Billed:
          </Row>
          <Row
            className="my-2 mx-2 p-1"
            style={
              (mediumBold, { border: "1px solid #707070", borderRadius: "5px" })
            }
          >
            {payment.address}
          </Row>
          <Row className="d-flex my-2 mx-2" style={mediumBold}>
            <Col className="d-flex p-0 justify-content-left">Expense type:</Col>
            <Col className="d-flex p-0 justify-content-end">
              {Capitalize(payment.purchase_type)}
            </Col>
          </Row>
          <Row className="d-flex my-2 mx-2" style={mediumBold}>
            <Col className="d-flex p-0 justify-content-left">Bill Sent on:</Col>
            <Col className="d-flex p-0 justify-content-end">
              {new Date(
                String(payment.purchase_date).split(" ")[0]
              ).toDateString()}
            </Col>
          </Row>
          <Row className="d-flex my-2 mx-2" style={mediumBold}>
            <Col className="d-flex p-0 justify-content-left">
              Payment Status:
            </Col>
            {payment.purchase_status === "UNPAID" ? (
              <Col xs={3} className="mt-0" style={redPill}>
                {payment.purchase_status}
              </Col>
            ) : (
              <Col xs={3} className="mt-0" style={greenPill}>
                {payment.purchase_status}
              </Col>
            )}
          </Row>
          <Row className="d-flex my-5 mx-2">
            <Col></Col>
            <Col className="d-flex p-0 justify-content-center">
              <Button
                style={bluePillButton}
                onClick={() => setMaintenanceExpenseDetail(false)}
              >
                Okay
              </Button>
            </Col>
            <Col></Col>
          </Row>
          {payment.purchase_status === "UNPAID" ? (
            <Row className="d-flex mx-2">
              <Col></Col>
              <Col xs={6} className="d-flex p-0 justify-content-center">
                <Button
                  style={bluePillButton}
                  onClick={() => {
                    navigate(`/managerPaymentPage/${payment.purchase_uid}`, {
                      state: {
                        amount: payment.amount_due,
                        selectedProperty: payment,
                        purchaseUID: payment.purchase_uid,
                      },
                    });
                  }}
                >
                  Paid by Manager
                </Button>
              </Col>
              <Col></Col>
            </Row>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ManagerUtilities;
