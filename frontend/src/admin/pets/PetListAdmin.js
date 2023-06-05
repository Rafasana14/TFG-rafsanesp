import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Col, Container, Row } from 'reactstrap';
import tokenService from '../../services/token.service';
import useFetchState from '../../util/useFetchState';
import useErrorModal from '../../util/useErrorModal';
import deleteFromList from '../../util/deleteFromList';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useMediaQuery } from 'react-responsive';

const jwt = tokenService.getLocalAccessToken();

export default function PetListAdmin({ test = false, admin = true }) {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [pets, setPets] = useFetchState([], `/api/v1/pets`, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);
    const modal = useErrorModal(setVisible, visible, message);
    const isMobile = useMediaQuery({ query: `(max-width: 860px)` })

    const renderButtons = (params) => {
        return (
            <div>
                <Button aria-label={"visits-" + params.row.id} size="sm" className='extra-button' tag={Link}
                    to={`/pets/${params.row.id}/visits`}>
                    Visits
                </Button>{' '}
                {admin ? <ButtonGroup>
                    <Button size="sm" className='edit-button' aria-label={'edit-' + params.row.name} tag={Link} to={"/pets/" + params.row.id}>Edit</Button>
                    <Button size="sm" className='delete-button' aria-label={'delete-' + params.row.id}
                        onClick={() => deleteFromList(`/api/v1/pets/${params.row.id}`, params.row.id, [pets, setPets], [alerts, setAlerts], setMessage, setVisible)}>
                        Delete</Button>
                </ButtonGroup>
                    : <Button size="sm" className='add-button' aria-label={'details-' + params.row.name} tag={Link} to={"/pets/" + params.row.id}>Details</Button>}

            </div>
        )
    }

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.1, minWidth: 60, },
        { field: 'name', headerName: 'Name', minWidth: 150, flex: 0.8 },
        { field: 'birthdate', headerName: 'Birth Date', flex: 0.5, minWidth: 150, sortable: false },
        { field: 'type', headerName: 'Type', minWidth: 100, flex: 0.5 },
        { field: 'owner', headerName: 'Owner', minWidth: 150, flex: 1 },
        { field: 'actions', headerName: 'Actions', flex: 0.5, minWidth: 180, sortable: false, filterable: false, renderCell: renderButtons },
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
                {admin ?
                    <Button className='add-button' tag={Link} to="/pets/new">
                        Add Pet
                    </Button>
                    : <></>
                }
                <Row>
                    <Col style={{ maxWidth: '1600px' }}>
                        <DataGrid
                            className='datagrid'
                            disableVirtualization={test}
                            aria-label='pets'
                            rows={rows}
                            columns={columns}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        birthdate: !isMobile,
                                    }
                                },
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
