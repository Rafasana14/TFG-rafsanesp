import React from "react";
import { Link } from "react-router-dom";
import { Form, Button, Container, FormGroup, Col } from "reactstrap";
// import { useLocalState } from "../../util/useLocalStorage";

const Logout = () => {

    function sendLogoutRequest() {
        const jwt = window.localStorage.getItem("jwt");
        if (jwt || typeof jwt === 'undefined') {
            window.localStorage.removeItem("jwt");
            window.location.href = '/';
        } else {
            alert("There is no user logged in")
        }
    }

    return (

        <>
            <Container className="d-flex justify-content-center">
                <Form>
                    <Col>
                        <h2>Are you sure you want to log out?</h2>
                        <br />
                        <FormGroup>
                            <Button color="primary" onClick={() => sendLogoutRequest()}>Yes</Button>{' '}
                            <Button color="secondary" tag={Link} to="/">No</Button>
                        </FormGroup>
                    </Col>
                </Form>
            </Container>
        </>
    );
};

export default Logout;
