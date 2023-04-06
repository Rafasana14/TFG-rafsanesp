import React, { Component } from 'react';
import { Button, Col, Container, Row, Table } from 'reactstrap';

import { BsCheckLg, BsXLg } from 'react-icons/bs';

class PricingPlan extends Component {

    emptyOwner = {
        id: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        plan: '',
        telephone: '',
    };

    constructor(props) {
        super(props);
        this.state = {
            owner: this.emptyOwner,
            plan: null,
            message: null,
        };
        this.jwt = JSON.parse(window.localStorage.getItem("jwt"));
    }

    async componentDidMount() {
        const owner = await (await fetch(`/api/v1/plan`, {
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
            },
        })).json();
        if (owner.message) this.setState({ message: owner.message })
        else this.setState({ owner: owner, plan: owner.plan });

    }

    async changePlan(event, plan) {
        event.preventDefault();

        await fetch('/api/v1/plan', {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(plan),
        });
        window.location.href = '/plan';
    }

    render() {
        const { plan } = this.state;
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
        if (plan === "BASIC") {
            basicButton = <td className="border-bottom-0"></td>;
            // <Button className="text-dark" style={basicStyle}>SELECTED</Button>;
        } else {
            basicButton = <td className={cell}><Button className="text-dark" style={{ backgroundColor: "#A5F2AA" }} onClick={(e) => this.changePlan(e, "BASIC")}>CHANGE</Button></td>;
        }
        if (plan === "GOLD") {
            goldButton = <td className="border-bottom-0"></td>;
            // goldButton = <Button className="text-dark" style={goldStyle}>SELECTED</Button>;
        } else {
            goldButton = <td className={cell}><Button className="text-dark" style={{ backgroundColor: "#F8EA70" }} onClick={(e) => this.changePlan(e, "GOLD")}>CHANGE</Button></td>;
        }
        if (plan === "PLATINUM") {
            platinumButton = <td className="border-bottom-0"></td>;
            // platinumButton = <Button className="text-dark" style={platinumStyle}>SELECTED</Button>;
        } else {
            platinumButton = <td className={cell}><Button className="text-dark" style={{ backgroundColor: "#E17596" }} onClick={(e) => this.changePlan(e, "PLATINUM")}>CHANGE</Button></td>;
        }
        if (this.state.message) {
            return <h2 className='text-center'>{this.state.message}</h2>
        }

        return <div>
            {/* <AppNavbar /> */}
            <Container style={{ marginTop: "15px" }}>
                <h1 className="text-center">My Plan - {plan}</h1>
                <Row>
                    <Col md="3"></Col>
                    <Col md="6">
                        <Table>
                            <thead>
                                <tr>
                                    <th className="bg-white border-bottom border-dark" ></th>
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
                                <tr style={{ height: "60px" }}>
                                    <td className="border-bottom-0"></td>
                                    {basicButton}
                                    {goldButton}
                                    {platinumButton}
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col md="3"></Col>
                </Row>
            </Container>
        </div>
    }
}
export default PricingPlan;