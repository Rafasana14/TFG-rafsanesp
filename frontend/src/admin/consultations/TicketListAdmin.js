import { useState, useEffect } from 'react';
import { Alert, Container } from 'reactstrap';
import tokenService from '../../services/token.service';
import ticketService from '../../services/ticket.service';
import getErrorModal from '../../util/getErrorModal';

const jwt = tokenService.getLocalAccessToken();

export default function TicketListAdmin() {
    const emptyTicket = {
        id: null,
        description: '',
    };
    const pathArray = window.location.pathname.split('/');
    const id = pathArray[2];
    const [consultation, setConsultation] = useState({});
    const [tickets, setTickets] = useState([]);
    const [newTicket, setNewTicket] = useState(emptyTicket);
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        let ignore = false;
        fetch(`/api/v1/consultations/${id}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
            },
        })
            .then(response => response.json())
            .then(json => {
                if (!ignore) {
                    if (json.message) {
                        setMessage(json.message);
                        setVisible(true);
                    }
                    else setConsultation(json);
                }
            });
        return () => {
            ignore = true;
        };
    }, [id]);

    useEffect(() => {
        let ignore = false;
        fetch(`/api/v1/consultations/${id}/tickets`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
            },
        })
            .then(response => response.json())
            .then(json => {
                if (!ignore) {
                    if (json.message) {
                        setMessage(json.message);
                        setVisible(true);
                    }
                    else setTickets(json);
                }
            });
        return () => {
            ignore = true;
        };
    }, [id]);

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setNewTicket({ ...newTicket, [name]: value })
    }

    async function handleSubmit(event) {
        event.preventDefault();

        fetch(`/api/v1/consultations/${id}/tickets`, {
            method: 'POST',
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
                    setTickets([...tickets, json]);
                    setNewTicket(emptyTicket);
                }
            });
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
                const alertId = `alert-${id}`
                setAlerts([
                    ...alerts,
                    {
                        alert: <Alert toggle={() => dismiss(alertId)} key={"alert-" + id} id={alertId} color="info">
                            {json.message}
                        </Alert>,
                        id: alertId
                    }
                ]);
            });
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

    function dismiss(id) {
        setAlerts(alerts.filter(i => i.id !== id))
    }

    function handleVisible() {
        setVisible(!visible);
    }

    const modal = getErrorModal({ handleVisible }, visible, message);

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
