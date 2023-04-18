import React, { useState, useContext, useEffect } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import moment from "moment";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableSortLabel,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import * as ReactBootStrap from "react-bootstrap";
import Checkbox from "../Checkbox";
import Header from "../Header";
import SideBar from "./SideBar";
import OwnerFooter from "./OwnerFooter";
import AppContext from "../../AppContext";
import StripePayment from "../StripePayment.js";
import ArrowDown from "../../icons/ArrowDown.svg";
import AddIcon from "../../icons/AddIcon.svg";
import WF_Logo from "../../icons/WF-Logo.png";
import BofA_Logo from "../../icons/BofA-Logo.png";
import Chase_Logo from "../../icons/Chase-Logo.png";
import Citi_Logo from "../../icons/Citi-Logo.png";
import { post, get } from "../../utils/api";
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
  sidebarStyle,
} from "../../utils/styles";
import DocumentsUploadPost from "../DocumentsUploadPost";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});
function OwnerUtilities(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;
  const [stripePromise, setStripePromise] = useState(null);

  const [properties, setProperties] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [utilityState, setUtilityState] = useState([]);
  const [newUtility, setNewUtility] = useState(null);
  const [editingUtility, setEditingUtility] = useState(false);
  const [propertyState, setPropertyState] = useState(properties);
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const [addDoc, setAddDoc] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [tenantPay, setTenantPay] = useState(false);
  const [ownerPay, setOwnerPay] = useState(false);
  const [expenseDetail, setExpenseDetail] = useState(false);
  const [expenseDetailOwner, setExpenseDetailOwner] = useState(false);
  const [maintenanceExpenseDetail, setMaintenanceExpenseDetail] =
    useState(false);
  const [payExpense, setPayExpense] = useState(false);
  const [payExpenseOwner, setPayExpenseOwner] = useState(false);
  const [bankPayment, setBankPayment] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [allPurchases, setAllPurchases] = useState([]);
  const [purchaseUIDs, setPurchaseUIDs] = useState([]);
  const [payment, setPayment] = useState(false);
  const emptyUtility = {
    provider: "",
    service_name: "",
    charge: "",
    properties: [],
    split_type: "Uniform",
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

  // sorting variables
  // sorting variables
  const [orderOwner, setOrderOwner] = React.useState("asc");
  const [orderOwnerBy, setOrderOwnerBy] = React.useState("bill_utility_type");
  const [orderTenant, setOrderTenant] = React.useState("asc");
  const [orderTenantBy, setOrderTenantBy] = React.useState("bill_utility_type");
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [expenseUnique, setExpenseUnique] = useState("");

  const [width, setWindowWidth] = useState(0);
  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };
  const responsiveSidebar = {
    showSidebar: width > 1023,
  };

  const submitForm = () => {
    const requestTitle = requestTitleRef.current.value;
    const requestDescription = requestDescriptionRef.current.value;
    const tagPriority = tagPriorityRef.current.value;
    props.onConfirm(requestTitle, requestDescription, tagPriority);
  };
  const toggleKeys = async () => {
    //console.log("inside toggle keys");
    const url =
      message === "PMTEST"
        ? "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PMTEST"
        : "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PM";
    let response = await fetch(url);
    const responseData = await response.json();
    const stripePromise = loadStripe(responseData.publicKey);
    setStripePromise(stripePromise);
  };
  const submitPayment = async () => {
    setShowSpinner(true);

    let newPayment = {};
    if (allPurchases.length === 1) {
      // console.log(allPurchases[0]);
      newPayment = {
        pay_purchase_id: allPurchases[0].purchase_uid,
        //Need to make change here
        amount: parseFloat(amount),
        payment_notes: message,
        charge_id: confirmationCode,
        payment_type: paymentType,
      };
      await post("/payments", newPayment);
    } else {
      for (let purchase of allPurchases) {
        // console.log(purchase);
        newPayment = {
          pay_purchase_id: purchase.purchase_uid,
          //Need to make change here
          amount: parseFloat(
            purchase.amount_due.toFixed(2) - purchase.amount_paid.toFixed(2)
          ),
          payment_notes: message,
          charge_id: confirmationCode,
          payment_type: paymentType,
        };
        await post("/payments", newPayment);
      }
    }
    setShowSpinner(false);
    submit();
  };
  const PayBill = async (pid) => {
    let response = await get(`/purchases?purchase_uid=${pid}`);
    // console.log("GET PURCHASE RESPONSE", response);
    setPurchase(response.result[0]);
    setTotalSum(response.result[0].amount_due);
    setAmount(response.result[0].amount_due - response.result[0].amount_paid);
  };
  const PayBillOwner = async (pids) => {
    let tempAllPurchases = [];
    let tempAmountDue = 0;
    let tempAmountPaid = 0;

    for (let i = 0; i < pids.length; i++) {
      let response1 = await get(`/purchases?purchase_uid=${pids[i]}`);
      tempAllPurchases.push(response1.result[0]);
      tempAmountDue = tempAmountDue + response1.result[0].amount_due;
      tempAmountPaid = tempAmountPaid + response1.result[0].amount_paid;
    }

    setAllPurchases(tempAllPurchases);

    setTotalSum(Math.round(tempAmountDue));
    setAmount(Math.round(tempAmountDue - tempAmountPaid));
  };

  useEffect(() => {
    if (amount > totalSum || amount <= 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [amount]);

  const cancel = () => {
    setStripePayment(false);
    setBankPayment(false);
    fetchProperties();
  };
  const submit = () => {
    cancel();
    setPayExpense(false);
    setPayExpenseOwner(false);
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

  const fetchProperties = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }

    const response = await get("/ownerDashboard", access_token);
    if (response.msg === "Token has expired") {
      // console.log("here msg");
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
        // console.log("here in if");
        // properties_unique[properties_unique.length-1].tenants.push(property)
        const index = properties_unique.findIndex(
          (item) => item.property_uid === property.property_uid
        );
        if (
          property.rental_status === "ACTIVE" ||
          property.rental_status === "PROCESSING"
        ) {
          // console.log("here", property);
          properties_unique[index].tenants.push(property);
        }
      } else {
        // console.log("here in else");
        pids.add(property.property_uid);
        properties_unique.push(property);
        if (
          property.rental_status === "ACTIVE" ||
          property.rental_status === "PROCESSING"
        ) {
          // console.log("here", property);
          properties_unique[properties_unique.length - 1].tenants = [property];
        }
      }
    });
    setProperties(properties_unique);
    setPropertyState(properties_unique);
    let expense = [];
    properties_unique.forEach((property) => {
      if (property.expenses.length > 0) {
        // console.log("has expense");
        property.expenses.forEach((ex) => {
          // console.log("has expense", ex);
          expense.push(ex);
        });
      }
    });

    // console.log(expense);
    // console.log(properties_unique);
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
    // console.log(output);
    setExpenseUnique(output);
    setExpenses(expense);
    setIsLoading(false);
  };
  useEffect(() => {
    // console.log("in use effect");
    fetchProperties();
  }, []);
  // console.log(expenseUnique);

  const splitFees = (newUtility) => {
    let charge = parseFloat(newUtility.charge);

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
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }

    let properties_uid = [];
    newUtility.properties.forEach((prop) =>
      properties_uid.push(prop.property_uid)
    );
    const new_bill = {
      bill_created_by: user.user_uid,
      bill_description: newUtility.provider,
      bill_utility_type: newUtility.service_name,
      bill_algorithm: newUtility.split_type,
      bill_docs: files,
    };
    const newFiles = [...files];
    for (let i = 0; i < newFiles.length; i++) {
      let key = `doc_${i}`;
      if (newFiles[i].file !== undefined) {
        new_bill[key] = newFiles[i].file;
      } else {
        new_bill[key] = newFiles[i].link;
      }

      delete newFiles[i].file;
    }
    new_bill.bill_docs = JSON.stringify(newFiles);
    const response = await post("/bills", new_bill, null, newFiles);
    const bill_uid = response.bill_uid;
    // console.log(bill_uid);
    splitFees(newUtility);
    for (const property of newUtility.properties) {
      const new_purchase_pm = {
        linked_bill_id: bill_uid,
        pur_property_id: [property.property_uid],
        payer: [user.user_uid],
        receiver: newUtility.provider,
        purchase_type: "UTILITY",
        description: newUtility.service_name,
        amount_due: property.charge,
        purchase_notes: moment().format("MMMM"),
        purchase_date: moment().format("YYYY-MM-DD") + " 00:00:00",
        purchase_frequency: "One-time",
        next_payment: newUtility.due_date,
      };

      const response_pm = await post("/purchases", new_purchase_pm, null, null);
    }
    for (const property of newUtility.properties) {
      const new_purchase = {
        linked_bill_id: bill_uid,
        pur_property_id: [property.property_uid],
        payer: "",
        receiver: user.user_uid,
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
        if (
          property.rental_status === "ACTIVE" ||
          property.rental_status === "TENANT APPROVED" ||
          property.rental_status === "PENDING"
        ) {
          // console.log("property.tenants", property.rentalInfo[0]);
          let tenant_ids = [];
          property.rentalInfo.forEach((r) => {
            if (r.rental_status === "ACTIVE") {
              tenant_ids = r.tenant_id;
            }
          });
          // console.log(tenant_ids);
          new_purchase.payer = [tenant_ids];
        } else {
          new_purchase.payer = [property.owner_id];
        }
      } else {
        new_purchase.payer = [property.owner_id];
      }

      // console.log("New Purchase", new_purchase);
      const response_t = await post("/purchases", new_purchase, null, null);
    }

    setNewUtility({ ...emptyUtility });
    propertyState.forEach((prop) => (prop.checked = false));
    setPropertyState(propertyState);
    setEditingUtility(false);
    setTenantPay(false);
    setOwnerPay(false);
    setExpenseDetail(false);
    setMaintenanceExpenseDetail(false);
    setPayment(null);
    setPayExpense(false);
    setEditingUtility(false);
    fetchProperties();
  };

  const addUtility = async () => {
    if (
      newUtility.service_name === "" ||
      newUtility.charge === "" ||
      newUtility.provider === ""
    ) {
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
    }

    setErrorMessage("");

    newUtility.properties = [...propertyState.filter((p) => p.checked)];

    await postCharges(newUtility);
    const newUtilityState = [...utilityState];
    newUtilityState.push({ ...newUtility });
    setUtilityState(newUtilityState);
    setNewUtility(null);
  };

  const postChargesandPay = async (newUtility) => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }
    let properties_uid = [];
    newUtility.properties.forEach((prop) =>
      properties_uid.push(prop.property_uid)
    );
    const new_bill = {
      bill_created_by: user.user_uid,
      bill_description: newUtility.provider,
      bill_utility_type: newUtility.service_name,
      bill_algorithm: newUtility.split_type,
      bill_docs: files,
    };
    const newFiles = [...files];

    for (let i = 0; i < newFiles.length; i++) {
      let key = `doc_${i}`;
      if (newFiles[i].file !== undefined) {
        new_bill[key] = newFiles[i].file;
      } else {
        new_bill[key] = newFiles[i].link;
      }
      delete newFiles[i].file;
    }
    new_bill.bill_docs = JSON.stringify(newFiles);
    const response = await post("/bills", new_bill, null, newFiles);
    const bill_uid = response.bill_uid;

    let today_date = new Date().toISOString().split("T")[0];
    splitFees(newUtility);
    let purchase_uids = [];
    let purchase_uid = "";
    for (const property of newUtility.properties) {
      const new_purchase_pm = {
        linked_bill_id: bill_uid,
        pur_property_id: [property.property_uid],
        payer: [user.user_uid],
        receiver: newUtility.provider,
        purchase_type: "UTILITY",
        description: newUtility.service_name,
        amount_due: property.charge,
        purchase_notes: moment().format("MMMM"),
        purchase_date: moment().format("YYYY-MM-DD") + " 00:00:00",
        purchase_frequency: "One-time",
        next_payment:
          newUtility.due_date === "" ? today_date : newUtility.due_date,
      };

      const response_pm = await post("/purchases", new_purchase_pm, null, null);
      // console.log(response_pm);
      purchase_uids.push(response_pm.purchase_uid);
    }
    purchase_uid = purchase_uids[0];
    setPurchaseUIDs(purchase_uids);

    for (const property of newUtility.properties) {
      const new_purchase = {
        linked_bill_id: bill_uid,
        pur_property_id: [property.property_uid],
        payer: "",
        receiver: user.user_uid,
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
        if (
          property.rental_status === "ACTIVE" ||
          property.rental_status === "TENANT APPROVED" ||
          property.rental_status === "PENDING"
        ) {
          // console.log("property.tenants", property.rentalInfo[0]);
          let tenant_ids = [];
          property.rentalInfo.forEach((r) => {
            if (r.rental_status === "ACTIVE") {
              tenant_ids = r.tenant_id;
            }
          });
          // console.log(tenant_ids);
          new_purchase.payer = [tenant_ids];
        } else {
          new_purchase.payer = [property.owner_id];
        }
      } else {
        new_purchase.payer = [property.owner_id];
      }

      const response_t = await post("/purchases", new_purchase, null, null);
    }

    setNewUtility({ ...emptyUtility });
    propertyState.forEach((prop) => (prop.checked = false));
    setPropertyState(propertyState);
    setEditingUtility(false);
    setTenantPay(false);
    setOwnerPay(false);
    PayBillOwner(purchase_uids);
    setPayExpenseOwner(true);
  };
  const addUtilityandPay = async () => {
    if (
      newUtility.service_name === "" ||
      newUtility.charge === "" ||
      newUtility.provider === ""
    ) {
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
    }

    setErrorMessage("");

    newUtility.properties = [...propertyState.filter((p) => p.checked)];
    // newUtility.properties = propertyState.filter((p) => p.checked)
    // splitFees(newUtility);
    await postChargesandPay(newUtility);
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

  const changeNewUtility = (event, field) => {
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
  const handleRequestSortOwner = (event, property) => {
    const isAsc = orderOwnerBy === property && orderOwner === "asc";
    setOrderOwner(isAsc ? "desc" : "asc");
    setOrderOwnerBy(property);
  };

  function descendingComparatorOwner(a, b, orderOwnerBy) {
    if (b[orderOwnerBy] < a[orderOwnerBy]) {
      return -1;
    }
    if (b[orderOwnerBy] > a[orderOwnerBy]) {
      return 1;
    }
    return 0;
  }

  function getComparatorOwner(orderOwner, orderOwnerBy) {
    return orderOwner === "desc"
      ? (a, b) => descendingComparatorOwner(a, b, orderOwnerBy)
      : (a, b) => -descendingComparatorOwner(a, b, orderOwnerBy);
  }

  function stableSortOwner(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const orderOwner = comparator(a[0], b[0]);
      if (orderOwner !== 0) {
        return orderOwner;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCellsOwner = [
    {
      id: "bill_utility_type",
      numeric: false,
      label: "Bill Type",
    },
    {
      id: "description",
      numeric: false,
      label: "Description",
    },
    {
      id: "address",
      numeric: false,
      label: "Address",
    },
    {
      id: "bill_algorithm",
      numeric: false,
      label: "Split Method",
    },
    {
      id: "payer",
      numeric: false,
      label: "Payer",
    },
    {
      id: "receiver",
      numeric: false,
      label: "Payee",
    },
    {
      id: "amount",
      numeric: false,
      label: "Amount",
    },
    {
      id: "purchase_date",
      numeric: false,
      label: "Date Added",
    },
    {
      id: "purchase_status",
      numeric: false,
      label: "Purchase Status",
    },
  ];
  function EnhancedTableHeadOwner(props) {
    const { orderOwner, orderOwnerBy, onRequestSortOwner } = props;
    const createSortHandlerOwner = (property) => (event) => {
      onRequestSortOwner(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {headCellsOwner.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              size="small"
              sortDirection={orderOwnerBy === headCell.id ? orderOwner : false}
            >
              <TableSortLabel
                active={orderOwnerBy === headCell.id}
                direction={orderOwnerBy === headCell.id ? orderOwner : "asc"}
                onClick={createSortHandlerOwner(headCell.id)}
              >
                {headCell.label}
                {orderOwnerBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {orderOwner === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHeadOwner.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSortOwner: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    orderOwner: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderOwnerBy: PropTypes.string.isRequired,
    // rowCount: PropTypes.number.isRequired,
  };
  const handleRequestSortTenant = (event, property) => {
    const isAsc = orderTenantBy === property && orderTenant === "asc";
    setOrderTenant(isAsc ? "desc" : "asc");
    setOrderTenantBy(property);
  };

  function descendingComparatorTenant(a, b, orderTenantBy) {
    if (b[orderTenantBy] < a[orderTenantBy]) {
      return -1;
    }
    if (b[orderTenantBy] > a[orderTenantBy]) {
      return 1;
    }
    return 0;
  }

  function getComparatorTenant(orderTenant, orderTenantBy) {
    return orderTenant === "desc"
      ? (a, b) => descendingComparatorTenant(a, b, orderTenantBy)
      : (a, b) => -descendingComparatorTenant(a, b, orderTenantBy);
  }

  function stableSortTenant(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const orderTenant = comparator(a[0], b[0]);
      if (orderTenant !== 0) {
        return orderTenant;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCellsTenant = [
    {
      id: "bill_utility_type",
      numeric: false,
      label: "Bill Type",
    },
    {
      id: "description",
      numeric: false,
      label: "Description",
    },
    {
      id: "address",
      numeric: false,
      label: "Address",
    },
    {
      id: "bill_algorithm",
      numeric: false,
      label: "Split Method",
    },
    {
      id: "payer",
      numeric: false,
      label: "Payer",
    },
    {
      id: "receiver",
      numeric: false,
      label: "Payee",
    },
    {
      id: "amount",
      numeric: false,
      label: "Amount",
    },
    {
      id: "purchase_date",
      numeric: false,
      label: "Date Added",
    },
    {
      id: "purchase_status",
      numeric: false,
      label: "Purchase Status",
    },
  ];
  function EnhancedTableHeadTenant(props) {
    const { orderTenant, orderTenantBy, onRequestSortTenant } = props;
    const createSortHandlerTenant = (property) => (event) => {
      onRequestSortTenant(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {headCellsTenant.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              size="small"
              sortDirection={
                orderTenantBy === headCell.id ? orderTenant : false
              }
            >
              <TableSortLabel
                active={orderTenantBy === headCell.id}
                direction={orderTenantBy === headCell.id ? orderTenant : "asc"}
                onClick={createSortHandlerTenant(headCell.id)}
              >
                {headCell.label}
                {orderTenantBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {orderTenant === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHeadTenant.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSortTenant: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    orderTenant: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderTenantBy: PropTypes.string.isRequired,
    // rowCount: PropTypes.number.isRequired,
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    {
      id: "bill_utility_type",
      numeric: false,
      label: "Bill Type",
    },
    {
      id: "description",
      numeric: false,
      label: "Description",
    },
    {
      id: "address",
      numeric: false,
      label: "Address",
    },
    {
      id: "bill_algorithm",
      numeric: false,
      label: "Split Method",
    },
    {
      id: "payer",
      numeric: false,
      label: "Payer",
    },
    {
      id: "receiver",
      numeric: false,
      label: "Payee",
    },
    {
      id: "amount",
      numeric: false,
      label: "Amount",
    },
    {
      id: "purchase_date",
      numeric: false,
      label: "Date Added",
    },
    {
      id: "purchase_status",
      numeric: false,
      label: "Purchase Status",
    },
  ];
  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              size="small"
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    // rowCount: PropTypes.number.isRequired,
  };
  return (
    <div>
      <Row className="w-100 mb-5 overflow-hidden">
        <Col
          xs={2}
          hidden={!responsiveSidebar.showSidebar}
          style={sidebarStyle}
        >
          <SideBar />
        </Col>
        <Col className="w-100 mb-5 overflow-scroll">
          <Header
            title="Utilities"
            leftText={
              editingUtility ||
              expenseDetail ||
              expenseDetailOwner ||
              maintenanceExpenseDetail ||
              payExpense ||
              payExpenseOwner
                ? "< Back"
                : ""
            }
            leftFn={() => {
              setNewUtility(null);
              setExpenseDetail(false);
              setExpenseDetailOwner(false);
              setMaintenanceExpenseDetail(false);
              setPayment(null);
              propertyState.forEach((prop) => (prop.checked = false));
              setPropertyState(propertyState);
              setTenantPay(false);
              setOwnerPay(false);
              setPayExpense(false);
              setPayExpenseOwner(false);
              setStripePayment(false);
              setEditingUtility(false);
            }}
          />
          {isLoading ? (
            <div className="d-flex justify-content-center mb-4 mx-2 mb-2 p-3">
              <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                <ReactBootStrap.Spinner animation="border" role="status" />
              </div>
            </div>
          ) : (
            <div>
              <Row className="m-3">
                <Col>
                  {" "}
                  <h3>Utilities </h3>
                </Col>
              </Row>
              {newUtility !== null &&
              editingUtility &&
              !expenseDetail &&
              !maintenanceExpenseDetail &&
              !expenseDetailOwner ? (
                <div
                  className="mx-3 my-3 p-2"
                  style={{
                    background: "#E9E9E9 0% 0% no-repeat padding-box",
                    borderRadius: "10px",
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
                          placeholder="Utility Name"
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
                          placeholder="Amount($)"
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
                          placeholder="Utility Provider"
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
                          Due by Date{" "}
                          {newUtility.due_date === "" ? required : ""}
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
                      {/*<Checkbox type='BOX' checked={newUtility.add_to_rent ? 'checked' : ''}*/}
                      {/*          onClick={(checked) => changeNewUtility(checked, 'add_to_rent')} />*/}
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
                            onClick={() => {
                              setTenantPay(!tenantPay);
                              setOwnerPay(false);
                            }}
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
                            onClick={() => {
                              setOwnerPay(!ownerPay);
                              setTenantPay(false);
                            }}
                          />
                          <p className="ms-1 mb-1">Owner</p>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

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

                  <Row className="mx-1 mt-3 mb-2">
                    <h6 style={mediumBold}>Documents</h6>
                    <DocumentsUploadPost
                      files={files}
                      setFiles={setFiles}
                      addDoc={addDoc}
                      setAddDoc={setAddDoc}
                      editingDoc={editingDoc}
                      setEditingDoc={setEditingDoc}
                    />
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
                    <p style={{ ...red, ...small }}>
                      {errorMessage || "error"}
                    </p>
                  </div>
                  <div
                    className="d-flex justify-content-center mb-4 mx-2 mb-2 p-3"
                    style={{
                      background: "#E9E9E9 0% 0% no-repeat padding-box",

                      opacity: 1,
                    }}
                  >
                    <Button
                      variant="outline-primary"
                      style={pillButton}
                      onClick={addUtility}
                      className="mx-2"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline-primary"
                      style={pillButton}
                      onClick={addUtilityandPay}
                      className="mx-2"
                    >
                      Pay Now
                    </Button>
                    <Button
                      variant="outline-primary"
                      style={pillButton}
                      onClick={cancelEdit}
                      className="mx-2"
                    >
                      Cancel
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
              !expenseDetailOwner &&
              !expenseDetail &&
              !maintenanceExpenseDetail &&
              !payExpense &&
              !payExpenseOwner ? (
                <div className="mx-2 my-2 p-3">
                  <div
                    className="mx-3 my-3 p-2"
                    style={{
                      background: "#E9E9E9 0% 0% no-repeat padding-box",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <Row className="m-3">
                      <Col>
                        {" "}
                        <h3>Utilities Due From Owner </h3>
                      </Col>

                      <Col>
                        <img
                          src={AddIcon}
                          alt="Add Icon"
                          onClick={() => {
                            setNewUtility({ ...emptyUtility });
                            propertyState.forEach(
                              (prop) => (prop.checked = false)
                            );
                            setPropertyState(propertyState);
                            setTenantPay(false);
                            setOwnerPay(true);
                            setEditingUtility(true);
                          }}
                          style={{
                            width: "30px",
                            height: "30px",
                            float: "right",
                            marginRight: "5rem",
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="m-3" style={{ overflow: "scroll" }}>
                      <Table
                        responsive="md"
                        classes={{ root: classes.customTable }}
                        size="small"
                      >
                        <EnhancedTableHeadOwner
                          orderOwner={orderOwner}
                          orderOwnerBy={orderOwnerBy}
                          onRequestSortOwner={handleRequestSortOwner}
                          // rowCount="4"
                        />{" "}
                        <TableBody>
                          {stableSortOwner(
                            expenseUnique,
                            getComparatorOwner(orderOwner, orderOwnerBy)
                          ).map((expense, index) => {
                            return expense.purchase_type === "UTILITY" &&
                              expense.payer.includes(user.user_uid) &&
                              expense.receiver !== user.user_uid ? (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={index}
                                onClick={() => {
                                  setExpenseDetailOwner(true);
                                  setPayment(expense);
                                }}
                              >
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.bill_utility_type}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.description}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {" "}
                                  {expense.address
                                    .split(";")
                                    .map((addressMap) => {
                                      return <p>{addressMap}</p>;
                                    })}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.bill_algorithm !== null
                                    ? expense.bill_algorithm
                                    : "None"}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.payer}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.receiver}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  ${expense.amount_due}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {" "}
                                  {expense.purchase_date}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.purchase_status === "UNPAID" ? (
                                    <Col className="mt-0" style={redPill}>
                                      {expense.purchase_status}
                                    </Col>
                                  ) : (
                                    <Col className="mt-0" style={greenPill}>
                                      {expense.purchase_status}
                                    </Col>
                                  )}
                                </TableCell>
                              </TableRow>
                            ) : (
                              <Row style={headings}></Row>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Row>
                    {/* {expenseUnique.map((expense) => {
                    return expense.purchase_type === "UTILITY" &&
                      expense.payer.includes(user.user_uid) ? (
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
                            setExpenseDetailOwner(true);
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
                      <Row style={headings}></Row>
                    );
                  })} */}
                  </div>
                  <div
                    className="mx-3 my-3 p-2"
                    style={{
                      background: "#E9E9E9 0% 0% no-repeat padding-box",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <Row className="m-3">
                      <Col>
                        <h3>Utilities Due From Tenant </h3>
                      </Col>
                      <Col>
                        <img
                          src={AddIcon}
                          alt="Add Icon"
                          onClick={() => {
                            setNewUtility({ ...emptyUtility });
                            propertyState.forEach(
                              (prop) => (prop.checked = false)
                            );
                            setPropertyState(propertyState);
                            setTenantPay(true);
                            setOwnerPay(false);
                            setEditingUtility(true);
                          }}
                          style={{
                            width: "30px",
                            height: "30px",
                            float: "right",
                            marginRight: "5rem",
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="m-3" style={{ overflow: "scroll" }}>
                      <Table
                        responsive="md"
                        classes={{ root: classes.customTable }}
                        size="small"
                      >
                        <EnhancedTableHeadTenant
                          orderTenant={orderTenant}
                          orderTenantBy={orderTenantBy}
                          onRequestSortTenant={handleRequestSortTenant}
                          // rowCount="4"
                        />{" "}
                        <TableBody>
                          {stableSortTenant(
                            expenseUnique,
                            getComparatorTenant(orderTenant, orderTenantBy)
                          ).map((expense, index) => {
                            return expense.purchase_type === "UTILITY" &&
                              !expense.payer.includes(user.user_uid) ? (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={index}
                                onClick={() => {
                                  setExpenseDetail(true);
                                  setPayment(expense);
                                }}
                              >
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.bill_utility_type}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.description}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {" "}
                                  {expense.address}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.bill_algorithm !== null
                                    ? expense.bill_algorithm
                                    : "None"}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.payer}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.receiver}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  ${expense.amount_due}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {" "}
                                  {expense.purchase_date}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.purchase_status === "UNPAID" ? (
                                    <Col className="mt-0" style={redPill}>
                                      {expense.purchase_status}
                                    </Col>
                                  ) : (
                                    <Col className="mt-0" style={greenPill}>
                                      {expense.purchase_status}
                                    </Col>
                                  )}
                                </TableCell>
                              </TableRow>
                            ) : (
                              <Row style={headings}></Row>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Row>
                    {/* {expenseUnique.map((expense) => {
                    return expense.purchase_type === "UTILITY" &&
                      !expense.payer.includes(user.user_uid) ? (
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
                  })} */}
                  </div>
                  <div
                    className="mx-3 my-3 p-2"
                    style={{
                      background: "#E9E9E9 0% 0% no-repeat padding-box",
                      borderRadius: "10px",
                      opacity: 1,
                    }}
                  >
                    <Row className="m-3">
                      {" "}
                      <Col>
                        <h3> Maintenance Payments </h3>
                      </Col>{" "}
                    </Row>
                    <Row className="m-3" style={{ overflow: "scroll" }}>
                      <Table
                        responsive="md"
                        classes={{ root: classes.customTable }}
                        size="small"
                      >
                        <EnhancedTableHead
                          order={order}
                          orderBy={orderBy}
                          onRequestSort={handleRequestSort}
                          // rowCount="4"
                        />{" "}
                        <TableBody>
                          {stableSort(
                            expenseUnique,
                            getComparator(order, orderBy)
                          ).map((expense, index) => {
                            return expense.purchase_type === "MAINTENANCE" ||
                              expense.purchase_type === "REPAIRS" ? (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={expense.address}
                                onClick={() => {
                                  setExpenseDetail(true);
                                  setPayment(expense);
                                }}
                              >
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.purchase_type}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.description}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {" "}
                                  {expense.address}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.bill_algorithm !== null
                                    ? expense.bill_algorithm
                                    : "None"}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.payer}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.receiver}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  ${expense.amount_due}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {" "}
                                  {expense.purchase_date}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  size="small"
                                  align="center"
                                >
                                  {expense.purchase_status === "UNPAID" ? (
                                    <Col className="mt-0" style={redPill}>
                                      {expense.purchase_status}
                                    </Col>
                                  ) : (
                                    <Col className="mt-0" style={greenPill}>
                                      {expense.purchase_status}
                                    </Col>
                                  )}
                                </TableCell>
                              </TableRow>
                            ) : (
                              <Row style={headings}></Row>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Row>
                    {/* {expenseUnique.map((expense) => {
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
                  })} */}
                  </div>
                </div>
              ) : newUtility === null &&
                !editingUtility &&
                !expenseDetail &&
                !expenseDetailOwner &&
                !maintenanceExpenseDetail &&
                !payExpense &&
                !payExpenseOwner ? (
                <Row className="m-3">
                  <Col className="m-3">No utilities</Col>

                  <Col>
                    <img
                      src={AddIcon}
                      alt="Add Icon"
                      onClick={() => {
                        setNewUtility({ ...emptyUtility });
                        propertyState.forEach((prop) => (prop.checked = false));
                        setPropertyState(propertyState);
                        setTenantPay(false);
                        setOwnerPay(false);
                        setEditingUtility(true);
                      }}
                      style={{
                        width: "30px",
                        height: "30px",
                        float: "right",
                        marginRight: "5rem",
                      }}
                    />
                  </Col>
                </Row>
              ) : (
                <div className="d-flex justify-content-center mb-4 mx-2 mb-2 p-3">
                  <div className="w-100 d-flex flex-column justify-content-center align-items-center"></div>
                </div>
              )}
            </div>
          )}

          {expenseDetail && !expenseDetailOwner && !maintenanceExpenseDetail ? (
            <div
              className="d-flex flex-column mx-2 p-3"
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                opacity: 1,
                height: "100%",
              }}
            >
              {/* {console.log(payment)} */}
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
                  ${payment.amount_due}
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
                        // navigate(`/ownerPaymentPage/${payment.purchase_uid}`, {
                        //   state: {
                        //     amount: payment.amount_due,
                        //     selectedProperty: payment,
                        //     purchaseUID: payment.purchase_uid,
                        //   },
                        // });
                        setPurchaseUID(payment.purchase_uid);
                        setPayExpense(true);
                        PayBill(payment.purchase_uid);
                        setExpenseDetail(false);
                        setExpenseDetailOwner(false);
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
          {!expenseDetail && expenseDetailOwner && !maintenanceExpenseDetail ? (
            <div
              className="d-flex flex-column mx-2 p-3"
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                opacity: 1,
                height: "100%",
              }}
            >
              {/* {console.log(payment)} */}
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
                  ${payment.amount_due}
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
                    onClick={() => setExpenseDetailOwner(false)}
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
                        setExpenseDetail(false);
                        setExpenseDetailOwner(false);
                        PayBill(payment.purchase_uid);
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
          {!expenseDetail && !expenseDetailOwner && maintenanceExpenseDetail ? (
            <div
              className="d-flex flex-column mx-2 p-3"
              style={{
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                opacity: 1,
                height: "100%",
              }}
            >
              {/* {console.log(payment)} */}
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
                  ${payment.amount_due}
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
                        setExpenseDetailOwner(false);
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
          !payExpenseOwner &&
          !editingUtility &&
          !expenseDetailOwner &&
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
                    ${purchase.amount_due}
                  </Col>
                </Row>
                <div className="mt-3" hidden={stripePayment || bankPayment}>
                  <Form.Group style={mediumBold}>
                    {/* {console.log(purchaseUID)} */}
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
                      placeholder="Enter a payment message"
                      style={squareForm}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </Form.Group>
                  <Row className="text-center mt-5">
                    <Col>
                      <a
                        href="https://www.bankofamerica.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          onClick={() => {
                            setBankPayment(true);
                            setPaymentType("BANK OF AMERICA");
                          }}
                          src={BofA_Logo}
                          style={{
                            width: "160px",
                            height: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </a>
                    </Col>
                    <Col>
                      <a
                        href="https://www.chase.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          onClick={() => {
                            setBankPayment(true);
                            setPaymentType("CHASE");
                          }}
                          src={Chase_Logo}
                          style={{
                            width: "160px",
                            height: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </a>
                    </Col>
                    <Col>
                      <a
                        href="https://www.citi.com/login?deepdrop=true&checkAuth=Y"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          onClick={() => {
                            setBankPayment(true);
                            setPaymentType("CITI");
                          }}
                          src={Citi_Logo}
                          style={{
                            width: "160px",
                            height: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </a>
                    </Col>
                    <Col>
                      <a
                        href="https://www.wellsfargo.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          onClick={() => {
                            setBankPayment(true);
                            setPaymentType("WELLS FARGO");
                          }}
                          src={WF_Logo}
                          style={{
                            width: "160px",
                            height: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </a>
                    </Col>
                  </Row>
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
                            toggleKeys();
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
                          submit();
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
                <div hidden={!bankPayment}>
                  <div
                    style={{
                      border: "1px solid black",
                      borderRadius: "10px",
                      padding: "10px",
                      margin: "20px",
                    }}
                  >
                    <Form.Group>
                      <Form.Label>Please enter confirmation code</Form.Label>
                      <Form.Control
                        placeholder="Confirmation Code"
                        style={squareForm}
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div className="text-center mt-2">
                    {showSpinner ? (
                      <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                        <ReactBootStrap.Spinner
                          animation="border"
                          role="status"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <Row
                      style={{
                        display: "text",
                        flexDirection: "row",
                        textAlign: "center",
                      }}
                    >
                      <Col>
                        <Button
                          variant="outline-primary"
                          onClick={cancel}
                          style={pillButton}
                        >
                          Cancel
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant="outline-primary"
                          //onClick={submitForm}
                          style={bluePillButton}
                          onClick={submitPayment}
                        >
                          Pay Now
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>{" "}
            </div>
          ) : (
            ""
          )}
          {payExpenseOwner &&
          !payExpense &&
          !editingUtility &&
          !expenseDetailOwner &&
          !expenseDetail &&
          !maintenanceExpenseDetail ? (
            <div
              className="mx-3 my-3 p-2"
              style={{
                background: "#E9E9E9 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Row style={headings} className="m-3">
                  Total Payment: ${Math.round(totalSum)}
                </Row>
                <Row className="m-3">
                  <Table
                    responsive="md"
                    classes={{ root: classes.customTable }}
                    size="small"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Address</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Utility Type</TableCell>{" "}
                        <TableCell>Date Due</TableCell>{" "}
                        <TableCell>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    {allPurchases.map((purchase) => {
                      return (
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              {" "}
                              {purchase.address}
                              {purchase.unit !== ""
                                ? " " + purchase.unit
                                : ""}, {purchase.city}, {purchase.state}{" "}
                              {purchase.zip}
                            </TableCell>
                            <TableCell>{purchase.bill_description}</TableCell>
                            <TableCell>{purchase.bill_utility_type}</TableCell>
                            <TableCell>
                              {purchase.next_payment.substring(0, 10)}
                            </TableCell>
                            <TableCell>
                              ${purchase.amount_due.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      );
                    })}
                  </Table>
                </Row>
                <Row className="m-3">
                  <div className="mt-3" hidden={stripePayment || bankPayment}>
                    <Form.Group style={mediumBold}>
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        placeholder="Enter a payment message"
                        style={squareForm}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </Form.Group>
                    <Row className="text-center mt-5">
                      <Col>
                        <a
                          href="https://www.bankofamerica.com"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            onClick={() => {
                              setBankPayment(true);
                              setPaymentType("BANK OF AMERICA");
                            }}
                            src={BofA_Logo}
                            style={{
                              width: "160px",
                              height: "100px",
                              objectFit: "contain",
                            }}
                          />
                        </a>
                      </Col>
                      <Col>
                        <a
                          href="https://www.chase.com"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            onClick={() => {
                              setBankPayment(true);
                              setPaymentType("CHASE");
                            }}
                            src={Chase_Logo}
                            style={{
                              width: "160px",
                              height: "100px",
                              objectFit: "contain",
                            }}
                          />
                        </a>
                      </Col>
                      <Col>
                        <a
                          href="https://www.citi.com/login?deepdrop=true&checkAuth=Y"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            onClick={() => {
                              setBankPayment(true);
                              setPaymentType("CITI");
                            }}
                            src={Citi_Logo}
                            style={{
                              width: "160px",
                              height: "100px",
                              objectFit: "contain",
                            }}
                          />
                        </a>
                      </Col>
                      <Col>
                        <a
                          href="https://www.wellsfargo.com"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            onClick={() => {
                              setBankPayment(true);
                              setPaymentType("WELLS FARGO");
                            }}
                            src={WF_Logo}
                            style={{
                              width: "160px",
                              height: "100px",
                              objectFit: "contain",
                            }}
                          />
                        </a>
                      </Col>
                    </Row>
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
                              toggleKeys();
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
                            submit();
                          }}
                          style={bluePillButton}
                        >
                          Pay later
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Row>
                <Row className="m-3">
                  <div hidden={!stripePayment}>
                    <Elements stripe={stripePromise}>
                      <StripePayment
                        cancel={cancel}
                        submit={submit}
                        purchases={allPurchases}
                        message={message}
                        amount={amount}
                      />
                    </Elements>
                  </div>
                  <div hidden={!bankPayment}>
                    <div
                      style={{
                        border: "1px solid black",
                        borderRadius: "10px",
                        padding: "10px",
                        margin: "20px",
                      }}
                    >
                      <Form.Group>
                        <Form.Label>Please enter confirmation code</Form.Label>
                        <Form.Control
                          placeholder="Confirmation Code"
                          style={squareForm}
                          value={confirmationCode}
                          onChange={(e) => setConfirmationCode(e.target.value)}
                        />
                      </Form.Group>
                    </div>
                    <div className="text-center mt-2">
                      {showSpinner ? (
                        <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                          <ReactBootStrap.Spinner
                            animation="border"
                            role="status"
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      <Row
                        style={{
                          display: "text",
                          flexDirection: "row",
                          textAlign: "center",
                        }}
                      >
                        <Col>
                          <Button
                            variant="outline-primary"
                            onClick={cancel}
                            style={pillButton}
                          >
                            Cancel
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            variant="outline-primary"
                            //onClick={submitForm}
                            style={bluePillButton}
                            onClick={submitPayment}
                          >
                            Pay Now
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Row>
              </div>
            </div>
          ) : (
            ""
          )}
          <div hidden={responsiveSidebar.showSidebar} className="w-100 mt-3">
            <OwnerFooter />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default OwnerUtilities;
