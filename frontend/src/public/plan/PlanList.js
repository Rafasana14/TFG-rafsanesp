import React from 'react';
import { Button, Card, CardBody, CardText, CardTitle, Col, Container, ListGroup, ListGroupItem, Row, Table } from 'reactstrap';
import { BsCheckLg, BsXLg } from 'react-icons/bs';

function PlanList() {

    return <Container >
        <h1 className="text-center">Pricing Plans</h1>
        <br></br>
        <Row>
            <Col sm="12" md="4" className='mt-1'>
                <Card aria-label='basic-card' className="basic-card" style={{ maxWidth: '18rem', backgroundColor: "#A5F2AA", padding: "10px" }}>
                    <CardBody>
                        <CardTitle className="text-center" tag="h5">
                            BASIC
                        </CardTitle>
                        <CardText className="text-center">
                            FREE
                        </CardText>
                        <ListGroup flush>
                            <ListGroupItem >
                                Number of Pets: 2
                            </ListGroupItem>
                            <ListGroupItem >
                                Number of Visits per Month and Pet: 1
                            </ListGroupItem>
                            <ListGroupItem >
                                Support Priority: Low
                            </ListGroupItem>
                        </ListGroup>
                    </CardBody>
                </Card>
            </Col>
            <Col sm="12" md="4" className='mt-1'>
                <Card aria-label='gold-card' className="gold-card" style={{ maxWidth: '18rem', backgroundColor: "#F8EA70", }}>
                    <CardBody>
                        <CardTitle className="text-center" tag="h5">
                            GOLD
                        </CardTitle>
                        <CardText className="text-center">
                            €5
                        </CardText>
                        <ListGroup flush>
                            <ListGroupItem>
                                Number of Pets: 4
                            </ListGroupItem>
                            <ListGroupItem>
                                Number of Visits per Month and Pet: 3
                            </ListGroupItem>
                            <ListGroupItem>
                                Support Priority: Medium
                            </ListGroupItem>
                        </ListGroup>
                        <br></br>
                        <CardText className="text-center">
                            Extra Functions
                        </CardText>
                        <ListGroup flush>
                            <ListGroupItem>
                                Vet Selection for Visits
                            </ListGroupItem>
                            <ListGroupItem>
                                Calendar with Upcoming Visits
                            </ListGroupItem>
                        </ListGroup>
                    </CardBody>
                </Card>
            </Col>
            <Col sm="12" md="4" className='mt-1'>
                <Card aria-label='platinum-card' className="platinum-card" style={{ maxWidth: '18rem', backgroundColor: "#E17596", }}>
                    <CardBody>
                        <CardTitle className="text-center" tag="h5">
                            PLATINUM
                        </CardTitle>
                        <CardText className="text-center">
                            €12
                        </CardText>
                        <ListGroup flush>
                            <ListGroupItem>
                                Number of Pets: 7
                            </ListGroupItem>
                            <ListGroupItem>
                                Number of Visits per Month and Pet: 6
                            </ListGroupItem>
                            <ListGroupItem>
                                Support Priority: High
                            </ListGroupItem>
                        </ListGroup>
                        <br></br>
                        <CardText className="text-center">
                            Extra Functions
                        </CardText>
                        <ListGroup flush>
                            <ListGroupItem>
                                Vet Selection for Visits
                            </ListGroupItem>
                            <ListGroupItem>
                                Calendar with Upcoming Visits
                            </ListGroupItem>
                            <ListGroupItem>
                                Statistics Dashboard for your Pets
                            </ListGroupItem>
                            <ListGroupItem>
                                Online Consultation
                            </ListGroupItem>
                        </ListGroup>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <br></br>
        <div className="mb-4">
            <hr className="solid" />
        </div>
        <Row>
            <Col md="3"></Col>
            <Col md="6">
                <PricingPlanTable />
            </Col>
            <Col md="3"></Col>
        </Row>
    </Container>
}

