import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import tokenService from '../../../services/token.service';

class RegisterVet extends Component {

    emptyRequest = {
        username: '',
        password: '',
        authority: 'VET',
        firstName: '',
        lastName: '',
        city: '',
        address: '',
        telephone: '',
    };

    constructor(props) {
        super(props);
        this.state = {
            request: this.emptyRequest,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // async componentDidMount() {
    //     if (this.id !== 'new') {
    //         const owner = await (await fetch(`/api/v1/owners/${this.id}`, {
    //             headers: {
    //                 "Authorization": `Bearer ${this.jwt}`,
    //             },
    //         })).json();
    //         this.setState({ item: owner });
    //     }
    // }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let request = { ...this.state.request };
        request[name] = value;
        this.setState({ request });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { request } = this.state;
        let state = "";

        await (await fetch("/api/v1/auth/signup", {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(request),
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
        }));

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
                }
                else {
                    state = ""
                    // return Promise.reject("Invalid login attempt");
                }
                return response.json();
            }).then(function (data) {
                if (state !== "200") alert(data.message);
                else {
                    tokenService.updateLocalAccessToken(data.token)
                    window.location.href = "dashboard";
                }
            }).catch((message) => {
                alert(message);
            });
        }
    }

    render() {
        const { request } = this.state;

        return <div>
            {/* <AppNavbar /> */}
            <Container className="d-flex justify-content-center">
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <h2>Register Vet</h2><br></br>
                        <Col>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input type="text" required name="username" id="username" value={request.username || ''}
                                    onChange={this.handleChange} autoComplete="firstName" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" required name="password" id="password" value={request.password || ''}
                                    onChange={this.handleChange} autoComplete="password" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="firstName">First Name</Label>
                                <Input type="text" required name="firstName" id="firstName" value={request.firstName || ''}
                                    onChange={this.handleChange} autoComplete="firstName" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="lastName">Last Name</Label>
                                <Input type="text" required name="lastName" id="lastName" value={request.lastName || ''}
                                    onChange={this.handleChange} autoComplete="lastName" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="city">City</Label>
                                <Input type="text" required name="city" id="city" value={request.city || ''}
                                    onChange={this.handleChange} autoComplete="city" />
                            </FormGroup>
                            <br></br>
                            <FormGroup>
                                <Button color="primary" type="submit">Save</Button>{' '}
                                <Button color="secondary" tag={Link} to="/">Cancel</Button>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
    }
}
export default RegisterVet;