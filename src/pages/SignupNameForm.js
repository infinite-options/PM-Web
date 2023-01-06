import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import Header from "../components/Header";
import { pillButton, boldSmall, hidden, red, small } from "../utils/styles";

function SignupNameForm(props) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const submitForm = () => {
    if (firstName === "" || lastName === "" || phoneNumber === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    setErrorMessage("");
    props.onConfirm(firstName, lastName, phoneNumber);
  };
  const goToLogin = () => {
    navigate("/login");
  };
  function formatPhoneNumber(value) {
    // if input value is falsy eg if the user deletes the input, then just return
    if (!value) return value;

    // clean the input for any non-digit values.
    const phoneNumber = value.replace(/[^\d]/g, "");

    // phoneNumberLength is used to know when to apply our formatting for the phone number
    const phoneNumberLength = phoneNumber.length;

    // we need to return the value with no formatting if its less then four digits
    // this is to avoid weird behavior that occurs if you  format the area code to early
    if (phoneNumberLength < 4) return phoneNumber;

    // if phoneNumberLength is greater than 4 and less the 7 we start to return
    // the formatted number
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }

    // finally, if the phoneNumberLength is greater then seven, we add the last
    // bit of formatting and return it.
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  }
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  return (
    <div className="h-100 d-flex flex-column">
      {/* <Header title="Sign Up" leftText="< Back" leftFn={props.back} /> */}
      <div>
        <Form>
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h5" className="ms-1 mb-0">
              First Name {firstName === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={{ borderRadius: 0 }}
              placeholder="First"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h5" className="ms-1 mb-0">
              Last Name {lastName === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={{ borderRadius: 0 }}
              placeholder="Last"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h5" className="ms-1 mb-0">
              Phone Number {phoneNumber === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={{ borderRadius: 0 }}
              placeholder="(xxx)xxx-xxxx"
              value={phoneNumber}
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              onChange={(e) =>
                setPhoneNumber(formatPhoneNumber(e.target.value))
              }
            />
          </Form.Group>
        </Form>
        <div className="text-center" style={errorMessage === "" ? hidden : {}}>
          <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
        </div>
        <div className="text-center mt-5">
          <Button
            variant="outline-primary"
            onClick={submitForm}
            style={pillButton}
          >
            Proceed
          </Button>
        </div>
      </div>
      <div className="flex-grow-1 d-flex flex-column justify-content-end">
        <div className="text-center">
          <p style={boldSmall} className="mb-1">
            Already have an account?
          </p>
          <Button
            variant="outline-primary"
            onClick={goToLogin}
            style={pillButton}
            className="mb-4"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SignupNameForm;
