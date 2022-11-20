import React, { useState, useContext, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
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
  const reload = () => {
    props.onSubmit();
  };
  const submitForm = async (sp) => {
    if (amount === "") {
      setErrorMessage("Please fill out all fields");
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
    let selectedProperty = JSON.parse(sp);
    // if (category === "Mortgage") {
    //   let mortgage = [];
    //   const files = selectedProperty.images;
    //   const newMortgage = {
    //     category: category,
    //     title: title,
    //     description: description,
    //     amount: amount,
    //     frequency: frequency,
    //     frequency_of_payment: frequencyOfPayment,
    //     next_date: date,
    //   };
    //   mortgage.push(newMortgage);
    //   console.log(newMortgage);
    //   // let formData = new FormData();
    //   const updateMortgage = {
    //     property_uid: selectedProperty.property_uid,
    //     mortgages: JSON.stringify(newMortgage),
    //   };

    //   const response = await put("/properties", updateMortgage, null, files);
    //   reload();
    // } else if (category === "Insurance") {
    //   let insurance =
    //     selectedProperty.insurance == null
    //       ? []
    //       : JSON.parse(selectedProperty.insurance);
    //   // console.log(insurance);
    //   const files = selectedProperty.images;
    //   const newInsurance = {
    //     category: category,
    //     title: title,
    //     description: description,
    //     amount: amount,
    //     frequency: frequency,
    //     frequency_of_payment: frequencyOfPayment,
    //     next_date: date,
    //   };
    //   insurance.push(newInsurance);
    //   // console.log(insurance);
    //   const updateInsurance = {
    //     property_uid: selectedProperty.property_uid,
    //     insurance: JSON.stringify(insurance),
    //   };

    //   const response = await put("/properties", updateInsurance, null, files);
    //   reload();
    // } else if (category === "Tax") {
    //   let taxes =
    //     selectedProperty.taxes == null
    //       ? []
    //       : JSON.parse(selectedProperty.taxes);
    //   // console.log(taxes);
    //   const files = selectedProperty.images;
    //   const newTax = {
    //     category: category,
    //     title: title,
    //     description: description,
    //     amount: amount,
    //     frequency: frequency,
    //     frequency_of_payment: frequencyOfPayment,
    //     next_date: date,
    //   };
    //   taxes.push(newTax);
    //   // console.log(taxes);
    //   const updateTaxes = {
    //     property_uid: selectedProperty.property_uid,
    //     taxes: JSON.stringify(taxes),
    //   };
    //   const response = await put("/properties", updateTaxes, null, files);
    //   reload();
    // } else {
    const newExpense = {
      pur_property_id: selectedProperty.property_uid,
      payer: management_buid,
      receiver: selectedProperty.property_uid,
      purchase_type: category,
      // title: title,
      description: description,
      amount_due: amount,
      purchase_frequency: frequency,
      payment_frequency: frequencyOfPayment,
      next_payment: date,
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
          {/* <option>Insurance</option>
          <option>Mortgage</option>
          <option>Tax</option> */}
        </Form.Select>
      </Form.Group>
      {category === "Insurance" ||
      category === "Mortgage" ||
      category === "Tax" ? (
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Title {title === "" ? required : ""}
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
      ) : (
        ""
      )}
      {/* <Form.Group className="mx-2 my-3">
        <Form.Label as="h6" className="mb-0 ms-2">
          Title {title === "" ? required : ""}
        </Form.Label>
        <Form.Control
          style={squareForm}
          placeholder="Painting"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group> */}
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
      {/* <Form.Group className="mx-2 my-3">
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
      </Form.Group> */}
      <Form.Group className="mx-2 my-3">
        <Form.Label as="h6" className="mb-0 ms-2">
          Frequency of payment
        </Form.Label>

        {frequency === "Monthly" &&
        (category === "Insurance" ||
          category === "Mortgage" ||
          category === "Tax") ? (
          <Form.Select
            style={{ ...squareForm, backgroundImage: `url(${ArrowDown})` }}
            value={frequencyOfPayment}
            onChange={(e) => setFrequencyOfPayment(e.target.value)}
          >
            <option>Once a month</option>
            <option>Twice a month</option>
          </Form.Select>
        ) : frequency === "Annually" &&
          (category === "Insurance" ||
            category === "Mortgage" ||
            category === "Tax") ? (
          <Form.Select
            style={{ ...squareForm, backgroundImage: `url(${ArrowDown})` }}
            value={frequencyOfPayment}
            onChange={(e) => setFrequencyOfPayment(e.target.value)}
          >
            <option>Once a year</option>
            <option>Twice a year</option>
          </Form.Select>
        ) : frequency === "Weekly" && category === "Mortgage" ? (
          <Form.Select
            style={{ ...squareForm, backgroundImage: `url(${ArrowDown})` }}
            value={frequencyOfPayment}
            onChange={(e) => setFrequencyOfPayment(e.target.value)}
          >
            <option>Once a week</option>
            <option>Every other week</option>
          </Form.Select>
        ) : frequency === "One-time" ? (
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
            <option>Every other month</option>
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
        <div></div>
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
        </Form.Group>
      )}
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
