import React, { useState } from 'react';
import { Col, Container } from 'reactstrap';
import useFetchState from '../util/useFetchState';
import tokenService from '../services/token.service';
import getErrorModal from '../util/getErrorModal';
import { PricingPlanTable } from '../public/plan';

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

    const modal = getErrorModal(setVisible, visible, message);

    return <div>
        <Container style={{ marginTop: "15px" }}>
            <h1 className="text-center">My Plan - {plan}</h1>
            {modal}
            <Col align='center'>
                <PricingPlanTable buttons={true} plan={plan} changePlan={changePlan} />
            </Col>
        </Container>
    </div>
}