import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import tokenService from '../../services/token.service';
import useErrorModal from '../../util/useErrorModal';
import useFetchState from '../../util/useFetchState';
import getIdFromUrl from '../../util/getIdFromUrl';
import submitState from '../../util/submitState';
import useNavigateAfterSubmit from '../../util/useNavigateAfterSubmit';

const jwt = tokenService.getLocalAccessToken();

export default function OwnerEditAdmin({ admin = true }) {
    const emptyItem = {
        id: null,
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
    const [redirect, setRedirect] = useState(false);
    useNavigateAfterSubmit("/owners", redirect);

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setOwner({ ...owner, [name]: value })
    }

    const handleSubmit = async (event) => await submitState(event, owner, `/api/v1/owners`, setMessage, setVisible, setRedirect);

    const modal = useErrorModal(setVisible, visible, message);

    let title;
    if (admin) title = <h2>{owner.id ? 'Edit Owner' : 'Add Owner'}</h2>
    else title = <h2>{'Owner Details'}</h2>

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {title}
                {modal}
                <Form onSubmit={(e) => { (async () => { await handleSubmit(e); })(); }}>
                    <FormGroup>
                        <Label for="firstName">First Name</Label>
                        <Input type="text" required name="firstName" id="firstName" value={owner.firstName || ''}
                            onChange={handleChange} disabled={!admin} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="lastName">Last Name</Label>
                        <Input type="text" required name="lastName" id="lastName" value={owner.lastName || ''}
                            onChange={handleChange} disabled={!admin} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="address">Address</Label>
                        <Input type="text" required name="address" id="address" value={owner.address || ''}
                            onChange={handleChange} disabled={!admin} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="city">City</Label>
                        <Input type="text" required name="city" id="city" value={owner.city || ''}
                            onChange={handleChange} disabled={!admin} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="telephone">Telephone</Label>
                        <Input type="tel" required pattern="[0-9]{9}" name="telephone" id="telephone" value={owner.telephone || ''}
                            onChange={handleChange} disabled={!admin} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="plan">Plan</Label>
                        <Input id="plan" name="plan" required type="select" value={owner.plan || ''} onChange={handleChange} disabled={!admin}>
                            <option value="">None</option>
                            <option value="BASIC">BASIC</option>
                            <option value="GOLD">GOLD</option>
                            <option value="PLATINUM">PLATINUM</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        {admin ? <Button className='save-button' type="submit">Save</Button> : <></>}
                        {admin ? ' ' : <></>}
                        <Button className='back-button' tag={Link} to="/owners">Back</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    );
}
