import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, ButtonGroup, Container, Table } from 'reactstrap';
import tokenService from '../../services/token.service';

const jwt = tokenService.getLocalAccessToken();

export default function VetListAdmin() {
    const [vets, setVets] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        let ignore = false;
        fetch(`/api/v1/vets`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
            },
        })
            .then(response => response.json())
            .then(json => {
                if (!ignore) {
                    setVets(json);
                }
            });
        return () => {
            ignore = true;
        };
    }, []);

    async function remove(id) {
        let confirmMessage = window.confirm("Are you sure you want to delete it?");
        if (confirmMessage) {
            await fetch(`/api/v1/vets/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.status === 200) {
                    setVets(vets.filter((i) => i.id !== id));
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

    const vetList = vets.map((vet) => {
        let specialtiesAux = vet.specialties.map(s => s.name).toString().replaceAll(",", ", ");
        return (
            <tr key={vet.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{vet.firstName} {vet.lastName}</td>
                <td >{vet.city}</td>
                <td style={{ whiteSpace: 'break-spaces' }}>{specialtiesAux}</td>
                <td >{vet.user.username}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/vets/" + vet.id}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => remove(vet.id)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        );
    });

    return (
        <div>
            <Container style={{ marginTop: "15px" }} fluid>
                <h1 className="text-center">Vets</h1>
                {alerts.map((a) => a.alert)}
                <div className="float-right">
                    <Button color="success" tag={Link} to="/vets/new">Add Vet</Button>{" "}
                    <Button color="info" tag={Link} to="/vets/specialties">Specialties</Button>
                </div>
                <Table className="mt-4">
                    <thead>
                        <tr>
                            <th width="20%">Name</th>
                            <th width="20%">City</th>
                            <th width="20%">Specialties</th>
                            <th width="20%">User</th>
                            <th width="20%">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vetList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}
