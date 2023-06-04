import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import tokenService from '../../services/token.service';
import useErrorModal from '../../util/useErrorModal';
import useFetchState from '../../util/useFetchState';
import getIdFromUrl from '../../util/getIdFromUrl';
import submitState from '../../util/submitState';
import useNavigateAfterSubmit from '../../util/useNavigateAfterSubmit';

const jwt = tokenService.getLocalAccessToken();

export default function SpecialtyEditAdmin() {
    const emptyItem = {
        id: '',
        name: '',
    };
    const id = getIdFromUrl(3);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [specialty, setSpecialty] = useFetchState(emptyItem, `/api/v1/vets/specialties/${id}`, jwt, setMessage, setVisible, id);
    const [redirect, setRedirect] = useState(false);
    useNavigateAfterSubmit("/vets/specialties", redirect);

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setSpecialty({ ...specialty, [name]: value })
    }

    const handleSubmit = async (event) => await submitState(event, specialty, `/api/v1/vets/specialties`, setMessage, setVisible, setRedirect);
    const modal = useErrorModal(setVisible, visible, message);

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2>{specialty.id ? 'Edit Specialty' : 'Add Specialty'}</h2>}
                {modal}
                <Form onSubmit={(e) => { (async () => { await handleSubmit(e); })(); }}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" id="name" value={specialty.name || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <FormGroup style={{ marginTop: "10px" }}>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/vets/specialties">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div >
    );
}
