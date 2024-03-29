import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Col, Container } from 'reactstrap';
import tokenService from '../../services/token.service';
import useErrorModal from '../../util/useErrorModal';
import useFetchState from '../../util/useFetchState';
import deleteFromList from '../../util/deleteFromList';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const jwt = tokenService.getLocalAccessToken();

export default function VisitListVet({ test = false }) {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visits, setVisits] = useFetchState([], `/api/v1/visits`, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);

    const modal = useErrorModal(setVisible, visible, message);

    const renderButtons = (params) => {
        const today = new Date();
        if (new Date(params.row.datetime).getTime() > today.getTime())
            return (
                <ButtonGroup>
                    <Button size="sm" aria-label={"edit-" + params.row.id} className='edit-button' tag={Link}
                        to={`/pets/${params.row.petId}/visits/${params.row.id}`}>
                        Edit
                    </Button>
                    <Button size="sm" aria-label={"cancel-" + params.row.id} className='delete-button'
                        onClick={() => deleteFromList(`/api/v1/pets/${params.row.petId}/visits/${params.row.id}`, params.row.id,
                            [visits, setVisits], [alerts, setAlerts], setMessage, setVisible)}>
                        Cancel
                    </Button>
                </ButtonGroup>
            )
        else return (
            <Button size="sm" aria-label={"edit-" + params.row.id} className='edit-button' tag={Link}
                to={`/pets/${params.row.petId}/visits/${params.row.id}`}>Edit</Button>
        )
    }

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.1, minWidth: 70, filterable: false },
        { field: 'datetime', type: 'dateTime', headerName: 'Date and Time', flex: 0.7, minWidth: 170 },
        { field: 'description', headerName: 'Description', flex: 1, minWidth: 350, sortable: false },
        { field: 'petName', headerName: 'Pet', flex: 0.9, minWidth: 250 },
        { field: 'actions', headerName: 'Actions', flex: 0.3, minWidth: 130, sortable: false, filterable: false, renderCell: renderButtons },
    ];

    const rows = Array.from(visits).map((visit) => {

        return (
            {
                id: visit.id,
                datetime: new Date(visit.datetime),
                description: visit.description || "No description provided",
                petName: visit.pet.name,
                petId: visit.pet.id
            }
        );
    });

    return (
        <div>
            <Container style={{ marginTop: "15px" }} fluid>
                <h2 className="text-center">My Visits</h2>
                {alerts.map((a) => a.alert)}
                {modal}
                <Button className='add-button' tag={Link} to={`/visits/new`}>
                    Add Visit
                </Button>
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
