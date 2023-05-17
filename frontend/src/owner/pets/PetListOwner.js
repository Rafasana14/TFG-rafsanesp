import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Card, CardBody, CardFooter, CardTitle, Col, Container, ListGroup, ListGroupItem, Row, Table } from 'reactstrap';
import tokenService from '../../services/token.service';
import useFetchState from '../../util/useFetchState';
import getErrorModal from '../../util/getErrorModal';
import deleteFromList from '../../util/deleteFromList';

const jwt = tokenService.getLocalAccessToken();

export default function PetListOwner() {
    const user = tokenService.getUser();
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [pets, setPets] = useFetchState([], `/api/v1/pets?userId=${user.id}`, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);
    const [visits, setVisits] = useFetchState([], `/api/v1/visits`, jwt, setMessage, setVisible);

    const removeVisit = (petId, visitId) => deleteFromList(`/api/v1/pets/${petId}/visits/${visitId}`, visitId, [visits, setVisits], [alerts, setAlerts], setMessage, setVisible);

    const modal = getErrorModal(setVisible, visible, message);

    const petList = pets.map((pet) => {
        const petVisits = visits.filter(i => i.pet.id === pet.id && new Date(i.datetime) > new Date());
        let tableBody = (
            <tr className="table-info" >
                <td colSpan={3} width={"100%"}>There are no future visits for this pet. Check History if you want to see past visits.</td>
            </tr >
        );

        if (petVisits && Array.from(petVisits).length > 0) {
            tableBody = petVisits.map((visit) => {
                const datetime = new Date(visit.datetime);
                return (
                    <tr className="table-info" key={visit["id"]}>
                        <td>{datetime.toLocaleString()}</td>
                        <td>{visit.vet.firstName} {visit.vet.lastName}</td>
                        <td>
                            <ButtonGroup>
                                <Button aria-label={`edit-visit-${visit.id}`} size="sm" color="primary" tag={Link}
                                    to={`/pets/${pet.id}/visits/${visit.id}`}>
                                    Edit
                                </Button>
                                <Button aria-label={`cancel-visit-${visit.id}`} size="sm" color="danger"
                                    onClick={() => removeVisit(pet.id, visit.id)}>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                        </td>
                    </tr>)
            });
        }

        const visitTable = (
            <Table key={pet.id} aria-label={`visits-${pet.id}`} style={{ maxWidth: "600px", minWidth: "290px" }} className="mt-3 table-primary" hover striped>
                <thead>
                    <tr>
                        <th >Next Visits</th>
                        <th colSpan={2} style={{ textAlign: "end" }}>
                            <ButtonGroup className='justify-content-end'>
                                <Button color="success" tag={Link} to={`/pets/${pet.id}/visits/new`}>
                                    Add Visit
                                </Button>
                                <Button color="info" tag={Link} to={`/pets/${pet.id}/visits`}>
                                    History
                                </Button>
                            </ButtonGroup>
                        </th>
                    </tr>
                    {petVisits && Array.from(petVisits).length > 0 ?
                        <tr>
                            <th>Date and Time</th>
                            <th>Vet</th>
                            <th>Actions</th>
                        </tr> :
                        <></>
                    }
                </thead>
                <tbody>{tableBody}</tbody>
            </Table>);


        const removePet = (id) => deleteFromList(`/api/v1/pets/${id}`, id, [pets, setPets], [alerts, setAlerts], setMessage, setVisible);

        return (
            <div key={pet.id} >
                <Row >
                    <Col md="0" xs="0" lg="2"></Col>
                    <Col>
                        <Card className="pet-card" style={{ maxWidth: '16rem', minWidth: '16rem' }}>
                            <CardBody>
                                <CardTitle tag="h5">
                                    {pet.name}
                                </CardTitle>
                                <ListGroup flush>
                                    <ListGroupItem>
                                        Date of birth: {pet.birthDate}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Type: {pet.type.name}
                                    </ListGroupItem>
                                </ListGroup>
                            </CardBody>
                            <CardFooter>
                                <ButtonGroup>
                                    <Button aria-label={`edit-pet-${pet.id}`} size="sm" color="primary" tag={Link} to={"/pets/" + pet.id}>
                                        Edit
                                    </Button>
                                    <Button aria-label={`delete-pet-${pet.id}`} size="sm" color="danger" onClick={() => removePet(pet.id)}>
                                        Delete
                                    </Button>
                                </ButtonGroup>
                            </CardFooter>
                        </Card>
                    </Col>
                    <Col >
                        {visitTable}
                    </Col>
                    <Col md="0" xs="0" lg="2"></Col>
                </Row>
                <div className="mb-4">
                    <hr className="solid" />
                </div>
            </div>
        );
    });

    return (
        <div>
            < Container fluid style={{ marginTop: "20px" }}>
                <h1 className="text-center">Pets</h1>
                {alerts.map((a) => a.alert)}
                {modal}
                <Button color="success" tag={Link} to="/pets/new">
                    Add Pet
                </Button><br></br><br></br>
                {petList}
            </Container >
        </div >
    );
}
