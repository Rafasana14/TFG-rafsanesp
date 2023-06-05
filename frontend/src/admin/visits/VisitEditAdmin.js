import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import tokenService from '../../services/token.service';
import useErrorModal from '../../util/useErrorModal';
import useFetchData from '../../util/useFetchData';
import getIdFromUrl from '../../util/getIdFromUrl';
import useFetchState from '../../util/useFetchState';
import submitState from '../../util/submitState';
import useNavigateAfterSubmit from '../../util/useNavigateAfterSubmit';

const jwt = tokenService.getLocalAccessToken();

export default function VisitEditAdmin({ admin = true }) {
    const emptyItem = {
        id: '',
        datetime: '',
        description: '',
        vet: { user: {} },
        pet: {},
    };
    const petId = getIdFromUrl(2);
    const visitId = getIdFromUrl(4);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visit, setVisit] = useFetchState(emptyItem, `/api/v1/pets/${petId}/visits/${visitId}`, jwt, setMessage, setVisible, visitId);
    const pet = useFetchData(`/api/v1/pets/${petId}`, jwt, setMessage, setVisible);
    const vets = useFetchData(`/api/v1/vets`, jwt, setMessage, setVisible);
    const [redirect, setRedirect] = useState(false);
    useNavigateAfterSubmit(`/pets/${petId}/visits`, redirect);
    const navigate = useNavigate();

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

    const handleSubmit = async (event) => await submitState(event, visit, `/api/v1/pets/${petId}/visits`, setMessage, setVisible, setRedirect);
    const modal = useErrorModal(setVisible, visible, message);
    const vetOptions = vets.map(vet => <option key={vet.id} value={vet.id}>{vet.firstName} {vet.lastName} - {vet.user.username}</option>);

    const ownedVisit = tokenService.getUser().id === visit.vet.user?.id;
    let title;
    if (admin) title = <h2>{visit.id ? 'Edit Visit' : 'Add Visit'}</h2>
    else title = <h2>{ownedVisit ? 'Edit Visit' : 'Visit Details'}</h2>

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {title}
                {modal}
                <Form onSubmit={(e) => { (async () => { await handleSubmit(e); })(); }}>
                    <FormGroup>
                        <Label for="datetime">Date and Time</Label>
                        <Input type="datetime-local" required name="datetime" id="datetime" value={visit.datetime || ''}
                            onChange={handleChange} disabled={admin || ownedVisit ? false : true} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="textarea" name="description" id="description" value={visit.description || ''}
                            onChange={handleChange} disabled={admin || ownedVisit ? false : true} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="vet">Vet</Label>
                        <Input type="select" required name="vet" id="vet" value={visit.vet.id}
                            onChange={handleChange} disabled={!admin ? true : false}>
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
                        {admin || ownedVisit ? <Button className='save-button' type="submit">Save</Button> : <></>}{' '}
                        <Button className='back-button' onClick={() => navigate(-1)}>Back</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div >
    );
}
