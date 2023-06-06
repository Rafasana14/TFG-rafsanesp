import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Container } from 'reactstrap';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from 'react-router-dom';
import tokenService from '../services/token.service';
import useFetchData from '../util/useFetchData';
import useErrorModal from '../util/useErrorModal';

require('moment/locale/es.js');

const localizer = momentLocalizer(moment);
const jwt = tokenService.getLocalAccessToken();

function CalendarAuth({ auth }) {

    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const visits = useFetchData(`/api/v1/visits`, jwt, setMessage, setVisible);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setEvents(visits.map((visit) => {
            const start = new Date(visit.datetime);
            let end = new Date(visit.datetime);
            end.setMinutes(start.getMinutes() + 30);
            const title = auth === "OWNER" ? `Visit for ${visit.pet.name} with Vet ${visit.vet.firstName} ${visit.vet.lastName}`
                : `Visit for ${visit.pet.name} of Owner ${visit.pet.owner.firstName} ${visit.pet.owner.lastName} - ${visit.pet.owner.user.username} `;
            return {
                visitId: Number(visit.id),
                petId: Number(visit.pet.id),
                start: start,
                end: end,
                title: title,
                description: visit.description,
            }
        }));
    }, [visits, auth]);

    const modal = useErrorModal(setVisible, visible, message);

    const title = <h3 className='text-center'>Visits Calendar</h3>;

    const handleSelectSlot = useCallback(
        ({ start }) => {
            const date = new Date(start).setHours(9, 0)
            navigate(`/visits/new`, { state: { datetime: date } });
        },
        [navigate]
    )

    const calendar = <div style={{ height: `${600}px` }} className="calendar-container">
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={(e) => window.location.assign(`/pets/${e.petId}/visits/${e.visitId}`)}
            onSelectSlot={handleSelectSlot}
            selectable
            views={{
                month: true,
                agenda: true,
            }}
            popup
        />
    </div>;

    return <div>
        <Container style={{ marginTop: "15px" }}>
            {title}
            {calendar}
        </Container>
        {modal}
    </div >
}
export default CalendarAuth;