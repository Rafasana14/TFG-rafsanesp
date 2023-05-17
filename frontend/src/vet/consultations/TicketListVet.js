import { useState } from 'react';
import { Container } from 'reactstrap';
import tokenService from '../../services/token.service';
import ticketService from '../../services/ticket.service';
import getErrorModal from '../../util/getErrorModal';
import useFetchState from '../../util/useFetchState';
import getIdFromUrl from '../../util/getIdFromUrl';
import getDeleteAlertsOrModal from '../../util/getDeleteAlertsOrModal';

const jwt = tokenService.getLocalAccessToken();

export default function TicketListVet() {
    const emptyTicket = {
        id: null,
        description: '',
    };
    const id = getIdFromUrl(2);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [consultation, setConsultation] = useFetchState({}, `/api/v1/consultations/${id}`, jwt, setMessage, setVisible, id);
    const [tickets, setTickets] = useFetchState([], `/api/v1/consultations/${id}/tickets`, jwt, setMessage, setVisible);
    const [newTicket, setNewTicket] = useState(emptyTicket);
    const [alerts, setAlerts] = useState([]);

    function handleChange(event) {
        ticketService.handleChange(event, [newTicket, setNewTicket]);
    }

    function handleSubmit(event) {
        ticketService.handleSubmit(event, jwt, id, [tickets, setTickets], [newTicket, setNewTicket], setMessage, setVisible);
    }

    function handleClose(event) {
        event.preventDefault();
        const aux = consultation;
        aux.status = "CLOSED"

        fetch(`/api/v1/consultations/${id}`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aux),
        })
            .then(response => response.json())
            .then(json => {
                if (json.message) {
                    setMessage(json.message);
                    setVisible(true);
                }
                else {
                    setConsultation({ ...consultation, status: "CLOSED" });
                    getDeleteAlertsOrModal({ message: "Consultation closed!" }, id, alerts, setAlerts, setMessage, setVisible)
                }
            }).catch((message) => alert(message));
    }

    const modal = getErrorModal(setVisible, visible, message);
    const ticketList = ticketService.getTicketList([tickets, setTickets], "VET", [alerts, setAlerts], setMessage, setVisible, setNewTicket);
    const ticketForm = ticketService.getTicketForm(newTicket, consultation.status, "VET", handleChange, handleSubmit);
    const ticketHeading = ticketService.getTicketHeading(consultation, handleClose, "VET");
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
