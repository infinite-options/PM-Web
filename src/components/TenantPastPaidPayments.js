import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col} from "react-bootstrap";
import Footer from "./Footer";
import PastExpenseItem from "./PastExpenseItem";
import { Navigate } from "react-router-dom";
import {
    greenPill,
    redPill,
    bluePill,
    bluePillButton,
} from "../utils/styles";

function TenantPastPaidPayments(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedProperty = location.state.selectedProperty;
    const [tenantExpenses, setTenantExpenses] = useState([]);
    const [rentPayments, setRentPayments] = useState([]);
    const [utilityPayments, setUtilityPayments] = useState([]);
    const [otherPayments, setOtherPayments] = useState([]);
    const upcoming = location.state.upcoming;
    
    let tempRentPayments = [];
    let tempUtilityPayments = [];
    let tempOtherPayments = [];
    const parseExpenses = () => {
        // let tempMonth = 0;
        // let tempDate = 0;
        // let tempYear = 0;
        // const currentMonth = new Date().getMonth();
        // const currentDay = new Date().getDate();
        // const currentYear = new Date().getFullYear();
        for (let expense of tenantExpenses) {
            console.log(expense);
            // let dueDate;
            // let currentDate;
            // let date = expense.next_payment;
            // if (date !== null) {
            //     date = date.split(" ")[0].split("-");
            //     tempMonth = parseInt(date[1]);
            //     tempDate = parseInt(date[2]);
            //     tempYear = parseInt(date[0]);
            //     dueDate = new Date(tempYear, tempMonth - 1, tempDate);
            //     currentDate = new Date(currentYear, currentMonth, currentDay);
            // }
            if (expense.amount_paid && expense.amount_paid > 0) {
                if(expense.purchase_type === "RENT") {
                    tempRentPayments.push(expense);
                }
                else if (expense.purchase_type === "EXTRA CHARGES") {
                    tempOtherPayments.push(expense);
                }
                else if (expense.purchase_type === "UTILITY") {
                    tempUtilityPayments.push(expense);
                }

            }
        }
    }

    useEffect(()=> {
        setTenantExpenses(selectedProperty.property.tenantExpenses);
        parseExpenses();
        setRentPayments(tempRentPayments);
        setUtilityPayments(tempUtilityPayments);
        setOtherPayments(tempOtherPayments);
    }, [tenantExpenses]);
    useEffect(()=> {
        console.log("Rent payments", rentPayments);
        console.log("Utility payments",utilityPayments);
        console.log("Other payments",otherPayments);
    }, [rentPayments, utilityPayments, otherPayments]);

    return <div className="h-100" style={{backgroundColor: '#E9E9E9'}}>
        <Header 
            customClass={"mb-2"}
            title="Past Payments"
            leftText={`< Back`}
            leftFn={() => navigate("/tenant")}
        />
        <Container style={{borderRadius: '10px', margin: '2%', backgroundColor: 'white', width: '96%', minHeight: '90%'}}>
            {/* ========= Property Name ========== */}
            <Row 
                style={{ 
                    height: '40px',
                    fontSize: '24px', 
                    fontFamily: 'bahnschrift',
                }}>
                    <div
                        style={{
                            textAlign:'center',
                            fontSize: "24px",
                            padding: "10px",
                            borderRadius: "10px 10px 0px 0px",
                        }}
                    >
                        {selectedProperty.property.address}
                    </div>
                    
            </Row>
            <Row>
                <div style={{width: '100%', textAlign: 'center', marginTop: '20px', fontSize: '20px'}}>Rent Payments</div>
            </Row>

            {/* ========= List of Rent payments ========== */}
            {rentPayments.length > 0 ?
                <Row>
                    <div style={{marginTop: '28px', height: 'auto'}}>
                        <div style={{ border:'solid', borderBottom: 'none', display:'flex', flexDirection: 'row', width: '98%', margin: '0% 1% 0% 1%', borderRadius:'10px 10px 0 0'}}>
                            <div style={{marginRight: '0px', width: '100px', textAlign: 'center', fontSize: '20px', }}>Amount</div>
                            <div style={{marginRight: '0px', textAlign: 'center', fontSize: '20px', width: '150px'}}>Date</div>
                            <div style={{textAlign: 'center', fontSize: '20px', width: '110px'}}>Reason</div>
                        </div>
                        <div style={{border:'solid', borderTop: 'none',width: '98%', margin: '0% 1% 0% 1%', borderRadius:'0px 0px 10px 10px'}}>
                            {rentPayments.length > 8 ? 
                                <ul style={{overflowY: 'visible', listStyle: 'none', overflow: 'scroll', overflowX: 'hidden', padding: '0px'}}>
                                    {rentPayments.map((expense, i) => {
                                        return <PastExpenseItem expense={expense}/>
                                    })}
                                </ul> 
                                : 
                                <ul style={{overflowY: 'hidden', listStyle: 'none', overflow: 'scroll', overflowX: 'hidden', padding: '0px'}}>
                                    {rentPayments.map((expense, i) => {
                                        return <PastExpenseItem expense={expense}/>
                                    })}
                                </ul>
                            }
                        </div>
                    </div>
                    
                    
                </Row> : 
                <div style={{textAlign: 'center', fontSize: '15px'}}>No past rent payments made</div>
            }  


            <Row>
                <div style={{width: '100%', textAlign: 'center', marginTop: '20px', fontSize: '20px'}}>Utility Payments</div>
            </Row>
            {/* ========= List of utility payments ========== */}
            {utilityPayments.length > 0 ?
                <Row>
                    <div style={{marginTop: '28px', height: 'auto'}}>
                        <div style={{ border:'solid', borderBottom: 'none', display:'flex', flexDirection: 'row', width: '98%', margin: '0% 1% 0% 1%', borderRadius:'10px 10px 0 0'}}>
                            <div style={{marginRight: '0px', width: '100px', textAlign: 'center', fontSize: '20px', }}>Amount</div>
                            <div style={{marginRight: '0px', textAlign: 'center', fontSize: '20px', width: '150px'}}>Date</div>
                            <div style={{textAlign: 'center', fontSize: '20px', width: '110px'}}>Reason</div>
                        </div>
                        <div style={{border:'solid', borderTop: 'none',width: '98%', margin: '0% 1% 0% 1%', borderRadius:'0px 0px 10px 10px'}}>
                            {utilityPayments.length > 8 ? 
                                <ul style={{overflowY: 'visible', listStyle: 'none', overflow: 'scroll', overflowX: 'hidden', padding: '0px'}}>
                                    {utilityPayments.map((expense, i) => {
                                        return <PastExpenseItem expense={expense}/>
                                    })}
                                </ul> 
                                : 
                                <ul style={{overflowY: 'hidden', listStyle: 'none', overflow: 'scroll', overflowX: 'hidden', padding: '0px'}}>
                                    {utilityPayments.map((expense, i) => {
                                        return <PastExpenseItem expense={expense}/>
                                    })}
                                </ul>
                            }
                        </div>
                    </div>
                    
                    
                </Row> : 
                <div style={{textAlign: 'center', fontSize: '15px'}}>No past utility payments made</div>
            }  
            <Row>
                <div style={{width: '100%', textAlign: 'center', marginTop: '20px', fontSize: '20px'}}>Other Payments</div>
            </Row>
            {/* ========= List of Rent payments ========== */}
            {otherPayments.length > 0 ?
                <Row>
                    <div style={{marginTop: '28px', height: 'auto'}}>
                        <div style={{ border:'solid', borderBottom: 'none', display:'flex', flexDirection: 'row', width: '98%', margin: '0% 1% 0% 1%', borderRadius:'10px 10px 0 0'}}>
                            <div style={{marginRight: '0px', width: '100px', textAlign: 'center', fontSize: '20px', }}>Amount</div>
                            <div style={{marginRight: '0px', textAlign: 'center', fontSize: '20px', width: '150px'}}>Date</div>
                            <div style={{textAlign: 'center', fontSize: '20px', width: '110px'}}>Reason</div>
                        </div>
                        <div style={{border:'solid', borderTop: 'none',width: '98%', margin: '0% 1% 0% 1%', borderRadius:'0px 0px 10px 10px'}}>
                            {otherPayments.length > 8 ? 
                                <ul style={{overflowY: 'visible', listStyle: 'none', overflow: 'scroll', overflowX: 'hidden', padding: '0px'}}>
                                    {otherPayments.map((expense, i) => {
                                        return <PastExpenseItem expense={expense}/>
                                    })}
                                </ul> 
                                : 
                                <ul style={{overflowY: 'hidden', listStyle: 'none', overflow: 'scroll', overflowX: 'hidden', padding: '0px'}}>
                                    {otherPayments.map((expense, i) => {
                                        
                                        return <PastExpenseItem expense={expense}/>
                                    })}
                                </ul>
                            }
                        </div>
                    </div>
                    
                    
                </Row> : 
                <div style={{textAlign: 'center', fontSize: '15px'}}>No past other payments made</div>
            }  
        </Container>

    </div>
}

export default TenantPastPaidPayments;