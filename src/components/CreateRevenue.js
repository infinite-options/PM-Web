import React from "react";
import { Form, Button } from "react-bootstrap";
import { squareForm, pillButton, small, hidden, red } from "../utils/styles";
import ArrowDown from "../icons/ArrowDown.svg";
import { post } from "../utils/api";

function CreateRevenue(props) {
  const { property, reload } = props;
  const [category, setCategory] = React.useState("Management");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [frequency, setFrequency] = React.useState("Monthly");
  const [frequencyOfPayment, setFrequencyOfPayment] = React.useState("");
  const [date, setDate] = React.useState("");
  // React.useEffect(() => {
  //   if (frequency === "Monthly") {
  //     const newFrequencyOfPayment = frequencyOfPayment.replace("year", "month");
  //     setFrequencyOfPayment(newFrequencyOfPayment);
  //   } else if (frequency === "Annually") {
  //     const newFrequencyOfPayment = frequencyOfPayment.replace("month", "year");
  //     setFrequencyOfPayment(newFrequencyOfPayment);
  //   } else {
  //     const newFrequencyOfPayment = "One-time";
  //     setFrequencyOfPayment(newFrequencyOfPayment);
  //   }
  // }, [frequency]);
  const submitForm = async () => {
    if (amount === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    const newRevenue = {
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

    console.log(newRevenue);
    const response = await post("/createRevenues", newRevenue);
    reload();
    props.back();
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
      <h5>Add New Revenue Payment</h5>
      <Form.Group className="mx-2 my-3">
        <Form.Label as="h6" className="mb-0 ms-2">
          Category
        </Form.Label>
        <Form.Select
          style={{ ...squareForm, backgroundImage: `url(${ArrowDown})` }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
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
          placeholder="Payment description"
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
            Payment Date{date === "" ? required : ""}
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
          Save Revenue
        </Button>
      </div>
    </div>
  );
}

export default CreateRevenue;
