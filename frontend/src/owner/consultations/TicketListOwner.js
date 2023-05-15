import { useState } from 'react';
import { Container } from 'reactstrap';
import tokenService from '../../services/token.service';
import ticketService from '../../services/ticket.service';
import getErrorModal from '../../util/getErrorModal';
import useFetchState from '../../util/useFetchState';
import getIdFromUrl from '../../util/getIdFromUrl';
import useFetchData from '../../util/useFetchData';

const jwt = tokenService.getLocalAccessToken();

export default function TicketListOwner() {
    const emptyTicket = {
        id: null,
        description: '',
    };
    const id = getIdFromUrl(2);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const consultation = useFetchData(`/api/v1/consultations/${id}`, jwt, setMessage, setVisible);
    const [tickets, setTickets] = useFetchState([], `/api/v1/consultations/${id}/tickets`, jwt, setMessage, setVisible);
    const [newTicket, setNewTicket] = useState(emptyTicket);
    const [alerts, setAlerts] = useState([]);
    const plan = useFetchData("/api/v1/plan", jwt, setMessage, setVisible).plan;

    function handleChange(event) {
        ticketService.handleChange(event, [newTicket, setNewTicket]);
    }

    function handleSubmit(event) {
        ticketService.handleSubmit(event, jwt, id, [tickets, setTickets], [newTicket, setNewTicket], setMessage, setVisible);
    }

    const modal = getErrorModal(setVisible, visible, message);
    const ticketList = ticketService.getTicketList([tickets, setTickets], "OWNER", [alerts, setAlerts], setMessage, setVisible, setNewTicket, plan);
    const ticketForm = ticketService.getTicketForm(newTicket, consultation.status, "OWNER", handleChange, handleSubmit);
    const ticketHeading = ticketService.getTicketHeading(consultation, null, "OWNER");
    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {ticketHeading}
                {alerts.map((a) => a.alert)}
                {modal}
                <h3 className="text-center">{consultation.title}</h3>
                {ticketList}
            </Container>
            {ticketForm}
        </div>
    );
}
