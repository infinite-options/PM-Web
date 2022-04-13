import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {blue, gray, greenPill, orangePill, redPill, tileImg, xSmall} from '../utils/styles';
import Header from "../components/Header";
import {useLocation, useNavigate} from "react-router-dom";
import {get} from "../utils/api";
import AppContext from "../AppContext";

function ManagerRepairsList(props) {

    const navigate = useNavigate();
    const location = useLocation();
    const {userData, refresh} = React.useContext(AppContext);
    const {access_token} = userData;
    const [repairs, setRepairs] = React.useState([]);
    const [newRepairs, setNewRepairs] = React.useState([]);
    const [processingRepairs, setProcessingRepairs] = React.useState([]);
    const [scheduledRepairs, setScheduledRepairs] = React.useState([]);
    const [completedRepairs, setCompletedRepairs] = React.useState([]);
    const [repairIter, setRepairIter] = React.useState([])

    const property = location.state.property

    const fetchRepairs = async () => {
        if (access_token === null) {
            navigate('/');
            return;
        }

        const response = await get(`/maintenanceRequests?property_uid=${property.property_uid}`, access_token);
        if (response.msg === 'Token has expired') {
            refresh();
            return;
        }

        console.log(response.result)
        const repairs = response.result.filter(item => item.property_uid === property.property_uid);
        // console.log(repairs)
        setRepairs(repairs);
        const new_repairs = repairs.filter(item => item.request_status === "NEW")
        const processing_repairs = repairs.filter(item => item.request_status === "PROCESSING")
        const scheduled_repairs = repairs.filter(item => item.request_status === "SCHEDULED")
        const completed_repairs = repairs.filter(item => item.request_status === "COMPLETE")
        setNewRepairs(new_repairs)
        setProcessingRepairs(processing_repairs)
        setScheduledRepairs(scheduled_repairs)
        setCompletedRepairs(completed_repairs)
        setRepairIter([
            {title: "New", repairs_list: new_repairs},
            {title: "Processing", repairs_list: processing_repairs},
            {title: "Upcoming, Scheduled", repairs_list: scheduled_repairs},
            {title: "Completed", repairs_list: completed_repairs}])
    }

    React.useEffect(fetchRepairs, [access_token]);

    return (
        <div className='h-100'>
            <Header title='Repairs' leftText='< Back' leftFn={() => navigate(-1)}
                    rightText='Sort by'/>
            {repairIter.map((row, i) => (row.repairs_list.length > 0 &&
                <Container className='mb-5' key={i}>
                    <h4 className='mt-2 mb-3' style={{fontWeight: '600'}}>
                        {row.title}
                    </h4>

                    {row.repairs_list.map((repair, j) => (
                        <Row className='mb-4' key={j} onClick={() =>
                            navigate(`./${repair.maintenance_request_uid}`, { state: {repair: repair }})}>
                            <Col xs={4}>
                                <div style={tileImg}>
                                    {repair.images.length > 0 ? (
                                        <img src={JSON.parse(repair.images)[0]} alt='Repair Image'
                                             className='h-100 w-100' style={{objectFit: 'cover'}}/>
                                    ) : ''}
                                </div>
                            </Col>
                            <Col className='ps-0'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h5 className='mb-0' style={{fontWeight: '600'}}>
                                        {repair.title}
                                    </h5>
                                    {repair.priority === 'Low' ? <p style={greenPill} className='mb-0'>Low Priority</p>
                                        : repair.priority === 'Medium' ? <p style={orangePill} className='mb-0'>Medium Priority</p>
                                            : repair.priority === 'High' ? <p style={redPill} className='mb-0'>High Priority</p>:
                                                <p style={greenPill} className='mb-0'>No Priority</p>}
                                </div>
                                <p style={gray} className='mt-2 mb-0'>
                                    {property.address}{property.unit !== '' ? ' '+property.unit : ''}, {property.city}, {property.state} <br/>
                                    {property.zip}
                                </p>
                                <div className='d-flex'>
                                    <div className='flex-grow-1 d-flex flex-column justify-content-center'>
                                        <p style={{...blue, ...xSmall}} className='mb-0'>
                                            Request Sent to Property Manager
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    ))}
                </Container>))}
        </div>
    );
}

export default ManagerRepairsList;
