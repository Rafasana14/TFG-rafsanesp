import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import tokenService from '../../services/token.service';
import getErrorModal from '../../util/getErrorModal';
import useData from '../../util/useData';

const jwt = tokenService.getLocalAccessToken();

export default function ConsultationEditAdmin() {
    const emptyItem = {
        id: null,
        title: '',
        status: null,
        owner: null,
    };
    const [consultation, setConsultation] = useState(emptyItem);
    const owners = useData("/api/v1/owners", jwt);
    const pets = useData(`/api/v1/pets`, jwt);
    const [petsOwned, setPetsOwned] = useState(emptyItem);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const pathArray = window.location.pathname.split('/');
    const id = pathArray[2];

    useEffect(() => {
        let ignore = false;
        if (id !== 'new') {
            fetch(`/api/v1/consultations/${id}`, {
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
                        else {
                            setConsultation(json);
                            setPetsOwned(json.pet)
                        }
                    }
                });
        }
        return () => {
            ignore = true;
        };
    }, [id]);

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name === "owner") {
            const owner = owners.find((owner) => owner.id === Number(value));
            setConsultation({ ...consultation, owner: owner });
            setPetsOwned(pets.filter((pet) => pet.owner.id === Number(value)));
        } else if (name === "pet") {
            const pet = pets.find((pet) => pet.id === Number(value));
            setConsultation({ ...consultation, pet: pet });
        }
        else setConsultation({ ...consultation, [name]: value });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        await fetch('/api/v1/consultations' + (consultation.id ? '/' + consultation.id : ''), {
            method: (consultation.id) ? 'PUT' : 'POST',
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(consultation),
        })
            .then(response => response.json())
            .then(json => {
                if (json.message) {
                    setMessage(json.message);
                    setVisible(true);
                }
                else window.location.href = '/consultations';
            });
    }

    function handleVisible() {
        setVisible(!visible);
    }

    const alert = getErrorModal({ handleVisible }, visible, message);
    const ownerOptions = owners.map(owner => <option key={owner.id} value={owner.id}>{owner.user.username}</option>);
    const petOptions = consultation.id ?
        <option key={consultation.pet.id} value={consultation.pet.id}>{consultation.pet.name}</option> :
        consultation.owner ?
            petsOwned.map(pet => <option key={pet.id} value={pet.id}>{pet.name}</option>) :
            <></>;

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2>{id !== 'new' ? 'Edit Consultation' : 'Add Consultation'}</h2>}
                {alert}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="title">Title</Label>
                        <Input type="text" required name="title" id="title" value={consultation.title || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="status">Status</Label>
                        <Input type="select" required name="status" id="status" value={consultation.status || ""}
                            onChange={handleChange}>
                            <option value="">None</option>
                            <option value="PENDING">PENDING</option>
                            <option value="ANSWERED">ANSWERED</option>
                            <option value="CLOSED">CLOSED</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="owner">Owner</Label>
                        {consultation.id ?
                            <Input type="select" disabled name="owner" id="owner" value={consultation.owner?.id || ""}
                                onChange={handleChange} >
                                <option value="">None</option>
                                {ownerOptions}
                            </Input> :
                            <Input type="select" required name="owner" id="owner" value={consultation.owner?.id || ""}
                                onChange={handleChange} >
                                <option value="">None</option>
                                {ownerOptions}
                            </Input>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="pet">Pet</Label>
                        {consultation.id ?
                            <Input type="select" disabled name="pet" id="pet" value={consultation.pet?.id || ""}
                                onChange={handleChange} >
                                <option value="">None</option>
                                {petOptions}
                            </Input> :
                            <Input type="select" required name="pet" id="pet" value={consultation.pet?.id || ""}
                                onChange={handleChange} >
                                <option value="">None</option>
                                {petOptions}
                            </Input>}
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/consultations">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    );
}