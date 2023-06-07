import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Col, Container } from 'reactstrap';
import tokenService from '../../services/token.service';
import useErrorModal from '../../util/useErrorModal';
import getIdFromUrl from '../../util/getIdFromUrl';
import useFetchState from '../../util/useFetchState';
import deleteFromList from '../../util/deleteFromList';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const jwt = tokenService.getLocalAccessToken();

export default function VisitListAdmin({ test = false, admin = true }) {
    const petId = getIdFromUrl(2);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visits, setVisits] = useFetchState([], `/api/v1/pets/${petId}/visits`, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);
    const modal = useErrorModal(setVisible, visible, message);

    const renderButtons = (params) => {
        if (admin) {
            return (
                <div>
                    <ButtonGroup>
                        <Button size="sm" className='edit-button' aria-label={'edit-' + params.row.name} tag={Link} to={`/pets/${petId}/visits/${params.row.id}`}>Edit</Button>
                        <Button size="sm" className='delete-button' aria-label={'delete-' + params.row.id}
                            onClick={() => deleteFromList(`/api/v1/pets/${petId}/visits/${params.row.id}`, params.row.id, [visits, setVisits], [alerts, setAlerts], setMessage, setVisible)}>
                            Delete
                        </Button>
                    </ButtonGroup>
                </div>
            )
        } else {
            let edit = false
            if (params.row.user?.id === tokenService.getUser().id) edit = true;
            return (
                <Button size="sm" className={edit ? 'edit-button' : 'extra-button'} aria-label={'edit-' + params.row.name}
                    tag={Link} to={`/pets/${petId}/visits/${params.row.id}`}>{edit ? "Edit" : "Details"}</Button>
            )
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.1, minWidth: 70 },
        { field: 'datetime', type: 'dateTime', headerName: 'Date and Time', flex: 0.7, minWidth: 170 },
        { field: 'description', headerName: 'Description', flex: 1, minWidth: 350, sortable: false },
        { field: 'vet', headerName: 'Vet', flex: 0.7, minWidth: 250 },
        { field: 'city', headerName: 'City', flex: 0.4, minWidth: 150 },
        { field: 'actions', headerName: 'Actions', flex: 0.3, minWidth: 130, sortable: false, filterable: false, renderCell: renderButtons },
    ];

    const rows = Array.from(visits).map((v) => {
        const vet = v.vet ? `${v.vet.firstName} ${v.vet.lastName} - ${v.vet.user.username} ` : "Not specified";

        return (
            {
                id: v.id,
                datetime: new Date(v.datetime),
                description: v.description || "No description provided",
                city: v.vet?.city || "Not specified",
                vet: vet,
                user: v.vet?.user || "Not specified"
            }
        );
    });

    return (
        <div>
            <Container style={{ marginTop: "15px" }} fluid>
                <h1 className="text-center">Visits</h1>
                {alerts.map((a) => a.alert)}
                {modal}
                <div className="float-right">
                    <Button className='add-button' tag={Link} to={`/pets/${petId}/visits/new`}>
                        Add Visit
                    </Button>
                    {" "}
                    <Button className='back-button' tag={Link} to={`/pets/`}>
                        Back
                    </Button>
                </div>
                <Col style={{ maxWidth: "1600px" }} align="center" >
                    <DataGrid
                        className='datagrid'
                        disableVirtualization={test}
                        aria-label='visits'
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                            sorting: {
                                sortModel: [{ field: 'datetime', sort: 'desc' }],
                            },
                        }}
                        pageSizeOptions={[10, 20]}
                        slots={{
                            toolbar: GridToolbar,
                        }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: { debounceMs: 500 },
                            },
                        }}
                    />
                </Col>
            </Container>
        </div>
    );
}
