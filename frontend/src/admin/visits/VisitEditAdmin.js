import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import tokenService from '../../services/token.service';
import useData from '../../util/useData';
import getErrorModal from '../../util/getErrorModal';

const jwt = tokenService.getLocalAccessToken();

export default function VisitEditAdmin() {
    const emptyItem = {
        id: '',
        datetime: '',
        description: '',
        vet: {},
        pet: {},
    };
    const pathArray = window.location.pathname.split('/');
    const petId = pathArray[2];
    const visitId = pathArray[4];
    const [visit, setVisit] = useState(emptyItem);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const pet = useData(`/api/v1/pets/${petId}`, jwt);
    const vets = useData(`/api/v1/vets`, jwt);

    useEffect(() => {
        let ignore = false;
        if (visitId !== 'new') {
            fetch(`/api/v1/pets/${petId}/visits/${visitId}`, {
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                },
            }).then(response => response.json())
                .then(json => {
                    if (!ignore) {
                        if (json.message) {
                            setMessage(json.message);
                            setVisible(true);
                        }
                        else setVisit(json);
                    }
                });
        }
        return () => {
            ignore = true;
        };
    }, [petId, visitId,]);

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

    async function handleSubmit(event) {
        event.preventDefault();
        setVisit({ ...visit, pet: pet })

        await fetch(`/api/v1/pets/${petId}/visits` + (visit.id ? '/' + visit.id : ''), {
            method: (visit.id) ? 'PUT' : 'POST',
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(visit),
        })
            .then(response => response.json())
            .then(json => {
                if (json.message) {
                    setMessage(json.message);
                    setVisible(true);
                }
                else window.location.href = `/pets/${petId}/visits`;
            });
    }

    function handleVisible() {
        setVisible(!visible);
    }

    const alert = getErrorModal({ handleVisible }, visible, message);
    const vetOptions = vets.map(vet => <option key={vet.id} value={vet.id}>{vet.firstName} {vet.lastName}</option>);

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2>{visit.id ? 'Edit Visit' : 'Add Visit'}</h2>}
                {alert}
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
