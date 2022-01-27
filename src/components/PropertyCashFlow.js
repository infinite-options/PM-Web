import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {gray, green, red, mediumBold, small, xSmall} from '../utils/styles';
import ArrowUp from '../icons/ArrowUp.svg';
import ArrowDown from '../icons/ArrowDown.svg';
import Add from '../icons/Add.svg';

function PropertyCashFlow(props) {
  const {property, state} = props;
  const {
    setShowCreateExpense,
    setShowCreateTax,
    setShowCreateMortgage
  } = state;

  const [expandCashFlow, setExpandCashFlow] = React.useState(false);
  const [expandExpenses, setExpandExpenses] = React.useState(false);
  const [expandTaxes, setExpandTaxes] = React.useState(false);
  const [expandMortgage, setExpandMortgage] = React.useState(false);

  const revenue = [
    {name: 'Rent', amount: property.listed_rent},
    {name: 'Fees', amount: 300}
  ];
  const expenses = [
    {type: 'Management', name: 'Management', amount: 300},
    {type: 'Maintenance', name: 'Painting', amount: 300},
    {type: 'Maintenance', name: 'Plumbing check', amount: 30},
    {type: 'Maintenance', name: 'Gardening', amount: 30},
    {type: 'Repairs', name: 'Dishwasher', amount: 30},
    {type: 'Repairs', name: 'Doorlock', amount: 20}
  ];
  const taxes = [
    {name: 'State Taxes', amount: 80},
    {name: 'Property Taxes', amount: 50},
    {name: 'Rental Taxes', amount: 20},
  ];
  const mortgage = [
    {name: 'Principal', amount: 300},
    {name: 'Interest', amount: 250},
    {name: 'Insurance', amount: 150},
    {name: 'Esrow', amount: 150}
  ];
  const management = expenses.filter(item => item.type === 'Management');
  const maintenance = expenses.filter(item => item.type === 'Maintenance');
  const repairs = expenses.filter(item => item.type === 'Repairs');
  let revenueTotal = 0;
  for (const item of revenue) {
    revenueTotal += item.amount;
  }
  let managementTotal = 0;
  for (const item of management) {
    managementTotal += item.amount;
  }
  let maintenanceTotal = 0;
  for (const item of maintenance) {
    maintenanceTotal += item.amount;
  }
  let repairsTotal = 0;
  for (const item of repairs) {
    repairsTotal += item.amount;
  }
  let taxesTotal = 0;
  for (const item of taxes) {
    taxesTotal += item.amount;
  }
  let mortgageTotal = 0;
  for (const item of mortgage) {
    mortgageTotal += item.amount;
  }
  const expensesTotal = managementTotal + maintenanceTotal + repairsTotal + taxesTotal + mortgageTotal;
  const cashFlow = revenueTotal - expensesTotal;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const addExpense = (e) => {
    e.stopPropagation();
    setShowCreateExpense(true);
  }
  const addTax = (e) => {
    e.stopPropagation();
    setShowCreateTax(true);
  }
  const addMortgage = (e) => {
    e.stopPropagation();
    setShowCreateMortgage(true);
  }

  return (
    <div>
      <div>
        <div onClick={() => setExpandCashFlow(!expandCashFlow)}>
          <h6 style={mediumBold} className='mb-1 mt-3'>Cash Flow</h6>
          <div className='d-flex justify-content-between'>
            <h6 style={{...green, ...mediumBold}} className='mb-1'>
              ${cashFlow}/mo
            </h6>
            <img src={expandCashFlow ? ArrowUp : ArrowDown} alt='Expand'/>
          </div>
          <hr style={{opacity: 1}} className='mt-1'/>
        </div>
        {expandCashFlow ? (
          <Container>
            <Row>
              <Col/>
              <Col>
                <p style={{...gray, ...xSmall}} className='mb-1'>
                  MTD
                </p>
              </Col>
              <Col>
                <p style={{...gray, ...xSmall}} className='mb-1'>
                  YTD
                </p>
              </Col>
            </Row>
            <div>
              <p style={{...small, ...mediumBold}} className='mb-1'>
                Revenue
              </p>
              {revenue.map((item, i) => (
                <Row key={i}>
                  <Col>
                    <p style={{...xSmall, ...mediumBold}} className='mb-1'>
                      {item.name}
                    </p>
                  </Col>
                  <Col>
                    <p style={{...xSmall, ...green}} className='mb-1'>
                      {formatter.format(item.amount)}
                    </p>
                  </Col>
                  <Col>
                    <p style={{...xSmall, ...green}} className='mb-1'>
                      {formatter.format(item.amount * 12)}
                    </p>
                  </Col>
                </Row>
              ))}
              <Row>
                <Col>
                  <p style={{...small, ...mediumBold}} className='mb-1'>
                    Total
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...green}} className='mb-1'>
                    {formatter.format(revenueTotal)}
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...green}} className='mb-1'>
                    {formatter.format(revenueTotal * 12)}
                  </p>
                </Col>
              </Row>
            </div>
            <div>
              <p style={{...small, ...mediumBold}} className='mb-1'>
                Expenses
              </p>
              <Row>
                <Col>
                  <p style={{...xSmall, ...mediumBold}} className='mb-1'>
                    Management
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(managementTotal)}
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(managementTotal * 12)}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p style={{...xSmall, ...mediumBold}} className='mb-1'>
                    Maintenance
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(maintenanceTotal)}
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(maintenanceTotal * 12)}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p style={{...xSmall, ...mediumBold}} className='mb-1'>
                    Repairs
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(repairsTotal)}
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(repairsTotal * 12)}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p style={{...xSmall, ...mediumBold}} className='mb-1'>
                    Taxes
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(taxesTotal)}
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(taxesTotal * 12)}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p style={{...xSmall, ...mediumBold}} className='mb-1'>
                    Mortgage
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(mortgageTotal)}
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(mortgageTotal * 12)}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p style={{...small, ...mediumBold}} className='mb-1'>
                    Total
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(expensesTotal)}
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(expensesTotal * 12)}
                  </p>
                </Col>
              </Row>
            </div>
            <Row>
              <Col>
                <p style={{...small, ...mediumBold}} className='mb-1'>
                  Cash Flow
                </p>
              </Col>
              <Col>
                <p style={{...xSmall, ...(cashFlow > 0 ? green : red)}} className='mb-1'>
                  {formatter.format(cashFlow)}
                </p>
              </Col>
              <Col>
                <p style={{...xSmall, ...(cashFlow > 0 ? green : red)}} className='mb-1'>
                  {formatter.format(cashFlow * 12)}
                </p>
              </Col>
            </Row>
          </Container>
        ) : ''}
      </div>
      <div>
        <div onClick={() => setExpandExpenses(!expandExpenses)}>
          <div className='d-flex justify-content-between align-items-end mb-1 mt-3'>
            <h6 style={mediumBold} className='mb-0'>Expenses</h6>
            <img style={{width: '20px'}} src={Add} alt='Add Expense'
              onClick={addExpense}/>
          </div>
          <div className='d-flex justify-content-between'>
            <h6 style={{...red, ...mediumBold}} className='mb-1'>
              ${managementTotal + maintenanceTotal + repairsTotal}/mo
            </h6>
            <img src={expandExpenses ? ArrowUp : ArrowDown} alt='Expand'/>
          </div>
          <hr style={{opacity: 1}} className='mt-1'/>
        </div>
        {expandExpenses ? (
          <Container>
            <Row>
              <Col/>
              <Col>
                <p style={{...gray, ...xSmall}} className='mb-1'>
                  MTD
                </p>
              </Col>
              <Col>
                <p style={{...gray, ...xSmall}} className='mb-1'>
                  YTD
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p style={{...small, ...mediumBold}} className='mb-1'>
                  Management
                </p>
              </Col>
              <Col>
                <p style={{...xSmall, ...red}} className='mb-1'>
                  {formatter.format(managementTotal)}
                </p>
              </Col>
              <Col>
                <p style={{...xSmall, ...red}} className='mb-1'>
                  {formatter.format(managementTotal * 12)}
                </p>
              </Col>
            </Row>
            <div>
              <p style={{...small, ...mediumBold}} className='mb-1'>
                Maintenance
              </p>
              {maintenance.map((item, i) => (
                <Row key={i}>
                  <Col>
                    <p style={{...xSmall, ...mediumBold}} className='mb-1'>
                      {item.name}
                    </p>
                  </Col>
                  <Col>
                    <p style={{...xSmall, ...red}} className='mb-1'>
                      {formatter.format(item.amount)}
                    </p>
                  </Col>
                  <Col>
                    <p style={{...xSmall, ...red}} className='mb-1'>
                      {formatter.format(item.amount * 12)}
                    </p>
                  </Col>
                </Row>
              ))}
              <Row>
                <Col>
                  <p style={{...small, ...mediumBold}} className='mb-1'>
                    Total
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(maintenanceTotal)}
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(maintenanceTotal * 12)}
                  </p>
                </Col>
              </Row>
            </div>
            <div>
              <p style={{...small, ...mediumBold}} className='mb-1'>
                Repairs
              </p>
              {repairs.map((item, i) => (
                <Row key={i}>
                  <Col>
                    <p style={{...xSmall, ...mediumBold}} className='mb-1'>
                      {item.name}
                    </p>
                  </Col>
                  <Col>
                    <p style={{...xSmall, ...red}} className='mb-1'>
                      {formatter.format(item.amount)}
                    </p>
                  </Col>
                  <Col>
                    <p style={{...xSmall, ...red}} className='mb-1'>
                      {formatter.format(item.amount * 12)}
                    </p>
                  </Col>
                </Row>
              ))}
              <Row>
                <Col>
                  <p style={{...small, ...mediumBold}} className='mb-1'>
                    Total
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(repairsTotal)}
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(repairsTotal * 12)}
                  </p>
                </Col>
              </Row>
            </div>
            <Row>
              <Col>
                <p style={{...small, ...mediumBold}} className='mb-1'>
                  Total
                </p>
              </Col>
              <Col>
                <p style={{...xSmall, ...red}} className='mb-1'>
                  {formatter.format(managementTotal + maintenanceTotal + repairsTotal)}
                </p>
              </Col>
              <Col>
                <p style={{...xSmall, ...red}} className='mb-1'>
                  {formatter.format((managementTotal + maintenanceTotal + repairsTotal) * 12)}
                </p>
              </Col>
            </Row>
          </Container>
        ) : ''}
      </div>
      <div>
        <div onClick={() => setExpandTaxes(!expandTaxes)}>
          <div className='d-flex justify-content-between align-items-end mb-1 mt-3'>
            <h6 style={mediumBold} className='mb-0'>Taxes</h6>
            <img style={{width: '20px'}} src={Add} alt='Add Tax'
              onClick={addTax}/>
          </div>
          <div className='d-flex justify-content-between'>
            <h6 style={{...red, ...mediumBold}} className='mb-1'>
              ${taxesTotal}/mo
            </h6>
            <img src={expandTaxes ? ArrowUp : ArrowDown} alt='Expand'/>
          </div>
          <hr style={{opacity: 1}} className='mt-1'/>
        </div>
        {expandTaxes ? (
          <Container>
            {taxes.map((item, i) => (
              <Row key={i}>
                <Col>
                  <p style={{...xSmall, ...mediumBold}} className='mb-1'>
                    {item.name}
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(item.amount)}
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(item.amount * 12)}
                  </p>
                </Col>
              </Row>
            ))}
            <Row>
              <Col>
                <p style={{...small, ...mediumBold}} className='mb-1'>
                  Total
                </p>
              </Col>
              <Col>
                <p style={{...xSmall, ...red}} className='mb-1'>
                  {formatter.format(taxesTotal)}
                </p>
              </Col>
              <Col>
                <p style={{...xSmall, ...red}} className='mb-1'>
                  {formatter.format(taxesTotal * 12)}
                </p>
              </Col>
            </Row>
          </Container>
        ) : ''}
      </div>
      <div>
        <div onClick={() => setExpandMortgage(!expandMortgage)}>
          <div className='d-flex justify-content-between align-items-end mb-1 mt-3'>
            <h6 style={mediumBold} className='mb-0'>Mortgage</h6>
            <img style={{width: '20px'}} src={Add} alt='Add Mortgage'
              onClick={addMortgage}/>
          </div>
          <div className='d-flex justify-content-between'>
            <h6 style={{...red, ...mediumBold}} className='mb-1'>
              ${mortgageTotal}/mo
            </h6>
            <img src={expandMortgage ? ArrowUp : ArrowDown} alt='Expand'/>
          </div>
          <hr style={{opacity: 1}} className='mt-1'/>
        </div>
        {expandMortgage ? (
          <Container>
            {mortgage.map((item, i) => (
              <Row key={i}>
                <Col>
                  <p style={{...xSmall, ...mediumBold}} className='mb-1'>
                    {item.name}
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(item.amount)}
                  </p>
                </Col>
                <Col>
                  <p style={{...xSmall, ...red}} className='mb-1'>
                    {formatter.format(item.amount * 12)}
                  </p>
                </Col>
              </Row>
            ))}
            <Row>
              <Col>
                <p style={{...small, ...mediumBold}} className='mb-1'>
                  Total
                </p>
              </Col>
              <Col>
                <p style={{...xSmall, ...red}} className='mb-1'>
                  {formatter.format(mortgageTotal)}
                </p>
              </Col>
              <Col>
                <p style={{...xSmall, ...red}} className='mb-1'>
                  {formatter.format(mortgageTotal * 12)}
                </p>
              </Col>
            </Row>
          </Container>
        ) : ''}
      </div>
    </div>
  )
}

export default PropertyCashFlow;
