import React from "react";
import { Link } from "react-router-dom";
import { Form, Button, Container, FormGroup, Col } from "reactstrap";
import tokenService from "../services/token.service";

const Logout = () => {

    function sendLogoutRequest() {
        const jwt = window.localStorage.getItem("jwt");
        if (jwt || typeof jwt === 'undefined') {
            tokenService.removeUser();
            window.location.assign('/');
        } else {
            alert("There is no user logged in")
        }
    }

    return (

        <>
            <Container style={{ marginTop: "15px" }} >
                <Form>
                    <Col align='center'>
                        <h2>Are you sure you want to log out?</h2>
                        <br />
                        <FormGroup >
                            <Button className="save-button" onClick={() => sendLogoutRequest()}>Yes</Button>{' '}
                            <Button className="back-button" tag={Link} to="/">No</Button>
                        </FormGroup>
                    </Col >
                </Form >
            </Container >
        </>
    );
};

export default Logout;
