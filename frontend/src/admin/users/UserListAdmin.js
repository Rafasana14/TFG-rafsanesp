import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, ButtonGroup, Container, Table } from 'reactstrap';
import tokenService from '../../services/token.service';

const jwt = tokenService.getLocalAccessToken();

export default function UserListAdmin() {
    const [users, setUsers] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        let ignore = false;
        fetch(`/api/v1/users`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
            },
        })
            .then(response => response.json())
            .then(json => {
                if (!ignore) {
                    setUsers(json);
                }
            });
        return () => {
            ignore = true;
        };
    }, []);

    async function remove(id) {
        let confirmMessage = window.confirm("Are you sure you want to delete it?");
        if (confirmMessage) {
            await fetch(`/api/v1/users/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.status === 200) {
                    setUsers(users.filter((i) => i.id !== id));
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

    const userList = users.map((user) => {
        return (
            <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.authority.authority}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link}
                            to={"/users/" + user.id}>
                            Edit
                        </Button>
                        <Button size="sm" color="danger"
                            onClick={() => remove(user.id)}>
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
                <h1 className="text-center">Users</h1>
                {alerts.map((a) => a.alert)}
                <Button color="success" tag={Link} to="/users/new">
                    Add User
                </Button>
                <Table className="mt-4">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Authority</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{userList}</tbody>
                </Table>
            </Container>
        </div>
    );
}
