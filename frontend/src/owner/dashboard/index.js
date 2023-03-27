import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Link } from 'react-router-dom';
import { Button, Container, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";

// import './calendar.css';
require('moment/locale/es.js');

const localizer = momentLocalizer(moment);

// const MyCalendar = (props) => (
//     <div className="myCustomHeight">
//         <Calendar
//             localizer={localizer}
//             events={myEventsList}
//             startAccessor="start"
//             endAccessor="end"
//         />
//     </div>
// )

class OwnerDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            visits: [],
            events: [],
            owner: {},
            plan: "",
            message: null,
            modalShow: false,
        };
        // this.handleDateChange = this.handleChange.bind(this);
        this.handleShow = this.handleShow.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.jwt = JSON.parse(window.localStorage.getItem("jwt"));

        // var pathArray = window.location.pathname.split('/');
        // this.petId = pathArray[2];
        // this.visitId = pathArray[4];
    }

    async componentDidMount() {
        const visits = await (await fetch(`/api/v1/visits/`, {
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                "Content-Type": "application/json",
            },
        })).json();
        if (visits.message) this.setState({ message: visits.message })
        else {
            this.setState({ visits: visits });
            const events = visits.map((visit) => {
                const start = new Date(visit.datetime);
                var end = new Date(visit.datetime);
                end.setMinutes(start.getMinutes() + 30);
                return {
                    visitId: Number(visit.id),
                    petId: Number(visit.pet.id),
                    start: start,
                    end: end,
                    title: `Visit for ${visit.pet.name} with Vet ${visit.vet.firstName} ${visit.vet.lastName}`,
                    description: visit.description,
                }
            });
            this.setState({ events: events });
        }

        const owner = await (await fetch(`/api/v1/plan`, {
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
            },
        })).json();
        if (owner.message) this.setState({ message: owner.message })
        else this.setState({ owner: owner, plan: owner.plan });
    }

    handleDateChange(date) {
        this.setState({ [date]: date });
    }

    // handleCityChange(event) {
    //     const target = event.target;
    //     const value = target.value;
    //     let city = this.state.city;
    //     city = value;
    //     this.setState({ city });

    //     let visit = { ...this.state.visit };
    //     let vets = [...this.state.vets];
    //     const plan = this.state.pet.owner.plan;
    //     if (plan === "BASIC") {
    //         vets = vets.filter((vet) => vet.city === value);
    //         let randomIndex = Math.floor(Math.random() * vets.length);
    //         visit.vet = vets[randomIndex];
    //         this.setState({ visit });
    //     }
    // }
    handleShow() {
        let modalShow = this.state.modalShow;
        this.setState({ modalShow: !modalShow });
    }

    // async handleSubmit(event) {
    //     event.preventDefault();
    //     let visit = { ...this.state.visit };
    //     const pet = { ...this.state.pet };
    //     visit["pet"] = pet;

    //     const submit = await (await fetch(`/api/v1/pets/${this.petId}/visits` + (visit.id ? '/' + visit.id : ''), {
    //         method: (visit.id) ? 'PUT' : 'POST',
    //         headers: {
    //             "Authorization": `Bearer ${this.jwt}`,
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(visit),
    //     })).json();
    //     if (submit.message) this.setState({ message: visit.message });
    //     else window.location.href = `/myPets`;
    // }

    render() {
        const { events, plan } = this.state;
        const title = <h1 className='text-center'>Dashboard</h1>;

        let calendar = <></>;
        if (plan === "GOLD" || plan === "PLATINUM") {
            calendar = <div style={{ height: `${600}px` }} className="calendar-container">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    // messages={{
                    //     next: "Siguiente",
                    //     previous: "Anterior",
                    //     today: "Hoy",
                    //     month: "Mes",
                    //     week: "Semana",
                    //     day: "Día"
                    // }}
                    views={{
                        month: true,
                        work_week: true,
                        day: true,
                        agenda: true,
                    }}
                    onSelectEvent={(e) => window.location.href = `/myPets/${e.petId}/visits/${e.visitId}`}
                />
            </div>;
        };

        let modal = <></>;
        if (this.state.message) {
            const show = this.state.modalShow;
            // const closeBtn = (
            //     <button className="close" onClick={this.handleShow} type="button">
            //         &times;
            //     </button>
            // );
            modal = <div>
                <Modal isOpen={show} toggle={this.handleShow}
                    backdrop="static" keyboard={false}>
                    {/* <ModalHeader toggle={this.handleShow} close={closeBtn}>Error!</ModalHeader> */}
                    <ModalHeader>Error!</ModalHeader>
                    <ModalBody>
                        {this.state.message || ""}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" tag={Link} to={`/`}>Back</Button>
                    </ModalFooter>
                </Modal></div>
        }

        return <div>
            <Container style={{ marginTop: "15px" }}>
                {title}
                {calendar}
            </Container>
            {modal}
        </div >


    }
}
export default OwnerDashboard;