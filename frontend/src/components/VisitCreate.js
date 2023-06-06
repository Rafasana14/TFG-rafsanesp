import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import tokenService from '../services/token.service';
import useErrorModal from '../util/useErrorModal';
import useFetchData from '../util/useFetchData';
import submitState from '../util/submitState';
import useNavigateAfterSubmit from '../util/useNavigateAfterSubmit';
import { getVetOptions } from '../owner/visits/VisitEditOwner';
import { useFetchProfileData } from '../util/useFetchProfile';

const jwt = tokenService.getLocalAccessToken();

export default function VisitCreate({ auth }) {
    const location = useLocation();
    let date;
    if (location.state) {
        date = new Date(location.state.datetime);
        const offset = date.getTimezoneOffset();
        date = new Date(date.getTime() - (offset * 60 * 1000))
    }
    const emptyItem = {
        id: '',
        datetime: date?.toISOString().split(".")[0] || '',
        description: '',
        vet: { user: {} },
        pet: {},
    };
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visit, setVisit] = useState(emptyItem);
    const pets = useFetchData(`/api/v1/pets/`, jwt, setMessage, setVisible);
    const profile = useFetchProfileData(auth, jwt, setMessage, setVisible);
    const vets = useFetchData('/api/v1/vets', jwt, setMessage, setMessage, auth === "OWNER");
    const [city, setCity] = useState();
    const [redirect, setRedirect] = useState(false);
    const url = auth === "OWNER" ? `/pets/${visit.pet.id}/visits` : '/visits';
    useNavigateAfterSubmit(url, redirect);
    const navigate = useNavigate();

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name === "pet") {
            const pet = pets.find((v) => v.id === Number(value));
            setVisit({ ...visit, pet: pet })
        } else if (name === "vet") {
            const vet = vets.find((v) => v.id === Number(value));
            setVisit({ ...visit, vet: vet })
        } else
            setVisit({ ...visit, [name]: value })
    }

    function handleCityChange(event) {
        const target = event.target;
        const value = target.value;
        setCity(value);

        const plan = profile.plan;
        if (plan === "BASIC") {
            const aux = vets.filter((vet) => vet.city === value);
            const randomIndex = Math.floor(Math.random() * aux.length);
            const vet = aux[randomIndex];
            setVisit({ ...visit, vet: vet });
        }
    }

    const handleSubmit = async (event) => {
        const aux = { ...visit, vet: profile };
        await submitState(event, aux, `/api/v1/pets/${aux.pet.id}/visits`, setMessage, setVisible, setRedirect);
    }
    const modal = useErrorModal(setVisible, visible, message);
    const petOptions = pets.map(pet => <option key={pet.id} value={pet.id}>{pet.name + (auth === "VET" ? " - " + pet.owner.user.username : "")}</option>);

    function getCitiesInput(cities) {
        let i = 0;
        return cities.map(city => {
            i++;
            return (<div key={city} className="form-check form-check-inline">
                <Input className="form-check-input" required type="radio" name="city" id={`city${i}`} value={city}
                    onChange={handleCityChange} ></Input>
                <Label className="form-check-label" for={`city${i}`}>{city}</Label>
            </div>)


        });
    }

    function getVetSelectionInput(plan) {
        if (plan !== "BASIC") {
            const vetsAux = vets.filter(vet => vet.city === city);
            const vetsOptions = getVetOptions(vetsAux);
            return <Input type="select" required name="vet" id="vet" value={visit.vet.id ? visit.vet.id : ''}
                onChange={handleChange} >
                <option value="">None</option>
                {vetsOptions}</Input>
        } else {
            return <Input type="text" disabled name="vet" id="vet" value={visit.vet.id ? (visit.vet.firstName + " " + visit.vet.lastName) : ''} />
        }

    }

    let cities = [];
    vets.forEach(vet => {
        if (!cities.includes(vet.city)) cities.push(vet.city);
    });
    const citiesOptions = getCitiesInput(cities);
    const vetSelection = getVetSelectionInput(profile.plan);

    const title = <h2 className='text-center'>Add Visit</h2>

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {title}
                {modal}
                <Form onSubmit={(e) => { (async () => { await handleSubmit(e); })(); }}>
                    <Row className='justify-content-center'>
                        <Col xs="10" sm="8" md="6" lg="4" xl="3">
                            <FormGroup>
                                <Label for="datetime">Date and Time</Label>
                                <Input type="datetime-local" required name="datetime" id="datetime" value={visit.datetime || ''}
                                    onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input type="textarea" name="description" id="description" value={visit.description || ''}
                                    onChange={handleChange} />
                            </FormGroup>
                            {auth === "OWNER" ?
                                <>
                                    <FormGroup>
                                        <Label for="city">Select City for the Visit</Label><br></br>
                                        {citiesOptions}
                                    </FormGroup>
                                    <FormGroup>
                                        {profile.plan === "BASIC" ? <Label for="vet">Vet (As you have BASIC Plan, Vet will be selected randomly from the ones in the city)</Label> :
                                            <Label for="vet">Vet</Label>}
                                        {vetSelection}
                                    </FormGroup>
                                </>
                                : <></>}
                            <FormGroup>
                                <Label for="pet">Pet</Label>
                                <Input type="select" required name="pet" id="pet" value={visit.pet.id || ''}
                                    onChange={handleChange} >
                                    <option value={""}>None</option>
                                    {petOptions}
                                </Input>
                            </FormGroup>
                            <FormGroup align="center">
                                <Button className='save-button' type="submit">Save</Button>{' '}
                                <Button className='back-button' onClick={() => navigate(-1)}>Back</Button>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div >
    );
}
