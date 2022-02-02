import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {gray, green, red, mediumBold, small, xSmall} from '../utils/styles';
import ArrowUp from '../icons/ArrowUp.svg';
import ArrowDown from '../icons/ArrowDown.svg';

function ManagerRentalHistory(props) {
    const {property} = props;

    const [expandRentalHistory, setExpandRentalHistory] = React.useState(false);

    const rentalHistory = [
        {month: 'Nov', year: 2021, payments: [{date: 'Nov 10', amount: 1400}, {date: 'Nov 1', amount: 500}]},
    ];

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    return (
        <div>
            <div>
                <div onClick={() => setExpandRentalHistory(!expandRentalHistory)}>
                    <div className='d-flex justify-content-between mt-3'>
                        <h6 style={mediumBold} className='mb-1'>Rental History</h6>
                        <img src={expandRentalHistory ? ArrowUp : ArrowDown} alt='Expand'/>
                    </div>
                    <hr style={{opacity: 1}} className='mt-1'/>
                </div>
                {expandRentalHistory ? (
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
                                Nov 2021
                            </p>
                            {rentalHistory[0].payments.map((item, i) => (
                                <Row key={i}>
                                    <Col>
                                        <p style={{...xSmall, ...mediumBold}} className='mb-1'>
                                            Nov {item.date}
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
                        </div>
                    </Container>
                ) : ''}
            </div>
        </div>
    )
}

export default ManagerRentalHistory;
