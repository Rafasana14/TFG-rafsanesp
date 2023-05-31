import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Col, Container } from 'reactstrap';
import tokenService from '../../services/token.service';
import useFetchState from '../../util/useFetchState';
import getErrorModal from '../../util/getErrorModal';
import deleteFromList from '../../util/deleteFromList';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const jwt = tokenService.getLocalAccessToken();

export default function OwnerListAdmin({ test = false }) {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [owners, setOwners] = useFetchState([], `/api/v1/owners`, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);
    const modal = getErrorModal(setVisible, visible, message);

    const renderButtons = (params) => {
        return (
            <ButtonGroup>
                <Button size="sm" className='edit-button' aria-label={'edit-' + params.row.username} tag={Link} to={"/owners/" + params.row.id}>Edit</Button>
                <Button size="sm" className='delete-button' aria-label={'delete-' + params.row.username}
                    onClick={() => deleteFromList(`/api/v1/owners/${params.row.id}`, params.row.id, [owners, setOwners], [alerts, setAlerts], setMessage, setVisible)}>
                    Delete</Button>
            </ButtonGroup>
        )
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'address', headerName: 'Address', width: 200, sortable: false },
        { field: 'city', headerName: 'City', width: 150, sortable: false },
        { field: 'telephone', headerName: 'Telephone', width: 150, sortable: false },
        { field: 'username', headerName: 'Username', width: 160 },
        { field: 'plan', headerName: 'Plan', width: 150 },
        { field: 'actions', headerName: 'Actions', width: 130, sortable: false, renderCell: renderButtons },
    ];

    const rows = Array.from(owners).map((owner) => {
        return (
            {
                id: owner.id,
                name: owner.firstName + " " + owner.lastName,
                address: owner.address,
                city: owner.city,
                telephone: owner.telephone,
                username: owner.user.username,
                plan: owner.plan,
            }
        );
    });

    return (
        <div>
            <Container fluid style={{ marginTop: "15px", padding: "30px" }}>
                <h1 className="text-center">Owners</h1>
                {alerts.map((a) => a.alert)}
                {modal}
                <div className="float-right">
                    <Button className='add-button' tag={Link} to="/owners/new">
                        Add Owner
                    </Button>
                </div><br></br>
                <Col style={{ maxWidth: "1200px" }}>
                    <DataGrid
                        className='datagrid'
                        disableVirtualization={test}
                        aria-label='owners'
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
