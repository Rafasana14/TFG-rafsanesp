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
    const auths = useFetchData(`/api/v1/users/authorities`, jwt, setMessage, setVisible);
    const [redirect, setRedirect] = useState();
    useNavigateAfterSubmit("/users", redirect);

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

    const handleSubmit = async (event) => await submitState(event, user, `/api/v1/users`, setMessage, setVisible, setRedirect);
    const modal = useErrorModal(setVisible, visible, message);
    const authOptions = Array.from(auths).map(auth => <option key={auth.id} value={auth.id}>{auth.authority}</option>);

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2 className='text-center'>{user.id ? 'Edit User' : 'Add User'}</h2>}
                {modal}
                <Form onSubmit={(e) => { (async () => { await handleSubmit(e); })(); }}>
                    <Row className='justify-content-center'>
                        <Col xs="10" sm="8" md="6" lg="4" xl="3">
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input type="text" name="username" id="username" value={user.username || ''}
                                    onChange={handleChange} required />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" aria-label='password' role='textbox' required name="password" id="password" value={user.password || ''}
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
                            <FormGroup align='center'>
                                <Button className='save-button' type="submit">Save</Button>{' '}
                                <Button className='back-button' tag={Link} to="/users">Cancel</Button>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div >
    );
}
