import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import tokenService from '../../services/token.service';
import useFetchState from '../../util/useFetchState';
import getErrorModal from '../../util/getErrorModal';
import deleteFromList from '../../util/deleteFromList';

const jwt = tokenService.getLocalAccessToken();

export default function UserListAdmin() {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [users, setUsers] = useFetchState([], `/api/v1/users`, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);

    const userList = users.map((user) => {
        return (
            <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.authority.authority}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" aria-label={"edit-" + user.id} tag={Link}
                            to={"/users/" + user.id}>
                            Edit
                        </Button>
                        <Button size="sm" color="danger" aria-label={"delete-" + user.id}
                            onClick={() => deleteFromList(`/api/v1/users/${user.id}`, user.id, [users, setUsers], [alerts, setAlerts], setMessage, setVisible)}>
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
                <Table aria-label='users' className="mt-4">
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