function PricingPlanTable({ plan, changePlan, buttons = false }) {

    const cell = "border border-left border-dark text-center";

    const basicStyle = {
        backgroundColor: "#A5F2AA",
        width: "18%"
    };
    const goldStyle = {
        backgroundColor: "#F8EA70",
        width: "18%"
    };
    const platinumStyle = {
        backgroundColor: "#E17596",
        width: "18%"
    };

    let basicButton, goldButton, platinumButton;
    if (buttons) {
        if (plan === "BASIC") {
            basicButton = <td className="border-bottom-0"></td>;
        } else {
            basicButton = <td className={cell} ><Button aria-label='change-basic' className="text-dark"
                style={{ backgroundColor: "#A5F2AA" }} onClick={(e) => changePlan(e, "BASIC")}>CHANGE</Button></td>;
        }
        if (plan === "GOLD") {
            goldButton = <td className="border-bottom-0"></td>;
        } else {
            goldButton = <td className={cell} ><Button aria-label='change-gold' className="text-dark"
                style={{ backgroundColor: "#F8EA70" }} onClick={(e) => changePlan(e, "GOLD")}>CHANGE</Button></td>;
        }
        if (plan === "PLATINUM") {
            platinumButton = <td className="border-bottom-0"></td>;
        } else {
            platinumButton = <td className={cell} ><Button aria-label='change-platinum'
                className="text-dark" style={{ backgroundColor: "#E17596" }} onClick={(e) => changePlan(e, "PLATINUM")}>CHANGE</Button></td>;
        }
    }


    return (
        <Table aria-label='pricing' style={{ maxWidth: "700px" }}>
            <thead>
                <tr>
                    <th className=" border-bottom border-dark" ></th>
                    <th style={basicStyle} className={cell}>BASIC</th>
                    <th style={goldStyle} className={cell}>GOLD</th>
                    <th style={platinumStyle} className={cell}>PLATINUM</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border border-dark">
                    <td className="table-info border border-dark">Max Number of Pets</td>
                    <td style={basicStyle} className={cell}>2</td>
                    <td style={goldStyle} className={cell}>4</td>
                    <td style={platinumStyle} className={cell}>7</td>
                </tr>
                <tr className="border border-dark">
                    <td className="table-info border border-dark">Number of Visits per Month and Pet</td>
                    <td style={basicStyle} className={cell}>1</td>
                    <td style={goldStyle} className={cell}>3</td>
                    <td style={platinumStyle} className={cell}>6</td>
                </tr>
                <tr className="border border-dark">
                    <td className="table-info border border-dark">Vet Selection for Visits</td>
                    <td style={basicStyle} className={cell}><BsXLg /></td>
                    <td style={goldStyle} className={cell}><BsCheckLg /></td>
                    <td style={platinumStyle} className={cell}><BsCheckLg /></td>
                </tr>
                <tr className="border border-dark">
                    <td className="table-info border border-dark">Calendar with Upcoming Visits</td>
                    <td style={basicStyle} className={cell}><BsXLg /></td>
                    <td style={goldStyle} className={cell}><BsCheckLg /></td>
                    <td style={platinumStyle} className={cell}><BsCheckLg /></td>
                </tr>
                <tr className="border border-dark">
                    <td className="table-info border border-dark">Statistics Dashboard for your Pets</td>
                    <td style={basicStyle} className={cell}><BsXLg /></td>
                    <td style={goldStyle} className={cell}><BsXLg /></td>
                    <td style={platinumStyle} className={cell}><BsCheckLg /></td>
                </tr>
                <tr className="border border-dark">
                    <td className="table-info border border-dark">Online Consultation</td>
                    <td style={basicStyle} className={cell}><BsXLg /></td>
                    <td style={goldStyle} className={cell}><BsXLg /></td>
                    <td style={platinumStyle} className={cell}><BsCheckLg /></td>
                </tr>
                <tr className="border border-dark">
                    <td className="table-info border border-dark">Support Priority</td>
                    <td style={basicStyle} className={cell}>Low</td>
                    <td style={goldStyle} className={cell}>Medium</td>
                    <td style={platinumStyle} className={cell}>High</td>
                </tr>
                <tr className="border border-dark">
                    <td className="table-info border border-dark">Prize</td>
                    <td style={basicStyle} className={cell}>FREE</td>
                    <td style={goldStyle} className={cell}>€5</td>
                    <td style={platinumStyle} className={cell}>€12</td>
                </tr>
                {buttons ?
                    <tr style={{ height: "60px" }}>
                        <td className="border-bottom-0"></td>
                        {basicButton}
                        {goldButton}
                        {platinumButton}
                    </tr>
                    : <></>
                }
            </tbody>
        </Table>
    )
}
export { PlanList, PricingPlanTable };