import { useState } from 'react';
import tokenService from '../../services/token.service';
import getErrorModal from '../../util/getErrorModal';
import { Button, Col, Container } from 'reactstrap';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import useFetchData from '../../util/useFetchData';

const jwt = tokenService.getLocalAccessToken();

export default function ConsultationListVet({ test = false }) {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const consultations = useFetchData(`/api/v1/consultations`, jwt, setMessage, setVisible);
    const modal = getErrorModal(setVisible, visible, message);

    const renderButtons = (params) => {
        return (
            <Button aria-label={"details-" + params.row.id} size="sm" className='extra-button' tag={Link}
                to={`/consultations/${params.row.id}/tickets`}>
                Details
            </Button>
        )

    }

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.1, minWidth: 70, filterable: false },
        { field: 'title', headerName: 'Title', flex: 1, minWidth: 300 },
        { field: 'status', headerName: 'Status', flex: 0.4, minWidth: 130 },
        { field: 'owner', headerName: 'Owner', flex: 0.5, minWidth: 150 },
        { field: 'pet', headerName: 'Pet', flex: 0.4, minWidth: 150 },
        { field: 'creationDate', type: 'dateTime', headerName: 'Creation Date', flex: 0.5, minWidth: 150 },
        { field: 'actions', headerName: 'Actions', flex: 0.3, minWidth: 90, sortable: false, filterable: false, renderCell: renderButtons },
    ];

    const rows = Array.from(consultations).map((consultation) => {
        return (
            {
                id: consultation.id,
                title: consultation.title,
                status: consultation.status,
                owner: consultation.pet.owner.user.username,
                pet: consultation.pet.name,
                creationDate: new Date(consultation.creationDate),
            }
        );
    });


    return (
        <Container fluid style={{ marginTop: "15px" }}>
            <h1 className="text-center">Consultations</h1>
            {modal}
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
    )
}
