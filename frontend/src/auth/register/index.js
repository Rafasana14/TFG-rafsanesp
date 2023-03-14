import { Link } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";

const Register = () => {

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                <h1 className="text-center">Register</h1>
                <h2 className="text-center">What type of User will you be?</h2>
                <Row>
                    <Col></Col>
                    <Col align="center" sm="4" className="justify-content-center">
                        <Button color="success" tag={Link} to="/register/owner">
                            Owner
                        </Button>{" "}
                        <Button color="success" tag={Link} to="/register/vet">
                            Vet
                        </Button>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>
    );

};

export default Register;
