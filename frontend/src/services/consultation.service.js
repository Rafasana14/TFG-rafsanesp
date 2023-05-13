import { Link } from "react-router-dom";
import { Button, ButtonGroup, Col, Container, Input, Row, Table } from "reactstrap";
import deleteFromList from "../util/deleteFromList";

class ConsultationService {
    handleSearch(event, consultations, filter, setSearch, setFiltered, auth = "ADMIN") {
        const value = event.target.value;
        let filteredConsultations;
        if (value === "") {
            if (filter !== "")
                filteredConsultations = consultations.filter((i) => i.status === filter);
            else
                filteredConsultations = consultations;
        } else {
            filteredConsultations = this.getSearchFilteredConsultations(consultations, filter, value, auth);
        }
        setFiltered(filteredConsultations);
        setSearch(value);
    }

    getSearchFilteredConsultations(consultations, filter, value, auth) {
        if (filter !== "") {
            if (auth === "OWNER")
                return consultations.filter((i) => i.status === filter && i.pet.name.toLowerCase().includes(value));
            else
                return consultations.filter((i) => i.status === filter && i.pet.owner.user.username.toLowerCase().includes(value));
        }
        else {
            if (auth === "OWNER")
                return consultations.filter((i) => i.pet.name.toLowerCase().includes(value));
            else
                return consultations.filter((i) => i.pet.owner.user.username.toLowerCase().includes(value));
        }

    }

    handleFilter(event, consultations, setFilter, search, setFiltered, auth = "ADMIN") {
        const value = event.target.value;
        let filteredConsultations;
        if (value === "") {
            if (search !== "") {
                if (auth === "OWNER")
                    filteredConsultations = consultations.filter((i) => i.pet.name.toLowerCase().includes(search));
                else
                    filteredConsultations = consultations.filter((i) => i.pet.owner.user.username.toLowerCase().includes(search));
            }
            else
                filteredConsultations = consultations;
        } else {
            filteredConsultations = this.getFilterFilteredConsultations(consultations, search, value, auth);
        }
        setFiltered(filteredConsultations);
        setFilter(value);
    }

    getFilterFilteredConsultations(consultations, search, value, auth) {
        if (search !== "") {
            if (auth === "OWNER")
                return Array.from(consultations).filter((i) => i.status === value && i.pet.name.toLowerCase().includes(search));
            else
                return Array.from(consultations).filter((i) => i.status === value && i.pet.owner.user.username.toLowerCase().includes(search));
        }
        else
            return Array.from(consultations).filter((i) => i.status === value);
    }

    handleClear(consultations, setFiltered, setSearch, setFilter) {
        setFiltered(consultations);
        setSearch("");
        setFilter("");
    }

    getConsultationList([consultations, setConsultations], [filtered, setFiltered], [alerts, setAlerts], setMessage, setVisible, plan = null) {
        let displayedConsultations;
        if (filtered.length > 0) displayedConsultations = filtered;
        else displayedConsultations = consultations;
        return displayedConsultations.map((c) => {
            return (
                <tr key={c.id}>
                    <td>{c.title}</td>
                    <td>{c.status}</td>
                    {!plan ?
                        <td>{c.pet.owner.user.username}</td> : <></>
                    }
                    <td>{c.pet.name}</td>
                    <td>{(new Date(c.creationDate)).toLocaleString()}</td>
                    <td>
                        <ButtonGroup>
                            <Button aria-label={"details-" + c.id} size="sm" color="info" tag={Link}
                                to={`/consultations/${c.id}/tickets`}>
                                Details
                            </Button>
                            {!plan || plan === "PLATINUM" ?
                                <Button aria-label={"edit-" + c.id} size="sm" color="primary" tag={Link}
                                    to={"/consultations/" + c.id}>
                                    Edit
                                </Button> :
                                <></>
                            }
                            {!plan ?
                                <Button aria-label={"delete-" + c.id} size="sm" color="danger"
                                    onClick={() => deleteFromList(`/api/v1/consultations/${c.id}`, c.id, [consultations, setConsultations],
                                        [alerts, setAlerts], setMessage, setVisible, { filtered: filtered, setFiltered: setFiltered })}>
                                    Delete
                                </Button> :
                                <></>
                            }
                        </ButtonGroup>
                    </td>
                </tr>
            );
        });
    }
    render(alerts, modal, search, [handleFilter, handleSearch, handleClear], consultationList, auth = "ADMIN") {
        return <div>
            <Container fluid style={{ marginTop: "15px" }}>
                <h1 className="text-center">Consultations</h1>
                {alerts.map((a) => a.alert)}
                {modal}
                <Row className="row-cols-auto g-3 align-items-center">
                    <Col>
                        <Button color="success" tag={Link} to="/consultations/new">
                            Add Consultation
                        </Button>
                        <Button aria-label='pending-filter' color="link" onClick={handleFilter} value="PENDING">Pending</Button>
                        <Button aria-label='answered-filter' color="link" onClick={handleFilter} value="ANSWERED">Answered</Button>
                        <Button aria-label='closed-filter' color="link" onClick={handleFilter} value="CLOSED">Closed</Button>
                        <Button aria-label='all-filter' color="link" onClick={handleFilter} value="">All</Button>
                    </Col>
                    <Col className="col-sm-3">
                        <Input type="search" aria-label='search' placeholder={"Introduce an " + (auth === "ADMIN" ? "owner" : "pet") + " name to search by it"}
                            value={search || ''} onChange={handleSearch} />
                    </Col>
                    <Col className="col-sm-3">
                        <Button aria-label='clear-all' color="link" onClick={handleClear} >Clear All</Button>
                    </Col>
                </Row>
                <Table aria-label='consultations' className="mt-4">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            {auth === "ADMIN" ? <th>Owner</th> : <></>}
                            <th>Pet</th>
                            <th>Creation Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{consultationList}</tbody>
                </Table>
            </Container>
        </div>
    }
}
const consultationService = new ConsultationService();

export default consultationService;