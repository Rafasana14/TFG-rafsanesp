import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, ButtonGroup, Container, Table } from 'reactstrap';
import tokenService from '../../services/token.service';

const jwt = tokenService.getLocalAccessToken();

export default function PetListAdmin() {
    const [pets, setPets] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        let ignore = false;
        fetch(`/api/v1/pets`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
            },
        })
            .then(response => response.json())
            .then(json => {
                if (!ignore) {
                    setPets(json);
                }
            });
        return () => {
            ignore = true;
        };
    }, []);

    async function remove(id) {
        let confirmMessage = window.confirm("Are you sure you want to delete it?");
        if (confirmMessage) {
            await fetch(`/api/v1/pets/${id}`, {
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
                const alertId = `alert-${id}`
                setAlerts([
                    ...alerts,
                    {
                        alert: <Alert toggle={() => dismiss(alertId)} key={"alert-" + id} id={alertId} color="info">
                            {json.message}
                        </Alert>,
                        id: alertId
                    }
                ]);
            });
        }
    }

    function dismiss(id) {
        setAlerts(alerts.filter(i => i.id !== id))
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

    return (
        <div>
            <Container style={{ marginTop: "15px" }} fluid>
                <h1 className="text-center">Pets</h1>
                {alerts.map((a) => a.alert)}
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
