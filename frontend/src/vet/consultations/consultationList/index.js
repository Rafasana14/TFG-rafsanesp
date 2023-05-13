import React, { Component } from "react";
import { Button, ButtonGroup, Col, Container, Input, Row, Table } from "reactstrap";
import { Link } from "react-router-dom";

class VetConsultationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultations: [],
            filtered: null,
            filter: "",
            search: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.jwt = JSON.parse(window.localStorage.getItem("jwt"));
    }

    async componentDidMount() {
        const consultations = await (await fetch("/api/v1/consultations", {
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                "Content-Type": "application/json",
            },
        })).json();
        this.setState({ consultations: consultations, filtered: consultations });
    }

    handleChange(event) {
        const value = event.target.value;
        const filter = this.state.filter;
        let filteredConsultations;

        if (value === "") {
            if (filter !== "")
                filteredConsultations = [...this.state.consultations].filter((i) => i.pet.status === filter);
            else
                filteredConsultations = [...this.state.consultations];
        } else {
            if (filter !== "")
                filteredConsultations = [...this.state.consultations].filter((i) => i.pet.status === filter && i.owner.user.username.includes(value));
            else
                filteredConsultations = [...this.state.consultations].filter((i) => i.pet.owner.user.username.includes(value));
        }
        this.setState({ filtered: filteredConsultations, search: value });
    }

    handleFilter(event) {
        const value = event.target.value;
        const search = this.state.search;
        let filteredConsultations;

        if (value === "") {
            if (search !== "")
                filteredConsultations = [...this.state.consultations].filter((i) => i.pet.owner.user.username.includes(search));
            else
                filteredConsultations = [...this.state.consultations];
        } else {
            if (search !== "")
                filteredConsultations = [...this.state.consultations].filter((i) => i.status === value && i.pet.owner.user.username.includes(search));
            else
                filteredConsultations = [...this.state.consultations].filter((i) => i.status === value);
        }
        this.setState({ filtered: filteredConsultations, filter: value });
    }

    getConsultationList(consultations) {
        return consultations.map((c) => {
            return (
                <tr key={c.id}>
                    <td>{c.title}</td>
                    <td>{c.status}</td>
                    <td>{c.pet.owner.user.username}</td>
                    <td>{(new Date(c.creationDate)).toLocaleString()}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="info" tag={Link}
                                to={`/consultations/${c.id}/tickets`}>
                                Details
                            </Button>
                        </ButtonGroup>
                    </td>
                </tr>
            );
        });
    }

    render() {
        const { consultations, filtered, search } = this.state;

        let consultationList;
        if (filtered) consultationList = this.getConsultationList(filtered);
        else consultationList = this.getConsultationList(consultations);

        return (
            <div>
                <Container style={{ marginTop: "15px" }} fluid>
                    <h1 className="text-center">Consultations</h1>
                    <Row className="row-cols-auto g-3 align-items-center">
                        <Col>
                            <Button color="link" onClick={this.handleFilter} value="PENDING">Pending</Button>
                            <Button color="link" onClick={this.handleFilter} value="ANSWERED">Answered</Button>
                            <Button color="link" onClick={this.handleFilter} value="CLOSED">Closed</Button>
                            <Button color="link" onClick={this.handleFilter} value="">Clear Filters</Button>
                        </Col>
                        <Col className="col-sm-3">
                            <Input type="search" placeholder="Introduce an owner name to search by it" value={search || ''}
                                onChange={this.handleChange} />
                        </Col>
                    </Row>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Owner</th>
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
}

export default VetConsultationList;
