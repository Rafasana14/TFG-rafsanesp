import { useState } from 'react';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import tokenService from '../services/token.service';
import useErrorModal from '../util/useErrorModal';
import useFetchProfile from '../util/useFetchProfile';
import submitProfile from '../util/submitProfile';
import { useNavigate } from 'react-router-dom';

const jwt = tokenService.getLocalAccessToken();

export default function ProfileEdit({ auth }) {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [profile, setProfile] = useFetchProfile(auth, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    }

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (auth !== "ADMIN") {
            if (name === "username" || name === "password") setProfile({ ...profile, user: { ...profile.user, [name]: value } });
            else setProfile({ ...profile, [name]: value })
        }
        else setProfile({ ...profile, [name]: value })
    }

    const handleSubmit = async (event) => await submitProfile(event, profile, auth, setMessage, setVisible, [alerts, setAlerts]);

    function getProfileForm() {
        if (auth === "ADMIN") {
            return <Form onSubmit={(e) => { (async () => { await handleSubmit(e); })(); }}>
                <Row className='justify-content-center'>
                    <Col lg='3' md='4' sm='8' xs='12'>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input type="text" required name="username" id="username" value={profile.username || ''}
                                onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input type="password" role='textbox' required name="password" id="password" value={profile.password || ''}
                                onChange={handleChange} />
                        </FormGroup>
                    </Col>
                </Row>
                <br></br>
                <Row >
                    <Col align='center'>
                        <FormGroup>
                            <Button className='save-button' type="submit">Save</Button>{' '}
                            <Button className='back-button' onClick={goBack}>Back</Button>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        } else {
            return <Form onSubmit={(e) => { (async () => { await handleSubmit(e); })(); }}>
                <Row className='justify-content-center'>
                    <Col lg='3' md='4' sm='8' xs='12'>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input type="text" required name="username" id="username" value={profile.user?.username || ''}
                                onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input type="password" role='textbox' required name="password" id="password" value={profile.user?.password || ''}
                                onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="firstName">First Name</Label>
                            <Input type="text" required name="firstName" id="firstName" value={profile.firstName || ''}
                                onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="lastName">Last Name</Label>
                            <Input type="text" required name="lastName" id="lastName" value={profile.lastName || ''}
                                onChange={handleChange} />
                        </FormGroup>
                        {auth === "VET" ?
                            <FormGroup>
                                <Label for="city">City</Label>
                                <Input type="text" required name="city" id="city" value={profile.city || ''}
                                    onChange={handleChange} />
                            </FormGroup> : <></>
                        }
                    </Col>
                    {auth === "OWNER" ?
                        <Col lg='3' md='4' sm='8' xs='12'>
                            <FormGroup>
                                <Label for="city">City</Label>
                                <Input type="text" required name="city" id="city" value={profile.city || ''}
                                    onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="address">Address</Label>
                                <Input type="text" required name="address" id="address" value={profile.address || ''}
                                    onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="telephone">Telephone</Label>
                                <Input type="tel" required pattern="[0-9]{9}" name="telephone" id="telephone" value={profile.telephone || ''}
                                    onChange={handleChange} />
                            </FormGroup>
                        </Col>
                        : <></>
                    }
                </Row>
                <br></br>
                <Row >
                    <Col align='center'>
                        <FormGroup>
                            <Button className='save-button' type="submit">Save</Button>{' '}
                            <Button className='back-button' onClick={goBack}>Back</Button>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        }
    }

    const modal = useErrorModal(setVisible, visible, message);
    const form = getProfileForm();
    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {modal}
                <h2 className="text-center">My Profile</h2>
                {alerts.map((a) => a.alert)}
                {form}
            </Container>
        </div>
    );
}
