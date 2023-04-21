import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Card, CardBody, CardText, CardTitle, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';

class OwnerConsultationTickets extends Component {

    emptyConsultation = {
        id: null,
        title: '',
        status: null,
    };

    emptyTicket = {
        id: null,
        description: '',
    };

    constructor(props) {
        super(props);
        this.state = {
            consultation: this.emptyConsultation,
            tickets: [],
            newTicket: this.emptyTicket,
            plan: "",
            message: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.jwt = JSON.parse(window.localStorage.getItem("jwt"));
        let pathArray = window.location.pathname.split('/');
        this.id = pathArray[2];
    }

    async componentDidMount() {
        const consultation = await (await fetch(`/api/v1/consultations/${this.id}`, {
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
            },
        })).json();
        if (consultation.message) this.setState({ message: consultation.message });
        else this.setState({ consultation: consultation });
        if (!this.state.message) {
            const tickets = await (await fetch(`/api/v1/consultations/${this.id}/tickets`, {
                headers: {
                    "Authorization": `Bearer ${this.jwt}`,
                },
            })).json();
            if (tickets.message) this.setState({ message: tickets.message });
            else this.setState({ tickets: tickets });
        }
        if (!this.state.message) {
            const owner = await (await fetch(`/api/v1/plan`, {
                headers: {
                    "Authorization": `Bearer ${this.jwt}`,
                },
            })).json();
            if (owner.message) this.setState({ message: owner.message })
            else this.setState({ plan: owner.plan });
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let newTicket = { ...this.state.newTicket };
        newTicket[name] = value;
        this.setState({ newTicket });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { newTicket } = this.state;

        const response = await (await fetch(`/api/v1/consultations/${this.id}/tickets`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTicket),
        })).json();
        if (response.message) this.setState({ message: response.message })
        else this.setState({ tickets: [...this.state.tickets, response], newTicket: "" })
    }

    async remove(ticketId) {
        await fetch(`/api/v1/consultations/${this.id}/tickets/${ticketId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).then((response) => {
            if (response.status === 200) {
                let updatedTickets = [...this.state.tickets].filter((i) => i.id !== ticketId);
                this.setState({ tickets: updatedTickets });
            }
            return response.json();
        }).then(function (data) {
            alert(data.message);
        });
    }

    getTicketList(tickets, plan) {
        const length = tickets.length;
        return tickets.map((t, index) => {
            const buttons = index === length - 1 && plan === "PLATINUM" && t.user.authority.authority === "OWNER" ?
                <ButtonGroup>
                    <Button size="sm" color="primary" tag={Link}
                        to={`consultations/${t.consultation.id}/tickets/${t.id}`}>
                        Edit
                    </Button>
                    <Button size="sm" color="danger" onClick={() => this.remove(t.id)}>
                        Delete
                    </Button>
                </ButtonGroup> :
                <></>;

            const alignment = t.user?.authority?.authority === "OWNER" ?
                "me-auto" :
                "ms-auto";
            const style = t.user?.authority?.authority === "OWNER" ?
                { maxWidth: "80%", backgroundColor: "#88FFFF" } :
                { maxWidth: "80%", backgroundColor: "#A6FF7D", alignSelf: "end" };

            return (
                <div key={t.id}>
                    <Card mb="3" className={alignment} style={style}>
                        <Row className="no-gutters">
                            <Col md="8">
                                <CardBody>
                                    <CardTitle>{t.user.username}-&gt; {t.description}</CardTitle>
                                    <CardText>{t.description}</CardText>
                                    <CardText><small className="text-muted">{new Date(t.creationDate).toLocaleString()}</small></CardText>
                                    {buttons}
                                </CardBody>
                            </Col>
                        </Row>
                    </Card>
                    <br></br>
                </div>
            );
        })
    }

    getTicketInput(newTicket, status, plan) {
        if (status !== "CLOSED" && plan === "PLATINUM")
            return <Container>
                <Form onSubmit={this.handleSubmit}>
                    <h4>Add New Ticket</h4>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="textarea" required name="description" id="description" value={newTicket.description || ''}
                            onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                    </FormGroup>
                </Form>
            </Container>;
        else return <></>;
    }

    render() {
        const { consultation, tickets, newTicket, plan } = this.state;
        const title = <h2 className="text-center">Consultation Number {consultation.id} - Pet {consultation.pet?.name}</h2>;

        if (this.state.message) return <h2 className="text-center">{this.state.message}</h2>

        const ticketList = this.getTicketList(tickets, plan);

        const ticketInput = this.getTicketInput(newTicket, consultation.status, plan);

        return <div>
            {/* <AppNavbar /> */}
            <Container style={{ marginTop: "15px" }}>
                {title}
                <h3>{consultation.title}</h3>
                {ticketList}
            </Container>
            {ticketInput}
        </div>
    }
}
export default OwnerConsultationTickets;