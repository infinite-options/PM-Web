import React from "react";
import { Form, Container, Button, Tab } from "react-bootstrap";
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
  smallImg,
} from "../utils/styles";

const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px",
      border: "0.5px solid grey ",
    },
  },
});

function BusinessContact(props) {
  const classes = useStyles();
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
  const handlePhoneNumber = (event, field) => {
    const changedContact = { ...newContact };
    changedContact[field] = formatPhoneNumber(event.target.value);
    setNewContact(changedContact);
  };
  return (
    <div>
      {console.log(contactState)}
      {contactState.length !== 0 ? (
        <Table classes={{ root: classes.customTable }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Contact Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contactState.map((contact, i) => (
              <TableRow key={i}>
                <TableCell>
                  {contact.first_name} {contact.last_name}
                </TableCell>
                <TableCell>{contact.company_role}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone_number}</TableCell>

                {pageURL[3] !== "propertyDetails" ? (
                  <TableCell>
                    <img
                      src={EditIcon}
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
                  </TableCell>
                ) : (
                  <TableCell>
                    <a href={`tel:${contact.phone_number}`}>
                      <img src={Phone} alt="Phone" style={smallImg} />
                    </a>
                    <a href={`mailto:${contact.email}`}>
                      <img src={Message} alt="Message" style={smallImg} />
                    </a>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        ""
      )}

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
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              value={newContact.phone_number}
              //  onChange={(e) => changeNewContact(e, "phone_number")}
              onChange={(e) => handlePhoneNumber(e, "phone_number")}
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
      {pageURL[3] !== "propertyDetails" ? (
        newContact === null ? (
          <Button
            variant="outline-primary"
            style={smallPillButton}
            onClick={() => setNewContact({ ...emptyContact })}
          >
            Add Person
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
