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

    // function handleSearch(event) {
    //     consultationService.handleSearch(event, consultations, filter, setSearch, setFiltered, "VET");
    // }

    // function handleFilter(event) {
    //     consultationService.handleFilter(event, consultations, setFilter, search, setFiltered, "VET");
    // }

    // function handleClear() {
    //     consultationService.handleClear(consultations, setFiltered, setSearch, setFilter);
    // }

    // let consultationList;
    // if (filtered.length === 0 && (filter !== "" || search !== "")) consultationList =
    //     <tr>
    //         <td>There are no consultations with those filter and search parameters.</td>
    //     </tr>
    // else consultationList = consultationService.getConsultationList([consultations, setConsultations],
    //     [filtered, setFiltered], [alerts, setAlerts], setMessage, setVisible);
    const modal = getErrorModal(setVisible, visible, message);

    // return (
    //     consultationService.render(alerts, modal, search, [handleFilter, handleSearch, handleClear], consultationList, "VET")
    // );


    const renderButtons = (params) => {
        return (
            <Button aria-label={"details-" + params.row.id} size="sm" color="info" tag={Link}
                to={`/consultations/${params.row.id}/tickets`}>
                Details
            </Button>
        )

    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70, filterable: false },
        { field: 'title', headerName: 'Title', width: 300 },
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'owner', headerName: 'Owner', width: 150 },
        { field: 'creationDate', type: 'dateTime', headerName: 'Creation Date', width: 150 },
        { field: 'actions', headerName: 'Actions', width: 90, sortable: false, renderCell: renderButtons },
    ];

    const rows = Array.from(consultations).map((consultation) => {
        return (
            {
                id: consultation.id,
                title: consultation.title,
                status: consultation.status,
                owner: consultation.pet.owner.user.username,
                creationDate: new Date(consultation.creationDate),
            }
        );
    });


    return <div>
        <Container fluid style={{ marginTop: "15px" }}>
            <h1 className="text-center">Consultations</h1>
            {modal}
            <Col style={{ maxWidth: "900px" }} align="center" >
                <DataGrid
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
    </div>
}
