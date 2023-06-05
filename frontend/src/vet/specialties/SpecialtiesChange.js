import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import tokenService from '../../services/token.service';
import useErrorModal from '../../util/useErrorModal';
import useFetchData from '../../util/useFetchData';
import useFetchState from '../../util/useFetchState';
import submitProfile from '../../util/submitProfile';

const jwt = tokenService.getLocalAccessToken();

export default function SpecialtiesChange() {
    const emptyItem = {
        specialties: [],
    };
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [vet, setVet] = useFetchState(emptyItem, `/api/v1/vets/profile`, jwt, setMessage, setVisible);
    const specialties = useFetchData(`/api/v1/vets/specialties`, jwt, setMessage, setVisible);
    const navigate = useNavigate();

    function handleSpecialtyChange(event) {
        const target = event.target;
        const checked = target.checked;
        const name = target.name;
        if (checked) {
            setVet({ ...vet, specialties: [...vet.specialties, specialties.find(s => s.name === name)] });
        }
        else {
            setVet({ ...vet, specialties: vet.specialties.filter(s => s.name !== name) });
        }
    }

    const handleSubmit = async (event) => await submitProfile(event, vet, "VET", setMessage, setVisible, [alerts, setAlerts], true);
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

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {<h2 className='text-center'>Change Specialties</h2>}
                {alerts.map((a) => a.alert)}
                {modal}
                <Form data-testid="form" align="center" onSubmit={(e) => { (async () => { await handleSubmit(e); })(); }}>
                    <FormGroup>
                        <Label for="specialties" >Specialties</Label>
                        <Row style={{ justifyContent: "center" }} className="row-cols-lg-auto g-3 align-items-center">
                            {specialtiesBoxes}
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Button className='save-button' type="submit">Save</Button>{' '}
                        <Button className='back-button' onClick={() => navigate(-1)}>Back</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div >
    );
}
