import React from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import {gray, green, red, mediumBold, small, xSmall} from '../utils/styles';
import ArrowUp from '../icons/ArrowUp.svg';
import ArrowDown from '../icons/ArrowDown.svg';

function ManagerTenantApplications(props) {
    const {property} = props;

    const [expandTenantApplications, setExpandTenantApplications] = React.useState(false);

    return (
        <div>
            <div>
                <div onClick={() => setExpandTenantApplications(!expandTenantApplications)}>
                    <div className='d-flex justify-content-between mt-3'>
                        <h6 style={mediumBold} className='mb-1'>Tenant Applications</h6>
                        <img src={expandTenantApplications ? ArrowUp : ArrowDown} alt='Expand'/>
                    </div>
                    <hr style={{opacity: 1}} className='mt-1'/>
                </div>
                {expandTenantApplications ? (
                    <Container>

                    </Container>
                ) : ''}
            </div>
        </div>
    )
}

export default ManagerTenantApplications;
