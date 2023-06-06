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
import { getUserCreateForm, submitUserState } from '../../util/createUserFromForm';
import { getUserCreateRadio } from '../owners/OwnerEditAdmin';

const jwt = tokenService.getLocalAccessToken();

export default function VetEditAdmin() {
    const emptyItem = {
        id: '',
        firstName: '',
        lastName: '',
        city: '',
        specialties: [],
        user: {},
    };
    const id = getIdFromUrl(2);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [vet, setVet] = useFetchState(emptyItem, `/api/v1/vets/${id}`, jwt, setMessage, setVisible, id);
    const [user, setUser] = useState({
        create: "",
        authority: {
            id: 3,
            authority: "VET"
        }
    });
    const specialties = useFetchData(`/api/v1/vets/specialties`, jwt, setMessage, setVisible);
    const users = useFetchData(`/api/v1/users`, jwt, setMessage, setVisible);
    const [redirect, setRedirect] = useState(false);
    useNavigateAfterSubmit("/vets", redirect);
    const navigate = useNavigate();

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name === "user") {
            const user = users.find((u) => u.id === Number(value));
            setVet({ ...vet, user: user })
        } else
            setVet({ ...vet, [name]: value })
    }

    function handleUserChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setUser({ ...user, [name]: value })
    }

    function handleSpecialtyChange(event) {
        const target = event.target;
        const checked = target.checked;
        const name = target.name;
        if (checked) {
            setVet({ ...vet, specialties: [...vet.specialties, specialties.find(s => s.name === name)] });
        }
        else
            setVet({ ...vet, specialties: vet.specialties.filter(s => s.name !== name) });
    }

    const handleSubmit = async (event) => {
        if (user.create === "yes") {
            await submitUserState(event, user, vet, `/api/v1/vets`, setMessage, setVisible, setRedirect);
        } else {
            await submitState(event, vet, `/api/v1/vets`, setMessage, setVisible, setRedirect);
        }
    }
    const modal = useErrorModal(setVisible, visible, message);
    const selectedSpecialties = vet.specialties.map(specialty => specialty.name);
    const specialtiesBoxes = specialties.map(specialty => {
        if (selectedSpecialties?.includes(specialty.name)) {
            return (<FormGroup key={specialty.name}>
                <Input aria-labelledby={"label-" + specialty.name} type="checkbox" name={specialty.name} onChange={handleSpecialtyChange} checked />
                <Label id={"label-" + specialty.name} for={specialty.name}> {specialty.name}</Label>
            </FormGroup>);
        } else {
            return (<FormGroup key={specialty.name}>
                <Input aria-labelledby={"label-" + specialty.name} type="checkbox" key={specialty.name} name={specialty.name} onChange={handleSpecialtyChange} />
                <Label id={"label-" + specialty.name} for={specialty.name}> {specialty.name}</Label>
            </FormGroup>);
        }
    });
    const userOptions = users.filter((i) => i.authority.authority !== "OWNER").map(user => <option key={user.id} value={user.id}>{user.username}</option>);
    const userForm = getUserCreateForm(vet, user, handleChange, handleUserChange, userOptions);

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2 className='text-center'>{vet.id ? 'Edit Vet' : 'Add Vet'}</h2>}
                {modal}
                <Form onSubmit={(e) => { (async () => { await handleSubmit(e); })(); }}>
                    <Row className='justify-content-center'>
                        <Col xs="10" sm="8" md="6" lg="4" xl="3">
                            <FormGroup>
                                <Label for="firstName">First Name</Label>
                                <Input required type="text" name="firstName" id="firstName" value={vet.firstName || ''}
                                    onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="lastName">Last Name</Label>
                                <Input required type="text" name="lastName" id="lastName" value={vet.lastName || ''}
                                    onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="city">City</Label>
                                <Input required type="text" name="city" id="city" value={vet.city || ''}
                                    onChange={handleChange} />
                            </FormGroup>
                            <Label for="specialties">Specialties</Label>
                            <Row className="row-cols-auto g-3 align-items-center">
                                {specialtiesBoxes}
                            </Row>
                            <FormGroup>
                                {!vet.id ?
                                    getUserCreateRadio(handleUserChange, "Vet")
                                    : <></>}
                                {userForm}
                            </FormGroup>
                            <Row>
                                <FormGroup align="center">
                                    <Button className='save-button' type="submit">Save</Button>{' '}
                                    <Button className='back-button' onClick={() => navigate(-1)}>Back</Button>
                                </FormGroup>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div >
    );
}
