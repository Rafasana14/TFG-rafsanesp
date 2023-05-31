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

export default function ConsultationEditOwner() {
    const emptyItem = {
        id: null,
        title: '',
        status: null,
        owner: null,
    };
    const id = getIdFromUrl(2);
    const userId = tokenService.getUser().id;
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [consultation, setConsultation] = useFetchState(emptyItem, `/api/v1/consultations/${id}`, jwt, setMessage, setVisible, id);
    const pets = useFetchData(`/api/v1/pets?userId=${userId}`, jwt, setMessage, setVisible);
    const [redirect, setRedirect] = useState(false);
    useNavigateAfterSubmit("/consultations", redirect);

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name === "pet") {
            const pet = pets.find((pet) => pet.id === Number(value));
            setConsultation({ ...consultation, pet: pet });
        }
        else setConsultation({ ...consultation, [name]: value });
    }

    const handleSubmit = async (event) => {
        const aux = { ...consultation, owner: pets.length > 0 ? pets[0].owner : null, status: "PENDING" }
        await submitState(event, aux, `/api/v1/consultations`, setMessage, setVisible, setRedirect);
    };

    const modal = getErrorModal(setVisible, visible, message);


    const petOptions =
        Array.from(pets).map(pet => <option key={pet.id} value={pet.id}>{pet.name}</option>);

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2>{id !== 'new' ? 'Edit Consultation' : 'Add Consultation'}</h2>}
                {modal}
                <Form onSubmit={(e) => { (async () => { await handleSubmit(e); })(); }}>
                    <FormGroup>
                        <Label for="title">Title</Label>
                        <Input type="text" required name="title" id="title" value={consultation.title || ''}
                            onChange={handleChange} />
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
                        <Button className='save-button' type="submit">Save</Button>{' '}
                        <Button className='back-button' tag={Link} to="/consultations">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    );
}