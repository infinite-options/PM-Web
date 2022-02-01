import React from 'react';
import {Container, Row, Col, Form} from 'react-bootstrap';
import Checkbox from './Checkbox';
import {squareForm, hidden, gray} from '../utils/styles';

function ManagerPaymentSelection(props) {
    const {editProfile, paymentState, setPaymentState} = props;
    const {paypal, applePay, zelle, venmo, accountNumber, routingNumber} = paymentState;
    const [showPayPal, setShowPayPal] = React.useState(false);
    const [showApplePay, setShowApplePay] = React.useState(false);
    const [showZelle, setShowZelle] = React.useState(false);
    const [showVenmo, setShowVenmo] = React.useState(false);
    const [showChecking, setShowChecking] = React.useState(false);
    const onChange = (event, field) => {
        const newPaymentState = {...paymentState};
        newPaymentState[field] = event.target.value;
        setPaymentState(newPaymentState);
    }

    React.useEffect(() => {
        setShowPayPal(paymentState.paypal !== '')
        setShowApplePay(paymentState.applePay !== '')
        setShowZelle(paymentState.zelle !== '')
        setShowVenmo(paymentState.venmo !== '')
        setShowChecking(paymentState.accountNumber !== '')
    }, [paymentState])

    return (
        <div>
            {editProfile?
                <Container>
                    <h6>Accept Payments via:</h6>
                    <Row className='mb-1'>
                        <Col className='d-flex align-items-center'>
                            <Checkbox type='BOX' checked={showPayPal ? 'checked' : ''}
                                      onClick={(checked) => setShowPayPal(checked)} />
                            <p className='d-inline-block mb-0'>PayPal</p>
                        </Col>
                        <Col>
                            <Form.Control style={showPayPal ? squareForm : hidden} placeholder='PayPal'
                                          value={paypal} onChange={(e) => onChange(e, 'paypal')}/>
                        </Col>
                    </Row>
                    <Row className='mb-1'>
                        <Col className='d-flex align-items-center'>
                            <Checkbox type='BOX'  checked={showApplePay ? 'checked' : ''}
                                      onClick={(checked) => setShowApplePay(checked)}/>
                            <p className='d-inline-block mb-0'>Apple Pay</p>
                        </Col>
                        <Col>
                            <Form.Control style={showApplePay ? squareForm : hidden} placeholder='Apple Pay'
                                          value={applePay} onChange={(e) => onChange(e, 'applePay')}/>
                        </Col>
                    </Row>
                    <Row className='mb-1'>
                        <Col className='d-flex align-items-center'>
                            <Checkbox type='BOX'  checked={showZelle ? 'checked' : ''}
                                      onClick={(checked) => setShowZelle(checked)}/>
                            <p className='d-inline-block mb-0'>Zelle</p>
                        </Col>
                        <Col>
                            <Form.Control style={showZelle ? squareForm : hidden} placeholder='Zelle'
                                          value={zelle} onChange={(e) => onChange(e, 'zelle')}/>
                        </Col>
                    </Row>
                    <Row className='mb-1'>
                        <Col className='d-flex align-items-center'>
                            <Checkbox  checked={showVenmo ? 'checked' : ''}
                                type='BOX' onClick={(checked) => setShowVenmo(checked)}/>
                            <p className='d-inline-block mb-0'>Venmo</p>
                        </Col>
                        <Col>
                            <Form.Control style={showVenmo ? squareForm : hidden} placeholder='Venmo'
                                          value={venmo} onChange={(e) => onChange(e, 'venmo')}/>
                        </Col>
                    </Row>
                    <Row className='mb-1'>
                        <Col className='d-flex align-items-center'>
                            <Checkbox type='BOX'  checked={showChecking ? 'checked' : ''}
                                      onClick={(checked) => setShowChecking(checked)}/>
                            <p className='d-inline-block mb-0'>Checking Acct.</p>
                        </Col>
                        <Col>
                            <Form.Control style={showChecking ? squareForm : hidden} placeholder='Account Number'
                                          value={accountNumber} onChange={(e) => onChange(e, 'accountNumber')}/>
                        </Col>
                    </Row>
                    <Row style={showChecking ? {} : hidden}>
                        <Col/>
                        <Col>
                            <Form.Control style={squareForm} placeholder='Routing Number'
                                          value={routingNumber} onChange={(e) => onChange(e, 'routingNumber')}/>
                        </Col>
                    </Row>
                </Container>
                :
                <Container className='mx-2'>
                    <h6>Accept Payments via:</h6>
                    <Row className='mb-1'>
                        <Col><h6>* &nbsp; PayPal</h6></Col>
                        <Col><p style={gray}>
                            {(paymentState.paypal !== 'NULL') ? paymentState.paypal : 'No PayPal Provided'}</p></Col>
                    </Row>
                    <Row className='mb-1'>
                        <Col><h6>* &nbsp; Apple Pay</h6></Col>
                        <Col><p style={gray}>
                            {(paymentState.applePay !== 'NULL') ? paymentState.applePay : 'No Apple Pay Provided'}</p></Col>
                    </Row>
                    <Row className='mb-1'>
                        <Col><h6>* &nbsp; Zelle</h6></Col>
                        <Col><p style={gray}>
                            {(paymentState.zelle !== 'NULL') ? paymentState.zelle : 'No Zelle Provided'}</p></Col>
                    </Row>
                    <Row className='mb-1'>
                        <Col><h6>* &nbsp; Venmo</h6></Col>
                        <Col><p style={gray}>
                            {(paymentState.venmo !== 'NULL') ? paymentState.venmo : 'No Venmo Provided'}</p></Col>
                    </Row>
                    <Row className='mb-1'>
                        <Col><h6>* &nbsp; Checking Acct.</h6></Col>
                        <Col><p style={gray}>
                            {(paymentState.accountNumber !== 'NULL') ? paymentState.accountNumber : 'No Acct No. Provided'}</p></Col>
                    </Row>
                    <Row className='mb-1'>
                        <Col></Col>
                        <Col><p style={gray}>
                            {(paymentState.routingNumber !== 'NULL') ? paymentState.routingNumber : 'No Routing No. Provided'}</p></Col>
                    </Row>
                </Container>}

        </div>

    )
}

export default ManagerPaymentSelection;
