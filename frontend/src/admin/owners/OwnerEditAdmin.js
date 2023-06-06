import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import tokenService from '../../services/token.service';
import useErrorModal from '../../util/useErrorModal';
import useFetchState from '../../util/useFetchState';
import getIdFromUrl from '../../util/getIdFromUrl';
import submitState from '../../util/submitState';
import useNavigateAfterSubmit from '../../util/useNavigateAfterSubmit';
import { getUserCreateForm, submitUserState } from '../../util/createUserFromForm';
import useFetchData from '../../util/useFetchData';

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
    const users = useFetchData(`/api/v1/users`, jwt, setMessage, setVisible, admin);
    const [user, setUser] = useState({
        create: "",
        authority: {
            id: 2,
            authority: "OWNER"
        }
    });
    const [redirect, setRedirect] = useState(false);
    useNavigateAfterSubmit("/owners", redirect);

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name === "user") {
            const user = users.find((u) => u.id === Number(value));
            setOwner({ ...owner, user: user })
        }
        else setOwner({ ...owner, [name]: value })
    }

    function handleUserChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setUser({ ...user, [name]: value })
    }

    const handleSubmit = async (event) => {
        if (user.create === "yes") {
            await submitUserState(event, user, owner, `/api/v1/owners`, setMessage, setVisible, setRedirect);
        } else {
            await submitState(event, owner, `/api/v1/owners`, setMessage, setVisible, setRedirect);
        }
    }

    const modal = useErrorModal(setVisible, visible, message);

    let title;
    if (admin) title = <h2 className='text-center'>{owner.id ? 'Edit Owner' : 'Add Owner'}</h2>
    else title = <h2 className='text-center'>{'Owner Details'}</h2>

    const userOptions = users.filter((i) => i.authority.authority !== "VET").map(user => <option key={user.id} value={user.id}>{user.username}</option>);
    const userForm = admin ? getUserCreateForm(owner, user, handleChange, handleUserChange, userOptions) : <></>;

    const telephoneCityInput = <>
        <FormGroup>
            <Label for="city">City</Label>
            <Input type="text" required name="city" id="city" value={owner.city || ''}
                onChange={handleChange} disabled={!admin} />
        </FormGroup>
        <FormGroup>
            <Label for="telephone">Telephone</Label>
            <Input type="tel" required placeholder="9 numbers" pattern="[0-9]{9}" name="telephone" id="telephone" value={owner.telephone || ''}
                onChange={handleChange} disabled={!admin} />
        </FormGroup>
    </>;

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {title}
                {modal}
                <Form onSubmit={(e) => { (async () => { await handleSubmit(e); })(); }}>
                    <Row className='justify-content-center'>
                        <Col xs="10" sm="8" md="6" lg="4" xl="3">
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
                            {admin ?
                                telephoneCityInput
                                : <></>}
                        </Col>
                        <Col xs="10" sm="8" md="6" lg="4" xl="3">
                            {!admin ?
                                telephoneCityInput
                                : <></>}
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
                                {!owner.id ?
                                    getUserCreateRadio(handleUserChange, "Owner")
                                    : <></>}
                                {userForm}
                            </FormGroup>
                        </Col>

                        <Row>
                            <FormGroup align='center'>
                                {admin ? <Button className='save-button' type="submit">Save</Button> : <></>}
                                {' '}
                                <Button className='back-button' tag={Link} to="/owners">Back</Button>
                            </FormGroup>
                        </Row>
                    </Row>
                </Form>
            </Container>
        </div >
    );
}

export function getUserCreateRadio(handleUserChange, type) {
    return <FormGroup tag="fieldset">
        <Label>
            Do you want to create a new user for this {type}?
        </Label>
        <Row>
            <Col>
                <FormGroup check>
                    <Input aria-label='yes' required name="create" type="radio" value="yes" onChange={handleUserChange} />
                    {' '}
                    <Label check>
                        Yes
                    </Label>
                </FormGroup>
            </Col>
            <Col>
                <FormGroup check>
                    <Input aria-label='no' required name="create" type="radio" value="no" onChange={handleUserChange} />
                    {' '}
                    <Label check>
                        No
                    </Label>
                </FormGroup>
            </Col>
        </Row>
    </FormGroup>
}
