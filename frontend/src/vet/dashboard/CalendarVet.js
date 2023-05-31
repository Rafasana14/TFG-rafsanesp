import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Container } from 'reactstrap';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import getErrorModal from '../../util/getErrorModal';
import useFetchData from '../../util/useFetchData';
import tokenService from '../../services/token.service';
import { useNavigate } from 'react-router-dom';

require('moment/locale/es.js');

const localizer = momentLocalizer(moment);
const jwt = tokenService.getLocalAccessToken();

function CalendarVet() {

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
            return {
                visitId: Number(visit.id),
                petId: Number(visit.pet.id),
                ownerId: Number(visit.pet.owner.id),
                start: start,
                end: end,
                title: `Visit for ${visit.pet.name} of Owner ${visit.pet.owner.firstName} ${visit.pet.owner.lastName} - ${visit.pet.owner.user.username} `,
                description: visit.description,
            }
        }));
    }, [visits]);

    const modal = getErrorModal(setVisible, visible, message);

    const title = <h1 className='text-center'>Dashboard</h1>;

    const handleSelectSlot = useCallback(
        ({ start, end }) => {
            navigate(`myPets/visits/create`, { state: { datetime: start } })
        },
        [navigate]
    )

    const calendar = <div style={{ height: `${600}px` }} className="calendar-container">
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={(e) => window.location.assign(`/owners/${e.ownerId}/pets/${e.petId}/visits/${e.visitId}`)}
            onSelectSlot={handleSelectSlot}
            selectable
            views={{
                month: true,
                // work_week: true,
                // day: true,
                agenda: true,
            }}
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
export default CalendarVet;