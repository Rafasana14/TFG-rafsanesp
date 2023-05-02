import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card, CardBody, CardText, CardTitle, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";

class TicketService {
    getTicketList(tickets, auth, remove, plan = null, status = null) {
        return tickets.map((t, index) => {
            let buttons;
            const length = tickets.length;
            if (auth === "OWNER") {
                buttons = index === length - 1 && plan === "PLATINUM" && t.user.authority.authority === "OWNER" && status !== "CLOSED" ?
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link}
                            to={`consultations/${t.consultation.id}/tickets/${t.id}`}>
                            Edit
                        </Button>
                        <Button size="sm" color="danger" onClick={() => remove(t.id)}>
                            Delete
                        </Button>
                    </ButtonGroup> :
                    <></>;
            } else if (auth === "VET") {
                buttons = index === length - 1 && t.user.authority.authority === "VET" && status !== "CLOSED" ?
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link}
                            to={`consultations/${t.consultation.id}/tickets/${t.id}`}>
                            Edit
                        </Button>
                        <Button size="sm" color="danger" onClick={() => remove(t.id)}>
                            Delete
                        </Button>
                    </ButtonGroup> :
                    <></>;
            } else {
                buttons = <ButtonGroup>
                    <Button size="sm" color="primary" tag={Link}
                        to={`consultations/${t.consultation.id}/tickets/${t.id}`}>
                        Edit
                    </Button>
                    <Button size="sm" color="danger" onClick={() => remove(t.id, t.creationDate)}>
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

    getTicketForm(newTicket, status, auth, handleChange, handleSubmit) {
        if (auth === "ADMIN" || status !== "CLOSED")
            return (
                <Container>
                    <h4>Add New Ticket</h4>
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