import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Col, Container } from 'reactstrap';
import tokenService from '../../services/token.service';
import useFetchState from '../../util/useFetchState';
import useErrorModal from '../../util/useErrorModal';
import deleteFromList from '../../util/deleteFromList';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const jwt = tokenService.getLocalAccessToken();

export default function SpecialtyListAdmin({ test = false, admin = true }) {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [specialties, setSpecialties] = useFetchState([], `/api/v1/vets/specialties`, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);
    const modal = useErrorModal(setVisible, visible, message);

    const renderButtons = (params) => {
        return (
            <div>
                < ButtonGroup >
                    <Button size="sm" className='edit-button' aria-label={'edit-' + params.row.name} tag={Link} to={"/vets/specialties/" + params.row.id}>Edit</Button>
                    <Button size="sm" className='delete-button' aria-label={'delete-' + params.row.id}
                        onClick={() => deleteFromList(`/api/v1/vets/specialties/${params.row.id}`, params.row.id, [specialties, setSpecialties], [alerts, setAlerts], setMessage, setVisible)}>
                        Delete
                    </Button>
                </ButtonGroup >
            </div >
        )
    }

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.1, minWidth: 60, },
        { field: 'name', headerName: 'Name', minWidth: 150, flex: 1 },
        { field: 'actions', headerName: 'Actions', flex: admin ? 0.3 : 0, minWidth: 180, sortable: false, filterable: false, renderCell: admin ? renderButtons : null },
    ];

    const rows = Array.from(specialties).map((s) => {
        return (
            {
                id: s.id,
                name: s.name,
            }
        );
    });
    const getTogglableColumns = (columns) => {
        return columns
            .filter((column) => column.field !== 'actions' && admin)
            .map((column) => column.field);
    };

    return (
        <div>
            <Container style={{ marginTop: "15px" }} fluid>
                <h1 className="text-center">Specialties</h1>
                {alerts.map((a) => a.alert)}
                {modal}
                {admin ? <Button className='add-button' tag={Link} to="/vets/specialties/new">Add Specialty</Button> : <></>}
                {" "}
                <Button className='back-button' tag={Link} to="/vets">Back</Button>
                <Col style={{ maxWidth: admin ? "800px" : "450px" }}>
                    <DataGrid
                        className='datagrid'
                        disableVirtualization={test}
                        aria-label='specialties'
                        rows={rows}
                        columns={columns}
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    actions: admin
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
                        slotProps={{
                            columnsPanel: {
                                getTogglableColumns,
                            },
                        }}
                    />
                </Col>
            </Container>
        </div>
    );
}
