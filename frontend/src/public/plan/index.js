import React, { Component } from 'react';
import { Card, CardBody, CardText, CardTitle, Col, Container, ListGroup, ListGroupItem, Row, Table } from 'reactstrap';
import { BsCheckLg, BsXLg } from 'react-icons/bs';

class PlanList extends Component {

    render() {

        const cell = "border border-left border-dark text-center";

        const basicStyle = {
            backgroundColor: "#A5F2AA",
            width: "18%"
        };
        const goldStyle = {
            backgroundColor: "#F8EA70",
            width: "18%"
        };
        const platinumStyle = {
            backgroundColor: "#E17596",
            width: "18%"
        };

        return <div>
            {/* <AppNavbar /> */}
            <Container>
                <h1 className="text-center">Pricing Plans</h1>
                <br></br>
                <Row>
                    <Col md="4">
                        <Card className="basic-card" style={{ width: '18rem', backgroundColor: "#A5F2AA" }}>
                            <CardBody>
                                <CardTitle className="text-center" tag="h5">
                                    BASIC
                                </CardTitle>
                                <CardText className="text-center">
                                    FREE
                                </CardText>
                                <ListGroup flush>
                                    <ListGroupItem >
                                        Number of Pets: 2
                                    </ListGroupItem>
                                    <ListGroupItem >
                                        Number of Visits per Month and Pet: 1
                                    </ListGroupItem>
                                    <ListGroupItem >
                                        Support Priority: Low
                                    </ListGroupItem>
                                </ListGroup>
                            </CardBody>
                            {/* <CardFooter>
                                    <ButtonGroup>
                                        <Button size="sm" color="primary" tag={Link} to={"/myPets/" + pet.id}>
                                            Edit
                                        </Button>
                                        <Button size="sm" color="danger" onClick={() => this.removePet(pet.id)}>
                                            Delete
                                        </Button>
                                    </ButtonGroup>
                                </CardFooter> */}
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className="gold-card" style={{ width: '18rem', backgroundColor: "#F8EA70", }}>
                            <CardBody>
                                <CardTitle className="text-center" tag="h5">
                                    GOLD
                                </CardTitle>
                                <CardText className="text-center">
                                    €5
                                </CardText>
                                <ListGroup flush>
                                    <ListGroupItem>
                                        Number of Pets: 4
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Number of Visits per Month and Pet: 3
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Support Priority: Medium
                                    </ListGroupItem>
                                </ListGroup>
                                <br></br>
                                <CardText className="text-center">
                                    Extra Functions
                                </CardText>
                                <ListGroup flush>
                                    <ListGroupItem>
                                        Vet Selection for Visits
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Calendar with Upcoming Visits
                                    </ListGroupItem>
                                </ListGroup>
                            </CardBody>
                            {/* <CardFooter>
                                    <ButtonGroup>
                                        <Button size="sm" color="primary" tag={Link} to={"/myPets/" + pet.id}>
                                            Edit
                                        </Button>
                                        <Button size="sm" color="danger" onClick={() => this.removePet(pet.id)}>
                                            Delete
                                        </Button>
                                    </ButtonGroup>
                                </CardFooter> */}
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className="platinum-card" style={{ width: '18rem', backgroundColor: "#E17596", }}>
                            <CardBody>
                                <CardTitle className="text-center" tag="h5">
                                    PLATINUM
                                </CardTitle>
                                <CardText className="text-center">
                                    €12
                                </CardText>
                                <ListGroup flush>
                                    <ListGroupItem>
                                        Number of Pets: 7
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Number of Visits per Month and Pet: 6
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Support Priority: High
                                    </ListGroupItem>
                                </ListGroup>
                                <br></br>
                                <CardText className="text-center">
                                    Extra Functions
                                </CardText>
                                <ListGroup flush>
                                    <ListGroupItem>
                                        Vet Selection for Visits
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Calendar with Upcoming Visits
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Statistics Dashboard for your Pets
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Online Consultation
                                    </ListGroupItem>
                                </ListGroup>
                            </CardBody>
                            {/* <CardFooter>
                                    <ButtonGroup>
                                        <Button size="sm" color="primary" tag={Link} to={"/myPets/" + pet.id}>
                                            Edit
                                        </Button>
                                        <Button size="sm" color="danger" onClick={() => this.removePet(pet.id)}>
                                            Delete
                                        </Button>
                                    </ButtonGroup>
                                </CardFooter> */}
                        </Card>
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <Col md="3"></Col>
                    <Col md="6">
                        <Table>
                            <thead>
                                <tr>
                                    <th className="bg-white border-bottom border-dark" ></th>
                                    <th style={basicStyle} className={cell}>BASIC</th>
                                    <th style={goldStyle} className={cell}>GOLD</th>
                                    <th style={platinumStyle} className={cell}>PLATINUM</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border border-dark">
                                    <td className="table-info border border-dark">Max Number of Pets</td>
                                    <td style={basicStyle} className={cell}>2</td>
                                    <td style={goldStyle} className={cell}>4</td>
                                    <td style={platinumStyle} className={cell}>7</td>
                                </tr>
                                <tr className="border border-dark">
                                    <td className="table-info border border-dark">Number of Visits per Month and Pet</td>
                                    <td style={basicStyle} className={cell}>1</td>
                                    <td style={goldStyle} className={cell}>3</td>
                                    <td style={platinumStyle} className={cell}>6</td>
                                </tr>
                                <tr className="border border-dark">
                                    <td className="table-info border border-dark">Vet Selection for Visits</td>
                                    <td style={basicStyle} className={cell}><BsXLg /></td>
                                    <td style={goldStyle} className={cell}><BsCheckLg /></td>
                                    <td style={platinumStyle} className={cell}><BsCheckLg /></td>
                                </tr>
                                <tr className="border border-dark">
                                    <td className="table-info border border-dark">Calendar with Upcoming Visits</td>
                                    <td style={basicStyle} className={cell}><BsXLg /></td>
                                    <td style={goldStyle} className={cell}><BsCheckLg /></td>
                                    <td style={platinumStyle} className={cell}><BsCheckLg /></td>
                                </tr>
                                <tr className="border border-dark">
                                    <td className="table-info border border-dark">Statistics Dashboard for your Pets</td>
                                    <td style={basicStyle} className={cell}><BsXLg /></td>
                                    <td style={goldStyle} className={cell}><BsXLg /></td>
                                    <td style={platinumStyle} className={cell}><BsCheckLg /></td>
                                </tr>
                                <tr className="border border-dark">
                                    <td className="table-info border border-dark">Online Consultation</td>
                                    <td style={basicStyle} className={cell}><BsXLg /></td>
                                    <td style={goldStyle} className={cell}><BsXLg /></td>
                                    <td style={platinumStyle} className={cell}><BsCheckLg /></td>
                                </tr>
                                <tr className="border border-dark">
                                    <td className="table-info border border-dark">Support Priority</td>
                                    <td style={basicStyle} className={cell}>Low</td>
                                    <td style={goldStyle} className={cell}>Medium</td>
                                    <td style={platinumStyle} className={cell}>High</td>
                                </tr>
                                <tr className="border border-dark">
                                    <td className="table-info border border-dark">Prize</td>
                                    <td style={basicStyle} className={cell}>FREE</td>
                                    <td style={goldStyle} className={cell}>€5</td>
                                    <td style={platinumStyle} className={cell}>€12</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col md="3"></Col>
                </Row>
            </Container>
        </div >
    }
}
export default PlanList;