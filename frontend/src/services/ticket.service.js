import { Button, ButtonGroup, Card, CardBody, CardText, CardTitle, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import deleteFromList from "../util/deleteFromList";

class TicketService {
    getTicketList([tickets, setTickets], auth, [alerts, setAlerts], setMessage, setVisible, setNewTicket, plan = null) {
        return tickets.map((t, index) => {
            const status = t.consultation.status;
            const removeOwnerVet = () => deleteFromList(`/api/v1/consultations/${t.consultation.id}/tickets/${t.id}`, t.id, [tickets, setTickets],
                [alerts, setAlerts], setMessage, setVisible, { date: t.creationDate });
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

    getTicketCloseButton(consultation, handleClose) {
        if (consultation.status !== "CLOSED") {
            return <Row>
                <Col sm="9">
                    <h2 className="text-center">Consultation Number {consultation.id}</h2>
                </Col>
                <Col sm="3">
                    <Button color="warning" onClick={handleClose} >
                        Close Consultation
                    </Button>
                </Col>
            </Row>
        } else
            return <h2 className="text-center">Consultation Number {consultation.id}</h2>


    }

}

const ticketService = new TicketService();

export default ticketService;