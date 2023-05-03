import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import tokenService from '../../services/token.service';
import getErrorModal from '../../util/getErrorModal';
import useFetchData from '../../util/useFetchData';
import useFetchState from '../../util/useFetchState';
import getIdFromUrl from '../../util/getIdFromUrl';

const jwt = tokenService.getLocalAccessToken();

export default function PetEditAdmin() {
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
    const types = useFetchData(`/api/v1/pets/types`, jwt);
    const owners = useFetchData(`/api/v1/owners`, jwt);

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name === "type") {
            const type = types.find((type) => type.id === Number(value));
            setPet({ ...pet, type: type })
        } else if (name === "owner") {
            const owner = owners.find((owner) => owner.id === Number(value));
            setPet({ ...pet, owner: owner })
        }
        else
            setPet({ ...pet, [name]: value })
    }

    async function handleSubmit(event) {
        event.preventDefault();

        await (await fetch('/api/v1/pets' + (pet.id ? '/' + pet.id : ''), {
            method: (pet.id) ? 'PUT' : 'POST',
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pet),
        })).json()
            .then(json => {
                if (json.message) {
                    setMessage(json.message);
                    setVisible(true);
                }
                else window.location.href = '/pets';
            }).catch((message) => alert(message));
    }

    const modal = getErrorModal(setVisible, visible, message);
    const typeOptions = types.map(type => <option key={type.id} value={type.id}>{type.name}</option>);
    const ownerOptions = owners.map(owner => <option key={owner.id} value={owner.id}>{owner.user.username}</option>);

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2>{pet.id ? 'Edit Pet' : 'Add Pet'}</h2>}
                {modal}
                <Form onSubmit={handleSubmit}>
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
                    <FormGroup>
                        <Label for="owner">Owner</Label>
                        {pet.id ?
                            <Input type="select" disabled name="owner" id="owner" value={pet.owner?.id || ""}
                                onChange={handleChange} >
                                <option value="">None</option>
                                {ownerOptions}
                            </Input> :
                            <Input type="select" required name="owner" id="owner" value={pet.owner?.id || ""}
                                onChange={handleChange} >
                                <option value="">None</option>
                                {ownerOptions}
                            </Input>}
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/pets">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    );
}
