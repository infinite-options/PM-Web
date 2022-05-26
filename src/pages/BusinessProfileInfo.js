import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";

import AppContext from "../AppContext";
import Header from "../components/Header";
import ServicesProvided from "../components/ServicesProvided";
import PaymentSelection from "../components/PaymentSelection";
import ManagerFees from "../components/ManagerFees";
import ManagerLocations from "../components/ManagerLocations";
import { get, post } from "../utils/api";
import { pillButton, squareForm, hidden, red, small } from "../utils/styles";

function BusinessProfileInfo(props) {
  const context = React.useContext(AppContext);
  const { access_token, user } = context.userData;
  console.log("user", user);
  const { autofillState, setAutofillState, businessType } = props;
  const updateAutofillState = (profile) => {
    const newAutofillState = { ...autofillState };
    for (const key of Object.keys(newAutofillState)) {
      if (key in profile) {
        newAutofillState[key] = profile[key];
      }
    }
    setAutofillState(newAutofillState);
  };
  const navigate = useNavigate();
  const [businessName, setBusinessName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState(
    autofillState.phone_number
  );
  const [email, setEmail] = React.useState(autofillState.email);
  const [einNumber, setEinNumber] = React.useState(autofillState.ein_number);
  const [serviceState, setServiceState] = React.useState([]);
  const [feeState, setFeeState] = React.useState([]);
  const [locationState, setLocationState] = React.useState([]);
  const paymentState = React.useState({
    paypal: autofillState.paypal,
    applePay: autofillState.apple_pay,
    zelle: autofillState.zelle,
    venmo: autofillState.venmo,
    accountNumber: autofillState.account_number,
    routingNumber: autofillState.routing_number,
  });
  const [errorMessage, setErrorMessage] = React.useState("");
  React.useEffect(() => {
    if (access_token === null) {
      navigate("/");
      return;
    }

    const fetchBusinessesManagement = async () => {
      const busi_res = await get(`/businesses?business_email=${user.email}`);
      console.log(
        "busi_res manangement",
        busi_res.result[0].business_type,
        businessType
      );
      let busi_res_type = [];
      busi_res.result.length > 1
        ? busi_res.result.map((busi) => {
            busi_res_type.push(busi.business_type);
          })
        : busi_res_type.push(busi_res.result[0].business_type);
      console.log("manangement", busi_res_type);
      if (
        busi_res.result.length !== 0 &&
        busi_res_type.includes(businessType)
      ) {
        console.log("business profile already set up");
        // eventually update page with current info, allow user to update and save new info
        props.onConfirm();
        return;
      }
    };
    fetchBusinessesManagement();
    // const busi_res = await get(`/businesses?business_email=${user.email}`);
    const fetchBusinessesMaintenance = async () => {
      const busi_res = await get(`/businesses?business_email=${user.email}`);
      console.log(
        "busi_res maintenance",
        busi_res.result[0].business_type,
        businessType
      );
      let busi_res_type = [];
      busi_res.result.length > 1
        ? busi_res.result.map((busi) => {
            busi_res_type.push(busi.business_type);
          })
        : busi_res_type.push(busi_res.result[0].business_type);
      console.log("maintenance", busi_res_type);
      if (
        busi_res.result.length !== 0 &&
        busi_res_type.includes(businessType)
      ) {
        console.log("business profile already set up");
        // eventually update page with current info, allow user to update and save new info
        props.onConfirm();
        return;
      }
    };
    fetchBusinessesMaintenance();
    if (
      businessType === "MAINTENANCE" &&
      user.role.indexOf("MAINTENANCE") === -1
    ) {
      console.log("no maintenance business in user role");
      props.onConfirm();
      return;
    }
    if (businessType === "MANAGEMENT" && user.role.indexOf("MANAGER") === -1) {
      console.log("no manager business in user role");
      props.onConfirm();
      return;
    }

    const fetchProfileInfo = async () => {
      // const busi_res = await get(`/businesses?business_email=${user.email}`);
      const response = await get("/businessProfileInfo", access_token);
      if (response.result.length !== 0) {
        console.log("business profile already set up");
        // eventually update page with current info, allow user to update and save new info
        props.onConfirm();
        return;
      }
    };
    fetchProfileInfo();
  }, []);
  const submitInfo = async () => {
    const { paypal, applePay, zelle, venmo, accountNumber, routingNumber } =
      paymentState[0];
    if (businessName === "" || einNumber === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    if (businessType === "MANAGEMENT" && feeState.length === 0) {
      setErrorMessage("Please add at least one fee");
      return;
    }
    if (businessType === "MAINTENANCE" && serviceState[0].length === 0) {
      setErrorMessage("Please add at least one service");
      return;
    }
    if (
      paypal === "" &&
      applePay === "" &&
      zelle === "" &&
      venmo === "" &&
      (accountNumber === "" || routingNumber === "")
    ) {
      setErrorMessage("Please add at least one payment method");
      return;
    }
    if (locationState.length === 0) {
      setErrorMessage("Please add at least one location");
      return;
    }
    const businessProfile = {
      type: businessType,
      name: businessName,
      phone_number: phoneNumber,
      email: email,
      ein_number: einNumber,
      services_fees: businessType === "MANAGEMENT" ? feeState : serviceState[0],
      locations: locationState,
      paypal: paypal,
      apple_pay: applePay,
      zelle: zelle,
      venmo: venmo,
      account_number: accountNumber,
      routing_number: routingNumber,
    };
    console.log(businessProfile);
    await post("/businesses", businessProfile, access_token);
    updateAutofillState(businessProfile);
    props.onConfirm();
  };
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
      <Header
        title={
          businessType === "MANAGEMENT"
            ? "PM Business Profile"
            : "Maintenance Business Profile"
        }
      />
      <Container className="pb-4">
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Business Name {businessName === "" ? required : ""}
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Phone Number {phoneNumber === "" ? required : ""}
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="(xxx)xxx-xxxx"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            Email Address {email === "" ? required : ""}
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        {businessType === "MANAGEMENT" ? (
          <Container className="px-2">
            <h6 className="mb-3">Fees you charge:</h6>
            <ManagerFees feeState={feeState} setFeeState={setFeeState} />
          </Container>
        ) : (
          <ServicesProvided
            serviceState={serviceState}
            setServiceState={setServiceState}
            businessType={businessType}
          />
        )}

        <Form.Group className="mx-2 my-3">
          <Form.Label as="h6" className="mb-0 ms-2">
            EIN Number {einNumber === "" ? required : ""}
          </Form.Label>
          <Form.Control
            style={squareForm}
            placeholder="12-1234567"
            value={einNumber}
            onChange={(e) => setEinNumber(e.target.value)}
          />
        </Form.Group>

        <PaymentSelection state={paymentState} />

        <ManagerLocations
          locationState={locationState}
          setLocationState={setLocationState}
        />

        <div className="text-center" style={errorMessage === "" ? hidden : {}}>
          <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
        </div>

        <div className="text-center mt-4 mb-5">
          <Button
            variant="outline-primary"
            style={pillButton}
            onClick={submitInfo}
          >
            Save Business Profile
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default BusinessProfileInfo;
