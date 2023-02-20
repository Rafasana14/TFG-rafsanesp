import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, Input, Label } from 'reactstrap';

class PricingPlan extends Component {

    emptyItem = {
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
            item: this.emptyItem,
            plan: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.jwt = JSON.parse(window.localStorage.getItem("jwt"));
    }

    async componentDidMount() {
        if (this.id !== 'new') {
            const owner = await (await fetch(`/plan`, {
                headers: {
                    "Authorization": `Bearer ${this.jwt}`,
                },
            })).json();
            this.setState({ item: owner, plan: owner.plan });
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = { ...this.state.item };
        item[name] = value;
        this.setState({ item });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { item } = this.state;

        await fetch('/plan', {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item.plan),
        });
        window.location.href = '/plan';
    }

    render() {
        const { item, plan } = this.state;

        return <div>
            {/* <AppNavbar /> */}
            <Container>
                <h2>Current Plan</h2>
                <h3>{plan}</h3>
                <Form onSubmit={this.handleSubmit}>
                    <Col md={2}>
                        <FormGroup>
                            <Label for="plan">Change Plan</Label>
                            <Input id="plan" name="plan" type="select" value={item.plan} onChange={this.handleChange} autoComplete="plan">
                                <option value={0}>BASIC</option>
                                <option value={1}>GOLD</option>
                                <option value={2}>PLATINUM</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <br />
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}
export default PricingPlan;