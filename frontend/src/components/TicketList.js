import { useState } from 'react';
import { Container } from 'reactstrap';
import tokenService from '../services/token.service';
import getIdFromUrl from '../util/getIdFromUrl';
import useFetchState from '../util/useFetchState';
import ticketService from '../services/ticket.service';
import getDeleteAlertsOrModal from '../util/getDeleteAlertsOrModal';
import useErrorModal from '../util/useErrorModal';
import useFetchPlan from '../util/useFetchPlan';

const jwt = tokenService.getLocalAccessToken();

export default function TicketList({ auth }) {
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
    const plan = useFetchPlan(auth, jwt, setMessage, setVisible);

    function handleChange(event) {
        ticketService.handleChange(event, [newTicket, setNewTicket]);
    }

    async function handleSubmit(event) {
        await ticketService.handleSubmit(event, jwt, id, [tickets, setTickets], [newTicket, setNewTicket], setMessage, setVisible);
    }

    async function handleClose(event) {
        event.preventDefault();

        if (auth === "VET" && tickets.length === 0) {
            setMessage("You can't close a consultation with no tickets.");
            setVisible(true);
        } else {
            const confirm = window.confirm("Are you sure you want to close the consultation?")
            if (confirm && auth !== "OWNER") {
                const aux = consultation;
                aux.status = "CLOSED"

                await fetch(`/api/v1/consultations/${id}`, {
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
        }
    }

    const modal = useErrorModal(setVisible, visible, message);
    const ticketList = ticketService.getTicketList(consultation.status, [tickets, setTickets], auth, [alerts, setAlerts], [setMessage, setVisible], setNewTicket, plan);
    const ticketForm = ticketService.getTicketForm(newTicket, consultation.status, auth, handleChange, handleSubmit, plan);
    const ticketHeading = ticketService.getTicketHeading(consultation, handleClose, auth);
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
