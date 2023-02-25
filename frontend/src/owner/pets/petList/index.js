import React, { Component } from "react";
import { Button, ButtonGroup, Card, CardBody, CardFooter, CardTitle, Col, Container, ListGroup, ListGroupItem, Row, Table } from "reactstrap";
// import AppNavbar from "../AppNavbar";
import { Link } from "react-router-dom";

class PetOwnerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pets: [],
            // visits: [[]],
        };
        this.removePet = this.removePet.bind(this);
        this.removeVisit = this.removeVisit.bind(this);
        this.jwt = JSON.parse(window.localStorage.getItem("jwt"));
    }

    async componentDidMount() {
        let pets = await (await fetch(`/api/v1/pets/`, {
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                "Content-Type": "application/json",
            },
        })).json();

        for (let i = 0; i < pets.length; i++) {
            // let visits = [];
            await (await fetch(`/api/v1/pets/${pets[i].id}/visits`, {
                headers: {
                    "Authorization": `Bearer ${this.jwt}`,
                    "Content-Type": "application/json",
                },
            }).then((response) => response.json())
                .then((data) => {
                    pets[i]["visits"] = data;
                }));
        }
        this.setState({ pets: pets });
    }

    // async getVisits(pets) {
    //     for (let i = 0; i < pets.length; i++) {
    //         // let visits = [];
    //         await (await fetch(`/api/v1/pets/${pets[i].id}/visits`, {
    //             headers: {
    //                 "Authorization": `Bearer ${this.jwt}`,
    //                 "Content-Type": "application/json",
    //             },
    //         }).then((response) => response.json())
    //             .then((data) => {
    //                 pets[i]["visits"] = data;
    //             }));
    //     }
    //     return pets;
    // }

    async removePet(id) {
        await fetch(`/api/v1/pets/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).then((response) => {
            if (response.status === 200) {
                let updatedPets = [...this.state.pets].filter((i) => i.id !== id);
                this.setState({ pets: updatedPets });
            }
            return response.json();
        }).then(function (data) {
            alert(data.message);
        });
    }

    async removeVisit(petId, visitId) {
        let status = "";
        await fetch(`/api/v1/pets/${petId}/visits/${visitId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).then((response) => {
            if (response.status === 200) {
                status = "200";
                let updatedVisits = [...this.state.pets].filter((i) => i.id !== visitId);
                this.setState({ visits: updatedVisits });
            }
            return response.json();
        }).then(function (data) {
            alert(data.message);
        });

        if (status === "200") {
            let pets = this.state.pets;
            const index = pets.findIndex((i) => i.id === petId);
            let pet = [...this.state.pets].filter((i) => i.id === petId);
            let updatedVisits = pet[0].visits.filter((i) => i.id !== visitId);
            pet[0].visits = updatedVisits;
            pets[index] = pet[0];

            this.setState({ pets: pets });
        }
    }

    render() {
        const { pets, isLoading } = this.state;
        if (isLoading) {
            return <p>Loading...</p>;
        }
        const petList = pets.map((pet) => {
            const visits = pet["visits"];
            let visitTable = (
                <Table key={pet.id} className="mt-4 table-primary" hover striped>
                    <thead>
                        <tr>
                            <th>Visits</th>
                            <th><Button color="info" tag={Link} to={`/myPets/${pet.id}/visits/new`}>
                                Add Visit
                            </Button></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="table-info" >
                            <td>There are no visits for this pet.</td>
                            <td></td>
                        </tr >
                    </tbody>
                </Table >
            );

            if (visits.length > 0) {
                const tableBody = visits.map((visit) => {
                    let buttons;
                    const date = new Date(visit.date);
                    if (date > Date.now()) {
                        buttons = (
                            <ButtonGroup>
                                <Button size="sm" color="primary" tag={Link}
                                    to={`/myPets/${pet.id}/visits/${visit.id}`}>
                                    Edit
                                </Button>
                                <Button size="sm" color="danger" onClick={() => this.removeVisit(pet.id, visit.id)}>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                        );
                    } else {
                        buttons = (
                            <ButtonGroup>
                                <Button size="sm" color="primary" tag={Link}
                                    to={`/myPets/${pet.id}/visits/${visit.id}`}>
                                    Edit
                                </Button>
                            </ButtonGroup>
                        );
                    }
                    return (
                        <tr className="table-info" key={visit["id"]}>
                            <td>{visit["date"]}</td>
                            <td>{visit.description}</td>
                            <td>
                                {buttons}
                            </td>
                        </tr>)
                });
                visitTable = (
                    <Table key={pet.id} className="mt-4 table-primary" hover striped>
                        <thead>
                            <tr>
                                <th>Visits</th>
                                <th />
                                <th>
                                    <Button color="info" tag={Link} to={`/myPets/${pet.id}/visits/new`}>
                                        Add Visit
                                    </Button>
                                </th>
                            </tr>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Actions</th>

                            </tr>
                        </thead>
                        <tbody>{tableBody}</tbody>
                    </Table>);
            }

            return (
                <div key={pet.id} >
                    <Row >
                        <Col xs="5">
                            <Card className="pet-card" style={{ width: '16rem' }}>
                                <CardBody>
                                    <CardTitle tag="h5">
                                        {pet.name}
                                    </CardTitle>
                                    {/* <CardText>
                                        With supporting text below as a natural lead-in to additional content.
                                    </CardText> */}
                                    <ListGroup flush>
                                        <ListGroupItem>
                                            Date of birth: {pet.birthDate}
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            Type: {pet.type.name}
                                        </ListGroupItem>
                                    </ListGroup>
                                </CardBody>
                                <CardFooter>
                                    <ButtonGroup>
                                        <Button size="sm" color="primary" tag={Link} to={"/myPets/" + pet.id}>
                                            Edit
                                        </Button>
                                        <Button size="sm" color="danger" onClick={() => this.removePet(pet.id)}>
                                            Delete
                                        </Button>
                                    </ButtonGroup>
                                </CardFooter>
                            </Card>
                        </Col>
                        <Col xs="5">
                            {visitTable}
                        </Col>
                    </Row>
                    <br></br>
                </div>
            );
        });

        return (
            <div>
                {/* <AppNavbar /> */}
                < Container fluid >
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/myPets/new">
                            Add Pet
                        </Button>
                    </div>
                    <h3>Pets</h3>
                    {petList}
                </Container >
            </div >
        );
    }
}

export default PetOwnerList;
