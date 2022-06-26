import React, { useState, useEffect } from "react";
import {
    greenPill,
    redPill,
} from "../utils/styles";

function PastExpenseItem(props) {
    const expense = props.expense;
    const [currentYear, setCurrentYear] = useState(0);
    const [currentDate, setCurrentDate] = useState(0);
    const [currentMonth, setCurrentMonth] = useState(0);
    const [amount, setAmount] = useState(0);
    const [paidLate, setPaidLate] = useState(false);

    const [checked, setChecked] = useState(false);

    const parseExpense = () => {
        let currentDay = expense.payment_date.split(" ")[0].split("-");
        setCurrentYear(parseInt(currentDay[0]));
        setCurrentMonth(parseInt(currentDay[1]));
        setCurrentDate(currentDay[2]);
        setAmount(expense.amount);
        if (amount === 0 || expense.amount_due - amount > 0) {
            setPaidLate(true);
        }
        
    }
    useEffect(() => {
        parseExpense();
        
    })
    



    return <li style={{display: 'flex', flexDirection: 'row', padding: '0px', fontSize: '16px', padding: '3px'}}>
        <div 
            style={{marginRight: '0px', width: '95px', textAlign: 'right', textAlign: 'center'}}
        >
            ${amount.toFixed(2)}
        </div>
        <div 
            style={{marginRight: '0px', width: '155px', textAlign:'center'}}
        >
            {currentMonth}/{currentDate}/{currentYear}
        </div>
        <div 
            style={{marginRight: '0px', width: '105px', textAlign: 'center'}}
        > 
            {expense.description}
        </div>
    </li>

}

export default PastExpenseItem;