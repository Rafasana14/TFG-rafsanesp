import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Col, Container } from 'reactstrap';
import tokenService from '../../services/token.service';
import getErrorModal from '../../util/getErrorModal';
import getIdFromUrl from '../../util/getIdFromUrl';
import useFetchState from '../../util/useFetchState';
import deleteFromList from '../../util/deleteFromList';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import useFetchData from '../../util/useFetchData';

const jwt = tokenService.getLocalAccessToken();

export default function VisitListOwner({ test = false }) {
    const petId = getIdFromUrl(2);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const pet = useFetchData(`/api/v1/pets/${petId}`, jwt, setMessage, setVisible);
    const [visits, setVisits] = useFetchState([], `/api/v1/pets/${petId}/visits`, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);

    const modal = getErrorModal(setVisible, visible, message);
    // const visitList = visits.map((visit) => {
    //     return (
    //         <tr key={visit.id}>
    //             <td>{(new Date(visit.datetime)).toLocaleString()}</td>
    //             <td>{visit.description ? visit.description : "No description provided"}</td>
    //             <td>{visit.vet.firstName} {visit.vet.lastName}</td>
    //             <td>
    //                 <ButtonGroup>
    //                     <Button size="sm" aria-label={"edit-" + visit.id} color="primary" tag={Link}
    //                         to={`/pets/${petId}/visits/${visit.id}`}>
    //                         Edit
    //                     </Button>
    //                     <Button size="sm" aria-label={"delete-" + visit.id} color="danger"
    //                         onClick={() => deleteFromList(`/api/v1/pets/${petId}/visits/${visit.id}`, visit.id,
    //                             [visits, setVisits], [alerts, setAlerts], setMessage, setVisible)}>
    //                         Delete
    //                     </Button>
    //                 </ButtonGroup>
    //             </td>
    //         </tr>
    //     );
    // });

    const renderButtons = (params) => {
        const today = new Date();
        if (new Date(params.row.datetime).getTime() > today.getTime())
            return (
                <ButtonGroup>
                    <Button size="sm" aria-label={"edit-" + params.row.id} color="primary" tag={Link}
                        to={`/pets/${petId}/visits/${params.row.id}`}>
                        Edit
                    </Button>
                    <Button size="sm" aria-label={"delete-" + params.row.id} color="danger"
                        onClick={() => deleteFromList(`/api/v1/pets/${petId}/visits/${params.row.id}`, params.row.id,
                            [visits, setVisits], [alerts, setAlerts], setMessage, setVisible)}>
                        Cancel
                    </Button>
                </ButtonGroup>
            )
        else return (
            <Button size="sm" aria-label={"edit-" + params.row.id} color="primary" tag={Link}
                to={`/pets/${petId}/visits/${params.row.id}`}>
                Edit
            </Button>
        )
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70, filterable: false },
        { field: 'datetime', type: 'dateTime', headerName: 'Date and Time', width: 170 },
        { field: 'description', headerName: 'Description', width: 350, sortable: false },
        { field: 'vet', headerName: 'Vet', width: 250 },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'actions', headerName: 'Actions', width: 130, sortable: false, renderCell: renderButtons },
    ];

    const rows = Array.from(visits).map((visit) => {
        let spAux = visit.vet.specialties.map(s => s.name).toString().replace(",", ", ");
        const vet = `${visit.vet.firstName} ${visit.vet.lastName} ${spAux !== "" ? "- " + spAux : ""}`;

        return (
            {
                id: visit.id,
                datetime: new Date(visit.datetime),
                description: visit.description || "No description provided",
                city: visit.vet.city,
                vet: vet,
            }
        );
    });


    const getTogglableColumns = (columns) => {
        return columns
            .filter((column) => column.field !== 'id')
            .map((column) => column.field);
    };

    return (
        <div>
            <Container style={{ marginTop: "15px" }} fluid>
                <h1 className="text-center">Visits{pet ? " of " + pet.name : ""}</h1>
                {alerts.map((a) => a.alert)}
                {modal}
                <div className="float-right">
                    <Button color="success" tag={Link} to={`/pets/${petId}/visits/new`}>
                        Add Visit
                    </Button>{" "}
                    <Button color="primary" tag={Link} to={`/pets/`}>
                        Back
                    </Button>
                </div>
                <br></br>
                <Col style={{ maxWidth: "1100px" }} align="center" >
                    <DataGrid
                        disableVirtualization={test}
                        aria-label='visits'
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                            columns: {
                                columnVisibilityModel: { id: false, }
                            }
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
                {/* <Table aria-label='visits' className="mt-4">
                    <thead>
                        <tr>
                            <th>Date and Time</th>
                            <th>Description</th>
                            <th>Vet</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{visitList}</tbody>
                </Table> */}
            </Container>
        </div>
    );
}
