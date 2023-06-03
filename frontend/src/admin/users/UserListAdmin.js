import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Col, Container } from 'reactstrap';
import tokenService from '../../services/token.service';
import useFetchState from '../../util/useFetchState';
import getErrorModal from '../../util/getErrorModal';
import deleteFromList from '../../util/deleteFromList';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const jwt = tokenService.getLocalAccessToken();

export default function UserListAdmin({ test = false }) {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [users, setUsers] = useFetchState([], `/api/v1/users`, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);
    const modal = getErrorModal(setVisible, visible, message);

    const renderButtons = (params) => {
        if (params.row.id === tokenService.getUser()?.id) {
            return <Button size="sm" className='edit-button' aria-label={'edit-' + params.row.name} tag={Link} to={"/profile"}>Edit</Button>
        }
        return (
            <div>
                <ButtonGroup>
                    <Button size="sm" className='edit-button' aria-label={'edit-' + params.row.name} tag={Link} to={"/users/" + params.row.id}>Edit</Button>
                    <Button size="sm" className='delete-button' aria-label={'delete-' + params.row.id}
                        onClick={() => deleteFromList(`/api/v1/users/${params.row.id}`, params.row.id, [users, setUsers], [alerts, setAlerts], setMessage, setVisible)}>
                        Delete
                    </Button>
                </ButtonGroup>
            </div>
        )
    }

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.1, minWidth: 60, },
        { field: 'username', headerName: 'Username', minWidth: 150, flex: 1 },
        { field: 'authority', headerName: 'Authority', flex: 0.5, minWidth: 150 },
        { field: 'actions', headerName: 'Actions', flex: 0.3, minWidth: 180, sortable: false, filterable: false, renderCell: renderButtons },
    ];

    const rows = Array.from(users).map((user) => {
        return (
            {
                id: user.id,
                username: user.username,
                authority: user.authority.authority,
            }
        );
    });

    return (
        <div>
            <Container style={{ marginTop: "15px" }} fluid>
                <h1 className="text-center">Users</h1>
                {alerts.map((a) => a.alert)}
                {modal}
                <Button className='add-button' tag={Link} to="/users/new">
                    Add User
                </Button>
                <Col style={{ maxWidth: "1200px" }}>
                    <DataGrid
                        className='datagrid'
                        disableVirtualization={test}
                        aria-label='users'
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[10, 20]}
                        slots={{
                            toolbar: GridToolbar,
                        }}
                    />
                </Col>
            </Container>
        </div>
    );
}
