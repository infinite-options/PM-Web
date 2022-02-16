import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Phone from "../icons/Phone.svg";
import Message from "../icons/Message.svg";
import { headings, subText } from "../utils/styles";
import Header from "../components/Header";

function ManagerEmergency(props) {
    const navigate = useNavigate();
    return (
        <div className="h-100 d-flex flex-column">
            <Header
                title="Emergency"
                leftText="< Back"
                leftFn={() => ''}
            />
            <Container className="pt-1 mb-4">
                <Row style={headings}>
                    <div>Emergency Contacts</div>
                </Row>
                <Row>
                    <Col>
                        <div style={headings}>John Parker</div>
                        <div style={subText}>Property Manager</div>
                    </Col>
                    <Col xs={2} className="mt-1 mb-1">
                        <img src={Phone} />
                    </Col>
                    <Col xs={2} className="mt-1 mb-1">
                        <img src={Message} />
                    </Col>
                    <hr />
                </Row>
                <Row>
                    <Col>
                        <div style={headings}>John Parker</div>
                        <div style={subText}>Apartment Manager</div>
                    </Col>
                    <Col xs={2} className="mt-1 mb-1">
                        <img src={Phone} />
                    </Col>
                    <Col xs={2} className="mt-1 mb-1">
                        <img src={Message} />
                    </Col>
                    <hr />
                </Row>
                <Row>
                    <Col>
                        <div style={headings}>John Parker</div>
                        <div style={subText}>Property Owner</div>
                    </Col>
                    <Col xs={2} className="mt-1 mb-1">
                        <img src={Phone} />
                    </Col>
                    <Col xs={2} className="mt-1 mb-1">
                        <img src={Message} />
                    </Col>
                    <hr />
                </Row>
                <Row>
                    <Col>
                        <div style={headings}>TEP</div>
                        <div style={subText}>Tuscon Electric Power</div>
                    </Col>
                    <Col xs={2} className="mt-1 mb-1">
                        <img src={Phone} />
                    </Col>
                    <Col xs={2} className="mt-1 mb-1">
                        <img src={Message} />
                    </Col>
                    <hr />
                </Row>
                <Row>
                    <Col>
                        <div style={headings}>911</div>
                        <div style={subText}>First Responders</div>
                    </Col>
                    <Col xs={2} className="mt-1 mb-1">
                        <img src={Phone} />
                    </Col>
                    <Col xs={2} className="mt-1 mb-1">
                        <img src={Message} />
                    </Col>
                    <hr />
                </Row>
            </Container>
        </div>
    );
}

export default ManagerEmergency;
