import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import tokenService from '../../services/token.service';
import getErrorModal from '../../util/getErrorModal';
import useFetchData from '../../util/useFetchData';
import getIdFromUrl from '../../util/getIdFromUrl';
import useFetchState from '../../util/useFetchState';
import submitState from '../../util/submitState';
import useNavigateAfterSubmit from '../../util/useNavigateAfterSubmit';

const jwt = tokenService.getLocalAccessToken();

export default function VisitEditAdmin() {
    const emptyItem = {
        id: '',
        datetime: '',
        description: '',
        vet: {},
        pet: {},
    };
    const petId = getIdFromUrl(2);
    const visitId = getIdFromUrl(4);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visit, setVisit] = useFetchState(emptyItem, `/api/v1/pets/${petId}/visits/${visitId}`, jwt, setMessage, setVisible, visitId);
    const pet = useFetchData(`/api/v1/pets/${petId}`, jwt);
    const vets = useFetchData(`/api/v1/vets`, jwt);
    const [redirect, setRedirect] = useState(false);
    useNavigateAfterSubmit(`/pets/${petId}/visits`, redirect);

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name === "vet") {
            const vet = vets.find((v) => v.id === Number(value));
            setVisit({ ...visit, vet: vet })
        } else
            setVisit({ ...visit, [name]: value })
    }

    const handleSubmit = (event) => submitState(event, visit, `/api/v1/pets/${petId}/visits`, setMessage, setVisible, setRedirect);
    const modal = getErrorModal(setVisible, visible, message);
    const vetOptions = vets.map(vet => <option key={vet.id} value={vet.id}>{vet.firstName} {vet.lastName}</option>);

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2>{visit.id ? 'Edit Visit' : 'Add Visit'}</h2>}
                {modal}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="datetime">Date and Time</Label>
                        <Input type="datetime-local" required name="datetime" id="datetime" value={visit.datetime || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="textarea" name="description" id="description" value={visit.description || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="vet">Vet</Label>
                        <Input type="select" required name="vet" id="vet" value={visit.vet.id}
                            onChange={handleChange}>
                            <option value="">None</option>
                            {vetOptions}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="pet">Pet</Label>
                        <Input type="text" disabled name="pet" id="pet" value={pet.name || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to={`/pets/${petId}/visits`}>Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div >
    );
}
