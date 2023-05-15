import React, { Component } from "react";
import {
    Button, ButtonGroup, Card, CardBody, CardFooter,
    CardTitle, Col, Container, ListGroup, ListGroupItem,
    Modal, ModalBody, ModalFooter, ModalHeader, Row, Table
} from "reactstrap";
import { Link } from "react-router-dom";
import tokenService from "../../../services/token.service";

class OwnerPetList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pets: [],
            message: null,
            modalShow: false,
        };
        this.removePet = this.removePet.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.removeVisit = this.removeVisit.bind(this);
        this.jwt = tokenService.getLocalAccessToken();
        this.user = tokenService.getUser();
    }

    async componentDidMount() {
        let pets = await (await fetch(`/api/v1/pets?userId=${this.user.id}`, {
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                "Content-Type": "application/json",
            },
        })).json();
        if (pets.message) this.setState({ message: pets.message })
        else {
            for (let pet of pets) {
                let index = pets.findIndex((obj => obj.id === pet.id));
                const visits = await (await fetch(`/api/v1/pets/${pet.id}/visits`, {
                    headers: {
                        "Authorization": `Bearer ${this.jwt}`,
                        "Content-Type": "application/json",
                    },
                })).json()
                if (visits.message) this.setState({ message: visits.message })
                else pets[index]["visits"] = visits;
            }
            this.setState({ pets: pets });
        }
    }

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
        }).then(data => {
            this.setState({
                message: data.message,
                modalShow: true
            });
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
            if (response.status === 200) status = "200";
            return response.json();
        }).then(data => {
            this.setState({
                message: data.message,
                modalShow: true
            });
        });

        if (status === "200") {
            let pets = this.state.pets;
            const index = pets.findIndex((i) => i.id === petId);
            let pet = [...this.state.pets].find((i) => i.id === petId);
            let updatedVisits = pet.visits.filter((i) => i.id !== visitId);
            if (updatedVisits.length > 0) pet.visits = updatedVisits;
            else pet[0].visits = [];
            pets[index] = pet[0];

            this.setState({ pets: pets });
        }
    }

    handleShow() {
        let modalShow = this.state.modalShow;
        this.setState({ modalShow: !modalShow })
    }

    render() {
        const { pets, isLoading } = this.state;
        if (isLoading) {
            return <p>Loading...</p>;
        }

        let modal = <></>;
        if (this.state.message) {
            const show = this.state.modalShow;
            const closeBtn = (
                <button className="close" onClick={this.handleShow} type="button">
                    &times;
                </button>
            );
            modal = <div>
                <Modal isOpen={show} toggle={this.handleShow}
                    keyboard={false}>
                    <ModalHeader toggle={this.handleShow} close={closeBtn}>Alert!</ModalHeader>
                    <ModalBody>
                        {this.state.message || ""}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleShow}>Close</Button>
                    </ModalFooter>
                </Modal></div>
        }
        const petList = pets.map((pet) => {
            const visits = pet["visits"];
            let visitTable = (
                <Table key={pet.id} className="mt-3 table-primary" hover striped>
                    <thead>
                        <tr>
                            <th>Visits</th>
                            {/* <th /><th /> */}
                            <th><Button color="info" tag={Link} to={`/myPets/${pet.id}/visits/new`}>
                                Add Visit
                            </Button></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="table-info" >
                            <td>There are no visits for this pet.</td>
                            {/* <td></td> */}
                            {/* <td></td> */}
                            <td></td>
                        </tr >
                    </tbody>
                </Table >
            );

            if (visits.length > 0) {
                const tableBody = visits.map((visit) => {
                    let buttons;
                    const datetime = new Date(visit.datetime);
                    if (datetime > Date.now()) {
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
                            {/* <td>{`${datetime.getFullYear()}/${datetime.getMonth()}/${datetime.getDate()} ${datetime.getHours()}:${datetime.getMinutes()}`}</td> */}
                            <td>{datetime.toLocaleString()}</td>
                            <td></td>
                            {/* <td>{visit.description}</td> */}
                            <td>{visit.vet.firstName} {visit.vet.lastName}</td>
                            <td>
                                {buttons}
                            </td>
                        </tr>)
                });
                visitTable = (
                    <Table key={pet.id} className="mt-3 table-primary" hover striped>
                        <thead>
                            <tr>
                                <th>Visits</th>
                                <th /><th />
                                <th>
                                    <Button color="info" tag={Link} to={`/myPets/${pet.id}/visits/new`}>
                                        Add Visit
                                    </Button>
                                </th>
                            </tr>
                            <tr>
                                <th>Date and Time</th>
                                <th></th>
                                {/* <th>Description</th> */}
                                <th>Vet</th>
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
                        <Col xs="4">
                            {visitTable}
                        </Col>
                    </Row>
                    <div className="mb-4">
                        <hr className="solid" />
                    </div>
                </div>
            );
        });

        return (
            <div>
                {/* <AppNavbar /> */}
                < Container fluid style={{ marginTop: "20px" }}>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/myPets/new">
                            Add Pet
                        </Button>
                    </div>
                    <h3>Pets</h3>
                    {petList}
                    {modal}
                </Container >
            </div >
        );
    }
}

export default OwnerPetList;
