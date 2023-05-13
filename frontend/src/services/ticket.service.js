import { Button, ButtonGroup, Card, CardBody, CardText, CardTitle, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import deleteFromList from "../util/deleteFromList";
import { Link } from "react-router-dom";

class TicketService {
    getTicketList([tickets, setTickets], auth, [alerts, setAlerts], setMessage, setVisible, setNewTicket, plan = null) {
        return tickets.map((t, index) => {
            const status = t.consultation.status;
            const removeOwnerVet = () => deleteFromList(`/api/v1/consultations/${t.consultation.id}/tickets/${t.id}`, t.id, [tickets, setTickets],
                [alerts, setAlerts], setMessage, setVisible);
            const removeAdmin = () => deleteFromList(`/api/v1/consultations/${t.consultation.id}/tickets/${t.id}`, t.id, [tickets, setTickets],
                [alerts, setAlerts], setMessage, setVisible, { date: t.creationDate });
            const length = tickets.length;
            const handleEdit = () => setNewTicket(t);
            let buttons;
            if (auth === "OWNER") {
                buttons = index === length - 1 && plan === "PLATINUM" && t.user.authority.authority === "OWNER" && status !== "CLOSED" ?
                    <ButtonGroup>
                        <Button aria-label={"edit-" + t.id} size="sm" color="primary" onClick={handleEdit}>
                            Edit
                        </Button>
                        <Button aria-label={"delete-" + t.id} size="sm" color="danger" onClick={removeOwnerVet}>
                            Delete
                        </Button>
                    </ButtonGroup> :
                    <></>;
            } else if (auth === "VET") {
                buttons = index === length - 1 && t.user.authority.authority === "VET" && status !== "CLOSED" ?
                    <ButtonGroup>
                        <Button aria-label={"edit-" + t.id} size="sm" color="primary" onClick={handleEdit}>
                            Edit
                        </Button>
                        <Button aria-label={"delete-" + t.id} size="sm" color="danger" onClick={removeOwnerVet}>
                            Delete
                        </Button>
                    </ButtonGroup> :
                    <></>;
            } else {
                buttons = <ButtonGroup>
                    <Button aria-label={"edit-" + t.id} size="sm" color="primary" onClick={handleEdit}>
                        Edit
                    </Button>
                    <Button aria-label={"delete-" + t.id} size="sm" color="danger" onClick={removeAdmin}>
                        Delete
                    </Button>
                </ButtonGroup>;
            }

            const alignment = t.user?.authority?.authority === "OWNER" ?
                "me-auto" :
                "ms-auto";
            const style = t.user?.authority?.authority === "OWNER" ?
                { maxWidth: "80%", backgroundColor: "#88FFFF" } :
                { maxWidth: "80%", backgroundColor: "#A6FF7D", alignSelf: "end" };

            return (
                <div key={t.id}>
                    <Card mb="3" aria-label={"ticket-" + t.id} className={alignment} style={style}>
                        <Row className="no-gutters">
                            <Col md="8">
                                <CardBody>
                                    <CardTitle tag="h5">
                                        {t.user.username} -&gt; {t.description}
                                    </CardTitle>
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

    getTicketForm(newTicket, status, auth, handleChange, handleSubmit) {
        if (auth === "ADMIN" || status !== "CLOSED")
            return (
                <Container>
                    {newTicket.id ? <h4>Edit Ticket</h4> : <h4>Add New Ticket</h4>}
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input type="textarea" required name="description" id="description" value={newTicket.description || ''}
                                onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Button color="primary" type="submit">Save</Button>
                        </FormGroup>
                    </Form>
                </Container>
            );
        else return <></>;
    }

    getTicketHeading(consultation, handleClose, auth = "ADMIN") {
        if (auth === "ADMIN" && consultation.status !== "CLOSED") {
            return <Row>
                <Col sm="3">
                    <Button color="secondary" tag={Link} to="/consultations">Back</Button>
                </Col>
                <Col sm="6">
                    <h2 className="text-center">Consultation Number {consultation.id}</h2>
                </Col>
                <Col sm="3">
                    <Button color="warning" onClick={handleClose} >
                        Close Consultation
                    </Button>
                </Col>
            </Row>
        } else {
            return <Row>
                <Col sm="3">
                    <Button color="secondary" tag={Link} to="/consultations">Back</Button>
                </Col>
                <Col sm="6">
                    <h2 className="text-center">Consultation Number {consultation.id}</h2>
                </Col>
                <Col sm="3"></Col>
            </Row>
        }



    }

    handleChange(event, [newTicket, setNewTicket]) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setNewTicket({ ...newTicket, [name]: value })
    }

    handleSubmit(event, jwt, id, [tickets, setTickets], [newTicket, setNewTicket], setMessage, setVisible) {
        event.preventDefault();

        fetch(`/api/v1/consultations/${id}/tickets` + (newTicket.id ? '/' + newTicket.id : ''), {
            method: (newTicket.id) ? 'PUT' : 'POST',
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTicket),
        })
            .then(response => response.json())
            .then(json => {
                if (json.message) {
                    setMessage(json.message);
                    setVisible(true);
                }
                else {
                    if (!newTicket.id) setTickets([...tickets, json]);
                    else {
                        const ticket = tickets.find(t => t.id === newTicket.id);
                        const index = tickets.indexOf(ticket);
                        const nextTickets = tickets.map((t, i) => {
                            if (i === index) return newTicket;
                            else return t;
                        });
                        setTickets(nextTickets);
                    }
                    setNewTicket({
                        id: null,
                        description: '',
                    });
                }
            })
            .catch((message) => alert(message));
    }

}

const ticketService = new TicketService();

export default ticketService;