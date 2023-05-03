import { useState } from 'react';
import { Container } from 'reactstrap';
import tokenService from '../../services/token.service';
import ticketService from '../../services/ticket.service';
import getErrorModal from '../../util/getErrorModal';
import useFetchState from '../../util/useFetchState';
import getDeleteAlertsOrModal from '../../util/getDeleteAlertsOrModal';
import getIdFromUrl from '../../util/getIdFromUrl';

const jwt = tokenService.getLocalAccessToken();

export default function TicketListAdmin() {
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
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setNewTicket({ ...newTicket, [name]: value })
    }

    async function handleSubmit(event) {
        event.preventDefault();

        await (await fetch(`/api/v1/consultations/${id}/tickets`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTicket),
        })).json()
            .then(json => {
                if (json.message) {
                    setMessage(json.message);
                    setVisible(true);
                }
                else {
                    setTickets([...tickets, json]);
                    setNewTicket(emptyTicket);
                }
            }).catch((message) => alert(message));
    }

    async function remove(ticketId, date) {
        let confirmMessage = window.confirm("Are you sure you want to delete it?");
        if (confirmMessage) {
            await fetch(`/api/v1/consultations/${id}/tickets/${ticketId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.status === 200) {
                    setTickets(tickets.filter((i) => i.id !== ticketId && i.creationDate < date));
                }
                return response.json();
            }).then(json => {
                getDeleteAlertsOrModal(json, id, alerts, setAlerts, setMessage, setVisible);
            }).catch((message) => alert(message));
        }
    }

    async function handleClose(event) {
        event.preventDefault();
        const aux = consultation;
        aux.status = "CLOSED"

        const response = await (await fetch(`/api/v1/consultations/${id}`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aux),
        })).json();
        if (response.message) {
            setMessage(response.message);
            setVisible(true);
        }
        else setConsultation({ ...consultation, status: "CLOSED" });
    }

    const modal = getErrorModal(setVisible, visible, message);

    const ticketList = ticketService.getTicketList(tickets, "ADMIN", remove);
    const ticketForm = ticketService.getTicketForm(newTicket, consultation.status, "ADMIN", handleChange, handleSubmit);
    const ticketClose = ticketService.getTicketCloseButton(consultation, handleClose)

    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {ticketClose}
                {alerts.map((a) => a.alert)}
                {modal}
                <h3>{consultation.title}</h3>
                {ticketList}
            </Container>
            {ticketForm}
        </div>
    );
}
