import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Checkbox from "../components/Checkbox";
import HighPriority from "../icons/highPriority.svg";
import MediumPriority from "../icons/mediumPriority.svg";
import LowPriority from "../icons/lowPriority.svg";
import Reject from "../icons/Reject.svg";
import AppContext from "../AppContext";
import Header from "../components/Header";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import {
    actions,
    headings,
    pillButton,
    redPill,
    subHeading,
    subText,
    blueBorderButton,
    redPillButton,
    formLabel,
    bluePillButton,
    red,
    small,
    blue, tileImg,
} from "../utils/styles";
import { textAlign } from "@mui/system";
import {useParams} from "react-router";
import DeleteIcon from "../icons/DeleteIcon.svg";
import Heart from "../icons/Heart.svg";
import HeartOutline from "../icons/HeartOutline.svg";
import Plus from "../icons/Plus.svg";
import {get, post} from "../utils/api";

function ManagerRepairDetail(props) {
    const {userData, refresh} = React.useContext(AppContext);
    const {access_token} = userData;
    const location = useLocation();
    const navigate = useNavigate();
    const [morePictures, setMorePictures] = useState(false);
    const [canReschedule, setCanReschedule] = useState(false);
    const [requestQuote, setRequestQuote] = useState(false);
    const [scheduleMaintenance, setScheduleMaintenance] = useState(false);
    const [businesses, setBusinesses] = useState([]);

    const [edit, setEdit ] = useState(false);
    const { mp_id, rr_id } = useParams();

    const repair = location.state.repair

    // console.log(repair)
    // console.log(mp_id, rr_id)

    const fetchBusinesses = async () => {
        if (access_token === null) {
            navigate('/');
            return;
        }

        const response = await get("/businesses?business_type=MAINTENANCE");
        if (response.msg === 'Token has expired') {
            refresh();
            return;
        }

        const businesses = response.result.map(business => ({...business, quote_requested: false}))
        console.log(repair)
        console.log(businesses)
        setBusinesses(businesses)
        setCanReschedule(repair.can_reschedule === 1)
    }

    React.useEffect(fetchBusinesses, [access_token]);

    const toggleBusiness = (index) => {
        const newBusinesses = [...businesses];
        newBusinesses[index].quote_requested = !newBusinesses[index].quote_requested;
        setBusinesses(newBusinesses);
    }

    const sendQuotesRequest = async () => {
        const business_ids = businesses.filter(b => b.quote_requested).map(b => b.business_uid);
        if (business_ids.length === 0) {
            alert('No businesses Selected')
            return
        }
        for (const id of business_ids){
            const quote_details = {
                maintenance_request_uid: repair.maintenance_request_uid,
                business_uid: id
            }
            // console.log(quote_details)
            const response = await post("/maintenanceQuotes", quote_details);
            const result = response.result
            // console.log(result)
        }
        console.log("Quotes Requested from", business_ids)
    }

    return (
        <div className="h-100">
            <Header title="Repairs"
                    leftText={scheduleMaintenance || requestQuote ? null : "< Back"} leftFn={() => navigate(-1)}
                    rightText={scheduleMaintenance || requestQuote ? null : "Edit"}/>

            <Container className="pt-1 mb-4" hidden={scheduleMaintenance || requestQuote}>
                <Row style={headings}><div>New Repair Request</div></Row>
                <Row className="pt-1 mb-4">
                    <div style={subHeading}>Title (character limit: 15)</div>
                    <div style={subText}>{repair.title}</div>
                </Row>
                <Row className="pt-1 mb-4">
                    <div style={subHeading}>Description</div>
                    <div style={subText}>{repair.description}</div>
                </Row>
                <Row className="pt-1 mb-4">
                    <div className="pt-1 mb-2" style={subHeading}>
                        Pictures from tenant
                    </div>

                    <div className='d-flex overflow-auto mb-3'>
                        {JSON.parse(repair.images).map((file, i) => (
                            <div className='mx-2' style={{position: 'relative', minHeight: '100px', minWidth: '100px', height: '100px', width: '100px'}} key={i}>
                                <img src={file} style={{...tileImg, objectFit: 'cover'}}/>
                            </div>
                        ))}
                    </div>

                    <div className="pt-1 mb-2">
                        <Button style={pillButton} variant="outline-primary" hidden={morePictures}
                            onClick={() => setMorePictures(!morePictures)}>
                            Request more pictures
                        </Button>
                    </div>
                </Row>
                <Row>
                    <Row className="pt-1 mb-4" hidden={!morePictures}>
                        <div className="pt-1 mb-2" style={subHeading}>
                            Request more pictures
                        </div>

                        <Form.Group className="mt-3 mb-4">
                            <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                                Description of what kind of pictures needed
                            </Form.Label>
                            <Form.Control
                                style={{ borderRadius: 0 }}
                                //ref={requestTitleRef}
                                placeholder="Can you pls share more pictures with the Shower model number?"
                                as="textarea"/>
                        </Form.Group>

                        <Row className="pt-1 mb-2">
                            <Col className='d-flex flex-row justify-content-evenly'>
                                <Button style={pillButton} variant="outline-primary"
                                    onClick={() => setMorePictures(false)}>
                                    Cancel
                                </Button>
                            </Col>
                            <Col className='d-flex flex-row justify-content-evenly'>
                                <Button style={bluePillButton}>Send Request</Button>
                            </Col>
                        </Row>
                    </Row>
                </Row>
                <Row className="pt-1 mb-2">
                    <div style={subHeading} className="pt-1 mb-2">
                        Tag Priority
                    </div>
                    <Col xs={4}>
                        <img src={HighPriority} style={{ opacity: "1" }} />
                    </Col>
                    <Col xs={4}>
                        <img src={MediumPriority} style={{ opacity: "0.5" }} />
                    </Col>
                    <Col xs={4}>
                        <img src={LowPriority} style={{ opacity: "0.5" }} />
                    </Col>
                </Row>
                <Row className="pt-1 mb-2">
                    <div style={subHeading} className="pt-1 mb-2">
                        Tenant can reschedule this job as needed
                    </div>
                    <Col className="pt-1 mx-2">
                        <Row>
                            <Checkbox type="CIRCLE" checked={canReschedule}
                                      onClick={edit ? () => setCanReschedule(true) : () => {}}/>
                            Yes
                        </Row>
                    </Col>
                    <Col className="pt-1 mx-2">
                        <Row>
                            <Checkbox type="CIRCLE" checked={!canReschedule}
                                      onClick={edit ? () => setCanReschedule(false) : () => {}}/>
                            No
                        </Row>
                    </Col>
                </Row>
                <Row className="pt-1 mb-2">
                    <Col className='d-flex flex-row justify-content-evenly'>
                        <Button style={bluePillButton}
                            onClick={() => setScheduleMaintenance(true)}>
                            Schedule Maintenance
                        </Button>
                    </Col>
                </Row>
                <Row className="pt-1 mb-2">
                    <Col className='d-flex flex-row justify-content-evenly'>
                        <Button style={pillButton} variant="outline-primary"
                            onClick={() => setRequestQuote(true)}>
                            Request quote from maintenance
                        </Button>
                    </Col>
                </Row>
            </Container>
            <Container hidden={!requestQuote}>
                <Row style={headings}>
                    <div>Select businesses to request a quote:</div>
                </Row>

                <div>
                    {businesses.length > 0 && businesses.map((business, i) =>
                        (<Row className="mt-2" key={i}>
                            <Col xs={2} className="mt-2">
                                <Row>
                                    <Checkbox type="BOX" checked={businesses[i].quote_requested}
                                              onClick={() => toggleBusiness(i)}/>
                                </Row>
                            </Col>
                            <Col>
                                <Row style={headings}>{business.business_name}</Row>
                                <Row style={subText}>
                                    Services: Toilet repair, Plumbing, Kitchen repair
                                </Row>
                                <Row className='d-flex flex-row align-items-center justify-content-evenly'>
                                    <Col style={blue}> Manager: Jane Doe</Col>
                                    <Col className='d-flex flex-row align-items-center justify-content-evenly'>
                                        <img src={Phone} style={{ width: "30px", height: "30px" }} />
                                        <img
                                            src={Message}
                                            style={{ width: "30px", height: "30px" }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>))}
                </div>
                <Row className="mt-4">
                    <Col className='d-flex justify-content-evenly'>
                        <Button style={bluePillButton} onClick={sendQuotesRequest}>Request Quotes</Button>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col className='d-flex justify-content-evenly'>
                        <Button style={redPillButton} onClick={() => setRequestQuote(false)}>Cancel</Button>
                    </Col>
                </Row>
            </Container>
            <Container hidden={!scheduleMaintenance}>
                <Row>
                    <div style={headings}>Schedule Maintenace</div>
                </Row>
                <Form.Group className="mt-3 mb-2">
                    <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                        Date
                    </Form.Label>
                    <Form.Control style={{ borderRadius: 0 }} type="date" />
                </Form.Group>
                <Form.Group className="mt-3 mb-2">
                    <Form.Label style={formLabel} as="h5" className="ms-1 mb-0">
                        Time
                    </Form.Label>
                    <Form.Control style={{ borderRadius: 0 }} type="time" />
                </Form.Group>
                <Row className="mt-4">
                    <Col className='d-flex justify-content-evenly'>
                        <Button style={bluePillButton}>Schedule Maintenance</Button>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col className='d-flex justify-content-evenly'>
                        <Button style={redPillButton} onClick={() => setScheduleMaintenance(false)}>Cancel</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ManagerRepairDetail;
