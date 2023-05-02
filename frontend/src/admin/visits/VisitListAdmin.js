import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, ButtonGroup, Container, Table } from 'reactstrap';
import tokenService from '../../services/token.service';
import getErrorModal from '../../util/getErrorModal';

const jwt = tokenService.getLocalAccessToken();

export default function VisitListAdmin() {
    const [visits, setVisits] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const pathArray = window.location.pathname.split('/');
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const petId = pathArray[2];

    useEffect(() => {
        let ignore = false;
        fetch(`/api/v1/pets/${petId}/visits`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
            },
        })
            .then(response => response.json())
            .then(json => {
                if (!ignore) {
                    if (json.message) {
                        setMessage(json.message);
                        setVisible(true);
                    }
                    else setVisits(json);
                }
            });
        return () => {
            ignore = true;
        };
    }, [petId]);

    async function remove(id) {
        let confirmMessage = window.confirm("Are you sure you want to delete it?");
        if (confirmMessage) {
            await fetch(`/api/v1/pets/${petId}/visits/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.status === 200) {
                    setVisits(visits.filter((i) => i.id !== id));
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

    function handleVisible() {
        setVisible(!visible);
    }

    const modal = getErrorModal({ handleVisible }, visible, message);
    const visitList = visits.map((visit) => {
        return (
            <tr key={visit.id}>
                <td>{(new Date(visit.datetime)).toLocaleString()}</td>
                <td>{visit.description ? visit.description : "No description provided"}</td>
                <td>{visit.vet.firstName} {visit.vet.lastName}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link}
                            to={`/pets/${petId}/visits/${visit.id}`}>
                            Edit
                        </Button>
                        <Button size="sm" color="danger" onClick={() => remove(visit.id)}>
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
                <h1 className="text-center">Visits</h1>
                {alerts.map((a) => a.alert)}
                {modal}
                <div className="float-right">
                    <Button color="success" tag={Link} to={`/pets/${petId}/visits/new`}>
                        Add Visit
                    </Button>{" "}
                    <Button color="primary" tag={Link} to={`/pets/`}>
                        Back
                    </Button>
                </div>
                <Table className="mt-4">
                    <thead>
                        <tr>
                            <th>Date and Time</th>
                            <th>Description</th>
                            <th>Vet</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{visitList}</tbody>
                </Table>
            </Container>
        </div>
    );
}
