import { useState } from "react";
import { Input } from "./Input";
import { get, post } from "../utils/api";
import "./ownerComponents/ownerstab.css";

export default function App() {
  const [form, setForm] = useState({
    Firstname: "",
    Lastname: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    Firstname: [],
    Lastname: [],
    email: [],
    phone: [],
    message: [],
  });

  const checkRules = (input, rules) => {
    let errors = [];
    let value = input;
    if (typeof value === "string") value = input.trim();

    if (rules.required) {
      if (value === "") errors.push("*This field is required.");
    }
    if (rules.phone) {
      let phoneno = new RegExp(/^\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/);
      if (!phoneno.test(value))
        errors.push("*Please Enter valid phone number XXX-XXX-XXXX");
    }
    if (rules.email) {
      let pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(value)) errors.push("*Please enter a valid email.");
    }

    return errors;
  };

  const checkFormValidation = (f) => {
    const errors = {};

    errors.Firstname = checkRules(f.Firstname, { required: true });
    errors.Lastname = checkRules(f.Lastname, { required: true });
    errors.phone = checkRules(f.phone, { phone: true });
    errors.email = checkRules(f.email, { email: true });
    errors.message = checkRules(f.message, { message: true });

    for (const [, value] of Object.entries(errors)) {
      if (value.length > 0) return { noErrors: false, errors };
    }

    return { noErrors: true, errors };
  };

  const handleSubmit = async (f) => {
    const { errors, noErrors } = checkFormValidation(f);
    setErrors(errors);
    if (noErrors) {
      alert("You Have Signed Up!");
    }
    const SignUpInfo = {
      first_name: f.Firstname,
      last_name: f.Lastname,
      message: f.message,
      email: f.email,
      phone_no: f.phone,
    };
    await post("/signUpForm", SignUpInfo);
  };
  return (
    <div>
      <div style={{ display: "grid", placeItems: "center" }}>
        <Input
          name="First Name"
          value={form.Firstname}
          errors={errors.Firstname}
          onChange={(e) => setForm({ ...form, Firstname: e.target.value })}
        />
        <Input
          name="Last Name"
          value={form.Lastname}
          errors={errors.Lastname}
          onChange={(e) => setForm({ ...form, Lastname: e.target.value })}
        />
        <Input
          name="Email"
          value={form.email}
          errors={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          name="Phone"
          value={form.phone}
          errors={errors.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Input
          className="messageinput"
          name="Message"
          value={form.message}
          errors={errors.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <br />
        <button className="buttons" onClick={() => handleSubmit(form)}>
          Sign Up
        </button>
      </div>
    </div>
  );
}
