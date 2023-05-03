import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import tokenService from '../../services/token.service';
import getErrorModal from '../../util/getErrorModal';
import useFetchData from '../../util/useFetchData';
import useFetchState from '../../util/useFetchState';
import getIdFromUrl from '../../util/getIdFromUrl';

const jwt = tokenService.getLocalAccessToken();

export default function UserEditAdmin() {
    const emptyItem = {
        id: null,
        username: '',
        password: '',
        authority: null,
    };
    const id = getIdFromUrl(2);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [user, setUser] = useFetchState(emptyItem, `/api/v1/users/${id}`, jwt, setMessage, setVisible, id);
    const auths = useFetchData(`/api/v1/users/authorities`, jwt);

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name === "authority") {
            const auth = auths.find((a) => a.id === Number(value));
            setUser({ ...user, authority: auth })
        } else
            setUser({ ...user, [name]: value })
    }

    async function handleSubmit(event) {
        event.preventDefault();

        await (await fetch('/api/v1/users' + (user.id ? '/' + user.id : ''), {
            method: (user.id) ? 'PUT' : 'POST',
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        })).json()
            .then(json => {
                if (json.message) {
                    setMessage(json.message);
                    setVisible(true);
                }
                else window.location.href = '/users';
            }).catch((message) => alert(message));
    }


    const modal = getErrorModal(setVisible, visible, message);
    const authOptions = auths.map(auth => <option key={auth.id} value={auth.id}>{auth.authority}</option>);

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2>{user.id ? 'Edit User' : 'Add User'}</h2>}
                {modal}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input type="text" required name="username" id="username" value={user.username || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="lastName">Password</Label>
                        <Input type="password" required name="password" id="password" value={user.password || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <Label for="authority">Authority</Label>
                    <FormGroup>
                        {user.id ?
                            <Input type="select" disabled name="authority" id="authority" value={user.authority?.id || ''}
                                onChange={handleChange} >
                                <option value="">None</option>
                                {authOptions}
                            </Input> :
                            <Input type="select" required name="authority" id="authority" value={user.authority?.id || ''}
                                onChange={handleChange} >
                                <option value="">None</option>
                                {authOptions}
                            </Input>}
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/users">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div >
    );
}
