import { useState } from 'react';
import { Button, Container } from 'reactstrap';
import tokenService from '../../services/token.service';
import ticketService from '../../services/ticket.service';
import getErrorModal from '../../util/getErrorModal';
import useFetchState from '../../util/useFetchState';
import getIdFromUrl from '../../util/getIdFromUrl';
import { Link } from 'react-router-dom';
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
    const consultation = useFetchData(`/api/v1/consultations/${id}`, jwt);
    const [tickets, setTickets] = useFetchState([], `/api/v1/consultations/${id}/tickets`, jwt, setMessage, setVisible);
    const [newTicket, setNewTicket] = useState(emptyTicket);
    const [alerts, setAlerts] = useState([]);
    const plan = useFetchData("/api/v1/plan", jwt).plan;

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setNewTicket({ ...newTicket, [name]: value })
    }

    function handleSubmit(event) {
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
                    setNewTicket(emptyTicket);
                }
            })
            .catch((message) => alert(message));
    }

    const modal = getErrorModal(setVisible, visible, message);
    const ticketList = ticketService.getTicketList([tickets, setTickets], "OWNER", [alerts, setAlerts], setMessage, setVisible, setNewTicket, plan);
    const ticketForm = ticketService.getTicketForm(newTicket, consultation.status, "OWNER", handleChange, handleSubmit);
    return (
        <div>
            <Container style={{ marginTop: "15px" }}>
                {alerts.map((a) => a.alert)}
                {modal}
                <h3 className="text-center">{consultation.title}</h3>
                <Button color="secondary" tag={Link} to="/consultations">Back</Button><br></br><br></br>
                {ticketList}
            </Container>
            {ticketForm}
        </div>
    );
}
