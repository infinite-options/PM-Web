import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppContext from "../../AppContext";
import ArrowDown from "../../icons/ArrowDown.svg";
import {
  squareForm,
  pillButton,
  small,
  hidden,
  red,
  formLabel,
  subHeading,
} from "../../utils/styles";
import { post, put } from "../../utils/api";

function ManagerCreateExpense(props) {
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const { properties } = props;
  const [category, setCategory] = useState("Management");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("Monthly");
  const [frequencyOfPayment, setFrequencyOfPayment] = useState("Once a month");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [date, setDate] = useState("");
  const [payerID, setPayerID] = useState("");
  const [payer, setPayer] = useState("");
  const [percentageSplitOwner, setPercentageSplitOwner] = useState(0);
  const [percentageSplitTenant, setPercentageSplitTenant] = useState(0);
  const [percentageSplitManager, setPercentageSplitManager] = useState(0);
  const [payStatus, setPayStatus] = useState("UNPAID");
  const [addToRent, setAddToRent] = useState(false);
  const reload = () => {
    props.onSubmit();
  };
  const submitForm = async (sp) => {
    if (amount === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    if (
      parseInt(percentageSplitManager) +
        parseInt(percentageSplitOwner) +
        parseInt(percentageSplitTenant) !==
      100
    ) {
      console.log(
        parseInt(
          percentageSplitManager + percentageSplitOwner + percentageSplitTenant
        )
      );
      setErrorMessage("Check your percentages");
      return;
    }
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
    let selectedProperty = sp == undefined ? properties : JSON.parse(sp);
    let today_date = new Date().toISOString().split("T")[0];
    if (addToRent) {
      setDate("0000-00-00 00:00:00");
    }
    const newExpense = {
      pur_property_id: selectedProperty.property_uid,
      payer: payer,
      // receiver: receiver,
      payerID: payerID,
      // receiverID: receiverID,
      ownerID: selectedProperty.owner_id,
      managerID: selectedProperty.manager_id,
      tenantID:
        selectedProperty.rentalInfo.length !== 0
          ? selectedProperty.rentalInfo[0].tenant_id
          : "",
      splitPercentManager: percentageSplitManager,
      splitPercentOwner: percentageSplitOwner,
      splitPercentTenant: percentageSplitTenant,
      purchase_type: category,
      description: description,
      amount_due: amount,
      purchase_frequency: frequency,
      payment_frequency:
        frequency == "One-time" ? "One-time" : frequencyOfPayment,
      next_payment: frequency == "One-time" ? today_date : date,
      purchase_status: payStatus,
    };

    console.log(newExpense);
    const response = await post("/createExpenses", newExpense);
    reload();
    // }
  };
  function decycle(obj, stack = []) {
    if (!obj || typeof obj !== "object") return obj;

    if (stack.includes(obj)) return null;

    let s = stack.concat([obj]);

    return Array.isArray(obj)
      ? obj.map((x) => decycle(x, s))
      : Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, decycle(v, s)])
        );
  }

  const [errorMessage, setErrorMessage] = useState("");
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );

  console.log(
    new Date().toISOString().split("T")[0] +
      " " +
      new Date().toISOString().split("T")[1].substring(0, 8)
  );
  return (
    <div className="d-flex flex-column w-100 p-2 overflow-hidden">
      <h5 className="m-2">Add New Expense Payment</h5>
      <Form.Group
        className="p-2"
        style={{
          background: "#F3F3F3 0% 0% no-repeat padding-box",
          borderRadius: "5px",
        }}
      >
        <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
          Property {required}
        </Form.Label>
        {properties.length > 0 ? (
          <Form.Select
            style={squareForm}
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
          >
            <option key="blankChoice" hidden value>
              Search Your Properties
            </option>
            {properties.map((property, i) => (
              <option key={i} value={JSON.stringify(decycle(property))}>
                {property.address}
                {property.unit !== "" ? " " + property.unit : ""},&nbsp;
                {property.city},&nbsp;{property.state} {property.zip}
              </option>
            ))}
          </Form.Select>
        ) : (
          <Row style={formLabel} as="h5" className="ms-1 mb-0">
            {properties.address} {properties.unit}
            ,&nbsp;
            {properties.city}
            ,&nbsp;
            {properties.state}&nbsp; {properties.zip}
          </Row>
        )}
      </Form.Group>
      <Form.Group className="mx-2 my-3">
        <Form.Label as="h6" className="mb-0 ms-2">
          Category
        </Form.Label>
        <Form.Select
          style={{ ...squareForm, backgroundImage: `url(${ArrowDown})` }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Management</option>
          <option>Maintenance</option>
          <option>Repairs</option>
          <option>Rent</option>
          <option>Extra Charges</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mx-2 my-3">
        <Form.Label as="h6" className="mb-0 ms-2">
          Description
        </Form.Label>
        <Form.Control
          style={squareForm}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mx-2 my-3">
        <Form.Label as="h6" className="mb-0 ms-2">
          Amount {amount === "" ? required : ""}
        </Form.Label>
        <Form.Control
          style={squareForm}
          placeholder="200"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Form.Group>
      {category === "Insurance" ? (
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Frequency
          </Form.Label>
          <Form.Select
            style={{ ...squareForm, backgroundImage: `url(${ArrowDown})` }}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option>Monthly</option>
            <option>Annually</option>
          </Form.Select>
        </Form.Group>
      ) : category === "Mortgage" ? (
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Frequency
          </Form.Label>
          <Form.Select
            style={{ ...squareForm, backgroundImage: `url(${ArrowDown})` }}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option>Weekly</option>
            <option>Monthly</option>
          </Form.Select>
        </Form.Group>
      ) : category === "Tax" ? (
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Frequency
          </Form.Label>
          <Form.Select
            style={{ ...squareForm, backgroundImage: `url(${ArrowDown})` }}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option>Monthly</option>
            <option>Annually</option>
          </Form.Select>
        </Form.Group>
      ) : (
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Frequency
          </Form.Label>
          <Form.Select
            style={{ ...squareForm, backgroundImage: `url(${ArrowDown})` }}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option>Monthly</option>
            <option>Annually</option>
            <option>One-time</option>
          </Form.Select>
        </Form.Group>
      )}
      <Form.Group className="mx-2 my-3">
        <Form.Label as="h6" className="mb-0 ms-2">
          Frequency of payment
        </Form.Label>

        {frequency === "One-time" ? (
          <Form.Select
            style={{ ...squareForm, backgroundImage: `url(${ArrowDown})` }}
            value={frequencyOfPayment}
            onChange={(e) => setFrequencyOfPayment(e.target.value)}
          >
            <option>One-time</option>
          </Form.Select>
        ) : frequency === "Monthly" ? (
          <Form.Select
            style={{ ...squareForm, backgroundImage: `url(${ArrowDown})` }}
            value={frequencyOfPayment}
            onChange={(e) => setFrequencyOfPayment(e.target.value)}
          >
            <option>Once a month</option>
            <option>Twice a month</option>
          </Form.Select>
        ) : frequency === "Annually" ? (
          <Form.Select
            style={{ ...squareForm, backgroundImage: `url(${ArrowDown})` }}
            value={frequencyOfPayment}
            onChange={(e) => setFrequencyOfPayment(e.target.value)}
          >
            <option>Once a year</option>
            <option>Twice a year</option>
          </Form.Select>
        ) : (
          <div></div>
        )}
      </Form.Group>
      {frequency === "One-time" ? (
        <div>
          {" "}
          <Form.Group className="mx-2 mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              style={subHeading}
              label="Pay with next rent"
              onChange={(e) => setAddToRent(!addToRent)}
            />
          </Form.Group>
        </div>
      ) : (
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Payment Date {date === "" ? required : ""}
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="200"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Form.Group className="mx-2 mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              style={subHeading}
              label="Pay with next rent"
              onChange={(e) => setAddToRent(!addToRent)}
            />
          </Form.Group>
        </Form.Group>
      )}
      {category === "Management" ||
      category === "Maintenance" ||
      category === "Repairs" ? (
        <div>
          {console.log(JSON.parse(selectedProperty))}
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Payer
            </Form.Label>
            <Row>
              <Col xs={4}>
                {" "}
                <Form.Check
                  inline
                  label="Owner"
                  name="group1"
                  type="radio"
                  id="inline-radio-1"
                  onChange={(e) => {
                    setPayerID(JSON.parse(selectedProperty).owner_id);
                    setPayer("OWNER");
                  }}
                />
              </Col>

              {JSON.parse(selectedProperty) !== null &&
              JSON.parse(selectedProperty).rentalInfo.length != 0 ? (
                <Col xs={4}>
                  {" "}
                  <Form.Check
                    inline
                    label="Tenant"
                    name="group1"
                    type="radio"
                    id="inline-radio-2"
                    onChange={(e) => {
                      setPayerID(
                        JSON.parse(selectedProperty).rentalInfo[0].tenant_id
                      );
                      setPayer("TENANT");
                    }}
                  />
                </Col>
              ) : (
                ""
              )}
              {JSON.parse(selectedProperty) !== null ? (
                <Col xs={4}>
                  <Form.Check
                    inline
                    name="group1"
                    label="Property Manager"
                    type="radio"
                    id="inline-radio-3"
                    onChange={(e) => {
                      setPayerID(JSON.parse(selectedProperty).manager_id);
                      setPayer("PROPERTY MANAGER");
                    }}
                  />
                </Col>
              ) : (
                ""
              )}
            </Row>
          </Form.Group>
        </div>
      ) : (
        ""
      )}
      {category === "Management" ||
      category === "Maintenance" ||
      category === "Repairs" ? (
        <div>
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Receiver
            </Form.Label>{" "}
            <Row>
              <Col xs={4}>
                <Form.Group className="mx-2 my-3 d-flex flex-row">
                  <Form.Control
                    style={(squareForm, { width: "20%", marginRight: "1rem" })}
                    placeholder="%"
                    value={percentageSplitOwner}
                    onChange={(e) => setPercentageSplitOwner(e.target.value)}
                  />
                  Owner
                  {/* <Form.Check
                    inline
                    label="Owner"
                    name="group2"
                    type="radio"
                    id="inline-radio-1"
                    onChange={(e) => {
                      setReceiverID(JSON.parse(selectedProperty).owner_id);
                      setReceiver("OWNER");
                    }}
                  /> */}
                </Form.Group>
              </Col>

              {JSON.parse(selectedProperty) !== null &&
              JSON.parse(selectedProperty).rentalInfo.length != 0 ? (
                <Col>
                  <Form.Group className="mx-2 my-3 d-flex flex-row">
                    <Form.Control
                      style={
                        (squareForm, { width: "20%", marginRight: "1rem" })
                      }
                      placeholder="%"
                      value={percentageSplitTenant}
                      onChange={(e) => setPercentageSplitTenant(e.target.value)}
                    />
                    Tenant
                    {/* <Form.Check
                      inline
                      label="Tenant"
                      name="group2"
                      type="radio"
                      id="inline-radio-2"
                      onChange={(e) => {
                        setReceiverID(
                          JSON.parse(selectedProperty).rentalInfo[0].tenant_id
                        );
                        setReceiver("TENANT");
                      }}
                    /> */}
                  </Form.Group>
                </Col>
              ) : (
                ""
              )}

              {JSON.parse(selectedProperty) !== null ? (
                <Col xs={4}>
                  <Form.Group className="mx-2 my-3 d-flex flex-row">
                    <Form.Control
                      style={
                        (squareForm, { width: "20%", marginRight: "1rem" })
                      }
                      placeholder="%"
                      value={percentageSplitManager}
                      onChange={(e) =>
                        setPercentageSplitManager(e.target.value)
                      }
                    />
                    Property Manager
                    {/* <Form.Check
                      inline
                      name="group2"
                      label="Property Manager"
                      type="radio"
                      id="inline-radio-3"
                      onChange={(e) => {
                        setReceiverID(JSON.parse(selectedProperty).manager_id);
                        setReceiver("PROPERTY MANAGER");
                      }}
                    /> */}
                  </Form.Group>
                </Col>
              ) : (
                ""
              )}
            </Row>
          </Form.Group>
        </div>
      ) : (
        ""
      )}
      <Form.Group className="mx-2 my-3">
        <Form.Label as="h6" className="mb-0 ms-2">
          Payment Status
        </Form.Label>{" "}
        <Form.Check
          inline
          label="Paid"
          name="group3"
          type="radio"
          id="inline-radio-1"
          onChange={(e) => setPayStatus("PAID")}
        />
        <Form.Check
          inline
          label="Unpaid"
          name="group3"
          type="radio"
          id="inline-radio-2"
          onChange={(e) => setPayStatus("UNPAID")}
        />
      </Form.Group>
      <div className="text-center" style={errorMessage === "" ? hidden : {}}>
        <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
      </div>
      <div className="d-flex justify-content-center mt-2 mb-5">
        <Button
          variant="outline-primary"
          style={pillButton}
          onClick={props.cancel}
          className="mx-2"
        >
          Cancel
        </Button>
        <Button
          variant="outline-primary"
          style={pillButton}
          onClick={() => submitForm(selectedProperty)}
          className="mx-2"
        >
          Save Expense
        </Button>
      </div>
    </div>
  );
}

export default ManagerCreateExpense;
