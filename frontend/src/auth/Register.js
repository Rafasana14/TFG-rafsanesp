import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import tokenService from '../services/token.service';

function Register() {

    const emptyRequest = {
        username: '',
        password: '',
        authority: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        telephone: ''
    };

    const [request, setRequest] = useState(emptyRequest);
    const [type, setType] = useState(null);

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        setRequest({ ...request, [name]: value })
    }

    function handleButtonClick(event) {
        const target = event.target;
        let value = target.value;
        if (value === "Back") value = null;
        else setRequest({ ...request, "authority": value })

        setType(value)
    }

    async function handleSubmit(event) {
        event.preventDefault();
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
                    tokenService.setUser(data);
                    tokenService.updateLocalAccessToken(data.token);
                    window.location.assign('/dashboard');
                }
            }).catch((message) => {
                alert(message);
            });
        }

    }

    if (type) {
        return <div>
            <Container style={{ marginTop: "15px" }}>
                <Form onSubmit={handleSubmit}>
                    <h2 className='text-center'>Register {type}</h2>
                    <Row className='justify-content-center'>
                        <Col lg='3' md='4' sm='8' xs='12'>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input type="text" required name="username" id="username" value={request.username || ''}
                                    onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" required name="password" id="password" value={request.password || ''}
                                    onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="firstName">First Name</Label>
                                <Input type="text" required name="firstName" id="firstName" value={request.firstName || ''}
                                    onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="lastName">Last Name</Label>
                                <Input type="text" required name="lastName" id="lastName" value={request.lastName || ''}
                                    onChange={handleChange} />
                            </FormGroup>
                            {type === "Vet" ?
                                <FormGroup>
                                    <Label for="city">City</Label>
                                    <Input type="text" required name="city" id="city" value={request.city || ''}
                                        onChange={handleChange} />
                                </FormGroup> : <></>
                            }
                        </Col>
                        {type === "Owner" ?
                            <Col lg='3' md='4' sm='8' xs='12'>
                                <FormGroup>
                                    <Label for="city">City</Label>
                                    <Input type="text" required name="city" id="city" value={request.city || ''}
                                        onChange={handleChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="address">Address</Label>
                                    <Input type="text" required name="address" id="address" value={request.address || ''}
                                        onChange={handleChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="telephone">Telephone</Label>
                                    <Input type="tel" required pattern="[0-9]{9}" name="telephone" id="telephone" value={request.telephone || ''}
                                        onChange={handleChange} />
                                </FormGroup>
                            </Col>
                            : <></>
                        }
                    </Row>
                    <br></br>
                    <Row >
                        <Col align='center'>
                            <FormGroup>
                                <Button className='save-button' type="submit">Save</Button>{' '}
                                <Button className='back-button' value="Back" onClick={handleButtonClick}>Back</Button>{' '}
                                <Button className='cancel-button' tag={Link} to="/">Cancel</Button>
                            </FormGroup>
                        </Col>
                    </Row>
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
                            <Button className='add-button' value="Owner" onClick={handleButtonClick}>
                                Owner
                            </Button>{" "}
                            <Button className='add-button' value="Vet" onClick={handleButtonClick}>
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
export default Register;