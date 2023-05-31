import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Col, Container } from 'reactstrap';
import tokenService from '../../services/token.service';
import useFetchState from '../../util/useFetchState';
import getErrorModal from '../../util/getErrorModal';
import deleteFromList from '../../util/deleteFromList';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const jwt = tokenService.getLocalAccessToken();

export default function VetListAdmin({ test = false }) {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [vets, setVets] = useFetchState([], `/api/v1/vets`, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);
    const modal = getErrorModal(setVisible, visible, message);

    const renderButtons = (params) => {
        return (
            <div>
                <ButtonGroup>
                    <Button size="sm" className='edit-button' aria-label={'edit-' + params.row.name} tag={Link} to={"/vets/" + params.row.id}>Edit</Button>
                    <Button size="sm" className='delete-button' aria-label={'delete-' + params.row.id}
                        onClick={() => deleteFromList(`/api/v1/vets/${params.row.id}`, params.row.id, [vets, setVets], [alerts, setAlerts], setMessage, setVisible)}>
                        Delete
                    </Button>
                </ButtonGroup>
            </div>
        )
    }

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.1, minWidth: 60, },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 130 },
        { field: 'city', headerName: 'City', flex: 0.5, minWidth: 130 },
        { field: 'specialties', headerName: 'Specialties', flex: 1, minWidth: 150 },
        { field: 'username', headerName: 'Username', minWidth: 150, flex: 1 },
        { field: 'actions', headerName: 'Actions', flex: 0.3, minWidth: 180, sortable: false, filterable: false, renderCell: renderButtons },
    ];

    const rows = Array.from(vets).map((vet) => {
        return (
            {
                id: vet.id,
                name: vet.firstName + ' ' + vet.lastName,
                city: vet.city,
                specialties: vet.specialties.map(s => s.name).toString().replaceAll(",", ", "),
                username: vet.user.username,
            }
        );
    });

    return (
        <div>
            <Container style={{ marginTop: "15px" }} fluid>
                <h1 className="text-center">Vets</h1>
                {alerts.map((a) => a.alert)}
                {modal}
                <div className="float-right">
                    <Button className='add-button' tag={Link} to="/vets/new">Add Vet</Button>{" "}
                    <Button className='extra-button' tag={Link} to="/vets/specialties">Specialties</Button>
                </div>
                <Col style={{ maxWidth: "1600px" }}>
                    <DataGrid
                        className='datagrid'
                        disableVirtualization={test}
                        aria-label='vets'
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
