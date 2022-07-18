import React from "react";
import { Form, Container, Button } from "react-bootstrap";
import EditIcon from "../icons/EditIcon.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import {
  squareForm,
  pillButton,
  smallPillButton,
  gray,
  red,
  small,
  hidden,
  mediumImg,
  smallImg,
} from "../utils/styles";

function BusinessContact(props) {
  const [contactState, setContactState] = props.state;
  let pageURL = window.location.href.split("/");
  const [newContact, setNewContact] = React.useState(null);
  const [editingContact, setEditingContact] = React.useState(null);
  const emptyContact = {
    first_name: "",
    last_name: "",
    company_role: "",
    phone_number: "",
    email: "",
  };
  const addContact = () => {
    if (
      newContact.first_name === "" ||
      newContact.last_name === "" ||
      newContact.company_role === "" ||
      newContact.phone_number === "" ||
      newContact.email === ""
    ) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    const newContactState = [...contactState];
    newContactState.push({ ...newContact });
    setContactState(newContactState);
    setNewContact(null);
    setErrorMessage("");
  };
  const cancelEdit = () => {
    setNewContact(null);
    setErrorMessage("");
    if (editingContact !== null) {
      const newContactState = [...contactState];
      newContactState.push(editingContact);
      setContactState(newContactState);
    }
    setEditingContact(null);
  };
  const editContact = (i) => {
    const newContactState = [...contactState];
    const contact = newContactState.splice(i, 1)[0];
    setContactState(newContactState);
    setEditingContact(contact);
    setNewContact({ ...contact });
  };
  const deleteContact = (i) => {
    const newContactState = [...contactState];
    newContactState.splice(i, 1);
    setContactState(newContactState);
  };
  const changeNewContact = (event, field) => {
    const changedContact = { ...newContact };
    changedContact[field] = event.target.value;
    setNewContact(changedContact);
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
      {contactState.map((contact, i) => (
        <div
          className="p-1 mb-2"
          style={{ boxShadow: " 0px 1px 6px #00000029", borderRadius: "5px" }}
          key={i}
        >
          {console.log("businesscontact", contactState)}
          <div className="d-flex">
            <div className="flex-grow-1">
              <h6 className="mb-1">
                {contact.first_name} {contact.last_name} ({contact.company_role}
                )
              </h6>
            </div>
            {pageURL[3] !== "owner" ? (
              <div>
                <img
                  src={EditIcon}
                  style={{ width: "15px", height: "25px" }}
                  alt="Edit"
                  className="px-1 mx-2"
                  onClick={() => editContact(i)}
                />
                <img
                  src={DeleteIcon}
                  alt="Delete"
                  className="px-1 mx-2"
                  onClick={() => deleteContact(i)}
                />
              </div>
            ) : (
              <div>
                <a href={`tel:${contact.phone_number}`}>
                  <img src={Phone} alt="Phone" style={smallImg} />
                </a>
                <a href={`mailto:${contact.email}`}>
                  <img src={Message} alt="Message" style={smallImg} />
                </a>
              </div>
            )}
          </div>
          <div className="d-flex">
            <div className="me-4">
              <p style={gray} className="mb-1">
                {contact.phone_number}
              </p>
            </div>
            <div>
              <p style={gray} className="mb-1">
                {contact.email}
              </p>
            </div>
          </div>
        </div>
      ))}
      {newContact !== null ? (
        <div>
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              First Name {newContact.first_name === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="First"
              value={newContact.first_name}
              onChange={(e) => changeNewContact(e, "first_name")}
            />
          </Form.Group>
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Last Name {newContact.last_name === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="Last"
              value={newContact.last_name}
              onChange={(e) => changeNewContact(e, "last_name")}
            />
          </Form.Group>
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Role at the company{" "}
              {newContact.company_role === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="Role"
              value={newContact.company_role}
              onChange={(e) => changeNewContact(e, "company_role")}
            />
          </Form.Group>
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Phone Number {newContact.phone_number === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="(xxx)xxx-xxxx"
              value={newContact.phone_number}
              onChange={(e) => changeNewContact(e, "phone_number")}
            />
          </Form.Group>
          <Form.Group className="mx-2 my-3">
            <Form.Label as="h6" className="mb-0 ms-2">
              Email Address {newContact.email === "" ? required : ""}
            </Form.Label>
            <Form.Control
              style={squareForm}
              placeholder="Email"
              value={newContact.email}
              onChange={(e) => changeNewContact(e, "email")}
            />
          </Form.Group>
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
      {pageURL[3] !== "owner" ? (
        newContact === null ? (
          <Button
            variant="outline-primary"
            style={smallPillButton}
            onClick={() => setNewContact({ ...emptyContact })}
          >
            Add Another Person
          </Button>
        ) : (
          <div className="d-flex justify-content-center my-4">
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
              onClick={addContact}
              className="mx-2"
            >
              Add Contact
            </Button>
          </div>
        )
      ) : (
        ""
      )}
    </div>
  );
}

export default BusinessContact;
