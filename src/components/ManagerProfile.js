import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Container, Row, Col, Form} from 'react-bootstrap';
import AppContext from '../AppContext';
import Header from '../components/Header';
import ManagerPaymentSelection from '../components/ManagerPaymentSelection';
import ManagerFees from '../components/ManagerFees';
import ManagerLocations from '../components/ManagerLocations';
import {get, post, put} from '../utils/api';
import {squareForm, gray} from '../utils/styles';

function ManagerProfile(props) {
    const {setFooterTab} = props
    const context = React.useContext(AppContext);
    const {access_token, user} = context.userData;
    const navigate = useNavigate();
    const [editProfile, setEditProfile] = React.useState(false);
    const [companyName, setCompanyName] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [einNumber, setEinNumber] = React.useState('');
    const [ssn, setSsn] = React.useState('');
    const [paymentState , setPaymentState] = React.useState({
        paypal: '',
        applePay: '',
        zelle: '',
        venmo: '',
        accountNumber: '',
        routingNumber: ''
    });
    // const feeState = React.useState([]);
    // const locationState = React.useState([]);
    const [feeState, setFeeState] = React.useState([]);
    const [locationState , setLocationState] = React.useState([]);

    const loadProfile = (profile) => {
        setCompanyName(profile.manager_company_name)
        setFirstName(profile.manager_first_name)
        setLastName(profile.manager_last_name)
        setEmail(profile.manager_email)
        setPhoneNumber(profile.manager_phone_number)
        setEinNumber(profile.manager_ein_number)
        setSsn(profile.manager_ssn)
        setPaymentState({
            paypal : profile.manager_paypal === 'NULL' ? '' : profile.manager_paypal,
            applePay : profile.manager_apple_pay === 'NULL' ? '' : profile.manager_apple_pay,
            zelle : profile.manager_zelle === 'NULL' ? '' : profile.manager_zelle,
            venmo : profile.manager_venmo === 'NULL' ? '' : profile.manager_venmo,
            accountNumber : profile.manager_account_number === 'NULL' ? '' : profile.manager_account_number,
            routingNumber : profile.manager_routing_number === 'NULL' ? '' : profile.manager_routing_number
        })
        setFeeState(JSON.parse(profile.manager_fees))

        const location = JSON.parse(profile.manager_locations)
        console.log(profile)
        setLocationState(location)
    }

    React.useEffect(() => {
        if (access_token === null) {
            navigate('/');
            return;
        }
        if (user.role.indexOf('MANAGER') === -1) {
            console.log('no manager profile');
            // props.onConfirm();
        }
        const fetchProfileInfo = async () => {
            const response = await get('/managerProfileInfo', access_token);
            if (response.result.length !== 0) {
                const profile = response.result[0]
                // console.log(profile)

                loadProfile(profile)


            }

        }
        fetchProfileInfo().then(response => {

        });
    }, [access_token]);

    const saveProfile = async () => {
        const {paypal, applePay, zelle, venmo, accountNumber, routingNumber} = paymentState;
        const managerProfile = {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            email: email,
            ein_number: einNumber,
            ssn: ssn,
            paypal: paypal || 'NULL',
            apple_pay: applePay || 'NULL',
            zelle: zelle || 'NULL',
            venmo: venmo || 'NULL',
            account_number: accountNumber || 'NULL',
            routing_number: routingNumber || 'NULL',
            fees: feeState[0],
            locations: locationState[0]
        }

        console.log(managerProfile)

        const response = await put('/managerProfileInfo', managerProfile, access_token);
        console.log(response)

    }
    return (
        <div className='pb-5 mb-5'>
            <Header title='Profile' leftText={editProfile? 'Cancel' : '< Back'}
                    leftFn={() => (editProfile? setEditProfile(false) : setFooterTab('DASHBOARD'))}
                    rightText={editProfile? 'Save' : 'Edit'}
                    rightFn={() => (editProfile ? saveProfile() :setEditProfile(true))}/>
            {editProfile ? (
                <div>
                    <Form.Group className='mx-2 my-3'>
                        <Form.Label as='h6' className='mb-0 ms-2'>Company Name</Form.Label>
                        <Form.Control style={squareForm} placeholder='Company Name' value={companyName}
                                      onChange={(e) => setCompanyName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mx-2 my-3'>
                        <Form.Label as='h6' className='mb-0 ms-2'>First Name</Form.Label>
                        <Form.Control style={squareForm} placeholder='First Name' value={firstName}
                                      onChange={(e) => setFirstName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mx-2 my-3'>
                        <Form.Label as='h6' className='mb-0 ms-2'>Last Name</Form.Label>
                        <Form.Control style={squareForm} placeholder='Last' value={lastName}
                                      onChange={(e) => setLastName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mx-2 my-3'>
                        <Form.Label as='h6' className='mb-0 ms-2'>Phone Number</Form.Label>
                        <Form.Control style={squareForm} placeholder='(xxx)xxx-xxxx' value={phoneNumber}
                                      onChange={(e) => setPhoneNumber(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mx-2 my-3'>
                        <Form.Label as='h6' className='mb-0 ms-2'>Email Address</Form.Label>
                        <Form.Control style={squareForm} placeholder='Email' value={email} type='email'
                                      onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mx-2 my-3'>
                        <Form.Label as='h6' className='mb-0 ms-2'>EIN Number</Form.Label>
                        <Form.Control style={squareForm} placeholder='12-1234567' value={einNumber}
                                      onChange={(e) => setEinNumber(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mx-2 my-3'>
                        <Form.Label as='h6' className='mb-0 ms-2'>Social Security Number</Form.Label>
                        <Form.Control style={squareForm} placeholder='123-45-6789' value={ssn}
                                      onChange={(e) => setSsn(e.target.value)}/>
                    </Form.Group>

                </div>
            ) : (
                <div className='mx-3'>
                    <h6>Company Name</h6>
                    <p style={gray}>
                        {(companyName && companyName !== 'NULL') ? companyName : 'No Company Details Provided'}</p>

                    <h6>First Name</h6>
                    <p style={gray}>
                        {(firstName && firstName !== 'NULL') ? firstName : 'No First Name Provided'}</p>

                    <h6>Last Name</h6>
                    <p style={gray}>
                        {(lastName && lastName !== 'NULL') ? lastName : 'No Last Name Provided'}</p>

                    <h6>Phone Number</h6>
                    <p style={gray}>
                        {(phoneNumber && phoneNumber !== 'NULL') ? phoneNumber : 'No Phone Number Provided'}</p>

                    <h6>Email</h6>
                    <p style={gray}>
                        {(email && email !== 'NULL') ? email : 'No Email Provided'}</p>

                    <div>
                        <h6 className='mb-3'>Identification</h6>
                        <Container>
                            <Row>
                                <Col><h6>* &nbsp; SSN</h6></Col>
                                <Col><p style={gray}>
                                    {(ssn && ssn !== 'NULL') ? ssn : 'No SSN Provided'}</p></Col>
                            </Row>
                            <Row>
                                <Col><h6>* &nbsp; EIN</h6></Col>
                                <Col><p style={gray}>
                                    {(einNumber && einNumber !== 'NULL') ? ssn : 'No EIN Provided'}</p></Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            )}

            <ManagerPaymentSelection paymentState={paymentState} setPaymentState={setPaymentState} editProfile={editProfile}/>

            {/*<ManagerFees state={feeState}/>*/}
            {/*<ManagerLocations state={locationState}/>*/}
            {/*<ManagerFees feeState={feeState} setFeeState={setFeeState}/>*/}
            {/*<ManagerLocations locationState={locationState} setLocationState={setLocationState}/>*/}
        </div>
    );
}

export default ManagerProfile;
