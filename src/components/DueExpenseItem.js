import React, { useState, useEffect } from "react";
import {
    greenPill,
    redPill,
} from "../utils/styles";

function DueExpenseItem(props) {
    const expense = props.expense;
    const [currentYear, setCurrentYear] = useState(0);
    const [currentDate, setCurrentDate] = useState(0);
    const [currentMonth, setCurrentMonth] = useState(0);
    const [amountPaid, setAmountPaid] = useState(0);
    const [paidLate, setPaidLate] = useState(false);
    const [color, setColor] = useState("black");
    const [checked, setChecked] = useState(false);
    

    const parseExpense = () => {
        let currentDay = expense.next_payment.split(" ")[0].split("-");
        setCurrentYear(parseInt(currentDay[0]));
        setCurrentMonth(parseInt(currentDay[1]));
        setCurrentDate(currentDay[2]);
        setAmountPaid(expense.amount_due - expense.amount_paid);
        if (amountPaid === 0 || expense.amount_due - amountPaid > 0) {
            setPaidLate(true);
        }
        
    }
    useEffect(() => {
        parseExpense();
        if (expense.amount_due - expense.amount_paid > 0) {
            setColor('red');  
        }
    })

    return <li style={{display: 'flex', flexDirection: 'row', padding: '0px', fontSize: '16px', padding: '3px', color: color}}>
        <input 
            type="checkbox" 
            style={{width: '25px', height: '25px', margin: '0px 12px 0px 10px'}}
            onClick={()=>{
                setChecked(!checked);
                props.calculate(amountPaid, !checked);
                props.add(expense.purchase_uid, !checked);
            }}
        >
        </input>
        <div style={{marginRight: '0px', width: '96px', textAlign: 'right', textAlign: 'center'}}>${amountPaid}</div>
        <div style={{marginRight: '0px', width: '95px', textAlign:'center'}}>{currentMonth}/{currentDate}/{currentYear}</div>
        <div style={{marginRight: '0px', width: '138px', textAlign: 'center'}}> {expense.description}</div>
    </li>

}

export default DueExpenseItem;