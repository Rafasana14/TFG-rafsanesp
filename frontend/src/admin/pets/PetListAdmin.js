import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import tokenService from '../../services/token.service';
import useFetchState from '../../util/useFetchState';
import getErrorModal from '../../util/getErrorModal';
import getDeleteAlertsOrModal from '../../util/getDeleteAlertsOrModal';

const jwt = tokenService.getLocalAccessToken();

export default function PetListAdmin() {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [pets, setPets] = useFetchState([], `/api/v1/pets`, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);

    function remove(id) {
        let confirmMessage = window.confirm("Are you sure you want to delete it?");
        if (confirmMessage) {
            fetch(`/api/v1/pets/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.status === 200) {
                    setPets(pets.filter((i) => i.id !== id));
                }
                return response.json();
            }).then(json => {
                getDeleteAlertsOrModal(json, id, alerts, setAlerts, setMessage, setVisible);
            }).catch((message) => alert(message));
        }
    }

    const petList = pets.map((pet) => {
        return (
            <tr key={pet.id}>
                <td>{pet.name}</td>
                <td>{pet.birthDate}</td>
                <td>{pet.type?.name}</td>
                <td>{pet.owner.user.username}</td>
                <td>
                    <Button size="sm" color="info" tag={Link}
                        to={`/pets/${pet.id}/visits`}>
                        Visits
                    </Button>
                </td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link}
                            to={"/pets/" + pet.id}>
                            Edit
                        </Button>
                        <Button size="sm" color="danger" onClick={() => remove(pet.id)}>
                            Delete
                        </Button>
                    </ButtonGroup>
                </td>
            </tr>
        );
    });
    const modal = getErrorModal(setVisible, visible, message);

    return (
        <div>
            <Container style={{ marginTop: "15px" }} fluid>
                <h1 className="text-center">Pets</h1>
                {alerts.map((a) => a.alert)}
                {modal}
                <Button color="success" tag={Link} to="/pets/new">
                    Add Pet
                </Button>
                <Table className="mt-4">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Birth Date</th>
                            <th>Type</th>
                            <th>Owner</th>
                            <th>Visits</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{petList}</tbody>
                </Table>
            </Container>
        </div>
    );
}
