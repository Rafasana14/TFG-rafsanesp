import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import tokenService from '../../services/token.service';
import getErrorModal from '../../util/getErrorModal';
import useFetchData from '../../util/useFetchData';
import getIdFromUrl from '../../util/getIdFromUrl';
import useFetchState from '../../util/useFetchState';
import submitState from '../../util/submitState';
import useNavigateAfterSubmit from '../../util/useNavigateAfterSubmit';

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
    const specialties = useFetchData(`/api/v1/vets/specialties`, jwt);
    const users = useFetchData(`/api/v1/users`, jwt);
    const [redirect, setRedirect] = useState(false);
    useNavigateAfterSubmit("/vets", redirect);

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

    const handleSubmit = async (event) => await submitState(event, vet, `/api/v1/vets`, setMessage, setVisible, setRedirect);
    const modal = getErrorModal(setVisible, visible, message);
    const selectedSpecialties = vet.specialties.map(specialty => specialty.name);
    const specialtiesBoxes = specialties.map(specialty => {
        if (selectedSpecialties?.includes(specialty.name)) {
            return (<FormGroup key={specialty.name}>
                <Input type="checkbox" name={specialty.name} onChange={handleSpecialtyChange} checked />
                <Label for={specialty.name}> {specialty.name}</Label>
            </FormGroup>);
        } else {
            return (<FormGroup key={specialty.name}>
                <Input type="checkbox" key={specialty.name} name={specialty.name} onChange={handleSpecialtyChange} />
                <Label for={specialty.name}> {specialty.name}</Label>
            </FormGroup>);
        }
    });
    const userOptions = users.map(user => <option key={user.id} value={user.id}>{user.username}</option>);

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2>{vet.id ? 'Edit Vet' : 'Add Vet'}</h2>}
                {modal}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="firstName">First Name</Label>
                        <Input type="text" name="firstName" id="firstName" value={vet.firstName || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="lastName">Last Name</Label>
                        <Input type="text" name="lastName" id="lastName" value={vet.lastName || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="city">City</Label>
                        <Input type="text" name="city" id="city" value={vet.city || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <Label for="specialties">Specialties</Label>
                    <Row className="row-cols-lg-auto g-3 align-items-center">
                        {specialtiesBoxes}
                    </Row>
                    <FormGroup>
                        <Label for="user">User</Label>
                        {vet.id ?
                            <Input type="select" disabled name="user" id="user" value={vet.user?.id || ""}
                                onChange={handleChange} >
                                <option value="">None</option>
                                {userOptions}
                            </Input> :
                            <Input type="select" required name="user" id="user" value={vet.user?.id || ""}
                                onChange={handleChange} >
                                <option value="">None</option>
                                {userOptions}
                            </Input>
                        }
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/vets">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div >
    );
}
