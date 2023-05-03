import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Input, Row, Table } from 'reactstrap';
import tokenService from '../../services/token.service';
import consultationService from '../../services/consultation.service';
import useFetchState from '../../util/useFetchState';
import getErrorModal from '../../util/getErrorModal';
import getDeleteAlertsOrModal from '../../util/getDeleteAlertsOrModal';

const jwt = tokenService.getLocalAccessToken();

export default function ConsultationListAdmin() {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [consultations, setConsultations] = useFetchState([], `/api/v1/consultations`, jwt, setMessage, setVisible);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [alerts, setAlerts] = useState([]);

    function remove(id) {
        let confirmMessage = window.confirm("Are you sure you want to delete it?");
        if (confirmMessage) {
            fetch(`/api/v1/consultations/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        setConsultations(consultations.filter((i) => i.id !== id));
                        setFiltered(filtered.filter((i) => i.id !== id));
                    }
                    return response.json();
                })
                .then(json => {
                    getDeleteAlertsOrModal(json, id, alerts, setAlerts, setMessage, setVisible);
                })
                .catch((message) => alert(message));
        }
    }

    function handleSearch(event) {
        const value = event.target.value;
        let filteredConsultations;
        if (value === "") {
            if (filter !== "")
                filteredConsultations = consultations.filter((i) => i.status === filter);
            else
                filteredConsultations = consultations;
        } else {
            if (filter !== "")
                filteredConsultations = consultations.filter((i) => i.status === filter && i.owner.user.username.includes(value));
            else
                filteredConsultations = consultations.filter((i) => i.owner.user.username.includes(value));
        }
        setFiltered(filteredConsultations);
        setSearch(value);
    }

    function handleFilter(event) {
        const value = event.target.value;
        let filteredConsultations;
        if (value === "") {
            if (search !== "")
                filteredConsultations = consultations.filter((i) => i.owner.user.username.includes(search));
            else
                filteredConsultations = consultations;
        } else {
            if (search !== "")
                filteredConsultations = consultations.filter((i) => i.status === value && i.owner.user.username.includes(search));
            else
                filteredConsultations = consultations.filter((i) => i.status === value);
        }
        setFiltered(filteredConsultations);
        setFilter(value);
    }


    let consultationList;
    if (filtered.length > 0) consultationList = consultationService.getConsultationList(filtered, remove);
    else consultationList = consultationService.getConsultationList(consultations, remove);
    const modal = getErrorModal(setVisible, visible, message);

    return (
        <div>
            <Container fluid style={{ marginTop: "15px" }}>
                <h1 className="text-center">Consultations</h1>
                {alerts.map((a) => a.alert)}
                {modal}
                <Row className="row-cols-auto g-3 align-items-center">
                    <Col>
                        <Button color="success" tag={Link} to="/consultations/new">
                            Add Consultation
                        </Button>
                        <Button color="link" onClick={handleFilter} value="PENDING">Pending</Button>
                        <Button color="link" onClick={handleFilter} value="ANSWERED">Answered</Button>
                        <Button color="link" onClick={handleFilter} value="CLOSED">Closed</Button>
                        <Button color="link" onClick={handleFilter} value="">Clear Filters</Button>
                    </Col>
                    <Col className="col-sm-3">
                        <Input type="search" placeholder="Introduce an owner name to search by it" value={search || ''}
                            onChange={handleSearch} />
                    </Col>
                </Row>
                <Table className="mt-4">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Owner</th>
                            <th>Pet</th>
                            <th>Creation Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{consultationList}</tbody>
                </Table>
            </Container>
        </div>
    );
}
