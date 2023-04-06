import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import tokenService from '../../services/token.service';

class Register extends Component {

    emptyRequest = {
        username: '',
        password: '',
        authority: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        telephone: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            request: this.emptyRequest,
            type: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let request = { ...this.state.request };

        request[name] = value;
        this.setState({ request });
    }

    handleButtonClick(event) {
        const target = event.target;
        let value = target.value;
        let request = { ...this.state.request };
        if (value === "Back") value = null;
        else request["authority"] = value;
        this.setState({
            type: value, request: request,
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { request } = this.state;
        let state = "";

        await fetch("/api/v1/auth/signup", {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(request),
        }).then(function (response) {
            if (response.status === 200) state = "200"
            else state = "";
            return response.json();
        }).then(function (data) {
            if (state !== "200") alert(data.message);
        });

        const loginRequest = {
            username: request.username,
            password: request.password,
        };
        if (state === "200") {
            await fetch("/api/v1/auth/signin", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify(loginRequest),
            }).then(function (response) {
                if (response.status === 200) {
                    state = "200"
                    return response.json();
                }
                else {
                    state = "";
                    return response.json();
                }
            }).then(function (data) {
                if (state !== "200") alert(data.message);
                else {
                    tokenService.updateLocalAccessToken(data.token)
                    window.location.href = '/dashboard';
                }
            }).catch((message) => {
                alert(message);
            });
        }

    }

    render() {
        const { request, type } = this.state;
        if (type) {
            return <div>
                <Container style={{ marginTop: "15px" }} className="d-flex justify-content-center">
                    <Form onSubmit={this.handleSubmit}>
                        <h2>Register {type}</h2>
                        <Col>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input type="text" required name="username" id="username" value={request.username || ''}
                                    onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" required name="password" id="password" value={request.password || ''}
                                    onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="firstName">First Name</Label>
                                <Input type="text" required name="firstName" id="firstName" value={request.firstName || ''}
                                    onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="lastName">Last Name</Label>
                                <Input type="text" required name="lastName" id="lastName" value={request.lastName || ''}
                                    onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="city">City</Label>
                                <Input type="text" required name="city" id="city" value={request.city || ''}
                                    onChange={this.handleChange} />
                            </FormGroup>
                            {type === "Owner" ?
                                <>
                                    <FormGroup>
                                        <Label for="address">Address</Label>
                                        <Input type="text" required name="address" id="address" value={request.address || ''}
                                            onChange={this.handleChange} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="telephone">Telephone</Label>
                                        <Input type="tel" required pattern="[0-9]{9}" name="telephone" id="telephone" value={request.telephone || ''}
                                            onChange={this.handleChange} />
                                    </FormGroup>
                                </>
                                : <></>
                            }
                            <br></br>
                            <FormGroup>
                                <Button color="primary" type="submit">Save</Button>{' '}
                                <Button color="secondary" value="Back" onClick={this.handleButtonClick}>Back</Button>{' '}
                                <Button color="danger" tag={Link} to="/">Cancel</Button>
                            </FormGroup>
                        </Col>
                    </Form>
                </Container>
            </div >
        } else {
            return (
                <div>
                    <Container style={{ marginTop: "15px" }}>
                        <h1 className="text-center">Register</h1>
                        <h2 className="text-center">What type of User will you be?</h2>
                        <Row>
                            <Col></Col>
                            <Col align="center" sm="4" className="justify-content-center">
                                <Button color="success" value="Owner" onClick={this.handleButtonClick}>
                                    Owner
                                </Button>{" "}
                                <Button color="success" value="Vet" onClick={this.handleButtonClick}>
                                    Vet
                                </Button>
                            </Col>
                            <Col></Col>
                        </Row>
                    </Container>
                </div>
            );
        }

    }
}
export default Register;