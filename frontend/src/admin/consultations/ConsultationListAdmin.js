import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Col, Container, Input, Row, Table } from 'reactstrap';
import tokenService from '../../services/token.service';
import consultationService from '../../services/consultation.service';

const jwt = tokenService.getLocalAccessToken();

export default function ConsultationListAdmin() {
    const [consultations, setConsultations] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState([]);
    const [filter, setFilter] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        let ignore = false;
        fetch(`/api/v1/consultations`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
            },
        })
            .then(response => response.json())
            .then(json => {
                if (!ignore) {
                    setConsultations(json);
                    setFiltered(json);
                }
            });
        return () => {
            ignore = true;
        };
    }, []);

    async function remove(id) {
        let confirmMessage = window.confirm("Are you sure you want to delete it?");
        if (confirmMessage) {
            await fetch(`/api/v1/consultations/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.status === 200) {
                    setConsultations(consultations.filter((i) => i.id !== id));
                    setFiltered(filtered.filter((i) => i.id !== id));
                }
                return response.json();
            }).then(json => {
                const alertId = `alert-${id}`
                setAlerts([
                    ...alerts,
                    {
                        alert: <Alert toggle={() => dismiss(alertId)} key={"alert-" + id} id={alertId} color="info">
                            {json.message}
                        </Alert>,
                        id: alertId
                    }
                ]);
            });
        }
    }

    function dismiss(id) {
        setAlerts(alerts.filter(i => i.id !== id))
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
    if (filtered) consultationList = consultationService.getConsultationList(filtered, remove);
    else consultationList = consultationService.getConsultationList(consultations, remove);

    return (
        <div>
            <Container fluid style={{ marginTop: "15px" }}>
                <h1 className="text-center">Consultations</h1>
                {alerts.map((a) => a.alert)}
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
