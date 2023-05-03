import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import tokenService from '../../services/token.service';
import useFetchState from '../../util/useFetchState';
import getErrorModal from '../../util/getErrorModal';
import getDeleteAlertsOrModal from '../../util/getDeleteAlertsOrModal';

const jwt = tokenService.getLocalAccessToken();

export default function UserListAdmin() {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [users, setUsers] = useFetchState([], `/api/v1/users`, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);

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
                getDeleteAlertsOrModal(json, id, alerts, setAlerts, setMessage, setVisible);
            }).catch((message) => alert(message));
        }
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
    const modal = getErrorModal(setVisible, visible, message);

    return (
        <div>
            <Container style={{ marginTop: "15px" }} fluid>
                <h1 className="text-center">Users</h1>
                {alerts.map((a) => a.alert)}
                {modal}
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
