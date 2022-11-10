import React, { useState, useContext, useEffect } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import moment from "moment";
import EditIcon from "../icons/EditIcon.svg";
import DeleteIcon from "../icons/DeleteIcon.svg";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePayment from "../components/StripePayment.js";
import {
  pillButton,
  smallPillButton,
  squareForm,
  redPill,
  small,
  red,
  hidden,
  headings,
  mediumBold,
  subHeading,
  bluePillButton,
  greenPill,
} from "../utils/styles";
import ArrowDown from "../icons/ArrowDown.svg";
import { useNavigate, useLocation } from "react-router-dom";
import Checkbox from "../components/Checkbox";
import Header from "../components/Header";
import { post, get } from "../utils/api";
import AppContext from "../AppContext";
import File from "../icons/File.svg";
import SideBar from "../components/managerComponents/SideBar";

function ManagerUtilities(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [stripePromise, setStripePromise] = useState(null);

  // const { properties, expenses } = props;
  const useLiveStripeKey = false;
  // const properties = location.state.properties;
  // const expenses = location.state.expenses;
  const [properties, setProperties] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [managerID, setManagerID] = useState("");
  const [utilityState, setUtilityState] = useState([]);
  const [newUtility, setNewUtility] = useState(null);
  const [editingUtility, setEditingUtility] = useState(false);
  const [propertyState, setPropertyState] = useState([]);
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [tenantPay, setTenantPay] = useState(false);
  const [ownerPay, setOwnerPay] = useState(false);
  const [expenseDetail, setExpenseDetail] = useState(false);
  const [expenseDetailManager, setExpenseDetailManager] = useState(false);
  const [maintenanceExpenseDetail, setMaintenanceExpenseDetail] =
    useState(false);
  const [payExpense, setPayExpense] = useState(false);
  const [payment, setPayment] = useState(false);
  const emptyUtility = {
    provider: "",
    service_name: "",
    charge: "",
    properties: [],
    split_type: "No Split",
    due_date: "",
    add_to_rent: false,
  };
  const [errorMessage, setErrorMessage] = useState("");

  const [purchaseUID, setPurchaseUID] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [purchase, setPurchase] = useState({});
  const [totalSum, setTotalSum] = useState("");
  const [stripePayment, setStripePayment] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const requestTitleRef = React.createRef();
  const requestDescriptionRef = React.createRef();
  const tagPriorityRef = React.createRef();

  const [expenseUnique, setExpenseUnique] = useState("");

  const submitForm = () => {
    const requestTitle = requestTitleRef.current.value;
    const requestDescription = requestDescriptionRef.current.value;
    const tagPriority = tagPriorityRef.current.value;
    props.onConfirm(requestTitle, requestDescription, tagPriority);
  };

  const PayBill = async (pid) => {
    const url =
      message === "PMTEST"
        ? "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PMTEST"
        : "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PM";
    let response = await fetch(url);
    const responseData = await response.json();
    console.log(responseData.PUBLISHABLE_KEY);
    const stripePromise = loadStripe(responseData.PUBLISHABLE_KEY);
    setStripePromise(stripePromise);

    response = await get(`/purchases?purchase_uid=${pid}`);
    setPurchase(response.result[0]);
    setTotalSum(response.result[0].amount_due);
    setAmount(response.result[0].amount_due - response.result[0].amount_paid);
  };

  const fetchProperties = async () => {
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
    setManagerID(management_buid);
    const response = await get("/managerDashboard", access_token);
    console.log("second");
    console.log(response);
    setIsLoading(false);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();

      return;
    }

    const properties = response.result.filter(
      (property) => property.management_status !== "REJECTED"
    );

    const properties_unique = [];
    const pids = new Set();
    const mr = [];
    properties.forEach((property) => {
      if (pids.has(property.property_uid)) {
        console.log("here in if");
        // properties_unique[properties_unique.length-1].tenants.push(property)
        const index = properties_unique.findIndex(
          (item) => item.property_uid === property.property_uid
        );
        if (
          property.rental_status === "ACTIVE" ||
          property.rental_status === "PROCESSING"
        ) {
          console.log("here", property);
          properties_unique[index].tenants.push(property);
        }
      } else {
        console.log("here in else");
        pids.add(property.property_uid);
        properties_unique.push(property);
        if (
          property.rental_status === "ACTIVE" ||
          property.rental_status === "PROCESSING"
        ) {
          console.log("here", property);
          properties_unique[properties_unique.length - 1].tenants = [property];
        }
      }
    });
    setProperties(properties_unique);
    setPropertyState(properties_unique);
    let expense = [];
    properties_unique.forEach((property) => {
      if (property.expenses.length > 0) {
        console.log("has expense");
        property.expenses.forEach((ex) => {
          console.log("has expense", ex);
          expense.push(ex);
        });
      }
    });

    console.log(expense);
    console.log(properties_unique);
    const grouped = groupBy(expense, "purchase_uid");
    const keys = Object.keys(grouped);
    var output = [];
    //loop keys
    keys.forEach((key) => {
      //merge using reduce
      const out = grouped[key].reduce((acc, current) => {
        return {
          address: acc.address + ";" + current.address,
          amount: current.amount,
          amount_due: current.amount_due,
          amount_paid: current.amount_paid,
          bill_algorithm: current.bill_algorithm,
          bill_created_by: current.bill_created_by,
          bill_description: current.bill_description,
          bill_docs: current.bill_docs,
          bill_uid: current.bill_uid,
          bill_utility_type: current.bill_utility_type,
          charge_id: current.charge_id,
          description: current.description,
          linked_bill_id: current.linked_bill_id,
          next_payment: current.next_payment,
          pay_purchase_id: current.pay_purchase_id,
          payer: current.payer,
          payment_date: current.payment_date,
          payment_frequency: current.payment_frequency,
          payment_notes: current.payment_notes,
          payment_type: current.payment_type,
          payment_uid: current.payment_uid,
          pur_property_id: current.pur_property_id,
          purchase_date: current.purchase_date,
          purchase_frequency: current.purchase_frequency,
          purchase_notes: current.purchase_notes,
          purchase_status: current.purchase_status,
          purchase_type: current.purchase_type,
          purchase_uid: current.purchase_uid,
          receiver: current.receiver,
        };
      });
      output.push(out);
    });
    console.log(output);
    setExpenseUnique(output);

    setExpenses(expense);
  };
  useEffect(() => {
    console.log("in use effect");
    fetchProperties();
  }, []);
  useEffect(() => {
    if (amount > totalSum || amount <= 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [amount]);

  const cancel = () => setStripePayment(false);
  const submit = () => {
    cancel();
    setPayExpense(false);
  };

  //group an array by property
  function groupBy(arr, property) {
    return arr.reduce(function (memo, x) {
      if (!memo[x[property]]) {
        memo[x[property]] = [];
      }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }

  // useEffect(() => {
  //   const management_businesses = user.businesses.filter(
  //     (business) => business.business_type === "MANAGEMENT"
  //   );
  //   let management_buid = null;
  //   if (management_businesses.length < 1) {
  //     console.log("No associated PM Businesses");
  //     return;
  //   } else if (management_businesses.length > 1) {
  //     console.log("Multiple associated PM Businesses");
  //     management_buid = management_businesses[0].business_uid;
  //   } else {
  //     management_buid = management_businesses[0].business_uid;
  //   }
  //   setManagerID(management_buid);

  //   const grouped = groupBy(expenses, "purchase_uid");
  //   const keys = Object.keys(grouped);
  //   var output = [];
  //   //loop keys
  //   keys.forEach((key) => {
  //     //merge using reduce
  //     const out = grouped[key].reduce((acc, current) => {
  //       return {
  //         address: acc.address + ";" + current.address,
  //         amount: current.amount,
  //         amount_due: current.amount_due,
  //         amount_paid: current.amount_paid,
  //         bill_algorithm: current.bill_algorithm,
  //         bill_created_by: current.bill_created_by,
  //         bill_description: current.bill_description,
  //         bill_docs: current.bill_docs,
  //         bill_uid: current.bill_uid,
  //         bill_utility_type: current.bill_utility_type,
  //         charge_id: current.charge_id,
  //         description: current.description,
  //         linked_bill_id: current.linked_bill_id,
  //         next_payment: current.next_payment,
  //         pay_purchase_id: current.pay_purchase_id,
  //         payer: current.payer,
  //         payment_date: current.payment_date,
  //         payment_frequency: current.payment_frequency,
  //         payment_notes: current.payment_notes,
  //         payment_type: current.payment_type,
  //         payment_uid: current.payment_uid,
  //         pur_property_id: current.pur_property_id,
  //         purchase_date: current.purchase_date,
  //         purchase_frequency: current.purchase_frequency,
  //         purchase_notes: current.purchase_notes,
  //         purchase_status: current.purchase_status,
  //         purchase_type: current.purchase_type,
  //         purchase_uid: current.purchase_uid,
  //         receiver: current.receiver,
  //       };
  //     });
  //     output.push(out);
  //   });
  //   console.log(output);
  //   setExpenseUnique(output);
  // }, []);

  // console.log(expenseUnique);

  const splitFees = (newUtility) => {
    let charge = parseFloat(newUtility.charge);
    if (newUtility.split_type === "No Split") {
      let count = newUtility.properties.length;
      let charge_per = charge;
      newUtility.properties.forEach((p) => (p.charge = charge_per));
    }
    if (newUtility.split_type === "Uniform") {
      let count = newUtility.properties.length;
      let charge_per = charge / count;
      newUtility.properties.forEach((p) => (p.charge = charge_per));
    }

    if (newUtility.split_type === "Tenant") {
      let total = 0;
      newUtility.properties.forEach((p, i) => {
        if (p.rental_status === "ACTIVE") {
          let tenants = p.applications.filter(
            (a) => a.application_status === "RENTED"
          );
          let occupants =
            tenants[0].adult_occupants + tenants[0].children_occupants;
          total = total + occupants;
          p.tenants = tenants;
          p.occupants = occupants;
        } else {
          total = total + 1;
          p.occupants = 1;
        }
      });
      newUtility.properties.forEach(
        (p) => (p.charge = (p.occupants / total) * charge)
      );
    }

    if (newUtility.split_type === "Area") {
      let total_area = 0;
      newUtility.properties.forEach((p) => (total_area = total_area + p.area));
      // console.log(total_area)
      newUtility.properties.forEach(
        (p) => (p.charge = (p.area / total_area) * charge)
      );
    }
  };

  const postCharges = async (newUtility) => {
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
    setManagerID(management_buid);
    let properties_uid = [];
    newUtility.properties.forEach((prop) =>
      properties_uid.push(prop.property_uid)
    );
    const new_bill = {
      bill_created_by: management_buid,
      bill_description: newUtility.provider,
      bill_utility_type: newUtility.service_name,
      bill_algorithm: newUtility.split_type,
      bill_docs: files,
    };
    for (let i = 0; i < files.length; i++) {
      let key = `file_${i}`;
      new_bill[key] = files[i].file;
      delete files[i].file;
    }

    new_bill.bill_docs = JSON.stringify(files);
    const response = await post("/bills", new_bill, null, files);
    const bill_uid = response.bill_uid;
    console.log(bill_uid);

    const new_purchase_pm = {
      linked_bill_id: bill_uid,
      pur_property_id: properties_uid,
      payer: [management_buid],
      receiver: newUtility.provider,
      purchase_type: "UTILITY",
      description: newUtility.service_name,
      amount_due: newUtility.charge,
      purchase_notes: moment().format("MMMM"),
      purchase_date: moment().format("YYYY-MM-DD") + " 00:00:00",
      purchase_frequency: "One-time",
      next_payment: newUtility.due_date,
    };
    console.log(new_purchase_pm);
    const response_pm = await post("/purchases", new_purchase_pm, null, null);
    const purchase_uid = response_pm.purchase_uid;
    console.log(response_pm);
    splitFees(newUtility);
    for (const property of newUtility.properties) {
      console.log(property);
      const new_purchase = {
        linked_bill_id: bill_uid,
        pur_property_id: property.property_uid,
        payer: "",
        receiver: management_buid,
        purchase_type: "UTILITY",
        description: newUtility.service_name,
        amount_due: property.charge,
        purchase_notes: moment().format("MMMM"),
        purchase_date: moment().format("YYYY-MM-DD") + " 00:00:00",
        purchase_frequency: "One-time",
        next_payment: newUtility.due_date,
      };

      if (newUtility.add_to_rent) {
        new_purchase.next_payment = "0000-00-00 00:00:00";
      }
      if (tenantPay) {
        if (property.rental_status === "ACTIVE") {
          let tenant_ids = property.tenants.map((t) => t.tenant_id);
          new_purchase.payer = tenant_ids;
        } else {
          new_purchase.payer = [property.owner_id];
        }
      } else {
        new_purchase.payer = [property.owner_id];
      }

      console.log("New Purchase", new_purchase);
      const response_t = await post("/purchases", new_purchase, null, null);
    }
    navigate(`/managerPaymentPage/${purchase_uid}`, {
      state: {
        amount: newUtility.charge,
        selectedProperty: "",
        purchaseUID: purchase_uid,
      },
    });

    setNewUtility({ ...emptyUtility });
    propertyState.forEach((prop) => (prop.checked = false));
    setPropertyState(propertyState);
    setEditingUtility(false);
    setTenantPay(false);
    setOwnerPay(false);
    setPayExpense(true);
  };

  const addUtility = async () => {
    if (newUtility.service_name === "" || newUtility.charge === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    if (propertyState.filter((p) => p.checked).length < 1) {
      setErrorMessage("Select at least one property");
      return;
    }

    if (!newUtility.add_to_rent) {
      if (newUtility.due_date === "") {
        setErrorMessage("Please fill out all fields");
        return;
      }
      let due_date = new Date(newUtility.due_date);
      let current_date = new Date();
      if (current_date >= due_date) {
        setErrorMessage("Select a Due by Date later than current date");
        return;
      }
    }

    setErrorMessage("");

    newUtility.properties = [...propertyState.filter((p) => p.checked)];
    // newUtility.properties = propertyState.filter((p) => p.checked)
    // splitFees(newUtility);
    await postCharges(newUtility);
    const newUtilityState = [...utilityState];
    newUtilityState.push({ ...newUtility });
    setUtilityState(newUtilityState);
    setNewUtility(null);
  };
  const cancelEdit = () => {
    setNewUtility(null);
    setErrorMessage("");
    if (editingUtility !== null) {
      const newUtilityState = [...utilityState];
      newUtilityState.push(editingUtility);
      setUtilityState(newUtilityState);
    }
    setEditingUtility(null);
  };
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  const editUtility = (i) => {
    // const newUtilityState = [...utilityState];
    // const utility = newUtilityState.splice(i, 1)[0];
    // setUtilityState(newUtilityState);
    // setEditingUtility(utility);
    // setNewUtility({...utility});
  };
  const deleteUtility = (i) => {
    // const newUtilityState = [...utilityState];
    // newUtilityState.splice(i, 1);
    // setUtilityState(newUtilityState);
  };
  const changeNewUtility = (event, field) => {
    // console.log('as')
    // console.log(event)
    // console.log(field)
    // console.log(event.target.checked)
    const changedUtility = { ...newUtility };
    if (event.target.type === "checkbox") {
      changedUtility[field] = event.target.checked;
    } else {
      changedUtility[field] = event.target.value;
    }
    // changedUtility[field] = event.target.value;
    setNewUtility(changedUtility);
  };
  const toggleProperty = (i) => {
    const newPropertyState = [...propertyState];
    newPropertyState[i].checked = !newPropertyState[i].checked;
    setPropertyState(newPropertyState);
  };

  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );

  const addFile = (e) => {
    const file = e.target.files[0];
    const newFile = {
      name: file.name,
      description: "",
      file: file,
    };
    setNewFile(newFile);
  };

  const updateNewFile = (field, value) => {
    const newFileCopy = { ...newFile };
    newFileCopy[field] = value;
    setNewFile(newFileCopy);
  };

  const editDocument = (i) => {
    const newFiles = [...files];
    const file = newFiles.splice(i, 1)[0];
    setFiles(newFiles);
    setEditingDoc(file);
    setNewFile({ ...file });
  };

  const cancelDocumentEdit = () => {
    setNewFile(null);
    if (editingDoc !== null) {
      const newFiles = [...files];
      newFiles.push(editingDoc);
      setFiles(newFiles);
    }
    setEditingDoc(null);
  };

  const saveNewFile = (e) => {
    // copied from addFile, change e.target.files to state.newFile
    const newFiles = [...files];
    newFiles.push(newFile);
    setFiles(newFiles);
    setNewFile(null);
  };
  const deleteDocument = (i) => {
    const newFiles = [...files];
    newFiles.splice(i, 1);
    setFiles(newFiles);
  };

  return (
    <div>
      <div className="flex-1">
        <div>
          <SideBar />
        </div>
        <div
          className="w-100"
          style={{
            width: "calc(100vw - 13rem)",
            position: "relative",
          }}
        >
          <br />
          <Header
            title="Expenses"
            leftText={
              editingUtility ||
              expenseDetail ||
              expenseDetailManager ||
              maintenanceExpenseDetail ||
              payExpense
                ? "< Back"
                : ""
            }
            leftFn={() => {
              setNewUtility(null);
              setExpenseDetail(false);
              setExpenseDetailManager(false);
              setMaintenanceExpenseDetail(false);
              setPayment(null);
              propertyState.forEach((prop) => (prop.checked = false));
              setPropertyState(propertyState);
              setTenantPay(false);
              setOwnerPay(false);

              setPayExpense(false);
              setEditingUtility(false);
            }}
            rightText={
              editingUtility ||
              expenseDetail ||
              expenseDetailManager ||
              maintenanceExpenseDetail ||
              payExpense
                ? ""
                : "+ New"
            }
            rightFn={() => {
              setNewUtility({ ...emptyUtility });
              propertyState.forEach((prop) => (prop.checked = false));
              setPropertyState(propertyState);
              setTenantPay(false);
              setOwnerPay(false);
              setEditingUtility(true);
            }}
          />

          <div>
            {newUtility !== null &&
            editingUtility &&
            !expenseDetail &&
            !expenseDetailManager &&
            !maintenanceExpenseDetail ? (
              <div
                className="mx-2 mt-2 p-3"
                style={{
                  background: "#FFFFFF 0% 0% no-repeat padding-box",
                  borderRadius: "5px",
                  opacity: 1,
                }}
              >
                <Row className="my-4 text-center">
                  <div style={headings}>New Expense</div>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <Form.Group className="mx-2">
                      <Form.Label style={mediumBold} className="mb-0 ms-2">
                        Type {newUtility.service_name === "" ? required : ""}
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        placeholder="Electricity"
                        value={newUtility.service_name}
                        onChange={(e) => changeNewUtility(e, "service_name")}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mx-2">
                      <Form.Label style={mediumBold} className="mb-0 ms-2">
                        Amount {newUtility.charge === "" ? required : ""}
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        type="number"
                        placeholder="20"
                        value={newUtility.charge}
                        onChange={(e) => changeNewUtility(e, "charge")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <Form.Group className="mx-2">
                      <Form.Label style={mediumBold} className="mb-0 ms-2">
                        Provider {newUtility.provider === "" ? required : ""}
                      </Form.Label>
                      <Form.Control
                        style={squareForm}
                        placeholder="Electricity"
                        value={newUtility.provider}
                        onChange={(e) => changeNewUtility(e, "provider")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <Form.Group className="mx-2 mt-3 mb-2">
                      <Form.Label style={mediumBold} className="mb-0 ms-2">
                        Due by Date {newUtility.due_date === "" ? required : ""}
                      </Form.Label>
                      <Form.Control
                        disabled={newUtility.add_to_rent}
                        style={squareForm}
                        type="date"
                        value={newUtility.due_date}
                        onChange={(e) => changeNewUtility(e, "due_date")}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mx-2 mb-3"
                      controlId="formBasicCheckbox"
                    >
                      <Form.Check
                        type="checkbox"
                        style={subHeading}
                        label="Pay with next rent"
                        onChange={(e) => changeNewUtility(e, "add_to_rent")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <Form.Group
                      className="mx-2 mb-3"
                      controlId="formBasicCheckbox"
                    >
                      <div
                        className="d-flex mx-2 ps-2 align-items-center my-2"
                        style={{
                          font: "normal normal normal 18px Bahnschrift-Regular",
                        }}
                      >
                        <Checkbox
                          type="BOX"
                          checked={tenantPay}
                          onClick={() => setTenantPay(!tenantPay)}
                        />
                        <p className="ms-1 mb-1">Tenant</p>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group
                      className="mx-2 mb-3"
                      controlId="formBasicCheckbox"
                    >
                      <div
                        className="d-flex mx-2 ps-2 align-items-center my-2"
                        style={{
                          font: "normal normal normal 18px Bahnschrift-Regular",
                        }}
                      >
                        {" "}
                        <Checkbox
                          type="BOX"
                          checked={ownerPay}
                          onClick={() => setOwnerPay(!ownerPay)}
                        />
                        <p className="ms-1 mb-1">Owner</p>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                {console.log(properties)}
                <Row className="mx-1 mt-3 mb-2">
                  <h6 style={mediumBold}>Properties</h6>
                  {properties.map((property, i) => (
                    <div
                      key={i}
                      className="d-flex mx-2 ps-2 align-items-center my-2"
                      style={{
                        font: "normal normal normal 18px Bahnschrift-Regular",
                      }}
                    >
                      <Checkbox
                        type="BOX"
                        checked={propertyState[i].checked}
                        onClick={() => toggleProperty(i)}
                      />
                      <p className="ms-1 mb-1">
                        {property.address} {property.unit}
                        ,&nbsp;{property.city},&nbsp;{property.state}&nbsp;{" "}
                        {property.zip}
                      </p>
                    </div>
                  ))}
                </Row>

                {/*Add Documents functionality*/}
                <Row className="mx-1 mt-3 mb-2">
                  <h6 style={mediumBold}>Documents</h6>
                  {files.map((file, i) => (
                    <div key={i}>
                      <div className="d-flex justify-content-between align-items-end">
                        <div>
                          <h6 style={mediumBold}>{file.name}</h6>
                          <p style={small} className="m-0">
                            {file.description}
                          </p>
                        </div>
                        <div>
                          <img
                            src={EditIcon}
                            alt="Edit"
                            className="px-1 mx-2"
                            onClick={() => editDocument(i)}
                          />
                          <img
                            src={DeleteIcon}
                            alt="Delete"
                            className="px-1 mx-2"
                            onClick={() => deleteDocument(i)}
                          />
                          <a href={file.link} target="_blank">
                            <img src={File} />
                          </a>
                        </div>
                      </div>
                      <hr style={{ opacity: 1 }} />
                    </div>
                  ))}
                  {newFile !== null ? (
                    <div>
                      <Form.Group>
                        <Form.Label style={mediumBold} className="mb-0 ms-2">
                          Document Name
                        </Form.Label>
                        <Form.Control
                          style={squareForm}
                          value={newFile.name}
                          placeholder="Name"
                          onChange={(e) =>
                            updateNewFile("name", e.target.value)
                          }
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label style={mediumBold} className="mb-0 ms-2">
                          Description
                        </Form.Label>
                        <Form.Control
                          style={squareForm}
                          value={newFile.description}
                          placeholder="Description"
                          onChange={(e) =>
                            updateNewFile("description", e.target.value)
                          }
                        />
                      </Form.Group>
                      <div className="text-center my-3">
                        <Button
                          variant="outline-primary"
                          style={smallPillButton}
                          as="p"
                          onClick={cancelDocumentEdit}
                          className="mx-2"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="outline-primary"
                          style={smallPillButton}
                          as="p"
                          onClick={saveNewFile}
                          className="mx-2"
                        >
                          Save Document
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        id="file"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={addFile}
                        className="d-none"
                      />
                      <label htmlFor="file">
                        <Button
                          variant="outline-primary"
                          style={smallPillButton}
                          as="p"
                        >
                          Add Document
                        </Button>
                      </label>
                    </div>
                  )}
                  <Row>
                    <Col>
                      <Form.Group
                        className="mx-2 my-3"
                        hidden={
                          propertyState.filter((p) => p.checked).length <= 1
                        }
                      >
                        <Form.Label style={mediumBold} className="mb-0 ms-2">
                          Split Method
                        </Form.Label>
                        <Form.Select
                          style={{
                            ...squareForm,
                            backgroundImage: `url(${ArrowDown})`,
                          }}
                          value={newUtility.split_type}
                          onChange={(e) => changeNewUtility(e, "split_type")}
                        >
                          <option value="No Split">No Split</option>
                          <option value="Uniform">Uniform</option>
                          <option value="Tenant">By Tenant Count</option>
                          <option value="Area">By Square Footage</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>

                <div
                  className="text-center my-2"
                  style={errorMessage === "" ? hidden : {}}
                >
                  <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
                </div>

                <div
                  className="d-flex justify-content-center mb-4 mx-2 mb-2 p-3"
                  style={{
                    background: "#FFFFFF 0% 0% no-repeat padding-box",

                    opacity: 1,
                  }}
                >
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
                    onClick={addUtility}
                    className="mx-2"
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              ""
            )}
            {expenses.length > 0 &&
            expenseUnique.length > 0 &&
            newUtility === null &&
            !editingUtility &&
            !expenseDetail &&
            !expenseDetailManager &&
            !maintenanceExpenseDetail &&
            !payExpense ? (
              <div className="mx-2 my-2 p-3">
                <div>
                  <Row style={headings}>Utility Expenses Due From Manager</Row>
                  {expenseUnique.map((expense) => {
                    return expense.purchase_type === "UTILITY" &&
                      expense.payer.includes(managerID) ? (
                      <div>
                        <Row
                          className="my-2 p-3"
                          style={{
                            background: "#FFFFFF 0% 0% no-repeat padding-box",
                            boxShadow: "0px 3px 6px #00000029",
                            borderRadius: "5px",
                            opacity: 1,
                          }}
                          onClick={() => {
                            setExpenseDetailManager(true);
                            setPayment(expense);
                          }}
                        >
                          <Col
                            xs={3}
                            className="pt-4 justify-content-center align-items-center"
                            style={
                              (mediumBold,
                              {
                                color: "#007AFF",
                                border: "4px solid #007AFF",
                                borderRadius: "50%",
                                height: "83px",
                                width: "83px",
                              })
                            }
                          >
                            ${expense.amount_due.toFixed(2)}
                          </Col>
                          <Col style={mediumBold}>
                            <div>
                              {expense.description} -{" "}
                              {new Date(
                                String(expense.purchase_date).split(" ")[0]
                              ).toDateString()}
                            </div>
                            {expense.bill_algorithm === "No Split" ? (
                              <div>
                                {expense.address.split(",")[0]} <br />
                                {expense.address.split(",")[1]},{" "}
                                {expense.address.split(",")[2]}
                              </div>
                            ) : (
                              <div>Split Method - {expense.bill_algorithm}</div>
                            )}
                          </Col>
                          <Col xs={3} className="pt-4 justify-content-end">
                            {expense.purchase_status === "UNPAID" ? (
                              <Col className="mt-0" style={redPill}>
                                {expense.purchase_status}
                              </Col>
                            ) : (
                              <Col className="mt-0" style={greenPill}>
                                {expense.purchase_status}
                              </Col>
                            )}
                          </Col>
                        </Row>
                      </div>
                    ) : (
                      <Row></Row>
                    );
                  })}
                </div>
                {console.log(managerID)}
                <div>
                  <Row style={headings}>Utility Expenses Due From Tenant</Row>
                  {expenseUnique.map((expense) => {
                    return expense.purchase_type === "UTILITY" &&
                      !expense.payer.includes(managerID) ? (
                      <div>
                        <Row
                          className="my-2 p-3"
                          style={{
                            background: "#FFFFFF 0% 0% no-repeat padding-box",
                            boxShadow: "0px 3px 6px #00000029",
                            borderRadius: "5px",
                            opacity: 1,
                          }}
                          onClick={() => {
                            setExpenseDetail(true);
                            setPayment(expense);
                          }}
                        >
                          <Col
                            xs={3}
                            className="pt-4 justify-content-center align-items-center"
                            style={
                              (mediumBold,
                              {
                                color: "#007AFF",
                                border: "4px solid #007AFF",
                                borderRadius: "50%",
                                height: "83px",
                                width: "83px",
                              })
                            }
                          >
                            ${expense.amount_due.toFixed(2)}
                          </Col>
                          <Col style={mediumBold}>
                            <div>
                              {expense.description} -{" "}
                              {new Date(
                                String(expense.purchase_date).split(" ")[0]
                              ).toDateString()}
                            </div>
                            <div>
                              {expense.address.split(",")[0]} <br />
                              {expense.address.split(",")[1]},{" "}
                              {expense.address.split(",")[2]}
                            </div>
                          </Col>
                          <Col xs={3} className="pt-4 justify-content-end">
                            {expense.purchase_status === "UNPAID" ? (
                              <Col className="mt-0" style={redPill}>
                                {expense.purchase_status}
                              </Col>
                            ) : (
                              <Col className="mt-0" style={greenPill}>
                                {expense.purchase_status}
                              </Col>
                            )}
                          </Col>
                        </Row>
                      </div>
                    ) : (
                      <Row></Row>
                    );
                  })}
                </div>
                <div>
                  {expenseUnique.map((expense) => {
                    return expense.purchase_type === "MAINTENANCE" ||
                      expense.purchase_type === "REPAIRS" ? (
                      <div>
                        <Row style={headings}> Maintenance Payments</Row>
                        <Row
                          className="my-2 p-3"
                          style={
                            (mediumBold,
                            {
                              background: "#FFFFFF 0% 0% no-repeat padding-box",
                              boxShadow: "0px 3px 6px #00000029",
                              borderRadius: "5px",
                              opacity: 1,
                            })
                          }
                          onClick={() => {
                            setMaintenanceExpenseDetail(true);
                            setPayment(expense);
                          }}
                        >
                          <Col
                            xs={3}
                            className="pt-4 justify-content-center align-items-center"
                            style={{
                              color: "#007AFF",
                              border: "4px solid #007AFF",
                              borderRadius: "50%",
                              height: "83px",
                              width: "83px",
                            }}
                          >
                            ${expense.amount_due.toFixed(2)}
                          </Col>
                          <Col style={mediumBold}>
                            {expense.description} -{" "}
                            {new Date(
                              String(expense.purchase_date).split(" ")[0]
                            ).toDateString()}
                          </Col>
                        </Row>
                      </div>
                    ) : (
                      <div></div>
                    );
                  })}
                </div>
              </div>
            ) : newUtility === null &&
              !editingUtility &&
              !expenseDetail &&
              !expenseDetailManager &&
              !maintenanceExpenseDetail &&
              !payExpense ? (
              <div className="d-flex justify-content-center mb-4 mx-2 mb-2 p-3">
                <Row style={headings}></Row>
              </div>
            ) : (
              ""
            )}
          </div>

          {expenseDetail &&
          !expenseDetailManager &&
          !maintenanceExpenseDetail ? (
            <div
              className="d-flex flex-column mx-2 p-3"
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                opacity: 1,
                height: "100%",
              }}
            >
              <Row
                className="my-2 align-items-center justify-content-center"
                style={headings}
              >
                {payment.bill_utility_type}
              </Row>
              <Row
                className="my-2 align-items-center justify-content-center"
                style={mediumBold}
              >
                {payment.bill_description}{" "}
              </Row>
              <Row className="my-2 align-items-center justify-content-center">
                <Col
                  xs={3}
                  className="pt-4 justify-content-center align-items-center"
                  style={
                    (mediumBold,
                    {
                      color: "#007AFF",
                      border: "4px solid #007AFF",
                      borderRadius: "50%",
                      height: "83px",
                      width: "83px",
                    })
                  }
                >
                  ${payment.amount_due.toFixed(2)}
                </Col>
              </Row>
              <Row className="my-2 mx-2" style={mediumBold}>
                Properties Billed:
              </Row>
              {payment.address.split(";").map((address) => {
                return (
                  <Row
                    className="my-2 mx-2 p-1"
                    style={
                      (mediumBold,
                      { border: "1px solid #707070", borderRadius: "5px" })
                    }
                  >
                    {address}
                  </Row>
                );
              })}
              <Row className="d-flex my-2 mx-2" style={mediumBold}>
                <Col className="d-flex p-0 justify-content-left">
                  Expense type:
                </Col>
                <Col className="d-flex p-0 justify-content-end">Utility</Col>
              </Row>
              <Row className="d-flex my-2 mx-2" style={mediumBold}>
                <Col className="d-flex p-0 justify-content-left">
                  Split Method:
                </Col>
                <Col className="d-flex p-0 justify-content-end">
                  {payment.bill_algorithm}
                </Col>
              </Row>
              <Row className="d-flex my-2 mx-2" style={mediumBold}>
                <Col className="d-flex p-0 justify-content-left">
                  Bill Sent on:
                </Col>
                <Col className="d-flex p-0 justify-content-end">
                  {new Date(
                    String(payment.purchase_date).split(" ")[0]
                  ).toDateString()}
                </Col>
              </Row>
              <Row className="d-flex my-2 mx-2" style={mediumBold}>
                <Col className="d-flex p-0 justify-content-left">
                  Payment Status:
                </Col>
                {payment.purchase_status === "UNPAID" ? (
                  <Col xs={3} className="mt-0" style={redPill}>
                    {payment.purchase_status}
                  </Col>
                ) : (
                  <Col xs={3} className="mt-0" style={greenPill}>
                    {payment.purchase_status}
                  </Col>
                )}
              </Row>
              <Row className="d-flex my-5 mx-2">
                <Col></Col>
                <Col className="d-flex p-0 justify-content-center">
                  <Button
                    style={bluePillButton}
                    onClick={() => setExpenseDetail(false)}
                  >
                    Okay
                  </Button>
                </Col>
                <Col></Col>
              </Row>
              {payment.purchase_status === "UNPAID" &&
              payment.payer.includes(user.user_uid) ? (
                <Row className="d-flex mx-2">
                  <Col></Col>
                  <Col xs={6} className="d-flex p-0 justify-content-center">
                    <Button
                      style={bluePillButton}
                      onClick={() => {
                        setPurchaseUID(payment.purchase_uid);
                        setPayExpense(true);
                        PayBill(payment.purchase_uid);
                        setExpenseDetail(false);
                        setExpenseDetailManager(false);
                      }}
                    >
                      Pay Bill
                    </Button>
                  </Col>
                  <Col></Col>
                </Row>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {!expenseDetail &&
          expenseDetailManager &&
          !maintenanceExpenseDetail ? (
            <div
              className="d-flex flex-column mx-2 p-3"
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                opacity: 1,
                height: "100%",
              }}
            >
              <Row
                className="my-2 align-items-center justify-content-center"
                style={headings}
              >
                {payment.bill_utility_type}
              </Row>
              <Row
                className="my-2 align-items-center justify-content-center"
                style={mediumBold}
              >
                {payment.bill_description}{" "}
              </Row>
              <Row className="my-2 align-items-center justify-content-center">
                <Col
                  xs={3}
                  className="pt-4 justify-content-center align-items-center"
                  style={
                    (mediumBold,
                    {
                      color: "#007AFF",
                      border: "4px solid #007AFF",
                      borderRadius: "50%",
                      height: "83px",
                      width: "83px",
                    })
                  }
                >
                  ${payment.amount_due.toFixed(2)}
                </Col>
              </Row>
              <Row className="my-2 mx-2" style={mediumBold}>
                Properties Billed:
              </Row>
              {payment.address.split(";").map((address) => {
                return (
                  <Row
                    className="my-2 mx-2 p-1"
                    style={
                      (mediumBold,
                      { border: "1px solid #707070", borderRadius: "5px" })
                    }
                  >
                    {address}
                  </Row>
                );
              })}
              <Row className="d-flex my-2 mx-2" style={mediumBold}>
                <Col className="d-flex p-0 justify-content-left">
                  Expense type:
                </Col>
                <Col className="d-flex p-0 justify-content-end">Utility</Col>
              </Row>
              <Row className="d-flex my-2 mx-2" style={mediumBold}>
                <Col className="d-flex p-0 justify-content-left">
                  Split Method:
                </Col>
                <Col className="d-flex p-0 justify-content-end">
                  {payment.bill_algorithm}
                </Col>
              </Row>
              <Row className="d-flex my-2 mx-2" style={mediumBold}>
                <Col className="d-flex p-0 justify-content-left">
                  Bill Received on:
                </Col>
                <Col className="d-flex p-0 justify-content-end">
                  {new Date(
                    String(payment.purchase_date).split(" ")[0]
                  ).toDateString()}
                </Col>
              </Row>
              <Row className="d-flex my-2 mx-2" style={mediumBold}>
                <Col className="d-flex p-0 justify-content-left">
                  Payment Status:
                </Col>
                {payment.purchase_status === "UNPAID" ? (
                  <Col xs={3} className="mt-0" style={redPill}>
                    {payment.purchase_status}
                  </Col>
                ) : (
                  <Col xs={3} className="mt-0" style={greenPill}>
                    {payment.purchase_status}
                  </Col>
                )}
              </Row>
              <Row className="d-flex my-5 mx-2">
                <Col></Col>
                <Col className="d-flex p-0 justify-content-center">
                  <Button
                    style={bluePillButton}
                    onClick={() => setExpenseDetailManager(false)}
                  >
                    Okay
                  </Button>
                </Col>
                <Col></Col>
              </Row>
              {payment.purchase_status === "UNPAID" &&
              payment.payer.includes(user.user_uid) ? (
                <Row className="d-flex mx-2">
                  <Col></Col>
                  <Col xs={6} className="d-flex p-0 justify-content-center">
                    <Button
                      style={bluePillButton}
                      onClick={() => {
                        setPurchaseUID(payment.purchase_uid);
                        setPayExpense(true);
                        PayBill(payment.purchase_uid);
                        setExpenseDetail(false);
                        setExpenseDetailManager(false);
                      }}
                    >
                      Pay Bill
                    </Button>
                  </Col>
                  <Col></Col>
                </Row>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {!expenseDetail &&
          !expenseDetailManager &&
          maintenanceExpenseDetail ? (
            <div
              className="d-flex flex-column mx-2 p-3"
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                opacity: 1,
                height: "100%",
              }}
            >
              <Row
                className="my-2 align-items-center justify-content-center"
                style={headings}
              >
                {payment.description}
              </Row>
              <Row
                className="my-2 align-items-center justify-content-center"
                style={mediumBold}
              >
                {payment.business_name}{" "}
              </Row>
              <Row className="my-2 align-items-center justify-content-center">
                <Col
                  xs={3}
                  className="pt-4 justify-content-center align-items-center"
                  style={
                    (mediumBold,
                    {
                      color: "#007AFF",
                      border: "4px solid #007AFF",
                      borderRadius: "50%",
                      height: "83px",
                      width: "83px",
                    })
                  }
                >
                  ${payment.amount_due.toFixed(2)}
                </Col>
              </Row>
              <Row className="my-2 mx-2" style={mediumBold}>
                Properties Billed:
              </Row>
              <Row
                className="my-2 mx-2 p-1"
                style={
                  (mediumBold,
                  { border: "1px solid #707070", borderRadius: "5px" })
                }
              >
                {payment.address}
              </Row>
              <Row className="d-flex my-2 mx-2" style={mediumBold}>
                <Col className="d-flex p-0 justify-content-left">
                  Expense type:
                </Col>
                <Col className="d-flex p-0 justify-content-end">
                  {Capitalize(payment.purchase_type)}
                </Col>
              </Row>
              <Row className="d-flex my-2 mx-2" style={mediumBold}>
                <Col className="d-flex p-0 justify-content-left">
                  Bill Sent on:
                </Col>
                <Col className="d-flex p-0 justify-content-end">
                  {new Date(
                    String(payment.purchase_date).split(" ")[0]
                  ).toDateString()}
                </Col>
              </Row>
              <Row className="d-flex my-2 mx-2" style={mediumBold}>
                <Col className="d-flex p-0 justify-content-left">
                  Payment Status:
                </Col>
                {payment.purchase_status === "UNPAID" ? (
                  <Col xs={3} className="mt-0" style={redPill}>
                    {payment.purchase_status}
                  </Col>
                ) : (
                  <Col xs={3} className="mt-0" style={greenPill}>
                    {payment.purchase_status}
                  </Col>
                )}
              </Row>
              <Row className="d-flex my-5 mx-2">
                <Col></Col>
                <Col className="d-flex p-0 justify-content-center">
                  <Button
                    style={bluePillButton}
                    onClick={() => setMaintenanceExpenseDetail(false)}
                  >
                    Okay
                  </Button>
                </Col>
                <Col></Col>
              </Row>
              {payment.purchase_status === "UNPAID" ? (
                <Row className="d-flex mx-2">
                  <Col></Col>
                  <Col xs={6} className="d-flex p-0 justify-content-center">
                    <Button
                      style={bluePillButton}
                      onClick={() => {
                        setPurchaseUID(payment.purchase_uid);
                        setPayExpense(true);
                        PayBill(payment.purchase_uid);
                        setExpenseDetail(false);
                        setExpenseDetailManager(false);
                      }}
                    >
                      Pay Bill
                    </Button>
                  </Col>
                  <Col></Col>
                </Row>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {payExpense &&
          !editingUtility &&
          !expenseDetailManager &&
          !expenseDetail &&
          !maintenanceExpenseDetail ? (
            <div className="mx-2 my-2 p-3">
              <div>
                <Row
                  className="my-2 align-items-center justify-content-center"
                  style={headings}
                >
                  {payment.bill_utility_type}
                </Row>
                <Row
                  className="my-2 align-items-center justify-content-center"
                  style={mediumBold}
                >
                  {payment.bill_description}{" "}
                </Row>
                <Row className="my-2 align-items-center justify-content-center">
                  <Col
                    xs={3}
                    className="pt-4 justify-content-center align-items-center"
                    style={
                      (mediumBold,
                      {
                        color: "#007AFF",
                        border: "4px solid #007AFF",
                        borderRadius: "50%",
                        height: "83px",
                        width: "83px",
                      })
                    }
                  >
                    ${payment.amount_due.toFixed(2)}
                  </Col>
                </Row>
                <div className="mt-3" hidden={stripePayment}>
                  <Form.Group style={mediumBold}>
                    <Form.Label>Amount</Form.Label>
                    {purchaseUID.length === 1 ? (
                      <Form.Control
                        placeholder={purchase.amount_due - purchase.amount_paid}
                        style={squareForm}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    ) : (
                      <Form.Control
                        disabled
                        placeholder={purchase.amount_due - purchase.amount_paid}
                        style={squareForm}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    )}
                  </Form.Group>

                  <Form.Group style={mediumBold}>
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      placeholder="M4METEST"
                      style={squareForm}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </Form.Group>
                  <Row
                    className="text-center mt-5"
                    style={{
                      display: "text",
                      flexDirection: "column",
                      textAlign: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {disabled ? (
                      <Row style={{ width: "80%", margin: " 10%" }}>
                        Amount to be paid must be greater than 0 and less than
                        or equal total:
                      </Row>
                    ) : null}

                    {disabled ? (
                      <Col>
                        <Button
                          className="mt-2 mb-2"
                          variant="outline-primary"
                          disabled
                          style={bluePillButton}
                        >
                          Pay with Stripe
                        </Button>
                      </Col>
                    ) : (
                      <Col>
                        <Button
                          className="mt-2 mb-2"
                          variant="outline-primary"
                          onClick={() => {
                            //navigate("/tenant");
                            setStripePayment(true);
                          }}
                          style={bluePillButton}
                        >
                          Pay with Stripe
                        </Button>
                      </Col>
                    )}
                    {disabled ? (
                      <Col>
                        <Button
                          className="mt-2 mb-2"
                          variant="outline-primary"
                          disabled
                          style={pillButton}
                        >
                          Pay with PayPal
                        </Button>
                      </Col>
                    ) : (
                      <Col>
                        <Button
                          className="mt-2 mb-2"
                          variant="outline-primary"
                          onClick={submitForm}
                          style={pillButton}
                        >
                          Pay with PayPal
                        </Button>
                      </Col>
                    )}
                    <Col>
                      <Button
                        className="mt-2 mb-2"
                        variant="outline-primary"
                        onClick={() => {
                          setPayExpense(false);
                        }}
                        style={bluePillButton}
                      >
                        Pay later
                      </Button>
                    </Col>
                  </Row>
                </div>
                <div hidden={!stripePayment}>
                  <Elements stripe={stripePromise}>
                    <StripePayment
                      cancel={cancel}
                      submit={submit}
                      purchases={[purchase]}
                      message={message}
                      amount={amount}
                    />
                  </Elements>
                </div>
              </div>{" "}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagerUtilities;
