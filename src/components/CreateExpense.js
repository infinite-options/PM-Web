import React from "react";
import { Form, Button } from "react-bootstrap";
import { squareForm, pillButton, small, hidden, red } from "../utils/styles";
import ArrowDown from "../icons/ArrowDown.svg";
import { post, put } from "../utils/api";

function CreateExpense(props) {
  const { property, reload } = props;
  const [category, setCategory] = React.useState("Management");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [frequency, setFrequency] = React.useState("Monthly");
  const [frequencyOfPayment, setFrequencyOfPayment] =
    React.useState("Once a month");
  const [date, setDate] = React.useState("");

  const submitForm = async () => {
    if (amount === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    if (category === "Mortgage") {
      let mortgage = [];
      const files = property.images;
      const newMortgage = {
        category: category,
        title: title,
        description: description,
        amount: amount,
        frequency: frequency,
        frequency_of_payment: frequencyOfPayment,
        next_date: date,
      };
      mortgage.push(newMortgage);
      console.log(newMortgage);
      // let formData = new FormData();
      const updateMortgage = {
        property_uid: property.property_uid,
        mortgages: JSON.stringify(newMortgage),
      };

      const response = await put("/properties", updateMortgage, null, files);
      reload();
      props.back();
    } else if (category === "Insurance") {
      let insurance =
        property.insurance == null ? [] : JSON.parse(property.insurance);
      // console.log(insurance);
      const files = property.images;
      const newInsurance = {
        category: category,
        title: title,
        description: description,
        amount: amount,
        frequency: frequency,
        frequency_of_payment: frequencyOfPayment,
        next_date: date,
      };
      insurance.push(newInsurance);
      // console.log(insurance);
      const updateInsurance = {
        property_uid: property.property_uid,
        insurance: JSON.stringify(insurance),
      };

      const response = await put("/properties", updateInsurance, null, files);
      reload();
      props.back();
    } else if (category === "Tax") {
      let taxes = property.taxes == null ? [] : JSON.parse(property.taxes);
      // console.log(taxes);
      const files = property.images;
      const newTax = {
        category: category,
        title: title,
        description: description,
        amount: amount,
        frequency: frequency,
        frequency_of_payment: frequencyOfPayment,
        next_date: date,
      };
      taxes.push(newTax);
      // console.log(taxes);
      const updateTaxes = {
        property_uid: property.property_uid,
        taxes: JSON.stringify(taxes),
      };
      const response = await put("/properties", updateTaxes, null, files);
      reload();
      props.back();
    } else {
      const newExpense = {
        pur_property_id: property.property_uid,
        payer: property.owner_id,
        receiver: property.property_uid,
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
      props.back();
    }
  };
  const [errorMessage, setErrorMessage] = React.useState("");
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  return (
    <div>
      <h5>Add New Expense Payment</h5>
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
          <option>Insurance</option>
          <option>Mortgage</option>
          <option>Tax</option>
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
      <div className="d-flex justify-content-center my-4">
        <Button
          variant="outline-primary"
          style={pillButton}
          onClick={props.back}
          className="mx-2"
        >
          Cancel
        </Button>
        <Button
          variant="outline-primary"
          style={pillButton}
          onClick={submitForm}
          className="mx-2"
        >
          Save Expense
        </Button>
      </div>
    </div>
  );
}

export default CreateExpense;
