import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Col, Container, Row } from 'reactstrap';
import tokenService from '../../services/token.service';
import useFetchState from '../../util/useFetchState';
import getErrorModal from '../../util/getErrorModal';
import deleteFromList from '../../util/deleteFromList';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const jwt = tokenService.getLocalAccessToken();

export default function PetListAdmin({ test = false }) {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [pets, setPets] = useFetchState([], `/api/v1/pets`, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);
    const modal = getErrorModal(setVisible, visible, message);

    const renderButtons = (params) => {
        return (
            <div>
                <Button aria-label={"visits-" + params.row.id} size="sm" className='extra-button' tag={Link}
                    to={`/pets/${params.row.id}/visits`}>
                    Visits
                </Button>{' '}
                <ButtonGroup>
                    <Button size="sm" className='edit-button' aria-label={'edit-' + params.row.name} tag={Link} to={"/pets/" + params.row.id}>Edit</Button>
                    <Button size="sm" className='delete-button' aria-label={'delete-' + params.row.id}
                        onClick={() => deleteFromList(`/api/v1/pets/${params.row.id}`, params.row.id, [pets, setPets], [alerts, setAlerts], setMessage, setVisible)}>
                        Delete</Button>
                </ButtonGroup>
            </div>
        )
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'birthdate', headerName: 'BirthDate', width: 150, sortable: false },
        { field: 'type', headerName: 'Type', width: 150 },
        { field: 'owner', headerName: 'Owner', width: 200 },
        { field: 'actions', headerName: 'Actions', width: 180, sortable: false, renderCell: renderButtons },
    ];

    const rows = Array.from(pets).map((pet) => {
        return (
            {
                id: pet.id,
                name: pet.name,
                birthdate: pet.birthDate,
                type: pet.type.name || "Not defined",
                owner: pet.owner?.user.username || "Not defined",
            }
        );
    });

    return (
        <div>
            <Container fluid style={{ marginTop: "15px", padding: "30px" }}>
                <h1 className="text-center">Pets</h1>
                {alerts.map((a) => a.alert)}
                {modal}
                <div className="float-right">
                    <Button className='add-button' tag={Link} to="/pets/new">
                        Add Pet
                    </Button>
                </div><br></br>
                <Row>
                    <Col style={{ maxWidth: "1000px" }}>
                        <DataGrid
                            className='datagrid'
                            disableVirtualization={test}
                            aria-label='pets'
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
                </Row>
            </Container>
        </div>
    );
}
