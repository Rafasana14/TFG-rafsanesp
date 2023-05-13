import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import tokenService from '../../services/token.service';
import useFetchState from '../../util/useFetchState';
import getErrorModal from '../../util/getErrorModal';
import deleteFromList from '../../util/deleteFromList';

const jwt = tokenService.getLocalAccessToken();

export default function SpecialtyListAdmin() {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [specialties, setSpecialties] = useFetchState([], `/api/v1/vets/specialties`, jwt, setMessage, setVisible);
    const [alerts, setAlerts] = useState([]);

    const specialtiesList = specialties.map((s) => {
        return (
            <tr key={s.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{s.name}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" aria-label={"edit-" + s.id} color="primary" tag={Link} to={"/vets/specialties/" + s.id}>Edit</Button>
                        <Button size="sm" aria-label={"delete-" + s.id} color="danger"
                            onClick={() => deleteFromList(`/api/v1/vets/specialties/${s.id}`, s.id, [specialties, setSpecialties],
                                [alerts, setAlerts], setMessage, setVisible)}>
                            Delete
                        </Button>
                    </ButtonGroup>
                </td>
            </tr>
        );
    });
    const modal = getErrorModal(setVisible, visible, message);

    return (
        <div>
            <Container style={{ marginTop: "15px" }} fluid>
                <h1 className="text-center">Specialties</h1>
                {alerts.map((a) => a.alert)}
                {modal}
                <Button color="success" tag={Link} to="/vets/specialties/new">Add Specialty</Button>
                {" "}
                <Button color="info" tag={Link} to="/vets">Back</Button>
                <Table aria-label='specialties' className="mt-4">
                    <thead>
                        <tr>
                            <th width="20%">Name</th>
                            <th width="20%">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {specialtiesList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}
