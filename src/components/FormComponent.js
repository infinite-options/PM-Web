// import React from 'react'
// import "../components/ownerComponentt/ownerstab.css";
// const emailState = {
//     email: '',
//     error: ''
// }
// class FormComponent extends React.Component {  
    
//     constructor(){
//         super();
//         this.state = emailState;
//         this.onChange = this.onChange.bind(this);
//     }
//     onChange(e) {
//         this.setState({
//             email : e.target.value
//         });
//     }
//     emailValidation(){
//         const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
//         if(!this.state.email || regex.test(this.state.email) === false){
//             this.setState({
//                 error: "Email is not valid"
//             });
//             return false;
//         }
//         return true;
//     }
//     onSubmit(){
//         if(this.emailValidation()){
//             console.log(this.state);
//             this.setState(emailState);
//         }
//     }
//     render(){
//         return(
//             <div>
//                 <div className='signupinput'>
//                     <div className="d-flex justify-content-center flex-column">
//                         {/* <label>Enter your email here *</label> */}
//                         <input type="email" name="email" placeholder='example@gmail.com' value={this.state.email} onChange={this.onChange} className="inputval" />
//                         <input type="email" name="email" placeholder='example@gmail.com' value={this.state.email} onChange={this.onChange} className="inputval" />
//                         <span className="text-danger">{this.state.error}</span>
//                     </div>
//                     <div className="d-inline-block justify-content-center align-items-center">
//                         <button type="submit" className="btns" onClick={()=>this.onSubmit()}><span className='buttondescription'>Sign Up</span></button>
//                     </div>
//                 </div>
                
                
                  
//             </div>
//         )  
//     }
// }  
   
// export default FormComponent;



// import { useState } from 'react';
// import { get, post } from "../utils/api";
// import "../components/ownerComponentt/ownerstab.css";
// export default function Form() {

// // States for registration
// const [firstname, setFirstName] = useState('');
// const [lastname, setLastName] = useState('');
// const [email, setEmail] = useState('');
// const [phonenumber, setPhoneNumber] = useState('');
// const [message, setMessage] = useState('');

// // States for checking the errors
// const [submitted, setSubmitted] = useState(false);
// const [error, setError] = useState(false);

// // Handling the name change
// const handleFirstName = (e) => {
// 	setFirstName(e.target.value);
// 	setSubmitted(false);
// };
// const handleLastName = (e) => {
// 	setLastName(e.target.value);
// 	setSubmitted(false);
// };

// // Handling the email change
// const handleEmail = (e) => {
// 	setEmail(e.target.value);
// 	setSubmitted(false);
// };

// // Handling the password change
// const handlePhoneNumber = (e) => {
// 	setPhoneNumber(e.target.value);
// 	setSubmitted(false);
// };
// const handleMessage = (e) => {
// 	setMessage(e.target.value);
// 	setSubmitted(false);
// };

// // Handling the form submission
// const handleSubmit = async (e) => {
// 	e.preventDefault();
// 	if (firstname === ''  || lastname === '' || email === '' || phonenumber === '' || message === '') {
// 	setError(true);
// 	} else {
// 	setSubmitted(true);
// 	setError(false);
// 	}
//     const SignUpInfo = {
//         first_name: firstname,
//         last_name: lastname,
//         message: message,
//         email: email,
//         phone_no: phonenumber,

//     }
//     await post("/signUpForm", SignUpInfo);
    
// };
    
// // Showing success message
// const successMessage = () => {
// 	return (
// 	<div
// 		className="success"
// 		style={{
// 		display: submitted ? '' : 'none',
// 		}}>
// 		<h1>User {firstname} successfully registered!!</h1>
// 	</div>
// 	);
// };

// // Showing error message if error is true
// const errorMessage = () => {
// 	return (
// 	<div
// 		className="error"
// 		style={{
// 		display: error ? '' : 'none',
// 		}}>
// 		<h1>Please enter all the fields</h1>
// 	</div>
// 	);
// };

// return (
// 	<div className="form">

// 	<div className="messages">
// 		{errorMessage()}
// 		{successMessage()}
// 	</div>
//         <div className='inputval'>
//             <div className="d-flex justify-content-center flex-column">
//                 <label className="label">First Name</label>
//                 <input onChange={handleFirstName} className="input"
//                 value={firstname} type="text" />
//                 <label className="label">Last Name</label>
//                 <input onChange={handleLastName} className="input"
//                 value={lastname} type="text" />
//                 <label className="label">Email</label>
//                 <input onChange={handleEmail} className="input"
//                 value={email} type="email" />

//                 <label className="label">Phone Number</label>
//                 <input onChange={handlePhoneNumber} className="input"
//                 value={phonenumber} type="email" />
//                 <label className="label">Message</label>
//                 <input onChange={handleMessage} className="messageinput"
//                 value={message} type="email" />
//             </div>
            
//             <div className="d-inline-block justify-content-center align-items-center">
//                 <button className="btn" onClick={handleSubmit}  type="submit">
//                 Submit
//                 </button>
//             </div>
            
            
//         </div>
// 	</div>
// );
// }

import { useState } from "react";
import { Input } from "./Input";
import { get, post } from "../utils/api";
import "../components/ownerComponentt/ownerstab.css";

export default function App() {
  const [form, setForm] = useState({ Firstname: "",Lastname: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({ Firstname: [], Lastname: [], email: [], phone: [], message: [] });

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

  const handleSubmit = async(f) => {
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
            }
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
        <Input className="messageinput"
          name="Message"
          value={form.message}
          errors={errors.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <br/>
        <button className="buttons"onClick={() => handleSubmit(form)}>Sign Up</button>
      </div>
    </div>
  );
}

