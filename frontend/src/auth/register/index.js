import { Link } from "react-router-dom";
import { Button, Container } from "reactstrap";

const Register = () => {

    return (
        <>
            <Container className="d-flex justify-content-center">
                <Button color="success" tag={Link} to="/register/owner">
                    Owner
                </Button>
                <Button color="success" tag={Link} to="/register/vet">
                    Vet
                </Button>
            </Container>
        </>
    );

};

export default Register;
