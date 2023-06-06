import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
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
    const vet = useFetchData(`/api/v1/vets/profile`, jwt, setMessage, setVisible, !admin);
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

    const handleSubmit = async (event) => {
        const aux = admin ? visit : { ...visit, vet: vet };
        await submitState(event, aux, `/api/v1/pets/${petId}/visits`, setMessage, setVisible, setRedirect);
    }
    const modal = useErrorModal(setVisible, visible, message);
    const vetOptions = vets.map(vet => <option key={vet.id} value={vet.id}>{vet.firstName} {vet.lastName} - {vet.user.username}</option>);

    const ownedVisit = vet?.id === visit.vet.id || !visit.vet.id;
    console.log("VET ID" + vet.id);
    console.log("VISIT VET ID" + vet.id);
    let title;
    if (admin || ownedVisit) title = <h2 className='text-center'>{visit.id ? 'Edit Visit' : 'Add Visit'}</h2>
    else title = <h2 className='text-center'>Visit Details</h2>

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {title}
                {modal}
                <Form onSubmit={(e) => { (async () => { await handleSubmit(e); })(); }}>
                    <Row className='justify-content-center'>
                        <Col xs="10" sm="8" md="6" lg="4" xl="3">
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
                                <Input type="select" required name="vet" id="vet" value={visit.vet.id || vet.id}
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
                            <FormGroup align="center">
                                {admin || ownedVisit ? <Button className='save-button' type="submit">Save</Button> : <></>}{' '}
                                <Button className='back-button' onClick={() => navigate(-1)}>Back</Button>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div >
    );
}
