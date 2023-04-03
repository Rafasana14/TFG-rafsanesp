import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, Input, Label } from 'reactstrap';

class RegisterOwner extends Component {

    emptyRequest = {
        username: '',
        password: '',
        authority: 'OWNER',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
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

        await fetch("/api/v1/auth/signup", {
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
                    window.localStorage.setItem("jwt", JSON.stringify(data.token));
                    window.location.href = '/dashboard';
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
                    <h2>Register Owner</h2>
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
                            <Label for="address">Address</Label>
                            <Input type="text" required name="address" id="address" value={request.address || ''}
                                onChange={this.handleChange} autoComplete="address" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="city">City</Label>
                            <Input type="text" required name="city" id="city" value={request.city || ''}
                                onChange={this.handleChange} autoComplete="city" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="telephone">Telephone</Label>
                            <Input type="tel" required pattern="[0-9]{9}" name="telephone" id="telephone" value={request.telephone || ''}
                                onChange={this.handleChange} autoComplete="telephone" />
                        </FormGroup>
                        <br></br>
                        <FormGroup>
                            <Button color="primary" type="submit">Save</Button>{' '}
                            <Button color="secondary" tag={Link} to="/">Cancel</Button>
                        </FormGroup>
                    </Col>
                </Form>
            </Container>
        </div >
    }
}
export default RegisterOwner;