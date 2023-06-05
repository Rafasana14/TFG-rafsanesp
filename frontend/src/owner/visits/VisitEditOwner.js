import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import tokenService from '../../services/token.service';
import useErrorModal from '../../util/useErrorModal';
import useFetchData from '../../util/useFetchData';
import getIdFromUrl from '../../util/getIdFromUrl';
import useFetchState from '../../util/useFetchState';
import submitState from '../../util/submitState';
import useNavigateAfterSubmit from '../../util/useNavigateAfterSubmit';

const jwt = tokenService.getLocalAccessToken();

export default function VisitEditOwner() {
    const emptyVisit = {
        id: '',
        datetime: '',
        description: '',
        pet: {},
        vet: {
            id: null,
            city: "",
        },
    };
    const petId = getIdFromUrl(2);
    const visitId = getIdFromUrl(4);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const vets = useFetchData(`/api/v1/vets`, jwt, setMessage, setVisible);
    const pet = useFetchData(`/api/v1/pets/${petId}`, jwt, setMessage, setVisible);
    const [visit, setVisit] = useFetchState(emptyVisit, `/api/v1/pets/${petId}/visits/${visitId}`, jwt, setMessage, setVisible, visitId);
    const [city, setCity] = useState();
    const plan = pet?.owner?.plan;
    const [redirect, setRedirect] = useState(false);
    useNavigateAfterSubmit(`/pets/${petId}/visits`, redirect);

    useEffect(() => {
        if (visit?.vet.city) {
            let ignore = false;
            if (!ignore)
                setCity(visit.vet.city);
            return () => {
                ignore = true;
            };
        }
    }, [visit]);

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name === "vet") {
            const vet = vets.find((v) => v.id === Number(value));
            setVisit({ ...visit, vet: vet })
        } else
            setVisit({ ...visit, [name]: value })
    }

    function handleCityChange(event) {
        const target = event.target;
        const value = target.value;
        setCity(value);

        const plan = pet.owner.plan;
        if (plan === "BASIC") {
            const aux = vets.filter((vet) => vet.city === value);
            const randomIndex = Math.floor(Math.random() * aux.length);
            const vet = aux[randomIndex];
            setVisit({ ...visit, vet: vet });
        }
    }

    const handleSubmit = async (event) => {
        setVisit({ ...visit, pet: pet });
        await submitState(event, visit, `/api/v1/pets/${petId}/visits`, setMessage, setVisible, setRedirect)
    };

    function getDateTimeInput(visit, datetime) {
        if (visit.id && datetime < Date.now()) {
            return <Input type="datetime-local" disabled name="datetime" id="datetime" value={visit.datetime || ''}
                onChange={handleChange} />
        } else {
            return <Input type="datetime-local" required name="datetime" id="datetime" value={visit.datetime || ''}
                onChange={handleChange} />
        }
    }

    function getCitiesInput(cities, visit, datetime) {
        let i = 0;
        return cities.map(city => {
            i++;
            if (visit.id && datetime < Date.now()) {
                if (visit.vet.city === city) {
                    return (<div key={city} className="form-check form-check-inline">
                        <Input className="form-check-input" readOnly type="radio" defaultChecked name="city" id={`city${i}`} value={city}
                            onChange={handleCityChange} ></Input>
                        <Label className="form-check-label" for={`city${i}`}>{city}</Label>
                    </div>)
                } else {
                    return (<div key={city} className="form-check form-check-inline">
                        <Input className="form-check-input" type="radio" disabled name="city" id={`city${i}`} value={city}
                            onChange={handleCityChange} ></Input>
                        <Label className="form-check-label" for={`city${i}`}>{city}</Label>
                    </div>)
                }
            } else {
                if (visit.vet.city === city) {
                    return (<div key={city} className="form-check form-check-inline">
                        <Input className="form-check-input" defaultChecked type="radio" name="city" id={`city${i}`} value={city}
                            onChange={handleCityChange}></Input>
                        <Label className="form-check-label" for={`city${i}`}>{city}</Label>
                    </div>)
                } else
                    return (<div key={city} className="form-check form-check-inline">
                        <Input className="form-check-input" required type="radio" name="city" id={`city${i}`} value={city}
                            onChange={handleCityChange} ></Input>
                        <Label className="form-check-label" for={`city${i}`}>{city}</Label>
                    </div>)
            }

        });
    }

    function getVetSelectionInput(datetime) {
        if (visit.id && datetime < Date.now()) {
            return <Input type="text" disabled name="vet" id="vet" value={visit.vet.id ? (visit.vet.firstName + " " + visit.vet.lastName) : ''} />
        } else {
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
    }

    function getVetOptions(vets) {
        return vets.map(vet => {
            let spAux = vet.specialties.map(s => s.name).toString().replace(",", ", ");
            return <option key={vet.id} value={vet.id}>{vet.firstName} {vet.lastName + " "}{spAux !== "" ? "- " + spAux : ""}</option>
        })
    }

    const datetime = new Date(visit.datetime);
    const datetimeInput = getDateTimeInput(visit, datetime);

    let cities = [];
    vets.forEach(vet => {
        if (!cities.includes(vet.city)) cities.push(vet.city);
    });
    const citiesOptions = getCitiesInput(cities, visit, datetime);
    const vetSelection = getVetSelectionInput(datetime);
    const modal = useErrorModal(setVisible, visible, message);

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2 className='text-center'>{visit.id ? 'Edit Visit' : 'Add Visit'}</h2>}
                {modal}
                <Row>
                    <Col sm="4"></Col>
                    <Col sm="4">
                        <Form onSubmit={(e) => { (async () => { await handleSubmit(e); })(); }}>
                            <FormGroup>
                                <Label for="datetime">Date and Time</Label>
                                {datetimeInput}
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input type="textarea" name="description" id="description" value={visit.description || ''}
                                    onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="city">Select City for the Visit</Label><br></br>
                                {citiesOptions}
                            </FormGroup>
                            <FormGroup>
                                {plan === "BASIC" ? <Label for="vet">Vet (As you have BASIC Plan, Vet will be selected randomly from the ones in the city)</Label> :
                                    <Label for="vet">Vet</Label>}
                                {vetSelection}
                            </FormGroup>
                            <FormGroup>
                                <Label for="pet">Pet</Label>
                                <Input type="text" disabled name="pet" id="pet" value={pet.name || ''} />
                            </FormGroup>
                            <FormGroup>
                                <Button className='save-button' type="submit">Save</Button>{' '}
                                <Button className='back-button' onClick={() => window.history.back()}>Back</Button>
                            </FormGroup>
                        </Form>
                    </Col>
                    <Col sm="4"></Col>
                </Row>
            </Container>
        </div >
    );
}
