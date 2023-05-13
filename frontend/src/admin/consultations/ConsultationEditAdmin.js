import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import tokenService from '../../services/token.service';
import getErrorModal from '../../util/getErrorModal';
import useFetchData from '../../util/useFetchData';
import useFetchState from '../../util/useFetchState';
import getIdFromUrl from '../../util/getIdFromUrl';
import submitState from '../../util/submitState';
import useNavigateAfterSubmit from '../../util/useNavigateAfterSubmit';

const jwt = tokenService.getLocalAccessToken();

export default function ConsultationEditAdmin() {
    const emptyItem = {
        id: null,
        title: '',
        status: null,
        owner: null,
    };
    const id = getIdFromUrl(2);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [consultation, setConsultation] = useFetchState(emptyItem, `/api/v1/consultations/${id}`, jwt, setMessage, setVisible, id);
    const owners = useFetchData("/api/v1/owners", jwt);
    const pets = useFetchData(`/api/v1/pets`, jwt);
    const [petsOwned, setPetsOwned] = useState([]);
    const [redirect, setRedirect] = useState(false);
    useNavigateAfterSubmit("/consultations", redirect);

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

    const handleSubmit = async (event) => {
        await submitState(event, consultation, `/api/v1/consultations`, setMessage, setVisible, setRedirect);
    };

    const modal = getErrorModal(setVisible, visible, message);

    const ownerOptions = Array.from(owners).map(owner => <option key={owner.id} value={owner.id}>{owner.user.username}</option>);
    let petOptions;
    if (consultation.id)
        petOptions = <option key={consultation.pet.id} value={consultation.pet.id}>{consultation.pet.name}</option>;
    else
        petOptions = consultation.owner ?
            petsOwned.map(pet => <option key={pet.id} value={pet.id}>{pet.name}</option>) :
            <></>;

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2>{id !== 'new' ? 'Edit Consultation' : 'Add Consultation'}</h2>}
                {modal}
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
                            <Input type="select" disabled name="owner" id="owner" value={consultation.owner?.id || consultation.pet?.owner.id || ""}
                                onChange={handleChange} >
                                <option value="">None</option>
                                {ownerOptions}
                            </Input> :
                            <Input type="select" required name="owner" id="owner" value={consultation.owner?.id || consultation.pet?.owner.id || ""}
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