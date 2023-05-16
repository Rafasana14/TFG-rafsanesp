import React, { useState } from 'react';
import { Button, Col, Container, Table } from 'reactstrap';

import { BsCheckLg, BsXLg } from 'react-icons/bs';
import useFetchState from '../util/useFetchState';
import tokenService from '../services/token.service';
import getErrorModal from '../util/getErrorModal';

const jwt = tokenService.getLocalAccessToken()

export default function PlanEdit() {

    const emptyOwner = {
        id: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        plan: '',
        telephone: '',
    };

    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [owner, setOwner] = useFetchState(emptyOwner, `/api/v1/plan`, jwt, setMessage, setVisible);
    const plan = owner.plan;

    function changePlan(event, plan) {
        event.preventDefault();

        fetch('/api/v1/plan', {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(plan),
        }).then((response) => response.json())
            .then(json => {
                if (json.message) {
                    setMessage(json.message);
                    setVisible(true);
                } else {
                    setOwner({ ...owner, plan: plan });
                }
            })
            .catch((message) => alert(message));
    }

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
    } else {
        basicButton = <td className={cell}><Button className="text-dark" style={{ backgroundColor: "#A5F2AA" }} onClick={(e) => changePlan(e, "BASIC")}>CHANGE</Button></td>;
    }
    if (plan === "GOLD") {
        goldButton = <td className="border-bottom-0"></td>;
    } else {
        goldButton = <td className={cell}><Button className="text-dark" style={{ backgroundColor: "#F8EA70" }} onClick={(e) => changePlan(e, "GOLD")}>CHANGE</Button></td>;
    }
    if (plan === "PLATINUM") {
        platinumButton = <td className="border-bottom-0"></td>;
    } else {
        platinumButton = <td className={cell}><Button className="text-dark" style={{ backgroundColor: "#E17596" }} onClick={(e) => changePlan(e, "PLATINUM")}>CHANGE</Button></td>;
    }

    const modal = getErrorModal(setVisible, visible, message);

    return <div>
        <Container style={{ marginTop: "15px" }}>
            <h1 className="text-center">My Plan - {plan}</h1>
            {modal}
            <Col align='center'>
                <Table style={{ maxWidth: "700px" }}>
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
        </Container>
    </div>
}