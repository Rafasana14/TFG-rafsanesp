import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import tokenService from '../../services/token.service';
import useErrorModal from '../../util/useErrorModal';
import useFetchData from '../../util/useFetchData';
import useFetchState from '../../util/useFetchState';
import getIdFromUrl from '../../util/getIdFromUrl';
import submitState from '../../util/submitState';
import useNavigateAfterSubmit from '../../util/useNavigateAfterSubmit';

const jwt = tokenService.getLocalAccessToken();

export default function PetEditOwner() {
    const emptyItem = {
        id: null,
        name: '',
        birthDate: '',
        type: null,
        owner: null,
    };
    const id = getIdFromUrl(2);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [pet, setPet] = useFetchState(emptyItem, `/api/v1/pets/${id}`, jwt, setMessage, setVisible, id);
    const types = useFetchData(`/api/v1/pets/types`, jwt, setMessage, setVisible);
    const [redirect, setRedirect] = useState(false);
    useNavigateAfterSubmit("/pets", redirect);

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name === "type") {
            const type = types.find((type) => type.id === Number(value));
            setPet({ ...pet, type: type })
        }
        else
            setPet({ ...pet, [name]: value })
    }

    const handleSubmit = async (event) => await submitState(event, pet, `/api/v1/pets`, setMessage, setVisible, setRedirect);

    const modal = useErrorModal(setVisible, visible, message);
    const typeOptions = Array.from(types).map(type => <option key={type.id} value={type.id}>{type.name}</option>);

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2 className='text-center'>{pet.id ? 'Edit Pet' : 'Add Pet'}</h2>}
                {modal}
                <Row className='justify-content-center'>
                    <Col xs="10" sm="8" md="6" lg="4" xl="3">
                        <Form onSubmit={(e) => { (async () => { await handleSubmit(e); })(); }}>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input type="text" required name="name" id="name" value={pet.name || ''}
                                    onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="birthDate">Birth Date</Label>
                                <Input type="date" name="birthDate" id="birthDate" value={pet.birthDate || ''}
                                    onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="type">Type</Label>
                                <Input type="select" required name="type" id="type" value={pet.type?.id}
                                    onChange={handleChange}>
                                    <option value="">None</option>
                                    {typeOptions}
                                </Input>
                            </FormGroup>
                            <FormGroup align="center">
                                <Button className='save-button' type="submit">Save</Button>{' '}
                                <Button className='back-button' tag={Link} to="/pets">Cancel</Button>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
