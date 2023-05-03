import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import tokenService from '../../services/token.service';
import getErrorModal from '../../util/getErrorModal';
import useFetchState from '../../util/useFetchState';
import getIdFromUrl from '../../util/getIdFromUrl';

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

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setSpecialty({ ...specialty, [name]: value })
    }

    function handleSubmit(event) {
        event.preventDefault();

        fetch('/api/v1/vets/specialties' + (specialty.id ? '/' + specialty.id : ''), {
            method: (specialty.id) ? 'PUT' : 'POST',
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(specialty),
        })
            .then(response => response.json())
            .then(json => {
                if (json.message) {
                    setMessage(json.message);
                    setVisible(true);
                }
                else window.location.href = '/vets/specialties';
            })
            .catch((message) => alert(message));
    }


    const modal = getErrorModal(setVisible, visible, message);

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2>{specialty.id ? 'Edit Specialty' : 'Add Specialty'}</h2>}
                {modal}
                <Form onSubmit={handleSubmit}>
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
