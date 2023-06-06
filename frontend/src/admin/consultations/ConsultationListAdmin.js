import { useState } from 'react';
import tokenService from '../../services/token.service';
import useFetchState from '../../util/useFetchState';
import useErrorModal from '../../util/useErrorModal';
import { Button, ButtonGroup, Col, Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import deleteFromList from '../../util/deleteFromList';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const jwt = tokenService.getLocalAccessToken();

export default function ConsultationListAdmin({ test = false }) {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [consultations, setConsultations] = useFetchState([], `/api/v1/consultations`, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);
    const modal = useErrorModal(setVisible, visible, message);

    const renderButtons = (params) => {
        return (
            <div>
                <Button aria-label={"details-" + params.row.id} size="sm" className='extra-button' tag={Link}
                    to={`/consultations/${params.row.id}/tickets`}>
                    Details
                </Button>{' '}
                <ButtonGroup>
                    <Button size="sm" className='edit-button' aria-label={'edit-' + params.row.name} tag={Link} to={"/consultations/" + params.row.id}>Edit</Button>
                    <Button size="sm" className='delete-button' aria-label={'delete-' + params.row.id}
                        onClick={() => deleteFromList(`/api/v1/consultations/${params.row.id}`, params.row.id, [consultations, setConsultations], [alerts, setAlerts], setMessage, setVisible)}>
                        Delete</Button>
                </ButtonGroup>
            </div>
        )
    }

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.1, minWidth: 70, filterable: false },
        { field: 'title', headerName: 'Title', flex: 1, minWidth: 300 },
        { field: 'status', headerName: 'Status', flex: 0.4, minWidth: 130 },
        { field: 'owner', headerName: 'Owner', flex: 0.5, minWidth: 120 },
        { field: 'pet', headerName: 'Pet', flex: 0.4, minWidth: 120 },
        { field: 'creationDate', type: 'dateTime', headerName: 'Creation Date', flex: 0.4, minWidth: 150 },
        { field: 'actions', headerName: 'Actions', flex: 0.4, minWidth: 185, sortable: false, filterable: false, renderCell: renderButtons },
    ];

    const rows = Array.from(consultations).map((consultation) => {
        return (
            {
                id: consultation.id,
                title: consultation.title,
                status: consultation.status,
                owner: consultation.pet?.owner?.user.username || "Not specified",
                pet: consultation.pet?.name || "Not specified",
                creationDate: new Date(consultation.creationDate),
            }
        );
    });

    return (
        <Container fluid style={{ marginTop: "15px" }}>
            <h1 className="text-center">Consultations</h1>
            {alerts.map((a) => a.alert)}
            {modal}
            <Button className='add-button' tag={Link} to="/consultations/new">
                Add Consultation
            </Button>
            <Col style={{ maxWidth: "1600px" }} align="center" >
                <DataGrid
                    className='datagrid'
                    disableVirtualization={test}
                    aria-label='consultations'
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                        sorting: {
                            sortModel: [{ field: 'creationDate', sort: 'desc' }],
                        },
                    }}
                    pageSizeOptions={[10, 20]}
                    slots={{
                        toolbar: GridToolbar,
                    }}
                />
            </Col>
        </Container>
    );
}
