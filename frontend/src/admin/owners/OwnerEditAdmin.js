import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import tokenService from '../../services/token.service';
import getErrorModal from '../../util/getErrorModal';
import useFetchState from '../../util/useFetchState';
import getIdFromUrl from '../../util/getIdFromUrl';

const jwt = tokenService.getLocalAccessToken();

export default function OwnerEditAdmin() {
    const emptyItem = {
        id: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        telephone: '',
        plan: null,
    };
    const id = getIdFromUrl(2);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [owner, setOwner] = useFetchState(emptyItem, `/api/v1/owners/${id}`, jwt, setMessage, setVisible, id);

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setOwner({ ...owner, [name]: value })
    }

    async function handleSubmit(event) {
        event.preventDefault();

        await (await fetch('/api/v1/owners' + (owner.id ? '/' + owner.id : ''), {
            method: (owner.id) ? 'PUT' : 'POST',
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(owner),
        })).json()
            .then(json => {
                if (json.message) {
                    setMessage(json.message);
                    setVisible(true);
                }
                else window.location.href = '/owners';
            }).catch((message) => alert(message));
    }

    const modal = getErrorModal(setVisible, visible, message);

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2>{id !== 'new' ? 'Edit Owner' : 'Add Owner'}</h2>}
                {modal}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="firstName">First Name</Label>
                        <Input type="text" required name="firstName" id="firstName" value={owner.firstName || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="lastName">Last Name</Label>
                        <Input type="text" required name="lastName" id="lastName" value={owner.lastName || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="address">Address</Label>
                        <Input type="text" required name="address" id="address" value={owner.address || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="city">City</Label>
                        <Input type="text" required name="city" id="city" value={owner.city || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="telephone">Telephone</Label>
                        <Input type="tel" required pattern="[0-9]{9}" name="telephone" id="telephone" value={owner.telephone || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="plan">Plan</Label>
                        <Input id="plan" name="plan" required type="select" value={owner.plan || ''} onChange={handleChange}>
                            <option value="">None</option>
                            <option value="BASIC">BASIC</option>
                            <option value="GOLD">GOLD</option>
                            <option value="PLATINUM">PLATINUM</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/owners">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    );
}
